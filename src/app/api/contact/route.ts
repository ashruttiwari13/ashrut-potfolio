import { NextRequest, NextResponse } from 'next/server';
import { contactSchema } from '@/lib/validation';
import { sendContactNotification } from '@/lib/email';
import { createAdminClient } from '@/lib/supabase/admin';

// Simple in-memory rate limiter to prevent spam submissions
const ipTracker = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = ipTracker.get(ip);
  if (!record || now > record.resetAt) {
    ipTracker.set(ip, { count: 1, resetAt: now + 60 * 1000 }); // 1 minute window
    return false;
  }
  if (record.count >= 5) {
    return true; // Max 5 submissions per minute per IP
  }
  record.count += 1;
  return false;
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1';
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a minute before submitting another message.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parseResult = contactSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          issues: parseResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const validData = parseResult.data;

    // 1. Try to record in Supabase database if configured
    const adminSupabase = createAdminClient();
    let dbSaved = false;

    if (adminSupabase) {
      try {
        const { error: dbError } = await adminSupabase.from('contact_inquiries').insert({
          name: validData.name,
          email: validData.email,
          project_type: validData.project_type,
          budget_range: validData.budget_range || null,
          timeline: validData.timeline || null,
          message: validData.message,
          ip_hash: ip.slice(0, 8), // anonymized
        });

        if (dbError) {
          console.error('[Contact API] Failed to save to Supabase:', dbError);
        } else {
          dbSaved = true;
        }
      } catch (err) {
        console.error('[Contact API] Supabase insert exception:', err);
      }
    }

    // 2. Dispatch email notification via Resend
    const emailResult = await sendContactNotification(validData);

    return NextResponse.json({
      success: true,
      message: 'Thank you! Your message has been received.',
      dbSaved,
      emailDelivered: emailResult.delivered,
      providerNote: emailResult.delivered 
        ? 'Direct email notification dispatched to Ashrut.' 
        : 'Saved securely to inquiries log.',
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    console.error('[Contact API] Unexpected error:', message);
    return NextResponse.json(
      { error: 'Something went wrong while processing your inquiry. Please try again.' },
      { status: 500 }
    );
  }
}

import { Resend } from 'resend';
import { ContactFormData } from './validation';

const resendApiKey = process.env.RESEND_API_KEY;
const fromEmail = process.env.CONTACT_FROM_EMAIL || 'onboarding@resend.dev';
const toEmail = process.env.CONTACT_TO_EMAIL || 'ashrut.tiwari.work@gmail.com';

export const isResendConfigured = Boolean(
  resendApiKey &&
  !resendApiKey.includes('your_api_key')
);

export async function sendContactNotification(data: ContactFormData) {
  if (!isResendConfigured) {
    console.info('[Email Service] RESEND_API_KEY is not set. Inquiry saved to database/local log:', {
      from: `${data.name} <${data.email}>`,
      projectType: data.project_type,
      budget: data.budget_range || 'Not specified',
      timeline: data.timeline || 'Not specified',
      preview: data.message.slice(0, 80) + '...',
    });
    return {
      success: true,
      delivered: false,
      reason: 'EMAIL_PROVIDER_NOT_CONFIGURED',
      message: 'Inquiry received and logged securely. Direct email notification skipped pending RESEND_API_KEY configuration.',
    };
  }

  try {
    const resend = new Resend(resendApiKey);

    const result = await resend.emails.send({
      from: `Portfolio Inquiry <${fromEmail}>`,
      to: [toEmail],
      replyTo: data.email,
      subject: `✨ New Freelance Inquiry: ${data.project_type} from ${data.name}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 2px solid #3d3d3d; border-radius: 16px; background-color: #fef9e7; color: #3d3d3d;">
          <h2 style="margin-top: 0; color: #3d3d3d; border-bottom: 2px dashed #ffb6c1; padding-bottom: 12px;">
            👾 New Inquiry for Ashrut Tiwari
          </h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; width: 140px;">Client Name:</td>
              <td style="padding: 8px 0;">${escapeHtml(data.name)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Client Email:</td>
              <td style="padding: 8px 0;"><a href="mailto:${escapeHtml(data.email)}" style="color: #6b5e4a; font-weight: bold;">${escapeHtml(data.email)}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Project Category:</td>
              <td style="padding: 8px 0;"><span style="background: #c0f0dd; padding: 4px 10px; border-radius: 12px; font-weight: 600; border: 1px solid #3d3d3d;">${escapeHtml(data.project_type)}</span></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Budget Range:</td>
              <td style="padding: 8px 0;">${escapeHtml(data.budget_range || 'Not specified')}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Timeline:</td>
              <td style="padding: 8px 0;">${escapeHtml(data.timeline || 'Flexible')}</td>
            </tr>
          </table>

          <div style="background: #ffffff; padding: 16px; border: 2px solid #3d3d3d; border-radius: 12px; margin-top: 16px; box-shadow: 3px 3px 0 #3d3d3d;">
            <p style="font-weight: bold; margin-top: 0; margin-bottom: 8px; color: #6b5e4a;">Project Description:</p>
            <p style="white-space: pre-wrap; margin: 0; line-height: 1.6;">${escapeHtml(data.message)}</p>
          </div>

          <p style="margin-top: 24px; font-size: 12px; color: #888; text-align: center;">
            Sent from Ashrut Tiwari's Retro Desktop Portfolio Contact Form.
          </p>
        </div>
      `,
    });

    if (result.error) {
      console.error('[Email Service] Resend API error:', result.error);
      return {
        success: true,
        delivered: false,
        reason: 'RESEND_API_ERROR',
        message: result.error.message,
      };
    }

    return {
      success: true,
      delivered: true,
      id: result.data?.id,
      message: 'Email delivered successfully to portfolio owner.',
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error during email dispatch';
    console.error('[Email Service] Unexpected error:', errorMsg);
    return {
      success: true,
      delivered: false,
      reason: 'UNEXPECTED_EMAIL_ERROR',
      message: errorMsg,
    };
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

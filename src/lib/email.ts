import { Resend } from 'resend';
import { ContactFormData } from './validation';

const resendApiKey = process.env.RESEND_API_KEY;
const fromEmail = process.env.CONTACT_FROM_EMAIL || 'onboarding@resend.dev';
export const toEmail = process.env.CONTACT_TO_EMAIL || 'ashrut.tiwari2004@gmail.com';

export const isResendConfigured = Boolean(
  resendApiKey &&
  !resendApiKey.includes('your_api_key')
);

export async function sendContactNotification(data: ContactFormData) {
  if (!isResendConfigured) {
    console.info('[Email Service] RESEND_API_KEY is not set. Inquiry saved to database/local log:', {
      from: `${data.name} <${data.email}>`,
      company: data.company || 'Not specified',
      contactHandle: data.contact_handle || 'Not specified',
      projectType: data.project_type,
      targetPlatform: data.target_platform || 'Not specified',
      budget: data.budget_range || 'Not specified',
      timeline: data.timeline || 'Not specified',
      attachment: data.attachment ? `${data.attachment.fileName} (${(data.attachment.fileSize / 1024).toFixed(1)} KB)` : 'None',
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

    const attachments = data.attachment?.base64
      ? [
          {
            filename: data.attachment.fileName || 'project_brief.pdf',
            content: Buffer.from(
              data.attachment.base64.includes(',')
                ? data.attachment.base64.split(',')[1]
                : data.attachment.base64,
              'base64'
            ),
          },
        ]
      : [];

    const result = await resend.emails.send({
      from: `Portfolio Inquiry <${fromEmail}>`,
      to: [toEmail],
      replyTo: data.email,
      subject: `✨ New Freelance Inquiry: ${data.project_type} from ${data.name}${data.company ? ` (${data.company})` : ''}`,
      attachments,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 650px; margin: 0 auto; padding: 28px; border: 2px solid #3d3d3d; border-radius: 16px; background-color: #fef9e7; color: #3d3d3d; box-shadow: 4px 4px 0 #3d3d3d;">
          <div style="border-bottom: 2px dashed #ffb6c1; padding-bottom: 14px; margin-bottom: 20px;">
            <span style="font-size: 11px; font-weight: 800; background: #c0f0dd; color: #22543d; padding: 4px 10px; border-radius: 999px; text-transform: uppercase; letter-spacing: 0.5px; border: 1px solid #3d3d3d;">
              💼 New Freelance Commission Brief
            </span>
            <h2 style="margin: 12px 0 4px 0; color: #3d3d3d; font-size: 22px;">
              Inquiry for Ashrut Tiwari
            </h2>
            <p style="margin: 0; font-size: 13px; color: #6b5e4a;">
              Target Destination: <strong>${toEmail}</strong>
            </p>
          </div>

          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; width: 170px; color: #6b5e4a;">Client Name:</td>
              <td style="padding: 8px 0; font-weight: 600;">${escapeHtml(data.name)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #6b5e4a;">Client Email:</td>
              <td style="padding: 8px 0;">
                <a href="mailto:${escapeHtml(data.email)}" style="color: #d84b7d; font-weight: bold; text-decoration: underline;">
                  ${escapeHtml(data.email)}
                </a>
              </td>
            </tr>
            ${data.company ? `
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #6b5e4a;">Studio / Company:</td>
              <td style="padding: 8px 0;">${escapeHtml(data.company)}</td>
            </tr>
            ` : ''}
            ${data.contact_handle ? `
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #6b5e4a;">Direct Chat / Discord:</td>
              <td style="padding: 8px 0;"><code style="background: #e2d1ff; padding: 2px 6px; border-radius: 6px; border: 1px solid #3d3d3d;">${escapeHtml(data.contact_handle)}</code></td>
            </tr>
            ` : ''}
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #6b5e4a;">Project Category:</td>
              <td style="padding: 8px 0;">
                <span style="background: #ffd966; padding: 4px 10px; border-radius: 12px; font-weight: 700; border: 1px solid #3d3d3d;">
                  ${escapeHtml(data.project_type)}
                </span>
              </td>
            </tr>
            ${data.target_platform ? `
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #6b5e4a;">Engine / Platform:</td>
              <td style="padding: 8px 0;"><span style="background: #a0d4ff; padding: 3px 8px; border-radius: 8px; font-weight: 600; border: 1px solid #3d3d3d;">${escapeHtml(data.target_platform)}</span></td>
            </tr>
            ` : ''}
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #6b5e4a;">Budget Range:</td>
              <td style="padding: 8px 0;">${escapeHtml(data.budget_range || 'Flexible / To Discuss')}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #6b5e4a;">Target Timeline:</td>
              <td style="padding: 8px 0;">${escapeHtml(data.timeline || 'Flexible')}</td>
            </tr>
            ${data.attachment ? `
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #6b5e4a;">Attached Brief:</td>
              <td style="padding: 8px 0;">
                <span style="background: #c0f0dd; color: #1a4731; padding: 4px 10px; border-radius: 10px; font-weight: bold; border: 1px solid #3d3d3d; display: inline-flex; align-items: center; gap: 4px;">
                  📄 ${escapeHtml(data.attachment.fileName)} (${(data.attachment.fileSize / (1024 * 1024)).toFixed(2)} MB - Attached in email)
                </span>
              </td>
            </tr>
            ` : ''}
          </table>

          <div style="background: #ffffff; padding: 18px; border: 2px solid #3d3d3d; border-radius: 12px; margin-top: 16px; box-shadow: 3px 3px 0 #3d3d3d;">
            <p style="font-weight: 800; margin-top: 0; margin-bottom: 8px; color: #6b5e4a; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">
              Project Scope & Requirements:
            </p>
            <p style="white-space: pre-wrap; margin: 0; line-height: 1.65; font-size: 14px;">${escapeHtml(data.message)}</p>
          </div>

          <div style="text-align: center; margin-top: 24px;">
            <a href="mailto:${escapeHtml(data.email)}?subject=${encodeURIComponent(`Re: Your ${data.project_type} Inquiry`)}" style="display: inline-block; background: #ffb6c1; color: #3d3d3d; font-weight: 800; padding: 10px 24px; border-radius: 999px; text-decoration: none; border: 2px solid #3d3d3d; box-shadow: 3px 3px 0 #3d3d3d;">
              ✉️ Reply Directly to ${escapeHtml(data.name)}
            </a>
          </div>

          <p style="margin-top: 24px; font-size: 11px; color: #888; text-align: center; border-top: 1px solid #e2d1ff; padding-top: 12px;">
            Sent automatically from Ashrut Tiwari's Retro Desktop Portfolio Freelance Terminal.
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

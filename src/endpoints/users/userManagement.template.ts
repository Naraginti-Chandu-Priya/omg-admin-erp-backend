export async function onBoardTemplateAdmin(
  firstName: string,
  lastName: string,
  hash: string
) {
  const baseUrl = (process.env.FRONTEND_APP_URL ?? 'http://localhost:5173')
    .trim()
    .replace(/\/+$/, '');

  const link = `${baseUrl}/auth/create_password/${encodeURIComponent(hash)}`;

  return `
    <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
      
      <div style="padding: 20px 24px; background: linear-gradient(135deg, #293088 0%, #e22e26 100%); color: #ffffff;">
        <h2 style="margin: 0; font-size: 20px;">OMG Temple ERP</h2>
        <p style="margin: 8px 0 0 0; font-size: 13px; opacity: 0.95;">Account Onboarding</p>
      </div>

      <div style="padding: 24px; background: #ffffff; color: #0f172a;">
        <p style="margin: 0 0 12px 0; font-size: 14px;">Dear ${firstName} ${lastName},</p>

        <p style="margin: 0 0 14px 0; font-size: 14px; line-height: 1.6;">
          Welcome to OMG Temple ERP! You have been successfully onboarded as an admin.
        </p>

        <p style="margin: 12px 0; font-size: 14px;">
          Click below to set your password:
        </p>

        <div style="margin: 16px 0; padding: 14px 16px; border: 1px dashed #293088; border-radius: 10px; background: #f8fafc;">
          <a href="${link}" style="text-decoration: none; color: #293088; font-size: 14px; word-break: break-all;">
            ${link}
          </a>
        </div>

      </div>
    </div>
  `;
}

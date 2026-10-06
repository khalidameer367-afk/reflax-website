import nodemailer from "nodemailer";

// Mail settings. Two ways to send (checked in this order):
//  1) Any SMTP mailbox, e.g. Hostinger business email  -> set SMTP_HOST, SMTP_USER, SMTP_PASS
//     (optional: SMTP_PORT, default 465 / SMTP_FROM, default = SMTP_USER)
//  2) Gmail App Password (old setup)                    -> set GMAIL_USER, GMAIL_APP_PASSWORD
// If SMTP_HOST is set, Hostinger/SMTP is used and the Gmail settings are ignored.
function usingSmtp() {
  return Boolean(process.env.SMTP_HOST);
}

function senderAddress() {
  return (usingSmtp() ? process.env.SMTP_FROM || process.env.SMTP_USER : process.env.GMAIL_USER) || "";
}

// Where admin notifications go (new applications, contact form).
function adminAddress() {
  return process.env.ADMIN_EMAIL || senderAddress();
}

function getTransporter() {
  if (usingSmtp()) {
    const port = Number(process.env.SMTP_PORT || 465);
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: port === 465, // 465 = SSL, 587 = STARTTLS
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
  }
  return nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
  });
}

// Branded wrapper for emails sent to users: Reflax logo on top, footer below.
// (Email clients block SVG/WebP in places, so a PNG hosted on the site is used.)
function brandedEmail(bodyHtml: string) {
  const site = (process.env.NEXT_PUBLIC_SITE_URL || "https://reflax.org").replace(/\/+$/, "");
  return `<div style="background:#f5f5f4;padding:24px 12px;font-family:Arial,Helvetica,sans-serif">
  <div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e5e5e5">
    <div style="padding:28px 32px 20px;border-bottom:1px solid #eeeeee">
      <a href="${site}" style="text-decoration:none">
        <img src="${site}/logo-email.png" alt="Reflax" width="140" style="display:block;border:0;height:auto;width:140px" />
      </a>
    </div>
    <div style="padding:28px 32px;font-size:15px;line-height:1.6;color:#1a1a1a">
      ${bodyHtml}
    </div>
    <div style="padding:18px 32px;border-top:1px solid #eeeeee;font-size:12px;color:#888888">
      Reflax &middot; <a href="${site}" style="color:#0f766e;text-decoration:none">${site.replace(/^https?:\/\//, "")}</a>
    </div>
  </div>
</div>`;
}

export async function sendMail(to: string, subject: string, html: string) {
  const transporter = getTransporter();
  await transporter.sendMail({
    from: `"Reflax" <${senderAddress()}>`,
    to,
    subject,
    html,
  });
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export async function notifyContactForm(name: string, email: string, subject: string, message: string) {
  const adminEmail = adminAddress();
  if (!adminEmail) return;
  await sendMail(
    adminEmail,
    `Contact form: ${subject || "New message"}`,
    `<p><strong>From:</strong> ${esc(name)} (${esc(email)})</p>
     <p><strong>Message:</strong></p>
     <p>${esc(message).replace(/\n/g, "<br/>")}</p>`
  );
}

export async function notifyAdminNewFreelancer(name: string, category: string, id: string) {
  const adminEmail = adminAddress();
  if (!adminEmail) return;
  await sendMail(
    adminEmail,
    `New freelancer application: ${name}`,
    `<p><strong>${name}</strong> applied under <strong>${category}</strong> and is
     waiting for review.</p>
     <p>Approve or reject it from the admin panel.</p>
     <p style="color:#888;font-size:12px">Profile ID: ${id}</p>`
  );
}

export async function notifyAdminNewBusiness(companyName: string, id: string) {
  const adminEmail = adminAddress();
  if (!adminEmail) return;
  await sendMail(
    adminEmail,
    `New business registration: ${companyName}`,
    `<p><strong>${companyName}</strong> submitted a business registration.</p>
     <p>Review it in the admin panel to approve or reject.</p>
     <p style="color:#888;font-size:12px">Application ID: ${id}</p>`
  );
}

export async function notifyFreelancerApproved(email: string, name: string) {
  await sendMail(
    email,
    "Your Reflax profile has been approved!",
    brandedEmail(`<p>Hi ${name},</p>
     <p>Good news — your freelancer profile has been reviewed and <strong>approved</strong>.
     It is now live on Reflax and visible to businesses looking to hire.</p>
     <p>— The Reflax Team</p>`)
  );
}

export async function notifyBusinessApproved(email: string, companyName: string) {
  await sendMail(
    email,
    "Your Reflax business profile has been approved!",
    brandedEmail(`<p>Hi ${companyName} team,</p>
     <p>Your business profile has been reviewed and <strong>approved</strong>. It is now
     live on Reflax.</p>
     <p>— The Reflax Team</p>`)
  );
}

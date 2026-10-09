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
// Goes to ADMIN_EMAIL and ALSO to the SMTP mailbox itself (e.g. info@reflax.org), without duplicates.
function adminAddress() {
  const list = [process.env.ADMIN_EMAIL, senderAddress()]
    .flatMap((v) => (v || "").split(","))
    .map((v) => v.trim())
    .filter(Boolean);
  const unique = list.filter((v, i) => list.findIndex((x) => x.toLowerCase() === v.toLowerCase()) === i);
  return unique.join(", ");
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

export interface MailOptions {
  replyTo?: string;
  attachments?: { filename: string; content: Buffer }[];
}

export async function sendMail(to: string, subject: string, html: string, options: MailOptions = {}) {
  const transporter = getTransporter();
  await transporter.sendMail({
    from: `"Reflax" <${senderAddress()}>`,
    to,
    subject,
    html,
    replyTo: options.replyTo,
    attachments: options.attachments,
  });
}

// Escapes text before it is placed inside an email's HTML.
export function escapeHtml(v: string) {
  return v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// Guest post submitted from /write-for-us. The file is only attached to the email —
// nothing is stored on the website or in the database.
export async function notifyGuestPost(
  name: string,
  email: string,
  niche: string,
  file: { filename: string; content: Buffer }
) {
  const adminEmail = adminAddress();
  if (!adminEmail) throw new Error("No admin email configured");
  await sendMail(
    adminEmail,
    `Guest post submission (${niche}): ${name}`,
    `<p><strong>Name:</strong> ${escapeHtml(name)}</p>
     <p><strong>Email:</strong> ${escapeHtml(email)}</p>
     <p><strong>Niche:</strong> ${escapeHtml(niche)}</p>
     <p>The article is attached to this email: <strong>${escapeHtml(file.filename)}</strong></p>
     <p style="color:#888;font-size:12px">Reply to this email to contact the writer. To publish it, add it from Admin panel &rarr; Contributors.</p>`,
    { replyTo: email, attachments: [file] }
  );
}

// Large guest post (over 4 MB): the file is stored privately in Supabase Storage
// and the admin gets a download link instead of an attachment.
export async function notifyGuestPostLink(
  name: string,
  email: string,
  niche: string,
  filename: string,
  url: string
) {
  const adminEmail = adminAddress();
  if (!adminEmail) throw new Error("No admin email configured");
  await sendMail(
    adminEmail,
    `Guest post submission (${niche}): ${name}`,
    `<p><strong>Name:</strong> ${escapeHtml(name)}</p>
     <p><strong>Email:</strong> ${escapeHtml(email)}</p>
     <p><strong>Niche:</strong> ${escapeHtml(niche)}</p>
     <p>The article is a large file, so it is not attached. Download it here (link works for 30 days):<br/>
     <a href="${url}">${escapeHtml(filename)}</a></p>
     <p style="color:#888;font-size:12px">Reply to this email to contact the writer. To publish it, add it from Admin panel &rarr; Contributors.</p>`,
    { replyTo: email }
  );
}

// "Join as professional profile" form (profile is saved as pending in the database).
export async function notifyAdminNewProfile(name: string, title: string, email: string, phone: string) {
  const adminEmail = adminAddress();
  if (!adminEmail) return;
  await sendMail(
    adminEmail,
    `New professional profile: ${name}`,
    `<p><strong>${escapeHtml(name)}</strong> (${escapeHtml(title)}) submitted a professional profile and is waiting for review.</p>
     <p><strong>Email:</strong> ${escapeHtml(email)}${phone ? `<br/><strong>Phone:</strong> ${escapeHtml(phone)}` : ""}</p>
     <p>Approve or reject it from Admin panel &rarr; Profiles.</p>`,
    { replyTo: email }
  );
}

export async function notifyContactForm(name: string, email: string, subject: string, message: string) {
  const adminEmail = adminAddress();
  if (!adminEmail) return;
  await sendMail(
    adminEmail,
    `Contact form: ${subject || "New message"}`,
    `<p><strong>From:</strong> ${name} (${email})</p>
     <p><strong>Message:</strong></p>
     <p>${message.replace(/\n/g, "<br/>")}</p>`
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

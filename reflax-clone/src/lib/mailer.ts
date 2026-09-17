import nodemailer from "nodemailer";

// Uses Gmail SMTP. Requires a Gmail "App Password" (not your normal
// password) — see README.md for how to generate one.
function getTransporter() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
}

export async function sendMail(to: string, subject: string, html: string) {
  const transporter = getTransporter();
  await transporter.sendMail({
    from: `"Reflax" <${process.env.GMAIL_USER}>`,
    to,
    subject,
    html,
  });
}

export async function notifyAdminNewFreelancer(name: string, category: string, id: string) {
  const adminEmail = process.env.ADMIN_EMAIL || process.env.GMAIL_USER;
  if (!adminEmail) return;
  await sendMail(
    adminEmail,
    `New freelancer application: ${name}`,
    `<p><strong>${name}</strong> applied under <strong>${category}</strong>.</p>
     <p>Review it in the admin panel to approve or reject.</p>
     <p style="color:#888;font-size:12px">Application ID: ${id}</p>`
  );
}

export async function notifyAdminNewBusiness(companyName: string, id: string) {
  const adminEmail = process.env.ADMIN_EMAIL || process.env.GMAIL_USER;
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
    `<p>Hi ${name},</p>
     <p>Good news — your freelancer profile has been reviewed and <strong>approved</strong>.
     It is now live on Reflax and visible to businesses looking to hire.</p>
     <p>— The Reflax Team</p>`
  );
}

export async function notifyBusinessApproved(email: string, companyName: string) {
  await sendMail(
    email,
    "Your Reflax business profile has been approved!",
    `<p>Hi ${companyName} team,</p>
     <p>Your business profile has been reviewed and <strong>approved</strong>. It is now
     live on Reflax.</p>
     <p>— The Reflax Team</p>`
  );
}

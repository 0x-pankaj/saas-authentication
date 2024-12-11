import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import { VerificationEmail } from "@/emails/verification-email";
import { ResetPasswordEmail } from "@/emails/reset-password-email";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function sendVerificationEmail(
  email: string,
  token: string,
  method: "EMAIL_OTP" | "MAGIC_LINK"
) {
  const emailHtml = render(
    VerificationEmail({
      token,
      method,
      url: `${process.env.NEXTAUTH_URL}/auth/verify?token=${token}`,
    })
  );

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: "Verify your email",
    html: emailHtml,
  });
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const emailHtml = render(
    ResetPasswordEmail({
      url: `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`,
    })
  );

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: "Reset your password",
    html: emailHtml,
  });
}
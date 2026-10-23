import nodemailer from "nodemailer";

export const sendEmail = async (options: {
  email: string;
  subject: string;
  message: string;
}) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // 🟢 აუცილებელია Google App Password (16 ნიშნა)
    },
  });

  const mailOptions = {
    // 🟢 სწორი ფორმატი Gmail-ისთვის:
    from: `"RetroStore" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOptions);
};

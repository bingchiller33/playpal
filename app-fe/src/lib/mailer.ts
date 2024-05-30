import nodemailer from 'nodemailer';



const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER!,
      pass: process.env.EMAIL_PASS!,
    },
  });
  
  export const sendVerificationEmail = async (email: string, token: string) => {
    const url = `${process.env.NEXTAUTH_URL!}/auth/verify/${token}`;
    await transporter.sendMail({
      to: email,
      subject: 'Verify your email',
      html: `<p>Please click the following link to verify your email:</p><a href="${url}">${url}</a>`,
    });
  };
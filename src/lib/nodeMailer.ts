// import { Resend } from "resend";

// export const resend = new Resend(process.env.RESEND_API_KEY);
import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
//   port: 587,
//   secure: false, // true for port 465, false for other ports
  auth: {
    user: "kunalnasa.dev@gmail.com",
    pass: process.env.NODEMAILER_SECRET,
  },
});

export default transporter

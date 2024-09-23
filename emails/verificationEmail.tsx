// src/helpers/renderVerificationEmail.tsx
// import { Html, Head, Preview, Section, Heading, Text } from "@react-email/components";

interface VerificationEmailProps {
    username: string;
    otp: string;
}

export function renderVerificationEmail({ username, otp }: VerificationEmailProps): string {
    return `
        <html>
            <head>
                <title>Verification Code</title>
            </head>
            <body>
                <h2>Hello ${username},</h2>
                <p>Thank you for registering. Please use the following verification code to complete your registration:</p>
                <p>${otp}</p>
                <p>If you did not request this code, please ignore this email.</p>
            </body>
        </html>
    `;
}

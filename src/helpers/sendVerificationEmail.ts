import transporter from "@/lib/nodeMailer";
import { renderVerificationEmail } from "../../emails/verificationEmail";
import { ApiResponse } from "@/types/ApiResponse";


export async function sendVerificationEmail(
    email : string,
    username : string,
    verifyCode : string
): Promise<ApiResponse> {
    try {
        const emailHtml = renderVerificationEmail({ username, otp: verifyCode });

        // below code is from documentation and is same for react email and any other email sender
        transporter.sendMail({
            from: 'kunalnasa.dev@gmail.com',
            to: email,
            subject: 'Mystery Message Verification Code',
            // nodemailer doesnt allow you to send react code
            html: emailHtml
        });

        return {success : true, message : "verification email sent successfuly"}
    } catch (EmailError) {
        console.log("Error sending Email");
        return {success : false, message : "Failed to send verification email"}
    }
}
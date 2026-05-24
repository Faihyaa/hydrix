import emailjs from "@emailjs/browser";

type AlertEmailParams = {
  user_name: string;
  message: string;
  location: string;
  risk_level: string;
};

export const sendAlertEmail = async (data: AlertEmailParams) => {
  try {
    const result = await emailjs.send(
      process.env.REACT_APP_EMAILJS_SERVICE_ID as string,
      process.env.REACT_APP_EMAILJS_TEMPLATE_ID as string,
      data,
      process.env.REACT_APP_EMAILJS_PUBLIC_KEY as string
    );

    console.log("Email sent successfully:", result.text);
    return result;
  } catch (error) {
    console.error("Email send failed:", error);
    throw error;
  }
};
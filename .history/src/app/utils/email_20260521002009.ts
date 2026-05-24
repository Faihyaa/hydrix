import emailjs from "@emailjs/browser";

const SERVICE_ID = "service_hydrix";
const PUBLIC_KEY = "N1c9K-3TaUUxIDVLj";

// store both templates here
const TEMPLATE = {
  warn: "YOUR_WARN_TEMPLATE_ID",
  alert: "YOUR_ALERT_TEMPLATE_ID",
};

type EmailType = "warn" | "alert";

interface EmailData {
  user_name: string;
  message: string;
  location: string;
  risk_level?: string;
}

export const sendFloodEmail = async (
  type: EmailType,
  data: EmailData
) => {
  const templateId = TEMPLATE[type];

  return emailjs.send(
    SERVICE_ID,
    templateId,
    data,
    PUBLIC_KEY
  );
};
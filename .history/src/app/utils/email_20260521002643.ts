import emailjs from "@emailjs/browser";

const SERVICE_ID = "service_hydrix";
const PUBLIC_KEY = "N1c9K-3TaUUxIDVLj";

// store both templates here
const TEMPLATE = {
  warn: "template_warn",
  alert: "template_alert",
};

type EmailType = "warn" | "alert";

interface EmailData extends Record<string, unknown> {
  name: string;
  message: string;
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
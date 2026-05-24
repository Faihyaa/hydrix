import emailjs from "@emailjs/browser";

const SERVICE_ID = "service_hydrix";
const PUBLIC_KEY = "N1c9K-3TaUUxIDVLj";

const TEMPLATE = {
  warn: "template_warn",
  alert: "template_alert",
} as const;

type EmailType = keyof typeof TEMPLATE;

interface EmailData extends Record<string, unknown> {
  name: string;
  message: string;
}

export const sendFloodEmail = async (
  type: EmailType,
  data: EmailData
) => {
  return emailjs.send(
    SERVICE_ID,
    TEMPLATE[type],
    data,
    PUBLIC_KEY
  );
};
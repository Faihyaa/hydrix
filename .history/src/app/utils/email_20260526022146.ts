export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const sendContactMessage = async (formData) => {
  return await fetch("/api/contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });
};
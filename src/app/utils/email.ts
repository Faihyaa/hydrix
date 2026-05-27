export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export async function sendContactMessage(formData: ContactFormData) {
  return fetch(`${import.meta.env.VITE_API_URL}/api/contact`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });
}
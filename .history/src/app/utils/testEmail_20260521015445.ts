import { sendFloodEmail } from "./email";

export const testEmail = async () => {
  await sendFloodEmail("warn", {
    name: "Test User",
    email: "your_email@gmail.com",
    notifications: true,
  });

  console.log("Test email sent");
};
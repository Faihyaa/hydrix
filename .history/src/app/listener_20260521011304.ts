import { ref, onValue } from "firebase/database";
import { database } from "../lib/firebase";
import { sendFloodEmail } from "../utils/email";

let lastSentLevel: string | null = null;

export const startFloodListener = (user: any) => {
  const floodRef = ref(database, "floodStatus");

  onValue(floodRef, async (snapshot) => {
    const flood = snapshot.val();
    if (!flood) return;

    if (!user.alertEnabled) return;

    // 🚫 prevent duplicate emails
    if (lastSentLevel === flood.level) return;

    lastSentLevel = flood.level;

    if (flood.level === "warn") {
      await sendFloodEmail("Warn", {
        name: user.name,
        email: user.email,
        message: "Flood warning detected. Stay alert.",
      });
    }

    if (flood.level === "alert") {
      await sendFloodEmail("Alert", {
        name: user.name,
        email: user.email,
        message: "URGENT: Flood risk is high!",
      });
    }
  });
};
import { ref, onValue } from "firebase/database";
import { database } from "../lib/firebase";
import { sendFloodEmail } from "./utils/email";

export const startFloodListener = (user: any) => {
  const floodRef = ref(database, "floodStatus");

  onValue(floodRef, async (snapshot) => {
    const data = snapshot.val();
    if (!data) return;

    // 🔥 CHECK USER TOGGLE FIRST
    if (!user.alertEnabled) return;

    if (data.level === "warn") {
      await sendFloodEmail("warn", {
        name: user.name,
        email: user.email,
        message: "Flood warning detected in your area. Stay alert.",
      });
    }

    if (data.level === "alert") {
      await sendFloodEmail("alert", {
        name: user.name,
        email: user.email,
        message: "URGENT: Flood risk is high. Take action immediately.",
      });
    }
  });
};
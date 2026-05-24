import { ref, onValue } from "firebase/database";
import { db } from "../firebase";
import { sendFloodEmail } from "../utils/email";

export const startFloodListener = (user: any) => {
  const floodRef = ref(db, "floodStatus");

  onValue(floodRef, async (snapshot) => {
    const data = snapshot.val();
    if (!data) return;

    // 🔥 CHECK USER TOGGLE FIRST
    if (!user.alertEnabled) return;

    if (data.level === "warn") {
      await sendFloodEmail("Warn", {
        name: user.name,
        email: user.email,
        message: "Flood warning detected in your area. Stay alert.",
      });
    }

    if (data.level === "alert") {
      await sendFloodEmail("Alert", {
        name: user.name,
        email: user.email,
        message: "URGENT: Flood risk is high. Take action immediately.",
      });
    }
  });
};
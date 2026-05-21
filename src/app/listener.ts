import { ref, onValue } from "firebase/database";
import { database } from "../lib/firebase";
import { sendFloodEmail } from "./utils/email";

let lastLevel: string | null = null;

export const startFloodListener = (user: any) => {
  const floodRef = ref(database, "floodStatus");

  onValue(floodRef, async (snapshot) => {
    const data = snapshot.val();
    if (!data) return;

    if (!user.notifications) return;

    if (lastLevel === data.level) return;
    lastLevel = data.level;

    if (data.level === "warn") {
      await sendFloodEmail("warn", user);
    }

    if (data.level === "alert") {
      await sendFloodEmail("alert", user);
    }
  });
};
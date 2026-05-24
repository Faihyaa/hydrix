import { ref, onValue } from "firebase/database";
import { database } from "../lib/firebase";

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
      console.log("Email disabled: would have sent 'warn' to", user);
    }

    if (data.level === "alert") {
      console.log("Email disabled: would have sent 'alert' to", user);
    }
  });
};
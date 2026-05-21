import { sendFloodEmail } from "../utils/email";

export default function Home() {
  const testEmail = async () => {
    const fakeUser = {
      name: "Test User",
      email: "nurfaizah.or@gmail.com",
    };

    await sendFloodEmail("warn", fakeUser);

    alert("Email sent!");
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>HydriX Test Page</h1>

      <button
        onClick={testEmail}
        style={{
          padding: "12px 20px",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        Test EmailJS
      </button>
    </div>
  );
}
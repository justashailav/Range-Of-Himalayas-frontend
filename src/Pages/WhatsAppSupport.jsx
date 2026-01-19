import { useEffect } from "react";

const WhatsAppSupport = () => {
  useEffect(() => {
    const phone = "916230867344"; // 🔴 replace with YOUR number (no +, no spaces)
    const message =
      "Hi Range Of Himalayas, I need help regarding your products 🌿";

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    // 🔴 THIS LINE IS THE KEY
    window.location.replace(url);
  }, []);

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      Redirecting you to WhatsApp support…
    </div>
  );
};

export default WhatsAppSupport;

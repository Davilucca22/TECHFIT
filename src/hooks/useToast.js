import { useEffect, useState } from "react";

export default function useToast() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!message) return undefined;
    const timeout = window.setTimeout(() => setMessage(""), 3000);
    return () => window.clearTimeout(timeout);
  }, [message]);

  return { message, notify: setMessage };
}

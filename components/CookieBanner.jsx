// components/CookieBanner.jsx
import { useState, useEffect } from "react";
import Link from "next/link";

export default function CookieBanner() {
<<<<<<< HEAD
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem("cookie_consent", "accepted");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem("cookie_consent", "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[200] p-4">
      <div className="max-w-4xl mx-auto bg-neutral-900 border border-white/10 rounded-2xl p-4 md:p-5 flex flex-col md:flex-row items-start md:items-center gap-4 shadow-2xl animate-fadeIn">
        <div className="flex-1">
          <p className="text-white text-sm font-medium mb-1">🍪 We use cookies</p>
          <p className="text-neutral-400 text-xs leading-relaxed">
            We use cookies to keep you logged in and improve your experience.
            By clicking Accept, you agree to our{" "}
            <Link href="/privacy" className="text-red-400 hover:underline">Privacy Policy</Link>
            {" "}and{" "}
            <Link href="/terms" className="text-red-400 hover:underline">Terms of Service</Link>.
          </p>
        </div>
        <div className="flex gap-3 flex-shrink-0">
          <button onClick={decline}
            className="px-4 py-2 text-sm text-neutral-400 hover:text-white border border-white/10 rounded-lg transition">
            Decline
          </button>
          <button onClick={accept}
            className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition">
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}
=======
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem("cookie_consent");
        if (!consent) setVisible(true);
    }, []);

    const accept = () => {
        localStorage.setItem("cookie_consent", "accepted");
        setVisible(false);
    };

    const decline = () => {
        localStorage.setItem("cookie_consent", "declined");
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[200] p-4">
            <div className="max-w-4xl mx-auto bg-neutral-900 border border-white/10 rounded-2xl p-4 md:p-5 flex flex-col md:flex-row items-start md:items-center gap-4 shadow-2xl animate-fadeIn">
                <div className="flex-1">
                    <p className="text-white text-sm font-medium mb-1">🍪 We use cookies</p>
                    <p className="text-neutral-400 text-xs leading-relaxed">
                        We use cookies to keep you logged in and improve your experience.
                        By clicking Accept, you agree to our{" "}
                        <Link href="/privacy" className="text-red-400 hover:underline">Privacy Policy</Link>
                        {" "}and{" "}
                        <Link href="/terms" className="text-red-400 hover:underline">Terms of Service</Link>.
                    </p>
                </div>
                <div className="flex gap-3 flex-shrink-0">
                    <button onClick={decline}
                        className="px-4 py-2 text-sm text-neutral-400 hover:text-white border border-white/10 rounded-lg transition">
                        Decline
                    </button>
                    <button onClick={accept}
                        className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition">
                        Accept All
                    </button>
                </div>
            </div>
        </div>
    );
}
>>>>>>> 3b3f76b6b2f75cfb78a3ee46561373052120bd14

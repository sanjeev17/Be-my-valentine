import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import cuteBears from "@/assets/cute-bears.png";

const BUTTON_SIZE = 120;
const ESCAPE_RADIUS = 160;

const CHASE_MESSAGES = [
  "😢 Pleeease don't go there! 💔",
  "😭 Not that button!",
  "🥺 You're breaking my heart...",
  "😿 Come back to Yes!",
  "💔 Why are you so mean?!",
  "😢 I thought we had something!",
  "🫠 Okay fine, I'll just cry here...",
  "😤 That button is OFF LIMITS!",
  "🥹 Pretty please click Yes?",
];

const FloatingHeart = ({ delay, left, size, emoji }: { delay: number; left: number; size: string; emoji: string }) => (
  <div
    className="fixed pointer-events-none select-none opacity-15 animate-float-heart"
    style={{
      left: `${left}%`,
      top: `${55 + Math.random() * 35}%`,
      animationDelay: `${delay}s`,
      animationDuration: `${3 + Math.random() * 2}s`,
      fontSize: size,
    }}
  >
    {emoji}
  </div>
);

const Index = () => {
  const navigate = useNavigate();
  const noButtonRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [noPos, setNoPos] = useState<{ x: number; y: number } | null>(null);
  const [yesHover, setYesHover] = useState(false);
  const [chasing, setChasing] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  const [cursorNearNo, setCursorNearNo] = useState(false);
  const chasingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hearts = useMemo(() => {
    const emojis = ["❤️", "💕", "💗", "💖", "🩷", "💘", "✨"];
    return Array.from({ length: 10 }, (_, i) => ({
      delay: i * 0.6,
      left: 5 + i * 9.5,
      size: `${1 + Math.random() * 1.2}rem`,
      emoji: emojis[i % emojis.length],
    }));
  }, []);

  const escapeButton = useCallback((cursorX: number, cursorY: number) => {
    if (!noButtonRef.current || !containerRef.current) return;

    const btnRect = noButtonRef.current.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();
    const btnCenterX = btnRect.left + btnRect.width / 2;
    const btnCenterY = btnRect.top + btnRect.height / 2;

    const dx = btnCenterX - cursorX;
    const dy = btnCenterY - cursorY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // Show crying cursor when getting close
    setCursorNearNo(dist < ESCAPE_RADIUS * 1.5);

    if (dist < ESCAPE_RADIUS) {
      const angle = Math.atan2(dy, dx) + (Math.random() - 0.5) * 1.2;
      const jumpDist = 120 + Math.random() * 80;

      let newX = btnCenterX + Math.cos(angle) * jumpDist - containerRect.left - BUTTON_SIZE / 2;
      let newY = btnCenterY + Math.sin(angle) * jumpDist - containerRect.top - BUTTON_SIZE / 2;

      const maxX = containerRect.width - BUTTON_SIZE;
      const maxY = containerRect.height - BUTTON_SIZE;
      newX = Math.max(0, Math.min(newX, maxX));
      newY = Math.max(0, Math.min(newY, maxY));

      setNoPos({ x: newX, y: newY });
      setChasing(true);
      setMessageIndex((prev) => (prev + 1) % CHASE_MESSAGES.length);
      if (chasingTimeout.current) clearTimeout(chasingTimeout.current);
      chasingTimeout.current = setTimeout(() => setChasing(false), 3000);
    }
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => escapeButton(e.clientX, e.clientY);
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, [escapeButton]);

  useEffect(() => {
    const handler = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) escapeButton(t.clientX, t.clientY);
    };
    window.addEventListener("touchmove", handler, { passive: true });
    window.addEventListener("touchstart", handler, { passive: true });
    return () => {
      window.removeEventListener("touchmove", handler);
      window.removeEventListener("touchstart", handler);
    };
  }, [escapeButton]);

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 flex flex-col items-center justify-center overflow-hidden select-none ${cursorNearNo ? "cursor-crying" : ""}`}
      style={{
        background: "linear-gradient(180deg, hsl(350 100% 97%) 0%, hsl(340 60% 92%) 50%, hsl(346 70% 88%) 100%)",
      }}
    >
      {/* Floating hearts - memoized so they don't re-render */}
      {hearts.map((h, i) => (
        <FloatingHeart key={i} {...h} />
      ))}

      {/* Cute bear image */}
      <img
        src={cuteBears}
        alt="Cute bear with heart"
        className="w-32 sm:w-40 mb-4 drop-shadow-lg rounded-2xl transition-transform duration-700 ease-out"
      />

      <h1
        className="text-3xl sm:text-5xl md:text-6xl font-bold text-primary text-center px-6 mb-3 drop-shadow-sm"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Aishvrya Pandey,
      </h1>
      <p
        className="text-xl sm:text-2xl md:text-3xl text-foreground text-center px-6 mb-10 font-semibold"
        style={{ fontFamily: "var(--font-body)" }}
      >
        will you be my Valentine? 💌
      </p>

      <div className="flex gap-6 items-center relative" style={{ minHeight: 80 }}>
        <button
          onClick={() => navigate("/yes")}
          onMouseEnter={() => setYesHover(true)}
          onMouseLeave={() => setYesHover(false)}
          className="px-10 py-4 rounded-full bg-primary text-primary-foreground font-bold text-lg sm:text-xl shadow-lg hover:shadow-2xl transition-all duration-500 ease-out animate-pulse-heart hover:scale-110"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Yes {yesHover ? "🥰" : "❤️"}
        </button>

        <button
          ref={noButtonRef}
          className="px-8 py-4 rounded-full bg-muted text-muted-foreground font-bold text-lg sm:text-xl shadow"
          style={{
            transition: "left 0.55s cubic-bezier(0.22, 1, 0.36, 1), top 0.55s cubic-bezier(0.22, 1, 0.36, 1)",
            ...(noPos
              ? {
                  position: "fixed",
                  left: noPos.x,
                  top: noPos.y,
                  fontFamily: "var(--font-body)",
                  zIndex: 50,
                }
              : { fontFamily: "var(--font-body)" }),
          }}
          onClick={(e) => e.preventDefault()}
        >
          No 😒
        </button>
      </div>

      {/* Changing chase messages - smooth fade */}
      <div className="h-12 mt-6 flex items-center justify-center">
        {chasing && (
          <p
            className="text-xl sm:text-2xl text-primary font-semibold text-center animate-message-fade"
            key={messageIndex}
            style={{ fontFamily: "var(--font-body)" }}
          >
            {CHASE_MESSAGES[messageIndex]}
          </p>
        )}
      </div>

      <p className="mt-4 text-muted-foreground text-sm" style={{ fontFamily: "var(--font-body)" }}>
        (Iss baar jyada mat sochna)
      </p>
    </div>
  );
};

export default Index;

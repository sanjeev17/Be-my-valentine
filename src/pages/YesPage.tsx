import { useEffect, useState } from "react";
import valentineMeme from "@/assets/valentine-meme.jpg";

const CONFETTI_COLORS = [
"hsl(346, 84%, 60%)",
"hsl(20, 90%, 65%)",
"hsl(340, 80%, 75%)",
"hsl(50, 90%, 65%)",
"hsl(280, 60%, 65%)"];


const ConfettiPiece = ({ index }: {index: number;}) => {
  const left = Math.random() * 100;
  const delay = Math.random() * 3;
  const size = 6 + Math.random() * 8;
  const color = CONFETTI_COLORS[index % CONFETTI_COLORS.length];

  return (
    <div
      className="fixed pointer-events-none animate-confetti"
      style={{
        left: `${left}%`,
        top: -20,
        animationDelay: `${delay}s`,
        animationDuration: `${3 + Math.random() * 2}s`,
        width: size,
        height: size,
        backgroundColor: color,
        borderRadius: index % 2 === 0 ? "50%" : "2px",
        zIndex: 100
      }} />);


};

const YesPage = () => {
  const [showConfetti, setShowConfetti] = useState(true);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 6000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!flipped) return;
    const handler = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".flip-card")) {
        setFlipped(false);
      }
    };
    // delay listener so the click that flipped it doesn't immediately unflip
    const id = setTimeout(() => {
      document.addEventListener("click", handler);
      document.addEventListener("touchstart", handler);
    }, 50);
    return () => {
      clearTimeout(id);
      document.removeEventListener("click", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, [flipped]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6 py-12 relative overflow-hidden">
      {showConfetti &&
      [...Array(40)].map((_, i) => <ConfettiPiece key={i} index={i} />)}

      <div className="text-6xl sm:text-8xl mb-6 animate-pulse-heart">❤️</div>

      <h1
        className="text-3xl sm:text-5xl font-bold text-primary text-center mb-8"
        style={{ fontFamily: "var(--font-display)" }}>
        finally 1 saal baad! 🎉
      </h1>

      <div
        className="flip-card w-80 sm:w-96 mb-8 cursor-pointer"
        style={{ perspective: "1000px" }}
        onClick={() => setFlipped(true)}
      >
        <div
          className="relative w-full transition-transform duration-700"
          style={{
            transformStyle: "preserve-3d",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* Front - meme image */}
          <div style={{ backfaceVisibility: "hidden" }}>
            <img
              src={valentineMeme}
              alt="Valentine meme"
              className="w-full rounded-2xl shadow-xl"
            />
            <p className="text-xs text-muted-foreground text-center mt-2">
              Tap the photo 👆
            </p>
          </div>

          {/* Back - secret message */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl shadow-xl bg-primary text-primary-foreground p-6"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <p
              className="text-base sm:text-lg font-bold text-center leading-relaxed"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Ye message uss pehle ishaar wale Sanjeev Rai ki taraf se hai,
              jo 11:59 pe apni himmat juta paaya tha aur ye kissa likh paaya tha.
              <br />
              Iss khubsurat samay ka mizaaj ajab hai: jab rukna hota hai,
              tab bhaagta hai - jaise 28 Feb se aaj tak; aur jab bhaagna hota hai,
              tab tham jaata hai - jaise 14th Feb se 17th Feb.
              <br />
              Par umeed hai aage ka saara samay bas bhaage, aur ruke to mai aur tum.
              <br />
              Happy Valentine's Day - or you can say Happy Confrontation Anniversary.
            </p>
            <p className="mt-3 text-sm opacity-80">(tap anywhere to flip back)</p>
          </div>
        </div>
      </div>

      <p
        className="text-xl sm:text-2xl text-foreground text-center font-semibold"
        style={{ fontFamily: "var(--font-body)" }}>
        Iss baar bhi jyada socha toh nahi? 😌❤️
      </p>

      <p className="mt-4 text-muted-foreground text-center text-sm">Happy Valentine's Day, Pandey ji! 💕
      </p>
    </div>);
};

export default YesPage;
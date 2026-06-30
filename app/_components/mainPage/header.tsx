"use client"
import { useState, useEffect } from "react";

const CARD_WIDTH = 1200;
const GAP = 20;
const STEP = CARD_WIDTH + GAP;

const Header = () => {
  const [cards, setCards] = useState([
    {
      id: "A",
      image:
        "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ffarmvilag.hu%2Fwp-content%2Fuploads%2F2025%2F03%2Fdominans-kutya.jpg&f=1&nofb=1&ipt=4fa64bda97c6249bf3816252a51c54ec9b6728800b3b05169c7b6b0a86dace18",
    },
    {
      id: "B",
      image:
        "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fkutyanev.hu%2Fwp-content%2Fuploads%2F2026%2F02%2Fgpt-tobb-kutya-egyutt-tartasa-mire-figyelj-1771755076.png&f=1&nofb=1&ipt=13a2218ee6fef0f74b18ccf67d3c3914f7a005af059781649b42b852fd22ad9c",
    },

  ]);
  const [offset, setOffset] = useState(0);
  const [animate, setAnimate] = useState(true);

  const next = () => {

    setAnimate(true);
    setOffset(-screen.width);
    setTimeout(() => {
      setCards((prev) => [...prev.slice(1), prev[0]]);
      setAnimate(false);
      setOffset(0);
    }, 500);
  };

  useEffect(() => {
    const id = setInterval(() => {
      next();
    }, 2000);
    return () => clearInterval(id);
  }, []);


  return (
    <section>
      <div>
        <div
          style={{
            position: "relative",
            height: "100vh",
            width: "100%",
            margin: "0 auto",
            overflow: "hidden",
          }}
        >
          <div className={`flex absolute top-0 left-0 `}
          >

            <div
              key={cards[0].id}
              style={{
                width: "100vw",
                height: "100vh",
                flexShrink: 0,
                backgroundImage: `url(${cards[0].image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundAttachment: "fixed",
                backgroundRepeat: "no-repeat",
                zIndex: -12,
              }}
            />

            <div
              key={cards[1].id}
              style={{
                width: "100vw",
                height: "100vh",
                flexShrink: 0,
                position: "fixed",
                top: 0,
                left: 0,
                backgroundImage: `url(${cards[1].image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundAttachment: "fixed",
                backgroundRepeat: "no-repeat",
                zIndex: -11,
                clipPath: animate
                  ? "inset(0 0% 0 0)"      // teljesen látszik (becsúszott)
                  : "inset(0 100% 0 0)",   // teljesen el van vágva jobbról (nem látszik)
                transition: "clip-path 0.6s ease",
              }}
            />

          </div>

          <h1 className="text-6xl text-center left-0 w-screen"
            style={{
              position: "absolute",
              top: "10%",
              color: "white",
            }}
          >
            Szobafestés, mázolás Budapesten és környékén
          </h1>
        </div>
        <p className="text-6xl text-center left-0 w-screen absolute top-[70%] text-white">efewfew</p>
        
      </div>

    </section>
  )
}

export default Header





/*export  function CardScroll() {
  const [cards, setCards] = useState([
    {
      id: "A",
      image:
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&q=80",
    },
    {
      id: "B",
      image:
        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&q=80",
    },
    {
      id: "C",
      image:
        "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&q=80",
    },
  ]);
  const [offset, setOffset] = useState(0);
  const [animate, setAnimate] = useState(true);

  const next = () => {
    setAnimate(true);
    setOffset(-STEP);
    setTimeout(() => {
      setCards((prev) => [...prev.slice(1), prev[0]]);
      setAnimate(false);
      setOffset(0);
    }, 500);
  };

  const prev = () => {
    setAnimate(false);
    setCards((prevCards) => {
      const last = prevCards[prevCards.length - 1];
      return [last, ...prevCards.slice(0, -1)];
    });
    setOffset(-STEP);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setAnimate(true);
        setOffset(0);
      });
    });
  };

  useEffect(() => {
    const id = setInterval(() => {
      next();
    }, 2000);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ padding: "2rem 0" }}>
      <div
        style={{
          position: "relative",
          height: 200,
          width: CARD_WIDTH,
          margin: "0 auto",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            display: "flex",
            gap: GAP,
            transform: `translateX(${offset}px)`,
            transition: animate ? "transform 0.5s ease" : "none",
          }}
        >
          {cards.map((card) => (
            <div
              key={card.id}
              style={{
                width: CARD_WIDTH,
                height: 160,
                borderRadius: 12,
                flexShrink: 0,
                backgroundImage: `url(${card.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          ))}
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "8px 10px",
            background:
              "linear-gradient(to top, rgba(0,0,0,0.65), rgba(0,0,0,0))",
            color: "white",
            fontSize: 14,
            fontWeight: 500,
            pointerEvents: "none",
          }}
        >
          Explore now
        </div>
      </div>

      <div
        style={{
          textAlign: "center",
          marginTop: "1.5rem",
          display: "flex",
          gap: 8,
          justifyContent: "center",
        }}
      >
        <button onClick={prev}>← Scroll left</button>
        <button onClick={next}>Scroll right →</button>
      </div>
    </div>
  );
}
*/
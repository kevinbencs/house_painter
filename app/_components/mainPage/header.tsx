"use client"
import { useState, useEffect } from "react";


const Header = () => {
  const [cards, setCards] = useState([
    {
      id: "A",
      image:
        "api/images/home.jpg",
    },
    {
      id: "B",
      image:
        "api/images/zold-fal.jpeg",
    },

  ]);
  const [animate, setAnimate] = useState(true);

  const next = () => {

    setAnimate(true);
    setTimeout(() => {
      setCards((prev) => [...prev.slice(1), prev[0]]);
      setAnimate(false);
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
                  ? "inset(0 0% 0 0)"      
                  : "inset(0 100% 0 0)",  
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



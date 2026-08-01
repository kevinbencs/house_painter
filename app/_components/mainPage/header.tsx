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
        <div className="md: relative md:h-screen md:w-full md:m-0 mt-auto mb-auto"
          
        >
          <div className={`flex  md:absolute md:top-0 md:left-0`}
          >

            <div className={`md:w-screen md:h-screen -z-20 bg-fixed bg-cover bg-center bg-no-repeat shrink-0 min-w-screen md:min-w-auto min-h-200 md:min-h-auto`}
              key={cards[0].id}
              style={{
                backgroundImage: `url(${cards[0].image})`,
              }}
            />

            <div className={`md:w-screen md:h-screen -z-10 fixed top-0 left-0 bg-fixed bg-cover bg-center bg-no-repeat shrink-0 min-w-screen md:min-w-auto min-h-200 md:min-h-auto`}
              key={cards[1].id}
              style={{ 
                backgroundImage: `url(${cards[1].image})`,
                clipPath: animate
                  ? "inset(0 0% 0 0)"      
                  : "inset(0 100% 0 0)",  
                transition: "clip-path 0.6s ease",
              }}
            />

          </div>

          <h1 className="text-6xl text-center left-0 w-screen text-shadow-lg text-shadow-gray-700 text-white top-10 absolute"
          >
            Szobafestés, mázolás Budapesten és környékén
          </h1>
        </div>
        <p className="text-3xl md:text-6xl text-center left-0 w-screen absolute top-[70%] text-white text-shadow-lg text-shadow-gray-700">
          Budapest teljes területén minden munka FELMÉRÉSE és az ÁRAJÁNLAT KÉSZÍTÉSE <span className="text-red-700">DÍJTALAN!</span>
        </p>
        
      </div>

    </section>
  )
}

export default Header



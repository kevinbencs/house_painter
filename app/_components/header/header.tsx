'use client'

import { useEffect, useState } from 'react';
import Menu from "./menu"



function getScrollClass() {
  return 'translate-y-0';
};

function getDurationClass() {
  return 'duration-0';
};

const Header = (props: { mainPos: number }) => {

  const [scrollClass, setScrollClass] = useState<string>(getScrollClass);
  const [scrollCoo, setscrollCoo] = useState<number>(0);
  const [topbarDuration, setTopbarDuration] = useState<string>(getDurationClass);


  useEffect(() => {

    const handleScroll = () => {
      const position = window.scrollY;

      if (position - scrollCoo > 0 && position > 0 && props.mainPos <= 0) {
        setScrollClass(() => '-translate-y-96');
      }
      else {
        setScrollClass(() => 'translate-y-0');
      }
      setscrollCoo(position);

      if (position <= 100) {
        setTopbarDuration(() => 'duration-0');
        setScrollClass(() => '');
      }
      else {
        setTopbarDuration(() => 'duration-500');
      }
    };



    if (typeof window !== 'undefined') {
      window.addEventListener("scroll", handleScroll, { passive: true });
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener("scroll", handleScroll);
      }
    };
  }, [props.mainPos, scrollCoo])



  return (
    <header className={` bg-gray-900 text-white sticky top-0 z-20  ${topbarDuration} lg:${scrollClass}`}>
      <div className='justify-between pt-3 pb-3  pr-5 pl-5 '>
        <Menu />
      </div>
    </header>
  )
}

export default Header;
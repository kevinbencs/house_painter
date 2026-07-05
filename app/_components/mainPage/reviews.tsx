"use client"
import { ReviewType } from "@/typeScriptType/review";
import Image from "next/image";
import { useState, useEffect } from "react";


const CARD_WIDTH = 400;
const STEP = CARD_WIDTH ;

const CARD_WIDTH_CLASS = CARD_WIDTH + 'px'
const CARD_Container_WIDTH_CLASS = CARD_WIDTH * 5 + 'px'

const CARD_WIDTH_CLASS_HALF = CARD_WIDTH / 2 + 'px'

const Reviews = (props: { data: ReviewType[] }) => {

  const [cards, setCards] = useState<ReviewType[]>(props.data);
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



  useEffect(() => {
    const id = setInterval(() => {
      next();
    }, 2000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className={`pl-[calc(50%-${CARD_WIDTH_CLASS_HALF})] xl:pl-0`}>
      <div className={` w-[${CARD_WIDTH_CLASS}]  overflow-hidden xl:w-auto   `}>
        <div className={`w-[${CARD_Container_WIDTH_CLASS}]`} >
          <div className={`relative top-0 left-0 flex gap-[20px]`}
            style={{
              transform: `translateX(${offset}px)`,
              transition: animate ? "transform 0.5s ease" : "none",
            }}
          >

            {cards.map((review: any, i: number) => (
              <div key={'review' + i} className={`w-[${CARD_WIDTH_CLASS}] flex flex-col items-center gap-2 `} >
                <Image src={review.profile_photo_url} width={100} height={100} alt={`${review.author_name}'s image`} />
                <div className='font-bold'>{review.author_name}</div>
                <span>{'⭐'.repeat(review.rating)}</span>
                <p className='text-center'>{review.text}</p>
              </div>
            ))}

          </div>
        </div>
      </div>
    </div>
  );
}

export default Reviews






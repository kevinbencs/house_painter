'use client'
import { SetStateAction, Dispatch, KeyboardEvent, useRef, useState, useEffect, MutableRefObject } from 'react';
import Image from 'next/image';

type Dispatcher<T> = Dispatch<SetStateAction<T>>;

interface imageUrl {
    url: string,
    detail: string,
    _id: string
}

const ImgItem = (props: {  setImageId: Dispatcher<string>,  setOptClass: Dispatcher<string>, item: imageUrl, setOptInput: Dispatcher<string>, optRef: MutableRefObject<HTMLInputElement | null> }) => {
    const liRef = useRef<null | HTMLLIElement>(null);
    const [liTop, setLiTop] = useState<number>(0);
    const [liLeft, setLiLeft] = useState<number>(0);
    const [showImage, setShowImage] = useState<boolean>(false);
    const liDivRef = useRef<null | HTMLDivElement>(null)

    useEffect(() => {
        if (liRef.current) {
            setLiLeft(liRef.current?.getBoundingClientRect().right)
            setLiTop(liRef.current?.getBoundingClientRect().top)
        }

    }, [liRef.current?.getBoundingClientRect().top, liRef.current?.getBoundingClientRect().left])

    const handleMouseEnter = () => {
        setShowImage(true);
    }

    const handleMouseLeave = () => {
        setShowImage(false);   
    }

    const handleClick = () => {
        props.setOptInput(props.item.detail);
        props.setImageId(props.item._id)
        setTimeout(() => {
            props.optRef.current?.blur();
            liRef.current?.blur();
            liDivRef.current?.blur();
        }, 0);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.code === 'Enter' || e.code === 'Space') handleClick();
    }

    const liOnFocus = () => {
        if (!showImage) {
            props.setOptClass(`h-52`);
            setShowImage(true);

        }
    }

    const handleBlur = () =>{
        setShowImage(false);
        props.setOptClass('h-0');
    }


    return (
        <li ref={liRef}  onMouseLeave={handleMouseLeave} onMouseEnter={handleMouseEnter} 
            className='cursor-pointer hover:bg-slate-400 input-bordered border-b-2 p-1 pl-2 dark:hover:text-white'>
            <div ref={liDivRef} onClick={handleClick} onKeyDown={(e) => handleKeyDown(e)} tabIndex={0} onFocus={liOnFocus} onBlur={handleBlur} >
                {props.item.detail}
            </div>

            {showImage && 
                <Image src={props.item.url} unoptimized={true} alt={props.item.detail} width={300} height={100} className={`fixed  w-[600px] z-50 `} style={{ left: liLeft - 600, top: liTop }} />
            }

        </li>)
}


export default ImgItem
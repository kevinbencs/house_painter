'use client'

import { Dispatch, SetStateAction, useState, KeyboardEvent } from 'react'
import {v4 as uuid } from 'uuid';

const Themes = (props: { themes: string[], setThemes: Dispatch<SetStateAction<string[]>> }) => {
    const [theme, setTheme] = useState<string>('');

    const handleClick = () => {
        if (theme !== '' && props.themes.indexOf(theme) === -1) {
            props.setThemes([...props.themes, theme]);
        }
    }

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (theme !== '' && props.themes.indexOf(theme) === -1 && e.code === 'Enter') {
            props.setThemes([...props.themes, theme]);
        }
    }

    const handleClickDelete = (s: string) => {
        props.setThemes(props.themes.filter(item => item !== s))
    }

    const handleKeyDownDelete = (e: KeyboardEvent<SVGSVGElement>, item: string) => {
        if (e.code === 'Enter' || e.code === 'Space') handleClickDelete(item)
    }

    return (
        <>
            <div className=' flex-wrap mb-8'>
                <input type="text" placeholder='Add themes' value={theme} onChange={(e) => setTheme(e.target.value)} className='focus-within:outline-none dark:text-white input-bordered border-b-2 inline-block bg-transparent pl-2 lg:w-[30%] w-full mr-5' onKeyDown={handleKeyDown}/>
                <h3 className='inline-block pl-2'>
                    Themes:
                </h3>
                <ul className='lg:ml-[calc(30%+20px)] ml-2 lg:w-[30%] w-[calc(99%-8px)]'>
                    {props.themes.map((item: string) => <li className=' flex gap-5 bg-slate-600 justify-between p-1 pl-2 pr-2 rounded text-white mt-3' key={uuid()}>
                        {item}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 cursor-pointer" onClick={() => handleClickDelete(item)} tabIndex={0} onKeyDown={(e) => handleKeyDownDelete(e, item)}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>

                    </li>)}
                </ul>
            </div>
            <input type="button" value="Add theme" onClick={handleClick} className='bg-slate-600 text-white cursor-pointer hover:bg-slate-400 rounded p-2' />
        </>


    )
}

export default Themes
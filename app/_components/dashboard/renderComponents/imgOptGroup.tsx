'use client'

import { useRef, useState, ChangeEvent, useEffect, Dispatch, SetStateAction } from 'react';
import ImgItem from './imgItem';
import {
    useQuery,
} from '@tanstack/react-query'



interface imageUrl {
    url: string,
    alt: string,
    detail: string,
    _id: string
}

const fetcher = async (url: string): Promise<{ success: imageUrl[] }> => {
    const res = await fetch(url);

    if (!res.ok) {
        const error = new Error('An error occurred while fetching the data.')
        error.cause = await res.json().then((res: { error: string }) => res.error)
        console.error(error.cause)

        throw error
    }

    return res.json()
}

type Dispatcher<T> = Dispatch<SetStateAction<T>>

const ImgOptgroup = (props: { imageCopyMessage: string, setImageCopyMessage: Dispatcher<string>, setError: Dispatch<SetStateAction<string | undefined>>, setSuccess: Dispatch<SetStateAction<string | undefined>>, isPending: boolean, reset: boolean }) => {
    const [optInput, setOptInput] = useState<string>('');
    const [optClass, setOptClass] = useState<string>('h-0')
    const [imageId, setImageId] = useState<string>('');

    const optRef = useRef<null | HTMLInputElement>(null);
    //const {data, error, isLoading} = useSWR<{success: imageUrl[]}, Error>('/api/img',fetcher)

    const { isLoading, error, data } = useQuery<{success: imageUrl[]}>({
        queryKey: ['repoData'],
        queryFn: () =>
            fetch('/api/img').then((res) =>
                res.json(),
            ),
    })

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setOptInput(e.target.value)
        setImageId('');
        props.setSuccess('');
        props.setImageCopyMessage('Click to copy.');
    };

    useEffect(() => {
        setOptInput('');
        setImageId('')
    }, [props.reset])


    const handleFilter = (arrayItem: imageUrl) => {
        return arrayItem.detail.toLowerCase().indexOf(optInput.toLowerCase()) > -1;
    }

    const handleClick = () => {
        if (imageId !== '') {
            navigator.clipboard.writeText(imageId)
                .then(() => {
                    props.setImageCopyMessage('Id is copied.');
                })
                .catch(err => {
                    props.setImageCopyMessage('Something went wrong.')
                    console.error("Error", err);
                });
        }
    }

    if(error instanceof Error ) props.setError(error.message)

    return (
        <div className='lg:w-[calc(60%+20px)] w-full'>

            <label className='relative w-full mb-4 block'>
                <input ref={optRef} type="text" name='search_image' onFocus={() => setOptClass('h-52')} onBlur={() => setOptClass('h-0')} className='dark:text-white focus-within:outline-none input-bordered border-b-2 block w-full bg-transparent pl-2' placeholder='Image' value={optInput} onChange={handleChange} disabled={props.isPending} />
                <ul className={`${optClass} overflow-y-scroll absolute sidebar z-10  w-full dark:bg-neutral bg-base-200 duration-100 `} onFocus={() => setOptClass('h-52')} onBlur={() => { setOptClass('h-0'); }}>
                    {error instanceof Error && <div className='text-red-700'>{error.message}</div>}
                    {isLoading && <div>...Loading</div>}
                    
                    {(data && data.success) && data.success.filter(handleFilter).map((item) => <ImgItem setImageId={setImageId} key={item._id} item={item} setOptClass={setOptClass} setOptInput={setOptInput} optRef={optRef} />
                    )}
                </ul>
            </label>
            <div>
                <div className='text-end text-xs mb-1'>
                    {props.imageCopyMessage}
                </div>
                <div className='relative'>
                    <svg xmlns="http://www.w3.org/2000/svg" onClick={handleClick} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 absolute right-0 cursor-pointer" >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
                    </svg>
                    <input type="text" placeholder='id' value={imageId} readOnly className={`dark:text-white focus-within:outline-none input-bordered border-b-2 block w-full bg-transparent pl-2 min-h-[26px] mb-10 `} />

                </div>
            </div>

        </div>

    )
}

export default ImgOptgroup
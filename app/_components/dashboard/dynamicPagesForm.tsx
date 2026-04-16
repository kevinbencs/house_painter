"use client"

import { useActionState, useState, useEffect, useRef, ReactNode } from "react"
import { useRouter } from "next/navigation";
import * as z from 'zod';
import { v4 as uuid } from "uuid";


import { chooseTypeOfTextItem } from "./renderComponents/showPage";
import Bold_italic from "./renderComponents/boldItalic";
import Link_Anchor from "./renderComponents/linkAnchor";
import List_embedded from "./renderComponents/listEmbedded";
import Themes from "./renderComponents/themes";
import ImgOptgroup from "./renderComponents/imgOptGroup";
import Img from "./renderComponents/img";
import {
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'

const queryClient = new QueryClient()


const DynamicPagesForm = (props: {
    params: { year: string, month: string, day: string, title: string },
    res: {
        error: string,
        failed: undefined,
        data: undefined,
    } | {
        failed: z.ZodIssue[],
        error: undefined,
        data: undefined,
    } | {
        data: {
            title: string,
            text: string,
            cover_img_id: string,
            keyword: string[],
            id: string,
            detail: string,
        };
        error: undefined,
        failed: undefined,
    },
    serverAction: () => Promise<{
        message: string;
        error?: undefined;
    } | {
        error: string;
        message?: undefined;
    }>
}) => {

    const [text, setText] = useState<(string | ReactNode)[]>(['']);
    const [coverImageId, setCoverImageId] = useState<string>('');
    const [detail, setDetail] = useState<string>('');
    const router = useRouter();

    const [lastText, setLastText] = useState<string[]>([])

    const [themes, setThemes] = useState<string[]>([]);

    const [imageCopyMessage, setImageCopyMessage] = useState<string>('Click to copy');

    const [titleInput, setTitleInput] = useState<string>('');

    const [paragraphInput, setParagraphInput] = useState<string>('');
    const [paragPlaceholder, setParagPlaceholder] = useState<string>('placeholder');

    const [textError, setTextError] = useState<string>('');

    const [success, setSuccess] = useState<string | undefined>('');
    const [error, setError] = useState<string | undefined>('');
    const [failed, setFailed] = useState<undefined | z.ZodIssue[]>([])

    const TextEnterRef = useRef<null | HTMLParagraphElement>(null);

    const [state, action, isPending] = useActionState(props.serverAction, null)


    const bold_italic: string[] = ['bold', 'italic'];
    const link_anchor: string[] = ['Link', 'anchor_link'];
    const list_embedded = [
        { text: 'image', textElem: '<Image id=()/>' },
        { text: 'list', textElem: '<ul>item1<list>item2<list>item3</ul>' },
        { text: 'title', textElem: '<title></title>' },
        { text: 'highlight', textElem: '<highlight></highlight>' },
    ]

    useEffect(() => {

        if (props.res.data) {
            setTitleInput(props.res.data.title);
            setParagraphInput(props.res.data.text.split('$').join('\n\n'));
            setCoverImageId(props.res.data.cover_img_id)
            setThemes(props.res.data.keyword)
            if (TextEnterRef.current) TextEnterRef.current.innerText = `${props.res.data.text.split('$').join('\n')}`
            setParagPlaceholder('');
            setDetail(props.res.data.detail);
        }
        if (props.res.error) router.push('/')
        if (props.res.failed) setFailed(props.res.failed);

    }, [])

    useEffect(() => {
        const Text = paragraphInput.split('\n').filter(item => item !== '');
        const Text2: (string | ReactNode)[] = [];
        setTextError('');
        for (let i = 0; i < Text.length; i++) {
            if (Text[i] !== lastText[i]) {
                Text2[i] = chooseTypeOfTextItem(Text[i], setTextError)

            }
            else {
                Text2[i] = text[i];
            }
        }

        setText(Text2);
        setLastText(paragraphInput.split('\n').filter(item => item !== ''))
    }, [paragraphInput])

    const handleParagraphChange = (e: React.ChangeEvent<HTMLParagraphElement>) => {
        setParagraphInput(e.target.innerText);
        if (e.target.innerText == '\n' || e.target.innerText === '') setParagPlaceholder('placeholder');
        else setParagPlaceholder('');
    }


    return (
        <>
            <form action="" className='mb-20 mt-10' onSubmit={(e) => e.preventDefault()}>
                <input type="text" name='title' className='focus-within:outline-none border-b-2 input-bordered block w-full mb-8 bg-transparent pl-2 dark:text-white' placeholder='Blog címe' value={titleInput} onChange={(e) => setTitleInput(e.target.value)} />
                <input type="text" name='cover_image_id' className='focus-within:outline-none border-b-2 input-bordered block w-full mb-8 bg-transparent pl-2 dark:text-white' placeholder='Cover kép id' value={coverImageId} onChange={(e) => setCoverImageId(e.target.value)} />
                <div className='max-w-96 mb-10'>
                    <Img id={coverImageId} />
                </div>

                <QueryClientProvider client={queryClient}>
                    <ImgOptgroup setError={setError} setImageCopyMessage={setImageCopyMessage} isPending={isPending} imageCopyMessage={imageCopyMessage} setSuccess={setSuccess} />
                </QueryClientProvider>

                <div>
                    <Themes themes={themes} setThemes={setThemes} />
                </div>

                <input type='text' value={detail} onChange={(e) => setDetail(e.target.value)} className='focus-within:outline-none border-b-2 input-bordered block w-full mt-10 mb-10 bg-transparent pl-2 dark:text-white' placeholder='Leírás' />

                <section className='flex gap-2 mb-10 flex-wrap'>
                    {bold_italic.map((item: string) => <Bold_italic text={item} TextEnterRef={TextEnterRef} key={uuid()} />)}
                    {link_anchor.map((item: string) => <Link_Anchor text={item} TextEnterRef={TextEnterRef} key={uuid()} />)}
                    {list_embedded.map(item => <List_embedded TextEnterRef={TextEnterRef} text={item.text} textElem={item.textElem} key={uuid()} />)}
                </section>

                <p contentEditable="true" className={`mt-10 focus-within:outline-none border p-3 rounded min-h-24 dark:text-white ${paragPlaceholder}`} onInput={handleParagraphChange} tabIndex={0} ref={TextEnterRef}></p>

                <div className='text-end'>
                    <input type="submit" value='Mentés' className='bg-slate-600 text-white cursor-pointer hover:bg-slate-400 rounded p-2 mt-10' />
                </div>

            </form>

            {textError !== '' &&
                <div className='text-5xl text-red-500 mb-40'>{textError}</div>
            }

            {success &&
                <div className='text-green-600 bg-green-600/15 p-2 text-center rounded-lg mb-40 font-bold'>{success}</div>
            }

            {error &&
                <div className='text-red-700 font-bold dark:bg-red-400/15 dark:text-red-500 text-center bg-red-700/25 rounded-lg mb-40  p-2'>
                    {error}
                </div>
            }
            {(failed && failed.length > 0) &&
                <div className='text-red-700 font-bold dark:bg-red-400/15 dark:text-red-500 bg-red-700/25 text-center rounded-lg mb-40  p-2'>
                    {failed.map(e => <p key={uuid()}>{e.message}</p>)}
                </div>
            }


            <div >

                <h2 className='mt-20 text-5xl mb-20 font-bold leading-normal'>{titleInput}</h2>
                <div className="lg:flex mt-10 mb-10 lg:gap-32 lg:flex-wrap">
                    <div className="lg:w-[calc(100%-450px)] mb-8">
                        {text}
                    </div>
                </div>
            </div>


        </>
    )
}

export default DynamicPagesForm
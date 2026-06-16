'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { Img } from '@/typeScriptType/img'

const Imag = (props: { id: string }) => {
    const [image, setImage] = useState<Img | null | undefined>(null);
    const [err, setErr] = useState<string>('')


    useEffect(() => {
        if (props.id === "" || props.id.length !== 24) setImage(null);
        else {
            fetch(`/api/images/id/${props.id}`)
                .then((res) => res.json())
                .then((res) => {

                    if (res.error) {
                        console.error(res.error);
                        setImage(null);
                        setErr(res.error)

                    }

                    if (res.success) {
                        setImage(res.success)
                        setErr('')
                    }
                })
                .catch((err) => {
                    console.error(err);
                    setImage(null);
                    setErr("Hiba kapcsolattal.");
                })
        }




    }, [props.id]);


    return (
        <div>
            {image &&
                <>
                    <Image src={`/api/images/${image.newUrl}`} unoptimized={true} alt={image.detail} className='w-full block mb-1' width={600} height={337.5} />
                    <div className='mb-10 text-xs'>{image.detail}</div>
                </>
            }
            {!image &&
                <>
                    <div className='text-red text-4xl'>There is no image</div>
                </>
            }
            {err &&
                <div className='text-red-600 text-xl'>{err}</div>
            }
        </div>

    )
}

export default Imag
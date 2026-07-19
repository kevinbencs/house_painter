

import Image from 'next/image'
import { Img } from '@/typeScriptType/img'
import { getImgById } from '@/lib/data'


const HeadingImgServerCompt = async (props: { id: string }) => {
    const image: (Img | null) = await getImgById(props.id)

    return (
        <div>
            {image &&
                <>
                    <Image src={`/api/images/${image.newUrl}`} unoptimized={true} alt={image.detail} className='w-full block mb-1' width={600} height={337.5} />
                </>
            }
            {!image &&
                <>
                    <div className='text-red text-4xl'>There is no image</div>
                </>
            }
        </div>

    )
}

export default HeadingImgServerCompt
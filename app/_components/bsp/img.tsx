import Image from 'next/image'

const ImgBSP = (props: {url: string, detail: string}) => {
  return (
    <Image alt={props.detail} src={'/img/'+props.url} width={300} height={150} className='w-60 object-cover'/>
  )
}

export default ImgBSP
import Image from 'next/image'

const ImgBSP = (props: {url: string, detail: string}) => {
  return (
    <Image alt={props.detail} src={'/api/images/'+props.url} width={100} height={50} className='w-60'/>
  )
}

export default ImgBSP
import Blog from '@/models/Blog';
import { BSP } from '@/typeScriptType/blogServPlace';
import { notFound } from 'next/navigation';
import { connection } from 'next/server';

const page = async({params}: {params: Promise<{heading: string}>}) => {
  await connection();
  const {heading} = await params;

  const data: BSP | null = await Blog.findOne({
    heading: heading.replaceAll('-',' ')
  })

  if (data === null) notFound();
  
  return (
    <section>
      <h1>{heading.replaceAll('-',' ')}</h1>
    </section>
  )
}

export default page
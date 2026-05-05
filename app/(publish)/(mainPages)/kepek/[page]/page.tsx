import Main from '@/app/_components/image/main'
import { Suspense } from 'react'

const Page = async ({ params }: { params: Promise<{ page: string }> }) => {


  return (
    <section className='mb-40'>
      <h1 className='text-3xl mb-10'>Képek</h1>
      <Suspense fallback={<div>...Betöltés</div>}>
        <Main params={params} />
      </Suspense>
    </section>


  )
}

export default Page
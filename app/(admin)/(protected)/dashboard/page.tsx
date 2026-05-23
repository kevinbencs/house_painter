import Step1 from '@/app/_components/dashboard/main/chart';
import { checkAuth } from '@/lib/checkAuth';
import { redirect } from 'next/navigation';
import React from 'react'

const page = async () => {
  /*const auth = await checkAuth()

  if (auth.error) redirect('/');*/
  
  return (
    <div className='w-full'>
      <Step1/>
    </div>
  )
}

export default page
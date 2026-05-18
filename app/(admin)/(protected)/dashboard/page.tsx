import { checkAuth } from '@/lib/checkAuth';
import { redirect } from 'next/navigation';
import React from 'react'

const page = async () => {
  const auth = await checkAuth()

  if (auth.error) redirect('/');
  
  return (
    <div>page</div>
  )
}

export default page
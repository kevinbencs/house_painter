'use client' 
 
import { useEffect } from 'react'
 
export default function ErrorPage({
  error,
  retry,
}: {
  error: Error & { digest?: string }
  retry: () => void
}) {
  useEffect(() => {
    
    console.error(error)
  }, [error])
 
  return (
    <div className='flex flex-col items-center'>
      <h2 className='mb-2 text-lg'>Valami hiba történt!</h2>
      <button className='bg-mauve-900 rounded-lg text-white p-2'
        onClick={
          
          () => retry()
        }
      >
        Próbáld újra
      </button>
    </div>
  )
}

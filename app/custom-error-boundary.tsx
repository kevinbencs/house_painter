'use client'

import { catchError, type ErrorInfo } from 'next/error'

function ErrorFallback(props: { title: string }, { error, retry }: ErrorInfo) {
  const message = error instanceof Error ? error.message : String(error)
  return (
    <div className='flex'>
      <h2>{props.title}</h2>
      <p>{message}</p>
    </div>
  )
}

export default catchError(ErrorFallback)
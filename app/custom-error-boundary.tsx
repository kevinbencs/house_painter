'use client'

import { catchError, type ErrorInfo } from 'next/error'

function ErrorFallback(props: { title: string }, { error, retry }: ErrorInfo) {
  const message = error instanceof Error ? error.message : String(error)
  return (
    <div className='flex flex-wrap'>
      <h2>{props.title}</h2>
      <p>{message}</p>
      <button onClick={() => retry()}>Try again</button>
    </div>
  )
}

export default catchError(ErrorFallback)
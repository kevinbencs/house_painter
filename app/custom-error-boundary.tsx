'use client'
 
import { catchError, type ErrorInfo } from 'next/error'
 
function ErrorFallback(props: { title: string }, { error, retry }: ErrorInfo) {
  return (
    <div>
      <h2>{props.title}</h2>
      <p>{error.message}</p>
      <button onClick={() => retry()}>Try again</button>
    </div>
  )
}
 
export default catchError(ErrorFallback)
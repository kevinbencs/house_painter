"use client"
import { logout } from '@/action/logout';
import { useContext, createContext, useState, ReactNode, useEffect, useCallback, useRef } from 'react'

type LoggedContextType = {
  Timer: number
}

const TIMEOUT_MS = 6 * 60 * 1000;

const LoggedContext = createContext<undefined | LoggedContextType>(undefined)


export const IsLoggedProvider = ({ children }: { children: ReactNode }) => {
  const [Timer, setTimer] = useState(TIMEOUT_MS / 1000)
  const logoutTimeRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);


  const startCountdown = () => {
    const id = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(id);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    countdownRef.current = id;
  };

  const resetTimer = useCallback(async () => {
    if (logoutTimeRef.current) clearTimeout(logoutTimeRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);

    setTimer(TIMEOUT_MS / 1000);

    startCountdown()

    logoutTimeRef.current = setTimeout(() => {
      logout()
    }, TIMEOUT_MS)
  }, [])


  useEffect(() => {


    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];

    events.forEach(e => window.addEventListener(e, resetTimer));
    resetTimer();

    return () => {
      events.forEach(e => window.removeEventListener(e, resetTimer));
      if (logoutTimeRef.current) clearTimeout(logoutTimeRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current)
    }

  }, [resetTimer])

  return (
    <LoggedContext.Provider value={{ Timer }}>
      {children}
    </LoggedContext.Provider>
  )
}


export const useLogged = () => {
  const context = useContext(LoggedContext)

  if (typeof context === 'undefined') {
    throw new Error('useLogged must be use in isLoggedProvider')
  }

  return context;
}
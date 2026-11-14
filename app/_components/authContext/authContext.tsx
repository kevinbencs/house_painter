"use client"
import { logout } from '@/action/logout';
import { useContext, createContext, useState, ReactNode, useEffect, useCallback, useRef } from 'react'

type authContextType = {
  Timer: number,
  link: string,
  setLink: (val: string) => void
}

const TIMEOUT_MS = 10 * 60 * 1000;

const AuthContext = createContext<undefined | authContextType>(undefined)


export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [Timer, setTimer] = useState(TIMEOUT_MS / 1000)
  const logoutTimeRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [link, setLink] = useState<string>('');


  useEffect(() => {
    const fetchAuth = async () => {
      try {
        const data = await fetch("/api/auth");

        const jsonData = await data.json();

        if(jsonData.link){
          setLink(jsonData.link)
        }


      } catch (error) {
        console.log(error)
      }

    }

    fetchAuth()
  }, [])


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

    logoutTimeRef.current = setTimeout(async () => {
      await logout()
      setLink('')
    }, TIMEOUT_MS)
  }, [])


  useEffect(() => {

    if (link !== '') {
      const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];

      events.forEach(e => window.addEventListener(e, resetTimer));
      resetTimer();

      return () => {
        events.forEach(e => window.removeEventListener(e, resetTimer));
        if (logoutTimeRef.current) clearTimeout(logoutTimeRef.current);
        if (countdownRef.current) clearInterval(countdownRef.current)
      }

    }
    else {
      const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];

      events.forEach(e => window.removeEventListener(e, resetTimer));
      if (logoutTimeRef.current) clearTimeout(logoutTimeRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current)

    }


  }, [resetTimer, link])

  return (
    <AuthContext.Provider value={{ Timer, link, setLink }}>
      {children}
    </AuthContext.Provider>
  )
}


export const useAuth = () => {
  const context = useContext(AuthContext)

  if (typeof context === 'undefined') {
    throw new Error('useLogged must be use in isLoggedProvider')
  }

  return context;
}
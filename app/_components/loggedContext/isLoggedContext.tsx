"use client"
import {useContext, createContext, useState, ReactNode, useEffect } from 'react'

type LoggedContextType = {
  IsLogged: boolean,
  setLogged: (val: boolean) => void
}

const LoggedContext = createContext<undefined | LoggedContextType>(undefined)


export const IsLoggedProvider = ({children, user}: {children: ReactNode, user: boolean}) => {
  const [IsLogged, setLogged] = useState<boolean>(user);
  

  useEffect( () => {
    
  },[])

  return (
    <LoggedContext.Provider value={{IsLogged, setLogged}}>
      {children}
    </LoggedContext.Provider>
  )
}


export const useLogged = () => {
  const context = useContext(LoggedContext)

  if(typeof context === 'undefined'){
    throw new Error ('useLogged must be use in isLoggedProvider')
  }

  return context;
}
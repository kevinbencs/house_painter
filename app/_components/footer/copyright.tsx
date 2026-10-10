'use client'

import { useEffect, useState } from "react";

const Copyright = () => {
    const copyright = ('\u00A9');

    const [year, setYear] = useState<number>(2020)

    useEffect(() => {
      setYear(new Date().getFullYear())
    },[])
    
  return (
    <div className='text-center pb-4 text-xs'>Copyright 2020-{year} {copyright} Bencs Kornél</div>
  )
}

export default Copyright
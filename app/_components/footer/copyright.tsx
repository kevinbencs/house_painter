'use client'

const Copyright = () => {
    const copyright = ('\u00A9');
    const year = new Date().getFullYear()
  return (
    <div className='text-center pb-4 text-xs'>Copyright 2020-{year} {copyright} Bencs Kornél</div>
  )
}

export default Copyright
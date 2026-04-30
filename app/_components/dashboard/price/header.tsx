import React from 'react'

const Header = (props: {item: string}) => {
  return (
    <h2 className='text-2xl border-b-2 border-black pb-2'>{props.item}</h2>
  )
}

export default Header
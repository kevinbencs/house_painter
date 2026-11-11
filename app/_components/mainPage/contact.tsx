'use client'

import ToFormButton from '../sendMessage/toFormButton'
import { useScrollReveal } from './useScrollReveal';

const Contact = () => {
  const { ref, isVisible } = useScrollReveal();
  return (
    <div className={`text-center mb-40 text-2xl reveal ${isVisible ? 'active' : ''}`} ref={ref}>
      <p className='p-5'>Amennyiben szoba-, lakás-, vagy házfelújításban gondolkodik, vegye fel velem a kapcsolatot.</p>
      <div>Hívjon az alábbi számon</div>
      <div><a href="tel:+3670">+36-70</a></div>
      <div className='mt-2 mb-2'>vagy</div>
      <ToFormButton />
    </div>

  )
}

export default Contact
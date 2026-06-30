'use client'

import ToFormButton from '../sendMessage/toFormButton'
import { useScrollReveal } from './useScrollReveal';

const Contact = () => {
  const { ref, isVisible } = useScrollReveal();
  return (
    <div className={`text-center mb-40 text-2xl reveal ${isVisible ? 'active' : ''}`} ref={ref}>
      <p>Amennyiben szoba-, lakás-, vagy házfelújításban gondolkodik, vegye fel velem a kapcsolatot.</p>
      <ToFormButton />
    </div>

  )
}

export default Contact
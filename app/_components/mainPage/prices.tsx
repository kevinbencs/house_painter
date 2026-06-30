'use client'

import Link from 'next/link'
import { useScrollReveal } from './useScrollReveal';

const Prices = () => {
  const { ref, isVisible } = useScrollReveal();
  return (
    <p className={`text-center mb-40 text-2xl reveal ${isVisible ? 'active' : ''}`}  ref={ref}>
      Szeretné megtudni mennyibe kerülne Önnek a festés, tapétázás és egyéb felújítási munkálatok? Kattintson az alábbi <Link href="/arak" className='bg-mauve-900 text-white p-1 hover:underline rounded-md'>linkre.</Link>
    </p>
  )
}

export default Prices
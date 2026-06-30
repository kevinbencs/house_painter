"use client"

import { useScrollReveal } from "./useScrollReveal";

const About = () => {
  const { ref, isVisible } = useScrollReveal();
  return (
    <div className={`text-center mb-40  p-5 pt-40 pb-40 rounded-2xl text-base font-mono italic reveal ${isVisible ? 'active' : ''}`} ref={ref}>
      <p className="text-center mb-10">Közel 30 év szakmai tapasztalattal rendelkezem, melyből 8 évet Németországban töltöttem. 2020 óta vagyok vállalkozó. Kisebb, nagyobb munkákat is szívesen vállalok mint beázások (amiket a biztosító általában ki szokott fizetni), lakások, házak tisztasági festése, glettelése, mázolása. A célom az Ügyfél elképzelései szerint kiváló minőségben valósítsam meg az álmait.</p>
    </div>
    
  )
}

export default About
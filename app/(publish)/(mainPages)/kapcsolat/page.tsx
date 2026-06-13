
import ToFormButton from "@/app/_components/sendMessage/toFormButton"



const page = () => {
  return (
    <>
      <div className=" mb-20 bg-mist-900 text-white h-60 lg:h-52 flex flex-col items-center m-5 pt-10 text-center">
        <h1 className='text-3xl  mb-5'>Vedd fel velem a kapcsolatot</h1>
        <p className="max-w-[700px] ">Kérj ingyenes árajánlatot most, legyen szó tisztasági festésről, szobafestésről, kisebb hibák javításáról vagy akár egy egész lakás vagy ház kifestéséről. </p>
      </div>

      <div className="lg:pl-[calc(50%-450px)] lg:pr-[calc(50%-450px)] pl-2 pr-2 text-center">
        <div className="mb-20">
          <div className="text-2xl mb-5">Az ingyenes árajánlhoz töltsd ki az űrlapot</div>
          <ToFormButton/>
        </div>


        <div className="text-2xl">Nem akarod az űrlapot kitölteni?</div>
        <div>Hívj bátran</div>
        <div>+36</div>
        <div>Vagy írj email-t az alábbi címre</div>
        <div>...@gmail.com</div>



      </div>


    </>
  )
}

export default page
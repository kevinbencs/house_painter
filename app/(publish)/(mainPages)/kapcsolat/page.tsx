
import ToFormButton from "@/app/_components/sendMessage/toFormButton"
import { PiPhoneOutgoingFill } from "react-icons/pi";
import { MdEmail } from "react-icons/md";




const page = () => {
  return (
    <>
      <div className=" mb-20 bg-mist-900 text-white h-60 lg:h-52 flex flex-col items-center m-5 pt-10 text-center">
        <h1 className='text-3xl  mb-5'>Vegye fel velem a kapcsolatot</h1>
        <p className="max-w-[700px] ">Kérjen ingyenes árajánlatot most, legyen szó tisztasági festésről, szobafestésről, kisebb hibák javításáról vagy akár egy egész lakás vagy ház kifestéséről. </p>
      </div>

      <div className="lg:pl-[calc(50%-450px)] lg:pr-[calc(50%-450px)] pl-2 pr-2 text-center">
        <div className="mb-32">
          <p className="text-2xl mb-5">Az ingyenes árajánlathoz töltse ki az űrlapot</p>
          <ToFormButton />
        </div>

        <div className="mb-10">
          <p className="text-xl mb-5">Nem akarja kitölteni az űrlapot?</p>
          <div >Hívjon bátran</div>
          <div className="mb-3 flex justify-center items-center gap-2">< PiPhoneOutgoingFill /> +36</div>
          <div >Vagy írjon email-t az alábbi címre</div>
          <a href="mailto:examapmle@example.com" className="flex justify-center items-center gap-2 hover:underline"><MdEmail /> ...@exapmle.com</a>
        </div>

        <p className="mb-5">
          Ingyenes árajánlataim tartalmazzák a munkadíjat, valamint a festékek és egyéb kiegészítők becsült költségeit is, így a kezdetektől fogva teljes átláthatóságot biztosítok.
        </p>

        <p className="mb-20">
          Ha velem dolgozik, figyelmesen meghallgatom igényeit, és azokat valóra váltom, mindenekelőtt az Ön elégedettségét szem előtt tartva, minden kompromisszum nélkül.
        </p>



      </div>


    </>
  )
}

export default page
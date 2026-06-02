import SendMessageForm from './sendMessage'
import { PiPhoneOutgoingFill } from "react-icons/pi";
import { MdEmail } from "react-icons/md";

const SendMessageContainer = () => {
    return (
        <div className="flex justify-around flex-wrap p-2  bg-mist-900 dark text-white pt-8 pb-8 gap-4">
            <section className='lg:max-w-[800px] mb-20 lg:w-[60%] '>
                <h2 className='text-3xl mb-6'>Maradjunk kapcsolatban</h2>
                <div className='mb-8'>Küldjön egy üzenetet vagy e-mailt; hamarosan felveszem Önnel a kapcsolatot, és ingyenes, kötelezettségvállalás nélküli árajánlatot küldök Önnek.</div>

                <div className='flex gap-3  items-center mb-4'>
                    <PiPhoneOutgoingFill />
                    +00-00/000-00-00
                </div>
                <div className='flex gap-3  items-center'>
                    <MdEmail />
                    ben@....
                </div>



            </section>
            <SendMessageForm />
        </div>
    )
}

export default SendMessageContainer
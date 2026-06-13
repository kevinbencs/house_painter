

const SideBar = () => {
    return (
        <ul className="hidden lg:flex gap-3 lg:flex-col lg:justify-center fixed left-2 top-0 h-screen z-10">
            <li>
                <a href="https://www.facebook.com" target='_blank'>

                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="25" height="25" viewBox="0 0 48 48" className=" hover:fill-slate-500" >
                        <path   d="M24 5A19 19 0 1 0 24 43A19 19 0 1 0 24 5Z"></path><path fill="#FFFFFF" d="M26.572,29.036h4.917l0.772-4.995h-5.69v-2.73c0-2.075,0.678-3.915,2.619-3.915h3.119v-4.359c-0.548-0.074-1.707-0.236-3.897-0.236c-4.573,0-7.254,2.415-7.254,7.917v3.323h-4.701v4.995h4.701v13.729C22.089,42.905,23.032,43,24,43c0.875,0,1.729-0.08,2.572-0.194V29.036z"></path>
                    </svg>
                </a>
            </li>
            <li>
                <a href="https://www.instagram.com" target='_blank'>
                    
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-brand-instagram  fill-white hover:fill-slate-500" width="24" height="24" viewBox="0 0 24 24" 
                    stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"> 
                     <rect x="4" y="4" width="16" height="16" rx="4"  /> <circle cx="12" cy="12" r="3" /> <line x1="16.5" y1="7.5" x2="16.5" y2="7.501" /> 
                    </svg>
                </a>
            </li>
        </ul>
    )
}




export default SideBar;
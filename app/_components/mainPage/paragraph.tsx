'use client'
import { useScrollReveal } from "./useScrollReveal"
import Link from "next/link"

const Paragraph = (props: { text1: string, text2: string, linkText: string | undefined, linkHref: string | undefined }) => {
    const { ref, isVisible } = useScrollReveal();
    return (
        <p className={`text-center reveal ${isVisible ? 'active' : ''}`} ref={ref}>
            {props.text1 } 
            {(props.linkText && props.linkHref) &&
                <Link className={`bg-mauve-900 text-white p-1 hover:underline rounded-md`} href={props.linkHref}>{props.linkText}</Link> 
            }
            {props.text2}
        </p>
    )
}

export default Paragraph
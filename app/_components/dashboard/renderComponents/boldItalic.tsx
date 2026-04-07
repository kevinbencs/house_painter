'use click'

import { RefObject } from "react";

const Bold_italic = (props: { TextEnterRef: RefObject<HTMLParagraphElement>, text: string }) => {
    const handleClick = () => {
        if (props.TextEnterRef.current) {
            props.TextEnterRef.current.focus();
            const selection = window.getSelection();
            if (!selection?.rangeCount) return;

            const range = selection.getRangeAt(0);
            const selectedText: string = range.toString();

            if (selectedText) {
                const boldNode = document.createTextNode(`<${props.text}>${selectedText}</${props.text}>`);

                range.deleteContents();
                range.insertNode(boldNode);
            }
            else {
                const newNode = document.createTextNode(`<${props.text}></${props.text}>`);

                range.insertNode(newNode);

                const newRange = document.createRange();
                newRange.setStartAfter(newNode);
                newRange.setEndAfter(newNode);
                selection.removeAllRanges();
                selection.addRange(newRange);
            }

        }
    }
    return (
        <button className='dark:bg-neutral bg-base-200 pt-1 pb-1 min-w-24 rounded' onClick={handleClick}>{props.text}</button>
    )
}

export default Bold_italic
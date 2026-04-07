'use click'

import { RefObject } from "react";

const Link_Anchor = (props: { TextEnterRef: RefObject<HTMLParagraphElement>, text: string }) => {
    const handleClick = () => {
        if (props.TextEnterRef.current) {
            props.TextEnterRef.current.focus();
            const selection = window.getSelection();
            if (!selection?.rangeCount) return;

            const range = selection.getRangeAt(0);
            const newNode = document.createTextNode(`<${props.text} url=()></${props.text}>`);
            range.insertNode(newNode);

            const newRange = document.createRange();
            newRange.setStartAfter(newNode);
            newRange.setEndAfter(newNode);
            selection.removeAllRanges();
            selection.addRange(newRange);

        }
    }
    return (
        <button className='dark:bg-neutral bg-base-200 pt-1 pb-1 min-w-24 rounded' onClick={handleClick}>{props.text}</button>
    )
}

export default Link_Anchor
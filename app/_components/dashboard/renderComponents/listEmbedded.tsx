'use client'
import {RefObject} from 'react'

const List_embedded = (props:{TextEnterRef:RefObject<HTMLParagraphElement>, text: string, textElem: string}) => {
    const handleClick = () => {
        if (props.TextEnterRef.current) {
            props.TextEnterRef.current.focus();
            const selection = window.getSelection();
            if (!selection?.rangeCount) return;

            const range = selection.getRangeAt(0);

            const newNodeEmptyLine = document.createElement('div');
            newNodeEmptyLine.innerHTML = '<br>';
            
            const newNode = document.createElement('div');
            newNode.textContent = `${props.textElem}`;

            range.insertNode(newNode);
            range.insertNode(newNodeEmptyLine);

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

export default List_embedded
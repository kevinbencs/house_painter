"use client"

import { Button } from "@/components/ui/button"

const DeleteCode = (props: { code: string }) => {
    const handleClik = () => {
        const fileContent = `Delete 2FA code: ${props.code}`;
        const fileName = 'delete2FAcode.txt';

        const fileBlob = new Blob([fileContent], { type: 'text/plain' });
        const fileUrl = URL.createObjectURL(fileBlob);

        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = fileName;
        link.click();
    }
    return (
        <Button onClick={handleClik}>Leöltés</Button>
    )
}

export default DeleteCode
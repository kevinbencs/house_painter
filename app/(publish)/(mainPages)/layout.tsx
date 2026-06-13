import SendMessageContainer from "@/app/_components/sendMessage/sendMessageContainer";

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>

            <div className="mt-10" >{children}</div>
            <SendMessageContainer />
        </>
    )
}
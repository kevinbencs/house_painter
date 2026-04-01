import SendMessage from "../../_components/sendMessage";

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            {children}
            <div className="flex justify-center m-2 mb-10">
                <SendMessage />
            </div>
        </>
    )
}
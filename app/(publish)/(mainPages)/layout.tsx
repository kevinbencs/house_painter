import { FormProvided } from "@/app/_components/sendMessage/formContext";
import SendMessageContainer from "@/app/_components/sendMessage/sendMessageContainer";

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <FormProvided>
            {children}
            <SendMessageContainer />
        </FormProvided>
    )
}
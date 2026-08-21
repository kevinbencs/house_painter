import SendMessageContainer from "@/app/_components/sendMessage/sendMessageContainer";

export default function Template({ children }: { children: React.ReactNode }) {
  return <>
    {children}
    <SendMessageContainer />
  </>
}
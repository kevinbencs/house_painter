import { IsLoggedProvider } from "./isLoggedContext"

export const LoggedContainer = async ({ children }: { children: React.ReactNode }) => {

    return (<>
        <IsLoggedProvider user={false}>
            {children}
        </IsLoggedProvider>
    </>)
}
import Sidebar from "@/app/_components/dashboard/sidebar";
import { Suspense } from "react";
import Loading from "./loading";
import { IsLoggedProvider } from "@/app/_components/loggedContext/isLoggedContext";


export default async function Layout({ children }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex ml-10 mr-10 mt-15 mb-5 min-h-175 gap-10">
            <IsLoggedProvider>
                <Suspense fallback={<Loading />}>
                    <Sidebar />
                    {children}
                </Suspense>
            </IsLoggedProvider>

        </div>
    )
}
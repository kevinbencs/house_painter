import Sidebar from "@/app/_components/dashboard/sidebar";
import { Suspense } from "react";


export default async function Layout({ children }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex ml-10 mr-10 mt-5 mb-5 min-h-[700px] gap-10">

            <Suspense fallback={"Töltödik..."}>
                <Sidebar />
                {children}
            </Suspense>
        </div>
    )
}
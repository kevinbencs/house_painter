import Sidebar from "@/app/_components/dashboard/sidebar";


export async function Layout({ children }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div>
            <Sidebar/>
            {children}
        </div>
    )
}
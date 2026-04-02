import SideBar from "../_components/sidebar/sideBar";


export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <div className="mt-10 lg:pl-[calc(50%-450px)] lg:pr-[calc(50%-450px)] pl-2 pr-2">
                {children}
            </div>
            <SideBar />
        </>
    )
}
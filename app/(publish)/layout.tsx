import SideBar from "../_components/sidebar/sideBar";


export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            {children}
            <SideBar />
        </>
    )
}
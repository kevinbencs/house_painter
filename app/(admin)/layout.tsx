import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {

    return {
        title: "",
        keywords: "",
        description: "",
        openGraph: {
            locale: 'hu_HU',
            title: "",
            description: "",
            type: 'website',
            url: "",
            images: [],
        },
        twitter: {
            card: 'summary_large_image',
            title: "",
            description: "",
            images: [],
        },
        robots: {
            index: false,
            follow: false,
            noarchive: true,
            nocache: true,
            noimageindex: true,
            googleBot: {
                index: false,
                follow: false,
                noarchive: true,
                nocache: true,
                noimageindex: true,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },

        }
    }
}

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            {children}
        </>
    )
}
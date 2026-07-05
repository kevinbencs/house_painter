import SideBar from "./_components/sidebar/sideBar";
import SendMessageContainer from "./_components/sendMessage/sendMessageContainer";
import About from "./_components/mainPage/about";
import Header from "./_components/mainPage/header";
import Images from "./_components/mainPage/images";
import Contact from "./_components/mainPage/contact";
import Prices from "./_components/mainPage/prices";
import Services from "./_components/mainPage/services";
import Blogs from "./_components/mainPage/blogs";
import GoogleReviews from "./_components/mainPage/googleReviews";
import { getImagesMainPage } from "@/lib/data";
import WhyMe from "./_components/mainPage/whyMe";
import Guarantee from "./_components/mainPage/guarantee";
import { Suspense } from "react";

export default async function Home() {
  const images = await getImagesMainPage()
  return (
    <>
      <Header />
      <div className="pt-10 lg:pl-[calc(50%-600px)] lg:pr-[calc(50%-600px)] pl-2 pr-2 bg-white pb-10">

        <About />
        <WhyMe />
        <Images data={images} />
        <Guarantee />
        <Contact />
        <Services />
        <Prices />
        <Blogs />
        {/*
        <GoogleReviews />
        */}



      </div>
      <SendMessageContainer />
      <SideBar />
    </>

  );
}

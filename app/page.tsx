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

export default function Home() {
  return (
    <>
      <div className="mt-10 lg:pl-[calc(50%-450px)] lg:pr-[calc(50%-450px)] pl-2 pr-2">
        <Header />
        <About />
        <Images />
        <Contact />
        <Services />
        <Prices />
        <Blogs />
        <GoogleReviews />
      </div>
      <SendMessageContainer />
      <SideBar />
    </>

  );
}

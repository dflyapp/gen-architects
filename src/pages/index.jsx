import { gsap } from "gsap";
import { useRef, useEffect } from "react";
import Head from "next/head";

import LogoPicture from "assets/svg/logo_picture.svg";
import LogoText from "assets/svg/logo_text.svg";

import Sliders from "components/Sliders";

export default function Home() {
  const gallery = useRef();
  const logoPic = useRef();

  useEffect(() => {
    gsap.fromTo(gallery.current, {y: 50}, {duration: 0.5, y: 0});
    gsap.fromTo(logoPic.current, {y: -50}, {duration: 0.5, y: 0});
    // gsap.fromTo(element, {x: -100}, {duration: 1, x: 100});
  });

  return (
    <div>
      <Head>
        <title>Gen Architects</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <div className="w-screen h-screen relative overflow-hidden">
        <header className="flex justify-between p-8">
          <div ref={gallery} className="flex items-center">
            <a className="text-2xl">Gallery</a>
            <span className="mx-2">/</span>
            <a className="text-2xl opacity-60">Index</a>
          </div>
          <div>
            <a className="text-2xl">Menu</a>
          </div>
        </header>

        <div className="px-8">
          <hr />
        </div>

        <div className="mt-8 px-8">
          <img
            ref={logoPic}
            style={{ width: 80, height: "auto" }}
            src={LogoPicture.src}
            alt="gen"
          />
        </div>

        {/* <div className="mt-24" style={{ width: "120%", marginLeft: "-200px" }}> */}
          <Sliders />
        {/* </div> */}

        <div className="absolute bottom-8 left-8">
          <img
            style={{ width: 300, height: "auto" }}
            src={LogoText.src}
            alt="gen"
          />
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";
import Image from "next/image";

import LogoPicture from "assets/svg/logo_picture.svg";

export default function WrokPage() {
  return (
    <>
      <header className="flex justify-between p-8">
        <div className="flex items-center">
          <Link href="/" className="text-2xl">
            All Projects
          </Link>
        </div>
        <div>
          <a className="text-2xl">Menu</a>
        </div>
      </header>

      <div className="px-8">
        <hr />
      </div>

      <div className="mt-8 flex">
        <div
          className="bg-gray8"
          style={{ width: "600px", height: "700px" }}
        ></div>
        <div className="flex justify-center items-center w-full relative">
          <div className="absolute left-4 top-4">
            <Image src={LogoPicture} alt="logo" />
          </div>

          <div className="text-center">
            <h1 className="text-5xl">West Hall</h1>
            <p>West Hall</p>
          </div>
        </div>
      </div>
    </>
  );
}

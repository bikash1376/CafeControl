
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Inter, Space_Mono } from "next/font/google";
import Link from "next/link";


const inter = Inter({
  weight: ["400"], // array, even if only one
  style: ["normal"],
  subsets: ["latin"], // required
});

const monospace = Space_Mono({
  weight: ["400", "700"], // multiple weights
  style: ["normal"],      // still an array
  subsets: ["latin"],     // required
});


export default function Home() {
  return (
<div className="h-screen w-full dark:bg-black bg-amber-50 flex flex-col gap-5 items-center justify-center">
  <p className={`${monospace.className} text-4xl mb-6 w-fit text-black dark:text-gray-200`}>
    Maze welcomes you!
  </p>
  <div className="flex gap-5">
  <Button className="text-xl border-gray-800 border-1 hover:bg-lime-500 hover:text-black">
    <Link href="/editor" >
      Editor
    </Link>
  </Button>
    <Button className="text-xl border-gray-800 border-1 hover:bg-lime-500 hover:text-black">
    <Link href="/admin" >
      Admin
    </Link>
  </Button>
    <Button className="text-xl border-gray-800 border-1 hover:bg-lime-500 hover:text-black">
    <Link href="/store" >
      Store
    </Link>
  </Button>
    <Button className="text-xl border-gray-800 border-1 hover:bg-lime-500 hover:text-black">
    <Link href="/dashboard" >
      Dashboard
    </Link>
  </Button>
  <Button className="text-xl border-gray-800 border-1 hover:bg-lime-500 hover:text-black">
    <Link href="https://v0-react-js-ui-jet.vercel.app/" >
      Draw
    </Link>
  </Button>
<Button className="text-xl border-gray-800 border-1  hover:bg-lime-500 hover:text-black">
    <Link href="https://dropdawn.bksh.site/" >
      Dropdawn
    </Link>
  </Button>
<Button className="text-xl border-gray-800 border-1 hover:bg-lime-500 hover:text-black">
    <Link href="https://yet-another-to-do.vercel.app/" >
      To-do
    </Link>
  </Button>
  </div>

</div>

  );
}


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
  <p className={`${monospace.className} text-3xl w-fit text-black dark:text-gray-200`}>
    Maze welcomes you!
  </p>
  <Button className="text-xl border-gray-800 border-1">
    <Link href="/editor" >
      Editor
    </Link>
  </Button>
    <Button className="text-xl border-gray-800 border-1">
    <Link href="/admin" >
      Admin
    </Link>
  </Button>
    <Button className="text-xl border-gray-800 border-1">
    <Link href="/store" >
      Store
    </Link>
  </Button>
</div>

  );
}

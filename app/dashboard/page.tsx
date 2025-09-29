"use client";
import React from "react";
import { motion } from "framer-motion";
import { Space_Mono } from "next/font/google";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import GeneratedComponent from "../components/PaperComp";

const monospace = Space_Mono({
    weight: ["400", "700"],
    style: ["normal"],
    subsets: ["latin"],
});

const Page = () => {
    return (
        <div className="h-screen w-screen dark:bg-neutral-900 bg-amber-50 flex flex-col items-center justify-center gap-8 px-4">

            {/* Faded Image */}
          {/* <div
  className="relative w-64 h-64 overflow-hidden"
  style={{
    maskImage: `
      linear-gradient(to bottom, transparent 10%, black 20%, black 80%, transparent 100%),
      linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%)
    `,
    WebkitMaskImage: `
      linear-gradient(to bottom, transparent 10%, black 20%, black 80%, transparent 100%),
      linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%)
    `,
    maskRepeat: "no-repeat",
    WebkitMaskRepeat: "no-repeat",
    maskSize: "100% 100%",
    WebkitMaskSize: "100% 100%",
    maskComposite: "intersect", // combine both gradients
    WebkitMaskComposite: "destination-in", // equivalent for Safari
  }}
>
  <Image
    src="/images/maze.webp"
    alt="test-image"
    fill
    className="object-cover object-center"
  />
</div> */}

<div>
    <GeneratedComponent />
</div>


            {/* Animated Content */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
                className="flex flex-col items-center gap-5 text-center"
            >
                <p className={`${monospace.className} text-3xl text-black dark:text-gray-200`}>
                    Maze welcomes you!
                </p>
                <p className="text-black dark:text-gray-300">
                    
                </p>

                {/* Input + Button */}
                <div className="flex gap-2">
                    <Input placeholder="Enter your email" className="outline-none" />
                    <Button>Join the waitlist</Button>
                </div>
            </motion.div>
        </div>
    );
};

export default Page;

"use client";

import { IoIosSearch } from "react-icons/io";
import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";
import { useContext } from "react";
import { UserContext } from "@/context/UserContext";

export function Layout({ children, header }) {

  const { token, user } = useContext(UserContext);

  return (
    <>
      <section className="flex font-extralight md:gap-2">

        <Navbar />

        <div className="min-h-dvh w-full">
          <section className={` font-extralight text-white`}>
            {header && (
              <h1 className={`text-3xl py-4 text-center mb-2 border-b-2 border-[#9a0000]`}>{header}</h1>
            )}
            <div>
              {children}
            </div>
          </section>
        </div>
      </section >
      <Footer />
    </>
  )
}

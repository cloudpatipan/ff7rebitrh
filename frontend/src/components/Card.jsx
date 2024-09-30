"use client";
import Link from "next/link";
import { useContext } from "react";
import { GoTriangleDown } from "react-icons/go";
import { motion } from "framer-motion";
import { UserContext } from "@/context/UserContext";
import { PiUsersThree, PiUsersThreeThin } from "react-icons/pi";

export function Card({ index, name, number, condition, conditionImage, caption, link, height, weight, imageUrl, backgroundImageUrl, Favorite, onClick }) {

    const variants = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: { opacity: 1, scale: 1 },
    }

    return (
        <motion.div
            variants={variants}
            initial="hidden"
            animate="visible"
            transition={{
                delay: index * 0.10,
                ease: "easeInOut",
                duration: 0.5,
            }}
            className={`${condition ? 'relative shadow-[0_6px_50px_rgba(23,109,176,1)] brightness-125 outline outline-1 outline-[#176db0] outline-offset-2' : 'hover:brightness-125 outline outline-[#176db0] outline-1 hover:outline-offset-2 transition-all duration-50'} group`}
        >
            <Link href={link ? link : ''} onClick={onClick}>
                <div
                    className={`${height} ${weight} overflow-hidden relative bg-cover bg-center group`}
                    style={{
                        backgroundImage: `url('${backgroundImageUrl}')`,
                        backgroundPosition: `top`
                    }}
                >
                    {conditionImage ? (
                        <img
                            className={`w-full h-full object-cover transform transition-transform duration-300 hover:scale-105`}
                            src={imageUrl}
                            alt={caption}
                        />
                    ) : (
                        <img
                            className={`w-full h-full object-cover`}
                            src={`https://i.imgur.com/epnbr1l.png`}
                            alt={`ไม่มีรูปภาพ`}
                        />
                    )}

                    {Favorite ? Favorite : null}

                    <div className={`absolute bottom-2 w-full`}>
                        <div className={`mx-auto w-[80%] px-2 border-l-4 border-[#9a0000] bg-gradient-to-r from-black from-[40%]`}>
                            {name}
                        </div>
                    </div>

                    {number && (
                        <div className={`absolute top-4 right-4`}>
                            <div className={`flex gap-2 items-center px-2 border border-[#176db0] drop-shadow-2xl bg-black`}>
                                <PiUsersThreeThin size={20}/>
                                {number}
                            </div>
                        </div>
                    )}


                </div>

            </Link>

            <div className={`${condition ? 'opacity-100' : ''} absolute -top-[0.6rem] left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300`}>
                <GoTriangleDown size={25} className="text-[#176db0] brightness-150" />
            </div>

        </motion.div>
    )
}

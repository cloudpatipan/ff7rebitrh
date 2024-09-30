"use client";
import React, { useContext, useEffect, useState } from 'react';
import baseUrl from '@/service/BaseUrl';
import { Button } from '@/components/Button';
import { UserContext } from '@/context/UserContext';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Footer } from '@/components/Footer';

// ไอคอน
import { RxHamburgerMenu } from "react-icons/rx";
import { IoCloseOutline } from "react-icons/io5";
import Swal from 'sweetalert2';
import { AdminRoute } from '@/routes/AdminRoute';

export function Sidebar({ children, header }) {

    const pathname = usePathname();

    const { user, token, setUser, setToken } = useContext(UserContext);
    const router = useRouter();

    console.log(user?.avatar)

    const menus = [
        { name: "แดชบอร์ด", link: "/admin/dashboard" },
        { name: "ตัวละคร", link: "/admin/character" },
        { name: "บทบาท", link: "/admin/role" },
        { name: "โลก", link: "/admin/world" },
        { name: "แบทเทิล", link: "/admin/battle" },
        { name: "ผู้ใช้", link: "/admin/user" },
    ]

    const [open, setOpen] = useState(false);

    const toggleMenu = () => {
        setOpen(!open)
    }

    const submitLogout = async (e) => {
        e.preventDefault();
        try {
            await fetch(`${baseUrl}/sanctum/csrf-cookie`);
            const response = await fetch(`${baseUrl}/api/logout`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            const data = await response.json();
            if (response.ok) {
                router.push('/');
                sessionStorage.removeItem('token');
                sessionStorage.removeItem('user');
                setUser(null);
                setToken(null);
                Swal.fire({
                    icon: "success",
                    text: data.message,
                    color: "white",
                    confirmButtonText: "ตกลง",
                    confirmButtonColor: "#005e95",
                    background: "rgba(0,0,0,0) linear-gradient(rgba(0, 54, 104, 0.5), rgba(0, 94, 149, 0.5)) repeat scroll 0 0",
                });
            } else if (data.status === 400) {
                Swal.fire({
                    icon: "warning",
                    text: data.message,
                    color: "white",
                    confirmButtonText: "ตกลง",
                    confirmButtonColor: "#005e95",
                    background: "rgba(0,0,0,0) linear-gradient(rgba(0, 54, 104, 0.5), rgba(0, 94, 149, 0.5)) repeat scroll 0 0",
                });
            } else if (data.status === 401) {
                Swal.fire({
                    icon: "warning",
                    text: data.message,
                    color: "white",
                    confirmButtonText: "ตกลง",
                    confirmButtonColor: "#005e95",
                    background: "rgba(0,0,0,0) linear-gradient(rgba(0, 54, 104, 0.5), rgba(0, 94, 149, 0.5)) repeat scroll 0 0",
                });
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "มีบางอย่างผิดปกติ",
                color: "white",
                confirmButtonText: "ตกลง",
                confirmButtonColor: "#005e95",
                background: "rgba(0,0,0,0) linear-gradient(rgba(0, 54, 104, 0.5), rgba(0, 94, 149, 0.5)) repeat scroll 0 0",
            });
        }
    };

    return (
        <AdminRoute>
            <section className="flex font-extralight min-h-dvh gap-2">

                <div className={`outline outline-offset-2 ${open ? `w-16` : `w-[12rem]`} outline-1 outline-[#176db0] duration-500 px-4`}>
                    <div className={`flex justify-end`}
                        onClick={toggleMenu}
                    >
                        <button className={`mt-2 h-[2.5rem] w-[2.5rem] flex items-center justify-center text-white bg-cover bg-[#5e0a0a] outline outline-offset-2 outline-1 outline-[#d70000]`}>
                            {open ? <IoCloseOutline size={20} /> : <RxHamburgerMenu size={20} />}
                        </button>
                    </div>

                    <div className="mt-2">
                        <div className={`${open ? 'h-[4rem]' : 'h-[8rem]'} border border-[#176db0] p-[0.1rem] overflow-hidden`}>
                            {user?.avatar ? (
                                <img className={`w-full h-full object-cover`} src={`${baseUrl}/images/avatar/${user?.avatar}`} alt={`รูปภาพของ ${user?.name}`} />
                            ) : (
                                <img className={`w-full h-full object-cover`} src={`https://i.imgur.com/ubMG1L9.png`} alt={`รูปภาพของ ${user?.name}`} />
                            )}
                        </div>

                        {token && (
                            <div className="mt-2 flex justify-between overflow-hidden whitespace-pre">
                                <Button name={user?.name} />
                                {user?.role === 1 ? (
                                    <Link href={`/admin/dashboard`}>
                                        <Button name="แอดมิน" className="w-full" />
                                    </Link>
                                ) : user?.role === 0 && (
                                    <Button name="ผู้ใช้" className="w-full" />
                                )}
                            </div>
                        )}
                    </div>


                    <div className="mt-2 flex flex-col justify-between gap-1">

                        <div className="flex flex-col gap-1">
                            {
                                menus?.map((menu, i) => (
                                    <Link href={menu?.link} key={i + 1} className={` ${menu.margin && ""} group flex items-center `}>
                                        <Button className={`w-full`} condition={menu?.link === pathname} name={menu?.name}>
                                            <h2
                                                style={{
                                                    transitionDelay: `${i + 3}00ms`,
                                                }}
                                                className={`whitespace-pre duration-500 ${open && ' opacity-100 transition-x-28 overflow-hidden'}`}>
                                                {menu.name}
                                            </h2>
                                            <h2 className={`${open ? '' : 'hidden'} absolute z-50 left-12 top-0 bg-cover bg-[url('https://www.jp.square-enix.com/ffvii_rebirth/_common/img/gnav/btn_bg_off_pc.png')] whitespace-pre drop-shadow-lg px-0 py-0 w-0 overflow-hidden group-hover:px-2 group-hover:duration-300 group-hover:w-fit`}>
                                                {menu.name}
                                            </h2>
                                        </Button>

                                    </Link>
                                ))
                            }
                        </div>

                        <div>
                            <Button name="ออกจากระบบ" className="w-full" onClick={submitLogout} />
                        </div>
                    </div>

                </div>

                <div className="w-full">
                    <section className={`p-2 font-extralight text-white`}>
                        {header && (
                            <h1 className={`text-2xl py-4 text-center mb-2 border-b-2 border-[#9a0000]`}>{header}</h1>
                        )}
                        <div className="min-h-dvh">
                            {children}
                        </div>
                    </section>
                </div>

            </section >
            <Footer />
        </AdminRoute>
    )
}

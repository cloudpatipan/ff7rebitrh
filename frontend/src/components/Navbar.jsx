"use client";
import React, { useContext, useEffect, useState } from 'react'
import Link from 'next/link';
import { UserContext } from '@/context/UserContext';
import { Button } from './Button';
import { Modal } from './Modal';
import { Login } from '@/components/auth/login/page';
import { Register } from '@/components/auth/register/page';
import baseUrl from '@/service/BaseUrl';
import Swal from 'sweetalert2';
import { usePathname, useRouter } from 'next/navigation';
import { Dropdown } from './Dropdown';
import { PiHeartThin } from 'react-icons/pi';
import { CiLogin, CiUser } from 'react-icons/ci';
import { IoCloseOutline } from 'react-icons/io5';
import { RxHamburgerMenu } from 'react-icons/rx';
import { motion } from 'framer-motion';
import { FavoriteAndBlogContext, useFavoriteAndBlogContext } from '@/context/FavoriteAndBlogContext';

export function Navbar() {
  const router = useRouter();
  const { user, setUser, token, setToken } = useContext(UserContext);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpenLogin, setIsModalOpenLogin] = useState(false);
  const [isModalOpenRegister, setIsModalOpenRegister] = useState(false);

  const menus = [
    { name: "หน้าหลัก", link: "/" },
    { name: "โลก", link: "/world" },
    { name: "ตัวละคร", link: "/character" },
    { name: "แบทเทิล", link: "/battle" },
    { name: "คอมมิวนิตี้", link: "/community" },
    { name: "มีเดีย", link: "/media" },
    { name: "เนื้อเรื่อง", link: "/story" },
    { name: "ระบบ", link: "/system" },
  ];

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
        Swal.fire({
          icon: "success",
          text: data.message,
          color: "white",
          confirmButtonText: "ตกลง",
          confirmButtonColor: "#005e95",
          background: "rgba(0,0,0,0) linear-gradient(rgba(0, 54, 104, 0.5), rgba(0, 94, 149, 0.5)) repeat scroll 0 0",
        });
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        setUser(null);
        setToken(null);
        closeModalLogin();
      } else if (response.status === 400) {
        Swal.fire({
          icon: "warning",
          text: data.message,
          color: "white",
          confirmButtonText: "ตกลง",
          confirmButtonColor: "#005e95",
          background: "rgba(0,0,0,0) linear-gradient(rgba(0, 54, 104, 0.5), rgba(0, 94, 149, 0.5)) repeat scroll 0 0",
        });
      } else if (response.status === 401) {
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
        text: error,
        color: "white",
        confirmButtonText: "ตกลง",
        confirmButtonColor: "#005e95",
        background: "rgba(0,0,0,0) linear-gradient(rgba(0, 54, 104, 0.5), rgba(0, 94, 149, 0.5)) repeat scroll 0 0",
      });
    }
  };

  const { favorites, blogs } = useContext(FavoriteAndBlogContext);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const openModalLogin = () => {
    setIsModalOpenLogin(true);
  };

  const closeModalLogin = () => {
    setIsModalOpenLogin(false);
  };

  const openModalRegister = () => {
    setIsModalOpenRegister(true);
  };

  const closeModalRegister = () => {
    setIsModalOpenRegister(false);
  };

  const pathname = usePathname();


  const variants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
  }


  return (
    <nav className={`md:w-[12rem] my-2 md:px-2`}>
      <div className="hidden md:flex md:flex-col md:gap-2">

        <div className="flex flex-col gap-2">
          <Link href="/">
            <img src="https://www.jp.square-enix.com/ffvii_rebirth/_common/img/logo.png" alt="" />
          </Link>
          {token ? (
            <div className="flex flex-col gap-2">
              <Link href={`/profile`}>
                <div className={`h-[8rem] bg-gradient-to-t from-[#003668] to-[#005e95] outline outline-offset-2 outline-1 outline-[#10538c] overflow-hidden`}>
                  {user?.avatar ? (
                    <img className={`w-full h-full object-cover`} src={`${baseUrl}/images/avatar/${user?.avatar}`} alt={`รูปภาพของ ${user?.name}`} />
                  ) : (
                    <img className={`w-full h-full object-cover`} src={`https://i.imgur.com/ubMG1L9.png`} alt={`รูปภาพของ ${user?.name}`} />
                  )}
                </div>
              </Link>

              {user && (
                <div className="flex items-center gap-4 justify-between overflow-hidden whitespace-pre">
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

              <Link href={`/favorite`}>
                <div className={`relative hover:brightness-150`}>
                  {favorites && (
                    favorites.length > 0 && (
                      <div className="absolute z-50 bg-black -top-1 -right-1 p-1 text-xs w-4 h-4 flex items-center justify-center border border-[#176db0]">
                        {favorites.length}
                      </div>
                    )
                  )}
                  <Button name={'ตัวละครโปรด'} className="w-full" condition={'/favorite' === pathname} />
                </div>
              </Link>

              <Link href={`/blog`}>
                <div className={`relative hover:brightness-150`}>
                  {blogs && (
                    blogs.length > 0 && (
                      <div className="absolute z-50 bg-black -top-1 -right-1 p-1 text-xs w-4 h-4 flex items-center justify-center border border-[#176db0]">
                        {blogs.length}
                      </div>
                    )
                  )}
                  <Button name={'บล็อก'} className="w-full" condition={'/blog' === pathname} />
                </div>
              </Link>

              <Button className="w-full" name={`ออกจากระบบ`} onClick={submitLogout} />
            </div>

          ) : (
            <div className="flex flex-col gap-2">
              <Button className="w-full" name={`เข้าสู่ระบบ`} onClick={openModalLogin} />
              <Button className="w-full" name={`สมัครสมาชิก`} onClick={openModalRegister} />
              <Modal className={'p-8'} isOpen={isModalOpenLogin} onClose={closeModalLogin}>
                <Login />
              </Modal>
              <Modal className={'p-8'} isOpen={isModalOpenRegister} onClose={closeModalRegister}>
                <Register />
              </Modal>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          {menus?.map((menu, i) => (
            <motion.div key={i + 1}
              variants={variants}
              initial="hidden"
              animate="visible"
              transition={{
                delay: i * 0.10,
                ease: "easeInOut",
                duration: 0.5,
              }}>
              <Link href={menu?.link} className={` ${menu.margin && ""} group flex items-center `}>
                <Button className={`w-full`} condition={menu?.link === pathname} name={menu?.name}>
                  <h2
                    style={{
                      transitionDelay: `${i + 3}00ms`,
                    }}
                    className={`whitespace-pre duration-500 opacity-100 transition-x-28 overflow-hidden`}>
                    {menu.name}
                  </h2>
                  <h2 className={`absolute z-50 left-12 top-0 bg-cover bg-[url('https://www.jp.square-enix.com/ffvii_rebirth/_common/img/gnav/btn_bg_off_pc.png')] whitespace-pre drop-shadow-lg px-0 py-0 w-0 overflow-hidden group-hover:px-2 group-hover:duration-300 group-hover:w-fit`}>
                    {menu.name}
                  </h2>
                </Button>

              </Link>
            </motion.div>
          ))}
        </div>

      </div>

      <div className={`flex fixed z-20 top-2 right-2 gap-4 md:hidden`}>

        {token && user && (
          <>
            <Link href={`/favorite`}>
              <div className={`relative outline outline-offset-2 outline-1 outline-[#10538c]`}>
                {favorites && (
                  favorites.length > 0 && (
                    <div className="absolute z-50 bg-black -top-1 -right-1 p-1 text-xs w-4 h-4 flex items-center justify-center border border-[#176db0]">
                      {favorites.length}
                    </div>
                  )
                )}
                <Button className="w-[2.5rem] h-[2.5rem]" condition={'/favorite' === pathname} icon={<PiHeartThin size={25} />} />
              </div>
            </Link>
            <Dropdown
              header={
                <div className={`h-[2.5rem] w-[2.5rem] bg-gradient-to-t from-[#003668] to-[#005e95] outline outline-offset-2 outline-1 outline-[#10538c] overflow-hidden`}>
                  {user?.avatar ? (
                    <img className={`w-full h-full object-cover`} src={`${baseUrl}/images/avatar/${user?.avatar}`} alt={`รูปภาพของ ${user?.name}`} />
                  ) : (
                    <img className={`w-full h-full object-cover`} src={`https://i.imgur.com/ubMG1L9.png`} alt={`รูปภาพของ ${user?.name}`} />
                  )}
                </div>
              }
            >

              <div className="flex flex-col gap-1">
                <Button name={user?.name} className="w-full" />

                {user?.role === 1 && (
                  <Link href={`/admin/dashboard`}>
                    <Button name="แอดมิน" className="w-full" />
                  </Link>
                )}

                <Link href={`/profile`}>
                  <Button name="โปรไฟล์" className="w-full" />
                </Link>

                <Link href={`/blog`}>
                  <div className={`relative hover:brightness-150`}>
                    {blogs && (
                      blogs.length > 0 && (
                        <div className="absolute z-50 bg-black -top-1 -right-1 p-1 text-xs w-4 h-4 flex items-center justify-center border border-[#176db0]">
                          {blogs.length}
                        </div>
                      )
                    )}
                    <Button name={'บล็อก'} className="w-full" condition={'/blog' === pathname} />
                  </div>
                </Link>

                <Button name="ออกจากระบบ" className="w-full" onClick={submitLogout} />
              </div>

            </Dropdown>
          </>
        )}

        <div onClick={toggleMenu}>
          <button className={`h-[2.5rem] w-[2.5rem] flex items-center justify-center text-white bg-cover bg-[#5e0a0a] outline outline-offset-2 outline-1 outline-[#d70000]`}>
            {isMenuOpen ? <IoCloseOutline size={25} /> : <RxHamburgerMenu size={25} />}
          </button>
        </div>

      </div>

      <div className={`md:hidden fixed z-10 bg-[#021c3f]/90 flex justify-center items-center top-0 left-0 h-full w-full transition-opacity duration-300 ease-in-out ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="w-[80%] flex gap-2 flex-col">
          {menus?.map((menu, i) => (
            <motion.div key={i + 1}
              variants={variants}
              initial="hidden"
              animate="visible"
              transition={{
                delay: i * 0.10,
                ease: "easeInOut",
                duration: 0.5,
              }}>
              <Link className={`w-full`} href={menu?.link}>
                <Button name={menu?.name} condition={menu?.link === pathname} className={`w-full`} />
              </Link>
            </motion.div>
          ))}


          {!token && (
            <>

              <Button icon={<CiLogin size={25} />} onClick={openModalLogin} />

              <Button icon={<CiUser size={25} />} onClick={openModalRegister} />

              <Modal className={'p-8'} isOpen={isModalOpenLogin} onClose={closeModalLogin}>
                <Login />
              </Modal>


              <Modal className={'p-8'} isOpen={isModalOpenRegister} onClose={closeModalRegister}>
                <Register />
              </Modal>
            </>
          )}
        </div>
      </div>

    </nav >
  );
}

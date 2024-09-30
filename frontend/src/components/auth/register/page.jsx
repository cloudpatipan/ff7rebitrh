
"use client";
import Swal from 'sweetalert2';
import { UserContext } from '@/context/UserContext';
import { Button } from '@/components/Button';
import { useContext, useState } from 'react';
import baseUrl from '@/service/BaseUrl';
import { PiArrowFatLinesRightThin, PiArrowLineLeftThin, PiArrowLineRightThin, PiDiamondsFourThin, PiEnvelopeSimpleThin, PiLockThin, PiUserThin } from 'react-icons/pi';
import { useRouter } from "next/navigation";

import { CiUser } from 'react-icons/ci';
import { GoMail } from 'react-icons/go';
import { AiOutlineMail } from "react-icons/ai";
import { Input } from '@/components/Input';
export function Register() {

  const { setUser, setToken } = useContext(UserContext);

  const [field, setField] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });


  const changeFieldHandler = (e) => {
    setField({
      ...field,
      [e.target.name]: e.target.value
    });
  }

  const [error, setError] = useState([]);

  const router = useRouter();

  const onSubmitChange = async (e) => {
    e.preventDefault();

    try {
      await fetch(`${baseUrl}/sanctum/csrf-cookie`);
      const response = await fetch(`${baseUrl}/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(field),
      });
      const data = await response.json();
      if (response.ok) {
        console.log(data)
        Swal.fire({
          icon: "success",
          text: data.message,
          color: "white",
          confirmButtonText: "ตกลง",
          confirmButtonColor: "#005e95",
          background: "rgba(0,0,0,0) linear-gradient(rgba(0, 54, 104, 0.5), rgba(0, 94, 149, 0.5)) repeat scroll 0 0",
        });
        router.push('/');
        sessionStorage.setItem('token', data.token);
        sessionStorage.setItem('user', data.user.name);
        setUser(data.user);
        setToken(data.token);
        setField({
          name: '',
          email: '',
          password: '',
          password_confirmation: '',
      });
      } else if (response.status === 400) {
        Swal.fire({
          icon: "warning",
          text: data.message,
          color: "white",
          confirmButtonText: "ตกลง",
          confirmButtonColor: "#005e95",
          background: "rgba(0,0,0,0) linear-gradient(rgba(0, 54, 104, 0.5), rgba(0, 94, 149, 0.5)) repeat scroll 0 0",
        });
      } else if (response.status === 422) {
        setError(data.errors);
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
  }


  return (
    <div>
      <div className="mb-4 ">
        <h1 className={`text-xl font-extralight`}>ลงทะเบียน</h1>
      </div>

      <form onSubmit={onSubmitChange}>

        <div className="flex flex-col gap-4">

          <div>
            <label>ชื่อ</label>
            <Input
              type={`text`}
              name="name"
              id="name"
              placeholder={`ชื่อ`}
              onChange={e => changeFieldHandler(e)} />
            {error && error.name && (
              <div className={`mt-2 bg-gradient-to-t from-[#5e0a0a] to-[#d70000] outline outline-offset-2 outline-1 outline-[#d70000] px-2 text-sm`}>
                {error.name}
              </div>
            )}
          </div>

          <div>
            <label>อีเมล</label>
            <Input
              type={`text`}
              name="email"
              id="email"
              placeholder={`อีเมล`}
              onChange={e => changeFieldHandler(e)} />
            {error && error.email && (
              <div className={`mt-2 bg-gradient-to-t from-[#5e0a0a] to-[#d70000] outline outline-offset-2 outline-1 outline-[#d70000] px-2 text-sm`}>
                {error.email}
              </div>
            )}
          </div>

          <div>
            <label>รหัสผ่าน</label>
            <Input
              type={`password`}
              name="password"
              id="password"
              placeholder={`รหัสผ่าน`}
              onChange={e => changeFieldHandler(e)} />
            {error && error.password && (
              <div className={`mt-2 bg-gradient-to-t from-[#5e0a0a] to-[#d70000] outline outline-offset-2 outline-1 outline-[#d70000] px-2 text-sm`}>
                {error.password}
              </div>
            )}
          </div>

          <div>
            <label>ยืนยันรหัสผ่าน</label>
            <Input
              type={`password`}
              name="password_confirmation"
              id="password_confirmation"
              placeholder={`ยืนยันรหัสผ่าน`}
              onChange={e => changeFieldHandler(e)} />
            {error && error.password_confirmation && (
              <div className={`mt-2 bg-gradient-to-t from-[#5e0a0a] to-[#d70000] outline outline-offset-2 outline-1 outline-[#d70000] px-2 text-sm`}>
                {error.password_confirmation}
              </div>
            )}
          </div >

          <div className="flex items-center justify-end">
            <Button name={`ลงทะเบียน`} type={`submit`} icon={<PiArrowFatLinesRightThin size={25} />} />
          </div>

        </div >

      </form >
    </div >
  )
}

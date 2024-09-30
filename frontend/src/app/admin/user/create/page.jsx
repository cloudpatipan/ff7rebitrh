"use client";

import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { UserContext } from "@/context/UserContext";
import { Sidebar } from "@/layouts/Sidebar";
import baseUrl from "@/service/BaseUrl";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { PiArrowFatLinesRightThin, PiImageThin } from "react-icons/pi";
import Swal from "sweetalert2";

export default function UserCreate() {

    const { token } = useContext(UserContext);

    const [userField, setUserField] = useState({
        name: '',
        email: '',
        password: '',
        avatar: '',
        role: '',
    });

    const changeUserFieldHandler = (e) => {
        setUserField({
            ...userField,
            [e.target.name]: e.target.value
        });
    }

    const handleAvatarUpload = () => {
        document.getElementById('avatarInput').click();
    };

    const onFileChangeAvatar = (event) => {
        const file = event.target.files[0];
        setUserField(prevState => ({
            ...prevState,
            avatar: file,
        }));
    }

    const [error, setError] = useState([]);

    const router = useRouter();

    const onSubmitChange = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', userField.name);
        formData.append('email', userField.email);
        formData.append('password', userField.password);
        formData.append('role', userField.role ? 1 : 0);

        if (userField.avatar) {
            formData.append('avatar', userField.avatar);
        }

        try {
            const response = await fetch(`${baseUrl}/api/admin/user`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });
            const data = await response.json();

            if (response.ok) {
                Swal.fire({
                    icon: "success",
                    text: data.message,
                    color: "white",
                    confirmButtonText: "ตกลง",
                    confirmButtonColor: "#005e95",
                    background: "rgba(0,0,0,0) linear-gradient(rgba(0, 54, 104, 0.5), rgba(0, 94, 149, 0.5)) repeat scroll 0 0",
                });
                setError([]);
                router.push('/admin/user');
            } else if (response.status === 400) {
                Swal.fire({
                    icon: "success",
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
                text: "มีข้อผิดพลาดกับดึงข้อมูล",
                color: "white",
                confirmButtonText: "ตกลง",
                confirmButtonColor: "#005e95",
                background: "rgba(0,0,0,0) linear-gradient(rgba(0, 54, 104, 0.5), rgba(0, 94, 149, 0.5)) repeat scroll 0 0",
            });
        }
    }


    return (
        <Sidebar header={`ผู้ใช้ (สร้าง)`}>

            <form onSubmit={onSubmitChange}>

                <div className="flex flex-col gap-4">

                    <div className="flex flex-col md:flex-row gap-4">

                        <div>
                            <label>รูปภาพผู้ใช้</label>
                            <div className="h-[20rem] w-[20rem] p-[0.1rem] border border-[#176db0] cursor-pointer relative overflow-hidden group">
                                <div
                                    className="absolute w-full h-full bg-black/40 flex items-center justify-center -bottom-20 group-hover:bottom-0 opacity-0 group-hover:opacity-100 transition-all duration-300"
                                    onClick={handleAvatarUpload}
                                >
                                    <div className="flex flex-col items-center text-white text-xl">
                                        รูปภาพ
                                        <PiImageThin size={40} />
                                    </div>
                                </div>
                                {userField.avatar ? (
                                    <img className="w-full h-full object-cover" src={URL.createObjectURL(userField.avatar)} alt="อัพโหลดรูปภาพ" />
                                ) : (
                                    <img className={`w-full h-full object-cover`} src={`https://www.jp.square-enix.com/ffvii_rebirth/_common/img/gnav/btn_bg_off_pc.png`} alt={`ไม่มีรูปภาพ`} />
                                )}
                            </div>
                            <Button name={`อัพโหลดรูปภาพ`} icon={<PiImageThin size={25} />} className={`w-full mt-2`} onClick={handleAvatarUpload} />

                            <input hidden id="avatarInput" type="file" onChange={onFileChangeAvatar} />
                            {error && error.avatar && (
                                <div className={`mt-2 bg-gradient-to-t from-[#5e0a0a] to-[#d70000] outline outline-offset-2 outline-1 outline-[#d70000] px-2 text-sm`}>
                                    {error.avatar}
                                </div>
                            )}
                        </div>

                        <div className="w-full">

                            <div className="mb-2">
                                <label>ชื่อ</label>
                                <Input
                                    type={`text`}
                                    name="name"
                                    id="name"
                                    placeholder={`ชื่อ`}
                                    onChange={e => changeUserFieldHandler(e)} />
                                {error && error.name && (
                                    <div className={`mt-2 bg-gradient-to-t from-[#5e0a0a] to-[#d70000] outline outline-offset-2 outline-1 outline-[#d70000] px-2 text-sm`}>
                                        {error.name}
                                    </div>
                                )}
                            </div>

                            <div className="mb-2">
                                <label>อีเมล</label>
                                <Input
                                    type={`text`}
                                    name="email"
                                    id="email"
                                    placeholder={`อีเมล`}
                                    onChange={e => changeUserFieldHandler(e)} />
                                {error && error.email && (
                                    <div className={`mt-2 bg-gradient-to-t from-[#5e0a0a] to-[#d70000] outline outline-offset-2 outline-1 outline-[#d70000] px-2 text-sm`}>
                                        {error.email}
                                    </div>
                                )}
                            </div>


                            <div className="mb-2">
                                <label>รหัสผ่าน</label>
                                <Input
                                    type={`password`}
                                    name="password"
                                    id="password"
                                    placeholder={`รหัสผ่าน`}
                                    onChange={e => changeUserFieldHandler(e)} />
                                {error && error.password && (
                                    <div className={`mt-2 bg-gradient-to-t from-[#5e0a0a] to-[#d70000] outline outline-offset-2 outline-1 outline-[#d70000] px-2 text-sm`}>
                                        {error.password}
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center gap-2">
                                <input className="accent-[#176db0]"
                                    type="checkbox"
                                    name="role"
                                    id="role"
                                    onChange={e => changeUserFieldHandler(e)} />
                                <label>แอดมิน</label>
                                {error && error.role && (
                                    <div className={`mt-2 bg-gradient-to-t from-[#5e0a0a] to-[#d70000] outline outline-offset-2 outline-1 outline-[#d70000] px-2 text-sm`}>
                                        {error.role}
                                    </div>
                                )}
                            </div>

                        </div>

                    </div>

                    <div className="flex items-center justify-end">
                        <Button name={`บันทึก`} type={`submit`} icon={<PiArrowFatLinesRightThin size={25} />} />
                    </div>

                </div>

            </form>

        </Sidebar >
    )
}

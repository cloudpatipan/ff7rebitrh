"use client";
import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CiCamera } from 'react-icons/ci';
import { FaRegSave } from 'react-icons/fa';
import { UserContext } from '@/context/UserContext';
import baseUrl from '@/service/BaseUrl';
import { Layout } from '@/layouts/Layout';
import { Button } from '@/components/Button';
import Swal from 'sweetalert2';
import { PiArrowFatLinesRightThin, PiArrowLineRightThin, PiImageThin } from 'react-icons/pi';
import { Input } from '@/components/Input';

export default function ProfileInformation() {

    const { token, setToken, user, setUser } = useContext(UserContext);

    useEffect(() => {
        if (user) {
            setName(user?.name);
            setAvatar(user?.avatar);
        }
    }, [user])

    const [name, setName] = useState('');
    const [avatar, setAvatar] = useState('');
    const [newAvatar, setNewAvatar] = useState('');

    const [error, setError] = useState([]);

    const router = useRouter();


    const updateProfile = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', name);

        if (newAvatar) {
            formData.append('avatar', newAvatar);
        }

        try {
            await fetch(`${baseUrl}/sanctum/csrf-cookie`, { credentials: 'include' });
            const response = await fetch(`${baseUrl}/api/profile/update-information`, {
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
                setUser(data.user);
                setError([]);
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

    const handleAvatarUpload = () => {
        document.getElementById('avatarInput').click();
    };

    const onFileChangeAvatar = (event) => {
        setNewAvatar(event.target.files[0]);
    };

    return (
        <section className={``}>
            {token && (

                <div className="mx-auto">

                    <form onSubmit={updateProfile}>

                        <div className="flex flex-col gap-4">

                            <div className="flex flex-col md:flex-row gap-4">

                                <div className="basis-3/12">
                                    <label>รูปภาพ</label>
                                    <div className="mx-auto w-[14rem] h-[14rem]  md:w-full p-[0.1rem] border border-[#176db0] cursor-pointer relative overflow-hidden group">
                                        <div
                                            className="absolute w-full h-full bg-black/40 flex items-center justify-center -bottom-20 group-hover:bottom-0 opacity-0 group-hover:opacity-100 transition-all duration-300"
                                            onClick={handleAvatarUpload}
                                        >
                                            <div className="flex flex-col items-center text-white text-xl">
                                                รูปภาพ
                                                <PiImageThin size={50} />
                                            </div>
                                        </div>
                                        {newAvatar ? (
                                            <img className="w-full h-full object-cover" src={URL.createObjectURL(newAvatar)} alt="New Uploaded avatar" />
                                        ) : avatar ? (
                                            <img className={`w-full h-full object-cover`} src={`${baseUrl}/images/avatar/${avatar}`} alt={`รูปภาพของ ${name}`} />
                                        ) : (
                                            <img className={`w-full h-full object-cover`} src={`https://www.jp.square-enix.com/ffvii_rebirth/_common/img/gnav/btn_bg_off_pc.png`} alt={`ไม่มีรูปภาพ`} />
                                        )}
                                    </div>
                                    <input hidden id="avatarInput" type="file" onChange={onFileChangeAvatar} />

                                    <Button name={`อัพโหลดรูปภาพ`} icon={<PiImageThin size={25} />} className={`w-full mt-2 ]`} onClick={() => document.getElementById('avatarInput').click()} />
                                    {error && error.avatar && (
                                        <div className={`mt-2 bg-gradient-to-t from-[#5e0a0a] to-[#d70000] outline outline-offset-2 outline-1 outline-[#d70000] px-2 text-sm`}>
                                            {error.avatar}
                                        </div>
                                    )}
                                </div>

                                <div className={`basis-9/12`}>
                                    <label>ชื่อ</label>
                                    <Input
                                        type={`text`}
                                        value={name}
                                        placeholder={`ชื่อ`}
                                        onChange={(e) => setName(e.target.value)} />
                                    {error && error.name && (
                                        <div className={`mt-2 bg-gradient-to-t from-[#5e0a0a] to-[#d70000] outline outline-offset-2 outline-1 outline-[#d70000] px-2 text-sm`}>
                                            {error.name}
                                        </div>
                                    )}
                                </div>

                            </div>

                            <div className="flex items-center justify-end">
                                <Button name={`บันทึก`} type={`submit`} icon={<PiArrowFatLinesRightThin size={25} />} />
                            </div>
                        </div>


                    </form>

                </div>
            )}
        </section>
    )
}


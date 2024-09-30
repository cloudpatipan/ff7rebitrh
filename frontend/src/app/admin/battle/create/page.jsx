"use client";

import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Textarea } from "@/components/Textarea";
import { UserContext } from "@/context/UserContext";
import { Sidebar } from "@/layouts/Sidebar";
import baseUrl from "@/service/BaseUrl";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { PiArrowFatLinesRightThin, PiImageThin } from "react-icons/pi";
import Swal from "sweetalert2";

export default function BattleCreate() {

    const { token } = useContext(UserContext);

    const [battleField, setBattleField] = useState({
        name: '',
        description: '',
        image: '',
    });

    const changeBattleFieldHandler = (e) => {
        setBattleField({
            ...battleField,
            [e.target.name]: e.target.value
        });
    }

    const handleImageUpload = () => {
        document.getElementById('imageInput').click();
    };

    const onFileChangeImage = (e) => {
        setBattleField(prevState => ({
            ...prevState,
            image: e.target.value,
        }));
    }

    const [error, setError] = useState([]);

    const router = useRouter();

    const onSubmitChange = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${baseUrl}/api/admin/battle`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(battleField),
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
                router.push('/admin/battle');
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
        <Sidebar header={`แบทเทิล (สร้าง)`}>
            <form onSubmit={onSubmitChange}>

                <div className="flex flex-col gap-4">

                    <div className="flex flex-col md:flex-row gap-4 w-full">

                        <div className={`basis-1/2`}>
                            <label>รูปแบทเทิล</label>
                            <div className="h-[16rem] p-[0.15rem] border border-[#176db0] cursor-pointer relative overflow-hidden group">
                                <div
                                    className="absolute w-full h-full bg-black/40 flex items-center justify-center -bottom-20 group-hover:bottom-0 opacity-0 group-hover:opacity-100 transition-all duration-300"
                                    onClick={handleImageUpload}
                                >
                                    <div className="flex flex-col items-center text-white text-xl">
                                        รูปภาพ
                                        <PiImageThin size={40} />
                                    </div>
                                </div>
                                {battleField.image ? (
                                    <img className="w-full h-full object-cover" src={battleField.image} alt="อัพโหลดรูปภาพ" />
                                ) : (
                                    <img className={`w-full h-full object-cover`} src={`https://www.jp.square-enix.com/ffvii_rebirth/_common/img/gnav/btn_bg_off_pc.png`} alt={`ไม่มีรูปภาพ`} />
                                )}
                            </div>

                            <Input className={'mt-4'} id="imageInput" type="text" placeholder={`กรุณากรอกลิงค์รูปภาพ`} onChange={onFileChangeImage} value={battleField.image}/>
                            {error && error.image && (
                                <div className={`mt-2 bg-gradient-to-t from-[#5e0a0a] to-[#d70000] outline outline-offset-2 outline-1 outline-[#d70000] px-2 text-sm`}>
                                    {error.image}
                                </div>
                            )}
                        </div>

                        <div className="basis-1/2">
                            <div className="mb-2">
                                <label>ชื่อแบทเทิล</label>
                                <Input
                                    type={`text`}
                                    name="name"
                                    id="name"
                                    placeholder={`ชื่อแบทเทิล`}
                                    onChange={e => changeBattleFieldHandler(e)} />
                                {error && error.name && (
                                    <div className={`mt-2 bg-gradient-to-t from-[#5e0a0a] to-[#d70000] outline outline-offset-2 outline-1 outline-[#d70000] px-2 text-sm`}>
                                        {error.name}
                                    </div>
                                )}
                            </div>

                            <div className={`mb-2`}>
                                <label>รายละเอียดแบทเทิล</label>
                                <Textarea
                                    type={`text`}
                                    name="description"
                                    id="description"
                                    placeholder={`รายละเอียดแบทเทิล`}
                                    onChange={e => changeBattleFieldHandler(e)} />
                                {error && error.description && (
                                    <div className={`mt-2 bg-gradient-to-t from-[#5e0a0a] to-[#d70000] outline outline-offset-2 outline-1 outline-[#d70000] px-2 text-sm`}>
                                        {error.description}
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

        </Sidebar>
    )
}

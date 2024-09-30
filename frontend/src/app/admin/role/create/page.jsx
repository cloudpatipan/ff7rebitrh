"use client";

import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { UserContext } from "@/context/UserContext";
import { Sidebar } from "@/layouts/Sidebar";
import baseUrl from "@/service/BaseUrl";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { PiArrowFatLinesRightThin } from "react-icons/pi";
import Swal from "sweetalert2";

export default function RoleCreate() {

    const { token } = useContext(UserContext);

    const [error, setError] = useState([]);

    const router = useRouter();

    const [roleField, setRoleField] = useState({
        name: '',
    });

    const changeRoleFieldHandler = (e) => {
        setRoleField({
            ...roleField,
            [e.target.name]: e.target.value
        });
    }

    console.log(roleField)

    const onSubmitChange = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${baseUrl}/api/admin/role`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(roleField),
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
                router.push('/admin/role');
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
        <Sidebar header={'บทบาท (เพิ่ม)'}>

            <form onSubmit={onSubmitChange}>

                <div className="flex flex-col gap-4">

                    <div>
                        <label>ชื่อบทบาท</label>
                        <Input
                            type={`text`}
                            name="name"
                            id="name"
                            placeholder={`ชื่อบทบาท`}
                            onChange={(e) => changeRoleFieldHandler(e)} />                                        {error && error.voice_actor && (
                                <div className={`mt-2 bg-gradient-to-t from-[#5e0a0a] to-[#d70000] outline outline-offset-2 outline-1 outline-[#d70000] px-2 text-sm`}>
                                    {error.name}
                                </div>
                            )}
                        {error && error.name && (
                            <div className={`mt-2 bg-gradient-to-t from-[#5e0a0a] to-[#d70000] outline outline-offset-2 outline-1 outline-[#d70000] px-2 text-sm`}>
                                {error.name}
                            </div>
                        )}
                    </div>


                    <div className="flex items-center justify-end">
                        <Button name={`บันทึก`} type={`submit`} icon={<PiArrowFatLinesRightThin size={25} />} />
                    </div>

                </div>

            </form>


        </Sidebar>
    )
}

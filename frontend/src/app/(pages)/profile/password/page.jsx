"use client";
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { UserContext } from '@/context/UserContext';
import baseUrl from '@/service/BaseUrl';
import React, { useContext, useState } from 'react';
import { PiArrowFatLinesRightThin, PiArrowLineRightThin } from 'react-icons/pi';
import Swal from 'sweetalert2';
export default function ProfilePassword() {

    const { token, setToken, user, setUser } = useContext(UserContext);

    const [current_password, setCurrentPassword] = useState('');
    const [new_password, setNewPassword] = useState('');
    const [new_password_confirmation, setNewPasswordConfirmation] = useState('');
    const [error, setError] = useState([]);


    const updatePassword = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('current_password', current_password);
        formData.append('new_password', new_password);
        formData.append('new_password_confirmation', new_password_confirmation);

        try {
            await fetch(`${baseUrl}/sanctum/csrf-cookie`, { credentials: 'include' });
            const response = await fetch(`${baseUrl}/api/profile/update-password`, {
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
                setCurrentPassword('');
                setNewPassword('');
                setNewPasswordConfirmation('');
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
                    icon: 'warning',
                    text: data.message,
                    color: 'white',
                    confirmButtonText: 'ตกลง',
                    confirmButtonColor: '#005e95',
                    background: 'rgba(0,0,0,0) linear-gradient(rgba(0, 54, 104, 0.5), rgba(0, 94, 149, 0.5)) repeat scroll 0 0',
                });
            } else if (response.status === 422) {
                setError(data.errors);
                console.log(data.errors)
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
        <form onSubmit={updatePassword}>

            <div className="flex flex-col gap-4">
                <div>
                    <label>รหัสผ่านปันจจุบัน</label>
                    <Input
                        type={`password`}
                        value={current_password}
                        placeholder={`รหัสผ่านปัจจุบัน`}
                        onChange={(e) => setCurrentPassword(e.target.value)} />
                    {error && error.current_password && (
                        <div className={`mt-2 bg-gradient-to-t from-[#5e0a0a] to-[#d70000] outline outline-offset-2 outline-1 outline-[#d70000] px-2 text-sm`}>
                            {error.current_password}
                        </div>
                    )}
                </div>

                <div>
                    <label>ยืนยันรหัสผ่านใหม่</label>
                    <Input
                        type={`password`}
                        value={new_password}
                        placeholder={`รหัสผ่านใหม่`}
                        onChange={(e) => setNewPassword(e.target.value)} />
                    {error && error.new_password && (
                        <div className={`mt-2 bg-gradient-to-t from-[#5e0a0a] to-[#d70000] outline outline-offset-2 outline-1 outline-[#d70000] px-2 text-sm`}>
                            {error.new_password}
                        </div>
                    )}
                </div>

                <div>
                    <label>รหัสผ่านใหม่</label>
                    <Input
                        type={`password`}
                        value={new_password_confirmation}
                        placeholder={`รหัสผ่านใหม่`}
                        onChange={(e) => setNewPasswordConfirmation(e.target.value)} />
                    {error && error.new_password_confirmation && (
                        <div className={`mt-2 bg-gradient-to-t from-[#5e0a0a] to-[#d70000] outline outline-offset-2 outline-1 outline-[#d70000] px-2 text-sm`}>
                            {error.new_password_confirmation}
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-end">
                    <Button name={`บันทึก`} type={`submit`} icon={<PiArrowFatLinesRightThin size={25} />} />
                </div>

            </div>

        </form>
    )
}

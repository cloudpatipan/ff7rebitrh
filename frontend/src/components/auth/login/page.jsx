
"use client";
import Swal from 'sweetalert2';
import { UserContext } from '@/context/UserContext';
import { Button } from '@/components/Button';
import baseUrl from '@/service/BaseUrl';
import { useRouter } from 'next/navigation';
import { useContext, useState } from 'react';
import { Input } from '@/components/Input';
import { Modal } from '@/components/Modal';

// ไอคอน
import { PiArrowFatLinesRightThin, PiEyeSlashThin, PiEyeThin } from "react-icons/pi";

export function Login() {

    const router = useRouter();

    const { setUser, setToken } = useContext(UserContext);

    const [showPassword, setShowPassword] = useState(false);

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const [field, setField] = useState({
        email: '',
        password: '',
    });

    const changeFieldHandler = (e) => {
        setField({
            ...field,
            [e.target.name]: e.target.value
        });
    }

    const [error, setError] = useState([]);

    const onSubmitChange = async (e) => {
        e.preventDefault();

        try {
            await fetch(`${baseUrl}/sanctum/csrf-cookie`);
            const response = await fetch(`${baseUrl}/api/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(field),
            });
            const data = await response.json();
            if (response.ok) {
                if (data.user?.role === 1) {
                    router.push('/admin/dashboard');
                } else {
                    router.push('/');
                }
                sessionStorage.setItem('token', data.token);
                sessionStorage.setItem('user', data.user.name);
                setUser(data.user);
                setToken(data.token);
                setField({
                    email: '',
                    password: '',
                });
                Swal.fire({
                    icon: "success",
                    text: data.message,
                    color: "white",
                    confirmButtonText: "ตกลง",
                    confirmButtonColor: "#005e95",
                    background: "rgba(0,0,0,0) linear-gradient(rgba(0, 54, 104, 0.5), rgba(0, 94, 149, 0.5)) repeat scroll 0 0",
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
            <div className="mb-4">
                <h1 className={`text-xl font-extralight`}>เข้าสู่ระบบ</h1>
            </div>

            <form onSubmit={onSubmitChange}>

                <div className="flex flex-col gap-4">

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
                        <div className="relative">
                            <Input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                id="password"
                                placeholder={`รหัสผ่าน`}
                                onChange={e => changeFieldHandler(e)} />
                            <button type="button" onClick={toggleShowPassword} className="absolute top-2 right-2 text-[#176db0]">
                                {showPassword ? <PiEyeThin size={20} /> : <PiEyeSlashThin size={20} />}
                            </button>
                        </div>
                        {error && error.password && (
                            <div className={`mt-2 bg-gradient-to-t from-[#5e0a0a] to-[#d70000] outline outline-offset-2 outline-1 outline-[#d70000] px-2 text-sm`}>
                                {error.password}
                            </div>
                        )}
                    </div>


                    <div className="flex items-center justify-end">
                        <Button name={`เข้าสู่ระบบ`} type={`submit`} icon={<PiArrowFatLinesRightThin size={25} />} />
                    </div>

                </div>

            </form>
        </div>
    )
}

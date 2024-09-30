"use client";
import React, { useState, useEffect, useContext } from 'react';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import { UserContext } from '@/context/UserContext';
import baseUrl from '@/service/BaseUrl';

export function PrivateRoute({ children }) {
    const [authenticated, setAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const { token } = useContext(UserContext);
    const router = useRouter();

    useEffect(() => {
        checkingAuthenticated();
    }, []);

    const checkingAuthenticated = async () => {
        try {
            await fetch(`${baseUrl}/sanctum/csrf-cookie`, { credentials: 'include' });
            const response = await fetch(`${baseUrl}/api/checkingAuthenticated`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (response.ok) {
                setAuthenticated(true);
                setLoading(false);
            } else if (response.status === 401) {
                router.push('/');
                Swal.fire({
                    icon: "warning",
                    text: data.message,
                    color: "white",
                    confirmButtonText: "ตกลง",
                    confirmButtonColor: "#005e95",
                    background: "rgba(0,0,0,0) linear-gradient(rgba(0, 54, 104, 0.5), rgba(0, 94, 149, 0.5)) repeat scroll 0 0",
                });
                setLoading(false);
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "มีข้อผิดพลาดเกี่ยวกับเซิฟเวอร์",
                color: "white",
                confirmButtonText: "ตกลง",
                confirmButtonColor: "#005e95",
                background: "rgba(0,0,0,0) linear-gradient(rgba(0, 54, 104, 0.5), rgba(0, 94, 149, 0.5)) repeat scroll 0 0",
            });
            router.push('/');
        }
    }

    if (loading) {
        return (
            <div className={`min-h-dvh flex items-center justify-center`}>
                <img src="https://www.jp.square-enix.com/ffvii_rebirth/_common/img/loading.gif" alt="loading" />
            </div>
        );
    }

    if (authenticated) {
        return <>{children}</>;
    }

    return null;
}


"use client";

import { Card } from "@/components/Card";
import { Layout } from "@/layouts/Layout";
import baseUrl from "@/service/BaseUrl";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function FavoriteUser() {

    const { slug } = useParams();

    const router = useRouter();

    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

    const [deletingId, setDeletingId] = useState(null);

    useEffect(() => {
        fetchFavorite();
    }, [slug]);

    const fetchFavorite = async () => {
        try {
            const response = await fetch(`${baseUrl}/api/favorite/${slug}`);
            const data = await response.json();

            if (response.ok) {
                setFavorites(data.favorites);
                setLoading(false);
            } else if (response.status === 401) {
                Swal.fire({
                    icon: 'warning',
                    text: data.message,
                    color: 'white',
                    confirmButtonText: 'ตกลง',
                    confirmButtonColor: '#005e95',
                    background: 'rgba(0,0,0,0) linear-gradient(rgba(0, 54, 104, 0.5), rgba(0, 94, 149, 0.5)) repeat scroll 0 0',
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

    const deleteFavoriteItem = async (e, favorite_id) => {
        e.preventDefault();
        setDeletingId(favorite_id);

        try {
            const response = await fetch(`${baseUrl}/api/delete-favoriteitem/${favorite_id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`
                },
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
                setFavorites((prev) => prev.filter(favorite => favorite.id !== favorite_id));
                setDeletingId(null);
            } else if (response.status === 400) {
                Swal.fire({
                    icon: "error",
                    text: data.message,
                    color: "white",
                    confirmButtonText: "ตกลง",
                    confirmButtonColor: "#005e95",
                    background: "rgba(0,0,0,0) linear-gradient(rgba(0, 54, 104, 0.5), rgba(0, 94, 149, 0.5)) repeat scroll 0 0",
                });
                setDeletingFavoriteId(null);
            } else if (response.status === 401) {
                Swal.fire({
                    icon: "error",
                    text: data.message,
                    color: "white",
                    confirmButtonText: "ตกลง",
                    confirmButtonColor: "#005e95",
                    background: "rgba(0,0,0,0) linear-gradient(rgba(0, 54, 104, 0.5), rgba(0, 94, 149, 0.5)) repeat scroll 0 0",
                });
                router.push('/');
            }
        } catch (error) {
            Swal.fire({
                icon: "warning",
                text: error,
                color: "white",
                confirmButtonText: "ตกลง",
                confirmButtonColor: "#005e95",
                background: "rgba(0,0,0,0) linear-gradient(rgba(0, 54, 104, 0.5), rgba(0, 94, 149, 0.5)) repeat scroll 0 0",
            });
        }
    }

    return (
        <>
            {loading ? (
                <div className={`min-h-dvh flex items-center justify-center`}>
                    <img src="https://www.jp.square-enix.com/ffvii_rebirth/_common/img/loading.gif" alt="Loading" />
                </div>
            ) : (
                <Layout>

                    <div className={`p-4 border-r-4 border-l-4 border-[#3d87ab] bg-[#033D71]/60 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4`}>
                        {favorites.length > 0 ? (
                            favorites.map((favorite, index) => (
                                <Card
                                    key={index}
                                    link={`/community/user/${favorite.user?.name}`}
                                    index={index}
                                    conditionImage={favorite?.user?.avatar}
                                    imageUrl={`${baseUrl}/images/avatar/${favorite?.user?.avatar}`}
                                    name={favorite?.user?.name}
                                    height={'h-[10rem]'}
                                />
                            ))
                        ) : (
                            <div className="flex items-center justify-center rounded-lg col-span-6 md:col-span-6">
                                <span className="text-3xl">ไม่มีข้อมูล</span>
                            </div>
                        )}
                    </div>

                </Layout >

            )}

        </>
    )
}

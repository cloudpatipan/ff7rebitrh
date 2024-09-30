
"use client";
import { BarChart } from "@/components/BarChart";
import { UserContext } from "@/context/UserContext";
import { Sidebar } from "@/layouts/Sidebar";
import baseUrl from "@/service/BaseUrl";
import { useContext, useEffect, useState } from "react";
import { PiUsersFourThin, PiUserThin } from "react-icons/pi";
import Swal from "sweetalert2";

export default function Dashboard() {

    const { token } = useContext(UserContext);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            const fetchData = async () => {
                try {
                    setLoading(true);
                    await fetchFavoritesCount();
                    await fetchUser();
                    await fetchCharacter();
                    await fetchBlogsCount();
                } catch (error) {
                    Swal.fire({
                        icon: "error",
                        text: error,
                        color: "white",
                        confirmButtonText: "ตกลง",
                        confirmButtonColor: "#005e95",
                        background: "rgba(0,0,0,0) linear-gradient(rgba(0, 54, 104, 0.5), rgba(0, 94, 149, 0.5)) repeat scroll 0 0",
                    });
                } finally {
                    setLoading(false);
                }
            }
            fetchData();
        }
    }, [token]);

    const [favoritesCount, setFavoritesCount] = useState([]);

    const fetchFavoritesCount = async () => {
        try {
            const response = await fetch(`${baseUrl}/api/admin/favorite_count`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (response.ok) {
                setLoading(false);
                setFavoritesCount(data.favoritescount);
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
    }

    const [blogsCount, setBlogsCount] = useState([]);

    const fetchBlogsCount = async () => {
        try {
            const response = await fetch(`${baseUrl}/api/admin/blog_count`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (response.ok) {
                setLoading(false);
                setBlogsCount(data.blogscount);
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
    }


    const [users, setUsers] = useState([]);

    const fetchUser = async () => {
        try {
            const response = await fetch(`${baseUrl}/api/admin/user`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const data = await response.json();

            if (response.ok) {
                setUsers(data.users);
                setLoading(false);
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

    const [characters, setCharacters] = useState([]);

    const characterCount = characters.length;

    const fetchCharacter = async () => {
        try {
            const response = await fetch(`${baseUrl}/api/admin/character`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const data = await response.json();

            if (response.ok) {
                setCharacters(data.characters);
                setLoading(false);
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
    }

    const userCount = users.length;

    const chartCharacter = {
        labels: favoritesCount.map(item => item.character.name),
        datasets: [
            {
                label: 'จำนวนชอบ',
                data: favoritesCount.map(item => item.count),
                backgroundColor: '#176DB0',
                borderColor: '#176DB0',
                borderWidth: 1,
            },
        ],
    };

    const optionsCharacter = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: 'white',
                    font: {
                        size: 14,
                        family: "'Kanit', sans-serif",
                    }
                }
            },
            title: {
                display: true,
                text: 'ตัวละครโปรด',
                color: 'white',
                font: {
                    size: 18,
                    family: "'Kanit', sans-serif",
                }
            },
        },
        scales: {
            x: {
                ticks: {
                    color: 'white',
                    font: {
                        family: "'Kanit', sans-serif",
                    }
                },
            },
        }
    };


    const chartBlog = {
        labels: blogsCount.map(item => item.user?.name),
        datasets: [
            {
                label: 'จำนวนบล็อก',
                data: blogsCount.map(item => item.count),
                backgroundColor: '#176DB0',
                borderColor: '#176DB0',
                borderWidth: 1,
            },
        ],
    };

    const optionsBlog = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: 'white',
                    font: {
                        size: 14,
                        family: "'Kanit', sans-serif",
                    }
                }
            },
            title: {
                display: true,
                text: 'บล็อก',
                color: 'white',
                font: {
                    size: 18,
                    family: "'Kanit', sans-serif",
                }
            },
        },
        scales: {
            x: {
                ticks: {
                    color: 'white',
                    font: {
                        family: "'Kanit', sans-serif",
                    }
                },
            },
        }
    };

    console.log(blogsCount.count)

    const cardDashbaord = [
        { icon: <PiUserThin size={80} />, name: "ผู้ใช้", count: userCount, unit: 'คน' },
        { icon: <PiUsersFourThin size={80} />, name: "ตัวละคร", count: characterCount, unit: 'ตัว' },
    ];

    return (
        <Sidebar header={'แดชบอร์ด'} >
            {
                loading ? (
                    <div className={`min-h-dvh flex items-center justify-center`} >
                        <img src="https://www.jp.square-enix.com/ffvii_rebirth/_common/img/loading.gif" alt="" />
                    </div >
                ) : (
                    <div className="flex flex-col gap-4">
                        <div className="grid gird-cols-1 md:grid-cols-2 gap-2">

                            {cardDashbaord.map((card) => (
                                <div key={card.index + 1} className={`border p-4 border-[#176db0] flex justify-center items-center gap-4 overflow-hidden relative bg-cover bg-center group bg-[url('https://www.jp.square-enix.com/ffvii_rebirth/_common/img/gnav/btn_bg_off_pc.png')]`}>
                                    {card?.icon}
                                    <h1 className="flex items-center gap-2 text-right">
                                        <div>
                                            {card?.name}
                                        </div>
                                        <div className=" text-3xl">
                                            {card?.count}
                                        </div>
                                        <div>
                                            {card?.unit}
                                        </div>
                                    </h1>
                                </div>
                            ))}

                        </div>

                        <div className="border p-4 border-[#176db0]">
                            <BarChart data={chartCharacter} options={optionsCharacter} />
                        </div>

                        <div className="border p-4 border-[#176db0]">
                            <BarChart data={chartBlog} options={optionsBlog} />
                        </div>

                    </div>
                )
            }
        </Sidebar >
    );
}

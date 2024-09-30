"use client";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Grid } from "@/components/Grid";
import { UserContext } from "@/context/UserContext";
import { Layout } from "@/layouts/Layout";
import baseUrl from "@/service/BaseUrl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { PiEyeThin, PiPencilThin, PiPlusThin, PiTrashThin } from "react-icons/pi";
import ReactPaginate from "react-paginate";
import Swal from "sweetalert2";

export default function BlogAll() {
    
    const router = useRouter();

    const { token, setToken, user } = useContext(UserContext);
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBlog();
    }, []);

    const fetchBlog = async () => {
        try {
            const response = await fetch(`${baseUrl}/api/blog-all`);
            const data = await response.json();
            console.log(response)
            if (response.ok) {
                setBlogs(data.blogs);
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
                text: error,
                color: "white",
                confirmButtonText: "ตกลง",
                confirmButtonColor: "#005e95",
                background: "rgba(0,0,0,0) linear-gradient(rgba(0, 54, 104, 0.5), rgba(0, 94, 149, 0.5)) repeat scroll 0 0",
            });
        }
    };

    const [deleting, setDeleting] = useState(null);

    const Delete = async (e, id) => {
        e.preventDefault();
        setDeleting(id);

        try {
            const response = await fetch(`${baseUrl}/api/blog/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`
                }
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
                setBlogs(prev => prev.filter(blog => blog.id !== id));
                setDeleting(null);
            } else if (response.status === 400) {
                Swal.fire({
                    icon: "warning",
                    text: data.message,
                    color: "white",
                    confirmButtonText: "ตกลง",
                    confirmButtonColor: "#005e95",
                    background: "rgba(0,0,0,0) linear-gradient(rgba(0, 54, 104, 0.5), rgba(0, 94, 149, 0.5)) repeat scroll 0 0",
                });
                setDeleting(null);
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

    const [search, setSearch] = useState('');

    const [pageNumber, setPageNumber] = useState(0);
    const perPage = 10;  // จำนวนข้อมูลต่อหน้า

    const handlePageClick = ({ selected }) => {
        setPageNumber(selected);
    };

    const filtered = blogs.filter(blog =>
        blog.name.toLowerCase().includes(search.toLowerCase()) ||
        blog.user.name.toLowerCase().includes(search.toLowerCase())
    );
    const pageCount = Math.ceil(filtered.length / perPage);
    const dataPaginate = filtered.slice(pageNumber * perPage, (pageNumber + 1) * perPage);

    return (
        <>
            {loading ? (
                <div className={`min-h-dvh flex items-center justify-center`}>
                    <img src="https://www.jp.square-enix.com/ffvii_rebirth/_common/img/loading.gif" alt="Loading" />
                </div>
            ) : (
                <Layout header={'บล็อก'}>

                    <div className="w-[95%] mx-auto">


                        <div className={`my-4 flex flex-col md:flex-row justify-end items-center gap-4`}>
                            <div className="flex gap-4">

                                <div className="relative">
                                    <input type="text" placeholder="ค้นหา"
                                        className="w-full md:w-[10rem] pl-8 placeholder:text-sm text-base   className={`block w-full text-base border-b border-[#176db0] appearance-none bg-transparent border px-2 py-1 text-white placeholder:text-sm focus:outline-none focus:border-[#176db0] focus:ring-1 focus:ring-[#176db0]"
                                        value={search} onChange={(e) => setSearch(e.target.value)} />
                                    <span className="material-symbols-outlined absolute top-[0.5rem] left-2"><IoSearchOutline size={20} /></span>
                                </div>
                            </div>

                        </div>


                        <Grid gap={2} className={`grid grid-cols-1 md:grid-cols-3`}>
                            {dataPaginate.length > 0 ? (
                                dataPaginate.map((blog, index) => (
                                    <div key={index} className="flex flex-col gap-4">
                                        <Card
                                            index={index}
                                            link={`/community/blog/${blog?.name}`}
                                            conditionImage={blog?.image}
                                            imageUrl={`${baseUrl}/images/blog/${blog.user_id}/${blog?.image}`}
                                            name={blog?.name}
                                            height={`h-[10rem] md:h-[20rem]`}
                                            number={blog?.view > 0 ? blog?.view : null}
                                        />
                                        <span className="py-1 flex items-center justify-center border border-[#176db0]">ผู้เขียน: {blog?.user?.name}</span>
                                        {blog.user_id === user?.id && (
                                            <div className={`flex items-center justify-center gap-4 p-2 w-full mx-auto border border-[#176db0]`}>

                                                <div>
                                                    <Link href={`/blog/${blog.name}`}>
                                                        <Button icon={<PiEyeThin size={30} />} />
                                                    </Link>
                                                </div>

                                                <div>
                                                    <Link href={`/blog/edit/${blog.id}`}>
                                                        <Button icon={<PiPencilThin size={30} />} />
                                                    </Link>
                                                </div>

                                                <div>
                                                    <Button icon={deleting === blog.id ? "กำลังลบ..." : <PiTrashThin size={30} />} onClick={(e) => Delete(e, blog.id)} />
                                                </div>

                                            </div>
                                        )}

                                    </div>
                                ))
                            ) : (
                                <div className="flex items-center justify-center rounded-lg col-span-6 md:col-span-8">
                                    <span className="text-3xl">ไม่มีข้อมูล</span>
                                </div>
                            )}
                        </Grid>

                        {pageCount > 1 && (
                            <ReactPaginate
                                previousLabel={
                                    <Button name={'กลับ'} />
                                }
                                nextLabel={
                                    <Button name={'หน้าถัดไป'} />
                                }
                                pageCount={pageCount}
                                breakLabel={<span className="mr-4">...</span>}
                                onPageChange={handlePageClick}
                                containerClassName="flex  items-center gap-2 mt-2"
                                pageClassName="relative bg-cover bg-[url('https://www.jp.square-enix.com/ffvii_rebirth/_common/img/gnav/btn_bg_off_pc.png')] group flex items-center justify-center w-[2rem] h-[2rem] hover:brightness-125 hover:outline hover:outline-1 hover:outline-[#176db0] hover:outline-offset-2 transition-all duration-50'} group text-white border border-[#176db0]"
                                activeClassName="brightness-125 outline outline-offset-2 outline-1 outline-[#176db0]"
                            />
                        )}

                    </div>

                </Layout >

            )}

        </>
    )
}

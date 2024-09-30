"use client";

import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Textarea } from "@/components/Textarea";
import { UserContext } from "@/context/UserContext";
import { Layout } from "@/layouts/Layout";
import { Sidebar } from "@/layouts/Sidebar";
import baseUrl from "@/service/BaseUrl";
import { useParams, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { PiArrowFatLinesRightThin, PiImageThin } from "react-icons/pi";
import Swal from "sweetalert2";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // สไตล์สำหรับ Quill

export default function BlogEdit() {

    const { id } = useParams();
    const { token } = useContext(UserContext);

    const [blogField, setBlogField] = useState({
        name: '',
        content: '',
        image: '',
    });

    const [newImage, setNewImage] = useState('');

    const changeBlogFieldHandler = (e) => {
        setBlogField({
            ...blogField,
            [e.target.name]: e.target.value
        });
    }

    const handleContentChange = (content) => {
        setBlogField({
            ...blogField,
            content: content // อัปเดตฟิลด์ content โดยตรง
        });
    }

    const getYouTubeId = (url) => {
        const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^&\n]{11})/;
        const matches = url.match(regex);
        return matches ? matches[1] : null;
    };
    
    const handleVideoLink = async () => {
        const { value: videoUrl } = await Swal.fire({
            title: 'ใส่ลิงค์วิดีโอ YouTube',
            input: 'text',
            inputPlaceholder: 'https://...',
            showCancelButton: true,
             color: "white",
                    confirmButtonText: "ตกลง",
                    confirmButtonColor: "#005e95",
                    background: "rgba(0,0,0,0) linear-gradient(rgba(0, 54, 104, 0.5), rgba(0, 94, 149, 0.5)) repeat scroll 0 0",
        });
    
        if (videoUrl) {
            const videoId = getYouTubeId(videoUrl); // ดึง videoId
            if (videoId) {
                const videoElement = `<iframe width="560px" height="315px" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>`;
                setBlogField((prev) => ({
                    ...prev,
                    content: prev.content + videoElement // เพิ่ม iframe ลงในเนื้อหาของ blogField
                }));
            } else {
                Swal.fire({
                    icon: 'error',
                    text: 'ลิงค์ YouTube ไม่ถูกต้อง',
                    color: "white",
                    confirmButtonText: "ตกลง",
                    confirmButtonColor: "#005e95",
                    background: "rgba(0,0,0,0) linear-gradient(rgba(0, 54, 104, 0.5), rgba(0, 94, 149, 0.5)) repeat scroll 0 0",
                });
            }
        }
    };

    const modules = {
        toolbar: [
            [{ 'header': [1, 2, false] }],
            ['bold', 'italic', 'underline'],
            ['link', 'image'],
            ['clean'],                                         // remove formatting button
        ],
    };


    const handleImageUpload = () => {
        document.getElementById('imageInput').click();
    };

    const onFileChangeImage = (event) => {
        const file = event.target.files[0];
        setNewImage(file);
        setBlogField(prevState => ({
            ...prevState,
            image: file,
        }));
    }

    const [error, setError] = useState([]);

    const router = useRouter();

    const onSubmitChange = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('_method', 'PATCH');
        formData.append('name', blogField.name);

        if (newImage) {
            formData.append('image', newImage);
        }

        formData.append('content', blogField.content);

        try {
            const response = await fetch(`${baseUrl}/api/blog/${id}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formData,
            });
            const data = await response.json();

            console.log(data)

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
                router.push('/blog');
            } else if (response.status === 400) {
                Swal.fire({
                    icon: "success",
                    text: data.message,
                    color: "white",
                    confirmButtonText: "ตกลง",
                    confirmButtonColor: "#005e95",
                    background: "rgba(0,0,0,0) linear-gradient(rgba(0, 54, 104, 0.5), rgba(0, 94, 149, 0.5)) repeat scroll 0 0",
                });
            } else if (response.status === 401) {
                Swal.fire({
                    icon: "warning",
                    text: data.message,
                    color: "white",
                    confirmButtonText: "ตกลง",
                    confirmButtonColor: "#005e95",
                    background: "rgba(0,0,0,0) linear-gradient(rgba(0, 54, 104, 0.5), rgba(0, 94, 149, 0.5)) repeat scroll 0 0",
                });
                router.push('/community/blog')
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


    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (token) {
            fetchBlog();
        }
    }, [token]);

    const fetchBlog = async () => {
        try {
            const response = await fetch(`${baseUrl}/api/blog/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            });
            const data = await response.json();
            if (response.ok) {
                setBlogField(data.blog);
                setLoading(false);
            } else if (response.status === 401) {
                Swal.fire({
                    icon: "warning",
                    text: data.message,
                    color: "white",
                    confirmButtonText: "ตกลง",
                    confirmButtonColor: "#005e95",
                    background: "rgba(0,0,0,0) linear-gradient(rgba(0, 54, 104, 0.5), rgba(0, 94, 149, 0.5)) repeat scroll 0 0",
                });
                router.push('/blog')
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



    return (
        <>
            {loading ? (
                <div className={`min-h-dvh flex items-center justify-center`}>
                    <img src="https://www.jp.square-enix.com/ffvii_rebirth/_common/img/loading.gif" alt="Loading" />
                </div>
            ) : (
                <Layout header={`บล็อก (แก้ไข)`}>
                    <form onSubmit={onSubmitChange}>

                        <div className="flex flex-col gap-4 w-[95%] mx-auto">

                            <div className="flex flex-col md:flex-row gap-4 w-full">

                                <div className={`basis-1/2`}>
                                    <label>รูป</label>
                                    <div className="h-[24rem] p-[0.15rem] border border-[#176db0] cursor-pointer relative overflow-hidden group">
                                        <div
                                            className="absolute w-full h-full bg-black/40 flex items-center justify-center -bottom-20 group-hover:bottom-0 opacity-0 group-hover:opacity-100 transition-all duration-300"
                                            onClick={handleImageUpload}
                                        >
                                            <div className="flex flex-col items-center text-white text-xl">
                                                รูปภาพ
                                                <PiImageThin size={40} />
                                            </div>
                                        </div>
                                        {newImage ? (
                                            <img className={`w-full h-full object-cover`} src={URL.createObjectURL(newImage)} alt={`อัพโหลดรูปภาพ`} />
                                        ) : blogField.image ? (
                                            <img className={`w-full h-full object-cover`} src={`${baseUrl}/images/blog/${blogField.user_id}/${blogField.image}`} alt={`รูปภาพของ ${blogField.name}`} />
                                        ) : (
                                            <img className={`w-full h-full object-cover`} src={`https://www.jp.square-enix.com/ffvii_rebirth/_common/img/gnav/btn_bg_off_pc.png`} alt={`ไม่มีรูปภาพ`} />
                                        )}
                                    </div>

                                    <Button name={`อัพโหลดรูปภาพ`} icon={<PiImageThin size={25} />} className={`w-full mt-2`} onClick={handleImageUpload} />

                                    <input hidden id="imageInput" type="file" onChange={onFileChangeImage} />
                                    {error && error.image && (
                                        <div className={`mt-2 bg-gradient-to-t from-[#5e0a0a] to-[#d70000] outline outline-offset-2 outline-1 outline-[#d70000] px-2 text-sm`}>
                                            {error.image}
                                        </div>
                                    )}
                                </div>

                                <div className="basis-1/2">
                                    <div className="mb-2">
                                        <label>หัวข้อ</label>
                                        <Input
                                            type={`text`}
                                            name="name"
                                            id="name"
                                            value={blogField.name}
                                            placeholder={`หัวข้อ`}
                                            onChange={e => changeBlogFieldHandler(e)} />
                                        {error && error.name && (
                                            <div className={`mt-2 bg-gradient-to-t from-[#5e0a0a] to-[#d70000] outline outline-offset-2 outline-1 outline-[#d70000] px-2 text-sm`}>
                                                {error.name}
                                            </div>
                                        )}
                                    </div>

                                    <div className={`mb-2`}>
                                        <label>รายละเอียด</label>
                                        <ReactQuill
                                            value={blogField.content} // ใช้ค่าใน state
                                            onChange={handleContentChange} // เรียกใช้ฟังก์ชันเมื่อมีการเปลี่ยนแปลง
                                            modules={modules}
                                            placeholder={`รายละเอียด`}
                                        />
                                        <Button name="แทรกลิงก์วิดีโอ YouTube" className={'mt-4'} onClick={handleVideoLink} />
                                        {error && error.content && (
                                            <div className={`mt-2 bg-gradient-to-t from-[#5e0a0a] to-[#d70000] outline outline-offset-2 outline-1 outline-[#d70000] px-2 text-sm`}>
                                                {error.content}
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

                </Layout>
            )}
        </>
    )
}

"use client";

import { UserContext } from "@/context/UserContext";
import { Layout } from "@/layouts/Layout";
import baseUrl from "@/service/BaseUrl";
import { useParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { PiCrownThin, PiPaperPlaneTiltThin, PiPenThin, PiTelegramLogoThin, PiTrashThin } from "react-icons/pi";
import { Grid } from "@/components/Grid";
import { Card } from "@/components/Card";
import ReactPaginate from "react-paginate";
import { Button } from "@/components/Button";
import { IoCloseOutline } from "react-icons/io5";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // สไตล์สำหรับ Quill
import Link from "next/link";
export default function BlogShow() {

  const { token, setToken, user } = useContext(UserContext);
  const [loading, setLoading] = useState(true);

  const { name } = useParams();

  useEffect(() => {
    fetchBlog();
  }, [name]);

  const [blog, setBlog] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [comments, setComments] = useState([]);

  const fetchBlog = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/blog-detail/${name}`, {
      });
      const data = await response.json();
      if (response.ok) {
        setBlog(data.blog);
        setBlogs(data.blog_all);
        setComments(data.blog.comments);
        document.title = "FF7REBIRTH|ดูบล็อก " + data.blog.name;
        setLoading(false);
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

  const [content, setContent] = useState('');

  const [error, setError] = useState([]);

  const [commentField, setCommentField] = useState({
    post_id: '',
    content: '',
  });

  const changeCommentFieldHandler = (e) => {
    setCommentField({
      ...commentField,
      [e.target.name]: e.target.value
    });
  }

  const handleContentChange = (content) => {
    setCommentField({
      ...commentField,
      content: content
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
        setCommentField((prev) => ({
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
      ['clean'],
    ],
  };

  const addComment = async (e, post_id) => {
    e.preventDefault();

    const formData = {
      post_id: post_id,
      content: commentField.content,
    };

    try {
      const response = await fetch(`${baseUrl}/api/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          text: data.message,
          color: "white",
          confirmButtonText: "ตกลง",
          confirmButtonColor: "#005e95",
          background: "rgba(0,0,0,0) linear-gradient(rgba(0, 54, 104, 0.5), rgba(0, 94, 149, 0.5)) repeat scroll 0 0",
        });
        setComments(prev => [...prev, { ...data.comment, user: { id: user.id, name: user.name, avatar: user.avatar } }]);
        setCommentField({ post_id: '', content: '' });
        setError([]);
      } else if (response.status === 422) {
        setError(data.errors);
        console.log(data.errors)
      } else if (response.status === 400) {
        Swal.fire({
          icon: "error",
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
        text: error,
        color: "white",
        confirmButtonText: "ตกลง",
        confirmButtonColor: "#005e95",
        background: "rgba(0,0,0,0) linear-gradient(rgba(0, 54, 104, 0.5), rgba(0, 94, 149, 0.5)) repeat scroll 0 0",
      });
    }
  }

  const startEditing = (comment) => {
    setEditingCommentId(comment.id);
    setEditingContent(comment.content);
  }

  const handleContentChangeEdit = (content) => {
    setEditingContent(content);
  };


  const cancelEditing = () => {
    setEditingCommentId(null);
    setEditingContent('');
  }

  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingContent, setEditingContent] = useState('');

  const updateComment = async (e, comment_id) => {
    e.preventDefault();

    const formData = {
      content: editingContent,
    };

    const response = await fetch(`${baseUrl}/api/comments/${comment_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(formData),
    });
    const data = await response.json();
    if (response.status === 200) {
      Swal.fire({
        icon: "success",
        text: data.message,
        color: "white",
        confirmButtonText: "ตกลง",
        confirmButtonColor: "#005e95",
        background: "rgba(0,0,0,0) linear-gradient(rgba(0, 54, 104, 0.5), rgba(0, 94, 149, 0.5)) repeat scroll 0 0",
      });
      setComments(prev => prev.map(comment => comment.id === comment_id ? { ...comment, content: editingContent } : comment));
      cancelEditing();
    } else if (response.status === 422) {
      setError(data.errors);
    }
  };

  const deleteComment = async (e, comment_id) => {
    e.preventDefault();

    try {
      const response = await fetch(`${baseUrl}/api/comments/${comment_id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        },
      });
      const data = await response.json();
      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          text: data.message,
          color: "white",
          confirmButtonText: "ตกลง",
          confirmButtonColor: "#005e95",
          background: "rgba(0,0,0,0) linear-gradient(rgba(0, 54, 104, 0.5), rgba(0, 94, 149, 0.5)) repeat scroll 0 0",
        });
        setComments(prev => prev.filter(comment => comment.id !== comment_id));
      } else if (response.status === 422) {
        setError(response.data.errors);
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

  const [search, setSearch] = useState('');

  const [pageNumber, setPageNumber] = useState(0);
  const perPageComment = 10;  // จำนวนข้อมูลต่อหน้า

  const handlePageClick = ({ selected }) => {
    setPageNumber(selected);
  };

  const filteredComment = comments.filter(comment =>
    comment?.user?.name.toLowerCase().includes(search.toLowerCase())
  );

  const pageCountComment = Math.ceil(filteredComment.length / perPageComment);
  const commentPaginate = filteredComment.slice(pageNumber * perPageComment, (pageNumber + 1) * perPageComment);


  return (
    <>
      {loading ? (
        <div className={`min-h-dvh flex items-center justify-center`}>
          <img src="https://www.jp.square-enix.com/ffvii_rebirth/_common/img/loading.gif" alt="" />
        </div>
      ) : (
        <Layout>
          <div className="w-[95%] mx-auto">

            <div className="group">

              <div className="flex flex-col  gap-4 my-4">

                <h1 className="text-3xl">{blog?.name}</h1>

                <div className="h-[20rem] md:h-[40rem]  outline outline-offset-2 outline-1 outline-[#176db0] cursor-pointer relative overflow-hidden group">
                  {blog?.image ? (
                    <img className={`w-full h-full object-cover`} src={`${baseUrl}/images/blog/${blog?.user_id}/${blog?.image}`} alt={`รูปภาพของ ${blog?.name}`} />
                  ) : (
                    <img className={`w-full h-full object-cover`} src={`https://www.jp.square-enix.com/ffvii_rebirth/_common/img/gnav/btn_bg_off_pc.png`} alt={`ไม่มีรูปภาพ`} />
                  )}
                </div>

                <div className="text-justify w-full" dangerouslySetInnerHTML={{ __html: blog.content }} />

              </div>

            </div>

            <div className="mx-auto my-4">

              <h1 className="text-3xl mb-4">บล็อกที่อาจสนใจ</h1>

              <Grid gap={2} className={`grid grid-cols-1 md:grid-cols-4`}>
                {blogs.length > 0 ? (
                  blogs.map((blog, index) => (
                    <div key={index} className="flex flex-col gap-4">
                      <Card
                        index={index}
                        link={`/community/blog/${blog?.name}`}
                        conditionImage={blog?.image}
                        imageUrl={`${baseUrl}/images/blog/${blog.user_id}/${blog?.image}`}
                        name={blog?.name}
                        height={`h-[8rem] md:h-[16rem]`}
                        number={blog?.view > 0 ? blog?.view : null}
                      />
                      <span className="py-1 flex items-center justify-center border border-[#176db0]">ผู้เขียน: {blog?.user?.name}</span>

                    </div>
                  ))
                ) : (
                  <div className="flex items-center justify-center rounded-lg col-span-6 md:col-span-8">
                    <span className="text-3xl">ไม่มีข้อมูล</span>
                  </div>
                )}
              </Grid>

            </div>

            <div className="my-4">
              <h2 className="text-3xl">ความคิดเห็น</h2>
              <div className="flex flex-col gap-4 overscroll-auto py-1">
                {commentPaginate.length > 0 ? (
                  commentPaginate.map((comment, index) => (
                    <Grid key={index}>
                      <div className="flex gap-2 mb-4">

                        <Link href={`/community/user/${comment?.user?.name}`}>
                          <div className="w-[4rem] overflow-hidden border border-[#176db0] p-[0.15rem]">
                            {comment.user.avatar ? (
                              <img className="w-full h-full object-cover" src={`${baseUrl}/images/avatar/${comment.user.avatar}`} alt={`รูปภาพของ ${comment.user.name}`} />
                            ) : (
                              <img className="w-full h-full object-cover" src={`${baseUrl}/images/product/No_image.png`} alt={`ไม่มีรูปภาพ Avatar`} />
                            )}
                          </div>
                        </Link>

                        <div className="flex flex-col gap-2">
                          {comment.user ? (
                            <>
                              <div className="flex gap-2">
                                <span className="border border-[#176db0] px-2">{comment.user.role === 1 ? 'admin' : 'user'}</span>
                                {comment.user.id === blog.user_id && (
                                  <PiCrownThin className="drop-shadow-2xl text-[#176db0] " size={25} />
                                )}
                              </div>
                              <p className="text-base">{comment.user.name}</p>
                            </>
                          ) : (
                            <p>ผู้ใช้ไม่ทราบ</p>
                          )}

                        </div>

                      </div>


                      {editingCommentId === comment.id ? (
                        <>
                          <ReactQuill
                            value={editingContent}
                            onChange={handleContentChangeEdit}
                            modules={modules}
                            placeholder="พิมพ์ความคิดเห็น"
                            className="mt-2"
                          />
                          <Button name="แทรกลิงก์วิดีโอ YouTube" className={'mt-2'} onClick={handleVideoLink} />
                          {error && error.content && (
                            <div className={`mt-2 bg-gradient-to-t from-[#5e0a0a] to-[#d70000] outline outline-offset-2 outline-1 outline-[#d70000] px-2 text-sm`}>
                              {error.content}
                            </div>
                          )}
                          <div className="flex gap-2 mt-2">
                            <Button name={'อัพเดท'} className="flex justify-end" icon={<PiPaperPlaneTiltThin size={20} />}
                              onClick={(e) => updateComment(e, comment.id)}
                            />

                            <Button name={'ยกเลิก'} className="flex justify-end" icon={<IoCloseOutline size={20} />}
                              onClick={cancelEditing}
                            />

                          </div>
                        </>
                      ) : (
                        <>

                          <div className={`text-justify w-full ${user?.id === comment.user_id ? 'my-2' : ''}`} dangerouslySetInnerHTML={{ __html: comment.content }} />
                          {user?.id === comment.user_id && (
                            <div className="flex gap-2">
                              <Button className="flex justify-end" name={'แก้ไข'} icon={<PiPenThin size={20} />}
                                onClick={() => startEditing(comment)}
                              />
                              <Button className="flex justify-end" name={'ลบ'} icon={<PiTrashThin size={20} />} onClick={(e) => deleteComment(e, comment.id)} />
                            </div>

                          )}
                        </>
                      )}
                    </Grid>
                  ))
                ) : (
                  <div className="p-4 flex items-center justify-center rounded-lg">
                    ไม่มีความคิดเห็น
                  </div>
                )}
              </div>

              {token && (
                <form>
                  <ReactQuill
                    value={commentField.content} // ใช้ค่าใน state
                    onChange={handleContentChange} // เรียกใช้ฟังก์ชันเมื่อมีการเปลี่ยนแปลง
                    modules={modules}
                    placeholder={`รายละเอียด`}
                  />
                  {error && error.content && (
                    <div className={`mt-2 bg-gradient-to-t from-[#5e0a0a] to-[#d70000] outline outline-offset-2 outline-1 outline-[#d70000] px-2 text-sm`}>
                      {error.content}
                    </div>
                  )}
                  <Button name="แทรกลิงก์วิดีโอ YouTube" className={'mt-2'} onClick={handleVideoLink} />
                  <div className="flex gap-2">
                    <Button className={'mt-2'} name={'ส่งความคิดเห็น'} type="submit" icon={<PiTelegramLogoThin size={20} />}
                      onClick={(e) => addComment(e, blog.id)}
                    />
                  </div>
                </form>
              )}

              {pageCountComment > 1 && (
                <ReactPaginate
                  previousLabel={
                    <Button name={'กลับ'} />
                  }
                  nextLabel={
                    <Button name={'หน้าถัดไป'} />
                  }
                  pageCount={pageCountComment}
                  breakLabel={<span className="mr-4">...</span>}
                  onPageChange={handlePageClick}
                  containerClassName="flex  items-center gap-2 mt-2"
                  pageClassName="relative bg-cover bg-[url('https://www.jp.square-enix.com/ffvii_rebirth/_common/img/gnav/btn_bg_off_pc.png')] group flex items-center justify-center w-[2rem] h-[2rem] hover:brightness-125 hover:outline hover:outline-1 hover:outline-[#176db0] hover:outline-offset-2 transition-all duration-50'} group text-white border border-[#176db0]"
                  activeClassName="brightness-125 outline outline-offset-2 outline-1 outline-[#176db0]"
                />
              )}

            </div>

          </div >
        </Layout >
      )
      }
    </>
  )
}

"use client";

import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Grid } from "@/components/Grid";
import { UserContext } from "@/context/UserContext";
import { Layout } from "@/layouts/Layout";
import baseUrl from "@/service/BaseUrl";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { PiEyeThin, PiPencilThin } from "react-icons/pi";
import ReactPaginate from "react-paginate";
import Swal from "sweetalert2";

export default function UserDetailCommunity() {


  const { name } = useParams();

  const router = useRouter();

  const { token, setToken, user } = useContext(UserContext);
  const [loading, setLoading] = useState(true);

  const [blogs, setBlogs] = useState([]);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    fetchCommunityUser();
  }, [name]);

  const [deleting, setDeleting] = useState(null);

  const fetchCommunityUser = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/communityuser/${name}`);
      const data = await response.json();
      console.log(response)
      if (response.ok) {
        setBlogs(data.blogs);
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
        text: error,
        color: "white",
        confirmButtonText: "ตกลง",
        confirmButtonColor: "#005e95",
        background: "rgba(0,0,0,0) linear-gradient(rgba(0, 54, 104, 0.5), rgba(0, 94, 149, 0.5)) repeat scroll 0 0",
      });
    }
  };

  const [searchBlog, setSearchBlog] = useState('');

  const [searchCharacter, setSearchCharacter] = useState('');

  const [pageNumber, setPageNumber] = useState(0);
  const perPage = 10;  // จำนวนข้อมูลต่อหน้า

  const handlePageClick = ({ selected }) => {
    setPageNumber(selected);
  };

  const MyBlog = blogs.some(blog =>
    blog.user_id === user?.id
  );

  const filteredBlog = blogs.filter(blog =>
    blog.name.toLowerCase().includes(searchBlog.toLowerCase()) ||
    blog.user.name.toLowerCase().includes(searchBlog.toLowerCase())
  );

  const pageCountBlog = Math.ceil(filteredBlog.length / perPage);
  const blogPaginate = filteredBlog.slice(pageNumber * perPage, (pageNumber + 1) * perPage);

  const filteredFavorite = favorites.filter(favorites =>
    favorites.character.name.toLowerCase().includes(searchCharacter.toLowerCase()) ||
    favorites.character.role?.name.toLowerCase().includes(searchCharacter.toLowerCase())
  );

  const pageCountFavorite = Math.ceil(filteredFavorite.length / perPage);
  const favoritePaginate = filteredFavorite.slice(pageNumber * perPage, (pageNumber + 1) * perPage);

  return (
    <>
      {loading ? (
        <div className={`min-h-dvh flex items-center justify-center`}>
          <img src="https://www.jp.square-enix.com/ffvii_rebirth/_common/img/loading.gif" alt="Loading" />
        </div>
      ) : (
        <Layout header={`ข้อมูลของ ${name}`}>

          <div className="w-[95%] mx-auto flex flex-col gap-2 min-h-dvh">


            <div className={`flex flex-col md:flex-row justify-between items-center gap-4`}>

              <h1 className="text-3xl">บล็อก</h1>

              <div className="flex gap-4">

                <div className="relative">
                  <input type="text" placeholder="ค้นหา"
                    className="w-full md:w-[10rem] pl-8 placeholder:text-sm text-base   className={`block w-full text-base border-b border-[#176db0] appearance-none bg-transparent border px-2 py-1 text-white placeholder:text-sm focus:outline-none focus:border-[#176db0] focus:ring-1 focus:ring-[#176db0]"
                    value={searchBlog} onChange={(e) => setSearchBlog(e.target.value)} />
                  <span className="material-symbols-outlined absolute top-[0.5rem] left-2"><IoSearchOutline size={20} /></span>
                </div>
              </div>

            </div>


            <Grid gap={2} className={`grid grid-cols-2 md:grid-cols-3`}>
              {blogPaginate.length > 0 ? (
                blogPaginate.map((blog, index) => (
                  <div key={index} className="flex flex-col gap-4">
                    <Card
                      index={index}
                      link={`/community/blog/${blog?.name}`}
                      conditionImage={blog?.image}
                      imageUrl={`${baseUrl}/images/blog/${blog.user_id}/${blog?.image}`}
                      name={blog?.name}
                      height={`h-[20rem]`}
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

            {pageCountBlog > 1 && (
              <ReactPaginate
                previousLabel={
                  <Button name={'กลับ'} />
                }
                nextLabel={
                  <Button name={'หน้าถัดไป'} />
                }
                pageCount={pageCountBlog}
                breakLabel={<span className="mr-4">...</span>}
                onPageChange={handlePageClick}
                containerClassName="flex  items-center gap-2 mt-2"
                pageClassName="relative bg-cover bg-[url('https://www.jp.square-enix.com/ffvii_rebirth/_common/img/gnav/btn_bg_off_pc.png')] group flex items-center justify-center w-[2rem] h-[2rem] hover:brightness-125 hover:outline hover:outline-1 hover:outline-[#176db0] hover:outline-offset-2 transition-all duration-50'} group text-white border border-[#176db0]"
                activeClassName="brightness-125 outline outline-offset-2 outline-1 outline-[#176db0]"
              />
            )}


            <div className={`flex flex-col md:flex-row justify-between items-center gap-4`}>

              <h1 className="text-3xl">ตัวละครโปรด</h1>

              <div className="flex gap-4">

                <div className="relative">
                  <input type="text" placeholder="ค้นหา"
                    className="w-full md:w-[10rem] pl-8 placeholder:text-sm text-base   className={`block w-full text-base border-b border-[#176db0] appearance-none bg-transparent border px-2 py-1 text-white placeholder:text-sm focus:outline-none focus:border-[#176db0] focus:ring-1 focus:ring-[#176db0]"
                    value={searchCharacter} onChange={(e) => setSearchCharacter(e.target.value)} />
                  <span className="material-symbols-outlined absolute top-[0.5rem] left-2"><IoSearchOutline size={20} /></span>
                </div>
              </div>

            </div>


            <div className={`p-4 border-r-4 border-l-4 border-[#3d87ab] bg-[#033D71]/60 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4`}>
              {favoritePaginate.length > 0 ? (
                favoritePaginate.map((favorite, index) => (
                  <Card
                    key={index}
                    index={index}
                    link={`/character`}
                    backgroundImageUrl={`${baseUrl}/images/character/${favorite?.character?.slug}/${favorite?.character?.background}`}
                    conditionImage={favorite?.character?.avatar}
                    imageUrl={`${baseUrl}/images/character/${favorite?.character?.slug}/${favorite?.character?.avatar}`}
                    name={favorite?.character?.name}
                  />
                ))
              ) : (
                <div className="flex items-center justify-center rounded-lg col-span-6 md:col-span-6">
                  <span className="text-3xl">ไม่มีข้อมูล</span>
                </div>
              )}
            </div>


            {pageCountFavorite > 1 && (
              <ReactPaginate
                previousLabel={
                  <Button name={'กลับ'} />
                }
                nextLabel={
                  <Button name={'หน้าถัดไป'} />
                }
                pageCount={pageCountFavorite}
                breakLabel={<span className="mr-4">...</span>}
                onPageChange={handlePageClick}
                containerClassName="flex  items-center gap-2 mt-2"
                pageClassName="relative bg-cover bg-[url('https://www.jp.square-enix.com/ffvii_rebirth/_common/img/gnav/btn_bg_off_pc.png')] group flex items-center justify-center w-[2rem] h-[2rem] hover:brightness-125 hover:outline hover:outline-1 hover:outline-[#176db0] hover:outline-offset-2 transition-all duration-50'} group text-white border border-[#176db0]"
                activeClassName="brightness-125 outline outline-offset-2 outline-1 outline-[#176db0]"
              />
            )}



          </div>

        </Layout>
      )}
    </>
  )
}

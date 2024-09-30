"use client";
import { Button } from "@/components/Button";
import { UserContext } from "@/context/UserContext";
import { Sidebar } from "@/layouts/Sidebar"
import baseUrl from "@/service/BaseUrl";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { GoTriangleDown } from "react-icons/go";
import { IoSearchOutline } from "react-icons/io5";
import { PiEyeThin, PiPencil, PiPencilThin, PiPlusThin, PiSquaresFourThin, PiTableThin, PiTrashThin } from "react-icons/pi";
import ReactPaginate from "react-paginate";
import Swal from "sweetalert2";

export default function BattleIndex() {

  const { token } = useContext(UserContext);

  const [search, setSearch] = useState('');
  const [battles, setBattles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    if (token) {
      fetchBattle();
    }
  }, [token]);

  const fetchBattle = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/admin/battle`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();

      if (response.ok) {
        setBattles(data.battles);
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

  const Delete = async (e, id) => {
    e.preventDefault();
    setDeleting(id);

    try {
      const response = await fetch(`${baseUrl}/api/admin/battle/${id}`, {
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
        setBattles(prev => prev.filter(wolrd => wolrd.id !== id));
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


  const [tab, setTab] = useState(true);

  const toggleTabTable = () => {
    setTab(true);
  };

  const toggleTabCard = () => {
    setTab(false);
  };

  const [pageNumber, setPageNumber] = useState(0);
  const perPage = 10;  // จำนวนข้อมูลต่อหน้า

  const handlePageClick = ({ selected }) => {
    setPageNumber(selected);
  };

  const filtered = battles.filter(battle => battle.name.toLowerCase().includes(search.toLowerCase()));
  const pageCount = Math.ceil(filtered.length / perPage);
  const dataPaginate = filtered.slice(pageNumber * perPage, (pageNumber + 1) * perPage);


  return (
    <Sidebar header={`แบทเทิล (ทั้งหมด)`}>
      {loading ? (
        <div className={`min-h-dvh flex items-center justify-center`}>
          <img src="https://www.jp.square-enix.com/ffvii_rebirth/_common/img/loading.gif" alt="" />
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-4">


            <div className="flex flex-col md:flex-row justify-between items-center gap-4">

              <div>
                <Link href={'/admin/battle/create'}>
                  <Button icon={<PiPlusThin size={25} />} />
                </Link>
              </div>

              <div className="flex gap-4">

                <Button icon={<PiTableThin size={25} />} condition={tab === true} onClick={toggleTabTable} />

                <Button icon={<PiSquaresFourThin size={25} />} condition={tab === false} onClick={toggleTabCard} />
                <div className="relative">
                  <input type="text" placeholder="ค้นหา"
                    className="w-full md:w-[10rem] pl-8 placeholder:text-sm text-base   className={`block w-full text-base border-b border-[#176db0] appearance-none bg-transparent border px-2 py-1 text-white placeholder:text-sm focus:outline-none focus:border-[#176db0] focus:ring-1 focus:ring-[#176db0]"
                    value={search} onChange={(e) => setSearch(e.target.value)} />
                  <span className="material-symbols-outlined absolute top-[0.5rem] left-2"><IoSearchOutline size={20} /></span>
                </div>
              </div>

            </div>

            <div className={`overflow-auto no-scroll-bar border border-[#176db0] p-4`}>
              {tab === true ? (
                <table className={`w-full`}>
                  <thead>
                    <tr className={`text-left border-b border-[#176db0]`}>
                      <th>รูปภาพ</th>
                      <th>ชื่อ</th>
                      <th>รายละเอียด</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataPaginate.length > 0 ? (
                      dataPaginate.map((battle, index) => (
                        <tr key={index} className={`border-b border-[#176db0]`}>
                          <td>
                            <img className={`w-20`} src={battle?.image} />
                          </td>
                          <td>{battle?.slug}</td>
                          <td>{battle?.name}</td>
                          <td className="">
                            <p className="w-[5rem] truncate">{battle?.description}</p>
                          </td>
                          <td>
                            <div className={`flex items-center gap-2`}>

                              <div>
                                <Link href={`/admin/battle/show/${battle.id}`}>
                                  <Button icon={<PiEyeThin size={25} />} />
                                </Link>
                              </div>

                              <div>
                                <Link href={`/admin/battle/edit/${battle.id}`}>
                                  <Button icon={<PiPencilThin size={25} />} />
                                </Link>
                              </div>

                              <div>
                                <Button icon={deleting === battle.id ? "กำลังลบ..." : <PiTrashThin size={25} />} onClick={(e) => Delete(e, battle.id)} />
                              </div>

                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td className="text-center" colSpan={4}>ไม่มีข้อมูล</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              ) : tab === false && (
                <div className={`grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 grid-auto-rows-min-content object-cover my-1`}>
                  {dataPaginate.length > 0 ? (
                    dataPaginate.map((battle, index) => (
                      <div
                        key={index}
                        className={`overflow-hidden border border-[#176db0] p-[0.1rem] hover:brightness-125`}
                      >
                        <Link href={`/admin/battle/show/${battle?.id}`}>
                          <div
                            className={`relative overflow-hidden bg-cover bg-center group`}
                          >
                            {battle?.image ? (
                              <img
                                className={`w-full h-full object-cover transform transition-transform duration-300 hover:scale-105`}
                                src={battle?.image}
                                alt={`รูปภาพของตัวละคร ${battle?.name}`}
                              />
                            ) : (
                              <img
                                className={`w-full h-full object-cover`}
                                src={`https://i.imgur.com/epnbr1l.png`}
                                alt={`ไม่มีรูปภาพ`}
                              />
                            )}

                            <div className={`absolute top-0 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300`}>
                              <GoTriangleDown size={20} className="text-[#176db0] brightness-150" />
                            </div>

                            <div className={`absolute bottom-2 w-full`}>
                              <div className={`mx-auto w-[80%] px-2 border-l-4 border-[#9a0000] bg-gradient-to-r from-black from-[40%]`}>
                                {battle?.name}
                              </div>
                            </div>

                          </div>

                          <div className={`flex items-center gap-1 justify-between my-1 w-[80%] mx-auto`}>

                            <div>
                              <Link href={`/admin/battle/show/${battle.id}`}>
                                <Button icon={<PiEyeThin size={25} />} />
                              </Link>
                            </div>

                            <div>
                              <Link href={`/admin/battle/edit/${battle.id}`}>
                                <Button icon={<PiPencilThin size={25} />} />
                              </Link>
                            </div>

                            <div>
                              <Button icon={deleting === battle.id ? "กำลังลบ..." : <PiTrashThin size={25} />} onClick={(e) => Delete(e, battle.id)} />
                            </div>

                          </div>

                        </Link>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center justify-center rounded-lg col-span-3 md:col-span-6">
                      <span className="text-3xl font-semibold">ไม่มีข้อมูล</span>
                    </div>
                  )}
                </div>

              )}
            </div>

          </div>
        </>
      )}

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

    </Sidebar>
  )
}

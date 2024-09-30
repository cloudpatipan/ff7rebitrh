"use client";
import { Button } from '@/components/Button';
import { UserContext } from '@/context/UserContext';
import { Sidebar } from '@/layouts/Sidebar'
import baseUrl from '@/service/BaseUrl';
import axios from 'axios';
import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react'
import { IoSearchOutline } from 'react-icons/io5';
import { PiEyeThin, PiPencil, PiPencilThin, PiPlusThin, PiSquaresFourThin, PiTableThin, PiTrashThin } from 'react-icons/pi';
import ReactPaginate from 'react-paginate';
import Swal from 'sweetalert2';

export default function RoleIndex() {

  const { token } = useContext(UserContext);

  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    if (token) {
      fetchRole();
    }
  }, [token]);

  const fetchRole = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/admin/role`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setRoles(data.roles);
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

  const deleteRole = async (e, id) => {
    e.preventDefault();
    setDeleting(id);

    try {
      const response = await fetch(`${baseUrl}/api/admin/role/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
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
        setRoles(prev => prev.filter(role => role.id !== id));
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

  const [search, setSearch] = useState('');

  const [pageNumber, setPageNumber] = useState(0);
  const perPage = 10;  // จำนวนข้อมูลต่อหน้า

  const handlePageClick = ({ selected }) => {
    setPageNumber(selected);
  };

  const filtered = roles.filter(role => role.name.toLowerCase().includes(search.toLowerCase()));
  const pageCount = Math.ceil(filtered.length / perPage);
  const dataPaginate = filtered.slice(pageNumber * perPage, (pageNumber + 1) * perPage);

  return (
    <Sidebar header={`บทบาท (ทั้งหมด)`}>
      {loading ? (
        <div className={`min-h-dvh flex items-center justify-center`}>
          <img src="https://www.jp.square-enix.com/ffvii_rebirth/_common/img/loading.gif" alt="" />
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-4">

            <div className="flex flex-col md:flex-row justify-between items-center gap-4">

              <div>
                <Link href={'/admin/role/create'}>
                  <Button icon={<PiPlusThin size={25} />} />
                </Link>
              </div>

              <div className="flex gap-4">

                <Button condition={tab === true} icon={<PiTableThin size={25} />} onClick={toggleTabTable} />

                <Button condition={tab === false} icon={<PiSquaresFourThin size={25} />} onClick={toggleTabCard} />

                <div className="relative">
                  <input type="text" placeholder="ค้นหา"
                    className="w-full md:w-[10rem] pl-8 placeholder:text-sm text-base   className={`block w-full text-base border-b border-[#176db0] appearance-none bg-transparent border px-2 py-1 text-white placeholder:text-sm focus:outline-none focus:border-[#176db0] focus:ring-1 focus:ring-[#176db0]"
                    value={search} onChange={(e) => setSearch(e.target.value)} />
                  <span className="material-symbols-outlined absolute top-[0.5rem] left-2"><IoSearchOutline size={20} /></span>
                </div>
              </div>
            </div>

            <div className={`overflow-auto no-scroll-bar border border-[#176db0] p-4`}>
              <table className={`w-full`}>
                <thead>
                  <tr className={`text-left border-b border-[#176db0]`}>
                    <th>รหัส</th>
                    <th>สลัก</th>
                    <th>ชื่อ</th>
                  </tr>
                </thead>
                <tbody>
                  {dataPaginate.length > 0 ? (
                    dataPaginate.map((role, index) => (
                      <tr key={index} className={`border-b border-[#176db0]`}>
                        <td>{role?.id}</td>
                        <td>{role?.slug}</td>
                        <td>{role?.name}</td>
                        <td>
                          <div className={`flex items-center gap-2`}>

                            <Link href={`/admin/role/show/${role.id}`}>
                              <Button icon={<PiEyeThin size={25} />} />
                            </Link>

                            <Link href={`/admin/role/edit/${role.id}/`}>
                              <Button icon={<PiPencilThin size={25} />} />
                            </Link>

                            <Button icon={deleting === role.id ? "กำลังลบ..." : <PiTrashThin size={25} />} onClick={(e) => deleteRole(e, role.id)} />
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td>ไม่มีข้อมูล</td>
                    </tr>
                  )}
                </tbody>
              </table>
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

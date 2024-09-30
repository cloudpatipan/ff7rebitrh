"use client";

import { UserContext } from "@/context/UserContext";
import { Sidebar } from "@/layouts/Sidebar";
import baseUrl from "@/service/BaseUrl";
import axios from "axios";
import { useParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function WorldShow() {

  const { token } = useContext(UserContext);

  const [loading, setLoading] = useState(true);

  const { id } = useParams();

  useEffect(() => {
    if (token) {
      fetchWorld();
    }
  }, [id, token]);

  const [world, setWorld] = useState([]);

  const fetchWorld = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/admin/world/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();

      if (response.ok) {
        setWorld(data.world);
        document.title = "FF7REBIRTH|ดูโลก " + data.world.name;
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


  return (
    <Sidebar header={`โลก (ดู)`}>
      <>
        {loading ? (
          <div className={`min-h-dvh flex items-center justify-center`}>
            <img src="https://www.jp.square-enix.com/ffvii_rebirth/_common/img/loading.gif" alt="" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>

              <div>
                <label>รูปภาพโลก</label>
                <div className="outline outline-offset-2 outline-1 outline-[#176db0] cursor-pointer relative overflow-hidden group">
                  {world?.image ? (
                    <img className={`w-full h-full object-cover`} src={`${baseUrl}/images/world/${world?.slug}/${world?.image}`} alt={`รูปภาพของ ${world?.name}`} />
                  ) : (
                    <img className={`w-full h-full object-cover`} src={`https://www.jp.square-enix.com/ffvii_rebirth/_common/img/gnav/btn_bg_off_pc.png`} alt={`ไม่มีรูปภาพ`} />
                  )}
                </div>
              </div>

              <div className={`mt-2`}>
                <label>ชื่อโลก</label>
                <p>{world?.name}</p>
              </div>

              <div className={`mt-2`}>
                <label>รายละเอียด</label>
                <p>{world?.description}</p>
              </div>

            </div>

          </div>

        )}
      </>
    </Sidebar>
  )
}

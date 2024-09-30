"use client";

import { UserContext } from "@/context/UserContext";
import { Sidebar } from "@/layouts/Sidebar";
import baseUrl from "@/service/BaseUrl";
import axios from "axios";
import { useParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function BattleShow() {

  const { token } = useContext(UserContext);

  const [loading, setLoading] = useState(true);

  const { id } = useParams();

  useEffect(() => {
    if (token) {
      fetchBattle();
    }
  }, [id, token]);

  const [battle, setBattle] = useState([]);

  const fetchBattle = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/admin/battle/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setBattle(data.battle);
        document.title = "FF7REBIRTH|ดูโลก " + data.battle.name;
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
    <Sidebar header={`แบทเทิล (ดู)`}>
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
                  {battle?.image ? (
                    <img className={`w-full h-full object-cover`} src={battle?.image} />
                  ) : (
                    <img className={`w-full h-full object-cover`} src={`https://www.jp.square-enix.com/ffvii_rebirth/_common/img/gnav/btn_bg_off_pc.png`} alt={`ไม่มีรูปภาพ`} />
                  )}
                </div>
              </div>

              <div className={`mt-2`}>
                <label>ชื่อโลก</label>
                <p>{battle?.name}</p>
              </div>

              <div className={`mt-2`}>
                <label>รายละเอียด</label>
                <p>{battle?.description}</p>
              </div>

            </div>

          </div>

        )}
      </>
    </Sidebar>
  )
}

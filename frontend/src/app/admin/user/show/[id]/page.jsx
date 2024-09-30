"use client";

import { UserContext } from "@/context/UserContext";
import { Sidebar } from "@/layouts/Sidebar";
import baseUrl from "@/service/BaseUrl";
import axios from "axios";
import { useParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function UserShow() {

  const { token } = useContext(UserContext);

  const [loading, setLoading] = useState(true);

  const { id } = useParams();

  useEffect(() => {
    if (token) {
      fetchUser();
    }
  }, [id, token]);

  const [user, setUser] = useState([]);

  const fetchUser = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/admin/user/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setUser(data.user);
        document.title = "FF7REBIRTH|ดูผู้ใช้ " + data.user.name;
        setLoading(false);
      } else if (response.status === 400) {
        Swal.fire({
          icon: "error",
          text: data.message,
          color: "white",
          confirmButtonText: "ตกลง",
          confirmButtonColor: "#005e95",
          background: "rgba(0,0,0,0) linear-gradient(rgba(0, 54, 104, 0.5), rgba(0, 94, 149, 0.5)) repeat scroll 0 0",
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
  }


  return (
    <Sidebar header={`โลก (ดูข้อมูล)`}>
      {loading ? (
        <div className={`min-h-dvh flex items-center justify-center`}>
          <img src="https://www.jp.square-enix.com/ffvii_rebirth/_common/img/loading.gif" alt="" />
        </div>
      ) : (


          <div className="flex gap-4">

            <div className="mb-2">
              <label>รูปภาพผู้ใช้</label>
              <div className="h-[10rem] w-[10rem] outline outline-offset-2 outline-1 outline-[#176db0] cursor-pointer relative overflow-hidden group">
                {user?.avatar ? (
                  <img className={`w-full h-full object-cover`} src={`${baseUrl}/images/avatar/${user?.avatar}`} alt={`รูปภาพของผู้ใช้ ${user?.name}`} />
                ) : (
                  <img className={`w-full h-full object-cover`} src={`https://www.jp.square-enix.com/ffvii_rebirth/_common/img/gnav/btn_bg_off_pc.png`} alt={`ไม่มีรูปภาพ`} />
                )}
              </div>
            </div>

            <div>
              <label>ชื่อผู้ใช้</label>
              <p>{user?.name}</p>
            </div>


          </div>
      )}
        </Sidebar>
  )
}

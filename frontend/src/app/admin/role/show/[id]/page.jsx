"use client";

import { UserContext } from "@/context/UserContext";
import { Sidebar } from "@/layouts/Sidebar";
import baseUrl from "@/service/BaseUrl";
import axios from "axios";
import { useParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function RoleShow() {

  const { token } = useContext(UserContext);

  const [loading, setLoading] = useState(true);

  const { id } = useParams();

  useEffect(() => {
    if (token) {
      fetchRole();
    }
  }, [id, token]);

  const [role, setRole] = useState([]);

  const fetchRole = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/admin/role/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setRole(data.role);
        document.title = "FF7REBIRTH|ดูบทบาท" + data.role.name;
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
    <Sidebar header={'บทบาท (ดู)'}>
      <>
        {loading ? (
          <div className={`min-h-dvh flex items-center justify-center`}>
            <img src="https://www.jp.square-enix.com/ffvii_rebirth/_common/img/loading.gif" alt="" />
          </div>
        ) : (
          <div className="flex flex-col gap-4">

            <div>
              <div className={`px-2 border-l-4 mb-2 border-[#9a0000] bg-gradient-to-r from-black from-[40%]`}>
                <label>บทบาท</label>
              </div>
              <p>{role?.name}</p>
            </div>

          </div>

        )}
      </>
    </Sidebar>
  )
}

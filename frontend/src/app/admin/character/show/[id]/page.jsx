"use client";

import { UserContext } from "@/context/UserContext";
import { Sidebar } from "@/layouts/Sidebar";
import baseUrl from "@/service/BaseUrl";
import axios from "axios";
import { useParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function CharacterShow() {

  const { token } = useContext(UserContext);

  const [loading, setLoading] = useState(true);

  const { id } = useParams();

  useEffect(() => {
    if (token) {
      fetchCharacter();
    }
  }, [id, token]);

  const [character, setCharacter] = useState([]);

  const fetchCharacter = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/admin/character/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setCharacter(data.character);
        setLoading(false);
      } else if (data.status === 400) {
        Swal.fire({
          icon: "error",
          text: response.data.message,
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
    <>
      {loading ? (
        <div className={`min-h-dvh flex items-center justify-center`}>
          <img src="https://www.jp.square-enix.com/ffvii_rebirth/_common/img/loading.gif" alt="" />
        </div>
      ) : (
        <Sidebar header={`ตัวละคร (ดู)`}>

          <div className="flex flex-col gap-4">

            <div className="grid grid-cols-2 gap-2">

              <div>
                <label>รูปภาพตัวละคร</label>
                <div className="p-[0.15rem] border border-[#176db0] cursor-pointer relative overflow-hidden group">
                  {character?.avatar ? (
                    <img className={`w-full h-full object-cover`} src={`${baseUrl}/images/character/${character?.slug}/${character?.avatar}`} alt={`รูปภาพของ ${character?.name}`} />
                  ) : (
                    <img className={`w-full h-full object-cover`} src={`https://www.jp.square-enix.com/ffvii_rebirth/_common/img/gnav/btn_bg_off_pc.png`} alt={`ไม่มีรูปภาพ`} />
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2 h-full">
                <div>
                  <label>พื้นหลังตัวละคร</label>
                  <div className="p-[0.15rem] border border-[#176db0] cursor-pointer relative overflow-hidden group">
                    {character?.background ? (
                      <img className={`w-full h-full object-cover`} src={`${baseUrl}/images/character/${character?.slug}/${character?.background}`} alt={`รูปภาพของ ${character?.name}`} />
                    ) : (
                      <img className={`w-full h-full object-cover`} src={`https://www.jp.square-enix.com/ffvii_rebirth/_common/img/gnav/btn_bg_off_pc.png`} alt={`ไม่มีรูปภาพ`} />
                    )}
                  </div>
                </div>

                <div>
                  <label>รูปภาพเสริมตัวละคร</label>
                  <div className="p-[0.15rem] border border-[#176db0] cursor-pointer relative overflow-hidden group">
                    {character?.image ? (
                      <img className={`w-full h-full object-cover`} src={`${baseUrl}/images/character/${character?.slug}/${character?.image}`} alt={`รูปภาพของ ${character?.name}`} />
                    ) : (
                      <img className={`w-full h-full object-cover`} src={`https://www.jp.square-enix.com/ffvii_rebirth/_common/img/gnav/btn_bg_off_pc.png`} alt={`ไม่มีรูปภาพ`} />
                    )}
                  </div>
                </div>

              </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2">

              <div>
                <div className={`px-2 border-l-4 mb-2 border-[#9a0000] bg-gradient-to-r from-black from-[40%]`}>
                  <label>บทบาท</label>
                </div>
                <p>{character?.role?.name}</p>
              </div>

              <div>
                <div className={`px-2 border-l-4 mb-2 border-[#9a0000] bg-gradient-to-r from-black from-[40%]`}>
                  <label>ชื่อตัวละคร</label>
                </div>
                <p>{character?.name}</p>
              </div>


              <div>
                <div className={`px-2 border-l-4 mb-2 border-[#9a0000] bg-gradient-to-r from-black from-[40%]`}>
                  <label>ชื่อนักพากย์</label>
                </div>
                <p>{character?.voice_actor}</p>
              </div>

              <div>
                <div className={`px-2 border-l-4 mb-2 border-[#9a0000] bg-gradient-to-r from-black from-[40%]`}>
                  <label>รายละเอียดตัวละคร</label>
                </div>
                <p>{character?.description}</p>
              </div>

            </div>




          </div>

          <div>

          </div>

        </Sidebar >
      )
      }
    </>
  )
}

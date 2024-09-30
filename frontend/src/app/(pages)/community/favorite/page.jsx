
"use client";

import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { UserContext } from "@/context/UserContext";
import { Layout } from "@/layouts/Layout";
import baseUrl from "@/service/BaseUrl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function FavoriteAll() {

  const router = useRouter();

  const { token, setToken } = useContext(UserContext);
  const [characters, setUsers] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, []);

  console.log(characters);

  const fetchUser = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/character`);
      const data = await response.json();
      if (response.ok) {
        setUsers(data.characters);
        setLoading(false);
      } else if (data.status === 401) {
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


  return (
    <>
      {loading ? (
        <div className={`min-h-dvh flex items-center justify-center`}>
          <img src="https://www.jp.square-enix.com/ffvii_rebirth/_common/img/loading.gif" alt="Loading" />
        </div>
      ) : (
        <Layout>

          <div className={`p-4 border-r-4 border-l-4 border-[#3d87ab] bg-[#033D71]/60 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4`}>
            {characters.length > 0 ? (
              characters.map((character, index) => (
                <Card
                  key={index}
                  index={index}
                  link={`/community/favorite/${character.slug}`}
                  backgroundImageUrl={`${baseUrl}/images/character/${character?.slug}/${character?.background}`}
                  conditionImage={character?.avatar}
                  imageUrl={`${baseUrl}/images/character/${character?.slug}/${character?.avatar}`}
                  name={character?.name}
                  height={'h-[12rem]'}
                />
              ))
            ) : (
              <div className="flex items-center justify-center rounded-lg col-span-6 md:col-span-6">
                <span className="text-3xl">ไม่มีข้อมูล</span>
              </div>
            )}
          </div>

        </Layout >

      )}

    </>
  )
}

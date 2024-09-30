"use client";
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import baseUrl from '@/service/BaseUrl';
import { Layout } from '@/layouts/Layout';
import { Card } from '@/components/Card';
import { Grid } from '@/components/Grid';
import { motion, AnimatePresence } from "framer-motion";

export default function ViewBattle() {

  const [battles, setBattles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorld();
  }, []);

  const fetchWorld = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/battle`);
      const data = await response.json();
      if (response.ok) {
        setBattles(data.battles);
        setLoading(false);
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

  const [selectedBattle, setSelectedBattle] = useState(null);


  const changeBattleImage = (e, battle, index) => {
    e.preventDefault();  // ป้องกันการรีโหลด
    setSelectedBattle({ ...battle, index });
    console.log(index)
  };

  const variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  }

  return (
    <>
      {loading ? (
        <div className={`min-h-dvh flex items-center justify-center`}>
          <img src="https://www.jp.square-enix.com/ffvii_rebirth/_common/img/loading.gif" alt="Loading" />
        </div>
      ) : (
        <Layout header={'แบทเทิล'}>
          <div className="relative overflow-hidden flex flex-col items-center justify-center min-h-dvh">
            <AnimatePresence>
              <motion.img
                key={selectedBattle?.id} // ใช้ key เพื่อให้รู้ว่าเปลี่ยนภาพ}  
                src={selectedBattle?.image || battles[0].image}// ภาพที่จะแสดง
                variants={variants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className={`absolute inset-0 w-full h-full bg-cover`}
                transition={{ duration: 0.5 }}
              />

                <div className={`md:w-[70%] md:absolute top-0 right-0 mx-auto p-4 font-extralight`}>

                  <div className={`px-2 border-l-4 mb-2 border-[#9a0000] bg-gradient-to-r from-black from-[40%]`}>
                    {selectedBattle?.name}
                  </div>

                  <div className="border-[#3d87ab] border-t">
                    <p>
                      {selectedBattle?.description}
                    </p>
                  </div>

                </div>

            </AnimatePresence>
            
            <Grid className="h-[15rem] md:h-full absolute bottom-0 md:top-0 md:left-0 w-full md:w-[30%] grid grid-cols-2 md:grid-cols-1 gap-4" gap={2}>
              {battles.length > 0 ? (
                battles.map((battle, index) => (
                  <div key={index} className="flex flex-col gap-2">
                    <h1 className="text-xl pb-2 border-b border-[#176db0]">{battle?.name}</h1>
                    <p className="truncate">{battle?.description}</p>
                    <Card
                      index={index}
                      conditionImage={battle?.image}
                      condition={selectedBattle?.index === index}
                      height={`h-[8rem] md:h-[14rem]`}
                      imageUrl={battle?.image}
                      onClick={(e) => { changeBattleImage(e, battle, index) }}
                    />
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center rounded-lg col-span-3 md:col-span-6">
                  <span className="text-3xl font-semibold">ไม่มีข้อมูล</span>
                </div>
              )}
            </Grid>

          </div>

        </Layout >
      )}
    </>
  );
}

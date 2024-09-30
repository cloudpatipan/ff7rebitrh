"use client";
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2';
import baseUrl from '@/service/BaseUrl';
import { useParams } from 'next/navigation';
import { Layout } from '@/layouts/Layout';
import { motion, AnimatePresence } from "framer-motion";

// ไอคอน
import { Card } from '@/components/Card';
import { Grid } from '@/components/Grid';
import { Modal } from '@/components/Modal';

export default function World() {

  const { slug } = useParams();
  const [worlds, setWorlds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await fetchWorld();
      } catch (error) {
        Swal.fire({
          icon: "error",
          text: error,
          color: "white",
          confirmButtonText: "ตกลง",
          confirmButtonColor: "#005e95",
          background: "rgba(0,0,0,0) linear-gradient(rgba(0, 54, 104, 0.5), rgba(0, 94, 149, 0.5)) repeat scroll 0 0",
        });
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  console.log(worlds)
  const fetchWorld = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/world`);
      const data = await response.json();
      if (response.ok) {
        setWorlds(data.worlds);;
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
  }

  const [modalOpen, setModalOpen] = useState(false);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const [selectedWorld, setSelectedWorld] = useState(null);


  const changeWorld = (e, world) => {
    e.preventDefault();
    setSelectedWorld(world);
  };

  const variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  }



  return (
    <>
      {loading ? (
        <div className={`min-h-dvh flex items-center justify-center`}>
          <img src="https://www.jp.square-enix.com/ffvii_rebirth/_common/img/loading.gif" alt="" />
        </div>
      ) : (
        <Layout header={`โลก`}>

          <div className={`w-[95%] mx-auto relative min-h-dvh flex flex-col gap-4 justify-end items-center md:flex-row p-4 md:p-0 bg-cover`} style={{ backgroundImage: `url('${baseUrl}/images/world/${selectedWorld?.slug || worlds[0].slug}/${selectedWorld?.image || worlds[0].image}')` }}>

              <motion.div
                key={selectedWorld?.slug || worlds[0].slug} // ใช้ key ที่เปลี่ยนตามตัวโลก
                variants={variants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                transition={{
                  delay: 0.5,
                  ease: "easeInOut",
                  duration: 0.5,
                }}
                className={` md:w-[40%] md:p-4`}
              >

                <div className={`mb-2 text-3xl`}>
                  {selectedWorld?.name || worlds[0].name}
                </div>


                <p className="text-justify">
                  {selectedWorld?.description || worlds[0].description}
                </p>

                <div className={`flex flex-col md:flex-row gap-4 mt-4`}>
                  <div className={`md:w-[40%] group flex items-center hover:brightness-125 hover:scale-110 translate-scale duration-300 border border-[#176db0] p-[0.1rem]`} onClick={openModal}>
                    <img className={`w-full h-full object-cover`} src={`${baseUrl}/images/world/${selectedWorld?.slug || worlds[0].slug}/${selectedWorld?.image || worlds[0].image}`} alt={`รูปภาพ ${selectedWorld?.name || worlds[0].name}`} />
                  </div>
                  <Modal className={`p-[0.1rem]`} isOpen={modalOpen} onClose={closeModal}>
                    <div className={`group flex items-center duration-300`} onClick={openModal}>
                      <img className={`w-full h-full object-cover`} src={`${baseUrl}/images/world/${selectedWorld?.slug || worlds[0].slug}/${selectedWorld?.image || worlds[0].image}`} alt={`รูปภาพ ${selectedWorld?.name || worlds[0].name}`} />
                    </div>
                  </Modal>
                </div>


              </motion.div>

            <Grid className={`md:absolute bottom-0 grid grid-cols-4 md:grid-cols-[repeat(16,minmax(100px,500px))]  `} gap={2}>
              {worlds.length > 0 ? (
                worlds.map((world, index) => (
                  <Card
                    key={index}
                    index={index}
                    conditionImage={world?.image}
                    height={`h-[4rem]`}
                    imageUrl={`${baseUrl}/images/world/${world?.slug}/${world?.image}`}
                    condition={world?.slug === slug}
                    onClick={(e) => changeWorld(e, world)}
                  />
                ))
              ) : (
                <div className="flex items-center justify-center rounded-lg col-span-3 md:col-span-6">
                  <span className="text-3xl font-semibold">ไม่มีข้อมูล</span>
                </div>
              )}
            </Grid>

          </div>

        </Layout >
      )
      }
    </>
  )
}
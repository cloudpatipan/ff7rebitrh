"use client";
import React, { useContext, useEffect, useState } from 'react'
import Swal from 'sweetalert2';
import baseUrl from '@/service/BaseUrl';
import { useParams } from 'next/navigation';
import { Layout } from '@/layouts/Layout';
import { motion, AnimatePresence } from "framer-motion";

// ไอคอน
import { Card } from '@/components/Card';
import { Grid } from '@/components/Grid';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/Button';
import { PiHeartFill, PiHeartThin } from 'react-icons/pi';
import { UserContext } from '@/context/UserContext';
import { FavoriteAndBlogContext } from '@/context/FavoriteAndBlogContext';

export default function Character() {

  const { token, user } = useContext(UserContext);

  const { slug } = useParams();
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await fetchCharacters();
        if (token) {
          await fetchFavorites();
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
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [token]);

  const fetchCharacters = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/character`);
      const data = await response.json();
      if (response.ok) {
        setCharacters(data.characters);;
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
  
  const { favorites, setFavorites } = useContext(FavoriteAndBlogContext);
  
  const fetchFavorites = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/favorite`);
      const data = await response.json();
      if (response.ok) {
        setFavorites(data.favorites);
        // เช็คว่า character ที่เลือกอยู่ในรายการโปรดหรือไม่
        const currentCharacterId = selectedCharacter?.id || characters[0]?.id;
        const isFavorited = data.favorites.some(favorite =>
          favorite.user_id === user?.id && favorite.character_id === currentCharacterId
        );
        setIsFavorited(isFavorited);
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

  const [isFavorited, setIsFavorited] = useState(false);

  const addToFavorite = async (e, character_id) => {
    e.preventDefault();

    try {
      await fetch(`${baseUrl}/sanctum/csrf-cookie`);
      const response = await fetch(`${baseUrl}/api/add-to-favorite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ character_id }),
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
        fetchFavorites();
      } else if (response.status === 400) {
        Swal.fire({
          icon: "error",
          text: data.message,
          color: "white",
          confirmButtonText: "ตกลง",
          confirmButtonColor: "#005e95",
          background: "rgba(0,0,0,0) linear-gradient(rgba(0, 54, 104, 0.5), rgba(0, 94, 149, 0.5)) repeat scroll 0 0",
        });
      } else if (response.status === 401) {
        Swal.fire({
          icon: "warning",
          text: data.message,
          color: "white",
          confirmButtonText: "ตกลง",
          confirmButtonColor: "#005e95",
          background: "rgba(0,0,0,0) linear-gradient(rgba(0, 54, 104, 0.5), rgba(0, 94, 149, 0.5)) repeat scroll 0 0",
        });
      } else if (response.status === 404) {
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
        icon: "warning",
        text: error,
        color: "white",
        confirmButtonText: "ตกลง",
        confirmButtonColor: "#005e95",
        background: "rgba(0,0,0,0) linear-gradient(rgba(0, 54, 104, 0.5), rgba(0, 94, 149, 0.5)) repeat scroll 0 0",
      });
    }
  }

  const deleteFavoriteItem = async (e, favorite_id) => {
    e.preventDefault();

    try {
      await fetch(`${baseUrl}/sanctum/csrf-cookie`);
      const response = await fetch(`${baseUrl}/api/delete-favoriteitem/${favorite_id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        },

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
        fetchFavorites();
      } else if (response.status === 400) {
        Swal.fire({
          icon: "error",
          text: data.message,
          color: "white",
          confirmButtonText: "ตกลง",
          confirmButtonColor: "#005e95",
          background: "rgba(0,0,0,0) linear-gradient(rgba(0, 54, 104, 0.5), rgba(0, 94, 149, 0.5)) repeat scroll 0 0",
        });
      } else if (response.status === 401) {
        Swal.fire({
          icon: "warning",
          text: data.message,
          color: "white",
          confirmButtonText: "ตกลง",
          confirmButtonColor: "#005e95",
          background: "rgba(0,0,0,0) linear-gradient(rgba(0, 54, 104, 0.5), rgba(0, 94, 149, 0.5)) repeat scroll 0 0",
        });
      } else if (response.status === 404) {
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
        icon: "warning",
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

  const [selectedCharacter, setSelectedCharacter] = useState(null);


  const changeCharacter = (e, character) => {
    e.preventDefault();
    setSelectedCharacter(character);

    // เช็คว่า character ที่เลือกอยู่ในรายการโปรดหรือไม่
    const isFavorited = favorites.some(favorite =>
      favorite.user_id === user?.id && favorite.character_id === character.id
    );
    setIsFavorited(isFavorited);
  };

  const variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  }

  const favoriteToDelete = favorites.find(favorite =>
    favorite.user_id === user?.id && favorite.character_id === selectedCharacter?.id
  );

  return (
    <>
      {loading ? (
        <div className={`min-h-dvh flex items-center justify-center`}>
          <img src="https://www.jp.square-enix.com/ffvii_rebirth/_common/img/loading.gif" alt="" />
        </div>
      ) : (
        <Layout header={`ตัวละคร`}>

          <div className={`relative min-h-dvh flex flex-col gap-4 items-center md:flex-row p-4 md:p-0 bg-cover`} style={{ backgroundImage: `url('${baseUrl}/images/character/${selectedCharacter?.slug || characters[0].slug}/${selectedCharacter?.background || characters[0].background}')` }}>
            <motion.img
              key={selectedCharacter?.id || characters[0].id}
              src={`${baseUrl}/images/character/${selectedCharacter?.slug || characters[0].slug}/${selectedCharacter?.avatar || characters[0].avatar}`}
              alt={`รูปภาพของตัวละคร ${selectedCharacter?.name || characters[0].name}`}
              variants={variants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={{
                delay: 0.4,
                ease: "easeInOut",
                duration: 0.5,
              }}
              className={`md:w-[50%]`}
            />

            <motion.div
              key={selectedCharacter?.slug || characters[0].slug} // ใช้ key ที่เปลี่ยนตามตัวละคร
              variants={variants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={{
                delay: 0.5,
                ease: "easeInOut",
                duration: 0.5,
              }}
              className={`md:w-[40%] md:p-4`}
            >


              <div className={`px-2 w-[40%] border-l-4 mb-2 border-[#9a0000] bg-gradient-to-r from-black from-[40%]`}>
                {selectedCharacter?.role?.name || characters[0].role.name}
              </div>

              <div className={`mb-2 text-3xl`}>
                {selectedCharacter?.name || characters[0].name}
              </div>

              <div className={`mb-2 rounded-full flex items-center overflow-hidden outline outline-offset-2 outline-1 outline-[#9a0000]/60`}>

                <span className={`px-2 bg-[#9a0000]`}>
                  นักพากย์
                </span>

                <span className={`px-2`}>
                  {selectedCharacter?.voice_actor || characters[0].voice_actor}
                </span>

              </div>

              <p className="text-justify">
                {selectedCharacter?.description || characters[0].description}
              </p>

              <div className={`flex flex-col md:flex-row gap-4 mt-4`}>
                <div className={`md:w-[40%] group flex items-center hover:brightness-125 hover:scale-110 translate-scale duration-300 border border-[#176db0] p-[0.1rem]`} onClick={openModal}>
                  <img className={`w-full h-full object-cover`} src={`${baseUrl}/images/character/${selectedCharacter?.slug || characters[0].slug}/${selectedCharacter?.image || characters[0].image}`} alt={`รูปภาพเสริมของตัวละคร ${selectedCharacter?.name || characters[0].name}`} />
                </div>
                <Modal className={`p-[0.1rem]`} isOpen={modalOpen} onClose={closeModal}>
                  <div className={`group flex items-center duration-300`} onClick={openModal}>
                    <img className={`w-full h-full object-cover`} src={`${baseUrl}/images/character/${selectedCharacter?.slug || characters[0].slug}/${selectedCharacter?.image || characters[0].image}`} alt={`รูปภาพเสริมของตัวละคร ${selectedCharacter?.name || characters[0].name}`} />
                  </div>
                </Modal>
              </div>

              {token && (
                <>
                  {isFavorited ? (
                    <Button
                      name={'ลบจากรายการโปรด'}
                      icon={<PiHeartFill size={25} />} // แสดงหัวใจเต็มเมื่อถูกใจแล้ว
                      disabled={false}
                      className={'w-full mt-4'}
                      onClick={(e) => {
                        if (favoriteToDelete) {
                          deleteFavoriteItem(e, favoriteToDelete.id); // ส่งค่า favorite.id ไปยังฟังก์ชันลบ
                        }
                      }}
                    />
                  ) : (
                    <Button
                      name={'เพิ่มในรายการโปรด'}
                      icon={<PiHeartThin size={25} />} // แสดงหัวใจว่างเมื่อยังไม่ได้ถูกใจ
                      disabled={false}
                      className={'w-full mt-4'}
                      onClick={(e) => addToFavorite(e, selectedCharacter?.id || characters[0].id)} // เรียกฟังก์ชันเพิ่มเมื่อคลิก
                    />
                  )}
                </>
              )}

            </motion.div>

            <Grid className={`md:absolute bottom-0 grid grid-cols-4 md:grid-cols-[repeat(16,minmax(100px,500px))]  `} gap={2}>
              {characters.length > 0 ? (
                characters.map((character, index) => (
                  <Card
                    key={index}
                    index={index}
                    backgroundImageUrl={`${baseUrl}/images/character/${character?.slug}/${character?.background}`}
                    conditionImage={character?.avatar}
                    height={`h-[4rem]`}
                    imageUrl={`${baseUrl}/images/character/${character?.slug}/${character?.avatar}`}
                    condition={character?.slug === slug}
                    onClick={(e) => changeCharacter(e, character)}
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
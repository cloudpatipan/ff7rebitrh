"use client";
import { Card } from "@/components/Card";
import { Grid } from "@/components/Grid";
import { Layout } from "@/layouts/Layout";
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';

import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";


export default function Media() {

    const [selectedScreenshot, setSelectedScreenshot] = useState(null);
    const screenshots = [];

    for (let i = 1; i <= 55; i++) {
        screenshots.push({ img: `https://www.jp.square-enix.com/ffvii_rebirth/media/_img/screenshot/item/pic${i}.jpg` });
    }


    const changeScreenshotImage = (e, screenshot, index) => {
        e.preventDefault();  // ป้องกันการรีโหลด
        setSelectedScreenshot({...screenshot, index});
    };

    const [selectedArtwork, setSelectedArtwork] = useState(null);

    const artworks = [];

    for (let i = 1; i <= 10; i++) {
        artworks.push({ img: `https://www.jp.square-enix.com/ffvii_rebirth/media/_img/artwork/item/pic${i}.jpg` });
    }

    const changeArtworkImage = (e, artwork, index) => {
        e.preventDefault();  // ป้องกันการรีโหลด
        setSelectedArtwork({...artwork, index});
    };

    const variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
    }

    
    return (
        <Layout>
            <section className="flex flex-col gap-4 min-h-dvh">


                <div>
                    <h1 className="my-4 py-4 bg-black/40 text-center text-3xl border-b-2 border-[#9a0000]">อาร์ตเวิร์ก</h1>
                    <div className="mx-auto">

                        <div className="my-4 relative overflow-hidden flex flex-col items-center justify-center min-h-[15rem] md:min-h-[40rem]">
                            <AnimatePresence>
                                <motion.img
                                    key={selectedArtwork?.img || artworks[0].img} // ใช้ key เพื่อให้รู้ว่าเปลี่ยนภาพ
                                    src={selectedArtwork?.img || artworks[0].img}  // ภาพที่จะแสดง
                                    alt="Artwork"
                                    className="absolute inset-0 w-full h-full object-cover"
                                    variants={variants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="hidden"
                                    transition={{ duration: 0.5 }}
                                />
                            </AnimatePresence>
                        </div>

                            <Grid className={'grid grid-cols-2 md:grid-cols-8 gap-4'}>
                                {artworks.length > 0 ? (
                                    artworks.map((artwork, index) => (
                                        <SwiperSlide>
                                            <Card
                                                key={index + 1}
                                                index={index}
                                                conditionImage={artwork?.img}
                                                condition={selectedArtwork?.index === index + 1}
                                                height={'h-[3rem]'}
                                                imageUrl={artwork?.img}
                                                onClick={(e) => { changeArtworkImage(e, artwork, index + 1) }}
                                            />
                                        </SwiperSlide>
                                    ))
                                ) : (
                                    <div>
                                        ไม่มีข้อมูล
                                    </div>
                                )}

                            </Grid>

                    </div>
                </div>


                <div>
                    <h1 className="my-4 py-4 bg-black/40 text-center text-3xl border-b-2 border-[#9a0000]">สกรีนช็อต</h1>
                    <div className="mx-auto">

                        <div className="my-4 relative overflow-hidden flex flex-col items-center justify-center min-h-[15rem] min-h-[30rem]">
                            <AnimatePresence>
                                <motion.img
                                    key={selectedScreenshot?.img || screenshots[0].img} // ใช้ key เพื่อให้รู้ว่าเปลี่ยนภาพ
                                    src={selectedScreenshot?.img || screenshots[0].img}  // ภาพที่จะแสดง
                                    alt="Screenshot"
                                    className="absolute inset-0 w-full h-full object-cover"
                                    variants={variants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="hidden"
                                    transition={{ duration: 0.5 }}
                                />
                            </AnimatePresence>
                        </div>

                        <Grid className={'w-[80%] grid grid-cols-2 md:grid-cols-8 gap-2'}>
                            {screenshots.length > 0 ? (
                                screenshots.map((screenshot, index) => (
                                    <Card
                                        key={index + 1}
                                        index={index}
                                        conditionImage={screenshot?.img}
                                        condition={selectedScreenshot?.index === index + 1}
                                        height={'h-[2.5rem]'}
                                        imageUrl={screenshot?.img}
                                        onClick={(e) => { changeScreenshotImage(e, screenshot, index + 1) }}
                                    />
                                ))
                            ) : (
                                <div>
                                    ไม่มีข้อมูล
                                </div>
                            )}

                        </Grid>

                    </div>
                </div>

            </section>
        </Layout>
    )
}

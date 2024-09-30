"use client";

import { Layout } from "@/layouts/Layout";

export default function Home() {


  return (
    <Layout>
      <div className={`relative overflow-hidden`}>
        <iframe className={`w-full aspect-video`} allow="accelerometer; autoplay; loop; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" title="FINAL FANTASY VII REBIRTH WEB - TOP" src="https://www.youtube.com/embed/o5a9Xe3K3zI?rel=0&autoplay=1&loop=1&controls=0&mute=0&showinfo=1&disablekb=1&modestbranding=1&iv_load_policy=3&fs=0" />
        <div className={`w-[40%] absolute top-0 right-4`}>
          <img className="" src="https://www.jp.square-enix.com/ffvii_rebirth/_common/img/logo.png" alt="" />
          <img src="https://www.jp.square-enix.com/ffvii_rebirth/_img/hero/release_v3.png" alt="" />
          <img src="https://www.jp.square-enix.com/ffvii_rebirth/_img/hero/btn_tw_sp.png" alt="" />

          <div className={`grid grid-cols-2 gap-4 mt-8`}>

            <div className={`bg-gradient-to-t from-[#003668]/70 to-[#004d7e]/70 outline outline-offset-2 outline-1 outline-[#176db0] border-r-4 border-l-4 border-[#268dac] hover:scale-110 transition-all duration-100 `}>
              <img className={`w-full h-full object-cover`} src="https://www.jp.square-enix.com/ffvii_rebirth/news/_articleimg/ff7r-digest_pc.jpg" alt="" />
            </div>

            <div className={`bg-gradient-to-t from-[#003668]/70 to-[#004d7e]/70 outline outline-offset-2 outline-1 outline-[#176db0] border-r-4 border-l-4 border-[#268dac]`}>
              <img className={`w-full h-full object-cover`} src={`https://www.jp.square-enix.com/ffvii_rebirth/_img/hero/bnr/msg_pc.jpg`} alt="" />
            </div>

          </div>

        </div>

        <div className="grid grid-cols-3">
          <img src="https://www.jp.square-enix.com/ffvii_rebirth/about/_img/story/rebirth/pic1.jpg" alt="" />
          <img src="https://www.jp.square-enix.com/ffvii_rebirth/about/_img/story/rebirth/pic2.jpg" alt="" />
          <img src="https://www.jp.square-enix.com/ffvii_rebirth/about/_img/story/rebirth/pic3.jpg" alt="" />
        </div>

      </div>

    </Layout>
  );
}

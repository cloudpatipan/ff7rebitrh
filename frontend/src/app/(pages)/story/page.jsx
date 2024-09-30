import { Layout } from "@/layouts/Layout";

export default function Story() {
    return (
        <Layout>
            <div className="min-h-dvh bg-cover" style={{ backgroundImage: `url('https://www.jp.square-enix.com/ffvii_rebirth/about/_img/story/rebirth/visual_pc.jpg')` }}>
            <h1 className="py-4 bg-black/40 text-center text-3xl border-b-2 border-[#9a0000]">เนื้อเรื่อง</h1>
                <div className="flex flex-col justify-center min-h-dvh">
                    <p className="p-4 md:w-1/2 drop-shadow-2xl mx-auto text-justify">ในตอนท้ายของภาคที่แล้ว แซ็คกรุยทางผ่านทหารชินระที่ห้อมล้อมเขาและมีชีวิตรอดมาได้ นี่เป็นสิ่งที่แตกต่างจากที่เราเห็นใน FFVII OG อย่างไรก็ตาม เป็นที่ชัดเจนแล้วว่าเหตุการณ์เหล่านี้เกิดขึ้นในโลกที่แตกต่างจากโลกที่พวกคลาวด์อาศัยอยู่ นอกจากนี้ เซฟิรอธยังเปิดเผยในช่วงท้ายของเรื่องว่า มีโลกอันมากมายดำรงอยู่ภายในดวงดาวของเกมนี้ เราสามารถแยกโลกเหล่านั้นออกจากกัน ด้วยการสังเกตลักษณะของสแตมป์ (Stamp) น้อยผู้ภักดี มีโลกอย่างน้อย 5 ใบปรากฏขึ้นตลอดทั้งเกม เซฟิรอธคุ้นเคยกับโครงสร้างของโลกเหล่านี้ดี และชัดเจนว่าเขากำลังใช้โลกเหล่านี้ “เพื่อยืดอายุขัยของดวงดาว”</p>
                </div>

            </div>
        </Layout>
    )
}

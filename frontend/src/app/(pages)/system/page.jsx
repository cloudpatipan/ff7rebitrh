import { Layout } from "@/layouts/Layout";

export default function System() {

    const systems = [
        {
            name: "MINIMUM",
            os: "Windows® 10 64-bit (ver. 2004 or later)",
            process: "AMD FX-8350 / Intel® Core™ i5-3330",
            memory: "8 GB RAM",
            graphic: "AMD Radeon™ RX 480 / NVIDIA® GeForce® GTX 780 / 3GB VRAM required",
            directX: "Version 12",
            storage: "100 GB available space",
            additional_notes: "Assuming a Resolution of 1920 x 1080"
        },
        {
            name: "RECOMMENDED",
            os: "Windows® 10 64-bit (ver. 2004 or later)",
            process: "AMD Ryzen™ 3 3100 / Intel® Core™ i7-3770",
            memory: "12 GB RAM",
            graphic: "AMD Radeon™ RX 5700 / NVIDIA® GeForce® GTX 1080 / 8GB VRAM required",
            directX: "Version 12",
            storage: "100 GB available space",
            additional_notes: "Assuming a Resolution of 2560 x 1440 (This title supports max resolution of 3840 x 2160)"
        },
    ];

    return (
        <Layout header={'ระบบ'}>
            <section className="w-[95%] mx-auto min-h-dvh">
                    <div className="grid grid-cols md:grid-cols-2 gap-4 ">

                        {systems.length > 0 ? (
                            systems.map((system, index) => (
                                <div key={index + 1} className="border border-[#176db0] p-4 drop-shadow">
                                    <div className="flex flex-col">
                                        <h1 className="text-xl">{system.name}</h1>
                                        <span>OS : {system.os}</span>
                                        <span>Process : {system.os}</span>
                                        <span>Memory : {system.process}</span>
                                        <span>Graphic : {system.graphic}</span>
                                        <span>DirectX : {system.directX}</span>
                                        <span>Storage : {system.storage}</span>
                                        <span>additional_notes : {system.additional_notes}</span>
                                    </div>

                                </div>
                            ))
                        ) : (
                            <div>
                                ไม่มีข้อมูล
                            </div>
                        )}


                    </div>
            </section>
        </Layout>
    )
}

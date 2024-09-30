"use client";
import { Layout } from "@/layouts/Layout";
import { useContext, useState } from "react";
import { PiPasswordThin, PiUserThin } from "react-icons/pi";
import ProfileInformation from "./information/page";
import { Button } from "@/components/Button";
import ProfilePassword from "./password/page";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { PrivateRoute } from "@/routes/PrivateRoute";

export default function Profile() {

    const router = useRouter();

    const [tab, setTab] = useState(true);

    const toggleTabInformation = () => {
        setTab(true);
    };

    const toggleTabInPassword = () => {
        setTab(false);
    };

    return (
        <PrivateRoute>
        <Layout header={'โปรไฟล์'}>
                <div className="w-[95%] mx-auto mt-2 flex flex-col gap-4">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <Button icon={<PiUserThin size={25} />} condition={tab === true} onClick={toggleTabInformation} />

                        <Button icon={<PiPasswordThin size={25} />} condition={tab === false} onClick={toggleTabInPassword} />
                    </div>

                    <div> 
                    {tab === true ? (
                        <ProfileInformation />
                    ) : tab === false && (
                        <ProfilePassword />
                    )}
                    </div>

                </div>
        </Layout>
        </PrivateRoute>
    )
}

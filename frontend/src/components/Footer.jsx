

export function Footer() {
    return (
        <footer>
            <div className={`p-4 flex flex-col items-center justify-center border-t-2 border-[#9a0000]`}>
                <div className="flex gap-4">
                    <img className="w-10" src="https://www.jp.square-enix.com/common/templates/images/footer/logo/sp_cero_c.png" alt="" />
                    <img className="w-12" src="https://www.jp.square-enix.com/common/templates/images/footer/logo/sp_psf_k.png" alt="" />
                    <img className="w-28" src="https://www.jp.square-enix.com/common/templates/images/footer/logo/sp_ps5_k.png" alt="" />
                </div>
                <div>
                    Copyright by Patipan Trisuk
                </div>
            </div>
        </footer>
    )
}

import Link from 'next/link'
import { GoTriangleDown } from 'react-icons/go'

export function Button({ type, icon, className, id, onClick, name, condition }) {

  return (
    <button type={type ? type : "button"} className={`${className} relative bg-cover bg-[url('https://www.jp.square-enix.com/ffvii_rebirth/_common/img/gnav/btn_bg_off_pc.png')] group flex items-center justify-center py-1 px-2 ${name && icon ? 'gap-2' : ''} ${condition ? 'brightness-125 outline outline-offset-2 outline-1 outline-[#176db0]' : 'hover:brightness-125 hover:outline hover:outline-1 hover:outline-[#176db0] hover:outline-offset-2 transition-all duration-50'} group text-white border border-[#176db0]`} id={id} onClick={onClick}>

      <div>
        {icon ? icon : null}
      </div>

      <div>
        {name ? name : null}
      </div>

      <div className={`${condition ? 'opacity-100' : ''} absolute -top-3 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300`}>
        <GoTriangleDown size={25} className="text-[#176db0] brightness-150" />
      </div>

    </button>
  )
}
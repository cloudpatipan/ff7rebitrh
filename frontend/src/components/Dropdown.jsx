
export function Dropdown({ header, children }) {
    
    return (
        <div className={`relative cursor-pointer group`}>

            <div>
                {header}
            </div>

            <div
                className={`opacity-0 absolute md:-right-[11rem] md:top-0 z-50 group-hover:opacity-100 right-[0.02rem] w-[10rem] transition-opacity duration-300 ease-in-out`}>
                <div className={`mt-1`}>
                    {children}
                </div>
            </div>

        </div>

    )
}

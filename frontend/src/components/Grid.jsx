export function Grid({ className, gap, children }) {
    return (
        <div className={`${className} w-full p-4 border-r-4 border-l-4 border-[#3d87ab] bg-[#033D71]/60 gap-${gap} overflow-scroll no-scroll-bar `}>
            {children}
        </div>
    )
}

export function Banner() {
    return (
        <div className="flex justify-center items-center m-2 overflow-hidden skew-x-6 group transition-all hover:scale-105">
            <div className="flex transition-all h-[75vmin] duration-[1s] ease-in-out relative">
                <img className="w-full h-full object-cover grayscale transition-all duration-[1s] ease-in-out group-hover:grayscale-0 hover:scale-125" src="https://upload.wikimedia.org/wikipedia/commons/d/d6/Cat_plotting_something_evil%21.jpg" alt="" />
                <div class="text-black bg-[#ff1ead]/75 p-2 transform -rotate-90 origin-[0%_0%] transition-all duration-[0.5s] ease-in-out min-w-[100%] text-center absolute bottom-0 left-0 text-[1rem] whitespace-nowrap group-hover:text-center hover-top:top-[calc(100% - 2rem)] group-hover:text-white group-hover:bg-[#000000]/50 group-hover:rotate-0 group-hover:-skew-x- group-hover:text-[2rem]">
                    Plotting Cat
                </div>
            </div>
        </div>
    )
}

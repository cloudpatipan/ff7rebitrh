import { useEffect, useState } from "react"

export function Time() {

    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date());
        })
        return () => clearInterval(timer);
    }, []);

    const formatTime = (date) => {
        return date.toLocaleTimeString(); // แปลงวันที่เป็นเวลาในรูปแบบของท้องถิ่น เช่น HH:mm:ss
    }

    return (
        <h1 className="text-[40px]">{formatTime(time)}</h1>
    )
}

"use client";
import { useEffect, useState } from "react";
import { Button } from "./Button";
import { PiPauseThin, PiPlayThin } from "react-icons/pi";

export function AudioPlayer({ url }) {
  const [play, setPlay] = useState(false);
  const [volume, setVolume] = useState(1); // 1 = 100%
  const audioRef = useState(new Audio(url))[0];

  useEffect(() => {
    // ตั้งค่าเสียง
    audioRef.volume = volume;
    
    const handleEnded = () => setPlay(false);
    audioRef.addEventListener('ended', handleEnded);

    // เล่นหรือหยุดเพลงตามสถานะ
    if (play) {
      audioRef.play();
    } else {
      audioRef.pause();
    }

    return () => {
      audioRef.removeEventListener('ended', handleEnded);
      audioRef.pause(); // หยุดเพลงเมื่อคอมโพเนนต์ถูกลบ
    };
  }, [audioRef, play, volume]);

  const togglePlay = () => {
    setPlay(!play);
    // ไม่จำเป็นต้องเล่นหรือหยุดที่นี่แล้ว
  };

  const changeVolume = (newVolume) => {
    setVolume(newVolume);
    audioRef.volume = newVolume;
  };

  return (
    <div className="relative group flex gap-4">
      <Button
        icon={play ? <PiPauseThin size={20}/> : <PiPlayThin size={20}/>}
        onClick={togglePlay}
      />
      <div className=" opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <label htmlFor="volume" className="block w-[10rem] text-sm">ระดับเสียง: {Math.round(volume * 100)}%</label>
        <input
          id="volume"
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          className="accent-[#176db0] appearance-none bg-transparent"
          onChange={(e) => changeVolume(parseFloat(e.target.value))}
        />
      </div>
    </div>
  );
}

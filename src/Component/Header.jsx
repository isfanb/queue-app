import React, { useEffect, useState } from 'react'
import logo from '../assets/images/kemenkes-rsabhk.png'

function Header({data}) {
    
    const [dateTimeString, setDateTimeString] = useState(getToday());
  
    function getToday() {

      const now = new Date();
  
      const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
      const dayName = days[now.getDay()];

      const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
      const monthName = months[now.getMonth()];
  
      const day = now.getDate().toString().padStart(2, '0');
      const year = now.getFullYear();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const seconds = now.getSeconds().toString().padStart(2, '0');
      const isDateTime = `${dayName}, ${day} ${monthName} ${year}\n${hours}:${minutes}:${seconds}`

      return isDateTime;
    }
    
    useEffect(() => {
      const intervalId = setInterval(() => {
        setDateTimeString(getToday());
      }, 1000);
      return () => clearInterval(intervalId);
    }, []);
  return (
    <>
        <header className='fixed top-0 left-0 right-0'>
            <div className='p-3 flex justify-between x-large:items-center'>
              <img src={logo} alt="logo" className='small:w-[250px] medium:w-[330px] large:w-[390px] x-large:w-[520px]' />
              <p className='medium:text-2xl large:text-3xl x-large:text-4xl whitespace-pre text-slate-600 font-semibold'>{dateTimeString}</p>
            </div>
        </header>
        <div className='fixed left-0 right-0 medium:top-24 small:top-16 x-large:top-36'>
            <div className='bg-slate-100 small:h-10 medium:h-12 large:h-20 x-large:h-24 flex justify-center items-center shadow-md'>
              {data && data[0] && data[0].nama_area ? (
                <h1 className='medium:text-3xl small:text-xl large:text-5xl x-large:text-6xl text-slate-600 font-semibold'>{data[0].nama_area}</h1>
              ) : ''}
            </div>
        </div>
    </>
  )
}

export default Header
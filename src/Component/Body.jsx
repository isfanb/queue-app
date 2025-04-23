import React, { useEffect, useState, useRef} from 'react'
import templateImage from '../assets/images/blank-pic.jpg'
import { AntrianServices } from '../Services/AntrianServices'
import axios from 'axios'
import Header from './Header'
import Footer from './Footer'

function terbilang(nilai) {
    nilai = Math.floor(Math.abs(nilai));
    var huruf = [
      '',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '10',
      '11',
    ];
    
     var bagi = 0;
     var penyimpanan = '';
    
    if (nilai < 12) {
      penyimpanan = ' ' + huruf[nilai];
    } else if (nilai < 20) {
      penyimpanan = terbilang(Math.floor(nilai - 10)) + ' Belas';
    } else if (nilai < 100) {
      bagi = Math.floor(nilai / 10);
      penyimpanan = terbilang(bagi) + ' Puluh' + terbilang(nilai % 10);
    } else if (nilai < 200) {
      penyimpanan = ' Seratus' + terbilang(nilai - 100);
    } else if (nilai < 1000) {
      bagi = Math.floor(nilai / 100);
      penyimpanan = terbilang(bagi) + ' Ratus' + terbilang(nilai % 100);
    } else if (nilai < 2000) {
      penyimpanan = ' Seribu' + terbilang(nilai - 1000);
    } else if (nilai < 1000000) {
      bagi = Math.floor(nilai / 1000);
      penyimpanan = terbilang(bagi) + ' Ribu' + terbilang(nilai % 1000);
    } else if (nilai < 1000000000) {
      bagi = Math.floor(nilai / 1000000);
      penyimpanan = terbilang(bagi) + ' Juta' + terbilang(nilai % 1000000);
    } else if (nilai < 1000000000000) {
      bagi = Math.floor(nilai / 1000000000);
      penyimpanan = terbilang(bagi) + ' Miliar' + terbilang(nilai % 1000000000);
    } else if (nilai < 1000000000000000) {
      bagi = Math.floor(nilai / 1000000000000);
      penyimpanan = terbilang(nilai / 1000000000000) + ' Triliun' + terbilang(nilai % 1000000000000);
    }
   
    return penyimpanan;
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function isVoice(param) {
    return new Promise((resolve, reject) => {
        const files = import.meta.glob('../assets/voices/*.mp3');
        const targetFile = `../assets/voices/${param}.mp3`;
        if (files[targetFile]) {
            files[targetFile]().then((module) => {
                console.log("Loaded:", targetFile);
                const audio = new Audio(module.default);
                audio.play();

                audio.onended = () => {
                    resolve();
                };
            });
        } else {
            console.error("File not found:", targetFile);
            reject("File not found");
        }
    });
}

function isVoiceRuang(param) {
    return new Promise((resolve, reject) => {
        const files = import.meta.glob('../assets/voices/*.mp3');
        const targetFile = `../assets/voices/ruangan-id-${param}.mp3`;
        if (files[targetFile]) {
            files[targetFile]().then((module) => {
                console.log("Loaded:", targetFile);
                const audio = new Audio(module.default);
                audio.play();

                audio.onended = () => {
                    resolve();
                };
            });
        } else {
            console.error("File not found:", targetFile);
            reject("File not found");
        }
    });
}

function isVoicePegawai(param) {
    return new Promise((resolve, reject) => {
        const files = import.meta.glob('../assets/voices/*.mp3');
        const targetFile = `../assets/voices/pegawai_id_${param}.mp3`;
        if (files[targetFile]) {
            files[targetFile]().then((module) => {
                console.log("Loaded:", targetFile);
                const audio = new Audio(module.default);
                audio.play();

                audio.onended = () => {
                    resolve();
                };
            });
        } else {
            console.error("File not found:", targetFile);
            reject("File not found");
        }
    });
}

async function playDelaysDokter(arrAntrian, poli, arrRuang, pegawai) {
    await isVoice('dokter')
    await isVoicePegawai(pegawai)
    await isVoice('nomor-antrian')
    for (let i = 0; i < arrAntrian.length; i++) {
        let strLowCase = arrAntrian[i].toLowerCase()
        await isVoice(strLowCase);
    }
    await isVoice('ke-room')
    for (let i = 0; i < arrRuang.length; i++) {
        let strLowCases = arrRuang[i].toLowerCase()
        await isVoice(strLowCases);
    }
    await delay(3000)
}

async function playDelaysSuster(isnocm, arrAntrian, poli, dataArea) {
    await isVoiceRuang(poli)
    await isVoice('nomor-antrian')
    for (let i = 0; i < arrAntrian.length; i++) {
        let strAntrian = arrAntrian[i]
        await isVoice(strAntrian);
    }
    await isVoice('ke')
    let lowCaseArea = dataArea[0].nama_area.toLowerCase()
    if(lowCaseArea.includes('anak')){
        await isVoice('ners-stesyen-anak')
    }else{
        await isVoice('ners-stesyen-ibu')
    }
    await delay(3000); 
}

function playVoicesDokter(antrian, poli, ruang, pegawai, callback) {
    let isAntrian = terbilang(antrian)
    let isRuang = terbilang(ruang)
    let splitAntrian = isAntrian.split(' ')
    let splitRuang = isRuang.split(' ')
    
    let arrAntrian = splitAntrian.filter(e => e)
    let arrRuang = splitRuang.filter(e => e)
    
    playDelaysDokter(arrAntrian, poli, arrRuang, pegawai).then(() => {
        if (callback) callback();
    });
}

function playVoiceSuster(nocm, antrian, poli, dataArea, callback){
    let isAntrian = terbilang(antrian)
    let splitAntrian = isAntrian.split(' ')
    let arrAntrian = splitAntrian.filter(e => e)
    let isnocm = nocm.split('')
    playDelaysSuster(isnocm, arrAntrian, poli, dataArea).then(() => {
        if(callback) callback()
    })
}

const fetchData = async () => {
    console.log('Fetching data...');
    try {
      const response = await axios.get(AntrianServices.getData());
      return response.data;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  };

function getImgUrl(fileName) {
const files = import.meta.glob('../assets/photos/*.jpg');
const targetFile = `../assets/photos/${fileName}.jpg`;

if (files[targetFile]) {
    return files[targetFile]();
} else {
    // console.error("Image not found");
    return null;
}
}
  
function Body() {
    const [newData, setNewData] = useState([])
    const [jenisArea, setJenisArea] = useState(null)
    const [gambar, setGambar] = useState([])
    const [getScroll, setScroll] = useState(false)


    const fetchInitialData = async () => {
        const data = await fetchData();
        console.log(data);
        
        setNewData(data)
        setJenisArea(data.data_area[0].jenis_area)
        setScroll(true)
    }

    useEffect(() => {
        fetchInitialData()
    }, [])

    useEffect(() => {
        if(newData.length == 0) return;

        let filterDokter = newData.data.filter((item) => item.now_antrean_dokter != null);
        let filterSuster = newData.data.filter((item) => item.now_antrean_suster != null);

        
        if(jenisArea == 'data_dokter'){
            
            const loadImage = async () => {
                let updatedImages = await Promise.all(
                  newData.data.map(async (val) => {
                    try {
                      const filePromise = getImgUrl(val.pegawai_id);
                      if (filePromise) {
                        const resolvedModule = await filePromise;
                        return resolvedModule.default;
                      }
                    } catch (error) {
                      console.error("Error loading image:", error);
                      return null;
                    }
                  })
                );
                
                setGambar(updatedImages);
              };
              loadImage();
            if(filterDokter.length == 0){
                const fetchIntervalDokter = setInterval(async()=>{
                        try {
                            fetchInitialData();
                        } catch (error) {
                            console.log(error);
                            
                        }
                  }, 10000)
                  return () => clearInterval(fetchIntervalDokter)
            } else {
                const loadDataDokter = async () => {
                    const maxIterations = Math.min(2, filterDokter.length);
                    const maxIterationsBlink = Math.min(2, filterDokter.length);
                    for (let i = 0; i < maxIterations; i++) {
                        for(let a = 0; a < maxIterationsBlink; a++){
                                document.querySelector(`div[bagan='${a}']`).classList.remove('blinking-background');
                        }
                        document.querySelector(`div[bagan='${i}']`).classList.add('blinking-background');
                        
                        await new Promise((resolve)=>{
                            playVoicesDokter(filterDokter[i].now_antrean_dokter, filterDokter[i].ruangan_id, filterDokter[i].ruangpraktek, filterDokter[i].pegawai_id, ()=>resolve());
                        })
                        await axios.get(AntrianServices.updateData(filterDokter[i].now_norec_apd, jenisArea)).then(e => {
                            if(e.data.status == 200){
                                console.log(e.data.messages || e.data.message);
                            } else {
                                console.log(e.data.messages || e.data.message)
                            }
                        });
                        document.querySelector(`div[bagan='${i}']`).classList.remove('blinking-background');
                    }
                    fetchInitialData();
                };
                loadDataDokter();
            }
        }

        if(jenisArea == 'data_ruangan'){           
            if(filterSuster.length == 0){
                const fetchIntervalSuster = setInterval(async()=>{
                    try {
                        fetchInitialData();
                    } catch (error) {
                        console.log(error);
                        
                    }
                  }, 10000)
                  return () => clearInterval(fetchIntervalSuster)
            } else {
                const loadDataSuster = async () => {
                    for(let a = 0; a < filterSuster.length; a++){
                        filterSuster.forEach((val, index)=>{
                            document.querySelector(`tr[bagan='${index}']`).classList.remove('blinking-background');
                        })
                        document.querySelector(`tr[bagan='${a}']`).classList.add('blinking-background');
                        await new Promise((resolve)=>{
                            playVoiceSuster(filterSuster[a].nocm, filterSuster[a].now_antrean_suster, filterSuster[a].ruangan_id, newData.data_area, ()=>resolve()); 
                        })
                        await axios.get(AntrianServices.updateData(filterSuster[a].now_norec_apd, jenisArea)).then(e => {
                            if(e.data.status == 200){
                                console.log(e.data.messages || e.data.message);
                            } else {
                                console.log(e.data.messages || e.data.message)
                            }
                        });
                        document.querySelector(`tr[bagan='${a}']`).classList.remove('blinking-background');
                    }
                    fetchInitialData();
                }
                loadDataSuster();
            }
        }
    }, [newData, jenisArea])

    const scrollContainerRef = useRef(null);

    useEffect(() => {
        const scrollContainer = scrollContainerRef.current;
        let scrollAmount = 0;

        const smoothScroll = () => {
            if (scrollContainer) {
                scrollAmount += 0.4;
                scrollContainer.scrollTop = scrollAmount;
                
                if (scrollAmount >= scrollContainer.scrollHeight - scrollContainer.clientHeight) {
                    setTimeout(() => {
                        scrollAmount = 0;
                    }, 1000);
                }

                requestAnimationFrame(smoothScroll);
            }
        };

        requestAnimationFrame(smoothScroll);

        return () => {
            cancelAnimationFrame(smoothScroll);
        }
    }, [getScroll]);

    const renderDokter = () => {
        return (
            <main className='fixed small:top-28 medium:top-40 large:top-52 x-large:top-64 small:bottom-10 medium:bottom-16 large:bottom-28 left-0 right-0 flex'>
                <div className='bg-green-100 w-1/3 rounded shadow-md flex flex-col justify-evenly mx-2 px-2'>
                    <div className='text-center flex justify-center items-center' style={{minHeight:'75px'}}>
                        <h1 className='small:text-xl medium:text-3xl large:text-5xl x-large:text-6xl text-slate-600 font-semibold'>{newData?.data[0]?.namaruangan.toUpperCase() || '...'} </h1>
                    </div>
                        <div className='small:border medium:border-2 large:border-2 border-red-400'></div>
                    <div className='text-center'>
                    {newData?.data[0]?.ruangpraktek ? (
                        <h1 className='small:text-xl medium:text-3xl large:text-5xl x-large:text-6xl text-slate-600 font-semibold'>Room {newData?.data[0]?.ruangpraktek || '...'}</h1>
                    ):(
                        <h1 className='small:text-xl medium:text-3xl large:text-5xl x-large:text-6xl text-slate-600 font-semibold'>{newData?.data[0]?.ruangpraktek || '...'}</h1>
                    )}
                    </div>
                    <div>
                        <h1 className='p-1 large:p-4 small: text-xl medium:text-2xl large:text-4xl x-large:text-5xl text-center text-white bg-red-400 rounded-lg'>{newData?.data[0]?.nama_pegawai || '...'}</h1>
                    </div>
                    <div className='flex justify-evenly items-center'>
                        <div className="rounded shadow-md small:w-[180px] medium:w-[240px] large:w-[340px] x-large:w-[540px] bg-[#D6DF22]">
                            <img src={gambar[0] || templateImage} alt="dokter" />
                        </div>
                        <div className='flex flex-col items-center'>
                            <p className='small:text-md medium:text-2xl large:text-3xl x-large:text-5xl text-slate-600'>Antrean saat ini</p>
                            <div bagan="0" className='bg-red-400 text-white small:w-[14rem] medium:w-[18rem] large:w-[24rem] x-large:w-[28rem] small:h-36 medium:h-48 large:h-72 x-large:h-96 rounded-xl flex justify-center items-center mt-5 p-5'>
                                <h1 className='small:text-[8rem] medium:text-[10rem] large:text-[15rem] x-large:text-[18rem]'>
                                    {newData?.data[0]?.now_antrean_dokter || newData?.data[0]?.finish_antrean_dokter[0] || '...'}
                                </h1>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h1 className='small:text-xl medium:text-2xl large:text-3xl x-large:text-5xl text-slate-600'>Antrean Selanjutnya</h1>
                        <div className='small:border medium:border-2 large:border-2 border-red-400'></div>
                    </div>
                    <div className='flex justify-start gap-x-px flex-wrap'>
                        <div className='bg-stone-400 text-white w-1/3 small:h-28 medium:h-32 large:h-48 x-large:h-72 rounded flex justify-center items-center'>
                            <h1 className='text-8xl x-large:text-[14rem]'>{newData?.data[0]?.next_antrean_dokter || '...'}</h1>
                        </div>
                    </div>
                    <div>
                        <h1 className='small:text-xl medium:text-2xl large:text-3xl x-large:text-5xl text-slate-600'>Antrean Sudah Dipanggil</h1>
                        <div className='small:border medium:border-2 large:border-2 border-red-400'></div>
                    </div>
                    <div className='flex justify-evenly'>
                        <div className='bg-stone-400 text-white small:w-[8rem] medium:w-[12rem] large:w-[16rem] x-large:w-[20rem] small:h-24 medium:h-28 large:h-40 x-large:h-52 rounded flex justify-center items-center'>
                            <h1 className='text-6xl x-large:text-[10rem]'>{newData?.data[0]?.finish_antrean_dokter[0] || '...'}</h1>
                        </div>
                        <div className='bg-stone-400 text-white small:w-[8rem] medium:w-[12rem] large:w-[16rem] x-large:w-[20rem] small:h-24 medium:h-28 large:h-40 x-large:h-52 rounded flex justify-center items-center'>
                            <h1 className='text-6xl x-large:text-[10rem]'>{newData?.data[0]?.finish_antrean_dokter[1] || '...'}</h1>
                        </div>
                        <div className='bg-stone-400 text-white small:w-[8rem] medium:w-[12rem] large:w-[16rem] x-large:w-[20rem] small:h-24 medium:h-28 large:h-40 x-large:h-52 rounded flex justify-center items-center'>
                            <h1 className='text-6xl x-large:text-[10rem]'>{newData?.data[0]?.finish_antrean_dokter[2] || '...'}</h1>
                        </div>
                    </div>
                </div>
                <div className='bg-green-100 w-1/3 rounded shadow-md flex flex-col justify-evenly mx-2 px-2'>
                    <div className='text-center flex justify-center items-center' style={{minHeight:'75px'}}>
                        <h1 className='small:text-xl medium:text-3xl large:text-5xl x-large:text-6xl text-slate-600 font-semibold'>{newData?.data[1]?.namaruangan.toUpperCase() || '...'}</h1>
                    </div>
                        <div className='small:border medium:border-2 large:border-2 border-red-400'></div>
                    <div className='text-center'>
                    {newData?.data[1]?.ruangpraktek ? (
                        <h1 className='small:text-xl medium:text-3xl large:text-5xl x-large:text-6xl text-slate-600 font-semibold'>Room {newData?.data[1]?.ruangpraktek || '...'}</h1>
                    ):(
                        <h1 className='small:text-xl medium:text-3xl large:text-5xl x-large:text-6xl text-slate-600 font-semibold'>{newData?.data[1]?.ruangpraktek || '...'}</h1>
                    )}
                    </div>
                    <div>
                        <h1 className='p-1 large:p-4 small:text-xl medium:text-2xl large:text-4xl x-large:text-5xl text-center text-white bg-red-400 rounded-lg'>{newData?.data[1]?.nama_pegawai || '...'}</h1>
                    </div>
                    <div className='flex justify-evenly items-center'>
                        <div className='rounded shadow-md small:w-[180px] medium:w-[240px] large:w-[340px] x-large:w-[540px]'>
                            <img src={gambar[1] || templateImage} alt="dokter" />
                        </div>
                        <div className='flex flex-col items-center'>
                            <p className='small:text-md medium:text-2xl large:text-3xl x-large:text-5xl text-slate-600'>Antrean Saat Ini</p>
                            <div bagan="1" className='bg-red-400 text-white small:w-[14rem] medium:w-[18rem] large:w-[24rem] x-large:w-[28rem] small:h-36 medium:h-48 large:h-72 x-large:h-96 rounded-xl flex justify-center items-center mt-5'>
                                <h1 className='small:text-[8rem] medium:text-[10rem] large:text-[15rem] x-large:text-[18rem]'>
                                    {newData?.data[1]?.now_antrean_dokter || newData?.data[1]?.finish_antrean_dokter[0] || '...'}
                                </h1>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h1 className='small:text-xl medium:text-2xl large:text-3xl x-large:text-5xl text-slate-600'>Antrean Selanjutnya</h1>
                        <div className='small:border medium:border-2 large:border-2 border-red-400'></div>
                    </div>
                    <div className='flex justify-start gap-x-px flex-wrap'>
                        <div className='bg-stone-400 text-white w-1/3 small:h-28 medium:h-32 large:h-48 x-large:h-72 rounded flex justify-center items-center'>
                            <h1 className='text-8xl x-large:text-[14rem]'>{newData?.data[1]?.next_antrean_dokter || '...'}</h1>
                        </div>
                    </div>
                    <div>
                        <h1 className='small:text-xl medium:text-2xl large:text-3xl x-large:text-5xl text-slate-600'>Antrean Sudah Dipanggil</h1>
                        <div className='small:border medium:border-2 large:border-2 border-red-400'></div>
                    </div>
                    <div className='flex justify-evenly'>
                        <div className='bg-stone-400 text-white small:w-[8rem] medium:w-[12rem] large:w-[16rem] x-large:w-[20rem] small:h-24 medium:h-28 large:h-40 x-large:h-52 rounded flex justify-center items-center'>
                            <h1 className='text-6xl x-large:text-[10rem]'>{newData?.data[1]?.finish_antrean_dokter[0] || '...'}</h1>
                        </div>
                        <div className='bg-stone-400 text-white small:w-[8rem] medium:w-[12rem] large:w-[16rem] x-large:w-[20rem] small:h-24 medium:h-28 large:h-40 x-large:h-52 rounded flex justify-center items-center'>
                            <h1 className='text-6xl x-large:text-[10rem]'>{newData?.data[1]?.finish_antrean_dokter[1] || '...'}</h1>
                        </div>
                        <div className='bg-stone-400 text-white small:w-[8rem] medium:w-[12rem] large:w-[16rem] x-large:w-[20rem] small:h-24 medium:h-28 large:h-40 x-large:h-52 rounded flex justify-center items-center'>
                            <h1 className='text-6xl x-large:text-[10rem]'>{newData?.data[1]?.finish_antrean_dokter[2] || '...'}</h1>
                        </div>
                    </div>
                </div>
                <div ref={scrollContainerRef} className="bg-green-100 w-1/3 rounded shadow-md flex flex-col justify-between mx-2 px-2 overflow-hidden">
                    {newData.data.filter((res, idx) => idx != 0 && idx != 1).map((res, index) => 
                        <div className='bg-red-400 rounded-lg flex justify-between p-3 my-1 text-white' key={index}>
                            <div className='w-2/3'>
                                <p className='text-xl w-fit py-1 px-3 rounded font-semibold bg-green-100 text-slate-600'>Room {res.ruangpraktek}</p>
                                <p className='text-xl font-semibold'>{res.namaruangan}</p>
                                <p className='text-xl'>{ res.nama_pegawai || '...'}</p>
                            </div>
                            <div className='flex flex-col justify-center items-center'>
                                <p>Antrean saat ini</p>
                                <p className='text-7xl text-center font-semibold py-3'>{res.finish_antrean_dokter[0] || '...'}</p>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        );
    };

    const renderSuster = () => {
        return (
            <main className='fixed small:top-28 medium:top-40 large:top-52 x-large:top-64 small:bottom-10 medium:bottom-16 large:bottom-28 left-0 right-0'>
                <table>
                    <thead>
                        <tr className='bg-green-100'>
                            <th className='text-center'>No MR</th>
                            <th className='text-center'>Nama Dokter</th>
                            <th className='text-center'>Nama Poliklinik</th>
                            <th className='text-center'>Nomor Antrian</th>
                        </tr>
                    </thead>
                    <tbody>
                        {newData.data && newData.data.length > 5 ? (
                            newData.data.map((e, i) => (
                                <tr bagan={i} key={i}>
                                    <td>{e.nocm || e.finish_nocm[0]}</td>
                                    <td>{e.nama_pegawai}</td>
                                    <td>{e.namaruangan}</td>
                                    <td>{e.now_antrean_suster || e.finish_antrean_suster[0]}</td>
                                </tr>
                            ))
                        ) : (
                            newData.data.map((e, i) => (
                                <tr bagan={i} key={i} style={{height:'100px'}}>
                                    <td className='text-2xl'>{e.nocm || e.finish_nocm[0]}</td>
                                    <td className='text-2xl'>{e.nama_pegawai}</td>
                                    <td className='text-2xl'>{e.namaruangan}</td>
                                    <td className='text-2xl'>{e.now_antrean_suster || e.finish_antrean_suster[0]}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </main>
        );
    };

    return (
        <>
            {newData && (
                <>
                    <Header data={newData.data_area}/>
                    {jenisArea === 'data_dokter' && renderDokter()}
                    {jenisArea === 'data_ruangan' && renderSuster()}
                    <Footer/>
                </>
            )}
        </>
    )
}

export default Body
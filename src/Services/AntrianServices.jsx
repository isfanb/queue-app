export const BASE_URL = import.meta.env.VITE_API_URL;

export const AntrianServices = {
    getData(){
        return `${BASE_URL}/api/area-antrean/layar-panggil/area-antrean-detail/${location.pathname.slice(6,8)}`;
    },
    updateData(param, param1){
        return `${BASE_URL}/api/area-antrean/update-panggilan/dokter-panggil?norec_apd=${param}&jenis_area=${param1}`
    }
}
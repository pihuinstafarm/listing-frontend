function Booking() {
    async function getAll(payload) {
        const token = localStorage.getItem('token')
        const res = await fetch(process.env.NEXT_PUBLIC_DEV_BASE_URL+`/api/booking/mybookings`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload),
        })
        return await res.json()
    }


    async function getById(docymentId) {
        const token = localStorage.getItem('token')
        const res = await fetch(process.env.NEXT_PUBLIC_DEV_BASE_URL+`/api/booking/bookingId/${docymentId}`, {
         method: 'GET',
         headers: {
         'Content-Type': 'application/json',
         'Authorization': `Bearer ${token}`
         }
     })
     
     const data = await res.json()
     
     return data
    }
   
    return {getAll,getById}
}


export default Booking

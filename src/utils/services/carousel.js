function Carousel() {
   
    
    async function getAllCarousels() {
        const res = await fetch(process.env.NEXT_PUBLIC_DEV_BASE_URL+`/api/carousel`, {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            'X-App-Type': 'listing'
            }
        })
        return await res.json()
    }
    async function SearchCarousel(payload) {
        const res = await fetch(process.env.NEXT_PUBLIC_DEV_BASE_URL+`/api/carousel/paginate`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'X-App-Type': 'listing'
            },
            body: JSON.stringify(payload),
        })
        return await res.json()
    }
    
  
   
    return { getAllCarousels ,SearchCarousel}
}


export default Carousel

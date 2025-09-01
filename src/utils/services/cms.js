function CMS() {
   
    
    async function getAllPages() {
        const res = await fetch(process.env.NEXT_PUBLIC_DEV_BASE_URL+`/api/cms`, {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            'X-App-Type': 'listing'
            }
        })
        return await res.json()
    }
    async function SearchPage(payload) {
        const res = await fetch(process.env.NEXT_PUBLIC_DEV_BASE_URL+`/api/cms/paginate`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'X-App-Type': 'listing'
            },
            body: JSON.stringify(payload),
        })
        return await res.json()
    }
    
  
   
    return { getAllPages ,SearchPage}
}


export default CMS

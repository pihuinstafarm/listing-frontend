function ExtraPlans() {
   
    
    async function getAll() {
        const res = await fetch(process.env.NEXT_PUBLIC_DEV_BASE_URL+`/api/extra-plans`, {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            'X-App-Type': 'listing'
            }
        })
        return await res.json()
    }

    async function getAllRatesPlans() {
        const res = await fetch(process.env.NEXT_PUBLIC_DEV_BASE_URL+`/api/rate-plans`, {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            'X-App-Type': 'listing'
            }
        })
        return await res.json()
    }

    async function getAllDiscountsPlans() {
        const res = await fetch(process.env.NEXT_PUBLIC_DEV_BASE_URL+`/api/discounts-plans`, {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            'X-App-Type': 'listing'
            }
        })
        return await res.json()
    }

    return { getAll,getAllRatesPlans,getAllDiscountsPlans}
}


export default ExtraPlans

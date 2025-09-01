function FAQs() {


    async function getfaqs(id) {
        const res = await fetch(process.env.NEXT_PUBLIC_DEV_BASE_URL + `/api/faqs/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-App-Type': 'listing'
            }
        })
        return await res.json()
    }

    return { getfaqs }
}


export default FAQs;

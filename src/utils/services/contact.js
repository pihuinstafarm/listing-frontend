function ContactRequest() {
   
    
    async function submitForm(payload) {
        
        const res = await fetch(process.env.NEXT_PUBLIC_DEV_BASE_URL+`/api/contact-request`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        })
        
        return await res.json()

    }

    
  
   
    return { submitForm }
}


export default ContactRequest

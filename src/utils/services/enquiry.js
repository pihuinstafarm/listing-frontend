function Enquiry() {
   
    
    async function confirm(payload) {
        const token = localStorage.getItem('token')
        const res = await fetch(process.env.NEXT_PUBLIC_DEV_BASE_URL+`/api/enquiry/confirm`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload),
        })
        return await res.json()
    }

    async function getAll(payload) {
        try {
            const token = localStorage.getItem('token')
            // console.log('Enquiry service - getAll called with payload:', payload);
            // console.log('Enquiry service - token present:', !!token);
            
            // Try the new endpoint first
            try {
                const res = await fetch(process.env.NEXT_PUBLIC_DEV_BASE_URL+`/api/enquiry/myenquiry`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(payload),
                })
                
                // console.log('Enquiry service - new endpoint response status:', res.status);
                // console.log('Enquiry service - new endpoint response ok:', res.ok);
                
                if (!res.ok) {
                    const errorText = await res.text();
                    console.error('Enquiry service - new endpoint HTTP error:', res.status, errorText);
                    
                    // If it's an auth error, try the legacy endpoint
                    if (res.status === 401) {
                        // console.log('Enquiry service - trying legacy endpoint due to auth error');
                        return await getAllLegacy(payload);
                    }
                    
                    throw new Error(`HTTP error! status: ${res.status}, response: ${errorText}`);
                }
                
                const data = await res.json();
                // console.log('Enquiry service - new endpoint response data:', data);
                return data;
            } catch (error) {
                // console.log('Enquiry service - new endpoint failed, trying legacy endpoint:', error.message);
                return await getAllLegacy(payload);
            }
        } catch (error) {
            console.error('Enquiry service - error in getAll:', error);
            throw error; // Re-throw to let the component handle it
        }
    }
    
    async function getAllLegacy(payload) {
        try {
            const token = localStorage.getItem('token')
            // console.log('Enquiry service - getAllLegacy called with payload:', payload);
            
            const res = await fetch(process.env.NEXT_PUBLIC_DEV_BASE_URL+`/api/enquiry/myenquiry`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            
            // console.log('Enquiry service - legacy endpoint response status:', res.status);
            // console.log('Enquiry service - legacy endpoint response ok:', res.ok);
            
            if (!res.ok) {
                const errorText = await res.text();
                console.error('Enquiry service - legacy endpoint HTTP error:', res.status, errorText);
                throw new Error(`HTTP error! status: ${res.status}, response: ${errorText}`);
            }
            
            const data = await res.json();
            // console.log('Enquiry service - legacy endpoint response data:', data);
            return data;
        } catch (error) {
            console.error('Enquiry service - error in getAllLegacy:', error);
            throw error;
        }
    }
   
    return { confirm, getAll, getAllLegacy }
}


export default Enquiry

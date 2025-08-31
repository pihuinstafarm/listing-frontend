function Auth() {
   
    async function isRegisterd(payload) {
        
        const res = await fetch(process.env.NEXT_PUBLIC_DEV_BASE_URL+`/api/listing-users/is_registerd`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        })
        return await res.json()
    }

    async function getOTP(payload) {
        
        const res = await fetch(process.env.NEXT_PUBLIC_DEV_BASE_URL+`/api/listing-users/get_otp`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        })
        return await res.json()
    }

    async function confirmOtp(payload) {
        
        const res = await fetch(process.env.NEXT_PUBLIC_DEV_BASE_URL+`/api/listing-users/validate_auth`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        })
        return await res.json()
    }

    async function registerUser(payload) {
        
        const res = await fetch(process.env.NEXT_PUBLIC_DEV_BASE_URL+`/api/listing-users/register`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        })
        return await res.json()
    }

    
    async function logoutUser(payload) {
        
        const token = localStorage.getItem('token')
        const res = await fetch(process.env.NEXT_PUBLIC_DEV_BASE_URL+`/api/listing-users/logout_auth`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload),
        })
        return await res.json()
    }

    


    async function getProfile() {
        
        const documentId = localStorage.getItem('documentId')
        const token = localStorage.getItem('token')
        
        const res = await fetch(process.env.NEXT_PUBLIC_DEV_BASE_URL+`/api/listing-users/profile/`+documentId, {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
            }
        })
        return await res.json()
    }

    

    
    async function updateProfile(payload) {
        const documentId = localStorage.getItem('documentId')
        const token = localStorage.getItem('token')
        const res = await fetch(process.env.NEXT_PUBLIC_DEV_BASE_URL+`/api/listing-users/profile/`+documentId, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload),
        })
        return await res.json()
    }

    async function addItemToFavorite(payload) {
        const documentId = localStorage.getItem('documentId')
        const token = localStorage.getItem('token')
        const res = await fetch(process.env.NEXT_PUBLIC_DEV_BASE_URL+`/api/listing-users/addItemToFavorite/`+documentId, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload),
        })
        return await res.json()
    }

    async function removeItemFromFavorite(payload) {
        const documentId = localStorage.getItem('documentId')
        const token = localStorage.getItem('token')
        const res = await fetch(process.env.NEXT_PUBLIC_DEV_BASE_URL+`/api/listing-users/removeItemFromFavorite/`+documentId, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload),
        })
        return await res.json()
    }

    return { isRegisterd,getOTP,confirmOtp,registerUser,logoutUser, getProfile ,updateProfile,addItemToFavorite,removeItemFromFavorite}
}


export default Auth

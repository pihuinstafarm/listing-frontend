function Settings() {
   
    
    async function getSettings() {
        const res = await fetch(process.env.NEXT_PUBLIC_DEV_BASE_URL+`/api/settings/websitesetting3016`, {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            }
        })
        return await res.json()
    }
  
    return { getSettings}
}


export default Settings

function Metadata() {


    async function getMetadata(id) {
        const res = await fetch(process.env.NEXT_PUBLIC_DEV_BASE_URL + `/api/metadata/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        return await res.json()
    }

    return { getMetadata }
}


export default Metadata;

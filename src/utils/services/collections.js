function Collections() {


    async function getAll() {
        let payload = {
            pageNumber: 1,
            totalPages: 0,
            LastDocument: false,
            moveTo: false,
            perPage: 100,
            orderBy: 'weight',
            searchBy: '',
            searchKey: '',
            attributes: "logo,name,slug,hpc,altText"
        }

        const res = await fetch(process.env.NEXT_PUBLIC_DEV_BASE_URL + `/api/collections/paginate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        })

        return await res.json()
    }

    async function getAllCollections() {

        let payload = {
            pageNumber: 1,
            totalPages: 0,
            LastDocument: false,
            moveTo: false,
            perPage: 15,
            orderBy: 'weight',
            searchBy: '',
            searchKey: '',
            attributes: "logo,name,slug,hpc"
        }

        const res = await fetch(process.env.NEXT_PUBLIC_DEV_BASE_URL + `/api/collections/paginate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        })

        return await res.json()
    }


    async function paginateCollections(payload) {

        const res = await fetch(process.env.NEXT_PUBLIC_DEV_BASE_URL + `/api/collections/paginate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        })

        return await res.json()
    }




    return {
        getAllCollections, paginateCollections, getAll
    }
}


export default Collections

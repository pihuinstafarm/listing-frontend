function Locations() {

    async function getAllArea() {

        let payload = {
            orderBy: 'weight',
            searchBy: '',
            searchKey: '',
            attributes: "name,slug,city_name,state_slug"
        }

        const res = await fetch(process.env.NEXT_PUBLIC_DEV_BASE_URL + `/api/areas/paginate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        })

        return await res.json()

    }

    async function getAllCity() {
        const res = await fetch(process.env.NEXT_PUBLIC_DEV_BASE_URL + `/api/cities`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        return await res.json()
    }

    async function getAllStates() {
        const res = await fetch(process.env.NEXT_PUBLIC_DEV_BASE_URL + `/api/states`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        return await res.json()
    }

    async function getNearByLocations(slug) {
        let searchKeyValue = ''
        let searchByValue = 'city_slug';
        if (slug) {
            searchKeyValue = slug
        }

        let payload = {
            pageNumber: 1,
            totalPages: 0,
            LastDocument: false,
            moveTo: false,
            perPage: 50,
            orderBy: 'weight',
            searchBy: searchByValue,
            searchKey: searchKeyValue,
            attributes: "name,slug,weight,city_name,state_slug"
        }


        const res = await fetch(process.env.NEXT_PUBLIC_DEV_BASE_URL + `/api/areas/paginate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        })
        let responseData = await res.json()

        return responseData
    }
    async function getAllLocations(payload) {
        const res = await fetch(process.env.NEXT_PUBLIC_DEV_BASE_URL + `/api/areas/paginate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        })

        return await res.json()
    }

    async function SearchLocations(payload) {
        const res = await fetch(process.env.NEXT_PUBLIC_DEV_BASE_URL + `/api/areas/paginate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        })
        return await res.json()
    }

    async function SearchCity(payload) {
        //const res = await fetch("https://jsonplaceholder.typicode.com/posts");
        const res = await fetch(process.env.NEXT_PUBLIC_DEV_BASE_URL + `/api/cities/paginate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        })
        return await res.json()
    }

    async function SearchAreas(payload) {
        const res = await fetch(process.env.NEXT_PUBLIC_DEV_BASE_URL + `/api/areas/paginate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        })
        return await res.json()
    }

    return {
        SearchAreas, getAllLocations, SearchLocations, SearchCity, getNearByLocations, getAllArea, getAllCity, getAllStates
    }
}

export default Locations

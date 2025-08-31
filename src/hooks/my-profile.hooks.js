import { useState, useEffect } from 'react'
import { authServices } from 'utils/services'

function getProfile() {
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState({})

    useEffect(() => {
        authServices.getProfile().then((res) => {
            setLoading(false)
            setData(res)
        })
    }, [])

    return {
        loading,
        data,
    }
}



export { getProfile}

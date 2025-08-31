function getUrlParams(payload) {
    const params = new URLSearchParams()
    const keys = Object.keys(payload)
    keys.forEach((key) => {
        params.append(key, payload[key])
    })
    return params
}

export default getUrlParams

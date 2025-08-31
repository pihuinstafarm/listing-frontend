function userLocation() {
    if ( localStorage.getItem('defaultLocation')) {
        return localStorage.getItem('defaultLocation') 
    }
    return '20JQ8a9ou6njpdxqk1dg'
}

export default userLocation

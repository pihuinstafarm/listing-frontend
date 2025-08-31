function isLoggedIn() {
    if (localStorage.getItem('token') &&  localStorage.getItem('documentId') ) {
        return true
    }
    return false
}

export default isLoggedIn




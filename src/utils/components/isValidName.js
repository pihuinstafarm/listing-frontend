function validateName(name) {
    return name && name.match(/^[a-zA-Z]+ [a-zA-Z]+$/)
}

export default validateName

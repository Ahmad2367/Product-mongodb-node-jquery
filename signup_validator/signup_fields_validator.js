function userValidation(requestName, requestPass, requestEmail) {
    if (!requestName) {
        return {
            isValid: false,
            errMsg: 'Should not be empty'
        }
    }
    if (!requestPass) {
        return {
            isValid: false,
            errMsg: 'Must not be empty'
        }
    }

    let regexExp = (/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
    if (!regexExp.test(requestPass)) {
        return {
            isValid: false,
            errMsg: 'Must contain one upper/lowercase letter, one special symbol, characters b/w 8 to 25'
        }
    }

    if (!requestEmail) {
        return {
            isValid: false,
            errMsg: 'Must not be empty'
        }
    }

    let isEmailValid = (/^[a-zA-Z0-9_.+]*[a-zA-Z][a-zA-Z0-9_.+]*@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/)
    if (!isEmailValid.test(requestEmail)) {
        return {
            isValid: false,
            errMsg: 'Please enter a valid email(xyz@gmail.com)'
        }
    }

    return {
        isValid: true,
        errMsg: ""
    }

}




module.exports = userValidation
function orderValidator(requestName, requestEmail, requestAddress, requestCity, requestState) {
        
    if(!requestName) {
        return {
            isValid: false,
            error: 'Please enter a Name. Must not be empty'
        }
    }
    if(!requestEmail) {
        return {
            isValid: false,
            error: 'Please enter a Email Address. Must not be empty'
        }
    }

    if(!requestAddress) {
        return {
            isValid: false,
            error: 'Please enter the address where you want your Delivery. Must not be empty'
        }
    }

    if(!requestCity) {
        return {
            isValid: false,
            error: 'Please enter a City Name. Must not be empty'
        }
    }

    if(!requestState) {
        return {
            isValid: false,
            error: 'Please enter a State. Must not be empty'
        }
    }
}


module.exports = orderValidator
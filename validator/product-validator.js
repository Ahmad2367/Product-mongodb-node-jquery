function productValidation(requestTitle, requestDescription, requestPrice, requestInventory) {

    if (!requestTitle) {
        return {
            isValid: false,
            error: 'Please enter valid title. Must not be empty.'
        };
    }

    if (!requestDescription) {
        return {
            isValid: false,
            error: 'Please enter a valid description. Must not be empty'
        };
    }

    // need to check if inventory is not undefined and is a number and is greater than 0
    if (!(typeof (requestInventory) !== "undefined" && parseInt(requestInventory) > 0)) {
        return {
            isValid: false,
            error: 'Please enter a valid inventory level. Must be greater than 0'
        };
    }

    if (!(typeof (requestPrice) !== "undefined" && parseFloat(requestPrice) > 0)) {
        return {
            isValid: false,
            error: 'Please enter a valid price. Must be greater than 0'
        }
    }

    return {
        isValid: true,
        error: ""
    }

}


module.exports = productValidation;
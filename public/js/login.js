$('#btnsign').on('click', function (event) {

    event.preventDefault();

    let formData = {
        username: $('#userName').val(),
        password: $('#Password').val(),
        email: $('#Email').val()
    }
    $.ajax({
        url: '/signup',
        method: 'POST',
        data: formData,
        success: function (data) {

            if (data.success === true) {
                document.getElementById('errMsg').innerHTML = `<p style ="color:green">Added Successfully!</p>`
            }
            if (data.success === false) {
                document.getElementById('errMsg').innerHTML = `<p>${data.error}</p>`
            }
        },
    })
})

$('#btnLogin').on('click', function () {
    let loginData = {
        loginEmail: $('#mail').val(),
        loginPassword: $('#Pass').val()
    }

    $.ajax({
        url: '/login',
        method: 'POST',
        data: loginData,
        headers: getHeaders(),
        error: function (httpObj, textStatus) {
            if (httpObj.status === 401) {
                window.location.href = '/login-register.html'
            }
        },
        success: function (data) {
            if (data.success === true) {
                localStorage.setItem('JWT-Token', data.Value)
                window.location.href = '/'
            }
            if (data.success === false) {
                document.getElementById('msg').innerHTML = `<p>${data.error}</p>`
            }
        },
    })
})




function getHeaders() {
    let headersObj = {};
    if (localStorage.getItem('JWT-Token')) {
        headersObj = {
            'Authorization': 'Bearer ' + localStorage.getItem('JWT-Token')
        }
    }
    return headersObj;
}
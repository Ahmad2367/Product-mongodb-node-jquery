$(document).ready(function () {

    $('#btnOrder').on('click', function() {
        
        let formData = {
            customerName : $('#name').val(),
            customerEmail: $('#email').val(),
            customerCity: $('#city').val(),
            customerZipCode:$('#zipCode').val(),
            customerAddress: $('#address').val(),
            customerState: $('#state').val(),
            customerCountry:$('#country').val()
        } 
        $.ajax({
            url:'/order',
            type:'POST',
            headers:getHeaders(),
            data: formData,
            success: function (data) {
                console.log(data)
            }
        })
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

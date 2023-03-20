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
                if(data.success === false) {
                  document.getElementById('problem').innerHTML = data.error
                } else {
                    window.location.href = '/thanks.html'
                }
                
            }
        })
    })
        $.ajax({
            url:'/cart/get',
            type:'GET',
            headers: getHeaders(),
            success: function (obj) {
                let arr = obj.data
                if(arr.length===0) {
                  document.getElementById("totalPrice").innerText = 0       
                } else {
             document.getElementById("totalPrice").innerText =   obj.data.totalPrice
                }
            }
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

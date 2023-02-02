$(document).ready(function () {

    let queryString = window.location.search
    if(queryString) 
    {
        const params = new URLSearchParams(queryString)
        const productID = params.get('productId')
        if(productID) { 
        $('#btnAdd').hide()
        } 
        $.ajax({
            type: 'GET',
            url: '/products?productId=' + productID,
            headers: getHeaders(),
            success: function(pro) {
                if(pro.success === true)

                {
                    let proInfo = pro.data
                    $('#proId').val(proInfo.productId);
                    $('#proTitle').val(proInfo.title);
                    $('#proDescription').val(proInfo.description);
                    $('#proPrice').val(proInfo.price);
                    $('#proInventory').val(proInfo.inventory);
                    $('#proImage').val(proInfo.img);
    
                    $(document).scrollTop();
                }

            }
        })
    } else {
        $('#btnUpdate').hide() 
    }

    $('#btnAdd').on('click', function () {
        
        const productsObj = {
            title: $(".tlVlaue").val(),
            description: $(".prodes").val(),
            price: $(".propric").val(),
            image: $(".proimg").val(),
            inventory: $(".proinvtry").val(),
        }
    
        $.ajax({
            type: 'POST',
            url: '/products',
            data: productsObj,
            headers: getHeaders(),
            error: function (httpObj, textStatus) {
                if (httpObj.status === 401) {
                    window.location.href = '/login-register.html'
                }
            },
            success: function (data) {
    
                if (data.success === true) {
                    document.getElementById('msg').innerHTML = `<p style ="color:green">Added Successfully!</p>`
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

        

    $('#btnUpdate').on('click', function () {
        

        const productsObj = {
            productId: $("#proId").val(),
            title: $(".tlVlaue").val(),
            description: $(".prodes").val(),
            price: $(".propric").val(),
            image: $(".proimg").val(),
            inventory: $(".proinvtry").val()
        }
        let productId = $("#proId").val();
    
        $.ajax({
            type: 'PUT',
            url: '/products/' + productId,
            data: productsObj,
            headers: getHeaders(),
            error: function (httpObj, textStatus) {
                if (httpObj.status === 401) {
                    window.location.href = '/login-register.html'
                }
            },
            success: function (product) {
                let proId = productId
                if (product.success === true) {
                    $(`div[data-product-id = ${proId}] .protitle`).text(productsObj.title).get()
                    $(`div[data-product-id =${proId}] .prodescription`).text(productsObj.description).get()
                    $(`div[data-product-id =${proId}] .proprice`).text(productsObj.price).get()
                    $(`div[data-product-id =${proId}] .proImage`).attr('src', `${productsObj.image}`)
    
                    document.getElementById('msg2').innerHTML = `<p style ="color:green">Updated Successfully!</p>`
                }
                if (product.success === false) {
                    document.getElementById('msg').innerHTML = `<p>${data.error}</p>`
                }
            },
        })
    
    });

    
})

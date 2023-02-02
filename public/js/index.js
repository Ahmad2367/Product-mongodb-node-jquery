$(document).ready(function () {
    $('#btnSearch').on('click', function () {
        let searchText = $('#search').val()
        let maxPrice = $('#highPric').val()
        let minPrice = $('#lowPric').val()
        $.ajax({
            url: '/products/search',
            type: 'GET',
            headers: getHeaders(),
            data: {
                searchTerm: searchText,
                maxRange: maxPrice,
                minRange: minPrice
            },
            error: function (httpObj, textStatus) {
                if (httpObj.status === 401) {
                    window.location.href = '/login-register.html'
                }
            },
            success: function (response) {

                if (response.success == false) {

                    return {
                        err: 'Something went wrong'
                    }
                }

                const products = response.data;
                let productsHTML = '';
                for (let i = 0; i < products.length; i++) {
                    let product = products[i]
                    const divProduct = `
                    <div class="card" style="width: 18rem;">
                    
                        <div class="card-body" data-product-id="${product.productId}">
                        <img src=${product.img} class="card-img-top proImage" alt="...">
                            <h5 class="card-title protitle">${product.title}</h5>
                            <p class="card-text prodescription">Description: ${product.description}</p>
                            <p class="card-text"><b>PKR</b><span class="proprice">${product.price}</span></p>
                            <span class='err-msg'></span>
                            <button type="button"  class="btn btn-danger del-btn">Delete</button>
                            <button type="button" class="btn btn-info edt-btn">Edit</button>
                            <button type="button" class="btn btn-info cart-btn">Add to cart</button>
                        </div>
                    </div>`;

                    productsHTML += divProduct;
                }

                if (!productsHTML) {
                    return;
                }

                $('#proArray').html(productsHTML);

                 
            if(!localStorage.getItem('Role')) {
                $('.del-btn').hide();
                $('.edt-btn').hide();
            }

                $('.del-btn').on('click', function (event) {
                    event.preventDefault();

                    let productId = $(this).parent().attr('data-product-id');
                    
                    $.ajax({
                        type: 'DELETE',
                        url: '/products/' + productId,
                        headers: getHeaders(),
                        success: function (data) {
                            if (data.success === true) {
                                $(`[data-product-id=${productId}]`).fadeOut().remove()
                            }
                            if (data.success === false) {
                                $(`[data-product-id=${productId}]`).find('.err-msg').text(data.err)
                            }
                        },
                        error: function (httpObj, textStatus) {
                            if (httpObj.status === 401) {
                                window.location.href = '/login-register.html'
                            }
                        },
                    })
                })
                
                $('.edt-btn').on('click', function () {
                    let proID = $(this).parent().attr('data-product-id');
                    let loc = window.location
                    window.location.href = loc.protocol +"//" + loc.host + '/admin.html?productId='+ proID;
                    return
                })

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

$(window).on('load', function () {
    $.ajax({
        type: 'GET',
        url: '/products',
        headers: getHeaders(),
        error: function (httpObj, textStatus) {
            if (httpObj.status === 401) {
                window.location.href = '/login-register.html'
            }
        },
        success: function (response) {
    
            const products = response.data;
            let productsHTML = '';
            
            for (let i = 0; i < products.length; i++) {
                let product = products[i]
                const divProduct = `
                    <div class="card" style="width: 18rem;">
                    
                        <div class="card-body" data-product-id="${product.productId}">
                        <img src=${product.img} class="card-img-top proImage" alt="...">
                            <h5 class="card-title protitle">${product.title}</h5>
                            <p class="card-text prodescription">Description: ${product.description}</p>
                            <p class="card-text"><b>PKR</b><span class="proprice">${product.price}</span></p>
                    Quantity: <input type="text" id="quantity" value='1' placeholder="Quantity">   
                    <div id="result"></div> 
                            <span class='err-msg'></span>
                            <button type="button"  class="btn btn-danger del-btn">Delete</button>
                            <button type="button" class="btn btn-info edt-btn">Edit</button>
                            <button type="button" class="btn btn-info cart-btn">Add to cart</button>
                        </div>
                    </div>`;
             
                productsHTML += divProduct;
            }
            if (!productsHTML) {
                return;
            }

            $('#proArray').html(productsHTML);
            
            if(!localStorage.getItem('Role')) {
                $('.del-btn').hide();
                $('.edt-btn').hide();
            }
            
            // Attach handler with products 
            $('.del-btn').on('click', function (event) {
                event.preventDefault();

                let productId = $(this).parent().attr('data-product-id');

                $.ajax({
                    type: 'DELETE',
                    url: '/products/' + productId,
                    headers: getHeaders(),
                    error: function (httpObj, textStatus) {
                        if (httpObj.status === 401) {
                            window.location.href = '/login-register.html'
                        }
                    },
                    success: function (data) {
                        if (data.success === true) {
                            $(`[data-product-id=${productId}]`).fadeOut().remove()
                        }
                        if (data.success === false) {
                            window.location.href = '/login-register.html'
                            $(`[data-product-id=${productId}]`).find('.err-msg').text(data.err)
                        }
                    },
                })
            })
            // Attach edit click-handler
            $('.edt-btn').on('click', function () {
                let proID = $(this).parent().attr('data-product-id');
                let loc = window.location
                    window.location.href = loc.protocol +"//" + loc.host + '/admin.html?productId='+ proID;
                    return
            })

            $('.cart-btn').on('click', function () {
                 let proID = $(this).parent().attr('data-product-id');
                let quantity =  $(`[data-product-id=${proID}]`).find('#quantity').val()
                
                $.ajax({
                    type: 'POST',
                    url:'/cart/add?id='+proID + '&quantity= ' + quantity,
                    headers: getHeaders(),
                    success: function(data){
                        if(data.success==true)
                        {
                            console.log(data)

                        }
                    }
                })
            })

        }
        
    })

})

$('#btnViewCart').on('click', function() {
    
    $.ajax({
        type: 'GET',
        url: '/cart/get',
        headers: getHeaders(),
        success: function(data){
            console.log(data)
        }

    })
})




$('#logBtn').on('click', function () {

    $.ajax({
        url: '/logout',
        method: 'DELETE',
        headers: getHeaders(),
        error: function (httpObj, textStatus) {
            if (httpObj.status === 401) {
                window.location.href = '/login-register.html'
            }
        },
        success: function (data) {
            if (data.success === true) {
                localStorage.removeItem('Role')
                localStorage.removeItem('JWT-Token')
                window.location.href = '/login-register.html'
            } else {
                if (data.success === false) {

                    document.getElementById('logMsg').innerHTML = `${data.error}`
                }
            }
        }
    })
})


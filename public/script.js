$(document).ready(function () {
    $('#btnGet').on('click', function () {
        let searchText = $('#search').val()
        let maxPrice = $('#highPric').val()
        let minPrice = $('#lowPric').val()
        $.ajax({
            url: '/products/search',
            type: 'GET',
            data: {
                searchTerm: searchText,
                maxRange: maxPrice,
                minRange: minPrice
            },
            success: function (response) {
                var proInformation = response.data

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
                        <img src=${product.img} class="card-img-top" alt="...">
                            <h5 class="card-title">${product.title}</h5>
                            <p class="card-text">Description: ${product.description}</p>
                            <p class="card-text"><b>PKR </b>${product.price}</p>
                            <span class='err-msg'></span>
                            <button type="button"  class="btn btn-danger del-btn">Delete</button>
                            <button type="button" class="btn btn-info edt-btn">Edit</button>
                        </div>
                    </div>`;

                    productsHTML += divProduct;
                }

                if (!productsHTML) {
                    return;
                }

                $('#proArray').html(productsHTML);

                $('.del-btn').on('click', function (event) {
                    event.preventDefault();

                    let productId = $(this).parent().attr('data-product-id');

                    $.ajax({
                        type: 'DELETE',
                        url: '/product/' + productId,
                        success: function (data) {
                            if (data.success === true) {
                                $(`[data-product-id=${productId}]`).fadeOut().remove()
                            }
                            if (data.success === false) {
                                $(`[data-product-id=${productId}]`).find('.err-msg').text(data.err)
                            }
                        },
                        error: function (err) {
                            console.log(err)
                        }
                    })
                })

                $('.edt-btn').on('click', function () {
                    let proID = $(this).parent().attr('data-product-id');
                    let getProId = proInformation.find((item) => item.productId === proID);
                    $('#proId').val(getProId.productId);
                    $('#proTitle').val(getProId.title);
                    $('#proDescription').val(getProId.description);
                    $('#proPrice').val(getProId.price);
                    $('#proInventory').val(getProId.inventory);
                    $('#proImage').val(getProId.img);

                    $(document).scrollTop();
                })

            }
        })
    })
})


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
        url: '/product/' + productId,
        data: productsObj,
        success: function (data) {
            if (data.success === true) {
                document.getElementById('msg2').innerHTML = `<p style ="color:green">Updated Successfully!</p>`
            }
            if (data.success === false) {
                document.getElementById('msg').innerHTML = `<p>${data.error}</p>`
            }
        },
        error: (err) => {
            console.log(err)
        }

    })

});


$('#btnAdd').on('click', function () {
    const productsObj = {
        title: $(".tlVlaue").val(),
        description: $(".prodes").val(),
        price: $(".propric").val(),
        image: $(".proimg").val(),
        inventory: $(".proinvtry").val()
    }

    $.ajax({
        type: 'POST',
        url: '/product',
        data: productsObj,
        success: function (data) {
            if (data.success === true) {
                document.getElementById('msg').innerHTML = `<p style ="color:green">Added Successfully!</p>`
            }
            if (data.success === false) {
                document.getElementById('msg').innerHTML = `<p>${data.error}</p>`
            }
        },
        error: (err) => {
            console.log(err)
        }

    })
})

$('#fresh-btn').on('click', function () {
    $.ajax({
        type: 'GET',
        url: '/products',
        success: function (response) {
            var proInformation = response.data

            if (response.success == false) {
                // todo: show an error message
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
                        <img src=${product.img} class="card-img-top" alt="...">
                            <h5 class="card-title">${product.title}</h5>
                            <p class="card-text">Description: ${product.description}</p>
                            <p class="card-text"><b>PKR </b>${product.price}</p>
                            <span class='err-msg'></span>
                            <button type="button"  class="btn btn-danger del-btn">Delete</button>
                            <button type="button" class="btn btn-info edt-btn">Edit</button>
                        </div>
                    </div>`;

                productsHTML += divProduct;
            }

            if (!productsHTML) {
                return;
            }

            $('#proArray').html(productsHTML);
            // Attach handler with products 
            $('.del-btn').on('click', function (event) {
                event.preventDefault();

                let productId = $(this).parent().attr('data-product-id');

                $.ajax({
                    type: 'DELETE',
                    url: '/product/' + productId,
                    success: function (data) {
                        if (data.success === true) {
                            $(`[data-product-id=${productId}]`).fadeOut().remove()
                        }
                        if (data.success === false) {
                            $(`[data-product-id=${productId}]`).find('.err-msg').text(data.err)
                        }
                    },
                    error: function (err) {
                        console.log(err)
                    }
                })
            })
            // Attach edit click-handler
            $('.edt-btn').on('click', function () {
                let proID = $(this).parent().attr('data-product-id');
                let getProId = proInformation.find((item) => item.productId === proID);
                $('#proId').val(getProId.productId);
                $('#proTitle').val(getProId.title);
                $('#proDescription').val(getProId.description);
                $('#proPrice').val(getProId.price);
                $('#proInventory').val(getProId.inventory);
                $('#proImage').val(getProId.img);

                $(document).scrollTop();
            })

        }
    })
})
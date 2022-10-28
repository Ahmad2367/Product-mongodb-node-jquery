$(document).ready(function () {
    $('#btnUpdate').on('click', function () {
        // Todo: 
        //     1) Get product values(id, title, description, price, inventory and img) from form
        //     2) Send ajax PUT request
        //     3) If success show message "updated successfully" or show error message
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
                    return;
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


})

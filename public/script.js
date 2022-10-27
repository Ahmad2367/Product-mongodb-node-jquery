$(document).ready(function () {

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
                            <button type="button" class="btn btn-info">Edit</button>
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

            }
        })
    })


})






























// document.getElementById('probtn').addEventListener('click', addProduct_Tiles)

// function productValue(){
// let idValue = document.getElementById('idValue').value
// let tilValue = document.getElementById('tilValue').value
// let  desValue = document.getElementById('desValue').value
// let priceValue = document.getElementById('priceValue').value
// let imgValue = document.getElementById('imgValue').value

// const productObj = {
//     id:idValue,
//     title:tilValue,
//     description:desValue,
//     price:priceValue,
//     img:imgValue
// }
// return productObj
// }

// const objStructure = function HtmlStruct(productObj){
//     const divElement = document.createElement('div')
//     divElement.innerHTML = 
//     `
//     <p>${productObj.id}</p>
//     <h1>${productObj.title}</h1>
//     <p>${productObj.description}</p>
//     <p>${productObj.price}</p>
//     `
//     return divElement
// }


// function addProduct_Tiles(){
//     const Products = productValue()
//     const HtmlStruct = objStructure(Products)
//  document.getElementById('Products').append(HtmlStruct)
// }
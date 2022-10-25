$(document).ready(function () {
    $('#probtn').on('click', function () {
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

        $.ajax({
            type: 'GET',
            url: '/products',
            success: function (data) {
                console.log(data)
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
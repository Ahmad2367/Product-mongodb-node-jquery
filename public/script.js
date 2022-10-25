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
    })
    $('#fresh-btn').on('click', function () {
        $.ajax({
            type: 'GET',
            url: '/products',
            success: function (product) {
                for (let i = 0; i < product.length; i++) {
                    let array = product[i]
                    const imgTag = document.createElement('img')
                    imgTag.setAttribute('src', array.img)
                    const htmlStructure = function () {
                        const divElement = document.createElement('div')
                        divElement.innerHTML = `
                        <h1>${array.title}</h1>
                        <p>Price: ${array.price}</p>
                        <p>Description: ${array.description}</p>`
                        return divElement

                    }
                    const htmlAdd = htmlStructure(product)
                    document.getElementById('proArray').append(htmlAdd)
                    document.getElementById('proArray').appendChild(imgTag)

                }

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
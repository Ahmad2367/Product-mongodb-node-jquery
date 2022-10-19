var proArray = [];

function changeheadText(adminElementId, publicElementId) {
    const iTag = document.getElementById("input").value
    document.getElementById("hTag").innerHTML = iTag
}

function display() {
    var col = document.getElementById("favColor").value;
    document.getElementById("hTag").style.color = col;
}

function changeAlignment() {
    let text = document.getElementById("aligt").value
    document.getElementById("hTag").style.textAlign = text
}

function changeparaText() {
    const pText = document.getElementById("variation").value
    document.getElementById("pTag").innerHTML = pText
}

function pgraDisplay() {
    let chColor = document.getElementById("pc").value
    document.getElementById("pTag").style.color = chColor
}

function changeStyle() {
    let tSize = document.getElementById("fSize").value
    document.getElementById("pTag").style.fontSize = tSize
}

function siteColor() {
    let wColor = document.getElementById("webColor").value
    document.getElementById("bTag").style.backgroundColor = wColor
}





document.getElementById("btnProduct").addEventListener("click", product_click_handler);
// Event Handler 

// Helper function
// const productImg = function (productDetails) {
//     const createImg = document.createElement("img")
//     createImg.setAttribute("src", productDetails.image)
//     return createImg;
// }

const htmlStructure = function (productDetails) { // getHTML(products)
    const divElement = document.createElement("div")
    divElement.innerHTML = `
        <h1> ${productDetails.title}</h1>
        <p>Product Price: ${productDetails.price}</p>
        <p>Product Description: ${productDetails.description}</p>
        `;

    // divElement.prepend(productImg(productDetails))

    return divElement;
}

const getProduct = function () {
    const pTitle = document.getElementById("title").value;
    const pPrice = document.getElementById("price").value
    const pDescription = document.getElementById("description").value
    const pImage = document.getElementById("image").value

    const productDetails = {
        title: pTitle,
        price: pPrice,
        description: pDescription,
        image: pImage
    };

    return productDetails;
}

function product_click_handler(event) {
    event.preventDefault();

    const product = getProduct();
    const isValid = validateProductData(product);

    if (!isValid) {

        return;
    }

    proArray.push(product);
    localStorage.setItem("products", JSON.stringify(proArray));

    const htmlElementToAdd = htmlStructure(product);
    document.getElementById("products").append(htmlElementToAdd);
    // todo : clear form 
};

document.getElementById("btnClear").addEventListener("click", clear_form)

function clear_form(ev) {
    ev.preventDefault();
    localStorage.removeItem("products");
    document.getElementById("products").innerHTML = "";

}


function validateProductData(product) {
    let isValid = false;

    const isPriceValid = priceValidation(product.price);
    const isValidTitle = isNotEmpty(product.title, "textError", "Please Enter Valid Characters ");
    const isValidDescription = isNotEmpty(product.description, "desError", "Please Enter Valid Characters");

    if (isPriceValid && isValidTitle && isValidDescription) {
        isValid = true;
    }

    return isValid;
}

function priceValidation(price) {
    let isValid;

    const errorMsg = document.getElementById("error");
    if (isNaN(price)) {
        errorMsg.innerHTML = "<div style = 'color : red'>" + "Please Enter a Valid Number</div>";
        isValid = false;
    } else {
        errorMsg.innerHTML = '';
        isValid = true;
    }

    return isValid;
}



function isNotEmpty(text, errorMsgElementId, errorMsg) {
    let isValid;
    const errorMsgElement = document.getElementById(errorMsgElementId);

    if (text.length < 1) {
        errorMsgElement.innerHTML = "<div style = 'color : red'>" + errorMsg + "</div>";
        isValid = false;
    } else {
        errorMsgElement.innerHTML = '';
        isValid = true;
    }

    return isValid;
}

function init() {
    let productsKey = "products";
    let productsValue = localStorage.getItem(productsKey);
    // if (productsValue !== undefined && productsValue.length > 0) { // productValue = []
    if (productsValue && productsValue.length > 0) { // productValue = []
        let products = JSON.parse(localStorage.getItem(productsKey));

        for (let i = 0; i < products.length; i++) {
            let product = products[i];
            proArray.push(product);
            const htmlElementToAdd = htmlStructure(product);
            document.getElementById("products").append(htmlElementToAdd);
        }

    } else {
        return;
    }
}


init(); // initialize or start up or one time call only
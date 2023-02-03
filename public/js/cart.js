$(document).ready(function () {
    loadCart(); 
})

function loadCart(){
    $.ajax({
        type: 'GET',
        url: '/cart/get',
        headers: getHeaders(),
        success: function(response){
            if(response.success === true) {
            populateCart(response.data);
            }
            if(response.success === false) {
                document.getElementById('msg').innerHTML = "No cart Item added"
            }
        }

    })
}

function getHeaders() {
    let headersObj = {};
    if (localStorage.getItem('JWT-Token')) {
        headersObj = {
            'Authorization': 'Bearer ' + localStorage.getItem('JWT-Token')
        }
    }
    return headersObj;
}

function populateCart(cartObj){
    const cartArr = cartObj.products
    let totalAmount = cartObj.totalPrice
    console.log(cartArr)
    
    
    for(let i=0; i<cartArr.length; i++) {
        
        let cart = cartArr[i]
        const li = document.createElement('li')
    
         li.innerHTML = `
    
         <li class="cart_item clearfix">
         <div class="cart_item_image"><img height="140" width="140"  src=${cart.img} alt=""></div>
         <div class="cart_item_info d-flex flex-md-row flex-column justify-content-between">
             <div class="cart_item_name cart_info_col">
                 <div class="cart_item_title">Title</div>
                 <div class="cart_item_text">${cart.title}</div>
             </div>
             <div class="cart_item_quantity cart_info_col">
                 <div class="cart_item_title">Quantity</div>
                 <div class="cart_item_text">${cart.quantity}</div>
             </div>
             <div class="cart_item_price cart_info_col">
                 <div class="cart_item_title">Price</div>
                 <div class="cart_item_text">${cart.price}</div>
             </div>
             <div class="cart_item_total cart_info_col">
                 <div class="cart_item_title">Total</div>
                 <div class="cart_item_text">${cart.totalPrice}</div>
             </div>
         </div>
     </li>`;
            document.getElementById('cartList').append(li)
    
    }
    `
    <div class="order_total">
    <div class="order_total_content text-md-right">
        <div class="order_total_title">Order Total:</div>
        <div id="total" class="order_total_amount"></div>
    </div>
</div>`
    
    document.getElementById('total').append(totalAmount);   

}

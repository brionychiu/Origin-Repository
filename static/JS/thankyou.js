// get url order number //
let order_url = location.href;
let orderNumber = order_url.split("=")[1];

// initial load //
const alert_close_btn = document.querySelector(".alert_close_btn");
window.onload = function(){
    checkOrder(orderNumber);
    // show gif //
    document.querySelector(".giphy-embed").style.display = "grid";
    document.querySelector(".alert_box").style.display = "grid";
    document.querySelector(".alert_text").textContent = "訂購成功，歡迎繼續選購";
    document.querySelector(".alert_close_btn").addEventListener("click", close_alert , false);
}
async function checkOrder(){
    await checkUser();
    if (userstatus == null){
        window.location.href="/";
    }else{
        await fetchGetOrder(orderNumber);
    }
}

// Check the latest order - to render //
async function fetchGetOrder(orderNumber){
    const response = await fetch(`/api/order/${orderNumber}`, {
        method:'GET',
        headers: {
        'Content-Type':'application/json'
        }
    })
    const res = await response.json();
        if(res.data){
            // console.log(res.data);
            renderOrder(res.data);
        }else{
            alert(res.message);
        }  
}

// render thankyou.html // 
function renderOrder(result){
    const order_username = document.querySelector(".order-username");
    order_username.textContent = username;

    const order_number = document.querySelector(".order-number");
    order_number.textContent = result.number;

    const order_attr = document.querySelector(".order-attr");
    order_attr.textContent = result.trip.attraction.name;

    const order_date = document.querySelector(".order-date");
    order_date.textContent = result.trip.date;

    const order_time = document.querySelector(".order-time");
    const order_price = document.querySelector(".order-price");
    if (result.trip.time == "day"){
        order_time.textContent = "上午 9 點到下午 4 點"
        order_price.textContent = "新台幣 2000 元"
    }else{
        order_time.textContent = "下午 5 點到晚上 9 點"
        order_price.textContent = "新台幣 2500 元"
    }
    const order_address = document.querySelector(".order-address");
    order_address.textContent = result.trip.attraction.address;

    const order_image = document.querySelector(".order-image");
    order_image.src = result.trip.attraction.image;

    const contact_name = document.querySelector(".contact-name");
    contact_name.textContent = result.contact.name;

    const contact_mail = document.querySelector(".contact-mail");
    contact_mail.textContent = result.contact.email;

    const contact_phone = document.querySelector(".contact-phone");
    contact_phone.textContent = '0' + result.contact.phone;    
}

// click backintro_btn //
const backintro_btn = document.querySelector(".backintro_btn");
backintro_btn.addEventListener("click" ,() =>{
    window.location.href="/";
});

// click printorder_btn //
const printorder_btn = document.querySelector(".printorder_btn");
printorder_btn.addEventListener("click" ,() =>{
    window.print();
});

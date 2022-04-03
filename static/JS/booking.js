// initial load //
window.onload = function(){
    checkBooking();
}
async function checkBooking(){
    await checkUser();
    if (userstatus == null){
        window.location.href="/";
    }else{
        await fetchGetBooking();
    }
}

// Check the latest booking - to render //
async function fetchGetBooking(){
    const response = await fetch(`/api/booking`, {
        method:'GET',
        headers: {
        'Content-Type':'application/json'
        }
    })
    const res = await response.json();
        if(res.error){
            noOrder();
        }else{
            renderBooking(res.data);
        }  
}

// render booking.html // 
function renderBooking(result){
    // named DOM & put data in //
    const booking_username = document.querySelector(".booking-username");
    booking_username.textContent = username

    const booking_attr = document.querySelector(".booking-attr");
    booking_attr.textContent = result.attraction.name

    const booking_date = document.querySelector(".booking-date");
    booking_date.textContent = result.date

    const booking_time = document.querySelector(".booking-time");
    const booking_price = document.querySelector(".booking-price");
    const total_price = document.querySelector(".total-price");
    if (result.time == "day"){
        booking_time.textContent = "上午 9 點到下午 4 點"
        booking_price.textContent = "新台幣 2000 元"
        total_price.textContent = "新台幣 2000 元"
    }else{
        booking_time.textContent = "下午 5 點到晚上 9 點"
        booking_price.textContent = "新台幣 2500 元"
        total_price.textContent = "新台幣 2500 元"
    }
    const booking_address = document.querySelector(".booking-address");
    booking_address.textContent = result.attraction.address
    
    const booking_image = document.querySelector(".booking-image");
    booking_image.src = result.attraction.image;
}

// click delete_btn //
const delete_btn = document.querySelector(".delete_btn");
delete_btn.addEventListener("click" ,() =>{
    noOrder();
    fetch(`/api/booking`, {
        method:'DELETE',
        headers: {
        'Content-Type':'application/json'
      }
    })
    .then(res => {
        return res.json();   
    })
    .then(result => {
        window.alert("deleted!")
    })
})
function noOrder(){
    // render "no order" //
    const booking_1 = document.querySelector(".booking-1")
    const booking_username = document.querySelector(".booking-username");
    const main_cover = document.querySelector(".main_cover")
    booking_username.textContent = username
    const not_order = document.createElement('div');
    not_order.classList.add("no_order");
    not_order.textContent = "目前沒有任何待預定的行程"
    booking_1.appendChild(not_order);
    
    // clean booking-boxes details //
    document.querySelector(".booking-1-box").style.display = "none"
    document.querySelector(".booking-2").style.display = "none"
    document.querySelector(".booking-3").style.display = "none"
    document.querySelector(".booking-4").style.display = "none"
    document.querySelector("footer").classList.add("footer_cover");
    document.querySelector("main").classList.add("main_cover");
}

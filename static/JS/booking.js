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
// use -- api/orders POST //
let order_price;
let order_date;
let order_time;
let order_attr_id;
let order_attr_name;
let order_attr_address;
let order_attr_image;

// render booking.html // 
function renderBooking(result){
    document.querySelector("main").style.display = "grid";
    document.querySelector("footer").style.display = "grid";
    order_attr_id = result.attraction.id
    // named DOM & put data in //
    const booking_username = document.querySelector(".booking-username");
    booking_username.textContent = username

    const booking_attr = document.querySelector(".booking-attr");
    order_attr_name = result.attraction.name
    booking_attr.textContent = order_attr_name

    const booking_date = document.querySelector(".booking-date");
    order_date = result.date
    booking_date.textContent = order_date

    const booking_time = document.querySelector(".booking-time");
    const booking_price = document.querySelector(".booking-price");
    const total_price = document.querySelector(".total-price");
    if (result.time == "day"){
        order_price = 2000
        order_time = "day"
        booking_time.textContent = "上午 9 點到下午 4 點"
        booking_price.textContent = "新台幣 2000 元"
        total_price.textContent = "新台幣 2000 元"
    }else{
        order_price = 2500
        order_time = "night"
        booking_time.textContent = "下午 5 點到晚上 9 點"
        booking_price.textContent = "新台幣 2500 元"
        total_price.textContent = "新台幣 2500 元"
    }
    const booking_address = document.querySelector(".booking-address");
    order_attr_address = result.attraction.address
    booking_address.textContent = order_attr_address
    
    const booking_image = document.querySelector(".booking-image");
    order_attr_image = result.attraction.image;
    booking_image.src = order_attr_image;

    // render contact_name & mail //
    const contact_name = document.querySelector("#contact_name");
    contact_name.value = username;
    const contact_mail = document.querySelector("#contact_mail");
    contact_mail.value = usermail;
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
        if(result.ok){
            document.querySelector(".alert_box").style.display = "grid";
            document.querySelector(".alert_text").textContent = "訂單資料已刪除";
            alert_close_btn.addEventListener("click", close_alert , false);
        }
    })
})
function noOrder(){
    // clean booking-boxes details //
    document.querySelector(".booking-1-box").style.display = "none"
    document.querySelector(".booking-2").style.display = "none"
    document.querySelector(".booking-3").style.display = "none"
    document.querySelector(".booking-4").style.display = "none"
    document.querySelector("footer").setAttribute("class", "footer_cover");
    
    // render "no order" //
    document.querySelector("main").style.display = "grid";
    const main = document.querySelector("main")
    main.setAttribute("class", "main_cover");
    const booking_1 = document.querySelector(".booking-1")
    const booking_username = document.querySelector(".booking-username");

    booking_username.textContent = username
    const not_order = document.createElement('div');
    not_order.classList.add("no_order");
    not_order.textContent = "目前沒有任何待預定的行程"
    booking_1.appendChild(not_order);
    const main_cover = document.querySelector(".main_cover")
    main_cover.appendChild(booking_1);
    
}
// order phone_rules //
let phone_rules = /^09[0-9]{8}$/;


// TapPay //
// SetupSDK // 利用 TPDirect.setupSDK 設定參數
TPDirect.setupSDK(11327, 
    "app_whdEWBH8e8Lzy4N6BysVRRMILYORF6UxXbiOFsICkz0J9j1C0JUlCHv1tVJC"
    , 'sandbox')

// TPDirect.card.setup // 使用 TPDirect.card.setup 設定外觀
let fields = {
    number: {
        // css selector
        element: '#card-input',
        placeholder: '**** **** **** ****'
    },
    expirationDate: {
        // DOM object
        element: document.getElementById('expiration-input'),
        placeholder: 'MM / YY'
    },
    ccv: {
        element: '#CVV-input',
        placeholder: 'ccv'
    }
}
TPDirect.card.setup({
    // Display ccv field
    fields: fields,
    styles: {
        // Style all elements
        'input': {
            //我懷疑這裡沒屁用!
            'color': 'gray'
        },
        // Styling ccv field
        'input.ccv': {
            'font-size': '16px'
        },
        // Styling expiration-date field
        'input.expiration-date': {
            'font-size': '16px'
        },
        // Styling card-number field
        'input.card-number': {
            'font-size': '16px'
        },
        // style focus state
        ':focus': {
            'color': '#666666',
            //'border' : '2px solid black',
            //'background-color':'pink'
            // 這個東東是不是沒屁用啊!?
            
        },
        // style valid state
        '.valid': {
            'color': 'green',
        },
        // style invalid state
        '.invalid': {
            'color': 'red'
        },
        // Media queries
        // Note that these apply to the iframe, not the root window.
        '@media screen and (max-width: 400px)': {
            'input': {
                'color': 'orange'
            }
        }
    }
})
// other options --  //
TPDirect.card.onUpdate(function (update) {
    // update.canGetPrime === true
    // --> you can call TPDirect.card.getPrime()
    if (update.canGetPrime) {
        // Enable submit Button to get prime.
        // submitButton.removeAttribute('disabled')
    } else {
        // Disable submit Button to get prime.
        // submitButton.setAttribute('disabled', true)
    }

    // cardTypes = ['mastercard', 'visa', 'jcb', 'amex', 'unionpay','unknown']
    if (update.cardType === 'visa') {
        // Handle card type visa.
    }

    // number 欄位是錯誤的
    if (update.status.number === 2) {
        // setNumberFormGroupToError()
    } else if (update.status.number === 0) {
        // setNumberFormGroupToSuccess()
    } else {
        // setNumberFormGroupToNormal()
    }

    if (update.status.expiry === 2) {
        // setNumberFormGroupToError()
    } else if (update.status.expiry === 0) {
        // setNumberFormGroupToSuccess()
    } else {
        // setNumberFormGroupToNormal()
    }

    if (update.status.ccv === 2) {
        // setNumberFormGroupToError()
    } else if (update.status.ccv === 0) {
        // setNumberFormGroupToSuccess()
    } else {
        // setNumberFormGroupToNormal()
    }
})
let order_body;
// click submit --to pay btn //
const booking_btn = document.querySelector(".booking_btn")
booking_btn.addEventListener("click", onSubmit , false);
// Get Prime // 利用 TPDirect.card.getPrime 來取得 prime 字串
function onSubmit(event) {
    const contact_name = document.getElementById("contact_name").value
    const contact_mail = document.getElementById("contact_mail").value
    const contact_phone = document.getElementById("contact_phone").value
    // check input //
    if(!contact_name || !contact_mail || !contact_phone){
        document.querySelector(".alert_box").style.display = "grid";
        document.querySelector(".alert_text").textContent = "聯絡資料未完整填寫";
        alert_close_btn.addEventListener("click", close_alert , false);
        return;
    }
    // check mail valid //
    let order_mailOK = mail_rules.test(contact_mail);
    if(!order_mailOK){
        document.querySelector(".alert_box").style.display = "grid";
        document.querySelector(".alert_text").textContent = "郵件格式錯誤";
        alert_close_btn.addEventListener("click", close_alert , false);
        return;
    }
    // check phone valid //
    let order_phoneOK = phone_rules.test(contact_phone);
    if(!order_phoneOK){
        document.querySelector(".alert_box").style.display = "grid";
        document.querySelector(".alert_text").textContent = "手機格式錯誤";
        alert_close_btn.addEventListener("click", close_alert , false);
        return;
    }
    event.preventDefault();
    // 取得 TapPay Fields 的 status
    const tappayStatus = TPDirect.card.getTappayFieldsStatus()
    console.log(tappayStatus);
    // 確認是否可以 getPrime
    if (tappayStatus.canGetPrime === false) {
        document.querySelector(".alert_box").style.display = "grid";
        document.querySelector(".alert_text").textContent = "信用卡資料錯誤";
        alert_close_btn.addEventListener("click", close_alert , false);
        return;
    }

    // Get prime
    
    TPDirect.card.getPrime((result) => {
        if (result.status !== 0) {
            document.querySelector(".alert_box").style.display = "grid";
            document.querySelector(".alert_text").textContent = "訂購失敗，請重試";
            alert_close_btn.addEventListener("click", close_alert , false);
            console.log('get prime error ' + result.msg);
            return;
        }
        // console.log('get prime 成功，prime: ' + result.card.prime)
        order_body = {
            "prime": result.card.prime,
            "order": {
                "price": order_price,
                "trip": {
                    "attraction": {
                        "id": order_attr_id,
                        "name": order_attr_name,
                        "address": order_attr_address,
                        "image": order_attr_image
                    },
                    "date": order_date,
                    "time": order_time
                },
                "contact": {
                    "name": contact_name,
                    "email": contact_mail,
                    "phone":  Number(contact_phone) 
                }
            }
        }
        addOrders();

        // send prime to your server, to pay with Pay by Prime API .
        // Pay By Prime Docs: https://docs.tappaysdk.com/tutorial/zh/back.html#pay-by-prime-api
    })
}
// fetch /api/orders POST to add new order //
async function addOrders(){
    const response = await fetch(`/api/orders`,{
        method:'POST',
        headers: {
        'Content-Type':'application/json'
      },
        body: JSON.stringify(order_body),
      })
    const res = await response.json();
    if(res.error){
        console.log(res.message);
        location.reload();
    }else{
        // redirect
        window.location.href=`/thankyou?number=${res["data"]["number"]}`;
    }
}
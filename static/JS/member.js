//  name HTML DOM //
const user_name = document.querySelector(".user_name");
const user_mail = document.querySelector(".user_mail");
const user_password = document.querySelector(".user_password");
const order_number = document.querySelector(".order_number");
const attr_name = document.querySelector(".attr_name");
const order_date = document.querySelector(".order_date");
const order_time = document.querySelector(".order_time");
const contact_name = document.querySelector(".contact_name");
const contact_phone = document.querySelector(".contact_phone");

// initial load //
window.onload = function(){
    checkMember();
}
async function checkMember(){
    await checkUser();
    if (userstatus == null){
        window.location.href="/";
    }else{
        renderMember();
        await memberGetOrder();
    }
}

// render member.html -- member_top //
function renderMember(){
    user_name.textContent = username
    user_mail.textContent = usermail
}

// Check all orders //
async function memberGetOrder(){
    const response = await fetch(`/api/user/order`, {
        method:'GET',
        headers: {
        'Content-Type':'application/json'
        }
    })
    const res = await response.json(); 
    console.log(res)
    console.log(res.data.length);
    console.log(res.data[1])
    if(res.data.length == 0){
        document.querySelector(".member_bottom").innerHTML = "目前尚無訂單"
    }else{
        renderOrder(res.data);
    } 
}

// render member.html -- member_bottom // 
function renderOrder (result) {
    order_number.textContent = result[1].order_number
    attr_name.textContent = result[1].name
    order_date.textContent = result[1].order_date
    if(result[1].order_time == "day"){
        order_time.textContent = "上午 9 點到下午 4 點"
    }else{
        order_time.textContent = "下午 5 點到晚上 9 點"
    }
    contact_name.textContent = result[1].contact_name
    contact_phone.textContent = "0" + result[1].contact_phone
}
//  name HTML DOM //
const user_name = document.querySelector(".user_name");
const user_mail = document.querySelector(".user_mail");
const user_password = document.querySelector(".user_password");
const member_bottom = document.querySelector(".member_bottom");


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
    if(res.data.length == 0){
        document.querySelector(".member_bottom").innerHTML = "目前尚無訂單"
    }else{
        renderOrder(res.data,res.data.length);
    } 
}

// render member.html -- member_bottom // 
function renderOrder (res,length) {
    for(let i=0 ; i<length ; i++){
        const bar_1 = document.createElement('div');
        bar_1.classList.add("member_order_bar");
        bar_1.textContent = "訂單編號：";

        const order_number = document.createElement('span');
        order_number.classList.add("member_order_list");
        order_number.textContent = res[i].order_number;
        bar_1.appendChild(order_number);

        const bar_2 = document.createElement('div');
        bar_2.classList.add("member_order_bar");
        bar_2.textContent = "景點名稱：";

        const attr_name = document.createElement('span');
        attr_name.classList.add("member_order_list");
        attr_name.textContent = res[i].name;
        bar_2.appendChild(attr_name);

        const goto_attr_btn = document.createElement('a');
        goto_attr_btn.classList.add("goto_attr_btn");
        // goto_attr_btn.textContent = "點我查看景點資訊";
        goto_attr_btn.href = `/attraction/${res[i].attraction_id}`;
        bar_2.appendChild(goto_attr_btn);

        const bar_3 = document.createElement('div');
        bar_3.classList.add("member_order_bar");
        bar_3.textContent = "日期：";

        const order_date = document.createElement('span');
        order_date.classList.add("member_order_list");
        order_date.textContent = res[i].order_date;
        bar_3.appendChild(order_date);

        const bar_4 = document.createElement('div');
        bar_4.classList.add("member_order_bar");
        bar_4.textContent = "時間：";

        const order_time = document.createElement('span');
        order_time.classList.add("member_order_list");
        if(res[i].order_time == "day"){
            order_time.textContent = "上午 9 點到下午 4 點"
        }else{
            order_time.textContent = "下午 5 點到晚上 9 點"
        }
        bar_4.appendChild(order_time);

        const bar_5 = document.createElement('div');
        bar_5.classList.add("member_order_bar");
        bar_5.textContent = "聯絡人：";

        const contact_name = document.createElement('span');
        contact_name.classList.add("member_order_list");
        contact_name.textContent = res[i].contact_name;
        bar_5.appendChild(contact_name);
        
        const contact_phone = document.createElement('span');
        contact_phone.classList.add("member_order_list");
        contact_phone.classList.add("contact_phone");
        contact_phone.textContent = "0" + res[i].contact_phone;
        bar_5.appendChild(contact_phone);

        const member_order_box = document.createElement('div');
        member_order_box.classList.add("member_order_box");
        member_order_box.appendChild(bar_1);
        member_order_box.appendChild(bar_2);
        member_order_box.appendChild(bar_3);
        member_order_box.appendChild(bar_4);
        member_order_box.appendChild(bar_5);

        member_bottom.appendChild(member_order_box);
    }
}
// api member /  changeName / POST //
async function changeName(){
    const response = await fetch(`/api/user/changeName`, {
        method:'POST',
        body:JSON.stringify({"newname":new_username.value}),
        headers: {
        'Content-Type':'application/json'
        }
    })
    const res = await response.json(); 
    console.log(res)
    if(res.ok){
        console.log("ok")
    }else{
        console.log("error")
    }
}
// render changeName //
async function renderChangeName(){
    await changeName();
    checkUser();
    window.location.reload();
}
// click edit_btn //
const edit_btn = document.querySelector(".edit_btn");
const save_btn = document.querySelector(".save_btn");
const new_username = document.querySelector(".new_username");
edit_btn.addEventListener("click" ,() =>{
    user_name.style.display = "none"
    new_username.style.display = "inline-block"
    edit_btn.style.display = "none"
    save_btn.style.display = "block"
});

// click save_btn //
save_btn.addEventListener("click" ,() =>{
    if(new_username.value){
        renderChangeName();     
    }
    user_name.style.display = "inline-block"
    new_username.style.display = "none"
    edit_btn.style.display = "block"
    save_btn.style.display = "none"
    // clear data //
    new_username.value = ""
});


// click backintro_btn //
const backintro_btn = document.querySelector(".backintro_btn");
backintro_btn.addEventListener("click" ,() =>{
    window.location.href="/";
});
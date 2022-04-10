//  name HTML DOM //
const signin = document.querySelector(".signin");
const signout = document.querySelector(".signout");
const signin_box = document.querySelector(".signin_box");
const covering = document.querySelector(".covering");
const icon_close = document.querySelectorAll(".icon_close");
const change_signup = document.querySelector(".changeTo_signup");
const change_signin = document.querySelector(".changeTo_signin");
const signup_box = document.querySelector(".signup_box");
const signin_btn = document.querySelector(".signin_btn");
const signup_btn = document.querySelector(".signup_btn");
const error_signin = document.querySelector(".error_signin")
const repeat_signup = document.querySelector(".repeat_signup")
const success_signup = document.querySelector(".success_signup")
let username;
let usermail;
let userstatus;
let password;
let user_url=`/api/user`;

// render signin/out/up HTML //

// check user signin/out //
async function checkUser(){
    const response = await fetch(user_url,{
        method:'GET',
        headers: {
        'Content-Type':'application/json'
      }
      })
    const res = await response.json();
    if(res.data == null){
        signin.style.display = "block";
        userstatus = res.data;
    }else{
        signout.style.display = "block";
        username = res.data.name;
        userstatus = true
    }
}

// click nav 登入/註冊  //
signin.addEventListener("click", press_navSign , false);
function press_navSign () {
    signin_box.style.display = "grid";
    signup_box.style.display = "none";
    covering.style.display = "block";
    // clear signup error message //
    repeat_signup.innerHTML=" ";
    // clear signup successful message //
    success_signup.style.display = "none";
    // clear signup value //
    document.getElementsByName("username")[0].value="";
    document.getElementsByName("usermail")[1].value="";
    document.getElementsByName("password")[1].value="";
    // clear signin error message //
    error_signin.style.display = "none";
    // clear input value //
    document.getElementsByName("usermail")[0].value="";
    document.getElementsByName("password")[0].value="";
};

//  check mail_rules //
let mail_rules = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;   
function test_mail(usermail) {
      let mailOK = mail_rules.test(usermail);
      if (!mailOK){
        error_signin.style.display = "block";
        error_signin.innerHTML="郵件格式錯誤";
        repeat_signup.style.display = "block";
        success_signup.style.display = "none";
        repeat_signup.innerHTML="郵件格式錯誤";
      }
      else{
        return mailOK
      }
    }

//  check password_rules //
let password_rules =  /[^a-zA-Z0-9]/;   
function test_password(password) {
      let passwordOK = password_rules.test(password);
      if (passwordOK){
        error_signin.style.display = "block";
        error_signin.innerHTML="密碼不包含字符";
        repeat_signup.style.display = "block";
        success_signup.style.display = "none";
        repeat_signup.innerHTML="密碼不包含字符";
      }
      else{
        return !passwordOK
      }  
    }

// press signin_btn //
signin_btn.addEventListener("click" ,() =>{
    usermail = document.getElementsByName("usermail")[0].value;
    password = document.getElementsByName("password")[0].value;
    if(!usermail){
        error_signin.innerHTML="電子郵件未輸入"
        error_signin.style.display = "block";
        return;
    }
    else if(!password){
        error_signin.innerHTML="密碼未輸入"
        error_signin.style.display = "block";
        return;
    }
    // check mail_rules & password_rules //
    if(test_mail(usermail) && test_password(password)){
        error_signin.style.display = "none";
        // signin /api/user PATCH //
        fetch(user_url, {
            method:'PATCH',
            body:JSON.stringify({"email":usermail,
                                "password":password            
            }),
            headers: {
            'Content-Type':'application/json'
          }
        })
        .then(res => {
            return res.json();   
        })
        .then(result => { 
            if(result.ok == true){
                // clear input value //
                document.getElementsByName("usermail")[0].value="";
                document.getElementsByName("password")[0].value="";
                console.log("ok");
                signout.style.display = "block";
                signin.style.display = "none";
                window.location.reload();
    
            }else{
                error_signin.innerHTML="帳號或密碼錯誤"
                error_signin.style.display = "block";
            }
          })
    } 
});

//  還沒有帳戶？點此註冊_change to signup//
change_signup.addEventListener("click",() =>{
    signup_box.style.display = "grid";
    signin_box.style.display = "none";
    covering.style.display = "block";
    // clear signin/up error message //
    error_signin.style.display = "none";
    repeat_signup.style.display = "none";
    // clear input value //
    document.getElementsByName("usermail")[0].value="";
    document.getElementsByName("password")[0].value="";
});

// 已經有帳戶了？點此登入_change to signin //
change_signin.addEventListener("click",() =>{
    signup_box.style.display = "none";
    signin_box.style.display = "grid";
    covering.style.display = "block";
    // clear signup error message //
    repeat_signup.innerHTML=" ";
    // clear signup value //
    document.getElementsByName("username")[0].value="";
    document.getElementsByName("usermail")[1].value="";
    document.getElementsByName("password")[1].value="";
});

// press signup_btn //
signup_btn.addEventListener("click" ,() =>{
    username = document.getElementsByName("username")[0].value;
    usermail = document.getElementsByName("usermail")[1].value;
    password = document.getElementsByName("password")[1].value;
    if(!username){
        repeat_signup.style.display = "block";
        success_signup.style.display = "none";
        repeat_signup.innerHTML="姓名未輸入";
        return;
    }else if(!usermail){
        repeat_signup.style.display = "block";
        success_signup.style.display = "none";
        repeat_signup.innerHTML="電子郵件未輸入";
        return;
    }else if(!password){
        repeat_signup.style.display = "block";
        success_signup.style.display = "none";
        repeat_signup.innerHTML="密碼未輸入";
        return;
    }
    // check mail_rules & password_rules //
    if(test_mail(usermail) && test_password(password)){
            // signup /api/user POST //
    fetch(user_url, {
        method:'POST',
        body:JSON.stringify({"name":username,
                            "email":usermail,
                            "password":password            
        }),
        headers: {
        'Content-Type':'application/json'
      }
    })
    .then(res => {
        return res.json();   
    })
    .then(result => { 
        if(result.ok == true){
            success_signup.style.display = "block";
            repeat_signup.style.display = "none";
            signout.style.display = "block";
            signin.style.display = "none";
            // clear input value //
            document.getElementsByName("username")[0].value="";
            document.getElementsByName("usermail")[1].value="";
            document.getElementsByName("password")[1].value="";
        }else{
            success_signup.style.display = "none";
            repeat_signup.style.display = "block";
            repeat_signup.innerHTML="";
            repeat_signup.innerHTML="此電子郵件已重複註冊";
        }
      })
    }
});

//  press signout_btn //
signout.addEventListener("click" ,() =>{
    // signout.style.display = "none";
    signin.style.display = "block";
    //  signout /api/user DELETE //
    fetch(user_url, {
        method:'DELETE',
        headers: {
        'Content-Type':'application/json'
      }
    })
    .then(res => {
        return res.json();   
    })
    .then(result => { 
        console.log(result)
        if(result.ok == true){
            window.location.reload(); 
        }
      })
    
});

//  close_btn -- close box //
icon_close[0].addEventListener("click", close_box , false);
icon_close[1].addEventListener("click", close_box , false);

function close_box(){
    signin_box.style.display = "none";
    signup_box.style.display = "none";
    covering.style.display = "none";
};

// click nav_booking //
const nav_booking = document.querySelector(".nav_booking");
nav_booking.addEventListener("click" ,() =>{
    // if signin //
    if(userstatus != null){
        // window.location.assign("/booking");
        window.location.href="/booking";
    }else{
        // !signin //
        press_navSign();
    }
})

// press alert_close_btn (完成)//
const alert_close_btn = document.querySelector(".alert_close_btn");
alert_close_btn.addEventListener("click", close_alert , false);
function close_alert(){
    document.querySelector(".alert_box").style.display = "none";
    if(document.querySelector(".giphy-embed").style.display == "grid"){
        document.querySelector(".giphy-embed").style.display = "none";
    }
}

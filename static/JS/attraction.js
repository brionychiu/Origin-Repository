// get url id //
let url = location.href;
let id = url.split("attraction/")[1];

// initial load //
window.onload = function(){
    load(id);
}

// load page
function load(id){
    let url=`/api/attraction/${id}`;
    loadFetch(url);
  }
function loadFetch(url){
  fetch(url, {
    method:'GET',
    headers: {
    'Content-Type':'application/json'
  }
})
.then(res => {
    return res.json();   
})
.then(result => { 
    render(result);
    imagesRender(result);
    // console.log(result);
  })
}

//render 
function render(result){
    const title = document.querySelector(".title");
    let name = result.data.name;
    title.textContent = name;

    const title_info = document.querySelector(".title_info");
    let category = result.data.category;    
    let mrt = result.data.mrt;
    title_info.textContent = category +"  at  "+ mrt;
    
    const des = document.querySelector(".description");
    let description = result.data.description;
    des.textContent = description;

    const add = document.querySelector(".address"); 
    let address = result.data.address;
    add.textContent = address;

    const trans = document.querySelector(".trans");
    let transport = result.data.transport;
    trans.textContent = transport;
}

// select booking time & price //
if (document.querySelector('input[name="time"]')) {
    document.querySelectorAll('input[name="time"]').forEach((elem) => {
      elem.addEventListener("change", function(event) {
        let item = event.target.value;
        if(item == "night"){
            document.querySelector(".price").innerHTML="新台幣 2500 元";
        }else{
            document.querySelector(".price").innerHTML="新台幣 2000 元";
        };
      });
    });
  }

// images flow //
let image_number;
let images_all;
let length;
const left_btn = document.querySelector(".left_arrow");
const right_btn = document.querySelector(".right_arrow");
const images = document.querySelector(".images");
const black_dot = document.createElement("p");
const flow_dot = document.querySelector(".flow_dot");

function imagesRender(result){
    images_all = result.data.images;
    length = result.data.images.length;
    image_number=0;
    // console.log(length);

    //draw black dot //
    black_dot.classList.add("black_dot")
    flow_dot.appendChild(black_dot);
    
    //draw white dot //
    for(let i=0 ; i<length-1 ;i++){
        const white_dot = document.createElement("p");
        white_dot.classList.add("white_dot")
        flow_dot.appendChild(white_dot);
    }

    // initial load image [0]
    if(image_number == 0){
        images.src=images_all[0];
        left_btn.classList.add("fade");
        // console.log(image_number);
    }
}

// press turn left button (num-1) //
left_btn.addEventListener("click" ,() =>{
    if(0 < image_number){
        images.src=images_all[image_number-1];
        right_btn.classList.remove("fade");
        image_number-=1;

        // draw image flow //
        document.querySelector(".flow_dot").innerHTML="";
        for(let i=0 ; i<length-1 ;i++){
            const white_dot = document.createElement("p");
            white_dot.classList.add("white_dot")
            flow_dot.appendChild(white_dot);
            if(i==image_number-1){
                black_dot.classList.add("black_dot")
                flow_dot.appendChild(black_dot);
            }
        }
        // back to the first image //
        // remove left_btn till the first & add one black_dot //
        if(image_number == 0){
            left_btn.classList.add("fade");
            black_dot.classList.add("black_dot")
            flow_dot.prepend(black_dot);
        }
        // the first image//
    }else if(image_number == 0){
        images.src=images_all[image_number];  
    }

    // console.log(image_number);
    
  })

// press turn right button (num+1) //
right_btn.addEventListener("click" ,() =>{
    if(image_number<length-1){
        images.src=images_all[image_number+1];
        left_btn.classList.remove("fade");
        image_number+=1;

        // draw image flow //
        document.querySelector(".flow_dot").innerHTML="";
        for(let i=0 ; i<length-1 ;i++){
            const white_dot = document.createElement("p");
            white_dot.classList.add("white_dot")
            flow_dot.appendChild(white_dot);
            if(i==image_number-1){
                black_dot.classList.add("black_dot")
                flow_dot.appendChild(black_dot);
            }
        }

        //remove right_btn till the end//
        if(image_number == length-1){
            right_btn.classList.add("fade");
        }

        // the last image//
    }else if(image_number == length-1){
        images.src=images_all[image_number]; 
    }
    // console.log(image_number);
})
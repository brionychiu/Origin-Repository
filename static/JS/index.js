let nextPage;
let keyword_value;
let pending;

// initial load //
window.onload=function(){
  load('0');
  // 設定觀察對象：告訴 observer 要觀察哪個目標元素
  const footer = document.querySelector("footer");

  // 響鈴條件：設定和控制在哪些情況下，呼叫 callback 函式
  const options = {
    root: null,
    rootMargin: "0px",
    threshold: 0.5,
  };
  // 製作鈴鐺：建立一個 intersection observer，帶入相關設定資訊
  let observer = new IntersectionObserver(loadMore, options);
  observer.observe(footer);
  // initial load -- check user/api GET //
  checkUser();
}

// load all attrs page // 

function load(page){
    let url=`/api/attractions?page=${page}`;
    loadFetch(url);
  }
function loadFetch(url){
  pending=true;
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
    appendContent(result);
    nextPage = result.nextPage;
    // console.log(nextPage)
  })
}

// load attr keyword page //

const keyword_btn = document.querySelector(".srh_attr_btn")
keyword_btn.addEventListener("click" ,() =>{
  keyword_value=document.getElementById("keyword_value").value;
  let url=`http://54.198.160.161:3000/api/attractions?page=0&keyword=${keyword_value}`;
  document.querySelector("main").innerHTML="";
  keywordFetch(url);
})
function keywordFetch(url){
  pending=true;
  fetch(url, {method:'GET',
  headers: {
  'Content-Type':'application/json'
}
})
.then(res => {
  return res.json();   
})
.then(result => { 
  // console.log(result)
  if(result.data.length == 0){
    document.querySelector("main").innerHTML="";
    document.querySelector("main").innerHTML="請搜尋其他關鍵字哦";
  }
  nextPage = result.nextPage;
  appendContent(result);

})
}
// routine load //

function appendContent(result){
    try{
      for(let i=0;i<result.data.length;i++){
        let image = result.data[i].images[0]
        let name = result.data[i].name
        let mrt = result.data[i].mrt
        let category = result.data[i].category
         const main = document.querySelector("main");
          main.classList.add("main");
          const all_items = document.createElement("a");
          all_items.classList.add("attrs_all")
          main.prepend(all_items);
    
          const attra_img = document.createElement('img');
          attra_img.src =image;
          attra_img.classList.add("img");
          all_items.appendChild(attra_img);
    
          const attra_name = document.createElement('div');
          attra_name.classList.add("attra_name");
          attra_name.textContent = name;
          all_items.appendChild(attra_name);
          
          const attra_detail = document.createElement('div');
          attra_detail.classList.add("attra_det");
    
          const attra_mrt = document.createElement('div');
          attra_mrt.classList.add("mrt");
          attra_mrt.textContent = mrt;
          attra_detail.appendChild(attra_mrt);
    
          const attra_cat = document.createElement('div');
          attra_cat.classList.add("category");
          attra_cat.textContent = category;
          attra_detail.appendChild(attra_cat);
    
          all_items.appendChild(attra_detail);
          all_items.href = `/attraction/${result.data[i].id}`;
          main.appendChild(all_items);
        }
      pending=false;
    }
    catch(error){
      console.log("bad request")
    }
};  

// load more //

function loadMore(){
  if(nextPage == null || nextPage=="null"){
    return;
  }
  if (keyword_value && pending==false){
      let url=`http://54.198.160.161:3000/api/attractions?page=${nextPage}&keyword=${keyword_value}`;
      keywordFetch(url);
    }else if(nextPage && pending==false){
      let url=`http://54.198.160.161:3000/api/attractions?page=${nextPage}`;
      // console.log(pending);
      loadFetch(url);
    }
    // console.log("loadMore");
    // console.log(nextPage);

}







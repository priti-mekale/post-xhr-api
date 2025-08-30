const cl= console.log
const blogsContainer=document.getElementById('blogsContainer');
const blogform=document.getElementById('blogform');
const titleControl=document.getElementById('title');
const bodyControl=document.getElementById('body');
const userIdControl=document.getElementById('userId');






//1) XHR instance
let BASE_URL='https://jsonplaceholder.typicode.com';
// let POSTS_URL=BASE_URL+'/posts';
let POSTS_URL=`${BASE_URL}/posts`;





const tenaplting= (blogsArr)=>{
    let result=''
    blogsArr.forEach(blog => {
        result+=`<div class="col-md-4 mb-4">
        <div class="card h-100" id="${blog.id}">
        <div class="card-header">
        <h3 class="m-0" data-toggle="tooltip" title="Blog title">${blog.title}</h3>
        </div>
        <div class="card-body">
        <p class="m-0" data-toggle="tooltip" title="Blog content">${blog.body}</p>
        </div>
        <div class="card-footer d-flex justify-content-between">
        <button class="btn btn-sm btn-outline-primary">Edit</button>
        <button class="btn btn-sm btn-outline-danger">Delete</button>
        </div>
        </div>
        </div>`
    });
    blogsContainer.innerHTML=result;
   
      $('[data-toggle="tooltip"]').tooltip();

}

$('[data-toggle="tooltip"]').tooltip();
//templateing (blogsArr)




 const fetchPosts=()=> {
    let xhr=new XMLHttpRequest(); 
//post ,patch,put,delete,get

//2) Configure API >>open method
xhr.open('GET',POSTS_URL,true);
//3) send the request
xhr.send();//null
//4) onload
xhr.onload=function(){
    // cl(xhr.status);
    // cl(xhr.response)
    //if api call is success then templeting
    if(xhr.status===200 && xhr.status<=299){
        //templateing
        let data=JSON.parse(xhr.response);//reverse() array 
        cl(data);
        // cl(xhr.response)
        tenaplting(data);


}
    else{
        // cl(`Error Occured ${xhr.status} : ${xhr.statusText}`);
        console.error(`Error Occured ${xhr.status} : ${xhr.statusText}`)

    }
 }
 xhr.onerror=()=>{
    console.error(`Network Error`);
 }
}
fetchPosts();



const onPostSubmit=(eve)=>{
    eve.preventDefault();
    let blogOBJ={
        title:titleControl.value,
        body:bodyControl.value,
        userId:userIdControl.value
    }
    cl(blogOBJ);
    //api call for post method 

    let xhr=new XMLHttpRequest();
    xhr.open('POST',POSTS_URL,true);
    xhr.send(JSON.stringify(blogOBJ));// converting js object into json object 
    xhr.onload=()=>{
        if(xhr.status>=200 && xhr.status<=299){
            blogform.reset()
            cl(xhr.responseText);//response or responseText it returns same (eg. id)
             let res=JSON.parse(xhr.response);//json to parse
             cl(res);

            let col=document.createElement('div');
            col.className='col-md-4 mb-4';
            col.innerHTML=`<div class="card h-100" id="${res.id}">
        <div class="card-header">
        <h3 class="m-0" data-toggle="tooltip" title="Blog title">${blogOBJ.title}</h3>
        </div>
        <div class="card-body">
        <p class="m-0" data-toggle="tooltip" title="Blog content">${blogOBJ.body}</p>
        </div>
        <div class="card-footer d-flex justify-content-between">
        <button class="btn btn-sm btn-outline-primary ">Edit</button>
        <button class="btn btn-sm btn-outline-danger ">Delete</button>
        </div>
        </div>`
        blogsContainer.append(col)

        }
        else{
            console.error(`Error Occured ${xhr.status} : ${xhr.statusText}`)
        }
    }

}










blogform.addEventListener('submit',onPostSubmit)
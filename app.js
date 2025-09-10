let cl = console.log;

const postsForm = document.getElementById("postsForm");
const titlecontrol = document.getElementById("title");
const contentcontrol = document.getElementById("content");
const UserIDcontrol = document.getElementById("UserID");
const postscontainer = document.getElementById("postscontainer");
const UpdatePostBtn = document.getElementById("UpdatePostBtn");
const AddPostBtn = document.getElementById("AddPostBtn");
const spiner =  document.getElementById("spiner")


const snakbar =(masg,icon)=>{
  swal.fire({
    title:masg,
    icon:icon,
    timer:2000
  })
}

let base_url = "https://jsonplaceholder.typicode.com";
let post_url = `${base_url}/posts`;

const fatchdata=()=>{
  
let xhr = new XMLHttpRequest();
spiner.classList.remove("d-none")
xhr.open("GET", post_url, true);

xhr.send(null);

xhr.onload = () => {
  if (xhr.status >= 200 && xhr.status <= 299) {
    spiner.classList.add("d-none")
    let data = JSON.parse(xhr.response);
    cl(data);
    templating(data);
  } else {
snakbar("data not fetch","error")
}
};
xhr.onerror = () => {
  spiner.classList.add("d-none")
  snakbar("Network Error! Please check your connection.", "error")
};
}
fatchdata()

const templating = (ele) => {
  let  result = "";

  ele.forEach((po) => {
    result += ` <div class="col-md-4 mb-5">
        <div class="card h-100"  id="${po.id}">
          <div class="card-header  bg-primary text-white">
            <h2 title="${po.title}">${po.title}</h2>
          </div>
          <div class="card-body">
            <p>${po.body}</p>
          </div>
          <div class="card-footer">
            <button onclick="onEdit(this)" class="btn btn-success">Edit</button>
            <button onclick="onRemove(this)" class="btn btn-danger">Remove</button>

          </div>
        </div>
      </div>`;
  });

  postscontainer.innerHTML = result;
};

const onPostAdd = (eve) => {
  eve.preventDefault();

  let Post_obj = {
    title: titlecontrol.value,
    body: contentcontrol.value,
    userId: UserIDcontrol.value,
  };

  let xhr = new XMLHttpRequest();

  xhr.open("POST", post_url, true);
    xhr.setRequestHeader("Authorization", "Bearer YOUR_TOKEN_HERE");
  xhr.setRequestHeader("Content-Type", "application/json");

  xhr.send(JSON.stringify(Post_obj));

  xhr.onload = () => {
    if (xhr.status >= 200 && xhr.status <= 299) {
      let userId = JSON.parse(xhr.response);
      let col = document.createElement("div");
      col.classList = `col-md-4 mb-5`; 
      col.innerHTML = `
             <div class="card h-100" id="${userId.id}">
          <div class="card-header  bg-primary text-white">
            <h2>${Post_obj.title}</h2>
          </div>
          <div class="card-body">
            <p>${Post_obj.body}</p>
          </div>
          <div class="card-footer">
            <button onclick="onEdit(this)" class="btn btn-success">Edit</button>
            <button onclick="onRemove(this)" class="btn btn-danger">Remove</button>

          </div>
        </div>
            `;
      postsForm.reset();
      postscontainer.prepend(col);
    snakbar("Post added successfully","success")

      cl(col);
    } else {
    snakbar("Post not added","error")
    }

  };
  xhr.onerror = () => {
  snakbar("Failed to add post! Please try again.", "error")
};
};

const onEdit = (ele) => {
  spiner.classList.remove("d-none")
  let Edit_id = ele.closest(".card").id;
  cl(Edit_id);
  let Edit_url = `${base_url}/posts/${Edit_id}`;
  cl(Edit_url);
  localStorage.setItem("Edit_id", Edit_id);

  let xhr = new XMLHttpRequest();

  xhr.open("GET", Edit_url, true);

  xhr.send(null);

  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status <= 299) {
        spiner.classList.add("d-none")

      let data = JSON.parse(xhr.response);
      cl(data);
      titlecontrol.value = data.title;
      contentcontrol.value = data.body;
      UserIDcontrol.value = data.userId;

      AddPostBtn.classList.add("d-none");
      UpdatePostBtn.classList.remove("d-none");
    } else {
   snakbar("Failed to fetch post for editing", "error");

    }
  };
    xhr.onerror = () => {
  spiner.classList.add("d-none")
  snakbar("Update failed! Check your connection.", "error")
};
};

const onPostUpdate = (ele) => {
          spiner.classList.remove("d-none")
  let Updated_id = localStorage.getItem("Edit_id");
  cl(Updated_id);

  let Updated_url = `${base_url}/posts/${Updated_id}`;
  cl(Updated_url);

  let Updated_obj = {
    title: titlecontrol.value,
    body: contentcontrol.value,
    userId: UserIDcontrol.value,
  };

  let xhr = new XMLHttpRequest();
  xhr.open("PATCH", Updated_url, true);
  xhr.setRequestHeader("Authorization", "Bearer YOUR_TOKEN_HERE");
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(JSON.stringify(Updated_obj));

  xhr.onload = () => {
    if (xhr.status >= 200 && xhr.status <= 299) {
              spiner.classList.add("d-none")
      let data = JSON.parse(xhr.response);
      cl(data);

      let card = document.getElementById(Updated_id).children;

      card[0].innerHTML = `<h2>${Updated_obj.title}</h2>`;
      card[1].innerHTML = ` <p>${Updated_obj.body}</p>`;
      AddPostBtn.classList.remove("d-none");
      UpdatePostBtn.classList.add("d-none");
      postsForm.reset();
          snakbar("Post is updated successfully","success")
          localStorage.removeItem("Edit_id");
    } else {
    snakbar("Post is not updated","error")
    }
  };

  xhr.onerror = () => {
  spiner.classList.add("d-none")
  snakbar("Update failed! Check your connection.", "error")
};
};

const onRemove = (ele) => {
  Swal.fire({
  title: "Are you sure?",
  text: "You won't Remove this post!",
  icon: "warning",
  showCancelButton: true,
  confirmButtonColor: "#3085d6",
  cancelButtonColor: "#d33",
  confirmButtonText: "Yes, delete it!"
}).then((result) => {
  
  if (result.isConfirmed) {
spiner.classList.remove("d-none")
    let Remove_id = ele.closest(".card").id;

    let Remove_url = `${base_url}/posts/${Remove_id}`;

    let xhr = new XMLHttpRequest();

    xhr.open("DELETE", Remove_url, true);

    xhr.send(null);

    xhr.onload = function () {
      spiner.classList.add("d-none")
      if (xhr.status >= 200 && xhr.status <= 299) {
        ele.closest(".col-md-4").remove()
        snakbar("The Post is Removed Successfully","success")

    }else{
    cl("Error")
  }
  }
  xhr.onerror =function (){
    spiner.classList.add("d-none")
    snakbar("Network Error","error")
  }
}
})
}

postsForm.addEventListener("submit", onPostAdd);
UpdatePostBtn.addEventListener("click", onPostUpdate);





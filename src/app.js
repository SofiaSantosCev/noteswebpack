import "jquery";

const URL = "http://127.0.0.1/back-noteswebpack/public/index.php/api/";

var notes = [];
var categories = [];
var idNoteSelected = null;
var selectedIndex = 0;
var filterNotes = [];

var inputTitle = document.getElementById("inputTitle");
var inputContent = document.getElementById("content");
var selectCat = document.getElementById("categoriesSelect");
var categoriesList = document.getElementById("categoriesList");
var selectCatList = document.getElementById("selectCatList");
var catList = document.getElementById("catList");
var user = document.getElementById("user");
var newNoteBtn = document.getElementById("newNoteBtn");
var boldBtn = document.getElementById("boldBtn");
var notesList = document.getElementById("notesList");
var date = document.getElementById("date");
var noteItem = document.getElementsByClassName("listItem");

$(document).ready(function () {
  var email = localStorage.getItem("user");
  user.innerHTML = email;
  getNotes();
  getCategories();
});

window.onclick = function (event) {
  if (!event.target.matches(".dropbtn")) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains("show")) {
        openDropdown.classList.remove("show");
      }
    }
  }
};

function autosave() {
  $("#content").everyTime("300000", function () {
    let title = $("inputTitle");
    let content = $("content");
    let select = $("selectCat");

    $.ajax({
      type: "POST",
      url: URL + "note",
      headers: {
        Authorization: localStorage.getItem("token"),
      },
      data: {
        title: title,
        content: content,
        category_id: select.options[selectCat.selectedIndex].value,
      },
      success: function (response) {},
      error: function (error) {
        console.length(error);
        console.length("error autosave");
      },
    });
  });
}

function logOut() {
  localStorage.removeItem("token");
  window.location.href = "index.html";
}

// Boolean showing paper dropdown
function showMenu() {
  document.getElementById("myDropdown").classList.toggle("show");
}

//Boolean showing individual dropdowns from the list
function showMenuList(id) {
  document.getElementById(id).classList.toggle("show");
}

// Function triggered when select category changes
function selectVal() {
  selectedIndex = selectCatList.value;
  filter(notes);
}

// GET NOTES
const getNotes = () => {
  console.log("GET Notes");
  let user = localStorage.getItem("token");
  console.log("user" + user);

  $.ajax({
    url: URL + "note",
    type: "GET",
    headers: {
      Authorization: localStorage.getItem("token"),
    },
    success: function (response) {
      let notes = response["notes"];
      showNotes(notes);
    },
    error: function () {
      console.log("Error getting notes");
    },
  });
};

function filter(notes) {
  notesList.innerHTML = "";
  if (selectCatList.value == 0) {
    filterNotes = notes;
  } else {
    filterNotes = notes.filter(
      (note) => note["category_id"] == selectCatList.value
    );
  }
  showNotes(filterNotes);
}

const showNotes = (notes) => {
  for (let i = 0; i < notes.length; i++) {
    let listItem = document.createElement("li");
    listItem.innerHTML =
      "<a class='listItem' onclick='selectNote(" +
      i +
      ")'><p class='noteName'>" +
      notes[i]["title"] +
      "</p></a>";
    notesList.appendChild(listItem);
  }
};

const postOrPut = (id) => {
  if (id == null) {
    storeNote();
  } else {
    updateNote(id);
  }
};

// PUT /notes/id
const updateNote = (id) => {
  $.ajax({
    type: "PUT",
    url: URL + "note/" + id,
    data: {
      title: inputTitle.value,
      content: inputContent.value,
      category_id: selectCat.value,
    },
    success: function (responseData) {
      location.reload();
    },
    error: function (err) {
      console.log(err);
    },
  });
};

// POST /notes
const storeNote = () => {
  console.log("POST Notes");
  $.ajax({
    type: "POST",
    url: URL + "note",
    data: {
      title: inputTitle.value,
      content: inputContent.value,
      category_id: selectCat.options[selectCat.selectedIndex].value,
    },
    headers: {
      Authorization: token,
    },
    success: function (responseData) {
      console.log(responseData);
      location.reload();
    },
    error: function (err) {
      console.log(err);
    },
  });
};

// DELETE /notes
function deleteNote(id) {
  $.ajax({
    type: "DELETE",
    url: URL + "note/" + id,
    headers: {
      Authorization: localStorage.getItem("token"),
    },
    success: function (responseData) {
      console.log(responseData);
      location.reload();
    },
    error: function (err) {
      console.log(err);
    },
  });
}

// Shows selected notes from the list in the paper
const selectNote = (index) => {
  inputTitle.value = notes[index]["title"];
  inputContent.value = notes[index]["content"];
  idNoteSelected = notes[index]["id"];
  date.innerHTML = notes[index]["updated_at"];
  selectCat.value = notes[index]["category_id"];
  console.log("259 id note selected: " + idNoteSelected);
};

newNoteBtn.addEventListener("click", () => {
  inputTitle.value = "";
  inputContent.value = "";
});

// CRUD CATEGORIES
const getCategories = () => {
  console.log("GET Categories");
  $.ajax({
    type: "GET",
    url: URL + "category",
    headers: {
      Authorization: localStorage.getItem("token"),
    },
    success: function (responseData) {
      categories = responseData["title"];
      showCategories(categories, responseData["IDs"]);
    },
    error(err) {
      console.log(err);
    },
  });
};

const addCat = () => {
  element = document.createElement("li");
  element.innerHTML =
    '<input type="text" class="inputNewCategory" onkeydown="search(this)"/>';
  input = element.innerHTML;
  catList.append(element);
};

const modifyCat = (index, id) => {
  element = document.createElement("li");
  element.innerHTML =
    '<input type="text" class="inputNewCategory" onkeydown="searchModify(this, ' +
    id +
    ')" value=' +
    categories[index] +
    "/>";
  console.log(categories);
  input = element.innerHTML;
  catList.append(element);
};

// PUT /category/id
const updateCat = (title, id) => {
  $.ajax({
    type: "PUT",
    url: URL + "category/" + id,
    headers: { Authorization: localStorage.getItem("token") },
    data: {
      title: title,
    },
    headers: {
      Authorization: token,
    },
    success: function (responseData) {
      location.reload();
    },
    error: function (err) {
      console.log(err);
    },
  });
};

function search(input) {
  if (event.key === "Enter") {
    storeCategory(input.value);
  }
}

function searchModify(input, id) {
  if (event.key === "Enter") {
    updateCat(input.value, id);
  }
}

// POST /category/id
const storeCategory = (title) => {
  $.ajax({
    type: "POST",
    url: URL + "category",
    data: {
      title: title,
    },
    success: function (responseData) {
      console.log(responseData);
      location.reload();
    },
    error: function (err) {
      console.log(err);
    },
  });
};

const showCategories = (categories, ids) => {
  console.log("categories: " + categories);
  for (let i = 0; i < categories.length; i++) {
    let item = document.createElement("option");
    item.setAttribute("value", ids[i]);
    item.innerHTML = categories[i];
    selectCat.appendChild(item);
  }

  for (let i = 0; i < ids.length; i++) {
    let listItem = document.createElement("li");
    listItem.innerHTML =
      "<a class='listItem'><p class='catTitle'>" + categories[i] + "</p></a>";
    categoriesList.appendChild(listItem);
  }
};

// DELETE /category
const deleteCategory = (id) => {
  $.ajax({
    url: URL + "category/" + id,
    type: "DELETE",
    success: function (response) {
      console.log(response);
      location.reload();
    },
    error: function (err) {
      console.log("Error while deleting" + id + err);
    },
  });
};

function bold() {
  var focusText = window.getSelection().getRangeAt(0).getClientRects();
  console.log(focusText);
}

boldBtn.addEventListener("click", bold);

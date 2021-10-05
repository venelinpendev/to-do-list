// Initial set up for all Add buttons
var listAddButtons = document.getElementsByClassName("insertNewButton");
for (var i = 0; i < listAddButtons.length; i++) {
  listAddButtons[i].onclick = function() {

    var li = document.createElement("li");
    li.className = "list_item";

    var checkmark = document.createElement("span");
    checkmark.className = "checkmark";
    checkmark.onclick = function() {
      for (var child = this.firstChild; child != null; child = child.nextElementSibling) {
        child.style.borderColor = "green";
      }
    }

    var circle = document.createElement("span");
    circle.className = "circle";
    checkmark.appendChild(circle);

    var tick = document.createElement("span");
    tick.className = "tick";
    checkmark.appendChild(tick);

    li.appendChild(checkmark);

    var label = document.createElement("label");
    label.innerHTML = document.getElementsByClassName("newItemInput")[0].value;
    label.className = "todoItemLabel";
    li.appendChild(label);
    document.getElementsByClassName("newItemInput")[0].value = "";

    // by default hidden at first bcs its = 0
    var quantity = document.createElement("input");
    quantity.type = "number";
    quantity.style.display = "none";
    li.appendChild(quantity);

    var editButton = document.createElement("input");
    editButton.type = "button";
    editButton.value = "Edit";
    editButton.onclick = function() {
      var quantity = this.previousElementSibling;
      var label = quantity.previousElementSibling;
      var tick = label.previousElementSibling;

      if (label.style.display == "none") {
        label.style.display = "inline";

        textBox = label.previousElementSibling;
        label.innerHTML = textBox.value;
        textBox.remove();

        if (quantity.value == 0) {
          quantity.style.display = "none";
        }
        quantity.setAttribute("readonly", "true");
      }
      else {
        label.style.display = "none";

        textBox = document.createElement("input");
        textBox.type = "input";
        textBox.className = "newItemInput";
        textBox.value = label.innerHTML;

        label.parentNode.insertBefore(textBox, label);

        quantity.style.display = "inline";
        quantity.removeAttribute("readonly");
      }
    }
    li.appendChild(editButton);

    var deleteButton = document.createElement("SPAN");
    var txt = document.createTextNode("\u00D7");
    deleteButton.className = "close";
    deleteButton.appendChild(txt);
    deleteButton.onclick = function() {
      var div = this.parentElement;
      div.style.display = "none";
    }

    li.appendChild(deleteButton);
    var list = this.parentNode.parentNode;

    list.appendChild(li);
  }
}

function createNewList() {
  var ul = document.createElement("ul");
  ul.className = "list";

  // collapseButton
  collapseButton = document.createElement("span");
  collapseButton.className = "arrow";
  collapseButton.onclick = function() {
    var element;
    for (element = this.parentNode.nextElementSibling; element != null; element = element.nextElementSibling) {
      if (element.style.display != "none") {
        element.style.display = "none";
        collapseButton.style.transform = "rotate(-45deg)";
      }
      else {
        element.style.display="block";
        collapseButton.style.transform = "rotate(45deg)";
      }
    }
  }
  ul.appendChild(collapseButton);

  // label for the new list
  var label = document.createElement("label");
  label.innerHTML = document.getElementsByClassName("newListInput")[0].value;
  label.className = "list_title_label";
  ul.appendChild(label);
  document.getElementsByClassName("newListInput")[0].value = "";

  // add delete button for the list
  var deleteButton = document.createElement("span");
  var txt = document.createTextNode("\u00D7");
  deleteButton.className = "close";
  deleteButton.appendChild(txt);
  deleteButton.onclick = function() {
    var div = this.parentElement;
    div.style.display = "none";
  }
  ul.appendChild(deleteButton);

  var li = document.createElement("li");
  li.className = "list_item";

  var input = document.createElement("input");
  input.type = "text";
  input.className = "newItemInput";
  li.appendChild(input);

  var button = document.createElement("input");
  button.type = "button";
  button.className = "insertNewButton";
  button.value = "Add";
  button.onclick = function() {

    var li = document.createElement("li");
    li.className = "list_item";

    var checkmark = document.createElement("span");
    checkmark.className = "checkmark";
    checkmark.onclick = function() {
      for (var child = this.firstChild; child != null; child = child.nextElementSibling) {
        child.style.borderColor = "green";
      }
    }
    var circle = document.createElement("span");
    circle.className = "circle";
    checkmark.appendChild(circle);

    var tick = document.createElement("span");
    tick.className = "tick";
    checkmark.appendChild(tick);

    li.appendChild(checkmark);

    // label for the new item
    var label = document.createElement("label");
    label.innerHTML = this.previousElementSibling.value;
    label.className = "todoItemLabel";
    li.appendChild(label);
    this.previousElementSibling.value = "";

    var quantity = document.createElement("input");
    quantity.type = "number";
    quantity.style.display = "none";
    li.appendChild(quantity);

    var editButton = document.createElement("input");
    editButton.type = "button";
    editButton.value = "Edit";
    editButton.onclick = function() {
      var quantity = this.previousElementSibling;
      var label = quantity.previousElementSibling;
      var tick = label.previousElementSibling;

      if (label.style.display == "none") {
        label.style.display = "inline";

        textBox = label.previousElementSibling;
        label.innerHTML = textBox.value;
        textBox.remove();

        if (quantity.value == 0) {
          quantity.style.display = "none";
        }
        quantity.setAttribute("readonly", "true");
      }
      else {
        label.style.display = "none";

        textBox = document.createElement("input");
        textBox.type = "input";
        textBox.className = "newItemInput";
        textBox.value = label.innerHTML;

        label.parentNode.insertBefore(textBox, label);

        quantity.style.display = "inline";
        quantity.removeAttribute("readonly");
      }
    }
    li.appendChild(editButton);

    var deleteButton = document.createElement("SPAN");
    var txt = document.createTextNode("\u00D7");
    deleteButton.className = "close";
    deleteButton.appendChild(txt);
    deleteButton.onclick = function() {
      var div = this.parentElement;
      div.style.display = "none";
    }

    li.appendChild(deleteButton);
    var list = this.parentNode.parentNode;

    list.appendChild(li);
  }

  li.appendChild(button);

  ul.appendChild(li)

  document.getElementsByClassName("list")[0].parentNode.appendChild(ul);
}

// Initial list item setup
var myNodelist = document.getElementsByClassName("list_item");
var i;
for (i = 1; i < myNodelist.length; i++) {
  // make the items tickable
  var checkmark = myNodelist[i].children[0];
  checkmark.onclick = function() {
    for (var child = 0; child < this.children.length; child++) {
      this.children[child].style.borderColor = "green";
    }
  }

  // make all quantities invisible (bcs 0 by default)
  var quantity = myNodelist[i].children[2];
  quantity.style.display = "none";

  // add edit button
  var editButton = document.createElement("input");
  editButton.type = "button";
  editButton.value = "Edit";
  editButton.onclick = function() {
    var quantity = this.previousElementSibling;
    var label = quantity.previousElementSibling;
    var tick = label.previousElementSibling;

    // if in editing mode
    if (label.style.display == "none") {
      label.style.display = "inline";

      textBox = label.previousElementSibling;
      label.innerHTML = textBox.value;
      textBox.remove();

      if (quantity.value == 0) {
        quantity.style.display = "none";
      }
      quantity.setAttribute("readonly", "true");
    }
    else {
      label.style.display = "none";

      textBox = document.createElement("input");
      textBox.type = "input";
      textBox.className = "newItemInput";
      textBox.value = label.innerHTML;

      label.parentNode.insertBefore(textBox, label);

      quantity.style.display = "inline";
      quantity.removeAttribute("readonly");
    }
  }
  myNodelist[i].appendChild(editButton);

  // add delete button for a list item
  var deleteButton = document.createElement("span");
  var txt = document.createTextNode("\u00D7");
  deleteButton.className = "close";
  deleteButton.appendChild(txt);
  deleteButton.onclick = function() {
    var div = this.parentElement;
    div.style.display = "none";
  }
  myNodelist[i].appendChild(deleteButton);
}

// Initial list setup (hide/show button)
var lists = document.getElementsByClassName("list");
var list_title_boxes = document.getElementsByClassName("list_title_box");
var i;

for (i = 0; i < lists.length; i++) {
  collapseButton = document.createElement("span");
  collapseButton.className = "arrow";
  collapseButton.onclick = function() {
    var element;
    for (element = this.parentNode.nextElementSibling; element != null; element = element.nextElementSibling) {
      if (element.style.display != "none") {
        element.style.display = "none";
        collapseButton.style.transform = "rotate(-45deg)";
      }
      else {
        element.style.display="block";
        collapseButton.style.transform = "rotate(45deg)";
      }
    }
  }
  list_title_boxes[i].insertBefore(collapseButton, list_title_boxes[i].firstChild);

  // add delete button to existing parent items
  var deleteButton = document.createElement("span");
  var txt = document.createTextNode("\u00D7");
  deleteButton.className = "close";
  deleteButton.appendChild(txt);
  deleteButton.onclick = function() {
    var div = this.parentNode.parentNode;
    div.style.display = "none";
  }
  list_title_boxes[i].appendChild(deleteButton);
}

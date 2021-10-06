function createNewList() {
  var ul = document.createElement("ul");
  ul.className = "list";

  // parent Button -------------------------------------------------------------
  var parentListItem = document.createElement("li");
  parentListItem.className = "list_item";
  ul.appendChild(parentListItem);

  // collapseButton (part of parent list item)
  collapseButton = document.createElement("span");
  collapseButton.className = "arrow";
  collapseButton.onclick = function() {
    var childrenItems = this.parentNode.parentNode.children;
    console.log(this);
    for (var i = 1; i < childrenItems.length; i++) {
      if (childrenItems[i].style.display != "none") {
        childrenItems[i].style.display = "none";
        collapseButton.style.transform = "rotate(-45deg)";
      }
      else {
        childrenItems[i].style.display="block";
        collapseButton.style.transform = "rotate(45deg)";
      }
    }
  }
  parentListItem.appendChild(collapseButton);

  // create the checkmark for the parent item
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

  parentListItem.appendChild(checkmark);

  // label for the parent item (part of parent list item)
  var label = document.createElement("label");
  label.innerHTML = document.getElementsByClassName("newListInput")[0].value;
  label.className = "list_title_label";
  parentListItem.appendChild(label);
  document.getElementsByClassName("newListInput")[0].value = "";

  console.log(label.innerHTML);

  // quantity for the parent item
  var quantity = document.createElement("input");
  quantity.type = "number";
  quantity.style.display = "none";
  parentListItem.appendChild(quantity);

  // edit button for the parent item
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
  parentListItem.appendChild(editButton);

  // add delete button for the parent item (part of parent list item)
  var deleteButton = document.createElement("span");
  var txt = document.createTextNode("\u00D7");
  deleteButton.className = "close";
  deleteButton.appendChild(txt);
  deleteButton.onclick = function() {
    var div = this.parentNode.parentNode;
    div.remove();
  }
  parentListItem.appendChild(deleteButton);

  // add a new item list item --------------------------------------------------
  var li = document.createElement("li");
  li.className = "list_item";

  // input text field (part of insert new child item)
  var input = document.createElement("input");
  input.type = "text";
  input.className = "newItemInput";
  li.appendChild(input);

  // Add button for a child item (part of insert new child item)
  var button = document.createElement("input");
  button.type = "button";
  button.className = "insertNewButton";
  button.value = "Add";
  button.onclick = createNewChild;
  li.appendChild(button);

  ul.appendChild(li)

  // append the whole thing at the end of the page
  document.body.appendChild(ul);
}

function createNewChild() { //--------------------------------------------------

  // create new child item on click
  var li = document.createElement("li");
  li.className = "list_item";

  // create the checkmark in the child item
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

  // label for the new child item
  var label = document.createElement("label");
  label.innerHTML = this.previousElementSibling.value;
  label.className = "todoItemLabel";
  li.appendChild(label);
  this.previousElementSibling.value = "";

  // quantity for the new child item
  var quantity = document.createElement("input");
  quantity.type = "number";
  quantity.style.display = "none";
  li.appendChild(quantity);

  // edit button for the new child item
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

  // delete button for the new child item
  var deleteButton = document.createElement("SPAN");
  var txt = document.createTextNode("\u00D7");
  deleteButton.className = "close";
  deleteButton.appendChild(txt);
  deleteButton.onclick = function() {
    var div = this.parentNode;
    div.remove();
  }

  li.appendChild(deleteButton);
  var list = this.parentNode.parentNode;

  list.appendChild(li);
}


// store some items
localStorage.setItem("parentItem1", "parent item 1");
localStorage.setItem("parentItem2", "parent item 2");
localStorage.setItem("parentItem3", "parent item 3");

localStorage.setItem("parentItem1_child1", "parent item 1 - child 1");

for (const [key, value] of Object.entries(localStorage)) {
  if (key.includes("parentItem")) {
    inputField = document.createElement("input");
    inputField.type = "text";
    inputField.value = value;
    inputField.className = "newListInput";
    inputField.onclick = createNewList;
    document.body.insertBefore(inputField, document.body.firstChild);
    inputField.onclick();
    inputField.remove();
    console.log(value);
  }
}

for (const [key, value] of Object.entries(localStorage)) {
  if (key.includes("_child")) {
    inputField = document.createElement("input");
    inputField.type = "text";
    inputField.value = value;
    inputField.className = "newListInput";
    inputField.onclick = createNewList;
    document.body.insertBefore(inputField, document.body.firstChild);
    inputField.onclick();
    inputField.remove();
    console.log(value);
  }
}

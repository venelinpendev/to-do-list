function createNewParent(parentItemName, initialQuantity) {
        var ul = document.createElement("ul");
        ul.className = "list";

        // set up the parent item ID
        ul.id = parentItemName;

        // parent Button -------------------------------------------------------------
        var parentListItem = document.createElement("li");
        parentListItem.className = "list_item";
        ul.appendChild(parentListItem);

        addCollapseButton(parentListItem);
        addCheckmark(parentListItem);

        let labelText;
        if (parentItemName) {
            labelText = parentItemName;
        }
        else {
            labelText = document.getElementsByClassName("newListInput")[0].value;
            document.getElementsByClassName("newListInput")[0].value = "";
        }
        addLabel(parentListItem, labelText);

        let quantity;
        if (initialQuantity) {
            quantity = initialQuantity;
        }
        addQuantity(parentListItem, quantity);

        addEditButton(parentListItem);
        addDeleteButton(parentListItem, "parentItem");
        addTextInputForChildItems(ul)

        // append the whole thing at the end of the page
        document.body.appendChild(ul);
    }


function createNewChild(parent, childItemName, initialQuantity) {
        if (typeof parent == "string") {
            var parentItem = document.getElementById(parent);
        }

        // create new child item on click
        var childListItem = document.createElement("li");
        childListItem.className = "list_item";

        addCheckmark(childListItem);

        let labelText;
        if (childItemName) {
            labelText = childItemName;
        }
        else {
            labelText = this.previousElementSibling.value;
            this.previousElementSibling.value = "";
        }
        addLabel(childListItem, labelText);

        let quantity;
        if (initialQuantity) {
            quantity = initialQuantity;
        }
        addQuantity(childListItem, quantity);
        
        addEditButton(childListItem);
        addDeleteButton(childListItem)
        

        if (typeof parent == "string") {
            parentItem.appendChild(childListItem);
          }
          else {
            var list = this.parentNode.parentNode;
            list.appendChild(childListItem);
          }
    }

// create the checkmark for the given item
function addCheckmark(element) {
    var checkmark = document.createElement("span");
    checkmark.className = "checkmark";
    checkmark.onclick = function () {
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

    element.appendChild(checkmark);
}

// collapseButton (part of parent list item)
function addCollapseButton(element) {
    const collapseButton = document.createElement("span");
    collapseButton.className = "arrow";
    collapseButton.onclick = function () {
        var childrenItems = this.parentNode.parentNode.children;
        for (var i = 1; i < childrenItems.length; i++) {
            if (childrenItems[i].style.display != "none") {
                childrenItems[i].style.display = "none";
                this.style.transform = "rotate(-45deg)";
            }
            else {
                childrenItems[i].style.display = "block";
                this.style.transform = "rotate(45deg)";
            }
        }
    }
    element.appendChild(collapseButton);
}

// add a label to the element
function addLabel(element, labelText) {
    var label = document.createElement("label");
    label.innerHTML = labelText;
    label.className = "list_title_label";
    element.appendChild(label);
}

// add quantity to an element
function addQuantity(element, quantity) {
    var quantityField = document.createElement("input");
    quantityField.type = "number";
    quantityField.value = quantity;
    if (quantity == 0 || !quantity) {
        quantityField.style.display = "none";
    } else {
        quantityField.setAttribute("readonly", true);
    }
    element.appendChild(quantityField);
}

function addEditButton(element) {
    // edit button for the parent item
    var editButton = document.createElement("input");
    editButton.type = "button";
    editButton.value = "Edit";
    editButton.onclick = function () {
        var quantity = this.previousElementSibling;
        var label = quantity.previousElementSibling;

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
    element.appendChild(editButton);
}

// add delete button for the parent item (part of parent list item)
function addDeleteButton(element, nodeType) {
    var deleteButton = document.createElement("span");
    var txt = document.createTextNode("\u00D7");
    deleteButton.className = "close";
    deleteButton.appendChild(txt);
    deleteButton.onclick = function () {
        let div;
        if (nodeType == "parentItem"){
            div = this.parentNode.parentNode;
        }
        else{
            div = this.parentNode;
        }
        div.remove();
    }
    element.appendChild(deleteButton);
}

function addTextInputForChildItems(element) {
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

    element.appendChild(li)
}

localStorage.setItem("parentItem0", "shopping list");
localStorage.setItem("parentItem1", "today's");
localStorage.setItem("parentItem2", "this big task/2");

localStorage.setItem("childItem0", "shopping list/apples/4");

// do parents first cause order is undeterministic
for (const [key, value] of Object.entries(localStorage)) {
  if (key.includes("parentItem")) {
    const arguments = value.split("/");
    createNewParent(arguments[0], arguments[1]);
  }
}
// do children second
for (const [key, value] of Object.entries(localStorage)) {
  if (key.includes("childItem")) {
    const arguments = value.split("/");
    createNewChild(arguments[0], arguments[1], arguments[2]);
  }
}
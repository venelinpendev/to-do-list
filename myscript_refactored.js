function childItemMarkup(labelText, initialQuantity, id, display, checked) {
    return `
        <li class="list_item" id="${id}"">
            <span class="checkmark" onclick="tickOrUntick(this)" ${checked}>
                <span class="circle"></span>
                <span class="tick"></span>
            </span>
            <input type="text" class="newItemInput" style="display:none;">
            <label class="list_title_label">${labelText}</label>
            <input type="number" value="${initialQuantity}" readonly="true" style="display:${display};" min="0" pattern="[0-9]*">
            <input type="button" value="Edit" onclick="editOnClick(this)">

            <span class="close" onclick="deleteChildOnClick(this)">×</span>
        </li>
    `;
}

function parentItemMarkup(labelText, initialQuantity, id, display, checked) {
    return `
        <ul class="list">
            <li class="list_item parent_item" id="${id}">
                <span class="arrow" onclick="collapseOnClick(this)"></span>
                <span class="checkmark" onclick="tickOrUntick(this)" ${checked}>
                    <span class="circle"></span>
                    <span class="tick"></span>
                </span>
                <input type="text" class="newItemInput" style="display:none;">
                <label class="list_title_label">${labelText}</label>
                <input type="number" value="${initialQuantity}" readonly="true" style="display:${display};" min="0" pattern="[0-9]*">
                <input type="button" value="Edit"  onclick="editOnClick(this)">
                <span class="close" onclick="deleteParentOnClick(this)">×</span>
            </li>
            <li class="list_item">
                <input type="text" class="newItemInput" required pattern="[a-zA-Z]*">
                <input type="button" class="insertNewButton" value="Add" onclick="startLoadingScreen(); addChildItemOnClick(this);">
            </li>
        </ul>
    `;
}

function loaderMarkup() {
    return `<div class="loader"></div>`
}

class ChildItem {
    constructor(label, quantity, id, checked) {
        if (!id) {
            id = currentID++;
        }

        let display = "none";
        if (quantity > 0) {
            display = "inline";
        }

        let thisChecked = "";
        if (checked) {
            thisChecked = "checked";
        }

        this.id = id;
        this.html = childItemMarkup(label, quantity, id, display, thisChecked);
    }

    toString() {
        return this.html;
    }
}


class ParentItem {
    constructor(label, quantity, id, checked) {
        if (!id) {
            id = currentID++;
        }

        let display = "none";
        if (quantity > 0) {
            display = "inline";
        }
        
        let thisChecked = "";
        if (checked) {
            thisChecked = "checked";
        }

        this.id = id;
        this.html = parentItemMarkup(label, quantity, id, display, thisChecked);
    }

    appendChild(childHTML) {
        this.html += childHTML;
    }

    toString() {
        return this.html;
    }
}

function editOnClick(element) {
    if (!validateQuantity(element.previousElementSibling)) {
        return
    }

    const quantity = element.previousElementSibling;
    const label = quantity.previousElementSibling;
    const textBox = label.previousElementSibling;

    if (label.style.display == "none") {
        // save new changes
        label.style.display = "inline";

        textBox.style.display = "none";
        label.innerHTML = textBox.value;

        if (quantity.value == 0) {
            quantity.style.display = "none";
        }
        quantity.setAttribute("readonly", "true");

        // if the element is a parent item, both IDs will be the same
        const parentID = element.parentNode.parentNode.children[0].id;
        const thisID = element.parentNode.id;
        
        let thisType = "child";
        if (element.parentNode.classList.contains("parent_item")) {
            thisType = "parent";
        }

        const updatedItem = {
            type: thisType,
            label: label.innerHTML,
            quantity: quantity.value,
            parentID: parentID,
        }
        localStorage.setItem(thisID, JSON.stringify(updatedItem))
    }
    else {
        // make editable
        label.style.display = "none";

        textBox.style.display = "inline";
        textBox.value = label.innerHTML;

        quantity.style.display = "inline";
        quantity.removeAttribute("readonly");
    }
}

function deleteChildOnClick(element) {
    const listItem = element.parentNode;
    listItem.remove();

    //remove from client-side storage
    localStorage.removeItem(listItem.id)
}

function deleteParentOnClick(element) {
    if (element.parentNode.parentNode.children.length > 2 && !window.confirm("This item has sub-items. Are you sure you want to delete everything?")) {
        return;
    }
    const list = element.parentNode.parentNode;
    list.remove();

    // remove from client-side storage
    // remove all children nodes first
    for (let childIndex = 0; childIndex < list.children.length; childIndex++) {
        localStorage.removeItem(list.children[childIndex].id);
    }
    localStorage.removeItem(list.id)
}

function collapseOnClick(element) {
    var childrenItems = element.parentNode.parentNode.children;
    for (var i = 1; i < childrenItems.length; i++) {
        if (childrenItems[i].style.display != "none") {
            childrenItems[i].style.display = "none";
            element.style.transform = "rotate(-45deg)";
        }
        else {
            childrenItems[i].style.display = "block";
            element.style.transform = "rotate(45deg)";
        }
    }
}

function tickOrUntick(element) {
    let checked = "";
    if (element.hasAttribute("checked")) {
        element.removeAttribute("checked");
    }
    else {
        element.setAttribute("checked", "");
        checked = "checked";
    }

    // update the local storage
    const textBox = element.nextElementSibling;
    const label = textBox.nextElementSibling;
    const quantity = label.nextElementSibling;

    // if the element is a parent item, both IDs will be the same
    const parentID = element.parentNode.parentNode.children[0].id;
    const thisID = element.parentNode.id;
    
    let thisType = "child";
    if (element.parentNode.classList.contains("parent_item")) {
        thisType = "parent";
    }

    const updatedItem = {
        type: thisType,
        label: label.innerHTML,
        quantity: quantity.value,
        parentID: parentID,
        checked: checked
    }
    localStorage.setItem(thisID, JSON.stringify(updatedItem))
}

// parentElement should be the <ul> around the child
function addChildItemCustom(parentElement, childItemLabel, childItemQuantity, thisID, checked) {
    setTimeout(stopLoadingScreen, 500);
    const newChildItem = new ChildItem(childItemLabel, childItemQuantity, thisID, checked);
    parentElement.innerHTML += newChildItem;
}

// element should be the button which the func is called from
function addChildItemOnClick(element) {
    setTimeout(stopLoadingScreen, 500);

    // Validation part
    if (!validateListInput(element.previousElementSibling)) {
        return;
    }

    // Insertion part
    thisID = currentID++;

    childItemLabel = element.previousElementSibling.value;
        childItemQuantity = 0;
    element.previousElementSibling.value = "";
    parentElement = element.parentNode.parentNode;
    const thisParentID = parentElement.children[0].id;

    // only save the child in the storage if created from the button
    // (otherwise, the function is called on initialisation, so
    // item already exists in the DB)
    const newChildItemJSON = {
        type: "child",
        label: childItemLabel,
        quantity: childItemQuantity,
        parentID: thisParentID,
    }

    localStorage.setItem(thisID, JSON.stringify(newChildItemJSON));
    const newChildItem = new ChildItem(childItemLabel, childItemQuantity, thisID);

    parentElement.innerHTML += newChildItem;
}

function addParentItem() {
    setTimeout(stopLoadingScreen, 500);
    const inputField = document.getElementsByClassName("newListInput")[0];
    
    // Validation part
    if (!validateListInput(inputField)) {
        return;
    }

    // Insertion part
    const parentItemLabel = document.getElementsByClassName("newListInput")[0].value;
    document.getElementsByClassName("newListInput")[0].value = "";

    const newParentItem = new ParentItem(parentItemLabel, 0);

    document.body.innerHTML += newParentItem;

    // This is called from the index.html only
    // so it's safe that on every click,
    // the parent item will need to be saved in local storage
    const newParentItemJSON = {
        type: "parent",
        label: parentItemLabel,
        quantity: 0,
    }

    localStorage.setItem(newParentItem.id, JSON.stringify(newParentItemJSON));
}

function loaderMarkup() {
    return `<div id="loader"></div>`
}

function bigWhiteRectMarkup() {
    return `<div id="big_rectangle"></div>`
}

function findParent(id) {
    let parentNodes = document.getElementsByClassName("parent_item")
    for (const node of parentNodes) {
        if (node.id == id) {
            return node;
        }
    }
}


function startLoadingScreen() {
    document.getElementById("big_rectangle").style.display = "block";
    document.getElementById("loader").style.display = "block";
}

function stopLoadingScreen() {
    document.getElementById("big_rectangle").style.display = "none";
    document.getElementById("loader").style.display = "none";
}

function errorMarkup(errorMessage) {
    return `
        <div class="error"> ${errorMessage} </div>
    `;
}

function validateListInput(inputField) {
    removeErrors(inputField);
    if (!inputField.checkValidity()) {
        if (inputField.validity.valueMissing) {
            displayError(inputField, "Field is empty");
        }
        else if (inputField.validity.patternMismatch) {
            displayError(inputField, "Contains inappropriate symbols/numbers");
        }
        return false;
    }
    return true;
}

function validateQuantity(inputField) {
    removeErrors(inputField.nextElementSibling);
    if (!inputField.checkValidity()) {
        if (inputField.validity.patternMismatch) {
            displayError(inputField.nextElementSibling, "Contains non-digits");
        }
        else if (inputField.validity.rangeUnderflow) {
            displayError(inputField.nextElementSibling, "Quanitity too low, minimum is 0");
        }
        return false;
    }
    return true;
}

function displayError(element, errorMessage) {
    const error = document.createElement("div");
    error.className = "error";
    error.innerHTML = errorMessage;
    element.parentNode.insertBefore(error, element.nextElementSibling.nextElementSibling);

}

function removeErrors(element) {
    let currentElement = element;
    while (currentElement && (!currentElement.className || currentElement.className != "error")) {
        currentElement = currentElement.nextElementSibling;
    }
    while(currentElement && currentElement.className && currentElement.className == "error") {
        const tempElement = currentElement;
        currentElement = currentElement.nextElementSibling;
        tempElement.remove();
    }

}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

document.body.innerHTML += bigWhiteRectMarkup();
document.body.innerHTML += loaderMarkup();

startLoadingScreen(); 

let currentID = 1;
// local storage part
const shoppingList = {
    type: "parent",
    label: "shopping list",
    quantity: 10,
    checked: false,
};

localStorage.setItem(currentID++, JSON.stringify(shoppingList));

// construct parent nodes first 
for (const [id, value] of Object.entries(localStorage)) {
    const args = JSON.parse(localStorage.getItem(id));
    if (args.type == "parent") {
        const parentItem = new ParentItem(args.label, args.quantity, id, args.checked)
        document.body.innerHTML += parentItem;
    }
}

// construct children nodes 
const apples = {
    type: "child",
    label: "apples",
    quantity: 4,
    parentID: 1,
    checked: false,
};

localStorage.setItem(currentID++, JSON.stringify(apples));

// append children
for (const [id, value] of Object.entries(localStorage)) {
    // meanwhile update currentID to be the max available ID, so as not to overwrite localStorage items
    if (id >= currentID) {
        currentID = +id + 1;
    }

    const args = JSON.parse(localStorage.getItem(id));
    if (args.type == "child") {
        const parent = findParent(args.parentID);
        setTimeout(stopLoadingScreen, 500);
        const newChildItem = new ChildItem(args.label, args.quantity, id, args.checked);
        parent.parentNode.innerHTML += newChildItem;
    }
}

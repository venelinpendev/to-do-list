function childItemMarkup(labelText, initialQuantity, display, checked) {
    return `
        <li class="list_item">
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

function parentItemMarkup(labelText, initialQuantity, display, checked, id) {
    return `
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
    `;
}

function loaderMarkup() {
    return `<div class="loader"></div>`
}

class Item {
    constructor(label, quantity, shouldCheck) {
        this.label = label;
        this.quantity = quantity;
        this.display = "none";
        if (quantity > 0) {
            this.display = "inline";
        }

        this.checked = "";
        if (shouldCheck) {
            this.checked = "checked";
        }
    }

    toString() {
        return this.html;
    }

    isBeingEdited() {
        if (this.label.style.display == "none") {
            return true;
        }
        return false;
    }
}

class ChildItem extends Item {
    constructor(label, quantity, checked) {
        super(label, quantity, checked);
        this.html = childItemMarkup(this.label, this.quantity, this.display, this.checked);
    }
}

class ParentItem extends Item {
    constructor(label, quantity, checked, id) {
        super(label, quantity, checked);

        this.id = id
        this.ulTag = `<ul class="list">`;
        this.html = parentItemMarkup(this.label, this.quantity, this.display, this.checked, this.id);
        this.ulCloseTag = `</ul>`;
    }

    appendChild(childItem) {
        this.html += childItem.html;
    }

    toString() {
        return this.ulTag + this.html + this.ulCloseTag;
    }
}
function editOnClick(element) {
    if (!validateQuantity(element.previousElementSibling)) {
        return
    }

    const quantity = element.previousElementSibling;
    const label = quantity.previousElementSibling;
    const textBox = label.previousElementSibling;
    const checkmark = textBox.previousElementSibling;
    const checked = checkmark.hasAttribute("checked");

    if (label.style.display == "none") {
        // save new changes
        label.style.display = "inline";
        textBox.style.display = "none";
        label.innerHTML = textBox.value;

        if (quantity.value == 0) {
            quantity.style.display = "none";
        }
        quantity.setAttribute("readonly", "true");

        // the parentID will be either the parentID for a child item
        // or the self id for a parent item
        const listItem = element.parentNode;
        const parentId = parentIndex(listItem);

        let jsonList = JSON.parse(localStorage.getItem("list"));
        // if we're in a parent item
        let updatedItem;
        if (element.parentNode.classList.contains("parent_item")) {
            updatedItem = {
                id: parentId,
                label: label.innerHTML,
                quantity: quantity.value,
                checked: checked,
                children: jsonList[parentId].children,
            }
            jsonList[parentId] = updatedItem;
        }
        else {
            updatedItem = {
                parentId: parentId,
                label: label.innerHTML,
                quantity: quantity.value,
                checked: checked,
            }
            jsonList[parentId].children[childIndex(element.parentNode)] = updatedItem;
        }
        localStorage.setItem("list", JSON.stringify(jsonList));
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

function childIndex(element) {
    let index = 0;
    while (element && element.previousElementSibling) {
        index++;
        element = element.previousElementSibling;
        if (element.classList && element.classList.contains("parent_item")) {
            // subtract 2 bcs teh first 2 items from a list are 
            // parent item and input field for the children
            return index - 2;
        }
    }
}

function parentIndex(element) {
    if (element.classList && element.classList.contains("parent_item")) {
        return element.id;
    }
    while (element && element.previousElementSibling) {
        element = element.previousElementSibling;
        if (element.classList && element.classList.contains("parent_item")) {
            return element.id;
        }
    }
}

function deleteChildOnClick(element) {
    const listItem = element.parentNode;
    const childId = childIndex(listItem);
    const parentId = parentIndex(listItem);
    //remove from client-side storage
    let jsonList = JSON.parse(localStorage.getItem("list"));
    jsonList[parentId].children.splice(childId, 1);

    localStorage.setItem("list", JSON.stringify(jsonList));
    
    listItem.remove();
}

function deleteParentOnClick(element) {
    if (element.parentNode.parentNode.children.length > 2 && !window.confirm("This item has sub-items. Are you sure you want to delete everything?")) {
        return;
    }
    const listItem = element.parentNode; 
    const list = element.parentNode.parentNode;
    let traversingList = list;
    
    //const childId = childIndex(listItem);
    const parentId = parentIndex(listItem);
    //remove from client-side storage
    let jsonList = JSON.parse(localStorage.getItem("list"));
    for (let tempParentId = parentId; tempParentId < jsonList.length; tempParentId++) {
        parent = jsonList[tempParentId];
        for (let child of jsonList[parent.id].children) {
            child.parentId--;
        }
        traversingList.children[0].id = +traversingList.children[0].id - 1;
        traversingList = traversingList.nextElementSibling;
        parent.id--;
    }
    jsonList.splice(parentId, 1);
    localStorage.setItem("list", JSON.stringify(jsonList));

    // remove from client-side storage
    // remove all children nodes first
    /*for (let childIndex = 0; childIndex < list.children.length; childIndex++) {
        localStorage.removeItem(list.children[childIndex].id);
    }*/
    list.remove();
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

    const listItem = element.parentNode;
    const parentId = parentIndex(listItem);
    let jsonList = JSON.parse(localStorage.getItem("list"));
    let updatedItem;
        if (element.parentNode.classList.contains("parent_item")) {
            updatedItem = {
                id: parentId,
                label: label.innerHTML,
                quantity: quantity.value,
                checked: checked,
                children: jsonList[parentId].children,
            }
            jsonList[parentId] = updatedItem;
        }
        else {
            updatedItem = {
                parentId: parentId,
                label: label.innerHTML,
                quantity: quantity.value,
                checked: checked,
            }
            jsonList[parentId].children[childIndex(element.parentNode)] = updatedItem;
        }

    localStorage.setItem(thisID, JSON.stringify(updatedItem))
}

// element should be the button which the func is called from
function addChildItemOnClick(element) {
    setTimeout(stopLoadingScreen, 500);

    // Validation part
    if (!validateListInput(element.previousElementSibling)) {
        return;
    }

    const listItem = element.parentNode;

    const inputField = element.previousElementSibling
    const childItemLabel = inputField.value;
    inputField.value = "";
    const childItemQuantity = 0;
    let parentElement = element.parentNode.parentNode;
    const parentId = parentIndex(listItem);

    const newChildItemJSON = {
        parentId: parentId,
        label: childItemLabel,
        quantity: childItemQuantity,
    }

    jsonList = JSON.parse(localStorage.getItem("list"));
    console.log("......" + jsonList[parentId]);
    jsonList[parentId].children.push(newChildItemJSON);

    localStorage.setItem("list", JSON.stringify(jsonList));
    const newChildItem = new ChildItem(childItemLabel, childItemQuantity);

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

    jsonList = JSON.parse(localStorage.getItem("list"));
    // This is called from the index.html only
    // so it's safe that on every click,
    // the parent item will need to be saved in local storage
    const newParentItemJSON = {
        id: jsonList.length,
        label: parentItemLabel,
        quantity: 0,
        children: [],
    }
    
    jsonList.push(newParentItemJSON);
    localStorage.setItem("list", JSON.stringify(jsonList));
    
    const newParentItem = new ParentItem(parentItemLabel, 0, false, jsonList.length - 1);
    document.body.innerHTML += newParentItem;
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
    while (currentElement && currentElement.className && currentElement.className == "error") {
        const tempElement = currentElement;
        currentElement = currentElement.nextElementSibling;
        tempElement.remove();
    }

}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

document.body.innerHTML += bigWhiteRectMarkup();
document.body.innerHTML += loaderMarkup();

//startLoadingScreen(); 

let currentID = 1;
// local storage part

let jsonList = JSON.parse(localStorage.getItem('list'));
if (!jsonList || (jsonList && jsonList.length == 0)) {
    // prefill some data if there is no data on the site
    const data =
        [{
            id: 0,
            label: "shopping list",
            quantity: 10,
            checked: false,
            children: [
                {
                    parentId: 0,
                    label: "apples",
                    quantity: 4,
                    checked: false,
                },
            ],
        },
        {
            id: 1,
            label: "gas",
            quantity: 0,
            checked: false,
            children: [
                {
                    parentId: 1,
                    label: "diesel",
                    quantity: 1,
                    checked: false,
                },
            ],
        }
        ];

    localStorage.setItem("list", JSON.stringify(data));

    jsonList = JSON.parse(localStorage.getItem("list"));
}

// populate the page
for (let parent of jsonList) {
    //console.log(parentItem);
    let parentItem = new ParentItem(parent.label, parent.quantity, parent.checked, parent.id);


    for (let child of parent.children) {
        console.log(child);
        parentItem.appendChild(new ChildItem(child.label, child.quantity, child.checked));
    }

    document.body.innerHTML += parentItem;
}
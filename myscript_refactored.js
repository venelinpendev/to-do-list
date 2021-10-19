function childItemMarkup(labelText, initialQuantity, id, display) {
    return `
        <li class="list_item" id="${id}"">
            <span class="checkmark" onclick="tickOrUntick(this)">
                <span class="circle"></span>
                <span class="tick"></span>
            </span>
            <label class="list_title_label">${labelText}</label>
            <input type="number" value="${initialQuantity}" readonly="true" style="display:${display}" min="0" pattern="[0-9]*">
            <input type="button" value="Edit" onclick="editOnClick(this)">

            <span class="close" onclick="deleteChildOnClick(this)">×</span>
        </li>
    `;
}

function parentItemMarkup(labelText, initialQuantity, id, display) {
    return `
        <ul class="list">
            <li class="list_item parent_item" id="${id}">
                <span class="arrow" onclick="collapseOnClick(this)"></span>
                <span class="checkmark" onclick="tickOrUntick(this)">
                    <span class="circle"></span>
                    <span class="tick"></span>
                </span>
                <label class="list_title_label">${labelText}</label>
                <input type="number" value="${initialQuantity}" readonly="true" style="display:${display}" min="0">
                <input type="button" value="Edit"  onclick="editOnClick(this)">
                <span class="close" onclick="deleteParentOnClick(this)">×</span>
            </li>
            <li class="list_item">
                <input type="text" class="newItemInput" required pattern="[a-zA-Z]*">
                <input type="button" class="insertNewButton" value="Add" onclick="addChildItem(null, this)">
            </li>
        </ul>
    `;
}

function loaderMarkup() {
    return `<div class="loader"></div>`
}

class ChildItem {
    constructor(label, quantity, id) {
        if (!id) {
            id = currentID++;
        }

        let display = "inline";
        if (!quantity) {
            display = "none";
        }

        this.id = id;
        this.html = childItemMarkup(label, quantity, id, display);
    }

    toString() {
        return this.html;
    }
}


class ParentItem {
    constructor(label, quantity, id) {
        if (!id) {
            id = currentID++;
        }


        let display = "inline";
        if (!quantity) {
            display = "none";
        }

        this.id = id;
        this.html = parentItemMarkup(label, quantity, id, display);
    }

    appendChild(childHTML) {
        this.html += childHTML;
    }

    toString() {
        return this.html;
    }
}

function editOnClick(element) {
    if (!element.previousElementSibling.checkValidity()) {
        return;
    }

    var quantity = element.previousElementSibling;
    var label = quantity.previousElementSibling;

    if (label.style.display == "none") {
        // save new changes
        label.style.display = "inline";

        textBox = label.previousElementSibling;
        label.innerHTML = textBox.value;
        textBox.remove();

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

        textBox = document.createElement("input");
        textBox.type = "input";
        textBox.className = "newItemInput";
        textBox.value = label.innerHTML;

        label.parentNode.insertBefore(textBox, label);

        quantity.style.display = "inline";
        quantity.removeAttribute("readonly");
    }
}

function deleteChildOnClick(element) {
    if (!window.confirm("Are you sure you want to delete this item?")) {
        return;
    }
    const listItem = element.parentNode;
    listItem.remove();

    //remove from client-side storage
    localStorage.removeItem(listItem.id)
}

function deleteParentOnClick(element) {
    if (!window.confirm("Are you sure you want to delete this item?")) {
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
    for (var childID = 0; childID != element.children.length; childID++) {
        if (element.children[childID].style.borderColor != "green") {
            element.children[childID].style.borderColor = "green";
        }
        else {
            element.children[childID].style.borderColor = "#eee";
        }
    }
}

/* 
 * if used from within the button click: supply only element
 * if used in any other case: supply everything else
 * parentElement should be the <ul>
 * element should be the button which the func is called from
 */
function addChildItem(parentElement, element, childItemLabel, childItemQuantity, thisID) {
    document.getElementsByClassName("big_rectangle")[0].style.display = "inline";
    document.getElementsByClassName("loader")[0].style.display = "inline";
    //oneSecondDelay(3000);

    if (element && !element.previousElementSibling.checkValidity()) {
        return;
    }

    if (!thisID) {
        thisID = currentID++;
    }

    if (element) {
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

        localStorage.setItem(thisID, JSON.stringify(newChildItemJSON))
    }

    const newChildItem = new ChildItem(childItemLabel, childItemQuantity, thisID);

    parentElement.innerHTML += newChildItem;
}

function addParentItem() {
    if (!document.getElementsByClassName("newListInput")[0].checkValidity()) {
        return;
    }

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

    localStorage.setItem(newParentItem.id, JSON.stringify(newParentItemJSON))
}

function loaderMarkup() {
    return `<div class="loader"></div>`
}

function bigWhiteRectMarkup() {
    return `<div class="big_rectangle"></div>`
}

async function oneSecondDelay(ms) {
    function doTimeout(ms) {
        setTimeout(function(){
          var ids= window.ids; //is non empty
        },ms);
    }
    
    function sleep(ms, callback) {
      var start = new Date().getTime(), expire = start + ms;
      while (new Date().getTime() < expire) { }
      callback(ms);
    }
    
    await sleep(ms, doTimeout);   
    
    document.getElementsByClassName("big_rectangle")[0].style.display = "none";
    document.getElementsByClassName("loader")[0].style.display = "none";
}


function findParent(id) {
    let parentNodes = document.getElementsByClassName("parent_item")
    for (const node of parentNodes) {
        if (node.id == id) {
            return node;
        }
    }
}

document.body.innerHTML += bigWhiteRectMarkup();
document.body.innerHTML += loaderMarkup();

let currentID = 1;
// local storage part
const shoppingList = {
    type: "parent",
    label: "shopping list",
    quantity: 10,
};

localStorage.setItem(currentID++, JSON.stringify(shoppingList));
//startLoadingScreen();
//oneSecondDelay(3000);

// construct parent nodes first 
for (const [id, value] of Object.entries(localStorage)) {
    const args = JSON.parse(localStorage.getItem(id));
    if (args.type == "parent") {
        const parentItem = new ParentItem(args.label, args.quantity, id)
        document.body.innerHTML += parentItem;
    }
}

// construct children nodes 
const apples = {
    type: "child",
    label: "apples",
    quantity: 4,
    parentID: 1,
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
        addChildItem(parent.parentNode, null, args.label, args.quantity, id);
    }
}

//stopLoadingScreen();

function startLoadingScreen() {
    const rect = document.createElement("div");
    rect.className = "big_rectangle";
    document.body.appendChild(rect);

    const loader = document.createElement("div");
    loader.className = "loader";
    document.body.appendChild(loader);
}

function stopLoadingScreen() {
    const rects = document.getElementsByClassName("big_rectangle");
    const loaders = document.getElementsByClassName("loader");

    rects[0].remove();
    loaders[0].remove();
}

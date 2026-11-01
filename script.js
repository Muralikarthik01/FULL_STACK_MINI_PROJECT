// Load saved data

let rawMaterials = JSON.parse(localStorage.getItem("rawMaterials")) || [];

let packagingMaterials = JSON.parse(localStorage.getItem("packagingMaterials")) || [];

let products = JSON.parse(localStorage.getItem("products")) || [];

// Generate unique IDs

function generateID(prefix) {
return prefix + Date.now() + Math.floor(Math.random() * 1000);
}

// Save all data

function saveData() {


localStorage.setItem("rawMaterials", JSON.stringify(rawMaterials));

localStorage.setItem("packagingMaterials", JSON.stringify(packagingMaterials));

localStorage.setItem("products", JSON.stringify(products));


}

// Escape HTML

function escapeHTML(value) {


return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
})[character]);


}

// Show sections

function showSection(sectionId) {


document.querySelectorAll(".section").forEach(section => {
    section.classList.add("hidden");
});

document.getElementById(sectionId).classList.remove("hidden");

displayRawMaterials();
displayPackaging();
displayProducts();
updateDashboard();


}

// =================================
// RAW MATERIALS
// =================================

document.getElementById("rawForm").addEventListener("submit", function(event) {


event.preventDefault();

const editId = document.getElementById("rawEditId").value;

const name = document.getElementById("rawName").value.trim();

const quantity = Number(document.getElementById("rawQuantity").value);

const unit = document.getElementById("rawUnit").value;

const date = document.getElementById("rawDate").value;

if (!name || !unit || !date || !Number.isFinite(quantity) || quantity < 0) {
    alert("Please enter valid details.");
    return;
}

if (editId) {

    const material = rawMaterials.find(item => item.id === editId);

    if (material) {
        material.name = name;
        material.quantity = quantity;
        material.unit = unit;
        material.date = date;
    }

    document.getElementById("rawSubmit").innerText = "Add Material";

} else {

    rawMaterials.push({
        id: generateID("RM"),
        name,
        quantity,
        unit,
        date
    });

}

saveData();

this.reset();

document.getElementById("rawEditId").value = "";

displayRawMaterials();
updateDashboard();


});

function displayRawMaterials() {


const table = document.getElementById("rawTable");

const search = document.getElementById("rawSearch").value.toLowerCase();

table.innerHTML = "";

const filtered = rawMaterials.filter(item =>
    item.name.toLowerCase().includes(search) ||
    item.id.toLowerCase().includes(search)
);

filtered.forEach(item => {

    table.innerHTML += `
        <tr>
            <td>${escapeHTML(item.id)}</td>
            <td>${escapeHTML(item.name)}</td>
            <td>${item.quantity} ${escapeHTML(item.unit)}</td>
            <td>${escapeHTML(item.date)}</td>
            <td>
                <button class="edit-btn" onclick="editRaw('${item.id}')">Edit</button>
                <button class="delete-btn" onclick="deleteRaw('${item.id}')">Delete</button>
            </td>
        </tr>
    `;

});

if (filtered.length === 0) {
    table.innerHTML = `<tr><td colspan="5">No raw materials found.</td></tr>`;
}


}

function editRaw(id) {

const item = rawMaterials.find(r => r.id === id);

if (!item) return;

document.getElementById("rawEditId").value = item.id;
document.getElementById("rawName").value = item.name;
document.getElementById("rawQuantity").value = item.quantity;
document.getElementById("rawUnit").value = item.unit;
document.getElementById("rawDate").value = item.date;

document.getElementById("rawSubmit").innerText = "Update Material";

document.getElementById("rawForm").scrollIntoView({ behavior: "smooth" });


}

function deleteRaw(id) {


if (confirm("Delete this raw material?")) {

    rawMaterials = rawMaterials.filter(item => item.id !== id);

    saveData();

    displayRawMaterials();
    updateDashboard();

}


}

// =================================
// PACKAGING MATERIALS
// =================================

// Calculate total packaging quantity

function calculatePackaging() {


const boxes = Number(document.getElementById("packBoxes").value);

const perBox = Number(document.getElementById("packPerBox").value);

const total = boxes * perBox;

document.getElementById("packCalculation").innerText =
    "Total Quantity: " + total + " pieces";


}

document.getElementById("packBoxes").addEventListener("input", calculatePackaging);

document.getElementById("packPerBox").addEventListener("input", calculatePackaging);

document.getElementById("packagingForm").addEventListener("submit", function(event) {


event.preventDefault();

const editId = document.getElementById("packEditId").value;

const name = document.getElementById("packName").value;

const capacity = document.getElementById("packCapacity").value.trim();

const boxes = Number(document.getElementById("packBoxes").value);

const perBox = Number(document.getElementById("packPerBox").value);

const date = document.getElementById("packDate").value;

if (!name || !capacity || !date ||
    !Number.isInteger(boxes) || boxes < 1 ||
    !Number.isInteger(perBox) || perBox < 1) {

    alert("Please enter valid packaging details.");
    return;

}

const total = boxes * perBox;

if (editId) {

    const item = packagingMaterials.find(p => p.id === editId);

    if (item) {

        item.name = name;
        item.capacity = capacity;
        item.boxes = boxes;
        item.perBox = perBox;
        item.total = total;
        item.date = date;

    }

    document.getElementById("packSubmit").innerText = "Add Packaging";

} else {

    packagingMaterials.push({

        id: generateID("PM"),
        name,
        capacity,
        boxes,
        perBox,
        total,
        date

    });

}

saveData();

this.reset();

document.getElementById("packEditId").value = "";

calculatePackaging();

displayPackaging();
updateDashboard();


});

function displayPackaging() {


const table = document.getElementById("packTable");

const search = document.getElementById("packSearch").value.toLowerCase();

table.innerHTML = "";

const filtered = packagingMaterials.filter(item =>
    item.name.toLowerCase().includes(search) ||
    item.capacity.toLowerCase().includes(search) ||
    item.id.toLowerCase().includes(search)
);

filtered.forEach(item => {

    table.innerHTML += `
        <tr>
            <td>${escapeHTML(item.id)}</td>
            <td>${escapeHTML(item.name)}</td>
            <td>${escapeHTML(item.capacity)}</td>
            <td>${item.boxes} × ${item.perBox} = ${item.total} pieces</td>
            <td>${escapeHTML(item.date)}</td>
            <td>
                <button class="edit-btn" onclick="editPackaging('${item.id}')">Edit</button>
                <button class="delete-btn" onclick="deletePackaging('${item.id}')">Delete</button>
            </td>
        </tr>
    `;

});

if (filtered.length === 0) {
    table.innerHTML = `<tr><td colspan="6">No packaging materials found.</td></tr>`;
}


}

function editPackaging(id) {


const item = packagingMaterials.find(p => p.id === id);

if (!item) return;

document.getElementById("packEditId").value = item.id;
document.getElementById("packName").value = item.name;
document.getElementById("packCapacity").value = item.capacity;
document.getElementById("packBoxes").value = item.boxes;
document.getElementById("packPerBox").value = item.perBox;
document.getElementById("packDate").value = item.date;

document.getElementById("packSubmit").innerText = "Update Packaging";

calculatePackaging();

document.getElementById("packagingForm").scrollIntoView({ behavior: "smooth" });


}

function deletePackaging(id) {


if (confirm("Delete this packaging material?")) {

    packagingMaterials = packagingMaterials.filter(item => item.id !== id);

    saveData();

    displayPackaging();
    updateDashboard();

}


}

// =================================
// TOTAL PRODUCTS
// =================================

document.getElementById("productForm").addEventListener("submit", function(event) {


event.preventDefault();

const editId = document.getElementById("productEditId").value;

const name = document.getElementById("productName").value.trim();

const quantity = Number(document.getElementById("productQuantity").value);

const unit = document.getElementById("productUnit").value;

const date = document.getElementById("productDate").value;

if (!name || !unit || !date || !Number.isFinite(quantity) || quantity < 0) {

    alert("Please enter valid product details.");
    return;

}

if (editId) {

    const product = products.find(p => p.id === editId);

    if (product) {

        product.name = name;
        product.quantity = quantity;
        product.unit = unit;
        product.date = date;

    }

    document.getElementById("productSubmit").innerText = "Add Product";

} else {

    products.push({

        id: generateID("FP"),
        name,
        quantity,
        unit,
        date

    });

}

saveData();

this.reset();

document.getElementById("productEditId").value = "";

displayProducts();
updateDashboard();


});

function displayProducts() {


const table = document.getElementById("productTable");

const search = document.getElementById("productSearch").value.toLowerCase();

table.innerHTML = "";

const filtered = products.filter(item =>
    item.name.toLowerCase().includes(search) ||
    item.id.toLowerCase().includes(search)
);

filtered.forEach(item => {

    table.innerHTML += `
        <tr>
            <td>${escapeHTML(item.id)}</td>
            <td>${escapeHTML(item.name)}</td>
            <td>${item.quantity} ${escapeHTML(item.unit)}</td>
            <td>${escapeHTML(item.date)}</td>
            <td>
                <button class="edit-btn" onclick="editProduct('${item.id}')">Edit</button>
                <button class="delete-btn" onclick="deleteProduct('${item.id}')">Delete</button>
            </td>
        </tr>
    `;

});

if (filtered.length === 0) {
    table.innerHTML = `<tr><td colspan="5">No products found.</td></tr>`;
}


}

function editProduct(id) {


const item = products.find(p => p.id === id);

if (!item) return;

document.getElementById("productEditId").value = item.id;
document.getElementById("productName").value = item.name;
document.getElementById("productQuantity").value = item.quantity;
document.getElementById("productUnit").value = item.unit;
document.getElementById("productDate").value = item.date;

document.getElementById("productSubmit").innerText = "Update Product";

document.getElementById("productForm").scrollIntoView({ behavior: "smooth" });


}

function deleteProduct(id) {


if (confirm("Delete this product?")) {

    products = products.filter(item => item.id !== id);

    saveData();

    displayProducts();
    updateDashboard();

}


}

// =================================
// DASHBOARD
// =================================

function updateDashboard() {

document.getElementById("rawCount").innerText = rawMaterials.length;

document.getElementById("packagingCount").innerText = packagingMaterials.length;

document.getElementById("productCount").innerText = products.length;


const dashboardTable = document.getElementById("dashboardTable");

dashboardTable.innerHTML = "";

const allResources = [

    ...rawMaterials.map(item => ({
        id: item.id,
        name: item.name,
        category: "Raw Material",
        quantity: item.quantity + " " + item.unit,
        date: item.date
    })),

    ...packagingMaterials.map(item => ({
        id: item.id,
        name: item.name,
        category: "Packaging",
        quantity: item.total + " pieces",
        date: item.date
    })),

    ...products.map(item => ({
        id: item.id,
        name: item.name,
        category: "Finished Product",
        quantity: item.quantity + " " + item.unit,
        date: item.date
    }))

];

allResources.sort((a, b) => b.date.localeCompare(a.date));

allResources.slice(0, 5).forEach(item => {

    dashboardTable.innerHTML += `
        <tr>
            <td>${escapeHTML(item.id)}</td>
            <td>${escapeHTML(item.name)}</td>
            <td>${escapeHTML(item.category)}</td>
            <td>${escapeHTML(item.quantity)}</td>
            <td>${escapeHTML(item.date)}</td>
        </tr>
    `;

});

if (allResources.length === 0) {

    dashboardTable.innerHTML = `
        <tr>
            <td colspan="5">No resources added yet.</td>
        </tr>
    `;

}


}

// =================================
// INITIALIZE APPLICATION
// =================================

displayRawMaterials();

displayPackaging();

displayProducts();

updateDashboard();

calculatePackaging();

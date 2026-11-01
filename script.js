// Get resources from Local Storage

let resources = JSON.parse(localStorage.getItem("resources")) || [];

// Display different sections

function showSection(sectionId) {


document.querySelectorAll(".section").forEach(section => {
    section.classList.add("hidden");
});

document.getElementById(sectionId).classList.remove("hidden");

displayResources();
updateDashboard();
displayAlerts();


}

// Save resources to Local Storage

function saveData() {


localStorage.setItem("resources", JSON.stringify(resources));


}

// Determine resource status

function getStatus(resource) {


if (resource.quantity === 0) {
    return "Out of Stock";
}

if (resource.quantity <= resource.minimumStock) {
    return "Low Stock";
}

return "In Stock";


}

// Add or Update Resource

document.getElementById("resourceForm").addEventListener("submit", function(event) {


event.preventDefault();

const editId = document.getElementById("editId").value;

const name = document.getElementById("resourceName").value.trim();
const category = document.getElementById("category").value;
const quantity = Number(document.getElementById("quantity").value);
const unit = document.getElementById("unit").value.trim();
const minimumStock = Number(document.getElementById("minimumStock").value);

if (!name || !category || !unit ||
    !Number.isFinite(quantity) || quantity < 0 ||
    !Number.isFinite(minimumStock) || minimumStock < 0) {

    alert("Please enter valid resource details.");
    return;
}

if (editId !== "") {

    const resource = resources.find(r => r.id === editId);

    if (resource) {
        resource.name = name;
        resource.category = category;
        resource.quantity = quantity;
        resource.unit = unit;
        resource.minimumStock = minimumStock;
    }

    document.getElementById("submitButton").innerText = "Add Resource";

} else {

    const newResource = {
        id: "R" + Date.now(),
        name,
        category,
        quantity,
        unit,
        minimumStock
    };

    resources.push(newResource);

}

saveData();

this.reset();

document.getElementById("editId").value = "";

displayResources();
updateDashboard();
displayAlerts();


});

// Display Resources

function displayResources() {


const table = document.getElementById("resourceTable");

const searchValue = document.getElementById("search").value.toLowerCase();

table.innerHTML = "";

const filteredResources = resources.filter(resource =>
    resource.name.toLowerCase().includes(searchValue) ||
    resource.category.toLowerCase().includes(searchValue) ||
    resource.id.toLowerCase().includes(searchValue)
);

filteredResources.forEach(resource => {

    const status = getStatus(resource);

    let statusClass = "in-stock";

    if (status === "Low Stock") {
        statusClass = "low-stock";
    }

    if (status === "Out of Stock") {
        statusClass = "out-stock";
    }

    table.innerHTML += `
        <tr>
            <td>${resource.id}</td>
            <td>${escapeHTML(resource.name)}</td>
            <td>${escapeHTML(resource.category)}</td>
            <td>${resource.quantity} ${escapeHTML(resource.unit)}</td>
            <td class="status ${statusClass}">${status}</td>
            <td>
                <button class="edit-btn"
                    onclick="editResource('${resource.id}')">Edit</button>

                <button class="delete-btn"
                    onclick="deleteResource('${resource.id}')">Delete</button>
            </td>
        </tr>
    `;

});

if (filteredResources.length === 0) {
    table.innerHTML = `<tr><td colspan="6">No resources found.</td></tr>`;
}


}

// Escape user-entered text before displaying it in HTML

function escapeHTML(value) {


return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
})[character]);


}

// Edit Resource

function editResource(id) {


const resource = resources.find(r => r.id === id);

if (!resource) return;

document.getElementById("editId").value = resource.id;
document.getElementById("resourceName").value = resource.name;
document.getElementById("category").value = resource.category;
document.getElementById("quantity").value = resource.quantity;
document.getElementById("unit").value = resource.unit;
document.getElementById("minimumStock").value = resource.minimumStock;

document.getElementById("submitButton").innerText = "Update Resource";

document.getElementById("resourceForm").scrollIntoView({
    behavior: "smooth"
});


}

// Delete Resource

function deleteResource(id) {


if (confirm("Are you sure you want to delete this resource?")) {

    resources = resources.filter(resource => resource.id !== id);

    saveData();

    displayResources();
    updateDashboard();
    displayAlerts();

}


}

// Update Dashboard

function updateDashboard() {


const total = resources.length;

const inStock = resources.filter(r => getStatus(r) === "In Stock").length;

const lowStock = resources.filter(r => getStatus(r) === "Low Stock").length;

const outStock = resources.filter(r => getStatus(r) === "Out of Stock").length;

document.getElementById("totalResources").innerText = total;

document.getElementById("inStock").innerText = inStock;

document.getElementById("lowStock").innerText = lowStock;

document.getElementById("outStock").innerText = outStock;


const dashboardTable = document.getElementById("dashboardTable");

dashboardTable.innerHTML = "";

resources.slice(-5).reverse().forEach(resource => {

    dashboardTable.innerHTML += `
        <tr>
            <td>${resource.id}</td>
            <td>${escapeHTML(resource.name)}</td>
            <td>${resource.quantity} ${escapeHTML(resource.unit)}</td>
            <td>${getStatus(resource)}</td>
        </tr>
    `;

});


}

// Display Low Stock Alerts

function displayAlerts() {


const alertTable = document.getElementById("alertTable");

alertTable.innerHTML = "";

const lowResources = resources.filter(resource =>
    getStatus(resource) !== "In Stock"
);

lowResources.forEach(resource => {

    alertTable.innerHTML += `
        <tr>
            <td>${resource.id}</td>
            <td>${escapeHTML(resource.name)}</td>
            <td>${resource.quantity} ${escapeHTML(resource.unit)}</td>
            <td>${resource.minimumStock} ${escapeHTML(resource.unit)}</td>
        </tr>
    `;

});

if (lowResources.length === 0) {
    alertTable.innerHTML = `
        <tr>
            <td colspan="4">No stock alerts. All resources are sufficiently stocked.</td>
        </tr>
    `;
}


}

// Load application when page opens

displayResources();
updateDashboard();
displayAlerts();

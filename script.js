// Get saved data from Local Storage

let rawMaterials = JSON.parse(localStorage.getItem("rawMaterials")) || [];

let packagingMaterials = JSON.parse(localStorage.getItem("packagingMaterials")) || [];

let readyProducts = JSON.parse(localStorage.getItem("readyProducts")) || [];


// Save data in Local Storage

function saveData() {

    localStorage.setItem("rawMaterials", JSON.stringify(rawMaterials));

    localStorage.setItem("packagingMaterials", JSON.stringify(packagingMaterials));

    localStorage.setItem("readyProducts", JSON.stringify(readyProducts));

}


// Navigation between pages

function showPage(page, button) {

    document.getElementById("homePage").classList.add("hidden");

    document.getElementById("productsPage").classList.add("hidden");

    document.getElementById(page + "Page").classList.remove("hidden");

    document.querySelectorAll(".nav-btn").forEach(btn => {
        btn.classList.remove("active");
    });

    button.classList.add("active");

    if (page === "products") {
        displayStocks();
    }

}


// Show success message

function showMessage(message) {

    const msg = document.getElementById("message");

    msg.textContent = message;

    setTimeout(() => {
        msg.textContent = "";
    }, 2500);

}


// Add Raw Ingredients

document.getElementById("rawForm").addEventListener("submit", function(e) {

    e.preventDefault();

    const item = {
        id: Date.now(),
        name: document.getElementById("rawName").value.trim(),
        quantity: Number(document.getElementById("rawQty").value),
        unit: document.getElementById("rawUnit").value,
        minimum: Number(document.getElementById("rawMin").value),
        date: document.getElementById("rawDate").value
    };

    rawMaterials.push(item);

    saveData();

    this.reset();

    showMessage("Raw ingredient added successfully!");

});


// Add Packaging Materials

document.getElementById("packForm").addEventListener("submit", function(e) {

    e.preventDefault();

    const item = {
        id: Date.now(),
        name: document.getElementById("packName").value.trim(),
        size: document.getElementById("packSize").value.trim(),
        quantity: Number(document.getElementById("packQty").value),
        minimum: Number(document.getElementById("packMin").value),
        date: document.getElementById("packDate").value
    };

    packagingMaterials.push(item);

    saveData();

    this.reset();

    showMessage("Packaging material added successfully!");

});


// Add Ready Products

document.getElementById("readyForm").addEventListener("submit", function(e) {

    e.preventDefault();

    const item = {
        id: Date.now(),
        name: document.getElementById("readyName").value.trim(),
        quantity: Number(document.getElementById("readyQty").value),
        unit: document.getElementById("readyUnit").value,
        minimum: Number(document.getElementById("readyMin").value),
        date: document.getElementById("readyDate").value
    };

    readyProducts.push(item);

    saveData();

    this.reset();

    showMessage("Ready product added successfully!");

});


// Determine Stock Status

function getStatus(quantity, minimum) {

    if (quantity === 0) {
        return '<span class="status out-stock">● Out of Stock</span>';
    }

    else if (quantity <= minimum) {
        return '<span class="status low-stock">● Low Stock</span>';
    }

    else {
        return '<span class="status in-stock">● In Stock</span>';
    }

}


// Display Raw Ingredients

function displayRawMaterials(search) {

    const table = document.getElementById("rawTable");

    table.innerHTML = "";

    const filtered = rawMaterials.filter(item =>
        item.name.toLowerCase().includes(search)
    );

    if (filtered.length === 0) {
        table.innerHTML = `
            <tr>
                <td colspan="6">No raw ingredients found</td>
            </tr>
        `;
        return;
    }

    filtered.forEach(item => {

        table.innerHTML += `
            <tr>
                <td>${escapeHTML(item.name)}</td>
                <td>${item.quantity} ${escapeHTML(item.unit)}</td>
                <td>${item.minimum} ${escapeHTML(item.unit)}</td>
                <td>${escapeHTML(item.date)}</td>
                <td>${getStatus(item.quantity, item.minimum)}</td>
                <td>
                    <button class="delete-btn"
                        onclick="deleteItem('raw', ${item.id})">
                        Delete
                    </button>
                </td>
            </tr>
        `;

    });

}


// Display Packaging Materials

function displayPackagingMaterials(search) {

    const table = document.getElementById("packTable");

    table.innerHTML = "";

    const filtered = packagingMaterials.filter(item =>
        item.name.toLowerCase().includes(search)
    );

    if (filtered.length === 0) {
        table.innerHTML = `
            <tr>
                <td colspan="7">No packaging materials found</td>
            </tr>
        `;
        return;
    }

    filtered.forEach(item => {

        table.innerHTML += `
            <tr>
                <td>${escapeHTML(item.name)}</td>
                <td>${escapeHTML(item.size)}</td>
                <td>${item.quantity} Pieces</td>
                <td>${item.minimum} Pieces</td>
                <td>${escapeHTML(item.date)}</td>
                <td>${getStatus(item.quantity, item.minimum)}</td>
                <td>
                    <button class="delete-btn"
                        onclick="deleteItem('pack', ${item.id})">
                        Delete
                    </button>
                </td>
            </tr>
        `;

    });

}


// Display Ready Products

function displayReadyProducts(search) {

    const table = document.getElementById("readyTable");

    table.innerHTML = "";

    const filtered = readyProducts.filter(item =>
        item.name.toLowerCase().includes(search)
    );

    if (filtered.length === 0) {
        table.innerHTML = `
            <tr>
                <td colspan="6">No ready products found</td>
            </tr>
        `;
        return;
    }

    filtered.forEach(item => {

        table.innerHTML += `
            <tr>
                <td>${escapeHTML(item.name)}</td>
                <td>${item.quantity} ${escapeHTML(item.unit)}</td>
                <td>${item.minimum} ${escapeHTML(item.unit)}</td>
                <td>${escapeHTML(item.date)}</td>
                <td>${getStatus(item.quantity, item.minimum)}</td>
                <td>
                    <button class="delete-btn"
                        onclick="deleteItem('ready', ${item.id})">
                        Delete
                    </button>
                </td>
            </tr>
        `;

    });

}


// Display all three categories

function displayStocks() {

    const search = document.getElementById("searchInput").value
        .trim().toLowerCase();

    displayRawMaterials(search);

    displayPackagingMaterials(search);

    displayReadyProducts(search);

}


// Search Functionality

document.getElementById("searchInput").addEventListener("input", function() {

    displayStocks();

});


// Delete Stock

function deleteItem(category, id) {

    if (!confirm("Are you sure you want to delete this item?")) {
        return;
    }

    if (category === "raw") {

        rawMaterials = rawMaterials.filter(item => item.id !== id);

    }

    else if (category === "pack") {

        packagingMaterials = packagingMaterials.filter(item => item.id !== id);

    }

    else if (category === "ready") {

        readyProducts = readyProducts.filter(item => item.id !== id);

    }

    saveData();

    displayStocks();

}


// Prevent HTML entered as item names from being interpreted as markup

function escapeHTML(value) {

    return String(value).replace(/[&<>"']/g, function(char) {

        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return entities[char];

    });

}


// Display saved stocks when the page loads

displayStocks();
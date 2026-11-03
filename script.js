// Minimum stock is fixed to 5 units
const MINIMUM_STOCK = 5;


// Load data from Local Storage
let rawMaterials =
    JSON.parse(localStorage.getItem("rawMaterials")) || [];

let packagingMaterials =
    JSON.parse(localStorage.getItem("packagingMaterials")) || [];

let readyProducts =
    JSON.parse(localStorage.getItem("readyProducts")) || [];


// Generate today's date automatically
function getTodayDate() {

    const today = new Date();

    return today.getFullYear() + "-" +
        String(today.getMonth() + 1).padStart(2, "0") + "-" +
        String(today.getDate()).padStart(2, "0");

}


// Save data to Local Storage
function saveData() {

    localStorage.setItem(
        "rawMaterials",
        JSON.stringify(rawMaterials)
    );

    localStorage.setItem(
        "packagingMaterials",
        JSON.stringify(packagingMaterials)
    );

    localStorage.setItem(
        "readyProducts",
        JSON.stringify(readyProducts)
    );

}


// Navigation between pages
function showPage(page) {

    const homePage = document.getElementById("homePage");
    const productsPage = document.getElementById("productsPage");

    const homeMenu = document.getElementById("homeMenu");
    const productsMenu = document.getElementById("productsMenu");

    if (page === "home") {

        homePage.style.display = "block";
        productsPage.style.display = "none";

        homeMenu.classList.add("active");
        productsMenu.classList.remove("active");

    }

    else {

        homePage.style.display = "none";
        productsPage.style.display = "block";

        homeMenu.classList.remove("active");
        productsMenu.classList.add("active");

        displayStocks();

    }

}


// Add Raw Ingredient
function addRawIngredient() {

    const name =
        document.getElementById("rawName").value.trim();

    const quantity =
        Number(document.getElementById("rawQuantity").value);

    const unit =
        document.getElementById("rawUnit").value;


    if (name === "" ||
        document.getElementById("rawQuantity").value === "" ||
        !Number.isFinite(quantity) ||
        quantity < 0) {

        alert("Please enter a valid ingredient name and quantity.");
        return;

    }


    const item = {

        id: Date.now(),

        name: name,

        quantity: quantity,

        unit: unit,

        minimum: MINIMUM_STOCK,

        date: getTodayDate()

    };


    rawMaterials.push(item);

    saveData();

    document.getElementById("rawName").value = "";
    document.getElementById("rawQuantity").value = "";

    alert("Raw ingredient added successfully!");

}


// Add Packaging Material
function addPackagingMaterial() {

    const name =
        document.getElementById("packName").value.trim();

    const size =
        document.getElementById("packSize").value.trim();

    const quantity =
        Number(document.getElementById("packQuantity").value);


    if (name === "" ||
        size === "" ||
        document.getElementById("packQuantity").value === "" ||
        !Number.isFinite(quantity) ||
        quantity < 0) {

        alert("Please enter valid packaging details.");
        return;

    }


    const item = {

        id: Date.now(),

        name: name,

        size: size,

        quantity: quantity,

        minimum: MINIMUM_STOCK,

        date: getTodayDate()

    };


    packagingMaterials.push(item);

    saveData();

    document.getElementById("packName").value = "";
    document.getElementById("packSize").value = "";
    document.getElementById("packQuantity").value = "";

    alert("Packaging material added successfully!");

}


// Add Ready Product
function addReadyProduct() {

    const name =
        document.getElementById("readyName").value.trim();

    const quantity =
        Number(document.getElementById("readyQuantity").value);

    const unit =
        document.getElementById("readyUnit").value;


    if (name === "" ||
        document.getElementById("readyQuantity").value === "" ||
        !Number.isFinite(quantity) ||
        quantity < 0) {

        alert("Please enter a valid product name and quantity.");
        return;

    }


    const item = {

        id: Date.now(),

        name: name,

        quantity: quantity,

        unit: unit,

        minimum: MINIMUM_STOCK,

        date: getTodayDate()

    };


    readyProducts.push(item);

    saveData();

    document.getElementById("readyName").value = "";
    document.getElementById("readyQuantity").value = "";

    alert("Ready product added successfully!");

}


// Get Stock Status
function getStatus(quantity) {

    if (quantity === 0) {

        return '<span class="status out-stock">● Out of Stock</span>';

    }

    else if (quantity <= MINIMUM_STOCK) {

        return '<span class="status low-stock">● Low Stock</span>';

    }

    else {

        return '<span class="status in-stock">● In Stock</span>';

    }

}


// Update the three summary boxes
function updateSummary() {

    document.getElementById("rawCount").textContent =
        rawMaterials.length;

    document.getElementById("packCount").textContent =
        packagingMaterials.length;

    document.getElementById("readyCount").textContent =
        readyProducts.length;

}


// Display all stock records
function displayStocks() {

    const searchText =
        document.getElementById("searchInput").value.toLowerCase();


    const rawTable = document.getElementById("rawTable");
    const packTable = document.getElementById("packTable");
    const readyTable = document.getElementById("readyTable");


    rawTable.innerHTML = "";
    packTable.innerHTML = "";
    readyTable.innerHTML = "";


    // Display Raw Ingredients
    rawMaterials.forEach((item, index) => {

        if (item.name.toLowerCase().includes(searchText)) {

            rawTable.innerHTML += `

                <tr>

                    <td>${index + 1}</td>

                    <td>${item.name}</td>

                    <td>${item.quantity} ${item.unit}</td>

                    <td>${item.date}</td>

                    <td>${getStatus(item.quantity)}</td>

                    <td>
                        <button class="delete-btn"
                                onclick="deleteItem('raw', ${index})">
                            Delete
                        </button>
                    </td>

                </tr>

            `;

        }

    });


    // Display Packaging Materials
    packagingMaterials.forEach((item, index) => {

        if (item.name.toLowerCase().includes(searchText)) {

            packTable.innerHTML += `

                <tr>

                    <td>${index + 1}</td>

                    <td>${item.name}</td>

                    <td>${item.size}</td>

                    <td>${item.quantity} Pieces</td>

                    <td>${item.date}</td>

                    <td>${getStatus(item.quantity)}</td>

                    <td>
                        <button class="delete-btn"
                                onclick="deleteItem('pack', ${index})">
                            Delete
                        </button>
                    </td>

                </tr>

            `;

        }

    });


    // Display Ready Products
    readyProducts.forEach((item, index) => {

        if (item.name.toLowerCase().includes(searchText)) {

            readyTable.innerHTML += `

                <tr>

                    <td>${index + 1}</td>

                    <td>${item.name}</td>

                    <td>${item.quantity} ${item.unit}</td>

                    <td>${item.date}</td>

                    <td>${getStatus(item.quantity)}</td>

                    <td>
                        <button class="delete-btn"
                                onclick="deleteItem('ready', ${index})">
                            Delete
                        </button>
                    </td>

                </tr>

            `;

        }

    });


    // Update summary counts
    updateSummary();

}


// Delete Stock Item
function deleteItem(category, index) {

    const confirmDelete =
        confirm("Are you sure you want to delete this item?");


    if (!confirmDelete) {
        return;
    }


    if (category === "raw") {

        rawMaterials.splice(index, 1);

    }

    else if (category === "pack") {

        packagingMaterials.splice(index, 1);

    }

    else if (category === "ready") {

        readyProducts.splice(index, 1);

    }


    saveData();

    displayStocks();

}


// Initial display
displayStocks();
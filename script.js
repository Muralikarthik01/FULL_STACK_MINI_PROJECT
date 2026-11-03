// Minimum stock is fixed to 5 units
const MINIMUM_STOCK = 5;


// Load data from Local Storage
let rawMaterials =
    JSON.parse(localStorage.getItem("rawMaterials")) || [];

let packagingMaterials =
    JSON.parse(localStorage.getItem("packagingMaterials")) || [];

let readyProducts =
    JSON.parse(localStorage.getItem("readyProducts")) || [];


// Automatically generate today's date
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


// PAGE NAVIGATION
function showPage(page) {

    const homePage = document.getElementById("homePage");

    const productsPage = document.getElementById("productsPage");

    const valuationPage = document.getElementById("valuationPage");


    const homeMenu = document.getElementById("homeMenu");

    const productsMenu = document.getElementById("productsMenu");

    const valuationMenu = document.getElementById("valuationMenu");


    // Hide all pages
    homePage.style.display = "none";
    productsPage.style.display = "none";
    valuationPage.style.display = "none";


    // Remove active class
    homeMenu.classList.remove("active");
    productsMenu.classList.remove("active");
    valuationMenu.classList.remove("active");


    if (page === "home") {

        homePage.style.display = "block";

        homeMenu.classList.add("active");

    }

    else if (page === "products") {

        productsPage.style.display = "block";

        productsMenu.classList.add("active");

        displayStocks();

    }

    else if (page === "valuation") {

        valuationPage.style.display = "block";

        valuationMenu.classList.add("active");

        displayValuation();

    }

}


// ADD RAW INGREDIENT
function addRawIngredient() {

    const name =
        document.getElementById("rawName").value.trim();

    const quantityInput =
        document.getElementById("rawQuantity").value;

    const quantity = Number(quantityInput);

    const unit =
        document.getElementById("rawUnit").value;


    if (
        name === "" ||
        quantityInput === "" ||
        !Number.isFinite(quantity) ||
        quantity < 0
    ) {

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


// ADD PACKAGING MATERIAL
function addPackagingMaterial() {

    const name =
        document.getElementById("packName").value.trim();

    const size =
        document.getElementById("packSize").value.trim();

    const quantityInput =
        document.getElementById("packQuantity").value;

    const quantity = Number(quantityInput);


    if (
        name === "" ||
        size === "" ||
        quantityInput === "" ||
        !Number.isFinite(quantity) ||
        quantity < 0
    ) {

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


// ADD READY PRODUCT
function addReadyProduct() {

    const name =
        document.getElementById("readyName").value.trim();

    const quantityInput =
        document.getElementById("readyQuantity").value;

    const quantity = Number(quantityInput);

    const unit =
        document.getElementById("readyUnit").value;

    const priceInput =
        document.getElementById("readyPrice").value;

    const price = Number(priceInput);


    if (
        name === "" ||
        quantityInput === "" ||
        priceInput === "" ||
        !Number.isFinite(quantity) ||
        !Number.isFinite(price) ||
        quantity < 0 ||
        price < 0
    ) {

        alert("Please enter valid product details and price.");

        return;

    }


    const item = {

        id: Date.now(),

        name: name,

        quantity: quantity,

        unit: unit,

        price: price,

        minimum: MINIMUM_STOCK,

        date: getTodayDate()

    };


    readyProducts.push(item);

    saveData();


    document.getElementById("readyName").value = "";

    document.getElementById("readyQuantity").value = "";

    document.getElementById("readyPrice").value = "";


    alert("Ready product added successfully!");

}


// GET STOCK STATUS
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


// UPDATE STOCK INDICATOR COUNTS
function updateStockIndicator() {

    // Combine all three categories
    const allMaterials = [
        ...rawMaterials,
        ...packagingMaterials,
        ...readyProducts
    ];


    let outStock = 0;

    let lowStock = 0;

    let inStock = 0;


    allMaterials.forEach(item => {

        if (item.quantity === 0) {

            outStock++;

        }

        else if (item.quantity <= MINIMUM_STOCK) {

            lowStock++;

        }

        else {

            inStock++;

        }

    });


    document.getElementById("outCount").textContent = outStock;

    document.getElementById("lowCount").textContent = lowStock;

    document.getElementById("inCount").textContent = inStock;

}


// DISPLAY ALL STOCKS
function displayStocks() {

    const searchText =
        document.getElementById("searchInput").value.toLowerCase();


    const rawTable = document.getElementById("rawTable");

    const packTable = document.getElementById("packTable");

    const readyTable = document.getElementById("readyTable");


    rawTable.innerHTML = "";

    packTable.innerHTML = "";

    readyTable.innerHTML = "";


    // RAW INGREDIENTS
    rawMaterials.forEach((item, index) => {

        if (item.name.toLowerCase().includes(searchText)) {

            rawTable.innerHTML += `

                <tr>

                    <td>${index + 1}</td>

                    <td>${item.name}</td>

                    <td>${item.quantity} ${item.unit}</td>

                    <td>${item.date || "-"}</td>

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


    // PACKAGING MATERIALS
    packagingMaterials.forEach((item, index) => {

        if (item.name.toLowerCase().includes(searchText)) {

            packTable.innerHTML += `

                <tr>

                    <td>${index + 1}</td>

                    <td>${item.name}</td>

                    <td>${item.size}</td>

                    <td>${item.quantity} Pieces</td>

                    <td>${item.date || "-"}</td>

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


    // READY PRODUCTS
    readyProducts.forEach((item, index) => {

        if (item.name.toLowerCase().includes(searchText)) {

            readyTable.innerHTML += `

                <tr>

                    <td>${index + 1}</td>

                    <td>${item.name}</td>

                    <td>${item.quantity} ${item.unit}</td>

                    <td>${item.date || "-"}</td>

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


    // Update stock indicator boxes
    updateStockIndicator();

}


// DELETE STOCK ITEM
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


// FORMAT PRICE IN INDIAN RUPEES
function formatPrice(value) {

    return Number(value).toLocaleString("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 2
    });

}


// DISPLAY PRODUCT VALUATION
function displayValuation() {

    const valuationTable =
        document.getElementById("valuationTable");


    valuationTable.innerHTML = "";


    let totalStockValue = 0;


    readyProducts.forEach((item, index) => {

        // Support older records without a price field
        const price = Number(item.price) || 0;

        const totalPrice = item.quantity * price;

        totalStockValue += totalPrice;


        valuationTable.innerHTML += `

            <tr>

                <td>${index + 1}</td>

                <td>${item.name}</td>

                <td>${item.quantity} ${item.unit}</td>

                <td>${formatPrice(price)}</td>

                <td>${formatPrice(totalPrice)}</td>

            </tr>

        `;

    });


    // Display number of ready products
    document.getElementById("valuationCount").textContent =
        readyProducts.length;


    // Display total stock value
    document.getElementById("totalValue").textContent =
        formatPrice(totalStockValue);


    // Display message if there are no products
    if (readyProducts.length === 0) {

        valuationTable.innerHTML = `

            <tr>

                <td colspan="5">No ready products available.</td>

            </tr>

        `;

    }

}


// INITIAL DISPLAY
displayStocks();
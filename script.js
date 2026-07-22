

const groceryData = {

    "🥛 Dairy": ["Milk","Curd","Butter","Paneer","Cheese","Ghee","Yogurt","Cream"],

    "🥬 Vegetables": ["Onion","Potato","Tomato","Carrot", "Brinjal", "Cabbage",  "Cauliflower","Spinach","Green Chilli",  "Coriander" ],

    "🍎 Fruits": [ "Apple",
        "Banana",
        "Orange",
        "Mango",
        "Grapes",
        "Guava",
        "Papaya",
        "Watermelon"
    ],

    "🥫 Grocery": [
        "Rice",
        "Sugar",
        "Salt",
        "Oil",
        "Wheat Flour",
        "Tea Powder",
        "Coffee",
        "Turmeric",
        "Chilli Powder",
        "Toor Dal",
        "Moong Dal"
    ],

    "🍞 Bakery": [
        "Bread",
        "Bun",
        "Cake",
        "Cookies",
        "Pizza Base"
    ],

    "🥤 Beverages": [
        "Juice",
        "Soft Drinks",
        "Water Bottle",
        "Energy Drink"
    ],

    "🍪 Snacks": [
        "Biscuits",
        "Chips",
        "Chocolate",
        "Noodles",
        "Popcorn"
    ],

    "🧴 Household": [
        "Soap",
        "Shampoo",
        "Toothpaste",
        "Hand Wash",
        "Face Wash",
        "Body Lotion"
    ],

    "🧹 Cleaning": [
        "Detergent",
        "Dish Wash",
        "Floor Cleaner",
        "Toilet Cleaner",
        "Garbage Bags"
    ],

    "🥩 Meat": [
        "Chicken",
        "Mutton",
        "Eggs"
    ],

    "🐟 Seafood": [
        "Fish",
        "Prawns",
        "Crab"
    ]

};



const categoryList = document.getElementById("category-list");
const itemList = document.getElementById("item-list");

const categorySection = document.getElementById("category-section");
const itemSection = document.getElementById("item-section");

const categoryTitle = document.getElementById("categoryTitle");

const search = document.getElementById("search");
const itemSearch = document.getElementById("itemSearch");

const shoppingList = document.getElementById("shopping-list");
const completedList = document.getElementById("completed-list");

const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");

const backBtn = document.getElementById("backBtn");

const clearAll = document.getElementById("clearAll");

let currentCategory = "";

let shoppingItems =
JSON.parse(localStorage.getItem("shoppingItems")) || [];

function saveData(){

    localStorage.setItem(

        "shoppingItems",

        JSON.stringify(shoppingItems)

    );

}
function createCategoryCard(category){

    const card = document.createElement("div");

    card.className = "card";

    card.innerHTML = `
        <h3>${category}</h3>
        <p>${groceryData[category].length} Items</p>
    `;

    card.onclick = () => {

        openCategory(category);

    };

    categoryList.appendChild(card);

}

function showCategories(list){

    categoryList.innerHTML = "";

    list.forEach(category=>{

        createCategoryCard(category);

    });

}


function openCategory(category){

    currentCategory = category;

    categoryTitle.innerHTML = category;

    categorySection.classList.add("hide");

    itemSection.classList.remove("hide");

    showItems(groceryData[category]);

}


function showItems(items){

    itemList.innerHTML = "";

    items.forEach(item=>{

        const selected = shoppingItems.some(

            grocery=>grocery.name===item

        );

        const card = document.createElement("div");

        card.className = selected

            ? "item-card selected"

            : "item-card";

        card.innerHTML = `

            <h3>${item}</h3>

            <button>

                ${selected ? "Remove" : "Add"}

            </button>

        `;

        card.onclick = ()=>{

            toggleItem(item);

        };

        itemList.appendChild(card);

    });

}


function toggleItem(item){

    const index = shoppingItems.findIndex(

        grocery => grocery.name === item

    );

    if(index > -1){

        shoppingItems.splice(index,1);

    }else{

        shoppingItems.push({

            name:item,

            completed:false

        });

    }

    saveData();

    showItems(groceryData[currentCategory]);

    showShoppingList();

    showCompleted();

    updateProgress();

}



function showShoppingList(){

    shoppingList.innerHTML="";

    const pending = shoppingItems.filter(

        item => !item.completed

    );

    if(pending.length===0){

        shoppingList.innerHTML=`
            <p class="empty">
                No Items Selected
            </p>
        `;

        return;

    }

    pending.forEach(item=>{

        const row=document.createElement("div");

        row.className="item";

        row.innerHTML=`

            <span>${item.name}</span>

            <button>

                Buy

            </button>

        `;

        row.querySelector("button").onclick=()=>{

            item.completed=true;

            saveData();

            showShoppingList();

            showCompleted();

            updateProgress();

        };

        shoppingList.appendChild(row);

    });

}


function showCompleted(){

    completedList.innerHTML="";

    const completed = shoppingItems.filter(

        item=>item.completed

    );

    if(completed.length===0){

        completedList.innerHTML=`
            <p class="empty">
                Nothing Completed
            </p>
        `;

        return;

    }

    completed.forEach(item=>{

        const row=document.createElement("div");

        row.className="item completed";

        row.innerHTML=`

            <span>

                ✔ ${item.name}

            </span>

        `;

        completedList.appendChild(row);

    });

}

search.addEventListener("keyup", () => {

    const value = search.value.trim().toLowerCase();

    if (value === "") {

        showCategories(Object.keys(groceryData));
        return;

    }

    categoryList.innerHTML = "";

    Object.keys(groceryData).forEach(category => {

        if (category.toLowerCase().includes(value)) {

            createCategoryCard(category);

            return;
        }

        // Item matches
        const found = groceryData[category].some(item =>
            item.toLowerCase().includes(value)
        );

        if (found) {

            createCategoryCard(category);

        }

    });

});


itemSearch.addEventListener("keyup",()=>{

    const value=itemSearch.value.toLowerCase();

    const filtered=groceryData[currentCategory].filter(

        item=>

        item.toLowerCase().includes(value)

    );

    showItems(filtered);

});


backBtn.onclick=()=>{

    itemSection.classList.add("hide");

    categorySection.classList.remove("hide");

    itemSearch.value="";

};


function updateProgress(){

    const total = shoppingItems.length;

    const completed = shoppingItems.filter(

        item=>item.completed

    ).length;

    let percent = 0;

    if(total>0){

        percent = (completed/total)*100;

    }

    progressBar.style.width = percent + "%";

    progressText.innerHTML =

        completed +

        " / " +

        total +

        " Purchased";

}

clearAll.onclick = () => {

    if(confirm("Clear all saved shopping data?")){

        localStorage.removeItem("shoppingItems");

        shoppingItems = [];

        refresh();

        if(!itemSection.classList.contains("hide")){

            showItems(groceryData[currentCategory]);

        }

    }

};


function refresh(){

    showShoppingList();

    showCompleted();

    updateProgress();

}


function checkShoppingCompleted(){

    if(shoppingItems.length === 0){

        return;

    }

    const allCompleted = shoppingItems.every(

        item => item.completed

    );

    if(allCompleted){

        setTimeout(()=>{

            alert("🎉 Congratulations!\n\nAll grocery items have been purchased.");

        },200);

    }

}

function updateProgress(){

    const total = shoppingItems.length;

    const completed = shoppingItems.filter(

        item => item.completed

    ).length;

    const percent = total === 0 ? 0 : (completed / total) * 100;

    progressBar.style.width = percent + "%";

    progressText.innerHTML = `${completed} / ${total} Purchased`;

    checkShoppingCompleted();

}


showCategories(Object.keys(groceryData));

refresh();

if(!itemSection.classList.contains("hide")){

    showItems(groceryData[currentCategory]);

}
if ("serviceWorker" in navigator) {

    window.addEventListener("load", () => {

        navigator.serviceWorker.register("service-worker.js")

        .then(() => {

            console.log("Service Worker Registered");

        })

        .catch(error => {

            console.log(error);

        });

    });

}
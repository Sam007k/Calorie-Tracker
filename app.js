// Storage Controller

// Item Controller
const itemCtrl = (function () {
  // Item Constructor
  // ---------------------------------------------------------------------------------------------------------------------
  const Item = function (id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  };
  // ---------------------------------------------------------------------------------------------------------------------

  //   Data Structure / State
  const data = {
    items: [
      // { id: 0, name: "Steak Dinner", calories: "1200" },
      // { id: 1, name: "Cookie", calories: "400" },
      // { id: 3, name: "Eggs", calories: "300" },
    ],
    currentItem: null,
    totalCalories: 0,
  };

  // Public Methods
  return {
    getItems: function () {
      return data.items;
    },
    addItem: function (name, calories) {
      let ID;
      // Create ID
      if (data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }

      // Calories to Number
      calories = parseInt(calories);

      // Create new item
      newItem = new Item(ID, name, calories);

      // Add to items arrray
      data.items.push(newItem);

      return newItem;
    },
    getItemById: function (id) {
      let found = null;
      data.items.forEach((item) => {
        if (item.id === id) {
          found = item;
        }
      });
      return found;
    },
    getTotalCalories: function () {
      let total = 0;

      // Loop through item and cals
      data.items.forEach((item) => {
        total += item.calories;
      });
      // Set total cal in data structure
      data.totalCalories = total;

      // Return total
      return data.totalCalories;
    },
    logData: function () {
      return data;
    },
  };
})();

// UI Controller

const UICtrl = (function () {
  // ---------------------------------------------------------------------------------------------------------------------
  const UISelectors = {
    itemList: "#item-list",
    addBtn: ".add-btn",
    updateBtn: ".update-btn",
    deleteBtn: ".delete-btn",
    backBtn: ".back-btn",
    itemNameInput: "#item-name",
    itemCalorieInput: "#item-calories",
    totalCalories: ".total-calories",
  };
  // ---------------------------------------------------------------------------------------------------------------------

  // Public Methods
  return {
    populateItemList: function (items) {
      let html = "";
      items.forEach((item) => {
        //show fixed items
        html += `
           <li class="collection-item" id="item-${item.id}">
          <strong>${item.name}: </strong> <em>${item.calories} Calories</em>                                    
          <a href="#" class="secondary-content"
            ><i class="edit-item fas fa-pencil-alt"></i
          ></a>
        </li>        
          `;
      });

      // Insert list items
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },
    getSelectors: function () {
      return UISelectors;
    },
    addListItem: function (item) {
      // show list item
      document.querySelector(UISelectors.itemList).style.display = "block";
      // Create li element
      const li = document.createElement("li");
      // Add class name                                                                                    //Add item to List
      li.className = "collection-item";
      // Add ID
      li.id = `item-${item.id}`;
      // Add HTML
      li.innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
      <a href="#" class="secondary-content"
        ><i class="edit-item fas fa-pencil-alt"></i
      ></a>`;
      // Insert Item
      document
        .querySelector(UISelectors.itemList)
        .insertAdjacentElement("beforeend", li);
    },
    clearInput: function () {
      // Clear Input of name & Calories
      document.querySelector(UISelectors.itemNameInput).value = "";
      document.querySelector(UISelectors.itemCalorieInput).value = "";
    },
    hideItemList: function () {
      document.querySelector(UISelectors.itemList).style.display = "none";
    },
    showTotalCalories: function (totalCalories) {
      //Show Total calories
      document.querySelector(UISelectors.totalCalories).textContent =
        totalCalories;
    },
    clearEditState: function () {
      //Clear all btn except add
      UICtrl.clearInput();
      document.querySelector(UISelectors.updateBtn).style.display = "none";
      document.querySelector(UISelectors.deleteBtn).style.display = "none";
      document.querySelector(UISelectors.backBtn).style.display = "none";
      document.querySelector(UISelectors.addBtn).style.display = "inline";
    },
    getItemInput: function () {
      return {
        name: document.querySelector(UISelectors.itemNameInput).value, //Get value of inputs
        calories: document.querySelector(UISelectors.itemCalorieInput).value,
      };
    },
  };
})();

// App Controller
const App = (function (itemCtrl, UICtrl) {
  //Load Event Listeners
  // ---------------------------------------------------------------------------------------------------------------------
  const loadEventListeners = function () {
    // Get UI Selectors
    const UISelectors = UICtrl.getSelectors();

    // Add Item Event
    document
      .querySelector(UISelectors.addBtn)
      .addEventListener("click", itemAddSubmit); //Contains all Event Listeners

    // Edit icon click event
    document
      .querySelector(UISelectors.itemList)
      .addEventListener("click", itemUpdateSubmit);
  };
  // ------------------------------------------------------------------------------------------------------------------------

  // Add item Submit
  // ------------------------------------------------------------------------------------------------------------------------
  const itemAddSubmit = function (e) {
    const input = UICtrl.getItemInput();

    // Checl name and calorie input
    if (input.name !== "" && input.calories !== "") {
      // Add new Item
      const newItem = itemCtrl.addItem(input.name, input.calories);

      // Add item to UI
      UICtrl.addListItem(newItem); //Add Item to List

      // Get Total Calories
      const totalCalories = itemCtrl.getTotalCalories();

      // show Total Calories
      UICtrl.showTotalCalories(totalCalories);

      // Clear Inputs
      UICtrl.clearInput();
    }

    e.preventDefault();
  };
  // ------------------------------------------------------------------------------------------------------------------------

  // Update item Submit
  // ------------------------------------------------------------------------------------------------------------------------
  const itemUpdateSubmit = function (e) {
    if (e.target.classList.contains("edit-item")) {
      //  Get list item id (item-0, item-1)
      const listId = e.target.parentNode.parentNode.id;

      // Break into an array
      const listIdArr = listId.split("-");

      // Get the actual id                                                                                //Update Item in List
      const id = parseInt(listIdArr[1]);

      // Get Item
      const itemToEdit = itemCtrl.getItemById(id);

      console.log(itemToEdit);
    }

    e.preventDefault();
  };
  // ------------------------------------------------------------------------------------------------------------------------

  // Public Methods
  return {
    init: function () {
      // Clear edit state / Set initial State
      UICtrl.clearEditState();

      // Fetch items from data Structure
      const items = itemCtrl.getItems();

      // Check if any items
      if (items.length === 0) {
        UICtrl.hideItemList();
      } else {
        // Populate list with items
        UICtrl.populateItemList(items);
      }

      // Get Total Calories
      const totalCalories = itemCtrl.getTotalCalories();

      // show Total Calories
      UICtrl.showTotalCalories(totalCalories);

      // Load Event Listeners
      loadEventListeners();
    },
  };
})(itemCtrl, UICtrl);

App.init();

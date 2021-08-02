// STORAGE CONTROLLER
const StorageCtrl = (function () {
  // Public Methods
  // -----------------------------------------------------------
  return {
    storeItem: function (item) {
      let items;
      if (localStorage.getItem("items") === null) {
        items = [];

        // Push new item in items
        items.push(item);

        // Set item in LS
        items = localStorage.setItem("items", JSON.stringify(items));
      } else {
        items = JSON.parse(localStorage.getItem("items"));

        // Push new item in items
        items.push(item);

        // Reset item in LS
        items = localStorage.setItem("items", JSON.stringify(items));
      }
    },
    getItemsFromStorage: function () {
      let items;
      if (localStorage.getItem("items") === null) {
        items = [];
      } else {
        // Get items from LS
        items = JSON.parse(localStorage.getItem("items"));
      }
      return items;
    },
    updateItemInStorage: function (updatedItem) {
      // Get items from LS
      items = JSON.parse(localStorage.getItem("items"));

      items.forEach((item, index) => {
        if (updatedItem.id === item.id) {
          items.splice(index, 1, updatedItem);
        }
      });

      // Reset item in LS
      items = localStorage.setItem("items", JSON.stringify(items));
    },
    deleteItemFromStorage: function (id) {
      items = JSON.parse(localStorage.getItem("items"));

      items.forEach((item, index) => {
        if (item.id === id) {
          items.splice(index, 1);
        }
      });

      // Reset item in LS
      items = localStorage.setItem("items", JSON.stringify(items));
    },
    clearItemsFromStorage: function () {
      localStorage.removeItem("items");
    },
  };
})();
// -----------------------------------------------------------
// ITEM CONTROLLER
const ItemCtrl = (function () {
  // Item Constructor
  // -----------------------------------------------------------
  const Item = function (id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  };
  // -----------------------------------------------------------

  // Data Structure / State
  // -----------------------------------------------------------
  const data = {
    // items: [
    //   // { id: 0, name: "Steak Dinner", calories: 1200 },
    //   // { id: 1, name: "Cookie", calories: 400 },
    //   // { id: 2, name: "Eggs", calories: 300 },
    // ],
    items: StorageCtrl.getItemsFromStorage(),
    currentItem: null,
    totalCalories: 0,
  };
  // -----------------------------------------------------------

  // Public Methods
  // -----------------------------------------------------------

  return {
    getItems: function () {
      return data.items;
    },
    addItem: function (name, calories) {
      let ID;
      //Create ID
      if (data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }

      // Convert Calories to number
      calories = parseInt(calories);

      // Create new Item
      const newItem = new Item(ID, name, calories);

      data.items.push(newItem);

      return newItem;
    },
    getTotalCalories: function () {
      let total = 0;
      data.items.forEach((item) => {
        total += item.calories;
      });
      // Set total cal in data structure
      data.totalCalories = total;

      // Return total
      return data.totalCalories;
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
    setCurrentItem: function (item) {
      data.currentItem = item;
    },
    getCurrentItem: function () {
      return data.currentItem;
    },
    updateItem: function (name, calories) {
      //Convert calories to integer
      calories = parseInt(calories);

      let found = null;
      data.items.forEach((item) => {
        if (item.id === data.currentItem.id) {
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });
      return found;
    },
    deleteItem: function (id) {
      // Get Ids
      const ids = data.items.map((item) => {
        return item.id;
      });

      // Get index
      const index = ids.indexOf(id);

      // Remove item
      data.items.splice(index, 1);
    },
    clearAllItem: function () {
      data.items = [];
    },
  };
  // -----------------------------------------------------------
})();

// UI CONTROLLER

const UICtrl = (function () {
  // UI Selectors
  const UISelectors = {
    itemList: "#item-list",
    listItems: ".collection-item",
    addBtn: ".add-btn",
    updateBtn: ".update-btn",
    deleteBtn: ".delete-btn",
    backBtn: ".back-btn",
    clearBtn: ".clear-btn",
    itemNameInput: "#item-name",
    itemCalorieInput: "#item-calories",
    totalCalories: ".total-calories",
  };
  // Public Methods
  // -----------------------------------------------------------
  return {
    //Clear all btn except add
    clearEditState: function () {
      document.querySelector(UISelectors.updateBtn).style.display = "none";
      document.querySelector(UISelectors.deleteBtn).style.display = "none";
      document.querySelector(UISelectors.backBtn).style.display = "none";
      document.querySelector(UISelectors.addBtn).style.display = "inline";
    },
    showEditState: function () {
      document.querySelector(UISelectors.updateBtn).style.display = "inline";
      document.querySelector(UISelectors.deleteBtn).style.display = "inline";
      document.querySelector(UISelectors.backBtn).style.display = "inline";
      document.querySelector(UISelectors.addBtn).style.display = "none";
    },
    getSelectors: function () {
      return UISelectors;
    },
    populateItemList: function (items) {
      let html = "";
      items.forEach((item) => {
        html += `
            <li class="collection-item" id="item-${item.id}">
          <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
          <a href="#" class="secondary-content"
            ><i class="edit-item fas fa-pencil-alt"></i
          ></a>
        </li>
            `;
      });

      //   Display all items
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },
    getItemInput: function () {
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCalorieInput).value,
      };
    },
    addListItem: function (item) {
      // create li element
      const li = document.createElement("li");
      // Add class
      li.classList = "collection-item";
      // Add id
      li.id = `item-${item.id}`;
      // li html
      li.innerHTML = `
        <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
      <a href="#" class="secondary-content"
        ><i class="edit-item fas fa-pencil-alt"></i
      ></a>
        `;
      // Insert Item
      document
        .querySelector(UISelectors.itemList)
        .insertAdjacentElement("beforeend", li);
    },
    clearInput: function () {
      return {
        name: (document.querySelector(UISelectors.itemNameInput).value = ""),
        calories: (document.querySelector(UISelectors.itemCalorieInput).value =
          ""),
      };
    },
    showTotalCalories: function (totalCalories) {
      document.querySelector(UISelectors.totalCalories).textContent =
        totalCalories;
    },
    addItemToForm: function () {
      UICtrl.showEditState();

      document.querySelector(UISelectors.itemNameInput).value =
        ItemCtrl.getCurrentItem().name;
      document.querySelector(UISelectors.itemCalorieInput).value =
        ItemCtrl.getCurrentItem().calories;
    },
    updateListItem: function (item) {
      // Get all list items
      let listItems = document.querySelectorAll(UISelectors.listItems);

      // Turn Node list into array
      listItems = Array.from(listItems);

      listItems.forEach((listItem) => {
        const itemId = listItem.getAttribute("id");

        if (itemId === `item-${item.id}`) {
          document.querySelector(`#${itemId}`).innerHTML = `          
        <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content"
          ><i class="edit-item fas fa-pencil-alt"></i
        ></a>          
          `;
        }
      });
    },
    deleteListItem: function (id) {
      const itemID = `#item-${id}`;
      const item = document.querySelector(itemID);
      item.remove();
    },
    clearAllItems: function () {
      // Get all list items
      let listItems = document.querySelectorAll(UISelectors.listItems);

      // Turn Node list into array
      listItems = Array.from(listItems);

      listItems.forEach((listItem) => {
        listItem.remove();
      });
    },
    removeItemList: function () {
      document.querySelector(UISelectors.itemList).style.display = "none";
    },
    showItemList: function () {
      document.querySelector(UISelectors.itemList).style.display = "block";
    },
  };

  // -----------------------------------------------------------
})();

// APP CONTROLLER

const AppCtrl = (function (ItemCtrl, StorageCtrl, UICtrl) {
  //Load Event Listeners
  // -----------------------------------------------------------
  const loadEventListeners = function () {
    //  Get UI Selectors
    const UISelectors = UICtrl.getSelectors();

    // Add item event
    document
      .querySelector(UISelectors.addBtn)
      .addEventListener("click", itemAddSubmit);

    // Disable submit on enter
    document.addEventListener("keypress", function (e) {
      if (e.ke === 13 || e.which === 13) {
        e.preventDefault();
        return false;
      }
    });

    // Edit Item Click Event
    document
      .querySelector(UISelectors.itemList)
      .addEventListener("click", itemEditClick);

    // Update item Click Event
    document
      .querySelector(UISelectors.updateBtn)
      .addEventListener("click", itemUpdateSubmit);

    // Back btn
    document
      .querySelector(UISelectors.backBtn)
      .addEventListener("click", UICtrl.clearEditState);

    // Delete item Click Event
    document
      .querySelector(UISelectors.deleteBtn)
      .addEventListener("click", itemDeleteSubmit);

    // Clear All Click event
    document
      .querySelector(UISelectors.clearBtn)
      .addEventListener("click", clearAll);
  };

  // -----------------------------------------------------------

  //Add item to the List
  // -----------------------------------------------------------
  const itemAddSubmit = function (e) {
    UICtrl.showItemList();

    //   Get item inputs
    const input = UICtrl.getItemInput();

    //  check if input is empty
    if (input.name !== "" && input.calories !== "") {
      // Add new Item
      const newItem = ItemCtrl.addItem(input.name, input.calories);

      // Display item on list
      UICtrl.addListItem(newItem);

      // Get Total Calories
      const totalCalories = ItemCtrl.getTotalCalories();

      // show Total Calories
      UICtrl.showTotalCalories(totalCalories);

      // Store item in LS
      StorageCtrl.storeItem(newItem);

      // Clear input
      UICtrl.clearInput();
    }

    e.preventDefault();
  };
  // -----------------------------------------------------------

  //Click edit item in the List
  // -----------------------------------------------------------
  const itemEditClick = function (e) {
    if (e.target.classList.contains("edit-item")) {
      // Get elemnet id in list item
      listId = e.target.parentNode.parentNode.id;

      // Split id
      listIdArr = listId.split("-");

      // Actual id
      id = parseInt(listIdArr[1]);

      // Get element with id
      const itemToEdit = ItemCtrl.getItemById(id);

      // Set Current Item
      ItemCtrl.setCurrentItem(itemToEdit);

      UICtrl.addItemToForm();
    }

    e.preventDefault();
  };
  // -----------------------------------------------------------

  //Update item in the List
  // -----------------------------------------------------------
  const itemUpdateSubmit = function (e) {
    // Get inputs
    const input = UICtrl.getItemInput();

    // Update item
    const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

    // Update UI
    UICtrl.updateListItem(updatedItem);

    // Get Total Calories
    const totalCalories = ItemCtrl.getTotalCalories();

    // show Total Calories
    UICtrl.showTotalCalories(totalCalories);

    // Update item in Ls
    StorageCtrl.updateItemInStorage(updatedItem);

    // Clear input
    UICtrl.clearInput();

    UICtrl.clearEditState();

    e.preventDefault();
  };
  // -----------------------------------------------------------

  // Delete item in the List
  // -----------------------------------------------------------
  const itemDeleteSubmit = function (e) {
    // get current item
    const currentItem = ItemCtrl.getCurrentItem();

    // Delete from data structure
    ItemCtrl.deleteItem(currentItem.id);

    // Deltet item from Ui
    UICtrl.deleteListItem(currentItem.id);

    // Get Total Calories
    const totalCalories = ItemCtrl.getTotalCalories();

    // show Total Calories
    UICtrl.showTotalCalories(totalCalories);

    // Delete from LS
    StorageCtrl.deleteItemFromStorage(currentItem.id);

    // Fetch items from ItemCTrl
    const items = ItemCtrl.getItems();
    // Remove ul from page if list is empty
    if (items.length === 0) {
      UICtrl.removeItemList();
    }

    // Clear input
    UICtrl.clearInput();

    UICtrl.clearEditState();

    e.preventDefault();
  };
  // -----------------------------------------------------------

  // Clear All Items
  // -----------------------------------------------------------
  const clearAll = function (e) {
    // Remove from Data Structure
    ItemCtrl.clearAllItem();

    // Remove from Ui
    UICtrl.clearAllItems();

    // Get Total Calories
    const totalCalories = ItemCtrl.getTotalCalories();

    // show Total Calories
    UICtrl.showTotalCalories(totalCalories);

    // Clear Items from LS
    StorageCtrl.clearItemsFromStorage();

    // Clear input
    UICtrl.clearInput();

    UICtrl.clearEditState();

    UICtrl.removeItemList();

    e.preventDefault();
  };
  // -----------------------------------------------------------

  // Public Methods
  // -----------------------------------------------------------
  return {
    init: function () {
      // Clear Edit State
      UICtrl.clearEditState();
      // Fetch items from ItemCTrl
      const items = ItemCtrl.getItems();

      if (items.length === 0) {
        UICtrl.removeItemList();
      } else {
        // Populate Items
        UICtrl.populateItemList(items);
      }

      //   Load Event Listeners
      loadEventListeners();
    },
  };
  // -----------------------------------------------------------
})(ItemCtrl, StorageCtrl, UICtrl);

AppCtrl.init();

import { products } from "./products.js";
// selectors
const showModalBtn = document.querySelector(".show-modal");
const clearAllBtn = document.querySelector(".cancel-modal");
const backDrop = document.querySelector(".backDrop");
const mainModal = document.querySelector(".modal");
const productsGrid = document.querySelector(".grid-products");
const cartItemsProducts = document.querySelector(".cart-items-products");
const countCartItems = document.querySelector(".cart-items-count");
const totalPrice = document.querySelector("#total-price span");
//getting the all buttons of items!
const addToCartBtn = document.querySelectorAll(".add-cart-btn");

let addToCartButtons = [];

let cart = [];

// event listeners
mainModal.addEventListener("click", (e) => {
  e.stopPropagation();
});

document.addEventListener("DOMContentLoaded", (e) => {
  const productsData = Product.getProducts();

  cart = LocalStorage.checkLocalStorage();
  const ui = new UI();
  ui.displayAllProducts(productsData);
  ui.getAddToCartBtn();
  ui.addProductToCartAR();
  ui.setCountOfCartItems();
  ui.itemsActionsHandler(e);
  UI.getTotalPrice();
});

showModalBtn.addEventListener("click", showModalHandler);
clearAllBtn.addEventListener("click", () => {
  const ui = new UI();
  ui.clearAllItemsOfCart();
});
backDrop.addEventListener("click", closeModalHandler);

cartItemsProducts.addEventListener("click", (e) => {
  const ui = new UI();
  ui.itemsActionsHandler(e);
});

// functions

function showModalHandler() {
  mainModal.style.opacity = "1";
  setTimeout(() => {
    mainModal.style.transform = "translateY(0px)";
  }, 80);
  backDrop.style.display = "flex";
}

function closeModalHandler() {
  setTimeout(() => {
    mainModal.style.transform = "translateY(-100%)";
  }, 100);
  setTimeout(() => {
    mainModal.style.opacity = "0";
    backDrop.style.display = "none";
  }, 500);
}

class Product {
  // getting the products
  static getProducts() {
    return products;
  }
}

class UI {
  // display products to DOM
  displayAllProducts(productsData) {
    productsData.forEach((product) => {
      let productDiv = document.createElement("div");
      productDiv.className = "product";

      productDiv.innerHTML = `
            <div class="img-product">
            <img src="${product.imgUrl}" alt="${product.title}" />
            </div>
            <div class="product-desc">
            <p class="product-title">Title: ${product.title}</p> </p>
            <p class="product-price">Price: ${product.price}</p> </p>
            </div>
            <button data-id="${product.id}" class="add-cart-btn"> <i class="fa-solid fa-cart-shopping"></i> Add ot cart</button>`;

      productsGrid.appendChild(productDiv);
    });
  }

  getAddToCartBtn() {
    //getting the all buttons of items!
    const addToCartBtn = document.querySelectorAll(".add-cart-btn");

    // converting the nodeList to an array
    addToCartButtons = [...addToCartBtn];

    addToCartButtons.forEach((btn) => {
      // access to the id of items
      let id = parseInt(btn.dataset.id);

      btn.addEventListener("click", () => {
        // get all products
        const products = Product.getProducts();
        // check the id with the products id if it exists and equals it'll filter
        const filteredProduct = products.filter((p) => p.id === parseInt(id));

        this.addProductToCart(filteredProduct);

        this.checkItemsInCart(id, btn);
      });
      this.checkItemsInCart(id, btn);
    });
  }

  // checks if the product is in the cart!
  checkItemsInCart(id, btn) {
    let isInCart = cart.find((p) => p.id === id);

    if (isInCart) {
      btn.innerText = "Added to cart";
      btn.disabled = true;
      btn.style.opacity = "0.6";
    } else if (!isInCart) {
      btn.innerHTML = ` <i class="fa-solid fa-cart-shopping"></i> Add to cart`;
      btn.disabled = false;
      btn.style.opacity = "1";
    }
  }

  addProductToCart(product) {
    const singleProduct = { ...product[0], quantity: 1 };

    cart = [...cart, singleProduct];

    this.checkCartIfIsEmpty();

    // cart single item
    let cartItemDiv = document.createElement("div");
    cartItemDiv.className = "cart-item";
    cartItemDiv.setAttribute("data-id", singleProduct.id);

    cartItemDiv.innerHTML = `  
            <!-- image of product -->
            <div class="image">
              <img
                src="${singleProduct.imgUrl}"
                alt="image of product"
              />
            </div>
            <!-- details of product -->
            <div class="details">
              <p>Product name: ${singleProduct.title}</p>
              <span>${singleProduct.price}</span>
            </div>

            <!-- actions -->
            <div class="actions-product">
              <i class="icon icon-up fa-solid fa-angle-up"></i>
              <span class="counter">${singleProduct.quantity}</span>
              <i class="icon icon-down fa-solid fa-angle-down"></i>
            </div>

            <i class="icon icon-trash fa fa-trash"></i>
    `;

    cartItemsProducts.appendChild(cartItemDiv);

    LocalStorage.addCartToLocalStorage(cart);

    this.setCountOfCartItems();

    UI.getTotalPrice();
  }

  // checking the cart if is empty message!
  checkCartIfIsEmpty() {
    const childrenOfProduct = [...cartItemsProducts.children];

    if (
      childrenOfProduct.length > 0 &&
      childrenOfProduct[0].innerText === "Your cart is empty!"
    ) {
      cartItemsProducts.children[0].remove();
    } else if (childrenOfProduct.length <= 0) {
      let h3 = document.createElement("h3");
      h3.innerText = "Your cart is empty!";
      cartItemsProducts.appendChild(h3);
    }
  }

  // add products to cart after refreshing
  addProductToCartAR() {
    const cartData = LocalStorage.checkLocalStorage();

    if (cartData.length <= 0) {
      let message = document.createElement("h3");

      message.innerText = "Your cart is empty!";

      cartItemsProducts.appendChild(message);
    } else {
      cartData.forEach((p) => {
        // cart single item
        let cartItemDiv = document.createElement("div");
        cartItemDiv.className = "cart-item";
        cartItemDiv.setAttribute("data-id", p.id);

        cartItemDiv.innerHTML = `
                  <!-- image of product -->
                  <div class="image">
                    <img
                      src="${p.imgUrl}"
                      alt="image of product"
                    />
                  </div>
                  <!-- details of product -->
                  <div class="details">
                    <p>Product name: ${p.title}</p>
                    <span>${p.price}</span>
                  </div>
      
                  <!-- actions -->
                  <div class="actions-product">
                    <i class="icon icon-up fa-solid fa-angle-up"></i>
                    <span class="counter">${p.quantity}</span>
                    <i class="icon icon-down fa-solid fa-angle-down"></i>
                  </div>
      
                  <i class="icon icon-trash fa fa-trash"></i>
          `;

        cartItemsProducts.appendChild(cartItemDiv);
      });
    }
  }

  //checking the count of items
  setCountOfCartItems() {
    let products = LocalStorage.checkLocalStorage();

    let quantity = products.reduce((acc, curr) => {
      return acc + curr.quantity;
    }, 0);

    countCartItems.textContent = quantity;
  }

  itemsActionsHandler(e) {
    if (e.target.classList.contains("icon-up")) {
      let id = parseInt(e.target.parentElement.parentElement.dataset.id);

      LocalStorage.updateLocalCart(id, "inc");

      this.updateItemsCounter(e, id);

      this.setCountOfCartItems();
    } else if (e.target.classList.contains("icon-down")) {
      let id = parseInt(e.target.parentElement.parentElement.dataset.id);

      LocalStorage.updateLocalCart(id, "dec");

      this.updateItemsCounter(e, id);

      this.setCountOfCartItems();
    } else if (e.target.classList.contains("icon-trash")) {
      let id = parseInt(e.target.parentElement.dataset.id);

      LocalStorage.updateLocalCart(id, "delete");

      this.removeItemCart(id);

      this.setCountOfCartItems();
    }
  }

  removeItemCart(id) {
    let itemsInCart = [...cartItemsProducts.children];

    itemsInCart.forEach((i) => {
      let productId = parseInt(i.dataset.id);

      if (productId === id) {
        i.remove();
        this.checkCartIfIsEmpty();
      }
    });

    addToCartButtons.forEach((btn) => {
      let btnDataId = parseInt(btn.dataset.id);

      if (btnDataId === id) {
        this.checkItemsInCart(id, btn);
      }
    });
  }

  clearAllItemsOfCart() {
    while (cartItemsProducts.children.length) {
      cartItemsProducts.removeChild(cartItemsProducts.children[0]);
    }
    this.checkCartIfIsEmpty();
    cart = [];
    localStorage.setItem("cart", JSON.stringify(cart));
    this.setCountOfCartItems();
    UI.getTotalPrice();

    addToCartButtons.forEach((btn) => {
      console.log(btn);
      btn.disabled = false;
      btn.style.opacity = "1";
      btn.innerHTML = ` <i class="fa-solid fa-cart-shopping"></i> Add to cart`;
    });

    closeModalHandler();
  }

  updateItemsCounter(e, id) {
    let counter = e.target.parentElement.querySelector(".counter");
    const products = LocalStorage.checkLocalStorage();

    products.map((product) => {
      product.id === id
        ? (counter.innerText = product.quantity)
        : counter.innerText;
    });
  }

  static getTotalPrice() {
    const products = LocalStorage.checkLocalStorage();

    let totalPriceF = products.reduce((acc, curr) => {
      return acc + parseInt(curr.price.split(" ")[1]) * curr.quantity;
    }, 0);

    totalPrice.innerHTML = ` $ ${totalPriceF} `;
  }
}

const ui = new UI();

class LocalStorage {
  // the function below checks the LocalStorage if it has any (cart) item
  static checkLocalStorage() {
    let localCart = localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : [];
    return localCart;
  }

  // the function below adds the items to the cart in localStorage
  static addCartToLocalStorage(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  static updateLocalCart(id, type) {
    let products = LocalStorage.checkLocalStorage();

    let updatedProducts = [];

    if (type === "inc") {
      updatedProducts = products.map((p) =>
        p.id === id ? { ...p, quantity: (p.quantity += 1) } : p
      );
    }

    if (type === "dec") {
      updatedProducts = products.map((p) =>
        p.id === id && p.quantity > 1
          ? { ...p, quantity: (p.quantity -= 1) }
          : p
      );
    }

    if (type === "delete") {
      updatedProducts = products.filter((p) => p.id !== id);
      cart = [...updatedProducts];
    }

    localStorage.setItem("cart", JSON.stringify(updatedProducts));

    UI.getTotalPrice();
  }
}

import query from "./graphQLQuery.js";

const API_ENDPOINT =
  "https://tsodykteststore.myshopify.com/api/2023-01/graphql.json";
const token = "7e174585a317d187255660745da44cc7";

async function fetchProducts() {
  try {
    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": token,
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error(`Помилка: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    return data.data.products.edges;
  } catch (error) {
    console.error("Помилка при отриманні продуктів:", error);
    return [];
  }
}

function renderProducts(products) {
  const productsList = document.querySelector(".products_list");

  const productsHTML = products
    .map((productEdge) => {
      const product = productEdge.node;
      const title = product.title || "No title";
      const description = product.description || "Lorem ipsum dolor sit amet";

      const variant = product.variants.edges[0]?.node;
      const price = variant?.price?.amount;
      const currency = variant?.price?.currencyCode;
      const compareAtPrice = variant?.compareAtPrice?.amount;
      const compareAtCurrency = variant?.compareAtPrice?.currencyCode;

      const images = product.images.edges;
      const firstImageUrl = images[0]?.node?.url || "";
      const secondImageUrl = images[1]?.node?.url || firstImageUrl || "";

      return `
      <li class="product_card">
        <div class="image_wrapper">
          <img src="${firstImageUrl}" alt="Product" />
          <img src="${secondImageUrl}" alt="Product" class="second_image" />
        </div>
        <div class="product_info">
          <h3 class="product_title">${title}</h3>
          <p class="product_description">${description}</p>
          ${
            compareAtPrice
              ? `<span class="product_compare_price">${compareAtPrice} ${compareAtCurrency}</span>`
              : ""
          }
          <span class="product_price">${
            price ? `${price} ${currency}` : "N/A"
          }</span>
        </div>
      </li>
    `;
    })
    .join("");

  productsList.insertAdjacentHTML("beforeend", productsHTML);
}

function showFAQ() {
  const faqItems = document.querySelectorAll(".faq_item");

  faqItems.forEach((item) => {
    const questionDiv = item.querySelector(".faq_item_question_icon_div");
    const answer = item.querySelector(".faq_answer");
    const iconUse = item.querySelector(".icon use");
    const iconSvg = item.querySelector(".icon");

    questionDiv.addEventListener("click", function () {
      const isOpen = answer.classList.contains("is-visible");

      // Закриваємо всі інші відповіді перед відкриттям нової
      document.querySelectorAll(".faq_answer").forEach((el) => {
        el.classList.remove("is-visible");
        el.classList.add("is-hidden");
      });

      document.querySelectorAll(".faq_item").forEach((el) => {
        el.style.backgroundColor = "var(--itemBg-color)";
      });

      document.querySelectorAll(".icon use").forEach((el) => {
        el.setAttribute("href", "./icons/icons.svg#icon_plus");
      });

      document.querySelectorAll(".icon").forEach((el) => {
        el.setAttribute("width", "22");
        el.setAttribute("height", "22");
        el.classList.remove("rotate");
      });

      if (!isOpen) {
        answer.classList.remove("is-hidden");
        answer.classList.add("is-visible");

        iconUse.setAttribute("href", "./icons/icons.svg#icon_minus");
        iconSvg.setAttribute("width", "20");
        iconSvg.setAttribute("height", "20");
        item.style.backgroundColor = "var(--itemBg-active-color)";
        iconSvg.classList.add("rotate");
      } else {
        answer.classList.remove("is-visible");
        answer.classList.add("is-hidden");
        iconSvg.classList.remove("rotate");
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  const products = await fetchProducts();

  renderProducts(products);

  showFAQ();
});

const query = `
  {
    products(first: 10) {
      edges {
        node {
          title
          description
          variants(first: 1) {
            edges {
              node {
                price {
                  amount
                  currencyCode
                }
                compareAtPrice {
                  amount
                  currencyCode
                }
              }
            }
          }
          images(first: 2) {
            edges {
              node {
                url
                altText
              }
            }
          }
        }
      }
    }
  }
`;

const productsEndpoint =
  "https://tsodykteststore.myshopify.com/api/2023-01/graphql.json";
const token = "7e174585a317d187255660745da44cc7";

async function fetchProducts() {
  try {
    const response = await fetch(productsEndpoint, {
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
      answer.classList.toggle("is-hidden");

      if (answer.classList.contains("is-hidden")) {
        iconUse.setAttribute("href", "./icons/icons.svg#icon_plus");
        iconSvg.setAttribute("width", "22");
        iconSvg.setAttribute("height", "22");
        item.style.backgroundColor = "var(--itemBg-color)";
      } else {
        iconUse.setAttribute("href", "./icons/icons.svg#icon_minus");
        iconSvg.setAttribute("width", "20");
        iconSvg.setAttribute("height", "20");
        item.style.backgroundColor = "var(--itemBg-active-color)";
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  const products = await fetchProducts();

  renderProducts(products);

  showFAQ();
});

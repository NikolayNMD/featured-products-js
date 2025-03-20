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
  const productsContainer = document.querySelector(".products_container");

  products.forEach((productEdge) => {
    const product = productEdge.node;

    const title = product.title || "No title";
    const description = product.description || "Lorem ipsum dolor sit amet";

    const variant = product.variants.edges[0]?.node;
    const price = variant?.price?.amount;
    const currency = variant?.price?.currencyCode;
    const compareAtPrice = variant?.compareAtPrice?.amount;
    const compareAtCurrency = variant?.compareAtPrice?.currencyCode;

    const productCard = document.createElement("div");
    productCard.classList.add("product_card");

    const imageWrapper = document.createElement("div");
    imageWrapper.classList.add("image_wrapper");

    const images = product.images.edges;

    const firstImageUrl = images[0]?.node?.url;
    const secondImageUrl = images[1]?.node?.url;

    const firstImage = document.createElement("img");
    firstImage.src = firstImageUrl || "";
    firstImage.alt = title || "Product";

    const secondImage = document.createElement("img");
    secondImage.src = secondImageUrl || firstImageUrl || "";
    secondImage.alt = title || "Product";
    secondImage.classList.add("second_image");

    imageWrapper.appendChild(firstImage);
    imageWrapper.appendChild(secondImage);

    const productInfo = document.createElement("div");
    productInfo.classList.add("product_info");

    const productTitle = document.createElement("h3");
    productTitle.classList.add("product_title");
    productTitle.textContent = title;

    const productDesc = document.createElement("p");
    productDesc.classList.add("product_description");
    productDesc.textContent = description;

    const priceEl = document.createElement("span");
    priceEl.classList.add("product_price");
    if (price && currency) {
      priceEl.textContent = `${price} ${currency}`;
    } else {
      priceEl.textContent = "N/A";
    }

    const comparePriceEl = document.createElement("span");
    comparePriceEl.classList.add("product_compare_price");
    if (compareAtPrice && compareAtCurrency) {
      comparePriceEl.textContent = `${compareAtPrice} ${compareAtCurrency}`;
    }

    productInfo.appendChild(productTitle);
    productInfo.appendChild(productDesc);
    productInfo.appendChild(priceEl);
    if (compareAtPrice) {
      productInfo.appendChild(comparePriceEl);
    }

    productCard.appendChild(imageWrapper);
    productCard.appendChild(productInfo);

    productsContainer.appendChild(productCard);
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  const products = await fetchProducts();

  renderProducts(products);
});

let bookImages = {};

function getQueryParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

function loadBookData() {
  const bookId = getQueryParam("book");
  const path = `../reviews/json/${bookId}.json`;
  const coversPath = "../bookcover.json";

  console.log("Fetching book covers from:", coversPath);

  // Fetch book covers JSON file
  fetch(coversPath)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok for book covers");
      }
      return response.json();
    })
    .then((coversData) => {
      bookImages = coversData;
      console.log("Loaded Book Images:", bookImages);

      // Check if the bookId exists in the coversData
      if (bookImages[bookId]) {
        console.log("Setting background image to:", bookImages[bookId]);
        document.body.style.backgroundImage = `url(${bookImages[bookId]})`;
      } else {
        console.error("No image found for the book ID:", bookId);
        document.body.style.backgroundImage = "none"; // Clear background if no image found
      }

      // Fetch book details JSON file
      return fetch(path);
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok for book details");
      }
      return response.json();
    })
    .then((data) => {
      document.getElementById("bookTitle").textContent = data.title;
      document.getElementById("bookAuthor").textContent = data.author;
      document.getElementById("bookDescription").textContent = data.description;

      const reviewsContainer = document.getElementById("reviews");
      reviewsContainer.innerHTML = ""; // Clear existing reviews

      data.reviews.forEach((review) => {
        const reviewElement = document.createElement("div");
        reviewElement.className = "review";
        reviewElement.innerHTML = `
          <img src="${review.icon}" alt="${review.name}'s icon">
          <div class="review-text">
            <h3>${review.name}</h3>
            <div class="stars">${"★".repeat(review.rating)}${"☆".repeat(
          5 - review.rating
        )}</div>
            <p>${review.review}</p>
          </div>
        `;
        reviewsContainer.appendChild(reviewElement);
      });
    })
    .catch((error) => console.error("Error loading book data:", error));
}

window.onload = loadBookData;

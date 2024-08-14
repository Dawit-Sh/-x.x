document.addEventListener("DOMContentLoaded", function () {
  let isLoading = false;
  let finishedPage = 4; // Start after the first 4 books

  function loadBooks() {
    if (isLoading) return;
    isLoading = true;

    fetch("books.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        populateBooks("currentlyReading", data.currentlyReading);
        populateBooks("finished", data.finished.slice(0, 4)); // Load the first 4 books
        isLoading = false;
      })
      .catch((error) => {
        console.error("Error loading books:", error);
        isLoading = false;
      });
  }

  function populateBooks(sectionId, books) {
    const section = document.getElementById(sectionId);
    if (!section) {
      console.error(`Section with id ${sectionId} not found`);
      return;
    }

    books.forEach((book) => {
      const bookDiv = document.createElement("div");
      bookDiv.className = "book";
      bookDiv.dataset.genre = book.genre;
      bookDiv.onclick = () => (location.href = book.url);

      bookDiv.innerHTML = `
        <img src="${book.image}" alt="${book.title}">
        <div class="book-info">
          <h2>${book.title}</h2>
          <p>${book.author}</p>
        </div>
      `;

      section.appendChild(bookDiv);
    });
  }

  function showMoreBooks() {
    fetch("books.json")
      .then((response) => response.json())
      .then((data) => {
        const additionalBooks = data.finished.slice(
          finishedPage,
          finishedPage + 4
        ); // Load 4 more books
        populateBooks("finished", additionalBooks);
        finishedPage += 4;
        if (finishedPage >= data.finished.length) {
          document.getElementById("showMoreButton").style.display = "none";
        }
      })
      .catch((error) => {
        console.error("Error loading more books:", error);
      });
  }

  // Attach the click event listener to the Show More button
  document
    .getElementById("showMoreButton")
    .addEventListener("click", showMoreBooks);

  // Initial load of books
  loadBooks();
});

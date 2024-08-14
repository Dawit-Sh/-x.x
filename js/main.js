document.addEventListener("DOMContentLoaded", function () {
  fetch("books.json")
    .then((response) => response.json())
    .then((data) => {
      populateBooks("currentlyReading", data.currentlyReading);
      populateBooks("finished", data.finished);
    });
});

function populateBooks(sectionId, books) {
  const section = document.getElementById(sectionId);
  section.innerHTML = ""; // Clear existing content

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

function searchBooks() {
  const searchInput = document
    .getElementById("searchInput")
    .value.toLowerCase();
  const filterSelect = document.getElementById("filterSelect").value;
  const books = document.querySelectorAll(".book");

  books.forEach((book) => {
    const title = book.querySelector("h2").textContent.toLowerCase();
    const author = book.querySelector("p").textContent.toLowerCase();
    const genre = book.getAttribute("data-genre");

    const matchesSearch =
      title.includes(searchInput) || author.includes(searchInput);
    const matchesFilter = filterSelect === "all" || filterSelect === genre;

    if (matchesSearch && matchesFilter) {
      book.style.display = "";
    } else {
      book.style.display = "none";
    }
  });
}

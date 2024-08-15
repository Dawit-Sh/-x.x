const shuffleButton = document.getElementById("shuffleButton");
const bookCountDiv = document.getElementById("bookCount");

let books = [];

shuffleButton.addEventListener("click", () => {
  shuffleBooks();
});

function fetchBooks() {
  fetch("books.json")
    .then((response) => response.json())
    .then((data) => {
      books = data.upcoming;
      bookCountDiv.textContent = `Total Books: ${books.length}`;
      displayBooks(shuffleBooks(books, 4));
    })
    .catch((error) => console.error("Error fetching books:", error));
}

function shuffleBooks() {
  const shuffledBooks = books
    .map((book) => ({ ...book, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .slice(0, 4);
  displayBooks(shuffledBooks);
}

function displayBooks(books) {
  const container = document.getElementById("upcoming");
  container.innerHTML = ""; // Clear previous content

  books.forEach((book, index) => {
    const bookDiv = document.createElement("div");
    bookDiv.classList.add("book");
    bookDiv.style.animationDelay = `${index * 0.2}s`;
    bookDiv.innerHTML = `<a href="${book.url}" target="_blank"><img src="${book.image}" alt="${book.title}"></a>`;
    container.appendChild(bookDiv);
  });

  setTimeout(() => {
    document.querySelectorAll(".book").forEach((book) => {
      book.classList.add("shuffling");
    });
  }, 500);
}

// Initial load
fetchBooks();

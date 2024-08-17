const shuffleButton = document.getElementById("shuffleButton");
const bookCountDiv = document.getElementById("bookCount");

let books = [];
const suggestedKeys = ["Abrham", "Nahom", "Dawit"]; // Suggested keys

// Fetch books on initial load
fetchBooks();

shuffleButton.addEventListener("click", () => {
  shuffleBooks();
});

function fetchBooks() {
  fetch("books.json")
    .then((response) => response.json())
    .then((data) => {
      books = data.upcoming;
      bookCountDiv.textContent = `Total Books: ${books.length}`;
      // Optionally, you can display a default set of books here if needed
    })
    .catch((error) => console.error("Error fetching books:", error));
}

function shuffleBooks() {
  if (books.length === 0) {
    console.warn("No books available to shuffle.");
    return;
  }

  let selectedBooks = [];
  let remainingBooks = [...books];

  // Shuffle the suggested keys
  const shuffledKeys = [...suggestedKeys].sort(() => Math.random() - 0.5);

  // Pick 2 books from the first key
  const key1 = shuffledKeys[0];
  const booksFromKey1 = remainingBooks.filter(
    (book) => book.suggested === key1
  );
  const chosenFromKey1 = getRandomBooks(booksFromKey1, 2);
  selectedBooks = selectedBooks.concat(chosenFromKey1);
  remainingBooks = remainingBooks.filter(
    (book) => !chosenFromKey1.includes(book)
  );

  // Pick 1 book from the second key
  const key2 = shuffledKeys[1];
  const booksFromKey2 = remainingBooks.filter(
    (book) => book.suggested === key2
  );
  const chosenFromKey2 = getRandomBooks(booksFromKey2, 1)[0];
  selectedBooks.push(chosenFromKey2);
  remainingBooks = remainingBooks.filter((book) => book !== chosenFromKey2);

  // Pick 1 book from the third key
  const key3 = shuffledKeys[2];
  const booksFromKey3 = remainingBooks.filter(
    (book) => book.suggested === key3
  );
  const chosenFromKey3 = getRandomBooks(booksFromKey3, 1)[0];
  selectedBooks.push(chosenFromKey3);

  // Display the selected books
  displayBooks(selectedBooks);
}

function getRandomBooks(books, count) {
  return books
    .map((book) => ({ ...book, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .slice(0, count);
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

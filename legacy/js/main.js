document.addEventListener("DOMContentLoaded", function () {
  let isLoading = false;
  let finishedPage = 8; // Start after the first 8 books
  let upcomingPage = 8; // Start after the first 8 upcoming books
  let allBooks = {}; // Store all books to filter later

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
        allBooks = data; // Store loaded books
        populateBooks("currentlyReading", data.currentlyReading);
        populateBooks("finished", data.finished.slice(0, 8)); // Load the first 8 books
        populateBooks("upcomingShelf", data.upcoming.slice(0, 8), true); // Load the first 8 upcoming books with blur
        isLoading = false;
      })
      .catch((error) => {
        console.error("Error loading books:", error);
        isLoading = false;
      });
  }

  function populateBooks(sectionId, books, isBlurred = false) {
    const section = document.getElementById(sectionId);
    if (!section) {
      console.error(`Section with id ${sectionId} not found`);
      return;
    }

    // Clear existing content
    section.innerHTML = "";

    books.forEach((book) => {
      const bookDiv = document.createElement("div");
      bookDiv.className = isBlurred ? "book blurred" : "book";
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

    // Filter for Currently Reading
    const filteredCurrentlyReading = allBooks.currentlyReading.filter(
      (book) => {
        const matchesFilter =
          filterSelect === "all" || book.genre === filterSelect;
        const matchesSearch =
          book.title.toLowerCase().includes(searchInput) ||
          book.author.toLowerCase().includes(searchInput) ||
          (book.suggested &&
            book.suggested.toLowerCase().includes(searchInput));

        return matchesFilter && matchesSearch;
      }
    );

    // Filter for Finished
    const filteredFinished = allBooks.finished.filter((book) => {
      const matchesFilter =
        filterSelect === "all" || book.genre === filterSelect;
      const matchesSearch =
        book.title.toLowerCase().includes(searchInput) ||
        book.author.toLowerCase().includes(searchInput) ||
        (book.suggested && book.suggested.toLowerCase().includes(searchInput));

      return matchesFilter && matchesSearch;
    });

    // Filter for Upcoming Shelf
    const filteredUpcoming = allBooks.upcoming.filter((book) => {
      const matchesFilter =
        filterSelect === "all" || book.genre === filterSelect;
      const matchesSearch =
        book.title.toLowerCase().includes(searchInput) ||
        book.author.toLowerCase().includes(searchInput) ||
        (book.suggested && book.suggested.toLowerCase().includes(searchInput));

      return matchesFilter && matchesSearch;
    });

    // Populate books for each section
    populateBooks("currentlyReading", filteredCurrentlyReading);
    populateBooks("finished", filteredFinished.slice(0, finishedPage)); // Show filtered results
    populateBooks(
      "upcomingShelf",
      filteredUpcoming.slice(0, upcomingPage),
      true
    ); // Show filtered upcoming books
  }

  function showMoreBooks(sectionId, page) {
    fetch("books.json")
      .then((response) => response.json())
      .then((data) => {
        const section = document.getElementById(sectionId);
        if (sectionId === "finished") {
          const additionalBooks = data.finished.slice(page, page + 8); // Load 8 more books
          populateBooks("finished", additionalBooks);
          finishedPage += 8;
          if (finishedPage >= data.finished.length) {
            document.getElementById("showMoreFinishedButton").style.display =
              "none";
          }
        } else if (sectionId === "upcomingShelf") {
          const additionalBooks = data.upcoming.slice(page, page + 8); // Load 8 more upcoming books
          populateBooks("upcomingShelf", additionalBooks, true);
          upcomingPage += 8;
          if (upcomingPage >= data.upcoming.length) {
            document.getElementById("showMoreUpcomingButton").style.display =
              "none";
          }
        }
      })
      .catch((error) => {
        console.error("Error loading more books:", error);
      });
  }

  // Attach the event listener to the search bar
  document.getElementById("searchInput").addEventListener("keyup", searchBooks);
  document
    .getElementById("filterSelect")
    .addEventListener("change", searchBooks);

  // Attach the click event listener to the Show More buttons
  document
    .getElementById("showMoreFinishedButton")
    .addEventListener("click", () => showMoreBooks("finished", finishedPage));

  document
    .getElementById("showMoreUpcomingButton")
    .addEventListener("click", () =>
      showMoreBooks("upcomingShelf", upcomingPage)
    );

  // Initial load of books
  loadBooks();
});

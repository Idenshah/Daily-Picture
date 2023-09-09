const NO_FAV_TEXT = "No any image is selected as favorite!";

const form = document.querySelector("form");
const dateInput = document.querySelector("#date");
const apodSection = document.querySelector("#gallery");
const favoritesSection = document.querySelector("#favorites");

let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const date = dateInput.value;
  fetchApod(date);
});

async function fetchApod(date) {
  const apiKey = "2a19czXpbFL2NBG8tU6NA8yzQ79Rw7nSPjsVl17L";
  const url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${date}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("APOD not available");
    }
    const apodData = await response.json();
    displayApod(apodData);
  } catch (error) {
    console.error(error.message);
  }
}

function displayApod(apodData) {
  const gallery = document.querySelector("#gallery");
  const boxes = document.querySelector("#boxes");
  let apodBox = document.getElementById("apodBox");

  if (!apodBox) {
    apodBox = document.createElement("div");
    apodBox.id = "apodBox";
    apodBox.classList.add("boxOne");
  } else {
    console.log(apodBox);
    apodBox.innerHTML = "";
  }

  // Create the elements for the APOD content
  const title = document.createElement("h3");
  title.textContent = apodData.title;
  const date = document.createElement("h4");
  date.textContent = `Date: ${apodData.date}`;
  const description = document.createElement("p");
  description.textContent = apodData.explanation;

  const saveBtn = document.createElement("button");
  saveBtn.textContent = "Save";
  saveBtn.addEventListener("click", () => addTofavorite(apodData));

  apodBox.append(title, date, description, saveBtn);
  boxes.appendChild(apodBox);

  let imageBox = document.getElementById("imageBox");

  if (!imageBox) {
    imageBox = document.createElement("div");
    imageBox.id = "imageBox";
    imageBox.classList.add("boxTwo");
    imageBox.tabIndex = 0;
  } else {
    console.log(imageBox);
    imageBox.innerHTML = "";
  }

  let hdImage = null;

  imageBox.addEventListener("click", () => {
    // Remove any existing HD images before showing the new one
    if (hdImage) {
      hdImage.remove();
    }

    hdImage = showHd(apodData);
  });

  document.addEventListener("click", (event) => {
    const clickedElement = event.target;
    if (clickedElement.classList.contains("hdImage")) {
      clickedElement.remove();
      hdImage = null;
    }
  });

  // Add event listener to form to remove HD image when submitted
  const form = document.querySelector("form");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const clickedElement = document.querySelector(".hdImage");
    if (clickedElement) {
      clickedElement.remove();
      hdImage = null;
    }
  });

  const imageContainer = document.createElement("div");
  imageContainer.classList.add("image-container");

  const image = document.createElement("img");
  image.src = apodData.url;
  image.alt = apodData.title;

  imageBox.appendChild(image);

  gallery.appendChild(imageBox);
}

function addTofavorite(apodData) {
  if (!favorites.some((fav) => fav.title === apodData.title)) {
    saveFavoriteToStorage(apodData);
    displayFavorites(true);
  } else {
    alert("Item already has been added");
  }
}

function createFavElement(apodData) {
  const favImage = document.createElement("img");
  favImage.src = apodData.url;
  favImage.alt = apodData.title;

  const savedImage = document.createElement("div");
  savedImage.classList.add("savedImage");
  savedImage.appendChild(favImage);

  const favTitle = document.createElement("h3");
  favTitle.textContent = apodData.title;
  const favDate = document.createElement("h4");
  favDate.textContent = `Date: ${apodData.date}`;

  const removeButton = document.createElement("button");
  removeButton.textContent = "Remove";
  removeButton.classList.add("remove-button");
  removeButton.addEventListener("click", () => removeFavorite(apodData, cover));

  const savedSpec = document.createElement("div");
  savedSpec.classList.add("savedSpec");
  savedSpec.append(favTitle, favDate, removeButton);

  const cover = document.createElement("div");
  cover.classList.add("cover");
  cover.append(savedImage, savedSpec);

  document.body.append(cover);
}

function displayFavorites(onlyLast) {
  favoritesSection.innerHTML = "";
  const message = document.createElement("p");
  favoritesSection.append(message);
  message.id = "favoriteTitle";
  if (favorites.length === 0) {
    message.textContent = NO_FAV_TEXT;
  } else {
    message.textContent = "";
    if (onlyLast) {
      createFavElement(favorites[favorites.length - 1]);
    } else {
      favorites.forEach((favorite) => {
        createFavElement(favorite);
      });
    }
  }
}

function saveFavoriteToStorage(favorite) {
  favorites.push(favorite);
  localStorage.setItem("favorites", JSON.stringify(favorites));
}

function removeFavorite(favorite, cover) {
  favorites = favorites.filter((fav) => fav.url !== favorite.url);
  localStorage.setItem("favorites", JSON.stringify(favorites));
  cover.remove();

  if (favorites.length === 0) {
    const message = document.getElementById("favoriteTitle");
    message.textContent = NO_FAV_TEXT;
  }
}

function showHd(apodData) {
  const hdUrl = apodData.hdurl;
  const existingHdImage = document.querySelector(".hdImage");
  if (existingHdImage) {
    existingHdImage.remove();
  }

  const hdImage = document.createElement("img");
  hdImage.src = hdUrl;
  hdImage.alt = apodData.title;
  hdImage.classList.add("hdImage");
  document.body.appendChild(hdImage);
  return hdImage;
}

displayFavorites();

// costant variables
const form = document.querySelector("form");
const searchInput = document.getElementById("searchBar");
const columns = document.querySelectorAll("[class^=column]");
const loadingSpinner = document.getElementById("loadingSpinner");
const loadingText = document.getElementById("loadingText");
const accessKey = "J7_YZV1p8epB_n2_WEb1lA4p7XVjtx9FNkA4PG18gjI";
// dynamic variables
let searchQuery;
let isSearched = false;
let isPremiumUser = false;
let page = 1;
let perPage;
// functioning on window loaded
window.addEventListener("load", () => {
  if (navigator.onLine) {
    fetchImages(null);
    bodyScroll(searchedValue);
  } else {
    setTimeout(() => {
      loadingSpinner.className = "spinner-offline";
      loadingSpinner.innerHTML = "ERROR_CONNECTION!!";
      loadingText.style.display = "none";
    }, 3600);
  }
});
// enter key or submit inside an form
form.addEventListener("submit", (e) => {
  e.preventDefault();
  columns.forEach((column) => (column.innerHTML = ""));
  searchedValue();
  page = 1;
});
// on search actions
function searchedValue() {
  searchQuery = searchInput.value;
  if (searchQuery != "") isSearched = true;
  if (isSearched === true) fetchImages(searchQuery);
  else fetchImages(null);
}
// debounce action on card revealing | debounce using javascript
let onScrollingStop;
function bodyScroll(searchedValue) {
  const body = document.querySelector("body");
  body.onscroll = () => {
    clearInterval(onScrollingStop);
    if (page <= 7) {
      onScrollingStop = setTimeout(() => {
        if (page == 7) {
          loadingSpinner.className = "spinner-offline";
          loadingSpinner.style.backgroundColor = "var(--secondary-color)";
          loadingSpinner.innerHTML =
            "<a href='#' title='Upgrade' id='upgradeBtn'>Upgrade Now</a>";
          loadingText.style.display = "none";
        }
        page++;
        searchedValue();
      }, 600);
    }
  };
}
// fetching the data from the api
async function fetchImages(searchQuery) {
  perPage = 12;
  const url =
    isSearched === false
      ? `https://api.unsplash.com/photos/?client_id=${accessKey}&page=${page}&per_page=${perPage}`
      : `https://api.unsplash.com/search/photos/?client_id=${accessKey}&query=${searchQuery}&page=${page}&per_page=${perPage}`;
  const response = await fetch(url);
  const data = await response.json();
  if (isSearched === false) bindData(data);
  else if (isSearched === true) bindData(data.results);
}
// binding the data as per the search query and tehe non search query
function bindData(images) {
  images.forEach((image, index) => {
    const imageTemplate = document.getElementById("imageTemplate");
    const cardClone = imageTemplate.content.cloneNode(true);
    fillDataInCard(cardClone, image);
    if ((index + 4) % 4 == 0) columns[0].appendChild(cardClone);
    else if ((index + 3) % 4 == 0) columns[1].appendChild(cardClone);
    else if ((index + 2) % 4 == 0) columns[2].appendChild(cardClone);
    else if ((index + 1) % 4 == 0) columns[3].appendChild(cardClone);
  });
}
// filling the data into the card
function fillDataInCard(cardClone, image) {
  const imageCard = cardClone.getElementById("imageCard");
  imageCard.src = image.urls.regular;
  imageCard.alt = image.alt_description;
  imageCard.addEventListener(
    "click",
    () => {
      window.open(image.links.download, "_black");
    },
    false
  );
}
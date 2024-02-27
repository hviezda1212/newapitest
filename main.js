const API_KEY = `ac9a72663e6c47d28d7d39f05961835f`;
let newsList = [];
let articles = [];
let page = 1;
let totalPage = 1;
let totalResult = 0;
const PAGE_SIZE = 10;
const groupSize = 5;

let url = new URL(`https://noonanewsapi.netlify.app/top-headlines?`);

const menus = document.querySelectorAll(".menus button");
menus.forEach((menu) =>
  menu.addEventListener("click", (event) => getNewsByCategory(event))
);

let logo = document.querySelector(".pageHeader-logo");
logo.addEventListener("click", () => getLatestNews());

let userInput = document.getElementById("search-input");
userInput.addEventListener("keydown", (event) => {
  if (event.keyCode === 13) {
    getNewsByKeyword();
  }
});

const getNews = async () => {
  try {
    url.searchParams.set("page", page);
    const response = await fetch(url);
    const data = await response.json();
    if (response.status === 200) {
      if (data.articles.length == 0) {
        page = 0;
        totalPage = 0;
        paginationRender();
        throw new Error("No result for this search");
      }
      newsList = data.articles;
      totalPage = Math.ceil(data.totalResults / PAGE_SIZE);
      totalResult = data.totalResults;
      render();
      paginationRender();
    } else {
      page = 0;
      totalPage = 0;
      paginationRender();
      throw new Error(data.message);
    }
  } catch (error) {
    console.log("error", error.message);
    page = 0;
    totalPage = 0;
    paginationRender();
    errorRender(error.message);
  }
};

const getLatestNews = async () => {
  url = new URL(`https://noonanewsapi.netlify.app/top-headlines?`);
  getNews();
};

const getNewsByCategory = async (event) => {
  const category = event.target.textContent.toLowerCase();
  if (category == "news") {
    return getLatestNews();
  }
  url = new URL(
    `https://noonanewsapi.netlify.app/top-headlines?category=${category}`
  );
  getNews();
};

const getNewsByKeyword = async () => {
  const keyword = document.getElementById("search-input").value;
  if (keyword == "") {
    return getLatestNews();
  }
  url = new URL(`https://noonanewsapi.netlify.app/top-headlines?q=${keyword}`);
  getNews();
};

const render = () => {
  const newsHTML = newsList
    .map(
      (news) => `        <div class="row news">
  <div class="col-lg-4">
    <img class="news-img" src=${news.urlToImage} />
  </div>
  <div class="col-lg-8">
    <h2>${news.title}</h2>
    <p>${news.description}</p>
    <div>${news.source.name} * ${news.publishedAt}</div>
  </div>
</div>`
    )
    .join("");

  document.getElementById("news-board").innerHTML = newsHTML;
};

const errorRender = (errorMessage) => {
  const errorHTML = `<div class="alert alert-danger" role = "alert">
    ${errorMessage}
  </div>`;

  document.getElementById("news-board").innerHTML = errorHTML;
};

const openSearchBox = () => {
  let inputArea = document.getElementById("input-area");
  if (inputArea.style.display === "inline") {
    inputArea.style.display = "none";
  } else {
    inputArea.style.display = "inline";
  }
};

const openNav = () => {
  document.getElementById("sideNav").style.width = "250px";
};

const closeNav = () => {
  document.getElementById("sideNav").style.width = "0";
};

const paginationRender = () => {
  let paginationHTML = ``;
  let pageGroup = Math.ceil(page / groupSize);
  let lastPage = pageGroup * groupSize;

  if (lastPage > totalPage) {
    lastPage = totalPage;
  }
  let firstPage =
    lastPage - (groupSize - 1) <= 0 ? 1 : lastPage - (groupSize - 1);
  if (firstPage > groupSize) {
    paginationHTML = `<li class="page-item" onclick="moveToPage(1)">
                        <a class="page-link" href='#js-bottom'>&lt;&lt;</a>
                      </li>
                      <li class="page-item" onclick="moveToPage(${page - 1})">
                        <a class="page-link" href='#js-bottom'>&lt;</a>
                      </li>`;
  }
  for (let i = firstPage; i <= lastPage; i++) {
    paginationHTML += `<li class="page-item ${i == page ? "active" : ""}" >
                        <a class="page-link" href='#js-bottom' onclick="moveToPage(${i})" >${i}</a>
                       </li>`;
  }

  if (lastPage < totalPage) {
    paginationHTML += `<li class="page-item" onclick="moveToPage(${page + 1})">
                        <a  class="page-link" href='#js-program-detail-bottom'>&gt;</a>
                       </li>
                       <li class="page-item" onclick="moveToPage(${totalPage})">
                        <a class="page-link" href='#js-bottom'>&gt;&gt;</a>
                       </li>`;
  }

  document.querySelector(".pagination").innerHTML = paginationHTML;
};

const moveToPage = (pageNum) => {
  page = pageNum;
  window.scrollTo({ top: 0, behavior: "smooth" });
  getNews();
};

getLatestNews();

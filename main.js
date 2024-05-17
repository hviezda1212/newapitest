let newsList = [];
let articles = [];
let page = 1;
let totalPage = 1;
let totalResult = 0;
const PAGE_SIZE = 1;
const groupSize = 3;

let news_url = new URL(`https://noonanewsapi.netlify.app/top-headlines?`);

const getNews = async () => {
  try {
    news_url.searchParams.set("page", page);
    console.log("error", page);
    const response = await fetch(news_url);
    const data = await response.json();
    if (response.status === 200) {
      if (data.articles.length == 0) {
        page = 0;
        totalPage = 0;
        news_paginationRender();
        throw new Error("No result for this search");
      }
      newsList = data.articles;
      totalPage = 3;
      totalResult = data.totalResults;
      news_render();
      news_paginationRender();
    } else {
      page = 0;
      totalPage = 0;
      news_paginationRender();
      throw new Error(data.message);
    }
  } catch (error) {
    console.log("error", error.message);
    page = 0;
    totalPage = 0;
    news_paginationRender();
    errorRender(error.message);
  }
};

const getLatestNews = async () => {
    news_url = new URL(`https://noonanewsapi.netlify.app/top-headlines?q=코인&page=1&pageSize=1`);
  getNews();
};

const news_render = () => {
  const newsHTML = newsList
    .map(
      (news) => `        <div class="news">
  <div class="img-area">
    <img class="news-img" src=${news.urlToImage} />
  </div>
  <div class="text-area">
    <div class="news-title">${news.title}</div>
    <p>${
      news.description == null || news.description == ""
        ? "내용없음"
        : news.description.length > 50
        ? news.description.substring(0, 50) + "..."
        : news.description
    }</p>
    <div>${news.source.name}${news.publishedAt}</div>
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

const news_paginationRender = () => {
  let paginationHTML = ``;
  let pageGroup = Math.ceil(page / groupSize);
  let lastPage = pageGroup * groupSize;

  if (lastPage > totalPage) {
    lastPage = totalPage;
  }
  let firstPage =
    lastPage - (groupSize - 1) <= 0 ? 1 : lastPage - (groupSize - 1);
  for (let i = firstPage; i <= lastPage; i++) {
    paginationHTML += `<li class="page-item">
                        <input class="page-link" type="radio" onclick="moveToPage(${i})" ${i == page ? "checked" : ""} ></input>
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

  // 스크롤 최상단으로 이동하는 애니메이션
  document.getElementById("scrollToTop").addEventListener("click", function() {
    // 부드럽게 스크롤 애니메이션
    window.scroll({
      top: 0,
      left: 0,
      behavior: "smooth"
    });
  });
 
  // 스크롤 위치에 따라 스크롤 최상단 버튼 표시/숨김
  window.onscroll = function() {
    var scrollButton = document.getElementById("scrollToTop");
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
      scrollButton.style.display = "flex";
    } else {
      scrollButton.style.display = "none";
    }
  };
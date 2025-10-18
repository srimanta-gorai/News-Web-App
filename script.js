// ✅ Mock API endpoints
const urls = {
    cricket: "https://mocki.io/v1/cdf62c94-59cd-48e2-b833-b1496ab73f43",
    technology: "https://mocki.io/v1/4841fbd9-db64-423b-b313-d5732a3a3a28",
    politics: "https://mocki.io/v1/b06f3c62-5f73-4d2b-9fe8-5968b313f537",
    business: "https://mocki.io/v1/c175624e-6496-493b-a394-93dbc57f5fca"
};

// ✅ Default News API (Home page)
const defaultUrl = "https://mocki.io/v1/ddc2686e-13e7-432d-bc8f-c08c3bd4607c";

// ✅ Load default news on page start
window.addEventListener("load", () => fetchNews(""));

// ✅ Fetch News Function
async function fetchNews(query) {
    const news_url = urls[query.toLowerCase()] || defaultUrl;
    console.log("Fetching news from:", news_url, query);

    try {
        const res = await fetch(news_url);
        const data = await res.json();

        if (!data.articles || data.articles.length === 0) {
            document.getElementById("cardscontainer").innerHTML =
                `<p class="error">⚠️ No news found for "${query || 'top headlines'}".</p>`;
            return;
        }

        bindData(data.articles);
    } catch (error) {
        console.error("Error fetching news:", error);
        document.getElementById("cardscontainer").innerHTML =
            `<p class="error">⚠️ Failed to load news. Please try again later.</p>`;
    }
}

// ✅ Bind data to cards
function bindData(articles) {
    const container = document.getElementById("cardscontainer");
    const template = document.getElementById("template-news-card");

    container.innerHTML = "";

    articles.forEach(article => {
        if (!article.urlToImage) return;

        const cardClone = template.content.cloneNode(true);
        fillDataInCard(cardClone, article);
        container.appendChild(cardClone);
    });
}

// ✅ Fill each news card with article data
function fillDataInCard(cardClone, article) {
    const newsImg = cardClone.querySelector("#news-img");
    const newsTitle = cardClone.querySelector("#news-title");
    const newsSource = cardClone.querySelector("#news-source");
    const newsDesc = cardClone.querySelector("#news-desc");

    newsImg.src = article.urlToImage;
    newsTitle.innerHTML = article.title;
    newsDesc.innerHTML = article.description || "Click below to read full article.";

    const date = new Date(article.publishedAt).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata"
    });

    newsSource.innerHTML = `${article.source.name} • ${date}`;

    cardClone.firstElementChild.addEventListener("click", () => {
        window.open(article.url, "_blank");
    });
}

// ✅ Category Navigation
let curSelectedNav = null;

function onNavItemClick(category) {
    fetchNews(category);

    const navItem = document.getElementById(category);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = navItem;
    curSelectedNav.classList.add("active");
}

// ✅ Search Feature
const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");

searchButton.addEventListener("click", () => {
    const query = searchText.value.trim();
    if (!query) return;

    fetchNews(query);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = null;
});

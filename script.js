// Mock API endpoints
const urls = {
    india: "https://mocki.io/v1/ddc2686e-13e7-432d-bc8f-c08c3bd4607c", // default India news
    cricket: "https://mocki.io/v1/cdf62c94-59cd-48e2-b833-b1496ab73f43",
    technology: "https://mocki.io/v1/4841fbd9-db64-423b-b313-d5732a3a3a28",
    politics: "https://mocki.io/v1/b06f3c62-5f73-4d2b-9fe8-5968b313f537",
    business: "https://mocki.io/v1/c175624e-6496-493b-a394-93dbc57f5fca"
};

// Keep track of current active nav
let curSelectedNav = null;

// Load default India news on page load
window.addEventListener("load", () => {
    onNavItemClick("india"); // fetch India news and mark active
});

// Fetch news function
async function fetchNews(query) {
    const loader = document.getElementById("loading");
    loader.style.display = "block"; // show loader

    const news_url = urls[query.toLowerCase()] || urls["india"];
    console.log("Fetching news from:", news_url, query);

    try {
        const res = await fetch(news_url);
        const data = await res.json();

        if (!data.articles || data.articles.length === 0) {
            document.getElementById("cardscontainer").innerHTML =
                `<p class="error">⚠️ No news found for "${query || 'India'}".</p>`;
            return;
        }
        await delay(500);
        bindData(data.articles);
    } catch (error) {
        console.error("Error fetching news:", error);
        document.getElementById("cardscontainer").innerHTML =
            `<p class="error">⚠️ Failed to load news. Please try again later.</p>`;
    } finally {
        loader.style.display = "none"; // hide loader after fetch
    }
}

// Bind articles to cards
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

// Fill card with article data
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

// Category Navigation
function onNavItemClick(category) {
    fetchNews(category);

    const navItem = document.getElementById(category);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = navItem;
    curSelectedNav.classList.add("active");
}

// Search Feature
const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");

searchButton.addEventListener("click", () => {
    const query = searchText.value.trim();
    if (!query) return;

    fetchNews(query);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = null;
});

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

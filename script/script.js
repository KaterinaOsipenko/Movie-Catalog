
const API_KEY = "771abc61-a43f-4d4b-8e01-acbf82ab54b2";
const API_URL_TOP = "https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_100_POPULAR_FILMS&page=";
const API_URL_SEARCH = "https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=";
const API_URL_PLOT = "https://kinopoiskapiunofficial.tech/api/v2.2/films/";
const API_URL_VIDEO = "https://kinopoiskapiunofficial.tech/api/v2.2/films/";

let currentPage = 1;
getMovies(`${API_URL_TOP}${currentPage}`);

async function getMovies(url) {
    const resp = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            "X-API-KEY": API_KEY,
        },
    });
    const respData = await resp.json();
    showMovies(respData);
}

const nextPage = document.querySelector(".hands-right");
const prevPage = document.querySelector(".hands-left");
const prevPagePagination = document.querySelector(".prev");
const nextPagePagination = document.querySelector('.next');
const pages = document.querySelectorAll(".page");
checkPages();
pages[0].classList.add("current_page");

function nextPageGo() {
    currentPage++;
    window.scrollTo(0, 0);
    for (let i = 0; i < pages.length; i++) {
        if (currentPage == pages[i].innerHTML) {
            pages[i - 1].classList.remove("current_page");
            pages[i].classList.add("current_page");
            break;
        }
    }
    getMovies(`${API_URL_TOP}${currentPage}`);
    checkPages();
}

function prevPageGo() {
    currentPage--;
    window.scrollTo(0, 0);
    for (let i = 0; i < pages.length; i++) {
        if (currentPage == pages[i].innerHTML) {
            pages[i + 1].classList.remove("current_page");
            pages[i].classList.add("current_page");
            break;
        }
    }

    getMovies(`${API_URL_TOP}${currentPage}`);
    checkPages();
}

nextPage.addEventListener('click', (e) => nextPageGo());
nextPagePagination.addEventListener('click', (e) => nextPageGo());
prevPage.addEventListener('click', (e) => prevPageGo());
prevPagePagination.addEventListener('click', (e) => prevPageGo());

function checkPages() {
    if (currentPage > 1) {
        prevPage.style.visibility = "visible";
        prevPagePagination.style.visibility = "visible";
    } else {
        prevPage.style.visibility = "hidden";
        prevPagePagination.style.visibility = "hidden";
    }
}

const logo = document.querySelector(".logo");
logo.addEventListener('click', (e) => {
    getMovies(`${API_URL_TOP}${1}`);
    currentPage = 1;
    checkPages();
})

function showMovies(data) {

    const moviesEl = document.querySelector(".container-card");

    moviesEl.innerHTML = "";

    data.films.forEach((movie) => {
        const movieEl = document.createElement("div");
        movieEl.classList.add("card");
        movieEl.innerHTML = `
        <div class="cover">
            <img class="movie-cover"  src="${movie.posterUrlPreview}"
                alt="${movie.nameRu}">
        </div>
        <div class="info-wrap">
            <div class="info">
                <div class="title">${movie.nameRu}</div>
                <div class="category">${movie.genres.map(
            (genre) => `${genre.genre}`
        )} 
                </div>
            </div>
            <div style="display:none" class='filmId'>${movie.filmId}</div>
            <div class="rate">${rating(movie.rating)}</div>
        </div>`
            ;

        const plot = document.createElement("div");
        plot.classList.add("plot");
        moviesEl.appendChild(movieEl);
        moviesEl.appendChild(plot);
    });
}

function rating(movie) {
    if (movie.includes("%")) {
        const val = movie.slice(0, -1);
        return Number(val / 10).toFixed(1);
    }
    return movie;
}

const form = document.querySelector("form");
const search = document.querySelector(".header-search");

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const apiSearchUrl = `${API_URL_SEARCH}${search.value}`;
    if (search.value) {
        getMovies(apiSearchUrl);
        search.value = "";
    }
});

const moviesEl = document.querySelector(".container-card");

moviesEl.addEventListener("mouseover", (e) => {
    e.preventDefault();
    let target = e.target.closest(".card");
    let targetId = target.querySelector(".filmId").innerHTML;
    const plot = target.nextElementSibling;
    fetch(`${API_URL_PLOT}${targetId}`, {
        headers: {
            "Content-Type": "application/json",
            "X-API-KEY": API_KEY,
        },
    })
        .then(res => res.json())
        .then(json => plot.innerHTML = `${json.description}`)


    let coords = target.getBoundingClientRect();
    plot.style.top = coords.y + 55 + window.pageYOffset + 'px';
    plot.style.left = coords.x + 15 + window.pageXOffset + "px";
    plot.style.display = "block";
});

moviesEl.addEventListener("mouseout", (e) => {
    let target = e.target.closest(".card");
    const plot = target.nextElementSibling;
    plot.style.display = "none";
});


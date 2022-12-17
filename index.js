const inputMovie = document.getElementById("input-movie");
const searchMovieBtn = document.getElementById("search-bar-form");
const searchResults = document.getElementById("search-results");
let watchlistImdbArr = JSON.parse(localStorage.getItem("watchlist")) || [];

searchMovieBtn.addEventListener("submit", handleSearchBtn);

function handleSearchBtn(e){
    e.preventDefault()
    const inputMovieName = inputMovie.value;
    let resultImdbIdArr = [];

    fetch(`https://www.omdbapi.com/?apikey=f554505&s=${inputMovieName}&type=movie`)
        .then(res => res.json())
        .then(movieData => {
            resultImdbIdArr = movieData.Search.map(movieObj => movieObj.imdbID)
            renderMovies(resultImdbIdArr);
        })
        .catch(err => searchResults.innerHTML = `
        <h1 class="movie-not-found">Oops ! Not able to find any such movie </h1>`);
}

function renderMovies(imdbArr){
    searchResults.innerHTML = "";
    imdbArr.forEach((imdbId) => {
        fetch(`https://www.omdbapi.com/?apikey=f554505&i=${imdbId}`)
            .then(res => res.json())
            .then(movieData => searchResults.innerHTML += getMovieHtml(movieData))
            .catch(err => console.log("imdb id not found"));
    });
}

function getMovieHtml(detailMovieData){
    const {imdbID, Title, imdbRating, Runtime, Genre, Plot, Poster} = detailMovieData;
    const movieHtml = 
            `
            <div class="movie d-flex" id = "${imdbID}">
                    <img src= ${ Poster == "N/A"?"images/posterNotFound.png":Poster}
                    class="movie-poster"
                    alt="movie poster"
                    class="movie-poster">
                <div class="movie-info">
                    <header class="d-flex">
                        <h2 class="movie-name">${Title}</h2>
                        <div class="rating">
                            <i class="fa-solid fa-star"></i>
                            <span>${imdbRating}</span>
                        </div>
                    </header>
                    <div class="highlights d-flex">
                        <span class="movie-time">${Runtime}</span>
                        <span class="genre">${Genre}</span>
                        <button id = "add-${imdbID}" onclick="addToWatchlist('${imdbID}')">
                            <i class="fa-solid fa-circle-plus"></i>
                            watchlist
                        </button>
                    </div>
                    <p class="summary">${Plot}</p>
                </div>
        </div>`
    return movieHtml;
}

function addToWatchlist(imdbId){
    // Add only if it's not already present
    if (watchlistImdbArr.indexOf(imdbId) == -1){
        watchlistImdbArr.push(imdbId);
    }
    localStorage.setItem("watchlist", JSON.stringify(watchlistImdbArr));
    document.getElementById(`add-${imdbId}`).setAttribute("disabled", "");
    document.getElementById(`add-${imdbId}`).innerHTML = `
                            <i class="fa-solid fa-check"></i>
                            watchlist`;
}
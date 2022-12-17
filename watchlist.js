const movieList = document.getElementById("movie-list");
const watchlistImdbArr = JSON.parse(localStorage.getItem("watchlist")) || [];

function render(){
    if (watchlistImdbArr.length != 0){
        renderMovies(watchlistImdbArr);
    }
    else{
        renderInitialMessage();
    }
}


function renderMovies(imdbArr){
    movieList.innerHTML = "";
    imdbArr.forEach((imdbId) => {
        fetch(`https://www.omdbapi.com/?apikey=f554505&i=${imdbId}`)
            .then(res => res.json())
            .then(movieData => movieList.innerHTML += getMovieHtml(movieData))
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
                        <button onclick="removeFromWatchList('${imdbID}')">
                            <i class="fa-solid fa-circle-minus"></i>
                            remove
                        </button>
                    </div>
                    <p class="summary">${Plot}</p>
                </div>
        </div>`
    return movieHtml;
}

function removeFromWatchList(imdbId){
    const index = watchlistImdbArr.indexOf(imdbId);
    if (index > -1){
        watchlistImdbArr.splice(index, 1);
        if (watchlistImdbArr.length === 0){
            render();
        }
    }
    localStorage.setItem("watchlist", JSON.stringify(watchlistImdbArr));
    movieList.querySelector(`#${imdbId}`).remove();
}

function renderInitialMessage()
{
    movieList.innerHTML = 
    `<div class="no-data-initial">
    <p>Your watchlist is looking little empty...</p>
    <a href="index.html" class="add-some-movies">
        <i class="fa-solid fa-circle-plus"></i>
        <span>Let's add some movies !</span>
    </a>
    </div>`
};

render();
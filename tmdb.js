       const API_URL = "https://api.themoviedb.org/3";
        const IMAGE_URL = "https://image.tmdb.org/t/p/w200";
        const YOUTUBE_URL = "https://www.youtube.com/embed/";
        
        async function fetchMovies() {
            let response = await fetch(`${API_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=es-ES`);
            let data = await response.json();
            displayMovies(data.results);
        }

        function displayMovies(movies) {
            const movieContainer = document.getElementById("movies");
            movieContainer.innerHTML = "";
            movies.forEach(movie => {
                let movieElement = document.createElement("div");
                movieElement.classList.add("movie-item");
                movieElement.innerHTML = `
                    <img src="${IMAGE_URL}${movie.poster_path}" alt="${movie.title}" onclick="loadMovie(${movie.id})">
                `;
                movieContainer.appendChild(movieElement);
            });
            loadMovie(movies[0].id);
        }

        async function loadMovie(movieId) {
            let response = await fetch(`${API_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&language=es-ES&append_to_response=videos`);
            let movie = await response.json();
            document.getElementById("title").textContent = movie.title;
            document.getElementById("year").textContent = `Año: ${movie.release_date.split("-")[0]}`;
            document.getElementById("genres-info").textContent = `Género: ${movie.genres.map(g => g.name).join(", ")}`;
            document.getElementById("rating").textContent = `Calificación: ${movie.vote_average.toFixed(1)}/10`;
            document.getElementById("synopsis").textContent = `Sinopsis: ${movie.overview}`;

            let trailer = movie.videos.results.find(video => video.type === "Trailer");
            document.getElementById("trailer").src = trailer ? `${YOUTUBE_URL}${trailer.key}` : "";
        }

        async function fetchGenres() {
            let response = await fetch(`${API_URL}/genre/movie/list?api_key=${TMDB_API_KEY}&language=es-ES`);
            let data = await response.json();
            const genreContainer = document.getElementById("genres");
            data.genres.forEach(genre => {
                let genreElement = document.createElement("span");
                genreElement.textContent = genre.name;
                genreElement.onclick = () => filterByGenre(genre.id);
                genreContainer.appendChild(genreElement);
            });
        }

        async function filterByGenre(genreId) {
            let response = await fetch(`${API_URL}/discover/movie?api_key=${TMDB_API_KEY}&language=es-ES&with_genres=${genreId}`);
            let data = await response.json();
            displayMovies(data.results);
        }

        async function fetchYears() {
            const yearContainer = document.getElementById("years");
            let currentYear = new Date().getFullYear();
            for (let i = 0; i < 10; i++) {
                let yearElement = document.createElement("span");
                yearElement.textContent = currentYear - i;
                yearElement.onclick = () => filterByYear(currentYear - i);
                yearContainer.appendChild(yearElement);
            }
        }

        async function filterByYear(year) {
            let response = await fetch(`${API_URL}/discover/movie?api_key=${TMDB_API_KEY}&language=es-ES&primary_release_year=${year}`);
            let data = await response.json();
            displayMovies(data.results);
        }

        async function searchMovies() {
            let query = document.getElementById("search").value;
            if (query.length > 2) {
                let response = await fetch(`${API_URL}/search/movie?api_key=${TMDB_API_KEY}&language=es-ES&query=${query}`);
                let data = await response.json();
                displayMovies(data.results);
            }
        }

        document.addEventListener("DOMContentLoaded", () => {
            fetchMovies();
            fetchGenres();
            fetchYears();
        });

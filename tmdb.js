const API_KEY = "c71d55c790adcb0fa9ea6ebcbc9a61a7";
const API_URL = "https://api.themoviedb.org/3";


document.addEventListener("DOMContentLoaded", () => {
    loadMovies();
});

// Cargar películas populares
function loadMovies() {
    fetch(`${API_URL}/movie/popular?api_key=${API_KEY}&language=es&page=1`)
        .then(response => response.json())
        .then(data => {
            displayMovies(data.results);
            loadMovieDetails(data.results[0].id); // Cargar la primera película automáticamente
        });
}

// Mostrar lista de películas
function displayMovies(movies) {
    const movieContainer = document.getElementById("movies");
    movieContainer.innerHTML = "";
    movies.forEach(movie => {
        const div = document.createElement("div");
        div.classList.add("movie");
        div.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w300${movie.poster_path}" alt="${movie.title}">
            <p>${movie.title}</p>
        `;
        div.onclick = () => loadMovieDetails(movie.id);
        movieContainer.appendChild(div);
    });
}

// Cargar detalles de una película
function loadMovieDetails(movieId) {
    fetch(`${API_URL}/movie/${movieId}?api_key=${API_KEY}&language=es`)
        .then(response => response.json())
        .then(movie => {
            document.getElementById("title").textContent = movie.title;
            document.getElementById("year").textContent = `Año: ${movie.release_date.split("-")[0]}`;
            document.getElementById("genres").textContent = `Géneros: ${movie.genres.map(g => g.name).join(", ")}`;
            document.getElementById("rating").innerHTML = `⭐ ${movie.vote_average.toFixed(1)}`;
            document.getElementById("overview").textContent = movie.overview || "Sin sinopsis disponible.";
            
            // Buscar tráiler
            fetch(`${API_URL}/movie/${movieId}/videos?api_key=${API_KEY}`)
                .then(response => response.json())
                .then(data => {
                    const trailer = data.results.find(video => video.type === "Trailer");
                    document.getElementById("trailerFrame").src = trailer ? `https://www.youtube.com/embed/${trailer.key}` : "";
                });

            // Buscar reparto principal
            loadCast(movieId);
        });
}

// Buscar reparto principal
function loadCast(movieId) {
    fetch(`${API_URL}/movie/${movieId}/credits?api_key=${API_KEY}&language=es`)
        .then(response => response.json())
        .then(data => {
            const castContainer = document.getElementById("cast");
            castContainer.innerHTML = "";
            
            data.cast.slice(0, 5).forEach(actor => { // Solo los primeros 5 actores
                const div = document.createElement("div");
                div.classList.add("cast-member");
                div.innerHTML = `
                    <img src="${actor.profile_path ? "https://image.tmdb.org/t/p/w200" + actor.profile_path : "https://via.placeholder.com/80"}" alt="${actor.name}">
                    <p>${actor.name}</p>
                `;
                castContainer.appendChild(div);
            });
        });
}

// Buscar películas
function searchMovies() {
    const query = document.getElementById("search").value;
    if (query.length < 3) return;

    fetch(`${API_URL}/search/movie?api_key=${API_KEY}&query=${query}&language=es`)
        .then(response => response.json())
        .then(data => {
            displayMovies(data.results);
            if (data.results.length > 0) loadMovieDetails(data.results[0].id);
        });
}

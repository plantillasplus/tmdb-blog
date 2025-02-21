// nuevooooooooooooooooooooo


const API_KEY = "c71d55c790adcb0fa9ea6ebcbc9a61a7";
const API_URL = "https://api.themoviedb.org/3";


document.addEventListener("DOMContentLoaded", () => {
    loadMovies();
});

let currentPage = 1;

// Cargar películas populares
function loadMovies() {
    fetch(`${API_URL}/movie/popular?api_key=${API_KEY}&language=es&page=${currentPage}`)
        .then(response => response.json())
        .then(data => {
            displayMovies(data.results);
            if (currentPage === 1) loadMovieDetails(data.results[0].id); // Cargar la primera película automáticamente
        });
}

// Mostrar lista de películas
function displayMovies(movies) {
    const movieContainer = document.getElementById("movies");
    
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
            
            data.cast.slice(0, 5).forEach(actor => {
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

// Mostrar más películas
function loadMoreMovies() {
    currentPage++;
    loadMovies();
}

// Buscar películas
function searchMovies() {
    const query = document.getElementById("search").value;
    if (query.length < 3) return;

    fetch(`${API_URL}/search/movie?api_key=${API_KEY}&query=${query}&language=es`)
        .then(response => response.json())
        .then(data => {
            document.getElementById("movies").innerHTML = "";
            displayMovies(data.results);
            if (data.results.length > 0) loadMovieDetails(data.results[0].id);
        });
}

// Cambiar fondo del reproductor
function updateBackground(imageUrl) {
    document.getElementById('background-image').style.backgroundImage = `url(${imageUrl})`;
}

// Mostrar Loader en el reproductor
document.getElementById('trailerFrame').addEventListener('load', function() {
    document.getElementById('loader').style.display = 'none';
});
function showLoader() {
    document.getElementById('loader').style.display = 'block';
}

// Filtros de Géneros y Años
const genres = ["Animación", "Terror", "Acción", "Drama", "Comedia", "Aventura", "Fantasía", "Suspenso", "Ciencia Ficción", "Misterio"];
const years = Array.from({ length: 10 }, (_, i) => 2025 - i);

function renderFilters(list, containerId) {
    const container = document.getElementById(containerId);
    list.forEach(item => {
        const span = document.createElement('span');
        span.textContent = item;
        span.onclick = () => filterMovies(item);
        container.appendChild(span);
    });
}
renderFilters(genres, 'genres-list');
renderFilters(years, 'years-list');

function filterMovies(filter) {
    console.log("Filtrando por:", filter);
}

import React, { useState, useEffect } from 'react';
import './App.css';
import movieGenres from './movie-data/genres.json';
import posterNotFound from './poster_not_found.png';
import movieData from './movie-data/movies-2020s.json';
  
let genreMap = [], movieMap = []
const loadMovieData = () => {
  // Construct list of genres
  for (const genre of movieGenres) {
    genreMap[genre] = [];
  }

  // Build movie map and add pointers to movies for related genres
  for (const movie of movieData) {
    for (const g of movie.genres) {
      movieMap[movie.href] = movie;
      genreMap[g].push(movie.href);
    }
  }
};

loadMovieData();


const App = () => {
  const [selectedGenre, setSelectedGenre] = useState('');
  const [currentMovie, setCurrentMovie] = useState(null);

  useEffect(() => {
    selectAndDisplayMovie(selectedGenre);
  }, []); // Empty dependency array ensures this runs only once on mount

  // Select 
  const selectAndDisplayMovie = (genre) => {
    const movie = pickRandomMovie(genre);
    setCurrentMovie(movie);
  };

  const pickRandomMovie = (genre) => {
    let rand = 0;
    // If no genre selected, pick one at random
    if (!genre) {
      rand = Math.floor(Math.random() * movieGenres.length);
      genre = movieGenres[rand];
    }

    // Select a random movie tied to the selected genre
    rand = Math.floor(Math.random() * genreMap[genre].length);
    let selection = genreMap[genre][rand];
    let movie = movieMap[selection];
    return movie;
  };

  // Create HTML for movie title display
  const displayMovie = (movie) => {
    if (!movie) return null; // Handle case where movie is not yet loaded
    let wikiLink = "https://en.wikipedia.org/wiki/" + movie.href;
    let moviePoster = movie.thumbnail && imageExists(movie.thumbnail) ? movie.thumbnail : posterNotFound;

    return (
      <div className="flex flex-col items-center justify-center">
        <a
          className="flex flex-col items-center justify-center px-5 pb-1 pt-3 font-large font-extrabold text-gray-500 rounded-lg bg-gray-50 hover:text-gray-900 hover:bg-gray-100 dark:text-white dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white"
          href={wikiLink}
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="mb-1">
            <img src={moviePoster} className="rounded-lg h-96" alt="logo" />
          </div>
          {movie.title} ({movie.year})
        </a>
      </div>
    );
  };

  const imageExists = (image_url) => {
    var http = new XMLHttpRequest();
    http.open('HEAD', image_url, false);
    http.send();

    return http.status != 404;

}

  // Handle genre button clicks
  const handleClick = (genre) => {
    setSelectedGenre(genre);
    selectAndDisplayMovie(genre);
  };

  const buildGenreButtons = () => {
    const rows = [];
    const rowLength = [8, 10, 10, 8];
  
    for (let i = 0; i < movieGenres.length; i += rowLength[rows.length]) {
      const buttons = movieGenres.slice(i, i + rowLength[rows.length]).map((genre, index) => (
        <Button key={i + index} label={genre} onClick={() => handleClick(genre)} />
      ));
      
      rows.push(
        <div key={i} className="button-row">
          {buttons}
        </div>
      );
    }

    return (
      <div className="genre-buttons">
        {rows}
      </div>
    );
  };

  return (
    <div className="App dark:bg-gray-900">
      <header className="App-header">
        <h1 class="mb-4 text-4xl font-extrabold leading-none rounded tracking-tight text-gray-900 md:text-5xl lg:text-5xl dark:text-white">Movie Night <mark class="italic px-3 text-white bg-gradient-to-br from-purple-600 to-blue-500 rounded dark:bg-blue-500">Helper</mark></h1>
        {displayMovie(currentMovie)}
        <h3 class="mt-6 mb-1 font-semibold leading-none rounded tracking-tight text-gray-900 text-xl dark:text-white">Not interested? Pick another!</h3>
        {buildGenreButtons()}
      </header>
    </div>
  );
};

const Button = ({ label, onClick }) => {
  return (
    <button class="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800" onClick={() => onClick(label)}>
      <span class="relative px-2 py-1 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
        {label}
      </span>
    </button>
  );
};

export default App;

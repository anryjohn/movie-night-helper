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

  // Build movie map and add pointers to movies to related genres
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
    let moviePoster = movie.thumbnail ? movie.thumbnail : posterNotFound;
    let wikiLink = "https://en.wikipedia.org/wiki/" + movie.href;

    return (
      <div className="Movie-display">
        <img src={moviePoster} className="movie-poster" alt="logo" />
        <br></br>
        <a
          className="App-link"
          href={wikiLink}
          target="_blank"
          rel="noopener noreferrer"
        >
          {movie.title} ({movie.year})
        </a>
      </div>
    );
  };

  // Handle genre button clicks
  const handleClick = (genre) => {
    setSelectedGenre(genre);
    selectAndDisplayMovie(genre);
  };

  const buildGenreButtons = () => {
    const rows = [];
  
    for (let i = 0; i < movieGenres.length; i += 12) {
      const buttons = movieGenres.slice(i, i + 12).map((genre, index) => (
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
    <div className="App">
      <header className="App-header">
        <h1>What Movie Should I Watch Tonight?</h1>
        {displayMovie(currentMovie)}
        {buildGenreButtons()}
      </header>
    </div>
  );
};

const Button = ({ label, onClick }) => {
  return (
    <button className="button" onClick={() => onClick(label)}>
      {label}
    </button>
  );
};

export default App;

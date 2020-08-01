import React, { useState, useEffect } from "react";
import axios from "./axios";
import "./Row.css";
import YouTube from "react-youtube";
import movieTrailer from "movie-trailer";

const base_url = "https://image.tmdb.org/t/p/original";

// title and fetchUrl are props
function Row({ title, fetchUrl, isLargeRow }) {
  const [movies, setMovies] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState("");

  // snippet of code that runs on a specific condition/variable
  useEffect(() => {
    // if [], run once when the row loads and dont run it again
    // if [something], will update depending on the dependecy

    /* THIS GETS THE NETFLIX ORIGINALS  */
    async function fetchData() {
      const request = await axios.get(fetchUrl);
      // https://api.themoviedb.org/3/discover/tv?api_key=${APIKEY}&with_networks=213

      setMovies(request.data.results);
      return request;
    }
    fetchData();
  }, [fetchUrl]); // fetchUrl needs to be in the bracket since it is a vraible outside of the block

  const opts = {
    height: "390",
    width: "100%",
    playerVars: {
      // https::/developers.google.com/youtube/player_parameters
      autoplay: 1,
    },
  };

  const handleClick = (movie) => {
    if (trailerUrl) {
      setTrailerUrl("");
    } else {
      movieTrailer(movie?.name || movie?.title || movie?.original_name || "")
        .then((url) => {
          const urlParams = new URLSearchParams(new URL(url).search);
          console.log(urlParams.get("v"));
          setTrailerUrl(urlParams.get("v"));
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <div className="row">
      <h2>{title}</h2>

      <div className="row__posters">
        {movies.map((movie) => (
          <img
            key={movie.id}
            className={`row__poster ${isLargeRow && "row__posterLarge"}`}
            src={`${base_url}${
              isLargeRow ? movie.poster_path : movie.backdrop_path
            }`}
            alt={movie.name}
            onClick={() => handleClick(movie)}
          />
        ))}
      </div>
      {trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}
    </div>
  );
}

export default Row;

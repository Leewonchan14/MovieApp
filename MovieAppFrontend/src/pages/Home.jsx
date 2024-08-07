import React from 'react';
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ADD_MOVIE_PAGE_PATH } from "./AddMovie";
import { MOVIE_DETAIL_PAGE_PATH_FN } from "./MovieDetail";

export const HOME_PAGE_PATH = "/";

const Home = () => {
  return <MovieGrid />;
};

export default Home;

const MovieGrid = () => {
  const [movies, setMovies] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const fetchMovies = async () => {
    setIsFetching(true);
    const response = await axios.request({
      method: "get",
      url: "/movie",
      params: {
        page: 0,
        pageSize: 10,
      },
    });
    setMovies(response.data);
    setIsFetching(false);
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <div className={"grid grid-cols-3 gap-4 m-10"}>
      {!isFetching &&
        movies.map((movie) => <Movie key={movie.movieId} movie={movie} />)}
      <AddMovieButton />
    </div>
  );
};

export const Movie = ({ movie, className, onClick }) => {
  let navigate = useNavigate();

  const { movieId, title, genre, createdAt, updatedAt } = movie;

  const goMovieDetail = () => {
    navigate(MOVIE_DETAIL_PAGE_PATH_FN(movieId));
  };

  const { year, day, month, hour, minute } = DateConverter(createdAt);
  return (
    <div
      className={`relative w-full h-44 flex flex-col justify-center items-center border-2 p-4 rounded-lg cursor-pointer gap-2 ${className}`}
      onClick={onClick ? onClick : goMovieDetail}
    >
      <h2 className={"text-2xl font-bold"}>{title}</h2>
      <span className={""}>{movieId}번 영화</span>
      <h4>{genre} 장르</h4>
      <span
        className={"absolute right-4 bottom-4"}
      >{`${year.toString().slice(2)}.${month}.${day} ${hour}시 ${minute}분`}</span>
    </div>
  );
};

export const DateConverter = (isoDate) => {
  let date = new Date(isoDate);
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDay(),
    hour: date.getHours(),
    minute: date.getMinutes(),
  };
};

const AddMovieButton = () => {
  let navigate = useNavigate();
  return (
    <div
      className={
        "relative w-full h-44 flex justify-center items-center border-2 rounded-lg cursor-pointer"
      }
      onClick={() => {
        navigate(ADD_MOVIE_PAGE_PATH);
      }}
    >
      <span className={"text-5xl font-bold text-blue-300"}>+</span>
    </div>
  );
};

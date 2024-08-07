import React from 'react';
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { DateConverter, HOME_PAGE_PATH, Movie } from "./Home";

export const MOVIE_DETAIL_PAGE_PATH = "/movie/:movieId";
export const MOVIE_DETAIL_PAGE_PATH_FN = (movieId) => `/movie/${movieId}`;
const MovieDetail = () => {
  let params = useParams();
  const { movieId } = params;
  const [isFetching, setIsFetching] = useState(false);
  const [movie, setMovie] = useState({
    movieId,
    title: "테스트 타이틀",
    createdAt: "2024-08-05T18:49:10.000Z",
    updatedAt: "2024-08-05T18:49:10.000Z",
  });

  const [reviews, setReviews] = useState(
    [...Array(3)].map(() => ({
      reviewId: Math.random(),
      content: "그냥 저냥한 영화",
      rating: 3.5,
      createdAt: "2024-08-05T18:49:10.000Z",
      updatedAt: "2024-08-05T18:49:10.000Z",
    }))
  );

  const fetchReviews = async () => {
    setIsFetching(true);
    const response = await axios.request({
      url: `/review/movie/${movieId}`,
      method: "get",
      params: {
        page: 0,
        pageSize: 100,
      },
    });

    const { movie, reviews } = response.data;

    setReviews(reviews);
    setMovie(movie);

    setIsFetching(false);
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  if (isFetching) {
    return null;
  }

  return (
    <div className={"flex flex-col items-center my-20"}>
      <div className={"w-96"}>
        <Movie movie={movie} className={""} onClick={() => {}} />
        <MovieDeleteButton movieId={movieId}/>
        <ReviewInput movieId={movieId} fetchReviews={fetchReviews} />
        <ReviewList reviews={reviews} />
      </div>
    </div>
  );
};

const MovieDeleteButton = ({ movieId }) => {
  const [isMutating, setIsMutating] = useState(false);
  let navigate = useNavigate();
  const onMovieDelete = async () => {
    setIsMutating(true);
    try {
      const response = await axios.request({
        url: `/movie`,
        method: "delete",
        data: {
          movieId,
        },
      });
    } catch (e) {
      console.error(e)
    } finally {
      setIsMutating(false);
      navigate(HOME_PAGE_PATH);
    }
  };

  return (
    <button
      disabled={isMutating}
      onClick={() => {
        let isDeleteTrue = window.confirm("영화를 삭제 하시겠습니까?");
        console.log(isDeleteTrue);
        if (isDeleteTrue) {
          onMovieDelete();
        }
      }}
      className={
        "block mx-auto my-2 w-32 text-center py-2 rounded-lg font-bold text-white bg-red-500 text-lg"
      }
    >
      삭제
    </button>
  );
};

const ReviewInput = ({ movieId, fetchReviews }) => {
  const [isMutating, setIsMutating] = useState(false);
  const [input, setInput] = useState({
    content: "",
    rating: 0,
  });

  const onSubmitReview = async () => {
    if(input.content.trim().length === 0){
      window.alert("리뷰를 입력해 주세요!");
      return;
    }

    setIsMutating(true);
    setErrorMessage("");
    try {
      let response = await axios.request({
        method: "post",
        url: "/review",
        data: {
          movieId,
          ...input,
        },
      });

      setInput({ content: "", rating: 0 });
      await fetchReviews();
    } catch (e) {
      if (e.response.status === 400) {
        setErrorMessage("잘못된 요청입니다. 다시 시도하세요");
      }
    } finally {
      setIsMutating(false);
    }
  };

  const [errorMessage, setErrorMessage] = useState("");
  return (
    <div className={"w-full"}>
      <div className={"border-2 rounded-lg flex"}>
        <input
          onKeyDown={(e)=>{
            if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
              e.preventDefault();
              onSubmitReview();
            }
          }}
          type="text"
          className={"w-full p-2 outline-none"}
          placeholder={"리뷰를 적어주세요"}
          value={input.content}
          onChange={(e) => {
            setInput({ ...input, content: e.target.value });
          }}
        />
        <button
          disabled={isMutating}
          onClick={onSubmitReview}
          className={"rounded-r-lg bg-blue-600 text-white w-20"}
        >
          입력
        </button>
      </div>
      <div className={"flex justify-between "}>
        {[...Array(5)].map((_, i) => (
          <div
            key={Math.random()}
            className={"flex gap-2"}
            onClick={() => {
              setInput({ ...input, rating: i + 1 });
            }}
          >
            <input
              value={i + 1}
              checked={input.rating === i + 1}
              onChange={(e) => {
                setInput({ ...input, rating: i + 1 });
              }}
              type="radio"
              name={"rating"}
              id={i.toString()}
            />
            <label className={"block flex-1"} htmlFor={i.toString()}>
              {i + 1} 점
            </label>
          </div>
        ))}
      </div>
      <div
        className={`text-center text-red-600 mb-10 ${errorMessage.trim().length === 0 ? "invisible" : "visible"}`}
      >
        {errorMessage}
      </div>
    </div>
  );
};

const ReviewList = ({ reviews }) => {
  return (
    <div className={"w-full flex flex-col gap-4"}>
      {reviews.map((review) => (
        <Review key={review.reviewId} review={review} />
      ))}
    </div>
  );
};

const Review = ({ review }) => {
  const { year, month, day, hour, minute } = DateConverter(review.createdAt);
  const contentTime = new Date(review.createdAt).getTime();
  const nowTime = new Date().getTime();
  let gapTime = Math.abs(contentTime - nowTime);
  let time;
  // 1일 안 차이라면
  if (gapTime < 1000 * 60 * 60 * 24) {
    time = `${Math.ceil(gapTime / (1000 * 60 * 60))}시간 전`;
  }
  // 1시간 안 차이라면
  else if (gapTime < 1000 * 60 * 60) {
    time = `${Math.ceil(gapTime / (1000 * 60))}분 전`;
  } else {
    time = `${year.toString().slice(2)}.${month}.${day}`;
  }
  return (
    <div className={"relative border-2 w-full p-4 rounded-lg"}>
      <div>{review.content}</div>
      <div className={"text-start text-blue-600 font-bold"}>
        {review.rating}점
      </div>
      <div className={"absolute right-2 bottom-2"}>{time}</div>
    </div>
  );
};

export default MovieDetail;

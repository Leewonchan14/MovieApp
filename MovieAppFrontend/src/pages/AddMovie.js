import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ADD_MOVIE_PAGE_PATH = "/movie";

const AddMovie = () => {
  let navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  const onBack = () => {
    navigate(-1);
  };
  const [input, setInput] = useState({
    title: "",
    genre: MOVIE_GENRE[0].genre,
  });

  const createMovie = async () => {
    try {
      await axios.request({
        url: "/movie",
        method: "post",
        data: input,
      });

      onBack();
    } catch (e) {
      if (e.response.status === 400) {
        setErrorMessage("제목을 입력하세요!");
      }
    }
  };
  return (
    <div className={"w-screen h-screen flex justify-center items-center"}>
      <div className={"w-96 p-4 border-2 rounded-lg flex flex-col gap-8"}>
        <TitleInput input={input} setInput={setInput} />
        <GenreInput input={input} setInput={setInput} />
        <span className={"w-full text-center text-red-600"}>
          {errorMessage}
        </span>
        <div className={"flex gap-2"}>
          <BlueButton text={"저장"} onClick={createMovie} />
          <BlueButton
            text={"뒤로 가기"}
            className={"bg-red-500"}
            onClick={onBack}
          />
        </div>
      </div>
    </div>
  );
};

const TitleInput = ({ input, setInput }) => {
  return (
    <div className={"w-full"}>
      <label className={"block pl-1"}>제목</label>
      <input
        value={input.title}
        onChange={(e) => {
          setInput({ ...input, title: e.target.value });
        }}
        className={"rounded-lg border-2 w-full p-2"}
        placeholder={"영화 제목을 입력 하세요"}
        type="text"
      />
    </div>
  );
};

const GenreInput = ({ input, setInput }) => {
  return (
    <div className={""}>
      <label>장르</label>
      <div className={"flex justify-between"}>
        {MOVIE_GENRE.map(({ genre, name }) => (
          <div
            onClick={() => {
              setInput({ ...input, genre });
            }}
            className={"flex gap-2"}
            key={genre}
          >
            <input
              onChange={() => {}}
              type="radio"
              name={"genre"}
              checked={genre === input.genre}
            />
            <label htmlFor={genre}>{name}</label>
          </div>
        ))}
      </div>
    </div>
  );
};

const BlueButton = ({ text, onClick, className }) => {
  return (
    <button
      className={`border-2 bg-blue-600 text-white font-bold w-full py-2 text-center rounded-lg ${className}`}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

const MOVIE_GENRE = [
  {
    genre: "ACTION",
    name: "액션",
  },
  {
    genre: "COMEDY",
    name: "코메디",
  },
  {
    genre: "ROMANCE",
    name: "로맨스",
  },
];
export default AddMovie;

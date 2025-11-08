import React, { useState } from "react";
import BG from "../assets/img/login_bg.jpg";
import { useAppDispatch, useAppSelector } from "../state/hooks";
import { loginAction } from "../state/authSlice";
import { Link } from "react-router-dom";

const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.auth);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: login logic
    console.log({ username, password });
    dispatch(loginAction({ username, password }));
  };

  return (
    <div
      className="min-h-screen flex justify-center bg-cover bg-center px-5"
      style={{ backgroundImage: `url(${BG})` }}
    >
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md flex flex-col gap-6 h-fit mt-20"
      >
        {/* <img src={AppLogo} alt="WatchTogether Logo" className="h-25 mx-auto " /> */}

        <div className="flex flex-col gap-2">
          <label
            htmlFor="username"
            className="text-sm font-medium text-gray-700"
          >
            Felhasználónév
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
            placeholder="Felhasználónév"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label
            htmlFor="password"
            className="text-sm font-medium text-gray-700"
          >
            Jelszó
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
            placeholder="Jelszó"
          />
        </div>
        <button
          type="submit"
          className="bg-purple-600 text-white font-semibold py-2 rounded hover:bg-purple-700 transition"
        >
          Bejelentkezés
        </button>
        <Link to="/register" className="text-purple-700 text-center">
          Regisztráció
        </Link>
        <Link
          to="/forgot-password"
          className="text-blue-900 text-center text-xs"
        >
          Elfelejtettem a jelszavam
        </Link>
        {isLoading && <p>Loading...</p>}
      </form>
    </div>
  );
};

export default Login;

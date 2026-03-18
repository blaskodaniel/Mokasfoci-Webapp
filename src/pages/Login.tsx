import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Api from "@/services/service";
import { ApiError } from "@/utils/apiError";
import { useConfig } from "@/hooks/useConfig";

const Login: React.FC = () => {
  const { login, refreshMe } = useAuth();
  const { config } = useConfig();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      setIsSubmitting(true);
      const response = await Api.login(username.trim(), password);
      login(response.token, response.user);
      await refreshMe();
    } catch (err: unknown) {
      const error = ApiError.getErrorMessage(err);
      setErrorMessage(error);
      console.error("Login error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center bg-cover bg-center px-3 sm:px-5">
      <form
        onSubmit={handleSubmit}
        className="px-4 py-4 sm:p-8 w-full max-w-md flex flex-col gap-6 h-fit mt-20"
      >
        <img src="/logo.png" alt="WatchTogether Logo" className="h-20 mx-auto " />
        <h2 className="text-2xl font-bold text-center text-text-primary mb-4">Bejelentkezés</h2>

        <div className="flex flex-col gap-2">
          <label htmlFor="username" className="text-sm font-medium text-white-700">
            Felhasználónév
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="text-white border border-gray-300/20 rounded px-3 py-2
            focus:outline-none focus:ring-2 focus:ring-purple-400"
            placeholder="Felhasználónév"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="text-sm font-medium text-white-700">
            Jelszó
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="text-white border border-gray-300/20 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
            placeholder="Jelszó"
          />
        </div>
        {errorMessage && <p className="text-red-500 text-sm text-center">{errorMessage}</p>}
        <button
          type="submit"
          className="bg-button-light text-white font-semibold py-2 rounded hover:bg-button-light-hover 
          transition cursor-pointer"
          disabled={isSubmitting}
        >
          Bejelentkezés
        </button>
        {config?.enabledRegistration && (
          <Link to="/regisztracio" className="text-text-primary text-center">
            Regisztráció
          </Link>
        )}
        <Link to="/forgot-password" className="text-text-muted text-center text-xs">
          Elfelejtettem a jelszavam
        </Link>
        {isSubmitting && <p>Loading...</p>}
      </form>
    </div>
  );
};

export default Login;

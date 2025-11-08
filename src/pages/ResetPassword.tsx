import { useNavigate } from "react-router-dom";
import BG from "../assets/img/login_bg.jpg";
import { useState } from "react";
import { AxiosError } from "axios";
import type { ApiError } from "@/utils/apiError";

const ResetPassword = () => {
  const navigate = useNavigate();
  // const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (password.trim() === "" || confirmPassword.trim() === "") {
        setError("Jelszó kötelező.");
        return;
      }

      if (password !== confirmPassword) {
        setError("Jelszavak nem egyeznek.");
        return;
      }

      setIsLoading(true);
      // await Api.resetPassword(password, token || "");
      setSuccess(true);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const msg = (error.response?.data as ApiError).message;
        setError(msg || "Hiba történt a jelszó visszaállítás során.");
      } else {
        setError("Hiba történt a jelszó visszaállítás során.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const navigateHandler = () => {
    setSuccess(false);
    navigate("/login");
  };

  return (
    <div
      className="min-h-screen flex justify-center bg-cover bg-center px-5"
      style={{ backgroundImage: `url(${BG})` }}
    >
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md flex flex-col gap-6 h-fit mt-20">
        {/* <img
          src={AppLogo}
          alt="WatchTogether Logo"
          className="h-25 mx-auto"
          onClick={() => navigate("/login")}
        /> */}

        {!success ? (
          <>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="username"
                className="text-sm font-medium text-gray-700"
              >
                Új jelszó*
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                placeholder="Új jelszó"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="confirmPassword"
                className="text-sm font-medium text-gray-700"
              >
                Új jelszó megint*
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                placeholder="Új jelszó megint"
              />
            </div>
            {error && (
              <div className="text-red-600 text-sm text-center">{error}</div>
            )}
            <button
              type="button"
              onClick={handleSubmit}
              className="bg-purple-600 text-white font-semibold py-2 rounded hover:bg-purple-700 transition"
            >
              Mentés
            </button>
          </>
        ) : (
          <div className="text-center text-green-900">
            <div className="font-semibold">
              Sikeresen megváltoztattad a jelszavad!
            </div>
            <div className="text-sm text-gray-600 pt-3">
              Mostmár bejelentkezhetsz az új jelszavaddal.
            </div>
            <div
              onClick={navigateHandler}
              className="text-purple-700 text-center cursor-pointer mt-5"
            >
              Bejelentkezés
            </div>
          </div>
        )}

        {isLoading && <p>Loading...</p>}
      </div>
    </div>
  );
};

export default ResetPassword;

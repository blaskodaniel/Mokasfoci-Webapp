import { useNavigate } from "react-router-dom";
import BG from "../assets/img/login_bg.jpg";
import { useState } from "react";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (email.trim() === "") {
        setError("Email cím nélkül nem lehet jelszót visszaállítani.");
        return;
      }
      setIsLoading(true);
      // await Api.forgotPassword(email);
      setSuccess(true);
    } catch (error: unknown) {
      console.error("Failed to send reset link:", error);
      setError("Hiba történt");
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
        {/* <img src={AppLogo} alt="WatchTogether Logo" className="h-25 mx-auto " /> */}
        {!success ? (
          <>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="username"
                className="text-sm font-medium text-gray-700"
              >
                Add meg az email címet amivel regisztráltál*
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                placeholder="Email cím"
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
              Küldés
            </button>
          </>
        ) : (
          <div className="text-center text-green-900">
            <div className="font-semibold">
              Sikeresen elküldtük a jelszó visszaállító linket az email címedre!
            </div>
            <div className="text-sm text-gray-600 pt-3">
              Nézd meg a spam mappádat is, mert lehet, hogy oda érkezett. Ha nem
              találod, próbáld újra vagy ellenőrizd, hogy jól adtad-e meg az
              email címed, amivel regisztráltál.
            </div>
          </div>
        )}

        <div
          onClick={navigateHandler}
          className="text-purple-700 text-center text-xs cursor-pointer"
        >
          Vissza a bejelentkezéshez
        </div>
        {isLoading && <p>Loading...</p>}
      </div>
    </div>
  );
};

export default ForgotPassword;

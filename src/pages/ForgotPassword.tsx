import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import Api from "@/services/service";
import Button from "@/components/Button";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    try {
      if (email.trim() === "") {
        setError("Email cím nélkül nem lehet jelszót visszaállítani.");
        return;
      }
      setIsLoading(true);
      await Api.forgotPassword(email);
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
    <div className="min-h-screen flex justify-center bg-cover bg-center px-3 sm:px-5">
      <div className="p-8 w-full max-w-md flex flex-col gap-6 h-fit mt-20">
        {/* <img src={AppLogo} alt="WatchTogether Logo" className="h-25 mx-auto " /> */}
        {!success ? (
          <>
            <div className="flex flex-col gap-2">
              <label htmlFor="username" className="text-sm font-medium text-white-700">
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
            {error && <div className="text-red-600 text-sm text-center">{error}</div>}
            <Button
              className="bg-button-light px-4 py-2 rounded hover:bg-primary-700 transition"
              text="Küldés"
              onClick={handleSubmit}
              loading={isLoading}
              loadingText="Küldés.."
            />
          </>
        ) : (
          <div className="text-center text-green-500">
            <div className="flex justify-center mb-5">
              <FaCheckCircle size={40} />
            </div>
            <div className="font-semibold">
              Sikeresen elküldtük a jelszó visszaállító linket az email címedre!
            </div>
            <div className="text-sm text-gray-600 pt-3">
              Nézd meg a spam mappádat is, mert lehet, hogy oda érkezett. Ha nem találod, próbáld
              újra vagy ellenőrizd, hogy jól adtad-e meg az email címed, amivel regisztráltál.
            </div>
          </div>
        )}

        <div onClick={navigateHandler} className="text-white text-center text-xs cursor-pointer">
          Vissza a bejelentkezéshez
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

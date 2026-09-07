import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import Api from "@/services/service";
import Button from "@/components/Button";
import AuthCard from "@/components/ui/AuthCard";
import AuthInput from "@/components/ui/AuthInput";

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
    <AuthCard
      title="Elfelejtett jelszó"
      subtitle={!success ? "Add meg az email címet, amivel regisztráltál" : undefined}
    >
      {!success ? (
        <div className="flex flex-col gap-4">
          <AuthInput
            label="Email cím"
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Email cím"
          />
          {error && <div className="text-center text-sm text-red-400">{error}</div>}
          <Button
            variant="cta"
            text="Küldés"
            onClick={handleSubmit}
            loading={isLoading}
            loadingText="Küldés.."
            className="w-full mt-2"
          />
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 text-center">
          <FaCheckCircle size={40} className="text-badge-success" />
          <div className="font-semibold text-text-primary">
            Sikeresen elküldtük a jelszó visszaállító linket az email címedre!
          </div>
          <div className="text-sm text-text-secondary leading-relaxed">
            Nézd meg a spam mappádat is, mert lehet, hogy oda érkezett. Ha nem találod, próbáld
            újra vagy ellenőrizd, hogy jól adtad-e meg az email címed, amivel regisztráltál.
          </div>
        </div>
      )}

      <div
        onClick={navigateHandler}
        className="mt-6 text-center text-xs text-text-muted hover:text-text-secondary transition-colors cursor-pointer"
      >
        Vissza a bejelentkezéshez
      </div>
    </AuthCard>
  );
};

export default ForgotPassword;

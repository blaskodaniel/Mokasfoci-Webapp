import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { AxiosError } from "axios";
import type { ApiError } from "@/utils/apiError";
import Api from "@/services/service";
import AuthCard from "@/components/ui/AuthCard";
import AuthInput from "@/components/ui/AuthInput";
import Button from "@/components/Button";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { token } = useParams();
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
      await Api.resetPassword(password, token || "");
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
    <AuthCard title="Jelszó megváltoztatása">
      {!success ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <AuthInput
            label="Új jelszó"
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Új jelszó"
          />
          <AuthInput
            label="Új jelszó megint"
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="Új jelszó megint"
          />
          {error && <div className="text-center text-sm text-red-400">{error}</div>}
          <Button
            type="submit"
            variant="cta"
            text="Mentés"
            loading={isLoading}
            className="w-full mt-2"
          />
        </form>
      ) : (
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="text-lg font-semibold text-badge-success">
            Sikeresen megváltoztattad a jelszavad!
          </div>
          <div className="text-sm text-text-secondary">
            Mostmár bejelentkezhetsz az új jelszavaddal.
          </div>
          <Button variant="cta" text="Bejelentkezés" onClick={navigateHandler} className="w-full mt-1" />
        </div>
      )}
    </AuthCard>
  );
};

export default ResetPassword;

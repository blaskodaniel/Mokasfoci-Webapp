import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Api from "@/services/service";
import { ApiError } from "@/utils/apiError";
import { useConfig } from "@/hooks/useConfig";
import { IoEye, IoEyeOff } from "react-icons/io5";
import AuthCard from "@/components/ui/AuthCard";
import AuthInput from "@/components/ui/AuthInput";
import Button from "@/components/Button";

const Login: React.FC = () => {
  const { login, refreshMe } = useAuth();
  const { config } = useConfig();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
    <AuthCard title="Bejelentkezés">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <AuthInput
          label="Felhasználónév"
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          placeholder="Felhasználónév"
        />
        <AuthInput
          label="Jelszó"
          id="password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="Jelszó"
          rightElement={
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPassword((v) => !v)}
              className="text-text-muted hover:text-white transition-colors"
            >
              {showPassword ? <IoEyeOff size={18} /> : <IoEye size={18} />}
            </button>
          }
        />
        {errorMessage && <p className="text-center text-sm text-red-400">{errorMessage}</p>}
        <Button
          type="submit"
          variant="cta"
          text="Bejelentkezés"
          disabled={isSubmitting}
          loading={isSubmitting}
          loadingText="Bejelentkezés..."
          className="w-full mt-2"
        />
      </form>
      <div className="mt-6 flex flex-col items-center gap-2 text-sm">
        {config?.enabledRegistration && (
          <Link
            to="/regisztracio"
            className="text-accent-soft hover:text-highlight transition-colors font-medium"
          >
            Regisztráció
          </Link>
        )}
        <Link
          to="/forgot-password"
          className="text-text-muted text-xs hover:text-text-secondary transition-colors"
        >
          Elfelejtettem a jelszavam
        </Link>
      </div>
    </AuthCard>
  );
};

export default Login;

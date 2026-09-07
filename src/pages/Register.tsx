import React, { useEffect, useState } from "react";
import Api from "../services/service";
import { Link, useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import Modal from "@/components/Modal";
import Button from "@/components/Button";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { useConfig } from "@/hooks/useConfig";
import AuthCard from "@/components/ui/AuthCard";
import AuthInput from "@/components/ui/AuthInput";

const Register: React.FC = () => {
  const { config } = useConfig();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [invitationCode, setInvitationCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("A jelszavak nem egyeznek!");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const trimmedUsername = username.trim();
      if (config?.enabledInvitation) {
        await Api.register(trimmedUsername, email, password, invitationCode);
        setInvitationCode("");
      } else {
        await Api.register(trimmedUsername, email, password);
      }

      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setIsModalOpen(true);
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        setError(
          err.response?.data?.message || "Hiba történt a regisztráció során. Kérlek, próbáld újra."
        );
      } else {
        setError("Hiba történt a regisztráció során. Kérlek, próbáld újra.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => setIsModalOpen(false);
  }, []);

  return (
    <AuthCard title="Regisztráció">
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
          label="Email cím"
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Email cím"
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
        <AuthInput
          label="Jelszó megerősítése"
          id="confirmPassword"
          type={showConfirmPassword ? "text" : "password"}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          placeholder="Jelszó megerősítése"
          rightElement={
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowConfirmPassword((v) => !v)}
              className="text-text-muted hover:text-white transition-colors"
            >
              {showConfirmPassword ? <IoEyeOff size={18} /> : <IoEye size={18} />}
            </button>
          }
        />
        {config?.enabledInvitation && (
          <AuthInput
            label="Meghívó kód"
            id="invitationCode"
            type="text"
            value={invitationCode}
            onChange={(e) => setInvitationCode(e.target.value)}
            required
            placeholder="Meghívó kód"
          />
        )}
        {error && <div className="text-center text-sm text-red-400">{error}</div>}
        <Button
          type="submit"
          variant="cta"
          text="Regisztráció"
          loading={loading}
          className="w-full mt-2"
        />
      </form>
      <div className="mt-6 text-center text-sm">
        <Link to="/login" className="text-accent-soft hover:text-highlight transition-colors font-medium">
          Bejelentkezés
        </Link>
      </div>

      <Modal
        isOpen={isModalOpen}
        position="center"
        className="w-full max-w-sm rounded-tile border border-tile-border bg-[image:var(--tile-bg-gradient)] p-6"
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <IoIosCheckmarkCircle size={40} className="text-badge-success" />
          <div className="text-xl font-bold text-text-primary">Sikeres regisztráció!</div>
          <div className="text-sm text-text-secondary mb-2">Most már bejelentkezhetsz.</div>
          <Button
            variant="cta"
            text="Bejelentkezés"
            onClick={() => navigate("/login")}
            className="w-full mt-1"
          />
        </div>
      </Modal>
    </AuthCard>
  );
};

export default Register;

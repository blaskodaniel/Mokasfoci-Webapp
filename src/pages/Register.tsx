import React, { useEffect, useState } from "react";
import Api from "../services/service";
import { Link, useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import Modal from "@/components/Modal";
import Button from "@/components/Button";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { useConfig } from "@/hooks/useConfig";

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
      if (config?.enabledInvitation) {
        await Api.register(username, email, password, invitationCode);
        setInvitationCode("");
      } else {
        await Api.register(username, email, password);
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
    <div className="min-h-screen flex justify-center bg-cover bg-center px-3 sm:px-5">
      <form onSubmit={handleSubmit} className="p-4 w-full max-w-md flex flex-col gap-4 h-fit mt-10">
        <h2 className="text-2xl font-bold text-center text-text-primary mb-4">Regisztráció</h2>
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
            className="text-white border border-gray-300/20  rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Felhasználónév"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-sm font-medium text-white-700">
            Email cím
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="text-white border border-gray-300/20  rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Email cím"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="text-sm font-medium text-white-700">
            Jelszó
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full text-white border border-gray-300/20 rounded px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Jelszó"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              {showPassword ? <IoEyeOff size={18} /> : <IoEye size={18} />}
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="confirmPassword" className="text-sm font-medium text-white-700">
            Jelszó megerősítése
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full text-white border border-gray-300/20 rounded px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Jelszó megerősítése"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              {showConfirmPassword ? <IoEyeOff size={18} /> : <IoEye size={18} />}
            </button>
          </div>
        </div>
        {config?.enabledInvitation && (
          <div className="flex flex-col gap-2">
            <label htmlFor="invitationCode" className="text-sm font-medium text-white-700">
              Meghívó kód
            </label>
            <input
              type="text"
              id="invitationCode"
              value={invitationCode}
              onChange={(e) => setInvitationCode(e.target.value)}
              required
              className="text-white border border-gray-300/20  rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Meghívó kód"
            />
          </div>
        )}
        {error && <div className="text-red-600 text-sm text-center">{error}</div>}
        <button
          type="submit"
          className="bg-button-light text-white font-semibold py-2 rounded hover:bg-button-light-hover transition"
        >
          Regisztráció
        </button>
        <Link to="/login" className="text-text-primary hover:underline text-center">
          Bejelentkezés
        </Link>
        {loading && <div className="text-center text-gray-600">Loading...</div>}
      </form>

      <Modal isOpen={isModalOpen} className="min-w-[300px] max-w-md bg-white p-4">
        <div className="flex flex-col gap-2">
          <div className="flex justify-center">
            <IoIosCheckmarkCircle size={40} className="text-green-700" />
          </div>
          <div className="text-center text-2xl text-green-700">Sikeres regisztráció!</div>
          <div className="text-center text-gray-600 text-sm mt-3 mb-3">
            Most már bejelentkezhetsz.
          </div>
          <div className="flex justify-center">
            <Button
              className="bg-button-bg px-4 py-2 rounded hover:bg-primary-700 transition"
              text="Bejelentkezés"
              onClick={() => navigate("/login")}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Register;

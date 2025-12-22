import Button from "@/components/Button";
import Input from "@/components/Input";
import Select from "@/components/Select";
import { useAppSelector } from "@/state/hooks";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  profileFormSchema,
  type ProfileFormData,
} from "@/utils/profileFormSchema";
import { useAllTeams } from "@/hooks/api/useTeams";
import { useEffect, useMemo, useRef, useState } from "react";
import { GROUPS } from "@/config";
import { formatPoints } from "@/utils/common";
import { FiEdit3, FiDollarSign } from "react-icons/fi";

const MyProfilePage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const {
    currentUser,
    isLoading: userLoading,
    error: userError,
  } = useAppSelector((state) => state.auth);

  const {
    data: teams,
    isLoading: teamsLoading,
    error: teamsError,
    refetch: refetchTeams,
  } = useAllTeams();

  const {
    handleSubmit,
    formState: { errors, isValid },
    control,
    watch,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    mode: "onChange",
    defaultValues: {
      name: currentUser?.name ?? "",
      teamid: currentUser?.data?.teamid?._id ?? "",
      avatar: currentUser?.avatar ?? "",
      winteamid: currentUser?.data?.winteamid?._id ?? "",
      A: currentUser?.data?.A?._id ?? "",
      B: currentUser?.data?.B?._id ?? "",
      C: currentUser?.data?.C?._id ?? "",
      D: currentUser?.data?.D?._id ?? "",
      E: currentUser?.data?.E?._id ?? "",
      F: currentUser?.data?.F?._id ?? "",
      G: currentUser?.data?.G?._id ?? "",
      H: currentUser?.data?.H?._id ?? "",
      I: currentUser?.data?.I?._id ?? "",
      J: currentUser?.data?.J?._id ?? "",
      K: currentUser?.data?.K?._id ?? "",
      L: currentUser?.data?.L?._id ?? "",
    },
  });

  // Form értékek figyelése
  const formValues = watch();

  // Legalább egy mező kitöltöttségének ellenőrzése
  const hasAnyFieldFilled = useMemo(() => {
    const fieldsToCheck = [
      "name",
      "teamid",
      "winteamid",
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
    ];
    return (
      fieldsToCheck.some((field) => {
        const value = formValues[field as keyof ProfileFormData];
        return value && value.trim() !== "";
      }) || selectedFile !== null
    ); // Vagy van kiválasztott file
  }, [formValues, selectedFile]);

  // Csapatok opciók készítése
  const teamOptions = useMemo(() => {
    if (!teams) return [];
    return teams.map((team) => ({
      value: team._id,
      label: team.name,
    }));
  }, [teams]);

  const onSubmit = (data: ProfileFormData) => {
    console.log("Form data:", data);
    console.log("Selected file:", selectedFile);

    // Itt csinálhatod a FormData-t a file-lal együtt
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key as keyof ProfileFormData] as string);
    });

    if (selectedFile) {
      formData.append("avatar", selectedFile);
    }

    console.log("FormData ready for API:", formData);
    // Itt hívnád meg az API-t a formData-val
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file); // File objektum külön state-ben

      // Kép előnézet generálása
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Avatar URL meghatározása (API URL vagy preview)
  const getAvatarUrl = () => {
    if (previewImage) {
      return previewImage; // Új feltöltött kép előnézete
    }
    return currentUser?.avatar; // Eredeti API URL
  };

  useEffect(() => {
    refetchTeams();
  }, [refetchTeams]);

  // Cleanup: preview image URL felszabadítása
  useEffect(() => {
    return () => {
      if (previewImage && previewImage.startsWith("blob:")) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

  console.log({ isValid, errors });
  console.log("Form values:", formValues);
  console.log("Has any field filled:", hasAnyFieldFilled);

  if (teamsLoading || userLoading) {
    return <p>Profil betöltése folyamatban...</p>;
  }

  if (!currentUser || !teams || teamsError || userError) {
    return <p>Hiba történt a betöltés során.</p>;
  }

  return (
    <div className="min-h-screen ">
      {/* Header with title and transaction button */}
      <div className="flex justify-between items-center p-6">
        <h1 className="text-3xl font-bold text-white">Profilom</h1>
        <Button
          text="Tranzakcióm"
          onClick={() => navigate("/transactions")}
          className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-full"
          icon={<FiDollarSign className="w-4 h-4" />}
        />
      </div>

      {/* Avatar and Stats Section */}
      <div className="flex justify-center mb-8">
        <div className=" p-8  max-w-md w-full mx-6">
          {/* Avatar */}
          <div className="flex justify-center mb-6">
            <div className="relative group">
              <div
                onClick={handleAvatarClick}
                className="w-32 h-32 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold cursor-pointer hover:scale-105 transition-transform duration-200 shadow-lg"
              >
                {getAvatarUrl() ? (
                  <img
                    src={getAvatarUrl()}
                    alt="Avatar"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  currentUser?.username?.charAt(0).toUpperCase() || "U"
                )}
              </div>
              <div className="absolute inset-0 bg-black/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                <FiEdit3 className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* User Info */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-white mb-2">
              {currentUser?.username}
            </h2>
            <p className="text-gray-400">{currentUser?.email}</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-linear-to-br from-green-500/20 to-green-600/20 rounded-xl p-4 border border-green-500/30">
              <div className="text-green-400 text-sm font-medium mb-1">
                Felhasználható pont
              </div>
              <div className="text-white text-xl font-bold">
                {formatPoints(currentUser?.data?.availableScore || 0, false)}
              </div>
            </div>
            <div className="bg-linear-to-br from-yellow-500/20 to-yellow-600/20 rounded-xl p-4 border border-yellow-500/30">
              <div className="text-yellow-400 text-sm font-medium mb-1">
                Nyeremény
              </div>
              <div className="text-white text-xl font-bold">
                {formatPoints(currentUser?.data?.profitScore || 0, false)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mx-auto px-6 space-y-8"
      >
        {/* Basic Info Section */}
        <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
          <h3 className="text-xl font-semibold text-white mb-6">Alapadatok</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input
              name="name"
              control={control}
              type="text"
              label="Név"
              placeholder="Add meg a neved"
              error={errors.name?.message}
            />
            <Select
              name="teamid"
              control={control}
              options={teamOptions}
              label="Kedvenc csapat"
              placeholder="Válaszd ki a kedvenc csapatodat"
              error={errors.teamid?.message}
            />
            <Select
              name="winteamid"
              control={control}
              options={teamOptions}
              label="Világbajnok csapat"
              placeholder="Melyik csapat nyeri a vb-t?"
              error={errors.winteamid?.message}
            />
          </div>
        </div>

        {/* Group Winners Section */}
        <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
          <h3 className="text-xl font-semibold text-white mb-6">
            Csoportgyőztesek
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
            {GROUPS.map((group) => (
              <Select
                key={group}
                name={group}
                control={control}
                options={teamOptions}
                label={`${group} csoport`}
                placeholder={`${group}`}
                error={errors[group as keyof ProfileFormData]?.message}
              />
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pb-8">
          <Button
            text="Profil mentése"
            type="submit"
            disabled={!isValid || !hasAnyFieldFilled}
            className="bg-green-600 hover:bg-green-700 px-8 py-3 text-lg font-semibold disabled:bg-gray-500 disabled:cursor-not-allowed"
            loading={false}
          />
        </div>
      </form>
    </div>
  );
};

export default MyProfilePage;

import Button from "@/components/Button";
import Input from "@/components/Input";
import Select from "@/components/Select";
import { useAppSelector } from "@/state/hooks";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileFormSchema, type ProfileFormData } from "@/utils/profileFormSchema";
import { useAllTeams } from "@/hooks/api/useTeams";
import { useEffect, useMemo, useState } from "react";
import { APP_CONFIG, DEFAULT_AVATAR_URL, GROUPS } from "@/config";
import { formatPoints } from "@/utils/common";
import { FiEdit3 } from "react-icons/fi";
import { useUpdateProfile } from "@/hooks/api/usePlayers";
import { useNotification } from "@/hooks/useNotification";
import type { UpdateUserProfileBody } from "@/services/types";
import AvatarModal from "@/components/MyProfile/AvatarModal";
import { useConfig } from "@/hooks/useConfig";
import { format, isAfter } from "date-fns";
import InfoTooltip from "@/components/InfoTooltip";

const MyProfilePage = () => {
  const { config } = useConfig();
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();

  const [isOpenAvatarModal, setIsOpenAvatarModal] = useState(false);

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

  const mutationUpdateProfile = useUpdateProfile();

  const isBettingLocked = useMemo(() => {
    if (!config?.championStartDate) return false;
    return isAfter(new Date(), new Date(config.championStartDate));
  }, [config]);

  // Form inicializálása
  const {
    handleSubmit,
    formState: { errors, isValid },
    control,
    watch,
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    mode: "onChange",
    defaultValues: {
      name: currentUser?.name ?? "",
      teamid: currentUser?.data?.teamid ?? "",
      avatar: currentUser?.avatar ?? "",
      winteamid: currentUser?.data?.winteamid ?? "",
      A: currentUser?.data?.A ?? "",
      B: currentUser?.data?.B ?? "",
      C: currentUser?.data?.C ?? "",
      D: currentUser?.data?.D ?? "",
      E: currentUser?.data?.E ?? "",
      F: currentUser?.data?.F ?? "",
      G: currentUser?.data?.G ?? "",
      H: currentUser?.data?.H ?? "",
      I: currentUser?.data?.I ?? "",
      J: currentUser?.data?.J ?? "",
      K: currentUser?.data?.K ?? "",
      L: currentUser?.data?.L ?? "",
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
    return fieldsToCheck.some((field) => {
      const value = formValues[field as keyof ProfileFormData];
      return value && value.trim() !== "";
    });
  }, [formValues]);

  // Csapatok opciók készítése
  const teamOptions = useMemo(() => {
    if (!teams) return [];
    return teams.map((team) => {
      const groupName = team.groupid.name as string;
      const userBet = currentUser?.data?.[groupName as keyof typeof currentUser.data];
      const hasWinner = !!team.groupid?.groupWinnerId;
      const isCalculated = !!team.groupid?.isCalculated;

      let betStatus: "success" | "failed" | "pending" = "pending";

      if (isCalculated && hasWinner) {
        if (userBet === team.groupid.groupWinnerId) {
          betStatus = "success";
        } else {
          betStatus = "failed";
        }
      }

      return {
        value: team._id,
        label: team.name,
        group: team.groupid.name,
        betStatus,
      };
    });
  }, [teams, currentUser]);

  const onSubmitForm = (data: ProfileFormData) => {
    const body = Object.keys(data).reduce((acc, key) => {
      const value = data[key as keyof ProfileFormData];
      if (value && value.trim() !== "") {
        acc[key as keyof UpdateUserProfileBody] = value;
      }
      return acc;
    }, {} as UpdateUserProfileBody);

    mutationUpdateProfile.mutate(body, {
      onSuccess: (updatedUser) => {
        console.log("Profile updated successfully:", updatedUser);
        showSuccess("Mentettük a profilodat");
      },
      onError: (error) => {
        console.error("Error updating profile:", error);
        showError("Hiba történt a profil frissítése során.");
      },
    });
  };

  // Avatar URL meghatározása (API URL vagy preview)
  const getAvatarUrl = () => {
    // Ha van valós avatar URL az API-ról
    if (currentUser?.avatar && currentUser.avatar.trim() !== "") {
      return `${APP_CONFIG.SERVER_URL}${currentUser.avatar}`;
    }

    // Default avatar
    return DEFAULT_AVATAR_URL;
  };

  useEffect(() => {
    refetchTeams();
  }, [refetchTeams]);

  // Form értékek frissítése amikor currentUser betöltődik
  useEffect(() => {
    if (currentUser) {
      reset({
        name: currentUser?.name ?? "",
        teamid: currentUser?.data?.teamid ?? "",
        avatar: currentUser?.avatar ?? "",
        winteamid: currentUser?.data?.winteamid ?? "",
        A: currentUser?.data?.A ?? "",
        B: currentUser?.data?.B ?? "",
        C: currentUser?.data?.C ?? "",
        D: currentUser?.data?.D ?? "",
        E: currentUser?.data?.E ?? "",
        F: currentUser?.data?.F ?? "",
        G: currentUser?.data?.G ?? "",
        H: currentUser?.data?.H ?? "",
        I: currentUser?.data?.I ?? "",
        J: currentUser?.data?.J ?? "",
        K: currentUser?.data?.K ?? "",
        L: currentUser?.data?.L ?? "",
      });
    }
  }, [currentUser, reset]);

  if (teamsLoading || userLoading) {
    return <p>Profil betöltése folyamatban...</p>;
  }

  if (!currentUser || !teams || teamsError || userError) {
    return <p>Hiba történt a betöltés során.</p>;
  }

  return (
    <div className="min-h-screen ">
      {/* Header with title and transaction button */}
      <div className="flex justify-between items-center p-3 sm:p-6">
        <h1 className="text-3xl font-bold text-white">Profilom</h1>
        <Button
          text="Pontjaim alakulása"
          onClick={() => navigate("/transactions")}
          className="bg-blue-800/30 hover:bg-blue-700/40 px-3 py-1 rounded-md text-xs"
        />
      </div>

      {/* Avatar and Stats Section */}
      <div className="flex justify-center mb-8">
        <div className="p-0 mt-5 sm:mt-0 sm:p-8 max-w-md w-full mx-6">
          {/* Avatar */}
          <div className="flex justify-center mb-6">
            <div className="relative group">
              <div
                className="w-32 h-32 rounded-full bg-linear-to-br flex 
                items-center justify-center text-white text-4xl font-bold cursor-pointer 
                hover:scale-105 transition-transform duration-200 shadow-lg"
              >
                <img
                  src={getAvatarUrl()}
                  alt="Avatar"
                  className="w-full h-full rounded-full object-cover"
                  onError={(e) => {
                    // Ha a kép betöltése sikertelen, fallback karakter
                    e.currentTarget.style.display = "none";
                    const fallbackDiv = e.currentTarget.nextElementSibling as HTMLElement;
                    if (fallbackDiv) {
                      fallbackDiv.style.display = "flex";
                    }
                  }}
                />
                <div
                  className="w-full h-full rounded-full flex items-center justify-center"
                  style={{ display: "none" }}
                >
                  {currentUser?.username?.charAt(0).toUpperCase() || "U"}
                </div>
              </div>
              <div
                onClick={() => setIsOpenAvatarModal(true)}
                className="absolute top-0 right-0 bg-blue-600 p-2 rounded-full cursor-pointer 
                shadow-lg hover:bg-blue-700 transition-colors z-10"
              >
                <FiEdit3 className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-white mb-2">{currentUser?.username}</h2>
            <p className="text-gray-400">{currentUser?.email}</p>
          </div>

          {/* Stats - Ultra Clean Design */}
          <div className="grid grid-cols-2 gap-6">
            {/* Available Score Card */}
            <div
              className="relative pl-3 pr-3 py-3 bg-gray-800/60 backdrop-blur-md 
            rounded-2xl border border-gray-700/50"
            >
              {/* Top row with label and info icon */}
              <div className="flex items-start justify-between mb-1">
                <div className="text-gray-400 text-xs font-medium">Felhasználható</div>
                <InfoTooltip text="A felhasználható pontjaid. Ez a keret, amiből gazdálkodhatsz és fogadhatsz. Erre kell vigyáznod hogy el ne fogyjon! Igazából itt ez a pénzed." />
              </div>

              {/* Main number */}
              <div className="text-white text-xl font-bold">
                {formatPoints(currentUser?.data?.availableScore || 0, false)}
              </div>
            </div>

            {/* Profit Score Card */}
            <div
              className="relative pl-3 pr-3 py-3 bg-gray-800/60 backdrop-blur-md rounded-2xl 
            border border-gray-700/50"
            >
              {/* Top row with label and info icon */}
              <div className="flex items-start justify-between mb-1">
                <div className="text-gray-400 text-xs font-medium">Nyeremény</div>
                <InfoTooltip text="Ez a tiszta hasznod. Az összess megnyert pontod összege (levonva a felrakott téteket). Ez mutatja meg, hogy mennyire vagy nyereséges és mennyire játszol ügyesen." />
              </div>

              {/* Main number */}
              <div className="text-white text-xl font-bold">
                {formatPoints(currentUser?.data?.profitScore || 0, false)}
              </div>
            </div>
          </div>

          {/* Rewards & Achievements Section */}
          <div className="grid grid-cols-2 gap-4 pt-6">
            {/* Group Winners Achievement Badge */}
            <div
              className="relative bg-linear-to-br from-purple-900/30 via-purple-800/20 to-transparent 
              backdrop-blur-md rounded-2xl border border-purple-500/30 p-4
              hover:border-purple-400/50 transition-all duration-300 hover:scale-[1.02] group"
            >
              {/* Glow effect */}
              <div className="absolute inset-0 bg-linear-to-br from-purple-500/0 via-purple-400/10 to-purple-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Content */}
              <div className="relative z-10">
                {/* Icon and label row */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div>
                      <div className="text-purple-300 text-xs font-medium">Csoportgyőztes</div>
                      <div className="text-gray-400 text-[10px]">találatok</div>
                    </div>
                  </div>
                  <InfoTooltip
                    text={`Eltalált csoportgyőztes tippek száma. Minden találatért ${config?.groupWinPoint || 1500} pont jár!`}
                  />
                </div>

                {/* Achievement display */}
                <div className="flex items-end justify-between">
                  {/* Count badge */}
                  <div className="flex items-baseline gap-2">
                    <div className="text-3xl font-bold text-white">
                      {currentUser?.data?.groupWinCount || 0}
                    </div>
                    <div className="text-sm text-purple-400">/ 12</div>
                  </div>

                  {/* Points earned */}
                  <div className="text-right">
                    <div className="text-xs text-gray-500">Nyert</div>
                    <div className="text-sm font-bold text-purple-400">
                      +
                      {formatPoints(
                        (currentUser?.data?.groupWinCount || 0) * (config?.groupWinPoint || 1500),
                        false
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Champion Team Achievement Badge */}
            <div
              className="relative bg-linear-to-br from-amber-900/30 via-yellow-800/20 to-transparent 
              backdrop-blur-md rounded-2xl border border-amber-500/30 p-4
              hover:border-amber-400/50 transition-all duration-300 hover:scale-[1.02] group"
            >
              {/* Glow effect */}
              <div className="absolute inset-0 bg-linear-to-br from-amber-500/0 via-yellow-400/10 to-amber-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Content */}
              <div className="relative">
                {/* Icon and label row */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div>
                      <div className="text-amber-300 text-xs font-medium">Bajnok csapat</div>
                      <div className="text-gray-400 text-[10px]">találat</div>
                    </div>
                  </div>
                  <InfoTooltip
                    text={`A világbajnok tipped. ${config?.championWinPoint || 5000} pontot kapsz ha eltalálod a végén!`}
                  />
                </div>

                {/* Achievement display */}
                <div className="flex items-end justify-between">
                  {/* Status badge */}
                  <div>
                    {currentUser?.data?.winteamid ? (
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-amber-400">
                          {teams.find((t) => t._id === currentUser?.data?.winteamid)?.name}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-gray-600" />
                        <span className="text-sm font-semibold text-gray-500">Nincs tipp</span>
                      </div>
                    )}
                  </div>

                  {/* Points at stake */}
                  <div className="text-right">
                    <div className="text-xs text-gray-500">Várható</div>
                    <div className="text-sm font-bold text-amber-400">
                      +{formatPoints(config?.championWinPoint || 5000, false)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <form onSubmit={handleSubmit(onSubmitForm)} className="mx-auto px-6 space-y-8">
        {/* Basic Info Section */}
        <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-4 md:p-6 border border-gray-700/50">
          <h3 className="text-xl font-semibold text-white">Alapadatok, kedvenc és bajnok csapat</h3>
          <p className="mb-6 text-gray-400 text-sm leading-relaxed tracking-wide mt-1">
            Tippeld meg ki lesz a világbajnok és válasszd ki a kedvenc csapatodat ami plusz pontokat
            hozhat neked a játék során! <br />
            <span className="text-red-500">
              Fontos, hogy ezeket csak a bajnokság legelső mérkőzésének a kezdési időpontjáig tudod
              beállítani. (
              {format(
                new Date(config?.championStartDate ? config?.championStartDate : new Date()),
                "MMM dd HH:mm"
              )}
              )
            </span>
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-6">
            <Input
              name="name"
              control={control}
              type="text"
              label="Nevem"
              placeholder="Add meg a neved"
              description="Ha megadod akkor ez fog megjelenni mindenhol a userneved helyett"
              error={errors.name?.message}
            />
            <Select
              name="teamid"
              control={control}
              options={teamOptions}
              label={`Kedvenc csapatom ( +${config?.favoritTeamFactor}x )`}
              description={`Minden egyes mérkőzésen, amikor a kedvenc csapatod 
                játszik és eltalálod a mérkőzés kimenetelét, plusz ${config?.favoritTeamFactor}x-es 
                szorzót kapsz a nyereményre.`}
              placeholder="Válaszd ki a kedvenc csapatodat"
              error={errors.teamid?.message}
              disabled={isBettingLocked}
            />
            <Select
              name="winteamid"
              control={control}
              options={teamOptions}
              label={`Világbajnok csapat (+${config?.championWinPoint} pont)`}
              description={`Ha eltalálod a bajnok csapatot akkor plusz ${config?.championWinPoint} pont jóváírást kapsz`}
              placeholder="Melyik csapat nyeri a vb-t?"
              error={errors.winteamid?.message}
              disabled={isBettingLocked}
            />
          </div>
        </div>

        {/* Group Winners Section */}
        <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-4 md:p-6 border border-gray-700/50">
          <h3 className="text-xl font-semibold text-white">
            Csoportgyőztesek{" "}
            <span className="text-sm">(+{config?.groupWinPoint} pont / találat)</span>
          </h3>
          <p className="mb-6 text-gray-400 text-sm leading-relaxed tracking-wide mt-1">
            Tippeld meg az egyes csoportok csoportgyőzteseit. Ha eltalálod akkor plusz{" "}
            {config?.groupWinPoint} pontot kapsz csoportonként. <br />{" "}
            <span className="text-red-500">
              Fontos, hogy a csoportgyőztesek megtippelése, a bajokság legelső mérkőzésének a
              kezdési időpontjáig lehetséges (
              {format(
                new Date(config?.championStartDate ? config?.championStartDate : new Date()),
                "MMM dd HH:mm"
              )}
              )
            </span>
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-2 md:gap-4">
            {GROUPS.map((group) => {
              const options = teamOptions.filter(
                (option) => option.group.toUpperCase() === group.toUpperCase()
              );
              // It's safe to check the first option's betStatus because all teams in a group will have the same status
              // since it's evaluating the user's bet for the *entire group*.
              const firstOptionStatus = options.length > 0 ? options[0]?.betStatus : "pending";
              const statusSuffix =
                firstOptionStatus === "success"
                  ? ` ✓ ( + ${config?.groupWinPoint} pont)`
                  : firstOptionStatus === "failed"
                    ? " (✗)"
                    : "";

              return (
                <Select
                  key={group}
                  name={group}
                  control={control}
                  options={options}
                  label={`${group} csoport${statusSuffix}`}
                  placeholder={`${group}`}
                  error={errors[group as keyof ProfileFormData]?.message}
                  disabled={isBettingLocked}
                  status={firstOptionStatus}
                />
              );
            })}
          </div>
        </div>

        {/* Submit Button - sticky on mobile */}
        <div className="flex justify-end pb-8 md:static md:pb-8">
          <div
            className="w-full md:w-fit fixed bottom-0 left-0 right-0 z-50 p-4 bg-gray-900 md:static 
          md:bg-transparent md:p-0"
          >
            <Button
              text="Profil mentése"
              type="submit"
              disabled={!isValid || !hasAnyFieldFilled}
              className="bg-green-600 hover:bg-green-700 px-8 py-3 text-lg font-semibold disabled:bg-gray-500 disabled:cursor-not-allowed w-full md:w-fit"
              loading={false}
            />
          </div>
        </div>
      </form>

      {isOpenAvatarModal && (
        <AvatarModal isOpen={isOpenAvatarModal} onClose={() => setIsOpenAvatarModal(false)} />
      )}
    </div>
  );
};

export default MyProfilePage;

import {
  useGetDefaultAvatar,
  useUpdateAvatar,
  useUploadAvatar,
} from "@/hooks/api/usePlayers";
import Modal from "../Modal";
import type { DefaultAvatar } from "@/services/types";
import { APP_CONFIG } from "@/config";
import Button from "../Button";
import { useEffect, useRef, useState } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import { useNotification } from "@/hooks/useNotification";
import { useAppDispatch } from "@/state/hooks";
import { getMeAction } from "@/state/authSlice";

const AvatarModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { showSuccess, showError } = useNotification();
  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { data: defaultAvatars, error, isLoading } = useGetDefaultAvatar();

  const uploadAvatarMutation = useUploadAvatar();
  const changeAvatarMutation = useUpdateAvatar();

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

  const onUploadAvatar = () => {
    if (!selectedFile) {
      showError("Nincs kiválasztott fájl!");
      return;
    }

    console.log("Starting upload with file:", selectedFile);
    const formData = new FormData();
    formData.append("avatar", selectedFile);

    // Debug: FormData tartalmának ellenőrzése
    for (const [key, value] of formData.entries()) {
      console.log("FormData entry:", key, value);
    }

    uploadAvatarMutation.mutate(formData, {
      onSuccess: (data) => {
        console.log("Avatar uploaded successfully:", data);
        showSuccess("Avatar sikeresen feltöltve!");
        setSelectedFile(null);
        setPreviewImage(null);
        onClose();

        setTimeout(() => {
          dispatch(getMeAction());
        }, 100);
      },
      onError: (error) => {
        console.error("Error uploading avatar:", error);
        showError("Hiba történt az avatar feltöltése során.");
      },
    });
  };

  const onChangeAvatar = (avatarFilename: string) => {
    changeAvatarMutation.mutate(avatarFilename, {
      onSuccess: (data) => {
        console.log("Avatar changed successfully:", data);
        showSuccess("Avatar sikeresen módosítva!");
        onClose();

        setTimeout(() => {
          dispatch(getMeAction());
        }, 100);
      },
      onError: (error) => {
        console.error("Error changing avatar:", error);
        showError("Hiba történt az avatar módosítása során.");
      },
    });
  };

  // Cleanup: preview image URL felszabadítása
  useEffect(() => {
    return () => {
      if (previewImage && previewImage.startsWith("blob:")) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Avatar módosítása"
      className="sm:w-[550px] bg-quaternary px-4 py-3 sm:mx-3"
    >
      <div>
        {isLoading && <div>Loading...</div>}
        {error && (
          <div className="text-red-500">
            Hiba történt az avatarok betöltésekor. Kérlek próbáld újra.
          </div>
        )}
        <div
          className="grid grid-cols-[repeat(auto-fit,minmax(60px,1fr))] sm:grid-cols-6 
        gap-2 place-items-center max-h-[calc(100vh-300px)] sm:max-h-none overflow-y-auto overflow-x-hidden 
        sm:overflow-visible"
        >
          {defaultAvatars &&
            defaultAvatars.map((avatar: DefaultAvatar) => (
              <div
                key={`${avatar.path}`}
                className="w-15 h-15 rounded-full overflow-hidden cursor-pointer 
                hover:scale-105 transition-transform duration-200 border-2 border-transparent 
                hover:border-yellow-500"
                onClick={() => {
                  onChangeAvatar(avatar.filename);
                }}
              >
                <img
                  src={`${APP_CONFIG.SERVER_URL}${avatar.path}`}
                  alt={`Avatar ${avatar.name}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
        </div>
        <div
          className="bg-gray-800/30 backdrop-blur-sm rounded-2xl px-4 py-3 
        border border-gray-700/50 mt-5"
        >
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row  items-center gap-2">
              {/* File picker button */}
              <Button
                text="Saját kép kiválasztása"
                className="bg-blue-600 hover:bg-blue-700 px-3 py-2"
                onClick={() => fileInputRef.current?.click()}
              />

              {/* Preview image */}
              {previewImage && (
                <div className="w-16 h-16 rounded-full overflow-hidden">
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>

            {/* File uploading button */}
            {selectedFile && (
              <Button
                text="Feltöltöm"
                className="bg-amber-800 hover:bg-amber-900 px-3 py-2"
                onClick={onUploadAvatar}
                icon={<FaCloudUploadAlt size={20} />}
                disabled={uploadAvatarMutation.isPending}
                loading={uploadAvatarMutation.isPending}
              />
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AvatarModal;

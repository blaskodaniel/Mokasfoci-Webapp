import { ImSpinner2 } from "react-icons/im";

const FullPageLoader = () => {
  return (
    <div className="min-h-svh flex flex-col justify-center items-center gap-4">
      <ImSpinner2 className="animate-spin text-6xl text-primary" />
      <p className="text-center">Betöltés</p>
    </div>
  );
};

export default FullPageLoader;

import { ImSpinner2 } from "react-icons/im";

const PageLoader = ({ message = "Betöltés..." }) => {
  return (
    <div className="min-h-screen flex items-center justify-center -mt-15">
      <div className="flex flex-col items-center gap-4">
        <ImSpinner2 className="animate-spin text-6xl text-primary" />
        <div className="text-white text-xl">{message}</div>
      </div>
    </div>
  );
};

export default PageLoader;

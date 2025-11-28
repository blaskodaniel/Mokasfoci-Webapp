import { ImSpinner9 } from "react-icons/im";

const Loader = ({ text }: { text: string }) => {
  return (
    <div className="flex justify-center items-center gap-3 text-white">
      <ImSpinner9 className="animate-spin" />
      {text || "Betöltés..."}
    </div>
  );
};

export default Loader;

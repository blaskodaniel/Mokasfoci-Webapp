import LoadingLottie from "/src/assets/lottie/loading_soccer.lottie";
import LottieAnimation from "./LottieAnimation";

const PageLoader = ({ message = "Betöltése..." }) => {
  return (
    <div className="min-h-screen flex items-center justify-center -mt-15">
      <div className="flex flex-col items-center gap-4">
        <LottieAnimation src={LoadingLottie} style={{ width: 250 }} />
        <div className="text-white text-xl">{message}</div>
      </div>
    </div>
  );
};

export default PageLoader;

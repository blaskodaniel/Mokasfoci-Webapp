import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import loaderLottie from "@/assets/lottie/loading_soccer.lottie";

const FullPageLoader = () => {
  return (
    <div className="min-h-svh flex flex-col justify-center items-center">
      <div className="max-w-[200px] max-h-[200px] w-full">
        <DotLottieReact src={loaderLottie} loop autoplay />
      </div>
      <p className="text-center">Betöltés</p>
    </div>
  );
};

export default FullPageLoader;

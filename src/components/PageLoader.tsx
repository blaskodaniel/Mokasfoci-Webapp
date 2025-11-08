const PageLoader = ({ message = "Betöltése..." }) => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-purple-500"></div>
        <div className="text-white text-xl">{message}</div>
      </div>
    </div>
  );
};

export default PageLoader;

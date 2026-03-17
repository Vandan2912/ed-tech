import "@/styles/loader.css";

const FullScreenLoader = () => {
  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-blue-900/5">
      {/* Optional overlay effect */}
      <div className="absolute inset-0 bg-blue-900/5 backdrop-blur-xs" />

      {/* Loader */}
      <div className="relative z-10 scale-125">
        <div className="wrapper">
          <div className="circle"></div>
          <div className="circle"></div>
          <div className="circle"></div>
          <div className="shadow"></div>
          <div className="shadow"></div>
          <div className="shadow"></div>
        </div>
      </div>
    </div>
  );
};

export default FullScreenLoader;

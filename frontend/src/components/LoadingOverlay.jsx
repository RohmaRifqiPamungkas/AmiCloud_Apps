const LoadingOverlay = ({ isLoading }) => {
    return (
      isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 border-4 border-t-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
            <p className="text-white text-lg font-semibold">Loading...</p>
          </div>
        </div>
      )
    );
  };
  
  export default LoadingOverlay;
  
import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center w-full h-screen bg-(--panel-bg)">
      <div className="flex flex-col items-center justify-center gap-6 text-center px-4">
        <div className="text-7xl font-bold text-(--text-primary)">404</div>
        
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold text-(--text-primary)">
            Page Not Found
          </h1>
          <p className="text-lg text-(--text-secondary)">
            Sorry, the page you're looking for doesn't exist.
          </p>
        </div>

        <button
          onClick={() => navigate("/")}
          className="mt-4 px-6 py-2 bg-(--primary) text-white rounded-lg hover:opacity-80 transition-opacity duration-200 font-medium"
        >
          Go Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;

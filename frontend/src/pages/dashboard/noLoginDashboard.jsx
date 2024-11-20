import { Typography } from "@material-tailwind/react";

export function NoLoginDashboard() {
  return (
    <section className="relative w-full min-h-screen bg-gradient-to-r from-blue-400 to-purple-200 flex items-center justify-center text-center text-white">
      {/* Arrow Indicator */}
      <div className="absolute top-4 right-4 flex flex-col items-center animate-pulse">
        {/* Arrow */}
        <svg
          className="w-24 h-48 text-white mb-2"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {/* Vertical Arrow Pointing Up */}
          <path
            strokeLinecap="round"   
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 48V4m0 0l-6 6m6-6l6 6"
          />
        </svg>
        {/* Optional Text Indicator */}
        
      </div>

      {/* Main Content */}
      <div className="px-4">
        <Typography variant="h1" className="mb-6">
          It seems you haven't logged in yet. Please log in to access your dashboard.
        </Typography>
        
      </div>
    </section>
  );
}

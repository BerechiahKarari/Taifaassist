export const KenyanFlag = ({ size = "md", className = "" }) => {
  const sizes = {
    sm: "w-16 h-12",
    md: "w-32 h-24",
    lg: "w-48 h-36",
    xl: "w-64 h-48",
  };

  return (
    <div className={`relative ${sizes[size]} ${className} shadow-xl rounded-md overflow-hidden border-2 border-gray-200 dark:border-gray-700`}>
      {/* Black stripe */}
      <div className="absolute top-0 left-0 w-full h-[28%] bg-black"></div>
      
      {/* White stripe */}
      <div className="absolute top-[28%] left-0 w-full h-[6%] bg-white"></div>
      
      {/* Red stripe */}
      <div className="absolute top-[34%] left-0 w-full h-[32%] bg-red-600"></div>
      
      {/* White stripe */}
      <div className="absolute top-[66%] left-0 w-full h-[6%] bg-white"></div>
      
      {/* Green stripe */}
      <div className="absolute top-[72%] left-0 w-full h-[28%] bg-green-700"></div>
      
      {/* Maasai Shield and Spears */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
        {/* Shield */}
        <svg viewBox="0 0 100 120" className="w-8 h-10 drop-shadow-lg">
          {/* Shield outline */}
          <ellipse cx="50" cy="50" rx="30" ry="45" fill="#8B4513" stroke="#000" strokeWidth="2"/>
          {/* Shield center */}
          <ellipse cx="50" cy="50" rx="20" ry="35" fill="#D2691E"/>
          {/* Shield pattern */}
          <path d="M 50 15 L 50 85" stroke="#000" strokeWidth="2"/>
          <path d="M 35 50 L 65 50" stroke="#000" strokeWidth="2"/>
        </svg>
        
        {/* Crossed Spears */}
        <svg viewBox="0 0 100 120" className="absolute w-12 h-14">
          {/* Left spear */}
          <line x1="20" y1="10" x2="40" y2="110" stroke="#654321" strokeWidth="2"/>
          <polygon points="18,8 22,8 20,2" fill="#C0C0C0"/>
          
          {/* Right spear */}
          <line x1="80" y1="10" x2="60" y2="110" stroke="#654321" strokeWidth="2"/>
          <polygon points="78,8 82,8 80,2" fill="#C0C0C0"/>
        </svg>
      </div>
    </div>
  );
};

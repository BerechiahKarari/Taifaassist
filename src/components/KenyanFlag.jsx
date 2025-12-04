export const KenyanFlag = ({ size = "md", className = "" }) => {
  const sizes = {
    sm: "w-16 h-12",
    md: "w-32 h-24",
    lg: "w-48 h-36",
    xl: "w-64 h-48",
  };

  return (
    <div className={`relative ${sizes[size]} ${className} shadow-2xl rounded-lg overflow-hidden border-2 border-gray-300 dark:border-gray-600`}>
      {/* Black stripe - top */}
      <div className="absolute top-0 left-0 w-full h-[22%] bg-black"></div>
      
      {/* White fimbriation */}
      <div className="absolute top-[22%] left-0 w-full h-[8%] bg-white"></div>
      
      {/* Red stripe - center */}
      <div className="absolute top-[30%] left-0 w-full h-[40%] bg-[#BB0000]"></div>
      
      {/* White fimbriation */}
      <div className="absolute top-[70%] left-0 w-full h-[8%] bg-white"></div>
      
      {/* Green stripe - bottom */}
      <div className="absolute top-[78%] left-0 w-full h-[22%] bg-[#006600]"></div>
      
      {/* Maasai Shield with Crossed Spears */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <svg viewBox="0 0 100 140" className="w-14 h-18 drop-shadow-2xl">
          {/* Left Spear - behind shield */}
          <g>
            <line x1="20" y1="15" x2="30" y2="125" stroke="#4A2511" strokeWidth="2.5"/>
            <polygon points="18,13 22,13 20,3" fill="#C0C0C0" stroke="#000" strokeWidth="0.8"/>
            <circle cx="20" cy="17" r="2.5" fill="#654321"/>
          </g>
          
          {/* Right Spear - behind shield */}
          <g>
            <line x1="80" y1="15" x2="70" y2="125" stroke="#4A2511" strokeWidth="2.5"/>
            <polygon points="78,13 82,13 80,3" fill="#C0C0C0" stroke="#000" strokeWidth="0.8"/>
            <circle cx="80" cy="17" r="2.5" fill="#654321"/>
          </g>
          
          {/* Maasai Shield - center */}
          <g>
            {/* Outer shield shape */}
            <ellipse cx="50" cy="70" rx="20" ry="48" fill="#8B0000" stroke="#000" strokeWidth="2.5"/>
            
            {/* White vertical stripe */}
            <ellipse cx="50" cy="70" rx="10" ry="45" fill="white"/>
            
            {/* Red center stripe */}
            <ellipse cx="50" cy="70" rx="6" ry="42" fill="#BB0000"/>
            
            {/* Top decorative oval */}
            <ellipse cx="50" cy="30" rx="5" ry="7" fill="white" stroke="#000" strokeWidth="1"/>
            <ellipse cx="50" cy="30" rx="3" ry="5" fill="#8B0000"/>
            
            {/* Bottom decorative oval */}
            <ellipse cx="50" cy="110" rx="5" ry="7" fill="white" stroke="#000" strokeWidth="1"/>
            <ellipse cx="50" cy="110" rx="3" ry="5" fill="#8B0000"/>
            
            {/* Center decorative elements */}
            <circle cx="50" cy="70" r="4" fill="white" stroke="#000" strokeWidth="1"/>
            
            {/* Vertical line through center */}
            <line x1="50" y1="25" x2="50" y2="115" stroke="#000" strokeWidth="1.5"/>
            
            {/* Horizontal decorative lines */}
            <line x1="40" y1="70" x2="60" y2="70" stroke="#000" strokeWidth="1.5"/>
            <line x1="42" y1="50" x2="58" y2="50" stroke="#000" strokeWidth="1"/>
            <line x1="42" y1="90" x2="58" y2="90" stroke="#000" strokeWidth="1"/>
          </g>
        </svg>
      </div>
    </div>
  );
};

import { Shield } from 'lucide-react';

export const KenyanFlag = ({ size = "md", className = "" }) => {
  const sizes = {
    sm: "w-12 h-8",
    md: "w-24 h-16",
    lg: "w-32 h-24",
    xl: "w-48 h-32",
  };

  return (
    <div className={`relative ${sizes[size]} ${className} shadow-lg rounded-sm overflow-hidden`}>
      <div className="absolute top-0 left-0 w-full h-1/3 bg-black"></div>
      <div className="absolute top-1/3 left-0 w-full h-1/3 bg-red-600"></div>
      <div className="absolute top-2/3 left-0 w-full h-1/3 bg-green-600"></div>
      <div className="absolute top-1/3 left-0 w-full h-px bg-white"></div>
      <div className="absolute bottom-1/3 left-0 w-full h-px bg-white"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <Shield className="w-6 h-6 text-white opacity-50" />
      </div>
    </div>
  );
};

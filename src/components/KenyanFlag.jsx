export const KenyanFlag = ({ size = "md", className = "" }) => {
  const sizes = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
    xl: "w-48 h-48",
  };

  // Use warrior image for larger sizes, fist for smaller
  const imageSrc = (size === "xl" || size === "lg") 
    ? "/kenya-flag-warrior.jpg.jpeg" 
    : "/kenya-flag-fist.jpg.jpeg";

  return (
    <div className={`relative ${sizes[size]} ${className} rounded-full overflow-hidden shadow-2xl border-4 border-white dark:border-gray-800 ring-2 ring-green-600`}>
      <img 
        src={imageSrc} 
        alt="Kenya Flag" 
        className="w-full h-full object-cover"
      />
    </div>
  );
};

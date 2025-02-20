import React from "react";

type ButtonProps = {
  onClick: () => void;
  text: string;
};

const Button: React.FC<ButtonProps> = ({ onClick, text }) => {
  return (
    <button
      onClick={onClick}
      className="bg-[#B0EB0A] hover:bg-[#afeb0ac4] text-black rounded-xl py-1 px-10 urbanist-800 text-[24px] w-full"
    >
      {text}
    </button>
  );
};

export default Button;

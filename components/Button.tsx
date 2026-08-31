interface ButtonProps {
  label:string,
  onClick: () => void
}
const Button = ({ label, onClick }: ButtonProps) => {
  return (
    <div className="w-full py-2">
      
      <button
        onClick={onClick}
        className="w-full rounded-md hover:cursor-pointer bg-blue-600 hover:bg-blue-700 py-2 text-sm font-medium text-white transition duration-200"
      >
        {label}
      </button>
    </div>
  );
};

export default Button;
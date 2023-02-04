import { useNavigate } from "react-router-dom";

function NoPage() {
  const navigate = useNavigate();
  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center gap-10">
      <span className="text-6xl sm:text-7xl font-bold text-green-900">404</span>
      <span className="text-center text-3xl sm:text-5xl font-bold text-green-900">
        Sorry, page not found
      </span>
      <div
        className="text-center font-bold bg-green-500 px-5 py-3 mt-3 md:mt-5 rounded cursor-pointer tracking-wider"
        onClick={() => navigate("/")}
      >
        Go back to home
      </div>
    </div>
  );
}

export default NoPage;
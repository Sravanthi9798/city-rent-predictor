import { useNavigate } from "react-router-dom";

function Header({ title, showBack = false }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="w-full flex justify-between items-center px-6 py-3 bg-linear-to-r/decreasing from-indigo-200 to-teal-100 shadow">
      <div className="flex items-center gap-3">
        {showBack && (
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-gray-700 hover:text-black h-10 w-10"
          >
            ←
          </button>
        )}

        <h2
          className="text-lg font-bold cursor-pointer"
          onClick={() => navigate("/rentPredictor")}
        >
          {title || "Rent Predictor"}
        </h2>
      </div>
      <div className="flex items-center gap-4">
        {user && <span className="text-sm">Hi, {user.name}</span>}
        <button
          onClick={logout}
          className="px-3 py-1 bg-red-500 text-white rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Header;

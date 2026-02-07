import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="w-full flex justify-between items-center px-6 py-3 bg-white shadow">
      <h2
        className="text-lg font-bold cursor-pointer"
        onClick={() => navigate("/")}
      >
        Rent Predictor
      </h2>

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

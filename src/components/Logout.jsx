import { useHistory } from "react-router-dom";

function Logout() {
  const history = useHistory();

  const handleLogout = () => {
    localStorage.removeItem("token");
    history.push("/login");
  };

  return (
    <div>
      <button onClick={handleLogout}>Выйти</button>
    </div>
  );
}

export default Logout;

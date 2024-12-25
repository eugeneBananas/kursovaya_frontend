import { useHistory } from "react-router-dom";

function Logout() {
  const history = useHistory();

  const handleLogout = () => {
    localStorage.removeItem("token"); // Удаляем токен
    history.push("/login"); // Перенаправляем на страницу входа
  };

  return (
    <div>
      <button onClick={handleLogout}>Выйти</button>
    </div>
  );
}

export default Logout;

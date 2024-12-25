import { useState } from "react";
import { useHistory } from "react-router-dom";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8081/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Регистрация прошла успешно! Теперь вы можете войти.");
        history.push("/login");
      } else {
        setError(data.message || "Произошла ошибка при регистрации.");
      }
    } catch (err) {
      setError(`Произошла ошибка. Попробуйте снова. ${err}`);
    }
  };

  return (
    <div>
      <h2>Регистрация</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Введите ваш email"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Введите ваш пароль"
        />
        <button type="submit">Зарегистрироваться</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
}

export default Register;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import "./AdminLogin.css";

function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });


    const {
  data: { session },
} = await supabase.auth.getSession();

console.log("SESSÃO SUPABASE:", session);
console.log("USUÁRIO SUPABASE:", session?.user);



    if (error) {
      console.error("Erro no login:", error);
      setError("E-mail ou senha inválidos.");
      setLoading(false);
      return;
    }

    navigate("/admin");
  }

  return (
    <main className="admin-login-page">
      <section className="admin-login">
        <h1>Mineiro</h1>
        <h2>Painel administrativo</h2>

        <form onSubmit={handleLogin}>
          <label htmlFor="admin-email">E-mail</label>

          <input
            id="admin-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Digite seu e-mail"
            required
          />

          <label htmlFor="admin-password">Senha</label>

          <input
            id="admin-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Digite sua senha"
            required
          />

          {error && <p className="admin-login-error">{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default AdminLogin;
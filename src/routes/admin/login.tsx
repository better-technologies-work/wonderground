import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/admin/login")({
  component: AdminLogin,
});

function AdminLogin() {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    const validUser = import.meta.env.VITE_ADMIN_USER;
    const validPass = import.meta.env.VITE_ADMIN_PASS;

    if (user === validUser && pass === validPass) {
      sessionStorage.setItem("wg-admin", "1");
      navigate({ to: "/admin" });
    } else {
      setError(true);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm border border-border bg-card p-8">
        <h1 className="font-display text-2xl font-black tracking-tight uppercase">
          WonderGround<span className="text-primary">.</span> Admin
        </h1>
        <p className="mt-2 font-mono text-[11px] text-muted-foreground">
          Panel de administración de contenido
        </p>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
          <div>
            <label className="mb-1 block font-mono text-[10px] tracking-[0.16em] text-muted-foreground">
              USUARIO
            </label>
            <input
              type="text"
              required
              value={user}
              onChange={(ev) => { setUser(ev.target.value); setError(false); }}
              className="w-full border border-input bg-background px-3 py-2.5 font-mono text-sm text-foreground outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="mb-1 block font-mono text-[10px] tracking-[0.16em] text-muted-foreground">
              CONTRASEÑA
            </label>
            <input
              type="password"
              required
              value={pass}
              onChange={(ev) => { setPass(ev.target.value); setError(false); }}
              className="w-full border border-input bg-background px-3 py-2.5 font-mono text-sm text-foreground outline-none focus:border-primary"
            />
          </div>

          {error && (
            <p className="font-mono text-[11px] text-red-500">
              Credenciales incorrectas
            </p>
          )}

          <button
            type="submit"
            className="mt-2 bg-primary px-4 py-3 font-mono text-[12px] font-bold tracking-[0.16em] text-primary-foreground transition-colors hover:bg-primary/90"
          >
            INICIAR SESIÓN
          </button>
        </form>
      </div>
    </div>
  );
}

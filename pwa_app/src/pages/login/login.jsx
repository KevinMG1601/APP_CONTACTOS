import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";

const CREDENCIALES_PRUEBA = {
    "recepcion@clinica.com": {
        password: "123456",
        nombre: "Andres",
        rol: "recepcionista",
        avatar: null,
    },
    "medico@clinica.com": {
        password: "123456",
        nombre: "Dr. Kevin",
        rol: "medico",
        avatar: null,
    },
};

export default function Login({ onLogin }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");

        const user = CREDENCIALES_PRUEBA[email];
        if (!user || user.password !== password) {
        setError("Usuario o contraseña incorrectos");
        return;
        }

        const usuario = {
          email,
          nombre: user.nombre,
          rol: user.rol,
          avatar: user.avatar,
        };
        onLogin(usuario);
        navigate("/dashboard");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-sm">
            <img src={logo} alt="Logo de la clinica" className="w-full max-w-[200px] mx-auto mb-4 block" />
            <h1 className="text-2xl font-semibold text-slate-800 mb-6">
            Iniciar sesion
            </h1>
            <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">
                Email
                </label>
                <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@clinica.com"
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
                />
                </div>
                <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">
                    Contraseña
                </label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="•••••••••"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                />
            </div>
            {error && (
                <p className="text-red-600 text-sm" role="alert">
                {error}
                </p>
            )}
            <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition"
            >
                Entrar
            </button>
            </form>
        </div>
        </div>
    );
    }

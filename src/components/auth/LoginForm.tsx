import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "../../utils/validation";
import { useAuthStore } from "../../stores/authStore";
import SuccessModal from "../ui/SuccessModal";
import { FaLeaf, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

const LoginForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false); // Nueva flag para controlar el proceso
  const { login, isLoading, error, user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  // Redirigir si ya está autenticado (pero NO durante el proceso de login)
  useEffect(() => {
    if (isAuthenticated && !isLoggingIn) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate, isLoggingIn]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoggingIn(true); // Marcar que estamos en proceso de login
    
    const success = await login({
      correo: data.email,
      password: data.password
    });
    
    if (success) {
      // Mostrar modal primero
      setShowSuccessModal(true);
      // Navegar después del delay del modal
      setTimeout(() => {
        setIsLoggingIn(false); // Terminar el proceso
        navigate('/dashboard');
      }, 3500); // Un poco más que el autoCloseDelay del modal
    } else {
      setIsLoggingIn(false); // Terminar el proceso en caso de error
      setError("root", {
        message: "Credenciales inválidas. Verifica tu email y contraseña.",
      });
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    // La navegación ya está manejada en onSubmit
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-emerald-50 via-white to-green-100 relative overflow-hidden">
      {/* Partículas animadas de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-2 h-2 bg-green-400/20 rounded-full animate-bounce`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Imagen lateral izquierda mejorada */}
      <div className="hidden lg:flex w-1/2 relative items-center justify-center overflow-hidden group">
        <img
          src="https://imgs.search.brave.com/TSPd7tmRKhvIFRuDnR7utrS28MdM5OSSJb88C3KXqnE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTQz/NTk3NTY0OS9lcy9m/b3RvL3RoZS1yb2Fk/LWdvaW5nLWludG8t/dGhlLWRpc3RhbmNl/LXBlcnNwZWN0aXZl/LWV2ZW5pbmctc3Vu/c2V0LWxpZ2h0Lmpw/Zz9zPTYxMng2MTIm/dz0wJms9MjAmYz05/SktQWlhMZWoxbENG/WTNvZEQ2Xzc0dm1V/cHcydHEwMzNnWi05/N3I0MTlZPQ"
          alt="Nature"
          className="absolute inset-0 h-full w-full object-cover brightness-70 transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/50 via-emerald-800/40 to-green-900/50 backdrop-blur-sm" />

        {/* Efectos de luz flotantes */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-green-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-32 right-16 w-24 h-24 bg-emerald-300/15 rounded-full blur-2xl animate-pulse delay-1000"></div>

        <div
          className={`relative z-10 text-white text-center px-12 transition-all duration-1000 ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <div className="inline-block mb-6">
            <FaLeaf className="text-6xl text-green-300 animate-pulse drop-shadow-2xl" />
          </div>
          <h1 className="text-6xl font-extrabold tracking-tight leading-tight mb-6 drop-shadow-2xl">
            Bienvenido a <br />
            <span className="bg-gradient-to-r from-emerald-300 via-green-200 to-teal-300 bg-clip-text text-transparent animate-pulse">
              ParcelApp
            </span>
          </h1>
          <p className="text-xl text-emerald-100 leading-relaxed font-light">
            La gestión inteligente de parcelas, <br />
            <span className="font-medium">ahora con estilo y elegancia.</span>
          </p>

          {/* Indicadores de características */}
          <div className="flex justify-center gap-8 mt-8">
            {["Intuitivo", "Seguro", "Moderno"].map((feature, index) => (
              <div
                key={feature}
                className={`text-center transform transition-all duration-500 delay-${
                  index * 200
                }`}
              >
                <div className="w-3 h-3 bg-green-300 rounded-full mx-auto mb-2 animate-ping"></div>
                <span className="text-sm text-green-100 font-medium">
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Panel de login mejorado */}
      <div className="flex flex-col justify-center w-full lg:w-1/2 p-8  relative z-20">
        <div
          className={`max-w-md w-full mx-auto bg-white/90 backdrop-blur-3xl rounded-3xl shadow-2xl border border-white/50 p-10 relative overflow-hidden transition-all duration-700 hover:shadow-3xl hover:scale-[1.02] ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          {/* Efectos de luz mejorados */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-green-300 to-emerald-500 rounded-full blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gradient-to-tr from-teal-300 to-green-400 rounded-full blur-3xl opacity-30 animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-to-r from-green-200/10 to-emerald-200/10 rounded-full blur-3xl"></div>

          <div className="text-center mb-6 relative z-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl shadow-xl mb-6 relative group">
              <FaLeaf className="text-3xl text-white transition-transform duration-300 animate-pulse" />
              <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-emerald-500 rounded-3xl blur opacity-30 group-hover:opacity-30 transition duration-300"></div>
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-green-700 via-emerald-700 to-teal-700 bg-clip-text text-transparent mb-2">
              Inicia Sesión
            </h2>
            <p className="text-gray-600 font-medium">
              Accede a tu cuenta y continúa donde quedaste
            </p>
            <div className="w-20 h-1 bg-gradient-to-r from-green-400 to-emerald-500 mx-auto mt-3 rounded-full"></div>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 relative z-10"
          >
            {/* Email con efectos mejorados */}
            <div className="group">
              <label
                htmlFor="email"
                className="block text-sm font-bold text-gray-700 mb-2 group-focus-within:text-green-600 transition-colors"
              >
                Correo Electrónico
              </label>
              <div className="relative">
                <FaEnvelope
                  className={`absolute left-4 top-4 transition-all duration-300 ${
                    errors.email
                      ? "text-red-400"
                      : "text-gray-400 group-focus-within:text-green-500"
                  }`}
                />
                <input
                  {...register("email")}
                  id="email"
                  type="email"
                  placeholder="Escribe tu correo electrónico"
                  className={`w-full pl-12 pr-3 py-3 rounded-2xl border-2 focus:outline-none focus:ring-4 transition-all duration-300 font-medium placeholder:text-gray-400 ${
                    errors.email
                      ? "border-red-300 bg-red-50/50 focus:ring-red-200/40 focus:border-red-400"
                      : "border-gray-200 bg-white/70 hover:bg-white hover:border-gray-300 focus:ring-green-200/40 focus:border-green-400 focus:shadow-lg"
                  }`}
                />
                {/* Indicador de validación */}
                <div
                  className={`absolute right-4 top-4 w-2 h-2 rounded-full transition-all duration-300 ${
                    errors.email
                      ? "bg-red-400"
                      : "bg-transparent group-focus-within:bg-green-400"
                  }`}
                ></div>
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-2 flex items-center gap-2 animate-fade-in">
                  <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Contraseña con efectos mejorados */}
            <div className="group">
              <label
                htmlFor="password"
                className="block text-sm font-bold text-gray-700 mb-2 group-focus-within:text-green-600 transition-colors"
              >
                Contraseña
              </label>
              <div className="relative">
                <FaLock
                  className={`absolute left-4 top-4 transition-all duration-300 ${
                    errors.password
                      ? "text-red-400"
                      : "text-gray-400 group-focus-within:text-green-500"
                  }`}
                />
                <input
                  {...register("password")}
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Escribe tu contraseña"
                  className={`w-full pl-12 pr-3 py-3 rounded-2xl border-2 focus:outline-none focus:ring-4 transition-all duration-300 font-medium placeholder:text-gray-400 ${
                    errors.password
                      ? "border-red-300 bg-red-50/50 focus:ring-red-200/40 focus:border-red-400"
                      : "border-gray-200 bg-white/70 hover:bg-white hover:border-gray-300 focus:ring-green-200/40 focus:border-green-400 focus:shadow-lg"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3 p-1 text-gray-500 hover:text-green-600 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-green-200 rounded-lg"
                  aria-label={
                    showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                  }
                >
                  {showPassword ? (
                    <FaEyeSlash size={18} />
                  ) : (
                    <FaEye size={18} />
                  )}
                </button>
                {/* Indicador de validación */}
                <div
                  className={`absolute right-12 top-4 w-2 h-2 rounded-full transition-all duration-300 ${
                    errors.password
                      ? "bg-red-400"
                      : "bg-transparent group-focus-within:bg-green-400"
                  }`}
                ></div>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-2 flex items-center gap-2 animate-fade-in">
                  <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Mensaje de error mejorado */}
            {(error || errors.root) && (
              <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl p-4 text-red-700 text-sm text-center shadow-lg animate-shake relative overflow-hidden">
                <div className="absolute inset-0 bg-red-100/20 backdrop-blur-sm"></div>
                <div className="relative z-10 flex items-center justify-center gap-2 font-medium">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  {error || errors.root?.message}
                </div>
              </div>
            )}

            {/* Botón de envío espectacular */}
            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="cursor-pointer group relative w-full bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1 shadow-xl hover:shadow-2xl disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>

              {isSubmitting || isLoading ? (
                <div className="flex justify-center items-center gap-3 ">
                  <div className="relative">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <div className="absolute inset-0 border-2 border-transparent border-t-white/60 rounded-full animate-spin animate-reverse"></div>
                  </div>
                  <span className="font-semibold">Iniciando sesión...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 relative z-10">
                  <span className="font-semibold text-lg">Iniciar Sesión</span>
                </div>
              )}
            </button>
          </form>

          {/* Enlace de registro mejorado */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 text-sm font-medium">
              ¿No tienes cuenta?{" "}
              <Link
                to="/register"
                className="relative inline-block text-green-600 hover:text-emerald-700 font-bold transition-all duration-300 group"
              >
                <span className="relative z-10">Regístrate aquí</span>
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-green-400 to-emerald-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Modal de éxito */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessModalClose}
        title="¡Inicio de Sesión Exitoso!"
        message={`¡Bienvenido de vuelta, ${user?.nombre}! Has iniciado sesión correctamente.`}
        autoClose={true}
        autoCloseDelay={3000}
      />
    </div>
  );
};

export default LoginForm;

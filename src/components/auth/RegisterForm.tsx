import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterFormData } from "../../utils/validation";
import { useAuthStore } from "../../stores/authStore";
import SuccessModal from "../ui/SuccessModal";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaUser,
  FaUserPlus,
  FaLeaf,
  FaPhone,
} from "react-icons/fa";

const RegisterForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [registeredUserName, setRegisteredUserName] = useState('');
  const { register: registerUser, isLoading, error, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    const success = await registerUser({
      nombre: data.name,
      correo: data.email,
      password: data.password,
      telefono: data.telefono
    });
    if (success) {
      setRegisteredUserName(data.name);
      setShowSuccessModal(true);
    } else {
      setError("root", {
        message: "Error al crear la cuenta. Inténtalo de nuevo.",
      });
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    // Navegar al login después de cerrar el modal
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-lime-50 via-white to-teal-100 relative overflow-hidden">
      {/* Partículas animadas de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-2 h-2 bg-lime-400/20 rounded-full animate-bounce`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${2.5 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Imagen lateral derecha espectacular */}
      <div className="hidden lg:flex w-1/2 relative items-center justify-center overflow-hidden group order-2">
        <img
          src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80"
          alt="Beautiful landscape"
          className="absolute inset-0 h-full w-full object-cover brightness-70 transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-teal-900/50 via-lime-800/40 to-green-900/50 backdrop-blur-sm" />

        {/* Efectos de luz flotantes */}
        <div className="absolute top-16 right-20 w-36 h-36 bg-lime-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-24 left-16 w-28 h-28 bg-teal-300/15 rounded-full blur-2xl animate-pulse delay-1000"></div>

        <div
          className={`relative z-10 text-white text-center px-12 transition-all duration-1000 ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <div className="inline-block mb-6">
            <FaLeaf className="text-7xl text-lime-300 animate-pulse drop-shadow-2xl" />
          </div>
          <h1 className="text-6xl font-extrabold tracking-tight leading-tight mb-6 drop-shadow-2xl">
            ¡Únete a <br />
            <span className="bg-gradient-to-r from-lime-300 via-teal-200 to-green-300 bg-clip-text text-transparent animate-pulse">
              ParcelApp!
            </span>
          </h1>
          <p className="text-xl text-lime-100 leading-relaxed font-light">
            Comienza tu viaje hacia la <br />
            <span className="font-medium">
              gestión inteligente de parcelas.
            </span>
          </p>

          {/* Indicadores de beneficios */}
          <div className="flex justify-center gap-8 mt-8">
            {["Innovador", "Confiable", "Fácil"].map((feature, index) => (
              <div
                key={feature}
                className={`text-center transform transition-all duration-500 delay-${
                  index * 200
                }`}
              >
                <div className="w-3 h-3 bg-lime-300 rounded-full mx-auto mb-2 animate-ping"></div>
                <span className="text-sm text-lime-100 font-medium">
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Panel de registro espectacular */}
      <div className="flex flex-col justify-center w-full lg:w-1/2 relative z-20 order-1">
        <div
          className={`max-w-2xl w-full mx-auto bg-white/90 backdrop-blur-3xl rounded-3xl shadow-2xl border border-white/50 p-10 relative overflow-hidden transition-all duration-700 hover:shadow-3xl hover:scale-[1.01] ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          {/* Efectos de luz mejorados */}
          <div className="absolute -top-10 -right-10 w-44 h-44 bg-gradient-to-br from-lime-300 to-teal-500 rounded-full blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-gradient-to-tr from-teal-300 to-lime-400 rounded-full blur-3xl opacity-30 animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-lime-200/10 to-teal-200/10 rounded-full blur-3xl"></div>

          <div className="text-center mb-8 relative z-10">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-lime-500 to-teal-600 rounded-3xl shadow-xl mb-6 relative group">
              <FaUserPlus className="text-4xl text-white group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute -inset-1 bg-gradient-to-r from-lime-400 to-teal-500 rounded-3xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-lime-700 via-teal-700 to-green-700 bg-clip-text text-transparent mb-2">
              ¡Únete a Nosotros!
            </h2>
            <p className="text-gray-600 font-medium">
              Crea tu cuenta y gestiona tus parcelas
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-lime-400 to-teal-500 mx-auto mt-3 rounded-full"></div>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 relative z-10"
          >
            {/* Grid de inputs 2x2 en desktop, vertical en móvil */}
            <div className="space-y-6 md:space-y-5">
              {/* Primera fila: Nombre y Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {/* Nombre con efectos mejorados */}
                <div className="group">
                  <label
                    htmlFor="name"
                    className="block text-sm font-bold text-gray-700 mb-2 group-focus-within:text-lime-600 transition-colors"
                  >
                    Nombre Completo
                  </label>
                  <div className="relative">
                    <FaUser
                      className={`absolute left-4 top-4 transition-all duration-300 ${
                        errors.name
                          ? "text-red-400"
                          : "text-gray-400 group-focus-within:text-lime-500"
                      }`}
                    />
                    <input
                      {...register("name")}
                      id="name"
                      type="text"
                      placeholder="Escribe tu nombre"
                      className={`w-full pl-12 pr-4 py-3 rounded-2xl border-2 focus:outline-none focus:ring-4 transition-all duration-300 font-medium placeholder:text-gray-400 ${
                        errors.name
                          ? "border-red-300 bg-red-50/50 focus:ring-red-200/40 focus:border-red-400"
                          : "border-gray-200 bg-white/70 hover:bg-white hover:border-gray-300 focus:ring-lime-200/40 focus:border-lime-400 focus:shadow-lg"
                      }`}
                    />
                    {/* Indicador de validación */}
                    <div
                      className={`absolute right-4 top-4 w-2 h-2 rounded-full transition-all duration-300 ${
                        errors.name
                          ? "bg-red-400"
                          : "bg-transparent group-focus-within:bg-lime-400"
                      }`}
                    ></div>
                  </div>
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-2 flex items-center gap-2 animate-fade-in">
                      <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Email con efectos mejorados */}
                <div className="group">
                  <label
                    htmlFor="email"
                    className="block text-sm font-bold text-gray-700 mb-2 group-focus-within:text-lime-600 transition-colors"
                  >
                    Correo Electrónico
                  </label>
                  <div className="relative">
                    <FaEnvelope
                      className={`absolute left-4 top-4 transition-all duration-300 ${
                        errors.email
                          ? "text-red-400"
                          : "text-gray-400 group-focus-within:text-lime-500"
                      }`}
                    />
                    <input
                      {...register("email")}
                      id="email"
                      type="email"
                      placeholder="Escribe tu correo"
                      className={`w-full pl-12 pr-4 py-3 rounded-2xl border-2 focus:outline-none focus:ring-4 transition-all duration-300 font-medium placeholder:text-gray-400 ${
                        errors.email
                          ? "border-red-300 bg-red-50/50 focus:ring-red-200/40 focus:border-red-400"
                          : "border-gray-200 bg-white/70 hover:bg-white hover:border-gray-300 focus:ring-lime-200/40 focus:border-lime-400 focus:shadow-lg"
                      }`}
                    />
                    {/* Indicador de validación */}
                    <div
                      className={`absolute right-4 top-4 w-2 h-2 rounded-full transition-all duration-300 ${
                        errors.email
                          ? "bg-red-400"
                          : "bg-transparent group-focus-within:bg-lime-400"
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
              </div>

              {/* Teléfono - fila completa */}
              <div className="w-full">
                <div className="group">
                  <label
                    htmlFor="telefono"
                    className="block text-sm font-bold text-gray-700 mb-2 group-focus-within:text-lime-600 transition-colors"
                  >
                    Teléfono
                  </label>
                  <div className="relative">
                    <FaPhone
                      className={`absolute left-4 top-4 transition-all duration-300 ${
                        errors.telefono
                          ? "text-red-400"
                          : "text-gray-400 group-focus-within:text-lime-500"
                      }`}
                    />
                    <input
                      {...register("telefono")}
                      id="telefono"
                      type="tel"
                      placeholder="Escribe tu número de teléfono"
                      className={`w-full pl-12 pr-4 py-3 rounded-2xl border-2 focus:outline-none focus:ring-4 transition-all duration-300 font-medium placeholder:text-gray-400 ${
                        errors.telefono
                          ? "border-red-300 bg-red-50/50 focus:ring-red-200/40 focus:border-red-400"
                          : "border-gray-200 bg-white/70 hover:bg-white hover:border-gray-300 focus:ring-lime-200/40 focus:border-lime-400 focus:shadow-lg"
                      }`}
                    />
                    {/* Indicador de validación */}
                    <div
                      className={`absolute right-4 top-4 w-2 h-2 rounded-full transition-all duration-300 ${
                        errors.telefono
                          ? "bg-red-400"
                          : "bg-transparent group-focus-within:bg-lime-400"
                      }`}
                    ></div>
                  </div>
                  {errors.telefono && (
                    <p className="text-red-500 text-sm mt-2 flex items-center gap-2 animate-fade-in">
                      <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                      {errors.telefono.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Segunda fila: Contraseña y Confirmar Contraseña */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {/* Contraseña con efectos mejorados */}
                <div className="group">
                  <label
                    htmlFor="password"
                    className="block text-sm font-bold text-gray-700 mb-2 group-focus-within:text-lime-600 transition-colors"
                  >
                    Contraseña
                  </label>
                  <div className="relative">
                    <FaLock
                      className={`absolute left-4 top-4 transition-all duration-300 ${
                        errors.password
                          ? "text-red-400"
                          : "text-gray-400 group-focus-within:text-lime-500"
                      }`}
                    />
                    <input
                      {...register("password")}
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Escribe tu contraseña"
                      className={`w-full pl-12 pr-14 py-3 rounded-2xl border-2 focus:outline-none focus:ring-4 transition-all duration-300 font-medium placeholder:text-gray-400 ${
                        errors.password
                          ? "border-red-300 bg-red-50/50 focus:ring-red-200/40 focus:border-red-400"
                          : "border-gray-200 bg-white/70 hover:bg-white hover:border-gray-300 focus:ring-lime-200/40 focus:border-lime-400 focus:shadow-lg"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-3 p-1 text-gray-500 hover:text-lime-600 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-lime-200 rounded-lg"
                      aria-label={
                        showPassword
                          ? "Ocultar contraseña"
                          : "Mostrar contraseña"
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
                          : "bg-transparent group-focus-within:bg-lime-400"
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

                {/* Confirmar contraseña con efectos mejorados */}
                <div className="group">
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-bold text-gray-700 mb-2 group-focus-within:text-lime-600 transition-colors"
                  >
                    Confirmar Contraseña
                  </label>
                  <div className="relative">
                    <FaLock
                      className={`absolute left-4 top-4 transition-all duration-300 ${
                        errors.confirmPassword
                          ? "text-red-400"
                          : "text-gray-400 group-focus-within:text-lime-500"
                      }`}
                    />
                    <input
                      {...register("confirmPassword")}
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirma tu contraseña"
                      className={`w-full pl-12 pr-14 py-3 rounded-2xl border-2 focus:outline-none focus:ring-4 transition-all duration-300 font-medium placeholder:text-gray-400 ${
                        errors.confirmPassword
                          ? "border-red-300 bg-red-50/50 focus:ring-red-200/40 focus:border-red-400"
                          : "border-gray-200 bg-white/70 hover:bg-white hover:border-gray-300 focus:ring-lime-200/40 focus:border-lime-400 focus:shadow-lg"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-4 top-3 p-1 text-gray-500 hover:text-lime-600 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-lime-200 rounded-lg"
                      aria-label={
                        showConfirmPassword
                          ? "Ocultar contraseña"
                          : "Mostrar contraseña"
                      }
                    >
                      {showConfirmPassword ? (
                        <FaEyeSlash size={18} />
                      ) : (
                        <FaEye size={18} />
                      )}
                    </button>
                    {/* Indicador de validación */}
                    <div
                      className={`absolute right-12 top-4 w-2 h-2 rounded-full transition-all duration-300 ${
                        errors.confirmPassword
                          ? "bg-red-400"
                          : "bg-transparent group-focus-within:bg-lime-400"
                      }`}
                    ></div>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-2 flex items-center gap-2 animate-fade-in">
                      <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>
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
              className="cursor-pointer group relative w-full bg-gradient-to-r from-lime-500 via-teal-500 to-green-500 hover:from-lime-600 hover:via-teal-600 hover:to-green-600 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1 shadow-xl hover:shadow-2xl disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>

              {isSubmitting || isLoading ? (
                <div className="flex justify-center items-center gap-3">
                  <div className="relative">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <div className="absolute inset-0 border-2 border-transparent border-t-white/60 rounded-full animate-spin animate-reverse"></div>
                  </div>
                  <span className="font-semibold">Creando cuenta...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 relative z-10">
                  <span className="font-semibold text-lg">
                    ¡Crear Mi Cuenta!
                  </span>
                </div>
              )}
            </button>
          </form>

          {/* Enlace de login mejorado */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 text-sm font-medium">
              ¿Ya tienes cuenta?{" "}
              <Link
                to="/login"
                className="relative inline-block text-lime-600 hover:text-teal-700 font-bold transition-all duration-300 group"
              >
                <span className="relative z-10">Inicia sesión aquí</span>
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
        title="¡Cuenta Creada Exitosamente!"
        message={`¡Bienvenido, ${registeredUserName}! Tu cuenta ha sido creada correctamente. Ahora puedes iniciar sesión con tus credenciales.`}
        autoClose={true}
        autoCloseDelay={4000}
      />
    </div>
  );
};

export default RegisterForm;

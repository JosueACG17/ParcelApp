import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Home, 
  ArrowLeft, 
  Leaf, 
  Sun, 
  Cloud, 
  Bug,
  Sprout,
  TreePine,
  Flower2
} from 'lucide-react';

const NotFoundPage: React.FC = () => {
  // Animaciones para los elementos flotantes
  const floatingAnimation = {
    y: [0, -10, 0],
    rotate: [0, 5, -5, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut" as const
    }
  };

  const leafAnimation = {
    rotate: [0, 10, -10, 0],
    x: [0, 5, -5, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut" as const
    }
  };

  const cloudAnimation = {
    x: [0, 20, 0],
    transition: {
      duration: 8,
      repeat: Infinity,
      ease: "linear" as const
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-100 overflow-hidden relative">
      {/* Elementos de fondo decorativos */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Nubes animadas */}
        <motion.div 
          animate={cloudAnimation}
          className="absolute top-10 left-10 text-blue-200 opacity-60"
        >
          <Cloud size={60} />
        </motion.div>
        <motion.div 
          animate={cloudAnimation}
          className="absolute top-20 right-20 text-blue-200 opacity-40"
          style={{ animationDelay: '2s' }}
        >
          <Cloud size={80} />
        </motion.div>
        
        {/* Sol */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-16 right-16 text-yellow-300"
        >
          <Sun size={50} />
        </motion.div>

        {/* Plantas decorativas */}
        <motion.div 
          animate={leafAnimation}
          className="absolute bottom-10 left-20 text-green-400 opacity-70"
        >
          <TreePine size={40} />
        </motion.div>
        
        <motion.div 
          animate={floatingAnimation}
          className="absolute bottom-16 right-32 text-pink-400 opacity-60"
        >
          <Flower2 size={35} />
        </motion.div>

        {/* Hojas flotantes */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 360],
              x: [0, Math.random() * 20 - 10, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
            className="absolute text-green-300 opacity-30"
            style={{
              top: `${Math.random() * 80 + 10}%`,
              left: `${Math.random() * 80 + 10}%`,
            }}
          >
            <Leaf size={20 + Math.random() * 15} />
          </motion.div>
        ))}
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="text-center max-w-2xl mx-auto">
          {/* Número 404 con plantas */}
          <motion.div 
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 260, 
              damping: 20,
              duration: 1
            }}
            className="relative mb-8"
          >
            <div className="text-[120px] md:text-[180px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-emerald-500 to-green-700 leading-none select-none">
              4
              <motion.span 
                animate={floatingAnimation}
                className="inline-block relative"
              >
                0
                <motion.div 
                  animate={leafAnimation}
                  className="absolute -top-4 -right-4 text-green-500"
                >
                  <Sprout size={30} />
                </motion.div>
              </motion.span>
              4
            </div>
            
            {/* Insecto volando alrededor del 0 */}
            <motion.div
              animate={{
                x: [0, 30, 0, -30, 0],
                y: [0, -20, -10, -20, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-amber-600"
            >
              <Bug size={24} />
            </motion.div>
          </motion.div>

          {/* Título y descripción */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mb-8"
          >
            <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4">
              ¡Oops! Página no encontrada
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-2">  
              Parece que esta página se perdió en el campo 
            </p>
            <p className="text-base text-gray-500">
              La página que buscas no existe o fue movida a otro lugar.
            </p>
          </motion.div>

          {/* Tarjeta con mensaje divertido */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-8 shadow-lg border border-white/20"
          >
            <div className="flex items-center justify-center mb-4">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-green-500 mr-3"
              >
                <Leaf size={32} />
              </motion.div>
            </div>
            <p className="text-gray-700 text-lg font-medium mb-2">
              "No todas las semillas germinan en el lugar esperado"
            </p>
          </motion.div>

          {/* Botones de acción */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link
              to="/"
              className="group bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center gap-3 min-w-[200px] justify-center"
            >
              <Home size={24} />
              Volver al Inicio
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
              </motion.div>
            </Link>

          </motion.div>
        </div>
      </div>

      {/* Efecto de partículas de polen */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [-20, window.innerHeight + 20],
              x: [0, Math.random() * 100 - 50],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "linear"
            }}
            className="absolute w-1 h-1 bg-yellow-300 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: '-20px',
            }}
          />
        ))}
      </div>

      {/* Gradiente de fondo inferior */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-green-100/50 to-transparent" />
    </div>
  );
};

export default NotFoundPage;
import React, { useState, useEffect } from 'react';
import { useAuth } from './../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const UserAvatar = () => {
  const { isLoggedIn, user, handleLogout } = useAuth();
  const [showName, setShowName] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    if (isLoggedIn && user) {
      setShowName(true);
      const timer = setTimeout(() => {
        setShowName(false);
      }, 3000); // O nome ficará visível por 3 segundos

      return () => clearTimeout(timer); // Limpar o timer caso o componente seja desmontado
    }
  }, [isLoggedIn, user]);

  if (!isLoggedIn || !user) return null; // Retorna null se o usuário não estiver logado

  const toggleMenu = () => setShowMenu(prev => !prev); // Alterna a visibilidade do menu de logout

  return (
    <div className="fixed top-4 right-4 flex items-center md:mr-12">
      <div className="relative flex items-center">
        <AnimatePresence>
          {showName && (
            <motion.div
              className="bg-gray-800 text-white px-4 py-2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.5 }}
              style={{
                marginLeft: '-10px', // Ajusta para que o texto comece mais à esquerda
                borderRadius: '50px 0 0 50px', // Apenas arredonda a parte esquerda
                zIndex: -1, // Garante que o texto fique sobre o avatar
              }}
            >
              Olá, {user.name}!
            </motion.div>
          )}
        </AnimatePresence>
        <motion.img
          src={user.picture} // Usando a URL da foto do Google
          alt="User Avatar"
          className="w-14 h-14 rounded-full cursor-pointer"
          onClick={toggleMenu} // Alterna o menu de logout
          title="Clique para mostrar o menu"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        />
        <AnimatePresence>
          {showMenu && (
            <motion.div
              className="absolute top-full mt-2 w-full p-2 bg-gray-800 text-sm text-white rounded-lg shadow-lg text-center"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <a href="#" onClick={handleLogout}>Logout</a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default UserAvatar;

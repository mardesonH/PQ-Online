import React, { useState, useEffect, useRef } from 'react';
import { HiHome, HiInformationCircle, HiMail, HiMenu, HiX, HiChevronLeft, HiChevronRight, HiLogin, HiLogout, HiArchive } from 'react-icons/hi';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from './../../context/AuthContext';
import { ModalLogin } from './ModalLogin';

const Sidebar = ({ onMenuStateChange }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar o modal
  const menuRef = useRef(null); // Referência ao menu para verificar o clique fora

  const { isLoggedIn, toggleLogin, setUserInfo, handleLogout } = useAuth(); // Acesso ao estado de login e setUserInfo

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1024) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Função para abrir o modal de login
  const handleLoginClick = () => {
    setIsModalOpen(true); // Abre o modal de login
  };

  // Função para fechar o modal
  const handleCloseModal = () => {
    setIsModalOpen(false); // Fecha o modal de login
  };

  // Função para fechar o menu se o usuário clicar fora
  const handleClickOutside = (e) => {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setIsMobileMenuOpen(false); // Fecha o menu se clicar fora dele
    }
  };

  useEffect(() => {
    // Adiciona o listener de clique fora do menu
    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside); // Limpeza do evento
    };
  }, [isMobileMenuOpen]);

  const toggleMenu = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    onMenuStateChange(newState);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="flex">
      {/* Sidebar com animação de transição */}
      <motion.div
        ref={menuRef} // Atribui a referência ao menu
        className={`fixed top-0 left-0 h-screen bg-gray-800 text-white p-5 pt-14 md:pt-4 flex flex-col justify-between z-50
        ${isMobileMenuOpen ? 'block' : 'hidden'} md:block
        ${isCollapsed ? 'w-20' : 'w-64'}`}
        initial={{ width: 80 }}
        animate={{ width: isCollapsed ? 80 : 256 }}
        transition={{ type: "easeInOut", duration: 0.3 }}
      >
        <div className="flex-grow">
          <motion.h2
            className={`text-2xl font-bold mb-5 text-center border-b pb-2`}
            initial={{ opacity: 0 }} // Inicialmente invisível
            animate={{
              opacity: isCollapsed ? 1 : 1, // Sempre visível
              transition: {
                duration: 0.3,               // Duração da animação de transição
                delay: isCollapsed ? 0 : 0.3 // Delay só quando expandido
              }
            }}
          >
            {isCollapsed ? 'PQ' : 'PQ Online'}
          </motion.h2>

          <ul>
            <li className="mb-4 hover:bg-gray-600 p-2 rounded flex items-center">
              <Link to="/" className="flex items-center w-full">
                <HiHome className="text-xl" />
                {!isCollapsed && <span className="ml-4">Home</span>}
              </Link>
            </li>
            <li className="mb-4 hover:bg-gray-600 p-2 rounded flex items-center">
              <Link to="/about" className="flex items-center w-full">
                <HiInformationCircle className="text-xl" />
                {!isCollapsed && <span className="ml-4">Sobre</span>}
              </Link>
            </li>
            {isLoggedIn && (
              <li className="mb-4 hover:bg-gray-600 p-2 rounded flex items-center">
                <Link to="/archive" className="flex items-center w-full">
                  <HiArchive className="text-xl" />
                  {!isCollapsed && <span className="ml-4">Arquivo</span>}
                </Link>
              </li>
            )}

            <li className="mb-4 hover:bg-gray-600 p-2 rounded flex items-center">
            <Link to="/contact" className="flex items-center w-full">
              <HiMail className="text-xl" />
              {!isCollapsed && <span className="ml-4">Contato</span>}
              </Link>
            </li>

            {/* Exibe o botão de Login ou Logout baseado no estado de login */}
            <li className="mb-4 hover:bg-gray-600 p-2 rounded flex items-center">
              {isLoggedIn ? (
                <>
                  <HiLogout className="text-xl" onClick={handleLogout}/>
                  {!isCollapsed && <span className="ml-4 cursor-pointer">Logout</span>}
                </>
              ) : (
                <>
                  <HiLogin className="text-xl cursor-pointer" onClick={handleLoginClick} />
                  {!isCollapsed && <span className="ml-4 cursor-pointer" onClick={handleLoginClick}>Login</span>}
                </>
              )}
            </li>
          </ul>
        </div>

        {/* Botão que fica na parte inferior */}
        <button
          className="text-white text-2xl p-2 mb-5 mt-auto w-full flex justify-end items-center"
          onClick={toggleMenu}
        >
          {isCollapsed ? <HiChevronRight /> : <HiChevronLeft />}
        </button>
      </motion.div>

      <button
        className={` ${isMobileMenuOpen ? 'text-white' : 'text-gray-800'} text-3xl fixed top-5 left-5 md:hidden z-50`}
        onClick={toggleMobileMenu}
      >
        {isMobileMenuOpen ? <HiX /> : <HiMenu />}
      </button>

      {/* Modal de Login */}
      {isModalOpen && <ModalLogin onClose={handleCloseModal} />}
    </div>
  );
};

export default Sidebar;

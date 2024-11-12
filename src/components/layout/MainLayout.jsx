// src/components/layout/MainLayout.js
import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Footer from './Footer';
import ModalTip from '../common/ModalTip';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import PQLogo from './../../assets/logo.png';
import { Link } from 'react-router-dom';
import Loader from './Loader';  // Importa o componente Loader
import UserAvatar from './UserAvatar';
import { useAuth } from './../../context/AuthContext';
import { ToastContainer } from 'react-toastify';
import NotFound from './NotFound';  // Importe o componente NotFound

function MainLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [marginLeft, setMarginLeft] = useState('ml-20');
  const [loading, setLoading] = useState(true);  // Estado de loading
  const location = useLocation();
  const navigate = useNavigate();

  const { isLoggedIn, user, handleLogout } = useAuth();

  const updateMarginLeft = () => {
    if (window.innerWidth < 768) {
      setMarginLeft('ml-0');
    } else if (window.innerWidth === 768) {
      setMarginLeft('ml-[10%]');
    } else {
      setMarginLeft(isCollapsed ? 'ml-[10%]' : 'ml-[14%]');
    }
  };

  useEffect(() => {
    updateMarginLeft();
    window.addEventListener('resize', updateMarginLeft);

    // Simula o tempo de carregamento
    const loaderTimeout = setTimeout(() => setLoading(false), 2000);

    return () => {
      window.removeEventListener('resize', updateMarginLeft);
      clearTimeout(loaderTimeout);
    };
  }, [isCollapsed]);

  const handleMenuStateChange = (collapsed) => {
    setIsCollapsed(collapsed);
    updateMarginLeft();
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  if (loading) return <Loader />;  // Exibe o Loader enquanto está carregando

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-teal-50 to-gray-50">
      <div className="flex flex-1">
        <UserAvatar />
        <Sidebar onMenuStateChange={handleMenuStateChange} />
        <main className={`space-y-4 flex-1 p-6 transition-all duration-300 ${marginLeft} mb-16`}>
          <div className="flex items-start space-x-4 mb-6 pt-10">
            <Link to="/">
              <img src={PQLogo} alt="PQ Logo" className="w-12 h-12 object-cover rounded-lg" />
            </Link>
            <div className="flex flex-col">
              <h1 className="text-xl md:text-2xl lg:text-4xl font-bold">
                Physiotherapy Questionnaires Online
              </h1>
            </div>
          </div>

          <div className="mb-4">
            <button
              onClick={handleBackClick}
              disabled={location.pathname === "/"}
              className={`px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none ${
                location.pathname === "/" ? 'hidden' : 'block'
              } hover:bg-gray-600`}
            >
              Voltar
            </button>
          </div>

          {/* Renderiza a página de erro 404 se a rota for inválida */}
          {location.pathname === '/404' ? <NotFound /> : <Outlet />}
        </main>
      </div>

      <Footer />
      <ModalTip />
      <ToastContainer />
    </div>
  );
}

export default MainLayout;

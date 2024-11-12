import React from 'react';
import { GoogleLogin } from '@react-oauth/google'; // Importando o pacote correto
import { useAuth } from './../../context/AuthContext';

function ModalLogin({ onClose }) {
  const { handleLogin } = useAuth(); // Pega a função de login diretamente

  const handleLoginSuccess = (response) => {
    handleLogin(response); // Chama a função handleLogin
    onClose(); // Fecha o modal
    
    /* setTimeout(
      window.location.reload(),
      1000

    ) */
  };

  const handleLoginFailure = (error) => {
    alert('Falha ao fazer login!');
  };

  const isMobile = window.innerWidth <= 768;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-90 z-50">
      <div className="bg-white rounded-lg p-8 w-11/12 sm:w-96 shadow-lg max-w-lg">
        <h2 className="text-2xl font-semibold text-center mb-4">Faça seu Login</h2>
        
        {/* Botão de Login com Google */}
        <div className="flex justify-center mb-4">
          <GoogleLogin
            onSuccess={handleLoginSuccess}
            onError={handleLoginFailure}
            useOneTap={isMobile} // Habilita OneTap apenas no mobile
            size="large"
            theme="filled_blue"
          />
        </div>
  
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400 focus:outline-none"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}  

export { ModalLogin };

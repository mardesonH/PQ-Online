// src/components/layout/NotFound.js
import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex justify-center items-start min-h-screen">
      <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-sm w-full mt-10">
        <h1 className="text-5xl font-extrabold text-red-600">404</h1>
        <p className="mt-4 text-xl text-gray-700">
          A página que você está procurando não existe! Talvez tenha sido movida ou excluída.
        </p>
        <Link 
          to="/" 
          className="mt-8 inline-block px-6 py-3 bg-teal-600 text-white font-semibold rounded-lg shadow-md hover:bg-teal-500 transition duration-300"
        >
          Voltar para a Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;

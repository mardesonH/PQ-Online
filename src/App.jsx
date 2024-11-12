// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Home from './Home';
import About from './components/layout/About';
import MainLayout from './components/layout/MainLayout';
import QuestionnaireArchive from './components/layout/QuestionnaireArchive';

import VisaAQuestionnaire from './questionnaires/VisaAQuestionnaire';
import VisaPQuestionnaire from './questionnaires/VisaPQuestionnaire';

import Questionario from './questionnaires/Questionario';
import Contact from './components/layout/Contact';
import NotFound from './components/layout/NotFound'; // Importe a página de erro 404

function App() {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Definindo as rotas dentro do layout principal */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/archive" element={<QuestionnaireArchive />} />
              <Route path="/visa-a" element={<VisaAQuestionnaire />} />
              <Route path="/visa-p" element={<VisaPQuestionnaire />} />
              <Route path="/questionario" element={<Questionario />} />
              <Route path="/contact" element={<Contact />} />
              {/* Rota padrão de 404 */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;

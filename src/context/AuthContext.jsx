import React, { createContext, useContext, useState, useEffect } from 'react';


// Contexto de autenticação
const AuthContext = createContext();

// Função para decodificar o JWT (caso o backend passe um JWT no futuro)
const decodeJWT = (token) => {
  if (!token) {
    console.error("Token JWT não encontrado ou inválido");
    return null;
  }

  const payload = token.split('.')[1]; // A divisão em três partes do JWT
  const decoded = JSON.parse(atob(payload)); // Decodifica a parte do payload
  return decoded;
};

// Função para verificar a expiração do token
const isTokenExpired = (decodedToken) => {
  const currentTime = Date.now() / 1000; // Tempo atual em segundos
  return decodedToken.exp < currentTime; // Verifica se a expiração já passou
};

// Fornecendo o estado global de autenticação
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Verifica o login do usuário quando o componente é montado
  useEffect(() => {
    const storedUser = localStorage.getItem('user'); // Leitura direta do localStorage

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser); // Certifica-se de parsear corretamente o JSON

      // Verifica se o usuário tem um token JWT (não é mais necessário com a resposta do servidor)
      if (parsedUser) {
        // Verifica a expiração do token diretamente se necessário
        const tokenExpired = isTokenExpired(parsedUser);
        if (!tokenExpired) {
          // Se o token não expirou, armazene o usuário no estado
          setUser(parsedUser);
        } else {
          // Se o token expirou, remove o usuário do localStorage
          localStorage.removeItem('user');
        }
      } else {
      }
    } else {
    }
  }, []); // Certifica-se de rodar apenas uma vez, quando o componente é montado

  const handleLogin = async (response) => {
    const { credential, clientId } = response;
    
    try {
      const res = await fetch('https://bej07b0p58.execute-api.us-east-1.amazonaws.com/prod/auth/google-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ credential, clientId }),
      });
  
      const data = await res.json();
  
      if (res.ok) {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        window.location.reload();
      } else {
        console.error("Erro no login:", data);
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
    }
  };
  

  const handleLogout = () => {
    setUser(null); // Limpa os dados do usuário
    localStorage.removeItem('user'); // Remove o usuário do localStorage
    window.location.reload()
  };

  // Retorna o estado de login e a função handleLogin
  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para consumir o contexto
export const useAuth = () => {
  return useContext(AuthContext);
};

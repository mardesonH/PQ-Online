import React from 'react';

export default function Footer({ marginLeft = 'ml-64' }) {
  return (
    <footer className="fixed bottom-0 left-0 w-full bg-green-200 text-zinc-600 text-center py-4 text-sm">
      <span className="block w-full">
        <p>&copy; 2024 PQ Online. Todos os direitos reservados.</p>
        <p>
          Desenvolvido por{' '}
          <a href="https://www.linkedin.com/in/mardesonherculano">Mardeson Herculano</a>
        </p>
      </span>
    </footer>
  );
}

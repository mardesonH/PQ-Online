import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

function ModalTip({ onClose }) {
  const [modalClosed, setModalClosed] = useState(() => {
    // Lê o valor de sessionStorage e converte para booleano
    return sessionStorage.getItem('closedModal') === 'true';
  });

  // Bloqueia o scroll quando o modal está aberto
  useEffect(() => {
    if (!modalClosed) {
      document.body.style.overflow = 'hidden'; // Bloqueia o scroll
    } else {
      document.body.style.overflow = ''; // Libera o scroll
    }

    // Limpeza do efeito quando o componente for desmontado ou o modal for fechado
    return () => {
      document.body.style.overflow = ''; // Libera o scroll ao desmontar o componente
    };
  }, [modalClosed]);

  const handleClose = () => {
    sessionStorage.setItem('closedModal', 'true');
    setModalClosed(true); // Atualiza o estado para fechado
    onClose(); // Chama a função de fechamento recebida por props
  };

  return (
    !modalClosed && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-90 z-50">
        <motion.div
          className="bg-white rounded-lg p-8 w-11/12 sm:w-96 shadow-lg max-w-lg"
          initial={{ scale: 0 }} // Começa com escala 0 (não visível)
          animate={{ scale: 1 }} // Anima para escala 1 (tamanho normal)
          exit={{ scale: 0 }} // Sai com escala 0 (desaparece)
          transition={{
            type: 'spring', // Define o tipo como "spring" para efeito de mola
            stiffness: 100, // Rigidez da mola (quanto maior, mais rápido o movimento)
            damping: 25, // Amortecimento da mola (quanto menor, mais "bouncy" fica o movimento)
          }}
        >
          <h2 className="text-2xl font-semibold text-center mb-4">Apoie o PQ Online!</h2>
          <div className="flex justify-center mb-6">
            <img
              src="https://media0.giphy.com/media/qsCayJ9SXqWi2rJhNC/200w.gif?cid=6c09b952h4ypzsmlu1jyrg3o18irxsyw6ihbpl886hlvdxvj&ep=v1_gifs_search&rid=200w.gif&ct=g"
              alt="GIF de apoio"
              className="rounded-lg"
            />
          </div>
          <p className="text-gray-700 mb-6 text-lg leading-relaxed">
            O <strong>PQ Online</strong> é totalmente gratuito, e seu desenvolvimento é movido pela
            paixão de proporcionar uma ferramenta útil para os fisioterapeutas.
            <br />
            Para manter o app em constante evolução, você pode apoiar o projeto com uma contribuição
            via Pix. Sua ajuda financeira é fundamental para que possamos continuar a melhorar e
            expandir o serviço!
            <br />
            <strong>Pix para doações:</strong>{' '}<br/>
            <span className="text-blue-600">mardeson@gmail.com</span>
          </p>
          <div className="flex justify-end">
            <button
              onClick={handleClose}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
            >
              Fechar
            </button>
          </div>
        </motion.div>
      </div>
    )
  );
}

export default ModalTip;

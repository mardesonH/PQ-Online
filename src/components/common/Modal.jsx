import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { jsPDF } from 'jspdf';
import Logo from './../../assets/logo.png';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Loader from './../layout/Loader';
import { useAuth } from './../../context/AuthContext';

function Modal({ onClose, questionario, descricao, perguntas, respostas, pontuacao, nomePaciente, parteDoCorpo }) {
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);  // Novo estado para modal de confirmação
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuth();


  // Função para redirecionar após um pequeno atraso
  const handleClose = () => {
    if (!isSaved && isLoggedIn) {
      setShowConfirmModal(true);  // Exibe o modal de confirmação se não foi salvo
    } else {
      setIsLoading(true); // Ativa o loading
    setTimeout(() => {
      navigate("/"); // Redireciona após o delay
      onClose();  // Fecha o modal
    }, 2000);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    const formularioData = {
      sub: user.sub,
      questionarioData: {
        questionarioId: nomePaciente + Date.now(),
        pessoa: nomePaciente,
        score: pontuacao,
        questionario,
        descricao,
        parteDoCorpo: parteDoCorpo,
        data: new Date().toLocaleString(),
        perguntas,
        respostas,
      },
    };
  
    try {
      const response = await fetch('https://bej07b0p58.execute-api.us-east-1.amazonaws.com/prod/user/questionarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',

        },
        body: JSON.stringify(formularioData),
      });
  
      if (response.ok) {
        const result = await response.json();
        toast.success('Questionário salvo com sucesso!', {
          position: 'top-right',
          autoClose: 2500,
        });
        setIsSaved(true);
      } else {
        const errorData = await response.json();
        toast.error(`Erro ao salvar o questionário: ${errorData.message}`, {
          position: 'top-right',
          autoClose: 2500,
        });
      }
    } catch (error) {
      console.error('Erro ao salvar o questionário:', error);
      toast.error('Erro ao salvar o questionário', {
        position: 'top-right',
        autoClose: 2500,
      });
    }

    setIsLoading(false)
  };
  

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const pageMargin = 20;
    const contentWidth = 160;

    const logoURL = Logo;
    const logoSize = 10;
    const logoX = (doc.internal.pageSize.width - logoSize) / 2;
    doc.addImage(logoURL, 'PNG', logoX, 5, logoSize, logoSize);

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Physiotherapy Questionnaires Online', doc.internal.pageSize.width / 2, 20, { align: 'center' });

    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('Resumo do Questionário', doc.internal.pageSize.width / 2, 35, { align: 'center' });

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const infoYStart = 40;
    doc.text(`Nome: ${nomePaciente}`, pageMargin, infoYStart);
    doc.text(`Questionário: ${questionario}`, pageMargin, infoYStart + 10);
    doc.text(`Parte do Corpo: Tornozelo/Pé`, pageMargin, infoYStart + 20);
    doc.text(`Data: ${new Date().toLocaleDateString()}`, pageMargin, infoYStart + 30);

    doc.setDrawColor(0);
    doc.setLineWidth(0.05);
    doc.line(pageMargin, infoYStart + 35, 210 - pageMargin, infoYStart + 35);

    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    const pontuacaoText = `Pontuação Total: ${pontuacao}`;
    const pontuacaoTextWidth = doc.getTextWidth(pontuacaoText);
    const xCenter = (doc.internal.pageSize.width - pontuacaoTextWidth) / 2;
    doc.text(pontuacaoText, xCenter, infoYStart + 55);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    const descricaoLines = doc.splitTextToSize(descricao, contentWidth);
    let descricaoYPosition = infoYStart + 65;
    descricaoLines.forEach((line, index) => {
      const lineWidth = doc.getTextWidth(line);
      const lineXPosition = (doc.internal.pageSize.width - lineWidth) / 2;
      doc.text(line, lineXPosition, descricaoYPosition + (index * 5));
    });
    descricaoYPosition += descricaoLines.length * 5;

    doc.setLineWidth(0.05);
    doc.line(pageMargin, descricaoYPosition + 5, 210 - pageMargin, descricaoYPosition + 5);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Respostas:', pageMargin, descricaoYPosition + 15);

    doc.setFont('Arial', 'normal');
    let yPosition = descricaoYPosition + 25;
    perguntas.forEach((pergunta, index) => {
      const resposta = respostas[`pergunta${index + 1}`];
      
      const perguntaLines = doc.splitTextToSize(pergunta, contentWidth);
      doc.setFont('Arial', 'bold');
      doc.text(perguntaLines, pageMargin, yPosition);
      yPosition += perguntaLines.length * 5;

      const respostaLines = doc.splitTextToSize(resposta, contentWidth);
      doc.setFont('Arial', 'normal');
      doc.text(respostaLines, pageMargin, yPosition);
      yPosition += respostaLines.length * 5 + 5;

      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
    });

    doc.setLineWidth(0.05);
    doc.line(pageMargin, yPosition, 210 - pageMargin, yPosition);

    const footerText = `Gerado em: ${new Date().toLocaleString()} | Physiotherapy Questionnaires Online | Desenvolvido por `;
    const footerY = 280;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(footerText, pageMargin, footerY);

    const linkX = doc.getTextWidth(footerText);
    doc.setTextColor(0, 0, 255);
    doc.textWithLink('Mardeson Herculano', pageMargin + linkX, footerY, { url: 'https://www.linkedin.com/in/mardeson/' });

    doc.save(`Respostas Questionário - ${questionario} - ${nomePaciente}`);

    toast.success(`PDF gerado com sucesso!`, {
      position: "top-right",
      autoClose: 2500,
    });
  };

  // Função para confirmar ou cancelar o fechamento sem salvar
  const handleConfirmClose = () => {
    setIsLoading(true); // Ativa o loading
    setTimeout(() => {
      navigate("/"); // Redireciona após o delay
      onClose();  // Fecha o modal
    }, 2000);
  };

  const handleCancelClose = () => {
    setShowConfirmModal(false);  // Fecha o modal de confirmação se o usuário cancelar
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-90 z-50">
      <motion.div
        className="bg-white rounded-lg p-8 w-11/12 sm:w-96 shadow-lg max-w-lg flex flex-col items-center relative"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0 }}
        transition={{
          type: 'spring',
          stiffness: 100,
          damping: 25,
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-xl text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>

        {isLoading ? (
          <Loader />
        ) : (
          <>
            <h2 className="text-2xl font-semibold text-center mb-6">Resumo do Questionário</h2>
            <p className="text-5xl font-bold text-center text-blue-600 mb-8">{pontuacao}</p>

            <div className="flex justify-between w-full">
              {isLoggedIn && 
              <button
              onClick={handleSave}
              disabled={isSaved} 
              className={`px-4 py-2 mr-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none ${isSaved ? 'bg-slate-500 hover:bg-slate-500 opacity-20 cursor-not-allowed' : ''}`}
            >
              Salvar
            </button>
              }
              
              <button
                onClick={handleDownloadPDF}
                className="px-4 py-2 mr-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none"
              >
                Baixar PDF
              </button>

              <button
                onClick={handleClose}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
              >
                Finalizar
              </button>
            </div>
          </>
        )}

        {/* Modal de confirmação */}
        {showConfirmModal && (
          <div className="fixed inset-0 bg-black bg-opacity-70 z-60 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg w-96 shadow-lg text-center">
              <p className="text-xl mb-4">Você tem certeza que deseja finalizar sem salvar?</p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={handleConfirmClose}
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none"
                >
                  Confirmar
                </button>
                <button
                  onClick={handleCancelClose}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default Modal;

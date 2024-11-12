import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiTrash, HiDownload, HiEye, HiEyeOff, HiRefresh } from 'react-icons/hi';
import { useLocation } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import { toast } from 'react-toastify';
import Logo from './../../assets/logo.png'
import { useAuth } from './../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function QuestionnaireArchive() {
    const [responses, setResponses] = useState([]);
    const [filteredResponses, setFilteredResponses] = useState([]);
    const [pessoaFilter, setPessoaFilter] = useState('');
    const [questionarioFilter, setQuestionarioFilter] = useState('');
    const [parteDoCorpoFilter, setParteDoCorpoFilter] = useState('');
    const [loading, setLoading] = useState(true);
    const [sortConfig, setSortConfig] = useState({ key: 'data', direction: 'desc' });
    const [showList, setShowList] = useState(true); // Estado para controlar a visibilidade da lista
    const [showFilters, setShowFilters] = useState(true); // Estado para controlar a visibilidade dos filtros
    const location = useLocation();
    const navigate = useNavigate();
    const [isHome, setIsHome] = useState(true);
    const [questionarios, setQuestionarios] = useState([]);
    const [showConfirmModal, setShowConfirmModal] = useState(false); 
    const [questionarioData, setQuestionarioData] = useState(null);

  const { isLoggedIn, user } = useAuth();

  if(isLoggedIn){
        useEffect(() => {
        loadArchive()
      }, []);
  }

  const sub = isLoggedIn ? user.sub : '';

  const loadArchive = () => {
    setLoading(true);
    const fetchQuestionarios = async () => {
      try {
        const response = await fetch(
          `https://bej07b0p58.execute-api.us-east-1.amazonaws.com/prod/user/questionarios/` + sub,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json', // Tipo de conteúdo
            },
          }
        );
  
        if (!response.ok) {
          throw new Error('Erro ao buscar questionários');
        }
  
        const data = await response.json();
        setQuestionarios(data); // Define o estado com os dados recebidos
      } catch (error) {
        console.error('Erro:', error);
        toast.error('Erro ao carregar questionários', {
          position: 'top-right',
          autoClose: 2500,
        });
      } finally {
        setLoading(false);
      }
    };
  
    fetchQuestionarios();
  };


  const handleDelete = (response) => {
    setShowConfirmModal(true)
    setQuestionarioData(response)
  };
  
  const handleConfirmDelete = async () => {
    const { questionarioId } = questionarioData;
    
    try {
      const response = await fetch('https://bej07b0p58.execute-api.us-east-1.amazonaws.com/prod/user/questionarios/', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sub: sub,
          questionarioId: questionarioId,
        }),
      });
    
      // Verifica se o status da resposta está na faixa de sucesso (200-299)
      if (response.ok) {
        // Caso a resposta seja bem-sucedida, lemos o corpo e tratamos
        const data = await response.json();
  
  
        loadArchive();  // Atualiza a página ou estado
        toast.success('Questionário deletado com sucesso!', {
          position: 'top-right',
          autoClose: 2500,
        });
      } else {
        // Se o status não for 2xx, tenta ler o corpo da resposta
        const errorData = await response.json();
        console.error('Erro:', errorData); // Log detalhado de erro
  
        toast.error(errorData.message || 'Erro ao deletar questionário!', {
          position: 'top-right',
          autoClose: 2500,
        });
      }
    } catch (error) {
      console.error('Erro na requisição de exclusão:', error); // Log do erro de requisição
      toast.error('Erro ao tentar deletar questionário!', {
        position: 'top-right',
        autoClose: 2500,
      });
    }
  
    setShowConfirmModal(false); // Fecha o modal de confirmação
    setQuestionarioData(null); // Limpa os dados do questionário
  };
  


  const handleCancelDelete = () => {
    setShowConfirmModal(false)

  }
  
    useEffect(() => {
        if (location.pathname === '/') {
            setIsHome(true)
        } else {
            setIsHome(false)
        }
    }, [location.pathname]);

    const handleDownloadPDF = (response) => {
        const doc = new jsPDF();
        const pageMargin = 20;
        const contentWidth = 160; // Margem ajustada para o conteúdo

        // Adiciona a logo centralizada no topo (10x10)
        const logoURL = Logo; // Coloque o URL ou base64 da imagem da logo
        const logoSize = 10; // Tamanho da logo 10x10
        const logoX = (doc.internal.pageSize.width - logoSize) / 2; // Centraliza no eixo X
        doc.addImage(logoURL, 'PNG', logoX, 5, logoSize, logoSize);

        // Nome do site centralizado abaixo da logo
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('Physiotherapy Questionnaires Online', doc.internal.pageSize.width / 2, 20, { align: 'center' });

        // Cabeçalho principal
        doc.setFontSize(24);
        doc.setFont('helvetica', 'bold');
        doc.text('Resumo do Questionário', doc.internal.pageSize.width / 2, 35, { align: 'center' });

        // Subtítulo com informações básicas e espaçamento
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        const infoYStart = 40;
        doc.text(`Nome: ${response.pessoa}`, pageMargin, infoYStart);
        doc.text(`Questionário: ${response.questionario}`, pageMargin, infoYStart + 10);
        doc.text(`Parte do Corpo: ${response.parteDoCorpo}`, pageMargin, infoYStart + 20);
        doc.text(`Data: ${new Date(response.data).toLocaleString()}`, pageMargin, infoYStart + 30);

        // Linha de separação
        doc.setDrawColor(0);
        doc.setLineWidth(0.05);
        doc.line(pageMargin, infoYStart + 35, 210 - pageMargin, infoYStart + 35);

        // Pontuação total com destaque
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        const pontuacaoText = `Pontuação Total: ${response.score}`;
        const pontuacaoTextWidth = doc.getTextWidth(pontuacaoText);
        const xCenter = (doc.internal.pageSize.width - pontuacaoTextWidth) / 2;
        doc.text(pontuacaoText, xCenter, infoYStart + 55);

        // Descrição com quebra de linha e alinhamento centralizado
        doc.setFontSize(10);
        doc.setFont('helvetica', 'italic');
        const descricaoLines = doc.splitTextToSize(response.descricao, contentWidth);
        let descricaoYPosition = infoYStart + 65;
        descricaoLines.forEach((line, index) => {
            const lineWidth = doc.getTextWidth(line);
            const lineXPosition = (doc.internal.pageSize.width - lineWidth) / 2;
            doc.text(line, lineXPosition, descricaoYPosition + (index * 5));
        });
        descricaoYPosition += descricaoLines.length * 5;

        // Linha de separação
        doc.setLineWidth(0.05);
        doc.line(pageMargin, descricaoYPosition + 5, 210 - pageMargin, descricaoYPosition + 5);

        // Título das perguntas e respostas com espaçamento
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Respostas:', pageMargin, descricaoYPosition + 15);

        // Adicionando perguntas e respostas com espaçamento e margem à direita
        doc.setFont('Arial', 'normal');
        let yPosition = descricaoYPosition + 25;
        response.perguntas.forEach((pergunta, index) => {
            const resposta = response.respostas[`pergunta${index + 1}`];

            // Quebra a pergunta em várias linhas, se necessário
            const perguntaLines = doc.splitTextToSize(pergunta, contentWidth);
            doc.setFont('Arial', 'bold');
            doc.text(perguntaLines, pageMargin, yPosition);
            yPosition += perguntaLines.length * 5;

            // Quebra a resposta em várias linhas, se necessário
            const respostaLines = doc.splitTextToSize(resposta, contentWidth);
            doc.setFont('Arial', 'normal');
            doc.text(respostaLines, pageMargin, yPosition);
            yPosition += respostaLines.length * 5 + 5;

            // Adiciona nova página, se necessário
            if (yPosition > 270) {
                doc.addPage();
                yPosition = 20;
            }
        });

        // Linha de separação final
        doc.setLineWidth(0.05);
        doc.line(pageMargin, yPosition, 210 - pageMargin, yPosition);

        // Rodapé
        const footerText = `Gerado em: ${new Date().toLocaleString()} | Physiotherapy Questionnaires Online | Desenvolvido por `;
        const footerY = 280;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(footerText, pageMargin, footerY);

        // Link "Desenvolvido por Mardeson Herculano" em azul
        const linkX = doc.getTextWidth(footerText);
        doc.setTextColor(0, 0, 255);
        doc.textWithLink('Mardeson Herculano', pageMargin + linkX, footerY, { url: 'https://www.linkedin.com/in/mardeson/' });

        // Salva o PDF
        doc.save(`Respostas Questionário - ${response.questionario} - ${response.pessoa}`);

        toast.success(`PDF gerado com sucesso!`, {
            position: "top-right",
            autoClose: 2500,
        });
    };

    useEffect(() => {
        if (!loading) {
            handleFilter();
        }
    }, [pessoaFilter, questionarioFilter, parteDoCorpoFilter, loading]);

    const handleFilter = () => {
        const filtered = questionarios.questionarios.filter((response) => {
            return (
                (pessoaFilter === '' || response.pessoa === pessoaFilter) &&
                (questionarioFilter === '' || response.questionario === questionarioFilter) &&
                (parteDoCorpoFilter === '' || response.parteDoCorpo === parteDoCorpoFilter)
            );
        });
        setFilteredResponses(filtered);
    };

    const uniqueValues = (key) => {
        return [...new Set(responses.map((response) => response[key]))];
    };

    const handleSort = (key) => {
        if (sortConfig.key === key) {
            setSortConfig({
                key,
                direction: sortConfig.direction === 'desc' ? 'asc' : sortConfig.direction === 'asc' ? null : 'desc'
            });
        } else {
            setSortConfig({ key, direction: 'desc' });
        }
    };

    const sortedResponses = [...filteredResponses].sort((a, b) => {
        if (!sortConfig.direction || !sortConfig.key) return 0;
        if (sortConfig.direction === 'asc') {
            return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
        }
        if (sortConfig.direction === 'desc') {
            return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
        }
        return 0;
    });

    const handleRefresh = () => {
        loadArchive()
    };

    /* useEffect(() => {
        if (questionarios.questionarios.length === 0) {
            setShowFilters(false)
        }
    }) */

    return (
        <>
        {!isHome && 

<motion.h1
className="text-3xl"
>
Arquivo
</motion.h1>
        
        }
        
        <div className={`w-full bg-gradient-to-r from-neutral-300 to-gray-100 p-4 rounded-lg mb-10`}>
            
            <div className="flex items-center mb-4">
                <button
                    onClick={() => {
                        setShowList((prev) => !prev);
                        setShowFilters((prev) => !prev);
                    }}
                    className={`p-2 text-black rounded ${isLoggedIn && isHome ? 'block' : 'hidden'}`}
                >
                    {showList ? <HiEye /> : <HiEyeOff />}
                </button>
                <h2 className='text-xl font-bold'>Questionários aplicados</h2>
                <button
                    onClick={handleRefresh}
                    className={`ml-4 p-2 text-black rounded hover:bg-gray-300 ${!isLoggedIn || !showList ? 'hidden' : 'block'}`}
                >
                    <HiRefresh className="text-lg" />
                </button>
            </div>

            {!isLoggedIn ? (
                <p className="text-red-600 text-center md:text-left">Você precisa estar logado para ver seus questionários salvos</p>
            ) : (
                <>


                    {showFilters && (
                        <div className='flex flex-wrap mb-4 gap-4'>
                            <select
                                value={pessoaFilter}
                                onChange={(e) => setPessoaFilter(e.target.value)}
                                className='p-2 border border-gray-300 rounded w-full sm:w-auto mb-2 sm:mb-0'
                            >
                                <option value=''>Filtrar por Pessoa</option>
                                {uniqueValues('pessoa').map((pessoa) => (
                                    <option key={pessoa} value={pessoa}>
                                        {pessoa}
                                    </option>
                                ))}
                            </select>

                            <select
                                value={questionarioFilter}
                                onChange={(e) => setQuestionarioFilter(e.target.value)}
                                className='p-2 border border-gray-300 rounded w-full sm:w-auto mb-2 sm:mb-0'
                            >
                                <option value=''>Filtrar por Questionário</option>
                                {uniqueValues('questionario').map((questionario) => (
                                    <option key={questionario} value={questionario}>
                                        {questionario}
                                    </option>
                                ))}
                            </select>

                            <select
                                value={parteDoCorpoFilter}
                                onChange={(e) => setParteDoCorpoFilter(e.target.value)}
                                className='p-2 border border-gray-300 rounded w-full sm:w-auto mb-2 sm:mb-0'
                            >
                                <option value=''>Filtrar por Parte do Corpo</option>
                                {uniqueValues('parteDoCorpo').map((parte) => (
                                    <option key={parte} value={parte}>
                                        {parte}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Se os dados estão carregando, exibe um aviso */}
                    {loading ? (
                        <div className='text-center text-lg'>Carregando dados...</div>
                    ) : (
                        <>
                            {/* Renderiza a lista somente se showList for true */}
                            {showList && (
                                <>
                                    {/* Tabela (modo desktop) */}
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}  // Começa com altura 0 e opacidade 0
                                        animate={{ height: 'auto', opacity: 1 }}  // Expande até altura automática e opacidade 1
                                        exit={{ height: 0, opacity: 0 }}  // Quando a lista desaparecer, a altura será 0 e a opacidade será 0
                                        transition={{ duration: 0.5 }}  // A duração da animação
                                    >
                                        <div className={`overflow-x-auto hidden sm:block overflow-y-auto ${isHome ? 'max-h-80' : ''}`}>
                                            <table className='w-full bg-white rounded shadow'>
                                                <thead>
                                                    <tr className='bg-gray-400 text-left'>
                                                        <th
                                                            className='p-4 cursor-pointer text-sm sm:text-base'
                                                            onClick={() => handleSort('pessoa')}
                                                        >
                                                            Nome
                                                            {sortConfig.key === 'pessoa' && (sortConfig.direction === 'asc' ? ' ▲' : sortConfig.direction === 'desc' ? ' ▼' : '')}
                                                        </th>
                                                        <th
                                                            className='p-4 cursor-pointer text-sm sm:text-base'
                                                            onClick={() => handleSort('questionario')}
                                                        >
                                                            Questionário
                                                            {sortConfig.key === 'questionario' && (sortConfig.direction === 'asc' ? ' ▲' : sortConfig.direction === 'desc' ? ' ▼' : '')}
                                                        </th>
                                                        <th
                                                            className='p-4 cursor-pointer text-sm sm:text-base'
                                                            onClick={() => handleSort('score')}
                                                        >
                                                            Score
                                                            {sortConfig.key === 'score' && (sortConfig.direction === 'asc' ? ' ▲' : sortConfig.direction === 'desc' ? ' ▼' : '')}
                                                        </th>
                                                        <th
                                                            className='p-4 cursor-pointer text-sm sm:text-base'
                                                            onClick={() => handleSort('parteDoCorpo')}
                                                        >
                                                            Parte do Corpo
                                                            {sortConfig.key === 'parteDoCorpo' && (sortConfig.direction === 'asc' ? ' ▲' : sortConfig.direction === 'desc' ? ' ▼' : '')}
                                                        </th>
                                                        <th
                                                            className='p-4 cursor-pointer text-sm sm:text-base'
                                                            onClick={() => handleSort('data')}
                                                        >
                                                            Data
                                                            {sortConfig.key === 'data' && (sortConfig.direction === 'asc' ? ' ▲' : sortConfig.direction === 'desc' ? ' ▼' : '')}
                                                        </th>
                                                        <th className='p-4 text-sm sm:text-base'>Ações</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {sortedResponses.length === 0 ? (
                                                        <tr>
                                                            <td colSpan='6' className='p-4 text-center text-sm sm:text-base'>
                                                                Nenhum dado encontrado.
                                                            </td>
                                                        </tr>
                                                    ) : (
                                                        sortedResponses.map((response, index) => (
                                                            <tr key={response.id} className={`border-t ${index % 2 === 0 ? 'bg-slate-50' : 'bg-slate-200'}`}>
                                                                <td className='p-4 text-sm sm:text-base'>{response.pessoa}</td>
                                                                <td className='p-4 text-sm sm:text-base'>{response.questionario}</td>
                                                                <td className='p-4 text-sm sm:text-base'>{response.score}</td>
                                                                <td className='p-4 text-sm sm:text-base'>{response.parteDoCorpo}</td>
                                                                <td className='p-4 text-sm sm:text-base'>
                                                                    {new Date(response.data).toLocaleString()}  {/* Exibe a data no formato local de data e hora */}
                                                                </td>

                                                                <td className='p-4'>
                                                                    <div className="flex space-x-2 sm:space-x-0 sm:flex-col">
                                                                        <button className='flex items-center px-3 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-105 transition ease-in-out text-white rounded'
                                                                            onClick={() => handleDownloadPDF(response)} >
                                                                            <HiDownload className="text-md mr-2" /> Download
                                                                        </button>
                                                                        <button className='flex items-center px-3 py-1 mt-2 bg-gradient-to-r from-red-600 to-red-800 hover:scale-105 transition ease-in-out text-white rounded text-sm'
                                                                        onClick={() => handleDelete(response)} >
                                                                            <HiTrash className="text-md mr-2" /> Deletar
                                                                        </button>
                                                                    </div>

                                                                </td>
                                                            </tr>
                                                        ))
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </motion.div>

                                    {/* Cards (modo mobile) */}
                                    <motion.div
                                        initial={{ opacity: 0 }}  // Começa com opacidade 0
                                        animate={{ opacity: 1 }}  // Anima para opacidade 1
                                        exit={{ opacity: 0 }}  // Quando a lista desaparecer, a opacidade será 0
                                        transition={{ duration: 0.5 }}  // A duração da animação
                                    >
                                        <div className={`sm:hidden overflow-y-auto ${isHome ? 'max-h-96' : ''}`}>
                                            {sortedResponses.length === 0 ? (
                                                <p className='text-center'>Nenhum dado encontrado.</p>
                                            ) : (
                                                sortedResponses.map((response) => (
                                                    <motion.div
                                                        key={response.id}
                                                        className={`mb-4 bg-slate-50 p-4 rounded-lg shadow`}
                                                        whileHover={{ scale: 1.05 }}
                                                    >
                                                        <h3 className="text-lg font-semibold">{response.pessoa}</h3>
                                                        <p className="text-sm">{response.questionario}</p>
                                                        <p className="text-sm">{response.score}</p>
                                                        <p className="text-sm">{response.parteDoCorpo}</p>
                                                        <p className="text-sm">{response.data}</p>
                                                        <div className="flex flex-col sm:flex-row mt-2 space-y-2">
                                                            <button className="flex justify-center items-center px-3 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded text-sm"
                                                            onClick={() => handleDownloadPDF(response)} >
                                                                <HiDownload className="text-xl mr-2" /> Download
                                                            </button>

                                                            <button className="flex justify-center items-center px-3 py-1 bg-gradient-to-r from-red-600 to-red-800 text-white rounded text-sm"
                                                            onClick={() => handleDelete(response)} >
                                                                <HiTrash className="text-xl mr-2" /> Deletar
                                                            </button>
                                                        </div>
                                                    </motion.div>
                                                ))
                                            )}
                                        </div>
                                    </motion.div>
                                </>
                            )}



                        </>
                    )}
                </>
            )}
        </div>

        {showConfirmModal && (
          <div className="fixed inset-0 bg-black bg-opacity-70 z-90 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg w-96 shadow-lg text-center">
              <p className="text-xl mb-4">Você tem certeza que deseja deletar o questionário?</p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none"
                >
                  Confirmar
                </button>
                <button
                  onClick={handleCancelDelete}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
        </>
    );
}

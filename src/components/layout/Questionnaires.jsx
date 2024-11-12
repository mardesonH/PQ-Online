import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaStar, FaRegStar } from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import { Link } from 'react-router-dom';

const questionariosMockados = [
  {
    id: 1,
    nome: 'VISA-A (Ankle)',
    parteDoCorpo: 'Tornozelo',
    descricao: 'O Questionário VISA-A avalia a gravidade de lesões no tornozelo e como elas afetam o desempenho e a qualidade de vida do paciente.',
    imagem: 'https://orthosp.com/wp-content/uploads/2023/07/ap1-scaled.jpg',
    link: '/visa-a'
  },
 {
    id: 2,
    nome: 'VISA-P (Patellar)',
    parteDoCorpo: 'Joelho',
    descricao: 'O Questionário VISA-P é utilizado para avaliar a dor, a função e os sintomas relacionados a lesões na patela, como a condromalácia patelar.',
    imagem: 'https://matthewprovenchermd.com/wp-content/uploads/2021/09/Patellafemoral-Pain-400x286.jpg',
    link: '/visa-p'
  },
  /*  
  {
    id: 3,
    nome: 'LEFS (Lower Extremity Function Scale)',
    parteDoCorpo: 'Pernas',
    descricao: 'O LEFS é um questionário utilizado para medir a função das extremidades inferiores, focando em problemas como dor e mobilidade.',
    imagem: 'https://via.placeholder.com/150',
    link: '/visaa'
  },
  {
    id: 4,
    nome: 'Orebro Musculoskeletal Pain Questionnaire (OMPQ)',
    parteDoCorpo: 'Costas',
    descricao: 'Este questionário é utilizado para avaliar o risco de cronicidade e a incapacidade em pessoas com dor musculoesquelética, especialmente na coluna lombar.',
    imagem: 'https://via.placeholder.com/150',
    link: '/visaa'
  },
  {
    id: 5,
    nome: 'SF-36 (Short Form Health Survey)',
    parteDoCorpo: 'Corpo Inteiro',
    descricao: 'O SF-36 é um questionário geral de saúde que avalia a qualidade de vida relacionada à saúde física e mental, utilizado em diversas condições musculoesqueléticas.',
    imagem: 'https://via.placeholder.com/150',
    link: '/visaa'
  },
  {
    id: 6,
    nome: 'WOMAC (Western Ontario and McMaster Universities Osteoarthritis Index)',
    parteDoCorpo: 'Joelho',
    descricao: 'O WOMAC é um questionário amplamente utilizado para avaliar a dor, a rigidez e a função de pessoas com osteoartrite no joelho.',
    imagem: 'https://via.placeholder.com/150',
    link: '/visaa'
  },
  {
    id: 7,
    nome: 'KOOS (Knee injury and Osteoarthritis Outcome Score)',
    parteDoCorpo: 'Joelho',
    descricao: 'O KOOS é um questionário utilizado para avaliar os sintomas e a função do joelho, especialmente após lesões ou em pacientes com osteoartrite.',
    imagem: 'https://www.visitcompletecare.com/wp-content/uploads/2015/09/shutterstock_1784966525-1-1536x1000.webp',
    link: '/visaa'
  },
  {
    id: 8,
    nome: 'Neck Disability Index (NDI)',
    parteDoCorpo: 'Pescoço',
    descricao: 'O NDI é um questionário utilizado para avaliar a incapacidade relacionada à dor cervical e suas limitações nas atividades diárias.',
    imagem: 'https://via.placeholder.com/150',
    link: '/visaa'
  },
  {
    id: 9,
    nome: 'Oswestry Disability Index (ODI)',
    parteDoCorpo: 'Costas',
    descricao: 'O ODI é um dos questionários mais utilizados para medir a incapacidade relacionada a dores na coluna lombar.',
    imagem: 'https://via.placeholder.com/150',
    link: '/visaa'
  },
  {
    id: 10,
    nome: 'FADI (Foot and Ankle Disability Index)',
    parteDoCorpo: 'Pé e Tornozelo',
    descricao: 'O FADI é utilizado para medir a função do pé e tornozelo, especialmente em pacientes com lesões ou após cirurgias.',
    imagem: 'https://orthosp.com/wp-content/uploads/2023/07/ap1-scaled.jpg',
    link: '/visaa'
  }, */
];

export default function Questionnaires() {
  const [filtro, setFiltro] = useState('');
  const [busca, setBusca] = useState('');
  const [favoritos, setFavoritos] = useState([]);
  const [showQuestionnaires, setShowQuestionnaires] = useState(true);

  useEffect(() => {
    const favoritosSalvos = JSON.parse(localStorage.getItem('favoritos')) || [];
    setFavoritos(favoritosSalvos);
  }, []);

  const toggleFavorito = (id, nome) => {
    let novosFavoritos;
    if (favoritos.includes(id)) {
      novosFavoritos = favoritos.filter((fav) => fav !== id);
      toast.info(`O questionário ${nome} foi removido dos favoritos.`, {
        position: "top-right",
        autoClose: 1500,
      }, []);
    } else {
      novosFavoritos = [...favoritos, id];
      toast.success(`O questionário ${nome} foi adicionado aos favoritos!`, {
        position: "top-right",
        autoClose: 1500,
      }, []);
    }
    setFavoritos(novosFavoritos);
    localStorage.setItem('favoritos', JSON.stringify(novosFavoritos));
  };

  const questionariosFiltrados = questionariosMockados.filter((item) => {
    const buscaMatch = item.nome.toLowerCase().includes(busca.toLowerCase());
    const filtroMatch = filtro ? item.parteDoCorpo === filtro : true;
    return buscaMatch && filtroMatch;
  });

  const partesDoCorpoUnicas = [
    ...new Set(questionariosMockados.map((item) => item.parteDoCorpo)),
  ];

  const questionariosOrdenados = [
    ...questionariosFiltrados.filter((q) => favoritos.includes(q.id)),
    ...questionariosFiltrados.filter((q) => !favoritos.includes(q.id)),
  ];

  return (
    <div className="w-full bg-gradient-to-r from-neutral-300 to-gray-100 p-4 rounded-lg mb-10">
      <div className="flex items-center mb-4">
        <button
          onClick={() => setShowQuestionnaires((prev) => !prev)}
          className={`p-2 text-black rounded`}
        >
          {showQuestionnaires ? <HiEye /> : <HiEyeOff />}
        </button>
        <h2 className="text-xl font-bold mr-4">Questionários</h2>
      </div>

      {showQuestionnaires && (
        <>
          <div className="mb-4">
            <label htmlFor="filtro" className="mr-2 text-lg font-semibold">
              Filtrar por parte do corpo:
            </label>
            <select
              id="filtro"
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              className="p-2 border border-gray-300 rounded"
            >
              <option value="">Todos</option>
              {partesDoCorpoUnicas.map((parte, index) => (
                <option key={index} value={parte}>
                  {parte}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar questionário..."
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto max-h-[350px] px-4"
            key={filtro + busca} // Isso garante que a animação será aplicada quando o filtro ou a busca mudar
            initial={{ height: 0, opacity: 0 }}  // Começa com altura 0 e opacidade 0
            animate={{ height: 'auto', opacity: 1 }}  // Expande até altura automática e opacidade 1
            exit={{ height: 0, opacity: 0 }}  // Quando a lista desaparecer, a altura será 0 e a opacidade será 0
            transition={{ duration: 0.5 }}
          >
            {questionariosOrdenados.length === 0 ? (
              <p className="col-span-full text-center text-gray-600">Nenhum questionário encontrado.</p>
            ) : (
              questionariosOrdenados.map((questionario, index) => (
                <motion.div
                  key={questionario.id}
                  className="bg-white p-4 rounded-lg h-full bg-black shadow-lg relative flex items-center space-x-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    delay: index * 0.1, // Cascata
                    type: 'spring',
                    stiffness: 300,
                    damping: 20
                  }}
                >
                  <Link to={questionario.link} className="flex items-center space-x-4 flex-1">
                    <img
                      src={questionario.imagem}
                      alt={`Imagem de ${questionario.nome}`}
                      className="w-12 h-12 object-cover rounded-full"
                    />
                    <div>
                      <h3 className="text-lg font-semibold">{questionario.nome}</h3>
                      <p className="text-sm text-gray-500">{questionario.parteDoCorpo}</p>
                    </div>
                  </Link>
                  <div
                    className="cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation(); // Evita que o clique propague para o Link
                      toggleFavorito(questionario.id, questionario.nome);
                    }}
                  >
                    {favoritos.includes(questionario.id) ? (
                      <FaStar size={24} color="gold" />
                    ) : (
                      <FaRegStar size={24} color="gray" />
                    )}
                  </div>
                </motion.div>
              ))
              
            )}
          </motion.div>

        </>
      )}
    </div>
  );
}

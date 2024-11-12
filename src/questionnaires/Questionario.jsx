import { useState } from 'react';
import { motion } from 'framer-motion';

function Questionario({ questionario }) {
  const [formData, setFormData] = useState({ nomePaciente: '', respostas: {} });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'nomePaciente') {
      setFormData((prevData) => ({
        ...prevData,
        nomePaciente: value,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        respostas: {
          ...prevData.respostas,
          [name]: value,
        },
      }));
    }
  };

  return (
    <div className="container mx-auto px-6 py-8 max-w-3xl">
      {/* Cabeçalho do questionário */}
      <motion.header
        className="text-center mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-4xl font-semibold text-gray-900">{questionario.titulo}</h2>
        <p className="text-lg text-gray-600 mt-2">{questionario.descricao}</p>
        <a
          href={questionario.link_paper}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-300"
        >
          Acessar Paper
        </a>
      </motion.header>

      {/* Campo para o nome do paciente */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <label className="block text-sm font-semibold text-gray-700" htmlFor="nomePaciente">
          Nome do Paciente
        </label>
        <input
          type="text"
          id="nomePaciente"
          name="nomePaciente"
          value={formData.nomePaciente}
          onChange={handleChange}
          className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </motion.div>

      {/* Perguntas do questionário */}
      <motion.form
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        {questionario.perguntas.map((pergunta) => (
          <div key={pergunta.id} className="mb-6">
            <p className="text-lg font-medium text-gray-800">{pergunta.texto}</p>

            {/* Tipo de entrada baseado no tipo da pergunta */}
            {pergunta.tipo === 'range' && (
              <motion.div
                className="mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <input
                  type="range"
                  min={pergunta.min}
                  max={pergunta.max}
                  value={formData.respostas[pergunta.id] || 0}
                  name={pergunta.id}
                  onChange={handleChange}
                  className="w-full h-2 bg-blue-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-center text-sm mt-2">{formData.respostas[pergunta.id] || 0}</p>
              </motion.div>
            )}

            {pergunta.tipo === 'radio' && (
              <div className="mt-4 space-y-4">
                {pergunta.opcoes.map((opcao, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                  >
                    <input
                      type="radio"
                      id={`${pergunta.id}_${index}`}
                      name={pergunta.id}
                      value={opcao}
                      onChange={handleChange}
                      className="mr-3 h-4 w-4 text-blue-500 focus:ring-0"
                    />
                    <label htmlFor={`${pergunta.id}_${index}`} className="text-sm">{opcao}</label>
                  </motion.div>
                ))}
              </div>
            )}

            {pergunta.tipo === 'select' && (
              <motion.div
                className="mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <label className="block text-sm font-semibold text-gray-700" htmlFor={pergunta.id}>
                  {pergunta.texto}
                </label>
                <select
                  id={pergunta.id}
                  name={pergunta.id}
                  value={formData.respostas[pergunta.id] || ''}
                  onChange={handleChange}
                  className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" disabled>
                    Selecione uma opção
                  </option>
                  {pergunta.opcoes.map((opcao, index) => (
                    <option key={index} value={opcao}>
                      {opcao}
                    </option>
                  ))}
                </select>
                {formData.respostas[pergunta.id] && (
                  <p className="text-sm text-gray-500 mt-2">
                    Opção selecionada: {formData.respostas[pergunta.id]}
                  </p>
                )}
              </motion.div>
            )}
          </div>
        ))}
      </motion.form>
    </div>
  );
}

export default Questionario;

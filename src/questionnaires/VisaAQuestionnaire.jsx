import { useState } from 'react';
import { motion } from 'framer-motion';
import { form } from 'framer-motion/client';
import { toast } from 'react-toastify';
import Modal from '../components/common/Modal';


function VisaAQuestionario() {

    const [modalOpen, setModalOpen] = useState(false);
    const [formularioData, setFormularioData] = useState(null);

    const [formData, setFormData] = useState({
        pergunta1: 0,
        pergunta2: 0,
        pergunta3: 0,
        pergunta4: 0,
        pergunta5: 0,
        pergunta6: 0,
        pergunta7: "",
        pergunta8A: "",
        pergunta8B: "",
        pergunta8C: ""
    });

    const handleSubmit = (event) => {
        event.preventDefault();
        const { nomePaciente, ...rest } = formData;  // Extrai o nome e o restante das respostas
        
        // Verifica se o nome do paciente foi preenchido
        if (!nomePaciente) {
            toast.error(`Preencha o nome do paciente!`, {
                position: "top-right",
                autoClose: 3000,
            });
            return;
        }
        
        // Verificar se todas as perguntas foram preenchidas
        const perguntasObrigatorias = [
            'pergunta1', 'pergunta2', 'pergunta3', 'pergunta4', 
            'pergunta5', 'pergunta6', 'pergunta7',
        ];
        
        // Verificar se pelo menos uma das perguntas 8A, 8B ou 8C foi respondida
        const resposta8 = formData.pergunta8A || formData.pergunta8B || formData.pergunta8C;
        if (!resposta8) {
            toast.error(`Por favor, preencha pelo menos uma das questões 8A, 8B ou 8C!`, {
                position: "top-right",
                autoClose: 3000,
            });
            return;
        }
        
        // Cálculo da pontuação
        let resultadoCalculado = 0;
        
        // Soma das respostas de 2 a 7
        for (let i = 2; i <= 7; i++) {
            const valor = parseInt(formData[`pergunta${i}`], 10);
            if (!isNaN(valor)) {
                resultadoCalculado += valor;
            }
        }
        
        // Pergunta 1: 10 - valor (garante que a resposta é válida)
        const pergunta1 = parseInt(formData.pergunta1, 10);
        if (!isNaN(pergunta1)) {
            resultadoCalculado += 10 - pergunta1;  // 10 menos o valor de pergunta1
        }
        
        // Pergunta 8A, 8B ou 8C - Determina o valor de q8 com conversão para número
        const q8 = parseInt(formData.pergunta8A, 10) || parseInt(formData.pergunta8B, 10) || parseInt(formData.pergunta8C, 10) || 0;
        resultadoCalculado += q8;
                
        // Ajustar para passar a resposta correta da pergunta 8
        let pergunta8Resposta = '';
        let pergunta8Texto = '';
        if (formData.pergunta8A) {
            pergunta8Resposta = formData.pergunta8A;
            pergunta8Texto = formData.pergunta8ATexto || '';  // Captura o texto da resposta
        } else if (formData.pergunta8B) {
            pergunta8Resposta = formData.pergunta8B;
            pergunta8Texto = formData.pergunta8BTexto || '';
        } else if (formData.pergunta8C) {
            pergunta8Resposta = formData.pergunta8C;
            pergunta8Texto = formData.pergunta8CTexto || '';
        }
        
        // Atualizando o estado com respostas válidas
        setFormularioData({
            nome: nomePaciente,
            questionario: 'VISA-A',
            parteDoCorpo:'Tornozelo/Pé',
            descricao: 'A pontuação total no VISA-P, que representa a gravidade da condição do entrevistado em termos numéricos, varia de 0 a 100 pontos, com uma pontuação máxima indicando a ausência de sintomas e incapacidade.',
            respostas: {
                pergunta1: formData.pergunta1,
                pergunta2: formData.pergunta2,
                pergunta3: formData.pergunta3,
                pergunta4: formData.pergunta4,
                pergunta5: formData.pergunta5,
                pergunta6: formData.pergunta6,
                pergunta7: formData.pergunta7Texto,
                pergunta8: pergunta8Texto,
            },
            pontuacao: resultadoCalculado + '/100',
            perguntas: [
                '1. Quando você se levanta, pela manhã, por quantos minutos sente rígida a região do Tendão de Aquiles?',
                '2. Quando você está preparado/aquecido para o dia, sente dor quando alonga o Tendão de Aquiles ao máximo na borda de um degrau, mantendo os joelhos bem esticados?',
                '3. Após andar em uma superfície plana por 30 minutos, você sente dor no Tendão de Aquiles nas próximas duas horas? (Se a dor impedir você de andar em uma superfícia plana por 30 minutos, marque 0 nessa questão).',
                '4. Você sente dor descendo escadas em um ritmo normal?',
                '5. Você sente dor durante ou imediatamente após ficar nas pontas do pés, com apenas uma perna, por 10 vezes?',
                '6. Quantos pulos, com uma perna só, você consegue fazer sem sentir dor?',
                '7. Você está praticando algum esporte ou outra atividade física atualmente?',
                formData.pergunta8A ? '8A. Se você não sente dor ao praticar esportes, por quanto tempo consegue treinar/praticar?' :
                formData.pergunta8B ? '8B. Se você sente dor ao praticar algum esporte, mas esta dor não o impede de praticar a atividade esportiva, por quanto tempo você consegue treinar/praticar?' :
                formData.pergunta8C ? '8C. Se você sente dor que o impede de praticar atividades esportivas, por quanto tempo você consegue treinar/praticar?' :
                '',
            ].filter(Boolean),  // Remove qualquer string vazia
        });
        
        setModalOpen(true);
    };
    
    
    const handleChange = (event) => {
        const { name, value, dataset } = event.target;  // Captura o data-value também
        
        const dataValue = dataset.value || ''; // Se data-value existir, armazene-o
    
        setFormData((prevData) => {
            const updatedData = { ...prevData, [name]: value };
    
            // Se uma das perguntas 8A, 8B ou 8C for alterada, desmarque as outras
            if (['pergunta8A', 'pergunta8B', 'pergunta8C'].includes(name)) {
                if (name === 'pergunta8A') {
                    updatedData.pergunta8B = '';
                    updatedData.pergunta8C = '';
                }
                if (name === 'pergunta8B') {
                    updatedData.pergunta8A = '';
                    updatedData.pergunta8C = '';
                }
                if (name === 'pergunta8C') {
                    updatedData.pergunta8A = '';
                    updatedData.pergunta8B = '';
                }
            }
    
            // Para perguntas 8A, 8B, 8C, além do value, também armazene o data-value
            if (['pergunta7','pergunta8A', 'pergunta8B', 'pergunta8C'].includes(name)) {
                updatedData[`${name}Texto`] = dataValue;  // Armazenando o texto da resposta
            }
    
            // Garantir que o nomePaciente seja tratado corretamente
            if (name === 'nomePaciente') {
                updatedData.nomePaciente = value;
            }
    
            return updatedData;
        });
    };
    
    return (
        <>
        <div className="container mx-auto px-4 py-8">
            {/* Container para o Cabeçalho */}
            <motion.div
                className="text-center mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
            >
                <h2 className="text-4xl font-bold text-gray-900 mb-2">Victorian Institute of Sport Assessment - VISA-A</h2>
                <p className="text-lg text-gray-600">O Questionário VISA-A avalia a gravidade de lesões no tornozelo e como elas afetam o desempenho e a qualidade de vida do paciente.</p>
            </motion.div>

            {/* Container para o Nome do Paciente */}
            <motion.div
                className="mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
            >
                <label className="block text-lg font-semibold text-gray-700" htmlFor="nomePaciente">
                    Nome do Paciente
                </label>
                <input
                    type="text"
                    id="nomePaciente"
                    name="nomePaciente"
                    value={formData.nomePaciente}
                    onChange={handleChange}
                    className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </motion.div>

            {/* Linha de Separação */}
            <div className="mb-8">
                <hr className="border-t-2 border-gray-300" />
            </div>

            {/* Container para as Perguntas */}
            <motion.form
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                onSubmit={handleSubmit}
            >
                {/* Pergunta 1 */}
                <motion.div className="mb-6">
                    <p className="text-xl font-semibold text-gray-800">
                        1. Quando você se levanta, pela manhã, por quantos minutos sente rígida a região do Tendão de Aquiles?
                    </p>
                    <div className="mt-4 flex flex-col items-center w-full">
                        <label className="w-full flex flex-col items-start">
                            {/* Exibição do valor em tempo real no canto esquerdo */}

                            <input
                                type="range"
                                name="pergunta1"
                                min="0"
                                max="10"
                                step="1"
                                value={formData.pergunta1}
                                onChange={handleChange}
                                className="w-full h-6 bg-gray-300 rounded-full appearance-none cursor-pointer hover:bg-gray-400 focus:outline-none focus:ring-2 transition-all duration-300"
                            />
                            <span className="text-lg font-semibold text-gray-800 mb-2">{formData.pergunta1}0 minutos</span>
                        </label>
                    </div>
                </motion.div>


                {/* Pergunta 2 */}
                <motion.div className="mb-6">
                    <p className="text-xl font-semibold text-gray-800">
                        2. Quando você está preparado/aquecido para o dia, sente dor quando alonga o Tendão de Aquiles ao máximo na borda de um degrau, mantendo os joelhos bem esticados?
                    </p>
                    <div className="mt-4 flex flex-col items-center w-full">
                        <label className="w-full flex flex-col items-start">
                            {/* Exibição do valor em tempo real no canto esquerdo */}

                            <input
                                type="range"
                                name="pergunta2"
                                min="0"
                                max="10"
                                step="1"
                                value={formData.pergunta2}
                                onChange={handleChange}
                                className="w-full h-6 bg-gray-300 rounded-full appearance-none cursor-pointer hover:bg-gray-400 focus:outline-none focus:ring-2 transition-all duration-300"
                            />
                            {/* Etiquetas de "Dor forte ou severa" e "Sem dor" */}
                            <div className="relative w-full flex justify-between text-gray-700 font-medium mt-2">
                                <span className="text-left text-red-500">Dor forte ou severa</span>
                                <span className="text-right text-green-500">Sem dor</span>
                            </div>
                            <span className="text-lg font-semibold text-gray-800 mb-2">{formData.pergunta2}</span>
                        </label>
                    </div>
                </motion.div>


                {/* Pergunta 3 */}
                <motion.div className="mb-6">
                    <p className="text-xl font-semibold text-gray-800">
                        3. Após andar em uma superfície plana por 30 minutos, você sente dor no Tendão de Aquiles nas próximas duas horas? (Se a dor impedir você de andar em uma superfícia plana por 30 minutos, marque 0 nessa questão).
                    </p>
                    <div className="mt-4 flex flex-col items-center w-full">
                        <label className="w-full flex flex-col items-start">
                            <input
                                type="range"
                                name="pergunta3"
                                min="0"
                                max="10"
                                step="1"
                                value={formData.pergunta3}
                                onChange={handleChange}
                                className="w-full h-6 bg-gray-300 rounded-full appearance-none cursor-pointer hover:bg-gray-400 focus:outline-none focus:ring-2 transition-all duration-300"
                            />
                            <div className="relative w-full flex justify-between text-gray-700 font-medium mt-2">
                                <span className="text-left text-red-500">Dor forte ou severa</span>
                                <span className="text-right text-green-500">Sem dor</span>
                            </div>
                            <span className="text-lg font-semibold text-gray-800 mb-2">{formData.pergunta3}</span>
                        </label>
                    </div>
                </motion.div>

                {/* Pergunta 4 */}
                <motion.div className="mb-6">
                    <p className="text-xl font-semibold text-gray-800">
                        4. Você sente dor descendo escadas em um ritmo normal?
                    </p>
                    <div className="mt-4 flex flex-col items-center w-full">
                        <label className="w-full flex flex-col items-start">
                            <input
                                type="range"
                                name="pergunta4"
                                min="0"
                                max="10"
                                step="1"
                                value={formData.pergunta4}
                                onChange={handleChange}
                                className="w-full h-6 bg-gray-300 rounded-full appearance-none cursor-pointer hover:bg-gray-400 focus:outline-none focus:ring-2 transition-all duration-300"
                            />
                            <div className="relative w-full flex justify-between text-gray-700 font-medium mt-2">
                                <span className="text-left text-red-500">Dor forte ou severa</span>
                                <span className="text-right text-green-500">Sem dor</span>
                            </div>
                            <span className="text-lg font-semibold text-gray-800 mb-2">{formData.pergunta4}</span>
                        </label>
                    </div>
                </motion.div>

                {/* Pergunta 5 */}
                <motion.div className="mb-6">
                    <p className="text-xl font-semibold text-gray-800">
                        5. Você sente dor durante ou imediatamente após ficar nas pontas do pés, com apenas uma perna, por 10 vezes?
                    </p>
                    <div className="mt-4 flex flex-col items-center w-full">
                        <label className="w-full flex flex-col items-start">
                            <input
                                type="range"
                                name="pergunta5"
                                min="0"
                                max="10"
                                step="1"
                                value={formData.pergunta5}
                                onChange={handleChange}
                                className="w-full h-6 bg-gray-300 rounded-full appearance-none cursor-pointer hover:bg-gray-400 focus:outline-none focus:ring-2 transition-all duration-300"
                            />
                            <div className="relative w-full flex justify-between text-gray-700 font-medium mt-2">
                                <span className="text-left text-red-500">Dor forte ou severa</span>
                                <span className="text-right text-green-500">Sem dor</span>
                            </div>
                            <span className="text-lg font-semibold text-gray-800 mb-2">{formData.pergunta5}</span>
                        </label>
                    </div>
                </motion.div>

                {/* Pergunta 6 */}
                <motion.div className="mb-6">
                    <p className="text-xl font-semibold text-gray-800">
                        6. Quantos pulos, com uma perna só, você consegue fazer sem sentir dor?
                    </p>
                    <div className="mt-4 flex flex-col items-center w-full">
                        <label className="w-full flex flex-col items-start">
                            <input
                                type="range"
                                name="pergunta6"
                                min="0"
                                max="10"
                                step="1"
                                value={formData.pergunta6}
                                onChange={handleChange}
                                className="w-full h-6 bg-gray-300 rounded-full appearance-none cursor-pointer hover:bg-gray-400 focus:outline-none focus:ring-2 transition-all duration-300"
                            />
                            <span className="text-lg font-semibold text-gray-800 mb-2">{formData.pergunta6} pulos</span>
                        </label>
                    </div>
                </motion.div>

                {/* Pergunta 7 */}
                <motion.div className="mb-6">
                    <p className="text-xl font-semibold text-gray-800 mb-4">
                        7. Você está praticando algum esporte ou outra atividade física atualmente?
                    </p>
                    <div className="flex flex-col items-start w-full">
                        <label className="flex items-center space-x-3 mb-4">
                            <input
                                type="radio"
                                name="pergunta7"
                                id="q7i1"
                                value="0"
                                data-value="Não"
                                checked={formData.pergunta7 === "0"}
                                onChange={handleChange}
                                required
                                className="w-6 h-6 accent-red-500 transition-all duration-300"
                            />
                            <span className="text-lg text-gray-800">Não</span>
                        </label>

                        <label className="flex items-center space-x-3 mb-4">
                            <input
                                type="radio"
                                name="pergunta7"
                                data-value="Treinamento e/ou competição com restrições"
                                id="q7i2"
                                value="4"
                                checked={formData.pergunta7 === "4"}
                                onChange={handleChange}
                                required
                                className="w-6 h-6 accent-yellow-500 transition-all duration-300"
                            />
                            <span className="text-lg text-gray-800">Treinamento e/ou competição com restrições</span>
                        </label>

                        <label className="flex items-center space-x-3 mb-4">
                            <input
                                type="radio"
                                name="pergunta7"
                                data-value="Treinamento sem restrição, mas não competindo no mesmo nível anterior ao início dos sintomas"
                                id="q7i3"
                                value="7"
                                checked={formData.pergunta7 === "7"}
                                onChange={handleChange}
                                required
                                className="w-6 h-6 accent-green-500 transition-all duration-300"
                            />
                            <span className="text-lg text-gray-800">Treinamento sem restrição, mas não competindo no mesmo nível anterior ao início dos sintomas</span>
                        </label>

                        <label className="flex items-center space-x-3">
                            <input
                                type="radio"
                                name="pergunta7"
                                data-value="Competindo no mesmo nível ou nível mais alto do que quando os sintomas começaram"
                                id="q7i4"
                                value="10"
                                checked={formData.pergunta7 === "10"}
                                onChange={handleChange}
                                required
                                className="w-6 h-6 accent-blue-500 transition-all duration-300"
                            />
                            <span className="text-lg text-gray-800">Competindo no mesmo nível ou nível mais alto do que quando os sintomas começaram</span>
                        </label>
                    </div>
                </motion.div>

                <motion.div className="mb-6">
                    <p className="text-xl font-semibold text-gray-800 mb-4">
                        8. Por favor, complete somente uma das questões, A, B ou C nesta questão
                    </p>
                    <div className="flex flex-col items-start w-full mb-4">
                        <ul>
                            <li className="text-lg text-gray-800 mb-2">
                                Se você não sente dor ao praticar esportes, por favor, responda somente a questão <b>8A</b>
                            </li>
                            <li className="text-lg text-gray-800 mb-2">
                                Se você sente dor ao praticar algum esporte, mas esta dor não o impede de praticar a atividade esportiva, por favor, responda somente a questão <b>8B</b>
                            </li>
                            <li className="text-lg text-gray-800 mb-2">
                                Se você sente dor que o impede de praticar atividades esportivas, por favor, responda somente a questão <b>8C</b>
                            </li>
                        </ul>
                    </div>

                    {/* Seção 8A */}
                    <div className="mb-6">
                        <p className="text-lg font-semibold text-gray-800 mb-4">
                            8A. Se você não sente dor ao praticar esportes, por quanto tempo consegue treinar/praticar?
                        </p>
                        <div className="flex flex-col items-start w-full mb-4">
                            <label className="flex items-center space-x-3 mb-4">
                                <input
                                    type="radio"
                                    name="pergunta8A"
                                    value="0"
                                    data-value="Não consigo treinar/praticar"
                                    checked={formData.pergunta8A === "0"}
                                    onChange={handleChange}
                                    className="w-6 h-6 accent-red-500 transition-all duration-300"
                                />
                                <span className="text-lg text-gray-800">Não consigo treinar/praticar</span>
                            </label>

                            <label className="flex items-center space-x-3 mb-4">
                                <input
                                    type="radio"
                                    name="pergunta8A"
                                    value="07"
                                    data-value="1-10 minutos"
                                    checked={formData.pergunta8A === "07"}
                                    onChange={handleChange}
                                    className="w-6 h-6 accent-yellow-500 transition-all duration-300"
                                />
                                <span className="text-lg text-gray-800">1-10 minutos</span>
                            </label>

                            <label className="flex items-center space-x-3 mb-4">
                                <input
                                    type="radio"
                                    name="pergunta8A"
                                    data-value="11-20 minutos"
                                    value="14"
                                    checked={formData.pergunta8A === "14"}
                                    onChange={handleChange}
                                    className="w-6 h-6 accent-yellow-500 transition-all duration-300"
                                />
                                <span className="text-lg text-gray-800">11-20 minutos</span>
                            </label>

                            <label className="flex items-center space-x-3 mb-4">
                                <input
                                    type="radio"
                                    name="pergunta8A"
                                    data-value="21-30 minutos"
                                    value="21"
                                    checked={formData.pergunta8A === "21"}
                                    onChange={handleChange}
                                    className="w-6 h-6 accent-yellow-500 transition-all duration-300"
                                />
                                <span className="text-lg text-gray-800">21-30 minutos</span>
                            </label>

                            <label className="flex items-center space-x-3">
                                <input
                                    type="radio"
                                    name="pergunta8A"
                                    data-value="> 30 minutos"
                                    value="30"
                                    checked={formData.pergunta8A === "30"}
                                    onChange={handleChange}
                                    className="w-6 h-6 accent-yellow-500 transition-all duration-300"
                                />
                                <span className="text-lg text-gray-800">{`> 30 minutos`}</span>
                            </label>
                        </div>
                    </div>

                    {/* Seção 8B */}
                    <div className="mb-6">
                        <p className="text-lg font-semibold text-gray-800 mb-4">
                            8B. Se você sente dor ao praticar algum esporte, mas esta dor não o impede de praticar a atividade esportiva, por quanto tempo você consegue treinar/praticar?
                        </p>
                        <div className="flex flex-col items-start w-full mb-4">
                            <label className="flex items-center space-x-3 mb-4">
                                <input
                                    type="radio"
                                    name="pergunta8B"
                                    data-value="Não consigo treinar/praticar"
                                    value="0"
                                    checked={formData.pergunta8B === "0"}
                                    onChange={handleChange}
                                    className="w-6 h-6 accent-red-500 transition-all duration-300"
                                />
                                <span className="text-lg text-gray-800">Não consigo treinar/praticar</span>
                            </label>

                            <label className="flex items-center space-x-3 mb-4">
                                <input
                                    type="radio"
                                    name="pergunta8B"
                                    data-value="1-10 minutos"
                                    value="04"
                                    checked={formData.pergunta8B === "04"}
                                    onChange={handleChange}
                                    className="w-6 h-6 accent-yellow-500 transition-all duration-300"
                                />
                                <span className="text-lg text-gray-800">1-10 minutos</span>
                            </label>

                            <label className="flex items-center space-x-3 mb-4">
                                <input
                                    type="radio"
                                    name="pergunta8B"
                                    data-value="11-20 minutos"
                                    value="10"
                                    checked={formData.pergunta8B === "10"}
                                    onChange={handleChange}
                                    className="w-6 h-6 accent-yellow-500 transition-all duration-300"
                                />
                                <span className="text-lg text-gray-800">11-20 minutos</span>
                            </label>

                            <label className="flex items-center space-x-3 mb-4">
                                <input
                                    type="radio"
                                    name="pergunta8B"
                                    data-value="21-30 minutos"
                                    value="21"
                                    checked={formData.pergunta8B === "21"}
                                    onChange={handleChange}
                                    className="w-6 h-6 accent-yellow-500 transition-all duration-300"
                                />
                                <span className="text-lg text-gray-800">21-30 minutos</span>
                            </label>

                            <label className="flex items-center space-x-3">
                                <input
                                    type="radio"
                                    name="pergunta8B"
                                    data-value="> 30 minutos"
                                    value="30"
                                    checked={formData.pergunta8B === "30"}
                                    onChange={handleChange}
                                    className="w-6 h-6 accent-yellow-500 transition-all duration-300"
                                />
                                <span className="text-lg text-gray-800">{`> 30 minutos`}</span>
                            </label>
                        </div>
                    </div>

                    {/* Seção 8C */}
                    <div className="mb-6">
                        <p className="text-lg font-semibold text-gray-800 mb-4">
                            8C. Se você sente dor que o impede de praticar atividades esportivas, por quanto tempo você consegue treinar/praticar?
                        </p>
                        <div className="flex flex-col items-start w-full mb-4">
                            <label className="flex items-center space-x-3 mb-4">
                                <input
                                    type="radio"
                                    name="pergunta8C"
                                    data-value="Não consigo treinar/praticar"
                                    value="0"
                                    checked={formData.pergunta8C === "0"}
                                    onChange={handleChange}
                                    className="w-6 h-6 accent-red-500 transition-all duration-300"
                                />
                                <span className="text-lg text-gray-800">Não consigo treinar/praticar</span>
                            </label>

                            <label className="flex items-center space-x-3 mb-4">
                                <input
                                    type="radio"
                                    name="pergunta8C"
                                    data-value="1-10 minutos"
                                    value="02"
                                    checked={formData.pergunta8C === "02"}
                                    onChange={handleChange}
                                    className="w-6 h-6 accent-yellow-500 transition-all duration-300"
                                />
                                <span className="text-lg text-gray-800">1-10 minutos</span>
                            </label>

                            <label className="flex items-center space-x-3 mb-4">
                                <input
                                    type="radio"
                                    name="pergunta8C"
                                    data-value="11-20 minutos"
                                    value="05"
                                    checked={formData.pergunta8C === "05"}
                                    onChange={handleChange}
                                    className="w-6 h-6 accent-yellow-500 transition-all duration-300"
                                />
                                <span className="text-lg text-gray-800">11-20 minutos</span>
                            </label>

                            <label className="flex items-center space-x-3 mb-4">
                                <input
                                    type="radio"
                                    name="pergunta8C"
                                    data-value="21-30 minutos"
                                    value="07"
                                    checked={formData.pergunta8C === "07"}
                                    onChange={handleChange}
                                    className="w-6 h-6 accent-yellow-500 transition-all duration-300"
                                />
                                <span className="text-lg text-gray-800">21-30 minutos</span>
                            </label>

                            <label className="flex items-center space-x-3">
                                <input
                                    type="radio"
                                    name="pergunta8C"
                                    data-value="> 30 minutos"
                                    value="10"
                                    checked={formData.pergunta8C === "10"}
                                    onChange={handleChange}
                                    className="w-6 h-6 accent-yellow-500 transition-all duration-300"
                                />
                                <span className="text-lg text-gray-800">{`> 30 minutos`}</span>
                            </label>
                        </div>
                    </div>
                </motion.div>

                {/* Botão de envio */}
                <motion.button
        type="submit"  // Usando o tipo "submit" para enviar o formulário
        className="mt-6 px-8 py-3 bg-blue-500 text-white text-lg rounded-lg hover:bg-blue-600 transition duration-300"
        whileTap={{ scale: 0.98 }}
      >
        Enviar Respostas
      </motion.button>
            </motion.form>

            {modalOpen && (
        <Modal
          onClose={() => setModalOpen(false)}
          nomePaciente={formularioData.nome}
          questionario={formularioData.questionario}
          descricao={formularioData.descricao}
          perguntas={formularioData.perguntas}
          respostas={formularioData.respostas}
          pontuacao={formularioData.pontuacao}
          parteDoCorpo={formularioData.parteDoCorpo}
        />
      )}
        </div>

        </>
        
    );
}

export default VisaAQuestionario;

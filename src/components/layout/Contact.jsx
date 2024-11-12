import React from 'react';
import { motion } from 'framer-motion';

export default function Contact() {
    return (
        <motion.div
            className="p-5 text-gray-800"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            <motion.h1
                className="text-3xl"
            >
                Entre em Contato
            </motion.h1>

            <motion.p
                className="mt-4 text-lg leading-relaxed"
            >
                Olá! Sou <strong>Mardeson Herculano</strong>, programador fullstack e analista de dados. 
                Estou sempre em busca de melhorar e evoluir as soluções que desenvolvo. Caso você encontre algum bug 
                ou tenha sugestões de novas funcionalidades para o <strong>PQ Online</strong>, estou totalmente aberto a ouvir suas ideias.
            </motion.p>

            <motion.p
                className="mt-4 text-lg leading-relaxed"
            >
                Se você deseja relatar algum problema, sugerir uma melhoria ou até mesmo conversar sobre o app, 
                fique à vontade para entrar em contato. Você pode me encontrar através dos seguintes canais:
            </motion.p>

            <motion.div
                className="mt-6"
            >
                <motion.a
                    href="mailto:mardeson@gmail.com"
                    className="block text-blue-600 hover:underline"
                >
                    <strong>Email</strong>: seu-email@dominio.com
                </motion.a>

                <motion.a
                    href="https://www.linkedin.com/in/mardeson/"
                    className="block text-blue-600 hover:underline mt-2"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <strong>LinkedIn</strong>: linkedin.com/in/mardesonherculano
                </motion.a>

                <motion.a
                    href="https://github.com/mardeson"
                    className="block text-blue-600 hover:underline mt-2"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <strong>GitHub</strong>: github.com/mardeson
                </motion.a>

                <motion.a
                    href="https://wa.me/5585998114204" // Altere o número pelo seu WhatsApp
                    className="block text-blue-600 hover:underline mt-2"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <strong>WhatsApp</strong>: Entre em contato diretamente pelo WhatsApp
                </motion.a>
            </motion.div>

            <motion.p
                className="mt-6 text-lg leading-relaxed"
            >
                Fico à disposição para melhorar o app e torná-lo cada vez mais útil para você. 
                Agradeço pelo seu feedback!
            </motion.p>
        </motion.div>
    );
}

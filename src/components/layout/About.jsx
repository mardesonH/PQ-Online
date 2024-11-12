import React from 'react';
import { motion } from 'framer-motion';

export default function About() {
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
                Sobre o PQ Online
            </motion.h1>

            <motion.p
                className="mt-4 text-lg leading-relaxed"
            >
                O <strong>PQ Online</strong> é um aplicativo web para fisioterapeutas que
                buscam uma maneira prática de aplicar e gerenciar questionários de avaliação.
            </motion.p>

            <motion.p
                className="mt-4 text-lg leading-relaxed"
            >
                Este projeto foi desenvolvido por <strong>Mardeson Herculano</strong>,
                programador fullstack e analista de dados com experiência na criação de
                soluções como dashboards e planilhas de avaliação para a área de monitoramento de esporte e
                saúde de diversas clínicas e clubes de futebol ao redor do mundo.
            </motion.p>

            <motion.p
                className="mt-4 text-lg leading-relaxed italic"
            >
                O <strong>PQ Online</strong> é totalmente gratuito, e seu desenvolvimento é movido pela
                paixão de proporcionar uma ferramenta útil para os fisioterapeutas. Para manter o app em
                constante evolução, você pode apoiar o projeto com uma contribuição via Pix. Sua ajuda
                financeira é fundamental para que possamos continuar a melhorar e expandir o serviço.
            </motion.p>

            <motion.p
                className="text-center mt-6"
            >
                <strong>Pix para doações:</strong> <span className="text-blue-600">seu-pix@dominio.com</span>
            </motion.p>

            <motion.p
                className="text-center mt-6"
            >
                Ajude também divulgando o app, reportando bugs ou sugerindo novos questionários para inclusão!
            </motion.p>
        </motion.div>
    );
}

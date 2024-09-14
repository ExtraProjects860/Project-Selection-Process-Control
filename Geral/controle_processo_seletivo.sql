-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Tempo de geração: 14/09/2024 às 21:34
-- Versão do servidor: 8.3.0
-- Versão do PHP: 8.2.18

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `controle_processo_seletivo`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `cargo`
--

DROP TABLE IF EXISTS `cargo`;
CREATE TABLE IF NOT EXISTS `cargo` (
  `id_cargo` int NOT NULL AUTO_INCREMENT,
  `nome_cargo` varchar(50) NOT NULL,
  PRIMARY KEY (`id_cargo`)
) ENGINE=MyISAM AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Despejando dados para a tabela `cargo`
--

INSERT INTO `cargo` (`id_cargo`, `nome_cargo`) VALUES
(1, 'AGENTE DE REGISTRO'),
(2, 'ASSISTENTE DE VENDAS'),
(3, 'ASSISTENTE FINANCEIRO'),
(4, 'AUXILIAR ADMINISTRATIVO'),
(5, 'ESTÁGIO ADM'),
(6, 'ESTÁGIO COMERCIAL'),
(7, 'ESTÁGIO DESIGNER GRÁFICO'),
(8, 'ESTÁGIO FINANCEIRO'),
(9, 'ESTÁGIO LICITAÇÃO'),
(10, 'ESTÁGIO RH'),
(11, 'ESTÁGIO TI'),
(12, 'FINANCEIRO'),
(13, 'MARKETING'),
(14, 'VENDEDOR');

-- --------------------------------------------------------

--
-- Estrutura para tabela `dados_usuario`
--

DROP TABLE IF EXISTS `dados_usuario`;
CREATE TABLE IF NOT EXISTS `dados_usuario` (
  `id_dados_usuario` int NOT NULL,
  `nome_usuario` varchar(50) NOT NULL,
  `curriculo` varchar(50) DEFAULT NULL,
  `cpf` varchar(15) NOT NULL,
  `telefone` varchar(15) NOT NULL,
  `endereco` varchar(125) NOT NULL,
  `data_nascimento` date NOT NULL,
  `sexo` char(1) NOT NULL,
  PRIMARY KEY (`id_dados_usuario`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Despejando dados para a tabela `dados_usuario`
--

INSERT INTO `dados_usuario` (`id_dados_usuario`, `nome_usuario`, `curriculo`, `cpf`, `telefone`, `endereco`, `data_nascimento`, `sexo`) VALUES
(1, 'Seu nome', 'Seu nome_1_curriculo.pdf', '12345678902', '1234567891', 'Rua Exemplo, 123', '1992-02-02', 'M');

-- --------------------------------------------------------

--
-- Estrutura para tabela `etapa`
--

DROP TABLE IF EXISTS `etapa`;
CREATE TABLE IF NOT EXISTS `etapa` (
  `id_etapa` int NOT NULL AUTO_INCREMENT,
  `nome_etapa` varchar(25) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`id_etapa`)
) ENGINE=MyISAM AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Despejando dados para a tabela `etapa`
--

INSERT INTO `etapa` (`id_etapa`, `nome_etapa`) VALUES
(1, 'AGENDAR PROXIMA ETAPA'),
(2, 'AVALIAÇÃO DE PERFIL'),
(3, 'CONTRATADO'),
(4, 'ENTREVISTA COM O GESTOR'),
(5, 'ENTREVISTA COM O RH'),
(6, 'FIT CULTURAL'),
(7, 'FORMS INICIAL'),
(8, 'PRATICA NO SETOR');

-- --------------------------------------------------------

--
-- Estrutura para tabela `inscricao`
--

DROP TABLE IF EXISTS `inscricao`;
CREATE TABLE IF NOT EXISTS `inscricao` (
  `id_usuario` int NOT NULL,
  `id_vaga` int NOT NULL,
  `data_inscricao` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY `id_usuario` (`id_usuario`),
  KEY `id_vaga` (`id_vaga`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Despejando dados para a tabela `inscricao`
--

INSERT INTO `inscricao` (`id_usuario`, `id_vaga`, `data_inscricao`) VALUES
(1, 1, '2024-09-14 20:48:33');

-- --------------------------------------------------------

--
-- Estrutura para tabela `setor`
--

DROP TABLE IF EXISTS `setor`;
CREATE TABLE IF NOT EXISTS `setor` (
  `id_setor` int NOT NULL AUTO_INCREMENT,
  `nome_setor` varchar(50) NOT NULL,
  PRIMARY KEY (`id_setor`)
) ENGINE=MyISAM AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Despejando dados para a tabela `setor`
--

INSERT INTO `setor` (`id_setor`, `nome_setor`) VALUES
(1, 'ATENDIMENTO'),
(2, 'COMERCIAL'),
(3, 'FINANCEIRO'),
(4, 'MARKETING'),
(5, 'RECEPÇÃO'),
(6, 'RETENÇÃO-CS'),
(7, 'RH-DP'),
(8, 'TI');

-- --------------------------------------------------------

--
-- Estrutura para tabela `status_processo_seletivo`
--

DROP TABLE IF EXISTS `status_processo_seletivo`;
CREATE TABLE IF NOT EXISTS `status_processo_seletivo` (
  `id_status_processo_seletivo` int NOT NULL AUTO_INCREMENT,
  `id_vaga` int NOT NULL,
  `id_etapa` int NOT NULL,
  `data_entrevista` timestamp NULL DEFAULT NULL,
  `status_processo` enum('ATIVO','BANCO DE TALENTOS','CONCLUÍDO','DESISTÊNCIA','REPROVAÇÃO') DEFAULT NULL,
  `perfil` varchar(25) DEFAULT NULL,
  `observacao` text,
  `forms_respondido` tinyint(1) DEFAULT NULL,
  `avaliacao_forms` enum('IDEAL','MEDIANO','RUIM') DEFAULT NULL,
  PRIMARY KEY (`id_status_processo_seletivo`),
  KEY `id_vaga` (`id_vaga`),
  KEY `id_etapa` (`id_etapa`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `token_blacklist`
--

DROP TABLE IF EXISTS `token_blacklist`;
CREATE TABLE IF NOT EXISTS `token_blacklist` (
  `id_token_blacklist` int NOT NULL AUTO_INCREMENT,
  `jti` varchar(191) NOT NULL,
  `revogado` tinyint(1) NOT NULL DEFAULT '1',
  `data_criacao` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_token_blacklist`),
  UNIQUE KEY `jti` (`jti`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `usuario`
--

DROP TABLE IF EXISTS `usuario`;
CREATE TABLE IF NOT EXISTS `usuario` (
  `id_usuario` int NOT NULL AUTO_INCREMENT,
  `email` varchar(50) NOT NULL,
  `senha` varchar(255) NOT NULL,
  `admin` tinyint(1) NOT NULL,
  `tokenForgotPassword` varchar(255) DEFAULT NULL,
  `tokenTimeValid` timestamp NULL DEFAULT NULL,
  `data_criacao` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `email` (`email`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Despejando dados para a tabela `usuario`
--

INSERT INTO `usuario` (`id_usuario`, `email`, `senha`, `admin`, `tokenForgotPassword`, `tokenTimeValid`, `data_criacao`) VALUES
(1, 'projectsgithub860@gmail.com', '$2b$12$UsFsCJhyWhxLNQ/oDZdSN.izdNvBWqsog3lMLyukrKiautdEo2T0S', 1, NULL, NULL, '2024-09-14 16:13:28');

-- --------------------------------------------------------

--
-- Estrutura para tabela `vaga`
--

DROP TABLE IF EXISTS `vaga`;
CREATE TABLE IF NOT EXISTS `vaga` (
  `id_vaga` int NOT NULL AUTO_INCREMENT,
  `id_setor` int NOT NULL,
  `id_cargo` int NOT NULL,
  `nome_vaga` varchar(50) NOT NULL,
  `status` enum('ABERTA','FECHADA') NOT NULL,
  `descricao_vaga` text NOT NULL,
  `salario` float NOT NULL,
  `quantidade_vagas` int NOT NULL,
  `data_abertura` date NOT NULL DEFAULT (curdate()),
  `data_encerramento` date NOT NULL,
  PRIMARY KEY (`id_vaga`),
  KEY `id_setor` (`id_setor`),
  KEY `id_cargo` (`id_cargo`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Despejando dados para a tabela `vaga`
--

INSERT INTO `vaga` (`id_vaga`, `id_setor`, `id_cargo`, `nome_vaga`, `status`, `descricao_vaga`, `salario`, `quantidade_vagas`, `data_abertura`, `data_encerramento`) VALUES
(1, 8, 11, 'Vaga de estágio para TI', 'FECHADA', 'É uma vaga dedica para o setor de TI, buscamos profissionais capacitados', 1770.77, 5, '2024-09-14', '2024-09-20');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

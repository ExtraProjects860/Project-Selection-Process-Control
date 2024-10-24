import { useState } from 'react';

export const UseTableLogic = ({ data, setData, itemsPerPage }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  // Retorna os dados da página atual
  const currentData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  };

  // Função para avançar ou voltar páginas
  const handlePageChange = (direction) => {
    if (direction === 1 && currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    } else if (direction === -1 && currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  // Estilo do botão
  const getButtonStyle = (type) => {
    if (type === 'prev') {
      return {
        marginRight: '10px',
        border: 'none',
        backgroundColor: currentPage === 1 ? '#ccc' : '#006C98',
        color: 'white',
        padding: '5px 10px',
        borderRadius: '5px',
        cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
      };
    } else if (type === 'next') {
      return {
        border: 'none',
        backgroundColor: currentPage >= totalPages ? '#ccc' : '#006C98',
        color: 'white',
        padding: '5px 10px',
        borderRadius: '5px',
        cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer',
      };
    }
  };

  return {
    currentData,
    currentPage,
    totalPages,
    handlePageChange,
    getButtonStyle,
  };
};

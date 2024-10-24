import { useState } from 'react';

export const usePagination = (totalPages) => {
  const [currentPage, setCurrentPage] = useState(1);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
        setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
        setCurrentPage(currentPage - 1);
    }
  };

  return {
    currentPage,
    handleNextPage,
    handlePrevPage
  }
};


export const useEditCandidateOrUser = () => {
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const handleEditClick = (candidateOrUser) => {
        setSelectedCandidate(candidateOrUser);
        setShowModal(true);
    };

    return {
        selectedCandidate,
        showModal,
        handleEditClick,
        setShowModal
    };
};
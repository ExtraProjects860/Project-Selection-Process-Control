
import './Pagination.css';

function Pagination({ totalPages, currentPage, onPageChange }) {

  const handlePageChange = (newPage) => {
    onPageChange(newPage);
  };

  return (
    <div className="pagination-container">
      <button
        className="page-button"
        disabled={currentPage === 1}
        onClick={() => handlePageChange(currentPage - 1)}
      >
        &lt;
      </button>
      {[...Array(totalPages)].map((_, index) => {
        const page = index + 1;
        return (
          <button
            key={page}
            className={`page-button ${currentPage === page ? 'active' : ''}`}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </button>
        );
      })}
      <button
        className="page-button"
        disabled={currentPage === totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
      >
        &gt;
      </button>
    </div>
  );
}

export default Pagination;
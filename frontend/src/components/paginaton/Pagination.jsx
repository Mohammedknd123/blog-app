import "./Pagination.css";

export default function Pagination({ pages, currentPage, setCurrentPage }) {
  const generatedPages = [];

  for (let i = 1; i <= pages; i++) {
    generatedPages.push(i);
  }

  return (
    <div className="pagination">
      <button
        className="page previous"
        onClick={() => setCurrentPage((current) => current - 1)}
        disabled={currentPage === 1}
      >
        <i className="bi bi-chevron-left"></i>
        Previous
      </button>

      {generatedPages.map((page) => (
        <div
          className={currentPage === page ? "page active" : "page"}
          onClick={() => setCurrentPage(page)}
          key={page}
        >
          {page}
        </div>
      ))}

      <button
        className="page next"
        onClick={() => setCurrentPage((current) => current + 1)}
        disabled={currentPage === pages}
      >
        Next
        <i className="bi bi-chevron-right"></i>
      </button>
    </div>
  );
}

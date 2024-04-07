
const Pagination = (({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = [];
  const maxPagesToShow = 10;
  
  // Adicionando as páginas ao array
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }
  
  // Lógica para determinar quais páginas mostrar
  let pagesToShow;
  if (totalPages <= maxPagesToShow) {
    pagesToShow = pageNumbers;
  } else {
    const halfMaxPages = Math.floor(maxPagesToShow / 2);
    const startPage = Math.max(1, currentPage - halfMaxPages);
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    pagesToShow = [...Array(endPage - startPage + 1).keys()].map(i => startPage + i);
    if (startPage > 1) {
      pagesToShow = [1, '...'].concat(pagesToShow);
    }
    if (endPage < totalPages) {
      pagesToShow = pagesToShow.concat(['...', totalPages]);
    }
  }

  return (
    <nav>
      <ul className="pagination justify-content-center">
        <li className={currentPage === 1 ? 'page-item disabled' : 'page-item'}>
          <button className="page-link" onClick={() => onPageChange(currentPage - 1)}>
            Anterior
          </button>
        </li>
        {pagesToShow.map(number => (
          <li key={number} className={number === currentPage ? 'page-item active' : 'page-item'}>
            <button className="page-link" onClick={() => onPageChange(number)}>
              {number}
            </button>
          </li>
        ))}
        <li className={currentPage === totalPages ? 'page-item disabled' : 'page-item'}>
          <button className="page-link" onClick={() => onPageChange(currentPage + 1)}>
            Próxima
          </button>
        </li>
      </ul>
    </nav>
  );})

export default Pagination

import {
    MdNavigateBefore,
    MdNavigateNext,
  } from "react-icons/md";

function Pagination({ totalPages, currentPage, onPageChange, perPageOptions, onPerPageChange, firstIndex, lastIndex, totalItems }) {
    return (
      <div className="flex justify-between items-center py-10">
        <div className="flex items-center space-x-4">
          <label className="text-lg text-foreground">Show</label>
          <select
            value={perPageOptions.value}
            onChange={(e) => onPerPageChange(Number(e.target.value))}
            className="px-4 py-2 rounded-lg border"
          >
            {perPageOptions.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <label className="text-lg text-foreground">Entries</label>
        </div>
  
        <div className="flex items-center space-x-4">
          <span className="text-lg text-foreground">
            Showing {firstIndex} to {lastIndex} of {totalItems} results
          </span>
  
          <div className="flex items-center space-x-2">
            <button
              className={`w-10 h-10 rounded-full flex items-center justify-center ${currentPage === 1 ? "bg-white text-foreground" : "bg-primary text-white"}`}
              disabled={currentPage === 1}
              onClick={() => onPageChange(currentPage - 1)}
            >
              <MdNavigateBefore className="text-xl" />
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => onPageChange(i + 1)}
                className={`w-8 h-8 rounded-full ${currentPage === i + 1 ? "bg-primary text-white" : "bg-white border text-foreground"}`}
              >
                {i + 1}
              </button>
            ))}
  
            <button
              className={`w-10 h-10 rounded-full flex items-center justify-center ${currentPage === totalPages ? "bg-white text-foreground" : "bg-primary text-white"}`}
              disabled={currentPage === totalPages}
              onClick={() => onPageChange(currentPage + 1)}
            >
              <MdNavigateNext className="text-xl" />
            </button>
          </div>
        </div>
      </div>
    );
  }
  
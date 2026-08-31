import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
export const Pagination = ({ currentPage, totalPages, totalItems, pageSize, onPageChange, }) => {
    if (totalItems === 0)
        return null;
    const startItem = (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, totalItems);
    return (<div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-3.5 border-t border-[#E7E5E0] bg-[#F7F6F2]/40 text-xs text-[#6B6B6B]">
      <div>
        Showing <span className="font-medium text-[#181818]">{startItem}</span> to{' '}
        <span className="font-medium text-[#181818]">{endItem}</span> of{' '}
        <span className="font-medium text-[#181818]">{totalItems}</span> results
      </div>

      <div className="flex items-center gap-1.5">
        <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage <= 1} className="inline-flex items-center justify-center p-1.5 rounded-lg border border-[#E7E5E0] bg-white text-[#181818] hover:bg-[#F7F6F2] disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
          <ChevronLeft className="w-4 h-4"/>
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((page) => page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1)
            .map((page, index, array) => {
            const showEllipsis = index > 0 && page - array[index - 1] > 1;
            return (<React.Fragment key={page}>
                {showEllipsis && <span className="px-1 text-[#9A9A9A]">...</span>}
                <button onClick={() => onPageChange(page)} className={`min-w-[30px] h-[30px] rounded-lg text-xs font-semibold transition-colors ${currentPage === page
                    ? 'bg-[#181818] text-white'
                    : 'bg-white border border-[#E7E5E0] text-[#181818] hover:bg-[#F7F6F2]'}`}>
                  {page}
                </button>
              </React.Fragment>);
        })}

        <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage >= totalPages} className="inline-flex items-center justify-center p-1.5 rounded-lg border border-[#E7E5E0] bg-white text-[#181818] hover:bg-[#F7F6F2] disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
          <ChevronRight className="w-4 h-4"/>
        </button>
      </div>
    </div>);
};

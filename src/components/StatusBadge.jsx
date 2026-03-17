import React from 'react';

const StatusBadge = ({ status, size = 'sm' }) => {
  const styles = {
    Pending:  'bg-yellow-100 text-yellow-700 border-yellow-200',
    Approved: 'bg-green-100  text-green-700  border-green-200',
    Rejected: 'bg-red-100    text-red-700    border-red-200',
  };
  const icons = { Pending: '⏳', Approved: '✅', Rejected: '❌' };
  const sizeClass = size === 'lg' ? 'px-4 py-2 text-sm' : 'px-3 py-1 text-xs';

  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-semibold border ${sizeClass} ${styles[status] || 'bg-gray-100 text-gray-600'}`}>
      {icons[status]} {status}
    </span>
  );
};

export default StatusBadge;

import React from 'react';

/**
 * Reusable InputField component
 * Props: label, name, type, value, onChange, placeholder, required, error, rows (for textarea)
 */
const InputField = ({
  label, name, type = 'text', value, onChange,
  placeholder, required = false, error, rows, children
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {children ? children : rows ? (
        <textarea
          name={name} value={value} onChange={onChange}
          placeholder={placeholder} rows={rows}
          className={`w-full px-4 py-3 border rounded-xl text-gray-800 placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none
            ${error ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'}`}
          required={required}
        />
      ) : (
        <input
          type={type} name={name} value={value} onChange={onChange}
          placeholder={placeholder}
          className={`w-full px-4 py-3 border rounded-xl text-gray-800 placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-blue-500 transition
            ${error ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'}`}
          required={required}
        />
      )}

      {error && <p className="text-red-500 text-xs mt-1">⚠ {error}</p>}
    </div>
  );
};

export default InputField;

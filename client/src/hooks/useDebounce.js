import { useState, useEffect } from 'react';

/**
 * Hook para retrasar la ejecución de búsquedas y autocompletado (Debounce)
 * Evita llamadas redundantes o saturación del renderizado mientras el usuario escribe.
 * @param {any} value Valor de entrada a retrasar
 * @param {number} delay Tiempo de espera en milisegundos (default: 300ms)
 * @returns {any} Valor retrasado
 */
export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

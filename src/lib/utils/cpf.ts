/**
 * Valida CPF pelo algoritmo Mod11 (dígitos verificadores).
 * Rejeita sequências conhecidas inválidas (ex: 111.111.111-11).
 */
export function isValidCpf(raw: string): boolean {
  const digits = raw.replace(/\D/g, '');
  if (digits.length !== 11) return false;

  // Rejeita sequências repetidas
  if (/^(\d)\1{10}$/.test(digits)) return false;

  const calc = (length: number): number => {
    let sum = 0;
    for (let i = 0; i < length; i++) {
      sum += parseInt(digits[i]) * (length + 1 - i);
    }
    const remainder = (sum * 10) % 11;
    return remainder === 10 ? 0 : remainder;
  };

  return calc(9) === parseInt(digits[9]) && calc(10) === parseInt(digits[10]);
}

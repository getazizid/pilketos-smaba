/**
 * Generator Token Akses Pemilih Unik & Aman
 * Menghindari karakter ambigu seperti 0, O, 1, I agar mudah diketik siswa
 */
const CHARSET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export function generateVoterToken(length = 6) {
  let result = '';
  const charactersLength = CHARSET.length;
  for (let i = 0; i < length; i++) {
    result += CHARSET.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

/**
 * Generate kumpulan token unik untuk daftar siswa
 */
export function generateUniqueTokens(count, existingTokens = new Set()) {
  const tokens = [];
  while (tokens.length < count) {
    const token = generateVoterToken();
    if (!existingTokens.has(token)) {
      existingTokens.add(token);
      tokens.push(token);
    }
  }
  return tokens;
}

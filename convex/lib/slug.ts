const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export function generateSlug(length: number = 4) {
  var acc = [];
  for (let i = 0; i < length; i++) {
    acc.push(ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length)));
  }
  return acc.join("");
}

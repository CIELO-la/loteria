export const barajar = (cartas) => {
  const cartasBarajadas = [...cartas].reverse();
  let temp, j;
  cartas.map((_, i) => {
    j = Math.floor(Math.random() * (i + 1));
    temp = cartasBarajadas[i];
    cartasBarajadas[i] = cartasBarajadas[j];
    cartasBarajadas[j] = temp;
    return null;
  });
  return cartasBarajadas;
};

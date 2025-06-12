export function multiply(a, b) {
  return (a * b).toFixed(2);
}

export function calculateTotal(products) {
  return products.reduce((total, item) => {
    return total + (item.product.price * item.quantity);
  }, 0).toFixed(2);
}

export function eq(val1, val2) {
  return val1 === val2;
}

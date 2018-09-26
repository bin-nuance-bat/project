function productName(product) {
  if (!product) return '#ERROR';

  return `${product.name} ${product.qualifier ? `(${product.qualifier})` : ''}`;
}

export default productName;

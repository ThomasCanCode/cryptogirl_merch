import data from './data.json';

export function getProductsByCategory(product_search) {
  const products = data.filter((product) => product.product === product_search);
  return products;
}

export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ message: `Method ${req.method} is not allowed` });
  } else {
    const products = getProductsByCategory(req.query.product);
    res.status(200).json(products);
  }
}
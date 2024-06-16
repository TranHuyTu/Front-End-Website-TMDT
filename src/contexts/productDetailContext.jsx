import React, { createContext, useState } from 'react';

const ProductDetailContext = createContext();

const ProductDetailProvider = ({ children }) => {
  const [product, setProduct] = useState(null);

  return (
    <ProductDetailContext.Provider value={{ product, setProduct }}>
      {children}
    </ProductDetailContext.Provider>
  );
};

export { ProductDetailContext, ProductDetailProvider };

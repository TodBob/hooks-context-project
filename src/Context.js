import React, { useState, useEffect } from "react";

const Context = React.createContext();

function ContextProvider({ children }) {
  const [allPhotos, setAllPhotos] = useState([]);
  const [cartItems, setCartItems] = useState([]);

  const url =
    "https://raw.githubusercontent.com/bobziroll/scrimba-react-bootcamp-images/master/images.json";
  
  const localStoragePhotos = localStorage.getItem("allPhotos");
  const localStorageCart = localStorage.getItem("cart");

  useEffect(() => {
    if (localStoragePhotos) {
      setAllPhotos(JSON.parse(localStoragePhotos));
    } else {
      fetch(url)
        .then(res => res.json())
        .then(data => setAllPhotos(data));
    }
      
  }, []);

  function toggleFavorite(id) {
    const updatedArr = allPhotos.map(photo => {
      if (photo.id === id) {
        return { ...photo, isFavorite: !photo.isFavorite };
      }
      return photo;
    });

    setAllPhotos(updatedArr);
    localStorage.setItem("allPhotos", JSON.stringify(updatedArr));
  }

  function addToCart(newItem) {
    localStorage.setItem("cart", JSON.stringify([...cartItems, newItem]));

    setCartItems(prevItems => [...prevItems, newItem]);
  }

  function removeFromCart(id) {
    const storage = JSON.parse(localStorageCart);
    localStorage.setItem(
      "cart",
      JSON.stringify(storage.filter(item => item.id !== id))
    );

    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  }

  function emptyCart() {
    setCartItems([]);
    localStorage.clear()
  }

  useEffect(() => {
    if (localStorageCart !== null) {
      setCartItems(JSON.parse(localStorageCart));
    }
    
  }, []);

  return (
    <Context.Provider
      value={{
        allPhotos,
        toggleFavorite,
        cartItems,
        addToCart,
        removeFromCart,
        emptyCart
      }}
    >
      {children}
    </Context.Provider>
  );
}

export { ContextProvider, Context };

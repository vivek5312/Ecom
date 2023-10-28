import React, { useState,useContext, lazy, Suspense} from 'react';
import './App.css';
import data from './components/Back/Data/Data';
import Header from './components/Font/Header/Header';
//import Product from './components/Font/Product';
import Cart from './components/Font/Cart/Cart';
import { BrowserRouter as Router, Route,Routes,Navigate} from 'react-router-dom';

//import About from './components/Font/Header/Pages/About/About';
//import Home from './components/Font/Header/Pages/Home/Home';
//import Contact from './components/Font/Header/Pages/Contact/Contact';
//import ProductDetail from './components/ProductDetail';
import { AuthContext } from './Store/AuthContex';
//import UserProfile from './Auth/UserProfile';
//import AuthPages from './components/Font/Header/Pages/AuthPages';

const Home=lazy(()=>import('./components/Font/Header/Pages/Home/Home'));
const About=lazy(()=>import('./components/Font/Header/Pages/About/About'));
const Contact=lazy(()=>import('./components/Font/Header/Pages/Contact/Contact'));
const ProductDetail=lazy(()=>import('./components/ProductDetail'));
const Product=lazy(()=>import('./components/Font/Product'));
const AuthPages=lazy(()=>import('./components/Font/Header/Pages/AuthPages'));
const UserProfile=lazy(()=>import('./Auth/UserProfile'))


function App() {
  const authCtx = useContext(AuthContext);
  const { productItems } = data;
  const [cartShown, setCartShown] = useState(false);
  const [cartItem, setCartItem] = useState([]);


  const shownCartHandler = () => {
    setCartShown(true);
  };

  const hiddenCartHandler = () => {
    setCartShown(false);
  };

 const handleAddProduct = async(product) => {
  const ProductExist = cartItem.find((item) => item.id === product.id);

  
  if (ProductExist) {
    setCartItem((prevCartItems) =>
      prevCartItems.map((item) =>
        item.id === product.id
          ? { ...ProductExist, quantity: ProductExist.quantity + 1 }
          : item
      )
    );
    
  } else {
    setCartItem([...cartItem, { ...product, quantity: 1 }]);
    
  }
 
};


const handleRemoveProduct = (product) => {
  const ProductExist = cartItem.find((item) => item.id === product.id);
  let updatedCart;

  if (ProductExist.quantity === 1) {
    setCartItem((prevCartItems) => prevCartItems.filter((item) => item.id !== product.id));
    updatedCart = cartItem.filter((item) => item.id !== product.id);
  } else {
    setCartItem((prevCartItems) =>
      prevCartItems.map((item) =>
        item.id === product.id
          ? { ...ProductExist, quantity: ProductExist.quantity - 1 }
          : item
      )
    );
    updatedCart = cartItem.map((item) =>
      item.id === product.id
        ? { ...ProductExist, quantity: ProductExist.quantity - 1 }
        : item
    );
  }

  // Update local storage after setting state
  localStorage.setItem("cartItem", JSON.stringify(updatedCart));
};
const handleCartClearance=()=>{
  setCartItem([]);
}
async function addDetail(detail) {
  try {
    const response = await fetch('https://react-http-fd939-default-rtdb.firebaseio.com/detail.json', {
      method: 'POST',
      body: JSON.stringify(detail),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to add detail.');
    }

    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Error adding detail:', error.message);
    // You can add further error handling or display error messages to the user here.
  }
}
  


  return (
 
    <div className="App">
         <Router>
 
   <Header onShown={shownCartHandler} cartItem={cartItem} />
  
   <Routes>
   <Route path="/" element={<Suspense> <Product productItems={productItems} handleAddProduct={handleAddProduct} /> </Suspense>} />
  <Route path="/products/:id" element={authCtx.isLoggedIn ? <Suspense> <ProductDetail productItems={productItems} /> </Suspense> : <Navigate to="/auth" />} />
  <Route path="/about" element={authCtx.isLoggedIn ? <Suspense><About /> </Suspense>: <Navigate to="/auth" />} />
   <Route path='/home' element={<Suspense fallback={<p>Loadin...</p>}> <Home /> </Suspense>} />
   <Route path='/contact' element={<Suspense><Contact onAddDetail={addDetail} /></Suspense>} />
   {!authCtx.isLoggedIn && (
       <Route path="/auth" element={<Suspense><AuthPages /></Suspense>} />
   )}
   <Route path='/profile' element={<Suspense><UserProfile /></Suspense>} />
</Routes>


     
   
  
  
  

      {cartShown && <Cart 
      onhidden={hiddenCartHandler}
      cartItem={cartItem} 
      handleAddProduct={handleAddProduct}
      handleRemoveProduct={handleRemoveProduct}
      handleCartClearance={handleCartClearance}
      />}
      </Router>
    </div>
 
  );
}


export default App;
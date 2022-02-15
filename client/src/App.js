import './App.css';
import Header from './components/layout/Header/Header';
import Footer from './components/layout/Footer/Footer';
import Home from './components/Home/Home';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import webfont from 'webfontloader';
import React from 'react';
import ProductDetails from "./components/Product/ProductDetails.js";
import Products from './components/Product/Products.js';
import Search from './components/Product/Search.js';
import LoginSignUp from './components/User/LoginSignUp';
import store from "./store";
import { loadUser } from "./actions/userActions";
import UserOptions from "./components/layout/Header/UserOptions.js";
import { useSelector } from 'react-redux';
import Profile from './components/User/Profile.js';
function App() {

  const { isAuthenticated, user } = useSelector(state => state.user);
  React.useEffect(() => {
    webfont.load({
      google: {
        families: ["Roboto", "Droid sans", "Chilanka"]
      }
    });

    store.dispatch(loadUser());
  }, [])

  return (
    <Router >
      <Header />

      {isAuthenticated && <UserOptions user={user} />}
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/product/:id" element={<ProductDetails />} />
        <Route exact path="/products" element={<Products />} />
        <Route exact path="/products/:keyword" element={<Products />} />
        <Route exact path="/search" element={<Search />} />
        <Route exact path="/login" element={<LoginSignUp />} />
        <Route exact path="/account" element={<Profile />} />

      </Routes>

      <Footer />
    </Router>
  );

}

export default App;

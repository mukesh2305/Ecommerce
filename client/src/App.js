import "./App.css";
import Header from "./components/layout/Header/Header";
import Footer from "./components/layout/Footer/Footer";
import Home from "./components/Home/Home";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import webfont from "webfontloader";
import React, { useEffect } from "react";
import ProductDetails from "./components/Product/ProductDetails.js";
import Products from "./components/Product/Products.js";
import Search from "./components/Product/Search.js";
import LoginSignUp from "./components/User/LoginSignUp";
import store from "./store";
import { loadUser, updatePassword } from "./actions/userActions";
import UserOptions from "./components/layout/Header/UserOptions.js";
import { useSelector } from "react-redux";
import Profile from "./components/User/Profile.js";
import ProtectedRoute from "./components/Route/ProtectedRoute.js";
import UpdateProfile from "./components/User/UpdateProfile.js";
import UpdatePassword from "./components/User/UpdatePassword.js";
function App() {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  console.log("isAuthenticated", isAuthenticated);
  React.useEffect(() => {
    webfont.load({
      google: {
        families: ["Roboto", "Droid sans", "Chilanka"],
      },
    });

    store.dispatch(loadUser());
  }, []);

  useEffect(() => {
    fetch("http://localhost:4000/api/v1/me", {
      method: "GET",
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => console.log("data", data));
  }, []);

  return (
    <Router>
      <Header />

      {isAuthenticated && <UserOptions user={user} />}
      <Routes>
        <Route exact path="/" element={<Home />} />

        <Route exact path="/product/:id" element={<ProductDetails />} />
        <Route exact path="/products" element={<Products />} />
        <Route exact path="/products/:keyword" element={<Products />} />
        <Route exact path="/search" element={<Search />} />
        <Route exact path="/login" element={<LoginSignUp />} />

        <Route element={<ProtectedRoute />}>
          <Route exact path="/account" element={<Profile />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route exact path="/me/update" element={<UpdateProfile />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route exact path="/password/update" element={<UpdatePassword />} />
        </Route>
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;

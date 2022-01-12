import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { Layout } from "antd";
import { render } from "react-dom";
import { Home, Host, Listing, Listings, NotFound, User, LogIn } from "./sections";
import "./styles/index.css";

const client = new ApolloClient({
  uri: "/api",
  cache: new InMemoryCache()
});

const App = () => {
  return (
    <Router>
      <Layout id="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/host" element={<Host />} />
          <Route path="/listing/:id" element={<Listing />} />
          <Route path="/listings/:location" element={<Listings />} />
          <Route path="/user/:id" element={<User />} />
          <Route path="/login" element={<LogIn />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </Router>
  )
}

render(
  <ApolloProvider client={client} >
    <App />
  </ApolloProvider>
  , document.getElementById("root"));
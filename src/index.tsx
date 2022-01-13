import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { Layout, Affix } from "antd";
import { render } from "react-dom";
import { Home, Host, Listing, Listings, NotFound, User, LogIn, AppHeader } from "./sections";
import "./styles/index.css";
import { Viewer } from "./lib/types";

const client = new ApolloClient({
	uri: "/api",
	cache: new InMemoryCache(),
});

const initialViewer: Viewer = {
	id: null,
	token: null,
	avatar: null,
	hasWallet: null,
	didRequest: false,
};

const App = () => {
	const [viewer, setViewer] = useState<Viewer>(initialViewer);

	return (
		<Router>
			<Layout id="app">
				<Affix offsetTop={0}>
					<AppHeader viewer={viewer} setViewer={setViewer} />
				</Affix>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/host" element={<Host />} />
					<Route path="/listing/:id" element={<Listing />} />
					<Route path="/listings/:location" element={<Listings />} />
					<Route path="/user/:id" element={<User />} />
					<Route path="/login" element={<LogIn setViewer={setViewer} />} />
					<Route path="*" element={<NotFound />} />
				</Routes>
			</Layout>
		</Router>
	);
};

render(
	<ApolloProvider client={client}>
		<App />
	</ApolloProvider>,
	document.getElementById("root")
);

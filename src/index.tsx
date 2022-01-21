import React, { useState, useEffect, useRef } from "react";
import { render } from "react-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ApolloClient, ApolloProvider, InMemoryCache, useMutation } from "@apollo/client";
import { Layout, Affix, Spin } from "antd";
import { Home, Host, Listing, Listings, NotFound, User, LogIn, AppHeader } from "./sections";
import { AppHeaderSkeleton, ErrorBanner } from "./lib/components";
import "./styles/index.css";
import { Viewer } from "./lib/types";
import { LOG_IN } from "./lib/graphql/mutations";
import { LogIn as LogInData, LogInVariables } from "./lib/graphql/mutations/LogIn/__generated__/LogIn";

const token = sessionStorage.getItem("token");
console.log("TOKEN IN INDEX: ", token);

const client = new ApolloClient({
	uri: "/api",
	cache: new InMemoryCache(),
	headers: {
		"X-CSRF-TOKEN": sessionStorage.getItem("token") || "",
	},
	// request: async (operation) => {
	// 	const token = sessionStorage.getItem("token");
	// 	operation.setContext({
	// 		headers: {
	// 			"X-CSRF-TOKEN": token,
	// 		},
	// 	});
	// },
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
	const [logIn, { error }] = useMutation<LogInData, LogInVariables>(LOG_IN, {
		onCompleted: (data) => {
			if (data && data.logIn) {
				setViewer(data.logIn);

				if (data.logIn.token) {
					sessionStorage.setItem("token", data.logIn.token);
				} else {
					sessionStorage.removeItem("token");
				}
			}
		},
	});

	const logInRef = useRef(logIn);

	useEffect(() => {
		logInRef.current();
	}, []);

	if (!viewer.didRequest && !error) {
		return (
			<Layout className="app-skeleton">
				<AppHeaderSkeleton />
				<div className="app-skeleton__spin-section">
					<Spin size="large" tip="Launching Tinyhouse" />
				</div>
			</Layout>
		);
	}

	const logInErrorBannerElement = error ? (
		<ErrorBanner description="We weren't able to verify if you were logged in. Please try again later" />
	) : null;

	return (
		<Router>
			<Layout id="app">
				<Affix offsetTop={0}>
					<AppHeader viewer={viewer} setViewer={setViewer} />
				</Affix>
				{logInErrorBannerElement}
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/host" element={<Host />} />
					<Route path="/listing/:id" element={<Listing />} />
					<Route path="/listings/:location" element={<Listings />} />
					<Route path="/user/:id" element={<User viewer={viewer} />} />
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

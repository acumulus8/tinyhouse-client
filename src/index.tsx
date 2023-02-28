import React, { useState, useEffect, useRef } from "react";
import { render } from "react-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ApolloClient, ApolloProvider, InMemoryCache, useMutation, concat, HttpLink, ApolloLink } from "@apollo/client";
import { StripeProvider, Elements } from "react-stripe-elements";
import { Layout, Affix, Spin } from "antd";
import { Home, Host, Listing, Listings, NotFound, User, LogIn, AppHeader, Stripe } from "./sections";
import { AppHeaderSkeleton, ErrorBanner } from "./lib/components";
import "./styles/index.css";
import { Viewer } from "./lib/types";
import { LOG_IN } from "./lib/graphql/mutations";
import { LogIn as LogInData, LogInVariables } from "./lib/graphql/mutations/LogIn/__generated__/LogIn";

// const httpLink = new HttpLink({ uri: "/api" });
const httpLink = new HttpLink({ uri: "https://tinyhouse-server1.herokuapp.com/api" });

const authMiddleware = new ApolloLink((operation, forward) => {
	operation.setContext(({ headers = {} }) => ({
		headers: {
			...headers,
			"X-CSRF-TOKEN": sessionStorage.getItem("token") || null,
		},
	}));
	return forward(operation);
});

const client = new ApolloClient({
	cache: new InMemoryCache(),
	link: concat(authMiddleware, httpLink),
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
	}, [logInRef]);

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
		<StripeProvider apiKey={process.env.REACT_APP_S_PUBLISHABLE_KEY as string}>
			<Router>
				<Layout id="app">
					<Affix offsetTop={0}>
						<AppHeader viewer={viewer} setViewer={setViewer} />
					</Affix>
					{logInErrorBannerElement}
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/host" element={<Host viewer={viewer} />} />
						<Route
							path="/listing/:id"
							element={
								<Elements>
									<Listing viewer={viewer} />
								</Elements>
							}
						/>
						<Route path="/listings/:location" element={<Listings />} />
						<Route path="/user/:id" element={<User viewer={viewer} setViewer={setViewer} />} />
						<Route path="/stripe" element={<Stripe viewer={viewer} setViewer={setViewer} />} />
						<Route path="/login" element={<LogIn setViewer={setViewer} />} />
						<Route path="*" element={<NotFound />} />
					</Routes>
				</Layout>
			</Router>
		</StripeProvider>
	);
};

render(
	<ApolloProvider client={client}>
		<App />
	</ApolloProvider>,
	document.getElementById("root")
);

import React, { useState, useEffect } from "react";
import { Layout, Input } from "antd";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Viewer } from "../../lib/types";
import logo from "./assets/tinyhouse-logo.png";
import { MenuItems } from "./components";
import { displayErrorMessage } from "../../lib/utils";

interface Props {
	viewer: Viewer;
	setViewer: (viewer: Viewer) => void;
}

const { Header } = Layout;
const { Search } = Input;

export const AppHeader = ({ viewer, setViewer }: Props) => {
	const [search, setSearch] = useState("");
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		const pathnameSubStrings = location.pathname.split("/");

		if (!location.pathname.includes("/listings")) {
			setSearch("");
			return;
		}

		if (location.pathname.includes("/listings") && pathnameSubStrings.length === 3) {
			setSearch(pathnameSubStrings[2]);
			return;
		}
	}, [location.pathname]);

	const onSearch = (value: string) => {
		const trimmedValue = value.trim();

		if (trimmedValue) {
			navigate(`/listings/${trimmedValue}`);
		} else {
			displayErrorMessage("Please enter a valid search");
		}
	};

	return (
		<Header className="app-header">
			<div className="app-header__logo-search-section">
				<div className="app-header__logo">
					<Link to="/">
						<img src={logo} alt="tinyhouse app logo" />
					</Link>
				</div>
				<div className="app-header__search-input">
					<Search
						placeholder="Search 'San Fransisco'"
						enterButton
						onSearch={onSearch}
						value={search.replace("%20", " ")}
						onChange={(e) => setSearch(e.target.value)}
					/>
				</div>
			</div>
			<div className="app-header__menu-section">
				<MenuItems viewer={viewer} setViewer={setViewer} />
			</div>
		</Header>
	);
};

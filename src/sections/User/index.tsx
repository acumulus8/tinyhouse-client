import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { Row, Layout, Col } from "antd";
import { USER } from "../../lib/graphql/queries";
import { Viewer } from "../../lib/types";
import { User as UserData, UserVariables } from "../../lib/graphql/queries/User/__generated__/User";
import { UserProfile, UserListings, UserBookings } from "./components";
import { PageSkeleton, ErrorBanner } from "../../lib/components";

interface Props {
	viewer: Viewer;
}

const { Content } = Layout;
const PAGE_LIMIT = 4;

export const User = ({ viewer }: Props) => {
	const [listingsPage, setListingsPage] = useState(1);
	const [bookingsPage, setBookingsPage] = useState(1);

	const { id } = useParams() as { id: string };

	const { data, loading, error } = useQuery<UserData, UserVariables>(USER, {
		variables: {
			id: id || "",
			bookingsPage,
			listingsPage,
			limit: PAGE_LIMIT,
		},
	});

	if (loading) {
		return (
			<Content className="user">
				<PageSkeleton />
			</Content>
		);
	}

	if (error) {
		return (
			<Content className="user">
				<ErrorBanner message="This user may not exist or an error has occured" />
				<PageSkeleton />
			</Content>
		);
	}

	const user = data ? data.user : null;
	const viewerIsUser = viewer.id === id;

	const userListings = user ? user.listings : null;
	const userBookings = user ? user.bookings : null;

	const userProfileElement = user ? <UserProfile user={user} viewerIsUser={viewerIsUser} /> : null;
	const userListingsElement = userListings ? (
		<UserListings userListings={userListings} listingsPage={listingsPage} limit={PAGE_LIMIT} setListingsPage={setListingsPage} />
	) : null;
	const userBookingsElement = userBookings ? (
		<UserBookings userBookings={userBookings} bookingsPage={bookingsPage} limit={PAGE_LIMIT} setBookingsPage={setBookingsPage} />
	) : null;

	const stripeError = new URL(window.location.href).searchParams.get("stripe_error");
	const stripeErrorBanner = stripeError ? <ErrorBanner description="We had an issue connecting with Stripe. Please try again soon." /> : null;

	return (
		<Content className="user">
			{stripeErrorBanner}
			<Row gutter={12} justify="space-between">
				<Col xs={24}>{userProfileElement}</Col>
				<Col xs={24}>
					{userListingsElement}
					{userBookingsElement}
				</Col>
			</Row>
		</Content>
	);
};

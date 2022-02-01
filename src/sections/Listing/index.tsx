import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { Moment } from "moment";
import { Layout, Col, Row } from "antd";
import { LISTING } from "../../lib/graphql/queries";
import { ListingDetails, ListingBookings, ListingCreateBooking } from "./components";
import { PageSkeleton, ErrorBanner } from "../../lib/components";
import { Listing as ListingData, ListingVariables } from "../../lib/graphql/queries/Listing/__generated__/Listing";
import { mockListingBookings } from "./utils/mock listings";

const { Content } = Layout;

const PAGE_LIMIT = 3;

export const Listing = () => {
	const [bookingsPage, setBookingsPage] = useState<number>(1);
	const [checkInDate, setCheckInDate] = useState<Moment | null>(null);
	const [checkOutDate, setCheckOutDate] = useState<Moment | null>(null);

	const { id } = useParams() as { id: string };
	console.log("ID ON LISTING PAGE: ", id);

	const { loading, data, error } = useQuery<ListingData, ListingVariables>(LISTING, {
		variables: {
			id: id || "",
			bookingsPage,
			limit: PAGE_LIMIT,
		},
	});

	if (loading) {
		return (
			<Content>
				<PageSkeleton />
			</Content>
		);
	}

	if (error) {
		return (
			<Content>
				<ErrorBanner description="This listing may not exist or we've encountered an error. Please try again soon" />
				<PageSkeleton />
			</Content>
		);
	}

	const listing = data ? data.listing : null;
	const listingBookings = listing ? listing.bookings : null;

	const listingDetailsElement = listing ? <ListingDetails listing={listing} /> : null;

	const listingBookingsElement = mockListingBookings ? (
		<ListingBookings listingBookings={mockListingBookings} bookingsPage={bookingsPage} limit={PAGE_LIMIT} setBookingsPage={setBookingsPage} />
	) : null;

	const listingCreateBookingElement = listing ? (
		<ListingCreateBooking
			price={listing.price}
			checkInDate={checkInDate}
			checkOutDate={checkOutDate}
			setCheckInDate={setCheckInDate}
			setCheckOutDate={setCheckOutDate}
		/>
	) : null;

	return (
		<Content className="listings">
			<Row gutter={24} justify="space-between">
				<Col xs={24} lg={14}>
					{listingDetailsElement}
					{listingBookingsElement}
				</Col>
				<Col xs={24} lg={10}>
					{listingCreateBookingElement}
				</Col>
			</Row>
		</Content>
	);
};

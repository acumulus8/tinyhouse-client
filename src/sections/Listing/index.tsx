import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { Moment } from "moment";
import { Layout, Col, Row } from "antd";
import { LISTING } from "../../lib/graphql/queries";
import { ListingDetails, ListingBookings, ListingCreateBooking, WrappedListingCreateBookingModal as ListingCreateBookingModal } from "./components";
import { PageSkeleton, ErrorBanner } from "../../lib/components";
import { Listing as ListingData, ListingVariables } from "../../lib/graphql/queries/Listing/__generated__/Listing";
import { Viewer } from "../../lib/types";
import { useScrollToTop } from "../../lib/hooks";

interface Props {
	viewer: Viewer;
}

const { Content } = Layout;

const PAGE_LIMIT = 3;

export const Listing = ({ viewer }: Props) => {
	const [bookingsPage, setBookingsPage] = useState<number>(1);
	const [checkInDate, setCheckInDate] = useState<Moment | null>(null);
	const [checkOutDate, setCheckOutDate] = useState<Moment | null>(null);
	const [modalVisible, setModalVisible] = useState<boolean>(false);
	useScrollToTop();

	const { id } = useParams() as { id: string };

	const { loading, data, error, refetch } = useQuery<ListingData, ListingVariables>(LISTING, {
		variables: {
			id: id || "",
			bookingsPage,
			limit: PAGE_LIMIT,
		},
	});

	const clearBookingData = () => {
		setModalVisible(false);
		setCheckInDate(null);
		setCheckOutDate(null);
	};

	const handleListingRefetch = async () => {
		await refetch();
	};

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

	const listingCreateBookingModalElement =
		listing && checkInDate && checkOutDate ? (
			<ListingCreateBookingModal
				id={listing.id}
				modalVisible={modalVisible}
				setModalVisible={setModalVisible}
				price={listing.price}
				checkInDate={checkInDate}
				checkOutDate={checkOutDate}
				clearBookingData={clearBookingData}
				handleListingRefetch={handleListingRefetch}
			/>
		) : null;

	const listingDetailsElement = listing ? <ListingDetails listing={listing} /> : null;

	const listingBookingsElement =
		listing && listing.bookings ? (
			<ListingBookings listingBookings={listing.bookings} bookingsPage={bookingsPage} limit={PAGE_LIMIT} setBookingsPage={setBookingsPage} />
		) : null;

	const listingCreateBookingElement = listing ? (
		<ListingCreateBooking
			price={listing.price}
			checkInDate={checkInDate}
			checkOutDate={checkOutDate}
			setCheckInDate={setCheckInDate}
			setCheckOutDate={setCheckOutDate}
			bookingsIndex={listing.bookingsIndex}
			viewer={viewer}
			host={listing.host}
			setModalVisible={setModalVisible}
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
			{listingCreateBookingModalElement}
		</Content>
	);
};

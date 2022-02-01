import React from "react";
import { Link } from "react-router-dom";
import { Avatar, Divider, List, Typography } from "antd";
import { Listing } from "../../../../lib/graphql/queries/Listing/__generated__/Listing";

interface Props {
	listingBookings: Listing["listing"]["bookings"];
	bookingsPage: number;
	limit: number;
	setBookingsPage: (page: number) => void;
}

const { Text, Title } = Typography;

export const ListingBookings = ({ listingBookings, bookingsPage, limit, setBookingsPage }: Props) => {
	const total = listingBookings ? listingBookings.total : null;
	const result = listingBookings ? listingBookings.result : null;

	const listingBookingsList = listingBookings ? (
		// const listingBookingsList = (
		<List
			grid={{
				gutter: 8,
				xs: 1,
				sm: 2,
				lg: 3,
			}}
			dataSource={result ? result : undefined}
			locale={{ emptyText: "No bookings have been made yet!" }}
			pagination={{
				current: bookingsPage,
				total: total ? total : undefined,
				defaultPageSize: limit,
				hideOnSinglePage: true,
				showLessItems: true,
				onChange: (page: number) => setBookingsPage(page),
			}}
			renderItem={(listingBooking) => {
				const bookingHistory = (
					<div className="listing-bookings__booking-history">
						<div>
							Check in: <Text strong>{listingBooking.checkIn}</Text>
						</div>
						<div>
							Check out: <Text strong>{listingBooking.checkOut}</Text>
						</div>
					</div>
				);
				return (
					<List.Item className="listing-bookings__item">
						{bookingHistory}
						<Link to={`/user/${listingBooking.tenant.id}`}>
							<Avatar src={listingBooking.tenant.avatar} size={64} shape="square" />
						</Link>
					</List.Item>
				);
			}}
		/>
	) : // );
	null;

	const listingBookingsElement = listingBookings ? (
		// const listingBookingsElement = (
		<div className="user-bookings">
			<Divider />
			<div className="listing-bookings">
				<Title level={4} className="user-bookings__title">
					Bookings
				</Title>
				{listingBookingsList}
			</div>
		</div>
	) : // );
	null;

	return listingBookingsElement;
};

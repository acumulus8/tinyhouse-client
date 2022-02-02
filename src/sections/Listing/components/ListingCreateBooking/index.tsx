import React from "react";
import { Button, Card, Divider, Typography, DatePicker } from "antd";
import moment, { Moment } from "moment";
import { formatListingPrice, displayErrorMessage } from "../../../../lib/utils";
import { Viewer } from "../../../../lib/types";
import { BookingsIndex } from "./types";
import { Listing as ListingData } from "../../../../lib/graphql/queries/Listing/__generated__/Listing";

interface Props {
	price: number;
	checkInDate: Moment | null;
	checkOutDate: Moment | null;
	setCheckInDate: (checkInDate: Moment | null) => void;
	setCheckOutDate: (checkOutDate: Moment | null) => void;
	viewer: Viewer;
	host: ListingData["listing"]["host"];
	bookingsIndex: ListingData["listing"]["bookingsIndex"];
	setModalVisible: (modalVisible: boolean) => void;
}

const { Paragraph, Title, Text } = Typography;

export const ListingCreateBooking = ({
	price,
	checkInDate,
	checkOutDate,
	setCheckInDate,
	setCheckOutDate,
	viewer,
	host,
	bookingsIndex,
	setModalVisible,
}: Props) => {
	const bookingsIndexJSON: BookingsIndex = JSON.parse(bookingsIndex);

	const dateIsBooked = (currentDate: Moment) => {
		const year = moment(currentDate).year();
		const month = moment(currentDate).month();
		const day = moment(currentDate).date();

		if (bookingsIndexJSON[year] && bookingsIndexJSON[year][month]) {
			return Boolean(bookingsIndexJSON[year][month][day]);
		} else {
			return false;
		}
	};

	const disabledDate = (currentDate?: Moment) => {
		if (currentDate) {
			const dateIsBeforeEndOfDay = currentDate.isBefore(moment().endOf("day"));
			return dateIsBeforeEndOfDay || dateIsBooked(currentDate);
		} else {
			return false;
		}
	};

	const varifyAndSetCheckOutDate = (selectedCheckOutDate: Moment | null) => {
		if (checkInDate && selectedCheckOutDate) {
			if (moment(selectedCheckOutDate).isBefore(checkInDate, "days")) {
				return displayErrorMessage("You can't book a checkout date prior to the check in.");
			}

			let dateCursor = checkInDate;

			while (moment(dateCursor).isBefore(selectedCheckOutDate, "days")) {
				dateCursor = moment(dateCursor).add(1, "days");

				const year = moment(dateCursor).year();
				const month = moment(dateCursor).month();
				const day = moment(dateCursor).date();

				if (bookingsIndexJSON[year] && bookingsIndexJSON[year][month] && bookingsIndexJSON[year][month][day]) {
					return displayErrorMessage("You can't book a period of time that overlaps existing booking dates.");
				}
			}
		}
		setCheckOutDate(selectedCheckOutDate);
	};

	const viewerIsHost = viewer.id === host.id;
	const checkInInputDisabled = !viewer.id || viewerIsHost || !host.hasWallet;
	const checkOutInputDisabled = checkInInputDisabled || !checkInDate;
	const buttonDisabled = checkInInputDisabled || !checkInDate || !checkOutDate;

	let buttonMessage = "You won't be charged yet";
	if (!viewer.id) {
		buttonMessage = "You have to be signed in to book this listing!";
	} else if (viewerIsHost) {
		buttonMessage = "You can't book your own listing!";
	} else if (!host.hasWallet) {
		buttonMessage = "The host has disconnected from Stripe and won't be able to accept payments or bookings for this listing.";
	}

	return (
		<div className="listing-booking">
			<Card className="listing-booking__card">
				<div>
					<Paragraph>
						<Title level={2} className="listing-booking__card-title">
							{formatListingPrice(price, true)}
							<span>/day</span>
						</Title>
					</Paragraph>
					<Divider />
					<div className="listing-booking__card-date-picker">
						<Paragraph strong>Check In</Paragraph>
						<DatePicker
							value={checkInDate ? checkInDate : undefined}
							onChange={(dateValue) => setCheckInDate(dateValue)}
							format={"YYYY/MM/DD"}
							disabled={checkInInputDisabled}
							disabledDate={disabledDate}
							showToday={false}
							onOpenChange={() => setCheckOutDate(null)}
						/>
					</div>
					<div className="listing-booking__card-date-picker">
						<Paragraph strong>Check Out</Paragraph>
						<DatePicker
							value={checkOutDate ? checkOutDate : undefined}
							onChange={(dateValue) => varifyAndSetCheckOutDate(dateValue)}
							format={"YYYY/MM/DD"}
							disabledDate={disabledDate}
							showToday={false}
							disabled={checkOutInputDisabled}
						/>
					</div>
				</div>
				<Divider />
				<Button
					size="large"
					type="primary"
					className="listing-booking__card-cta"
					disabled={buttonDisabled}
					onClick={() => setModalVisible(true)}
				>
					Request to book!
				</Button>
				<Text type="secondary" mark>
					{buttonMessage}
				</Text>
			</Card>
		</div>
	);
};

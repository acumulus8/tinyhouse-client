import React from "react";
import { Button, Card, Divider, Typography, DatePicker } from "antd";
import moment, { Moment } from "moment";
import { formatListingPrice, displayErrorMessage } from "../../../../lib/utils";

interface Props {
	price: number;
	checkInDate: Moment | null;
	checkOutDate: Moment | null;
	setCheckInDate: (checkInDate: Moment | null) => void;
	setCheckOutDate: (checkOutDate: Moment | null) => void;
}

const { Paragraph, Title } = Typography;

export const ListingCreateBooking = ({ price, checkInDate, checkOutDate, setCheckInDate, setCheckOutDate }: Props) => {
	const disabledDate = (currentDate?: Moment) => {
		if (currentDate) {
			const dateIsBeforeEndOfDay = currentDate.isBefore(moment().endOf("day"));
			return dateIsBeforeEndOfDay;
		} else {
			return false;
		}
	};

	const varifyAndSetCheckOutDate = (selectedCheckOutDate: Moment | null) => {
		if (checkInDate && selectedCheckOutDate) {
			if (moment(selectedCheckOutDate).isBefore(checkInDate, "days")) {
				return displayErrorMessage("You can't book a checkout date prior to the check in.");
			}
		}
		setCheckOutDate(selectedCheckOutDate);
	};

	const checkOutInputDisabled = !checkInDate;
	const buttonDisabled = !checkInDate || !checkOutDate;

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
				<Button size="large" type="primary" className="listing-booking__card-cta" disabled={buttonDisabled}>
					Request to book!
				</Button>
			</Card>
		</div>
	);
};

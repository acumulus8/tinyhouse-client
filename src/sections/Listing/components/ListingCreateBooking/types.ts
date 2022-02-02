interface BookingsIndexMonth {
	[key: string]: boolean;
}

interface BookingsIdexYear {
	[key: string]: BookingsIndexMonth;
}

export interface BookingsIndex {
	[key: string]: BookingsIdexYear;
}

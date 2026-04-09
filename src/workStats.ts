export interface WorkDayRecord {
	hours: number;
}

export interface WorkStatsData {
	records: Record<string, WorkDayRecord>;
}

export function clampHours(value: number): number {
	if (Number.isNaN(value)) {
		return 0;
	}
	return Math.min(9, Math.max(0, Math.round(value)));
}

export function dateKeyFromDate(date: Date): string {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
}

export function getMonthMetadata(date: Date) {
	const year = date.getFullYear();
	const month = date.getMonth();
	return {
		year,
		month,
		daysInMonth: new Date(year, month + 1, 0).getDate(),
		firstWeekday: new Date(year, month, 1).getDay(),
	};
}

export function getMonthTotalHours(
	data: WorkStatsData,
	year: number,
	month: number,
): number {
	let total = 0;
	const prefix = `${year}-${String(month + 1).padStart(2, "0")}`;
	for (const [key, record] of Object.entries(data.records)) {
		if (key.startsWith(prefix)) {
			const normalizedHours = Math.min(record.hours, 8);
			total += normalizedHours;
		}
	}
	return total;
}

export function getExpectedMonthlyHours(
	year: number,
	month: number,
	workingDaysPerWeek: number,
	hoursPerDay: number,
): number {
	if (workingDaysPerWeek <= 0 || hoursPerDay <= 0) {
		return 0;
	}
	const allowedWeekdays = getAllowedWeekdays(Math.min(Math.max(workingDaysPerWeek, 0), 7));
	const daysInMonth = new Date(year, month + 1, 0).getDate();
	let tally = 0;
	for (let day = 1; day <= daysInMonth; day++) {
		const date = new Date(year, month, day);
		if (allowedWeekdays.has(date.getDay())) {
			tally += hoursPerDay;
		}
	}
	return tally;
}

export function getAllowedWeekdays(count: number): Set<number> {
	const order = [1, 2, 3, 4, 5, 6, 0]; // Mon ... Sun
	return new Set(order.slice(0, count));
}

export const BASE_STR = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx";
const UUIDLength = 16;
const NoId = 0;
const OctalPart = 0x8;
const ThreePart = 0x3;

export const UUID = () =>
	BASE_STR.replace(/[xy]/g, c => {
		// eslint-disable-next-line no-bitwise
		const r = (Math.random() * UUIDLength) | NoId;
		// eslint-disable-next-line no-bitwise,no-mixed-operators
		const uuid = c === "x" ? r : (r & ThreePart) | OctalPart;
		return uuid.toString(UUIDLength);
	});

// const UUIDLength = 16;
// const NoId = 0;
// const OctalPart = 0x8;
// const ThreePart = 0x3;
// return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
//   const r = Math.random() * UUIDLength | NoId; const
//     uuid = c === 'x' ? r : (r & ThreePart | OctalPart);
//   return uuid.toString(UUIDLength);
// });

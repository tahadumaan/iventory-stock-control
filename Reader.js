const axios = require("axios");
require("dotenv").config();

// Requiring the module
module.exports = async function () {
	const reader = require("xlsx");

	// Reading our test file
	const file = reader.readFile("./KATEGORİ BAZLI AR-GE İÇİN.xlsx");
	console.log("Excel file reading..");
	let data = [];

	const temp = reader.utils.sheet_to_json(file.Sheets[file.SheetNames[1]]);
	let lowQuantityList = [];
	let lowQuantityObj = [];

	for (let i = 0; i < temp.length; i++) {
		const object = Object.keys(temp[i]);
		const value = Object.values(temp[i]);
		// Getting min. quantities and storing them in data with their product codes
		for (let j = 0; j < object.length; j++) {
			if (object[j] === "MIN STOCK QUAN.") {
				data.push({
					ItemNumber: value[0],
					ItemName: value[1],
					PrimaryQuantity: value[j],
				});
			}
		}
	}
	console.log("Excell file read");
	console.log("Getting info from Oracle");

	let consoleText = "Comparing";
	// Getting real data from oracle for every product we have
	for (let i = 0; i < data.length; i++) {
		await axios
			.get(
				`${process.env.SERVER}/fscmRestApi/resources/${process.env.version}/inventoryOnhandBalances?q=ItemNumber=${data[i].ItemNumber}&onlyData=true&limit=1000`,
				{
					auth: {
						username: process.env.apiUser,
						password: process.env.apiPass,
					},
				}
			)
			.then((result) => {
				let totalQuantity = 0;
				// In every item we filter products which is not in production and getting their the total quantity
				result.data.items.forEach((item) => {
					if (item.SubinventoryCode !== "SAMM2URETM") {
						totalQuantity += item.PrimaryQuantity;
					}
				});
				// If min quantity is not equal to 0 and the product quantity we have is less than min quantity, we store that product in lowQuantityList.
				if (
					data[i].PrimaryQuantity !== 0 &&
					data[i].PrimaryQuantity > totalQuantity
				) {
					consoleText += ".";
					console.log(consoleText);
					lowQuantityList.push(
						`${data[i].ItemNumber}'s min. quantity is ${data[i].PrimaryQuantity} and we have ${totalQuantity}`
					);
					lowQuantityObj.push({
						ID: i + 1,
						ItemName: data[i].ItemName,
						ItemNumber: data[i].ItemNumber,
						PrimaryQuantity: data[i].PrimaryQuantity,
						TotalQuantity: totalQuantity,
					});
				}
			});
	}
	console.log("All data compared");
	return { lowQuantityList, lowQuantityObj };
};

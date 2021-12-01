module.exports = function (data) {
	let tableHTML =
		"<table style='text-color:#fff;font-size:16px;width: 90%; height:60%;text-align: center;padding: 15px;'><tr><th>ID</th><th>Product Code</th><th>Product Name</th><th>Min Stock</th><th>Current Stock</th></tr>";

	for (let i = 0; i < data.length; i++) {
		tableHTML +=
			"<tr style='font-weight:500'><td style='border-bottom: 1px solid #ddd;'>";
		tableHTML += data[i].ID;
		tableHTML += "</td><td style='border-bottom: 1px solid #ddd;'>";
		tableHTML += data[i].ItemNumber;
		tableHTML += "</td><td style='border-bottom: 1px solid #ddd;'>";
		tableHTML += data[i].ItemName;
		tableHTML += "</td><td style='border-bottom: 1px solid #ddd;'>";
		tableHTML += data[i].PrimaryQuantity;
		tableHTML += "</td><td style='border-bottom: 1px solid #ddd;'>";
		tableHTML += data[i].TotalQuantity;
		tableHTML += "</td></tr>";
	}
	tableHTML += "</table>";
	return tableHTML;
};

const nodemailer = require("nodemailer");
const axios = require("axios");
const Reader = require("./Reader");
const html = require("./html");

require("dotenv").config();
let items = {};

//STOK BİLGİSİ ALINIR
async function mail() {
	const data = await Reader();
	let mailOptions = {
		from: process.env.mailUser,
		to: process.env.toUser,
		subject: "Inventory Warning Mail",
		html: html(data.lowQuantityObj),
	};
	let transporter = nodemailer.createTransport({
		service: "gmail",
		auth: {
			user: process.env.mailUser,
			pass: process.env.mailPass,
		},
		tls: {
			rejectUnauthorized: false,
		},
	});

	//MAIL SENDING
	transporter
		.sendMail(mailOptions)
		.then(function (res) {
			//console.log(data.lowQuantityList);
			//console.log(data.lowQuantityObj);
			//console.log(html(data.lowQuantityObj));
			console.log("Email send");
			process.exit();
		})
		.catch(function (err) {
			console.log(err);
		});
}
mail();

const readline = require("readline");
const twoFactor = require('node-2fa');
const axios = require('axios');
require('console-png').attachTo(console);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

(async () => {
	const newSecret = twoFactor.generateSecret({name: 'Blacpay', account: 'macvantan@gmail.com'});
	console.log(newSecret);
	const res = await axios.get(newSecret.qr.replace('166x166', '80x80'), {responseType: 'arraybuffer'});
	await console.png(Buffer.from(res.data, 'binary'));

	rl.question("Enter number", number => {
		const check = twoFactor.verifyToken(newSecret.secret, number);
		console.log(check ? (check.delta === 0 ? 'correct' : 'incorrect') : 'Code invalid');
		
		rl.close();
	});
})();

rl.on("close", function() {
	process.exit(0);
});

/*
{
  secret: 'KPDUOTZHI2J35DNPCPPUKH6HU7IRVOH6',
  uri: 'otpauth://totp/Blacpay%3Amacvantan%40gmail.com%3Fsecret=KPDUOTZHI2J35DNPCPPUKH6HU7IRVOH6',
  qr: 'https://chart.googleapis.com/chart?chs=166x166&chld=L|0&cht=qr&chl=otpauth://totp/Blacpay%3Amacvantan%40gmail.com%3Fsecret=KPDUOTZHI2J35DNPCPPUKH6HU7IRVOH6'
}
*/
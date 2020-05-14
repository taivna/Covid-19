const express = require('express');
const exphbs = require('express-handlebars');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

let stats;

axios('https://onemocneni-aktualne.mzcr.cz/covid-19').then((response) => {
	const $ = cheerio.load(response.data);
	const tested = $('p[id = count-test]').text();
	const sick = $('p[id=count-sick]').text();
	const hospitalized = $('p[id=count-hospitalization]').text();
	const active = $('p[id=count-active]').text();
	const recovered = $('p[id=count-recover]').text();
	const dead = $('p[id=count-dead]').text();

	stats = {
		tested: tested,
		sick: sick,
		hospitalized: hospitalized,
		active: active,
		recovered: recovered,
		dead: dead
	};
});

app.get('/', function(req, res) {
	res.render('home', {
		tested: stats.tested,
		sick: stats.sick,
		hospitalized: stats.hospitalized,
		active: stats.active,
		recovered: stats.recovered,
		dead: stats.dead
	});
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
	console.log(`Server started on ${port}`);
});

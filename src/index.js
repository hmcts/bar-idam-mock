import http from 'http';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import initializeDb from './db';
import middleware from './middleware';
import details from './api/details';
import config from './config.json';
import fs from 'fs';


let app = express();
let server = http.createServer(app);
app.server = server;

// logger
app.use(morgan('dev'));

// 3rd party middleware
app.use(cors({
	exposedHeaders: config.corsHeaders
}));

app.use(bodyParser.json({
	limit : config.bodyLimit
}));

// connect to db
initializeDb( db => {

	//populate db
	fs.readFile('./resources/users.json', function (err, data) {
		if (err) throw err;
		let users = JSON.parse(data);
		users.forEach((element) => {		
			db.insert(element);
		});
	});

	// internal middleware
	app.use(middleware({ config, db }));

	// check bearer
	app.use('/', details({ config, db }));

	server.listen(process.env.PORT || config.port, () => {
		console.log(`Started on port ${server.address().port}`);
	});
});

export default app;

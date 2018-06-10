const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const morgan = require('morgan');
const mongoose = require('mongoose');

const { League, Round, Player, PointWeight, PointAllocation } = require('./models');

const { CLIENT_ORIGIN, DB_URL, PORT } = require('./config');

mongoose.connect(DB_URL);

if (process.env.NODE_ENV !== 'test') {
	app.use(morgan('common'));
}   

// app.use(
//     cors({
//         origin: CLIENT_ORIGIN
// 	})
// )

// POST new league 
app.post('/league', jsonParser, (req, res) => {
	console.log('req.body: ', req.body)
	League.create(req.body)
		.then(league => {
			res.status(201).json(league);
		})
		.catch((error) => {
			console.log(error);
			res.status(400).json(error);
		});
    
});

// POST league players
app.post('/league/:id/players', jsonParser, (req, res) => {
	console.log('req.body players: ', req.body)
	Player.create(req.body)
		.then(players => {
			res.status(201).json(players);
		})
		.catch((error) => {
			console.log(error);
			res.status(400).json(error);
		});
    
});

// GET league players
app.get('/league/:id/players', (req, res) => {
	Player.find({})
		.then(players => {
			console.log(players)
			res.json(players)
		})
		.catch(err => {
			console.log(err)
			res.status(400).json(error);
		});
})

// DELETE league players - TODO: get it working
app.delete('/league/:id/remove-player/:playerId', (req, res) => {
	console.log('req.body player id: ', req.body)
	Player.findByIdAndRemove(req.params.playerId, { $set: req.body })
		.then(players => {
			res.status(204).send('Player deleted');
		})
		.catch((error) => {
			console.log(error);
			res.status(400).json(error);
		});
});

// POST league point settings
app.post('/league/:id/point-settings', jsonParser, (req, res) => {
    PointWeight.create(req.body)
		.then(points => {
			res.status(201).json(points);
		})
		.catch((error) => {
			console.log(error);
			res.status(400).json(error);
		});
});

// GET league
app.get('/league/:id', (req, res, next) => {
	League.findById(req.params.id)
		.populate('name')
		.exec((err, league) => {
			if (err) return next(err);
			res.json(league)
		})
		// .then((league) => {
		// 	res.json(league)
		// })
		// .catch(err => {
		// 	console.log(err)
		// 	res.status(400).json(error);
		// });
});

// UPDATE league
app.put('/leagues/:id', (req, res) => {
    
});

// POST new round
app.post('/leagues/:id/round', jsonParser, (req, res) => {
    Round.create(req.body)
		.then(course => {
			res.status(201).json(course);
		})
		.catch((error) => {
			console.log(error);
			res.status(400).json(error);
		});
});

// GET round
app.get('/leagues/:id/round/:id', (req, res) => {
    
});

// UPDATE round
app.put('/leagues/:id/round/:id', (req, res) => {

});

// POST points weighting
app.post('./points-weighting', jsonParser, (req, res) => {

});

// POST points allocation
app.post('./points-allocation/add-entry', jsonParser, (req, res) => {

});
// PUT points allocation
app.put('./points-allocation/', (req, res) => {

});
// No endpoint hit
app.use((req, res) => {
    res.sendStatus(404);
});

let server;

function runServer() {
	return new Promise((resolve, reject) => {
		server = app.listen(PORT, () => {
			console.log(`App is listening on port ${PORT}`);
			resolve(server);
		})
			.on('error', err => {
				reject(err);
		});
	});
}

function closeServer() {
	return new Promise((resolve, reject) => {
		console.log('closing server');
		server.close(err => {
			if (err) {
				reject(err);
				return;
			}
			resolve();
		});
	});
}

if (require.main === module) {
    runServer().catch(err => console.log(err));
}

module.exports = { app, runServer, closeServer }

import express from 'express';

const home = express.Router();

home.get('/', (req, res) => {
  res.send(`Up since: ${req.app.locals.startup.toISOString()}`)
});

export default home;

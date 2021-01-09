require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
//Hide x-powered by: express//
const helmet = require("helmet");
const cors = require("cors");
const MOVIES = require("./movies-data.json");
const app = express();

app.use(morgan("dev"));
//Placed helmet before cors//
app.use(helmet());
app.use(cors());

app.use(function validateBearerToken(req, res, next) {
  const apiToken = process.env.API_TOKEN;
  const authToken = req.get("Authorization");
  console.log("Ran");
  //Checks to see if either no authentication token is entered or if the entered token doesn't match the 'secret' token env var.
  if (!authToken || authToken.split(" ")[1] !== apiToken) {
    return res.status(401).json({ error: "Bad request" });
  }
  //Move to next middleware//
  next();
});
//Using the callback function "movieCall" to format response
app.get("/movie", function movieCall(req, res) {
  let response = MOVIES;
  // filter our movies by genre if genre query param is present
  if (req.query.genre) {
    response = response.filter(movie => 
      // case insensitive searching
      movie.genre.toLowerCase().includes(req.query.genre.toLowerCase())
    );
  }
  // filter our movies by country if country query param is present
  if (req.query.country) {
    response = response.filter(movie => 
      // case insensitive searching
      movie.country.toLowerCase().includes(req.query.country.toLowerCase())
    );
  }
  if (req.query.avg_vote) {
    // filter our movies by avg_vote if avg_vote query param is present
    response = response.filter(movie => 
      //Using Number constructor to compare numerical value of avg_vote
      Number(movie.avg_vote) >= Number(req.query.avg_vote)
    );
  }
  res.json(response);
});

const PORT = 8000;

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost"${PORT}`);
});

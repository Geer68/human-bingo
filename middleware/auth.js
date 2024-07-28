import dotenv from "dotenv";

dotenv.config();

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token === process.env.ACCESS_TOKEN_SECRET) {
    next();
  } else {
    res.sendStatus(403);
  }
};

export default authenticateToken;

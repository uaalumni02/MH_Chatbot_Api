import jwt from "jsonwebtoken";
import * as Response from "../helpers/response/response";

const authChecker = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return Response.responseBadAuth(res);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    return Response.responseBadAuth(res);
  }
};

export default authChecker;

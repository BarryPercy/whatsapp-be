import createHttpError from "http-errors"
import { RequestHandler } from "express"
import { UserRequest } from "./jwt"

export const adminOnlyMiddleware: RequestHandler = (req: UserRequest, res, next) => {
  // Once user is authenticated we shall check his role (Authorization)
  if (req.user && req.user.role === "Admin") {
    // If he/she is an admin --> next
    next()
  } else {
    // If he/she is not --> 403 Forbidden
    next(createHttpError(403, "Admins only endpoint!"))
  }
}

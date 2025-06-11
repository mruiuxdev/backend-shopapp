import { NextFunction, Request, Response, Router } from "express";
import { authService } from "./auth.service";
import { currentUser } from "../middlewares";
import { BadRequestError } from "src/errors";

const router = Router();

router.post(
  "/signup",
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    const jwt = await authService.signup({ email, password }, next);

    req.session = { jwt };

    res.status(201).send(true);
  }
);

router.post(
  "/signin",
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    const jwt = await authService.signin({ email, password }, next);

    req.session = { jwt };

    res.status(201).send(true);
  }
);

router.get(
  "/current-user",
  currentUser,
  async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json(req.currentUser);
  }
);

export { router as AuthRouter };

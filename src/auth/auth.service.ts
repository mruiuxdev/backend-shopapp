import { BadRequestError } from "../errors";
import { AuthDto } from "./dtos/auth.dto";
import { NextFunction } from "express";
import { userService, UserService } from "./user/user.service";
import { AuthenticationService } from "../services/auth.service";

export class AuthService {
  constructor(
    public userService: UserService,
    public authService: AuthenticationService
  ) {}

  async signup(createUserDto: AuthDto, next: NextFunction) {
    const existingUser = await this.userService.findOneByEmail(
      createUserDto.email
    );
    if (existingUser) {
      return next(new BadRequestError("Email is taken!"));
    }

    const hashedPassword = await this.authService.pwdToHash(
      createUserDto.password
    );

    const newUser = await this.userService.create({
      email: createUserDto.email,
      password: String(hashedPassword),
    });

    const jwt = this.authService.generateJwt(
      { email: createUserDto.email, userId: newUser.id },
      process.env.JWT_SECRET!
    );

    return jwt;
  }

  async signin(signinUser: AuthDto, next: NextFunction) {
    const existingUser = await this.userService.findOneByEmail(
      signinUser.email
    );
    if (!existingUser) {
      return next(new BadRequestError("Invalid Credentials"));
    }

    const matchedPassword = await this.authService.pwdCompare(
      existingUser.password,
      signinUser.password
    );
    if (!matchedPassword) {
      return next(new BadRequestError("Invalid Credentials"));
    }

    const jwt = this.authService.generateJwt(
      { email: existingUser.email, userId: existingUser.id },
      process.env.JWT_SECRET!
    );

    return jwt;
  }
}

export const authService = new AuthService(
  userService,
  new AuthenticationService()
);

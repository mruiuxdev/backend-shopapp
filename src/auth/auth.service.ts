import { BadRequestError } from "../errors";
import { CreateUserDto } from "./dtos/auth.dto";
import { NextFunction } from "express";
import { userService, UserService } from "./user/user.service";
import { AuthenticationService } from "../services/auth.service";

export class AuthService {
  constructor(
    public userService: UserService,
    public authService: AuthenticationService
  ) {}

  async signup(createUserDto: CreateUserDto, next: NextFunction) {
    const existingUser = await this.userService.findOneByEmail(
      createUserDto.email
    );
    if (existingUser) {
      return next(new BadRequestError("Email is taken!"));
    }

    const hashedPassword = this.authService.pwdToHash(createUserDto.password);

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
}

export const authService = new AuthService(
  userService,
  new AuthenticationService()
);

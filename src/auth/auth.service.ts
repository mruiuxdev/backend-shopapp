import { BadRequestError } from "src/errors";
import { CreateUserDto } from "./dtos/auth.dto";
import { NextFunction } from "express";
import { userService, UserService } from "./user/user.service";
import { authenticationService } from "src/utils/auth";

export class AuthService {
  constructor(public userService: UserService) {}

  async signup(createUserDto: CreateUserDto, next: NextFunction) {
    const existingUser = await this.userService.findOneByEmail(
      createUserDto.email
    );
    if (existingUser) {
      return next(new BadRequestError("Email is taken!"));
    }

    const hashedPassword = authenticationService.pwdToHash(
      createUserDto.password
    );

    const newUser = await this.userService.create({
      email: createUserDto.email,
      password: String(hashedPassword),
    });
  }
}

export const authService = new AuthService(userService);

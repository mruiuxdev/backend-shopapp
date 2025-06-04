import { UserModel } from "../../constants/auth";
import { CreateUserDto } from "../dtos/auth.dto";
import User from "./user.model";

export class UserService {
  constructor(public userModel: UserModel) {}

  async create(createUserDto: CreateUserDto) {
    const user = new this.userModel({
      email: createUserDto.email,
      password: createUserDto.password,
    });

    return await user.save();
  }

  async findOneByEmail(email: string) {
    return await this.userModel.findOne({ email });
  }
}

export const userService = new UserService(User);

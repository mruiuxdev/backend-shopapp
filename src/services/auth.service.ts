import { randomBytes, scrypt } from "crypto";
import jwt from "jsonwebtoken";
import { JwtPayload } from "src/constants/globals";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

export class AuthenticationService {
  generateJwt(payload: JwtPayload, JWT_KEY: string) {
    return jwt.sign(payload, JWT_KEY);
  }

  verifyJwt(jwtToken: string, JWT_KEY: string) {
    return jwt.verify(jwtToken, JWT_KEY) as JwtPayload;
  }

  async pwdToHash(password: string) {
    const salt = randomBytes(8).toString("hex");
    const buf = (await scryptAsync(password, salt, 64)) as Buffer;

    return `${buf.toString("hex")}.${salt}`;
  }

  async pwdCompare(storedPassword: string, suppliedPassword: string) {
    const [hashedPassword, salt] = storedPassword.split(".");
    const buf = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer;

    return buf.toString("hex") === hashedPassword;
  }
}

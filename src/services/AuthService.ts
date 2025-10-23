import jwt from "jsonwebtoken";
import { decode, verify } from "jsonwebtoken";
import { User } from "../entities/User.js";
import { Services } from "./Services.js";

export class AuthService {
  private readonly services: Services;

    constructor(services: Services) {
        this.services = services;
    }
  generateToken(user: User): string {
    return jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET!,
      {
        algorithm: "HS256",
        expiresIn: "1h",
      }
    );
  }

  generateAndSetTokenCookie(res: any, user: User) {
    const token = this.generateToken(user);
    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      domain:
        process.env.NODE_ENV === "production"
          ? "CHANGE_THIS_TO_DOMAIN_WHERE_FRONTEND_IS_HOSTED"
          : undefined,
    });
  }
  removeTokenCookie(res: any){
    res.clearCookie("access_token", {
      domain:
        process.env.NODE_ENV === "production"
          ? "CHANGE_THIS_TO_DOMAIN_WHERE_FRONTEND_IS_HOSTED"
          : undefined,
    })
  }
}

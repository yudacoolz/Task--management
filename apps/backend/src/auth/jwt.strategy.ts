import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { Strategy, ExtractJwt } from "passport-jwt";
import { UserRepository } from "./user.repository";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtPayload } from "./jwt-payload.interface";
import { User } from "./entity/user.entity";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository
    ) {
        super({
            secretOrKey: 'secretKey',
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        })
    }

    async validate(payload: JwtPayload): Promise<User> {
        const { username } = payload;
        const user = await this.userRepository.findOne({ where: { username } });

        if (!user) {
            throw new UnauthorizedException();
        }

        return user;
    }

}
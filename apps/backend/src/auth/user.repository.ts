import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { DataSource, Repository } from 'typeorm';
import { User } from "./entity/user.entity";
import { AuthCredentialDto } from './dto/auth-credential.dto';
import { Logger } from "@nestjs/common";
import * as bcrypt from 'bcrypt';
import { JwtService } from "@nestjs/jwt";
import { JwtPayload } from "./jwt-payload.interface";

@Injectable()
export class UserRepository extends Repository<User> {

    private logger = new Logger('UserRepository');

    constructor(
        private dataSource: DataSource,
        private jwtService: JwtService
    ) {
        super(User, dataSource.createEntityManager());
    }

    async createUser(authCredentialDto: AuthCredentialDto): Promise<void> {
        this.logger.log(`Creating new user with Payload : ${JSON.stringify(authCredentialDto)}`);

        const { username, password } = authCredentialDto;

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt)

        const user = this.create({
            username,
            password: hashedPassword
        })

        try {
            await this.save(user)
        } catch (error) {
            this.logger.error(`Failed to create user with Payload : ${JSON.stringify(authCredentialDto)} with error code : ${error.code}`, error.stack);
            if (error.code === '23505') {
                // duplicate username
                throw new ConflictException('Username already exists');
            } else {
                throw new InternalServerErrorException();
            }
        }

    }

    async login(authCredentialDto: AuthCredentialDto): Promise<{ accessToken: string }> {
        const { username, password } = authCredentialDto;

        const user = await this.findOne({ where: { username } });


        if (user && await bcrypt.compare(password, user.password)) {

            const payload: JwtPayload = { id: user.id, username: user.username, role: user.role };
            const accessToken: string = await this.jwtService.sign(payload);
            return { accessToken };
        } else {
            throw new UnauthorizedException('Credential Not Matches')
        }
    }
}
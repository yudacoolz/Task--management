import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository'
import { AuthCredentialDto } from './dto/auth-credential.dto';
import { User } from './entity/user.entity';


@Injectable()
export class AuthService {
    constructor(
        private readonly userRepository: UserRepository
    ) { }

    async signUp(authCredentialDto: AuthCredentialDto): Promise<void> {
        return this.userRepository.createUser(authCredentialDto);
    }

    async signIn(authCredentialDto: AuthCredentialDto): Promise<{ accessToken: string }> {
        return this.userRepository.login(authCredentialDto);
    }

}

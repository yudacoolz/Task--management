import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import { User } from './entity/user.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) { }

    @Post('/signup')
    signUp(@Body() authCredentialDto: AuthCredentialDto): Promise<void> {
        return this.authService.signUp(authCredentialDto);
    }

    @Post('/signin')
    signIn(@Body() authCredentialDto: AuthCredentialDto): Promise<{ accessToken: string }> {
        return this.authService.signIn(authCredentialDto);
    }

    @Post('/test')
    @UseGuards(AuthGuard())
    test(@Req() req: Express.Request) {
        console.log(req.user);
    }
}

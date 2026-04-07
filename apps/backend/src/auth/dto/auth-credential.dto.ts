import { IsNotEmpty, IsString, MinLength, MaxLength, Matches } from "class-validator";

export class AuthCredentialDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    @MaxLength(20)
    username: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    @MaxLength(20)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'password is too weak',
    })
    password: string;
}
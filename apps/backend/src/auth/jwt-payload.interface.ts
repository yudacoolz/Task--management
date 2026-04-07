import { UserRole } from "./enum/user-role.enum";

export interface JwtPayload {
    id: string;
    username: string;
    role: UserRole;
}
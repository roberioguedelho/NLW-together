import { getCustomRepository } from "typeorm"
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { UsersRepositories } from "../repositories/UsersRespositories"
import { Subject } from "typeorm/persistence/Subject";


interface IAuthenticateRequest {
    email: string;
    password: string;
}

class AuthenticateUserService {

    async execute({email, password}: IAuthenticateRequest) {

        const usersRepositories = getCustomRepository(UsersRepositories);

        const user = await usersRepositories.findOne({
            email
        })

        if (!user) {
            throw new Error("Email/Password incorrect")
        }

        const passwordMatch = await compare(password, user.password);

        if(!passwordMatch) {
            throw new Error("Email/Password incorrect")
        }

        const token = sign({
                email: user.email
            }, "4a97f3a89bbb5a6ba47a00303f2448e2", {
                subject: user.id,
                expiresIn: "1d"
            }
        );

        return token;

    }

}

export {AuthenticateUserService}
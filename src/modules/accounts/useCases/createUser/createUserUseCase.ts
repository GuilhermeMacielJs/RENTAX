import { hash } from "bcryptjs";
import { inject, injectable } from "tsyringe";

import { AppError } from "@errors/AppError";
import { ICreateUserDTO } from "@modules/accounts/dtos/ICreateUsersDTO";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";

@injectable()
class CreateUserUseCase {
    constructor(
        @inject("UsersRepository")
        private usersRepository: IUsersRepository
    ) {}
    async execute({
        name,
        password,
        email,
        driver_license,
        avatar,
    }: ICreateUserDTO): Promise<void> {
        try {
            const userAlreadyExists = await this.usersRepository.findByEmail(
                email
            );
            if (userAlreadyExists) {
                throw new AppError("User already exists", 400);
            }
            const passwordHash = await hash(password, 8);
            this.usersRepository.create({
                name,
                password: passwordHash,
                email,
                driver_license,
                avatar,
            });
        } catch (error) {
            console.log(error);
        }
    }
}

export { CreateUserUseCase };

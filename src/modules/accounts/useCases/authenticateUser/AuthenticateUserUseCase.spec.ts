import { AppError } from "../../../../errors/AppError";
import { ICreateUserDTO } from "../../dtos/ICreateUsersDTO";
import { UsersRepositoryInMemory } from "../../repositories/in-memory/UsersRepositoryInMemory";
import { CreateUserUseCase } from "../createUser/createUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

describe("Authenticate User", () => {
    let authenticateUserUseCase: AuthenticateUserUseCase;
    let usersRepositoryInMemory: UsersRepositoryInMemory;
    let createUserUseCase: CreateUserUseCase;
    beforeEach(() => {
        usersRepositoryInMemory = new UsersRepositoryInMemory();
        authenticateUserUseCase = new AuthenticateUserUseCase(
            usersRepositoryInMemory
        );
        createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    });
    it("Should be able to authenticate a user", async () => {
        const user: ICreateUserDTO = {
            name: "Guilherme",
            password: "123",
            driver_license: "1",
            email: "guilherme.maciel@alcans.com.br",
        };
        await createUserUseCase.execute(user);

        const result = await authenticateUserUseCase.execute({
            email: user.email,
            password: user.password,
        });
        expect(result).toHaveProperty("token");
    });

    it("Should not be able to authenticate an nanoexistent user", () => {
        expect(async () => {
            await authenticateUserUseCase.execute({
                email: "false@alcans.com.br",
                password: "1234",
            });
        }).rejects.toBeInstanceOf(AppError);
    });

    it("Should not be to authenticate with incorrect password", async () => {
        expect(async () => {
            const user: ICreateUserDTO = {
                name: "Guilherme",
                password: "123",
                driver_license: "1",
                email: "guilherme.maciel@alcans.com.br",
            };

            await createUserUseCase.execute(user);

            await authenticateUserUseCase.execute({
                email: user.email,
                password: "1235478",
            });
        }).rejects.toBeInstanceOf(AppError);
    });
});

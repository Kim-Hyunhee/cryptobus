import { User } from "../entity";
import "reflect-metadata";
import { getRepository } from "typeorm";

const UserService = {
  postUser: async ({
    idealFarmUserId,
    name,
    email,
  }: {
    idealFarmUserId: number;
    name: string;
    email: string;
  }) => {
    const user = new User();
    user.idealFarmUserId = idealFarmUserId;
    user.name = name;
    user.email = email;

    const savedUser = await User.save(user);

    return savedUser.id;
  },

  getUser: async ({
    idealFarmUserId,
    userId,
  }: {
    idealFarmUserId?: number;
    userId?: number;
  }) => {
    const oneUser = getRepository(User).createQueryBuilder();

    if (idealFarmUserId) {
      oneUser.where("idealFarmUserId = :idealFarmUserId", { idealFarmUserId });
    } else {
      oneUser.where("id = :userId", { userId });
    }

    const user = await oneUser.getOne();

    return user;
  },

  patchUserIsAuto: async ({
    userId,
    isAuto,
  }: {
    userId: number;
    isAuto: number;
  }) => {
    await getRepository(User)
      .createQueryBuilder()
      .update(User)
      .set({ isAuto })
      .where("id = :userId", { userId })
      .execute();
  },

  patchUserOpenAPI: async ({
    userId,
    accessKey,
    secretKey,
  }: {
    userId: number;
    accessKey: string;
    secretKey: string;
  }) => {
    await getRepository(User)
      .createQueryBuilder()
      .update(User)
      .set({ accessKey, secretKey })
      .where("id = :userId", { userId })
      .execute();
  },

  deleteUser: async ({ userId }: { userId: number }) => {
    await getRepository(User)
      .createQueryBuilder()
      .delete()
      .from(User)
      .where("id = :userId", { userId })
      .execute();
  },

  getUsers: async ({
    isAuto,
    isOpenApi,
    isFcmToken,
  }: {
    isAuto?: number;
    isOpenApi?: number;
    isFcmToken?: number;
  }) => {
    const users = getRepository(User).createQueryBuilder().where("1=1");

    if (isAuto) {
      users.andWhere("isAuto = :isAuto", { isAuto });
    }
    if (isOpenApi) {
      users
        .andWhere("length(accessKey) != 0")
        .andWhere("length(secretKey) != 0");
    }
    if (isFcmToken) {
      users.andWhere("length(fcmToken) != 0");
    }
    const userList = await users.getMany();

    return userList;
  },

  patchFcmToken: async ({
    fcmToken,
    userId,
  }: {
    fcmToken: string;
    userId: number;
  }) => {
    await getRepository(User)
      .createQueryBuilder()
      .update(User)
      .set({ fcmToken })
      .where("id = :userId", { userId })
      .execute();
  },
};
export default UserService;

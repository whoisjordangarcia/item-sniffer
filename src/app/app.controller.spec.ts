import * as testing from "@nestjs/testing";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { FormaService } from "src/forma/forma.service";

describe("AppController", () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: testing.TestingModule = await testing.Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService, FormaService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe("root", () => {
    it('should return "Two bedda!"', () => {
      expect(appController.getFormaStatus()).toBe("Hello World!");
    });
  });
});

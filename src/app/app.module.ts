import * as common from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { FormaService } from "src/forma/forma.service";

@common.Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, FormaService],
})
export class AppModule {}

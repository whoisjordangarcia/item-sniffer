import * as common from "@nestjs/common";
import { FormaService } from "src/forma/forma.service";

@common.Injectable()
export class AppService {
  formaService: FormaService;
  constructor(formaService: FormaService) {
    this.formaService = formaService;
  }

  async checkForma(): Promise<string> {
    return this.formaService.checkTwoBed();
  }
}

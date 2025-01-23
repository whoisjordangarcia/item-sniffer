import * as core from "@nestjs/core";
import { AppModule } from "./app/app.module";

async function bootstrap() {
  const app = await core.NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();

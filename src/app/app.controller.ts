import { Controller, Get, Res } from "@nestjs/common";
import { Response } from "express";
import { uint8ArrayToBase64 } from "src/forma/forma.utils";
import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getFormaStatus() {
    const result = await this.appService.checkForma();
    return result;
    // const base64Image = uint8ArrayToBase64(screenshot);
    //
    // const html = `
    //     <!DOCTYPE html>
    //     <html lang="en">
    //     <head>
    //       <meta charset="UTF-8">
    //       <meta name="viewport" content="width=device-width, initial-scale=1.0">
    //       <title>Screenshot</title>
    //     </head>
    //     <body>
    //       <img src="data:image/png;base64,${base64Image}" alt="Screenshot" />
    //     </body>
    //     </html>
    //   `;
    //
    // res.setHeader("Content-Type", "text/html");
    // res.send(html);
  }
}

import * as common from "@nestjs/common";
import puppeteer from "puppeteer-extra";
import StealthPlugin = require("puppeteer-extra-plugin-stealth");

puppeteer.use(StealthPlugin());

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

@common.Injectable()
export class FormaService {
  FORMA_URL =
    "https://rentformamiami.securecafe.com/onlineleasing/forma-miami/floorplans.aspx";

  async checkTwoBed(): Promise<string> {
    const browser = await puppeteer.launch({
      headless: false,
    });

    const page = await browser.newPage();

    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
    );
    await page.setExtraHTTPHeaders({
      "accept-language": "en-US,en;q=0.9",
    });

    await page.goto(this.FORMA_URL);

    const cookieBanner = await page.$("#onetrust-policy");
    if (cookieBanner) {
      await page.locator("button#onetrust-accept-btn-handler").click();
      console.log("Cookie banner dismissed.");
    }

    // 1 bedroom checkbox
    //jawait page.click('[id="1Bed"]');
    //console.log("Clicked 1 bedroom");

    await page.click('[id="2Bed"]');
    console.log("Clicked 2 bedroom");

    // update button
    await page.click("#btnUpdateFilter");
    console.log("Button Clicked");

    await delay(1000);

    const isTextPresent = await page.$eval(
      ".tab-pane.active",
      (container, text) => container?.textContent?.includes(text),
      "Floor plan details not available for this property.",
    );
    if (isTextPresent) {
      console.log("no 2 bedrooms available yet");
    }
    await delay(1000);
    const floorPlans = await page.$$(".FPTabLi");

    for (let i = 0; i < floorPlans.length; i++) {
      const activeContainer = ".tab-pane.active";
      const updatedFloorPlans = await page.$$(".FPTabLi");
      const floorPlanElement = updatedFloorPlans[i];

      if (!floorPlanElement) continue; // Ensure the element exists

      const floorPlan = await page.evaluate(
        (el) => el.textContent?.trim(),
        floorPlanElement,
      );

      console.log(`Identified floorPlan: ${floorPlan} is available`);
      await floorPlanElement.click();

      await delay(1000);

      const data = await page.evaluate((containerSelector) => {
        const container = document.querySelector(containerSelector);

        if (!container) return null;

        return {
          floorPlanName:
            container
              .querySelector('[data-selenium-id="FloorPlanName"]')
              ?.textContent?.trim() || null,
          availability:
            container
              .querySelector('[data-selenium-id="FloorPlanAvailability"]')
              ?.textContent?.trim() || null,
          bed:
            container
              .querySelector('[data-selenium-id*="Bed_"]')
              ?.textContent?.trim() || null,
          bath:
            container
              .querySelector('[data-selenium-id*="Bath_"]')
              ?.textContent?.trim() || null,
          sqft:
            container
              .querySelector('[data-selenium-id*="Sqft_"]')
              ?.textContent?.trim() || null,
          rent:
            container
              .querySelector('[data-selenium-id*="Rent_"]')
              ?.textContent?.trim() || null,
        };
      }, activeContainer);

      console.log(data);

      await page.waitForSelector(
        `${activeContainer} [data-selenium-id*="Apply_"] button`,
        {
          visible: true,
        },
      );

      console.log("Apply Now button found, clicking...");
      // await page.click(
      //   `${activeContainer} [data-selenium-id*="Apply_"] button`,
      // );

      const targetUrl = await page.evaluate(() => {
        const button = document.querySelector(
          `.tab-pane.active [data-selenium-id*="Apply_"] button`,
        );
        return button
          ? button.getAttribute("onclick") || button.getAttribute("href")
          : null; // Extract URL
      });
      const newPage = await browser.newPage();

      const randomValue = Math.random();

      const newUrl = targetUrl!
        .replace(
          /location.href = '/,
          "https://rentformamiami.securecafe.com/onlineleasing/forma-miami/",
        ) // Replace the base URL
        .replace(/\s*\+\s*\$\('#FltxtMoveInDate'\)\.val\(\)\s*/, "") // Remove jQuery .val() reference
        .replace(/\s*\+\s*''\s*/, "") // Remove stray '' strings
        .replace(/\+ Math\.random\(\) \+/, `&t=${randomValue}&`) // Replace Math.random()
        .replace(/'\s*\+\s*'&t='/, "&t=") // Remove `'+ '&t='`
        .replace(/&\s*'/, "") // Remove stray `& '` at the end
        .replace(/'$/, "") // Remove the trailing single quote
        .replace(";", "")
        .replace(/'$/, "");

      console.log(newUrl);
      await newPage.goto(newUrl, { waitUntil: "networkidle2" });
      await delay(5000);
      console.log("Closing tab");
      await newPage.close();

      await delay(500);
    }

    await delay(50000);
    //const screenshot = await page.screenshot({ type: "png" });
    await browser.close();
    return "end";
  }
}

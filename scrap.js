import puppeteer from "puppeteer";

async function scrap() {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  await page.goto("https://www.cnnbrasil.com.br/pop/");
  await page.waitForNetworkIdle();

  const result = await page.evaluate(() => {
    const news = [];

    const titles = document.querySelectorAll(
      "div > div > ul > li > a > div > div.home__list__tag > h3"
    );

    const publicationDates = document.querySelectorAll(
      "div > div > ul > li > div > span.home__title__date"
    );

    if (titles.length !== publicationDates.length) return [];

    titles.forEach((title, index) => {
      const titleText = title.textContent.trim();
      const publicationDateText = publicationDates[index]?.textContent.trim();

      news.push({
        title: titleText,
        publication_date: publicationDateText,
      });
    });

    return news.sort(
      (a, b) => new Date(b.publication_date) - new Date(a.publication_date)
    );
  });

  browser.close();
  console.log("Titles of the latest Pop news from CNN Brasil:\n", result);

  return result;
}

scrap().then(() => console.log("Scrapping done!"));

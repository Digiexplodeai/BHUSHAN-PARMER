const fs = require('fs');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const html = fs.readFileSync('dist/index.html', 'utf8');
const dom = new JSDOM(html, { runScripts: "dangerously" });
setTimeout(() => {
  const el = dom.window.document.querySelector("div#root > div > main > div > section:nth-of-type(2) > div:nth-of-type(1) > div:nth-of-type(2) > div:nth-of-type(2) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1)");
  if (el) {
    console.log("FOUND:", el.outerHTML);
  } else {
    console.log("NOT FOUND in static DOM. Trying to wait longer or check structure.");
    const section = dom.window.document.querySelector("div#root > div > main > div > section:nth-of-type(2)");
    if(section) {
        console.log("SECTION 2 HTML:");
        console.log(section.innerHTML.substring(0, 500));
    }
  }
}, 1000);

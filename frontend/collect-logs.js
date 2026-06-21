import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  const logs = [];
  page.on('console', msg => {
    const text = msg.text();
    if (
      text.includes('DashboardPage') ||
      text.includes('loadDashboard') ||
      text.includes('handleNoteSearchChange') ||
      text.includes('SEARCH_EFFECT') ||
      text.includes('setNoteSearch') ||
      text.includes('setNotes')
    ) {
      logs.push(text);
      if (logs.length >= 50) {
        console.log('--- COLLECTED LOGS START ---');
        logs.slice(0, 50).forEach(l => console.log(l));
        console.log('--- COLLECTED LOGS END ---');
        browser.close();
      }
    }
  });
  // Vite dev server currently runs on 5174 (fallback port)
  await page.goto('http://localhost:5174', { waitUntil: 'networkidle2' });
  // Perform a signup (creates a new user) to trigger the dashboard loop
  await page.waitForSelector('input[type="email"]');
  // Use the login form (no signup required). Fill email and password and submit.
  await page.type('input[type="email"]', 'test@example.com');
  await page.type('input[type="password"]', 'password');
  await page.click('button[type="submit"]');
  // give the app some time to navigate to the dashboard and produce logs
  await new Promise(r => setTimeout(r, 20000));
  // if not enough logs, output what we have
  console.log('--- COLLECTED LOGS START ---');
  logs.forEach(l => console.log(l));
  console.log('--- COLLECTED LOGS END ---');
  await browser.close();
})();

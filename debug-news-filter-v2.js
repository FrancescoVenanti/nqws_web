const https = require('https');
const fs = require('fs');

const API_URL = "https://notizie-ai-agent.news-agent.workers.dev/api/news?limit=50&lang=en";

https.get(API_URL, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            const items = json.data || [];

            let log = `Success: ${json.success}\n`;
            log += `Total items: ${items.length}\n`;

            if (items.length > 0) {
                log += `First item keys: ${Object.keys(items[0]).join(', ')}\n`;
                log += `First item full: ${JSON.stringify(items[0], null, 2)}\n`;
            }

            items.forEach((item, index) => {
                if (index < 3) {
                    log += `Item ${index} date field: ${item.date}\n`;
                }
            });

            fs.writeFileSync('debug-output.txt', log);
            console.log("Debug output written to debug-output.txt");

        } catch (e) {
            console.error("Error:", e.message);
        }
    });
}).on("error", (err) => {
    console.error("Fetch Error:", err.message);
});

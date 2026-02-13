const https = require('https');

const API_URL = "https://notizie-ai-agent.news-agent.workers.dev/api/news?limit=50&lang=en";

console.log("Fetching from:", API_URL);

https.get(API_URL, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            console.log("Success:", json.success);

            const items = json.data || [];
            console.log("Total items fetched:", items.length);

            const now = new Date();
            const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

            console.log("Current time:", now.toISOString());
            console.log("24h ago:", oneDayAgo.toISOString());

            console.log("First item structure:", JSON.stringify(items[0], null, 2));

            let keptCount = 0;

            items.forEach((item, index) => {
                console.log(`Raw date item ${index}:`, item.date);
                let itemDate;
                try {
                    itemDate = new Date(item.date);
                } catch (e) {
                    console.error("Date parse error for", item.date);
                    return;
                }

                const hasDesc = !!(item.description && item.description.trim());
                const isRecent = !isNaN(itemDate.getTime()) && itemDate >= oneDayAgo;

                if (index < 5) {
                    console.log(`\nItem ${index}:`);
                    console.log(`- Title: ${item.title}`);
                    console.log(`- Date: ${item.date} (${itemDate.toISOString()})`);
                    console.log(`- Has Description: ${hasDesc}`);
                    console.log(`- Is Recent: ${isRecent}`);
                    if (!isRecent) console.log(`  -> TOO OLD (Diff: ${(oneDayAgo.getTime() - itemDate.getTime()) / 1000 / 3600} hours older than limit)`);
                }

                if (hasDesc && isRecent) {
                    keptCount++;
                }
            });

            console.log(`\nTotal kept items: ${keptCount}`);

        } catch (e) {
            console.error("Error:", e.message);
        }
    });
}).on("error", (err) => {
    console.error("Fetch Error:", err.message);
});

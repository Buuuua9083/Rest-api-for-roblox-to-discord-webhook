const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/visualizer', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/', async (req, res) => {
    try {
      const response = await axios.get(`${req.protocol}://${req.host}/data`);
      res.send(`App received: ${response.data.message}`);
    } catch (error) {
      res.status(500).send('Failed to fetch data');
    }
});

app.get('/health', (req, res) => {
    res.send("OK");
});

app.get('/data', (req, res) => {
    res.json(storedData);
});
app.post('/receive-data', (req, res) => {
  const payload = req.body;
  console.log('Received from Roblox:', payload.message);
  res.send('Data received!');

  const baseUrl = `${req.protocol}://${req.host}/visualizer`;
  const blockData = payload.blocks || payload;
  const query = encodeURIComponent(JSON.stringify(blockData));
  const viewerUrl = `${baseUrl}/?blocks=${query}`;


  const embed = {
    title: '🎮 Roblox Webhook Data',
    description: `New data received from Roblox game\n\n**[View in 3D Viewer](${viewerUrl})**`,
    color: 0x5865F2,
    fields: [
      { name: 'Source', value: 'Roblox Game', inline: true },
      { name: 'Timestamp', value: new Date().toLocaleString(), inline: true },
      {
        name: 'Payload (Preview)',
        value: `\`\`\`json\n${JSON.stringify(payload, null, 2).substring(0, 1000)}\n\`\`\``
      }
    ],
  };

  const webhookUrl = 'https://discord.com/api/webhooks/1429547257539203104/3C5ner-S8J-MOUoPiI9KF8NgjKiGeRRdqtqqxuXgLm_OGpXnvWgFiRvqSTRbryB8XXaQ';
  axios.post(webhookUrl, { embeds: [embed] })
    .then(() => console.log('Discord webhook sent successfully!'))
    .catch(err => console.error('Discord webhook failed:', err));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`listening on port ${PORT}`));
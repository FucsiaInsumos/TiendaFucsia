const app = require('./src/app.js');
const { conn } = require('./src/data');
const { PORT } = require('./src/config/envs.js');
const { initializeSystemData } = require ('./src/utils/initializeSystemData.js');
require('dotenv').config();

// Syncing all the models at once.
conn.sync({ alter : true }).then(async () => {
  await initializeSystemData();
  app.listen(PORT, () => {
    console.log(`🚀 listening on port: ${PORT} 🚀`);
  });
});


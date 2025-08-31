// modify-firebase-json.js
const fs = require('fs');
const firebaseConfig = JSON.parse(fs.readFileSync('firebase.json', 'utf-8'));
const firebasercConfig = JSON.parse(fs.readFileSync('.firebaserc', 'utf-8'));

// Get the site name from environment variables
const siteId = 'jarvisdev-b6c41';

  firebasercConfig.projects.default = siteId;
  fs.writeFileSync('.firebaserc', JSON.stringify(firebasercConfig, null, 2));

  firebaseConfig.hosting.site = siteId;
  fs.writeFileSync('firebase.json', JSON.stringify(firebaseConfig, null, 2));

module.exports = {
  apps: [
    {
      script: "npm start",
    },
  ],

  deploy: {
    production: {
      user: "root",
      host: "nnisarg.in",
      ref: "origin/master",
      repo: "https://github.com/nnisarggada/phonebook.git",
      path: "/root/phonebook",
      "pre-deploy-local": "",
      "post-deploy":
        "npm install && npm run build && pm2 reload ecosystem.config.js --env production",
      "pre-setup": "",
    },
  },
};

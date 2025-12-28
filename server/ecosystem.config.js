module.exports = {
  apps: [{
    name: "portfolio-server",
    script: "server.js",
    watch: false,
    env: {
      NODE_ENV: "production",
      PORT: 5000
    }
  }]
};
const { createClient } = require('redis');

const redisUrl = process.env.REDIS_CONNECTION;

const client = createClient({
  url: redisUrl
});

client.on('error', (err) => console.log('❌ Redis Error:', err.message));
client.on('connect', () => console.log('🔄 Redis connecting...'));
client.on('ready', () => console.log('✅ Redis ready'));

module.exports = client;
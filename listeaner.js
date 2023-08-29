const net = require('net');
const crypto = require('crypto');
const Influx = require('influx');
const data = require('./data.json');

const influx = new Influx.InfluxDB({
  host: 'localhost',
  database: 'mydb',
  schema: [
    {
      measurement: 'encrypted_data',
      fields: {
        name: Influx.FieldType.STRING,
        origin: Influx.FieldType.STRING,
        destination: Influx.FieldType.STRING
      },
      tags: ['secret_key']
    }
  ]
});

const server = net.createServer(socket => {
  console.log('Listener connected');

  socket.on('data', data => {
    const encryptedMessages = data.toString().split('|');
    
    encryptedMessages.forEach(encryptedMessage => {
      const payload = decryptPayload(encryptedMessage);
      saveToDatabase(payload);
    });
  });

  socket.on('close', () => {
    console.log('Listener disconnected');
  });
});

function decryptPayload(encryptedMessage) {
  const key = crypto.randomBytes(32); // AES-256 key size
  const iv = crypto.randomBytes(16); // Initialization vector
  const decipher = crypto.createDecipheriv('aes-256-ctr', key, iv);
  const decrypted = decipher.update(encryptedMessage, 'hex', 'utf8') + decipher.final('utf8');
  return JSON.parse(decrypted);
}

function saveToDatabase(payload) {
  influx.writePoints([
    {
      measurement: 'encrypted_data',
      fields: payload,
      tags: { secret_key: payload.secret_key }
    }
  ])
  .catch(err => {
    console.error(`Error saving data to database: ${err}`);
  });
}

server.listen(4000, () => {
  console.log('Listener listening on port 4000');
});

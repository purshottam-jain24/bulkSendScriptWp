const qrcode = require("qrcode-terminal");
const { Client, LocalAuth } = require("whatsapp-web.js");
const fs = require("fs");

let contacts;
try {
  contacts = JSON.parse(fs.readFileSync("res.json"));
} catch (error) {
  console.error("Failed to read data.json:", error);
  return;
}

const client = new Client({
  authStrategy: new LocalAuth(),
});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Client is ready!");

  const messageTemplate = (name) => `
  Sample message
  `;

  contacts.forEach((contact, index) => {
    const phoneNumber = `91${contact.contact}`;
    const message = messageTemplate(contact.name);
    setTimeout(() => {
      client
        .sendMessage(phoneNumber + "@c.us", message)
        .then((response) => {
          console.log(`Message sent to ${contact.name}`);
        })
        .catch((err) => {
          console.error(`Failed to send message to ${contact.name}:`, err);
        });
    }, index * 3000);
  });
});

client.initialize();
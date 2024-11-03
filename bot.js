const WebSocket = require('ws');

// Create a WebSocket server
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
    console.log('New client connected');

    // When a new quote is added, send it to the overlay
    ws.on('message', (message) => {
        console.log(`Received: ${message}`);
    });
});

// Function to send quotes to overlay
function sendToOverlay(newQuote) {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(newQuote)); // Send the quote as a JSON string
        }
    });
}

// Existing bot code...
const tmi = require('tmi.js');

// Configuration for the bot
const opts = {
    identity: {
        username: 'oklahoma5238',
        password: '5ydq9wzfgahccazsax8vtnq5ep3zd9' // Generate a token at https://twitchtokengenerator.com/
    },
    channels: [
        'lilesco10' // Channel to connect to
    ]
};

// Create a client with the options
const client = new tmi.Client(opts);
let quotes = []; // Array to store quotes

// Connect the bot to Twitch
client.connect();

// Listen for chat messages
client.on('chat', (channel, userstate, message, self) => {
    if (self) return; // Ignore messages from the bot

    // Example command: Respond to "!hello"
    if (message.trim() === '!hello') {
        client.say(channel, `Hello, ${userstate['display-name']}!`);
    }
    
    if (message.startsWith('!quote ')) {
        const quoteText = message.substring(7);
        const author = userstate.username;
        const newQuote = { text: quoteText, author };
        quotes.push(newQuote);
        client.say(channel, `Quote added: "${quoteText}" by ${author}`);
        
        // Send the new quote to the overlay
        sendToOverlay(newQuote); // This sends the quote to connected overlay clients
    }
    

    // Display a specific quote
    if (message.startsWith('!displayquote ')) {
        const index = parseInt(message.split(' ')[1]) - 1; // Convert to zero-based index
        if (quotes[index]) {
            const { text, author } = quotes[index];
            client.say(channel, `Displaying quote: "${text}" by ${author}`);
            // Optionally, send to overlay
            // sendToOverlay(quotes[index]);
        } else {
            client.say(channel, `Quote not found.`);
        }
    }

    // Remove a specific quote
    if (message.startsWith('!removequote ')) {
        const index = parseInt(message.split(' ')[1]) - 1; // Convert to zero-based index
        if (quotes[index]) {
            quotes.splice(index, 1); // Remove the quote
            client.say(channel, `Quote removed.`);
        } else {
            client.say(channel, `Quote not found.`);
        }
    }
});

let quotes = []; // Array to store quotes
let currentQuoteIndex = 0; // Index of the current quote
let autoRotateInterval; // Interval for auto-rotation

// Connect to WebSocket server
const socket = new WebSocket('ws://localhost:8080'); // Update this URL if your server is hosted elsewhere

socket.onopen = () => {
    console.log('Connected to the WebSocket server');
};

socket.onmessage = (event) => {
    const newQuote = JSON.parse(event.data); // Parse the incoming quote
    receiveQuote(newQuote.text, newQuote.author); // Call the receiveQuote function to handle the new quote
};

// Function to add a quote from the input fields
function addQuote() {
    const quoteInput = document.getElementById("quote-input").value;
    const authorInput = document.getElementById("author-input").value;

    if (quoteInput.trim() === "") {
        alert("Please enter a quote.");
        return;
    }

    const newQuote = {
        text: quoteInput,
        author: authorInput || "Unknown" // Default to "Unknown" if no author is provided
    };

    quotes.push(newQuote); // Add the new quote to the array
    document.getElementById("quote-input").value = ""; // Clear input field
    document.getElementById("author-input").value = ""; // Clear author field

    // Send the new quote to the WebSocket server
    socket.send(JSON.stringify(newQuote)); // Send the quote to the server

    if (quotes.length === 1) {
        showQuote(currentQuoteIndex); // Show the first quote immediately
    }
}

// Function to show the current quote
function showQuote(index) {
    if (quotes.length === 0) return; // If no quotes, do nothing
    const quote = quotes[index];
    document.getElementById("quote-text").textContent = quote.text;
    document.getElementById("quote-author").textContent = `— ${quote.author}`;
}

// Function to go to the next quote
function nextQuote() {
    currentQuoteIndex = (currentQuoteIndex + 1) % quotes.length; // Loop back to start
    showQuote(currentQuoteIndex);
}

// Function to go to the previous quote
function prevQuote() {
    currentQuoteIndex = (currentQuoteIndex - 1 + quotes.length) % quotes.length; // Loop back to end
    showQuote(currentQuoteIndex);
}

// Function to start auto-rotation
function startAutoRotate() {
    if (document.getElementById("auto-rotate").checked) {
        autoRotateInterval = setInterval(nextQuote, 20000); // Change quote every 20 seconds
    } else {
        clearInterval(autoRotateInterval); // Clear interval if unchecked
    }
}

// Call startAutoRotate whenever the checkbox changes
document.getElementById("auto-rotate").addEventListener("change", startAutoRotate);

// Function to receive quotes from Twitch (to be called from your bot)
function receiveQuote(quoteText, quoteAuthor) {
    const newQuote = {
        text: quoteText,
        author: quoteAuthor || "Unknown"
    };
    quotes.push(newQuote);
    showQuote(quotes.length - 1); // Display the newly added quote
}

// MOOD BOARD
// Define the paths to each mood image
const moods = {
    suspense: 'assets/suspense.jpg',
    romance: 'assets/romance.jpg',
    mystery: 'assets/mystery.jpg'
    // Add more moods if needed
};

// Function to change the mood
function changeMood(selectedMood) {
    const moodImage = document.getElementById('current-mood');
    
    // Start fade-out effect
    moodImage.classList.remove('fade');
    moodImage.style.opacity = 0;

    // Wait for fade-out, then change image and fade back in
    setTimeout(() => {
        moodImage.src = moods[selectedMood];
        moodImage.classList.add('fade');
        moodImage.style.opacity = 1;
    }, 500);
}

/* VIEWER RATING */
let streamerRating = 0; // Streamer's rating
let viewerRatings = []; // Array to store viewer ratings

// Function to set the streamer's rating
function setStreamerRating(rating) {
    streamerRating = rating;
    document.getElementById("streamer-rating-value").textContent = `Rating: ${streamerRating}/5`;
}

// Function to set the viewer's rating
function setViewerRating(rating) {
    viewerRatings.push(rating);
    updateViewerRating();
}

// Function to update the average viewer rating
function updateViewerRating() {
    const total = viewerRatings.reduce((sum, current) => sum + current, 0);
    const average = (total / viewerRatings.length).toFixed(1); // Calculate average
    document.getElementById("viewer-rating-value").textContent = `Average Viewer Rating: ${average}/5`;
}

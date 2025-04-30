Ⲱⲩⲛⲓⲁⲧⲕ: Coptic AI
Ⲱⲩⲛⲓⲁⲧⲕ: Coptic AI is an open-source web application designed to enrich the spiritual lives of Coptic Orthodox Christians by providing access to liturgical resources, scripture, and wisdom. Built entirely with JavaScript, it offers a responsive chatbot interface delivering Agpeya prayers, daily saints from the Synaxarium, random Bible verses, Desert Fathers sayings, and an AI-powered Coptic Guide chat. Rooted in the Coptic liturgical calendar, it connects users to the rhythms of the Coptic Orthodox Church. Developed as of Baramouda 21, 1741 (April 29, 2025), during the 2nd Week of Holy Fifty Days, this project blends tradition with technology under the MIT License.
Table of Contents

Features
Prerequisites
Installation
Usage
Project Structure
JSON Data Format
Contributing
Troubleshooting
Future Enhancements
License
Contact

Features
Liturgical Calendar

Converts Gregorian dates to Coptic dates (e.g., April 29, 2025 → Baramouda 21, 1741).
Determines liturgical periods (e.g., Holy Fifty Days, Nativity Fast, Great Lent) based on Pascha.
Displays current Coptic date and liturgical context (e.g., "Baramouda 21, 1741 • 2nd Week of Holy Fifty Days").

Agpeya Prayers

Provides time-based Agpeya prayers (e.g., First Hour, Midnight Hour) with Psalm verses.
Example: "First Hour: Blessed is the man who has not walked in the counsel of the ungodly... Psalm 1:1".

Daily Saints

Retrieves Synaxarium data for the saint of the day (e.g., "The Martyrdom of Saint Babnuda" on Baramouda 20).
Includes fallback data if external data loading fails.

Bible Verses

Offers random verses from Old Testament, New Testament, and Deuterocanonical books.
Example: "John 3:16 - For God so loved the world...".

Desert Fathers Sayings

Shares wisdom from Desert Fathers, formatted as "Abba Anthony: [saying]".
Ensures variety by avoiding consecutive repeats of the same father.

Coptic Guide AI Chat

Embeds an iframe from YesChat.ai’s Coptic Guide GPT (link) for queries like "Translate peace into Coptic" → "hirēnē" (ⲏⲣḗnḗ).
Toggleable with "Show/Hide Extended Coptic Guide AI Chat" button.

User Interface

Responsive chat UI with fade-in/out animations for messages.
Persists chat content and button states in localStorage.
Displays loading indicators and error messages for failed data fetches.

Data Management

Loads JSON data for Synaxarium, Bible, and Desert Fathers with retry mechanisms.
Processes Desert Fathers data in key-value or figures formats.

Error Handling

Gracefully handles missing DOM elements, invalid dates, or failed data fetches with fallback content.
Logs errors to the console for debugging.

Prerequisites

Browser: Modern browser (Chrome, Firefox, Edge) with JavaScript enabled.
Internet Connection: Required for Coptic Guide AI iframe and optional hosted JSON data.
Data Files:
synaxarium/[month].json (e.g., Baramouda.json for Synaxarium entries).
new_testament.json, old_testament.json, deuterocanonical.json (Bible verses).
sayings-of-the-desert-fathers/[letter].json (e.g., alpha.json for Desert Fathers sayings).



Installation

Clone the Repository:
git clone https://github.com/jabrah234/coptic_ai.git
cd coptic_ai


Set Up Data Files:

Place JSON files in the appropriate directories:synaxarium/
  Baramouda.json
  ...
sayings-of-the-desert-fathers/
  alpha.json
  beta.json
  ...
new_testament.json
old_testament.json
deuterocanonical.json


Alternatively, host JSON files on a server and update fetch URLs in script.js (e.g., replace synaxarium/Baramouda.json with https://your-server.com/synaxarium/Baramouda.json).


Serve the Application:

Use a local server (e.g., Python’s HTTP server):python -m http.server 8080


Open http://localhost:8080 in a browser.


Verify Setup:

Ensure UI loads with correct Coptic date and liturgical period (e.g., "Baramouda 21, 1741 • 2nd Week of Holy Fifty Days").
Check browser console (F12 → Console) for errors related to missing JSON files or DOM elements.



Usage

Access the Application:

Navigate to http://localhost:8080 (or hosted URL).
Interface displays:
Current Coptic date and liturgical period.
Chat window with initial message: "Select an option to begin".
Action buttons: Agpeya, Saint, Scripture, Desert Fathers, Clear Chat, Show/Hide Coptic Guide AI Chat.




Interact with Features:

Agpeya Prayer: Click "Agpeya" to display a time-based prayer (e.g., "Sixth Hour: Save me, O God...") with fade-in animation.
Saint of the Day: Click "Saint" to view daily saint (e.g., "Today's Saint Commemoration: Saint Babnuda").
Bible Verse: Click "Scripture" for a random verse (e.g., "John 3:16").
Desert Fathers Saying: Click "Desert Fathers" for a saying (e.g., "Abba Anthony: Silence is salvation").
Coptic Guide AI Chat: Click "Show Extended Coptic Guide AI Chat" to display YesChat.ai iframe for queries like "Translate peace into Coptic". Click "Hide" to collapse.
Clear Chat: Click "Clear Chat" to reset conversation and button states.


Persistent State:

Chat messages and button states are saved in localStorage, restoring previous content on reload.


Liturgical Context:

UI top shows dynamic Coptic date and liturgical period (e.g., "Baramouda 21, 1741 • 2nd Week of Holy Fifty Days").



Project Structure
coptic_ai/
├── index.html                # Main HTML file with chatbot UI
├── styles.css                # CSS for styling the chat interface
├── script.js                 # JavaScript logic for liturgical calculations and UI
├── synaxarium/               # Synaxarium JSON files for daily saints
│   ├── Baramouda.json
│   └── ...
├── sayings-of-the-desert-fathers/ # Desert Fathers sayings JSON files
│   ├── alpha.json
│   └── ...
├── new_testament.json        # New Testament Bible verses
├── old_testament.json        # Old Testament Bible verses
├── deuterocanonical.json     # Deuterocanonical Bible verses
├── LICENSE                   # MIT License file
└── README.md                 # This documentation file

JSON Data Format
The application relies on JSON files for dynamic content. Expected formats:
Synaxarium (synaxarium/Baramouda.json)
{
  "20 Baramouda": {
    "feasts": ["The Martyrdom of Saint Babnuda"],
    "summary": "Commemoration of Saint Babnuda’s martyrdom."
  },
  ...
}

Bible (new_testament.json)
{
  "books": [
    {
      "name": "John",
      "verses": [
        { "chapter": 3, "verse": 16, "text": "For God so loved the world..." },
        ...
      ]
    },
    ...
  ]
}

Desert Fathers (sayings-of-the-desert-fathers/alpha.json)
{
  "Abba Anthony": [
    { "text": "Silence is salvation." },
    ...
  ]
}

Or (figures format):
{
  "figures": [
    { "name": "Abba Pambo", "saying": { "text": "Speak only when necessary." } },
    ...
  ]
}

Contributing
We welcome contributions to enhance Ⲱⲩⲛⲓⲁⲧⲕ: Coptic AI. To contribute:

Fork the Repository:
git clone https://github.com/jabrah234/coptic_ai.git


Create a Branch:
git checkout -b feature/your-feature


Make Changes:

Follow ESLint standards for JavaScript.
Update/add JSON files or features (e.g., multilingual support).
Test thoroughly in a browser.


Submit a Pull Request:

Describe changes in the PR description.
Ensure tests pass and no console errors occur.



Code of Conduct:

Be respectful and inclusive.
Follow project coding standards.

Join our community to preserve Coptic heritage and make spiritual resources accessible!
Troubleshooting

Missing DOM Element:

Error: "Missing DOM element: chatBox".
Solution: Ensure index.html includes <div id="chatBox">, <div id="buttons">, <div id="liturgicalDate">, and <div id="aiChatContainer">.


Failed to Load JSON:

Error: "Failed to fetch synaxarium/Baramouda.json".
Solution: Verify JSON files exist or update fetch URLs to a hosted server.


Iframe Not Loading:

Error: "Failed to load Coptic Guide AI iframe."
Solution: Check internet connection or confirm YesChat.ai URL (link).


Incorrect Coptic Date:

Error: "Unknown Date" in liturgical context.
Solution: Ensure getCopticDate handles edge cases; test with April 29, 2025.


Console Errors- Solution: Open browser console (F12 → Console) and share error messages for debugging.


Future Enhancements

Direct AI Integration: Replace iframe with direct API calls to YesChat.ai’s Coptic Guide GPT (pending API access from support@yeschat.ai).
Mobile App: Develop iOS/Android versions using React Native.
Multilingual Support: Add Arabic and Coptic script for prayers, saints, and sayings.
Offline Mode: Cache JSON data in localStorage or Service Workers.

License
This project is licensed under the MIT License. See the LICENSE file for details.
Contact

Email: jacob.h.abraham@gmail.com
GitHub Issues: https://github.com/jabrah234/coptic_ai/issues
YesChat.ai Support: For iframe or AI-related issues, contact support@yeschat.ai.


“Blessed are the blameless in the way, who walk in the law of the Lord.” — Psalm 118:1

Developed during the 2nd Week of Holy Fifty Days, Baramouda 21, 1741.

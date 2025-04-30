Ⲱⲟⲩⲛⲓⲁⲧⲕ: Coptic AI
 
Ⲱⲟⲩⲛⲓⲁⲧⲕ: Coptic AI is a web-based application designed to enrich the spiritual lives of Coptic Orthodox Christians by providing easy access to liturgical resources, scripture, and wisdom. Built entirely with JavaScript, the application offers a responsive chatbot interface that delivers Agpeya prayers, daily saints from the Synaxarium, random Bible verses, Desert Fathers sayings, and an interactive AI-powered Coptic Guide chat. Rooted in the Coptic liturgical calendar, it connects users to the rhythms of the Coptic Orthodox Church.
Developed as of Baramouda 21, 1741 (April 29, 2025), during the 2nd Week of Holy Fifty Days, this project blends tradition with technology, serving clergy, laity, and scholars seeking to deepen their faith.
Features

Liturgical Calendar:
Converts Gregorian dates to Coptic dates (e.g., April 29, 2025 → Baramouda 21, 1741).
Determines liturgical periods (e.g., Holy Fifty Days, Nativity Fast, Great Lent) based on the date of Pascha.
Displays the current Coptic date and liturgical context (e.g., "Baramouda 21, 1741 • 2nd Week of Holy Fifty Days").


Agpeya Prayers:
Provides time-based Agpeya prayers (e.g., First Hour, Midnight Hour) with associated Psalm verses.
Example: "First Hour: Blessed is the man who has not walked in the counsel of the ungodly... Psalm 1:1".


Daily Saints:
Retrieves Synaxarium data for the saint of the day (e.g., "The Martyrdom of Saint Babnuda" on Baramouda 20).
Includes fallback data if external data loading fails.


Bible Verses:
Offers random verses from the Old Testament, New Testament, and Deuterocanonical books.
Example: "John 3:16 - For God so loved the world...".


Desert Fathers Sayings:
Shares wisdom from the Desert Fathers, formatted as "Abba Anthony: [saying]".
Ensures variety by avoiding consecutive repeats of the same father.


Coptic Guide AI Chat:
Embeds an iframe from YesChat.ai’s Coptic Guide GPT (https://www.yeschat.ai/gpts-9t563I1Lfm8-Coptic-Guide) for extended queries (e.g., "Translate peace into Coptic" → "hirēnē" (ⲏⲣḗnḗ)).
Toggleable with a "Show/Hide Extended Coptic Guide AI Chat" button for seamless integration.


User Interface:
Responsive chat UI with fade-in and fade-out animations for messages.
Persists chat content and button states in localStorage for continuity across sessions.
Displays loading indicators and error messages for failed data fetches.


Data Management:
Loads JSON data for Synaxarium, Bible, and Desert Fathers sayings with retry mechanisms to handle network issues.
Processes Desert Fathers data in key-value or figures formats for compatibility.


Error Handling:
Gracefully handles missing DOM elements, invalid dates, or failed data fetches with fallback content.
Logs errors to the console for debugging.



Prerequisites

Browser: Modern browser (Chrome, Firefox, Edge) with JavaScript enabled.
Internet Connection: Required for loading the Coptic Guide AI iframe and optional hosted JSON data.
Data Files:
synaxarium/[month].json (e.g., Baramouda.json for Synaxarium entries).
new_testament.json, old_testament.json, deuterocanonical.json (for Bible verses).
sayings-of-the-desert-fathers/[letter].json (e.g., alpha.json for Desert Fathers sayings).



Installation

Clone the Repository:
git clone https://github.com/[your-username]/coptic-cross.git
cd coptic-cross


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

Use a local server to serve the files (e.g., Python’s HTTP server):python -m http.server 8080


Open http://localhost:8080 in a browser to access the application.


Verify Setup:

Ensure the UI loads with the correct Coptic date and liturgical period (e.g., "Baramouda 21, 1741 • 2nd Week of Holy Fifty Days").
Check the console (F12 → Console) for errors related to missing JSON files or DOM elements.



Usage

Access the Application:

Navigate to http://localhost:8080 (or your hosted URL).
The interface displays:
The current Coptic date and liturgical period at the top.
A chat window with an initial message: "Select an option to begin".
Action buttons for Agpeya, Saint, Scripture, Desert Fathers, Clear Chat, and Show/Hide Coptic Guide AI Chat.




Interact with Features:

Agpeya Prayer:
Click the "Agpeya" button to display a time-based prayer based on the current hour (e.g., "Sixth Hour: Save me, O God...").
The prayer appears in the chat with a fade-in animation.


Saint of the Day:
Click the "Saint" button to view the daily saint (e.g., "Today's Saint Commemoration: Saint Babnuda").
The saint’s name and summary are displayed in the chat.


Bible Verse:
Click the "Scripture" button to retrieve a random Bible verse (e.g., "John 3:16").
The verse is shown in the chat window.


Desert Fathers Saying:
Click the "Desert Fathers" button to see a saying (e.g., "Abba Anthony: Silence is salvation").
Sayings are formatted with the father’s name and text.


Coptic Guide AI Chat:
Click "Show Extended Coptic Guide AI Chat" to display the YesChat.ai iframe.
Enter queries like "Translate peace into Coptic" directly in the iframe to get responses (e.g., "hirēnē" (ⲏⲣḗnḗ)).
Click "Hide Extended Coptic Guide AI Chat" to collapse the iframe.


Clear Chat:
Click "Clear Chat" to reset the conversation and button states, restoring the initial message.




Persistent State:

Chat messages and button states (e.g., whether Agpeya was clicked) are saved in localStorage.
Reloading the page restores the previous chat content and state.


Liturgical Context:

The top of the UI shows the Coptic date and liturgical period, updated dynamically (e.g., "Baramouda 21, 1741 • 2nd Week of Holy Fifty Days").
This context enhances the relevance of prayers and saints displayed.



Project Structure
coptic-cross/
├── index.html              # Main HTML file with chatbot UI
├── styles.css              # CSS for styling the chat interface
├── script.js               # JavaScript logic for liturgical calculations and UI
├── synaxarium/             # Synaxarium JSON files for daily saints
│   ├── Baramouda.json
│   └── ...
├── sayings-of-the-desert-fathers/  # Desert Fathers sayings JSON files
│   ├── alpha.json
│   └── ...
├── new_testament.json      # New Testament Bible verses
├── old_testament.json      # Old Testament Bible verses
├── deuterocanonical.json   # Deuterocanonical Bible verses
└── README.md               # This documentation file

JSON Data Format
The application relies on JSON files for dynamic content. Below are the expected formats:

Synaxarium (synaxarium/Baramouda.json):
{
  "20 Baramouda": {
    "feasts": ["The Martyrdom of Saint Babnuda"],
    "summary": "Commemoration of Saint Babnuda’s martyrdom."
  },
  ...
}


Bible (new_testament.json):
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


Desert Fathers (sayings-of-the-desert-fathers/alpha.json):
{
  "Abba Anthony": [
    { "text": "Silence is salvation." },
    ...
  ]
}

Or (for figures format):
{
  "figures": [
    { "name": "Abba Pambo", "saying": { "text": "Speak only when necessary." } },
    ...
  ]
}



Contributing
We welcome contributions to enhance Coptic Cross. To contribute:

Fork the Repository:
git clone https://github.com/[your-username]/coptic-cross.git


Create a Branch:
git checkout -b feature/your-feature


Make Changes:

Follow ESLint standards for JavaScript.
Update JSON files or add new features (e.g., multilingual support).
Test thoroughly in a browser.


Submit a Pull Request:

Describe your changes in the PR description.
Ensure tests pass and no console errors occur.



Troubleshooting

Missing DOM Element:
Error: "Missing DOM element: chatBox".
Solution: Ensure index.html includes <div id="chatBox">, <div id="loading">, <div id="liturgical-context">, and <div id="greetingBox">.


Failed to Load JSON:
Error: "Failed to fetch synaxarium/Baramouda.json".
Solution: Verify JSON files exist in the correct directories or update fetch URLs to point to a hosted server.


Iframe Not Loading:
Error: "Failed to load Coptic Guide AI iframe."
Solution: Check internet connection or confirm the YesChat.ai URL (https://www.yeschat.ai/gpts-9t563I1Lfm8-Coptic-Guide) is accessible.


Incorrect Coptic Date:
Error: "Unknown Date" in liturgical context.
Solution: Ensure getCopticDate handles edge cases; test with known dates like April 29, 2025.


Console Errors:
Solution: Open the browser console (F12 → Console) and share error messages for debugging.



Future Enhancements

Direct AI Integration: Replace the iframe with direct API calls to YesChat.ai’s Coptic Guide GPT (pending API access from support@yeschat.ai).
Mobile App: Develop iOS/Android versions using React Native for broader accessibility.
Multilingual Support: Add Arabic and Coptic script for prayers, saints, and sayings.
Offline Mode: Cache JSON data in localStorage or Service Workers for offline access.
Expanded Synaxarium: Include more detailed saint biographies and feast descriptions.

License
This project is licensed under the MIT License. See LICENSE for details.
Contact

Email: [your-email@example.com] 
GitHub Issues: [https://github.com/[your-username]/coptic-cross/issues]
YesChat.ai Support: For iframe or AI-related issues, contact support@yeschat.ai.


“Blessed are the blameless in the way, who walk in the law of the Lord.” — Psalm 118:1
Developed during the 2nd Week of Holy Fifty Days, Baramouda 21, 1741.
Ⲱⲟⲩⲛⲓⲁⲧⲕ: Coptic AI
 
Ⲱⲟⲩⲛⲓⲁⲧⲕ: Coptic AI is an open-source web application designed to enrich the spiritual lives of Coptic Orthodox Christians by providing access to liturgical resources, scripture, and wisdom. Built entirely with JavaScript, this project offers a responsive chatbot interface delivering Agpeya prayers, daily saints from the Synaxarium, random Bible verses, Desert Fathers sayings, and an AI-powered Coptic Guide chat. Rooted in the Coptic liturgical calendar, it connects users to the rhythms of the Coptic Orthodox Church.
Developed as of Baramouda 21, 1741 (April 29, 2025), during the 2nd Week of Holy Fifty Days, this project is released under the MIT License to encourage community contributions from clergy, laity, scholars, and developers worldwide. We invite you to contribute to this blend of tradition and technology to deepen faith and preserve Coptic heritage.
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

Liturgical Calendar:

Converts Gregorian dates to Coptic dates (e.g., April 29, 2025 → Baramouda 21, 1741).
Determines liturgical periods (e.g., Holy Fifty Days, Nativity Fast, Great Lent) based on the date of Pascha.
Displays the current Coptic date and liturgical context (e.g., "Baramouda 21, 1741 • 2nd Week of Holy Fifty Days").


Agpeya Prayers:

Provides time-based Agpeya prayers (e.g., First Hour, Midnight Hour) with associated Psalm verses.
Example: "First Hour: Blessed is the man who has not walked in the counsel of the ungodly... Psalm 1:1".


Daily Saints:

Retrieves Synaxarium data for the saint of the day (e.g., "The Martyrdom of Saint Babnuda" on Baramouda 20).
Includes fallback data if external data loading fails.


Bible Verses:

Offers random verses from the Old Testament, New Testament, and Deuterocanonical books.
Example: "John 3:16 - For God so loved the world...".


Desert Fathers Sayings:

Shares wisdom from the Desert Fathers, formatted as "Abba Anthony: [saying]".
Ensures variety by avoiding consecutive repeats of the same father.


Coptic Guide AI Chat:

Embeds an iframe from YesChat.ai’s Coptic Guide GPT (https://www.yeschat.ai/gpts-9t563I1Lfm8-Coptic-Guide) for extended queries (e.g., "Translate peace into Coptic" → "hirēnē" (ⲏⲣḗnḗ)).
Toggleable with a "Show/Hide Extended Coptic Guide AI Chat" button for seamless integration.


User Interface:

Responsive chat UI with fade-in and fade-out animations for messages.
Persists chat content and button states in localStorage for continuity across sessions.
Displays loading indicators and error messages for failed data fetches.


Data Management:

Loads JSON data for Synaxarium, Bible, and Desert Fathers sayings with retry mechanisms to handle network issues.
Processes Desert Fathers data in key-value or figures formats for compatibility.


Error Handling:

Gracefully handles missing DOM elements, invalid dates, or failed data fetches with fallback content.
Logs errors to the console for debugging.



Prerequisites

Browser: Modern browser (Chrome, Firefox, Edge) with JavaScript enabled.
Internet Connection: Required for loading the Coptic Guide AI iframe and optional hosted JSON data.
Data Files:
synaxarium/[month].json (e.g., Baramouda.json for Synaxarium entries).
new_testament.json, old_testament.json, deuterocanonical.json (for Bible verses).
sayings-of-the-desert-fathers/[letter].json (e.g., alpha.json for Desert Fathers sayings).



Installation

Clone the Repository:
git clone https://github.com/[your-username]/coptic-cross.git
cd coptic-cross


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

Use a local server to serve the files (e.g., Python’s HTTP server):python -m http.server 8080


Open http://localhost:8080 in a browser to access the application.


Verify Setup:

Ensure the UI loads with the correct Coptic date and liturgical period (e.g., "Baramouda 21, 1741 • 2nd Week of Holy Fifty Days").
Check the browser console (F12 → Console) for errors related to missing JSON files or DOM elements.



Usage

Access the Application:

Navigate to http://localhost:8080 (or your hosted URL).
The interface displays:
The current Coptic date and liturgical period at the top.
A chat window with an initial message: "Select an option to begin".
Action buttons for Agpeya, Saint, Scripture, Desert Fathers, Clear Chat, and Show/Hide Coptic Guide AI Chat.




Interact with Features:

Agpeya Prayer:
Click the "Agpeya" button to display a time-based prayer based on the current hour (e.g., "Sixth Hour: Save me, O God...").
The prayer appears in the chat with a fade-in animation.


Saint of the Day:
Click the "Saint" button to view the daily saint (e.g., "Today's Saint Commemoration: Saint Babnuda").
The saint’s name and summary are displayed in the chat.


Bible Verse:
Click the "Scripture" button to retrieve a random Bible verse (e.g., "John 3:16").
The verse is shown in the chat window.


Desert Fathers Saying:
Click the "Desert Fathers" button to see a saying (e.g., "Abba Anthony: Silence is salvation").
Sayings are formatted with the father’s name and text.


Coptic Guide AI Chat:
Click "Show Extended Coptic Guide AI Chat" to display the YesChat.ai iframe.
Enter queries like "Translate peace into Coptic" directly in the iframe to get responses (e.g., "hirēnē" (ⲏⲣḗnḗ)).
Click "Hide Extended Coptic Guide AI Chat" to collapse the iframe.


Clear Chat:
Click "Clear Chat" to reset the conversation and button states, restoring the initial message.




Persistent State:

Chat messages and button states (e.g., whether Agpeya was clicked) are saved in localStorage.
Reloading the page restores the previous chat content and state.


Liturgical Context:

The top of the UI shows the Coptic date and liturgical period, updated dynamically (e.g., "Baramouda 21, 1741 • 2nd Week of Holy Fifty Days").
This context enhances the relevance of prayers and saints displayed.



Project Structure
coptic-cross/
├── index.html              # Main HTML file with chatbot UI
├── styles.css              # CSS for styling the chat interface
├── script.js               # JavaScript logic for liturgical calculations and UI
├── synaxarium/             # Synaxarium JSON files for daily saints
│   ├── Baramouda.json
│   └── ...
├── sayings-of-the-desert-fathers/  # Desert Fathers sayings JSON files
│   ├── alpha.json
│   └── ...
├── new_testament.json      # New Testament Bible verses
├── old_testament.json      # Old Testament Bible verses
├── deuterocanonical.json   # Deuterocanonical Bible verses
├── LICENSE                 # MIT License file
└── README.md               # This documentation file

JSON Data Format
The application relies on JSON files for dynamic content. Below are the expected formats:

Synaxarium (synaxarium/Baramouda.json):
{
  "20 Baramouda": {
    "feasts": ["The Martyrdom of Saint Babnuda"],
    "summary": "Commemoration of Saint Babnuda’s martyrdom."
  },
  ...
}


Bible (new_testament.json):
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


Desert Fathers (sayings-of-the-desert-fathers/alpha.json):
{
  "Abba Anthony": [
    { "text": "Silence is salvation." },
    ...
  ]
}

Or (for figures format):
{
  "figures": [
    { "name": "Abba Pambo", "saying": { "text": "Speak only when necessary." } },
    ...
  ]
}



Contributing
As an open-source project, Ⲱⲩⲛⲓⲁⲧⲕ: Coptic AI thrives on community contributions. We welcome developers, designers, and Coptic scholars to enhance the project. To contribute:

Fork the Repository:
git clone https://github.com/[your-username]/coptic-cross.git


Create a Branch:
git checkout -b feature/your-feature


Make Changes:

Follow ESLint standards for JavaScript code.
Update or add JSON files for Synaxarium, Bible, or Desert Fathers data.
Add features like multilingual support or offline caching.
Test changes thoroughly in a browser to ensure no console errors.


Submit a Pull Request:

Describe your changes in the PR description, including the purpose and impact.
Ensure tests pass and the UI renders correctly.
Reference any related issues (e.g., #issue-number).


Code of Conduct:

Be respectful and inclusive in all interactions.
Follow the project’s coding standards and guidelines.



Join our community to preserve Coptic heritage and make spiritual resources accessible to all!
Troubleshooting

Missing DOM Element:

Error: "Missing DOM element: chatBox".
Solution: Ensure index.html includes <div id="chatBox">, <div id="loading">, <div id="liturgical-context">, and <div id="greetingBox">.


Failed to Load JSON:

Error: "Failed to fetch synaxarium/Baramouda.json".
Solution: Verify JSON files exist in the correct directories or update fetch URLs to point to a hosted server.


Iframe Not Loading:

Error: "Failed to load Coptic Guide AI iframe."
Solution: Check internet connection or confirm the YesChat.ai URL (https://www.yeschat.ai/gpts-9t563I1Lfm8-Coptic-Guide) is accessible.


Incorrect Coptic Date:

Error: "Unknown Date" in liturgical context.
Solution: Ensure getCopticDate handles edge cases; test with known dates like April 29, 2025.


Console Errors:

Solution: Open the browser console (F12 → Console) and share error messages for debugging.



Future Enhancements

Direct AI Integration: Replace the iframe with direct API calls to YesChat.ai’s Coptic Guide GPT (pending API access from support@yeschat.ai).
Mobile App: Develop iOS/Android versions using React Native for broader accessibility.
Multilingual Support: Add Arabic and Coptic script for prayers, saints, and sayings.
Offline Mode: Cache JSON data in localStorage or Service Workers for offline access.

License
This project is licensed under the MIT License. See the LICENSE file for details.
Contact

Email: [jacob.h.abraham@gmail.com] 
GitHub Issues: [https://github.com/jabrah234/coptic_ai.git]
YesChat.ai Support: For iframe or AI-related issues, contact support@yeschat.ai.


“Blessed are the blameless in the way, who walk in the law of the Lord.” Psalm 118:1

Developed during the 2nd Week of Holy Fifty Days, Baramouda 21, 1741.

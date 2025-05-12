<h1>Ⲱⲩⲛⲓⲁⲧⲕ: Coptic AI </h1> 

[![GitHub Stars](https://img.shields.io/github/stars/jabrah234/coptic_ai)](https://github.com/jabrah234/coptic_ai/stargazers)

[![Netlify Status](https://api.netlify.com/api/v1/badges/ae26cc09-466f-430d-9456-2557e8fc2f72/deploy-status)](https://app.netlify.com/sites/coptic-ai/deploys)

A web app that enriches Coptic Orthodox Christian spiritual lives with liturgical resources, scripture, and AI-powered guidance. Access Agpeya prayers, daily saints, Bible verses, and Desert Fathers wisdom through a responsive chatbot interface!

Link to project: https://github.com/jabrah234/coptic_ai

_Alt tag: Responsive chatbot interface displaying Coptic liturgical date and prayer options_

<h2>🌐 Live Demo</h2>

* Try Ⲱⲩⲛⲓⲁⲧⲕ: Coptic AI at 
https://friendapp.world

<h2>🚀 Getting Started</h2>

To run Ⲱⲩⲛⲓⲁⲧⲕ: Coptic AI locally:


1. Clone the repository:

        git clone https://github.com/jabrah234/coptic_ai.git

2. Navigate to the project directory:

        cd coptic_ai

3. Serve the app using a local server (e.g., with VS Code’s Live Server extension or a simple HTTP server):

        npx http-server

4. Open http://localhost:8080 in your browser.
   

**Prerequisites**

* Modern web browser (Chrome, Firefox, Safari, Edge)

* Internet connection for fetching JSON data and AI integration via YesChat.ai

  
<h2>📷 Screenshots</h2>

Explore the Ⲱⲩⲛⲓⲁⲧⲕ: Coptic AI interface

<img width="1512" alt="Screenshot 2025-05-11 at 8 44 18 PM" src="https://github.com/user-attachments/assets/57164a18-64e7-47f1-9283-467df128acd2" />

<img width="976" alt="Screenshot 2025-05-11 at 8 45 52 PM" src="https://github.com/user-attachments/assets/4cc7286f-766c-4dc4-a598-25e7df36c7d8" />

<img width="673" alt="Screenshot 2025-05-11 at 8 46 45 PM" src="https://github.com/user-attachments/assets/fe9ea127-92ce-4d1e-a653-ebb9fafa0aa5" />

<h2>🛠️ How It's Made</h2>

* Tech used: HTML, CSS, JavaScript

This project is a love letter to Coptic Orthodox heritage, blending tradition with modern web tech. Built as a single-page application with vanilla JavaScript, HTML, and CSS, it showcases pure front-end craftsmanship. Here’s how it came together:

* **Responsive Chatbot UI**: Designed with CSS animations for smooth fade-in/out effects when displaying prayers, verses, or sayings, creating an engaging user experience.
* **Liturgical Logic**: JavaScript converts Gregorian dates to Coptic dates (e.g., April 29, 2025 → Baramouda 21, 1741) and determines liturgical periods based on Pascha.
* **Data Fetching**: Loads JSON files for Synaxarium saints, Bible verses, and Desert Fathers sayings, with retry mechanisms for reliability.
* **AI Integration**: Embeds an iframe from YesChat.ai’s Coptic Guide GPT for queries like translating "peace" to Coptic ("hirēnē").
* **State Persistence**: Uses localStorage to save chat messages and button states, ensuring continuity across page reloads.
* **Error Handling**: Implements fallback content for missing data or DOM elements, keeping the app functional under adverse conditions.

I poured my heart into making the UI intuitive and reverent, with clear buttons for each feature. Debugging complex date conversions and styling the chat window to feel modern yet spiritual were highlights of the journey!

<h2>⚡️ Optimizations</h2>

The app is designed to be both beautiful and efficient. Key optimizations include:

* **Efficient Data Loading**: JSON fetches use retry mechanisms to minimize failed requests, with fallback content ensuring usability.
* **LocalStorage Caching**: Persists chat messages and button states to reduce DOM manipulation on reload, boosting performance.
* **Lightweight Animations**: CSS animations use simple transforms and opacity changes to avoid heavy reflows, keeping the UI snappy.
* **No External Libraries**: Built with vanilla JavaScript and CSS for a lean footprint.
* **Refactored Date Logic**: Streamlined the getCopticDate function to handle edge cases (e.g., leap years) more cleanly, improving maintainability.

These tweaks ensure the app runs smoothly while preserving its spiritual essence.

<h2>📚 Lessons Learned</h2>

Building Ⲱⲩⲛⲓⲁⲧⲕ: Coptic AI was a technical and spiritual adventure. 

Key takeaways:

* **Mastering Date Math**: Cracking Gregorian-to-Coptic date conversion felt like decoding an ancient puzzle—seeing "Baramouda 21, 1741" display correctly was a triumph!
* **UI/UX Matters**: Small details like fade-in animations and clear button labels taught me how to craft a warm, user-friendly experience.
* **Resilient Code**: Implementing fallbacks for missing JSON files turned crashes into graceful recoveries, deepening my appreciation for robust error handling.
* **Purpose-Driven Coding**: Connecting users to Coptic heritage through tech reinforced my passion for building meaningful tools.

Each challenge was a chance to grow, and I’m hooked on creating impactful, user-focused apps!

<h2>🧪 Testing</h2>

To test Ⲱⲩⲛⲓⲁⲧⲕ: Coptic AI

1. Load the app in a browser.

2. Verify the Coptic date displays correctly (e.g., April 29, 2025 → Baramouda 21, 1741).

3. Test buttons for Agpeya prayers, Bible verses, and Desert Fathers sayings.

4. Interact with the AI chatbot to ensure responses are relevant.

Automated tests are not yet implemented but planned for future releases.


<h2>📅 Project Status & Roadmap</h2>

Ⲱⲩⲛⲓⲁⲧⲕ: Coptic AI is actively maintained. 

Current version: 1.0.0.

**Planned features**:

1. Offline Mode for Prayers and Verses

    * Enable offline access to essential prayers and liturgical verses.

2. Multilingual Support

    * Incorporate additional languages to make the app more accessible.

3. IPA File for iPhone

    * Build and export the app as an IPA file for iOS devices, enabling distribution either via the App Store or for direct installation.

See the Issues page for planned tasks.

<h2>🤝 Contributing</h2>

We welcome contributions to enhance Ⲱⲩⲛⲓⲁⲧⲕ: Coptic AI! 

To contribute:

1. Fork the repository.

2. Create a new branch (git checkout -b feature/your-feature).

3. Commit your changes (git commit -m "Add your feature").

4. Push to the branch (git push origin feature/your-feature).

5. Open a pull request.

Please check the Issues page for tasks or report bugs.

<h2>📜 License</h2>

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://github.com/jabrah234/coptic_ai/blob/main/LICENSE)

Licensed under the MIT License. See the LICENSE file for details.

<h2>🙏 Acknowledgments</h2>

* YesChat.ai for powering the Coptic Guide GPT.

* Coptic Orthodox Church for liturgical resources and inspiration.

* Open-source community for tools and tutorials.

<h2>📬 Contact</h2>

* GitHub Issues: https://github.com/jabrah234/coptic_ai/issues

<h2>🌟 Get Involved!</h2>

Try Ⲱⲩⲛⲓⲁⲧⲕ, share your feedback, and star the repo on GitHub to support the project. Let’s bring Coptic heritage to the digital age together!

<h2>🙏 Footer</h2>

_“Blessed are the blameless in the way, who walk in the law of the Lord.” — Psalm 118:1_

_Developed with ❤️ during the Second Week of the Holy Fifty Days, Baramouda 21, 1741._

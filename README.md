<h1>Ⲱⲩⲛⲓⲁⲧⲕ: Coptic AI</h1>

A web app that enriches Coptic Orthodox Christian spiritual lives with liturgical resources, scripture, and AI-powered guidance. Access Agpeya prayers, daily saints, Bible verses, and Desert Fathers wisdom through a responsive chatbot interface!

**Link to project:** https://github.com/jabrah234/coptic_ai

_Alt tag_: Responsive chatbot interface displaying Coptic liturgical date and prayer options

<h2> 🛠️ How It's Made</h2>


**Tech used**: 
* HTML, CSS, JavaScript
  

This project is a love letter to Coptic Orthodox heritage, blending tradition with modern web tech. Built as a single-page application with vanilla JavaScript, HTML, and CSS, it showcases pure front-end craftsmanship. Here’s how it came together:

* **Responsive Chatbot UI**: Designed with CSS animations for smooth fade-in/out effects when displaying prayers, verses, or sayings, creating an engaging user experience.
* **Liturgical Logic**: JavaScript converts Gregorian dates to Coptic dates (e.g., April 29, 2025 → Baramouda 21, 1741) and determines liturgical periods based on Pascha.
* **Data Fetching**: Loads JSON files for Synaxarium saints, Bible verses, and Desert Fathers sayings, with retry mechanisms for reliability.
* **AI Integration**: Embeds an iframe from YesChat.ai’s Coptic Guide GPT for queries like translating "peace" to Coptic ("hirēnē").
* **State Persistence**: Uses localStorage to save chat messages and button states, ensuring continuity across page reloads.
* **Error Handling**: Implements fallback content for missing data or DOM elements, keeping the app functional under adverse conditions.

I poured my heart into making the UI intuitive and reverent, with clear buttons for each feature. Debugging complex date conversions and styling the chat window to feel modern yet spiritual were highlights of the journey!

<h2>⚡️ Optimizations </h2>
The app is designed to be both beautiful and efficient. Key optimizations include:

* **Efficient Data Loading**: JSON fetches use retry mechanisms to minimize failed requests, with fallback content ensuring usability.
* **LocalStorage Caching**: Persists chat messages and button states to reduce DOM manipulation on reload, boosting performance.
* **Lightweight Animations**: CSS animations use simple transforms and opacity changes to avoid heavy reflows, keeping the UI snappy.
* **No External Libraries**: Built with vanilla JavaScript and CSS for a lean footprint.
* **Refactored Date Logic**: Streamlined the getCopticDate function to handle edge cases (e.g., leap years) more cleanly, improving maintainability.

These tweaks ensure the app runs smoothly while preserving its spiritual essence.

<h2>📚 Lessons Learned</h2>

Building Ⲱⲩⲛⲓⲁⲧⲕ: 
* Coptic AI was a technical and spiritual adventure. 

Key takeaways:

* Mastering Date Math: Cracking Gregorian-to-Coptic date conversion felt like decoding an ancient puzzle—seeing "Baramouda 21, 1741" display correctly was a triumph!
* UI/UX Matters: Small details like fade-in animations and clear button labels taught me how to craft a warm, user-friendly experience.
* Resilient Code: Implementing fallbacks for missing JSON files turned crashes into graceful recoveries, deepening my appreciation for robust error handling.
* Purpose-Driven Coding: Connecting users to Coptic heritage through tech reinforced my passion for building meaningful tools.

Each challenge was a chance to grow, and I’m hooked on creating impactful, user-focused apps!

<h2>📜 License</h2>

Licensed under the MIT License. See the LICENSE file for details.

<h2> 📬 Contact </h2>

* Email: jacob.h.abraham@gmail.com
* GitHub Issues: https://github.com/jabrah234/coptic_ai/issues

_“Blessed are the blameless in the way, who walk in the law of the Lord.” — Psalm 118:1
Developed with ❤️ during the 2nd Week of Holy Fifty Days, Baramouda 21, 1741._

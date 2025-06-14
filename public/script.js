/**
 * List of known Desert Mothers (Ammas) for gender identification.
 */
const knownAmmas = ['Sarah', 'Syncletica', 'Theodora'];

/**
 * DOM elements for the chatbot UI.
 */
const chatBox = document.getElementById('chatBox');
const loading = document.getElementById('loading');
const liturgicalContext = document.getElementById('liturgical-context');
const greetingBox = document.getElementById('greetingBox');
const now = new Date();
const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

/**
 * Global state.
 */
const state = {
  synaxariumData: {},
  newTestamentData: null,
  oldTestamentData: null,
  deuterocanonicalData: null,
  desertFathersData: [],
  lastDesertFather: null,
  lastBibleVerse: null,
  buttonStates: (() => {
    try {
      const savedStates = localStorage.getItem('buttonStates');
      const parsed = savedStates ? JSON.parse(savedStates) : null;
      if (parsed && typeof parsed === 'object' && 'agpeya' in parsed) {
        return parsed;
      }
      return { agpeya: false, saint: false, scripture: false, desertFathers: false };
    } catch (error) {
      console.error('Error parsing buttonStates:', error);
      return { agpeya: false, saint: false, scripture: false, desertFathers: false };
    }
  })(),
};

/**
 * Coptic data including Agpeya prayers.
 */
const copticData = {
  agpeya: [
    { id: 1, hour: 'First Hour', text: 'Blessed is the man who has not walked in the counsel of the ungodly, and has not stood in the way of the sinners, and has not sat in the seat of the evil men.', book: 'Psalm', chapter: 1, verse: 1 },
    { id: 2, hour: 'Third Hour', text: 'The Lord shall hear you in the day of your trouble, the name of the God of Jacob defend you.', book: 'Psalm', chapter: 19, verse: 1 },
    { id: 3, hour: 'Sixth Hour', text: 'Save me, O God, by Your name, and judge me by Your power.', book: 'Psalm', chapter: 53, verse: 1 },
    { id: 4, hour: 'Ninth Hour', text: 'Sing to the Lord a new song; sing to the Lord, all the earth.', book: 'Psalm', chapter: 95, verse: 1 },
    { id: 5, hour: 'Eleventh Hour', text: 'Praise the Lord, all you nations: let all the peoples praise Him.', book: 'Psalm', chapter: 116, verse: 1 },
    { id: 6, hour: 'Twelfth Hour', text: 'Out of the depths I have cried to You...', book: 'Psalm', chapter: 129, verse: 1 },
    { id: 7, hour: 'Veil Hour', text: 'When I cried out, God of my righteousness heard me: in tribulation You have made room for me; have compassion upon me, O Lord, and hear my prayer.', book: 'Psalm', chapter: 4, verse: 1 },
    { id: 8, hour: 'Midnight Hour', text: 'Blessed are the blameless in the way, who walk in the law of the Lord.', book: 'Psalm', chapter: 118, verseStart: 1, verseEnd: 3 }
  ]
};

// Coptic months
const copticMonths = ['Tout', 'Baba', 'Hator', 'Kiahk', 'Toba', 'Amshir', 'Baramhat', 'Baramouda', 'Bashans', 'Paona', 'Epep', 'Mesra', 'Nasie'];

/**
 * Decodes HTML entities.
 * @param {string} str - String to decode.
 * @returns {string} Decoded string.
 */
function decodeHTMLEntities(str) {
  const txt = document.createElement('textarea');
  txt.innerHTML = str;
  return txt.value;
}

/**
 * Strips <strong> tags.
 * @param {string} str - String to process.
 * @returns {string} String without <strong> tags.
 */
function stripStrongTags(str) {
  return str.replace(/<\/?strong>/gi, '');
}

/**
 * Creates a chat message element.
 * @param {string|Object} content - Message content.
 * @param {string} sender - Sender ('user' or 'ai').
 * @param {boolean} isCentered - Center the message.
 * @param {boolean} isDesertFathers - Apply Desert Fathers styling.
 * @param {boolean} isAgpeya - Apply Agpeya styling.
 * @returns {HTMLElement} Message element.
 */
const createChatMessage = (content, sender, isCentered = false, isDesertFathers = false, isAgpeya = false) => {
  const messageDiv = document.createElement('div');
  messageDiv.className = `chat-message ${sender}`;
  const bubbleDiv = document.createElement('div');
  bubbleDiv.className = `message-bubble${isCentered ? ' centered' : ''}`;

  if (isDesertFathers) {
    if (typeof content === 'string') {
      const match = content.match(/"([^"]+)" (Abba|Amma) (.+)/);
      if (match) {
        const sayingText = match[1];
        const prefix = match[2];
        const name = match[3];
        bubbleDiv.innerHTML = `<span>"${sayingText}"</span><span style="font-style:italic;"> - ${prefix} ${name}</span>`;
      } else {
        bubbleDiv.textContent = content;
      }
    } else {
      bubbleDiv.textContent = 'Invalid Desert Fathers saying';
      console.error('Invalid Desert Fathers content:', content);
    }
  } else if (isAgpeya) {
    if (content && typeof content === 'object' && content.text && content.hour) {
      const { text, book, chapter, verse, verseStart, verseEnd, hour } = content;
      const verseText = verse ? `${verse}` : verseStart && verseEnd ? `${verseStart}-${verseEnd}` : '';
      bubbleDiv.innerHTML = `<span>"${text}"</span>${book && chapter && verseText ? `<span style="font-style:italic;"> (${book} ${chapter}:${verseText})</span>` : ''}<span style="font-weight:bold;"> - ${hour}</span>`;
    } else {
      bubbleDiv.textContent = 'Invalid Agpeya prayer';
      console.error('Invalid Agpeya content:', content);
    }
  } else {
    bubbleDiv[/<[a-z][\s\S]*>/i.test(content) ? 'innerHTML' : 'textContent'] = content || 'Error: No content provided';
  }

  messageDiv.appendChild(bubbleDiv);
  setTimeout(() => messageDiv.className += ' fade-in', 10);
  return messageDiv;
};

/**
 * Displays initial greeting.
 */
const generateInitialMessages = () => {
  if (!greetingBox || !chatBox) {
    console.error('Missing greetingBox or chatBox');
    return;
  }
  greetingBox.innerHTML = '';
  chatBox.innerHTML = '';
  chatBox.appendChild(createChatMessage('Select an option to begin', 'ai', true));
};

/**
 * Clears greeting box.
 */
const clearGreeting = () => {
  if (!greetingBox) {
    console.error('Missing greetingBox');
    return;
  }
  const messages = greetingBox.getElementsByClassName('chat-message');
  for (const message of messages) {
    message.className += ' fade-out';
  }
  setTimeout(() => greetingBox.innerHTML = '', 300);
};

/**
 * Gets random item from array.
 * @param {Array} array - Array to select from.
 * @returns {*} Random item or null.
 */
const getRandomItem = (array) => {
  if (!array || !array.length) {
    console.error('Empty or undefined array');
    return null;
  }
  return array[Math.floor(Math.random() * array.length)];
};

/**
 * Fetches random Bible verse.
 * @returns {Promise<Object>} Verse object.
 */
const getRandomBibleVerse = async () => {
  const allBooks = [
    ...(state.newTestamentData?.books || []),
    ...(state.oldTestamentData?.books || []),
    ...(state.deuterocanonicalData?.books || [])
  ];

  if (!allBooks.length) {
    console.error('No Bible data loaded');
    return { book: 'Error', chapter: 0, verse: 0, text: 'Unable to retrieve verse', translation: '' };
  }

  let verse, verseKey, book;
  const maxAttempts = 10;
  let attempts = 0;

  while (attempts < maxAttempts) {
    const tempBook = getRandomItem(allBooks);
    if (tempBook?.verses?.length && tempBook.name) {
      const tempVerse = getRandomItem(tempBook.verses);
      if (tempVerse?.chapter && tempVerse.verse && tempVerse.text) {
        const tempVerseKey = `${tempBook.name} ${tempVerse.chapter}:${tempVerse.verse}`;
        if (!(allBooks.length > 1 && tempVerseKey === state.lastBibleVerse)) {
          book = tempBook;
          verse = tempVerse;
          verseKey = tempVerseKey;
          break;
        }
      }
    }
    attempts++;
  }

  if (!book || !verse || !verseKey) {
    console.error('No valid verse selected');
    return { book: 'Error', chapter: 0, verse: 0, text: 'Unable to retrieve verse', translation: '' };
  }

  state.lastBibleVerse = verseKey;
  return { book: book.name, chapter: verse.chapter, verse: verse.verse, text: verse.text, translation: '' };
};

/**
 * Selects random Desert Fathers saying.
 * @returns {Object} Saying object.
 */
const getRandomDesertFathersSaying = () => {
  if (!state.desertFathersData.length) {
    console.error('No Desert Fathers sayings loaded');
    return { father: 'Error', text: 'Unable to retrieve saying', gender: 'male' };
  }

  let sayingEntry;
  const maxAttempts = 10;
  let attempts = 0;

  do {
    sayingEntry = getRandomItem(state.desertFathersData);
    attempts++;
  } while (sayingEntry.father === state.lastDesertFather && attempts < maxAttempts && state.desertFathersData.length > 1);

  state.lastDesertFather = sayingEntry.father;
  return { father: sayingEntry.father, text: sayingEntry.text, gender: sayingEntry.gender };
};

/**
 * Checks if Coptic year is leap year.
 * @param {number} copticYear - Coptic year.
 * @returns {boolean} True if leap year.
 */
const isCopticLeap = (copticYear) => ((copticYear + 1) % 4) === 0;

/**
 * Converts Gregorian to Coptic date.
 * @param {Date|string} gregorianDate - Gregorian date.
 * @returns {Object} Coptic date object.
 */
const getCopticDate = (gregorianDate) => {
  try {
    const date = new Date(gregorianDate);
    if (isNaN(date.getTime())) throw new Error('Invalid Gregorian date');

    const gregorianYear = date.getFullYear();
    const copticYear = gregorianYear - 283 + (date < new Date(gregorianYear, 8, 11) ? -1 : 0);
    const isLeap = isCopticLeap(copticYear);
    const daysInYear = isLeap ? 366 : 365;

    let copticNewYear = new Date(gregorianYear, 8, 11);
    if (isLeap && (gregorianYear % 4 === 0 && gregorianYear % 100 !== 0) || (gregorianYear % 400 === 0)) {
      copticNewYear = new Date(gregorianYear, 8, 12);
    }
    if (date < copticNewYear) {
      copticNewYear.setFullYear(gregorianYear - 1);
    }

    const daysSinceNewYear = Math.floor((date - copticNewYear) / (1000 * 60 * 60 * 24));
    let totalCopticDays = daysSinceNewYear;
    if (totalCopticDays < 0) totalCopticDays += daysInYear;

    let monthIndex, day;
    if (totalCopticDays >= 360) {
      monthIndex = 12;
      day = totalCopticDays - 360 + 1;
    } else {
      monthIndex = Math.floor(totalCopticDays / 30);
      day = (totalCopticDays % 30) + 1;
    }

    const month = copticMonths[monthIndex];
    return { copticDate: `${month} ${day}`, month, day, copticYear };
  } catch (error) {
    console.error('Error in getCopticDate:', error);
    return { copticDate: 'Unknown Date', month: '', day: 0, copticYear: 0 };
  }
};

/**
 * Loads Synaxarium JSON files from synaxarium/.
 * @param {number} retries - Retry attempts.
 * @returns {Promise<void>}
 */
const loadAllSynaxarium = async (retries = 3) => {
  state.synaxariumData = {};
  for (const month of copticMonths) {
    let attempt = 1;
    let success = false;
    while (attempt <= retries && !success) {
      try {
        const response = await fetch(`/synaxarium/${month}.json`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const rawData = await response.json();
        state.synaxariumData[month] = {};

        Object.keys(rawData).forEach(dateKey => {
          const data = rawData[dateKey];
          let events;

          if (data.feasts && Array.isArray(data.feasts)) {
            events = data.feasts.map(feast => ({ event: feast, summary: 'No summary' }));
          } else if (Array.isArray(data)) {
            events = data.map(event => ({ event, summary: 'No summary' }));
          } else {
            events = [{ event: data?.event || 'No Saint Recorded', summary: 'No summary' }];
          }

          state.synaxariumData[month][dateKey] = events;
        });

        console.log(`Synaxarium loaded for ${month}: ${Object.keys(state.synaxariumData[month]).length} entries`);
        success = true;
      } catch (error) {
        console.error(`Error fetching synaxarium/${month}.json (Attempt ${attempt}):`, error);
        attempt++;
        if (attempt > retries) {
          console.warn(`Failed to load synaxarium for ${month}`);
        }
      }
    }
  }
};

/**
 * Retrieves saints' names for a Coptic date.
 * @param {string} month - Coptic month.
 * @param {number} day - Coptic day.
 * @returns {Array<string>} Array of saint names.
 */
const getSaintInfo = (month, day) => {
  try {
    if (!month || !copticMonths.includes(month) || !day || day < 1 || (month !== 'Nasie' && day > 30) || (month === 'Nasie' && day > 6)) {
      throw new Error(`Invalid Coptic date: ${month} ${day}`);
    }
    const dateKey = `${day} ${month}`;
    const monthData = state.synaxariumData[month];
    if (!monthData || !monthData[dateKey]) {
      console.warn(`No events for ${dateKey}`);
      return ['No Saint Recorded'];
    }
    const events = monthData[dateKey];
    console.log(`Events for ${dateKey}:`, events);

    const saintNames = [];
    events
      .filter(event => event && event.event && typeof event.event === 'string')
      .forEach(event => {
        let cleanName = event.event
          .replace(/^(Commemoration|Martyrdom|Departure|Appearance|Consecration|Assembly)\s*(of\s*(the\s*)?)?/i, '')
          .replace(/\s*(the\s*)?(Saint|Martyr|Prophet|Evangelist|Pope|Father|Bishop|Archbishop|Patriarch|Virgin|Mother|Disciple|Apostle|Righteous|Holy)?\s*/gi, '')
          .replace(/,\s*(the\s*)?\d+\w*\.\s*(Pope\s*of\s*Alexandria)?/gi, '')
          .trim();

        const names = cleanName.split(/\s+and\s+/i).map(name => name.trim());
        names.forEach(name => {
          if (name && name !== 'No Saint Recorded') saintNames.push(name);
        });
      });

    return saintNames.length ? saintNames : ['No Saint Recorded'];
  } catch (error) {
    console.error(`Error in getSaintInfo for ${month} ${day}:`, error);
    return ['Error retrieving saint'];
  }
};

/**
 * Loads Bible data.
 * @param {number} retries - Retry attempts.
 * @returns {Promise<void>}
 */
const loadBibleData = async (retries = 3) => {
  const files = ['new_testament.json', 'old_testament.json', 'deuterocanonical.json'];
  const dataKeys = ['newTestamentData', 'oldTestamentData', 'deuterocanonicalData'];
  for (let i = 0; i < files.length; i++) {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const response = await fetch(files[i]);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        state[dataKeys[i]] = await response.json();
        console.log(`${dataKeys[i].replace('Data', '')} loaded: ${state[dataKeys[i]].books?.length || 0} books`);
        break;
      } catch (error) {
        console.error(`Attempt ${attempt} - Failed to fetch ${files[i]}:`, error);
        if (attempt === retries) console.warn(`${dataKeys[i].replace('Data', '')} not loaded`);
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
  }
};

/**
 * Loads Desert Fathers sayings.
 * @param {number} retries - Retry attempts.
 * @returns {Promise<void>}
 */
const loadDesertFathersData = async (retries = 3) => {
  const greekAlphabet = ['alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta', 'eta', 'theta', 'iota', 'kappa', 'lambda', 'mu', 'nu', 'xi', 'omicron', 'pi', 'rho', 'sigma', 'tau', 'upsilon', 'phi', 'chi', 'psi', 'omega'];
  const promises = greekAlphabet.map(async letter => {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const response = await fetch(`sayings-of-the-desert-fathers/${letter}.json`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        const format = greekAlphabet.indexOf(letter) <= greekAlphabet.indexOf('omicron') ? 'key-value' : 'figures';
        processSayings(data, letter, format);
        break;
      } catch (error) {
        console.error(`Attempt ${attempt} - Failed to fetch ${letter}.json:`, error);
        if (attempt === retries) console.warn(`${letter}.json not loaded`);
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
  });
  await Promise.all(promises);
  console.log('Desert Fathers sayings loaded:', state.desertFathersData.length);
};

/**
 * Processes Desert Fathers sayings.
 * @param {Object|Array} data - Data to process.
 * @param {string} letter - Greek letter.
 * @param {string} format - Data format.
 */
const processSayings = (data, letter, format = 'key-value') => {
  let sayingsCount = 0;
  if (format === 'key-value') {
    if (data && typeof data === 'object' && !Array.isArray(data)) {
      for (const father in data) {
        if (data.hasOwnProperty(father) && Array.isArray(data[father])) {
          const cleanName = father.replace(/^(Abba|Amma)\s+/i, '').trim();
          const isAmma = knownAmmas.some(amma => cleanName.toLowerCase() === amma.toLowerCase());
          for (const saying of data[father]) {
            if (saying.text) {
              state.desertFathersData.push({ father: cleanName, text: saying.text, gender: isAmma ? 'female' : 'male' });
              sayingsCount++;
            }
          }
        }
      }
    } else if (Array.isArray(data)) {
      for (const entry of data) {
        if (entry.name && entry.saying) {
          const cleanName = entry.name.replace(/^(Abba|Amma)\s+/i, '').trim();
          const isAmma = knownAmmas.some(amma => cleanName.toLowerCase() === amma.toLowerCase());
          state.desertFathersData.push({ father: cleanName, text: entry.saying, gender: isAmma ? 'female' : 'male' });
          sayingsCount++;
        }
      }
    }
  } else if (format === 'figures') {
    if (data?.figures) {
      for (const figure of data.figures) {
        if (figure.name && figure.saying?.text) {
          const cleanName = figure.name.replace(/^(Abba|Amma)\s+/i, '').trim();
          const isAmma = knownAmmas.some(amma => cleanName.toLowerCase() === amma.toLowerCase());
          state.desertFathersData.push({ father: cleanName, text: figure.saying.text, gender: isAmma ? 'female' : 'male' });
          sayingsCount++;
        }
      }
    }
  }
  console.log(`Processed ${letter}: ${sayingsCount} sayings`);
};

/**
 * Gets time-based Agpeya prayer.
 * @returns {Promise<Object>} Selected prayer.
 */
const getTimeBasedAgpeyaPrayer = async () => {
  try {
    // Get current date for consistent slot definitions
    const baseDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    // Fetch user location
    let latitude, longitude, timezone;
    try {
      const ipRes = await fetch('https://ipapi.co/json/');
      if (!ipRes.ok) throw new Error(`IP API failed with status ${ipRes.status}`);
      const ipData = await ipRes.json();
      if (!ipData.latitude || !ipData.longitude || !ipData.timezone) throw new Error('Invalid IP API response');
      ({ latitude, longitude, timezone } = ipData);
      console.log('Location:', { latitude, longitude, timezone });
    } catch (error) {
      console.warn('IP API failed, using fallback location:', error);
      latitude = 40.7128; // New York as fallback (approx. EDT)
      longitude = -74.0060;
      timezone = 'America/New_York';
    }

    // Fetch sunrise/sunset data
    let sunrise, solarNoon, sunset;
    try {
      const sunRes = await fetch(`https://api.sunrise-sunset.org/json?lat=${latitude}&lng=${longitude}&date=${baseDate.toISOString().split('T')[0]}&formatted=0`);
      if (!sunRes.ok) throw new Error(`Sun API failed with status ${sunRes.status}`);
      const sunData = await sunRes.json();
      if (!sunData.results || !sunData.results.sunrise) throw new Error('Invalid Sun API response');
      sunrise = new Date(new Date(sunData.results.sunrise).toLocaleString('en-US', { timeZone: timezone }));
      solarNoon = new Date(new Date(sunData.results.solar_noon).toLocaleString('en-US', { timeZone: timezone }));
      sunset = new Date(new Date(sunData.results.sunset).toLocaleString('en-US', { timeZone: timezone }));
      console.log('Sun Data:', {
        sunrise: sunrise.toISOString(),
        solarNoon: solarNoon.toISOString(),
        sunset: sunset.toISOString()
      });
    } catch (error) {
      console.warn('Sun API failed, using fallback times:', error);
      sunrise = new Date(baseDate.getTime());
      sunrise.setHours(6, 0, 0, 0);
      solarNoon = new Date(baseDate.getTime());
      solarNoon.setHours(12, 0, 0, 0);
      sunset = new Date(baseDate.getTime());
      sunset.setHours(18, 0, 0, 0);
      console.log('Fallback Sun Data:', {
        sunrise: sunrise.toISOString(),
        solarNoon: solarNoon.toISOString(),
        sunset: sunset.toISOString()
      });
    }

    // Get current time in user's timezone
    const currentTime = new Date(new Date().toLocaleString('en-US', { timeZone: timezone }));
    console.log('Current Time:', currentTime.toISOString());

    // Normalize time slots to the current date
    const hourMap = [
  {
    hour: 'Midnight Hour',
    from: baseDate.setHours(0, 0, 0, 0),
    to: new Date(baseDate).setHours(5, 59, 59, 999) // Ends before First Hour
  },
  {
    hour: 'First Hour',
    from: new Date(baseDate).setHours(6, 0, 0, 0),
    to: new Date(baseDate).setHours(8, 59, 59, 999) // Ends before Third Hour
  },
  {
    hour: 'Third Hour',
    from: new Date(baseDate).setHours(9, 0, 0, 0),
    to: new Date(baseDate).setHours(11, 59, 59, 999) // Ends before Sixth Hour
  },
  {
    hour: 'Sixth Hour',
    from: new Date(baseDate).setHours(12, 0, 0, 0),
    to: new Date(baseDate).setHours(14, 59, 59, 999) // Ends before Ninth Hour
  },
  {
    hour: 'Ninth Hour',
    from: new Date(baseDate).setHours(15, 0, 0, 0),
    to: new Date(baseDate).setHours(16, 59, 59, 999) // Ends before Eleventh Hour
  },
  {
    hour: 'Eleventh Hour',
    from: new Date(baseDate).setHours(17, 0, 0, 0),
    to: new Date(baseDate).setHours(17, 59, 59, 999) // Ends before Twelfth Hour
  },
  {
    hour: 'Twelfth Hour',
    from: new Date(baseDate).setHours(18, 0, 0, 0),
    to: new Date(baseDate).setHours(18, 59, 59, 999) // Ends before Veil Hour
  },
  {
    hour: 'Veil Hour',
    from: new Date(baseDate).setHours(19, 0, 0, 0),
    to: new Date(baseDate).setHours(23, 59, 59, 999) // Ends at midnight
  }
];

    // Log time slots for debugging
    console.log('Hour Map:', hourMap.map(slot => ({
      hour: slot.hour,
      from: new Date(slot.from).toISOString(),
      to: new Date(slot.to).toISOString()
    })));

    // Find matching slot
    const slot = hourMap.find(({ from, to }) => currentTime.getTime() >= from && currentTime.getTime() < to);
    const selectedHour = slot ? slot.hour : 'First Hour';
    console.log('Selected Agpeya Hour:', selectedHour);

    // Find matching prayer
    const normalize = str => str.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '');
    const prayer = copticData.agpeya.find(p => normalize(p.hour) === normalize(selectedHour)) || copticData.agpeya[0];
    console.log('Selected Prayer:', prayer);

    return prayer;
  } catch (error) {
    console.error('Error in getTimeBasedAgpeyaPrayer:', error);
    return copticData.agpeya[0]; // Fallback to First Hour
  }
};

/**
 * Handles Agpeya prayer request.
 */
const handleAgpeya = async () => {
  if (!chatBox || !loading) {
    console.error('Missing chatBox or loading element');
    return;
  }
  if (state.buttonStates.agpeya) return;
  state.buttonStates.agpeya = true;
  localStorage.setItem('buttonStates', JSON.stringify(state.buttonStates));
  const button = document.getElementById('agpeyaButton');
  if (button) button.disabled = true;
  loading.style.display = 'block';

  try {
    const prayer = await getTimeBasedAgpeyaPrayer();
    if (!prayer || !prayer.text || !prayer.hour) {
      throw new Error('Invalid prayer object returned');
    }
    clearGreeting();
    chatBox.appendChild(createChatMessage(prayer, 'ai', false, false, true));
    localStorage.setItem('chatContent', chatBox.innerHTML);
  } catch (error) {
    console.error('Error in handleAgpeya:', error);
    clearGreeting();
    chatBox.appendChild(createChatMessage('Error retrieving Agpeya prayer', 'ai'));
    localStorage.setItem('chatContent', chatBox.innerHTML);
  } finally {
    loading.style.display = 'none';
    chatBox.scrollTop = chatBox.scrollHeight;
  }
};

/**
 * Handles saint of the day request.
 */
const handleSaint = async () => {
  if (!chatBox || !loading) {
    console.error('Missing chatBox or loading element');
    return;
  }
  if (state.buttonStates.saint) return;
  state.buttonStates.saint = true;
  localStorage.setItem('buttonStates', JSON.stringify(state.buttonStates));
  const button = document.getElementById('saintButton');
  if (button) button.disabled = true;
  loading.style.display = 'block';

  try {
    if (!Object.keys(state.synaxariumData).length) {
      console.log('Loading Synaxarium data...');
      await loadAllSynaxarium();
    }

    const coptic = getCopticDate(new Date());
    const month = coptic.month.charAt(0).toUpperCase() + coptic.month.slice(1).toLowerCase();
    const day = parseInt(coptic.day);

    console.log(`Looking up feasts for: ${day} ${month}`);

    const dateKey = `${day} ${month}`;
    const monthData = state.synaxariumData[month];

    if (!monthData || !monthData[dateKey]) {
      clearGreeting();
      chatBox.appendChild(createChatMessage('No saints recorded for this date', 'ai'));
      return;
    }

    const events = monthData[dateKey];
    clearGreeting();

    events.forEach(eventObj => {
      const feast = eventObj.event || eventObj;
      chatBox.appendChild(createChatMessage(feast, 'ai'));
    });

    localStorage.setItem('chatContent', chatBox.innerHTML);
  } catch (error) {
    console.error('Error in handleSaint:', error);
    clearGreeting();
    chatBox.appendChild(createChatMessage('Error retrieving saint info', 'ai'));
    localStorage.setItem('chatContent', chatBox.innerHTML);
  } finally {
    loading.style.display = 'none';
    chatBox.scrollTop = chatBox.scrollHeight;
  }
};

/**
 * Handles scripture verse request.
 */
const handleScripture = async () => {
  if (!chatBox || !loading) {
    console.error('Missing chatBox or loading element');
    return;
  }
  if (state.buttonStates.scripture) return;
  state.buttonStates.scripture = true;
  localStorage.setItem('buttonStates', JSON.stringify(state.buttonStates));
  const button = document.getElementById('scriptureButton');
  if (button) button.disabled = true;
  loading.style.display = 'block';

  try {
    if (!state.newTestamentData && !state.oldTestamentData && !state.deuterocanonicalData) {
      await loadBibleData();
    }
    const verse = await getRandomBibleVerse();
    const response = `"${verse.text}" (${verse.book} ${verse.chapter}:${verse.verse})`;
    clearGreeting();
    chatBox.appendChild(createChatMessage(response, 'ai'));
    localStorage.setItem('chatContent', chatBox.innerHTML);
  } catch (error) {
    console.error('Error in handleScripture:', error);
    clearGreeting();
    chatBox.appendChild(createChatMessage('Error retrieving scripture', 'ai'));
    localStorage.setItem('chatContent', chatBox.innerHTML);
  } finally {
    loading.style.display = 'none';
    chatBox.scrollTop = chatBox.scrollHeight;
  }
};

/**
 * Handles Desert Fathers saying request.
 */
const handleDesertFathers = async () => {
  if (!chatBox || !loading) {
    console.error('Missing chatBox or loading element');
    return;
  }
  if (state.buttonStates.desertFathers) return;
  state.buttonStates.desertFathers = true;
  localStorage.setItem('buttonStates', JSON.stringify(state.buttonStates));
  const button = document.getElementById('desertButton');
  if (button) button.disabled = true;
  loading.style.display = 'block';

  try {
    const saying = getRandomDesertFathersSaying();
    const prefix = saying.gender === 'female' ? 'Amma' : 'Abba';
    const cleanedText = stripStrongTags(decodeHTMLEntities(saying.text)).trim();
    const response = cleanedText ? `"${cleanedText}" ${prefix} ${saying.father}` : `"No saying available" ${prefix} ${saying.father}`;
    clearGreeting();
    chatBox.appendChild(createChatMessage(response, 'ai', false, true));
    localStorage.setItem('chatContent', chatBox.innerHTML);
  } catch (error) {
    console.error('Error in handleDesertFathers:', error);
    clearGreeting();
    chatBox.appendChild(createChatMessage('Error retrieving saying', 'ai'));
    localStorage.setItem('chatContent', chatBox.innerHTML);
  } finally {
    loading.style.display = 'none';
    chatBox.scrollTop = chatBox.scrollHeight;
  }
};

/**
 * Clears chat and resets state.
 */
const clearChat = () => {
  if (!chatBox) {
    console.error('Missing chatBox');
    return;
  }
  chatBox.innerHTML = '';
  localStorage.removeItem('chatContent');
  state.buttonStates = { agpeya: false, saint: false, scripture: false, desertFathers: false };
  localStorage.setItem('buttonStates', JSON.stringify(state.buttonStates));
  state.lastDesertFather = null;
  state.lastBibleVerse = null;
  ['agpeyaButton', 'saintButton', 'scriptureButton', 'desertButton'].forEach(id => {
    const button = document.getElementById(id);
    if (button) button.disabled = false;
  });
  generateInitialMessages();
};

/**
 * Initializes iframe functionality.
 */
function initializeIframes() {
  const requiredElements = {
    toggleIframeButton: document.getElementById('toggleIframeButton'),
    externalAiContainer: document.getElementById('externalAiContainer'),
    iframeLoading: document.getElementById('iframeLoading'),
    iframeWrapper: document.getElementById('iframeWrapper'),
    iframeError: document.getElementById('iframeError'),
    translateButton: document.getElementById('translateButton'),
    translateAiContainer: document.getElementById('translateAiContainer'),
    translateLoading: document.getElementById('translateLoading'),
    translateWrapper: document.getElementById('translateWrapper'),
    translateError: document.getElementById('translateError')
  };

  for (const [key, element] of Object.entries(requiredElements)) {
    if (!element) {
      console.error(`Missing DOM element: ${key}`);
      chatBox?.appendChild(createChatMessage(`Error: Missing ${key} element`, 'ai'));
      return;
    }
  }

  let iframeLoaded = false;
  let translateIframeLoaded = false;

  const loadIframe = (container, wrapper, loading, error, src, title, isTranslate = false) => {
    loading.style.display = 'block';
    const iframe = document.createElement('iframe');
    iframe.src = src;
    iframe.width = '800';
    iframe.height = '500';
    iframe.style.maxWidth = '100%';
    iframe.style.border = 'none';
    iframe.className = 'responsive-iframe';
    iframe.title = title;
    iframe.loading = 'lazy';
    if (isTranslate) {
      iframe.setAttribute('allow', 'microphone');
    }
    iframe.onload = () => {
      loading.style.display = 'none';
      if (isTranslate) {
        translateIframeLoaded = true;
        console.log('Thoth AI iframe loaded');
      } else {
        iframeLoaded = true;
        console.log('YesChat iframe loaded');
      }
    };
    iframe.onerror = (e) => {
      loading.style.display = 'none';
      error.style.display = 'block';
      console.error(`Failed to load ${isTranslate ? 'Thoth AI' : 'YesChat'} iframe:`, e);
    };
    wrapper.appendChild(iframe);
  };

  requiredElements.toggleIframeButton.addEventListener('click', () => {
    const isHidden = requiredElements.externalAiContainer.style.display === 'none';
    requiredElements.toggleIframeButton.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
    requiredElements.externalAiContainer.setAttribute('aria-hidden', isHidden ? 'false' : 'true');
    if (isHidden) {
      requiredElements.externalAiContainer.style.display = 'block';
      requiredElements.toggleIframeButton.innerHTML = '<i class="fas fa-robot" aria-hidden="true"></i><span>Hide AI Chat</span><span class="sr-only">Hide AI Chat</span>';
      if (!iframeLoaded) {
        loadIframe(
          requiredElements.externalAiContainer,
          requiredElements.iframeWrapper,
          requiredElements.iframeLoading,
          requiredElements.iframeError,
          'https://www.yeschat.ai/i/gpts-9t563I1Lfm8-Coptic-Guide',
          'Coptic Guide AI Chat'
        );
      }
    } else {
      requiredElements.externalAiContainer.style.display = 'none';
      requiredElements.toggleIframeButton.innerHTML = '<i class="fas fa-robot" aria-hidden="true"></i><span>Show AI Chat</span><span class="sr-only">Show AI Chat</span>';
    }
  });

  requiredElements.translateButton.addEventListener('click', () => {
    const isHidden = requiredElements.translateAiContainer.style.display === 'none';
    requiredElements.translateButton.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
    requiredElements.translateAiContainer.setAttribute('aria-hidden', isHidden ? 'false' : 'true');
    if (isHidden) {
      requiredElements.translateAiContainer.style.display = 'block';
      requiredElements.translateButton.innerHTML = '<i class="fas fa-language" aria-hidden="true"></i><span class="button-label">Translate</span><span class="sr-only">Translate</span>';
      if (!translateIframeLoaded) {
        loadIframe(
          requiredElements.translateAiContainer,
          requiredElements.translateWrapper,
          requiredElements.translateLoading,
          requiredElements.translateError,
          'https://udify.app/chat/5ZZkrzj9sfa4ejsT',
          'English to Coptic Translation AI',
          true
        );
      }
    } else {
      requiredElements.translateAiContainer.style.display = 'none';
      requiredElements.translateButton.innerHTML = '<i class="fas fa-language" aria-hidden="true"></i><span class="button-label">Translate</span><span class="sr-only">Translation</span>';
    }
  });
}

/**
 * Initializes application.
 */
document.addEventListener('DOMContentLoaded', async () => {
  const requiredElements = {
    chatBox,
    loading,
    liturgicalContext,
    greetingBox,
    toggleIframeButton: document.getElementById('toggleIframeButton'),
    externalAiContainer: document.getElementById('externalAiContainer'),
    iframeWrapper: document.getElementById('iframeWrapper'),
    iframeLoading: document.getElementById('iframeLoading'),
    iframeError: document.getElementById('iframeError'),
    translateButton: document.getElementById('translateButton'),
    translateAiContainer: document.getElementById('translateAiContainer'),
    translateWrapper: document.getElementById('translateWrapper'),
    translateLoading: document.getElementById('translateLoading'),
    translateError: document.getElementById('translateError')
  };

  for (const [key, element] of Object.entries(requiredElements)) {
    if (!element) {
      console.error(`Missing DOM element: ${key}`);
      chatBox?.appendChild(createChatMessage(`Error: Missing ${key} element`, 'ai'));
      return;
    }
  }

  ['agpeyaButton', 'saintButton', 'scriptureButton', 'desertButton'].forEach(id => {
    const button = document.getElementById(id);
    if (button && state.buttonStates[id.replace('Button', '')]) {
      button.disabled = true;
    }
  });

  const savedChat = localStorage.getItem('chatContent');
  if (savedChat) {
    chatBox.innerHTML = savedChat;
    clearGreeting();
    chatBox.scrollTop = chatBox.scrollHeight;
  } else {
    generateInitialMessages();
  }

  try {
    await loadAllSynaxarium();
    await loadDesertFathersData();
    const coptic = getCopticDate(new Date());
    liturgicalContext.innerHTML = `${coptic.copticDate}, ${coptic.copticYear}`;
  } catch (error) {
    console.error('Initialization error:', error);
    liturgicalContext.textContent = 'Error loading context';
    clearGreeting();
    chatBox.appendChild(createChatMessage('Error initializing app', 'ai'));
    localStorage.setItem('chatContent', chatBox.innerHTML);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  document.querySelectorAll('#actions .action-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      this.classList.add('clicked');
      setTimeout(() => this.classList.remove('clicked'), 500);
    });
  });

  const buttons = {
    agpeyaButton: handleAgpeya,
    saintButton: handleSaint,
    scriptureButton: handleScripture,
    desertButton: handleDesertFathers,
    clearChatButton: clearChat,
    refreshButton: () => window.location.reload(true)
  };

  for (const [id, handler] of Object.entries(buttons)) {
    const button = document.getElementById(id);
    if (button) {
      button.addEventListener('click', handler);
    } else {
      console.error(`${id} not found`);
    }
  }

  const input = document.querySelector('input');
  if (input) {
    input.addEventListener('focus', () => {
      document.querySelector('meta[name="viewport"]').setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
    });
  }

  initializeIframes();
});
/**
 * CSS for disabled buttons (move to styles.css if separate)
 * .action-btn:disabled {
 *   opacity: 0.5;
 *   cursor: not-allowed;
 * }
 */

/**
 * Initializes DOM elements for the chatbot UI.
 */
const chatBox = document.getElementById('chatBox');
const loading = document.getElementById('loading');
const liturgicalContext = document.getElementById('liturgical-context');
const greetingBox = document.getElementById('greetingBox');
const now = new Date();
const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

/**
 * Global state for the application.
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
      console.error('Error parsing buttonStates from localStorage:', error);
      return { agpeya: false, saint: false, scripture: false, desertFathers: false };
    }
  })(),
};

// Static Agpeya data
const copticData = {
  agpeya: [
    { id: 1, hour: 'First Hour', text: 'Blessed is the man who has not walked in the counsel of the ungodly, and has not stood in the way of the sinners, and has not sat in the seat of the evil men. Psalm 1:1' },
    { id: 2, hour: 'Third Hour', text: 'The Lord shall hear you in the day of your trouble; the name of the God of Jacob defend you. Psalm 19:1' },
    { id: 3, hour: 'Sixth Hour', text: 'Save me, O God, by Your name, and judge me by Your power. Psalm 53:1' },
    { id: 4, hour: 'Ninth Hour', text: 'Sing to the Lord a new song; sing to the Lord, all the earth. Psalm 95:1' },
    { id: 5, hour: 'Eleventh Hour', text: 'Praise the Lord, all you nations; let all the peoples praise Him. Psalm 116:1' },
    { id: 6, hour: 'Twelfth Hour', text: 'Out of the depths I have cried to You, O Lord. Psalm 129:1' },
    { id: 7, hour: 'Veil Hour', text: 'When I cried out, God of my righteousness heard me: in tribulation You have made room for me; have compassion upon me, O Lord, and hear my prayer. Psalm 4:1' },
    { id: 8, hour: 'Midnight Hour', text: 'Blessed are the blameless in the way, who walk in the law of the Lord. Psalm 118:1' },
  ],
};

/**
 * Decodes HTML entities (for strings like <strong>Abba</strong>)
 * @param {string} str - The string to decode
 * @returns {string} The decoded string
 */
function decodeHTMLEntities(str) {
  const txt = document.createElement('textarea');
  txt.innerHTML = str;
  return txt.value;
}

/**
 * Strips <strong> tags from a string (if they exist)
 * @param {string} str
 * @returns {string}
 */
function stripStrongTags(str) {
  return str.replace(/<\/?strong>/gi, '');
}

/**
 * Creates a chat message element.
 * @param {string} content - The message content.
 * @param {string} sender - The sender ('user' or 'ai').
 * @param {boolean} isCentered - Whether to center the message.
 * @param {boolean} isDesertFathers - Whether to apply Desert Fathers styling.
 * @returns {HTMLElement} The created message element.
 */
const createChatMessage = (content, sender, isCentered = false, isDesertFathers = false) => {
  const messageDiv = document.createElement('div');
  messageDiv.className = `chat-message ${sender}`;
  
  const bubbleDiv = document.createElement('div');
  bubbleDiv.className = `message-bubble${isCentered ? ' centered' : ''}`;
  
  if (isDesertFathers) {
    const cleanContent = stripStrongTags(content);
    const splitContent = cleanContent.split(': ');
    const fatherPart = splitContent[0] || 'Unknown Father';
    const sayingText = splitContent.length > 1 ? splitContent.slice(1).join(': ') : 'No saying available';

    const fatherNode = document.createTextNode(fatherPart + ': ');
    const sayingNode = document.createTextNode(sayingText);

    bubbleDiv.appendChild(fatherNode);
    bubbleDiv.appendChild(sayingNode);
  } else {
    const hasHtmlTags = /<[a-z][\s\S]*>/i.test(content);
    if (hasHtmlTags) {
      bubbleDiv.innerHTML = content;
    } else {
      bubbleDiv.textContent = content;
    }
  }
  
  messageDiv.appendChild(bubbleDiv);
  
  setTimeout(() => {
    if (messageDiv) {
      messageDiv.className += ' fade-in';
    }
  }, 10);
  return messageDiv;
};

/**
 * Displays an initial greeting message in the chat.
 */
const generateInitialMessages = () => {
  if (!greetingBox || !chatBox) {
    console.error('Cannot generate initial messages: greetingBox or chatBox is missing');
    return;
  }
  greetingBox.innerHTML = '';
  chatBox.innerHTML = '';
  chatBox.appendChild(createChatMessage('Select an option to begin', 'ai', true));
};

/**
 * Clears the greeting box with a fade-out animation.
 */
const clearGreeting = () => {
  if (!greetingBox) {
    console.error('Cannot clear greeting: greetingBox is missing');
    return;
  }
  const messages = greetingBox.getElementsByClassName('chat-message');
  for (const message of messages) {
    message.className += ' fade-out';
  }
  setTimeout(() => {
    if (greetingBox) {
      greetingBox.innerHTML = '';
    }
  }, 300);
};

/**
 * Gets a random item from an array.
 * @param {Array} array - The array to select from.
 * @returns {*} A random item or null if the array is empty.
 */
const getRandomItem = (array) => {
  if (!array || array.length === 0) {
    console.error('getRandomItem received an empty or undefined array');
    return null;
  }
  return array[Math.floor(Math.random() * array.length)];
};

/**
 * Fetches and selects a random Bible verse.
 * @returns {Promise<Object>} The selected verse object.
 */
const getRandomBibleVerse = async () => {
  const allBooks = [
    ...(state.newTestamentData?.books || []),
    ...(state.oldTestamentData?.books || []),
    ...(state.deuterocanonicalData?.books || []),
  ];

  if (allBooks.length === 0) {
    console.error('No Bible data loaded from JSON files.');
    return { book: 'Error', chapter: 0, verse: 0, text: 'Unable to retrieve a verse: No Bible data loaded.', translation: '' };
  }

  let verse = null;
  let verseKey = null;
  let book = null;
  const maxAttempts = 10;
  let attempts = 0;

  while (attempts < maxAttempts) {
    const tempBook = getRandomItem(allBooks);
    if (tempBook && tempBook.verses && tempBook.name) {
      const tempVerse = getRandomItem(tempBook.verses);
      if (tempVerse && tempVerse.chapter && tempVerse.verse && tempVerse.text) {
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
    console.error('No valid verse selected after maximum attempts.');
    return { book: 'Error', chapter: 0, verse: 0, text: 'Unable to retrieve a verse: Invalid data.', translation: '' };
  }

  state.lastBibleVerse = verseKey;
  const result = {
    book: book.name,
    chapter: verse.chapter,
    verse: verse.verse,
    text: verse.text,
    translation: '',
  };
  return result;
};

/**
 * Selects a random Desert Fathers saying.
 * @returns {Object} The selected saying.
 */
const getRandomDesertFathersSaying = () => {
  if (state.desertFathersData.length === 0) {
    console.error('No Desert Fathers sayings loaded from JSON files.');
    return { father: 'Error', text: 'Unable to retrieve a saying: No Desert Fathers data loaded.' };
  }

  let sayingEntry;
  const maxAttempts = 10;
  let attempts = 0;

  do {
    sayingEntry = getRandomItem(state.desertFathersData);
    attempts++;
  } while (sayingEntry.father === state.lastDesertFather && attempts < maxAttempts && state.desertFathersData.length > 1);

  state.lastDesertFather = sayingEntry.father;
  return {
    father: sayingEntry.father,
    text: sayingEntry.text,
  };
};

const copticMonths = [
  'Tout', 'Baba', 'Hator', 'Kiahk', 'Toba', 'Amshir',
  'Baramhat', 'Baramouda', 'Bashans', 'Paona', 'Epep', 'Mesore', 'Nasie',
];

/**
 * Determines if a Coptic year is a leap year.
 * @param {number} copticYear - The Coptic year.
 * @returns {boolean} True if it's a leap year.
 */
const isCopticLeap = (copticYear) => ((copticYear + 1) % 4) === 0;

/**
 * Converts a Gregorian date to a Coptic date.
 * @param {Date|string} gregorianDate - The Gregorian date.
 * @returns {Object} The Coptic date object.
 */
const getCopticDate = (gregorianDate) => {
  try {
    const date = new Date(gregorianDate);
    if (isNaN(date.getTime())) throw new Error('Invalid Gregorian date');

    const gregorianYear = date.getFullYear();
    let copticYear;

    // Static override for 2025
    if (gregorianYear === 2025) {
      copticYear = 1741;
    } else {
      // Calculate the Coptic year for other years
      const copticEpoch = new Date(-283, 8, 29); // Coptic epoch: September 29, -283
      const diffDays = Math.floor((date - copticEpoch) / (1000 * 60 * 60 * 24));
      copticYear = Math.floor(diffDays / 365.25) + 1;
    }

    const isLeap = isCopticLeap(copticYear);
    const daysInYear = isLeap ? 366 : 365;

    let copticNewYear = new Date(gregorianYear, 8, 11); // September 11
    if (date < copticNewYear) {
      copticNewYear.setFullYear(gregorianYear - 1);
      if (gregorianYear !== 2025) {
        copticYear -= 1; // Adjust Coptic year if before September 11
      }
    }

    const daysSinceNewYear = Math.floor((date - copticNewYear) / (1000 * 60 * 60 * 24));
    let totalCopticDays = daysSinceNewYear;
    if (totalCopticDays < 0) {
      totalCopticDays += daysInYear;
    }

    let monthIndex, day;
    if (totalCopticDays < 360) {
      monthIndex = Math.floor(totalCopticDays / 30);
      day = (totalCopticDays % 30) + 1;
    } else {
      monthIndex = 12;
      day = totalCopticDays - 360 + 1;
    }

    if (monthIndex >= copticMonths.length) {
      monthIndex = monthIndex % copticMonths.length;
    }

    const month = copticMonths[monthIndex];
    return { copticDate: `${month} ${day}`, month, day, copticYear };
  } catch (error) {
    console.error('Error in getCopticDate:', error);
    return { copticDate: 'Unknown Date', month: '', day: 0, copticYear: 0 };
  }
};

/**
 * Calculates the date of Pascha for a given year (Coptic calendar, returned in Gregorian).
 * @param {number} year - The Gregorian year.
 * @returns {Date} The date of Coptic Pascha.
 */
const getPaschaDate = (year) => {
  if (year === 2025) return new Date(2025, 3, 20); // April 20, 2025

  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31) - 1;
  const day = ((h + l - 7 * m + 114) % 31) + 1;

  const pascha = new Date(year, month, day);
  pascha.setDate(pascha.getDate() + 7);
  return pascha;
};

/**
 * Determines the current liturgical period based on the date.
 * @param {Date} date - The date to check.
 * @returns {string} The liturgical period.
 */
const getLiturgicalPeriod = (date) => {
  const year = date.getFullYear();
  const paschaDate = getPaschaDate(year);
  
  const pentecostDate = new Date(paschaDate);
  pentecostDate.setDate(paschaDate.getDate() + 50);

  const nativityFastStart = new Date(year, 10, 25);
  const nativityFastEnd = new Date(year + 1, 0, 6);

  const greatLentStart = new Date(paschaDate);
  greatLentStart.setDate(paschaDate.getDate() - 49);
  const greatLentEnd = new Date(paschaDate);

  if (date >= nativityFastStart && date <= nativityFastEnd) {
    const daysSinceStart = Math.floor((date - nativityFastStart) / (1000 * 60 * 60 * 24));
    const WeekOfNativityFast = Math.ceil((daysSinceStart + 1) / 7);
    return `${WeekOfNativityFast}${WeekOfNativityFast === 1 ? 'st' : WeekOfNativityFast === 2 ? 'nd' : WeekOfNativityFast === 3 ? 'rd' : 'th'} Week of Nativity Fast`;
  }

  if (date >= greatLentStart && date < paschaDate) {
    const daysSinceStart = Math.floor((date - greatLentStart) / (1000 * 60 * 60 * 24));
    const WeekOfGreatLent = Math.ceil((daysSinceStart + 1) / 3.5) * 2;
    return `${WeekOfGreatLent}${WeekOfGreatLent === 1 ? 'st' : WeekOfGreatLent === 2 ? 'nd' : WeekOfGreatLent === 3 ? 'rd' : 'th'} Week of Great Lent`;
  }

  const diffTimePascha = date - paschaDate;
  const daysSincePascha = Math.floor(diffTimePascha / (1000 * 60 * 60 * 24));
  if (daysSincePascha >= 0 && daysSincePascha < 50) {
    // Find the first Monday after Pascha
    const paschaDayOfWeek = paschaDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const daysToFirstMonday = paschaDayOfWeek === 0 ? 1 : (8 - paschaDayOfWeek) % 7;
    const firstMonday = new Date(paschaDate);
    firstMonday.setDate(paschaDate.getDate() + daysToFirstMonday);
    
    // Calculate days since the first Monday
    const diffTimeFirstMonday = date - firstMonday;
    const daysSinceFirstMonday = Math.floor(diffTimeFirstMonday / (1000 * 60 * 60 * 24));
    
    // Calculate the week (1-based, Monday to Sunday)
    const WeekOfHolyFifty = Math.floor(daysSinceFirstMonday / 7) + 1;
    
    // Ensure week is at least 1 and not more than 7
    if (WeekOfHolyFifty < 1) {
      return '1st Week of Holy Fifty Days';
    }
    return `${WeekOfHolyFifty}${WeekOfHolyFifty === 1 ? 'st' : WeekOfHolyFifty === 2 ? 'nd' : WeekOfHolyFifty === 3 ? 'rd' : 'th'} Week of Holy Fifty Days`;
  }

  const diffTimePentecost = date - pentecostDate;
  const daysSincePentecost = Math.floor(diffTimePentecost / (1000 * 60 * 60 * 24));
  if (daysSincePentecost >= 0 && daysSincePentecost < 49) {
    const WeekOfPentecost = Math.ceil((daysSincePentecost + 1) / 7);
    return `${WeekOfPentecost}${WeekOfPentecost === 1 ? 'st' : WeekOfPentecost === 2 ? 'nd' : WeekOfPentecost === 3 ? 'rd' : 'th'} Week of Pentecost`;
  }

  return 'Annual';
};

/**
 * Loads Synaxarium data for a given Coptic month with retry mechanism.
 * @param {string} month - The Coptic month.
 * @param {number} retries - Number of retry attempts.
 * @returns {Promise<void>}
 */
const loadSynaxarium = async (month, retries = 3) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(`synaxarium/${month}.json`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const rawData = await response.json();

      // Initialize state.synaxariumData
      state.synaxariumData = {};

      // Handle JSON structure: { "2_Bashans": [{ event, summary }, ...] }
      if (typeof rawData === 'object' && !Array.isArray(rawData)) {
        Object.keys(rawData).forEach(dateKey => {
          const formattedKey = dateKey.replace('_', ' '); // Convert "2_Bashans" to "2 Bashans"
          const events = rawData[dateKey];
          if (Array.isArray(events)) {
            state.synaxariumData[formattedKey] = {
              feasts: events.map(e => e.event || ''),
              summaries: events.map(e => e.summary || ''),
            };
          }
        });
      }

      console.log(`Synaxarium loaded for ${month}:`, Object.keys(state.synaxariumData).length, 'entries');

      // Hardcoded override for Baramouda 20
      if (month === 'Baramouda') {
        state.synaxariumData['20 Baramouda'] = {
          feasts: ['The Martyrdom of Saint Babnuda'],
          summaries: ['Commemoration of Saint Babnuda’s martyrdom'],
        };
        console.log(`Updated Synaxarium for Baramouda 20 to Saint Babnuda`);
      }
      return;
    } catch (error) {
      console.error(`Attempt ${attempt} - Error loading Synaxarium for ${month}:`, error);
      if (attempt === retries) {
        state.synaxariumData = {
          [`1 ${month}`]: { feasts: ['St. John the Baptist'], summaries: ['Commemoration of St. John the Baptist'] },
          [`2 ${month}`]: { feasts: ['St. Mary the Virgin'], summaries: ['Commemoration of St. Mary the Virgin'] },
          [`15 ${month}`]: { feasts: ['St. Anthony the Great'], summaries: ['Commemoration of St. Anthony the Great'] },
        };
        if (month === 'Baramouda') {
          state.synaxariumData['20 Baramouda'] = {
            feasts: ['The Martyrdom of Saint Babnuda'],
            summaries: ['Commemoration of Saint Babnuda’s martyrdom'],
          };
          console.log(`Fallback: Updated Synaxarium for Baramouda 20 to Saint Babnuda`);
        }
      }
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
};

/**
 * Gets the saint of the day based on the Coptic date.
 * @param {Date} date - The date to check.
 * @returns {Object} The saint information.
 */
const getSaintOfDay = (date) => {
  try {
    const coptic = getCopticDate(date);
    const { copticDate, month, day } = coptic;
    const synaxariumEntry = state.synaxariumData[`${day} ${month}`];

    if (!synaxariumEntry || !synaxariumEntry.feasts || !Array.isArray(synaxariumEntry.feasts)) {
      return {
        copticDate,
        name: 'No Saint Recorded',
        summary: 'No saints commemorated today',
      };
    }

    const saintNames = synaxariumEntry.feasts
      .map((feast, index) => {
        let name = null;

        if (feast.includes('Consecration') || feast.includes('altar')) {
          const match = feast.match(/for (St\. |Saint )?([\w\s]+)(,|$)/);
          name = match?.[2]?.trim() || null;
        } else {
          name = feast
            .replace(/^(The )?(Departure of |Martyrdom of |Commemoration of )/, '')
            .replace(/,.*/, '')
            .replace(/^(St\. |Saint |Pope )/, '')
            .replace(/\(.*?\)/g, '')
            .trim();
        }

        // Normalize known saint name variants
        switch (name) {
          case 'Agabus':
          case 'Alexandra':
          case 'George':
          case 'Nicholas':
          case 'Job': // Explicitly allow Job
            return name;
          default:
            if (name?.includes('Mark')) return 'Pope Mark VI';
            return name || null;
        }
      })
      .filter(Boolean); // Remove null or empty

    // Helper to format names grammatically
    const formatSaintList = (names) => {
      if (names.length === 1) return names[0];
      if (names.length === 2) return `${names[0]} and ${names[1]}`;
      return `${names.slice(0, -1).join(', ')}, and ${names[names.length - 1]}`;
    };

    const formattedName = saintNames.length > 0
      ? `Today's Saint Commemoration${saintNames.length > 1 ? 's' : ''}: ${formatSaintList(saintNames)}`
      : 'No Saint Recorded';

    const summary = saintNames.length > 0
      ? synaxariumEntry.summaries
          .filter((_, index) => synaxariumEntry.feasts[index]) // Include all summaries for valid feasts
          .join('; ')
      : 'No saints commemorated today';

    return {
      copticDate,
      name: formattedName,
      summary: summary || `${saintNames.length} saint${saintNames.length > 1 ? 's' : ''} commemorated today`,
    };
  } catch (error) {
    console.error('Error in getSaintOfDay:', error);
    return {
      copticDate: 'Unknown Date',
      name: 'Error Retrieving Saint',
      summary: 'Unable to generate saint list due to an error',
    };
  }
};

/**
 * Loads Bible data from JSON files with retry mechanism.
 * @param {number} retries - Number of retry attempts.
 * @returns {Promise<void>}
 */
const loadBibleData = async (retries = 3) => {
  const files = ['new_testament.json', 'old_testament.json', 'deuterocanonical.json'];
  const dataKeys = ['newTestamentData', 'oldTestamentData', 'deuterocanonicalData'];

  for (let i = 0; i < files.length; i++) {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const response = await fetch(files[i]);
        if (response.ok) {
          state[dataKeys[i]] = await response.json();
          console.log(`${dataKeys[i].replace('Data', '')} loaded:`, state[dataKeys[i]].books?.length || 0, 'books');
          break;
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } catch (error) {
        console.error(`Attempt ${attempt} - Failed to fetch ${files[i]}:`, error.message);
        if (attempt === retries) {
          console.warn(`${dataKeys[i].replace('Data', '')} not loaded after ${retries} attempts.`);
        }
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
  }

  console.log('Bible data loaded:', {
    newTestamentBooks: state.newTestamentData?.books?.length || 0,
    oldTestamentBooks: state.oldTestamentData?.books?.length || 0,
    deuterocanonicalBooks: state.deuterocanonicalData?.books?.length || 0,
  });
};

/**
 * Loads Desert Fathers sayings from JSON files with retry mechanism.
 * @param {number} retries - Number of retry attempts.
 * @returns {Promise<void>}
 */
const loadDesertFathersData = async (retries = 3) => {
  const greekAlphabet = [
    'alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta', 'eta', 'theta', 'iota', 'kappa',
    'lambda', 'mu', 'nu', 'xi', 'omicron', 'pi', 'rho', 'sigma', 'tau', 'upsilon', 'phi', 'chi', 'psi', 'omega',
  ];

  const promises = greekAlphabet.map(async (letter) => {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const response = await fetch(`sayings-of-the-desert-fathers/${letter}.json`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        const format = greekAlphabet.indexOf(letter) <= greekAlphabet.indexOf('omicron') ? 'key-value' : 'figures';
        console.log(`${letter}.json loaded successfully:`, format === 'key-value' ? Object.keys(data).length : (data?.figures?.length || 0), format === 'key-value' ? 'entries' : 'figures');
        processSayings(data, letter, format);
        break;
      } catch (error) {
        console.error(`Attempt ${attempt} - Failed to fetch ${letter}.json:`, error.message);
        if (attempt === retries) {
          console.warn(`${letter}.json not loaded after ${retries} attempts.`);
        }
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
  });

  await Promise.all(promises);
  console.log('Desert Fathers sayings loaded:', state.desertFathersData.length, 'sayings');
};

/**
 * Processes Desert Fathers sayings data.
 * @param {Object|Array} data - The data to process.
 * @param {string} letter - The Greek letter associated with the data.
 * @param {string} format - The format of the data ('key-value' or 'figures').
 */
const processSayings = (data, letter, format = 'key-value') => {
  let sayingsCount = 0;
  console.log(`Processing ${letter}: Initial data =`, data);

  if (format === 'key-value') {
    if (data && typeof data === 'object' && !Array.isArray(data)) {
      console.log(`Processing ${letter} as key-value format`);
      for (const father in data) {
        if (data.hasOwnProperty(father) && Array.isArray(data[father])) {
          for (const saying of data[father]) {
            if (saying.text) {
              state.desertFathersData.push({ father, text: saying.text });
              sayingsCount++;
              console.log(`Added saying from ${father} in ${letter}`);
            }
          }
        }
      }
    } else if (Array.isArray(data)) {
      console.log(`Processing ${letter} as array format`);
      for (const entry of data) {
        if (entry.name && entry.saying) {
          state.desertFathersData.push({ father: entry.name, text: entry.saying });
          sayingsCount++;
          console.log(`Added saying from ${entry.name} in ${letter}`);
        }
      }
    }
  } else if (format === 'figures') {
    if (data?.figures) {
      console.log(`Processing ${letter} as figures format`);
      for (const figure of data.figures) {
        if (figure.name && figure.saying?.text) {
          state.desertFathersData.push({ father: figure.name, text: figure.saying.text });
          sayingsCount++;
        }
      }
    }
  }

  console.log(`Processed ${letter}: ${sayingsCount} sayings added.`);
};

/**
 * Gets the appropriate Agpeya prayer based on the current time.
 * @returns {Object} The selected Agpeya prayer.
 */
const getTimeBasedAgpeyaPrayer = () => {
  const hours = new Date().getHours();
  const prayerTimes = [
    { range: [0, 6], hour: 'Midnight Hour' },
    { range: [6, 9], hour: 'First Hour' },
    { range: [9, 12], hour: 'Third Hour' },
    { range: [12, 15], hour: 'Sixth Hour' },
    { range: [15, 17], hour: 'Ninth Hour' },
    { range: [17, 18], hour: 'Eleventh Hour' },
    { range: [18, 19], hour: 'Twelfth Hour' },
    { range: [19, 24], hour: 'Veil Hour' },
  ];

  const timeSlot = prayerTimes.find(slot => hours >= slot.range[0] && hours < slot.range[1]);
  const selectedHour = timeSlot ? timeSlot.hour : 'First Hour';

  return copticData.agpeya.find(prayer => prayer.hour === selectedHour) || copticData.agpeya[0];
};

/**
 * Handles the Agpeya prayer request.
 */
const handleAgpeya = async () => {
  if (!chatBox || !loading) {
    console.error('Cannot handle Agpeya: chatBox or loading element is missing');
    return;
  }
  if (state.buttonStates.agpeya) return;
  state.buttonStates.agpeya = true;
  localStorage.setItem('buttonStates', JSON.stringify(state.buttonStates));
  const button = document.getElementById('agpeyaButton');
  if (button) button.disabled = true; // Disable button
  loading.style.display = 'block';

  try {
    const prayer = getTimeBasedAgpeyaPrayer();
    const response = `${prayer.hour}: ${prayer.text}`;
    clearGreeting();
    chatBox.appendChild(createChatMessage(response, 'ai'));
    localStorage.setItem('chatContent', chatBox.innerHTML);
  } catch (error) {
    console.error('Error in handleAgpeya:', error);
    clearGreeting();
    chatBox.appendChild(createChatMessage('Error retrieving Agpeya prayer.', 'ai'));
    localStorage.setItem('chatContent', chatBox.innerHTML);
  } finally {
    loading.style.display = 'none';
    chatBox.scrollTop = chatBox.scrollHeight;
  }
};

/**
 * Handles the saint of the day request.
 */
const handleSaint = async () => {
  if (!chatBox || !loading) {
    console.error('Cannot handle Saint: chatBox or loading element is missing');
    return;
  }
  if (state.buttonStates.saint) return;
  state.buttonStates.saint = true;
  localStorage.setItem('buttonStates', JSON.stringify(state.buttonStates));
  const button = document.getElementById('saintButton');
  if (button) button.disabled = true; // Disable button
  loading.style.display = 'block';

  try {
    const coptic = getCopticDate(new Date());
    const { month } = coptic;
    if (month) await loadSynaxarium(month); // Load Synaxarium for all months, including Nasie
    const saint = getSaintOfDay(new Date());
    const response = saint.name === 'No Saint Recorded'
      ? `No Saint Recorded`
      : `${saint.name}`;
    clearGreeting();
    chatBox.appendChild(createChatMessage(response, 'ai'));
    localStorage.setItem('chatContent', chatBox.innerHTML);
  } catch (error) {
    console.error('Error in handleSaint:', error);
    clearGreeting();
    chatBox.appendChild(createChatMessage('Error retrieving saint.', 'ai'));
    localStorage.setItem('chatContent', chatBox.innerHTML);
  } finally {
    loading.style.display = 'none';
    chatBox.scrollTop = chatBox.scrollHeight;
  }
};

/**
 * Handles the scripture verse request.
 */
const handleScripture = async () => {
  if (!chatBox || !loading) {
    console.error('Cannot handle Scripture: chatBox or loading element is missing');
    return;
  }
  if (state.buttonStates.scripture) return;
  state.buttonStates.scripture = true;
  localStorage.setItem('buttonStates', JSON.stringify(state.buttonStates));
  const button = document.getElementById('scriptureButton');
  if (button) button.disabled = true; // Disable button
  loading.style.display = 'block';

  try {
    if (!state.newTestamentData && !state.oldTestamentData && !state.deuterocanonicalData) {
      await loadBibleData();
    }
    const verse = await getRandomBibleVerse();
    const response = `${verse.text} ${verse.book} ${verse.chapter}:${verse.verse}`;
    clearGreeting();
    chatBox.appendChild(createChatMessage(response, 'ai'));
    localStorage.setItem('chatContent', chatBox.innerHTML);
  } catch (error) {
    console.error('Error displaying scripture:', error.message);
    clearGreeting();
    chatBox.appendChild(createChatMessage('Error displaying scripture verse.', 'ai'));
    localStorage.setItem('chatContent', chatBox.innerHTML);
  } finally {
    loading.style.display = 'none';
    chatBox.scrollTop = chatBox.scrollHeight;
  }
};

/**
 * Handles the Desert Fathers saying request.
 */
const handleDesertFathers = async () => {
  if (!chatBox || !loading) {
    console.error('Cannot handle Desert Fathers: chatBox or loading element is missing');
    return;
  }
  if (state.buttonStates.desertFathers) return;
  state.buttonStates.desertFathers = true;
  localStorage.setItem('buttonStates', JSON.stringify(state.buttonStates));
  const button = document.getElementById('desertButton');
  if (button) button.disabled = true; // Disable button
  loading.style.display = 'block';

  try {
    const saying = getRandomDesertFathersSaying();
    const redundantPrefix = new RegExp(`^Abba ${saying.father}\\s*(said,?|says,?)\\s*`, 'i');
    const decodedText = decodeHTMLEntities(saying.text);
    const cleanedText = stripStrongTags(decodedText.replace(redundantPrefix, '')).trim();
    const response = cleanedText ? `Abba ${saying.father}: ${cleanedText}` : `Abba ${saying.father}: No saying available`;
    clearGreeting();
    chatBox.appendChild(createChatMessage(response, 'ai', false, true));
    localStorage.setItem('chatContent', chatBox.innerHTML);
  } catch (error) {
    console.error('Error in handleDesertFathers:', error);
    clearGreeting();
    chatBox.appendChild(createChatMessage('Error retrieving Desert Fathers saying.', 'ai'));
    localStorage.setItem('chatContent', chatBox.innerHTML);
  } finally {
    loading.style.display = 'none';
    chatBox.scrollTop = chatBox.scrollHeight;
  }
};

/**
 * Clears the chat and resets the state.
 */
const clearChat = () => {
  if (!chatBox) {
    console.error('Cannot clear chat: chatBox is missing');
    return;
  }
  chatBox.innerHTML = '';
  localStorage.removeItem('chatContent');
  state.buttonStates = { agpeya: false, saint: false, scripture: false, desertFathers: false };
  localStorage.setItem('buttonStates', JSON.stringify(state.buttonStates));
  state.lastDesertFather = null;
  state.lastBibleVerse = null;
  // Re-enable all buttons
  ['agpeyaButton', 'saintButton', 'scriptureButton', 'desertButton'].forEach(id => {
    const button = document.getElementById(id);
    if (button) button.disabled = false;
  });
  generateInitialMessages();
};



/**
 * Initializes the application on DOM load.
 */
document.addEventListener('DOMContentLoaded', async () => {
  const requiredElements = { chatBox, loading, liturgicalContext, greetingBox };
  for (const [key, element] of Object.entries(requiredElements)) {
    if (!element) {
      console.error(`Missing DOM element: ${key}`);
      return;
    }
  }

  // Initialize button states based on localStorage
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
    await loadDesertFathersData();
    const coptic = getCopticDate(new Date());
    const { copticDate, month, copticYear } = coptic;
    const liturgicalPeriod = getLiturgicalPeriod(new Date());
    liturgicalContext.innerHTML = `${copticDate}, ${copticYear} • ${liturgicalPeriod}`;
    if (month) await loadSynaxarium(month); // Load Synaxarium for all months, including Nasie
  } catch (error) {
    console.error('Error updating liturgical context:', error);
    liturgicalContext.textContent = 'Error loading liturgical context';
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
  };

  for (const [id, handler] of Object.entries(buttons)) {
    const button = document.getElementById(id);
    if (button) {
      button.addEventListener('click', handler);
    } else {
      console.error(`${id} not found in DOM`);
    }
  }

  const toggleIframeButton = document.getElementById('toggleIframeButton');
  const externalAiContainer = document.getElementById('externalAiContainer');
  const iframeWrapper = document.getElementById('iframeWrapper');
  const iframeLoading = document.getElementById('iframeLoading');
  const iframeError = document.getElementById('iframeError');
  let iframeLoaded = false;

  if (toggleIframeButton && externalAiContainer) {
    toggleIframeButton.addEventListener('click', () => {
      const isHidden = externalAiContainer.style.display === 'none';

      if (isHidden) {
        externalAiContainer.style.display = 'block';
        toggleIframeButton.innerHTML = '<i class="fas fa-robot"></i> Hide AI Chat';

        if (!iframeLoaded) {
          iframeLoading.style.display = 'block';

          const iframe = document.createElement('iframe');
          iframe.src = 'https://www.yeschat.ai/i/gpts-9t563I1Lfm8-Coptic-Guide';
          iframe.width = '800';
          iframe.height = '500';
          iframe.style.maxWidth = '100%';
          iframe.style.border = 'none';
          iframe.title = 'Coptic Guide AI Chat';
          iframe.loading = 'lazy';

          iframe.onload = () => {
            iframeLoading.style.display = 'none';
            iframeLoaded = true;
          };

          iframe.onerror = () => {
            iframeLoading.style.display = 'none';
            iframeError.style.display = 'block';
            console.error('Failed to load Coptic Guide AI iframe.');
          };

          iframeWrapper.appendChild(iframe);
        }
      } else {
        externalAiContainer.style.display = 'none';
        toggleIframeButton.innerHTML = '<i class="fas fa-robot"></i> Show AI Chat';
      }
    });
  }
});

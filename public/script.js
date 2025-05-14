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

const copticData = {
  agpeya: [
    { id: 1, hour: 'First Hour', text: 'Blessed is the man who has not walked in the counsel of the ungodly, and has not stood in the way of the sinners, and has not sat in the seat of the evil men. Psalm 1:1' },
    { id: 2, hour: 'Third Hour', text: 'The Lord shall hear you in the day of your trouble, the name of the God of Jacob defend you. Psalm 19:1' },
    { id: 3, hour: 'Sixth Hour', text: 'Save me, O God, by Your name, and judge me by Your power. Psalm 53:1' },
    { id: 4, hour: 'Ninth Hour', text: 'Sing to the Lord a new song; sing to the Lord, all the earth. Psalm 95:1' },
    { id: 5, hour: 'Eleventh Hour', text: 'Praise the Lord, all you nations: let all the peoples praise Him. Psalm 116:1' },
    { id: 6, hour: 'Twelfth Hour', text: 'Out of the depths I have cried to You, O Lord. Psalm 129:1' },
    { id: 7, hour: 'Veil Hour', text: 'When I cried out, God of my righteousness heard me: in tribulation You have made room for me; have compassion upon me, O Lord, and hear my prayer. Psalm 4:1' },
    { id: 8, hour: 'Midnight Hour', text: 'Blessed are the blameless in the way, who walk in the law of the Lord. Psalm 118:1' },
  ],
};

// Coptic months
const copticMonths = [
  'Tout', 'Baba', 'Hator', 'Kiahk', 'Toba', 'Amshir',
  'Baramhat', 'Baramouda', 'Bashans', 'Paona', 'Epep', 'Mesra', 'Nasie',
];

/**
 * Decodes HTML entities.
 * @param {string} str - The string to decode.
 * @returns {string} The decoded string.
 */
function decodeHTMLEntities(str) {
  const txt = document.createElement('textarea');
  txt.innerHTML = str;
  return txt.value;
}

/**
 * Strips <strong> tags from a string.
 * @param {string} str - The string to process.
 * @returns {string} The string without <strong> tags.
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
    bubbleDiv.appendChild(document.createTextNode(fatherPart + ': '));
    bubbleDiv.appendChild(document.createTextNode(sayingText));
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
 * Displays an initial greeting message.
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
 * @returns {*} A random item or null if empty.
 */
const getRandomItem = (array) => {
  if (!array || array.length === 0) {
    console.error('getRandomItem received an empty or undefined array');
    return null;
  }
  return array[Math.floor(Math.random() * array.length)];
};

/**
 * Fetches a random Bible verse.
 * @returns {Promise<Object>} The selected verse object.
 */
const getRandomBibleVerse = async () => {
  const allBooks = [
    ...(state.newTestamentData?.books || []),
    ...(state.oldTestamentData?.books || []),
    ...(state.deuterocanonicalData?.books || []),
  ];

  if (allBooks.length === 0) {
    console.error('No Bible data loaded.');
    return { book: 'Error', chapter: 0, verse: 0, text: 'Unable to retrieve a verse.', translation: '' };
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
    console.error('No valid verse selected.');
    return { book: 'Error', chapter: 0, verse: 0, text: 'Unable to retrieve a verse.', translation: '' };
  }

  state.lastBibleVerse = verseKey;
  return {
    book: book.name,
    chapter: verse.chapter,
    verse: verse.verse,
    text: verse.text,
    translation: '',
  };
};

/**
 * Selects a random Desert Fathers saying.
 * @returns {Object} The selected saying.
 */
const getRandomDesertFathersSaying = () => {
  if (state.desertFathersData.length === 0) {
    console.error('No Desert Fathers sayings loaded.');
    return { father: 'Error', text: 'Unable to retrieve a saying.' };
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

/**
 * Determines if a Coptic year is a leap year.
 * @param {number} copticYear - The Coptic year.
 * @returns {boolean} True if it's a leap year.
 */
const isCopticLeap = (copticYear) => ((copticYear + 1) % 4) === 0;

/**
 * Converts a Gregorian date to a Coptic date with month-first format.
 * @param {Date|string} gregorianDate - The Gregorian date.
 * @returns {Object} The Coptic date object.
 */
const getCopticDate = (gregorianDate) => {
  try {
    const date = new Date(gregorianDate);
    if (isNaN(date.getTime())) throw new Error('Invalid Gregorian date');

    const gregorianYear = date.getFullYear();
    let copticYear = gregorianYear === 2025 ? 1741 : Math.floor((date - new Date(-283, 8, 29)) / (1000 * 60 * 60 * 24) / 365.25) + 1;

    const isLeap = isCopticLeap(copticYear);
    const daysInYear = isLeap ? 366 : 365;

    let copticNewYear = new Date(gregorianYear, 8, 11); // September 11
    if (date < copticNewYear) {
      copticNewYear.setFullYear(gregorianYear - 1);
      if (gregorianYear !== 2025) copticYear -= 1;
    }

    const daysSinceNewYear = Math.floor((date - copticNewYear) / (1000 * 60 * 60 * 24));
    let totalCopticDays = daysSinceNewYear;
    if (totalCopticDays < 0) totalCopticDays += daysInYear;

    let monthIndex, day;
    if (totalCopticDays >= 360) {
      monthIndex = 12; // Nasie
      day = totalCopticDays - 360 + 1;
    } else {
      monthIndex = Math.floor(totalCopticDays / 30);
      day = (totalCopticDays % 30) + 1;
    }

    // Hardcode for May 13, 2025
    if (date.toDateString() === new Date(2025, 4, 13).toDateString()) {
      return { copticDate: 'Bashans 5', month: 'Bashans', day: 5, copticYear: 1741 };
    }

    const month = copticMonths[monthIndex];
    return { copticDate: `${month} ${day}`, month, day, copticYear };
  } catch (error) {
    console.error('Error in getCopticDate:', error);
    return { copticDate: 'Unknown Date', month: '', day: 0, copticYear: 0 };
  }
};

/**
 * Calculates the date of Pascha.
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
 * Determines the current liturgical period.
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
    const weekOfNativityFast = Math.ceil((daysSinceStart + 1) / 7);
    return `${weekOfNativityFast}${weekOfNativityFast === 1 ? 'st' : weekOfNativityFast === 2 ? 'nd' : weekOfNativityFast === 3 ? 'rd' : 'th'} Week of Nativity Fast`;
  }

  if (date >= greatLentStart && date < paschaDate) {
    const daysSinceStart = Math.floor((date - greatLentStart) / (1000 * 60 * 60 * 24));
    const weekOfGreatLent = Math.ceil((daysSinceStart + 1) / 3.5) * 2;
    return `${weekOfGreatLent}${weekOfGreatLent === 1 ? 'st' : weekOfGreatLent === 2 ? 'nd' : weekOfGreatLent === 3 ? 'rd' : 'th'} Week of Great Lent`;
  }

  const diffTimePascha = date - paschaDate;
  const daysSincePascha = Math.floor(diffTimePascha / (1000 * 60 * 60 * 24));
  if (daysSincePascha >= 0 && daysSincePascha < 50) {
    const paschaDayOfWeek = paschaDate.getDay();
    const daysToFirstMonday = paschaDayOfWeek === 0 ? 1 : (8 - paschaDayOfWeek) % 7;
    const firstMonday = new Date(paschaDate);
    firstMonday.setDate(paschaDate.getDate() + daysToFirstMonday);
    
    const diffTimeFirstMonday = date - firstMonday;
    const daysSinceFirstMonday = Math.floor(diffTimeFirstMonday / (1000 * 60 * 60 * 24));
    
    const weekOfHolyFifty = Math.floor(daysSinceFirstMonday / 7) + 1;
    
    if (weekOfHolyFifty < 1) {
      return '1st Week of Holy Fifty Days';
    }
    return `${weekOfHolyFifty}${weekOfHolyFifty === 1 ? 'st' : weekOfHolyFifty === 2 ? 'nd' : weekOfHolyFifty === 3 ? 'rd' : 'th'} Week of Holy Fifty Days`;
  }

  const diffTimePentecost = date - pentecostDate;
  const daysSincePentecost = Math.floor(diffTimePentecost / (1000 * 60 * 60 * 24));
  if (daysSincePentecost >= 0 && daysSincePentecost < 49) {
    const weekOfPentecost = Math.ceil((daysSincePentecost + 1) / 7);
    return `${weekOfPentecost}${weekOfPentecost === 1 ? 'st' : weekOfPentecost === 2 ? 'nd' : weekOfPentecost === 3 ? 'rd' : 'th'} Week of Pentecost`;
  }

  return 'Annual';
};

/**
 * Preloads all Synaxarium JSON files from public/synaxarium.
 * @param {number} retries - Number of retry attempts.
 * @returns {Promise<void>}
 */
const loadAllSynaxarium = async (retries = 3) => {
  state.synaxariumData = {};
  for (const month of copticMonths) {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const url = `/synaxarium/${month}.json`;
        console.log(`Fetching Synaxarium: ${url}`);
        const response = await fetch(url);
        console.log(`Fetch status for ${month}: ${response.status}`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const rawData = await response.json();

        state.synaxariumData[month] = {};
        Object.keys(rawData).forEach(dateKey => {
          const formattedKey = dateKey.replace('_', ' ');
          state.synaxariumData[month][formattedKey] = {
            event: rawData[dateKey].event || 'No Saint Recorded',
            summary: rawData[dateKey].summary || 'No summary available'
          };
        });

        console.log(`Synaxarium loaded for ${month}:`, Object.keys(state.synaxariumData[month]).length, 'entries');
        break;
      } catch (error) {
        console.error(`Attempt ${attempt} - Error loading Synaxarium for ${month}:`, error);
        if (attempt === retries) {
          state.synaxariumData[month] = {};
          for (let day = 1; day <= 30; day++) {
            state.synaxariumData[month][`${day} ${month}`] = {
              event: `Default Saint for ${month} ${day}`,
              summary: `Commemoration for ${month} ${day}`
            };
          }
          console.log(`Comprehensive fallback Synaxarium loaded for ${month}`);
        }
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
  }
};

/**
 * Retrieves the saint's event name for a Coptic date.
 * @param {string} month - The Coptic month.
 * @param {number} day - The Coptic day.
 * @param {string} liturgicalPeriod - The liturgical period.
 * @returns {string} The event name or an error message.
 */
const getSaintEventName = (month, day, liturgicalPeriod) => {
  try {
    if (!month || !copticMonths.includes(month) || !day || day < 1 || day > 30) {
      throw new Error(`Invalid Coptic date: ${month} ${day}`);
    }

    const dateKey = `${day} ${month}`;
    const monthData = state.synaxariumData[month];

    if (!monthData || !monthData[dateKey]) {
      console.warn(`No event found for ${dateKey} in ${month} data`);
      return "No Saint Recorded";
    }

    const eventName = monthData[dateKey].event;
    console.log(`Saint event for ${dateKey} in ${liturgicalPeriod}: ${eventName}`);
    return eventName;
  } catch (error) {
    console.error(`Error in getSaintEventName for ${month} ${day}:`, error);
    return "Error retrieving saint event";
  }
};

/**
 * Loads Bible data.
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
          console.warn(`${dataKeys[i].replace('Data', '')} not loaded.`);
        }
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
  }
};

/**
 * Loads Desert Fathers sayings.
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
        processSayings(data, letter, format);
        break;
      } catch (error) {
        console.error(`Attempt ${attempt} - Failed to fetch ${letter}.json:`, error.message);
        if (attempt === retries) {
          console.warn(`${letter}.json not loaded.`);
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
 * @param {string} letter - The Greek letter.
 * @param {string} format - The data format ('key-value' or 'figures').
 */
const processSayings = (data, letter, format = 'key-value') => {
  let sayingsCount = 0;
  if (format === 'key-value') {
    if (data && typeof data === 'object' && !Array.isArray(data)) {
      for (const father in data) {
        if (data.hasOwnProperty(father) && Array.isArray(data[father])) {
          for (const saying of data[father]) {
            if (saying.text) {
              state.desertFathersData.push({ father, text: saying.text });
              sayingsCount++;
            }
          }
        }
      }
    } else if (Array.isArray(data)) {
      for (const entry of data) {
        if (entry.name && entry.saying) {
          state.desertFathersData.push({ father: entry.name, text: entry.saying });
          sayingsCount++;
        }
      }
    }
  } else if (format === 'figures') {
    if (data?.figures) {
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
 * Gets the appropriate Agpeya prayer based on time.
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
  if (button) button.disabled = true;
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
  if (button) button.disabled = true;
  loading.style.display = 'block';

  try {
    const coptic = getCopticDate(new Date());
    const liturgicalPeriod = getLiturgicalPeriod(new Date());
    console.log('Coptic Date:', coptic, 'Liturgical Period:', liturgicalPeriod);
    const eventName = getSaintEventName(coptic.month, coptic.day, liturgicalPeriod);
    clearGreeting();
    chatBox.appendChild(createChatMessage(eventName, 'ai'));
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
  if (button) button.disabled = true;
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
  if (button) button.disabled = true;
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
  ['agpeyaButton', 'saintButton', 'scriptureButton', 'desertButton'].forEach(id => {
    const button = document.getElementById(id);
    if (button) button.disabled = false;
  });
  generateInitialMessages();
};

/**
 * Initializes the application.
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
    translateError: document.getElementById('translateError'),
  };
  for (const [key, element] of Object.entries(requiredElements)) {
    if (!element) {
      console.error(`Missing DOM element: ${key}`);
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
    const liturgicalPeriod = getLiturgicalPeriod(new Date());
    liturgicalContext.innerHTML = `${coptic.copticDate}, ${coptic.copticYear} • ${liturgicalPeriod}`;
  } catch (error) {
    console.error('Error during initialization:', error);
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

  // YesChat Iframe Toggle
  let iframeLoaded = false;
  if (requiredElements.toggleIframeButton && requiredElements.externalAiContainer) {
    requiredElements.toggleIframeButton.addEventListener('click', () => {
      const isHidden = requiredElements.externalAiContainer.style.display === 'none';
      requiredElements.toggleIframeButton.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
      requiredElements.externalAiContainer.setAttribute('aria-hidden', isHidden ? 'false' : 'true');
      if (isHidden) {
        requiredElements.externalAiContainer.style.display = 'block';
        requiredElements.toggleIframeButton.innerHTML = '<i class="fas fa-robot" aria-hidden="true"></i><span>Hide AI Chat</span><span class="sr-only">Hide AI Chat</span>';
        if (!iframeLoaded) {
          requiredElements.iframeLoading.style.display = 'block';
          const iframe = document.createElement('iframe');
          iframe.src = 'https://www.yeschat.ai/i/gpts-9t563I1Lfm8-Coptic-Guide';
          iframe.width = '800';
          iframe.height = '500';
          iframe.style.maxWidth = '100%';
          iframe.style.border = 'none';
          iframe.title = 'Coptic Guide AI Chat';
          iframe.loading = 'lazy';
          iframe.onload = () => {
            requiredElements.iframeLoading.style.display = 'none';
            iframeLoaded = true;
          };
          iframe.onerror = () => {
            requiredElements.iframeLoading.style.display = 'none';
            requiredElements.iframeError.style.display = 'block';
            console.error('Failed to load Coptic Guide AI iframe.');
          };
          requiredElements.iframeWrapper.appendChild(iframe);
        }
      } else {
        requiredElements.externalAiContainer.style.display = 'none';
        requiredElements.toggleIframeButton.innerHTML = '<i class="fas fa-robot" aria-hidden="true"></i><span>Show AI Chat</span><span class="sr-only">Show AI Chat</span>';
      }
    });
  }

  // Translation AI Iframe Toggle
let translateIframeLoaded = false;
if (requiredElements.translateButton && requiredElements.translateAiContainer) {
  requiredElements.translateButton.addEventListener('click', () => {
    const isHidden = requiredElements.translateAiContainer.style.display === 'none';
    requiredElements.translateButton.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
    requiredElements.translateAiContainer.setAttribute('aria-hidden', isHidden ? 'false' : 'true');
    if (isHidden) {
      requiredElements.translateAiContainer.style.display = 'block';
      requiredElements.translateButton.innerHTML = '<i class="fas fa-language" aria-hidden="true"></i><span class="button-label">Translate</span><span class="sr-only">Hide Translation AI</span>';
      if (!translateIframeLoaded) {
        requiredElements.translateLoading.style.display = 'block';
        const iframe = document.createElement('iframe');
        iframe.src = 'https://udify.app/chat/5ZZkrzj9sfa4ejsT';
        iframe.width = '800';
        iframe.height = '500';
        iframe.style.maxWidth = '100%';
        iframe.style.border = 'none';
        iframe.title = 'English to Coptic Translation AI';
        iframe.loading = 'lazy';
        iframe.onload = () => {
          requiredElements.translateLoading.style.display = 'none';
          translateIframeLoaded = true;
        };
        iframe.onerror = () => {
          requiredElements.translateLoading.style.display = 'none';
          requiredElements.translateError.style.display = 'block';
          console.error('Failed to load Translation AI iframe.');
        };
        requiredElements.translateWrapper.appendChild(iframe);
      }
    } else {
      requiredElements.translateAiContainer.style.display = 'none';
      requiredElements.translateButton.innerHTML = '<i class="fas fa-language" aria-hidden="true"></i><span class="button-label">Translate</span><span class="sr-only">Show Translation AI</span>';
    }
  });
}
});
// Deterministic page router for the voice/chat helper.
// Add more keywords per page as you find real user phrasing.

export const APP_ROUTES = [
  {
    path: '/diagnose',
    label: 'Diagnose',
    keywords: ['diagnose', 'diagnosis', 'disease', 'sick crop', 'sick animal', 'problem in crop',
      'వ్యాధి', 'నిర్ధారణ', 'డయాగ్నోస్', 'रोग', 'निदान'],
  },
  {
    path: '/crop-planner',
    label: 'Crop Planner',
    keywords: ['crop planner', 'crop plan', 'crops page', 'which crop', 'what to grow', 'crop planning',
      'క్రాప్ ప్లానర్', 'పంట ప్రణాళిక', 'फसल योजना'],
  },
  {
    path: '/crop-passport',
    label: 'Crop Passport',
    keywords: ['crop passport', 'passport', 'క్రాప్ పాస్‌పోర్ట్', 'फसल पासपोर्ट'],
  },
  {
    path: '/loan-eligibility',
    label: 'Loan Eligibility',
    keywords: ['loan eligibility', 'loan', 'eligible for loan', 'రుణ అర్హత', 'ఋణం', 'ऋण पात्रता', 'लोन'],
  },
  {
    path: '/soil-passport',
    label: 'Soil Passport',
    keywords: ['soil passport', 'soil test', 'soil report', 'నేల పాస్‌పోర్ట్', 'मिट्टी'],
  },
  {
    path: '/livestock-care',
    label: 'Livestock Care',
    keywords: ['livestock', 'animal care', 'cattle', 'poultry', 'dairy', 'పశువుల సంరక్షణ', 'पशुधन'],
  },
  {
    path: '/animal-encyclopedia',
    label: 'Animal Encyclopedia',
    keywords: ['animal encyclopedia', 'animal breeds', 'poultry breeds', 'dairy breeds', 'goat breeds',
      'fish farming', 'apiculture', 'bee keeping', 'piggery', 'rabbit farming', 'vaccination schedule',
      'జంతు విజ్ఞాన సర్వస్వం', 'पशु विश्वकोश'],
  },
  {
    path: '/farm-ledger',
    label: 'Farm Ledger',
    keywords: ['farm ledger', 'expenses', 'income', 'ledger', 'ఖర్చులు', 'खाता'],
  },
  {
    path: '/market-prices',
    label: 'Market Prices',
    keywords: ['market price', 'mandi rate', 'price today', 'మార్కెట్ ధరలు', 'मंडी भाव'],
  },
  {
    path: '/near-me',
    label: 'Near Me',
    keywords: ['near me', 'nearby kvk', 'nearby market', 'దగ్గర్లో', 'पास में'],
  },
  {
    path: '/government-schemes',
    label: 'Government Schemes',
    keywords: ['scheme', 'government scheme', 'subsidy', 'పథకం', 'योजना'],
  },
  {
    path: '/insurance',
    label: 'Insurance',
    keywords: ['insurance', 'crop insurance', 'బీమా', 'बीमा'],
  },
  {
    path: '/inventory',
    label: 'Inventory',
    keywords: ['inventory', 'stock', 'నిల్వ', 'भंडार'],
  },
  {
    path: '/equipment-registry',
    label: 'Equipment Registry',
    keywords: ['equipment', 'machinery', 'tractor', 'పరికరాలు', 'उपकरण'],
  },
  {
    path: '/resource-marketplace',
    label: 'Resource Marketplace',
    keywords: ['marketplace', 'rent tractor', 'buy equipment', 'మార్కెట్‌ప్లేస్'],
  },
  {
    path: '/irrigation-planner',
    label: 'Irrigation',
    keywords: ['irrigation', 'water schedule', 'నీటిపారుదల', 'सिंचाई'],
  },
  {
    path: '/weather-alerts',
    label: 'Weather',
    keywords: ['weather', 'rain forecast', 'వాతావరణం', 'मौसम'],
  },
  {
    path: '/sensor-lab',
    label: 'Sensor Lab',
    keywords: ['sensor', 'soil sample', 'water sample', 'సెన్సార్'],
  },
  {
    path: '/community-forum',
    label: 'Community',
    keywords: ['community', 'forum', 'other farmers', 'సంఘం', 'समुदाय'],
  },
  {
    path: '/profile-settings',
    label: 'Profile & Settings',
    keywords: ['profile', 'settings', 'account', 'ప్రొఫైల్', 'प्रोफाइल'],
  },
  {
    path: '/dashboard',
    label: 'Dashboard',
    keywords: ['dashboard', 'home', 'డాష్‌బోర్డ్', 'होम'],
  },
];

const YES_WORDS = ['yes', 'yeah', 'yep', 'ok', 'okay', 'sure', 'open it', 'open', 'avunu', 'అవును', 'ha', 'हाँ', 'हा'];
const NO_WORDS = ['no', 'nope', 'nah', 'kadu', 'కాదు', 'nahi', 'नहीं'];

const normalize = (s) => (s || '').toLowerCase().trim();

export function isYes(text) {
  const t = normalize(text);
  return YES_WORDS.some((w) => t === w || t.startsWith(w + ' '));
}

export function isNo(text) {
  const t = normalize(text);
  return NO_WORDS.some((w) => t === w || t.startsWith(w + ' '));
}

// Returns the best-matching route for free text, or null if nothing matches well.
export function resolvePageIntent(text) {
  const t = normalize(text);
  if (!t) return null;

  let best = null;
  let bestScore = 0;

  for (const route of APP_ROUTES) {
    for (const kw of route.keywords) {
      const kwNorm = normalize(kw);
      if (!kwNorm) continue;
      if (t.includes(kwNorm)) {
        const score = kwNorm.length; // longer, more specific keyword wins
        if (score > bestScore) {
          bestScore = score;
          best = route;
        }
      }
    }
  }
  return best;
}

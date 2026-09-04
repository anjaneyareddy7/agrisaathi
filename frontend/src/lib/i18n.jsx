import { createContext, useContext, useState, useEffect } from 'react'

const LanguageContext = createContext();

export const LANGS = [
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'hi', label: 'हिं', name: 'हिन्दी' },
  { code: 'te', label: 'తె', name: 'తెలుగు' },
];

export const labels = {
  /* ── App & nav ─────────────────────────────────── */
  appName: { en: 'AgriSaathi', hi: 'अग्रीसाथी', te: 'అగ్రిసాథీ' },
  nav_home: {
    en: 'Home', hi: 'होम', te: 'హోమ్', ta: 'முகப்பு', kn: 'ಮುಖಪುಟ', mr: 'मुख्यपृष्ठ',
    bn: 'হোম', gu: 'હોમ', pa: 'ਹੋਮ', ml: 'ഹോം',
  },
  nav_diagnose: {
    en: 'Diagnose', hi: 'निदान', te: 'రోగ నిర్ణయం', ta: 'நோய் கண்டறிதல்', kn: 'ರೋಗ ಪತ್ತೆ',
    mr: 'निदान', bn: 'নির্ণয়', gu: 'નિદાન', pa: 'ਨਿਦਾਨ', ml: 'രോഗനിർണയം',
  },
  nav_prices: {
    en: 'Prices', hi: 'भाव', te: 'ధరలు', ta: 'விலைகள்', kn: 'ಬೆಲೆಗಳು', mr: 'भाव',
    bn: 'দাম', gu: 'ભાવ', pa: 'ਭਾਅ', ml: 'വിലകൾ',
  },
  nav_weather: {
    en: 'Weather', hi: 'मौसम', te: 'వాతావరణం', ta: 'வானிலை', kn: 'ಹವಾಮಾನ',
    mr: 'हवामान', bn: 'আবহাওয়া', gu: 'હવામાન', pa: 'ਮੌਸਮ', ml: 'കാലാവസ്ഥ',
  },
  nav_schemes: {
    en: 'Schemes', hi: 'योजनाएँ', te: 'పథకాలు', ta: 'திட்டங்கள்', kn: 'ಯೋಜನೆಗಳು',
    mr: 'योजना', bn: 'প্রকল্প', gu: 'યોજનાઓ', pa: 'ਯੋਜਨਾਵਾਂ', ml: 'പദ്ധതികൾ',
  },
  nav_nearMe: {
    en: 'Near Me', hi: 'आस-पास', te: 'దగ్గరలో', ta: 'அருகில்', kn: 'ಹತ್ತಿರ',
    mr: 'जवळपास', bn: 'কাছাকাছি', gu: 'નજીક', pa: 'ਨੇੜੇ', ml: 'അടുത്ത്',
  },
  nav_crops: {
    en: 'Crops', hi: 'फसलें', te: 'పంటలు', ta: 'பயிர்கள்', kn: 'ಬೆಳೆಗಳು',
    mr: 'पिके', bn: 'ফসল', gu: 'પાકો', pa: 'ਫਸਲਾਂ', ml: 'വിളകൾ',
  },
  nav_animals: {
    en: 'Animals', hi: 'पशु', te: 'జంతువులు', ta: 'விலங்குகள்', kn: 'ಪ್ರಾಣಿಗಳು',
    mr: 'प्राणी', bn: 'পশু', gu: 'પ્રાણીઓ', pa: 'ਜਾਨਵਰ', ml: 'മൃഗങ്ങൾ',
  },
  my_farm: {
    en: 'My Farm', hi: 'मेरा खेत', te: 'నా పొలం', ta: 'என் பண்ணை', kn: 'ನನ್ನ ಹೊಲ',
    mr: 'माझे शेत', bn: 'আমার খামার', gu: 'મારું ખેત', pa: 'ਮੇਰਾ ਖੇਤ', ml: 'എന്റെ ഫാം',
  },

  /* ── Home ──────────────────────────────────────── */
  search_placeholder: {
    en: 'Search all tools…', hi: 'सभी टूल खोजें…', te: 'అన్ని సాధనాలను వెతకండి…',
    ta: 'எல்லா கருவிகளையும் தேடுங்கள்…', kn: 'ಎಲ್ಲಾ ಸಾಧನಗಳನ್ನು ಹುಡುಕಿ…',
    mr: 'सर्व साधने शोधा…', bn: 'সব টুল খুঁজুন…', gu: 'બધા સાધનો શોધો…',
    pa: 'ਸਾਰੇ ਟੂਲ ਖੋਜੋ…', ml: 'എല്ലാ ടൂളുകളും തിരയുക…',
  },
  listening: {
    en: 'Listening… speak now', hi: 'सुन रहे हैं… बोलिए', te: 'వినుతున్నాం… మాట్లాడండి',
    ta: 'கேட்கிறது… பேசுங்கள்', kn: 'ಕೇಳುತ್ತಿದ್ದೇವೆ… ಮಾತನಾಡಿ', mr: 'ऐकत आहे… बोला',
    bn: 'শুনছি… বলুন', gu: 'સાંભળી રહ્યા છીએ… બોલો', pa: 'ਸੁਣ ਰਿਹਾ ਹਾਂ… ਬੋਲੋ', ml: 'കേൾക്കുന്നു… സംസാരിക്കൂ',
  },
  you_asked: {
    en: 'You asked:', hi: 'आपने पूछा:', te: 'మీరు అడిగినది:', ta: 'நீங்கள் கேட்டது:',
    kn: 'ನೀವು ಕೇಳಿದ್ದು:', mr: 'तुम्ही विचारले:', bn: 'আপনি জিজ্ঞেস করেছেন:',
    gu: 'તમે પૂછ્યું:', pa: 'ਤੁਸੀਂ ਪੁੱਛਿਆ:', ml: 'നിങ്ങൾ ചോദിച്ചത്:',
  },
  open_action: {
    en: 'open', hi: 'खोलें', te: 'తెరవండి', ta: 'திறக்க', kn: 'ತೆರೆಯಿರಿ',
    mr: 'उघडा', bn: 'খুলুন', gu: 'ખોલો', pa: 'ਖੋਲ੍ਹੋ', ml: 'തുറക്കുക',
  },
  mandi_title: {
    en: "Today's mandi prices", hi: 'आज के मंडी भाव', te: 'ఈరోజు మండి ధరలు',
    ta: 'இன்றைய மண்டி விலைகள்', kn: 'ಇಂದಿನ ಮಂಡಿ ಬೆಲೆಗಳು', mr: 'आजचे मंडी भाव',
    bn: 'আজকের মণ্ডি দাম', gu: 'આજના માર્કેટ ભાવ', pa: 'ਅੱਜ ਦੇ ਮੰਡੀ ਭਾਅ', ml: 'ഇന്നത്തെ മണ്ഡി വിലകൾ',
  },
  see_all: {
    en: 'See all', hi: 'सभी देखें', te: 'అన్నీ చూడండి', ta: 'எல்லாம் பார்க்க',
    kn: 'ಎಲ್ಲವನ್ನೂ ನೋಡಿ', mr: 'सर्व पहा', bn: 'সব দেখুন', gu: 'બધું જુઓ',
    pa: 'ਸਭ ਵੇਖੋ', ml: 'എല്ലാം കാണുക',
  },
  explore_tools: {
    en: 'Explore tools', hi: 'साधन देखें', te: 'సాధనాలు చూడండి', ta: 'கருவிகளைப் பார்க்க',
    kn: 'ಸಾಧನಗಳನ್ನು ನೋಡಿ', mr: 'साधने पहा', bn: 'টুল দেখুন', gu: 'સાધનો જુઓ',
    pa: 'ਟੂਲ ਵੇਖੋ', ml: 'ടൂളുകൾ കാണുക',
  },
  prices_unavailable: {
    en: 'Prices unavailable right now', hi: 'अभी भाव उपलब्ध नहीं', te: 'ప్రస్తుతం ధరలు అందుబాటులో లేవు',
    ta: 'விலைகள் இப்போது இல்லை', kn: 'ಬೆಲೆಗಳು ಸದ್ಯಕ್ಕೆ ಇಲ್ಲ', mr: 'भाव सध्या उपलब्ध नाहीत',
    bn: 'এখন দাম পাওয়া যাচ্ছে না', gu: 'ભાવ હાલ ઉપલબ્ધ નથી', pa: 'ਭਾਅ ਹੁਣ ਉਪਲਬਧ ਨਹੀਂ', ml: 'വിലകൾ ലഭ്യമല്ല',
  },
  no_matches: {
    en: 'No tools match your search', hi: 'कोई टूल नहीं मिला', te: 'ఎటువంటి సాధనాలు కనబడలేదు',
    ta: 'எந்தக் கருவியும் பொருந்தவில்லை', kn: 'ಯಾವುದೇ ಸಾಧನ ಸಿಗಲಿಲ್ಲ', mr: 'साधन सापडले नाही',
    bn: 'কোনো টুল মেলেনি', gu: 'કોઈ સાધન મળ્યું નથી', pa: 'ਕੋਈ ਟੂਲ ਨਹੀਂ ਲੱਭਿਆ', ml: 'ടൂളുകൾ ഇല്ല',
  },

  /* ── Tool sections ─────────────────────────────── */
  sec_grow: {
    en: 'Grow & Plan', hi: 'खेती की योजना', te: 'పంట & ప్రణాళిక', ta: 'விளைச்சல் & திட்டமிடல்',
    kn: 'ಬೆಳೆ & ಯೋಜನೆ', mr: 'पीक & नियोजन', bn: 'চাষ & পরিকল্পনা', gu: 'પાક & આયોજન',
    pa: 'ਫਸਲ & ਯੋਜਨਾ', ml: 'കൃഷി & ആസൂത്രണം',
  },
  sec_grow_sub: {
    en: 'Sowing, soil, water and nutrients', hi: 'बुवाई, मिट्टी, पानी और पोषक तत्व',
    te: 'విత్తనం, నేల, నీరు & పోషకాలు', ta: 'விதைத்தல், மண், நீர் மற்றும் ஊட்டச்சத்து',
    kn: 'ಬಿತ್ತನೆ, ಮಣ್ಣು, ನೀರು ಮತ್ತು ಪೋಷಕಾಂಶ', mr: 'पेरणी, माती, पाणी व पोषक तत्त्वे',
    bn: 'বপন, মাটি, জল ও পুষ্টি', gu: 'વાવણી, માટી, પાણી અને પોષક તત્વો',
    pa: 'ਬੀਜਾਈ, ਮਿੱਟੀ, ਪਾਣੀ ਅਤੇ ਪੌਸ਼ਟਿਕ ਤੱਤ', ml: 'വിതയ്ക്കൽ, മണ്ണ്, വെള്ളം, പോഷകങ്ങൾ',
  },
  sec_protect: {
    en: 'Protect & Cure', hi: 'सुरक्षा और इलाज', te: 'రక్షణ & చికిత్స',
    ta: 'பாதுகாப்பு & சிகிச்சை', kn: 'ರಕ್ಷಣೆ & ಚಿಕಿತ್ಸೆ', mr: 'संरक्षण व उपचार',
    bn: 'সুরক্ষা ও চিকিৎসা', gu: 'રક્ષણ અને સારવાર', pa: 'ਬਚਾਅ ਅਤੇ ਇਲਾਜ', ml: 'സംരക്ഷണവും ചികിത്സയും',
  },
  sec_protect_sub: {
    en: 'Diagnose problems and act early', hi: 'रोग पहचानें और जल्दी कार्य करें',
    te: 'సమస్యలను గుర్తించి త్వరగా చర్య తీసుకోండి',
    ta: 'நோய்களைக் கண்டறிந்து விரைவில் நடவடிக்கை', kn: 'ಸಮಸ್ಯೆಗಳನ್ನು ಗುರುತಿಸಿ ಬೇಗ ನಟಿಸಿ',
    mr: 'आजारी ओळखा आणि लवकर उपाय करा', bn: 'সমস্যা চিনুন এবং দ্রুত ব্যবস্থা নিন',
    gu: 'સમસ્યા ઓળખો અને ઝડપથી કાર્ય કરો', pa: 'ਸਮੱਸਿਆ ਪਛਾਣੋ ਅਤੇ ਜਲਦੀ ਕਦਮ ਚੁੱਕੋ',
    ml: 'പ്രശ്നങ്ങൾ തിരിച്ചറിഞ്ഞ് വേഗം പ്രവർത്തിക്കുക',
  },
  sec_animals: {
    en: 'Livestock', hi: 'पशुधन', te: 'పశుసంపద', ta: 'கால்நடை', kn: 'ಜಾನುವಾರು',
    mr: 'जनावरे', bn: 'পশুসম্পদ', gu: 'પશુધન', pa: 'ਪਸ਼ੂਧਨ', ml: 'കന്നുകാലി',
  },
  sec_animals_sub: {
    en: 'Care for cows, goats, poultry and fish', hi: 'गाय, बकरी, मुर्गी और मछली की देखभाल',
    te: 'ఆవులు, మేకలు, కోళ్లు & చేపల సంరక్షణ',
    ta: 'மாடு, ஆடு, கோழி மற்றும் மீன் பராமரிப்பு',
    kn: 'ಹಸು, ಆಡು, ಕೋಳಿ ಮತ್ತು ಮೀನು ಆರೈಕೆ', mr: 'गाय, शेळी, कोळी व मासे काळजी',
    bn: 'গরু, ছাগল, মুরগি ও মাছের যত্ন', gu: 'ગાય, બકરી, કૂકડા અને માછલીની સંભાળ',
    pa: 'ਗਾਂਵਾਂ, ਬਕਰੀਆਂ, ਮੁਰਗੀਆਂ ਅਤੇ ਮੱਛੀਆਂ ਦੀ ਦੇਖਭਾਲ', ml: 'പശു, ആട്, കോഴി, മത്സ്യ പരിപാലനം',
  },
  sec_market: {
    en: 'Market & Money', hi: 'बाज़ार और पैसा', te: 'మార్కెట్ & డబ్బు', ta: 'சந்தை & பணம்',
    kn: 'ಮಾರುಕಟ್ಟೆ & ಹಣ', mr: 'बाजार व पैसा', bn: 'বাজার ও টাকা',
    gu: 'બજાર અને પૈસા', pa: 'ਬਾਜ਼ਾਰ ਅਤੇ ਪੈਸਾ', ml: 'വിപണിയും പണവും',
  },
  sec_market_sub: {
    en: 'Prices, selling, loans and insurance', hi: 'भाव, बिक्री, ऋण और बीमा',
    te: 'ధరలు, అమ్మకం, రుణలు & బీమా', ta: 'விலை, விற்பனை, கடன் மற்றும் காப்பீடு',
    kn: 'ಬೆಲೆ, ಮಾರಾಟ, ಸಾಲ ಮತ್ತು ವಿಮೆ', mr: 'भाव, विक्री, कर्ज व विमा',
    bn: 'দাম, বিক্রি, ঋণ ও বিমা', gu: 'ભાવ, વેચાણ, લોન અને વીમો',
    pa: 'ਭਾਅ, ਵਿਕਰੀ, ਕਰਜ਼ਾ ਅਤੇ ਬੀਮਾ', ml: 'വില, വിൽപ്പന, വായ്പ, ഇൻഷുറൻസ്',
  },
  sec_learn: {
    en: 'Learn & Community', hi: 'सीखें और साझा करें', te: 'నేర్చుకోండి & కమ్యూనిటీ',
    ta: 'கற்றுக்கொள் & சமூகம்', kn: 'ಕಲಿಯಿರಿ & ಸಮುದಾಯ', mr: 'शिका व समुदाय',
    bn: 'শিখুন ও সম্প্রদায়', gu: 'શીખો અને સમુદાય', pa: 'ਸਿੱਖੋ ਅਤੇ ਸਾਂਝਾ', ml: 'പഠിക്കുകയും കൂട്ടായ്മയും',
  },
  sec_learn_sub: {
    en: 'Schemes, experts and fellow farmers', hi: 'योजनाएँ, विशेषज्ञ और साथी किसान',
    te: 'పథకాలు, నిపుణులు & రైతులు', ta: 'திட்டங்கள், நிபுணர்கள் மற்றும் விவசாயிகள்',
    kn: 'ಯೋಜನೆಗಳು, ತಜ್ಞರು ಮತ್ತು ರೈತರು', mr: 'योजना, तज्ज्ञ आणि सहकारी शेतकरी',
    bn: 'প্রকল্প, বিশেষজ্ঞ ও কৃষক', gu: 'યોજનાઓ, નિષ્ણાતો અને ખેડૂતો',
    pa: 'ਯੋਜਨਾਵਾਂ, ਮਾਹਿਰ ਅਤੇ ਕਿਸਾਨ', ml: 'പദ്ധതികൾ, വിദഗ്ധർ, കർഷകർ',
  },
  sec_manage: {
    en: 'Manage My Farm', hi: 'मेरा खेत प्रबंधन', te: 'నా పొలం నిర్వహణ',
    ta: 'என் பண்ணை நிர்வாகம்', kn: 'ನನ್ನ ಹೊಲ ನಿರ್ವಹಣೆ', mr: 'माझे शेत व्यवस्थापন',
    bn: 'আমার খামার পরিচালনা', gu: 'મારું ખેત સંચાલન', pa: 'ਮੇਰਾ ਖੇਤ ਪ੍ਰਬੰਧਨ', ml: 'എന്റെ ഫാം നിര്വഹണം',
  },
  sec_manage_sub: {
    en: 'Records, tasks and reminders', hi: 'रिकॉर्ड, कार्य और रिमाइंडर',
    te: 'రికార్డులు, పనులు & రిమైండర్లు', ta: 'பதிவுகள், பணிகள் மற்றும் நினைவூட்டல்கள்',
    kn: 'ದಾಖಲೆಗಳು, ಕಾರ್ಯಗಳು ಮತ್ತು ಜ್ಞಾಪನೆಗಳು', mr: 'नोंदी, कामे व स्मरणपत्रके',
    bn: 'রেকর্ড, কাজ ও রিমাইন্ডার', gu: 'રેકોર્ડ, કાર્યો અને રિમાઇન્ડર',
    pa: 'ਰਿਕਾਰਡ, ਕੰਮ ਅਤੇ ਰੀਮਾਈਂਡਰ', ml: 'രേഖകൾ, ജോലികൾ, റിമൈൻഡറുകൾ',
  },

  /* ── Weather ───────────────────────────────────── */
  w_humidity: {
    en: 'Humidity', hi: 'नमी', te: 'తేమ', ta: 'ஈரப்பதம்', kn: 'ಆರ್ದ್ರತೆ',
    mr: 'आर्द्रता', bn: 'আর্দ্রতা', gu: 'ભેજ', pa: 'ਨਮੀ', ml: 'ഈർപ്പം',
  },
  w_wind: {
    en: 'Wind', hi: 'हवा', te: 'గాలి', ta: 'காற்று', kn: 'ಗಾಳಿ',
    mr: 'वारा', bn: 'বাতাস', gu: 'પવન', pa: 'ਹਵਾ', ml: 'കാറ്റ്',
  },
  w_rain_chance: {
    en: 'Rain chance', hi: 'बारिश की संभावना', te: 'వర్ష అవకాశం', ta: 'மழை வாய்ப்பு',
    kn: 'ಮಳೆ ಸಾಧ್ಯತೆ', mr: 'पाऊस संधी', bn: 'বৃষ্টির সম্ভাবনা',
    gu: 'વરસાદની શક્યતા', pa: 'ਮੀਂਹ ਦੀ ਸੰਭਾਵਨਾ', ml: 'മഴ സാധ്യത',
  },
  w_hourly: {
    en: 'Hourly · swipe for more hours', hi: 'प्रति घंटा · और देखने के लिए स्वाइप करें',
    te: 'గంటల వారీ · మరిన్ని కోసం స్వైప్ చేయండి', ta: 'மணிநேர · மேலும் ஸ்வைப் செய்யவும்',
    kn: 'ಗಂಟೆಯ · ಇನ್ನಷ್ಟಕ್ಕೆ ಸ್ವೈಪ್ ಮಾಡಿ', mr: 'ताशी · अधिकासाठी स्वाइप करा',
    bn: 'ঘণ্টাভিত্তিক · আরও দেখতে সোয়াইপ করুন', gu: 'કલાકીય · વધુ માટે સ્વાઇપ કરો',
    pa: 'ਘੰਟੇਵਾਰ · ਹੋਰ ਲਈ ਸਵਾਈਪ ਕਰੋ', ml: 'മണിക്കൂർ · കൂടുതൽ സ്വൈപ്പ് ചെയ്യുക',
  },
  w_now: {
    en: 'Now', hi: 'अभी', te: 'ఇప్పుడు', ta: 'இப்போது', kn: 'ಈಗ',
    mr: 'आता', bn: 'এখন', gu: 'હવે', pa: 'ਹੁਣ', ml: 'ഇപ്പോൾ',
  },
  w_full: {
    en: 'Full forecast & advisories', hi: 'पूरा पूर्वानुमान और सलाह', te: 'పూర్తి వాతావరణ & సలహాలు',
    ta: 'முழு வானிலை மற்றும் ஆலோசனை', kn: 'ಪೂರ್ಣ ವರದಿ ಮತ್ತು ಸಲಹೆ',
    mr: 'संपूर्ण अंदाज व सल्ला', bn: 'সম্পূর্ণ পূর্বাভাস ও পরামর্শ',
    gu: 'સંપૂર્ણ અંદાજ અને સલાહ', pa: 'ਪੂਰਾ ਅਨੁਮਾਨ ਅਤੇ ਸਲਾਹ', ml: 'പൂർണ്ണ പ്രവചനവും ഉപദേശവും',
  },
  w_live: {
    en: 'Live', hi: 'लाइव', te: 'లైవ్', ta: 'நேரலை', kn: 'ನೇರ',
    mr: 'लाइव्ह', bn: 'লাইভ', gu: 'લાઇવ', pa: 'ਲਾਈਵ', ml: 'തത്സമയം',
  },
  w_sample: {
    en: 'Sample · offline', hi: 'नमूना · ऑफ़लाइन', te: 'నమూనా · ఆఫ్‌లైన్',
    ta: 'மாதிரி · ஆஃப்லைன்', kn: 'ಮಾದರಿ · ಆಫ್‌ಲೈನ್', mr: 'नमूना · ऑफलाइन',
    bn: 'নমুনা · অফলাইন', gu: 'નમૂનો · ઑફલાઇન', pa: 'ਨਮੂਨਾ · ਆਫ਼ਲਾਈਨ', ml: 'സാമ്പിൾ · ഓഫ്‌ലൈൻ',
  },
  w_locating: {
    en: 'Locating…', hi: 'स्थान पता कर रहे हैं…', te: 'స్థానం గుర్తిస్తున్నాం…',
    ta: 'இடம் கண்டறியப்படுகிறது…', kn: 'ಸ್ಥಳ ಪತ್ತೆಯಾಗುತ್ತಿದೆ…', mr: 'स्थळ शोधत आहे…',
    bn: 'অবস্থান খুঁজছি…', gu: 'સ્થળ શોધી રહ્યા છીએ…', pa: 'ਸਥਾਨ ਪਤਾ ਲਗਾਇਆ ਜਾ ਰਿਹਾ…', ml: 'സ്ഥാനം കണ്ടെത്തുന്നു…',
  },
  w_unavailable: {
    en: 'Weather unavailable right now — please retry.',
    hi: 'मौसम जानकारी अभी उपलब्ध नहीं — फिर कोशिश करें।',
    te: 'వాతావరణ సమాచారం ప్రస్తుతం అందుబాటులో లేదు — దయచేసి మళ్లీ ప్రయత్నించండి।',
    ta: 'வானிலை தகவல் இப்போது இல்லை — மீண்டும் முயற்சிக்கவும்.',
    kn: 'ಹವಾಮಾನ ಮಾಹಿತಿ ಸದ್ಯಕ್ಕೆ ಇಲ್ಲ — ದಯವಿಟ್ಟು ಪುನಃ ಪ್ರಯತ್ನಿಸಿ.',
    mr: 'हवामान माहिती सध्या उपलब्ध नाही — पुन्हा प्रयत्न करा.',
    bn: 'আবহাওয়া তথ্য এখন পাওয়া যাচ্ছে না — আবার চেষ্টা করুন।',
    gu: 'હવામાન માહિતી હાલ ઉપલબ્ધ નથી — ફરી પ્રયત્ન કરો.',
    pa: 'ਮੌਸਮ ਜਾਣਕਾਰੀ ਹੁਣ ਉਪਲਬਧ ਨਹੀਂ — ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।',
    ml: 'കാലാവസ്ഥ വിവരങ്ങൾ ലഭ്യമല്ല — വീണ്ടും ശ്രമിക്കുക.',
  },
  w_forecast_for: {
    en: 'Check the 7-day forecast for your farm', hi: 'अपने खेत का 7-दिन का पूर्वानुमान देखें',
    te: 'మీ పొలం కోసం 7-రోజుల వాతావరణ సమాచారం చూడండి',
  },

  /* ── Tool names (English fallback for other languages) ── */
  tool_diagnosis: { en: 'Diagnosis', hi: 'रोग पहचान', te: 'వ్యాధి గుర్తింపు' },
  tool_treatments: { en: 'Treatments', hi: 'इलाज', te: 'చికిత్సలు' },
  tool_pest_library: { en: 'Pest Library', hi: 'कीट कोश', te: 'పురుగుల సమాచారం' },
  tool_weather: { en: 'Weather', hi: 'मौसम', te: 'వాతావరణం' },
  tool_alerts: { en: 'Alerts', hi: 'अलर्ट', te: 'హెచ్చరికలు' },
  tool_fertilizer: { en: 'Fertilizer', hi: 'उर्वरक', te: 'ఎరువు' },
  tool_soil_passport: { en: 'Soil Passport', hi: 'मिट्टी पासपोर्ट', te: 'నేల పాస్‌పోర్ట్' },
  tool_crop_planner: { en: 'Crop Planner', hi: 'फसल योजना', te: 'పంట ప్రణాళిక' },
  tool_crop_guides: { en: 'Crop Guides', hi: 'फसल गाइड', te: 'పంట మార్గదర్శిని' },
  tool_irrigation: { en: 'Irrigation', hi: 'सिंचाई', te: 'నీటిపారుదల' },
  tool_sensor_lab: { en: 'Sensor Lab', hi: 'सेंसर लैब', te: 'సెన్సార్ ల్యాబ్' },
  tool_sustainability: { en: 'Sustainability', hi: 'टिकाऊपन', te: 'స్థిరత్వం' },
  tool_livestock: { en: 'Livestock', hi: 'पशुधन', te: 'పశువులు' },
  tool_animal_guides: { en: 'Animal Guides', hi: 'पशु गाइड', te: 'జంతువుల మార్గదర్శిని' },
  tool_mandi_prices: { en: 'Mandi Prices', hi: 'मंडी भाव', te: 'మండి ధరలు' },
  tool_farm_ledger: { en: 'Farm Ledger', hi: 'खेत बही', te: 'పొలం ఖాతా' },
  tool_loan_help: { en: 'Loan Help', hi: 'ऋण सहायता', te: 'రుణ సహాయం' },
  tool_insurance: { en: 'Insurance', hi: 'बीमा', te: 'బీమా' },
  tool_marketplace: { en: 'Marketplace', hi: 'बाज़ार', te: 'మార్కెట్‌ప్లేస్' },
  tool_vendors: { en: 'Vendors', hi: 'विक्रेता', te: 'విక్రేతలు' },
  tool_gov_schemes: { en: 'Gov Schemes', hi: 'सरकारी योजनाएँ', te: 'ప్రభుత్వ పథకాలు' },
  tool_near_me: { en: 'Near Me', hi: 'आस-पास', te: 'దగ్గరలో' },
  tool_community: { en: 'Community', hi: 'समुदाय', te: 'కమ్యూనిటీ' },
  tool_experts: { en: 'Experts', hi: 'विशेषज्ञ', te: 'నిపుణులు' },
  tool_training: { en: 'Training', hi: 'प्रशिक्षण', te: 'శిక్షణ' },
  tool_success_stories: { en: 'Success Stories', hi: 'सफलता की कहानियाँ', te: 'విజయ గాథలు' },
  tool_gov_data: { en: 'Gov Data', hi: 'सरकारी डेटा', te: 'ప్రభుత్వ డేటా' },
  tool_dashboard: { en: 'Dashboard', hi: 'डैशबोर्ड', te: 'డాష్‌బోర్డ్' },
  tool_crop_passport: { en: 'Crop Passport', hi: 'फसल पासपोर्ट', te: 'పంట పాస్‌పోర్ట్' },
  tool_harvest: { en: 'Harvest', hi: 'कटाई', te: 'పంటకోత' },
  tool_tasks: { en: 'Tasks', hi: 'कार्य', te: 'పనులు' },
  tool_inventory: { en: 'Inventory', hi: 'इन्वेंटरी', te: 'జాబితా' },
  tool_documents: { en: 'Documents', hi: 'दस्तावेज़', te: 'పత్రాలు' },
  tool_voice_notes: { en: 'Voice Notes', hi: 'वॉइस नोट्स', te: 'వాయిస్ నోట్స్' },
  tool_notifications: { en: 'Notifications', hi: 'सूचनाएँ', te: 'నోటిఫికేషన్లు' },
  tool_profile: { en: 'Profile', hi: 'प्रोफ़ाइल', te: 'ప్రొఫైల్' },

  /* ── Legacy keys used by inner pages ───────────── */
  dashboard: { en: 'Dashboard', hi: 'डैशबोर्ड', te: 'డాష్‌బోర్డ్' },
  livestock: { en: 'Livestock', hi: 'पशुधन', te: 'పశువులు' },
  irrigation: { en: 'Irrigation', hi: 'सिंचाई', te: 'నీటిపారుదల' },
  harvest: { en: 'Harvest', hi: 'कटाई', te: 'పంటకోత' },
  loan: { en: 'Loan', hi: 'ऋण', te: 'రుణ' },
  marketplace: { en: 'Marketplace', hi: 'बाज़ार', te: 'మార్కెట్' },
  training: { en: 'Training', hi: 'प्रशिक्षण', te: 'శిక్షణ' },
  voice: { en: 'Voice Notes', hi: 'वॉइस नोट्स', te: 'వాయిస్ నోట్స్' },
  profile: { en: 'Profile', hi: 'प्रोफ़ाइल', te: 'ప్రొఫైల్' },
  community: { en: 'Community', hi: 'समुदाय', te: 'కమ్యూనిటీ' },
  schemes: { en: 'Schemes', hi: 'योजनाएँ', te: 'పథకాలు' },
  fertilizer: { en: 'Fertilizer', hi: 'उर्वरक', te: 'ఎరువు' },
  soil: { en: 'Soil Passport', hi: 'मिट्टी पासपोर्ट', te: 'నేల పాస్‌పోర్ట్' },
  planner: { en: 'Crop Planner', hi: 'फसल योजना', te: 'పంట ప్రణాళిక' },
  ledger: { en: 'Farm Ledger', hi: 'खेत बही', te: 'పొలం ఖాతా' },
  save: { en: 'Save', hi: 'सहेजें', te: 'సేవ్' },
  cancel: { en: 'Cancel', hi: 'रद्द करें', te: 'రద్దు' },
  delete: { en: 'Delete', hi: 'हटाएं', te: 'తొలగించు' },
  loading: { en: 'Loading...', hi: 'लोड हो रहा...', te: 'లోడ్ అవుతోంది...' },
  noData: { en: 'No data available', hi: 'कोई डेटा नहीं', te: 'డేటా అందుబాటులో లేదు' },
};

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('agri_lang') || 'en');
  useEffect(() => { localStorage.setItem('agri_lang', lang); }, [lang]);

  /** Translate a key; falls back to English, then to the given fallback text. */
  const t = (key, fallback) => {
    const entry = labels[key];
    if (!entry) return fallback || key;
    return entry[lang] || entry.en || fallback || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLang = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLang must be used within a LanguageProvider');
  }
  return context;
};

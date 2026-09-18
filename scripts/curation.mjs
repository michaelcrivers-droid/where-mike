/**
 * Hand-maintained curation inputs for the destination dataset builder.
 * Everything here is editorial: continents, how many cities each country may
 * contribute, which famous places must always make the cut, and which places
 * we would rather the joke did not land on.
 */

/** ISO 3166-1 alpha-2 -> continent name used by the app. */
export const CONTINENT_BY_ISO2 = Object.fromEntries(
  [
    ['North America', 'AG AI AW BB BL BM BQ BS BZ CA CR CU CW DM DO GD GL GP GT HN HT JM KN KY LC MF MQ MS MX NI PA PM PR SV SX TC TT US VC VG VI'],
    ['South America', 'AR BO BR CL CO EC FK GF GY PE PY SR UY VE'],
    ['Europe', 'AD AL AT AX BA BE BG BY CH CY CZ DE DK EE ES FI FO FR GB GG GI GR HR HU IE IM IS IT JE LI LT LU LV MC MD ME MK MT NL NO PL PT RO RS RU SE SI SJ SK SM UA VA XK'],
    ['Africa', 'AO BF BI BJ BW CD CF CG CI CM CV DJ DZ EG EH ER ET GA GH GM GN GQ GW KE KM LR LS LY MA MG ML MR MU MW MZ NA NE NG RE RW SC SD SH SL SN SO SS ST SZ TD TG TN TZ UG YT ZA ZM ZW'],
    ['Asia', 'AE AF AM AZ BD BH BN BT CC CN CX GE HK ID IL IN IO IQ IR JO JP KG KH KP KR KW KZ LA LB LK MM MN MO MV MY NP OM PH PK PS QA SA SG SY TH TJ TL TM TR TW UZ VN YE'],
    ['Oceania', 'AU CK FJ FM GU KI MH MP NC NF NR NU NZ PF PG PN PW SB TK TO TV UM VU WF WS'],
  ].flatMap(([continent, codes]) => codes.split(' ').map((code) => [code, continent])),
)
// American Samoa shares the string "AS" with no other ISO2 code; set it last so
// it is unambiguous.
CONTINENT_BY_ISO2.AS = 'Oceania'

/**
 * How many cities a country may contribute, by ISO2. Anything absent uses
 * DEFAULT_COUNTRY_QUOTA. These numbers exist purely to stop the dataset
 * turning into a list of American suburbs.
 */
export const COUNTRY_QUOTA = {
  US: 70, CN: 42, IN: 40, BR: 30, JP: 30, MX: 28, ID: 26, RU: 22,
  IT: 26, ES: 26, FR: 26, DE: 26, GB: 26, CA: 24, AU: 22, TR: 18,
  TH: 16, VN: 14, PH: 14, KR: 14, AR: 14, CO: 12, ZA: 12, EG: 12,
  MA: 12, GR: 14, PT: 12, NL: 12, PL: 12, SE: 10, NO: 10, CH: 10,
  AT: 10, BE: 8, CZ: 8, HU: 8, RO: 8, HR: 10, IE: 8, DK: 8, FI: 8,
  MY: 10, NZ: 10, PE: 10, CL: 10, EC: 8, PK: 12, BD: 10, NG: 12,
  KE: 8, TZ: 8, GH: 8, ET: 8, SA: 10, AE: 8, IL: 8, JO: 6, OM: 6,
  LK: 8, NP: 6, UA: 8, RS: 6, BG: 6, SK: 5, SI: 5, EE: 4, LV: 4,
  LT: 4, IS: 4, CU: 8, DO: 8, JM: 6, CR: 8, PA: 6, GT: 6, UY: 5,
  BO: 5, PY: 4, VE: 6, TW: 8, HK: 2, SG: 1, MM: 6, KH: 5, LA: 4,
  TN: 6, DZ: 8, SN: 5, CI: 5, CM: 5, UG: 5, ZW: 4, ZM: 4, MZ: 5,
  MG: 5, MU: 3, SC: 2, MV: 3, FJ: 4, PF: 3, NC: 2, PG: 4, VU: 2,
  WS: 2, TO: 2, CK: 1, GE: 5, AM: 4, AZ: 5, KZ: 8, UZ: 8, KG: 4,
  MN: 3, BT: 2, BN: 2, QA: 3, KW: 3, BH: 2, CY: 4, MT: 3, LU: 2,
  MC: 1, AD: 1, SM: 1, LI: 1, BS: 4, BB: 3, TT: 3, LC: 2, GD: 2,
  AG: 2, KN: 2, VC: 2, DM: 2, AW: 2, CW: 2, PR: 6, VI: 2, TC: 2,
  KY: 2, BM: 1, BZ: 3, HN: 5, NI: 5, SV: 4, SR: 2, GY: 2, GL: 2,
}

/** Quota for any country not named above. Keeps the long tail represented. */
export const DEFAULT_COUNTRY_QUOTA = 4

/**
 * Places that must appear even if population alone would not earn them a
 * slot. Key is `City|ISO2` exactly as city-timezones spells the city.
 * The value, when present, pins the category.
 */
export const MUST_INCLUDE = {
  // Europe
  'Paris|FR': 'major-city', 'Nice|FR': 'beach', 'Cannes|FR': 'vacation',
  'Bordeaux|FR': 'historic', 'Lyon|FR': 'major-city', 'Marseille|FR': 'beach',
  'Chamonix|FR': 'mountain', 'Biarritz|FR': 'beach', 'Ajaccio|FR': 'island',
  'Rome|IT': 'historic', 'Venice|IT': 'historic', 'Florence|IT': 'historic',
  'Milan|IT': 'major-city', 'Naples|IT': 'historic', 'Palermo|IT': 'island',
  'Verona|IT': 'historic', 'Bologna|IT': 'historic', 'Turin|IT': 'major-city',
  'Bari|IT': 'beach', 'Cagliari|IT': 'island', 'Catania|IT': 'island',
  'Barcelona|ES': 'nightlife', 'Madrid|ES': 'capital', 'Seville|ES': 'historic',
  'Valencia|ES': 'beach', 'Malaga|ES': 'beach', 'Granada|ES': 'historic',
  'Bilbao|ES': 'small-city', 'Palma|ES': 'island', 'Ibiza|ES': 'nightlife',
  'Las Palmas|ES': 'island', 'San Sebastian|ES': 'beach',
  'Lisbon|PT': 'capital', 'Porto|PT': 'historic', 'Funchal|PT': 'island',
  'Faro|PT': 'beach', 'Ponta Delgada|PT': 'island',
  'Athens|GR': 'historic', 'Thessaloniki|GR': 'major-city', 'Heraklion|GR': 'island',
  'Rhodes|GR': 'island', 'Corfu|GR': 'island', 'Chania|GR': 'island',
  'London|GB': 'major-city', 'Edinburgh|GB': 'historic', 'Manchester|GB': 'major-city',
  'Liverpool|GB': 'major-city', 'Bath|GB': 'historic', 'Brighton|GB': 'beach',
  'Glasgow|GB': 'major-city', 'Bristol|GB': 'small-city', 'Belfast|GB': 'small-city',
  'Dublin|IE': 'capital', 'Galway|IE': 'small-city', 'Cork|IE': 'small-city',
  'Amsterdam|NL': 'nightlife', 'Rotterdam|NL': 'major-city', 'Utrecht|NL': 'small-city',
  'Brussels|BE': 'capital', 'Bruges|BE': 'historic', 'Antwerp|BE': 'major-city',
  'Berlin|DE': 'nightlife', 'Munich|DE': 'major-city', 'Hamburg|DE': 'major-city',
  'Cologne|DE': 'major-city', 'Frankfurt|DE': 'major-city', 'Dresden|DE': 'historic',
  'Heidelberg|DE': 'historic', 'Stuttgart|DE': 'major-city',
  'Vienna|AT': 'capital', 'Salzburg|AT': 'historic', 'Innsbruck|AT': 'mountain',
  'Zurich|CH': 'major-city', 'Geneva|CH': 'major-city', 'Lucerne|CH': 'mountain',
  'Interlaken|CH': 'mountain', 'Zermatt|CH': 'mountain', 'Bern|CH': 'capital',
  'Prague|CZ': 'historic', 'Budapest|HU': 'capital', 'Krakow|PL': 'historic',
  'Warsaw|PL': 'capital', 'Gdansk|PL': 'historic', 'Ljubljana|SI': 'capital',
  'Zagreb|HR': 'capital', 'Split|HR': 'beach', 'Dubrovnik|HR': 'historic',
  'Copenhagen|DK': 'capital', 'Stockholm|SE': 'capital', 'Gothenburg|SE': 'major-city',
  'Oslo|NO': 'capital', 'Bergen|NO': 'small-city', 'Tromso|NO': 'mountain',
  'Helsinki|FI': 'capital', 'Reykjavik|IS': 'capital',
  'Tallinn|EE': 'historic', 'Riga|LV': 'historic', 'Vilnius|LT': 'capital',
  'Istanbul|TR': 'major-city', 'Antalya|TR': 'beach', 'Izmir|TR': 'beach',
  'Bodrum|TR': 'beach', 'Cappadocia|TR': 'historic',
  'Valletta|MT': 'historic', 'Monaco|MC': 'nightlife', 'Luxembourg|LU': 'capital',
  'Santorini|GR': 'island', 'Mykonos|GR': 'island',
  // North America
  'New York|US': 'major-city', 'Los Angeles|US': 'major-city', 'Chicago|US': 'major-city',
  'San Francisco|US': 'major-city', 'Miami|US': 'beach', 'New Orleans|US': 'nightlife',
  'Las Vegas|US': 'nightlife', 'Seattle|US': 'major-city', 'Austin|US': 'nightlife',
  'Nashville|US': 'nightlife', 'Boston|US': 'historic', 'Denver|US': 'mountain',
  'Honolulu|US': 'tropical', 'San Diego|US': 'beach', 'Portland|US': 'small-city',
  'Savannah|US': 'historic', 'Charleston|US': 'historic', 'Aspen|US': 'mountain',
  'Key West|US': 'island', 'Santa Fe|US': 'historic', 'Palm Springs|US': 'vacation',
  'Jackson|US': 'mountain', 'Anchorage|US': 'small-city', 'Sedona|US': 'mountain',
  'Toronto|CA': 'major-city', 'Vancouver|CA': 'major-city', 'Montreal|CA': 'major-city',
  'Quebec|CA': 'historic', 'Banff|CA': 'mountain', 'Whistler|CA': 'mountain',
  'Victoria|CA': 'small-city', 'Halifax|CA': 'small-city', 'Ottawa|CA': 'capital',
  'Mexico City|MX': 'major-city', 'Cancun|MX': 'beach', 'Tulum|MX': 'beach',
  'Playa del Carmen|MX': 'beach', 'Puerto Vallarta|MX': 'beach', 'Oaxaca|MX': 'historic',
  'Guadalajara|MX': 'major-city', 'San Miguel de Allende|MX': 'historic',
  'Cabo San Lucas|MX': 'vacation', 'Merida|MX': 'historic',
  // Caribbean & Central America
  'Havana|CU': 'historic', 'Varadero|CU': 'beach', 'Nassau|BS': 'island',
  'Montego Bay|JM': 'beach', 'Kingston|JM': 'capital', 'San Juan|PR': 'island',
  'Bridgetown|BB': 'island', 'Castries|LC': 'island', "Saint George's|GD": 'island',
  'Oranjestad|AW': 'island', 'Willemstad|CW': 'island', 'Punta Cana|DO': 'beach',
  'Santo Domingo|DO': 'capital', 'Port of Spain|TT': 'island',
  'San Jose|CR': 'capital', 'Liberia|CR': 'tropical', 'Panama City|PA': 'major-city',
  'Antigua|GT': 'historic', 'Belize City|BZ': 'tropical', 'Roatan|HN': 'island',
  'Granada|NI': 'historic', 'Bocas del Toro|PA': 'island',
  // South America
  'Rio de Janeiro|BR': 'beach', 'Sao Paulo|BR': 'major-city', 'Salvador|BR': 'beach',
  'Florianopolis|BR': 'island', 'Buzios|BR': 'beach', 'Brasilia|BR': 'capital',
  'Buenos Aires|AR': 'major-city', 'Mendoza|AR': 'mountain', 'Bariloche|AR': 'mountain',
  'Ushuaia|AR': 'mountain', 'Santiago|CL': 'capital', 'Valparaiso|CL': 'beach',
  'Lima|PE': 'capital', 'Cusco|PE': 'historic', 'Arequipa|PE': 'historic',
  'Bogota|CO': 'capital', 'Cartagena|CO': 'historic', 'Medellin|CO': 'major-city',
  'Quito|EC': 'capital', 'Montevideo|UY': 'capital', 'Punta del Este|UY': 'beach',
  'La Paz|BO': 'mountain', 'Asuncion|PY': 'capital', 'Georgetown|GY': 'capital',
  // Africa & Middle East
  'Cape Town|ZA': 'major-city', 'Johannesburg|ZA': 'major-city', 'Durban|ZA': 'beach',
  'Stellenbosch|ZA': 'small-city', 'Marrakesh|MA': 'historic', 'Casablanca|MA': 'major-city',
  'Fes|MA': 'historic', 'Tangier|MA': 'beach', 'Essaouira|MA': 'beach',
  'Cairo|EG': 'historic', 'Luxor|EG': 'historic', 'Sharm ash Shaykh|EG': 'beach',
  'Hurghada|EG': 'beach', 'Nairobi|KE': 'capital', 'Mombasa|KE': 'beach',
  'Zanzibar|TZ': 'island', 'Arusha|TZ': 'small-city', 'Victoria|SC': 'island',
  'Port Louis|MU': 'island', 'Dakar|SN': 'capital', 'Accra|GH': 'capital',
  'Lagos|NG': 'major-city', 'Addis Ababa|ET': 'capital', 'Tunis|TN': 'capital',
  'Windhoek|NA': 'capital', 'Gaborone|BW': 'capital', 'Kigali|RW': 'capital',
  'Dubai|AE': 'major-city', 'Abu Dhabi|AE': 'capital', 'Doha|QA': 'major-city',
  'Muscat|OM': 'capital', 'Amman|JO': 'capital', 'Tel Aviv-Yafo|IL': 'nightlife',
  'Jerusalem|IL': 'historic', 'Manama|BH': 'capital', 'Kuwait City|KW': 'capital',
  // Asia
  'Tokyo|JP': 'major-city', 'Kyoto|JP': 'historic', 'Osaka|JP': 'major-city',
  'Sapporo|JP': 'mountain', 'Okinawa|JP': 'island', 'Hiroshima|JP': 'historic',
  'Nara|JP': 'historic', 'Fukuoka|JP': 'major-city', 'Naha|JP': 'island',
  'Seoul|KR': 'major-city', 'Busan|KR': 'beach', 'Jeju|KR': 'island',
  'Bangkok|TH': 'major-city', 'Chiang Mai|TH': 'historic', 'Phuket|TH': 'tropical',
  'Krabi|TH': 'beach', 'Pattaya|TH': 'beach', 'Ko Samui|TH': 'island',
  'Singapore|SG': 'major-city', 'Kuala Lumpur|MY': 'major-city', 'Penang|MY': 'island',
  'Langkawi|MY': 'island', 'Kota Kinabalu|MY': 'tropical',
  'Bali|ID': 'tropical', 'Denpasar|ID': 'tropical', 'Jakarta|ID': 'major-city',
  'Yogyakarta|ID': 'historic', 'Ubud|ID': 'tropical', 'Lombok|ID': 'island',
  'Hanoi|VN': 'capital', 'Ho Chi Minh City|VN': 'major-city', 'Da Nang|VN': 'beach',
  'Hoi An|VN': 'historic', 'Nha Trang|VN': 'beach', 'Ha Long|VN': 'vacation',
  'Manila|PH': 'major-city', 'Cebu|PH': 'island', 'Boracay|PH': 'island',
  'Palawan|PH': 'island', 'Siem Reap|KH': 'historic', 'Phnom Penh|KH': 'capital',
  'Luang Prabang|LA': 'historic', 'Vientiane|LA': 'capital',
  'Hong Kong|HK': 'major-city', 'Macau|MO': 'nightlife', 'Taipei|TW': 'major-city',
  'Shanghai|CN': 'major-city', 'Beijing|CN': 'capital', 'Chengdu|CN': 'major-city',
  'Guilin|CN': 'mountain', 'Xian|CN': 'historic', 'Hangzhou|CN': 'historic',
  'Mumbai|IN': 'major-city', 'New Delhi|IN': 'capital', 'Jaipur|IN': 'historic',
  'Goa|IN': 'beach', 'Udaipur|IN': 'historic', 'Varanasi|IN': 'historic',
  'Bengaluru|IN': 'major-city', 'Kochi|IN': 'beach', 'Agra|IN': 'historic',
  'Colombo|LK': 'capital', 'Kandy|LK': 'historic', 'Galle|LK': 'beach',
  'Male|MV': 'island', 'Kathmandu|NP': 'mountain', 'Pokhara|NP': 'mountain',
  'Thimphu|BT': 'mountain', 'Tbilisi|GE': 'capital', 'Yerevan|AM': 'capital',
  'Baku|AZ': 'capital', 'Almaty|KZ': 'major-city', 'Tashkent|UZ': 'capital',
  'Samarkand|UZ': 'historic', 'Bukhara|UZ': 'historic',
  // Oceania
  'Sydney|AU': 'major-city', 'Melbourne|AU': 'major-city', 'Brisbane|AU': 'major-city',
  'Perth|AU': 'beach', 'Cairns|AU': 'tropical', 'Gold Coast|AU': 'beach',
  'Adelaide|AU': 'major-city', 'Hobart|AU': 'island', 'Byron Bay|AU': 'beach',
  'Darwin|AU': 'tropical', 'Canberra|AU': 'capital',
  'Auckland|NZ': 'major-city', 'Wellington|NZ': 'capital', 'Queenstown|NZ': 'mountain',
  'Christchurch|NZ': 'small-city', 'Rotorua|NZ': 'vacation',
  'Suva|FJ': 'island', 'Nadi|FJ': 'tropical', 'Papeete|PF': 'island',
  'Noumea|NC': 'island', 'Apia|WS': 'island', 'Nukualofa|TO': 'island',
  'Port Vila|VU': 'island', 'Honiara|SB': 'island', 'Hagatna|GU': 'island',
  'Avarua|CK': 'island', 'Port Moresby|PG': 'tropical',
}

/**
 * Countries left out of the dataset. This is an editorial call, not a
 * technical one: a light-hearted "guess where Michael is today" app reads
 * badly when the answer is an active war zone or a place nobody can visit.
 * Delete any line to put that country back in play.
 */
export const EXCLUDED_COUNTRIES = new Set([
  'AF', // Afghanistan
  'SY', // Syria
  'YE', // Yemen
  'SO', // Somalia
  'SS', // South Sudan
  'SD', // Sudan
  'LY', // Libya
  'KP', // North Korea
  'ML', // Mali
  'CF', // Central African Republic
  'HT', // Haiti
])

/** Individual cities to skip regardless of country. */
export const EXCLUDED_CITIES = new Set([
  'Pripyat|UA',
  // Source population appears to be Arak, Iran's; the Algerian Arak is a
  // Saharan waypoint of a few hundred people.
  'Arak|DZ',
])

/** Cities whose region label is noise and reads better empty. */
export const DROP_REGION_FOR = new Set([
  'Singapore|SG', 'Hong Kong|HK', 'Macau|MO', 'Monaco|MC', 'Vatican City|VA',
  'Gibraltar|GI', 'Luxembourg|LU',
])

/**
 * Countries where a region/state genuinely helps a reader place the city.
 * Elsewhere "City, Country" is how people actually say it.
 */
export const REGION_RELEVANT_COUNTRIES = new Set([
  'US', 'CA', 'AU', 'BR', 'MX', 'IN', 'CN', 'RU', 'AR', 'DE', 'ES', 'ID', 'MY',
])

/**
 * Capital cities by `City|ISO2`, spelled the way city-timezones spells them.
 * Used only to pick the `capital` category.
 */
export const CAPITAL_CITIES = new Set([
  'Kabul|AF', 'Tirana|AL', 'Algiers|DZ', 'Andorra la Vella|AD', 'Luanda|AO',
  'Saint John\'s|AG', 'Buenos Aires|AR', 'Yerevan|AM', 'Canberra|AU', 'Vienna|AT', 'Baku|AZ',
  'Nassau|BS', 'Manama|BH', 'Dhaka|BD', 'Bridgetown|BB', 'Minsk|BY', 'Brussels|BE',
  'Belmopan|BZ', 'Porto-Novo|BJ', 'Thimphu|BT', 'Sucre|BO', 'Sarajevo|BA', 'Gaborone|BW',
  'Brasilia|BR', 'Bandar Seri Begawan|BN', 'Sofia|BG', 'Ouagadougou|BF', 'Bujumbura|BI',
  'Phnom Penh|KH', 'Yaounde|CM', 'Ottawa|CA', 'Praia|CV', 'Bangui|CF', 'N\'Djamena|TD',
  'Santiago|CL', 'Beijing|CN', 'Bogota|CO', 'Moroni|KM', 'Kinshasa|CD', 'Brazzaville|CG',
  'San Jose|CR', 'Yamoussoukro|CI', 'Zagreb|HR', 'Havana|CU', 'Nicosia|CY', 'Prague|CZ',
  'Copenhagen|DK', 'Djibouti|DJ', 'Roseau|DM', 'Santo Domingo|DO', 'Quito|EC', 'Cairo|EG',
  'San Salvador|SV', 'Malabo|GQ', 'Asmara|ER', 'Tallinn|EE', 'Addis Ababa|ET', 'Suva|FJ',
  'Helsinki|FI', 'Paris|FR', 'Libreville|GA', 'Banjul|GM', 'Tbilisi|GE', 'Berlin|DE',
  'Accra|GH', 'Athens|GR', 'Saint George\'s|GD', 'Guatemala City|GT', 'Conakry|GN',
  'Bissau|GW', 'Georgetown|GY', 'Tegucigalpa|HN', 'Budapest|HU', 'Reykjavik|IS',
  'New Delhi|IN', 'Jakarta|ID', 'Tehran|IR', 'Baghdad|IQ', 'Dublin|IE', 'Jerusalem|IL',
  'Rome|IT', 'Kingston|JM', 'Tokyo|JP', 'Amman|JO', 'Astana|KZ', 'Nairobi|KE', 'Tarawa|KI',
  'Kuwait City|KW', 'Bishkek|KG', 'Vientiane|LA', 'Riga|LV', 'Beirut|LB', 'Maseru|LS',
  'Monrovia|LR', 'Tripoli|LY', 'Vaduz|LI', 'Vilnius|LT', 'Luxembourg|LU', 'Skopje|MK',
  'Antananarivo|MG', 'Lilongwe|MW', 'Kuala Lumpur|MY', 'Male|MV', 'Bamako|ML', 'Valletta|MT',
  'Majuro|MH', 'Nouakchott|MR', 'Port Louis|MU', 'Mexico City|MX', 'Palikir|FM', 'Chisinau|MD',
  'Monaco|MC', 'Ulaanbaatar|MN', 'Podgorica|ME', 'Rabat|MA', 'Maputo|MZ', 'Nay Pyi Taw|MM',
  'Windhoek|NA', 'Yaren|NR', 'Kathmandu|NP', 'Amsterdam|NL', 'Wellington|NZ', 'Managua|NI',
  'Niamey|NE', 'Abuja|NG', 'Oslo|NO', 'Muscat|OM', 'Islamabad|PK', 'Melekeok|PW',
  'Panama City|PA', 'Port Moresby|PG', 'Asuncion|PY', 'Lima|PE', 'Manila|PH', 'Warsaw|PL',
  'Lisbon|PT', 'Doha|QA', 'Bucharest|RO', 'Moscow|RU', 'Kigali|RW', 'Basseterre|KN',
  'Castries|LC', 'Kingstown|VC', 'Apia|WS', 'San Marino|SM', 'Sao Tome|ST', 'Riyadh|SA',
  'Dakar|SN', 'Belgrade|RS', 'Victoria|SC', 'Freetown|SL', 'Singapore|SG', 'Bratislava|SK',
  'Ljubljana|SI', 'Honiara|SB', 'Mogadishu|SO', 'Pretoria|ZA', 'Seoul|KR', 'Juba|SS',
  'Madrid|ES', 'Sri Jayewardenepura Kotte|LK', 'Khartoum|SD', 'Paramaribo|SR', 'Mbabane|SZ',
  'Stockholm|SE', 'Bern|CH', 'Damascus|SY', 'Taipei|TW', 'Dushanbe|TJ', 'Dodoma|TZ',
  'Bangkok|TH', 'Dili|TL', 'Lome|TG', 'Nukualofa|TO', 'Port of Spain|TT', 'Tunis|TN',
  'Ankara|TR', 'Ashgabat|TM', 'Funafuti|TV', 'Kampala|UG', 'Kyiv|UA', 'Abu Dhabi|AE',
  'London|GB', 'Washington|US', 'Montevideo|UY', 'Tashkent|UZ', 'Port Vila|VU',
  'Vatican City|VA', 'Caracas|VE', 'Hanoi|VN', 'Sanaa|YE', 'Lusaka|ZM', 'Harare|ZW',
])

/** Small island states/territories — everything in them reads as island life. */
export const ISLAND_NATIONS = new Set(
  'AG AW BB BS BM CK CW DM FJ FM GD GU JM KI KM KN KY LC MH MT MU MV NC NR NU PF PW SB SC ST TC TO TV VC VG VI VU WS AI MS SX BL MF PM FO AX IM JE GG'.split(' '),
)

/** Source country names that read badly on a status card. */
export const COUNTRY_DISPLAY_NAME = {
  'United States of America': 'United States',
  'United States Virgin Islands': 'U.S. Virgin Islands',
  'The Bahamas': 'Bahamas',
  'The Gambia': 'Gambia',
  'Hong Kong S.A.R.': 'Hong Kong',
  'Macau S.A.R': 'Macau',
  'Congo (Brazzaville)': 'Republic of the Congo',
  'Congo (Kinshasa)': 'DR Congo',
  'Guinea Bissau': 'Guinea-Bissau',
  Swaziland: 'Eswatini',
  Macedonia: 'North Macedonia',
  'East Timor': 'Timor-Leste',
  'Czech Republic': 'Czechia',
  Burma: 'Myanmar',
}

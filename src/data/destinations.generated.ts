// GENERATED FILE — do not edit by hand.
// Rebuild with: npm run data:build   (see scripts/build-destinations.mjs)
//
// 1319 destinations across 179 countries.
//
//   Asia            389
//   Europe          367
//   Africa          219
//   North America   191
//   South America   108
//   Oceania          45
//
// Each row is:
//   id|city|region|country|countryCode|continent|lat|lng|timezone|radiusKm|category|landSectors
//
// landSectors is a 16-bit mask. Bit N is set when the compass sector
// starting at N * 22.5 degrees is dry land all the way out to the roaming
// radius, checked against Natural Earth 10m land and lake polygons at build
// time. The roaming engine only ever places the marker inside a set bit,
// which is what stops it turning up in the sea.

export const DESTINATION_TABLE = `
al-durres|Durres|Durrës|Albania|AL|EU|41.3178|19.4482|Europe/Tirane|3.8|beach|49183
al-elbasan|Elbasan||Albania|AL|EU|41.1215|20.0838|Europe/Tirane|3.6|small-city|65535
al-shkoder|Shkoder|Shkodër|Albania|AL|EU|42.0685|19.5188|Europe/Tirane|3.8|beach|61439
al-tirana|Tirana|Durrës|Albania|AL|EU|41.3275|19.8189|Europe/Tirane|6.4|capital|65535
dz-algiers|Algiers|Alger|Algeria|DZ|AF|36.7631|3.0506|Africa/Algiers|7|capital|32736
dz-annaba|Annaba||Algeria|DZ|AF|36.92|7.76|Africa/Algiers|4.2|beach|65411
dz-bejaia|Bejaia|Béjaïa|Algeria|DZ|AF|36.7604|5.07|Africa/Algiers|3.8|beach|32512
dz-blida|Blida||Algeria|DZ|AF|36.4203|2.83|Africa/Algiers|7.4|major-city|65535
dz-chlef|Chlef||Algeria|DZ|AF|36.1704|1.32|Africa/Algiers|7.4|major-city|65535
dz-constantine|Constantine||Algeria|DZ|AF|36.36|6.5999|Africa/Algiers|7.4|major-city|65535
dz-oran|Oran||Algeria|DZ|AF|35.71|-0.62|Africa/Algiers|4.2|beach|8188
dz-setif|Setif|Sétif|Algeria|DZ|AF|36.18|5.4|Africa/Algiers|7|major-city|65535
ao-benguela|Benguela||Angola|AO|AF|-12.5783|13.4072|Africa/Luanda|3.8|beach|4094
ao-huambo|Huambo||Angola|AO|AF|-12.75|15.76|Africa/Luanda|7.4|major-city|65535
ao-lobito|Lobito|Benguela|Angola|AO|AF|-12.37|13.5412|Africa/Luanda|3.8|beach|4094
ao-luanda|Luanda||Angola|AO|AF|-8.8383|13.2344|Africa/Luanda|7.8|capital|2044
ar-buenos-aires|Buenos Aires|Ciudad de Buenos Aires|Argentina|AR|SA|-34.6025|-58.3975|America/Argentina/Buenos_Aires|8.8|major-city|32704
ar-cordoba|Córdoba||Argentina|AR|SA|-31.4|-64.1823|America/Argentina/Cordoba|8|major-city|65535
ar-corrientes|Corrientes||Argentina|AR|SA|-27.49|-58.81|America/Argentina/Cordoba|7.4|major-city|65535
ar-la-plata|La Plata|Ciudad de Buenos Aires|Argentina|AR|SA|-34.9096|-57.96|America/Argentina/Buenos_Aires|7.4|major-city|65535
ar-mar-del-plata|Mar del Plata|Ciudad de Buenos Aires|Argentina|AR|SA|-38|-57.58|America/Argentina/Buenos_Aires|4.2|beach|65511
ar-mendoza|Mendoza||Argentina|AR|SA|-32.8833|-68.8166|America/Argentina/Mendoza|4.4|mountain|65535
ar-posadas|Posadas|Misiones|Argentina|AR|SA|-27.3578|-55.8851|America/Argentina/Cordoba|7.4|major-city|65535
ar-resistencia|Resistencia|Chaco|Argentina|AR|SA|-27.46|-58.99|America/Argentina/Cordoba|7.4|major-city|65535
ar-rosario|Rosario|Santa Fe|Argentina|AR|SA|-32.9511|-60.6663|America/Argentina/Cordoba|8|major-city|65535
ar-salta|Salta||Argentina|AR|SA|-24.7834|-65.4166|America/Argentina/Salta|7.4|major-city|65535
ar-san-juan|San Juan||Argentina|AR|SA|-31.55|-68.52|America/Argentina/San_Juan|7.4|major-city|65535
ar-santa-fe|Santa Fe||Argentina|AR|SA|-31.6239|-60.69|America/Argentina/Cordoba|7.4|major-city|65535
ar-tucuman|Tucumán||Argentina|AR|SA|-26.816|-65.2166|America/Argentina/Tucuman|7.4|major-city|65535
ar-ushuaia|Ushuaia|Tierra del Fuego|Argentina|AR|SA|-54.79|-68.31|America/Argentina/Ushuaia|3.2|mountain|65055
am-gyumri|Gyumri|Shirak|Armenia|AM|AS|40.7894|43.8475|Asia/Yerevan|3.6|small-city|65535
am-vanadzor|Vanadzor|Lori|Armenia|AM|AS|40.8128|44.4883|Asia/Yerevan|3.6|small-city|65535
am-yerevan|Yerevan|Erevan|Armenia|AM|AS|40.1812|44.5136|Asia/Yerevan|7|capital|65535
aw-oranjestad|Oranjestad||Aruba|AW|NA|12.5304|-70.029|America/Aruba|2.4|island|57471
au-adelaide|Adelaide|South Australia|Australia|AU|OC|-34.935|138.6|Australia/Adelaide|7.4|major-city|65535
au-albury|Albury|New South Wales|Australia|AU|OC|-36.06|146.92|Australia/Sydney|2.8|small-city|65535
au-ballarat|Ballarat|Victoria|Australia|AU|OC|-37.5596|143.84|Australia/Melbourne|2.8|small-city|65535
au-bendigo|Bendigo|Victoria|Australia|AU|OC|-36.76|144.28|Australia/Melbourne|2.8|small-city|65535
au-brisbane|Brisbane|Queensland|Australia|AU|OC|-27.455|153.0351|Australia/Brisbane|8|major-city|65535
au-byron-bay|Byron Bay|New South Wales|Australia|AU|OC|-28.6565|153.6129|Australia/Sydney|3|beach|65280
au-cairns|Cairns|Queensland|Australia|AU|OC|-16.8878|145.7633|Australia/Brisbane|3.4|tropical|64512
au-canberra|Canberra|Australian Capital Territory|Australia|AU|OC|-35.283|149.129|Australia/Sydney|6|capital|65535
au-cranbourne|Cranbourne|Victoria|Australia|AU|OC|-38.0996|145.2834|Australia/Melbourne|7|major-city|65535
au-darwin|Darwin|Northern Territory|Australia|AU|OC|-12.4254|130.85|Australia/Darwin|3.4|tropical|18238
au-geelong|Geelong|Victoria|Australia|AU|OC|-38.1675|144.3956|Australia/Melbourne|3.8|beach|16368
au-gold-coast|Gold Coast|Queensland|Australia|AU|OC|-28.0815|153.4482|Australia/Brisbane|4.2|beach|65472
au-hobart|Hobart|Tasmania|Australia|AU|OC|-42.85|147.295|Australia/Hobart|2.4|island|65505
au-launceston|Launceston|Tasmania|Australia|AU|OC|-41.4498|147.1302|Australia/Hobart|2.8|small-city|65535
au-mackay|Mackay|Queensland|Australia|AU|OC|-21.1439|149.15|Australia/Brisbane|2.8|small-city|65535
au-melbourne|Melbourne|Victoria|Australia|AU|OC|-37.82|144.975|Australia/Melbourne|8.8|major-city|64767
au-newcastle|Newcastle|New South Wales|Australia|AU|OC|-32.8453|151.815|Australia/Sydney|4.2|beach|65055
au-perth|Perth|Western Australia|Australia|AU|OC|-31.955|115.84|Australia/Perth|4.8|beach|65535
au-sydney|Sydney|New South Wales|Australia|AU|OC|-33.92|151.1852|Australia/Sydney|8.8|major-city|65147
au-toowoomba|Toowoomba|Queensland|Australia|AU|OC|-27.5645|151.9555|Australia/Brisbane|3.6|small-city|65535
au-townsville|Townsville|Queensland|Australia|AU|OC|-19.25|146.77|Australia/Brisbane|3.6|small-city|65531
au-wollongong|Wollongong|New South Wales|Australia|AU|OC|-34.4154|150.89|Australia/Sydney|3.8|beach|65283
at-graz|Graz|Steiermark|Austria|AT|EU|47.0778|15.41|Europe/Vienna|7|major-city|65535
at-innsbruck|Innsbruck|Tirol|Austria|AT|EU|47.2804|11.41|Europe/Vienna|4|mountain|65535
at-klagenfurt|Klagenfurt|Kärnten|Austria|AT|EU|46.6203|14.31|Europe/Vienna|3.6|small-city|65535
at-linz|Linz|Oberösterreich|Austria|AT|EU|48.3192|14.2888|Europe/Vienna|7|major-city|65535
at-passau|Passau|Oberösterreich|Austria|AT|EU|48.567|13.4666|Europe/Berlin|2.8|small-city|65535
at-salzburg|Salzburg||Austria|AT|EU|47.8105|13.04|Europe/Vienna|5|historic|65535
at-vienna|Vienna|Wien|Austria|AT|EU|48.2|16.3666|Europe/Vienna|7|capital|65535
at-wiener-neustadt|Wiener Neustadt|Niederösterreich|Austria|AT|EU|47.816|16.25|Europe/Vienna|2.8|small-city|65535
az-ali-bayramli|Ali Bayramli|?li Bayramli|Azerbaijan|AZ|AS|39.9323|48.9203|Asia/Baku|2.8|small-city|65535
az-baku|Baku|Baki|Azerbaijan|AZ|AS|40.3953|49.8622|Asia/Baku|7|capital|65087
az-ganca|Ganca||Azerbaijan|AZ|AS|40.685|46.35|Asia/Baku|7.4|major-city|65535
az-naxcivan|Naxcivan|Naxçivan|Azerbaijan|AZ|AS|39.2092|45.4122|Asia/Baku|2.8|small-city|65535
az-sumqayt|Sumqayt|Sumqayit|Azerbaijan|AZ|AS|40.58|49.63|Asia/Baku|7|major-city|32752
bs-nassau|Nassau||Bahamas|BS|NA|25.0834|-77.35|America/Nassau|3.2|island|4064
bh-manama|Manama||Bahrain|BH|AS|26.2361|50.5831|Asia/Bahrain|3.84|capital|3968
bd-chittagong|Chittagong||Bangladesh|BD|AS|22.33|91.8|Asia/Dhaka|5.6|beach|49679
bd-comilla|Comilla|Chittagong|Bangladesh|BD|AS|23.4704|91.17|Asia/Dhaka|7.4|major-city|65535
bd-dhaka|Dhaka||Bangladesh|BD|AS|23.7231|90.4086|Asia/Dhaka|7.8|capital|65535
bd-jessore|Jessore|Khulna|Bangladesh|BD|AS|23.1704|89.2|Asia/Dhaka|7|major-city|65535
bd-khulna|Khulna||Bangladesh|BD|AS|22.84|89.56|Asia/Dhaka|8|major-city|65535
bd-mymensingh|Mymensingh|Dhaka|Bangladesh|BD|AS|24.7504|90.38|Asia/Dhaka|7.4|major-city|65535
bd-rajshahi|Rajshahi||Bangladesh|BD|AS|24.375|88.605|Asia/Dhaka|7.4|major-city|65535
bd-rangpur|Rangpur|Rajshahi|Bangladesh|BD|AS|25.75|89.28|Asia/Dhaka|7|major-city|65535
bd-saidpur|Saidpur|Rajshahi|Bangladesh|BD|AS|25.8004|89|Asia/Dhaka|7|major-city|65535
bd-sylhet|Sylhet||Bangladesh|BD|AS|24.9036|91.8736|Asia/Dhaka|7|major-city|65535
bb-bridgetown|Bridgetown|Saint Michael|Barbados|BB|NA|13.102|-59.6165|America/Barbados|3.2|island|32831
by-homyel|Homyel|Homyel'|Belarus|BY|EU|52.43|31|Europe/Minsk|7.4|major-city|65535
by-mahilyow|Mahilyow||Belarus|BY|EU|53.8985|30.3247|Europe/Minsk|7.4|major-city|65535
by-minsk|Minsk||Belarus|BY|EU|53.9|27.5666|Europe/Minsk|7|capital|65535
by-vitsyebsk|Vitsyebsk||Belarus|BY|EU|55.1887|30.1853|Europe/Minsk|7.4|major-city|65535
be-antwerpen|Antwerpen|Antwerp|Belgium|BE|EU|51.2204|4.415|Europe/Brussels|7.4|major-city|65535
be-brugge|Brugge||Belgium|BE|EU|51.2204|3.23|Europe/Brussels|3.6|small-city|65535
be-brussels|Brussels||Belgium|BE|EU|50.8333|4.3333|Europe/Brussels|7|capital|65535
be-charleroi|Charleroi||Belgium|BE|EU|50.4204|4.45|Europe/Brussels|7|major-city|65535
be-gent|Gent|East Flanders|Belgium|BE|EU|51.03|3.7|Europe/Brussels|7.4|major-city|65535
be-liege|Liege||Belgium|BE|EU|50.63|5.58|Europe/Brussels|7.4|major-city|65535
be-mons|Mons|Hainaut|Belgium|BE|EU|50.446|3.939|Europe/Brussels|3.6|small-city|65535
be-namur|Namur||Belgium|BE|EU|50.4704|4.87|Europe/Brussels|3.6|small-city|65535
bz-belize-city|Belize City||Belize|BZ|NA|17.4987|-88.1884|America/Belize|2.6|tropical|61447
bj-cotonou|Cotonou|Ouémé|Benin|BJ|AF|6.4|2.52|Africa/Porto-Novo|4.2|beach|4080
bj-djougou|Djougou|Donga|Benin|BJ|AF|9.7004|1.68|Africa/Porto-Novo|3.6|small-city|65535
bj-parakou|Parakou|Borgou|Benin|BJ|AF|9.34|2.62|Africa/Porto-Novo|3.6|small-city|65535
bj-porto-novo|Porto-Novo|Ouémé|Benin|BJ|AF|6.4833|2.6166|Africa/Porto-Novo|6|capital|65535
bt-thimphu|Thimphu||Bhutan|BT|AS|27.473|89.639|Asia/Thimphu|4|mountain|65535
bo-cochabamba|Cochabamba||Bolivia|BO|SA|-17.41|-66.17|America/La_Paz|7.4|major-city|65535
bo-la-paz|La Paz||Bolivia|BO|SA|-16.498|-68.15|America/La_Paz|5|mountain|65535
bo-oruro|Oruro||Bolivia|BO|SA|-17.98|-67.13|America/La_Paz|7|major-city|65151
bo-santa-ana|Santa Ana|El Beni|Bolivia|BO|SA|-13.76|-65.58|America/La_Paz|7|major-city|65535
bo-santa-cruz|Santa Cruz||Bolivia|BO|SA|-17.7539|-63.226|America/La_Paz|8|major-city|65535
ba-banja-luka|Banja Luka|Serbian Republic|Bosnia and Herzegovina|BA|EU|44.7804|17.18|Europe/Sarajevo|7|major-city|65535
ba-sarajevo|Sarajevo||Bosnia and Herzegovina|BA|EU|43.85|18.383|Europe/Sarajevo|6.4|capital|65535
ba-tuzla|Tuzla||Bosnia and Herzegovina|BA|EU|44.5505|18.68|Europe/Sarajevo|3.6|small-city|65535
ba-zenica|Zenica|Zenica-Doboj|Bosnia and Herzegovina|BA|EU|44.22|17.92|Europe/Sarajevo|3.6|small-city|65535
bw-francistown|Francistown|Central|Botswana|BW|AF|-21.17|27.5|Africa/Gaborone|3.6|small-city|65535
bw-gaborone|Gaborone|South-East|Botswana|BW|AF|-24.6463|25.9119|Africa/Gaborone|6|capital|65535
bw-lobatse|Lobatse|South-East|Botswana|BW|AF|-25.2196|25.68|Africa/Gaborone|2.8|small-city|65535
bw-molepolole|Molepolole|Kweneng|Botswana|BW|AF|-24.4|25.51|Africa/Gaborone|2.8|small-city|65535
br-belem|Belem|Pará|Brazil|BR|SA|-1.45|-48.48|America/Belem|4.8|beach|32831
br-belo-horizonte|Belo Horizonte|Minas Gerais|Brazil|BR|SA|-19.915|-43.915|America/Sao_Paulo|8.8|major-city|65535
br-brasilia|Brasilia|Distrito Federal|Brazil|BR|SA|-15.7833|-47.9161|America/Sao_Paulo|7.8|capital|65535
br-campinas|Campinas|São Paulo|Brazil|BR|SA|-22.9|-47.1|America/Sao_Paulo|8|major-city|65535
br-campo-grande|Campo Grande|Mato Grosso do Sul|Brazil|BR|SA|-20.45|-54.6166|America/Campo_Grande|7.4|major-city|65535
br-curitiba|Curitiba|Paraná|Brazil|BR|SA|-25.42|-49.32|America/Sao_Paulo|8|major-city|65535
br-duque-de-caxias|Duque de Caxias|Rio de Janeiro|Brazil|BR|SA|-22.77|-43.31|America/Sao_Paulo|7.4|major-city|65479
br-florianopolis|Florianopolis|Santa Catarina|Brazil|BR|SA|-27.58|-48.52|America/Sao_Paulo|3.6|island|508
br-fortaleza|Fortaleza|Ceará|Brazil|BR|SA|-3.75|-38.58|America/Fortaleza|8|major-city|32760
br-goiania|Goiania|Goiás|Brazil|BR|SA|-16.72|-49.3|America/Sao_Paulo|8|major-city|65535
br-jaboatao|Jaboatao|Pernambuco|Brazil|BR|SA|-8.11|-35.02|America/Recife|7.4|major-city|65535
br-joao-pessoa|Joao Pessoa|Paraíba|Brazil|BR|SA|-7.1011|-34.8761|America/Fortaleza|4.2|beach|2044
br-joinville|Joinville|Santa Catarina|Brazil|BR|SA|-26.32|-48.8399|America/Sao_Paulo|7.4|major-city|65527
br-maceio|Maceio|Alagoas|Brazil|BR|SA|-9.62|-35.73|America/Maceio|4.8|beach|58367
br-manaus|Manaus|Amazonas|Brazil|BR|SA|-3.1|-60|America/Manaus|8|major-city|65535
br-natal|Natal|Amazonas|Brazil|BR|SA|-6.9838|-60.2699|America/Manaus|7.4|major-city|65535
br-niteroi|Niteroi|Rio de Janeiro|Brazil|BR|SA|-22.9|-43.1|America/Sao_Paulo|4.2|beach|127
br-nova-iguacu|Nova Iguacu|Rio de Janeiro|Brazil|BR|SA|-22.74|-43.47|America/Sao_Paulo|7.4|major-city|65535
br-olinda|Olinda|Pernambuco|Brazil|BR|SA|-8|-34.85|America/Recife|4.2|beach|65283
br-porto-alegre|Porto Alegre|Rio Grande do Sul|Brazil|BR|SA|-30.05|-51.2|America/Sao_Paulo|8|major-city|50175
br-recife|Recife|Pernambuco|Brazil|BR|SA|-8.0756|-34.9156|America/Recife|4.8|beach|65472
br-rio-de-janeiro|Rio de Janeiro||Brazil|BR|SA|-22.925|-43.225|America/Sao_Paulo|5.6|beach|65535
br-salvador|Salvador|Bahia|Brazil|BR|SA|-12.97|-38.48|America/Bahia|5.6|beach|36382
br-santo-andre|Santo Andre|São Paulo|Brazil|BR|SA|-23.6528|-46.5278|America/Sao_Paulo|7.4|major-city|65535
br-santos|Santos|São Paulo|Brazil|BR|SA|-23.9537|-46.3329|America/Sao_Paulo|4.8|beach|30784
br-sao-jose-dos-campos|Sao Jose dos Campos|São Paulo|Brazil|BR|SA|-23.2|-45.8799|America/Sao_Paulo|7.4|major-city|65535
br-sao-paulo|Sao Paulo|São Paulo|Brazil|BR|SA|-23.5587|-46.625|America/Sao_Paulo|8.8|major-city|65535
br-teresina|Teresina|Piauí|Brazil|BR|SA|-5.095|-42.78|America/Fortaleza|7.4|major-city|65535
br-vila-velha|Vila Velha|Amapá|Brazil|BR|SA|3.2167|-51.2167|America/Belem|7.4|major-city|65535
br-vitoria|Vitória|Espírito Santo|Brazil|BR|SA|-20.324|-40.366|America/Sao_Paulo|4.8|beach|65508
bn-bandar-seri-begawan|Bandar Seri Begawan|Brunei and Muara|Brunei|BN|AS|4.8833|114.9333|Asia/Brunei|6|capital|65535
bg-burgas|Burgas||Bulgaria|BG|EU|42.5146|27.4746|Europe/Sofia|3.8|beach|64515
bg-plovdiv|Plovdiv||Bulgaria|BG|EU|42.154|24.754|Europe/Sofia|7.4|major-city|65535
bg-ruse|Ruse||Bulgaria|BG|EU|43.8537|25.9733|Europe/Sofia|3.6|small-city|65535
bg-sofia|Sofia|Grad Sofiya|Bulgaria|BG|EU|42.6833|23.3167|Europe/Sofia|7|capital|65535
bg-stara-zagora|Stara Zagora||Bulgaria|BG|EU|42.4231|25.6227|Europe/Sofia|3.6|small-city|65535
bg-varna|Varna||Bulgaria|BG|EU|43.2156|27.8953|Europe/Sofia|3.8|beach|65439
bf-bobo-dioulasso|Bobo Dioulasso|Houet|Burkina Faso|BF|AF|11.18|-4.29|Africa/Ouagadougou|7.4|major-city|65535
bf-koudougou|Koudougou|Boulkiemdé|Burkina Faso|BF|AF|12.2505|-2.37|Africa/Ouagadougou|3.6|small-city|65535
bf-ouagadougou|Ouagadougou|Kadiogo|Burkina Faso|BF|AF|12.3703|-1.5247|Africa/Ouagadougou|6.4|capital|65535
bf-ouahigouya|Ouahigouya|Yatenga|Burkina Faso|BF|AF|13.5704|-2.42|Africa/Ouagadougou|2.8|small-city|65535
bi-bujumbura|Bujumbura|Bujumbura Mairie|Burundi|BI|AF|-3.3761|29.36|Africa/Bujumbura|6.4|capital|49663
bi-muyinga|Muyinga||Burundi|BI|AF|-2.8523|30.3173|Africa/Bujumbura|2.8|small-city|65535
kh-battambang|Battambang|Batdâmbâng|Cambodia|KH|AS|13.1|103.2|Asia/Phnom_Penh|3.6|small-city|65535
kh-kampong-cham|Kampong Cham|Kâmpóng Cham|Cambodia|KH|AS|12.0004|105.45|Asia/Phnom_Penh|2.8|small-city|65535
kh-phnom-penh|Phnom Penh||Cambodia|KH|AS|11.55|104.9166|Asia/Phnom_Penh|7|capital|65535
kh-prey-veng|Prey Veng|Prey Vêng|Cambodia|KH|AS|11.484|105.324|Asia/Phnom_Penh|2.8|small-city|65535
kh-siem-reap|Siem Reap|Siemréab|Cambodia|KH|AS|13.3666|103.85|Asia/Phnom_Penh|5|historic|65535
cm-bafoussam|Bafoussam|Ouest|Cameroon|CM|AF|5.4904|10.4099|Africa/Douala|7|major-city|65535
cm-bamenda|Bamenda|Nord-Ouest|Cameroon|CM|AF|5.96|10.15|Africa/Douala|7.4|major-city|65535
cm-douala|Douala|Littoral|Cameroon|CM|AF|4.0604|9.71|Africa/Douala|4.8|beach|2046
cm-garoua|Garoua|Nord|Cameroon|CM|AF|9.3|13.39|Africa/Douala|7.4|major-city|65535
cm-yaounde|Yaounde|Centre|Cameroon|CM|AF|3.8667|11.5167|Africa/Douala|7|capital|65535
ca-abbotsford|Abbotsford|British Columbia|Canada|CA|NA|49.0504|-122.3|America/Vancouver|3.6|small-city|65535
ca-banff|Banff|Alberta|Canada|CA|NA|51.178|-115.5719|America/Edmonton|3.2|mountain|65535
ca-barrie|Barrie|Ontario|Canada|CA|NA|44.3838|-79.7|America/Toronto|3.8|beach|65527
ca-calgary|Calgary|Alberta|Canada|CA|NA|51.083|-114.08|America/Edmonton|8|major-city|65535
ca-edmonton|Edmonton|Alberta|Canada|CA|NA|53.55|-113.5|America/Edmonton|7.4|major-city|65535
ca-halifax|Halifax|Nova Scotia|Canada|CA|NA|44.65|-63.6|America/Halifax|3.6|small-city|16320
ca-hamilton|Hamilton|Ontario|Canada|CA|NA|43.25|-79.83|America/Toronto|7.4|major-city|65523
ca-kitchener|Kitchener|Ontario|Canada|CA|NA|43.45|-80.5|America/Toronto|7.4|major-city|65535
ca-london|London|Ontario|Canada|CA|NA|42.97|-81.25|America/Toronto|7.4|major-city|65535
ca-montreal|Montréal|Québec|Canada|CA|NA|45.5|-73.5833|America/Montreal|8.8|major-city|63491
ca-oshawa|Oshawa|Ontario|Canada|CA|NA|43.88|-78.85|America/Toronto|4.2|beach|63519
ca-ottawa|Ottawa|Ontario|Canada|CA|NA|45.4167|-75.7|America/Toronto|6.4|capital|65535
ca-quebec|Québec||Canada|CA|NA|46.84|-71.2456|America/Montreal|4.2|beach|65295
ca-regina|Regina|Saskatchewan|Canada|CA|NA|50.45|-104.617|America/Regina|3.6|small-city|65535
ca-saskatoon|Saskatoon|Saskatchewan|Canada|CA|NA|52.17|-106.67|America/Regina|3.6|small-city|65535
ca-sherbrooke|Sherbrooke|Québec|Canada|CA|NA|45.4|-71.9|America/Montreal|3.6|small-city|65535
ca-st-john-s|St. John's|Newfoundland and Labrador|Canada|CA|NA|47.585|-52.681|America/St_Johns|3.8|beach|65027
ca-sudbury|Sudbury|Ontario|Canada|CA|NA|46.5|-80.9666|America/Toronto|3.6|small-city|65535
ca-toronto|Toronto|Ontario|Canada|CA|NA|43.7|-79.42|America/Toronto|8.8|major-city|64543
ca-trois-rivieres|Trois-Rivières|Québec|Canada|CA|NA|46.35|-72.5499|America/Montreal|3.8|beach|64519
ca-vancouver|Vancouver|British Columbia|Canada|CA|NA|49.2734|-123.1216|America/Vancouver|8|major-city|6640
ca-victoria|Victoria|British Columbia|Canada|CA|NA|48.4333|-123.35|America/Vancouver|3.6|small-city|61567
ca-windsor|Windsor|Ontario|Canada|CA|NA|42.3333|-83.0333|America/Detroit|3.8|beach|62403
ca-winnipeg|Winnipeg|Manitoba|Canada|CA|NA|49.883|-97.166|America/Winnipeg|7.4|major-city|65535
cv-mindelo|Mindelo||Cape Verde|CV|AF|16.8838|-25|Atlantic/Cape_Verde|3|beach|4094
cv-praia|Praia||Cape Verde|CV|AF|14.9167|-23.5167|Atlantic/Cape_Verde|6|capital|61447
td-abeche|Abeche|Ouaddaï|Chad|TD|AF|13.84|20.83|Africa/Ndjamena|3.6|small-city|65535
td-moundou|Moundou|Logone Oriental|Chad|TD|AF|8.55|16.09|Africa/Ndjamena|3.6|small-city|65535
td-ndjamena|Ndjamena|Hadjer-Lamis|Chad|TD|AF|12.1131|15.0491|Africa/Ndjamena|7.4|major-city|65535
td-sarh|Sarh|Mandoul|Chad|TD|AF|9.15|18.39|Africa/Ndjamena|3.6|small-city|65535
cl-antofagasta|Antofagasta||Chile|CL|SA|-23.65|-70.4|America/Santiago|3.8|beach|1022
cl-concepcion|Concepcion|Bío-Bío|Chile|CL|SA|-36.83|-73.05|America/Santiago|7.4|major-city|65535
cl-iquique|Iquique|Tarapacá|Chile|CL|SA|-20.25|-70.13|America/Santiago|3.8|beach|49663
cl-rancagua|Rancagua||Chile|CL|SA|-34.17|-70.74|America/Santiago|7|major-city|65535
cl-san-bernardo|San Bernardo|Región Metropolitana de Santiago|Chile|CL|SA|-33.6|-70.7|America/Santiago|7|major-city|65535
cl-santiago|Santiago|Región Metropolitana de Santiago|Chile|CL|SA|-33.45|-70.667|America/Santiago|7|capital|65535
cl-talcahuano|Talcahuano|Bío-Bío|Chile|CL|SA|-36.7167|-73.1167|America/Santiago|3.8|beach|33779
cl-temuco|Temuco|La Araucanía|Chile|CL|SA|-38.73|-72.58|America/Santiago|7|major-city|65535
cl-valparaiso|Valparaiso|Valparaíso|Chile|CL|SA|-33.0478|-71.621|America/Santiago|4.2|beach|16380
cl-vina-del-mar|Vina del Mar|Valparaíso|Chile|CL|SA|-33.03|-71.54|America/Santiago|7.4|major-city|8191
cn-beijing|Beijing||China|CN|AS|39.9289|116.3883|Asia/Shanghai|7.8|capital|65535
cn-changchun|Changchun|Jilin|China|CN|AS|43.865|125.34|Asia/Harbin|8|major-city|65535
cn-changsha|Changsha|Hunan|China|CN|AS|28.2|112.97|Asia/Shanghai|8|major-city|65535
cn-chengdu|Chengdu|Sichuan|China|CN|AS|30.67|104.07|Asia/Chongqing|8.8|major-city|65535
cn-chongqing|Chongqing||China|CN|AS|29.565|106.595|Asia/Chongqing|8.8|major-city|65535
cn-dalian|Dalian|Liaoning|China|CN|AS|38.9228|121.6298|Asia/Shanghai|8|major-city|15425
cn-dongguan|Dongguan|Guangdong|China|CN|AS|23.0489|113.7447|Asia/Shanghai|8.8|major-city|65534
cn-fuzhou|Fuzhou|Fujian|China|CN|AS|26.08|119.3|Asia/Shanghai|4.8|beach|61567
cn-guangzhou|Guangzhou|Guangdong|China|CN|AS|23.145|113.325|Asia/Shanghai|8.8|major-city|65535
cn-guilin|Guilin|Guangxi|China|CN|AS|25.28|110.28|Asia/Chongqing|4.4|mountain|65535
cn-guiyang|Guiyang|Guizhou|China|CN|AS|26.58|106.72|Asia/Chongqing|8|major-city|65535
cn-hangzhou|Hangzhou|Zhejiang|China|CN|AS|30.25|120.17|Asia/Shanghai|6|historic|65031
cn-harbin|Harbin|Heilongjiang|China|CN|AS|45.75|126.65|Asia/Harbin|8.8|major-city|65535
cn-hechi|Hechi|Guangxi|China|CN|AS|23.0965|109.6091|Asia/Chongqing|8.8|major-city|65535
cn-hefei|Hefei|Anhui|China|CN|AS|31.85|117.28|Asia/Shanghai|8|major-city|65535
cn-jilin|Jilin||China|CN|AS|43.85|126.55|Asia/Harbin|8|major-city|65535
cn-jinan|Jinan|Shandong|China|CN|AS|36.675|116.995|Asia/Shanghai|8|major-city|65535
cn-kunming|Kunming|Yunnan|China|CN|AS|25.07|102.68|Asia/Chongqing|8|major-city|65535
cn-lanzhou|Lanzhou|Gansu|China|CN|AS|36.056|103.792|Asia/Chongqing|8|major-city|65535
cn-nanchang|Nanchang|Jiangxi|China|CN|AS|28.68|115.88|Asia/Shanghai|8|major-city|65535
cn-nanchong|Nanchong|Sichuan|China|CN|AS|30.7804|106.13|Asia/Chongqing|8|major-city|65535
cn-nanjing|Nanjing|Jiangsu|China|CN|AS|32.05|118.78|Asia/Shanghai|8.8|major-city|65535
cn-qingdao|Qingdao|Shandong|China|CN|AS|36.09|120.33|Asia/Shanghai|8|major-city|62
cn-shanghai|Shanghai||China|CN|AS|31.2165|121.4365|Asia/Shanghai|8.8|major-city|65535
cn-shenyeng|Shenyeng|Liaoning|China|CN|AS|41.805|123.45|Asia/Shanghai|8.8|major-city|65535
cn-shenzhen|Shenzhen|Guangdong|China|CN|AS|22.5524|114.1221|Asia/Shanghai|8.8|major-city|65535
cn-shijianzhuang|Shijianzhuang|Hebei|China|CN|AS|38.05|114.48|Asia/Shanghai|8|major-city|65535
cn-shuyang|Shuyang|Jiangsu|China|CN|AS|34.1299|118.7734|Asia/Shanghai|8|major-city|65535
cn-suzhou|Suzhou|Anhui|China|CN|AS|33.6361|116.9789|Asia/Shanghai|8|major-city|65535
cn-taian|Taian|Shandong|China|CN|AS|36.2|117.1201|Asia/Shanghai|8|major-city|65535
cn-taiyuan|Taiyuan|Shanxi|China|CN|AS|37.875|112.5451|Asia/Shanghai|8|major-city|65535
cn-tangshan|Tangshan|Hebei|China|CN|AS|39.6243|118.1944|Asia/Shanghai|8|major-city|65535
cn-tianjin|Tianjin||China|CN|AS|39.13|117.2|Asia/Shanghai|8.8|major-city|65535
cn-urumqi|Urumqi|Xinjiang Uygur|China|CN|AS|43.805|87.575|Asia/Urumqi|8|major-city|65535
cn-wanzhou|Wanzhou|Chongqing|China|CN|AS|30.82|108.4|Asia/Chongqing|8|major-city|65535
cn-wuhan|Wuhan|Hubei|China|CN|AS|30.58|114.27|Asia/Shanghai|8.8|major-city|65439
cn-xian|Xian|Shaanxi|China|CN|AS|34.275|108.895|Asia/Chongqing|6.8|historic|65535
cn-xiangtan|Xiangtan|Hunan|China|CN|AS|27.8504|112.9|Asia/Shanghai|8|major-city|65535
cn-xuzhou|Xuzhou|Jiangsu|China|CN|AS|34.28|117.18|Asia/Shanghai|8|major-city|65535
cn-zhangzhou|Zhangzhou|Fujian|China|CN|AS|24.5204|117.67|Asia/Shanghai|8|major-city|65535
cn-zhengzhou|Zhengzhou|Henan|China|CN|AS|34.755|113.6651|Asia/Shanghai|8|major-city|65535
cn-zibo|Zibo|Shandong|China|CN|AS|36.8|118.05|Asia/Shanghai|8|major-city|65535
co-barranquilla|Barranquilla|Atlántico|Colombia|CO|SA|10.96|-74.8|America/Bogota|8|major-city|65535
co-bello|Bello|Antioquia|Colombia|CO|SA|6.33|-75.57|America/Bogota|7.4|major-city|65535
co-bogota|Bogota||Colombia|CO|SA|4.5964|-74.0833|America/Bogota|7.8|capital|65535
co-bucaramanga|Bucaramanga|Santander|Colombia|CO|SA|7.1301|-73.1259|America/Bogota|7.4|major-city|65535
co-cali|Cali|Valle del Cauca|Colombia|CO|SA|3.4|-76.5|America/Bogota|8|major-city|65535
co-cartagena|Cartagena|Bolívar|Colombia|CO|SA|10.3997|-75.5144|America/Bogota|5.4|historic|57852
co-cucuta|Cucuta|Norte de Santander|Colombia|CO|SA|7.92|-72.52|America/Bogota|7.4|major-city|65535
co-ibague|Ibague|Tolima|Colombia|CO|SA|4.4389|-75.2322|America/Bogota|7.4|major-city|65535
co-medellin|Medellin|Antioquia|Colombia|CO|SA|6.275|-75.575|America/Bogota|8|major-city|65535
co-pereira|Pereira|Risaralda|Colombia|CO|SA|4.8104|-75.68|America/Bogota|7.4|major-city|65535
co-santa-marta|Santa Marta|Magdalena|Colombia|CO|SA|11.2472|-74.2017|America/Bogota|4.2|beach|2046
co-soledad|Soledad|Atlántico|Colombia|CO|SA|10.92|-74.77|America/Bogota|7.4|major-city|65535
km-moroni|Moroni||Comoros|KM|AF|-11.7042|43.2402|Indian/Comoro|6|capital|510
cr-alajuela|Alajuela||Costa Rica|CR|NA|10.02|-84.23|America/Costa_Rica|3.6|small-city|65535
cr-cartago|Cartago||Costa Rica|CR|NA|9.87|-83.93|America/Costa_Rica|3.6|small-city|65535
cr-liberia|Liberia|Guanacaste|Costa Rica|CR|NA|10.6338|-85.4333|America/Costa_Rica|2.6|tropical|65535
cr-puerto-limon|Puerto Limon|Limón|Costa Rica|CR|NA|10|-83.0333|America/Costa_Rica|3|beach|16256
cr-puntarenas|Puntarenas||Costa Rica|CR|NA|9.9702|-84.8336|America/Costa_Rica|1.4|beach|12316
cr-san-jose|San Jose|San José|Costa Rica|CR|NA|9.935|-84.0841|America/Costa_Rica|6.4|capital|65535
hr-dubrovnik|Dubrovnik|Dubrovacko-Neretvanska|Croatia|HR|EU|42.6609|18.0914|Europe/Zagreb|4.2|historic|49215
hr-karlovac|Karlovac|Karlovacka|Croatia|HR|EU|45.4872|15.5478|Europe/Zagreb|2.8|small-city|65535
hr-osijek|Osijek|Osjecko-Baranjska|Croatia|HR|EU|45.5504|18.68|Europe/Zagreb|3.6|small-city|65535
hr-pula|Pula|Istarska|Croatia|HR|EU|44.8687|13.8481|Europe/Zagreb|3|beach|35327
hr-rijeka|Rijeka|Primorsko-Goranska|Croatia|HR|EU|45.33|14.45|Europe/Zagreb|3.8|beach|57407
hr-slavonski-brod|Slavonski Brod|Brodsko-Posavska|Croatia|HR|EU|45.1603|18.0156|Europe/Zagreb|2.8|small-city|65535
hr-split|Split|Splitsko-Dalmatinska|Croatia|HR|EU|43.5204|16.47|Europe/Zagreb|3.8|beach|63
hr-zadar|Zadar|Zadarska|Croatia|HR|EU|44.1201|15.2623|Europe/Zagreb|3|beach|57599
hr-zagreb|Zagreb|Grad Zagreb|Croatia|HR|EU|45.8|16|Europe/Zagreb|6.4|capital|65535
cu-bayamo|Bayamo|Granma|Cuba|CU|NA|20.3795|-76.6433|America/Havana|3.6|small-city|65535
cu-camaguey|Camaguey|Camagüey|Cuba|CU|NA|21.3808|-77.9169|America/Havana|7.4|major-city|65535
cu-guantanamo|Guantanamo|Guantánamo|Cuba|CU|NA|20.1453|-75.2061|America/Havana|7|major-city|65535
cu-havana|Havana|Ciudad de la Habana|Cuba|CU|NA|23.132|-82.3642|America/Havana|6|historic|8188
cu-holguin|Holguin|Holguín|Cuba|CU|NA|20.8872|-76.2631|America/Havana|7.4|major-city|65535
cu-las-tunas|Las Tunas||Cuba|CU|NA|20.9601|-76.9544|America/Havana|3.6|small-city|65535
cu-santa-clara|Santa Clara|Villa Clara|Cuba|CU|NA|22.4|-79.9667|America/Havana|7|major-city|65535
cu-santiago-de-cuba|Santiago de Cuba||Cuba|CU|NA|20.025|-75.8213|America/Havana|7.4|major-city|65535
cw-willemstad|Willemstad||Curacao|CW|NA|12.2004|-69.02|America/Curacao|3.2|island|61945
cy-larnaca|Larnaca||Cyprus|CY|EU|34.917|33.636|Asia/Nicosia|3|beach|65027
cy-limassol|Limassol||Cyprus|CY|EU|34.6754|33.0333|Asia/Nicosia|3.8|beach|65039
cy-nicosia|Nicosia||Cyprus|CY|EU|35.1667|33.3666|Asia/Nicosia|6|capital|65535
cz-brno|Brno|Kraj Vysocina|Czechia|CZ|EU|49.2004|16.61|Europe/Prague|7.4|major-city|65535
cz-liberec|Liberec|Liberecký|Czechia|CZ|EU|50.8|15.08|Europe/Prague|3.6|small-city|65535
cz-olomouc|Olomouc|Moravskoslezský|Czechia|CZ|EU|49.63|17.25|Europe/Prague|3.6|small-city|65535
cz-ostrava|Ostrava|Moravskoslezský|Czechia|CZ|EU|49.8304|18.25|Europe/Prague|7.4|major-city|65535
cz-pardubice|Pardubice|Královéhradecký|Czechia|CZ|EU|50.0404|15.76|Europe/Prague|3.6|small-city|65535
cz-pizen|Pizen|Karlovarský|Czechia|CZ|EU|49.7404|13.36|Europe/Prague|3.6|small-city|65535
cz-prague|Prague||Czechia|CZ|EU|50.0833|14.466|Europe/Prague|5.4|historic|65535
cz-zlin|Zlin|Kraj Vysocina|Czechia|CZ|EU|49.2304|17.65|Europe/Prague|3.6|small-city|65535
dk-aalborg|Aalborg|Nordjylland|Denmark|DK|EU|57.0337|9.9166|Europe/Copenhagen|3.8|beach|16383
dk-arhus|Århus|Midtjylland|Denmark|DK|EU|56.1572|10.2107|Europe/Copenhagen|3.8|beach|65283
dk-copenhagen|Copenhagen|Hovedstaden|Denmark|DK|EU|55.6761|12.5683|Europe/Copenhagen|6.4|capital|64961
dk-esbjerg|Esbjerg|Syddanmark|Denmark|DK|EU|55.467|8.45|Europe/Copenhagen|3|beach|49215
dk-k-benhavn|København|Hovedstaden|Denmark|DK|EU|55.6786|12.5635|Europe/Copenhagen|8|major-city|64961
dk-odense|Odense|Syddanmark|Denmark|DK|EU|55.4004|10.3833|Europe/Copenhagen|3.6|small-city|65535
dk-roskilde|Roskilde|Sjaælland|Denmark|DK|EU|55.65|12.0833|Europe/Copenhagen|3|beach|8191
dk-vejle|Vejle|Syddanmark|Denmark|DK|EU|55.709|9.535|Europe/Copenhagen|3|beach|65487
dj-djibouti|Djibouti||Djibouti|DJ|AF|11.595|43.148|Africa/Djibouti|2.05|capital|4032
do-higuey|Higuey|La Altagracia|Dominican Republic|DO|NA|18.616|-68.708|America/Santo_Domingo|3.6|small-city|65535
do-la-romana|La Romana||Dominican Republic|DO|NA|18.417|-68.9666|America/Santo_Domingo|3.8|beach|61471
do-la-vega|La Vega||Dominican Republic|DO|NA|19.2166|-70.5166|America/Santo_Domingo|3.6|small-city|65535
do-san-cristobal|San Cristobal|San Cristóbal|Dominican Republic|DO|NA|18.416|-70.109|America/Santo_Domingo|3.6|small-city|65535
do-san-francisco-de-macoris|San Francisco de Macoris|Duarte|Dominican Republic|DO|NA|19.3|-70.25|America/Santo_Domingo|3.6|small-city|65535
do-san-pedro-de-macoris|San Pedro de Macoris|San Pedro de Macorís|Dominican Republic|DO|NA|18.4504|-69.3|America/Santo_Domingo|3.8|beach|61471
do-santiago|Santiago||Dominican Republic|DO|NA|19.5|-70.67|America/Santo_Domingo|8|major-city|65535
do-santo-domingo|Santo Domingo|Distrito Nacional|Dominican Republic|DO|NA|18.4701|-69.9001|America/Santo_Domingo|7|capital|63503
cd-kananga|Kananga|Kasaï-Occidental|DR Congo|CD|AF|-5.89|22.4|Africa/Lubumbashi|7.4|major-city|65535
cd-kinshasa|Kinshasa|Kinshasa City|DR Congo|CD|AF|-4.3297|15.315|Africa/Kinshasa|7.8|capital|65535
cd-lubumbashi|Lubumbashi|Katanga|DR Congo|CD|AF|-11.68|27.48|Africa/Lubumbashi|8|major-city|65535
cd-mbuji-mayi|Mbuji-Mayi|Kasaï-Oriental|DR Congo|CD|AF|-6.15|23.6|Africa/Lubumbashi|8|major-city|65535
ec-ambato|Ambato|Napo|Ecuador|EC|SA|-1.2696|-78.62|America/Guayaquil|3.6|small-city|65535
ec-cuenca|Cuenca|Azuay|Ecuador|EC|SA|-2.9|-79|America/Guayaquil|7|major-city|65535
ec-guayaquil|Guayaquil|Guayas|Ecuador|EC|SA|-2.22|-79.92|America/Guayaquil|4.8|beach|65475
ec-machala|Machala|El Oro|Ecuador|EC|SA|-3.26|-79.96|America/Guayaquil|3.6|small-city|65535
ec-manta|Manta|Manabi|Ecuador|EC|SA|-0.98|-80.73|America/Guayaquil|3.6|small-city|65535
ec-portoviejo|Portoviejo|Manabi|Ecuador|EC|SA|-1.06|-80.46|America/Guayaquil|3.6|small-city|65535
ec-quito|Quito|Pichincha|Ecuador|EC|SA|-0.215|-78.5001|America/Guayaquil|7|capital|65535
ec-riobamba|Riobamba|Chimborazo|Ecuador|EC|SA|-1.67|-78.65|America/Guayaquil|3.6|small-city|65535
eg-alexandria|Alexandria|Al Iskandariyah|Egypt|EG|AF|31.2|29.95|Africa/Cairo|8.8|major-city|4092
eg-asyut|Asyut||Egypt|EG|AF|27.19|31.1799|Africa/Cairo|7.4|major-city|65535
eg-bur-said|Bur Said|Bur Sa'id|Egypt|EG|AF|31.26|32.29|Africa/Cairo|3.28|beach|16888
eg-cairo|Cairo|Al Qahirah|Egypt|EG|AF|30.05|31.25|Africa/Cairo|6.8|historic|65535
eg-el-giza|El Giza|Al Jizah|Egypt|EG|AF|30.01|31.19|Africa/Cairo|8|major-city|65535
eg-el-mansura|El Mansura|Ad Daqahliyah|Egypt|EG|AF|31.0504|31.38|Africa/Cairo|7.4|major-city|65535
eg-hurghada|Hurghada|Al Bahr al Ahmar|Egypt|EG|AF|27.23|33.83|Africa/Cairo|3.8|beach|65280
eg-ismailia|Ismailia|Al Isma'iliyah|Egypt|EG|AF|30.5903|32.26|Africa/Cairo|7.4|major-city|65535
eg-luxor|Luxor|Qina|Egypt|EG|AF|25.7|32.65|Africa/Cairo|5.4|historic|65535
eg-sohag|Sohag|Suhaj|Egypt|EG|AF|26.5504|31.7|Africa/Cairo|7.4|major-city|65535
eg-suez|Suez|As Suways|Egypt|EG|AF|30.005|32.5499|Africa/Cairo|4.2|beach|65295
eg-tanta|Tanta|Al Gharbiyah|Egypt|EG|AF|30.7904|31|Africa/Cairo|7.4|major-city|65535
sv-san-miguel|San Miguel||El Salvador|SV|NA|13.4833|-88.1833|America/El_Salvador|3.6|small-city|65535
sv-san-salvador|San Salvador||El Salvador|SV|NA|13.71|-89.203|America/El_Salvador|6.4|capital|65535
sv-santa-ana|Santa Ana||El Salvador|SV|NA|13.9946|-89.5598|America/El_Salvador|3.6|small-city|65535
sv-sonsonate|Sonsonate||El Salvador|SV|NA|13.72|-89.73|America/El_Salvador|3.6|small-city|65535
gq-bata|Bata|Litoral|Equatorial Guinea|GQ|AF|1.87|9.77|Africa/Malabo|3.8|beach|1020
gq-malabo|Malabo|Bioko Norte|Equatorial Guinea|GQ|AF|3.75|8.7833|Africa/Malabo|6|capital|8160
er-asmara|Asmara|Anseba|Eritrea|ER|AF|15.3333|38.9333|Africa/Asmara|6.4|capital|65535
er-keren|Keren|Semenawi Keyih Bahri|Eritrea|ER|AF|15.6804|38.45|Africa/Asmara|3.6|small-city|65535
er-massawa|Massawa|Debub|Eritrea|ER|AF|15.6101|39.45|Africa/Asmara|3.8|beach|63500
er-mendefera|Mendefera|Maekel|Eritrea|ER|AF|14.886|38.8163|Africa/Asmara|3.6|small-city|65535
ee-narva|Narva|Ida-Viru|Estonia|EE|EU|59.3776|28.1603|Europe/Tallinn|3|beach|64639
ee-parnu|Parnu|Pärnu|Estonia|EE|EU|58.3747|24.5136|Europe/Tallinn|3|beach|57599
ee-tallinn|Tallinn|Harju|Estonia|EE|EU|59.4339|24.728|Europe/Tallinn|5.4|historic|57336
ee-tartu|Tartu||Estonia|EE|EU|58.3839|26.7099|Europe/Tallinn|3.6|small-city|65535
sz-manzini|Manzini||Eswatini|SZ|AF|-26.495|31.388|Africa/Mbabane|3.6|small-city|65535
sz-mbabane|Mbabane|Hhohho|Eswatini|SZ|AF|-26.3167|31.1333|Africa/Mbabane|6|capital|65535
et-addis-ababa|Addis Ababa||Ethiopia|ET|AF|9.0333|38.7|Africa/Addis_Ababa|7|capital|65535
et-awasa|Awasa||Ethiopia|ET|AF|7.06|38.477|Africa/Addis_Ababa|3.6|small-city|65535
et-bahir-dar|Bahir Dar|Amhara|Ethiopia|ET|AF|11.6001|37.3833|Africa/Addis_Ababa|3.8|beach|32766
et-dese|Dese|Amhara|Ethiopia|ET|AF|11.13|39.63|Africa/Addis_Ababa|3.6|small-city|65535
et-dire-dawa|Dire Dawa||Ethiopia|ET|AF|9.59|41.86|Africa/Addis_Ababa|7|major-city|65535
et-gonder|Gonder|Amhara|Ethiopia|ET|AF|12.61|37.46|Africa/Addis_Ababa|3.6|small-city|65535
et-harar|Harar|Harari|Ethiopia|ET|AF|9.32|42.15|Africa/Addis_Ababa|3.6|small-city|65535
et-nazret|Nazret|Addis Ababa|Ethiopia|ET|AF|8.55|39.27|Africa/Addis_Ababa|7.4|major-city|65535
fj-lautoka|Lautoka|Western|Fiji|FJ|OC|-17.6161|177.4666|Pacific/Fiji|2.6|tropical|65535
fj-suva|Suva|Central|Fiji|FJ|OC|-18.133|178.4417|Pacific/Fiji|3.2|island|32799
fi-helsinki|Helsinki|Southern Finland|Finland|FI|EU|60.1756|24.9341|Europe/Helsinki|6.4|capital|57347
fi-jyvaskyla|Jyväskylä|Central Finland|Finland|FI|EU|62.2603|25.75|Europe/Helsinki|3.8|beach|64575
fi-kuopio|Kuopio|Eastern Finland|Finland|FI|EU|62.8943|27.6949|Europe/Helsinki|3.8|beach|63488
fi-lahti|Lahti|Päijänne Tavastia|Finland|FI|EU|60.9939|25.6649|Europe/Helsinki|3.8|beach|36863
fi-oulu|Oulu|Northern Ostrobothnia|Finland|FI|EU|65|25.47|Europe/Helsinki|3.8|beach|33279
fi-pori|Pori|Satakunta|Finland|FI|EU|61.4789|21.7749|Europe/Helsinki|2.8|small-city|65535
fi-tampere|Tampere|Pirkanmaa|Finland|FI|EU|61.5|23.75|Europe/Helsinki|3.8|beach|1020
fi-turku|Turku|Finland Proper|Finland|FI|EU|60.4539|22.255|Europe/Helsinki|3.6|small-city|65535
fr-ajaccio|Ajaccio|Corse|France|FR|EU|41.9271|8.7283|Europe/Paris|2.4|island|63495
fr-angers|Angers|Pays de la Loire|France|FR|EU|47.48|-0.53|Europe/Paris|3.6|small-city|65535
fr-biarritz|Biarritz|Aquitaine|France|FR|EU|43.4733|-1.5616|Europe/Paris|3.8|beach|1022
fr-bordeaux|Bordeaux|Aquitaine|France|FR|EU|44.85|-0.595|Europe/Paris|5.4|historic|65535
gf-cayenne|Cayenne|Guinaa|France|GF|SA|4.933|-52.33|America/Cayenne|3|beach|4088
fr-clermont-ferrand|Clermont-Ferrand|Auvergne|France|FR|EU|45.78|3.08|Europe/Paris|3.6|small-city|65535
mq-fort-de-france|Fort-de-France|Martinique|France|MQ|NA|14.6104|-61.08|America/Martinique|3.8|beach|49183
fr-grenoble|Grenoble|Rhône-Alpes|France|FR|EU|45.1804|5.72|Europe/Paris|7|major-city|65535
fr-le-havre|Le Havre|Haute-Normandie|France|FR|EU|49.505|0.105|Europe/Paris|3.8|beach|32831
fr-lille|Lille|Nord-Pas-de-Calais|France|FR|EU|50.65|3.08|Europe/Paris|7.4|major-city|65535
fr-lyon|Lyon|Rhône-Alpes|France|FR|EU|45.77|4.83|Europe/Paris|7.4|major-city|65535
fr-marseille|Marseille|Provence-Alpes-Côte-d'Azur|France|FR|EU|43.29|5.375|Europe/Paris|4.8|beach|33279
fr-metz|Metz|Lorraine|France|FR|EU|49.1203|6.18|Europe/Paris|7|major-city|65535
fr-montpellier|Montpellier|Languedoc-Roussillon|France|FR|EU|43.6104|3.87|Europe/Paris|7|major-city|65535
fr-mulhouse|Mulhouse|Alsace|France|FR|EU|47.7504|7.35|Europe/Paris|3.6|small-city|65535
fr-nancy|Nancy|Lorraine|France|FR|EU|48.6837|6.2|Europe/Paris|3.6|small-city|65535
fr-nantes|Nantes|Pays de la Loire|France|FR|EU|47.2104|-1.59|Europe/Paris|7.4|major-city|65535
fr-nice|Nice|Provence-Alpes-Côte-d'Azur|France|FR|EU|43.715|7.265|Europe/Paris|4.2|beach|64639
fr-orleans|Orleans|Centre|France|FR|EU|47.9004|1.9|Europe/Paris|3.6|small-city|65535
fr-paris|Paris|Île-de-France|France|FR|EU|48.8667|2.3333|Europe/Paris|8.8|major-city|65535
gp-pointe-a-pitre|Pointe-a-Pitre|Guadeloupe|France|GP|NA|16.2415|-61.533|America/Guadeloupe|3.8|beach|32895
fr-reims|Reims|Champagne-Ardenne|France|FR|EU|49.2504|4.03|Europe/Paris|3.6|small-city|65535
fr-rennes|Rennes|Bretagne|France|FR|EU|48.1|-1.67|Europe/Paris|3.6|small-city|65535
fr-rouen|Rouen|Haute-Normandie|France|FR|EU|49.4304|1.08|Europe/Paris|7.4|major-city|65535
fr-saint-etienne|Saint-Etienne|Rhône-Alpes|France|FR|EU|45.4304|4.38|Europe/Paris|7|major-city|65535
re-st-denis|St.-Denis|La Réunion|France|RE|AF|-20.8789|55.4481|Indian/Reunion|3.8|beach|16368
fr-strasbourg|Strasbourg|Alsace|France|FR|EU|48.58|7.75|Europe/Paris|7.4|major-city|65535
fr-toulon|Toulon|Provence-Alpes-Côte-d'Azur|France|FR|EU|43.1342|5.9188|Europe/Paris|3.8|beach|63551
fr-toulouse|Toulouse|Midi-Pyrénées|France|FR|EU|43.62|1.4499|Europe/Paris|7.4|major-city|65535
fr-tours|Tours|Centre|France|FR|EU|47.3804|0.6999|Europe/Paris|3.6|small-city|65535
pf-papeete|Papeete||French Polynesia|PF|OC|-17.5334|-149.5667|Pacific/Tahiti|2.4|island|32767
ga-franceville|Franceville|Haut-Ogooué|Gabon|GA|AF|-1.6333|13.5833|Africa/Libreville|2.8|small-city|65535
ga-libreville|Libreville|Estuaire|Gabon|GA|AF|0.3854|9.458|Africa/Libreville|6.4|capital|32895
ga-port-gentil|Port-Gentil|Ogooué-Maritime|Gabon|GA|AF|-0.72|8.78|Africa/Libreville|3.8|beach|50115
gm-brikama|Brikama|Banjul|Gambia|GM|AF|13.2804|-16.6599|Africa/Banjul|3.6|small-city|65535
ge-batumi|Batumi|Ajaria|Georgia|GE|AS|41.6|41.63|Asia/Tbilisi|3.8|beach|8191
ge-kutaisi|Kutaisi|Imereti|Georgia|GE|AS|42.25|42.73|Asia/Tbilisi|3.6|small-city|65535
ge-rustavi|Rustavi|Kvemo Kartli|Georgia|GE|AS|41.5704|45.05|Asia/Tbilisi|3.6|small-city|65535
ge-sukhumi|Sukhumi|Abkhazia|Georgia|GE|AS|43.02|41.02|Asia/Tbilisi|3|beach|65535
ge-tbilisi|Tbilisi||Georgia|GE|AS|41.725|44.7908|Asia/Tbilisi|7|capital|65535
de-augsburg|Augsburg|Bayern|Germany|DE|EU|48.35|10.9|Europe/Berlin|7.4|major-city|65535
de-berlin|Berlin||Germany|DE|EU|52.5218|13.4015|Europe/Berlin|7.3|nightlife|65535
de-bielefeld|Bielefeld|Nordrhein-Westfalen|Germany|DE|EU|52.03|8.53|Europe/Berlin|7.4|major-city|65535
de-bonn|Bonn|Nordrhein-Westfalen|Germany|DE|EU|50.7205|7.08|Europe/Berlin|7.4|major-city|65535
de-bremen|Bremen||Germany|DE|EU|53.08|8.8|Europe/Berlin|7.4|major-city|65535
de-chemnitz|Chemnitz|Sachsen|Germany|DE|EU|50.83|12.92|Europe/Berlin|7|major-city|65535
de-cologne|Cologne|Nordrhein-Westfalen|Germany|DE|EU|50.93|6.95|Europe/Berlin|7.4|major-city|65535
de-dortmund|Dortmund|Nordrhein-Westfalen|Germany|DE|EU|51.53|7.45|Europe/Berlin|7.4|major-city|65535
de-dresden|Dresden|Sachsen|Germany|DE|EU|51.05|13.75|Europe/Berlin|5.4|historic|65535
de-duisburg|Duisburg|Nordrhein-Westfalen|Germany|DE|EU|51.43|6.75|Europe/Berlin|7.4|major-city|65535
de-dusseldorf|Düsseldorf|Nordrhein-Westfalen|Germany|DE|EU|51.2204|6.78|Europe/Berlin|7.4|major-city|65535
de-essen|Essen|Nordrhein-Westfalen|Germany|DE|EU|51.45|7.0166|Europe/Berlin|8|major-city|65535
de-frankfurt|Frankfurt|Hessen|Germany|DE|EU|50.1|8.675|Europe/Berlin|8|major-city|65535
de-hamburg|Hamburg||Germany|DE|EU|53.55|10|Europe/Berlin|8|major-city|65535
de-hannover|Hannover|Niedersachsen|Germany|DE|EU|52.367|9.7167|Europe/Berlin|7.4|major-city|65535
de-heidelberg|Heidelberg|Baden-Württemberg|Germany|DE|EU|49.42|8.7|Europe/Berlin|5|historic|65535
de-karlsruhe|Karlsruhe|Baden-Württemberg|Germany|DE|EU|49|8.4|Europe/Berlin|7.4|major-city|65535
de-leipzig|Leipzig|Sachsen|Germany|DE|EU|51.3354|12.41|Europe/Berlin|7.4|major-city|65535
de-mannheim|Mannheim|Baden-Württemberg|Germany|DE|EU|49.5004|8.47|Europe/Berlin|8|major-city|65535
de-munich|Munich|Bayern|Germany|DE|EU|48.1299|11.575|Europe/Berlin|8|major-city|65535
de-munster|Münster|Nordrhein-Westfalen|Germany|DE|EU|51.9704|7.62|Europe/Berlin|7|major-city|65535
de-nurnberg|Nürnberg|Bayern|Germany|DE|EU|49.45|11.08|Europe/Berlin|7.4|major-city|65535
de-saarbrucken|Saarbrucken|Saarland|Germany|DE|EU|49.2504|6.97|Europe/Berlin|7.4|major-city|65535
de-stuttgart|Stuttgart|Baden-Württemberg|Germany|DE|EU|48.78|9.2|Europe/Berlin|8|major-city|65535
de-wiesbaden|Wiesbaden|Hessen|Germany|DE|EU|50.0804|8.25|Europe/Berlin|7.4|major-city|65535
de-wuppertal|Wuppertal|Nordrhein-Westfalen|Germany|DE|EU|51.25|7.17|Europe/Berlin|7.4|major-city|65535
gh-accra|Accra|Greater Accra|Ghana|GH|AF|5.55|-0.2167|Africa/Accra|7|capital|63503
gh-cape-coast|Cape Coast|Central|Ghana|GH|AF|5.1104|-1.25|Africa/Accra|3.8|beach|63519
gh-koforidua|Koforidua|Eastern|Ghana|GH|AF|6.0904|-0.26|Africa/Accra|3.6|small-city|65535
gh-kumasi|Kumasi|Ashanti|Ghana|GH|AF|6.69|-1.63|Africa/Accra|8|major-city|65535
gh-obuasi|Obuasi|Ashanti|Ghana|GH|AF|6.1904|-1.66|Africa/Accra|3.6|small-city|65535
gh-sekondi|Sekondi|Western|Ghana|GH|AF|4.9433|-1.704|Africa/Accra|3.8|beach|64527
gh-tamale|Tamale|Northern|Ghana|GH|AF|9.4004|-0.84|Africa/Accra|7.4|major-city|65535
gh-tema|Tema|Greater Accra|Ghana|GH|AF|5.6404|0.01|Africa/Accra|3.8|beach|64543
gr-agrinio|Agrinio|Dytiki Ellada|Greece|GR|EU|38.6218|21.4077|Europe/Athens|2.8|small-city|65535
gr-athens|Athens|Attiki|Greece|GR|EU|37.9833|23.7333|Europe/Athens|6|historic|65535
gr-chalkida|Chalkida|Stereá Elláda|Greece|GR|EU|38.464|23.6124|Europe/Athens|3|beach|124
gr-hania|Hania|Kriti|Greece|GR|EU|35.5122|24.0156|Europe/Athens|3|beach|8184
gr-ioanina|Ioanina|Ipeiros|Greece|GR|EU|39.6679|20.8509|Europe/Athens|2.8|small-city|65535
gr-iraklio|Iraklio|Kriti|Greece|GR|EU|35.325|25.1305|Europe/Athens|3.8|beach|16376
gr-kalamata|Kalamata|Peloponnisos|Greece|GR|EU|37.0389|22.1142|Europe/Athens|3|beach|61503
gr-kavala|Kavala|Anatoliki Makedonia kai Thraki|Greece|GR|EU|40.9412|24.4018|Europe/Athens|3|beach|63503
gr-larissa|Larissa|Thessalia|Greece|GR|EU|39.6304|22.42|Europe/Athens|3.6|small-city|65535
gr-patra|Patra|Dytiki Ellada|Greece|GR|EU|38.23|21.73|Europe/Athens|3.8|beach|1022
gr-piraievs|Piraiévs|Attiki|Greece|GR|EU|37.95|23.7|Europe/Athens|4.2|beach|61695
gr-rodos|Rodos|Notio Aigaio|Greece|GR|EU|36.4412|28.2225|Europe/Athens|1.8|beach|8128
gr-thessaloniki|Thessaloniki|Kentriki Makedonia|Greece|GR|EU|40.6961|22.885|Europe/Athens|7.4|major-city|65151
gr-volos|Volos|Thessalia|Greece|GR|EU|39.37|22.95|Europe/Athens|3.8|beach|64543
gd-saint-george-s|Saint George's||Grenada|GD|NA|12.0526|-61.7416|America/Grenada|2.4|island|33791
gu-agana|Agana||Guam|GU|OC|13.47|144.75|Pacific/Guam|2.6|tropical|65535
gt-chimaltenango|Chimaltenango||Guatemala|GT|NA|14.662|-90.82|America/Guatemala|3.6|small-city|65535
gt-el-progreso|El Progreso||Guatemala|GT|NA|14.85|-90.0167|America/Guatemala|3.6|small-city|65535
gt-escuintla|Escuintla||Guatemala|GT|NA|14.3004|-90.78|America/Guatemala|3.6|small-city|65535
gt-guatemala|Guatemala||Guatemala|GT|NA|14.6211|-90.527|America/Guatemala|8|major-city|65535
gt-huehuetenango|Huehuetenango||Guatemala|GT|NA|15.3204|-91.47|America/Guatemala|3.6|small-city|65535
gt-quetzaltenango|Quetzaltenango|Quezaltenango|Guatemala|GT|NA|14.83|-91.52|America/Guatemala|7.4|major-city|65535
gn-boke|Boke||Guinea|GN|AF|10.94|-14.3|Africa/Conakry|3.6|small-city|65535
gn-conakry|Conakry||Guinea|GN|AF|9.5315|-13.6802|Africa/Conakry|3.15|capital|2063
gn-gueckedou|Gueckedou|Nzerekore|Guinea|GN|AF|8.554|-10.151|Africa/Conakry|7|major-city|65535
gn-nzerekore|Nzerekore||Guinea|GN|AF|7.76|-8.83|Africa/Conakry|3.6|small-city|65535
gw-bissau|Bissau||Guinea-Bissau|GW|AF|11.865|-15.5984|Africa/Bissau|6.4|capital|64519
gy-georgetown|Georgetown|East Berbice-Corentyne|Guyana|GY|SA|6.802|-58.167|America/Guyana|6|capital|32760
gy-new-amsterdam|New Amsterdam|Essequibo Islands-West Demerara|Guyana|GY|SA|6.25|-57.53|America/Guyana|3|beach|65534
hn-choluteca|Choluteca||Honduras|HN|NA|13.3007|-87.1908|America/Tegucigalpa|3.6|small-city|65535
hn-la-ceiba|La Ceiba|Atlántida|Honduras|HN|NA|15.7631|-86.797|America/Tegucigalpa|3.8|beach|16382
hn-roatan|Roatan|Islas de la Bahía|Honduras|HN|NA|16.33|-86.519|America/Tegucigalpa|2.4|island|64543
hn-san-pedro-sula|San Pedro Sula|Cortés|Honduras|HN|NA|15.5|-88.03|America/Tegucigalpa|7.4|major-city|65535
hn-tegucigalpa|Tegucigalpa|Francisco Morazán|Honduras|HN|NA|14.102|-87.2175|America/Tegucigalpa|6.4|capital|65535
hk-hong-kong|Hong Kong||Hong Kong|HK|AS|22.305|114.185|Asia/Hong_Kong|8.8|major-city|49887
hu-budapest|Budapest||Hungary|HU|EU|47.5|19.0833|Europe/Budapest|7|capital|65535
hu-debrecen|Debrecen|Hajdú-Bihar|Hungary|HU|EU|47.5305|21.63|Europe/Budapest|3.6|small-city|65535
hu-gyor|Gyor|Gyor-Moson-Sopron|Hungary|HU|EU|47.7004|17.63|Europe/Budapest|3.6|small-city|65535
hu-miskolc|Miskolc|Borsod-Abaúj-Zemplén|Hungary|HU|EU|48.1004|20.78|Europe/Budapest|3.6|small-city|65535
hu-nyiregyhaza|Nyiregyhaza|Szabolcs-Szatmár-Bereg|Hungary|HU|EU|47.9653|21.7187|Europe/Budapest|3.6|small-city|65535
hu-pecs|Pecs|Baranya|Hungary|HU|EU|46.0804|18.22|Europe/Budapest|3.6|small-city|65535
hu-szeged|Szeged|Csongrád|Hungary|HU|EU|46.2504|20.15|Europe/Budapest|3.6|small-city|65535
hu-szekesfehervar|Szekesfehervar|Fejér|Hungary|HU|EU|47.1947|18.4081|Europe/Budapest|3.6|small-city|65535
is-reykjavik|Reykjavík|Suðurnes|Iceland|IS|EU|64.15|-21.95|Atlantic/Reykjavik|2.28|beach|24824
in-agra|Agra|Uttar Pradesh|India|IN|AS|27.1704|78.015|Asia/Kolkata|6|historic|65535
in-ahmedabad|Ahmedabad|Dadra and Nagar Haveli|India|IN|AS|23.0301|72.58|Asia/Kolkata|8.8|major-city|65535
in-amritsar|Amritsar|Punjab|India|IN|AS|31.64|74.87|Asia/Kolkata|8|major-city|65535
in-asansol|Asansol|West Bengal|India|IN|AS|23.6833|86.9833|Asia/Kolkata|8|major-city|65535
in-bengaluru|Bengaluru|Karnataka|India|IN|AS|12.97|77.56|Asia/Kolkata|8.8|major-city|65535
in-bhilai|Bhilai|Chhattisgarh|India|IN|AS|21.2167|81.4333|Asia/Kolkata|8|major-city|65535
in-bhopal|Bhopal|Madhya Pradesh|India|IN|AS|23.25|77.41|Asia/Kolkata|8|major-city|65535
in-chennai|Chennai|Tamil Nadu|India|IN|AS|13.09|80.28|Asia/Kolkata|5.6|beach|65283
in-chhatrapati-sambhajinagar|Chhatrapati Sambhajinagar|Maharashtra|India|IN|AS|19.8957|75.3203|Asia/Kolkata|8|major-city|65535
in-coimbatore|Coimbatore|Tamil Nadu|India|IN|AS|11|76.95|Asia/Kolkata|8|major-city|65535
in-delhi|Delhi||India|IN|AS|28.67|77.23|Asia/Kolkata|8.8|major-city|65535
in-faridabad|Faridabad|Haryana|India|IN|AS|28.4333|77.3167|Asia/Kolkata|8|major-city|65535
in-ghaziabad|Ghaziabad|Uttar Pradesh|India|IN|AS|28.6604|77.4084|Asia/Kolkata|8|major-city|65535
in-haora|Haora|West Bengal|India|IN|AS|22.5804|88.3299|Asia/Kolkata|8|major-city|65535
in-hyderabad|Hyderabad|Andhra Pradesh|India|IN|AS|17.4|78.48|Asia/Kolkata|8.8|major-city|65535
in-indore|Indore|Madhya Pradesh|India|IN|AS|22.7151|75.865|Asia/Kolkata|8|major-city|65535
in-jabalpur|Jabalpur|Madhya Pradesh|India|IN|AS|23.1751|79.9551|Asia/Kolkata|8|major-city|65535
in-jaipur|Jaipur|Rajasthan|India|IN|AS|26.9211|75.81|Asia/Kolkata|6|historic|65535
in-kalyan|Kalyan|Maharashtra|India|IN|AS|19.2502|73.1602|Asia/Kolkata|8|major-city|65535
in-kanpur|Kanpur|Uttar Pradesh|India|IN|AS|26.46|80.32|Asia/Kolkata|8|major-city|65535
in-kochi|Kochi|Kerala|India|IN|AS|10.015|76.2239|Asia/Kolkata|1.54|beach|32963
in-kolkata|Kolkata|West Bengal|India|IN|AS|22.495|88.3247|Asia/Kolkata|8.8|major-city|65535
in-lucknow|Lucknow|Uttar Pradesh|India|IN|AS|26.855|80.915|Asia/Kolkata|8|major-city|65535
in-ludhiana|Ludhiana|Punjab|India|IN|AS|30.9278|75.8723|Asia/Kolkata|8|major-city|65535
in-madurai|Madurai|Tamil Nadu|India|IN|AS|9.92|78.12|Asia/Kolkata|8|major-city|65535
in-meerut|Meerut|Uttar Pradesh|India|IN|AS|29.0004|77.7|Asia/Kolkata|8|major-city|65535
in-mumbai|Mumbai|Maharashtra|India|IN|AS|19.017|72.857|Asia/Kolkata|8.8|major-city|34319
in-nagpur|Nagpur|Maharashtra|India|IN|AS|21.17|79.09|Asia/Kolkata|8|major-city|65535
in-nasik|Nasik|Maharashtra|India|IN|AS|20.0004|73.78|Asia/Kolkata|8|major-city|65535
in-new-delhi|New Delhi|Delhi|India|IN|AS|28.6|77.2|Asia/Kolkata|6.4|capital|65535
in-patna|Patna|Bihar|India|IN|AS|25.625|85.13|Asia/Kolkata|8|major-city|65535
in-prayagraj|Prayagraj|Uttar Pradesh|India|IN|AS|25.455|81.84|Asia/Kolkata|8|major-city|65535
in-pune|Pune|Maharashtra|India|IN|AS|18.53|73.85|Asia/Kolkata|8.8|major-city|65535
in-rajkot|Rajkot|Dadra and Nagar Haveli|India|IN|AS|22.31|70.8|Asia/Kolkata|8|major-city|65535
in-srinagar|Srinagar|Jammu and Kashmir|India|IN|AS|34.1|74.815|Asia/Kolkata|8|major-city|65535
in-surat|Surat|Dadra and Nagar Haveli|India|IN|AS|21.2|72.84|Asia/Kolkata|8.8|major-city|65023
in-udaipur|Udaipur|Rajasthan|India|IN|AS|24.6|73.73|Asia/Kolkata|5.4|historic|65535
in-vadodara|Vadodara|Dadra and Nagar Haveli|India|IN|AS|22.31|73.18|Asia/Kolkata|8|major-city|65535
in-varanasi|Varanasi|Uttar Pradesh|India|IN|AS|25.33|83|Asia/Kolkata|6|historic|65535
in-vishakhapatnam|Vishakhapatnam|Andhra Pradesh|India|IN|AS|17.73|83.305|Asia/Kolkata|4.8|beach|61471
id-balikpapan|Balikpapan|Kalimantan Timur|Indonesia|ID|AS|-1.25|116.83|Asia/Makassar|4.2|beach|31
id-bandar-lampung|Bandar Lampung|Lampung|Indonesia|ID|AS|-5.4496|105.3|Asia/Jakarta|4.2|beach|57471
id-bandjarmasin|Bandjarmasin|Kalimantan Selatan|Indonesia|ID|AS|-3.33|114.5801|Asia/Makassar|7.4|major-city|64511
id-bandung|Bandung|Jawa Barat|Indonesia|ID|AS|-6.95|107.57|Asia/Jakarta|8|major-city|65535
id-bekasi|Bekasi|Jakarta Raya|Indonesia|ID|AS|-6.2173|106.9723|Asia/Jakarta|8|major-city|65535
id-binjai|Binjai|Sumatera Utara|Indonesia|ID|AS|3.6204|98.5001|Asia/Jakarta|7.4|major-city|65535
id-bogor|Bogor|Jawa Barat|Indonesia|ID|AS|-6.57|106.75|Asia/Jakarta|7.4|major-city|65535
id-cilacap|Cilacap|Jawa Tengah|Indonesia|ID|AS|-7.7188|109.0154|Asia/Jakarta|4.8|beach|57351
id-denpasar|Denpasar|Bali|Indonesia|ID|AS|-8.65|115.22|Asia/Makassar|3.8|tropical|65535
id-jakarta|Jakarta|Jakarta Raya|Indonesia|ID|AS|-6.1744|106.8294|Asia/Jakarta|8.8|major-city|32766
id-jambi|Jambi||Indonesia|ID|AS|-1.59|103.61|Asia/Jakarta|7.4|major-city|65535
id-malang|Malang|Jawa Timur|Indonesia|ID|AS|-7.98|112.61|Asia/Jakarta|7.4|major-city|65535
id-manado|Manado|Sulawesi Utara|Indonesia|ID|AS|1.48|124.85|Asia/Makassar|4.2|beach|2047
id-mataram|Mataram|Nusa Tenggara Barat|Indonesia|ID|AS|-8.5795|116.135|Asia/Makassar|7.4|major-city|61439
id-medan|Medan|Sumatera Utara|Indonesia|ID|AS|3.58|98.65|Asia/Jakarta|8|major-city|65535
id-padang|Padang|Sumatera Barat|Indonesia|ID|AS|-0.96|100.36|Asia/Jakarta|4.2|beach|255
id-palembang|Palembang|Sumatera Selatan|Indonesia|ID|AS|-2.98|104.75|Asia/Jakarta|8|major-city|65535
id-palu|Palu|Sulawesi Tengah|Indonesia|ID|AS|-0.907|119.833|Asia/Makassar|7.4|major-city|65534
id-pekanbaru|Pekanbaru|Riau|Indonesia|ID|AS|0.565|101.425|Asia/Jakarta|7.4|major-city|65535
id-pontianak|Pontianak|Kalimantan Barat|Indonesia|ID|AS|-0.03|109.32|Asia/Pontianak|7.4|major-city|49151
id-samarinda|Samarinda|Kalimantan Timur|Indonesia|ID|AS|-0.5|117.15|Asia/Makassar|7.4|major-city|65535
id-semarang|Semarang|Jawa Tengah|Indonesia|ID|AS|-6.9666|110.42|Asia/Jakarta|4.8|beach|4088
id-surabaya|Surabaya|Jawa Timur|Indonesia|ID|AS|-7.2492|112.7508|Asia/Jakarta|8|major-city|4064
id-surakarta|Surakarta|Jawa Tengah|Indonesia|ID|AS|-7.565|110.825|Asia/Jakarta|7.4|major-city|65535
id-ujungpandang|Ujungpandang|Sulawesi Selatan|Indonesia|ID|AS|-5.14|119.432|Asia/Makassar|8|major-city|2044
id-yogyakarta|Yogyakarta||Indonesia|ID|AS|-7.78|110.375|Asia/Jakarta|5.4|historic|65535
ir-isfahan|Isfahan|Esfahan|Iran|IR|AS|32.7|51.7|Asia/Tehran|8|major-city|65535
ir-karaj|Karaj|Tehran|Iran|IR|AS|35.8004|50.97|Asia/Tehran|8|major-city|65535
ir-mashhad|Mashhad|Razavi Khorasan|Iran|IR|AS|36.27|59.57|Asia/Tehran|8|major-city|65535
ir-tehran|Tehran||Iran|IR|AS|35.6719|51.4243|Asia/Tehran|7.8|capital|65535
iq-baghdad|Baghdad||Iraq|IQ|AS|33.3386|44.3939|Asia/Baghdad|7.8|capital|65535
iq-basra|Basra|Al-Basrah|Iraq|IQ|AS|30.5135|47.8136|Asia/Baghdad|7.4|major-city|65535
iq-irbil|Irbil|Arbil|Iraq|IQ|AS|36.179|44.0086|Asia/Baghdad|7.4|major-city|65535
iq-mosul|Mosul|Ninawa|Iraq|IQ|AS|36.345|43.145|Asia/Baghdad|8|major-city|65535
ie-cork|Cork||Ireland|IE|EU|51.8986|-8.4958|Europe/Dublin|3.6|small-city|65535
ie-dublin|Dublin||Ireland|IE|EU|53.3331|-6.2489|Europe/Dublin|7|capital|65475
ie-galway|Galway||Ireland|IE|EU|53.2724|-9.0488|Europe/Dublin|2.8|small-city|61455
ie-limerick|Limerick||Ireland|IE|EU|52.6647|-8.6231|Europe/Dublin|3.6|small-city|65535
ie-waterford|Waterford|Kilkenny|Ireland|IE|EU|52.2583|-7.1119|Europe/Dublin|2.8|small-city|65535
il-beer-sheva|Beer Sheva|HaDarom|Israel|IL|AS|31.25|34.83|Asia/Jerusalem|3.6|small-city|65535
il-haifa|Haifa||Israel|IL|AS|32.8204|34.98|Asia/Jerusalem|4.2|beach|2032
il-jerusalem|Jerusalem||Israel|IL|AS|31.7784|35.2066|Asia/Jerusalem|5.4|historic|65535
il-nazareth|Nazareth|HaZafon|Israel|IL|AS|32.704|35.2955|Asia/Jerusalem|3.6|small-city|65535
il-ramla|Ramla|HaMerkaz|Israel|IL|AS|31.9167|34.8667|Asia/Jerusalem|2.8|small-city|65535
il-tel-aviv-yafo|Tel Aviv-Yafo|Tel Aviv|Israel|IL|AS|32.08|34.77|Asia/Jerusalem|6.5|nightlife|1022
it-bari|Bari|Apulia|Italy|IT|EU|41.1142|16.8728|Europe/Rome|4.2|beach|32752
it-bergamo|Bergamo|Lombardia|Italy|IT|EU|45.7004|9.67|Europe/Rome|3.6|small-city|65535
it-bologna|Bologna|Emilia-Romagna|Italy|IT|EU|44.5004|11.34|Europe/Rome|5.4|historic|65535
it-cagliari|Cagliari|Sardegna|Italy|IT|EU|39.2224|9.104|Europe/Rome|3.2|island|32895
it-caserta|Caserta|Campania|Italy|IT|EU|41.06|14.3374|Europe/Rome|3.6|small-city|65535
it-catania|Catania|Sicily|Italy|IT|EU|37.5|15.08|Europe/Rome|3.6|island|65287
it-como|Como|Lombardia|Italy|IT|EU|45.81|9.08|Europe/Rome|3.6|small-city|65535
it-florence|Florence|Toscana|Italy|IT|EU|43.78|11.25|Europe/Rome|5.4|historic|65535
it-foggia|Foggia|Apulia|Italy|IT|EU|41.4605|15.56|Europe/Rome|3.6|small-city|65535
it-genoa|Genoa|Liguria|Italy|IT|EU|44.41|8.93|Europe/Rome|4.2|beach|61503
it-messina|Messina|Sicily|Italy|IT|EU|38.2005|15.55|Europe/Rome|3.8|beach|65027
it-milan|Milan|Lombardia|Italy|IT|EU|45.47|9.205|Europe/Rome|8|major-city|65535
it-modena|Modena|Emilia-Romagna|Italy|IT|EU|44.65|10.92|Europe/Rome|3.6|small-city|65535
it-naples|Naples|Campania|Italy|IT|EU|40.84|14.245|Europe/Rome|6|historic|63519
it-palermo|Palermo|Sicily|Italy|IT|EU|38.125|13.35|Europe/Rome|3.6|island|65475
it-parma|Parma|Emilia-Romagna|Italy|IT|EU|44.8104|10.32|Europe/Rome|3.6|small-city|65535
it-pescara|Pescara|Abruzzo|Italy|IT|EU|42.4554|14.2187|Europe/Rome|3.8|beach|65504
it-pisa|Pisa|Toscana|Italy|IT|EU|43.7205|10.4|Europe/Rome|3.6|small-city|65535
it-reggio-di-calabria|Reggio di Calabria|Calabria|Italy|IT|EU|38.115|15.6414|Europe/Rome|3.8|beach|510
it-rome|Rome|Lazio|Italy|IT|EU|41.896|12.4833|Europe/Rome|6|historic|65535
it-salerno|Salerno|Campania|Italy|IT|EU|40.6804|14.7699|Europe/Rome|4.2|beach|61503
it-taranto|Taranto|Apulia|Italy|IT|EU|40.5084|17.23|Europe/Rome|3.8|beach|64575
it-trieste|Trieste|Friuli-Venezia Giulia|Italy|IT|EU|45.6504|13.8|Europe/Rome|3.8|beach|53759
it-turin|Turin|Piemonte|Italy|IT|EU|45.0704|7.67|Europe/Rome|8|major-city|65535
it-venice|Venice|Veneto|Italy|IT|EU|45.4387|12.335|Europe/Rome|1.6|historic|32799
it-verona|Verona|Veneto|Italy|IT|EU|45.4404|10.99|Europe/Rome|5.4|historic|65535
ci-abidjan|Abidjan|Lagunes|Ivory Coast|CI|AF|5.32|-4.04|Africa/Abidjan|5.6|beach|63615
ci-bouake|Bouake|Vallée du Bandama|Ivory Coast|CI|AF|7.69|-5.03|Africa/Abidjan|7.4|major-city|65535
ci-daloa|Daloa|Haut-Sassandra|Ivory Coast|CI|AF|6.89|-6.45|Africa/Abidjan|7|major-city|65535
ci-san-pedro|San-Pedro|Bas-Sassandra|Ivory Coast|CI|AF|4.7704|-6.64|Africa/Abidjan|3.6|small-city|65535
ci-yamoussoukro|Yamoussoukro|Lacs|Ivory Coast|CI|AF|6.8184|-5.2755|Africa/Abidjan|6|capital|65535
jm-half-way-tree|Half Way Tree|Saint Andrew|Jamaica|JM|NA|18.0333|-76.8|America/Jamaica|3.4|tropical|65535
jm-kingston|Kingston||Jamaica|JM|NA|17.9771|-76.7674|America/Jamaica|6.4|capital|57407
jm-mandeville|Mandeville|Manchester|Jamaica|JM|NA|18.033|-77.5|America/Jamaica|2.6|tropical|65535
jm-may-pen|May Pen|Clarendon|Jamaica|JM|NA|17.9666|-77.2333|America/Jamaica|3.4|tropical|65535
jm-montego-bay|Montego Bay|Saint James|Jamaica|JM|NA|18.4667|-77.9167|America/Jamaica|3.8|beach|40959
jm-spanish-town|Spanish Town|Saint Catherine|Jamaica|JM|NA|17.9833|-76.95|America/Jamaica|3.4|tropical|65535
jp-fukuoka|Fukuoka||Japan|JP|AS|33.595|130.41|Asia/Tokyo|8|major-city|8191
jp-gifu|Gifu||Japan|JP|AS|35.4231|136.7628|Asia/Tokyo|7.4|major-city|65535
jp-hachioji|Hachioji|Tokyo|Japan|JP|AS|35.6577|139.3261|Asia/Tokyo|7.4|major-city|65535
jp-hamamatsu|Hamamatsu|Shizuoka|Japan|JP|AS|34.7181|137.7327|Asia/Tokyo|7.4|major-city|63743
jp-hiroshima|Hiroshima||Japan|JP|AS|34.3878|132.4429|Asia/Tokyo|6|historic|63551
jp-kagoshima|Kagoshima||Japan|JP|AS|31.586|130.5611|Asia/Tokyo|4.2|beach|65025
jp-kanazawa|Kanazawa|Ishikawa|Japan|JP|AS|36.56|136.64|Asia/Tokyo|7.4|major-city|40959
jp-kawasaki|Kawasaki|Kanagawa|Japan|JP|AS|35.53|139.705|Asia/Tokyo|8|major-city|64527
jp-kitakyushu|Kitakyushu|Fukuoka|Japan|JP|AS|33.8704|130.82|Asia/Tokyo|7.4|major-city|65521
jp-kobe|Kobe|Hyogo|Japan|JP|AS|34.68|135.17|Asia/Tokyo|4.8|beach|64543
jp-kumamoto|Kumamoto||Japan|JP|AS|32.8009|130.7006|Asia/Tokyo|7.4|major-city|65535
jp-kyoto|Kyoto||Japan|JP|AS|35.03|135.75|Asia/Tokyo|6|historic|65535
jp-matsuyama|Matsuyama|Ehime|Japan|JP|AS|33.8455|132.7658|Asia/Tokyo|7.4|major-city|36863
jp-nagano|Nagano||Japan|JP|AS|36.65|138.17|Asia/Tokyo|7.4|major-city|65535
jp-nagasaki|Nagasaki||Japan|JP|AS|32.765|129.885|Asia/Tokyo|7.4|major-city|58271
jp-nagoya|Nagoya|Aichi|Japan|JP|AS|35.155|136.915|Asia/Tokyo|8|major-city|65023
jp-naha|Naha|Okinawa|Japan|JP|AS|26.2072|127.673|Asia/Tokyo|3.6|island|4094
jp-niigata|Niigata||Japan|JP|AS|37.92|139.04|Asia/Tokyo|4.2|beach|4092
jp-oita|Oita||Japan|JP|AS|33.2432|131.5979|Asia/Tokyo|4.2|beach|8184
jp-okayama|Okayama||Japan|JP|AS|34.672|133.9171|Asia/Tokyo|7.4|major-city|65535
jp-osaka|Osaka||Japan|JP|AS|34.75|135.4601|Asia/Tokyo|8.8|major-city|65535
jp-otsu|Otsu|Shiga|Japan|JP|AS|35.0064|135.8674|Asia/Tokyo|4.2|beach|65409
jp-sapporo|Sapporo|Hokkaido|Japan|JP|AS|43.075|141.34|Asia/Tokyo|5|mountain|65535
jp-sendai|Sendai|Miyagi|Japan|JP|AS|38.2871|141.0217|Asia/Tokyo|8|major-city|65027
jp-shizuoka|Shizuoka||Japan|JP|AS|34.9858|138.3854|Asia/Tokyo|7.4|major-city|65087
jp-tokyo|Tokyo||Japan|JP|AS|35.685|139.7514|Asia/Tokyo|8.8|major-city|65471
jp-tsu|Tsu|Mie|Japan|JP|AS|34.7171|136.5167|Asia/Tokyo|4.2|beach|65281
jp-utsunomiya|Utsunomiya|Tochigi|Japan|JP|AS|36.55|139.87|Asia/Tokyo|7.4|major-city|65535
jp-wakayama|Wakayama||Japan|JP|AS|34.2231|135.1677|Asia/Tokyo|4.2|beach|58367
jp-yokohama|Yokohama|Kanagawa|Japan|JP|AS|35.32|139.58|Asia/Tokyo|8.8|major-city|61671
jo-al-aqabah|Al Aqabah|Aqaba|Jordan|JO|AS|29.527|35.0777|Asia/Amman|3.6|small-city|65535
jo-al-mafraq|Al Mafraq|Mafraq|Jordan|JO|AS|32.2833|36.2333|Asia/Amman|2.8|small-city|65535
jo-amman|Amman||Jordan|JO|AS|31.95|35.9333|Asia/Amman|7|capital|65535
jo-as-salt|As Salt|Balqa|Jordan|JO|AS|32.0392|35.7272|Asia/Amman|3.6|small-city|65535
jo-az-zarqa|Az Zarqa|Zarqa|Jordan|JO|AS|32.07|36.1|Asia/Amman|7.4|major-city|65535
jo-irbid|Irbid||Jordan|JO|AS|32.55|35.85|Asia/Amman|7.4|major-city|65535
kz-almaty|Almaty||Kazakhstan|KZ|AS|43.325|76.915|Asia/Almaty|8|major-city|65535
kz-astana|Astana|Aqmola|Kazakhstan|KZ|AS|51.1811|71.4278|Asia/Almaty|6.4|capital|65535
kz-oskemen|Oskemen|East Kazakhstan|Kazakhstan|KZ|AS|49.99|82.6149|Asia/Almaty|7|major-city|65535
kz-pavlodar|Pavlodar||Kazakhstan|KZ|AS|52.3|76.95|Asia/Almaty|7.4|major-city|65535
kz-qaraghandy|Qaraghandy||Kazakhstan|KZ|AS|49.885|73.115|Asia/Almaty|7.4|major-city|65535
kz-semey|Semey|East Kazakhstan|Kazakhstan|KZ|AS|50.435|80.275|Asia/Almaty|7.4|major-city|65535
kz-shymkent|Shymkent|South Kazakhstan|Kazakhstan|KZ|AS|42.32|69.595|Asia/Almaty|7.4|major-city|65535
kz-taraz|Taraz|Zhambyl|Kazakhstan|KZ|AS|42.9|71.365|Asia/Almaty|7.4|major-city|65535
ke-eldoret|Eldoret|Rift Valley|Kenya|KE|AF|0.52|35.27|Africa/Nairobi|7|major-city|65535
ke-kendu-bay|Kendu Bay|Nyanza|Kenya|KE|AF|-0.3596|34.64|Africa/Nairobi|3.8|beach|32760
ke-kisumu|Kisumu|Nyanza|Kenya|KE|AF|-0.09|34.75|Africa/Nairobi|4.2|beach|58367
ke-kitale|Kitale|Rift Valley|Kenya|KE|AF|1.0305|34.9899|Africa/Nairobi|3.6|small-city|65535
ke-mombasa|Mombasa|Coast|Kenya|KE|AF|-4.04|39.6899|Africa/Nairobi|4.2|beach|49159
ke-nairobi|Nairobi||Kenya|KE|AF|-1.2833|36.8167|Africa/Nairobi|7|capital|65535
ke-nakuru|Nakuru|Rift Valley|Kenya|KE|AF|-0.28|36.07|Africa/Nairobi|7.4|major-city|65535
ke-thika|Thika|Central|Kenya|KE|AF|-1.0396|37.09|Africa/Nairobi|3.6|small-city|65535
kw-al-jahra|Al Jahra|Al Jahrah|Kuwait|KW|AS|29.3375|47.6581|Asia/Kuwait|3.6|small-city|65535
kw-hawalli|Hawalli||Kuwait|KW|AS|29.3333|48|Asia/Kuwait|3.8|beach|65529
kw-kuwait|Kuwait|Al Kuwayt|Kuwait|KW|AS|29.3697|47.9783|Asia/Kuwait|4.8|beach|4064
kg-bishkek|Bishkek||Kyrgyzstan|KG|AS|42.8731|74.5852|Asia/Bishkek|6.4|capital|65535
kg-jalal-abad|Jalal Abad|Jalal-Abad|Kyrgyzstan|KG|AS|40.9429|73.0025|Asia/Bishkek|3.6|small-city|65535
kg-osh|Osh||Kyrgyzstan|KG|AS|40.5404|72.79|Asia/Bishkek|7|major-city|65535
kg-tokmak|Tokmak|Bishkek|Kyrgyzstan|KG|AS|42.8299|75.2846|Asia/Bishkek|3.6|small-city|65535
la-louangphrabang|Louangphrabang||Laos|LA|AS|19.8845|102.1416|Asia/Vientiane|2.8|small-city|65535
la-pakxe|Pakxe|Champasak|Laos|LA|AS|15.1221|105.8183|Asia/Vientiane|3.6|small-city|65535
la-savannakhet|Savannakhet|Savannakhét|Laos|LA|AS|16.5376|104.773|Asia/Vientiane|2.8|small-city|65535
la-vientiane|Vientiane|Vientiane [prefecture]|Laos|LA|AS|17.9667|102.6|Asia/Vientiane|6.4|capital|65535
lv-daugavpils|Daugavpils||Latvia|LV|EU|55.88|26.51|Europe/Riga|3.6|small-city|65535
lv-jelgava|Jelgava||Latvia|LV|EU|56.6527|23.7128|Europe/Riga|2.8|small-city|65535
lv-liepaga|Liepaga|Liepaja|Latvia|LV|EU|56.51|21.01|Europe/Riga|1.4|beach|448
lv-riga|Riga||Latvia|LV|EU|56.95|24.1|Europe/Riga|5.4|historic|65535
lb-beirut|Beirut||Lebanon|LB|AS|33.872|35.5097|Asia/Beirut|7|capital|1016
lb-saida|Saida|South Lebanon|Lebanon|LB|AS|33.563|35.3688|Asia/Beirut|3.8|beach|510
lb-trablous|Trablous|North Lebanon|Lebanon|LB|AS|34.42|35.87|Asia/Beirut|7.4|major-city|4092
lb-zahle|Zahle|Mount Lebanon|Lebanon|LB|AS|33.8501|35.9042|Asia/Beirut|2.8|small-city|65535
ls-hlotse|Hlotse|Leribe|Lesotho|LS|AF|-28.878|28.056|Africa/Maseru|2.8|small-city|65535
ls-mafetang|Mafetang|Mafeteng|Lesotho|LS|AF|-29.8166|27.25|Africa/Maseru|2.8|small-city|65535
ls-maseru|Maseru||Lesotho|LS|AF|-29.3167|27.4833|Africa/Maseru|6|capital|65535
lr-monrovia|Monrovia|Montserrado|Liberia|LR|AF|6.3106|-10.8048|Africa/Monrovia|1.4|capital|126
lt-kaunas|Kaunas|Kauno|Lithuania|LT|EU|54.9504|23.88|Europe/Vilnius|7.4|major-city|65535
lt-klaipeda|Klaipeda|Klaipedos|Lithuania|LT|EU|55.7204|21.1199|Europe/Vilnius|3.8|beach|49407
lt-siauliai|Siauliai|Šiauliai|Lithuania|LT|EU|55.9386|23.325|Europe/Vilnius|3.6|small-city|65535
lt-vilnius|Vilnius|Vilniaus|Lithuania|LT|EU|54.6834|25.3166|Europe/Vilnius|6.4|capital|65535
lu-luxembourg|Luxembourg||Luxembourg|LU|EU|49.6117|6.13|Europe/Luxembourg|6|capital|65535
mo-macau|Macau||Macau|MO|AS|22.203|113.545|Asia/Macau|5.9|nightlife|63491
mg-antananarivo|Antananarivo||Madagascar|MG|AF|-18.9166|47.5166|Indian/Antananarivo|7|capital|65535
mg-antsirabe|Antsirabe|Antananarivo|Madagascar|MG|AF|-19.85|47.0333|Indian/Antananarivo|7.4|major-city|65535
mg-fianarantsoa|Fianarantsoa||Madagascar|MG|AF|-21.4333|47.0833|Indian/Antananarivo|3.6|small-city|65535
mg-mahajanga|Mahajanga||Madagascar|MG|AF|-15.67|46.345|Indian/Antananarivo|3.8|beach|34815
mg-toamasina|Toamasina||Madagascar|MG|AF|-18.1818|49.405|Indian/Antananarivo|3.8|beach|64515
mw-blantyre|Blantyre||Malawi|MW|AF|-15.79|34.9899|Africa/Blantyre|7.4|major-city|65535
mw-lilongwe|Lilongwe||Malawi|MW|AF|-13.9833|33.7833|Africa/Blantyre|6.4|capital|65535
mw-mzuzu|Mzuzu|Mzimba|Malawi|MW|AF|-11.46|34.02|Africa/Blantyre|3.6|small-city|65535
mw-zomba|Zomba||Malawi|MW|AF|-15.39|35.31|Africa/Blantyre|3.6|small-city|65535
my-butterworth|Butterworth|Pulau Pinang|Malaysia|MY|AS|5.4171|100.4|Asia/Kuala_Lumpur|4.2|beach|33791
my-george-town|George Town|Pulau Pinang|Malaysia|MY|AS|5.4136|100.3294|Asia/Kuala_Lumpur|4.8|beach|32256
my-ipoh|Ipoh|Perak|Malaysia|MY|AS|4.6|101.065|Asia/Kuala_Lumpur|7.4|major-city|65535
my-johor-bahru|Johor Bahru|Johor|Malaysia|MY|AS|1.48|103.73|Asia/Kuala_Lumpur|4.2|beach|64639
my-kelang|Kelang|Selangor|Malaysia|MY|AS|3.0204|101.55|Asia/Kuala_Lumpur|7.4|major-city|65535
my-kota-kinabalu|Kota Kinabalu|Sabah|Malaysia|MY|AS|5.98|116.11|Asia/Kuching|3.8|tropical|2046
my-kuala-lumpur|Kuala Lumpur|Selangor|Malaysia|MY|AS|3.1667|101.7|Asia/Kuala_Lumpur|8|major-city|65535
my-kuching|Kuching|Sarawak|Malaysia|MY|AS|1.53|110.33|Asia/Kuching|7.4|major-city|65535
my-malacca|Malacca|Melaka|Malaysia|MY|AS|2.2064|102.2465|Asia/Kuala_Lumpur|4.2|beach|57407
my-shah-alam|Shah Alam|Selangor|Malaysia|MY|AS|3.0667|101.55|Asia/Kuala_Lumpur|7.4|major-city|65535
mv-male|Male||Maldives|MV|AS|4.1667|73.4999|Indian/Maldives|1.92|island|61471
mt-valletta|Valletta||Malta|MT|EU|35.8997|14.5147|Europe/Malta|5|historic|32704
mr-nema|Nema|Hodh ech Chargui|Mauritania|MR|AF|16.6171|-7.25|Africa/Nouakchott|3.6|small-city|65535
mr-nouadhibou|Nouadhibou|Dakhlet Nouadhibou|Mauritania|MR|AF|20.9|-17.056|Africa/Nouakchott|3.8|beach|61319
mr-nouakchott|Nouakchott||Mauritania|MR|AF|18.0864|-15.9753|Africa/Nouakchott|6.4|capital|59391
mr-saint-louis|Saint-Louis|Trarza|Mauritania|MR|AF|16.02|-16.51|Africa/Dakar|3.8|beach|33791
mu-curepipe|Curepipe||Mauritius|MU|AF|-20.3162|57.5166|Indian/Mauritius|3.4|tropical|65535
mu-port-louis|Port Louis||Mauritius|MU|AF|-20.1666|57.5|Indian/Mauritius|3.6|island|8191
mx-acapulco|Acapulco|Guerrero|Mexico|MX|NA|16.85|-99.916|America/Mexico_City|4.2|beach|49167
mx-aguascalientes|Aguascalientes||Mexico|MX|NA|21.8795|-102.2904|America/Mexico_City|7.4|major-city|65535
mx-cabo-san-lucas|Cabo San Lucas|Baja California Sur|Mexico|MX|NA|22.8928|-109.9045|America/Mazatlan|4.2|vacation|63503
mx-cancun|Cancun|Quintana Roo|Mexico|MX|NA|21.17|-86.83|America/Cancun|4.2|beach|65505
mx-chihuahua|Chihuahua||Mexico|MX|NA|28.645|-106.085|America/Chihuahua|7.4|major-city|65535
mx-ciudad-juarez|Ciudad Juárez|Chihuahua|Mexico|MX|NA|31.6904|-106.49|America/Ojinaga|8|major-city|65535
mx-cuernavaca|Cuernavaca|Morelos|Mexico|MX|NA|18.9211|-99.24|America/Mexico_City|7.4|major-city|65535
mx-culiacan|Culiacan|Sinaloa|Mexico|MX|NA|24.83|-107.38|America/Mazatlan|7.4|major-city|65535
mx-guadalajara|Guadalajara|Jalisco|Mexico|MX|NA|20.67|-103.33|America/Mexico_City|8|major-city|65535
mx-hermosillo|Hermosillo|Sonora|Mexico|MX|NA|29.0989|-110.9541|America/Hermosillo|7.4|major-city|65535
mx-leon|Leon|Guanajuato|Mexico|MX|NA|21.15|-101.7|America/Mexico_City|8|major-city|65535
mx-merida|Merida|Yucatán|Mexico|MX|NA|20.9666|-89.6166|America/Merida|5.4|historic|65535
mx-mexicali|Mexicali|Baja California|Mexico|MX|NA|32.65|-115.48|America/Tijuana|7.4|major-city|65535
mx-mexico-city|Mexico City|Distrito Federal|Mexico|MX|NA|19.4424|-99.131|America/Mexico_City|8.8|major-city|65535
mx-monterrey|Monterrey|Nuevo León|Mexico|MX|NA|25.67|-100.33|America/Monterrey|8|major-city|65535
mx-morelia|Morelia|Michoacán|Mexico|MX|NA|19.7334|-101.1895|America/Mexico_City|7.4|major-city|65535
mx-nezahualcoyotl|Nezahualcoyotl|México|Mexico|MX|NA|19.41|-99.03|America/Mexico_City|7.4|major-city|65535
mx-oaxaca|Oaxaca||Mexico|MX|NA|17.0827|-96.6699|America/Mexico_City|5.4|historic|65535
mx-puebla|Puebla||Mexico|MX|NA|19.05|-98.2|America/Mexico_City|8|major-city|65535
mx-puerto-vallarta|Puerto Vallarta|Jalisco|Mexico|MX|NA|20.6771|-105.245|America/Mexico_City|3.8|beach|61695
mx-queretaro|Queretaro|Querétaro|Mexico|MX|NA|20.63|-100.38|America/Mexico_City|7.4|major-city|65535
mx-saltillo|Saltillo|Coahuila|Mexico|MX|NA|25.42|-101.005|America/Monterrey|7.4|major-city|65535
mx-san-luis-potosi|San Luis Potosi|San Luis Potosí|Mexico|MX|NA|22.17|-101|America/Mexico_City|7.4|major-city|65535
mx-tampico|Tampico|Tamaulipas|Mexico|MX|NA|22.3|-97.87|America/Monterrey|7.4|major-city|65535
mx-tijuana|Tijuana|Baja California|Mexico|MX|NA|32.5|-117.08|America/Tijuana|8|major-city|33279
mx-toluca|Toluca|México|Mexico|MX|NA|19.3304|-99.67|America/Mexico_City|8|major-city|65535
mx-torreon|Torreon|Coahuila|Mexico|MX|NA|25.5701|-103.42|America/Monterrey|7.4|major-city|65535
mx-veracruz|Veracruz||Mexico|MX|NA|19.1773|-96.16|America/Mexico_City|7.4|major-city|65472
md-balti|Balti||Moldova|MD|EU|47.7591|27.9053|Europe/Chisinau|3.6|small-city|65535
md-cahul|Cahul||Moldova|MD|EU|45.9079|28.1944|Europe/Chisinau|2.8|small-city|65535
md-chisinau|Chisinau||Moldova|MD|EU|47.005|28.8577|Europe/Chisinau|6.4|capital|65535
md-tiraspol|Tiraspol|Bender|Moldova|MD|EU|46.8531|29.64|Europe/Chisinau|3.6|small-city|65535
mc-monaco|Monaco||Monaco|MC|EU|43.7396|7.4069|Europe/Paris|4.7|nightlife|63495
mn-darhan|Darhan|Selenge|Mongolia|MN|AS|49.6167|106.35|Asia/Ulaanbaatar|2.8|small-city|65535
mn-erdenet|Erdenet|Orhon|Mongolia|MN|AS|49.0533|104.1183|Asia/Ulaanbaatar|2.8|small-city|65535
mn-ulaanbaatar|Ulaanbaatar||Mongolia|MN|AS|47.9167|106.9166|Asia/Ulaanbaatar|6.4|capital|65535
me-podgorica|Podgorica||Montenegro|ME|EU|42.466|19.2663|Europe/Podgorica|6|capital|65535
ma-agadir|Agadir|Souss - Massa - Draâ|Morocco|MA|AF|30.44|-9.62|Africa/Casablanca|4.2|beach|57599
ma-casablanca|Casablanca|Grand Casablanca|Morocco|MA|AF|33.6|-7.6164|Africa/Casablanca|8.8|major-city|4088
ma-er-rachidia|Er Rachidia|Meknès - Tafilalet|Morocco|MA|AF|31.9404|-4.45|Africa/Casablanca|7|major-city|65535
ma-fez|Fez|Fès - Boulemane|Morocco|MA|AF|34.0546|-5.0004|Africa/Casablanca|7.4|major-city|65535
ma-kenitra|Kenitra|Gharb - Chrarda - Béni Hssen|Morocco|MA|AF|34.2704|-6.58|Africa/Casablanca|7.4|major-city|65535
ma-ksar-el-kebir|Ksar El Kebir|Tanger - Tétouan|Morocco|MA|AF|35.0204|-5.91|Africa/Casablanca|3.6|small-city|65535
ma-marrakesh|Marrakesh|Marrakech - Tensift - Al Haouz|Morocco|MA|AF|31.63|-8|Africa/Casablanca|5.4|historic|65535
ma-meknes|Meknes|Meknès - Tafilalet|Morocco|MA|AF|33.9004|-5.56|Africa/Casablanca|7.4|major-city|65535
ma-oujda|Oujda|Oriental|Morocco|MA|AF|34.69|-1.91|Africa/Casablanca|7.4|major-city|65535
ma-rabat|Rabat|Rabat - Salé - Zemmour - Zaer|Morocco|MA|AF|34.0253|-6.8361|Africa/Casablanca|7|capital|1020
ma-safi|Safi|Doukkala - Abda|Morocco|MA|AF|32.32|-9.24|Africa/Casablanca|4.2|beach|50175
ma-tangier|Tangier|Tanger - Tétouan|Morocco|MA|AF|35.7473|-5.8327|Africa/Casablanca|4.2|beach|65535
mz-beira|Beira|Sofala|Mozambique|MZ|AF|-19.82|34.87|Africa/Maputo|7.4|major-city|49183
mz-chimoio|Chimoio|Manica|Mozambique|MZ|AF|-19.12|33.47|Africa/Maputo|7|major-city|65535
mz-maputo|Maputo||Mozambique|MZ|AF|-25.9553|32.5892|Africa/Maputo|7|capital|57351
mz-matola|Matola|Maputo|Mozambique|MZ|AF|-25.9696|32.46|Africa/Maputo|4.2|beach|65423
mz-nampula|Nampula||Mozambique|MZ|AF|-15.136|39.293|Africa/Maputo|7.4|major-city|65535
mm-bago|Bago||Myanmar|MM|AS|17.32|96.515|Asia/Rangoon|7|major-city|65535
mm-mandalay|Mandalay||Myanmar|MM|AS|21.97|96.085|Asia/Rangoon|8|major-city|65535
mm-mawlamyine|Mawlamyine|Mon|Myanmar|MM|AS|16.5004|97.67|Asia/Rangoon|4.2|beach|2046
mm-myeik|Myeik|Tanintharyi|Myanmar|MM|AS|12.4541|98.6115|Asia/Rangoon|3.8|beach|510
mm-naypyidaw|Naypyidaw|Mandalay|Myanmar|MM|AS|19.7666|96.1186|Asia/Rangoon|7.4|major-city|65535
mm-rangoon|Rangoon|Yangon|Myanmar|MM|AS|16.7834|96.1667|Asia/Rangoon|5.6|beach|65423
na-rundu|Rundu|Kavango|Namibia|NA|AF|-17.92|19.7499|Africa/Windhoek|2.8|small-city|65535
na-walvis-bay|Walvis Bay|Erongo|Namibia|NA|AF|-22.9575|14.5053|Africa/Windhoek|3|beach|2046
na-windhoek|Windhoek|Khomas|Namibia|NA|AF|-22.57|17.0835|Africa/Windhoek|6|capital|65535
np-biratnagar|Biratnagar|Bhojpur|Nepal|NP|AS|26.4837|87.2833|Asia/Kathmandu|3.6|small-city|65535
np-birganj|Birganj|Narayani|Nepal|NP|AS|27.0004|84.8666|Asia/Kathmandu|3.6|small-city|65535
np-hetauda|Hetauda|Narayani|Nepal|NP|AS|27.4167|85.0334|Asia/Kathmandu|3.6|small-city|65535
np-kathmandu|Kathmandu|Bhaktapur|Nepal|NP|AS|27.7167|85.3166|Asia/Kathmandu|4.4|mountain|65535
np-lalitpur|Lalitpur|Bhaktapur|Nepal|NP|AS|27.6666|85.3333|Asia/Kathmandu|3.6|small-city|65535
np-pokhara|Pokhara|Gorkha|Nepal|NP|AS|28.264|83.972|Asia/Kathmandu|4|mountain|65535
nl-s-hertogenbosch|'s-Hertogenbosch|Noord-Brabant|Netherlands|NL|EU|51.6833|5.3167|Europe/Amsterdam|3.6|small-city|65535
nl-amsterdam|Amsterdam|Noord-Holland|Netherlands|NL|EU|52.35|4.9166|Europe/Amsterdam|5.9|nightlife|65527
nl-arnhem|Arnhem|Gelderland|Netherlands|NL|EU|51.988|5.923|Europe/Amsterdam|3.6|small-city|65535
nl-eindhoven|Eindhoven|Noord-Brabant|Netherlands|NL|EU|51.43|5.5|Europe/Amsterdam|7.4|major-city|65535
nl-groningen|Groningen||Netherlands|NL|EU|53.2204|6.58|Europe/Amsterdam|3.6|small-city|65535
nl-haarlem|Haarlem|Noord-Holland|Netherlands|NL|EU|52.3804|4.63|Europe/Amsterdam|7|major-city|36863
nl-leeuwarden|Leeuwarden|Friesland|Netherlands|NL|EU|53.2504|5.7834|Europe/Amsterdam|3.6|small-city|65535
nl-maastricht|Maastricht|Limburg|Netherlands|NL|EU|50.853|5.677|Europe/Amsterdam|3.6|small-city|65535
nl-rotterdam|Rotterdam|Zuid-Holland|Netherlands|NL|EU|51.92|4.48|Europe/Amsterdam|7.4|major-city|65535
nl-the-hague|The Hague|Zuid-Holland|Netherlands|NL|EU|52.08|4.27|Europe/Amsterdam|7.4|major-city|2044
nl-utrecht|Utrecht||Netherlands|NL|EU|52.1003|5.12|Europe/Amsterdam|4|small-city|65535
nl-zwolle|Zwolle|Overijssel|Netherlands|NL|EU|52.524|6.097|Europe/Amsterdam|3.6|small-city|65535
nc-noumea|Noumea|Sud|New Caledonia|NC|OC|-22.2625|166.4443|Pacific/Noumea|3.2|island|382
nz-auckland|Auckland||New Zealand|NZ|OC|-36.85|174.765|Pacific/Auckland|7.4|major-city|2016
nz-christchurch|Christchurch|Canterbury|New Zealand|NZ|OC|-43.535|172.63|Pacific/Auckland|3.6|small-city|65535
nz-dunedin|Dunedin|Otago|New Zealand|NZ|OC|-45.88|170.48|Pacific/Auckland|3.6|small-city|65535
nz-hamilton|Hamilton|Auckland|New Zealand|NZ|OC|-37.77|175.3|Pacific/Auckland|3.6|small-city|65535
nz-manukau|Manukau|Auckland|New Zealand|NZ|OC|-37|174.885|Pacific/Auckland|7.4|major-city|41086
nz-queenstown|Queenstown|Otago|New Zealand|NZ|OC|-45.03|168.6625|Pacific/Auckland|3.2|mountain|64543
nz-rotorua|Rotorua|Auckland|New Zealand|NZ|OC|-38.1346|176.2454|Pacific/Auckland|4.2|vacation|65504
nz-takapuna|Takapuna|Auckland|New Zealand|NZ|OC|-36.7913|174.7758|Pacific/Auckland|3.8|beach|60483
nz-tauranga|Tauranga|Bay of Plenty|New Zealand|NZ|OC|-37.6964|176.1536|Pacific/Auckland|3.8|beach|16364
nz-wellington|Wellington|Manawatu-Wanganui|New Zealand|NZ|OC|-41.3|174.7833|Pacific/Auckland|6|capital|64512
ni-chinandega|Chinandega||Nicaragua|NI|NA|12.6304|-87.13|America/Managua|3.6|small-city|65535
ni-granada|Granada||Nicaragua|NI|NA|11.9337|-85.95|America/Managua|5|historic|65473
ni-leon|Leon|León|Nicaragua|NI|NA|12.4356|-86.8794|America/Managua|3.6|small-city|65535
ni-managua|Managua||Nicaragua|NI|NA|12.153|-86.2685|America/Managua|6.4|capital|8176
ni-masaya|Masaya||Nicaragua|NI|NA|11.969|-86.095|America/Managua|3.6|small-city|65535
ne-agadez|Agadez||Niger|NE|AF|16.9959|7.9828|Africa/Niamey|3.6|small-city|65535
ne-maradi|Maradi||Niger|NE|AF|13.4916|7.0964|Africa/Niamey|3.6|small-city|65535
ne-niamey|Niamey||Niger|NE|AF|13.5167|2.1167|Africa/Niamey|6.4|capital|65535
ne-zinder|Zinder||Niger|NE|AF|13.8|8.9833|Africa/Niamey|3.6|small-city|65535
ng-aba|Aba|Abia|Nigeria|NG|AF|5.1004|7.35|Africa/Lagos|7.4|major-city|65535
ng-abuja|Abuja|Federal Capital Territory|Nigeria|NG|AF|9.0833|7.5333|Africa/Lagos|6.4|capital|65535
ng-benin-city|Benin City|Edo|Nigeria|NG|AF|6.3405|5.62|Africa/Lagos|7.4|major-city|65535
ng-ibadan|Ibadan|Oyo|Nigeria|NG|AF|7.38|3.93|Africa/Lagos|8|major-city|65535
ng-ikare|Ikare|Ondo|Nigeria|NG|AF|7.5304|5.76|Africa/Lagos|7.4|major-city|65535
ng-jos|Jos|Plateau|Nigeria|NG|AF|9.93|8.89|Africa/Lagos|7.4|major-city|65535
ng-kaduna|Kaduna||Nigeria|NG|AF|10.52|7.44|Africa/Lagos|8|major-city|65535
ng-kano|Kano||Nigeria|NG|AF|12|8.52|Africa/Lagos|8.8|major-city|65535
ng-lagos|Lagos||Nigeria|NG|AF|6.4433|3.3915|Africa/Lagos|8.8|major-city|63520
ng-maiduguri|Maiduguri|Borno|Nigeria|NG|AF|11.85|13.16|Africa/Lagos|7.4|major-city|65535
ng-port-harcourt|Port Harcourt|Rivers|Nigeria|NG|AF|4.81|7.01|Africa/Lagos|8|major-city|65535
ng-zaria|Zaria|Kaduna|Nigeria|NG|AF|11.08|7.71|Africa/Lagos|7.4|major-city|65535
mk-bitola|Bitola||North Macedonia|MK|EU|41.0391|21.3395|Europe/Skopje|2.8|small-city|65535
mk-skopje|Skopje|Centar|North Macedonia|MK|EU|42|21.4335|Europe/Skopje|6.4|capital|65535
mk-tetovo|Tetovo||North Macedonia|MK|EU|42.0092|20.9701|Europe/Skopje|3.6|small-city|65535
no-b-rum|Bærum|Akershus|Norway|NO|EU|59.9135|11.3472|Europe/Oslo|3.6|small-city|65535
no-bergen|Bergen|Hordaland|Norway|NO|EU|60.391|5.3245|Europe/Oslo|3.6|small-city|53247
no-drammen|Drammen|Buskerud|Norway|NO|EU|59.7572|10.1907|Europe/Oslo|3.6|small-city|65471
no-kristiansand|Kristiansand|Vest-Agder|Norway|NO|EU|58.1666|8|Europe/Oslo|3|beach|65027
no-oslo|Oslo||Norway|NO|EU|59.9167|10.75|Europe/Oslo|6.4|capital|63743
no-sandnes|Sandnes|Rogaland|Norway|NO|EU|58.8454|5.69|Europe/Oslo|3|beach|65535
no-skien|Skien|Telemark|Norway|NO|EU|59.2|9.6|Europe/Oslo|2.8|small-city|65535
no-stavanger|Stavanger|Rogaland|Norway|NO|EU|58.97|5.68|Europe/Oslo|3.8|beach|32512
no-troms|Tromsø|Troms|Norway|NO|EU|69.6351|18.992|Europe/Oslo|3|beach|1020
no-trondheim|Trondheim|Sør-Trøndelag|Norway|NO|EU|63.4167|10.4167|Europe/Oslo|3.8|beach|32767
om-as-sib|As Sib|Muscat|Oman|OM|AS|23.6802|58.1825|Asia/Muscat|3.8|beach|16368
om-ibri|Ibri|Al Dhahira|Oman|OM|AS|23.2254|56.517|Asia/Muscat|3.6|small-city|65535
om-muscat|Muscat||Oman|OM|AS|23.6133|58.5933|Asia/Muscat|6.4|capital|16320
om-nizwa|Nizwa|Ad Dakhliyah|Oman|OM|AS|22.9264|57.5314|Asia/Muscat|2.8|small-city|65535
om-salalah|Salalah|Dhofar|Oman|OM|AS|17.0255|54.0852|Asia/Muscat|3.8|beach|63551
om-suhar|Suhar|Al Batnah|Oman|OM|AS|24.362|56.7344|Asia/Muscat|3.8|beach|65472
pk-abbottabad|Abbottabad|N.W.F.P.|Pakistan|PK|AS|34.1495|73.1995|Asia/Karachi|8|major-city|65535
pk-faisalabad|Faisalabad|Punjab|Pakistan|PK|AS|31.41|73.11|Asia/Karachi|8|major-city|65535
pk-gujranwala|Gujranwala|Punjab|Pakistan|PK|AS|32.1604|74.185|Asia/Karachi|8|major-city|65535
pk-hyderabad|Hyderabad|Sind|Pakistan|PK|AS|25.38|68.375|Asia/Karachi|8|major-city|65535
pk-islamabad|Islamabad|F.C.T.|Pakistan|PK|AS|33.7|73.1666|Asia/Karachi|6.4|capital|65535
pk-karachi|Karachi|Sind|Pakistan|PK|AS|24.87|66.99|Asia/Karachi|8.8|major-city|63615
pk-lahore|Lahore|Punjab|Pakistan|PK|AS|31.56|74.35|Asia/Karachi|8.8|major-city|65535
pk-multan|Multan|Punjab|Pakistan|PK|AS|30.2|71.455|Asia/Karachi|8|major-city|65535
pk-peshawar|Peshawar|N.W.F.P.|Pakistan|PK|AS|34.005|71.535|Asia/Karachi|8|major-city|65535
pk-quetta|Quetta|Baluchistan|Pakistan|PK|AS|30.22|67.025|Asia/Karachi|7.4|major-city|65535
pk-rawalpindi|Rawalpindi|Punjab|Pakistan|PK|AS|33.6|73.04|Asia/Karachi|8|major-city|65535
pk-saidu|Saidu|N.W.F.P.|Pakistan|PK|AS|34.75|72.35|Asia/Karachi|8|major-city|65535
ps-al-khalil|Al Khalil||Palestine|PS|AS|31.5406|35.0956|Asia/Hebron|7|major-city|65535
ps-gaza|Gaza||Palestine|PS|AS|31.53|34.445|Asia/Gaza|4.2|beach|2044
ps-nablus|Nablus||Palestine|PS|AS|32.2215|35.2544|Asia/Hebron|3.6|small-city|65535
pa-balboa|Balboa||Panama|PA|NA|8.95|-79.5667|America/Panama|3|beach|65343
pa-chitre|Chitre|Herrera|Panama|PA|NA|7.97|-80.42|America/Panama|2.8|small-city|65535
pa-colon|Colon|Colón|Panama|PA|NA|9.365|-79.875|America/Panama|3.8|beach|510
pa-david|David|Chiriquí|Panama|PA|NA|8.4333|-82.4333|America/Panama|3.6|small-city|65535
pa-panama-city|Panama City||Panama|PA|NA|8.968|-79.533|America/Panama|7.4|major-city|62471
pa-santiago|Santiago|Veraguas|Panama|PA|NA|8.1004|-80.9833|America/Panama|2.8|small-city|65535
pg-lae|Lae|Morobe|Papua New Guinea|PG|OC|-6.733|146.99|Pacific/Port_Moresby|3.8|beach|63519
pg-madang|Madang||Papua New Guinea|PG|OC|-5.2248|145.7853|Pacific/Port_Moresby|3|beach|65025
pg-mt-hagen|Mt. Hagen|Western Highlands|Papua New Guinea|PG|OC|-5.8632|144.2168|Pacific/Port_Moresby|2.8|small-city|65535
pg-port-moresby|Port Moresby|Central|Papua New Guinea|PG|OC|-9.4647|147.1925|Pacific/Port_Moresby|3.4|tropical|65535
py-asuncion|Asuncion|Asunción|Paraguay|PY|SA|-25.2964|-57.6415|America/Asuncion|6.4|capital|65535
py-ciudad-del-este|Ciudad del Este|Alto Paraná|Paraguay|PY|SA|-25.5167|-54.6161|America/Asuncion|7.4|major-city|65535
py-encarnacion|Encarnacion|Itapúa|Paraguay|PY|SA|-27.3472|-55.8739|America/Asuncion|7|major-city|65535
py-san-lorenzo|San Lorenzo|Asunción|Paraguay|PY|SA|-25.34|-57.52|America/Asuncion|7.4|major-city|65535
pe-arequipa|Arequipa||Peru|PE|SA|-16.42|-71.53|America/Lima|5.4|historic|65535
pe-callao|Callao|Lima|Peru|PE|SA|-12.07|-77.135|America/Lima|4.2|beach|36927
pe-chiclayo|Chiclayo|Lambayeque|Peru|PE|SA|-6.7629|-79.8366|America/Lima|7.4|major-city|65535
pe-chimbote|Chimbote|Ancash|Peru|PE|SA|-9.07|-78.57|America/Lima|4.2|beach|61695
pe-cusco|Cusco||Peru|PE|SA|-13.525|-71.9722|America/Lima|5.4|historic|65535
pe-huancayo|Huancayo|Junín|Peru|PE|SA|-12.08|-75.2|America/Lima|7.4|major-city|65535
pe-iquitos|Iquitos|Loreto|Peru|PE|SA|-3.75|-73.25|America/Lima|7.4|major-city|65535
pe-lima|Lima||Peru|PE|SA|-12.048|-77.0501|America/Lima|7.8|capital|63999
pe-piura|Piura||Peru|PE|SA|-5.21|-80.63|America/Lima|7.4|major-city|65535
pe-trujillo|Trujillo|La Libertad|Peru|PE|SA|-8.12|-79.02|America/Lima|7.4|major-city|61695
ph-bacolod|Bacolod|Negros Occidental|Philippines|PH|AS|10.6317|122.9817|Asia/Manila|7.4|major-city|36863
ph-baguio-city|Baguio City|Benguet|Philippines|PH|AS|16.43|120.5699|Asia/Manila|7.4|major-city|65535
ph-batangas|Batangas||Philippines|PH|AS|13.7817|121.0217|Asia/Manila|4.2|beach|57471
ph-cagayan-de-oro|Cagayan de Oro|Misamis Oriental|Philippines|PH|AS|8.4508|124.6853|Asia/Manila|4.2|beach|4088
ph-cebu|Cebu||Philippines|PH|AS|10.32|123.9001|Asia/Manila|3.6|island|65087
ph-davao|Davao|Davao Del Sur|Philippines|PH|AS|7.11|125.63|Asia/Manila|4.8|beach|65027
ph-general-santos|General Santos|South Cotabato|Philippines|PH|AS|6.1108|125.1747|Asia/Manila|4.2|beach|61503
ph-iligan|Iligan|Lanao del Norte|Philippines|PH|AS|8.1712|124.2154|Asia/Manila|4.2|beach|16382
ph-iloilo|Iloilo||Philippines|PH|AS|10.705|122.545|Asia/Manila|4.2|beach|63519
ph-manila|Manila|Metropolitan Manila|Philippines|PH|AS|14.6042|120.9822|Asia/Manila|8.8|major-city|33023
ph-naga|Naga|Camarines Sur|Philippines|PH|AS|13.6192|123.1814|Asia/Manila|7.4|major-city|65535
ph-pasay-city|Pasay City|Metropolitan Manila|Philippines|PH|AS|14.5504|121|Asia/Manila|4.2|beach|50175
ph-quezon-city|Quezon City|Metropolitan Manila|Philippines|PH|AS|14.6504|121.03|Asia/Manila|8|major-city|65535
ph-zamboanga|Zamboanga|Zamboanga del Sur|Philippines|PH|AS|6.92|122.08|Asia/Manila|4.2|beach|61503
pl-bydgoszcz|Bydgoszcz|Kuyavian-Pomeranian|Poland|PL|EU|53.1204|18.01|Europe/Warsaw|7.4|major-city|65535
pl-bytom|Bytom|Silesian|Poland|PL|EU|50.35|18.91|Europe/Warsaw|7.4|major-city|65535
pl-gdansk|Gdansk|Pomeranian|Poland|PL|EU|54.36|18.64|Europe/Warsaw|5.4|historic|65535
pl-gliwice|Gliwice|Silesian|Poland|PL|EU|50.3304|18.67|Europe/Warsaw|7.4|major-city|65535
pl-katowice|Katowice|Silesian|Poland|PL|EU|50.2604|19.02|Europe/Warsaw|8|major-city|65535
pl-krakow|Kraków|Lesser Poland|Poland|PL|EU|50.06|19.96|Europe/Warsaw|7.4|major-city|65535
pl-lodz|Lódz||Poland|PL|EU|51.775|19.4514|Europe/Warsaw|7.4|major-city|65535
pl-lublin|Lublin||Poland|PL|EU|51.2504|22.5727|Europe/Warsaw|7.4|major-city|65535
pl-poznan|Poznan|Greater Poland|Poland|PL|EU|52.4058|16.8999|Europe/Warsaw|7.4|major-city|65535
pl-szczecin|Szczecin|West Pomeranian|Poland|PL|EU|53.4204|14.53|Europe/Warsaw|7.4|major-city|65511
pl-warsaw|Warsaw|Masovian|Poland|PL|EU|52.25|21|Europe/Warsaw|7|capital|65535
pl-wroclaw|Wroclaw|Lower Silesian|Poland|PL|EU|51.1104|17.03|Europe/Warsaw|7.4|major-city|65535
pt-aveiro|Aveiro||Portugal|PT|EU|40.641|-8.651|Europe/Lisbon|3|beach|65535
pt-braga|Braga||Portugal|PT|EU|41.555|-8.4213|Europe/Lisbon|7.4|major-city|65535
pt-coimbra|Coimbra||Portugal|PT|EU|40.2004|-8.4167|Europe/Lisbon|3.6|small-city|65535
pt-evora|Evora|Évora|Portugal|PT|EU|38.56|-7.906|Europe/Lisbon|2.8|small-city|65535
pt-faro|Faro||Portugal|PT|EU|37.0171|-7.9333|Europe/Lisbon|3|beach|61471
pt-funchal|Funchal|Madeira|Portugal|PT|EU|32.65|-16.88|Atlantic/Madeira|3.2|island|61471
pt-leiria|Leiria||Portugal|PT|EU|39.739|-8.805|Europe/Lisbon|2.8|small-city|65535
pt-lisbon|Lisbon|Lisboa|Portugal|PT|EU|38.7227|-9.1449|Europe/Lisbon|7|capital|63491
pt-ponta-delgada|Ponta Delgada|Azores|Portugal|PT|EU|37.7483|-25.6666|Atlantic/Azores|2.4|island|61471
pt-portimao|Portimao|Faro|Portugal|PT|EU|37.1337|-8.5333|Europe/Lisbon|3|beach|63615
pt-porto|Porto||Portugal|PT|EU|41.15|-8.62|Europe/Lisbon|5.4|historic|59391
pt-setubal|Setubal|Lisboa|Portugal|PT|EU|38.53|-8.9|Europe/Lisbon|3.8|beach|63615
pr-arecibo|Arecibo||Puerto Rico|PR|NA|18.44|-66.73|America/Puerto_Rico|2.8|small-city|65535
pr-mayaguez|Mayaguez||Puerto Rico|PR|NA|18.2015|-67.1397|America/Puerto_Rico|3.8|beach|51199
pr-ponce|Ponce||Puerto Rico|PR|NA|18.0004|-66.6166|America/Puerto_Rico|3.8|beach|63999
pr-san-juan|San Juan||Puerto Rico|PR|NA|18.44|-66.13|America/Puerto_Rico|4.2|island|16320
qa-doha|Doha|Ad Dawhah|Qatar|QA|AS|25.2866|51.533|Asia/Qatar|8|major-city|32704
cg-brazzaville|Brazzaville|Pool|Republic of the Congo|CG|AF|-4.2592|15.2847|Africa/Brazzaville|7|capital|65535
cg-kayes|Kayes|Bouenza|Republic of the Congo|CG|AF|-4.18|13.28|Africa/Brazzaville|2.8|small-city|65535
cg-loubomo|Loubomo|Niari|Republic of the Congo|CG|AF|-4.1796|12.67|Africa/Brazzaville|3.6|small-city|65535
cg-pointe-noire|Pointe-Noire|Kouilou|Republic of the Congo|CG|AF|-4.77|11.88|Africa/Brazzaville|4.2|beach|51199
ro-brasov|Brasov||Romania|RO|EU|45.6475|25.6072|Europe/Bucharest|7|major-city|65535
ro-bucharest|Bucharest||Romania|RO|EU|44.4334|26.0999|Europe/Bucharest|7|capital|65535
ro-cluj-napoca|Cluj-Napoca|Cluj|Romania|RO|EU|46.7884|23.5984|Europe/Bucharest|7|major-city|65535
ro-constanta|Constanta||Romania|RO|EU|44.2027|28.61|Europe/Bucharest|7|major-city|65281
ro-craiova|Craiova|Dolj|Romania|RO|EU|44.3263|23.8259|Europe/Bucharest|7.4|major-city|65535
ro-galati|Galati||Romania|RO|EU|45.4559|28.0459|Europe/Bucharest|7.4|major-city|65535
ro-iasi|Iasi||Romania|RO|EU|47.1683|27.5749|Europe/Bucharest|7.4|major-city|65535
ro-timisoara|Timisoara|Timis|Romania|RO|EU|45.7588|21.2234|Europe/Bucharest|7.4|major-city|65535
ru-chelyabinsk|Chelyabinsk||Russia|RU|EU|55.155|61.4387|Asia/Yekaterinburg|8|major-city|65535
ru-irkutsk|Irkutsk||Russia|RU|EU|52.32|104.245|Asia/Irkutsk|7.4|major-city|65535
ru-izhevsk|Izhevsk|Udmurt|Russia|RU|EU|56.85|53.23|Europe/Samara|7.4|major-city|65535
ru-kazan|Kazan|Tatarstan|Russia|RU|EU|55.7499|49.1263|Europe/Moscow|8|major-city|65535
ru-krasnodar|Krasnodar||Russia|RU|EU|45.02|39|Europe/Moscow|7.4|major-city|65535
ru-krasnoyarsk|Krasnoyarsk||Russia|RU|EU|56.014|92.866|Asia/Krasnoyarsk|7.4|major-city|65535
ru-moscow|Moscow|Moskva|Russia|RU|EU|55.7522|37.6155|Europe/Moscow|7.8|capital|65535
ru-nizhny-novgorod|Nizhny Novgorod|Nizhegorod|Russia|RU|EU|56.333|44.0001|Europe/Moscow|8|major-city|65535
ru-novosibirsk|Novosibirsk||Russia|RU|EU|55.03|82.96|Asia/Novosibirsk|8|major-city|65535
ru-omsk|Omsk||Russia|RU|EU|54.99|73.4|Asia/Omsk|8|major-city|65535
ru-rostov|Rostov||Russia|RU|EU|47.2346|39.7127|Europe/Moscow|8|major-city|65535
ru-samara|Samara||Russia|RU|EU|53.195|50.1513|Europe/Samara|7.4|major-city|65535
ru-saratov|Saratov||Russia|RU|EU|51.58|46.03|Europe/Saratov|7.4|major-city|65055
ru-st-petersburg|St. Petersburg|City of St. Petersburg|Russia|RU|EU|59.939|30.316|Europe/Moscow|8.8|major-city|34815
ru-tolyatti|Tolyatti|Samara|Russia|RU|EU|53.4804|49.53|Europe/Samara|4.2|beach|49167
ru-ufa|Ufa|Bashkortostan|Russia|RU|EU|54.79|56.04|Asia/Yekaterinburg|7.4|major-city|65535
ru-ulyanovsk|Ulyanovsk|Ul'yanovsk|Russia|RU|EU|54.33|48.41|Europe/Ulyanovsk|4.2|beach|65025
ru-vladivostok|Vladivostok|Primor'ye|Russia|RU|EU|43.13|131.91|Asia/Vladivostok|4.2|beach|3199
ru-volgograd|Volgograd||Russia|RU|EU|48.71|44.5|Europe/Volgograd|7.4|major-city|65535
ru-voronezh|Voronezh||Russia|RU|EU|51.73|39.27|Europe/Moscow|7.4|major-city|65535
ru-yaroslavl|Yaroslavl|Yaroslavl'|Russia|RU|EU|57.62|39.87|Europe/Moscow|7.4|major-city|65535
ru-yekaterinburg|Yekaterinburg|Sverdlovsk|Russia|RU|EU|56.85|60.6|Asia/Yekaterinburg|8|major-city|65535
rw-gitarama|Gitarama|Southern|Rwanda|RW|AF|-2.0696|29.76|Africa/Kigali|3.6|small-city|65535
rw-kigali|Kigali|Kigali City|Rwanda|RW|AF|-1.9536|30.0605|Africa/Kigali|6.4|capital|65535
rw-nyanza|Nyanza|Southern|Rwanda|RW|AF|-2.3496|29.74|Africa/Kigali|7|major-city|65535
rw-ruhengeri|Ruhengeri|Northern|Rwanda|RW|AF|-1.4996|29.63|Africa/Kigali|3.6|small-city|65535
lc-castries|Castries||Saint Lucia|LC|NA|14.002|-61|America/St_Lucia|2.4|island|4095
ws-apia|Apia||Samoa|WS|OC|-13.8415|-171.7386|Pacific/Apia|2.4|island|16352
st-sao-tome|Sao Tome||Sao Tome and Principe|ST|AF|0.3334|6.7333|Africa/Sao_Tome|5.2|capital|65408
sa-ad-damman|Ad Damman|Ash Sharqiyah|Saudi Arabia|SA|AS|26.4282|50.0997|Asia/Riyadh|4.8|beach|32752
sa-al-hillah|Al Hillah|Ar Riyad|Saudi Arabia|SA|AS|23.4895|46.7564|Asia/Riyadh|7.4|major-city|65535
sa-al-hufuf|Al Hufuf|Ash Sharqiyah|Saudi Arabia|SA|AS|25.3487|49.5856|Asia/Riyadh|7.4|major-city|65535
sa-at-taif|At Taif|Makkah|Saudi Arabia|SA|AS|21.2622|40.3823|Asia/Riyadh|7.4|major-city|65535
sa-buraydah|Buraydah|Al Quassim|Saudi Arabia|SA|AS|26.3664|43.9628|Asia/Riyadh|7.4|major-city|65535
sa-jeddah|Jeddah|Makkah|Saudi Arabia|SA|AS|21.5169|39.2192|Asia/Riyadh|8|major-city|59391
sa-makkah|Makkah||Saudi Arabia|SA|AS|21.43|39.82|Asia/Riyadh|8|major-city|65535
sa-medina|Medina|Al Madinah|Saudi Arabia|SA|AS|24.5|39.58|Asia/Riyadh|8|major-city|65535
sa-riyadh|Riyadh|Ar Riyad|Saudi Arabia|SA|AS|24.6408|46.7727|Asia/Riyadh|7.8|capital|65535
sa-tabuk|Tabuk||Saudi Arabia|SA|AS|28.3838|36.555|Asia/Riyadh|7.4|major-city|65535
sn-dakar|Dakar||Senegal|SN|AF|14.7158|-17.4731|Africa/Dakar|5.46|capital|49391
sn-diourbel|Diourbel||Senegal|SN|AF|14.6604|-16.24|Africa/Dakar|3.6|small-city|65535
sn-kaolack|Kaolack||Senegal|SN|AF|14.15|-16.1|Africa/Dakar|7|major-city|65535
sn-thies|Thies|Thiès|Senegal|SN|AF|14.8104|-16.93|Africa/Dakar|7|major-city|65535
sn-ziguinchor|Ziguinchor||Senegal|SN|AF|12.59|-16.29|Africa/Dakar|3.8|beach|4064
rs-belgrade|Belgrade|Grad Beograd|Serbia|RS|EU|44.8186|20.468|Europe/Belgrade|7|capital|65535
rs-kragujevac|Kragujevac|Šumadijski|Serbia|RS|EU|44.02|20.92|Europe/Belgrade|3.6|small-city|65535
rs-nis|Nis|Nišavski|Serbia|RS|EU|43.3304|21.9|Europe/Belgrade|7|major-city|65535
rs-novi-sad|Novi Sad|Južno-Backi|Serbia|RS|EU|45.2504|19.8499|Europe/Belgrade|7|major-city|65535
rs-pec|Pec|Moravicki|Serbia|RS|EU|43.8897|20.3301|Europe/Belgrade|3.6|small-city|65535
rs-subotica|Subotica|Severno-Backi|Serbia|RS|EU|46.07|19.68|Europe/Belgrade|3.6|small-city|65535
sc-victoria|Victoria||Seychelles|SC|AF|-4.6166|55.45|Indian/Mahe|2.4|island|65475
sl-bo|Bo|Southern|Sierra Leone|SL|AF|7.97|-11.74|Africa/Freetown|3.6|small-city|65535
sl-freetown|Freetown|Western|Sierra Leone|SL|AF|8.47|-13.2342|Africa/Freetown|6.4|capital|2032
sl-kenema|Kenema|Eastern|Sierra Leone|SL|AF|7.8804|-11.19|Africa/Freetown|3.6|small-city|65535
sl-makeni|Makeni|Northern|Sierra Leone|SL|AF|8.8804|-12.05|Africa/Freetown|3.6|small-city|65535
sg-singapore|Singapore||Singapore|SG|AS|1.293|103.8558|Asia/Singapore|8.8|major-city|61455
sk-banska-bystrica|Banska Bystrica|Banskobystrický|Slovakia|SK|EU|48.7333|19.15|Europe/Bratislava|3.6|small-city|65535
sk-bratislava|Bratislava|Bratislavský|Slovakia|SK|EU|48.15|17.117|Europe/Bratislava|6.4|capital|65535
sk-kosice|Kosice|Košický|Slovakia|SK|EU|48.7304|21.25|Europe/Bratislava|3.6|small-city|65535
sk-presov|Presov|Prešov|Slovakia|SK|EU|48.9997|21.2394|Europe/Bratislava|3.6|small-city|65535
sk-zilina|Zilina|Žilinský|Slovakia|SK|EU|49.2198|18.7494|Europe/Bratislava|3.6|small-city|65535
si-ljubljana|Ljubljana|Osrednjeslovenska|Slovenia|SI|EU|46.0553|14.515|Europe/Ljubljana|6|capital|65535
si-maribor|Maribor||Slovenia|SI|EU|46.5405|15.65|Europe/Ljubljana|3.6|small-city|65535
sb-honiara|Honiara|Guadalcanal|Solomon Islands|SB|OC|-9.438|159.9498|Pacific/Guadalcanal|2.4|island|16368
za-benoni|Benoni|Gauteng|South Africa|ZA|AF|-26.1496|28.3299|Africa/Johannesburg|8|major-city|65535
za-bloemfontein|Bloemfontein|Orange Free State|South Africa|ZA|AF|-29.12|26.2299|Africa/Johannesburg|7.4|major-city|65535
za-cape-town|Cape Town|Western Cape|South Africa|ZA|AF|-33.92|18.435|Africa/Johannesburg|8|major-city|2040
za-durban|Durban|KwaZulu-Natal|South Africa|ZA|AF|-29.865|30.98|Africa/Johannesburg|4.8|beach|65439
za-east-london|East London|Eastern Cape|South Africa|ZA|AF|-32.97|27.87|Africa/Johannesburg|7.4|major-city|65439
za-johannesburg|Johannesburg|Gauteng|South Africa|ZA|AF|-26.17|28.03|Africa/Johannesburg|8|major-city|65535
za-pietermaritzburg|Pietermaritzburg|KwaZulu-Natal|South Africa|ZA|AF|-29.61|30.39|Africa/Johannesburg|7.4|major-city|65535
za-port-elizabeth|Port Elizabeth|Eastern Cape|South Africa|ZA|AF|-33.97|25.6|Africa/Johannesburg|4.2|beach|65521
za-pretoria|Pretoria|Gauteng|South Africa|ZA|AF|-25.7069|28.2294|Africa/Johannesburg|7|capital|65535
za-uitenhage|Uitenhage|Eastern Cape|South Africa|ZA|AF|-33.7596|25.39|Africa/Johannesburg|3.6|small-city|65535
za-vereeniging|Vereeniging|Gauteng|South Africa|ZA|AF|-26.6496|27.96|Africa/Johannesburg|7.4|major-city|65535
za-welkom|Welkom|Orange Free State|South Africa|ZA|AF|-27.97|26.73|Africa/Johannesburg|7|major-city|65535
kr-busan|Busan||South Korea|KR|AS|35.0951|129.01|Asia/Seoul|5.6|beach|52231
kr-changwon|Changwon|Gyeongsangnam-do|South Korea|KR|AS|35.2191|128.5836|Asia/Seoul|8|major-city|65087
kr-cheongju|Cheongju|Chungcheongbuk-do|South Korea|KR|AS|36.6439|127.5012|Asia/Seoul|7.4|major-city|65535
kr-daegu|Daegu|Taegu-gwangyoksi|South Korea|KR|AS|35.8668|128.607|Asia/Seoul|8|major-city|65535
kr-daejeon|Daejeon||South Korea|KR|AS|36.3355|127.425|Asia/Seoul|8|major-city|65535
kr-goyang|Goyang|Gyeonggi-do|South Korea|KR|AS|37.6527|126.8372|Asia/Seoul|7.4|major-city|65535
kr-gwangju|Gwangju|Kwangju-gwangyoksi|South Korea|KR|AS|35.171|126.9104|Asia/Seoul|8|major-city|65535
kr-incheon|Incheon|Inch'on-gwangyoksi|South Korea|KR|AS|37.4761|126.6422|Asia/Seoul|8|major-city|33279
kr-jeju|Jeju||South Korea|KR|AS|33.5101|126.5219|Asia/Seoul|3.6|island|8184
kr-puch-on|Puch'on|Gyeonggi-do|South Korea|KR|AS|37.4989|126.7831|Asia/Seoul|7.4|major-city|65535
kr-seoul|Seoul||South Korea|KR|AS|37.5663|126.9997|Asia/Seoul|8.8|major-city|65535
kr-songnam|Songnam|Gyeonggi-do|South Korea|KR|AS|37.4386|127.1378|Asia/Seoul|7.4|major-city|65535
kr-suwon|Suwon|Gyeonggi-do|South Korea|KR|AS|37.2578|127.0109|Asia/Seoul|8|major-city|65535
kr-ulsan|Ulsan||South Korea|KR|AS|35.5467|129.317|Asia/Seoul|8|major-city|65503
es-alicante|Alicante|Comunidad Valenciana|Spain|ES|EU|38.3512|-0.4836|Europe/Madrid|3.8|beach|63495
es-barcelona|Barcelona|Cataluña|Spain|ES|EU|41.3833|2.1834|Europe/Madrid|7.3|nightlife|65031
es-bilbao|Bilbao|País Vasco|Spain|ES|EU|43.25|-2.93|Europe/Madrid|4|small-city|65535
es-cartagena|Cartagena|Región de Murcia|Spain|ES|EU|37.6004|-0.98|Europe/Madrid|3.8|beach|63615
es-castello|Castello|Comunidad Valenciana|Spain|ES|EU|39.9704|-0.05|Europe/Madrid|3.6|small-city|65535
es-cordoba|Cordoba|Andalucía|Spain|ES|EU|37.88|-4.77|Europe/Madrid|7.4|major-city|65535
es-gijon|Gijon|Principado de Asturias|Spain|ES|EU|43.53|-5.67|Europe/Madrid|4.2|beach|65528
es-granada|Granada|Andalucía|Spain|ES|EU|37.165|-3.585|Europe/Madrid|5.4|historic|65535
es-la-coruna|La Coruña|Galicia|Spain|ES|EU|43.33|-8.42|Europe/Madrid|7.4|major-city|4088
es-las-palmas|Las Palmas||Spain|ES|EU|28.1|-15.43|Atlantic/Canary|3.6|island|65411
es-madrid|Madrid|Comunidad de Madrid|Spain|ES|EU|40.4|-3.6834|Europe/Madrid|7|capital|65535
es-malaga|Malaga|Andalucía|Spain|ES|EU|36.7204|-4.42|Europe/Madrid|4.2|beach|64527
es-murcia|Murcia|Región de Murcia|Spain|ES|EU|37.98|-1.13|Europe/Madrid|7.4|major-city|65535
es-oviedo|Oviedo|Principado de Asturias|Spain|ES|EU|43.3505|-5.83|Europe/Madrid|7|major-city|65535
es-palma|Palma|Islas Baleares|Spain|ES|EU|39.5743|2.6542|Europe/Madrid|3.6|island|63551
es-pamplona|Pamplona|Comunidad Foral de Navarra|Spain|ES|EU|42.82|-1.65|Europe/Madrid|7|major-city|65535
es-salamanca|Salamanca|Castilla y León|Spain|ES|EU|40.9704|-5.67|Europe/Madrid|3.6|small-city|65535
es-san-sebastian|San Sebastián|País Vasco|Spain|ES|EU|43.3204|-1.98|Europe/Madrid|3.8|beach|4088
es-santa-cruz-de-tenerife|Santa Cruz de Tenerife||Spain|ES|EU|28.47|-16.25|Atlantic/Canary|3.8|beach|64515
es-santander|Santander|Cantabria|Spain|ES|EU|43.3805|-3.8|Europe/Madrid|3.6|small-city|65535
es-seville|Seville|Andalucía|Spain|ES|EU|37.405|-5.98|Europe/Madrid|5.4|historic|65535
es-valencia|Valencia|Comunidad Valenciana|Spain|ES|EU|39.485|-0.4|Europe/Madrid|4.2|beach|65535
es-valladolid|Valladolid|Castilla y León|Spain|ES|EU|41.65|-4.75|Europe/Madrid|7|major-city|65535
es-vigo|Vigo|Galicia|Spain|ES|EU|42.22|-8.73|Europe/Madrid|4.2|beach|4094
es-vitoria|Vitoria|País Vasco|Spain|ES|EU|42.85|-2.67|Europe/Madrid|3.6|small-city|65535
es-zaragoza|Zaragoza|Aragón|Spain|ES|EU|41.65|-0.89|Europe/Madrid|7.4|major-city|65535
lk-batticaloa|Batticaloa||Sri Lanka|LK|AS|7.717|81.7|Asia/Colombo|2.28|beach|61441
lk-colombo|Colombo||Sri Lanka|LK|AS|6.932|79.8578|Asia/Colombo|6|capital|510
lk-galle|Galle||Sri Lanka|LK|AS|6.03|80.24|Asia/Colombo|3.8|beach|57471
lk-jaffna|Jaffna||Sri Lanka|LK|AS|9.675|80.005|Asia/Colombo|3.8|beach|57407
lk-kandy|Kandy||Sri Lanka|LK|AS|7.28|80.67|Asia/Colombo|5|historic|32719
lk-moratuwa|Moratuwa|Colombo|Sri Lanka|LK|AS|6.7804|79.88|Asia/Colombo|3.8|beach|33023
lk-sri-jawewardenepura-kotte|Sri Jawewardenepura Kotte|Colombo|Sri Lanka|LK|AS|6.9|79.95|Asia/Colombo|3.6|small-city|65535
lk-trincomalee|Trincomalee||Sri Lanka|LK|AS|8.569|81.233|Asia/Colombo|2.28|beach|57793
sr-paramaribo|Paramaribo||Suriname|SR|SA|5.835|-55.167|America/Paramaribo|6|capital|65519
se-goteborg|Göteborg|Västra Götaland|Sweden|SE|EU|57.75|12|Europe/Stockholm|7.4|major-city|65535
se-helsingborg|Helsingborg|Skåne|Sweden|SE|EU|56.0505|12.7|Europe/Stockholm|3.8|beach|33023
se-jonkoping|Jönköping||Sweden|SE|EU|57.7713|14.165|Europe/Stockholm|3.8|beach|65528
se-linkoping|Linköping|Östergötland|Sweden|SE|EU|58.41|15.6299|Europe/Stockholm|3.6|small-city|65535
se-malmo|Malmö|Skåne|Sweden|SE|EU|55.5833|13.0333|Europe/Stockholm|7|major-city|4094
se-norrkoping|Norrköping|Östergötland|Sweden|SE|EU|58.5954|16.1787|Europe/Stockholm|3.6|small-city|65535
se-orebro|Örebro|Orebro|Sweden|SE|EU|59.2803|15.22|Europe/Stockholm|3.8|beach|65475
se-stockholm|Stockholm||Sweden|SE|EU|59.3508|18.0973|Europe/Stockholm|7|capital|25496
se-uppsala|Uppsala||Sweden|SE|EU|59.8601|17.64|Europe/Stockholm|3.6|small-city|65535
se-vasteras|Västerås|Västmanland|Sweden|SE|EU|59.63|16.54|Europe/Stockholm|3.8|beach|64639
ch-basel|Basel|Basel-Stadt|Switzerland|CH|EU|47.5804|7.59|Europe/Zurich|7.4|major-city|65535
ch-bern|Bern||Switzerland|CH|EU|46.9167|7.467|Europe/Zurich|6|capital|65535
ch-biel|Biel|Bern|Switzerland|CH|EU|47.1666|7.25|Europe/Zurich|2.8|small-city|65535
ch-geneva|Geneva|Genève|Switzerland|CH|EU|46.21|6.14|Europe/Zurich|7.4|major-city|65529
ch-lausanne|Lausanne|Vaud|Switzerland|CH|EU|46.5304|6.65|Europe/Zurich|3.8|beach|61567
ch-lugano|Lugano|Ticino|Switzerland|CH|EU|46.0004|8.9667|Europe/Zurich|2.8|small-city|65535
ch-luzern|Luzern|Lucerne|Switzerland|CH|EU|47.0504|8.28|Europe/Zurich|3.6|small-city|65535
ch-saint-gallen|Saint Gallen|Sankt Gallen|Switzerland|CH|EU|47.423|9.362|Europe/Zurich|2.8|small-city|65535
ch-zurich|Zürich||Switzerland|CH|EU|47.38|8.55|Europe/Zurich|7.4|major-city|65535
tw-changhua|Changhua||Taiwan|TW|AS|24.0734|120.5134|Asia/Taipei|7.4|major-city|65535
tw-hsinchu|Hsinchu|Hsinchu City|Taiwan|TW|AS|24.8168|120.9767|Asia/Taipei|7.4|major-city|61439
tw-kaohsiung|Kaohsiung|Kaohsiung City|Taiwan|TW|AS|22.6333|120.2666|Asia/Taipei|4.8|beach|32895
tw-new-taipei|New Taipei|New Taipei City|Taiwan|TW|AS|25.0128|121.465|Asia/Taipei|8|major-city|65535
tw-taichung|Taichung|Taichung City|Taiwan|TW|AS|24.1521|120.6817|Asia/Taipei|8|major-city|65535
tw-tainan|Tainan|Tainan City|Taiwan|TW|AS|23|120.2|Asia/Taipei|4.8|beach|53247
tw-taipei|Taipei|Taipei City|Taiwan|TW|AS|25.0358|121.5683|Asia/Taipei|8.8|major-city|65535
tw-zhongli|Zhongli|Taoyuan|Taiwan|TW|AS|24.965|121.2168|Asia/Taipei|8|major-city|65535
tj-dushanbe|Dushanbe|Tadzhikistan Territories|Tajikistan|TJ|AS|38.56|68.7739|Asia/Dushanbe|6.4|capital|65535
tj-khujand|Khujand|Leninabad|Tajikistan|TJ|AS|40.29|69.6199|Asia/Dushanbe|7|major-city|65535
tj-konibodom|Konibodom|Leninabad|Tajikistan|TJ|AS|40.2922|70.4272|Asia/Dushanbe|3.6|small-city|65535
tj-qurghonteppa|Qurghonteppa|Khatlon|Tajikistan|TJ|AS|37.8373|68.7713|Asia/Dushanbe|3.6|small-city|65535
tz-arusha|Arusha||Tanzania|TZ|AF|-3.36|36.67|Africa/Dar_es_Salaam|4|small-city|65535
tz-dar-es-salaam|Dar es Salaam|Dar-Es-Salaam|Tanzania|TZ|AF|-6.8|39.2683|Africa/Dar_es_Salaam|4.8|beach|65281
tz-mbeya|Mbeya||Tanzania|TZ|AF|-8.89|33.43|Africa/Dar_es_Salaam|7|major-city|65535
tz-morogoro|Morogoro||Tanzania|TZ|AF|-6.82|37.66|Africa/Dar_es_Salaam|7|major-city|65535
tz-moshi|Moshi|Kilimanjaro|Tanzania|TZ|AF|-3.3396|37.34|Africa/Dar_es_Salaam|7.4|major-city|65535
tz-mwanza|Mwanza||Tanzania|TZ|AF|-2.52|32.93|Africa/Dar_es_Salaam|4.2|beach|62463
tz-tanga|Tanga||Tanzania|TZ|AF|-5.07|39.09|Africa/Dar_es_Salaam|3.8|beach|32760
tz-zanzibar|Zanzibar|Zanzibar West|Tanzania|TZ|AF|-6.16|39.2|Africa/Dar_es_Salaam|3.6|island|510
th-bangkok|Bangkok|Bangkok Metropolis|Thailand|TH|AS|13.75|100.5166|Asia/Bangkok|8.8|major-city|65535
th-chiang-mai|Chiang Mai||Thailand|TH|AS|18.8|98.98|Asia/Bangkok|5|historic|65535
th-chon-buri|Chon Buri||Thailand|TH|AS|13.4004|101|Asia/Bangkok|3.8|beach|33791
th-hat-yai|Hat Yai|Songkhla|Thailand|TH|AS|6.9964|100.4714|Asia/Bangkok|7|major-city|65535
th-khon-kaen|Khon Kaen||Thailand|TH|AS|16.42|102.83|Asia/Bangkok|3.6|small-city|65535
th-krabi|Krabi||Thailand|TH|AS|8.052|98.912|Asia/Bangkok|3|beach|63551
th-lampang|Lampang||Thailand|TH|AS|18.2916|99.4813|Asia/Bangkok|3.6|small-city|65535
th-nakhon-ratchasima|Nakhon Ratchasima||Thailand|TH|AS|15|102.1|Asia/Bangkok|7|major-city|65535
th-nakhon-si-thammarat|Nakhon Si Thammarat||Thailand|TH|AS|8.4|99.97|Asia/Bangkok|3.6|small-city|65535
th-nonthaburi|Nonthaburi||Thailand|TH|AS|13.8337|100.4833|Asia/Bangkok|7|major-city|65535
th-pathum-thani|Pathum Thani||Thailand|TH|AS|14.0171|100.5333|Asia/Bangkok|3.6|small-city|65535
th-phuket|Phuket||Thailand|TH|AS|7.8765|98.3815|Asia/Bangkok|3.4|tropical|65439
th-samut-prakan|Samut Prakan||Thailand|TH|AS|13.6069|100.6115|Asia/Bangkok|4.2|beach|62463
th-surat-thani|Surat Thani||Thailand|TH|AS|9.1501|99.3401|Asia/Bangkok|3.6|small-city|65535
th-ubon-ratchathani|Ubon Ratchathani||Thailand|TH|AS|15.25|104.83|Asia/Bangkok|3.6|small-city|65535
th-udon-thani|Udon Thani||Thailand|TH|AS|17.4048|102.7893|Asia/Bangkok|7|major-city|65535
tl-dili|Dili||Timor-Leste|TL|AS|-8.5594|125.5795|Asia/Dili|6|capital|8184
tg-atakpame|Atakpame|Plateaux|Togo|TG|AF|7.53|1.12|Africa/Lome|2.8|small-city|65535
tg-kpalime|Kpalime|Plateaux|Togo|TG|AF|6.9004|0.63|Africa/Lome|3.6|small-city|65535
tg-lome|Lome|Maritime|Togo|TG|AF|6.1319|1.2228|Africa/Lome|7|capital|63503
tg-sokode|Sokode|Centre|Togo|TG|AF|8.9905|1.15|Africa/Lome|3.6|small-city|65535
to-nukualofa|Nukualofa||Tonga|TO|OC|-21.1385|-175.2206|Pacific/Tongatapu|2.4|island|31744
tt-port-of-spain|Port-of-Spain|Port of Spain|Trinidad and Tobago|TT|NA|10.652|-61.517|America/Port_of_Spain|3.8|beach|49215
tt-san-fernando|San Fernando||Trinidad and Tobago|TT|NA|10.2805|-61.4594|America/Port_of_Spain|3.8|beach|1022
tn-bizerte|Bizerte||Tunisia|TN|AF|37.2904|9.855|Africa/Tunis|3.8|beach|65025
tn-gabes|Gabes|Gabès|Tunisia|TN|AF|33.9004|10.1|Africa/Tunis|3.8|beach|32704
tn-qairouan|Qairouan|Kairouan|Tunisia|TN|AF|35.6804|10.1|Africa/Tunis|3.6|small-city|65535
tn-sfax|Sfax||Tunisia|TN|AF|34.75|10.72|Africa/Tunis|7.4|major-city|65295
tn-sousse|Sousse||Tunisia|TN|AF|35.83|10.625|Africa/Tunis|3.8|beach|32704
tn-tunis|Tunis||Tunisia|TN|AF|36.8028|10.1797|Africa/Tunis|7|capital|65507
tr-adana|Adana||Turkey|TR|AS|36.995|35.32|Europe/Istanbul|8|major-city|65535
tr-ankara|Ankara||Turkey|TR|AS|39.9272|32.8644|Europe/Istanbul|7.8|capital|65535
tr-antalya|Antalya||Turkey|TR|AS|36.89|30.7|Europe/Istanbul|4.2|beach|61567
tr-bursa|Bursa||Turkey|TR|AS|40.2|29.07|Europe/Istanbul|8|major-city|65535
tr-diyarbakir|Diyarbakir||Turkey|TR|AS|37.9204|40.23|Europe/Istanbul|7.4|major-city|65535
tr-erzurum|Erzurum||Turkey|TR|AS|39.9204|41.29|Europe/Istanbul|7.4|major-city|65535
tr-eskisehir|Eskisehir||Turkey|TR|AS|39.795|30.53|Europe/Istanbul|7.4|major-city|65535
tr-gaziantep|Gaziantep||Turkey|TR|AS|37.075|37.385|Europe/Istanbul|7.4|major-city|65535
tr-icel|Icel|Mersin|Turkey|TR|AS|36.8|34.62|Europe/Istanbul|4.2|beach|63503
tr-istanbul|Istanbul||Turkey|TR|AS|41.105|29.01|Europe/Istanbul|8.8|major-city|65267
tr-izmir|Izmir||Turkey|TR|AS|38.4361|27.1518|Europe/Istanbul|4.8|beach|2044
tr-kayseri|Kayseri||Turkey|TR|AS|38.735|35.49|Europe/Istanbul|7.4|major-city|65535
tr-konya|Konya||Turkey|TR|AS|37.875|32.475|Europe/Istanbul|7.4|major-city|65535
tr-malatya|Malatya||Turkey|TR|AS|38.3704|38.3|Europe/Istanbul|7.4|major-city|65535
tr-samsun|Samsun||Turkey|TR|AS|41.28|36.3437|Europe/Istanbul|4.2|beach|65472
tr-sanliurfa|Sanliurfa||Turkey|TR|AS|37.17|38.795|Europe/Istanbul|7.4|major-city|65535
tr-tarsus|Tarsus|Mersin|Turkey|TR|AS|36.9204|34.88|Europe/Istanbul|7.4|major-city|65535
tr-trabzon|Trabzon||Turkey|TR|AS|40.98|39.72|Europe/Istanbul|7.4|major-city|16368
tm-ashgabat|Ashgabat|Ahal|Turkmenistan|TM|AS|37.95|58.3833|Asia/Ashgabat|6.4|capital|65535
tm-dasoguz|Dasoguz|Tashauz|Turkmenistan|TM|AS|41.84|59.965|Asia/Ashgabat|3.6|small-city|65535
tm-mary|Mary||Turkmenistan|TM|AS|37.6|61.8333|Asia/Ashgabat|3.6|small-city|65535
tm-turkmenabat|Turkmenabat|Chardzhou|Turkmenistan|TM|AS|39.11|63.58|Asia/Ashgabat|7|major-city|65535
ug-arua|Arua|Arua Municipality|Uganda|UG|AF|3.0204|30.9|Africa/Kampala|3.6|small-city|65535
ug-gulu|Gulu|Aswa|Uganda|UG|AF|2.78|32.28|Africa/Kampala|3.6|small-city|65535
ug-jinja|Jinja||Uganda|UG|AF|0.4404|33.1999|Africa/Kampala|3.8|beach|64575
ug-kampala|Kampala||Uganda|UG|AF|0.3167|32.5833|Africa/Kampala|7|capital|65535
ug-mbale|Mbale|Bungokho|Uganda|UG|AF|1.0904|34.17|Africa/Kampala|7|major-city|65535
ua-dnipropetrovsk|Dnipropetrovsk|Dnipropetrovs'k|Ukraine|UA|EU|48.48|35|Europe/Kyiv|7.4|major-city|65535
ua-donetsk|Donetsk|Donets'k|Ukraine|UA|EU|48|37.83|Europe/Kyiv|7.4|major-city|65535
ua-kharkiv|Kharkiv||Ukraine|UA|EU|50|36.25|Europe/Kyiv|8|major-city|65535
ua-kryvyy-rih|Kryvyy Rih|Dnipropetrovs'k|Ukraine|UA|EU|47.9283|33.345|Europe/Kyiv|7.4|major-city|65535
ua-kyiv|Kyiv||Ukraine|UA|EU|50.4334|30.5166|Europe/Kyiv|7|capital|65535
ua-lvov|Lvov|L'viv|Ukraine|UA|EU|49.835|24.03|Europe/Kyiv|7.4|major-city|65535
ua-odessa|Odessa||Ukraine|UA|EU|46.49|30.71|Europe/Kyiv|7.4|major-city|65475
ua-zaporizhzhya|Zaporizhzhya||Ukraine|UA|EU|47.8573|35.1768|Europe/Zaporozhye|7.4|major-city|61951
ae-abu-dhabi|Abu Dhabi||United Arab Emirates|AE|AS|24.4667|54.3666|Asia/Dubai|3.84|capital|118
ae-al-ayn|Al Ayn|Abu Dhabi|United Arab Emirates|AE|AS|24.2305|55.74|Asia/Dubai|7.4|major-city|65535
ae-al-fujayrah|Al Fujayrah|Fujayrah|United Arab Emirates|AE|AS|25.1234|56.3375|Asia/Dubai|3|beach|65479
ae-dubai|Dubai|Dubay|United Arab Emirates|AE|AS|25.23|55.28|Asia/Dubai|8|major-city|1008
ae-jabal-ali|Jabal Ali|Dubay|United Arab Emirates|AE|AS|24.9762|55.0107|Asia/Dubai|3|beach|2032
ae-ras-al-khaymah|Ras al Khaymah||United Arab Emirates|AE|AS|25.7915|55.9428|Asia/Dubai|3.8|beach|1656
ae-sharjah|Sharjah||United Arab Emirates|AE|AS|25.3714|55.4065|Asia/Dubai|4.2|beach|2044
gb-bath|Bath|Bath and North East Somerset|United Kingdom|GB|EU|51.3837|-2.35|Europe/London|5|historic|65535
gb-belfast|Belfast||United Kingdom|GB|EU|54.6|-5.96|Europe/London|4|small-city|65527
gb-birmingham|Birmingham|West Midlands|United Kingdom|GB|EU|52.475|-1.92|Europe/London|8|major-city|65535
gb-bournemouth|Bournemouth||United Kingdom|GB|EU|50.73|-1.9|Europe/London|3.8|beach|64543
gb-bradford|Bradford|West Yorkshire|United Kingdom|GB|EU|53.8|-1.75|Europe/London|7.4|major-city|65535
gb-brighton|Brighton|Brighton and Hove|United Kingdom|GB|EU|50.8303|-0.17|Europe/London|4.2|beach|57407
gb-bristol|Bristol||United Kingdom|GB|EU|51.45|-2.5833|Europe/London|4|small-city|65535
gb-cardiff|Cardiff||United Kingdom|GB|EU|51.5|-3.225|Europe/London|7.4|major-city|65439
gb-coventry|Coventry|West Midlands|United Kingdom|GB|EU|52.4204|-1.5|Europe/London|7.4|major-city|65535
gb-edinburgh|Edinburgh||United Kingdom|GB|EU|55.9483|-3.2191|Europe/London|5.4|historic|16376
gb-glasgow|Glasgow||United Kingdom|GB|EU|55.8744|-4.2507|Europe/London|7.4|major-city|65535
gb-kingston-upon-hull|Kingston upon Hull||United Kingdom|GB|EU|53.7504|-0.33|Europe/London|3.8|beach|63551
gb-leeds|Leeds|West Yorkshire|United Kingdom|GB|EU|53.83|-1.58|Europe/London|7.4|major-city|65535
gb-leicester|Leicester||United Kingdom|GB|EU|52.63|-1.1332|Europe/London|7.4|major-city|65535
gb-liverpool|Liverpool|Merseyside|United Kingdom|GB|EU|53.416|-2.918|Europe/London|7.4|major-city|49663
gb-london|London|Westminster|United Kingdom|GB|EU|51.5|-0.1167|Europe/London|8.8|major-city|65535
gb-manchester|Manchester||United Kingdom|GB|EU|53.5004|-2.248|Europe/London|8|major-city|65535
gb-middlesbrough|Middlesbrough|Stockton-on-Tees|United Kingdom|GB|EU|54.5804|-1.23|Europe/London|7|major-city|65529
gb-newcastle|Newcastle|Tyne and Wear|United Kingdom|GB|EU|55.0004|-1.6|Europe/London|7.4|major-city|65535
gb-nottingham|Nottingham||United Kingdom|GB|EU|52.9703|-1.17|Europe/London|7.4|major-city|65535
gb-portsmouth|Portsmouth||United Kingdom|GB|EU|50.8003|-1.08|Europe/London|2.52|beach|31
gb-sheffield|Sheffield|South Yorkshire|United Kingdom|GB|EU|53.3667|-1.5|Europe/London|7.4|major-city|65535
gb-southampton|Southampton||United Kingdom|GB|EU|50.9|-1.4|Europe/London|4.2|beach|65087
gb-southend-on-sea|Southend-on-Sea||United Kingdom|GB|EU|51.55|0.72|Europe/London|4.2|beach|63551
gb-stoke|Stoke|Stoke-on-Trent|United Kingdom|GB|EU|53.0004|-2.18|Europe/London|7.4|major-city|65535
gb-sunderland|Sunderland|Tyne and Wear|United Kingdom|GB|EU|54.92|-1.38|Europe/London|4.2|beach|65409
us-albuquerque|Albuquerque|New Mexico|United States|US|NA|35.105|-106.6413|America/Denver|7.4|major-city|65535
us-anchorage|Anchorage|Alaska|United States|US|NA|61.22|-149.9002|America/Anchorage|3.6|small-city|2046
us-atlanta|Atlanta|Georgia|United States|US|NA|33.83|-84.3999|America/New_York|8|major-city|65535
us-austin|Austin|Texas|United States|US|NA|30.2669|-97.7428|America/Chicago|5.9|nightlife|65535
us-baltimore|Baltimore|Maryland|United States|US|NA|39.3|-76.62|America/New_York|8|major-city|65343
us-birmingham|Birmingham|Alabama|United States|US|NA|33.53|-86.825|America/Chicago|7.4|major-city|65535
us-boston|Boston|Massachusetts|United States|US|NA|42.33|-71.07|America/New_York|6|historic|65475
us-bridgeport|Bridgeport|Connecticut|United States|US|NA|41.18|-73.2|America/New_York|4.2|beach|64575
us-buffalo|Buffalo|New York|United States|US|NA|42.88|-78.88|America/New_York|4.2|beach|33023
us-charleston|Charleston|South Carolina|United States|US|NA|32.7924|-79.9921|America/New_York|5|historic|65487
us-charlotte|Charlotte|North Carolina|United States|US|NA|35.205|-80.83|America/New_York|7.4|major-city|65535
us-chicago|Chicago|Illinois|United States|US|NA|41.83|-87.7501|America/Chicago|8.8|major-city|65535
us-cincinnati|Cincinnati|Ohio|United States|US|NA|39.1619|-84.4569|America/New_York|7.4|major-city|65535
us-cleveland|Cleveland|Ohio|United States|US|NA|41.47|-81.695|America/New_York|8|major-city|16380
us-columbus|Columbus|Ohio|United States|US|NA|39.98|-82.99|America/New_York|8|major-city|65535
us-dallas|Dallas|Texas|United States|US|NA|32.82|-96.84|America/Chicago|8.8|major-city|65535
us-denver|Denver|Colorado|United States|US|NA|39.7392|-104.984|America/Denver|5|mountain|65535
us-detroit|Detroit|Michigan|United States|US|NA|42.33|-83.0801|America/Detroit|8|major-city|65007
us-el-paso|El Paso|Texas|United States|US|NA|31.78|-106.51|America/Denver|7.4|major-city|65535
us-fort-lauderdale|Fort Lauderdale|Florida|United States|US|NA|26.1361|-80.1418|America/New_York|8|major-city|65283
us-ft-worth|Ft. Worth|Texas|United States|US|NA|32.74|-97.34|America/Chicago|8|major-city|65535
us-honolulu|Honolulu|Hawaii|United States|US|NA|21.3069|-157.858|Pacific/Honolulu|3.8|tropical|57471
us-houston|Houston|Texas|United States|US|NA|29.82|-95.34|America/Chicago|8.8|major-city|65535
us-indianapolis|Indianapolis|Indiana|United States|US|NA|39.75|-86.17|America/Indiana/Indianapolis|8|major-city|65535
us-irvine|Irvine|California|United States|US|NA|33.6804|-117.83|America/Los_Angeles|8|major-city|65535
us-jackson|Jackson|Mississippi|United States|US|NA|32.2988|-90.185|America/Chicago|4|mountain|65535
us-jacksonville|Jacksonville|Florida|United States|US|NA|30.33|-81.67|America/New_York|7.4|major-city|65535
us-kansas-city|Kansas City|Missouri|United States|US|NA|39.1071|-94.6041|America/Chicago|7.4|major-city|65535
us-key-west|Key West|Florida|United States|US|NA|24.5552|-81.7827|America/New_York|1.44|island|7224
us-las-vegas|Las Vegas|Nevada|United States|US|NA|36.21|-115.22|America/Los_Angeles|6.5|nightlife|65535
us-long-beach|Long Beach|California|United States|US|NA|33.787|-118.158|America/Los_Angeles|4.8|beach|63615
us-los-angeles|Los Angeles|California|United States|US|NA|33.99|-118.18|America/Los_Angeles|8.8|major-city|65535
us-louisville|Louisville|Kentucky|United States|US|NA|38.225|-85.7487|America/Kentucky/Louisville|7.4|major-city|65535
us-memphis|Memphis|Tennessee|United States|US|NA|35.12|-90|America/Chicago|7.4|major-city|65535
us-mesa|Mesa|Arizona|United States|US|NA|33.4239|-111.7361|America/Phoenix|7.4|major-city|65535
us-miami|Miami|Florida|United States|US|NA|25.7876|-80.2241|America/New_York|4.8|beach|65415
us-milwaukee|Milwaukee|Wisconsin|United States|US|NA|43.0527|-87.92|America/Chicago|7.4|major-city|65409
us-minneapolis|Minneapolis|Minnesota|United States|US|NA|44.98|-93.2518|America/Chicago|8|major-city|65535
us-nashville|Nashville|Tennessee|United States|US|NA|36.17|-86.78|America/Chicago|5.9|nightlife|65535
us-new-haven|New Haven|Connecticut|United States|US|NA|41.3304|-72.9|America/New_York|7.4|major-city|64767
us-new-orleans|New Orleans|Louisiana|United States|US|NA|29.995|-90.04|America/Chicago|5.9|nightlife|32766
us-new-york|New York||United States|US|NA|40.75|-73.98|America/New_York|8.8|major-city|29178
us-norfolk|Norfolk|Virginia|United States|US|NA|36.85|-76.28|America/New_York|4.2|beach|57343
us-oakland|Oakland|California|United States|US|NA|37.7689|-122.2211|America/Los_Angeles|7.4|major-city|57599
us-oklahoma-city|Oklahoma City|Oklahoma|United States|US|NA|35.47|-97.5187|America/Chicago|7.4|major-city|65535
us-omaha|Omaha|Nebraska|United States|US|NA|41.24|-96.01|America/Chicago|7.4|major-city|65535
us-orlando|Orlando|Florida|United States|US|NA|28.51|-81.38|America/New_York|7.4|major-city|65535
us-palm-springs|Palm Springs|California|United States|US|NA|33.7774|-116.5331|America/Los_Angeles|5|vacation|65535
us-philadelphia|Philadelphia|Pennsylvania|United States|US|NA|40|-75.17|America/New_York|8.8|major-city|65311
us-phoenix|Phoenix|Arizona|United States|US|NA|33.54|-112.07|America/Phoenix|8|major-city|65535
us-pittsburgh|Pittsburgh|Pennsylvania|United States|US|NA|40.43|-80|America/New_York|8|major-city|65535
us-portland|Portland|Oregon|United States|US|NA|45.52|-122.68|America/Los_Angeles|4.6|small-city|65535
us-providence|Providence|Rhode Island|United States|US|NA|41.8211|-71.415|America/New_York|4.2|beach|65343
us-raleigh|Raleigh|North Carolina|United States|US|NA|35.8188|-78.6447|America/New_York|7.4|major-city|65535
us-sacramento|Sacramento|California|United States|US|NA|38.575|-121.47|America/Los_Angeles|8|major-city|65535
us-san-antonio|San Antonio|Texas|United States|US|NA|29.4873|-98.5073|America/Chicago|8|major-city|65535
us-san-bernardino|San Bernardino|California|United States|US|NA|34.1204|-117.3|America/Los_Angeles|7.4|major-city|65535
us-san-diego|San Diego|California|United States|US|NA|32.82|-117.18|America/Los_Angeles|4.8|beach|65535
us-san-francisco|San Francisco|California|United States|US|NA|37.74|-122.46|America/Los_Angeles|8|major-city|982
us-san-jose|San Jose|California|United States|US|NA|37.3|-121.85|America/Los_Angeles|8|major-city|65535
us-santa-fe|Santa Fe|New Mexico|United States|US|NA|35.6869|-105.9372|America/Denver|5|historic|65535
us-savannah|Savannah|Georgia|United States|US|NA|32.0211|-81.11|America/New_York|5|historic|65535
us-seattle|Seattle|Washington|United States|US|NA|47.57|-122.34|America/Los_Angeles|8|major-city|511
us-st-louis|St. Louis|Missouri|United States|US|NA|38.635|-90.24|America/Chicago|8|major-city|65535
us-tampa|Tampa|Florida|United States|US|NA|27.947|-82.4586|America/New_York|4.8|beach|64575
us-tucson|Tucson|Arizona|United States|US|NA|32.205|-110.89|America/Phoenix|7.4|major-city|65535
us-tulsa|Tulsa|Oklahoma|United States|US|NA|36.12|-95.93|America/Chicago|7.4|major-city|65535
us-virginia-beach|Virginia Beach|Virginia|United States|US|NA|36.8532|-75.9783|America/New_York|4.2|beach|65280
us-washington-d-c|Washington, D.C.|District of Columbia|United States|US|NA|38.8995|-77.0094|America/New_York|8|major-city|61951
us-west-palm-beach|West Palm Beach|Florida|United States|US|NA|26.745|-80.1236|America/New_York|7.4|major-city|65535
uy-montevideo|Montevideo||Uruguay|UY|SA|-34.858|-56.1711|America/Montevideo|6.4|capital|64511
uy-paysandu|Paysandu|Paysandú|Uruguay|UY|SA|-32.33|-58.08|America/Montevideo|2.8|small-city|65535
uy-punta-del-este|Punta del Este|Maldonado|Uruguay|UY|SA|-34.97|-54.95|America/Montevideo|1.4|beach|15
uy-rivera|Rivera||Uruguay|UY|SA|-30.8996|-55.56|America/Montevideo|3.6|small-city|65535
uy-salto|Salto||Uruguay|UY|SA|-31.3903|-57.9687|America/Montevideo|3.6|small-city|65535
uz-andijon|Andijon||Uzbekistan|UZ|AS|40.79|72.34|Asia/Tashkent|7.4|major-city|65535
uz-bukhara|Bukhara|Bukhoro|Uzbekistan|UZ|AS|39.78|64.43|Asia/Samarkand|5|historic|65535
uz-fargona|Fargona|Ferghana|Uzbekistan|UZ|AS|40.39|71.78|Asia/Tashkent|7.4|major-city|65535
uz-namangan|Namangan||Uzbekistan|UZ|AS|41|71.67|Asia/Tashkent|7.4|major-city|65535
uz-qarshi|Qarshi|Kashkadarya|Uzbekistan|UZ|AS|38.8704|65.8|Asia/Samarkand|7.4|major-city|65535
uz-samarqand|Samarqand|Samarkand|Uzbekistan|UZ|AS|39.67|66.945|Asia/Samarkand|7.4|major-city|65535
uz-shahrisabz|Shahrisabz|Kashkadarya|Uzbekistan|UZ|AS|39.0618|66.8315|Asia/Samarkand|7|major-city|65535
uz-tashkent|Tashkent||Uzbekistan|UZ|AS|41.3117|69.2949|Asia/Tashkent|7|capital|65535
vu-port-vila|Port Vila|Shefa|Vanuatu|VU|OC|-17.7334|168.3166|Pacific/Efate|2.4|island|58367
ve-barquisimeto|Barquisimeto|Lara|Venezuela|VE|SA|10.05|-69.3|America/Caracas|7.4|major-city|65535
ve-caracas|Caracas|Distrito Capital|Venezuela|VE|SA|10.501|-66.917|America/Caracas|7|capital|65535
ve-ciudad-guayana|Ciudad Guayana|Bolívar|Venezuela|VE|SA|8.37|-62.62|America/Caracas|7.4|major-city|65535
ve-maracaibo|Maracaibo|Zulia|Venezuela|VE|SA|10.73|-71.66|America/Caracas|8|major-city|65504
ve-maracay|Maracay|Aragua|Venezuela|VE|SA|10.2469|-67.5958|America/Caracas|8|major-city|61951
ve-valencia|Valencia|Carabobo|Venezuela|VE|SA|10.23|-67.98|America/Caracas|8|major-city|65535
vn-bien-hoa|Bien Hoa|Đồng Nai|Vietnam|VN|AS|10.97|106.8301|Asia/Ho_Chi_Minh|7.4|major-city|65535
vn-ca-mau|Ca Mau|Cà Mau|Vietnam|VN|AS|9.1774|105.15|Asia/Ho_Chi_Minh|7|major-city|65535
vn-can-tho|Can Tho||Vietnam|VN|AS|10.05|105.77|Asia/Ho_Chi_Minh|7.4|major-city|65535
vn-da-nang|Da Nang||Vietnam|VN|AS|16.06|108.25|Asia/Ho_Chi_Minh|4.2|beach|14465
vn-haiphong|Haiphong|Quảng Ninh|Vietnam|VN|AS|20.83|106.6801|Asia/Ho_Chi_Minh|8|major-city|65417
vn-hanoi|Hanoi|Thái Nguyên|Vietnam|VN|AS|21.0333|105.85|Asia/Ho_Chi_Minh|7|capital|65535
vn-ho-chi-minh-city|Ho Chi Minh City||Vietnam|VN|AS|10.78|106.695|Asia/Ho_Chi_Minh|8.8|major-city|65535
vn-hue|Hue|Thừa Thiên–Huế|Vietnam|VN|AS|16.47|107.58|Asia/Ho_Chi_Minh|7.4|major-city|65535
vn-long-xuyen|Long Xuyen|An Giang|Vietnam|VN|AS|10.3804|105.42|Asia/Ho_Chi_Minh|7|major-city|65535
vn-nha-trang|Nha Trang|Khánh Hòa|Vietnam|VN|AS|12.25|109.17|Asia/Ho_Chi_Minh|4.2|beach|65527
vn-qui-nhon|Qui Nhon|Bình Định|Vietnam|VN|AS|13.78|109.18|Asia/Ho_Chi_Minh|7.4|major-city|65415
vn-thai-nguyen|Thai Nguyen|Thái Nguyên|Vietnam|VN|AS|21.6|105.83|Asia/Ho_Chi_Minh|7.4|major-city|65535
vn-viet-tri|Viet Tri|Phú Thọ|Vietnam|VN|AS|21.3304|105.43|Asia/Ho_Chi_Minh|7.4|major-city|65535
vn-vinh|Vinh|Nghệ An|Vietnam|VN|AS|18.7|105.68|Asia/Ho_Chi_Minh|7.4|major-city|65535
zm-kabwe|Kabwe|Central|Zambia|ZM|AF|-14.44|28.45|Africa/Lusaka|3.6|small-city|65535
zm-kitwe|Kitwe|Copperbelt|Zambia|ZM|AF|-12.81|28.22|Africa/Lusaka|7.4|major-city|65535
zm-lusaka|Lusaka||Zambia|ZM|AF|-15.4166|28.2833|Africa/Lusaka|7|capital|65535
zm-ndola|Ndola|Copperbelt|Zambia|ZM|AF|-12.9999|28.65|Africa/Lusaka|7.4|major-city|65535
zw-bulawayo|Bulawayo||Zimbabwe|ZW|AF|-20.17|28.58|Africa/Harare|7.4|major-city|65535
zw-chitungwiza|Chitungwiza|Harare|Zimbabwe|ZW|AF|-18|31.1|Africa/Harare|7.4|major-city|65535
zw-harare|Harare||Zimbabwe|ZW|AF|-17.8178|31.0447|Africa/Harare|7|capital|65535
zw-mutare|Mutare|Manicaland|Zimbabwe|ZW|AF|-18.97|32.65|Africa/Harare|3.6|small-city|65535`

export const DESTINATION_COUNT = 1319

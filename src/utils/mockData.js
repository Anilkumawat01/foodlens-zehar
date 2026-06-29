// Mock Database for FoodLens Indian Snack analysis

export const mockProducts = {
  maggi: {
    id: "maggi",
    name: "2-Minute Masala Noodles",
    brand: "Nestlé Maggi",
    dangerLevel: "danger", // danger / concerning / meh / safe
    ratingLabel: "Call Your Doctor",
    description: "The national hosteller survival kit, packed with sodium and nostalgia.",
    nutrition_grades: "e",
    nova_group: 4,
    ecoscore_grade: "e",
    image: "https://images.unsplash.com/photo-1612966608997-30d0fb907e5e?w=300&auto=format&fit=crop&q=80",
    nutriments: {
      calories: 389,
      fat: 13.5,
      saturated_fat: 6.3,
      sugars: 2.2,
      salt: 3.1,
      sodium: 1.24,
      protein: 8.0,
      fiber: 3.6
    },
    ingredients: [
      { name: "Refined Wheat Flour (Maida)", danger: "concerning", info: "Standard flour with all the fiber stripped out. It behaves like sticky glue in your intestines." },
      { name: "Palm Oil", danger: "concerning", info: "Cheap, highly saturated fat. Great for shelf life, terrible for your cardiovascular plumbing." },
      { name: "Iodised Salt", danger: "meh", info: "Essential mineral, but there's enough salt in here to preserve a small mummy." },
      { name: "Hydrolysed Groundnut Protein", danger: "meh", info: "Soy/groundnut protein chemically broken down to release MSG-like compounds for savory flavor." },
      { name: "Monosodium Glutamate (MSG / E621)", danger: "danger", info: "The magic flavor enhancer. It fires up your brain's pleasure receptors so you eat the whole bowl without thinking." },
      { name: "Acidity Regulators (E501, E500)", danger: "meh", info: "Chemical salts used to keep the noodles alkaline. Often found in household detergents." },
      { name: "Humectant (E451)", danger: "concerning", info: "Sodium tripolyphosphate. Retains moisture in the noodles, but also used in commercial paint emulsifiers." }
    ],
    hiddenNames: [
      { buzzword: "Hydrolysed Vegetable Protein", decode: "Chemical MSG in a trench coat, hiding to avoid clean-label scrutiny." },
      { buzzword: "Dehydrated Tastemaker Spice Blend", decode: "A secret mix of anti-caking agents, salt, and flavor chemicals." }
    ],
    damageReport: {
      depleted: ["Potassium", "Magnesium", "Vitamin B Complex"],
      diseases: ["Hypertension (high blood pressure)", "Metabolic syndrome", "Visceral fat accumulation"]
    },
    healthySwap: {
      name: "Millet Noodles or Roasted Makhana (Foxnuts)",
      description: "Whole-grain alternative seasoned with home-ground spices, or simple hand-roasted makhana with ghee and rock salt."
    },
    roasts: {
      doctor: {
        en: "CODE RED! This is not food, it is an industrial flour string assembly kit! The sodium content in this single pack represents 70% of your daily allowance. Your kidneys are practically filing a lawsuit. Eating this is like coating your stomach walls in library paste. Code Blue on aisle 5!",
        hi: "BHAGWAN KE LIYE RUKIYE! Yeh noodles nahi, aapki arteries ko block karne wali rassi hai! Isme itna sodium hai ki aapka blood pressure chaand tak pahunch jayega. Aapke kidneys emergency meeting bula rahe hain. Maida aur Palm Oil ka ye deadly combo aapke pachan tantra ko jam kar dega!"
      },
      mom: {
        en: "Beta, what is this yellow poison? 2 minutes of cooking, and 2 years off your life! Your cousin Ramesh eats sprouts daily and got a promotion. You want to eat this maida plastic and lie in bed? Have some soaked almonds, please, otherwise I will call your father!",
        hi: "Beta, kya hai ye peela zehar? 2 minute ke chakkar me apni umar ke 2 saal kam kar rahe ho! Ramesh beta roz ankurit mung khata hai, dekho kaisa chamak raha hai. Aur tum ye maida aur chemicals khaoge? Chhodo isse, mai tumhare liye garam dal-chawal banati hu!"
      },
      comedian: {
        en: "Maggi claims it cooks in '2 minutes'. Yes, because that's exactly how long it takes your body to realize it's been scammed. The ingredient list reads like a chemistry lab inventory. MSG, Palm Oil, and 'Humectant 451'—which is also used in paint! You're literally eating internal whitewash, bro.",
        hi: "Maggi bolti hai '2 minute'. Haan bhai, kyunki 2 minute me toh tumhari self-respect khatam ho jati hai jab tum isse khate ho! Ingredients dekhlo—Palm Oil aur Humectant 451. Bhai, wahi chemical jo diwar pe lagane wale paint me hota hai. Tum pet me noodles nahi, Asian Paints daal rahe ho!"
      },
      professor: {
        en: "Class, observe the polymer-like structure of these noodles, synthesized via refined wheat flour and structural lipids (palm oil). The tastemaker utilizes monosodium glutamate (E621) to trigger an artificial neurotransmitter rush. Essentially, you are eating a delicious adhesive matrix coated in sodium dust.",
        hi: "Vidyarthiyo, kripya dhyan dein. Ye noodles darasal refined flour (Maida) aur saturated palm lipids ka ek linear polymer chain hai. E621 (MSG) aapke brain receptors ke sath chemical pranks khelta hai. Saral bhasha me, aap namkeen gond (glue) chaba rahe hain."
      },
      news: {
        en: "BREAKING NEWS: A national crisis in a bowl! Reports indicate a massive infiltration of palm oil and high sodium disguised as 'tasty comfort food'. Experts warn that eating this could trigger a localized metabolic strike. Your gut is protesting. We'll bring you live updates from your stomach!",
        hi: "SANSANIKHEZ KHABAR: Desh ke yuvaon ke pet me chal raha hai bada ghotala! 2-Minute ke naam par parosa ja raha hai high sodium aur palm oil ka khatarnak gathbandhan. Kya aapka pet jhel payega ye chemical hamla? Dekhiye pet ke andar se hamari direct reporting!"
      }
    }
  },
  lays: {
    id: "lays",
    name: "Magic Masala Potato Chips",
    brand: "Lay's India",
    dangerLevel: "concerning",
    ratingLabel: "Concerning",
    description: "90% nitrogen air, 10% fried potato grease, 100% addictive spices.",
    nutrition_grades: "e",
    nova_group: 4,
    ecoscore_grade: "d",
    image: "https://images.unsplash.com/photo-1566478989037-eec170784d08?w=300&auto=format&fit=crop&q=80",
    nutriments: {
      calories: 537,
      fat: 33.8,
      saturated_fat: 13.5,
      sugars: 3.0,
      salt: 2.0,
      sodium: 0.82,
      protein: 7.0,
      fiber: 3.8
    },
    ingredients: [
      { name: "Potato", danger: "safe", info: "The humble tuber. Unfortunately, sliced micro-thin and subjected to boiling oil." },
      { name: "Edible Vegetable Oil (Palmolein)", danger: "concerning", info: "Standard cheap frying oil that gets absorbed in high volumes by the thin potato slices." },
      { name: "Spices & Condiments", danger: "meh", info: "A heavy blend of onion powder, garlic powder, chili, and dried mango powder to create a flavor explosion." },
      { name: "Salt", danger: "meh", info: "High concentration of sodium to dehydrate your tongue and make you crave soda." },
      { name: "Flavor Enhancers (E627, E631)", danger: "concerning", info: "Disodium guanylate and disodium inosinate. Synergistic partners of MSG that multiply savory cravings by 10x." },
      { name: "Anticaking Agent (E551)", danger: "meh", info: "Silicon dioxide. Literally refined sand, used to prevent the spice powder from clumping." }
    ],
    hiddenNames: [
      { buzzword: "Edible Vegetable Oil", decode: "Usually Palmolein oil, which has a very high ratio of saturated fatty acids and is cheap to bulk-buy." },
      { buzzword: "Natural & Nature Identical Flavouring Substances", decode: "Chemical compounds formulated in a laboratory to mimic real spices." }
    ],
    damageReport: {
      depleted: ["Calcium", "Vitamin C (destroyed in frying)", "Zinc"],
      diseases: ["Acne and skin inflammation", "High cholesterol", "Fluid retention / bloating"]
    },
    healthySwap: {
      name: "Baked Beetroot Chips or Roasted Makhana",
      description: "Baked at home or bought organic, seasoned with Himalayan pink salt and pepper."
    },
    roasts: {
      doctor: {
        en: "WARNING: You are buying a bag of pressurized nitrogen with oily potato remnants. The combination of Palmolein Oil and flavor enhancers E627 and E631 creates an addictive loop that raises your LDL cholesterol. It is a slow, crunchy disaster for your vascular walls.",
        hi: "DHAYAN DEIN: Aap chips nahi, nitrogen gas se bhara hua oily lifafa khareed rahe hain! Palmolein oil aur artificial flavor enhancers E627/E631 ka ye mel aapki blood vessels ko narrow kar raha hai. Ye aapke dil ke sath ek khatarnak mazaak hai!"
      },
      mom: {
        en: "Only air inside! You pay money for air? In our days, we sliced potatoes, dried them on the terrace, and fried them in fresh mustard oil. This packaged junk has chemical salt that makes your face swell. Stop wasting money and eat roasted chana!",
        hi: "Arre! Poore packet me sirf hawa bhari hai! Hawa ke paise de kar khush ho rahe ho? Humare zamane me dhoop me chips sukhakar banate the. Isme toh sirf chemical aur sasta tel hai. Chehra sujh jayega tumhara! Chhodo ye chips, bhuna chana khao!"
      },
      comedian: {
        en: "Lay's Magic Masala is indeed 'Magic'. The magic is: you open the packet, blink twice, and it's empty! Where did the chips go? They evaporated! And the spices are so intense, they activate sweat glands you didn't know existed. Also, 'Anticaking agent 551' is basically sand. You're paying to eat masala beach sand, people!",
        hi: "Magic Masala sach me magic hai. Magic ye hai ki packet kholo, do baar aankh jhapakao, chips gayab! Aur ingredient me likha hai 'Anticaking agent 551'. Pata hai kya hai ye? Ret! Sand! Matlab company tumko masaledar mitti bech rahi hai aur tum maze se kha rahe ho!"
      },
      professor: {
        en: "The product exhibits high lipid infusion due to deep-frying in Palmolein oil. The flavor profile utilizes disodium guanylate (E627) to mimic a high-protein sensation. Chemically speaking, it's a salt-delivery vehicle optimized for neural reward pathway hijacking.",
        hi: "Isme Palmolein tel ki matra atyadhik hai. E627 aur E631 jaise chemicals aapke taste buds ko confuse karte hain taaki aapko aur khane ki iccha ho. Yeh khana nahi, ek complex neurological trap hai jo chips ke roop me bik raha hai."
      },
      news: {
        en: "CRISIS ALERT: The infamous Magic Masala has struck again! Citizens are reportedly consuming high levels of industrial-grade frying oil and anti-clumping powder. We advise immediate inspection of your pantry before another bag is sacrificed. Back to you in the studio!",
        hi: "SABSE BADI KHABAR: Magic Masala ke packet me chipka hai tel aur sand ka sanyukt gathbandhan! Kya humari janta sirf hawa khane ke liye paise de rahi hai? Swasthya mantralaya ko is par turant action lena chahiye. Dekhte rahiye FoodLens news!"
      }
    }
  },
  haldirams: {
    id: "haldirams",
    name: "Bhujia Sev",
    brand: "Haldiram's",
    dangerLevel: "concerning",
    ratingLabel: "Concerning",
    description: "The default companion for every cup of chai in India, dripping with oil and local pride.",
    nutrition_grades: "e",
    nova_group: 4,
    ecoscore_grade: "d",
    image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=300&auto=format&fit=crop&q=80",
    nutriments: {
      calories: 579,
      fat: 41.2,
      saturated_fat: 15.2,
      sugars: 0.5,
      salt: 1.95,
      sodium: 0.78,
      protein: 10.4,
      fiber: 4.0
    },
    ingredients: [
      { name: "Tepary Beans Flour (Moth)", danger: "safe", info: "High-protein bean flour native to dry regions. Actually healthy, until it gets fried." },
      { name: "Gram Flour (Besan)", danger: "safe", info: "Chickpea flour. Nutritious, gluten-free, but highly porous, absorbing lots of oil." },
      { name: "Edible Vegetable Oil (Cottonseed/Corn/Palmolein)", danger: "danger", info: "Often fried in cottonseed or palm oil. High in Omega-6 fatty acids, promoting systemic inflammation." },
      { name: "Salt", danger: "meh", info: "High amount of sodium to preserve the crunch." },
      { name: "Mixed Spices", danger: "safe", info: "Black pepper, ginger, cloves, cardamom, nutmeg. The real Indian spice kick." }
    ],
    hiddenNames: [
      { buzzword: "Edible Vegetable Oil", decode: "Usually highly refined cottonseed oil or palmolein, which undergoes severe high-temperature chemical bleaching." }
    ],
    damageReport: {
      depleted: ["Antioxidants", "Magnesium"],
      diseases: ["Systemic inflammation", "Gastroesophageal reflux (acidity)", "Visceral belly fat"]
    },
    healthySwap: {
      name: "Roasted Chana / Roasted Makhana",
      description: "Roasted black gram or foxnuts tossed in home spices and a spoonful of cold-pressed oil."
    },
    roasts: {
      doctor: {
        en: "CAUTION: This tea-time snack is a saturated fat trap. Moth flour and Besan are fine, but when deep-fried in refined Cottonseed or Palm oil, they become calorie-dense inflammatory bombs. Your liver is working overtime to clear this grease. moderation is not enough here; your cardiovascular arteries are pleading for mercy.",
        hi: "SAVDHAN: Chai ke sath Bhujia khana band kijiye! Moth aur Besan toh achhe hain, par jab unhe refined cottonseed oil me tal diya jata hai, toh ye cholesterol badhane ka kaam karte hain. Aapka liver is saste tel ko pacha nahi pa raha hai."
      },
      mom: {
        en: "Ofo, whole day eating Bhujia like cattle! One bowl with tea, one bowl with newspapers, one bowl while watching TV. It has cottonseed oil, beta! Cotton is for clothes, why are you eating cotton oil? Eat roasted walnuts, they look like brains, maybe you will get some brain!",
        hi: "Ofo! Din bhar kutton ki tarah bhujia chaba rahe ho! Subah chai ke sath, dopahar ko naashte me, raat ko serial dekhte hue. Are rui (cotton) ke kapde bante hain, tum rui ka tel pi rahe ho! Akrot khao akrot, dimaag tez hoga tumhara!"
      },
      comedian: {
        en: "Haldiram's Bhujia is the ultimate Indian addiction. You start with a small pinch, and suddenly you've finished a half-kilogram packet and your fingers are shining like glazed donuts. Refined cottonseed oil! Cottonseed! You're literally drinking the oil of a fabric crop. No wonder your stomach feels tight!",
        hi: "Bhujia Sev toh nasha hai bhai. Log bolte hain 'mai thoda sa hi khaunga' aur thodi der me poore haath tel se chamak rahe hote hain jaise abhi-abhi engine badalke aaye hon! Aur cottonseed oil—matlab kapde banane wali rui ka tel pi rahe ho tum! Gazab addiction hai!"
      },
      professor: {
        en: "A classical high-surface-area snack. The capillary action of Moth and Gram flour leads to high retention of thermal oil (cottonseed lipid matrix). Consumption results in rapid calorie intake and lipid peroxidation in your digestive tract. Fascinating but highly hazardous.",
        hi: "Is snack ka surface area bohot zyada hai, jiski wajah se refined cottonseed lipids isme acche se absorb ho jate hain. Yeh high caloric density aur Omega-6 fatty acids ka ek inflammatory mixture hai. Dimaag ke liye tasty, dil ke liye maut."
      },
      news: {
        en: "TEA-TIME DANGER: Is your beloved Bhujia destroying your gut? Investigations reveal a heavy saturation of cottonseed oil in every single strand of sev. Citizens are urged to keep their chai clean. We will interview a cardiologist next on this crisis!",
        hi: "SABSE BADI KHABAR: Kya aapka Bhujia aapki arteries ko band kar raha hai? Haldiram's ke is packet me mile hain refined cottonseed tel ke nishaan. Chai ke sath bhujia khane walo, savdhan ho jao! Dekhte rahiye FoodLens!"
      }
    }
  },
  parleg: {
    id: "parleg",
    name: "Original Glucose Biscuits",
    brand: "Parle-G",
    dangerLevel: "concerning",
    ratingLabel: "Concerning",
    description: "The emotion of India, dipped in tea. But under the wrapper lies refined sugar and palm oil.",
    nutrition_grades: "d",
    nova_group: 4,
    ecoscore_grade: "d",
    image: "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=300&auto=format&fit=crop&q=80",
    nutriments: {
      calories: 454,
      fat: 12.5,
      saturated_fat: 6.0,
      sugars: 26.3,
      salt: 0.88,
      sodium: 0.35,
      protein: 6.5,
      fiber: 1.8
    },
    ingredients: [
      { name: "Refined Wheat Flour (Maida)", danger: "concerning", info: "Stripped wheat flour that spikes your blood sugar faster than table sugar." },
      { name: "Sugar", danger: "danger", info: "High fructose sucrose. The fuel for your energy spikes and subsequent crashes." },
      { name: "Refined Palm Oil", danger: "concerning", info: "Saturated, hydrogenated fat used to keep the biscuits crispy for months." },
      { name: "Invert Sugar Syrup", danger: "danger", info: "Liquid sugar (glucose + fructose) that gets absorbed directly into the bloodstream, putting stress on the pancreas." },
      { name: "Raising Agents (E503, E500)", danger: "meh", info: "Ammonium bicarbonate and sodium bicarbonate. Chemicals that release gas to make the biscuits rise." }
    ],
    hiddenNames: [
      { buzzword: "Glucose Biscuits", decode: "A marketing trick. It sounds healthy and energetic, but it's just refined sugar and maida." },
      { buzzword: "Invert Sugar", decode: "Chemically split sugar that tastes sweeter and extends shelf life, but spikes insulin instantly." }
    ],
    damageReport: {
      depleted: ["Chromium", "B Vitamins", "Magnesium"],
      diseases: ["Insulin resistance / Type 2 Diabetes", "Tooth decay", "Fatty liver disease"]
    },
    healthySwap: {
      name: "Home-baked Oats & Ragi Biscuits",
      description: "Made with ragi (finger millet), whole wheat, and sweetened with jaggery (gud) and real butter."
    },
    roasts: {
      doctor: {
        en: "WARNING: Parle-G is marketed as a 'glucose energy' source, but medically it is a Maida-Sugar-Palm Oil cookie. It has invert sugar syrup, which causes massive insulin spikes. Dipping this in sweet tea is double-dosing your blood with sugar. Your pancreas is crying for help!",
        hi: "KHATRE KI GHANTI: Parle-G ko log energy biscuit samajhte hain, par ye sirf Maida, Palm Oil aur Sugar ka combination hai. Isme invert sugar hai jo seedhe aapke blood sugar ko badha deta hai. Chai me duboke khana matlab dushman ko dawat dena!"
      },
      mom: {
        en: "Hai Ram! Even Parle-G you are scanning? This biscuit built this nation! But yes, nowadays they put so much sugar. When Ramesh was small, I gave him milk and rotis, not package biscuits. Stop eating this sweet maida and drink turmeric milk!",
        hi: "Hai Ram! Ab Parle-G ko bhi scan karoge? Is biscuit ne toh desh banaya hai! Par haan, aajkal bahut cheeni daalte hain. Tum log poora din bas biscuits aur chai pe zinda ho. Maida chhoro aur haldi wala doodh piyo!"
      },
      comedian: {
        en: "Parle-G is not a biscuit; it's a religious sentiment in India. If you dip it for 0.5 seconds too long in your tea, it commits suicide and falls into the cup! But check the ingredients: Sugar, Invert Sugar, and Palm Oil. It's basically a sugar cube that went to gym for 2 days. It's sweet, but it's toxic, bro!",
        hi: "Parle-G toh humare desh ka pyaar hai. Par biscuit ko tea me dip karne ki timing ISRO ke rocket launch se bhi zyada precise honi chahiye, warna wo cup me hi gir jata hai! Aur ingredients? Cheeni aur Palm oil. Ye biscuit nahi, sugar ki goli hai jo chai me tairti hai!"
      },
      professor: {
        en: "A classic example of sugar-fat synergy. The invert sugar syrup increases the hygroscopic nature of the matrix, allowing quick dissolution in warm tea. However, the glycemic index of refined maida combined with sucrose leads to immediate insulin release. A glycemic disaster.",
        hi: "Parle-G darasal sucrose aur invert syrup ka ek carbohydrate matrix hai. Refined Maida ke sath milkar iska Glycemic Index bohot badh jata hai. Ye aapke beta-cells ko overload karta hai. Chai me duba kar aap carbohydrate bomb kha rahe hain."
      },
      news: {
        en: "NATION DEMANDS TO KNOW: Is India's favorite tea companion secretly a diabetic trap? Investigative reports show high levels of invert syrup and hydrogenated fats. Parents are advised to monitor tea times. Live coverage continues!",
        hi: "DESH PUCHTA HAI: Kya Parle-G ke naam par desh ko sugar aur maida khilaya ja raha hai? Parle-G ki masoom shakal ke peeche chhupa hai palm oil ka sach. Chai pe charcha band kijiye ya biscuit badaliye!"
      }
    }
  },
  oreo: {
    id: "oreo",
    name: "Chocolate Sandwich Biscuits",
    brand: "Cadbury / Oreo",
    dangerLevel: "danger",
    ratingLabel: "Call Your Doctor",
    description: "The global favorite sandwich cookie, containing zero real chocolate and a mountain of sugar.",
    nutrition_grades: "e",
    nova_group: 4,
    ecoscore_grade: "d",
    image: "https://images.unsplash.com/photo-1558961309-dbdf71799f14?w=300&auto=format&fit=crop&q=80",
    nutriments: {
      calories: 489,
      fat: 20.0,
      saturated_fat: 9.8,
      sugars: 38.0,
      salt: 1.3,
      sodium: 0.52,
      protein: 4.8,
      fiber: 2.1
    },
    ingredients: [
      { name: "Sugar", danger: "danger", info: "The first ingredient listed, meaning it has more sugar than flour by weight. Pure sweet addiction." },
      { name: "Refined Wheat Flour (Maida)", danger: "concerning", info: "Highly processed flour that lacks fiber, iron, or nutrients." },
      { name: "Refined Palm Oil", danger: "concerning", info: "Keeps the chocolate shells crispy and the cream center solid at room temperature." },
      { name: "Cocoa Solids (3.5%)", danger: "safe", info: "The cocoa powder that gives the dark color, but only 3.5% is actual cocoa!" },
      { name: "Fructose Syrup", danger: "danger", info: "High-fructose syrup. Extremely bad for liver health as the liver is the only organ that can metabolize fructose." },
      { name: "Emulsifier (Soy Lecithin)", danger: "meh", info: "Keeps the fat and water from separating." }
    ],
    hiddenNames: [
      { buzzword: "Rich Cocoa Cream", decode: "A marketing phrase. It's mostly sugar, palm oil, and a tiny dash of cocoa powder." },
      { buzzword: "High Fructose Syrup", decode: "A chemically altered corn sugar that bypasses regular fullness signals in your brain." }
    ],
    damageReport: {
      depleted: ["Zinc", "Magnesium", "Vitamin D"],
      diseases: ["Fatty liver disease", "Type 2 Diabetes", "Tooth decay and oral plaque"]
    },
    healthySwap: {
      name: "Homemade Cacao & Almond Flour Cookies",
      description: "Made with unsweetened organic cocoa powder, almond flour, and a touch of maple syrup or honey."
    },
    roasts: {
      doctor: {
        en: "CRITICAL HEALTH ALERT: The first ingredient of this product is pure white SUGAR. Out of 100g, almost 38g is pure sugar! It also contains fructose syrup which leads straight to fatty liver disease. Your liver is not built to filter this level of chemical sweetness. Stop twisting, licking, and dunking your health away!",
        hi: "HEALTH DANGER! Oreo me sabse zyada kya hai pata hai? SUGAR! 100 gram me se 38 gram toh sirf cheeni hai! Aur sath me fructose syrup jo aapke liver me fat jamata hai. Ye 'Twist, Lick, Dunk' aapke liver ko destroy kar raha hai!"
      },
      mom: {
        en: "What 'Twist Lick Dunk'? Speak English properly! You are twisting your stomach and dunking your health in mud! Such black biscuits, looks like charcoal. In our village we use charcoal to clean teeth, you are eating it? Eat homemade mathri instead!",
        hi: "Kya ye 'Twist Lick Dunk' laga rakha hai? Apni sehat ko twist karke mitti me dunk kar rahe ho! Koyle jaisa kaala biscuit hai, hum gaon me koyle se daant saaf karte the, tum pet me daal rahe ho? Ghar ki bani mathri khao!"
      },
      comedian: {
        en: "Oreo commercials show kids smiling and licking cream. In reality, they should show a dentist booking his next luxury vacation! The cream inside is 99% palm oil and sugar, and only 3.5% cocoa! That's not a chocolate biscuit, that's just dirt-colored sugar paste. Twist it, lick it, and throw it in the dustbin!",
        hi: "Oreo bolte hain 'Twist, lick, dunk'. Bhai, isse accha 'Twist, lick and throw it in the dustbin' kar do! Cream ke naam par palm oil aur cheeni ka lepa lagaya hai. Aur cocoa sirf 3.5%! Bhai, ye chocolate biscuit nahi, chocolate ka dhoka hai!"
      },
      professor: {
        en: "A highly engineered lipid-sucrose sandwich. Fructose syrup is added to lower production costs and increase sweetness intensity. This triggers a massive dopamine response, closely mimicking chemical dependencies. The cocoa concentration is statistically insignificant. A molecular fraud.",
        hi: "Yeh biscuit darasal sucrose aur industrial fructose syrup ka sandwich hai. Fructose liver me seedhe lipid synthesis (fat formation) ko trigger karta hai. 3.5% cocoa solids dikha kar aapko dopamine ka high dose diya ja raha hai. A scientific scam."
      },
      news: {
        en: "DENTAL EXPOSÉ: The dark secrets of the sandwich cookie exposed! Reports confirm high levels of fructose syrup and negligible cocoa content. Millions of children are consuming grease-filled cream. We demand answer from Oreo mascot! Stay tuned.",
        hi: "SABSE BADA KHULASA: Oreo biscuit ke andar ka kaala sach! Cream me nahi hai koi doodh ya malai, sirf hai sasta palm oil aur chemical cheeni. Desh ke bacho ke daant aur liver dono khatre me hain! Dekhte rahiye FoodLens!"
      }
    }
  },
  coke: {
    id: "coke",
    name: "Carbonated Soft Drink",
    brand: "Coca-Cola",
    dangerLevel: "danger",
    ratingLabel: "Call Your Doctor",
    description: "The classic fizzy brown liquid, containing 10 spoons of sugar and zero nutrition.",
    nutrition_grades: "e",
    nova_group: 4,
    ecoscore_grade: "e",
    image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=300&auto=format&fit=crop&q=80",
    nutriments: {
      calories: 44,
      fat: 0,
      saturated_fat: 0,
      sugars: 10.9,
      salt: 0.01,
      sodium: 0.004,
      protein: 0,
      fiber: 0
    },
    ingredients: [
      { name: "Carbonated Water", danger: "meh", info: "Water with carbon dioxide gas dissolved under pressure. Acidic on teeth." },
      { name: "Sugar (10.9%)", danger: "danger", info: "About 35-40g of sugar in a single can. Equivalent to swallowing 10 teaspoons of sugar in one go." },
      { name: "Acidity Regulator (E338)", danger: "danger", info: "Phosphoric acid. It gives the sharp tangy taste and prevents the drink from molding, but it actively leaches calcium from your bones." },
      { name: "Caffeine", danger: "meh", info: "Mild stimulant that creates a dependency, encouraging you to drink more." },
      { name: "Color (E150d)", danger: "concerning", info: "Sulfite ammonia caramel. Gives the dark brown color, but chemically synthesized and linked to cellular damage in animal studies." }
    ],
    hiddenNames: [
      { buzzword: "Original Taste", decode: "A marketing term to make you forget you are drinking phosphoric acid and liquid sugar syrup." }
    ],
    damageReport: {
      depleted: ["Calcium", "Magnesium", "Zinc"],
      diseases: ["Osteoporosis (bone weakening)", "Kidney stones", "Type 2 Diabetes", "Tooth enamel erosion"]
    },
    healthySwap: {
      name: "Fresh Coconut Water or Nimbu Paani",
      description: "Naturally hydrating, rich in potassium, electrolytes, and prepared with fresh lime and rock salt."
    },
    roasts: {
      doctor: {
        en: "CRITICAL: You are drinking liquid diabetes! One can has 10.9g of sugar per 100ml. That is nearly 40 grams of sugar! The phosphoric acid (E338) is so acidic it would dissolve a nail over time, and it actively strips calcium from your bones, raising your risk of kidney stones and osteoporosis. Stop drinking battery acid!",
        hi: "BOHOT KHATARNAK: Ye drink nahi, peene wali diabetes hai! Ek bottle me 10 chammach cheeni hai! Aur E338 (Phosphoric acid) aapki haddiyon se calcium kheench leta hai, jisse haddiyan kamzor aur kidney stones bante hain. Apne sharer me toilet cleaner daalna band kijiye!"
      },
      mom: {
        en: "Hey bhagwan! Black cold drink! When guests come, you buy this black water. It dissolves bones, beta! Your aunt's son had it and his tooth fell out. Drink buttermilk or sweet lassi. I made fresh nimbu paani, throw this chemical water in the sink!",
        hi: "Hey bhagwan! Ye kaala paani! Ghar me mehman aate hain toh tum ye zehar khilate ho unhe. Haddiyan galata hai ye! Nimbu paani bana ke rakha hai fridge me, use piyo aur is chemical ki bottle ko sink me baha do!"
      },
      comedian: {
        en: "Coca-Cola is amazing. It can clean your car battery, rust from your bolts, and toilets! And then you drink it! Why? Phosphoric acid and 10 teaspoons of sugar. If they didn't put the acid, your body would immediately throw up from the sheer sweetness! You're drinking a biochemical weapon!",
        hi: "Coke se log gadi ka engine aur toilet saaf karte hain, aur tum usse pite ho! Kyun bhai? Taaki pet ke andar ke kide mar jayein? Isme phosphoric acid hai aur 10 chammach cheeni. Agar chemical na ho toh tum ek ghoot me ulti kar doge! Ye toilet cleaner pina band karo!"
      },
      professor: {
        en: "An aqueous solution of sucrose and orthophosphoric acid (E338). The extreme acidity (pH ~2.5) is masked by high sucrose concentrations. Phosphoric acid shifts the calcium-phosphate balance, prompting skeletal decalcification. It is structurally destructive to human physiology.",
        hi: "Yeh carbonated paani aur orthophosphoric acid ka mixture hai. Iska pH lagbhag 2.5 hota hai jo ki bohot acidic hai. Acidity ko chhupane ke liye isme high sucrose daala jata hai jo insulin ko badhata hai aur calcium ko bones se bahar nikalta hai."
      },
      news: {
        en: "NATIONAL EMERGENCY: The black fizzy threat invades our refrigerators! Laboratory tests show high phosphoric acid levels that leach calcium from human bones. Citizens are warned against using this as water substitute. Live reports from the dental clinic up next!",
        hi: "SABSE BADA KHATRA: Desh ke yuvaon ki haddiyon ko galane ka saazish! Coke me mila hai phosphoric acid jo calcium ko khatam kar raha hai. Kya aapka toilet cleaner hi aapki favourite drink hai? Janta jawab chahti hai!"
      }
    }
  },
  coconutwater: {
    id: "coconutwater",
    name: "Natural Tender Coconut Water",
    brand: "Local / Fresh",
    dangerLevel: "safe",
    ratingLabel: "Safe",
    description: "Nature's original energy drink, straight from the tree.",
    nutrition_grades: "a",
    nova_group: 1,
    ecoscore_grade: "a",
    image: "https://images.unsplash.com/photo-1525385133512-2f3bdd039054?w=300&auto=format&fit=crop&q=80",
    nutriments: {
      calories: 19,
      fat: 0.2,
      saturated_fat: 0,
      sugars: 2.6,
      salt: 0.06,
      sodium: 0.025,
      protein: 0.7,
      fiber: 1.1
    },
    ingredients: [
      { name: "Tender Coconut Water (100%)", danger: "safe", info: "Natural liquid endosperm. Packed with bio-active enzymes, potassium, and magnesium." }
    ],
    hiddenNames: [
      { buzzword: "No Added Sugar", decode: "Actually true in this case! Just natural sweetness created by the coconut tree." }
    ],
    damageReport: {
      depleted: [],
      diseases: []
    },
    healthySwap: {
      name: "Already perfect!",
      description: "You have achieved health peak. No swap needed."
    },
    roasts: {
      doctor: {
        en: "EXCELLENT CHOICE! Finally, some real hydration. Loaded with potassium, natural electrolytes, and zero artificial colors or preservatives. Your kidneys are singing, your heart rate is stabilizing, and your blood pressure is happy. You may live to see tomorrow!",
        hi: "LAJABAB! Chalo kuch toh dhang ki cheez pi rahe ho! Isme bharpoor potassium aur natural electrolytes hain. Koi preservative nahi, koi artificial color nahi. Aapke kidneys aur dil dono khush hain. Jite rahiye!"
      },
      mom: {
        en: "Ayee, very good, beta! Finally you listened to me. Coconut water is so cooling for the stomach. Ramesh drinks it after running. See, now your face will glow like a bulb. Keep drinking this, and stop eating those packets!",
        hi: "Wah beta wah! Aaj pehli baar dhang ka kaam kiya hai. Nariyal paani pet ke liye kitna thanda hota hai. Ramesh bhi roz pita hai. Dekho ab chehre pe kaisa tej aayega. Roz piyo isse aur packets ko haath mat lagao!"
      },
      comedian: {
        en: "Look at you, being all healthy! Drinking coconut water from a green shell instead of a plastic bottle. The only danger here is the guy with the huge knife who chops it open—make sure to pay him, or that's a real health hazard. Jokes aside, this is pure gold!",
        hi: "Waah re waah, bade healthy ho rahe ho! Nariyal paani pee rahe ho seedhe shell se. Isme ek hi danger hai: wo nariyal bechne wale ka bada sa dhaar-daar chakku! Usse pange mat lena, baaki nariyal paani toh amrit hai bhai!"
      },
      professor: {
        en: "An isotonic natural electrolyte solution. It maintains osmotic balance with human blood plasma due to balanced concentrations of sodium, potassium, and magnesium ions. A flawless biological hydration fluid. Exemplary choice.",
        hi: "Yeh ek isotonic natural solution hai jo humare blood plasma ke sath osmotic equilibrium banata hai. Potassium aur magnesium ka perfect ratio dehydration ko rokhata hai. Ek uttam aur vaigyanik roop se shudh hydration drink."
      },
      news: {
        en: "SPECIAL REPORT: A miracle in a green shell! In a shocking turn of events, a citizen has purchased something that actually grows on a tree. Health indices are rising nationwide. We celebrate this rare victory for nutrition!",
        hi: "SANSHANIKHEZ VICTORY: Breaking news! Ek nagrik ne chemical cold drink ki jagah nariyal paani chuna! Desh me swasthya ka level achanak badh gaya hai. Is shubh avsar par hum pure desh ko badhai dete hain!"
      }
    }
  }
};

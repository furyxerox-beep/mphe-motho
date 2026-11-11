import neo from "@/assets/neo.jpg";
import thandi from "@/assets/thandi.jpg";
import sipho from "@/assets/sipho.jpg";
import { PROVINCES } from "@/lib/sa";

export type PreviewIntent = "Umshado" | "Open" | "Vibes";

export type PreviewProfile = {
  id: string;
  name: string;
  age: number;
  city: string;
  province: string;
  image: string;
  intent: PreviewIntent;
  languages: string;
  languageCode: string;
  interests: string[];
  bio: string;
  audio: string;
  icebreakers: string[];
};

export const previewProfiles: PreviewProfile[] = [
  {
    id: "naledi",
    name: "Naledi",
    age: 28,
    city: "Johannesburg",
    province: "Gauteng",
    image: thandi,
    intent: "Umshado",
    languages: "isiZulu · English",
    languageCode: "en-ZA",
    interests: ["Amapiano", "Art galleries", "Sunday lunch"],
    bio: "Gallery afternoons, a good playlist and Sundays with family. I’m looking for warmth, consistency and someone who dances in the kitchen.",
    audio: "Hi, I’m Naledi. My perfect Sunday starts with music, good food and family. Tell me which song always gets you onto the dance floor.",
    icebreakers: [
      "Important question: are you controlling the amapiano playlist or choosing the gallery for our first Sunday adventure?",
      "Your Sunday lunch sounds like my kind of day. Which family dish would you insist I try first?",
    ],
  },
  {
    id: "sipho",
    name: "Sipho",
    age: 31,
    city: "Cape Town",
    province: "Western Cape",
    image: sipho,
    intent: "Open",
    languages: "isiXhosa · English",
    languageCode: "en-ZA",
    interests: ["Hiking", "House music", "Coffee"],
    bio: "Early hikes, slow coffee and live music whenever I can find it. Open to something real, starting with a genuinely good conversation.",
    audio: "Sawubona, I’m Sipho. I enjoy mountain trails, house music and a properly made flat white. What is your favourite way to spend a Saturday?",
    icebreakers: [
      "Would our first date be a sunrise trail or a slow coffee afterwards? I’m willing to negotiate the wake-up time.",
      "You had me at live house music. Which Cape Town set do you still wish you could replay?",
    ],
  },
  {
    id: "neo",
    name: "Neo",
    age: 30,
    city: "Durban",
    province: "KwaZulu-Natal",
    image: neo,
    intent: "Vibes",
    languages: "Sesotho · English",
    languageCode: "en-ZA",
    interests: ["Braais", "Live music", "Beach runs"],
    bio: "Good people, a proper braai and spontaneous live music. Here for easy laughs and a connection that doesn’t need to be forced.",
    audio: "Hey, I’m Neo. Give me a beach run, a braai with friends and great live music, and I’m happy. What does your ideal weekend look like?",
    icebreakers: [
      "Beach run first or straight to the braai? Your answer will tell me everything I need to know.",
      "If we found a live band this weekend, which local artist would you hope steps onto the stage?",
    ],
  },
];

export function previewScore(profile: PreviewProfile, province: string, intent: PreviewIntent | "") {
  return 50 + (profile.province === province ? 30 : 0) + (profile.intent === intent ? 20 : 0);
}

export function rankedPreviewProfiles(province: string, intent: PreviewIntent | "") {
  return [...previewProfiles].sort((a, b) => previewScore(b, province, intent) - previewScore(a, province, intent));
}

export function provinceSlug(name: string) {
  return name.toLowerCase().replaceAll(" ", "-");
}

export function provinceFromSlug(slug: string) {
  return PROVINCES.find((province) => provinceSlug(province.name) === slug);
}

export const provinceDetails: Record<string, { cities: string; line: string }> = {
  Gauteng: { cities: "Johannesburg · Pretoria · Soweto", line: "City energy, Sunday sessions and meaningful connections close to home." },
  "Western Cape": { cities: "Cape Town · Stellenbosch · Paarl", line: "From coffee dates to mountain trails, meet someone who shares your pace." },
  "KwaZulu-Natal": { cities: "Durban · Pietermaritzburg · Umhlanga", line: "Warm coastal days, live music and connections with real local flavour." },
  "Eastern Cape": { cities: "Gqeberha · East London · Mthatha", line: "Find genuine conversation and shared roots across the Eastern Cape." },
  "Free State": { cities: "Bloemfontein · Bethlehem · Welkom", line: "Meet people who value kindness, consistency and a proper catch-up." },
  Limpopo: { cities: "Polokwane · Tzaneen · Thohoyandou", line: "Connect over culture, music and the kind of weekends you actually enjoy." },
  Mpumalanga: { cities: "Mbombela · Emalahleni · Secunda", line: "Discover nearby people with shared interests and honest intentions." },
  "North West": { cities: "Mahikeng · Rustenburg · Potchefstroom", line: "Start with your vibe and meet someone ready for a real conversation." },
  "Northern Cape": { cities: "Kimberley · Upington · Springbok", line: "Less noise, more intention — find a connection that feels right for you." },
};

export const previewStories = [
  {
    names: "Karabo & Lindiwe",
    place: "Johannesburg, Gauteng",
    quote: "We matched over amapiano and Sunday lunch, then spent our first date talking until the restaurant closed.",
  },
  {
    names: "Ayesha & Siya",
    place: "Cape Town, Western Cape",
    quote: "A simple coffee-and-hike icebreaker became a first date, then a habit of watching the sunset together.",
  },
  {
    names: "Thandi & Musa",
    place: "Durban, KwaZulu-Natal",
    quote: "Hearing each other’s voice before meeting made the first hello feel familiar, relaxed and completely natural.",
  },
];

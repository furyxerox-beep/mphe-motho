import neo from "@/assets/neo.jpg";
import thandi from "@/assets/thandi.jpg";
import sipho from "@/assets/sipho.jpg";

export type Profile = {
  id: string;
  name: string;
  age: number;
  job: string;
  location: string;
  match: number;
  photo: string;
  interests: string[];
};

export const profiles: Profile[] = [
  { id: "neo", name: "Neo R.", age: 27, job: "Software Engineer", location: "Sandton, Gauteng", match: 94, photo: neo, interests: ["Travel", "Photography", "Deep Talks", "Hiking"] },
  { id: "thandi", name: "Thandi M.", age: 25, job: "Architect", location: "Rosebank, Gauteng", match: 91, photo: thandi, interests: ["Art", "Jazz", "Cooking", "Wine"] },
  { id: "sipho", name: "Sipho K.", age: 30, job: "Chef", location: "Pretoria, Gauteng", match: 88, photo: sipho, interests: ["Food", "Football", "Music", "Road trips"] },
];

export const chats = [
  { id: "thandi", name: "Thandi M.", photo: thandi, last: "That jazz spot in Maboneng sounds perfect 🎷", time: "2m", unread: 2 },
  { id: "sipho", name: "Sipho K.", photo: sipho, last: "Haha, I'll cook next time!", time: "1h", unread: 0 },
  { id: "neo", name: "Neo R.", photo: neo, last: "Daily Spark: What's your dream trip?", time: "Yesterday", unread: 0 },
];

export const events = [
  { title: "3-Minute Video Speed Dating", region: "Gauteng", when: "Fri · 19:00", spots: 12 },
  { title: "Wine & Words Mixer", region: "Western Cape", when: "Sat · 18:30", spots: 8 },
  { title: "Global Passport Night", region: "Worldwide", when: "Sun · 20:00", spots: 40 },
];

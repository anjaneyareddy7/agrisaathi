export const STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir",
  "Ladakh", "Lakshadweep", "Puducherry"
];

const DISTRICTS_BY_STATE = {
  "Telangana": [
    "Adilabad", "Bhadradri Kothagudem", "Hyderabad", "Jagtial", "Jangaon",
    "Jayashankar Bhupalpally", "Jogulamba Gadwal", "Kamareddy", "Karimnagar",
    "Khammam", "Komaram Bheem", "Mahabubabad", "Mahabubnagar", "Mancherial",
    "Medak", "Medchal-Malkajgiri", "Mulugu", "Nagarkurnool", "Nalgonda",
    "Narayanpet", "Nirmal", "Nizamabad", "Peddapalli", "Rajanna Sircilla",
    "Rangareddy", "Sangareddy", "Siddipet", "Suryapet", "Vikarabad",
    "Wanaparthy", "Warangal", "Hanumakonda", "Yadadri Bhuvanagiri"
  ],
  "Andhra Pradesh": [
    "Anantapur", "Chittoor", "East Godavari", "Guntur", "Krishna", "Kurnool",
    "Nellore", "Prakasam", "Srikakulam", "Visakhapatnam", "Vizianagaram",
    "West Godavari", "YSR Kadapa", "Alluri Sitharama Raju", "Anakapalli",
    "Annamayya", "Bapatla", "Eluru", "Kakinada", "Konaseema",
    "NTR", "Nandyal", "Palnadu", "Parvathipuram Manyam", "Sri Sathya Sai",
    "Tirupati"
  ]
};

export function districtsOf(state) {
  if (!state) return [];
  const list = DISTRICTS_BY_STATE[state];
  if (!list) {
    console.warn(`districtsOf: no district data yet for "${state}" -- add to DISTRICTS_BY_STATE`);
    return [];
  }
  return list;
}

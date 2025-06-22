const listings = [
  {
    title: "Room near Delhi University",
    description: "Spacious single room with balcony and good ventilation.",
    address: "North Campus, Delhi University",
    city: "Delhi",
    rent: 7500,
    image: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688"
    ],
    isVacant: true
  },
  {
    title: "Flat in Alpha 2, Greater Noida",
    description: "Fully furnished flat ideal for students near Galgotias.",
    address: "Alpha 2, Greater Noida",
    city: "Noida",
    rent: 9500,
    image: [
      "https://images.unsplash.com/photo-1554469384-e58fac16e23a",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267"
    ],
    isVacant: true
  },
  {
    title: "PG in Sector 62 Noida",
    description: "Girls PG with AC, Wi-Fi, and meals included.",
    address: "Sector 62, Noida",
    city: "Noida",
    rent: 7000,
    image: [
      "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb"
    ],
    isVacant: true
  },
  {
    title: "Sharing Room in Gurgaon",
    description: "2 BHK with shared kitchen and utilities near Cyber City.",
    address: "DLF Phase 3, Gurgaon",
    city: "Gurgaon",
    rent: 8500,
    image: [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb"
    ],
    isVacant: false
  },
  {
    title: "1BHK in Knowledge Park 2",
    description: "Perfect for students of Sharda and Bennett University.",
    address: "Knowledge Park 2, Greater Noida",
    city: "Noida",
    rent: 9000,
    image: [
      "https://images.unsplash.com/photo-1600121848594-d8644e57abab",
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea",
      "https://images.unsplash.com/photo-1600607688969-a5bfcd646154",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3"
    ],
    isVacant: true
  },
  {
    title: "Affordable Room in Delhi",
    description: "Small private room for students near GTB Nagar.",
    address: "GTB Nagar, Delhi",
    city: "Delhi",
    rent: 6500,
    image: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688"
    ],
    isVacant: true
  },
  {
    title: "Independent Flat in Gurgaon",
    description: "Well-maintained flat in Sector 45.",
    address: "Sector 45, Gurgaon",
    city: "Gurgaon",
    rent: 11000,
    image: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811",
      "https://images.unsplash.com/photo-1554469384-e58fac16e23a",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688"
    ],
    isVacant: true
  },
  {
    title: "Studio in Alpha 2",
    description: "Compact, furnished studio for solo living.",
    address: "Alpha 2, Greater Noida",
    city: "Noida",
    rent: 7200,
    image: [
      "https://images.unsplash.com/photo-1621976346565-d3f2e7f8f1a9",
      "https://images.unsplash.com/photo-1600121848594-d8644e57abab",
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea",
      "https://images.unsplash.com/photo-1600607688969-a5bfcd646154"
    ],
    isVacant: true
  },
  {
    title: "Shared PG in Delhi",
    description: "Student-friendly PG with meals in Mukherjee Nagar.",
    address: "Mukherjee Nagar, Delhi",
    city: "Delhi",
    rent: 6000,
    image: [
      "https://images.unsplash.com/photo-1617104677768-d38d6b9b6e2c",
      "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267"
    ],
    isVacant: false
  },
  {
    title: "Boys PG in Knowledge Park 2",
    description: "2-sharing room with attached bathroom.",
    address: "Knowledge Park 2, Greater Noida",
    city: "Noida",
    rent: 7500,
    image: [
      "https://images.unsplash.com/photo-1598346762291-8d8e5e4e16ec",
      "https://images.unsplash.com/photo-1600121848594-d8644e57abab",
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea",
      "https://images.unsplash.com/photo-1600607688969-a5bfcd646154"
    ],
    isVacant: true
  },
  {
    title: "Girls Hostel near Sector 62",
    description: "Secured, Wi-Fi enabled hostel for girls.",
    address: "Sector 62, Noida",
    city: "Noida",
    rent: 8000,
    image: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
      "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267"
    ],
    isVacant: true
  },
  {
    title: "Flat in South Extension",
    description: "Luxury 1 BHK flat with balcony.",
    address: "South Extension, Delhi",
    city: "Delhi",
    rent: 14000,
    image: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2",
      "https://images.unsplash.com/photo-1554469384-e58fac16e23a",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688"
    ],
    isVacant: true
  },
  {
    title: "1 Room in Gurgaon",
    description: "Low budget, clean room near IFFCO Chowk.",
    address: "IFFCO Chowk, Gurgaon",
    city: "Gurgaon",
    rent: 7000,
    image: [
      "https://images.unsplash.com/photo-1594592015393-ea5ebd3f5b3e",
      "https://images.unsplash.com/photo-1600121848594-d8644e57abab",
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea",
      "https://images.unsplash.com/photo-1600607688969-a5bfcd646154"
    ],
    isVacant: true
  },
  {
    title: "Furnished Room in Alpha 2",
    description: "Student room with study desk and AC.",
    address: "Alpha 2, Greater Noida",
    city: "Noida",
    rent: 8500,
    image: [
      "https://images.unsplash.com/photo-1600573471511-6d8de84428d6",
      "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267"
    ],
    isVacant: true
  },
  {
    title: "PG in Knowledge Park 2",
    description: "Budget room near Sharda University.",
    address: "Knowledge Park 2, Greater Noida",
    city: "Noida",
    rent: 6200,
    image: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688"
    ],
    isVacant: true
  },
  {
    title: "Flat near Delhi Gate",
    description: "Private 1BHK flat in a gated colony.",
    address: "Delhi Gate, Delhi",
    city: "Delhi",
    rent: 9000,
    image: [
      "https://images.unsplash.com/photo-1605276374212-c055bc31341c",
      "https://images.unsplash.com/photo-1554469384-e58fac16e23a",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688"
    ],
    isVacant: true
  },
  {
    title: "2 BHK in Gurgaon",
    description: "Fully furnished, ideal for 3 friends.",
    address: "Sushant Lok, Gurgaon",
    city: "Gurgaon",
    rent: 12500,
    image: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb"
    ],
    isVacant: false
  },
  {
    title: "Girls PG in Noida",
    description: "Clean PG near Metro station with meals.",
    address: "Sector 15, Noida",
    city: "Noida",
    rent: 7700,
    image: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
      "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267"
    ],
    isVacant: true
  },
  {
    title: "Room near DU South Campus",
    description: "Well-lit room ideal for DU students.",
    address: "Moti Bagh, Delhi",
    city: "Delhi",
    rent: 8000,
    image: [
      "https://images.unsplash.com/photo-1592839717388-bf19fa2efba8",
      "https://images.unsplash.com/photo-1600121848594-d8644e57abab",
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea",
      "https://images.unsplash.com/photo-1600607688969-a5bfcd646154"
    ],
    isVacant: true
  },
  {
    title: "Affordable Flat in Alpha 2",
    description: "Perfect for working professionals or students.",
    address: "Alpha 2, Greater Noida",
    city: "Noida",
    rent: 7300,
    image: [
      "https://images.unsplash.com/photo-1605276374212-c055bc31341c",
      "https://images.unsplash.com/photo-1554469384-e58fac16e23a",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688"
    ],
    isVacant: true
  },
  {
    title: "Premium Apartment in Golf Course Road",
    description: "Luxury 2BHK with all modern amenities.",
    address: "Golf Course Road, Gurgaon",
    city: "Gurgaon",
    rent: 18000,
    image: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688"
    ],
    isVacant: true
  },
  {
    title: "Cozy Studio in Connaught Place",
    description: "Compact studio in heart of Delhi with great connectivity.",
    address: "Connaught Place, Delhi",
    city: "Delhi",
    rent: 12000,
    image: [
      "https://images.unsplash.com/photo-1600121848594-d8644e57abab",
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea",
      "https://images.unsplash.com/photo-1600607688969-a5bfcd646154",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3"
    ],
    isVacant: false
  }
];

module.exports = listings;
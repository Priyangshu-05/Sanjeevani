export const inventory = [
  {
    bloodGroup: "A+",
    available: 42,
    expiring: 2,
    status: "Healthy",
  },
  {
    bloodGroup: "A-",
    available: 18,
    expiring: 1,
    status: "Watch",
  },
  {
    bloodGroup: "B+",
    available: 36,
    expiring: 3,
    status: "Healthy",
  },
  {
    bloodGroup: "B-",
    available: 8,
    expiring: 6,
    status: "Critical",
  },
  {
    bloodGroup: "AB+",
    available: 21,
    expiring: 1,
    status: "Healthy",
  },
  {
    bloodGroup: "AB-",
    available: 7,
    expiring: 2,
    status: "Watch",
  },
  {
    bloodGroup: "O+",
    available: 71,
    expiring: 5,
    status: "Healthy",
  },
  {
    bloodGroup: "O-",
    available: 4,
    expiring: 3,
    status: "Critical",
  },
];

export const aiRecommendation = {
  bloodGroup: "B-",
  quantity: 6,
  source: "Your Hospital",
  destination: "City Care Hospital",
  daysToExpiry: 23,
  priority: "HIGH",

  reason: [
    "Compatible requirement detected",
    "Emergency request is active",
    "6 units are available for coordination",
    "Existing inventory is approaching expiry",
  ],
};
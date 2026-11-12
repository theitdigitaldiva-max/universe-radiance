export const BRAND = {
  name: "Universe Radiance",
  tagline: "Every Season Has a Story.",
  instagram: "https://www.instagram.com/universeradiance",
  facebook: "https://www.facebook.com/universeradiance",
};

export const GEMSTONE_OPTIONS = [
  "Citrine",
  "Carnelian",
  "Amethyst",
  "Rose Quartz",
  "Aquamarine",
  "Freshwater Pearl",
  "Black Onyx",
  "Moonstone",
  "Green Aventurine",
  "Tiger's Eye",
  "Lapis Lazuli",
  "Clear Quartz",
  "Other",
];

export const COLOR_OPTIONS = [
  "Gold",
  "Orange",
  "Blue",
  "Pink",
  "Purple",
  "White",
  "Black",
  "Green",
];

export const BRACELET_SIZES = ["6in", "6.5in", "7in", "7.5in", "8in"];

export const BUDGET_RANGES = [
  "Under ₱1,000",
  "₱1,000 – ₱1,500",
  "₱1,500 – ₱2,500",
  "₱2,500 – ₱5,000",
  "Above ₱5,000",
];

export const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "processing",
  "ready_for_pickup",
  "completed",
  "cancelled",
] as const;

export const CUSTOMIZATION_STATUSES = [
  "new",
  "in_discussion",
  "quoted",
  "accepted",
  "declined",
  "completed",
] as const;

export const INQUIRY_STATUSES = ["new", "replied", "closed"] as const;

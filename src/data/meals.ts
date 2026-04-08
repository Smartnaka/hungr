export const CATEGORIES = {
  ALL: 'All',
  LOCAL: 'Local',
  FAST_FOOD: 'Fast Food',
  SNACKS: 'Snacks',
} as const;

export type Category = (typeof CATEGORIES)[keyof typeof CATEGORIES];

export interface Meal {
  id: number;
  name: string;
  emoji: string;
  category: Category;
  isBroke: boolean;
}

const meals: Meal[] = [
  // Local meals
  { id: 1, name: 'Jollof Rice', emoji: '🍚', category: CATEGORIES.LOCAL, isBroke: false },
  { id: 2, name: 'Fried Rice', emoji: '🍳', category: CATEGORIES.LOCAL, isBroke: false },
  { id: 3, name: 'Egusi Soup & Eba', emoji: '🍲', category: CATEGORIES.LOCAL, isBroke: false },
  { id: 4, name: 'Pounded Yam & Egusi', emoji: '🍛', category: CATEGORIES.LOCAL, isBroke: false },
  { id: 5, name: 'Afang Soup & Fufu', emoji: '🥘', category: CATEGORIES.LOCAL, isBroke: false },
  { id: 6, name: 'Ogbono Soup & Rice', emoji: '🍱', category: CATEGORIES.LOCAL, isBroke: false },
  { id: 7, name: 'Pepper Soup', emoji: '🫕', category: CATEGORIES.LOCAL, isBroke: false },
  { id: 8, name: 'Moi Moi', emoji: '🟤', category: CATEGORIES.LOCAL, isBroke: true },
  { id: 9, name: 'Beans & Rice', emoji: '🫘', category: CATEGORIES.LOCAL, isBroke: true },
  { id: 10, name: 'Beans & Bread', emoji: '🍞', category: CATEGORIES.LOCAL, isBroke: true },
  { id: 11, name: 'Yam & Egg Sauce', emoji: '🥚', category: CATEGORIES.LOCAL, isBroke: false },
  { id: 12, name: 'Ofe Akwu (Palm Nut Soup)', emoji: '🥣', category: CATEGORIES.LOCAL, isBroke: false },
  { id: 13, name: 'Tuwo Shinkafa & Miyan Kuka', emoji: '🍚', category: CATEGORIES.LOCAL, isBroke: false },
  { id: 14, name: 'Efo Riro & Semolina', emoji: '🥬', category: CATEGORIES.LOCAL, isBroke: false },

  // Fast Food
  { id: 15, name: 'Chicken & Chips', emoji: '🍗', category: CATEGORIES.FAST_FOOD, isBroke: false },
  { id: 16, name: 'Burger', emoji: '🍔', category: CATEGORIES.FAST_FOOD, isBroke: false },
  { id: 17, name: 'Shawarma', emoji: '🌯', category: CATEGORIES.FAST_FOOD, isBroke: false },
  { id: 18, name: 'Pizza', emoji: '🍕', category: CATEGORIES.FAST_FOOD, isBroke: false },
  { id: 19, name: 'Suya', emoji: '🍢', category: CATEGORIES.FAST_FOOD, isBroke: true },
  { id: 20, name: 'Meat Pie', emoji: '🥧', category: CATEGORIES.FAST_FOOD, isBroke: true },
  { id: 21, name: 'Fried Yam & Pepper', emoji: '🍟', category: CATEGORIES.FAST_FOOD, isBroke: true },
  { id: 22, name: 'Akara & Ogi', emoji: '🫓', category: CATEGORIES.FAST_FOOD, isBroke: true },

  // Snacks
  { id: 23, name: 'Indomie', emoji: '🍜', category: CATEGORIES.SNACKS, isBroke: true },
  { id: 24, name: 'Bread & Egg', emoji: '🍳', category: CATEGORIES.SNACKS, isBroke: true },
  { id: 25, name: 'Garri & Groundnut', emoji: '🥜', category: CATEGORIES.SNACKS, isBroke: true },
  { id: 26, name: 'Biscuit & Tea', emoji: '🍪', category: CATEGORIES.SNACKS, isBroke: true },
  { id: 27, name: 'Puff Puff', emoji: '🟡', category: CATEGORIES.SNACKS, isBroke: true },
  { id: 28, name: 'Chin Chin', emoji: '🟠', category: CATEGORIES.SNACKS, isBroke: true },
  { id: 29, name: 'Plantain Chips', emoji: '🍌', category: CATEGORIES.SNACKS, isBroke: true },
  { id: 30, name: 'Noodles & Egg', emoji: '🍝', category: CATEGORIES.SNACKS, isBroke: true },
];

export default meals;

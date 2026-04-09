export interface Game {
  id: number | string;
  name: string;
  slug: string;
  description: string;
}

export interface Box {
  id: number | string;
  name: string;
}

export interface Item {
  id: number | string;
  boxId: number | string;
  name: string;
  grade: 'Legend' | 'Epic' | 'Rare' | 'Normal';
  probability: number;
  imageUrl?: string;
}

export interface UnboxedItem {
  name: string;
  type: 'premium' | 'regular' | 'premium_set' | 'premium_normal' | 'premium_other';
  rarity: 'premium' | 'normal' | 'rare' | 'epic';
}

export interface User {
  id: number | string;
  username: string;
  email: string;
}

export interface UserFormData {
  username: string;
  email: string;
  password: string;
}

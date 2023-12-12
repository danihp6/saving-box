export interface Box {
  id: string;
  owner: string;
  type: 'box' | 'flag';
  title: string;
  savings?: number;
  incomings?: number;
  shoppingItems?: ShoppingItem[];
  purchasedItems?: PurchasedItem[];
}

export interface BoxItem {
  name: string;
  amount: number;
}

export interface ShoppingItem extends BoxItem {

}

export interface PurchasedItem extends BoxItem {
  date: Date;
}

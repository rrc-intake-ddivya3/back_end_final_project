export interface OrderLineItem {
    productId: string;
    quantity: number;
}

export interface Order {
    id: string;
    items: OrderLineItem[];
    total: number;
}

export type OrderCreateInput = {
    items: OrderLineItem[];
};

import { ProductStore, ProductStoreInitialData } from "./ProductStore";
import { CartStore, CartStoreInitialData } from "./CartStore";

export interface RootStoreInitialData {
    productStore: ProductStoreInitialData;
    cartStore: CartStoreInitialData;
}

export class RootStore {
    readonly productStore: ProductStore;
    readonly cartStore: CartStore;

    constructor() {
        this.productStore = new ProductStore()
        this.cartStore = new CartStore(this.productStore);
    }

    hydrate = ({ productStore, cartStore }: RootStoreInitialData) => {
        if (productStore) this.productStore.hydrate(productStore);
        if (cartStore) this.cartStore.hydrate(cartStore);
    }
}
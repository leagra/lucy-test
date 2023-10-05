import { observable, action, computed, makeObservable } from "mobx";
import { Product, ProductStore } from "./ProductStore";

const apiUrl = "http://localhost:3000";

type PrivateKeys = "_productIds" | "_productList" | "_loading" | "_orderNumber";

export interface CartStoreInitialData {
    productIds: Array<{ id: number, size: string }>;
}

type SelectedProduct = { id: number, size: string };

export class CartStore {
    private _productIds: SelectedProduct[];
    private _productList: Product[];
    private _orderNumber?: number;
    private _loading: boolean;
    private readonly _productStore: ProductStore;

    constructor(productStore: ProductStore) {
        this._productStore = productStore;
        
        const productIds = typeof window !== "undefined" ? localStorage.getItem("productIds") : "[]";

        this._productIds = productIds ? JSON.parse(productIds) as SelectedProduct[] : [];
        this._productList = [];
        this._loading = false;
        this._orderNumber = undefined;

        makeObservable<CartStore, PrivateKeys>(this, {
            _productIds: observable,
            _productList: observable,
            _loading: observable,
            _orderNumber: observable,
            productIds: computed,
            productList: computed,
            amount: computed,
            orderNumber: computed,
            getProducts: action,
            removeProduct: action,
            addProduct: action,
            checkout: action,
            cleanUp: action,
        })
    }

    get productIds() {
        return this._productIds;
    }

    get productList() {
        return this._productList;
    }

    get orderNumber() {
        return this._orderNumber;
    }

    get amount() {
        return this._productList.reduce((amount, product) => amount + product.priceInCents, 0);
    }

    getProducts = async () => {
        try {
            const productIds = typeof window !== "undefined" ? localStorage.getItem("productIds") : "[]";

            if (productIds) {
                this._loading = true;

                const promises = (JSON.parse(productIds) as SelectedProduct[]).map(product => this._productStore.getProduct(product.id));

                const productsList = await Promise.all(promises);

                this._productList = productsList.filter(product => product) as Product[];
            }
        } catch (e) {
            console.error(e);
        } finally {
            this._loading = false;
        }
    }
    
    checkItemInCart = (id: number) => {
        return this._productIds.find(product => product.id === id);
    }

    getSizeById = (id: number) => {
        const size = this._productIds.find(product => product.id === id)?.size;

        return size;
    }

    addProduct = (selectedProduct: SelectedProduct) => {
        this._productIds = [...this._productIds, selectedProduct];

        localStorage.setItem("productIds", JSON.stringify(this._productIds))
    }

    removeProduct = (id: number) => {
        this._productIds = this._productIds.filter(item => item.id !== id);
        this._productList = this._productList.filter(item => item.id !== id);

        localStorage.setItem("productIds", JSON.stringify(this._productIds))
    }

    checkout = async () => {
        try {
            const response = await fetch(
                `${apiUrl}/checkout/placeOrder`,
                { 
                    method: "POST", 
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ products: this._productIds }) 
                },
            )

            const { orderId } = await response.json();

            this._orderNumber = orderId;

            this.cleanUp();
        } catch (e) {
            console.error(e)
        } finally {
            this._loading = false;
        }
    }

    cleanUp = () => {
        this._productIds = [];
        this._productList = [];
        localStorage.removeItem("productIds")
    }

    hydrate = (data: CartStoreInitialData) => {
        if (!data) return

        this._productIds = data.productIds;
    }
}
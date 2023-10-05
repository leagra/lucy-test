import { makeObservable, action, computed, observable } from "mobx";

const apiUrl = "http://localhost:3000"

export interface Product {
    id: number;
    description: string;
    name: string;
    image: string;
    model: string;
    price: string;
    priceInCents: number;
    special: string;
    specialInCents: number;
    sizes: string[]
}

type PrivateKeys = "_productList" | "_loading" | "_page" | "_count" | "_pageCount" | "_total"

export interface ProductStoreInitialData {
    productList: Product[];
}

export class ProductStore {
    private _productList: Product[];
    private _loading: boolean;
    private _page: number;
    private _count: number;
    private _pageCount: number;
    private _total: number;

    constructor() {
        this._productList = [];
        this._loading = false;
        this._page = 1;
        this._count = 0;
        this._pageCount = 0;
        this._total = 0;

        makeObservable<ProductStore, PrivateKeys>(this, {
            _productList: observable,
            _loading: observable,
            _page: observable,
            _count: observable,
            _pageCount: observable,
            _total: observable,
            fetchProductsPage: action,
            fetchProduct: action,
            getProduct: action,
            fetchAllProducts: action,
            productList: computed,
            loading: computed,
        });
    }

    get productList() {
        return this._productList
    }

    get loading() {
        return this._loading
    }

    fetchProductsPage = async (currentPage: number) => {
        try {
            this._loading = true;

            const response = await fetch(`${apiUrl}/product?page=${currentPage}`)

            if (response.ok) {
                const { count, pageCount, total, data } = await response.json()
                
                this._count = count;
                this._page = currentPage;
                this._pageCount = pageCount;
                this._total = total;
                this._productList = [...this._productList, ...data];
            }
        } catch (e) {
            console.error(e)
        } finally {
            this._loading = false;
        }
    }

    fetchAllProducts = () => {
        this._productList = [];

        Promise.all([
            this.fetchProductsPage(1),
            this.fetchProductsPage(2)
        ])
    }

    fetchProduct = async (id: number) => {
        try {
            this._loading = true;

            const response = await fetch(`${apiUrl}/product/${id}`)
    
            if (response.ok) {
                const data = await response.json();

                this._productList = [...this._productList.filter(item => item.id !== data.id), data]

                return data;
            }
        } catch (e) {
            console.error(e)
        } finally {
            this._loading = false;
        }
    }

    getProduct = async (id: number) => {
        let product = this._productList.find(item => item.id === id);

        if (product) {
            return product;
        }

        product = await this.fetchProduct(id);

        return product;
    }

    hydrate = (data: ProductStoreInitialData) => {
        if (!data) return

        this._productList = data.productList;
    }
}
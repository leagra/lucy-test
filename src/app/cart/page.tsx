"use client";

import React, { useEffect } from "react";
import styled from "styled-components"
import { observer } from "mobx-react-lite"
import Link from "next/link";

import { useStore } from "../../store/Provider";
import { Product } from "../../store/ProductStore";
import { ProductContent } from "./ProductContent";

const Container = styled.article`
    display: grid;
    gap: 8px;
    padding: 40px 0;
`;

const CompletedPurchase = styled.section`
    display: flex;
    flex-direction: column;
`

const renderProductContent = (product: Product) => (
    <ProductContent product={product} />
)

const Cart = observer(() => {
    const { cartStore: { productList, amount, orderNumber, checkout, getProducts, getSizeById } } = useStore();

    useEffect(() => {
        getProducts();
    }, []);

    const amountString = String(amount);

    const handleCheckout = () => {
        checkout();
    }

    return (
        <>
            <Link href="/products">To products</Link>
            <Container>
                {orderNumber ? (
                    <CompletedPurchase>
                        <h5>
                            Thank you for your purchase
                        </h5>
                        <h6>
                            Order number is {orderNumber}
                        </h6>
                    </CompletedPurchase>
                ) : (
                    productList.length > 0 ? (
                        <>
                            {productList.map(renderProductContent)}
                            <div>
                            Total amount: ${amountString.substring(0, amountString.length - 2)}.{amountString.substring(amountString.length-2, amountString.length)}
                            </div>
                            <div>
                                <button onClick={handleCheckout}>
                                    Checkout
                                </button>
                            </div>
                        </>
                    ) : <div>Cart is empty</div>
                )}
            </Container>
        </>
    )
})

export default Cart;
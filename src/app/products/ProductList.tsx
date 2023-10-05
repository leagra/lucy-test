'use client';

import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { toJS } from "mobx";
import styled from "styled-components"

import { useStore } from "../../store/Provider";
import { Product } from "../../store/ProductStore";
import { ProductItem } from "./ProductItem";

const Container = styled.article`
    display: grid;
    width: 100%;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    padding: 40px 0;
`

const renderProductItem = (value: Product) => <ProductItem key={value.id} value={value} />

export const ProductList = observer(() => {
    const store = useStore();

    useEffect(() => {
        store.productStore.fetchAllProducts();
    }, [])

    return (
        <Container>
            {store.productStore.productList.map(renderProductItem)}
        </Container>
    )
})
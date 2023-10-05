"use client";

import React, { useEffect, useMemo, useState } from 'react'
import styled from "styled-components"
import NextImage from "next/image";
import Link from "next/link"

import { useStore } from '../../../store/Provider'
import { Product } from '../../../store/ProductStore';
import { observer } from 'mobx-react-lite';

const Container = styled.article`
    display: flex;
    max-width: 400px;
    margin: auto;
    padding: 40px 16px;
    flex-direction: column;
`

const Image = styled(NextImage)`
    width: 400px;
    height: auto;
`

const Info = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    margin-top: 8px;
    width: 100%;
`

const Price = styled.div`
    font-size: 16px;
    font-weight: 700;
`

const Name = styled.div`
    margin-top: 8px;
    font-size: 12px;
`

const Sizes = styled.div`
    display: grid;
    gap: 8px;
    grid-template-columns: max-content max-content max-content;
    margin-top: 8px;
`

const Size = styled.div`
    font-size: 12px;
    font-weight: 600;
    padding: 4px 8px;
    border-radius: 8px;
    background-color: gainsboro;
    cursor: pointer;
`

const SelectedSize = styled(Size)`
    background-color: beige; 
`

const Description = styled.div`
    margin-top: 8px;
    right: 0;
    cursor: pointer;
`

const CartButton = styled.button`
    position: absolute;
    right: 0;
`

const unescapeHtml = (value: string) => 
    value
        .replace(/&lt;/g , "<")
        .replace(/&gt;/g , ">")
        .replace(/&quot;/g , "\"")
        .replace(/&#39;/g , "\'")
        .replace(/&amp;/g , "&");

const Product = observer(({ params }: { params: { slug: string } }) => {
    const store = useStore();

    const [product, setProduct] = useState<Product>();
    const [selectedSize, setSelectedSize] = useState("Small");

    useEffect(() => {
        store.productStore.getProduct(parseInt(params.slug)).then(setProduct)
    }, []);

    const isProductInCart = useMemo(() => {
        if (product) {
            return store.cartStore.checkItemInCart(product.id);
        }

        return false;
    }, [product, store.cartStore.productIds])

    const handleCartClick = () => {
        if (product) {
            if (isProductInCart) {
                store.cartStore.removeProduct(product.id)
            } else {
                store.cartStore.addProduct({ id: product.id, size: selectedSize })
            }
        }
    }

    const handleSizeClick = (size) => () => {
        setSelectedSize(size);
    }
    
    return (
        <div>
            <Link href="/products">To products</Link>
            {" "}
            <Link href="/cart">To cart</Link>
            {
                product && (
                    <Container>
                        <Image src={product.image} alt={product.name} 
                            width={0}
                            height={0} 
                            sizes="100vw"
                        />
                        <Info>
                            <Price>
                                {product.price}
                            </Price>
                            <Name>
                                {product.name}
                            </Name>
                            <Sizes>
                                {product.sizes.map(size => size === selectedSize ?
                                    <SelectedSize key={size} onClick={handleSizeClick(size)}>{size}</SelectedSize> :
                                    <Size key={size} onClick={handleSizeClick(size)}>{size}</Size>
                                )}
                            </Sizes>
                            <Description>
                                <div dangerouslySetInnerHTML={{ __html: unescapeHtml(product.description) }} />
                            </Description>
                            <CartButton onClick={handleCartClick}>
                                {isProductInCart ? "Remove from cart" : "Add to cart"}
                            </CartButton>
                        </Info>
                    </Container>
                )
            }
        </div>
    )
})

export default Product
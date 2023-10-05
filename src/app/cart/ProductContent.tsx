import React from "react";
import styled from "styled-components"
import NextImage from "next/image";
import { Product } from "../../store/ProductStore";
import { useStore } from "../../store/Provider";

const Container = styled.section`
    display: flex;
`

const Image = styled(NextImage)`
    width: 100px;
    height: auto;
`

const Info = styled.div`
    margin-left: 8px;
    display: grid;
    grid-template-rows: max-content max-content max-content max-content;
    gap: 8px;
`

const Button = styled.button`
    width: 100px;
`

const Size = styled.div`
    font-size: 12px;
    font-weight: 600;
    padding: 4px 8px;
    border-radius: 8px;
    background-color: gainsboro;
    cursor: pointer;
    width: max-content;
`

type ProductContentProps = {
    product: Product;
}

export const ProductContent = (props: ProductContentProps) => {
    const { product } = props;
    
    const store = useStore()

    const handleClick = () => {
        store.cartStore.removeProduct(product.id)
    };

    const size = store.cartStore.getSizeById(product.id);

    return (
        <Container>
            <Image src={product.image} alt={product.name} 
                width={0}
                height={0} 
                sizes="100vw"
            />
            <Info>
                <div>
                    {product.name}
                </div>
                <Size>
                    {size}
                </Size>
                <div>
                    {product.price}
                </div>
                <Button onClick={handleClick}>
                    Remove
                </Button>
            </Info>
        </Container>
    )
}
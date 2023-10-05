"use client";

import React from 'react';
import styled from "styled-components";
import NextImage from "next/image";
import { useRouter } from "next/navigation"

import { Product } from '../../store/ProductStore';

type ProductItemProps = {
    value: Product;
}

const Container = styled.div`
    display: flex;
    justify-content: center;
`

const Content = styled.section`
    padding: 16px;
    display: flex;
    flex-direction: column;
    cursor: pointer;
    width: 300px;

    &:hover {
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
    }
`

const Info = styled.div`
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

const Image = styled(NextImage)`
    width: 300px;
    height: auto;
`

export const ProductItem = (props: ProductItemProps) => {
    const { value } = props;

    const router = useRouter();

    const handleClick = () => router.push(`/products/${value.id}`)

    return (
        <Container>
            <Content onClick={handleClick}>
                <Image src={value.image} alt={value.name} 
                    width={0}
                    height={0} 
                    sizes="100vw"
                />
                <Info>
                    <Price>
                        {value.price}
                    </Price>
                    <Name>
                        {value.name}
                    </Name>
                </Info>
            </Content>
        </Container>
    )
}

"use client";

import React from 'react';
import Link from "next/link";

import { ProductList } from './ProductList';

const Page = () => {
    return (
        <>
            <Link href="/cart">To cart</Link>
            <ProductList/>
        </>
    )
}

export default Page;
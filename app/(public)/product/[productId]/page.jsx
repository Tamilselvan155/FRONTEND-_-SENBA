'use client'
import ProductDescription from "@/components/ProductDescription";
import ProductDetails from "@/components/ProductDetails";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
export default function Product() {

    const { productId } = useParams();
    const [product, setProduct] = useState();
    const products = useSelector(state => state.product.list);

    const fetchProduct = async () => {
        const product = products.find((product) => product.id === productId);
        setProduct(product);
    }

    useEffect(() => {
        if (products.length > 0) {
            fetchProduct()
        }
        scrollTo(0, 0)
    }, [productId,products]);

    return (
        <div className="mx-6">
            <div className="max-w-7xl mx-auto">

                {/* ✅ Breadcrumbs */}
                    <div className="text-gray-600 text-md sm:text-lg mt-8 mb-5 sm:ml-10 space-x-1">
                    <Link 
                        href="/" 
                        className="hover:text-black transition-colors duration-200"
                    >
                        Home
                    </Link>
                    <span>/</span>
                    <Link 
                        href={`/category/products`}
                        className="hover:text-black transition-colors duration-200"
                    >
                        Products
                    </Link>
                    <span>/</span>
                    <span className="text-[rgb(55,50,46)] font-medium">{product?.category}</span>
                    </div>

                {/* Product Details */}
                {product && (<ProductDetails product={product} />)}

                {/* Description & Reviews */}
                {product && (<ProductDescription product={product} />)}
            </div>
        </div>
    );
}
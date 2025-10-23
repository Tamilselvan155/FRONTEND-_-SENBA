import { Outfit } from "next/font/google";
import { Toaster } from "react-hot-toast";
import StoreProvider from "@/app/StoreProvider";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"], weight: ["400", "500", "600"] });

export const metadata = {
    title: "Senba Pumps & Motors",
    description: "Senba Pumps & Motors",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={`${outfit.className} antialiased`} style={{ overflowX: 'hidden' }}>
                <StoreProvider>
                    <Toaster />

                    {children}
                </StoreProvider>
            </body>
        </html>
    );
}

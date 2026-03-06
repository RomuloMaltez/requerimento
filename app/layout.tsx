import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";


const poppins = Poppins({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"],
    variable: "--font-poppins",
});

export const metadata: Metadata = {
    title: "SEMEC - Requerimento de Uso de Sistemas Tributários",
    description: "Geração de PDF do Requerimento de Uso de Sistemas Tributários",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pt-BR">
            <body
                className={`${poppins.variable} font-sans antialiased`}
            >
                <Header />
                {children}
                <Footer />
            </body>
        </html>
    );
}

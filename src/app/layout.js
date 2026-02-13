import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
});

export const metadata = {
    title: "The Recursive Grid | Interactive Puzzle",
    description:
        "A dynamic 3x3 grid puzzle with recursive ripple interactions. Built with Next.js by Anurag Kumar.",
    keywords: ["recursive grid", "puzzle", "nextjs", "interactive", "ripple logic"],
    authors: [{ name: "Anurag Kumar" }],
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" className={inter.variable}>
            <body suppressHydrationWarning>{children}</body>
        </html>
    );
}

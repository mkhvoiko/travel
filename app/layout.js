import "./globals.css";
import { Manrope } from "next/font/google";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  variable: "--font-manrope"
});

export const metadata = {
  title: "Love Travel Jamaica | Authentic Island Experiences",
  description: "Book unforgettable Jamaican tours, private transfers, and locally guided adventures.",
  icons: { icon: "./favicon.png", shortcut: "./favicon.png" }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={manrope.variable}>{children}</body>
    </html>
  );
}

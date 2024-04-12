import { type AppType } from "next/app";
import { Inter } from "next/font/google";
import Header from "~/components/Header"; 
import { api } from "~/utils/api";
import Notification from "~/components/ToastComponent";

import "~/styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <main className={`font-sans ${inter.variable}`}>
      <Notification/>
      <Header />
      <Component {...pageProps} />
    </main>
  );
};

export default api.withTRPC(MyApp);

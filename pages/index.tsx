import Image from "next/image";
import { Inter } from "next/font/google";
import Login from "./page/login/login";
import BLayout from "./Components/bLayout";
import { AppContextProvider } from "./Components/AppContext";
//import NewLogin from "./page/login/newLogin";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <div >
      <Login />
      {/* <NewLogin /> */}
    </div>
  );
}
Home.getLayout = function getLayout(page: any) {
  return (
    <AppContextProvider>
      <BLayout>{page}</BLayout>
    </AppContextProvider>
  );
};

import Image from "next/image";
import Layout from "./dashboard/page";
import SignIn from "./auth/signin/page";

export default function Home() {
  return (
    <main>
      <div>
        <SignIn/>
      </div>
    </main>
  );
}

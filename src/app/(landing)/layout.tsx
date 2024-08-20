import { Header, Footer } from "../_components/LandingPage/landing-page";

export default function Layout({ children }: { children: React.ReactNode }) {
	return <div>
        <Header/>
        {children}
        <Footer/>
        </div>;
}

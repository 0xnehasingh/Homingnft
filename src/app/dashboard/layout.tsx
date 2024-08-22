import { Application } from '../_components/application';

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		 <Application>{children}</Application> 
	);
}

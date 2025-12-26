import Header from './components/Header';
import Footer from './components/Footer';
import HeroSlider from './components/HeroSlider';
import FeaturedProducts from './components/FeaturedProducts';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      {/* Spacer for fixed header (top bar + main header) */}
      <div className="h-28" />
      <main className="flex-grow">
        <HeroSlider />
        <FeaturedProducts />
      </main>
      <Footer />
    </div>
  );
}

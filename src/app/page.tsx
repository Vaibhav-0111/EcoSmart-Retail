import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Icons } from '@/components/icons';
import { Cpu, Leaf, Recycle, ShoppingCart } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="container z-40 bg-background">
        <div className="flex h-20 items-center justify-between py-6">
          <Link href="/" className="flex items-center space-x-2">
            <Icons.logo className="h-8 w-8 text-primary" />
            <span className="font-bold text-lg">EcoSmart Retail</span>
          </Link>
          <nav>
            <Button asChild>
              <Link href="/dashboard">Get Started</Link>
            </Button>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <section className="flex-1 flex items-center justify-center">
          <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
            <h1 className="font-headline text-3xl font-bold sm:text-5xl md:text-6xl lg:text-7xl">
              EcoSmart Retail
            </h1>
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
              An AI-powered platform for sustainable reverse logistics and personalized shopping.
            </p>
            <div className="space-x-4">
              <Button asChild size="lg">
                <Link href="/dashboard">Explore Dashboard</Link>
              </Button>
            </div>
          </div>
        </section>
        <section id="features" className="container space-y-6 bg-slate-50/50 dark:bg-transparent py-8 md:py-12 lg:py-24">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <h2 className="font-headline text-2xl font-bold leading-[1.1] sm:text-3xl md:text-4xl">
              The Challenge
            </h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              Millions of returned items end up in landfills, creating waste and reducing profitability. At the same time, customers face decision fatigue, leading to poor user experience and lost sales.
            </p>
          </div>
          <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Recycle className="h-6 w-6 text-primary" />
                  Sustainable Reverse Logistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                Our intelligent system tracks returns and recommends the best action—Reuse, Repair, Recycle, or Resell—to minimize waste and support a circular economy.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-6 w-6 text-primary" />
                  Personalized Shopping
                </CardTitle>
              </CardHeader>
              <CardContent>
                Our AI assistant learns from user behavior to provide tailored product recommendations, reducing decision fatigue and enhancing the shopping experience.
              </CardContent>
            </Card>
          </div>
        </section>
        <section className="container space-y-6 py-8 md:py-12 lg:py-24">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <h2 className="font-headline text-2xl font-bold leading-[1.1] sm:text-3xl md:text-4xl">
              Powered by GenAI
            </h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              We leverage cutting-edge generative AI to provide intelligent recommendations for both logistics and customer-facing shopping experiences.
            </p>
          </div>
          <div className="mx-auto flex justify-center md:max-w-[64rem]">
             <Card className="max-w-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Cpu className="h-6 w-6 text-primary" />
                    Our Technology
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                   <p>EcoSmart Retail is built on a modern, scalable tech stack to deliver a seamless and intelligent experience.</p>
                   <ul className="list-disc list-inside text-muted-foreground">
                      <li>Next.js and React for a dynamic frontend.</li>
                      <li>Genkit with Google AI for powerful AI features.</li>
                      <li>Tailwind CSS and shadcn/ui for a beautiful, responsive design.</li>
                   </ul>
                </CardContent>
             </Card>
          </div>
        </section>
      </main>
      <footer className="py-6 md:px-8 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built for the Retail Hackathon 2025.
          </p>
        </div>
      </footer>
    </div>
  );
}

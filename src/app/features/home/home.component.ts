import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, PLATFORM_ID, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

type HeroSlide = {
  imageSrc: string;
  titleLines: [string, string];
  subtitle: string;
  primaryCta: { label: string; href: string; variant: 'primary' | 'success' };
  secondaryCta: { label: string; href: string };
};

type ValueProp = {
  title: string;
  subtitle: string;
  badgeBg: string;
  icon: 'truck' | 'shield' | 'refresh' | 'headset';
};

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);

  readonly slides = signal<HeroSlide[]>([
    {
      imageSrc: '/hero/19b048dcec278f9d9c89514b670e0d9f8909f6dc.png',
      titleLines: ['Fast & Free Delivery', ''],
      subtitle: 'Same day delivery available',
      primaryCta: { label: 'Order Now', href: '/products', variant: 'primary' },
      secondaryCta: { label: 'Delivery Info', href: '/allorders' }
    },
    {
      imageSrc: '/hero/19b048dcec278f9d9c89514b670e0d9f8909f6dc.png',
      titleLines: ['Premium Quality', 'Guaranteed'],
      subtitle: 'Fresh from farm to your table',
      primaryCta: { label: 'Shop Now', href: '/products', variant: 'primary' },
      secondaryCta: { label: 'Learn More', href: '/products' }
    },
    {
      imageSrc: '/hero/19b048dcec278f9d9c89514b670e0d9f8909f6dc.png',
      titleLines: ['Fresh Products Delivered', 'to your Door'],
      subtitle: 'Get 20% off your first order',
      primaryCta: { label: 'Shop Now', href: '/products', variant: 'success' },
      secondaryCta: { label: 'View Deals', href: '/products' }
    }
  ]);

  readonly activeIndex = signal(2);

  readonly valueProps = signal<ValueProp[]>([
    { title: 'Free Shipping', subtitle: 'On orders over 500 EGP', badgeBg: 'bg-[#FEF2F2]', icon: 'truck' },
    { title: 'Secure Payment', subtitle: '100% secure transactions', badgeBg: 'bg-[#ECFDF5]', icon: 'shield' },
    { title: 'Easy Returns', subtitle: '14-day return policy', badgeBg: 'bg-[#F3F4F6]', icon: 'refresh' },
    { title: '24/7 Support', subtitle: 'Dedicated support team', badgeBg: 'bg-[#F9FAFB]', icon: 'headset' }
  ]);

  private intervalId: number | null = null;

  constructor() {
    // Basic auto-advance to match typical carousel behavior.
    if (isPlatformBrowser(this.platformId)) {
      this.intervalId = window.setInterval(() => this.next(), 6500);
    }
  }

  ngOnDestroy(): void {
    if (this.intervalId != null) {
      window.clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  goTo(idx: number) {
    this.activeIndex.set(this.wrap(idx));
  }

  prev() {
    this.goTo(this.activeIndex() - 1);
  }

  next() {
    this.goTo(this.activeIndex() + 1);
  }

  private wrap(idx: number) {
    const len = this.slides().length;
    if (len <= 0) return 0;
    return ((idx % len) + len) % len;
  }

  trackByIndex = (i: number) => i;
}


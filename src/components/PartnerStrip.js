import AdSlot from './AdSlot';
import { getAds } from '@/lib/ads';

export default async function PartnerStrip() {
  const ads = await getAds('partenaires');
  if (ads.length === 0) return null;

  return (
    <section
      aria-label="Nos partenaires"
      className="border-t border-blue-900 bg-blue-950 py-8 text-white"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <p className="mb-5 text-center text-[11px] font-bold uppercase tracking-[0.22em] text-blue-200/80">
          Nos partenaires
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-5">
          {ads.map((ad) => (
            <AdSlot key={ad.id} ad={ad} variant="logo" />
          ))}
        </div>
      </div>
    </section>
  );
}

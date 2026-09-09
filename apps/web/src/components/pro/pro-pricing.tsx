'use client';

/**
 * ScrollCraft Pro: High-Converting Commercial Pricing Section
 * Zero external UI kits. Strictly under 650 LOC.
 */

import React, { useState } from 'react';
import { PRICING_TIERS } from '@/data/pricing.data';
import { Button } from '@/components/ui/button';
import { Check, ShieldCheck, Sparkles } from 'lucide-react';

export const ProPricing: React.FC = () => {
  const [checkoutNotice, setCheckoutNotice] = useState<string | null>(null);

  const handleCheckout = (tierName: string) => {
    setCheckoutNotice(`Redirecting to Stripe / Lemon Squeezy checkout for ${tierName}...`);
    setTimeout(() => setCheckoutNotice(null), 3500);
  };

  return (
    <section id="pricing" className="w-full max-w-7xl mx-auto py-24 px-6 sm:px-12 space-y-16">
      {/* Header */}
      <div className="flex flex-col items-center text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Commercial Licensing & Cash Flow</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
          Simple, Transparent Pricing
        </h2>
        <p className="text-zinc-400 text-sm sm:text-base max-w-xl">
          Start for free with our open-source MIT engine. Upgrade to Pro for lifetime access to 60+ signature components and CLI scaffolding.
        </p>
      </div>

      {checkoutNotice && (
        <div className="max-w-md mx-auto p-4 rounded-2xl bg-blue-600/20 border border-blue-500/40 text-blue-300 text-xs text-center font-mono animate-pulse">
          {checkoutNotice}
        </div>
      )}

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        {PRICING_TIERS.map((tier) => {
          const isHighlighted = tier.highlighted;

          return (
            <div
              key={tier.id}
              className={`relative rounded-3xl p-8 sm:p-10 flex flex-col justify-between transition-all duration-300 ${
                isHighlighted
                  ? 'bg-[#141620] border-2 border-blue-500 shadow-[0_0_50px_rgba(37,99,235,0.25)] scale-100 lg:-translate-y-2'
                  : 'bg-[#0f1015] border border-white/10 shadow-xl'
              }`}
            >
              {/* Highlight Badge */}
              {tier.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-blue-600 text-white font-mono text-[10px] font-bold tracking-wider uppercase shadow-md">
                  {tier.badge}
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white">{tier.name}</h3>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                    {tier.description}
                  </p>
                </div>

                {/* Price Display */}
                <div className="border-b border-white/5 pb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl sm:text-5xl font-extrabold text-white">
                      {tier.price}
                    </span>
                  </div>
                  <span className="text-[11px] text-zinc-400 font-mono block mt-1">
                    {tier.period}
                  </span>
                </div>

                {/* Features List */}
                <div className="space-y-3 pt-2">
                  <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block">
                    What&apos;s Included:
                  </span>
                  <ul className="space-y-2.5">
                    {tier.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2.5 text-xs text-zinc-300">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-8">
                <Button
                  variant={isHighlighted ? 'primary' : 'secondary'}
                  className="w-full"
                  onClick={() => handleCheckout(tier.name)}
                >
                  {tier.ctaText}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Trust & Guarantee Banner */}
      <div className="max-w-2xl mx-auto flex items-center justify-center gap-3 text-center text-xs text-zinc-400">
        <ShieldCheck className="w-4 h-4 text-emerald-400" />
        <span>14-day money-back guarantee • Commercial client usage included • Instant CLI activation</span>
      </div>
    </section>
  );
};

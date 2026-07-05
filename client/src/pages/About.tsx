import React from 'react';
import { FiAward, FiShield, FiUsers, FiStar } from 'react-icons/fi';
import ScrollReveal from '../components/ScrollReveal';

const About: React.FC = () => {
  const commitments = [
    {
      title: 'Purity Guaranteed',
      description: 'We believe transparency is key to building trust. Every single piece of gold jewelry we present is hallmarked by the Bureau of Indian Standards (BIS), assuring you of its certified purity.',
      icon: FiShield,
    },
    {
      title: 'Expert Craftsmanship',
      description: 'Our jewelry is handcrafted by master artisans (karigars) who hold generations of ornamental art knowledge, combining classical methods with contemporary fashion designs.',
      icon: FiAward,
    },
    {
      title: 'Customer Commitment',
      description: 'From purchasing a simple everyday silver ornament to customizing elaborate bridal sets, we guarantee transparent weight-based billing and exceptional retail service.',
      icon: FiUsers,
    },
  ];

  return (
    <div className="font-body overflow-x-hidden bg-gray-50">
      
      {/* ─── 1. HERO BANNER ────────────────────────────────────────────────── */}
      <section className="relative bg-dark py-28 flex items-center justify-center text-center text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.12)_0%,transparent_60%)]" />
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <span className="text-gold-500 uppercase tracking-widest text-xs font-semibold">Our Legacy</span>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-wider mt-2 mb-4">
            About Siddu Potadar
          </h1>
          <div className="w-16 h-[1px] bg-gold-500 mx-auto" />
        </div>
      </section>

      {/* ─── 2. STORY SECTION ──────────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center lg:text-left">
          <ScrollReveal direction="up">
            <h2 className="font-display text-3xl font-bold text-dark mb-4 text-center">
              Our Generational History
            </h2>
            <div className="w-12 h-[2px] bg-gold-500 mx-auto mb-10" />
          </ScrollReveal>

          <div className="space-y-6 text-gray-500 text-sm leading-relaxed text-justify">
            <ScrollReveal direction="up" delay={0.1}>
              <p>
                Siddu Potadar is a name synonymous with trust, purity, and exquisite craftsmanship in the world of gold and silver jewelry. Established generations ago in the heart of Hukkeri, Karnataka, our family-run jewelry house has been adorning families across the region with handcrafted masterpieces that celebrate India's rich heritage of ornamental art.
              </p>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={0.2}>
              <p>
                Every piece at Siddu Potadar is a labor of love, meticulously designed and crafted by skilled artisans who have inherited centuries-old techniques passed down through generations. From intricate temple jewelry and bridal sets to everyday gold chains and modern designs, our collection spans the full spectrum of Indian jewelry artistry, ensuring there is something for every occasion and every taste.
              </p>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={0.3}>
              <p>
                Our commitment to quality is unwavering — we use only the finest 22-karat gold and 925 sterling silver, with every item hallmarked and certified for purity. At Siddu Potadar, we believe that jewelry is more than adornment; it is an expression of love, tradition, and personal style. We invite you to experience the Siddu Potadar difference and discover jewelry that will be treasured for generations to come.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ─── 3. QUALITY COMMITMENT ─────────────────────────────────────────── */}
      <section className="py-24 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-display text-3xl font-bold text-dark">
              Our Core Guarantees
            </h2>
            <div className="w-12 h-[2px] bg-gold-500 mx-auto mt-3 mb-4" />
            <p className="text-gray-500 text-sm">
              We stand firmly behind our pieces, ensuring that when you invest in Siddu Potadar Jewellers, you are investing in generational values.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {commitments.map((item, idx) => {
              const Icon = item.icon;
              return (
                <ScrollReveal
                  key={item.title}
                  direction="up"
                  delay={idx * 0.15}
                  className="bg-white p-8 rounded-lg border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center"
                >
                  <div className="w-12 h-12 rounded-full bg-gold-50 flex items-center justify-center text-gold-600 mb-6">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-dark mb-4">{item.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{item.description}</p>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── 4. SHOWROOM & REVIEW HIGHLIGHT ───────────────────────────────── */}
      <section className="py-24 bg-dark text-white">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <ScrollReveal>
            <div className="flex justify-center gap-1.5 text-amber-400 text-2xl mb-6">
              <FiStar className="fill-current" />
              <FiStar className="fill-current" />
              <FiStar className="fill-current" />
              <FiStar className="fill-current" />
              <FiStar className="fill-current" />
            </div>
            <blockquote className="font-display text-lg sm:text-2xl italic leading-relaxed text-gray-200 mb-8 max-w-3xl mx-auto">
              "We purchased our daughter's bridal jewelry set from Siddu Potadar. The purity of the gold, the detailed design, and the warmth of the staff made it a memorable experience. They are truly the most trusted jewellers in Hukkeri."
            </blockquote>
            <cite className="block text-xs font-bold uppercase tracking-widest text-gold-500">
              — Satisfied Family from Belgaum
            </cite>
          </ScrollReveal>
        </div>
      </section>

    </div>
  );
};

export default About;

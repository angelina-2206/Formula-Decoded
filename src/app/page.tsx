"use client";

import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import HeroSection from "@/sections/HeroSection";
import CarShowcaseSection from "@/sections/CarShowcaseSection";
import AerodynamicsSection from "@/sections/AerodynamicsSection";
import PowerUnitSection from "@/sections/PowerUnitSection";
import DriverGridSection from "@/sections/DriverGridSection";
import HistoryTimelineSection from "@/sections/HistoryTimelineSection";
import TelemetrySection from "@/sections/TelemetrySection";
import IntroSequence from "@/components/ui/IntroSequence";
import { useState } from "react";

export default function HomePage() {
  const [introFinished, setIntroFinished] = useState(false);

  return (
    <main>
      <IntroSequence onComplete={() => setIntroFinished(true)} />
      <Navbar introFinished={introFinished} />

      {/* scroll storytelling sections */}
      <div id="machine">
        <HeroSection introFinished={introFinished} />
        <CarShowcaseSection />
        <AerodynamicsSection />
        <PowerUnitSection />
      </div>

      <div id="race-control">
        <TelemetrySection />
      </div>

      <div id="grid">
        <DriverGridSection />
        <HistoryTimelineSection />
      </div>

      <Footer />
    </main>
  );
}

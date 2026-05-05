import React from 'react';
import { PrismaHero } from '../components/ui/prisma-hero';

const Features = () => {
  return (
    <div className="bg-black">
      {/* Scrollable Container for Parallax Effects */}
      <div style={{ height: '400vh' }}>
        <PrismaHero />
      </div>
    </div>
  );
};

export default Features;

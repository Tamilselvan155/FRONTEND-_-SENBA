'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// Load the actual contact content only on the client (no SSR)
const ContactContent = dynamic(() => import('./ContactContent'), {
  ssr: false,
});

export default function Contact() {
  return <ContactContent />;
}

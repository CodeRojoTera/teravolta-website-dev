'use client';

import { Suspense } from 'react';
import ContratarFlow from './ContratarFlow';

export default function ContratarPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <ContratarFlow />
    </Suspense>
  );
}
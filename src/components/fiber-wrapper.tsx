'use client';
import dynamic from 'next/dynamic';
const Fiber = dynamic(() => import('@/components/fiber'), { ssr: false });

export default function FiberWrapper() {
  return <Fiber />;
}

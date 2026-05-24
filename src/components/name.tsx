import { Dancing_Script } from 'next/font/google';

const signatureFont = Dancing_Script({
  subsets: ['latin'],
  weight: '700',
});

function Name() {
  return (
    <span
      className={`${signatureFont.className} block text-[20px] leading-6 text-[var(--foreground)]`}
    >
      Sargam Poudel
    </span>
  );
}

export default Name;

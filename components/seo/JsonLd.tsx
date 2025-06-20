import { ReactNode } from 'react';

interface JsonLdProps {
  type: string;
  data: Record<string, any>;
  children?: ReactNode;
}

export default function JsonLd({ type, data, children }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': type,
          ...data,
        }),
      }}
    />
  );
}

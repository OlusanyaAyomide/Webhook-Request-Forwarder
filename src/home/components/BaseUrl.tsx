'use client';

import { useEffect, useState } from 'react';

export default function BaseUrl() {
  const [baseUrl, setBaseUrl] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setBaseUrl(window.location.origin);
    }
  }, []);

  return <span>{baseUrl}</span>;
}

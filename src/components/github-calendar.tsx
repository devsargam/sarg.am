'use client';
import dynamic from 'next/dynamic';
import { useCallback, useState } from 'react';
import { Activity } from 'react-github-calendar';

const GitHubCalendar = dynamic(() => import('react-github-calendar'), {
  ssr: false,
  loading: () => <div className="h-[159px] w-full" />,
});

function GithubCalendar() {
  const [totalCount, setTotalCount] = useState(0);

  const processContributions = useCallback((contributions: Activity[]) => {
    // Hack to calculate total count after rendering
    setTimeout(() => {
      const total = contributions
        .map((el) => el.count)
        .reduce((acc, curr) => acc + curr, 0);

      setTotalCount(total);
    }, 0);

    return contributions.slice(91, 365);
  }, []);

  return (
    <GitHubCalendar
      username="devsargam"
      transformData={processContributions}
      totalCount={totalCount}
    />
  );
}

export default GithubCalendar;

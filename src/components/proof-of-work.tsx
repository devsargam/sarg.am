import { IconNameType, links } from '@/data';
import React from 'react';
import PullRequestIcon from './icons/pull-request-icon';
import GithubLogoIcon from './icons/github-logo-icon';
import CoffeeIcon from './icons/coffee-icon';
import GithubCalendar from './github-calendar';

function ProofOfWork() {
  return (
    <div className="flex flex-col gap-y-4 text-black dark:text-white w-full">
      <h2 className="font-bold text-2xl md:text-4xl tracking-tight">
        Proof of Work
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        All the work I have done so far in public && people&apos;s appreciation
      </p>
      <GithubCalendar />
      {/* TODO: Add a nice table or such design */}
      <ProofOfWorkList />
    </div>
  );
}

function getIconFromName(name?: IconNameType) {
  switch (name) {
    case 'pull-request':
      return <PullRequestIcon />;
    case 'github':
      return <GithubLogoIcon />;
    case 'video':
      return <CoffeeIcon />;
    default:
      return <></>;
  }
}

function ProofOfWorkList() {
  return (
    <div className="flex flex-col w-full">
      {links
        .filter((el) => !el?.hidden)
        .map((el) => {
          const icon = getIconFromName(el?.icon);

          return (
            <a
              key={el?.href}
              href={el?.href}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 dark:hover:bg-zinc-800/50 rounded-md py-3 w-full mb-3 hover:bg-gray-50 flex flex-row items-center space-x-2 px-3 transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-400"
            >
              {icon}
              {/* <el.icon className={clsx('h-5 w-5', el?.iconClass)} /> */}
              <span
                className="font-bold"
                dangerouslySetInnerHTML={{ __html: el?.name }}
              />
            </a>
          );
        })}
    </div>
  );
}

export default ProofOfWork;

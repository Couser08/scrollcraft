'use client';

/**
 * 100% Bespoke Overlapping Avatar Social Proof Group
 * Zero external UI libraries. Strictly under 650 LOC.
 */

import React from 'react';
import Image from 'next/image';
import { AvatarUser } from '@/data/hero.data';

export interface AvatarGroupProps {
  users: AvatarUser[];
  count: string;
  label: string;
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({
  users,
  count,
  label,
}) => {
  return (
    <div className="flex items-center gap-3 pt-2">
      <div className="flex -space-x-2 overflow-hidden">
        {users.map((user) => (
          <Image
            key={user.id}
            src={user.avatarUrl}
            alt={user.name}
            width={32}
            height={32}
            className="inline-block h-8 w-8 rounded-full ring-2 ring-zinc-950 object-cover"
          />
        ))}
      </div>
      <p className="text-xs sm:text-sm text-zinc-400">
        Loved by <strong className="text-white font-semibold">{count}</strong> {label}
      </p>
    </div>
  );
};

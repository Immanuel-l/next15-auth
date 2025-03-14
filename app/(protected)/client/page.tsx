"use client";

import { currentUser } from '@/lib/auth';
import { UserInfo } from '@/components/user-info';
import React from 'react'
import { useCurrentUser } from '@/hooks/use-current-user';

const ClientPage = () => {
    const user = useCurrentUser();
  return (
    <UserInfo 
      label="Client component"
      user={user}
    />
  );
}

export default ClientPage

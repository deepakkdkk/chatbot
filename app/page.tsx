"use client";

import { MainLayout } from '@/components/layout/MainLayout';
import { ChatInterface } from '@/components/chat/ChatInterface';

export default function Home() {
  return (
    <MainLayout>
      <ChatInterface />
    </MainLayout>
  );
}

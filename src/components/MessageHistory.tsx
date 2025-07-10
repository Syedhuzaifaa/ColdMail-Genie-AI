
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { History, Search, Trash2, Filter } from 'lucide-react';
import MessageCard from './MessageCard';
import { getMessageHistory, clearMessageHistory } from '@/lib/storage';

interface Message {
  id: string;
  content: string;
  platform: string;
  tone: string;
  timestamp: number;
  niche: string;
  clientName?: string;
}

export default function MessageHistory() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlatform, setFilterPlatform] = useState('all');

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = () => {
    const history = getMessageHistory();
    setMessages(history);
  };

  const handleDeleteMessage = (messageId: string) => {
    const updatedHistory = messages.filter(msg => msg.id !== messageId);
    localStorage.setItem('coldmail_history', JSON.stringify(updatedHistory));
    setMessages(updatedHistory);
  };

  const handleClearAll = () => {
    clearMessageHistory();
    setMessages([]);
  };

  const filteredMessages = messages.filter((message) => {
    const matchesSearch = message.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.niche.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (message.clientName && message.clientName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesPlatform = filterPlatform === 'all' || message.platform === filterPlatform;
    return matchesSearch && matchesPlatform;
  });

  if (messages.length === 0) {
    return (
      <Card className="w-full bg-card/80 backdrop-blur-sm border-border">
        <CardContent className="text-center py-12">
          <History className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No Messages Yet</h3>
          <p className="text-muted-foreground">
            Generate your first AI-powered outreach message to see it here.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full bg-card/80 backdrop-blur-sm border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2 text-xl text-foreground">
            <History className="w-6 h-6" />
            <span>Message History</span>
            <span className="text-sm bg-primary/20 px-2 py-1 rounded-full text-primary">
              {messages.length}
            </span>
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearAll}
            className="bg-destructive/20 border-destructive/30 text-destructive hover:bg-destructive/30"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear All
          </Button>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-muted/50 border-border text-foreground placeholder-muted-foreground"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <select
              value={filterPlatform}
              onChange={(e) => setFilterPlatform(e.target.value)}
              className="pl-10 pr-8 py-2 bg-muted/50 border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
            >
              <option value="all">All Platforms</option>
              <option value="linkedin">LinkedIn</option>
              <option value="email">Email</option>
              <option value="upwork">Upwork</option>
              <option value="instagram">Instagram</option>
            </select>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {filteredMessages.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No messages match your search criteria.</p>
            </div>
          ) : (
            filteredMessages.map((message) => (
              <MessageCard
                key={message.id}
                message={message}
                onDelete={handleDeleteMessage}
                showActions={true}
              />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

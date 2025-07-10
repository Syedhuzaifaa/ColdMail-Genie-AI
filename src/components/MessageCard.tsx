
'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Check, Save, Trash2, Sparkles } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface MessageCardProps {
  message: {
    id: string;
    content: string;
    platform: string;
    tone: string;
    timestamp: number;
  };
  onSave?: (messageId: string) => void;
  onDelete?: (messageId: string) => void;
  showActions?: boolean;
}

const platformStyles = {
  linkedin: {
    gradient: 'from-blue-500/20 via-blue-600/10 to-blue-700/20',
    border: 'border-blue-500/40',
    accent: 'text-blue-400',
    icon: '💼'
  },
  email: {
    gradient: 'from-emerald-500/20 via-emerald-600/10 to-emerald-700/20',
    border: 'border-emerald-500/40',
    accent: 'text-emerald-400',
    icon: '📧'
  },
  upwork: {
    gradient: 'from-teal-500/20 via-teal-600/10 to-teal-700/20',
    border: 'border-teal-500/40',
    accent: 'text-teal-400',
    icon: '💻'
  },
  instagram: {
    gradient: 'from-pink-500/20 via-purple-600/10 to-pink-700/20',
    border: 'border-pink-500/40',
    accent: 'text-pink-400',
    icon: '📸'
  },
};

export default function MessageCard({ message, onSave, onDelete, showActions = true }: MessageCardProps) {
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      toast({
        title: "📋 Copied!",
        description: "Message copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "❌ Error",
        description: "Failed to copy message",
        variant: "destructive",
      });
    }
  };

  const handleSave = () => {
    if (onSave) {
      onSave(message.id);
      setSaved(true);
      toast({
        title: "💾 Saved!",
        description: "Message saved to history",
      });
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(message.id);
      toast({
        title: "🗑️ Deleted",
        description: "Message removed from history",
      });
    }
  };

  const platformStyle = platformStyles[message.platform as keyof typeof platformStyles] || platformStyles.email;

  return (
    <Card className={`bg-card/80 backdrop-blur-sm border-2 border-border transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl group hover:border-primary/50`}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">{platformStyle.icon}</span>
              <div>
                <span className="text-foreground capitalize font-semibold text-lg">
                  {message.platform}
                </span>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`text-xs bg-muted/80 px-3 py-1 rounded-full text-primary border border-primary/30 font-medium`}>
                    {message.tone}
                  </span>
                  <Sparkles className={`w-3 h-3 text-primary`} />
                </div>
              </div>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Message Content */}
        <div className="bg-muted/50 backdrop-blur-sm p-6 rounded-2xl border border-border relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
          <p className="text-foreground leading-relaxed whitespace-pre-wrap text-lg relative z-10 font-medium">
            {message.content}
          </p>
        </div>
        
        {/* Enhanced Action Buttons */}
        {showActions && (
          <div className="flex items-center justify-between pt-2">
            <div className="flex space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className={`bg-card/80 border-border text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-all duration-300 px-4 py-2 h-10 ${
                  copied ? 'bg-green-500/20 border-green-500/50 text-green-400' : ''
                }`}
              >
                {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                {copied ? 'Copied!' : 'Copy'}
              </Button>
              
              {onSave && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSave}
                  className={`bg-card/80 border-border text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-all duration-300 px-4 py-2 h-10 ${
                    saved ? 'bg-primary/20 border-primary/50 text-primary' : ''
                  }`}
                >
                  {saved ? <Check className="w-4 h-4 mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                  {saved ? 'Saved!' : 'Save'}
                </Button>
              )}
            </div>
            
            {onDelete && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleDelete}
                className="bg-destructive/20 border-destructive/40 text-destructive hover:bg-destructive/30 hover:text-destructive transition-all duration-300 px-4 py-2 h-10"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

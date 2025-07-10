
'use client';

import React, { useState } from 'react';
import { Sparkles, Zap, Target, MessageSquare, Brain, Rocket, Stars, Wand2, TrendingUp } from 'lucide-react';
import InputForm from '@/components/InputForm';
import MessageCard from '@/components/MessageCard';
import MessageHistory from '@/components/MessageHistory';
import { generateMessages } from '@/lib/ai';
import { saveMessage } from '@/lib/storage';
import { toast } from '@/hooks/use-toast';

interface FormData {
  niche: string;
  platform: string;
  offer: string;
  clientName: string;
}

interface GeneratedMessage {
  content: string;
  tone: string;
}

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedMessages, setGeneratedMessages] = useState<GeneratedMessage[]>([]);
  const [currentFormData, setCurrentFormData] = useState<FormData | null>(null);

  const handleGenerate = async (formData: FormData) => {
    setIsLoading(true);
    setCurrentFormData(formData);
    
    try {
      const messages = await generateMessages(formData);
      setGeneratedMessages(messages);
      
      toast({
        title: "🎉 Success!",
        description: `Generated ${messages.length} AI-powered messages for ${formData.platform}`,
      });
    } catch (error) {
      console.error('Error generating messages:', error);
      toast({
        title: "❌ Error",
        description: "Failed to generate messages. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveMessage = (messageId: string) => {
    if (!currentFormData) return;
    
    const messageIndex = parseInt(messageId);
    const message = generatedMessages[messageIndex];
    
    if (message) {
      saveMessage({
        content: message.content,
        platform: currentFormData.platform,
        tone: message.tone,
        niche: currentFormData.niche,
        clientName: currentFormData.clientName || undefined
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/10"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(262_83%_58%_/_0.15),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(195_100%_55%_/_0.1),transparent_50%)]"></div>
      <div className="absolute top-0 left-0 w-full h-full opacity-20" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      
      <div className="relative container mx-auto px-4 py-8 lg:py-16">
        {/* Enhanced Header */}
        <div className="text-center mb-12 lg:mb-20">
          <div className="flex items-center justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 gradient-primary rounded-3xl blur-lg opacity-75 animate-pulse"></div>
              <div className="relative gradient-primary p-4 rounded-3xl shadow-2xl">
                <Sparkles className="w-10 h-10 text-white animate-bounce" />
              </div>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-8xl font-black mb-6 leading-tight">
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient-x">
              ColdMail Genie
            </span>
          </h1>
          
          <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground mb-8 max-w-4xl mx-auto leading-relaxed">
            🚀 AI-powered outreach messages that <span className="text-primary font-semibold">convert prospects into clients</span>. 
            Generate personalized cold DMs, emails, and proposals in seconds with advanced AI.
          </p>
          
          {/* Enhanced Feature Pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
            {[
              { icon: Brain, text: 'Gemini AI-Powered', gradient: 'gradient-success' },
              { icon: Target, text: 'Platform-Specific', gradient: 'gradient-secondary' },
              { icon: TrendingUp, text: 'High Converting', gradient: 'gradient-primary' },
              { icon: Stars, text: 'Smart Personalization', gradient: 'gradient-accent' }
            ].map((feature, index) => (
              <div 
                key={index}
                className={`flex items-center space-x-2 bg-card/50 backdrop-blur-sm px-4 py-2 rounded-full border border-border hover:scale-105 transition-all duration-300 hover:shadow-lg`}
              >
                <feature.icon className="w-4 h-4 text-primary" />
                <span className="text-foreground text-sm font-medium">{feature.text}</span>
              </div>
            ))}
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-2xl mx-auto">
            {[
              { number: '50K+', label: 'Messages Generated' },
              { number: '95%', label: 'Success Rate' },
              { number: '4.9★', label: 'User Rating' }
            ].map((stat, index) => (
              <div key={index} className="text-center bg-card/30 backdrop-blur-sm p-4 rounded-xl border border-border">
                <div className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {stat.number}
                </div>
                <div className="text-muted-foreground text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Form Section - Wider */}
          <div className="xl:col-span-3 space-y-8">
            <InputForm onGenerate={handleGenerate} isLoading={isLoading} />
            
            {/* Generated Messages with Enhanced Design */}
            {generatedMessages.length > 0 && (
              <div className="animate-fade-in">
                <div className="mb-8 text-center lg:text-left">
                  <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-3 flex items-center justify-center lg:justify-start gap-3">
                    <Wand2 className="w-8 h-8 text-primary" />
                    Your AI-Generated Messages
                  </h2>
                  <p className="text-muted-foreground text-lg">
                    ✨ {generatedMessages.length} personalized messages crafted by AI, ready to send
                  </p>
                </div>
                
                <div className="grid gap-6 lg:gap-8">
                  {generatedMessages.map((message, index) => (
                    <div key={index} className="animate-scale-in" style={{ animationDelay: `${index * 100}ms` }}>
                      <MessageCard
                        message={{
                          id: index.toString(),
                          content: message.content,
                          platform: currentFormData?.platform || '',
                          tone: message.tone,
                          timestamp: Date.now()
                        }}
                        onSave={handleSaveMessage}
                        showActions={true}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* History Sidebar - More Compact */}
          <div className="xl:col-span-1">
            <div className="sticky top-8">
              <MessageHistory />
            </div>
          </div>
        </div>
        
        {/* Enhanced Features Section */}
        <div className="mt-20 lg:mt-32 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Why Choose ColdMail Genie?
          </h2>
          <p className="text-muted-foreground text-lg mb-16 max-w-2xl mx-auto">
            Powered by advanced AI technology to create messages that actually convert
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: 'Advanced Gemini AI',
                description: 'Latest Google Gemini AI that understands context, tone, and platform-specific best practices',
                gradient: 'gradient-success'
              },
              {
                icon: Target,
                title: 'Platform Optimized',
                description: 'Tailored messages for LinkedIn, Email, Upwork, and Instagram with perfect tone matching',
                gradient: 'gradient-secondary'
              },
              {
                icon: Rocket,
                title: 'Instant Results',
                description: 'Generate multiple high-converting message variations in seconds, not hours',
                gradient: 'gradient-primary'
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className={`group bg-card/50 backdrop-blur-sm p-8 rounded-3xl border border-border hover:scale-105 transition-all duration-300 hover:shadow-2xl`}
              >
                <div className={`${feature.gradient} w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl lg:text-2xl font-semibold text-foreground mb-4">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <div className="bg-card/30 backdrop-blur-sm rounded-3xl p-8 lg:p-12 border border-border">
            <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">
              Ready to Transform Your Outreach? 🚀
            </h3>
            <p className="text-muted-foreground text-lg mb-6">
              Join thousands of freelancers and agencies using AI to land more clients
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => document.querySelector('form')?.scrollIntoView({ behavior: 'smooth' })}
                className="gradient-primary text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Start Generating Now ✨
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;

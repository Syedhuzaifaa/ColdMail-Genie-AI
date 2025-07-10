
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wand2, User, Target, MessageSquare, Lightbulb } from 'lucide-react';

interface FormData {
  niche: string;
  platform: string;
  offer: string;
  clientName: string;
}

interface InputFormProps {
  onGenerate: (data: FormData) => void;
  isLoading: boolean;
}

const platforms = [
  { value: 'linkedin', label: '💼 LinkedIn', desc: 'Professional networking' },
  { value: 'email', label: '📧 Email', desc: 'Formal business communication' },
  { value: 'upwork', label: '💻 Upwork', desc: 'Freelance proposals' },
  { value: 'instagram', label: '📸 Instagram', desc: 'Social media outreach' },
];

const niches = [
  { value: 'Web Development', emoji: '🌐' },
  { value: 'SEO & Digital Marketing', emoji: '📈' },
  { value: 'Graphic Design', emoji: '🎨' },
  { value: 'Content Writing', emoji: '✍️' },
  { value: 'Social Media Management', emoji: '📱' },
  { value: 'Video Editing', emoji: '🎬' },
  { value: 'Mobile App Development', emoji: '📱' },
  { value: 'E-commerce', emoji: '🛒' },
  { value: 'Consulting', emoji: '💼' },
  { value: 'Other', emoji: '🔧' }
];

const offerExamples = [
  "I help e-commerce businesses increase their conversion rates by 30% through optimized landing pages and A/B testing.",
  "I create stunning social media designs that increase engagement by 150% and build brand recognition.",
  "I develop custom web applications that streamline business operations and reduce manual work by 50%.",
  "I write compelling content that converts visitors into customers with proven copywriting techniques."
];

export default function InputForm({ onGenerate, isLoading }: InputFormProps) {
  const [formData, setFormData] = useState<FormData>({
    niche: '',
    platform: '',
    offer: '',
    clientName: ''
  });

  const [selectedExample, setSelectedExample] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.niche && formData.platform && formData.offer) {
      onGenerate(formData);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const useExample = (example: string) => {
    setFormData(prev => ({ ...prev, offer: example }));
    setSelectedExample(example);
  };

  const isFormValid = formData.niche && formData.platform && formData.offer;

  return (
    <Card className="w-full max-w-4xl mx-auto bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-lg border-slate-700/50 shadow-2xl">
      <CardHeader className="text-center pb-8">
        <CardTitle className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent flex items-center justify-center gap-3">
          <Wand2 className="w-8 h-8 text-purple-400" />
          Generate Your Perfect Outreach Message
        </CardTitle>
        <p className="text-slate-400 mt-3 text-lg">
          ✨ Let advanced AI craft personalized messages that convert prospects into clients
        </p>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Enhanced Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Niche Selection */}
            <div className="space-y-3">
              <Label htmlFor="niche" className="text-slate-300 font-semibold text-lg flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-400" />
                Your Expertise *
              </Label>
              <Select onValueChange={(value) => handleInputChange('niche', value)}>
                <SelectTrigger className="bg-slate-800/50 border-slate-600 text-slate-100 focus:border-purple-500 h-12 text-lg">
                  <SelectValue placeholder="🎯 Select your niche..." />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600 max-h-60">
                  {niches.map((niche) => (
                    <SelectItem 
                      key={niche.value} 
                      value={niche.value} 
                      className="text-slate-100 focus:bg-slate-700 text-lg py-3"
                    >
                      <span className="flex items-center gap-3">
                        <span className="text-xl">{niche.emoji}</span>
                        {niche.value}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Platform Selection */}
            <div className="space-y-3">
              <Label htmlFor="platform" className="text-slate-300 font-semibold text-lg flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-400" />
                Target Platform *
              </Label>
              <Select onValueChange={(value) => handleInputChange('platform', value)}>
                <SelectTrigger className="bg-slate-800/50 border-slate-600 text-slate-100 focus:border-blue-500 h-12 text-lg">
                  <SelectValue placeholder="🎯 Choose platform..." />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  {platforms.map((platform) => (
                    <SelectItem 
                      key={platform.value} 
                      value={platform.value} 
                      className="text-slate-100 focus:bg-slate-700 py-3"
                    >
                      <div className="flex flex-col">
                        <span className="text-lg font-medium">{platform.label}</span>
                        <span className="text-sm text-slate-400">{platform.desc}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Client Name */}
          <div className="space-y-3">
            <Label htmlFor="clientName" className="text-slate-300 font-semibold text-lg flex items-center gap-2">
              <User className="w-5 h-5 text-green-400" />
              Client Name (Optional)
            </Label>
            <Input
              id="clientName"
              type="text"
              placeholder="e.g., John Smith (makes it more personal!)"
              value={formData.clientName}
              onChange={(e) => handleInputChange('clientName', e.target.value)}
              className="bg-slate-800/50 border-slate-600 text-slate-100 placeholder-slate-500 focus:border-green-500 h-12 text-lg"
            />
          </div>

          {/* Offer Description with Examples */}
          <div className="space-y-4">
            <Label htmlFor="offer" className="text-slate-300 font-semibold text-lg flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-400" />
              Your Offer Description *
            </Label>
            
            {/* Example Offers */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-4">
              <div className="text-sm text-slate-400 lg:col-span-2 mb-2">💡 Try these examples:</div>
              {offerExamples.map((example, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => useExample(example)}
                  className={`text-left p-3 rounded-xl border-2 transition-all duration-300 text-sm ${
                    selectedExample === example
                      ? 'border-purple-500 bg-purple-500/10 text-purple-300'
                      : 'border-slate-600 bg-slate-800/30 text-slate-300 hover:border-slate-500 hover:bg-slate-700/30'
                  }`}
                >
                  {example}
                </button>
              ))}
            </div>
            
            <Textarea
              id="offer"
              placeholder="Describe what you're offering... e.g., 'I help e-commerce businesses increase their conversion rates by 30% through optimized landing pages and A/B testing.'"
              value={formData.offer}
              onChange={(e) => handleInputChange('offer', e.target.value)}
              className="bg-slate-800/50 border-slate-600 text-slate-100 placeholder-slate-500 focus:border-yellow-500 min-h-[120px] resize-none text-lg leading-relaxed"
              rows={5}
            />
          </div>

          {/* Enhanced Submit Button */}
          <div className="pt-4">
            <Button
              type="submit"
              disabled={!isFormValid || isLoading}
              className={`w-full h-14 text-lg font-semibold rounded-xl transition-all duration-300 transform ${
                isFormValid && !isLoading
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white hover:scale-[1.02] shadow-lg hover:shadow-purple-500/25'
                  : 'bg-slate-700 text-slate-400 cursor-not-allowed'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>AI is crafting your messages...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-3">
                  <Wand2 className="w-6 h-6" />
                  <span>✨ Generate AI Messages</span>
                </div>
              )}
            </Button>
            
            {!isFormValid && (
              <p className="text-slate-500 text-sm mt-3 text-center">
                Please fill in all required fields to generate messages
              </p>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

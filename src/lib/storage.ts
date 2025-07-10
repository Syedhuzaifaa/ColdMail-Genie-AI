interface Message {
  id: string;
  content: string;
  platform: string;
  tone: string;
  timestamp: number;
  niche: string;
  clientName?: string;
}

const STORAGE_KEY = 'coldmail_history';
const MAX_MESSAGES = 50; // Limit to prevent localStorage from getting too large

export function saveMessage(message: Omit<Message, 'id' | 'timestamp'>): void {
  try {
    const history = getMessageHistory();
    const newMessage: Message = {
      ...message,
      id: generateId(),
      timestamp: Date.now()
    };
    
    // Add to beginning of array (most recent first)
    history.unshift(newMessage);
    
    // Keep only the most recent messages
    const trimmedHistory = history.slice(0, MAX_MESSAGES);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedHistory));
  } catch (error) {
    console.error('Failed to save message to localStorage:', error);
  }
}

export function getMessageHistory(): Message[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const history = JSON.parse(stored);
    // Sort by timestamp, most recent first
    return history.sort((a: Message, b: Message) => b.timestamp - a.timestamp);
  } catch (error) {
    console.error('Failed to get message history from localStorage:', error);
    return [];
  }
}

export function deleteMessage(messageId: string): void {
  try {
    const history = getMessageHistory();
    const filteredHistory = history.filter(msg => msg.id !== messageId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredHistory));
  } catch (error) {
    console.error('Failed to delete message from localStorage:', error);
  }
}

export function clearMessageHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear message history from localStorage:', error);
  }
}

export function exportMessageHistory(): string {
  try {
    const history = getMessageHistory();
    return JSON.stringify(history, null, 2);
  } catch (error) {
    console.error('Failed to export message history:', error);
    return '[]';
  }
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

// Utility function to get message stats
export function getMessageStats(): {
  total: number;
  byPlatform: Record<string, number>;
  byNiche: Record<string, number>;
} {
  const history = getMessageHistory();
  
  const stats = {
    total: history.length,
    byPlatform: {} as Record<string, number>,
    byNiche: {} as Record<string, number>
  };
  
  history.forEach(message => {
    // Count by platform
    stats.byPlatform[message.platform] = (stats.byPlatform[message.platform] || 0) + 1;
    
    // Count by niche
    stats.byNiche[message.niche] = (stats.byNiche[message.niche] || 0) + 1;
  });
  
  return stats;
}

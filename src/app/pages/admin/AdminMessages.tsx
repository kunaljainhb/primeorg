import { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Badge } from '@/app/components/ui/badge';
import { MessageSquare, Send, User, ChevronRight } from 'lucide-react';
import { useTranslation } from '@/app/context/LanguageContext';
import { toast } from 'sonner';

export default function AdminMessages() {
  const { t } = useTranslation();
  
  const [threads, setThreads] = useState([
    {
      id: 1,
      name: 'TechSolutions LLC',
      subtitle: t('Tender: Supply of IT Hardware for HQ'),
      unread: 0,
      time: '10:45 AM',
      lastMsg: 'Can you clarify section 4.2?',
      messages: [
        { sender: 'vendor', text: 'Hello, we have uploaded the consolidated technical specifications. Please review and let us know if you need further clarifications.', timestamp: '10:30 AM' },
        { sender: 'vendor', text: 'Can you clarify section 4.2 regarding the cloud storage requirement details?', timestamp: '10:45 AM' }
      ]
    },
    {
      id: 2,
      name: 'Modern Office Furnishings',
      subtitle: t('Tender: Office Renovation Project'),
      unread: 0,
      time: 'Yesterday',
      lastMsg: 'Thank you, we will submit shortly.',
      messages: [
        { sender: 'admin', text: 'Please ensure that the security deposits and bank guarantees are uploaded by tomorrow EOD.', timestamp: 'Yesterday, 3:15 PM' },
        { sender: 'vendor', text: 'Thank you, we will submit shortly.', timestamp: 'Yesterday, 4:00 PM' }
      ]
    },
    {
      id: 3,
      name: 'Gulf Construction Services',
      subtitle: t('Tender: Security Guard Services'),
      unread: 0,
      time: 'Yesterday',
      lastMsg: 'Do we need ISO certification?',
      messages: [
        { sender: 'vendor', text: 'Do we need ISO certification for security supervisors or just local licenses?', timestamp: 'Yesterday, 1:10 PM' }
      ]
    }
  ]);

  const [activeThreadId, setActiveThreadId] = useState(1);
  const [typedMessage, setTypedMessage] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const activeThread = threads.find(t => t.id === activeThreadId) || threads[0];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeThread.messages]);

  const handleSendMessage = () => {
    if (!typedMessage.trim()) return;

    const newMsg = {
      sender: 'admin',
      text: typedMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setThreads(prev =>
      prev.map(thread => {
        if (thread.id === activeThreadId) {
          return {
            ...thread,
            lastMsg: typedMessage,
            time: 'Just now',
            messages: [...thread.messages, newMsg]
          };
        }
        return thread;
      })
    );

    setTypedMessage('');

    // Trigger mock response
    setTimeout(() => {
      const responseMsg = {
        sender: 'vendor',
        text: 'Thank you for the update. We appreciate the fast feedback and will compile any additional documentation immediately.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setThreads(prev =>
        prev.map(thread => {
          if (thread.id === activeThreadId) {
            return {
              ...thread,
              lastMsg: responseMsg.text,
              time: 'Just now',
              messages: [...thread.messages, responseMsg]
            };
          }
          return thread;
        })
      );
      toast.info('New message received from ' + activeThread.name);
    }, 2000);
  };

  return (
    <div className="h-[calc(100vh-140px)] min-h-[500px] flex flex-col font-sans max-w-6xl mx-auto text-start">
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <MessageSquare className="h-7 w-7 text-[var(--prime-primary-green)]" />
          {t('Messages')}
        </h1>
        <p className="text-sm text-gray-500 mt-1">{t('Procurement Communications and Clarification Center')}</p>
      </div>

      <div className="flex-1 flex border border-gray-200/80 rounded-2xl overflow-hidden bg-white shadow-xs">
        {/* Left Column: Thread List */}
        <div className="w-full sm:w-[320px] md:w-[360px] border-r border-gray-150 flex flex-col shrink-0">
          <div className="p-4 bg-gray-50/50 border-b border-gray-150/70">
            <h2 className="font-bold text-gray-800 text-sm tracking-wide uppercase">{t('Vendor Chats')}</h2>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
            {threads.map(thread => (
              <div
                key={thread.id}
                onClick={() => setActiveThreadId(thread.id)}
                className={`p-4 cursor-pointer hover:bg-gray-55/70 transition-colors flex items-start justify-between gap-3 ${
                  thread.id === activeThreadId ? 'bg-gradient-to-r from-[var(--prime-primary-green)]/[0.04] to-transparent border-l-4 border-l-[var(--prime-primary-green)] rtl:border-l-0 rtl:border-r-4 rtl:border-r-[var(--prime-primary-green)]' : ''
                }`}
              >
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="font-bold text-sm text-gray-900 truncate">
                    {thread.name}
                  </div>
                  <div className="text-[11px] font-semibold text-gray-400 truncate">
                    {thread.subtitle}
                  </div>
                  <div className="text-xs text-gray-500 truncate font-normal">
                    {thread.lastMsg}
                  </div>
                </div>
                <div className="text-right shrink-0 flex flex-col items-end gap-1.5">
                  <span className="text-[10px] text-gray-400 font-semibold">{thread.time}</span>
                  {thread.unread > 0 && (
                    <Badge className="h-5 min-w-5 rounded-full px-1.5 text-[10px] flex items-center justify-center font-bold" style={{ backgroundColor: 'var(--prime-primary-green)', color: 'white' }}>
                      {thread.unread}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Chat Window */}
        <div className="flex-1 hidden sm:flex flex-col bg-gray-50/30">
          {/* Active Chat Header */}
          <div className="p-4 border-b border-gray-150 bg-white flex items-center justify-between shrink-0">
            <div>
              <div className="font-bold text-gray-900 text-base">{activeThread.name}</div>
              <div className="text-xs font-semibold text-gray-400 mt-0.5">{activeThread.subtitle}</div>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4">
            {activeThread.messages.map((msg, index) => {
              const isMe = msg.sender === 'admin';
              return (
                <div
                  key={index}
                  className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-end gap-2 max-w-[75%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 shadow-3xs ${isMe ? 'bg-[var(--prime-primary-green)] text-white' : 'bg-gray-200 text-gray-600'}`}>
                      {isMe ? 'A' : 'V'}
                    </div>
                    <div className="space-y-1">
                      <div
                        className={`p-3.5 rounded-2xl text-sm leading-relaxed shadow-3xs ${
                          isMe
                            ? 'bg-[var(--prime-primary-green)] text-white rounded-br-none'
                            : 'bg-white text-gray-800 rounded-bl-none border border-gray-150'
                        }`}
                      >
                        {msg.text}
                      </div>
                      <div className={`text-[9px] text-gray-450 font-semibold ${isMe ? 'text-right' : 'text-left'}`}>
                        {msg.timestamp}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={chatEndRef} />
          </div>

          {/* Composer */}
          <div className="p-4 border-t border-gray-150 bg-white flex gap-3 items-center shrink-0">
            <Input
              type="text"
              placeholder={t('Type a message...')}
              value={typedMessage}
              onChange={e => setTypedMessage(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 focus-visible:ring-[var(--prime-primary-green)] bg-gray-50/50"
            />
            <Button
              onClick={handleSendMessage}
              className="bg-[var(--prime-primary-green)] hover:bg-[var(--prime-primary-green)]/90 text-white cursor-pointer px-4"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

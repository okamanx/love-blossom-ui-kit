import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { MessageCircle, Send, ArrowLeft, Search, Plus } from 'lucide-react';
import BottomNavigation from '@/components/BottomNavigation';
import ProfileHeader from '@/components/ProfileHeader';
import { useNavigate, useSearchParams } from 'react-router-dom';

interface Profile {
  user_id: string;
  name: string | null;
  username: string | null;
  avatar_url: string | null;
}

interface Conversation {
  id: string;
  participant_1: string;
  participant_2: string;
  updated_at: string;
  other_user: Profile;
  last_message?: {
    content: string;
    created_at: string;
    sender_id: string;
  };
}

interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

const Messages = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading_conversations, setLoadingConversations] = useState(true);
  const [loading_messages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Profile[]>([]);
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/');
      return;
    }

    if (user) {
      fetchConversations();
      
      // Check if we need to start a conversation with a specific user
      const targetUserId = searchParams.get('user');
      if (targetUserId) {
        createOrFindConversation(targetUserId);
      }
    }
  }, [user, loading, navigate, searchParams]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation);
      
      // Set up real-time subscription for messages
      const channel = supabase
        .channel('messages')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `conversation_id=eq.${selectedConversation}`
          },
          (payload) => {
            setMessages(prev => [...prev, payload.new as Message]);
            scrollToBottom();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversations = async () => {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          messages (
            content,
            created_at,
            sender_id
          )
        `)
        .or(`participant_1.eq.${user?.id},participant_2.eq.${user?.id}`)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error fetching conversations:', error);
        return;
      }

      // Fetch other user details for each conversation
      const conversationsWithUsers = await Promise.all(
        (data || []).map(async (conv) => {
          const otherUserId = conv.participant_1 === user?.id ? conv.participant_2 : conv.participant_1;
          
          const { data: profile } = await supabase
            .from('profiles')
            .select('user_id, name, username, avatar_url')
            .eq('user_id', otherUserId)
            .single();

          const lastMessage = conv.messages?.[conv.messages.length - 1];

          return {
            ...conv,
            other_user: profile,
            last_message: lastMessage
          };
        })
      );

      setConversations(conversationsWithUsers);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoadingConversations(false);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    setLoadingMessages(true);
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        return;
      }

      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoadingMessages(false);
    }
  };

  const createOrFindConversation = async (otherUserId: string) => {
    try {
      // Check if conversation already exists
      const { data: existingConv } = await supabase
        .from('conversations')
        .select('id')
        .or(`and(participant_1.eq.${user?.id},participant_2.eq.${otherUserId}),and(participant_1.eq.${otherUserId},participant_2.eq.${user?.id})`)
        .single();

      if (existingConv) {
        setSelectedConversation(existingConv.id);
        return;
      }

      // Create new conversation
      const { data: newConv, error } = await supabase
        .from('conversations')
        .insert({
          participant_1: user?.id,
          participant_2: otherUserId
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating conversation:', error);
        toast({
          title: 'Error',
          description: 'Failed to start conversation',
          variant: 'destructive'
        });
        return;
      }

      setSelectedConversation(newConv.id);
      fetchConversations();
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || !user) return;

    setSending(true);
    try {
      // Simple encryption (Base64 encoding for demonstration)
      const encryptedContent = btoa(newMessage.trim());

      const { error } = await supabase
        .from('messages')
        .insert({
          conversation_id: selectedConversation,
          sender_id: user.id,
          content: encryptedContent
        });

      if (error) {
        console.error('Error sending message:', error);
        toast({
          title: 'Error',
          description: 'Failed to send message',
          variant: 'destructive'
        });
        return;
      }

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const searchUsers = async (term: string) => {
    if (!term.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('user_id, name, username, avatar_url')
        .neq('user_id', user?.id)
        .or(`name.ilike.%${term}%,username.ilike.%${term}%`)
        .limit(10);

      if (error) {
        console.error('Error searching users:', error);
        return;
      }

      setSearchResults(data || []);
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  const decryptMessage = (encryptedContent: string): string => {
    try {
      return atob(encryptedContent);
    } catch {
      return encryptedContent; // Return as-is if decryption fails
    }
  };

  const getInitials = (name: string | null) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading || loading_conversations) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-soft pb-20">
      <ProfileHeader />
      
      <div className="pt-20 px-4 max-w-4xl mx-auto">
        {!selectedConversation ? (
          // Conversations List
          <div>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <MessageCircle className="w-6 h-6 text-primary" />
                Messages
              </h1>
              <Button
                onClick={() => setShowSearch(!showSearch)}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                New Chat
              </Button>
            </div>

            {/* Search */}
            {showSearch && (
              <Card className="mb-6 bg-card/80 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Search users by name or username..."
                        value={searchTerm}
                        onChange={(e) => {
                          setSearchTerm(e.target.value);
                          searchUsers(e.target.value);
                        }}
                        className="pl-10"
                      />
                    </div>
                    
                    {searchResults.length > 0 && (
                      <div className="space-y-2">
                        {searchResults.map((profile) => (
                          <div
                            key={profile.user_id}
                            onClick={() => {
                              createOrFindConversation(profile.user_id);
                              setShowSearch(false);
                              setSearchTerm('');
                              setSearchResults([]);
                            }}
                            className="flex items-center gap-3 p-3 rounded-lg bg-background/50 hover:bg-background/80 cursor-pointer transition-colors"
                          >
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={profile.avatar_url || ''} />
                              <AvatarFallback className="bg-gradient-romantic text-white">
                                {getInitials(profile.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{profile.name || 'Anonymous'}</p>
                              {profile.username && (
                                <p className="text-sm text-muted-foreground">@{profile.username}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Conversations */}
            <div className="space-y-2">
              {conversations.length === 0 ? (
                <div className="text-center py-12">
                  <MessageCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                  <h3 className="text-xl font-medium mb-2 text-muted-foreground">No conversations yet</h3>
                  <p className="text-muted-foreground">Start a new conversation to connect with others!</p>
                </div>
              ) : (
                conversations.map((conversation) => (
                  <Card
                    key={conversation.id}
                    onClick={() => setSelectedConversation(conversation.id)}
                    className="bg-card/80 backdrop-blur-sm hover:bg-card cursor-pointer transition-colors"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={conversation.other_user?.avatar_url || ''} />
                          <AvatarFallback className="bg-gradient-romantic text-white">
                            {getInitials(conversation.other_user?.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold">
                              {conversation.other_user?.name || 'Anonymous'}
                            </h3>
                            {conversation.last_message && (
                              <span className="text-xs text-muted-foreground">
                                {formatTime(conversation.last_message.created_at)}
                              </span>
                            )}
                          </div>
                          {conversation.other_user?.username && (
                            <p className="text-sm text-muted-foreground">@{conversation.other_user.username}</p>
                          )}
                          {conversation.last_message && (
                            <p className="text-sm text-muted-foreground truncate mt-1">
                              {decryptMessage(conversation.last_message.content)}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        ) : (
          // Chat View
          <div className="h-[calc(100vh-10rem)] flex flex-col">
            {/* Chat Header */}
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border/50">
              <Button
                onClick={() => setSelectedConversation(null)}
                variant="ghost"
                size="sm"
                className="p-2"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <Avatar className="w-10 h-10">
                <AvatarImage src={conversations.find(c => c.id === selectedConversation)?.other_user?.avatar_url || ''} />
                <AvatarFallback className="bg-gradient-romantic text-white">
                  {getInitials(conversations.find(c => c.id === selectedConversation)?.other_user?.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">
                  {conversations.find(c => c.id === selectedConversation)?.other_user?.name || 'Anonymous'}
                </h3>
                {conversations.find(c => c.id === selectedConversation)?.other_user?.username && (
                  <p className="text-sm text-muted-foreground">
                    @{conversations.find(c => c.id === selectedConversation)?.other_user?.username}
                  </p>
                )}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto mb-4 space-y-3">
              {loading_messages ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No messages yet. Start the conversation!</p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender_id === user.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] p-3 rounded-lg ${
                        message.sender_id === user.id
                          ? 'bg-gradient-romantic text-white'
                          : 'bg-card border'
                      }`}
                    >
                      <p>{decryptMessage(message.content)}</p>
                      <p className={`text-xs mt-1 ${
                        message.sender_id === user.id ? 'text-white/70' : 'text-muted-foreground'
                      }`}>
                        {formatTime(message.created_at)}
                      </p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="flex gap-2">
              <Textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 min-h-[40px] max-h-[120px] resize-none"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
              />
              <Button
                onClick={sendMessage}
                disabled={sending || !newMessage.trim()}
                className="bg-gradient-romantic hover:bg-gradient-romantic/90 text-white"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Messages;
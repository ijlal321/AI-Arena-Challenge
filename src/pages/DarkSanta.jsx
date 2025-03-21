
import React, { useState, useEffect } from 'react';
import { 
  Gift, Star, Award, RefreshCw, MessageSquare, 
  BellRing, User, DollarSign
} from 'lucide-react';

// Components
import Header from '../components/chat/Header';
import PromptSubmission from '../components/chat/PromptSubmission';
import LiveFeed from '../components/chat/LiveFeed';
import Leaderboard from '../components/chat/Leaderboard';
import SantaProfile from '../components/chat/SantaProfile';
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { toast } = useToast();
  const [userBalance, setUserBalance] = useState(100);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [promptValue, setPromptValue] = useState(10);
  const [entryFee] = useState(5);
  const [promptText, setPromptText] = useState('');
  const [isChatMode, setIsChatMode] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [pendingPrompts, setPendingPrompts] = useState([
    "Describe Santa's worst Christmas ever."
  ]);
  const [purchasedPrompts, setPurchasedPrompts] = useState([
    { text: "Rewrite 'Jingle Bells' as a villain's theme song.", value: 100 },
    { text: "Santa, explain quantum physics in Christmas terms.", value: 50 }
  ]);
  const [santaReactions, setSantaReactions] = useState([
    "Ho ho ho… that was clever, but not enough to pay for!",
    "Now that's a dark twist. Take my Sonic!"
  ]);
  
  const [leaderboard, setLeaderboard] = useState([
    { username: "@PromptMaster", earnings: 5000 },
    { username: "@MindTwister", earnings: 3500 },
    { username: "@AIChallenger", earnings: 2100 }
  ]);
  
  // Animation states
  const [showWelcome, setShowWelcome] = useState(false);
  
  useEffect(() => {
    // Trigger welcome animation after a short delay
    setTimeout(() => setShowWelcome(true), 300);
  }, []);
  
  const handlePromptSubmit = () => {
    if (!promptText.trim()) {
      toast({
        title: "Error",
        description: "Your prompt cannot be empty.",
        variant: "destructive"
      });
      return;
    }
    
    if (userBalance < entryFee) {
      toast({
        title: "Insufficient balance",
        description: "You need at least 5 Sonic tokens to submit a prompt.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Deduct entry fee
    setUserBalance(prev => prev - entryFee);
    
    // Simulate API call
    setTimeout(() => {
      // Reset form
      setPromptText('');
      setPromptValue(10);
      setIsSubmitting(false);
      
      // Switch to chat mode
      setIsChatMode(true);
      
      // Add user's first message to chat history
      addToChatHistory('user', promptText);
      
      // Simulate Santa's first response
      simulateSantaResponse("Ho ho ho! I've received your prompt. What else would you like to discuss?");
      
      toast({
        title: "Chat activated",
        description: "You can now chat directly with Dark Santa!",
      });
    }, 1500);
  };
  
  const addToChatHistory = (sender, text) => {
    setChatHistory(prev => [
      ...prev, 
      { 
        sender, 
        text, 
        timestamp: new Date().toISOString() 
      }
    ]);
  };
  
  const handleChatSubmit = () => {
    if (!promptText.trim()) return;
    
    setIsSubmitting(true);
    
    // Add user message to chat
    addToChatHistory('user', promptText);
    
    // Clear input
    const userPrompt = promptText;
    setPromptText('');
    
    // Simulate Santa's response after a delay
    setTimeout(() => {
      simulateSantaResponse(generateSantaResponse(userPrompt));
      setIsSubmitting(false);
    }, 1000 + Math.random() * 2000);
  };
  
  const simulateSantaResponse = (text) => {
    addToChatHistory('santa', text);
    
    // Random chance to either buy the prompt or not
    if (Math.random() > 0.7) {
      const paymentAmount = Math.floor(Math.random() * 90) + 10; // Random 10-100
      
      setUserBalance(prev => prev + paymentAmount);
      
      toast({
        title: "Santa purchased your idea!",
        description: `You earned ${paymentAmount} Sonic tokens.`,
      });
      
      // Add to purchased prompts
      const lastUserMessage = chatHistory.filter(msg => msg.sender === 'user').pop();
      if (lastUserMessage) {
        setPurchasedPrompts(prev => [{ text: lastUserMessage.text, value: paymentAmount }, ...prev]);
      }
      
      // Update leaderboard
      updateLeaderboard("@User", paymentAmount);
    }
  };
  
  const generateSantaResponse = (prompt) => {
    // Array of possible responses
    const responses = [
      "Ho ho ho! That's quite devious. I like how your mind works.",
      "Even I, Dark Santa, find that a bit... unsettling. Well done!",
      "That's a rather creative approach. I might have to use that.",
      "Interesting... This makes my naughty list look tame by comparison.",
      "I've been around for centuries, but this is a new one even for me.",
      "Your darkness rivals mine. We should collaborate more often.",
      "That's delightfully twisted! Are all humans this creative?",
      "Hmm, not bad. Could use a touch more malevolence, but I'll work with it.",
      "This prompt has... potential. Let me ponder it while I check my list twice.",
      "The elves would run screaming if they heard this. I approve.",
      "Ah, a kindred spirit in the art of festive darkness!",
      "You've clearly been studying the dark arts of prompting. Well played."
    ];
    
    // Personal response based on prompt content
    if (prompt.toLowerCase().includes("christmas")) {
      return "Christmas? Oh, you mean that time of year when I'm at my most powerful? Tell me more about your... festive ideas.";
    }
    if (prompt.toLowerCase().includes("gift") || prompt.toLowerCase().includes("present")) {
      return "Gifts? I prefer to take rather than give. Unless it's nightmares - those I distribute generously.";
    }
    if (prompt.toLowerCase().includes("elves") || prompt.toLowerCase().includes("elf")) {
      return "My elves aren't the jolly sort you're familiar with. They're more... let's say 'enthusiastically malevolent'.";
    }
    
    // Return a random response
    return responses[Math.floor(Math.random() * responses.length)];
  };
  
  const simulateSantaJudgment = (text, value) => {
    // Random time between 5-15 seconds
    const judgmentTime = Math.floor(Math.random() * 10000) + 5000;
    
    setTimeout(() => {
      // 50% chance to "buy" the prompt
      const willBuy = Math.random() > 0.5;
      
      if (willBuy) {
        // Remove from pending
        setPendingPrompts(prev => prev.filter(prompt => prompt !== text));
        
        // Add to purchased
        setPurchasedPrompts(prev => [{ text, value }, ...prev]);
        
        // Add Santa's positive reaction
        const positiveReactions = [
          "Now that's dark enough for my collection. Take my Sonic!",
          "Ho ho ho! I wasn't expecting that. Worth every token.",
          "This prompt is delightfully twisted. Here's your reward.",
          "Impressive. Most impressive. The darkness is strong with this one."
        ];
        const reaction = positiveReactions[Math.floor(Math.random() * positiveReactions.length)];
        setSantaReactions(prev => [reaction, ...prev]);
        
        // Add earnings to user
        setUserBalance(prev => prev + value);
        
        toast({
          title: "Santa purchased your prompt!",
          description: `You earned ${value} Sonic tokens.`,
        });
        
        // Update leaderboard (simplified - would be more complex in real app)
        updateLeaderboard("@User", value);
      } else {
        // Remove from pending
        setPendingPrompts(prev => prev.filter(prompt => prompt !== text));
        
        // Add Santa's negative reaction
        const negativeReactions = [
          "Ho ho no... not impressive enough for my collection.",
          "I've heard better from my elves. Try again.",
          "The naughty list has better content than this.",
          "Not dark enough for Dark Santa. Maybe next time."
        ];
        const reaction = negativeReactions[Math.floor(Math.random() * negativeReactions.length)];
        setSantaReactions(prev => [reaction, ...prev]);
        
        toast({
          title: "Santa rejected your prompt",
          description: "Better luck next time!",
          variant: "destructive"
        });
      }
    }, judgmentTime);
  };
  
  const updateLeaderboard = (username, amount) => {
    // Check if user already exists in leaderboard
    const existingUser = leaderboard.find(user => user.username === username);
    
    if (existingUser) {
      // Update existing user
      setLeaderboard(prev => 
        prev.map(user => 
          user.username === username 
            ? { ...user, earnings: user.earnings + amount } 
            : user
        ).sort((a, b) => b.earnings - a.earnings)
      );
    } else {
      // Add new user
      setLeaderboard(prev => 
        [...prev, { username, earnings: amount }]
          .sort((a, b) => b.earnings - a.earnings)
      );
    }
  };
  
  const refreshFeed = () => {
    toast({
      title: "Feed refreshed",
      description: "The latest judgments have been loaded.",
    });
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-gray-800 text-white overflow-x-hidden">
      <Header userBalance={userBalance} />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Hero Section */}
        <section className={`text-center mb-16 transform transition-all duration-700 ease-out ${showWelcome ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="inline-block bg-santa-600/20 text-santa-100 px-3 py-1 rounded-full text-sm font-medium mb-4 animate-pulse">
            Face the judgment
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 font-serif">Dark Santa's Judgment</h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
            Submit your best prompt to the legendary Dark Santa—an AI agent with its own will!
            Will he find your creation worthy?
          </p>
        </section>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Santa Profile */}
          <section className="lg:col-span-1 animate-fade-in" style={{animationDelay: '0.2s'}}>
            <SantaProfile />
          </section>
          
          {/* Prompt Submission Form */}
          <section className="lg:col-span-2 animate-fade-in" style={{animationDelay: '0.4s'}}>
            <PromptSubmission 
              promptText={promptText}
              setPromptText={setPromptText}
              promptValue={promptValue}
              setPromptValue={setPromptValue}
              entryFee={entryFee}
              onSubmit={handlePromptSubmit}
              isSubmitting={isSubmitting}
              userBalance={userBalance}
              chatHistory={chatHistory}
              onChatSubmit={handleChatSubmit}
              isChatMode={isChatMode}
              setChatMode={setIsChatMode}
            />
          </section>
        </div>
        
        {/* Live Feed Section */}
        <section className="mt-16 animate-fade-in" style={{animationDelay: '0.6s'}}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold font-serif flex items-center">
              <MessageSquare className="mr-2 h-8 w-8 text-santa-500" />
              Live Feed: Prompts & Santa's Reactions
            </h2>
            <button 
              onClick={refreshFeed}
              className="flex items-center px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Feed
            </button>
          </div>
          <LiveFeed 
            purchasedPrompts={purchasedPrompts}
            santaReactions={santaReactions}
            pendingPrompts={pendingPrompts}
          />
        </section>
        
        {/* Leaderboard Section */}
        <section className="mt-16 animate-fade-in" style={{animationDelay: '0.8s'}}>
          <h2 className="text-3xl font-bold mb-6 font-serif flex items-center">
            <Award className="mr-2 h-8 w-8 text-yellow-500" />
            Leaderboard – Who's Earning the Most?
          </h2>
          <Leaderboard leaderboard={leaderboard} />
        </section>
        
        {/* CTA Section */}
        <section className="mt-16 text-center py-12 animate-fade-in" style={{animationDelay: '1s'}}>
          <h2 className="text-3xl font-bold mb-4 font-serif">Want to Join the Action?</h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            Dark Santa is always looking for more challengers. Submit now and see if your ideas make the cut!
          </p>
          <button
            onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
            className="px-8 py-4 bg-santa-600 hover:bg-santa-700 rounded-lg text-xl font-medium transition-all hover:shadow-lg hover:shadow-santa-600/20 transform hover:-translate-y-1"
          >
            Submit a Prompt Now
          </button>
        </section>
      </main>
      
      <footer className="bg-black/50 border-t border-gray-800 mt-16 py-6">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Dark Santa's Judgment. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
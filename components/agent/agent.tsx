import { useState, useEffect } from 'react';
import { useChatBot } from '@/context/ChatBotContext';
import { useCytoscape } from '@/context/CytoscapeContext';
import supabase from '@/utils/supabase';

export default function Agent(){
    const chatbot = useChatBot();
    const cyInstance = useCytoscape();
    const cy = cyInstance?.cyInstance;
    
}

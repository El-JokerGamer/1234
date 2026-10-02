import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://asvhpyfzdtzuygoivcmd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzdmhweWZ6ZHR6dXlnb2l2Y21kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA4OTI4NTIsImV4cCI6MjEwNjQ2ODg1Mn0.gVd7lXdqnDSlpXzRbMNRBbjavR5CGNqsyQd1Jm52Qg4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// Helper to get device fingerprint
export function getDeviceFingerprint(): string {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('eclesiar-fp', 2, 2);
  }
  
  const data = [
    navigator.userAgent,
    navigator.language,
    screen.width + 'x' + screen.height,
    screen.colorDepth,
    new Date().getTimezoneOffset(),
    canvas.toDataURL(),
  ].join('|');
  
  // Simple hash
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  
  return 'fp_' + Math.abs(hash).toString(36);
}

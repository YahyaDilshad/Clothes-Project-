import { MessageCircle } from 'lucide-react';
import { WHATSAPP_LINK } from '../utils/constants.js';

export default function WhatsAppButton() {
  return (
    <a
      href={WHATSAPP_LINK}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-5 left-5 z-40 bg-[#25D366] text-white w-14 h-14 rounded-full shadow-xl flex items-center justify-center hover:scale-105 transition-transform"
    >
      <MessageCircle size={26} fill="white" strokeWidth={0} />
    </a>
  );
}

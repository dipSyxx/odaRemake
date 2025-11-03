import { MessageCircle } from "lucide-react";

export function HomeChatButton() {
  return (
    <button className="fixed bottom-6 right-6 lg:bottom-8 lg:right-8 bg-[#ff9500] hover:bg-[#e68600] text-white rounded-full p-3 lg:p-4 shadow-lg transition-transform hover:scale-110 z-40">
      <MessageCircle className="h-5 w-5 lg:h-6 lg:w-6" />
    </button>
  );
}

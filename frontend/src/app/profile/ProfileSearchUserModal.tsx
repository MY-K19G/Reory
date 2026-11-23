'use client';

import React from 'react';
import { Search, MessageSquare, Send } from 'lucide-react';
import { FriendUser, ChatMessage } from './types';

// ======================== SEARCH USERS MODAL ========================
interface ProfileSearchUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  userSearchQuery: string;
  setUserSearchQuery: (q: string) => void;
  friendsList: FriendUser[];
  discoverableUsers: FriendUser[];
  onSelectUser: (user: FriendUser) => void;
  onOpenChat: (user: FriendUser) => void;
  onToggleFollow: (user: FriendUser) => void;
}

export const ProfileSearchUserModal: React.FC<ProfileSearchUserModalProps> = ({
  isOpen,
  onClose,
  userSearchQuery,
  setUserSearchQuery,
  friendsList,
  discoverableUsers,
  onSelectUser,
  onOpenChat,
  onToggleFollow,
}) => {
  if (!isOpen) return null;

  const query = userSearchQuery.toLowerCase().trim();
  const allAvailable = [
    ...friendsList,
    ...discoverableUsers.filter((u) => !friendsList.some((f) => f.id === u.id)),
  ];
  const filtered = allAvailable.filter(
    (u) =>
      !query ||
      u.name.toLowerCase().includes(query) ||
      u.username.toLowerCase().includes(query) ||
      u.lang.toLowerCase().includes(query)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-[#181a24] border border-white/10 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4 my-8 max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Search className="w-4 h-4 text-cyan-400" />
            Find &amp; Connect with Friends
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors cursor-pointer text-xs font-semibold"
          >
            ✕
          </button>
        </div>

        {/* Search Input Box */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={userSearchQuery}
            onChange={(e) => setUserSearchQuery(e.target.value)}
            placeholder="Search learners by name or @username..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-black/40 border border-white/10 text-white text-xs font-semibold placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
            autoFocus
          />
        </div>

        {/* User Results List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar min-h-[220px]">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <Search className="w-8 h-8 text-slate-600 mb-2" />
              <p className="text-xs font-semibold text-slate-400">No learners found</p>
              <p className="text-[11px] text-slate-600 mt-0.5">
                Try searching for &quot;Sakura&quot;, &quot;Jin&quot;, or &quot;Japanese&quot;
              </p>
            </div>
          ) : (
            filtered.map((user) => {
              const isFollowed = friendsList.some((f) => f.id === user.id);
              return (
                <div
                  key={user.id}
                  onClick={() => onSelectUser(user)}
                  className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 hover:border-cyan-500/30 transition-all cursor-pointer group"
                  title={`View ${user.name}'s profile`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover border border-white/10 shadow-sm group-hover:scale-105 transition-transform"
                      />
                      <span
                        className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border border-black ${
                          user.status === 'online'
                            ? 'bg-emerald-400'
                            : user.status === 'studying'
                            ? 'bg-amber-400'
                            : 'bg-slate-500'
                        }`}
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors">
                          {user.name}
                        </span>
                        <span className="text-[10px] text-slate-400">@{user.username}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        Learning {user.lang} • <span className="text-amber-400">🔥 {user.streak}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-2" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => onSelectUser(user)}
                      className="px-3 py-1.5 rounded-full text-xs font-semibold bg-white/10 hover:bg-white/20 text-slate-200 transition-all cursor-pointer"
                    >
                      Profile
                    </button>
                    {isFollowed && (
                      <button
                        type="button"
                        onClick={() => onOpenChat(user)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-xs font-bold transition-colors cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Chat</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => onToggleFollow(user)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        isFollowed
                          ? 'bg-white/10 text-slate-300 hover:bg-rose-500/20 hover:text-rose-300'
                          : 'bg-white text-black hover:bg-slate-200'
                      }`}
                    >
                      {isFollowed ? 'Following' : '+ Follow'}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

// ======================== CHAT MODAL DIALOG ========================
interface ProfileChatDialogProps {
  friend: FriendUser | null;
  onClose: () => void;
  messages: ChatMessage[];
  chatDraftText: string;
  setChatDraftText: (text: string) => void;
  onSendMessage: () => void;
}

export const ProfileChatDialog: React.FC<ProfileChatDialogProps> = ({
  friend,
  onClose,
  messages,
  chatDraftText,
  setChatDraftText,
  onSendMessage,
}) => {
  if (!friend) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-[#141722] border border-white/10 rounded-3xl max-w-md w-full shadow-2xl flex flex-col h-[520px] overflow-hidden">
        {/* Chat Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-[#181a24]">
          <div className="flex items-center gap-3">
            <div className="relative shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={friend.avatar}
                alt={friend.name}
                className="w-10 h-10 rounded-full object-cover border border-white/10 shadow-sm"
              />
              <span
                className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border border-black ${
                  friend.status === 'online'
                    ? 'bg-emerald-400'
                    : friend.status === 'studying'
                    ? 'bg-amber-400'
                    : 'bg-slate-500'
                }`}
              />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white leading-tight">{friend.name}</h4>
              <p className="text-[10px] text-slate-400">
                @{friend.username} • {friend.lang} Study Partner
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors cursor-pointer text-xs font-semibold p-1.5"
          >
            ✕
          </button>
        </div>

        {/* Chat Messages Body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#0d0f16]/60">
          {messages.map((msg) => {
            const isMe = msg.sender === 'me';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} space-y-1`}
              >
                <div
                  className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-xs ${
                    isMe
                      ? 'bg-cyan-600 text-white rounded-tr-xs'
                      : 'bg-[#1e2230] text-slate-200 border border-white/5 rounded-tl-xs'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[9px] text-slate-500 px-1">{msg.time}</span>
              </div>
            );
          })}
        </div>

        {/* Chat Input Bar */}
        <div className="p-3 border-t border-white/10 bg-[#181a24]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={chatDraftText}
              onChange={(e) => setChatDraftText(e.target.value)}
              placeholder={`Message ${friend.name}...`}
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs font-semibold placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
              autoFocus
            />
            <button
              type="submit"
              disabled={!chatDraftText.trim()}
              className="p-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed text-white transition-all cursor-pointer shadow-sm shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
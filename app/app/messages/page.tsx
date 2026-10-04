"use client";

import { ArrowUpRight, MoreHorizontal, Paperclip, Search } from "lucide-react";
import { useMemo, useState } from "react";

const conversations = [
  {
    id: "matteo",
    name: "Matteo Conti",
    role: "Architecture · Milan",
    initials: "MC",
    unread: 2,
    time: "2m ago",
    messages: [
      { id: "m1", me: false, text: "I’ve just reviewed the private collection notes. The palette is quite sharp — very much like the first house you showed me.", time: "9:14 AM" },
      { id: "m2", me: true, text: "Perfect. I’ll send the additional references before lunch.", time: "9:17 AM" },
      { id: "m3", me: false, text: "Great. We should also keep the room warm and selective — no heavy noise, just the right people.", time: "9:19 AM" },
    ],
  },
  {
    id: "sarah",
    name: "Sarah Kim",
    role: "Philanthropy · Seoul",
    initials: "SK",
    unread: 0,
    time: "14m ago",
    messages: [
      { id: "s1", me: false, text: "The shortlist for the foundation dinner is ready. I’d like to keep it intimate and quietly ambitious.", time: "8:41 AM" },
      { id: "s2", me: true, text: "Absolutely. I’ll bring the final names by 3PM.", time: "8:46 AM" },
    ],
  },
  {
    id: "lena",
    name: "Lena Moreau",
    role: "Art & Design · Paris",
    initials: "LM",
    unread: 1,
    time: "1h ago",
    messages: [
      { id: "l1", me: false, text: "The studio visit is confirmed for Tuesday morning. We can keep the conversation to the objects, not the noise around them.", time: "Yesterday" },
    ],
  },
  {
    id: "nina",
    name: "Nina Voss",
    role: "Private Aviation · London",
    initials: "NV",
    unread: 0,
    time: "3h ago",
    messages: [
      { id: "n1", me: false, text: "I’ve arranged the airfield timing. We can leave early and avoid the usual congestion.", time: "Yesterday" },
    ],
  },
];

export default function MessagesPage() {
  const [activeId, setActiveId] = useState(conversations[0].id);

  const activeConversation = useMemo(
    () => conversations.find((conversation) => conversation.id === activeId) ?? conversations[0],
    [activeId],
  );

  return (
    <main className="utility-page messages-page">
      <header className="utility-page-header">
        <h1>Messages</h1>
        <p>Private, high-signal conversations with the people shaping your circle.</p>
      </header>

      <div className="messages-shell">
        <aside className="messages-sidebar" aria-label="Conversation list">
          <div className="messages-toolbar">
            <span className="eyebrow">Inbox</span>
            <button type="button" className="icon-button" aria-label="Search conversations">
              <Search size={14} />
            </button>
          </div>

          {conversations.map((conversation) => (
            <button
              key={conversation.id}
              type="button"
              className={`message-row ${conversation.id === activeConversation.id ? "active" : ""}`}
              onClick={() => setActiveId(conversation.id)}
            >
              <span className="message-avatar">{conversation.initials}</span>
              <span className="message-copy">
                <strong>{conversation.name}</strong>
                <small>{conversation.role}</small>
              </span>
              <span className={`message-pill ${conversation.unread ? "unread" : ""}`}>
                {conversation.unread ? `${conversation.unread} new` : conversation.time}
              </span>
            </button>
          ))}
        </aside>

        <section className="messages-panel" aria-live="polite">
          <div className="messages-panel-header">
            <div className="conversation-head">
              <span className="message-avatar large">{activeConversation.initials}</span>
              <div>
                <h2>{activeConversation.name}</h2>
                <p>{activeConversation.role}</p>
              </div>
            </div>

            <button type="button" className="icon-button" aria-label="More options">
              <MoreHorizontal size={16} />
            </button>
          </div>

          <div className="message-thread">
            {activeConversation.messages.map((message) => (
              <div key={message.id} className={`message-bubble ${message.me ? "mine" : ""}`}>
                <span>{message.text}</span>
                <small>{message.time}</small>
              </div>
            ))}
          </div>

          <form className="message-composer" onSubmit={(event) => event.preventDefault()}>
            <button type="button" className="icon-button" aria-label="Attach file">
              <Paperclip size={14} />
            </button>
            <textarea rows={1} placeholder={`Reply to ${activeConversation.name}`} aria-label={`Reply to ${activeConversation.name}`} />
            <button type="submit" className="send-button">
              Send <ArrowUpRight size={14} />
            </button>
          </form>
          <div className="message-meta-strip">
            <span>Private room</span>
            <span>Encrypted</span>
            <span>Response within 24h</span>
          </div>
        </section>
      </div>
    </main>
  );
}

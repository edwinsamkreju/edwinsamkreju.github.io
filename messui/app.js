/* Mori messenger preview — client-side demo data only. */
(function () {
  "use strict";
  const $ = (selector, root) => (root || document).querySelector(selector);
  const $$ = (selector, root) => Array.from((root || document).querySelectorAll(selector));
  const icons = {
    "message-square": '<path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5Z"/>',
    "users": '<path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="10" cy="7" r="4"/><path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
    "phone": '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7l.4 2.8a2 2 0 0 1-.6 1.7L7 10.1a16 16 0 0 0 6 6l1.9-1.9a2 2 0 0 1 1.7-.6l2.8.4a2 2 0 0 1 1.6 2Z"/>',
    "bookmark": '<path d="M6 4.5A2.5 2.5 0 0 1 8.5 2h7A2.5 2.5 0 0 1 18 4.5V22l-6-4-6 4V4.5Z"/>',
    "sliders-horizontal": '<path d="M4 21v-7m0-4V3m8 18v-9m0-4V3m8 18v-5m0-4V3M2 14h4m4-6h4m4 8h4"/>',
    "circle-help": '<circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3m.1 4h.01"/>',
    "square-pen": '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z"/>',
    "search": '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
    "arrow-down-wide-narrow": '<path d="m3 6 4 4 4-4M7 10V2m6 3h8M13 9h6m-6 4h4m-4 4h2"/>',
    "arrow-left": '<path d="m12 19-7-7 7-7M5 12h14"/>',
    "video": '<path d="m22 8-6 4 6 4V8Z"/><rect x="2" y="6" width="14" height="12" rx="2"/>',
    "panel-right": '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M15 3v18"/>',
    "ellipsis": '<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
    "smile": '<circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/>',
    "plus": '<path d="M12 5v14M5 12h14"/>',
    "mic": '<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10v2a7 7 0 0 0 14 0v-2m-7 9v3m-4 0h8"/>',
    "arrow-up": '<path d="m18 15-6-6-6 6M12 9v12"/>',
    "x": '<path d="m18 6-12 12M6 6l12 12"/>',
    "check": '<path d="m5 12 4 4L19 6"/>',
    "check-check": '<path d="m18 6-7 7-3-3M22 10l-7.5 7.5L13 16"/>',
    "pin": '<path d="m16 3 5 5-4 1-4 4-1 5-3-3-5 5 5-5-3-3 5-1 4-4 1-4Z"/>',
    "archive": '<rect x="3" y="4" width="18" height="4" rx="1"/><path d="M5 8v11a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8m-8 4h4"/>',
    "volume-x": '<path d="M11 5 6 9H3v6h3l5 4V5Zm4 4 5 6m0-6-5 6"/>',
    "image": '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/>',
    "file": '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6m-11 5h6m-6 4h6"/>',
    "link": '<path d="M10 13a5 5 0 0 0 7.1 0l3-3A5 5 0 0 0 13 2.9l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.1 0l-3 3A5 5 0 0 0 11 21.1l1.7-1.7"/>',
    "calendar": '<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    "shield-check": '<path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z"/><path d="m9 12 2 2 4-4"/>',
    "sun": '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/>',
    "moon": '<path d="M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13Z"/>',
    "sparkles": '<path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2L12 3ZM19 14l1.1 2.9L23 18l-2.9 1.1L19 22l-1.1-2.9L15 18l2.9-1.1L19 14Z"/>',
    "arrow-up-right": '<path d="M7 17 17 7M7 7h10v10"/>',
    "heart": '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"/>'
  };
  function icon(name) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (icons[name] || icons.sparkles) + '</svg>'; }
  $$("[data-icon]").forEach(function (node) { node.innerHTML = icon(node.getAttribute("data-icon")); });

  const seed = [
    { id:"mia", name:"Mia Chen", initials:"MC", tone:"avatar-rose", status:"Online now", online:true, preview:"That sounds like a plan ✨", time:"10:42", unread:2, pinned:true, group:false, saved:true, messages:[
      { id:1, who:"them", text:"Hey! I found that little place I was telling you about. The one with the garden tables 🌿", time:"10:34" },
      { id:2, who:"me", text:"Oh, the one near the old bookshop? I've been meaning to go there.", time:"10:36" },
      { id:3, who:"them", text:"Yes, exactly! Their coffee is lovely too. We should make an afternoon of it.", time:"10:39" },
      { id:4, who:"me", text:"That sounds like a plan ✨", time:"10:42", read:true }
    ], media:3 },
    { id:"studio", name:"Studio friends", initials:"SF", tone:"avatar-lilac", status:"4 members", online:false, preview:"Noah: dropped the new mockups", time:"10:28", unread:4, pinned:true, group:true, saved:false, messages:[
      { id:1, who:"them", text:"Noah: Just dropped the new mockups in the folder. Have a look when you get a chance.", time:"10:10" },
      { id:2, who:"me", text:"The direction is looking really good. Love the quieter palette.", time:"10:15", read:true },
      { id:3, who:"them", text:"Ava: Same here. The spacing feels much better now.", time:"10:20" },
      { id:4, who:"them", text:"Noah: dropped the new mockups", time:"10:28" }
    ], media:6 },
    { id:"aarav", name:"Aarav Nair", initials:"AN", tone:"avatar-sky", status:"Last seen 8 min ago", online:false, preview:"Sent you the playlist", time:"09:56", unread:0, pinned:false, group:false, saved:false, messages:[
      { id:1, who:"them", text:"Made a small playlist for the drive. A little bit of everything.", time:"09:48" },
      { id:2, who:"them", text:"Sent you the playlist 🎧", time:"09:56" }
    ], media:2 },
    { id:"family", name:"The Sunday table", initials:"ST", tone:"avatar-gold", status:"6 members", online:false, preview:"You: I'll bring dessert!", time:"Yesterday", unread:0, pinned:false, group:true, saved:true, messages:[
      { id:1, who:"them", text:"Mum: Sunday lunch at ours this week?", time:"18:12" },
      { id:2, who:"me", text:"I'll bring dessert!", time:"18:25", read:true }
    ], media:8 },
    { id:"sophie", name:"Sophie Williams", initials:"SW", tone:"avatar-mint", status:"Online now", online:true, preview:"This made me think of you haha", time:"Yesterday", unread:1, pinned:false, group:false, saved:false, messages:[
      { id:1, who:"them", text:"This made me think of you haha. Sending it immediately.", time:"17:42" }
    ], media:4 },
    { id:"dev", name:"Dev & Design", initials:"DD", tone:"avatar-blue", status:"8 members", online:false, preview:"Priya: quick check-in at 3?", time:"Mon", unread:0, pinned:false, group:true, saved:false, messages:[
      { id:1, who:"them", text:"Priya: Quick check-in at 3? Just fifteen minutes to align on the little details.", time:"15:22" },
      { id:2, who:"me", text:"Works for me.", time:"15:24", read:true }
    ], media:5 },
    { id:"leo", name:"Leo Martin", initials:"LM", tone:"avatar-sage", status:"Last seen yesterday", online:false, preview:"Perfect, see you there.", time:"Sun", unread:0, pinned:false, group:false, saved:false, messages:[
      { id:1, who:"me", text:"Let's meet by the entrance around 11.", time:"11:10", read:true },
      { id:2, who:"them", text:"Perfect, see you there.", time:"11:14" }
    ], media:1 },
    { id:"nina", name:"Nina Patel", initials:"NP", tone:"avatar-rose", status:"Last seen 2 days ago", online:false, preview:"Thank you for the notes!", time:"Sat", unread:0, pinned:false, group:false, saved:false, messages:[
      { id:1, who:"them", text:"Thank you for the notes! They made everything so much clearer.", time:"16:07" }
    ], media:2 }
  ];
  function readStore() { try { return JSON.parse(localStorage.getItem("mori-conversations") || "null"); } catch (error) { return null; } }
  const stored = readStore();
  const conversations = seed.map(function (item) {
    const saved = stored && stored[item.id];
    if (saved) return Object.assign({}, item, saved, { messages: Array.isArray(saved.messages) ? saved.messages : item.messages });
    return Object.assign({}, item, { messages: item.messages.slice() });
  });
  let activeId = "mia", activeFilter = "all", activeNav = "messages", query = "", menuChatId = null, replyTo = null;
  let dark = localStorage.getItem("mori-theme") === "dark";
  if (dark) document.body.classList.add("dark-theme");
  function persist() {
    const out = {};
    conversations.forEach(function (chat) { out[chat.id] = { messages:chat.messages, unread:chat.unread, pinned:chat.pinned, saved:chat.saved, muted:chat.muted, archived:chat.archived }; });
    try { localStorage.setItem("mori-conversations", JSON.stringify(out)); } catch (error) {}
  }
  function escapeHtml(value) { return String(value).replace(/[&<>"']/g, function (char) { return ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" })[char]; }); }
  function getActive() { return conversations.find(function (chat) { return chat.id === activeId; }) || conversations[0]; }
  function initialsFrom(name) { return name.trim().split(/\s+/).slice(0,2).map(function (part) { return part.charAt(0).toUpperCase(); }).join("") || "??"; }
  function avatar(chat) { return '<span class="avatar ' + (chat.tone || "avatar-sage") + '">' + escapeHtml(chat.initials || initialsFrom(chat.name)) + '</span>'; }
  function latestMessage(chat) { return chat.messages[chat.messages.length - 1]; }
  function updateCounts() { $("#allCount").textContent = String(conversations.filter(function (c) { return !c.archived; }).length); }
  function renderList() {
    const list = $("#conversationList");
    let items = conversations.filter(function (chat) {
      if (chat.archived) return false;
      if (activeNav === "saved" && !chat.saved) return false;
      if (activeFilter === "unread" && !chat.unread) return false;
      if (activeFilter === "groups" && !chat.group) return false;
      const haystack = (chat.name + " " + ((latestMessage(chat) || {}).text || "")).toLowerCase();
      return !query || haystack.indexOf(query.toLowerCase()) !== -1;
    });
    $("#listCaption").textContent = activeNav === "calls" ? "RECENT CALLS" : activeNav === "contacts" ? "YOUR PEOPLE" : activeNav === "saved" ? "SAVED CONVERSATIONS" : "PINNED & RECENT";
    items.sort(function (a,b) { if (activeNav === "messages" && a.pinned !== b.pinned) return a.pinned ? -1 : 1; return conversations.indexOf(a) - conversations.indexOf(b); });
    if (!items.length) {
      list.innerHTML = '<div class="empty-list"><strong>' + (activeNav === "saved" ? "Nothing saved yet" : "No conversations found") + '</strong><span>' + (query ? "Try another name or keyword." : "A little quiet in here. Start a conversation.") + '</span></div>';
      updateCounts(); return;
    }
    list.innerHTML = items.map(function (chat) {
      const last = latestMessage(chat) || { text:"Start a conversation", time:"" };
      const preview = (last.who === "me" ? '<span class="you-prefix">You: </span>' : "") + escapeHtml(last.text);
      const pin = chat.pinned ? '<span class="row-pin">' + icon("pin") + '</span>' : "";
      const unread = chat.unread ? '<span class="unread-count">' + chat.unread + '</span>' : "";
      const more = '<button class="row-more" type="button" data-chat-action="menu" data-chat-id="' + chat.id + '" aria-label="Conversation options">' + icon("ellipsis") + '</button>';
      const menu = menuChatId === chat.id ? '<div class="row-menu"><button type="button" data-chat-action="pin" data-chat-id="' + chat.id + '">' + icon("pin") + (chat.pinned ? "Unpin" : "Pin conversation") + '</button><button type="button" data-chat-action="save" data-chat-id="' + chat.id + '">' + icon("bookmark") + (chat.saved ? "Remove from saved" : "Save conversation") + '</button><button type="button" data-chat-action="mute" data-chat-id="' + chat.id + '">' + icon("volume-x") + (chat.muted ? "Unmute" : "Mute") + '</button><button type="button" data-chat-action="archive" data-chat-id="' + chat.id + '">' + icon("archive") + "Archive" + '</button></div>' : "";
      return '<article class="conversation-item ' + (chat.id === activeId ? "active" : "") + '" data-chat-id="' + chat.id + '" tabindex="0" role="button" aria-label="Open chat with ' + escapeHtml(chat.name) + '">' +
        '<div class="avatar-wrap">' + avatar(chat) + (chat.online ? '<i class="online-dot"></i>' : "") + '</div>' +
        '<div class="conversation-copy"><div class="conversation-topline"><span class="conversation-name">' + escapeHtml(chat.name) + pin + '</span><span class="conversation-time">' + escapeHtml(chat.time) + '</span></div>' +
        '<div class="conversation-preview-row"><span class="conversation-preview">' + preview + '</span>' + unread + '</div></div>' + more + menu + '</article>';
    }).join("");
    updateCounts();
  }
  function renderPersonHeader(chat) { $("#chatPerson").innerHTML = avatar(chat) + '<div class="person-copy"><div class="person-name">' + escapeHtml(chat.name) + '</div><div class="person-presence">' + (chat.online ? '<i class="presence-dot"></i>' : "") + escapeHtml(chat.status) + '</div></div>'; }
  function renderIntro(chat) { $("#chatIntro").innerHTML = '<span class="intro-avatar ' + chat.tone + '">' + escapeHtml(chat.initials) + '</span><strong>' + escapeHtml(chat.name) + '</strong><p>' + (chat.group ? "A shared space for good conversations." : "This is the beginning of your conversation.") + '</p>'; }
  function renderMessages() {
    const chat = getActive(), stream = $("#messageStream");
    if (!chat.messages.length) { stream.innerHTML = '<div class="day-divider"><span>Today</span></div><div class="empty-list"><strong>Say hello</strong><span>Your next good conversation starts here.</span></div>'; return; }
    stream.innerHTML = '<div class="day-divider"><span>TODAY</span></div>' + chat.messages.map(function (msg) {
      const mine = msg.who === "me", meta = mine ? (msg.read ? icon("check-check") : icon("check")) : "";
      const reaction = msg.reaction ? '<div class="message-reaction"><span>' + escapeHtml(msg.reaction) + '</span><button type="button" data-message-action="clear-reaction" data-message-id="' + msg.id + '" aria-label="Remove reaction">×</button></div>' : "";
      const bubble = '<div class="message-bubble">' + escapeHtml(msg.text).replace(/\n/g, "<br>") + '<button class="message-action" type="button" data-message-action="react" data-message-id="' + msg.id + '" aria-label="React with heart">' + icon("heart") + '</button></div>';
      return '<div class="message-row ' + (mine ? "mine" : "") + '" data-message-row="' + msg.id + '">' + (!mine ? '<span class="message-mini-avatar">' + escapeHtml(chat.initials) + '</span>' : "") + '<div class="message-stack">' + bubble + '<div class="message-meta">' + escapeHtml(msg.time) + meta + '</div>' + reaction + '</div></div>';
    }).join("");
    requestAnimationFrame(function () { $("#chatScroll").scrollTop = $("#chatScroll").scrollHeight; });
  }
  function renderDetails() {
    const chat = getActive(), personStatus = chat.online ? "Online now" : chat.status;
    $("#detailsContent").innerHTML =
      '<div class="details-profile">' + avatar(chat) + '<h3>' + escapeHtml(chat.name) + '</h3><p>' + (chat.group ? "Group conversation" : "Mori friend") + '</p><div class="profile-presence"><i class="presence-dot"></i>' + escapeHtml(personStatus) + '</div>' +
      '<div class="detail-actions"><button class="detail-action" type="button" data-detail-action="call"><span>' + icon("phone") + '</span>Call</button><button class="detail-action" type="button" data-detail-action="search"><span>' + icon("search") + '</span>Search</button><button class="detail-action" type="button" data-detail-action="save"><span>' + icon("bookmark") + '</span>Save</button></div></div>' +
      '<section class="detail-section"><div class="detail-section-heading"><span>Shared media</span><span>' + (chat.media || 0) + ' items</span></div><div class="shared-grid"><div class="shared-thumb">' + icon("image") + '</div><div class="shared-thumb">' + icon("image") + '</div><div class="shared-thumb">' + icon("file") + '</div></div></section>' +
      '<section class="detail-section"><div class="detail-section-heading"><span>Files & links</span><span>SEE ALL</span></div>' +
      '<div class="file-row"><span class="file-icon">' + icon("file") + '</span><div class="file-info"><strong>Project-notes.pdf</strong><span>PDF · 2.4 MB</span></div></div>' +
      '<div class="file-row"><span class="file-icon">' + icon("image") + '</span><div class="file-info"><strong>Weekend-moodboard.png</strong><span>Image · 1.8 MB</span></div></div>' +
      '<div class="detail-link">' + icon("link") + '<span>Shared links will appear here</span></div></section>' +
      '<section class="detail-section"><div class="detail-section-heading"><span>Conversation</span></div><div class="detail-link">' + icon("calendar") + '<span>Created just for this preview</span></div><div class="detail-link">' + icon("shield-check") + '<span>Local demo · No account connected</span></div></section>';
  }
  function renderAll() { const chat = getActive(); renderPersonHeader(chat); renderIntro(chat); renderMessages(); renderDetails(); renderList(); }
  function setActive(id) {
    const chat = conversations.find(function (item) { return item.id === id; });
    if (!chat) return;
    activeId = id; chat.unread = 0; menuChatId = null;
    document.body.classList.add("chat-open"); renderAll();
    $("#messageInput").focus({ preventScroll:true }); persist();
  }
  function showToast(message, symbol) {
    const region = $("#toastRegion"), node = document.createElement("div");
    node.className = "toast"; node.innerHTML = icon(symbol || "sparkles") + '<span>' + escapeHtml(message) + '</span>';
    region.appendChild(node);
    window.setTimeout(function () { node.classList.add("out"); window.setTimeout(function () { node.remove(); }, 220); }, 2600);
  }
  function formatTime() { return new Intl.DateTimeFormat("en", { hour:"2-digit", minute:"2-digit", hour12:false }).format(new Date()); }
  function sendMessage(text) {
    const chat = getActive(), clean = String(text || "").trim();
    if (!clean) return;
    chat.messages.push({ id:Date.now(), who:"me", text:clean, time:formatTime(), read:false });
    chat.time = "Now"; chat.unread = 0; $("#messageInput").value = "";
    $("#replyContext").hidden = true; replyTo = null;
    renderMessages(); renderList(); persist(); simulateReply(chat.id);
  }
  function simulateReply(chatId) {
    const chat = conversations.find(function (item) { return item.id === chatId; });
    if (!chat || chat.muted) return;
    $("#typingAvatar").textContent = chat.initials;
    $("#typingLabel").textContent = chat.name.split(" ")[0] + " is typing";
    $("#typingRow").hidden = false;
    window.setTimeout(function () {
      $("#typingRow").hidden = true;
      const response = ["Absolutely — sounds good to me!","Love that idea. Let's do it ✨","Perfect, keep me posted.","Haha, I was thinking the same thing."];
      chat.messages.push({ id:Date.now(), who:"them", text:response[Math.floor(Math.random() * response.length)], time:formatTime() });
      chat.time = "Now";
      if (activeId === chatId) renderMessages(); else chat.unread = (chat.unread || 0) + 1;
      renderList(); persist();
    }, 1500 + Math.floor(Math.random() * 800));
  }
  function openModal(title, content) {
    $("#modalTitle").textContent = title; $("#modalContent").innerHTML = content; $("#modalBackdrop").hidden = false;
    const focusable = $("input, button", $("#modalContent"));
    if (focusable) window.setTimeout(function () { focusable.focus(); }, 40);
  }
  function closeModal() { $("#modalBackdrop").hidden = true; }
  function openNewChat() {
    openModal("Start a conversation", '<form id="newChatForm"><label class="form-label" for="newChatName">Name</label><input class="modal-input" id="newChatName" name="name" maxlength="36" placeholder="e.g. Alex Morgan" required>' +
      '<label class="form-label" for="newChatNote">A little context <span style="color:#aab3ab;font-weight:400">(optional)</span></label><input class="modal-input" id="newChatNote" name="note" maxlength="70" placeholder="What are you chatting about?">' +
      '<p class="modal-note">This creates a local placeholder conversation. No invitation will be sent.</p><div class="modal-actions"><button class="secondary-action" type="button" id="cancelNewChat">Cancel</button><button class="primary-action" type="submit">Create conversation ' + icon("arrow-up-right") + '</button></div></form>');
  }
  function openSettings() {
    openModal("Preferences", '<div class="settings-row"><div class="settings-copy"><strong>Dark appearance</strong><span>A softer look for low-light moments</span></div><button class="toggle" id="themeToggle" type="button" aria-pressed="' + (dark ? "true" : "false") + '" aria-label="Toggle dark appearance"></button></div>' +
      '<div class="settings-row"><div class="settings-copy"><strong>Desktop notifications</strong><span>Preview only — notifications are not connected</span></div><button class="toggle" type="button" aria-pressed="false" data-demo-toggle="notifications"></button></div>' +
      '<div class="settings-row"><div class="settings-copy"><strong>Read receipts</strong><span>Show when a message has been read</span></div><button class="toggle" type="button" aria-pressed="true" data-demo-toggle="receipts"></button></div>' +
      '<p class="modal-note" style="margin-top:17px">Your demo messages and preferences are stored in this browser only. They are not synced to a server.</p>' +
      '<div class="modal-actions"><button class="secondary-action" type="button" id="resetDemo">Reset demo data</button><button class="primary-action" type="button" id="settingsDone">Done</button></div>');
  }
  function openProfile() {
    openModal("Your profile", '<div style="display:flex;align-items:center;gap:13px;margin-bottom:18px">' + avatar({initials:"ES",tone:"avatar-you"}) + '<div><strong style="display:block;color:#4b5a4e;font-size:12px">Edwin Sam</strong><span style="display:block;margin-top:4px;color:#9ca69d;font-size:10px">Your personal preview profile</span></div></div>' +
      '<label class="form-label" for="profileStatus">Status message</label><input class="modal-input" id="profileStatus" maxlength="60" value="Around, and happy to chat.">' +
      '<p class="modal-note">This profile is illustrative. There is no account or presence service connected.</p><div class="modal-actions"><button class="primary-action" type="button" id="profileDone">Save profile</button></div>');
  }
  function toggleTheme() {
    dark = !dark; document.body.classList.toggle("dark-theme", dark); localStorage.setItem("mori-theme", dark ? "dark" : "light");
    const toggle = $("#themeToggle"); if (toggle) toggle.setAttribute("aria-pressed", dark ? "true" : "false");
  }
  $("#conversationSearch").addEventListener("input", function (event) { query = event.target.value.trim(); renderList(); });
  $$(".filter-chip").forEach(function (button) {
    button.addEventListener("click", function () {
      activeFilter = button.dataset.filter;
      $$(".filter-chip").forEach(function (chip) { const active = chip === button; chip.classList.toggle("active", active); chip.setAttribute("aria-selected", active ? "true" : "false"); });
      renderList();
    });
  });
  $("#conversationList").addEventListener("click", function (event) {
    const action = event.target.closest("[data-chat-action]");
    if (action) {
      event.stopPropagation();
      const chat = conversations.find(function (item) { return item.id === action.dataset.chatId; });
      if (!chat) return;
      const type = action.dataset.chatAction;
      if (type === "menu") menuChatId = menuChatId === chat.id ? null : chat.id;
      if (type === "pin") { chat.pinned = !chat.pinned; menuChatId = null; showToast(chat.pinned ? "Conversation pinned" : "Conversation unpinned", "pin"); }
      if (type === "save") { chat.saved = !chat.saved; menuChatId = null; showToast(chat.saved ? "Added to saved" : "Removed from saved", "bookmark"); }
      if (type === "mute") { chat.muted = !chat.muted; menuChatId = null; showToast(chat.muted ? "Conversation muted" : "Conversation unmuted", "volume-x"); }
      if (type === "archive") { chat.archived = true; menuChatId = null; showToast("Conversation archived", "archive"); }
      renderList(); persist(); return;
    }
    const row = event.target.closest("[data-chat-id]");
    if (row) setActive(row.dataset.chatId);
  });
  $("#conversationList").addEventListener("keydown", function (event) {
    if ((event.key === "Enter" || event.key === " ") && event.target.matches(".conversation-item")) { event.preventDefault(); setActive(event.target.dataset.chatId); }
  });
  $$("[data-nav]").forEach(function (button) {
    button.addEventListener("click", function () {
      activeNav = button.dataset.nav;
      $$("[data-nav]").forEach(function (item) { item.classList.toggle("active", item === button); });
      const titles = { messages:"Messages", contacts:"People", calls:"Calls", saved:"Saved" };
      $("#sectionTitle").innerHTML = escapeHtml(titles[activeNav]) + '<span class="heading-period">.</span>';
      $("#sectionEyebrow").textContent = activeNav === "messages" ? "YOUR SPACE" : activeNav === "contacts" ? "STAY CONNECTED" : activeNav === "calls" ? "CATCH UP" : "KEEP CLOSE";
      renderList(); if (activeNav !== "messages") showToast(titles[activeNav] + " view · preview data", "sparkles");
    });
  });
  $("#newChatButton").addEventListener("click", openNewChat);
  $("#modalClose").addEventListener("click", closeModal);
  $("#modalBackdrop").addEventListener("click", function (event) { if (event.target === $("#modalBackdrop")) closeModal(); });
  $("#modalContent").addEventListener("submit", function (event) {
    if (event.target.id !== "newChatForm") return;
    event.preventDefault();
    const name = $("#newChatName").value.trim(); if (!name) return;
    const chat = { id:"new-" + Date.now(), name:name, initials:initialsFrom(name), tone:["avatar-sky","avatar-lilac","avatar-sage","avatar-mint"][conversations.length % 4], status:"Just added", online:false, preview:$("#newChatNote").value.trim() || "Your conversation starts here", time:"Now", unread:0, pinned:false, group:false, saved:false, messages:[], media:0 };
    conversations.unshift(chat); activeNav = "messages"; activeFilter = "all"; query = ""; $("#conversationSearch").value = "";
    $$(".filter-chip").forEach(function (chip) { const yes = chip.dataset.filter === "all"; chip.classList.toggle("active", yes); chip.setAttribute("aria-selected", yes ? "true" : "false"); });
    $$("[data-nav]").forEach(function (item) { item.classList.toggle("active", item.dataset.nav === "messages"); });
    $("#sectionTitle").innerHTML = 'Messages<span class="heading-period">.</span>'; $("#sectionEyebrow").textContent = "YOUR SPACE";
    closeModal(); setActive(chat.id); persist(); showToast("Conversation created", "check");
  });
  $("#modalContent").addEventListener("click", function (event) {
    const target = event.target.closest("button"); if (!target) return;
    if (target.id === "cancelNewChat" || target.id === "settingsDone" || target.id === "profileDone") {
      if (target.id === "profileDone") showToast("Profile preview saved", "check"); closeModal();
    }
    if (target.id === "themeToggle") toggleTheme();
    if (target.dataset.demoToggle) {
      const pressed = target.getAttribute("aria-pressed") === "true";
      target.setAttribute("aria-pressed", pressed ? "false" : "true"); showToast("Preference updated for this preview", "check");
    }
    if (target.id === "resetDemo") { localStorage.removeItem("mori-conversations"); localStorage.removeItem("mori-theme"); window.location.reload(); }
  });
  $("#settingsButton").addEventListener("click", openSettings);
  $("#profileButton").addEventListener("click", openProfile);
  $("#helpButton").addEventListener("click", function () {
    openModal("A little help", '<p class="modal-note" style="margin:0 0 12px">Mori is an interactive front-end concept. You can explore the main flows without creating an account.</p>' +
      '<div class="settings-row"><div class="settings-copy"><strong>Send a message</strong><span>Type in the composer and press Enter.</span></div></div>' +
      '<div class="settings-row"><div class="settings-copy"><strong>Explore conversations</strong><span>Use filters, search and the three-dot menu.</span></div></div>' +
      '<div class="settings-row"><div class="settings-copy"><strong>Make it yours</strong><span>Try dark appearance in Preferences.</span></div></div>' +
      '<div class="modal-actions" style="margin-top:17px"><button class="primary-action" type="button" id="settingsDone">Got it</button></div>');
  });
  $("#sortButton").addEventListener("click", function () { conversations.reverse(); renderList(); showToast("Conversation order changed", "arrow-down-wide-narrow"); });
  $("#messageForm").addEventListener("submit", function (event) { event.preventDefault(); sendMessage($("#messageInput").value); });
  $("#messageInput").addEventListener("keydown", function (event) { if (event.key === "Escape") { $("#emojiPopover")?.remove(); $("#attachPopover")?.remove(); } });
  $("#messageStream").addEventListener("click", function (event) {
    const button = event.target.closest("[data-message-action]"); if (!button) return;
    const msg = getActive().messages.find(function (item) { return String(item.id) === button.dataset.messageId; }); if (!msg) return;
    if (button.dataset.messageAction === "react") msg.reaction = msg.reaction ? null : "♥ 1";
    else if (button.dataset.messageAction === "clear-reaction") msg.reaction = null;
    renderMessages(); persist();
  });
  $("#backToInbox").addEventListener("click", function () { document.body.classList.remove("chat-open"); document.body.classList.remove("show-details"); });
  $("#voiceCallButton").addEventListener("click", function () { showToast("Voice calling is a placeholder in this preview", "phone"); });
  $("#videoCallButton").addEventListener("click", function () { showToast("Video calling is a placeholder in this preview", "video"); });
  $("#detailsButton").addEventListener("click", function () { document.body.classList.toggle("show-details"); });
  $("#closeDetails").addEventListener("click", function () { document.body.classList.remove("show-details"); });
  $("#closeDetailsDesktop").addEventListener("click", function () { showToast("Details stay available in the conversation panel", "panel-right"); });
  $("#chatMenuButton").addEventListener("click", function () { menuChatId = getActive().id; renderList(); showToast("Conversation options are available in the selected chat list item.", "sparkles"); });
  $("#detailsContent").addEventListener("click", function (event) {
    const action = event.target.closest("[data-detail-action]"); if (!action) return;
    if (action.dataset.detailAction === "save") { const chat = getActive(); chat.saved = !chat.saved; persist(); showToast(chat.saved ? "Conversation saved" : "Removed from saved", "bookmark"); }
    else if (action.dataset.detailAction === "call") showToast("Calling is a placeholder in this preview", "phone");
    else if (action.dataset.detailAction === "search") { $("#conversationSearch").value = getActive().name; query = getActive().name; renderList(); document.body.classList.remove("chat-open"); $("#conversationSearch").focus(); }
  });
  function closePopovers() { $("#emojiPopover")?.remove(); $("#attachPopover")?.remove(); }
  $("#emojiButton").addEventListener("click", function () {
    closePopovers(); const pop = document.createElement("div"); pop.id = "emojiPopover"; pop.className = "emoji-popover";
    ["✨","😊","❤️","🙌","🌿","😂","👏","☀️"].forEach(function (emoji) {
      const button = document.createElement("button"); button.type = "button"; button.textContent = emoji; button.setAttribute("aria-label","Insert " + emoji);
      button.addEventListener("click", function () { $("#messageInput").value += emoji; $("#messageInput").focus(); pop.remove(); }); pop.appendChild(button);
    });
    $(".composer-wrap").appendChild(pop);
  });
  $("#attachmentButton").addEventListener("click", function () {
    closePopovers(); const pop = document.createElement("div"); pop.id = "attachPopover"; pop.className = "attach-popover";
    [{label:"Share a photo",icon:"image",msg:"📷 Photo attachment placeholder"},{label:"Share a file",icon:"file",msg:"📎 File attachment placeholder"},{label:"Share a location",icon:"pin",msg:"📍 Location attachment placeholder"}].forEach(function (item) {
      const button = document.createElement("button"); button.type = "button"; button.innerHTML = icon(item.icon) + "<span>" + item.label + "</span>";
      button.addEventListener("click", function () { sendMessage(item.msg); pop.remove(); }); pop.appendChild(button);
    });
    $(".composer-wrap").appendChild(pop);
  });
  $("#voiceNoteButton").addEventListener("click", function () { sendMessage("🎙️ Voice message · 0:08"); showToast("Sample voice note sent", "mic"); });
  $("#cancelReply").addEventListener("click", function () { replyTo = null; $("#replyContext").hidden = true; });
  document.addEventListener("click", function (event) {
    if (!event.target.closest(".composer-wrap")) closePopovers();
    if (!event.target.closest(".conversation-item") && menuChatId) { menuChatId = null; }
  });
  document.addEventListener("keydown", function (event) {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); document.body.classList.remove("chat-open"); $("#conversationSearch").focus(); $("#conversationSearch").select(); }
    if (event.key === "Escape") { closeModal(); closePopovers(); document.body.classList.remove("show-details"); }
  });
  renderAll();
})();
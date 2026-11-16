/* Mori Plus — Telegram-inspired interaction layer. Frontend demo only. */
(function () {
  "use strict";
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];
  const esc = s => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const toast = (message) => {
    const region=$("#toastRegion"); if(!region) return;
    const node=document.createElement("div"); node.className="toast mori-plus-toast"; node.innerHTML='<span>✦</span><span>'+esc(message)+'</span>';
    region.append(node); setTimeout(()=>{node.classList.add("out");setTimeout(()=>node.remove(),240)},2300);
  };
  let replyText="", pinnedText="";
  const pinBar=document.createElement("button");
  pinBar.type="button"; pinBar.className="mori-pin-banner"; pinBar.hidden=true;
  pinBar.innerHTML='<span class="mori-pin-icon">⌁</span><span class="mori-pin-copy"><b>Pinned message</b><small></small></span><span class="mori-pin-close" aria-hidden="true">×</span>';
  $(".chat-header")?.after(pinBar);
  pinBar.addEventListener("click",()=>{const row=$("[data-message-row] .message-bubble");if(row)row.scrollIntoView({behavior:"smooth",block:"center"});});
  function decorateMessages(){
    $$(".message-row").forEach(row=>{
      if(row.querySelector(".mori-message-tools")) return;
      const bubble=row.querySelector(".message-bubble"); if(!bubble)return;
      const tools=document.createElement("div"); tools.className="mori-message-tools";
      tools.innerHTML='<button type="button" data-plus-action="reply" title="Reply">↶</button><button type="button" data-plus-action="copy" title="Copy">▢</button><button type="button" data-plus-action="forward" title="Forward">↗</button><button type="button" data-plus-action="pin" title="Pin message">⌁</button>';
      bubble.append(tools);
    });
  }
  const stream=$("#messageStream");
  if(stream){new MutationObserver(decorateMessages).observe(stream,{childList:true,subtree:true});decorateMessages();}
  stream?.addEventListener("click", async event=>{
    const button=event.target.closest("[data-plus-action]"); if(!button)return;
    const row=button.closest(".message-row"), bubble=row?.querySelector(".message-bubble");
    const text=(bubble?.childNodes[0]?.textContent||bubble?.textContent||"").trim();
    const action=button.dataset.plusAction;
    if(action==="reply"){
      replyText=text.slice(0,180); const context=$("#replyContext");
      if(context){context.hidden=false;context.querySelector("span").textContent="Replying to: "+replyText; }
      $("#messageInput")?.focus(); toast("Reply context added");
    }
    if(action==="copy"){
      try{await navigator.clipboard.writeText(text);toast("Message copied");}
      catch(e){const area=document.createElement("textarea");area.value=text;document.body.append(area);area.select();document.execCommand("copy");area.remove();toast("Message copied");}
    }
    if(action==="forward"){
      const input=$("#messageInput"); if(input){input.value=(input.value?input.value+" ":"")+"↗ "+text;input.focus();}
      toast("Message ready to forward");
    }
    if(action==="pin"){
      pinnedText=text;pinBar.hidden=false;pinBar.querySelector("small").textContent=text.slice(0,90);toast("Message pinned in this preview");
    }
  });
  $("#messageForm")?.addEventListener("submit",()=>{
    if(!replyText)return;
    const input=$("#messageInput"); if(input && input.value.trim()) input.value="↪ "+replyText+"\n"+input.value;
    replyText="";
  },true);
  $("#cancelReply")?.addEventListener("click",()=>{replyText="";});
  // A compact feature menu keeps advanced actions discoverable without crowding the chat.
  const headerActions=$(".chat-header-actions");
  if(headerActions && !$("#moriMoreButton")){
    const button=document.createElement("button");button.id="moriMoreButton";button.type="button";button.className="icon-button";button.title="More tools";button.setAttribute("aria-label","More tools");button.textContent="⋯";headerActions.append(button);
    const menu=document.createElement("div");menu.className="mori-tools-menu";menu.hidden=true;
    menu.innerHTML='<button data-tool="search">⌕ <span>Search this chat</span><kbd>Ctrl F</kbd></button><button data-tool="pin">⌁ <span>Pin latest message</span></button><button data-tool="export">⇩ <span>Export conversation</span></button><button data-tool="info">ⓘ <span>About this preview</span></button>';
    $(".chat-panel")?.append(menu);
    button.addEventListener("click",()=>menu.hidden=!menu.hidden);
    menu.addEventListener("click",async e=>{
      const item=e.target.closest("[data-tool]");if(!item)return;menu.hidden=true;
      const chatName=$(".person-name")?.textContent||"Conversation";
      if(item.dataset.tool==="search"){const q=prompt("Search messages in "+chatName+":");if(q){const matches=$$(".message-row").filter(r=>r.textContent.toLowerCase().includes(q.toLowerCase()));matches.forEach(r=>r.classList.add("mori-search-match"));setTimeout(()=>$$(".mori-search-match").forEach(r=>r.classList.remove("mori-search-match")),3500);toast(matches.length+" matching message(s) highlighted");}}
      if(item.dataset.tool==="pin"){const last=$$(".message-row .message-bubble").at(-1);if(last){pinnedText=last.textContent.trim();pinBar.hidden=false;pinBar.querySelector("small").textContent=pinnedText.slice(0,90);toast("Latest message pinned");}}
      if(item.dataset.tool==="export"){const data=$$(".message-row").map(r=>r.classList.contains("mine")?"You: "+r.querySelector(".message-bubble")?.textContent:chatName+": "+r.querySelector(".message-bubble")?.textContent).join("\n");const blob=new Blob(["Mori conversation preview\n"+chatName+"\n\n"+data],{type:"text/plain"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="mori-conversation.txt";a.click();URL.revokeObjectURL(url);toast("Conversation export prepared");}
      if(item.dataset.tool==="info")toast("Mori is a local interactive prototype — no account or server connected");
    });
    document.addEventListener("click",e=>{if(!e.target.closest("#moriMoreButton,.mori-tools-menu"))menu.hidden=true;});
  }
  // Better mobile affordance and keyboard shortcuts.
  document.addEventListener("keydown",e=>{
    if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="f" && !e.target.matches("input,textarea")){e.preventDefault();$("#moriMoreButton")?.click();$(".mori-tools-menu [data-tool=search]")?.click();}
    if(e.key==="Escape"){$(".mori-tools-menu")?.setAttribute("hidden","");}
  });
  // Make the local-only nature explicit in browser storage.
  if(!localStorage.getItem("mori-plus-welcome")){localStorage.setItem("mori-plus-welcome","1");}
})();

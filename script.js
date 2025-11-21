/* --- index.html main JS: chat, intro, confetti, persistence --- */
document.body.addEventListener("click", () => {
    const bg = document.getElementById("birthdaySound");
    bg.volume = 0.4;
    bg.play();
}, { once: true });

const intro = document.getElementById('intro');
const chat = document.getElementById('chat');
const chatArea = document.getElementById('chatArea');
const spinBtn = document.getElementById('spinBtn');
const confettiCanvas = document.getElementById('confetti');
const sound = document.getElementById('birthdaySound');

/* Chat messages (you wanted longer, funny, engaging) */
const messages = [
  { sender: "sonali", name: "Sonali 💜", text: "Hey Aman... kya kar rahe ho? 🤔" },

  { sender: "aman", name: "Aman 😐", text: "Kuch nahi..." },

  { sender: "sonali", name: "Sonali 💜", text: "Kyu kuch nhi kr rhe 🙄? " },

  { sender: "aman", name: "Aman 😐", text: "Ab Aaj ke din bhi kaam karu🙄" },

  { sender: "sonali", name: "Sonali 💜", text: "Kyu Aaj kuch Special  hai Kya ?🤔" },

  { sender: "aman", name: "Aman 😐", text: "Kyu Tumhe Yaad Nhi  🙄" },

  { sender: "sonali", name: "Sonali 💜", text: "Aaj ke din? Kya special hai aaj? 🤨" },

  { sender: "aman", name: "Aman 😐", text: "Kuch nahi..." },

  { sender: "sonali", name: "Sonali 💜", text: "Arey batao na... itna attitude kyun? 😅" },

  { sender: "aman", name: "Aman 😐", text: "Kuch nahi... rehne do." },

  { sender: "sonali", name: "Sonali 💜", text: "Hmm, theek hai... waise ek chhoti si cheez dikhani thi." },

  { sender: "aman", name: "Aman 😐", text: "Ab kya?" },

  { sender: "sonali", name: "Sonali 💜", text: "Bas thoda sa patience. Pehle neeche dikh raha link click karna… 🙈" },

  { sender: "aman", name: "Aman 😐", text: "Link? Kis cheez ka?" },

  { sender: "sonali", name: "Sonali 💜", text: "Click below to unlock something… 🎡", link: true }
];


const finalMessage = { sender: "sonali", name: "Sonali 💜", text: "Hope you loved it! Can't wait to celebrate 😄💜Aur haan — iska screenshot mujhe WhatsApp pe bhejna… waiting 😌💜" };

/* Check if user returned from wheel+scratch */
const cameFromWheel = localStorage.getItem('fromWheel');
const prizeFromWheel = localStorage.getItem('prize'); // prize string stored by wheel page

window.addEventListener('load', () => {
  if (!cameFromWheel) {
    // initial visit: show suspense intro then chat
    setTimeout(() => {
      intro.classList.add('hidden');
      chat.classList.remove('hidden');
      try { sound.currentTime = 0; sound.play(); } catch(e){}
      startConfetti(confettiCanvas); // subtle confetti during reveal
      runChatSequence();
    }, 3600);
  } else {
    // returned after scratch reveal: show final message plus small prize note
    intro.classList.add('hidden');
    chat.classList.remove('hidden');
    chatArea.innerHTML = '';
    // Small friendly recap messages + final
    addMessage(finalMessage.sender, finalMessage.name, finalMessage.text);
    if (prizeFromWheel) {
      const note = `You revealed: ${prizeFromWheel}`;
      addMessage('sonali', 'Sonali 💜', note);
    }
    // cleanup flags
    localStorage.removeItem('fromWheel');
    localStorage.removeItem('prize');
  }
});

/* Chat sequencing with typing indicator and name */
function runChatSequence() {
  let i = 0;

  function next() {
    if (i >= messages.length) {
      setTimeout(() => spinBtn.classList.remove('hidden'), 700);
      return;
    }
    const msg = messages[i];

    // create typing indicator
    const typingWrapper = document.createElement('div');
    typingWrapper.className = 'typing-wrapper ' + msg.sender;
    const nameEl = document.createElement('div');
    nameEl.className = 'typing-name';
    nameEl.textContent = `${msg.name} is typing...`;
    const dots = document.createElement('div');
    dots.className = 'typing';
    dots.innerHTML = '<div class="dot"></div><div class="dot"></div><div class="dot"></div>';

    typingWrapper.appendChild(nameEl);
    typingWrapper.appendChild(dots);
    if (msg.sender === 'sonali') typingWrapper.style.justifyContent = 'flex-end';
    else typingWrapper.style.justifyContent = 'flex-start';

    chatArea.appendChild(typingWrapper);
    chatArea.scrollTop = chatArea.scrollHeight;

    // typing duration based on message length (max 2s)
    const typingDuration = Math.min(2000, 500 + msg.text.length * 45);

    setTimeout(() => {
      typingWrapper.remove();
      addMessage(msg.sender, msg.name, msg.text, msg.link);
      i++;
      setTimeout(next, 600);
    }, typingDuration);
  }

  setTimeout(next, 600);
}

/* Add message bubble with animated emoji insertion for certain lines */
function addMessage(sender, name, text, isLink = false) {
  const wrapper = document.createElement('div');
  wrapper.className = `msg-wrapper ${sender}`;

  const nameDiv = document.createElement('div');
  nameDiv.className = 'sender-name';
  nameDiv.textContent = name;

  const bubble = document.createElement('div');
  bubble.className = `chat-bubble ${sender}`;

  if (isLink) {
    const link = document.createElement('span');
    link.className = 'link-message';
    link.textContent = '🎡 Spin the Wheel of Surprises 🎡';
    link.addEventListener('click', goToWheel);
    bubble.appendChild(link);
    spinBtn.classList.remove('hidden'); // accessible
  } else {
    // insert animated emoji if text includes specific markers or randomly for lively effect
    // We'll add a small animated emoji span at end for fun messages
    const emojiSpan = document.createElement('span');
    emojiSpan.style.marginLeft = '8px';
    // simple rule: if text contains '🎡' or 'surprise' skip; else sometimes add emoji
    if (/pizza|fun|surprise|celebrate|party|loved/i.test(text)) {
      emojiSpan.textContent = ' 🥳';
      emojiSpan.style.display = 'inline-block';
      emojiSpan.style.transformOrigin = 'center';
      emojiSpan.style.animation = 'pop 0.8s ease';
    } else {
      emojiSpan.textContent = '';
    }
    bubble.textContent = text;
    bubble.appendChild(emojiSpan);
  }

  wrapper.appendChild(nameDiv);
  wrapper.appendChild(bubble);
  chatArea.appendChild(wrapper);
  chatArea.scrollTop = chatArea.scrollHeight;
}

/* Navigate to wheel page */
function goToWheel() {
  // small delay for UX
  setTimeout(() => {
    window.location.href = 'wheel.html';
  }, 120);
}

spinBtn.addEventListener('click', goToWheel);

/* Simple confetti animation (background) */
function startConfetti(canvas) {
  if (!canvas || !canvas.getContext) return;
  const ctx = canvas.getContext('2d');
  const pieces = [];
  const cols = ['#ff007f','#a100ff','#ff79d1','#ffffff','#c471ed'];

  for (let i=0;i<130;i++) {
    pieces.push({
      x: Math.random()*window.innerWidth,
      y: Math.random()*-window.innerHeight,
      w: 6 + Math.random()*10,
      h: 6 + Math.random()*8,
      color: cols[Math.floor(Math.random()*cols.length)],
      speed: 2 + Math.random()*5,
      rot: Math.random()*360,
      rotS: (Math.random()-0.5)*6
    });
  }

  function frame() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    pieces.forEach(p=>{
      p.x += Math.sin(p.rot*Math.PI/180)*0.6;
      p.y += p.speed;
      p.rot += p.rotS;
      ctx.save();
      ctx.translate(p.x,p.y);
      ctx.rotate(p.rot*Math.PI/180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
      ctx.restore();
      if (p.y > canvas.height + 30) { p.y = -30 - Math.random()*canvas.height; p.x = Math.random()*canvas.width; }
    });
    requestAnimationFrame(frame);
  }
  frame();
}

/* keep canvas sized on resize */
window.addEventListener('resize', () => {
  const c = document.getElementById('confetti'); if (c) { c.width = window.innerWidth; c.height = window.innerHeight; }
});

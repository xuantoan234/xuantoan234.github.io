const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

/** ===== Countdown ===== */
const WEDDING_DATE_ISO = "2026-05-18T15:00:00+07:00";

function pad2(n){ return String(n).padStart(2, "0"); }

function tickCountdown(){
  const target = new Date(WEDDING_DATE_ISO).getTime();
  const now = Date.now();
  const d = target - now;

  const days = Math.max(0, Math.floor(d / (1000*60*60*24)));
  const hours = Math.max(0, Math.floor((d % (1000*60*60*24)) / (1000*60*60)));
  const mins = Math.max(0, Math.floor((d % (1000*60*60)) / (1000*60)));
  const secs = Math.max(0, Math.floor((d % (1000*60)) / 1000));

  $("#cdDays").textContent = pad2(days);
  $("#cdHours").textContent = pad2(hours);
  $("#cdMins").textContent = pad2(mins);
  $("#cdSecs").textContent = pad2(secs);
}
setInterval(tickCountdown, 1000);
tickCountdown();

/** ===== Copy address buttons ===== */
$$("[data-copy]").forEach(btn => {
  btn.addEventListener("click", async () => {
    const text = btn.getAttribute("data-copy") || "";
    try{
      await navigator.clipboard.writeText(text);
      toast(`Đã copy: ${text}`);
    }catch{
      toast("Không thể copy. Hãy copy thủ công.");
    }
  });
});

/** ===== RSVP demo submit ===== */
const toastEl = $("#toast");
function toast(msg){
  toastEl.textContent = msg;
  clearTimeout(toastEl._t);
  toastEl._t = setTimeout(() => toastEl.textContent = "", 3200);
}

$("#rsvpForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const form = e.currentTarget;
  const data = Object.fromEntries(new FormData(form).entries());

  // Demo only. Replace with API/Google Sheets if needed.
  console.log("RSVP:", data);
  toast("Đã gửi xác nhận (demo). Cảm ơn bạn!");
  form.reset();
});

/** ===== Gallery lightbox ===== */
const lb = $("#lightbox");
const lbImg = $("#lbImg");
const lbClose = $("#lbClose");

function openLB(src){
  lbImg.src = src;
  lb.classList.add("is-open");
  lb.setAttribute("aria-hidden", "false");
}
function closeLB(){
  lb.classList.remove("is-open");
  lb.setAttribute("aria-hidden", "true");
  lbImg.src = "";
}

$$(".gitem").forEach(btn => {
  btn.addEventListener("click", () => openLB(btn.dataset.full));
});
lbClose.addEventListener("click", closeLB);
lb.addEventListener("click", (e) => { if(e.target === lb) closeLB(); });
window.addEventListener("keydown", (e) => { if(e.key === "Escape") closeLB(); });

/** ===== Music button ===== */
const musicBtn = $("#musicBtn");
const bgm = $("#bgm");
let userStarted = false;

musicBtn.addEventListener("click", async () => {
  try{
    if(bgm.paused){
      await bgm.play();
      musicBtn.classList.add("is-playing");
      userStarted = true;
    }else{
      bgm.pause();
      musicBtn.classList.remove("is-playing");
    }
  }catch{
    toast("Trình duyệt chặn autoplay. Bấm lại để phát.");
  }
});

// optional: start after first interaction anywhere (if user previously pressed play)
window.addEventListener("pointerdown", async () => {
  if(userStarted || !bgm.paused) return;
}, { once:true });
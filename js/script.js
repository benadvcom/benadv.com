(() => {
"use strict";
const TZ = "Asia/Ho_Chi_Minh";
const translations = {
 vi: {
 "nav.about":"Giới thiệu","nav.updates":"Cập nhật","nav.notes":"Ghi chú","nav.utilities":"Tiện ích","nav.contact":"Liên hệ",
 "hero.meta":"Trang cá nhân · Ghi chú · Tiện ích","about.intro":"Một không gian gọn gàng để lưu trữ ghi chú, tài liệu và những điều hữu ích.","updates.intro":"Những thay đổi và nội dung được bổ sung theo thời gian.","notes.intro":"Các ghi chú ngắn, tài liệu tham khảo và nội dung kỹ thuật.","utilities.intro":"Những công cụ nhỏ, thực tế và nhanh.","contact.intro":"Thông tin liên hệ và các mạng xã hội của BenADV.",
 "hero.hello":"XIN CHÀO","hero.prefix":"Tôi là",
 "hero.description":"Trang cá nhân để lưu trữ ghi chú, tài liệu, tiện ích và những thông tin hữu ích.",
 "hero.about":"Giới thiệu","hero.contact":"Liên hệ",
 "about.label":"GIỚI THIỆU","about.title":"Giới thiệu",
 "about.text":"Chào mừng bạn đến với website cá nhân của BenADV. Website được xây dựng bằng HTML, CSS và JavaScript, tối ưu cho tốc độ và thiết bị di động.",
 "updates.label":"CẬP NHẬT","updates.title":"Cập nhật",
 "updates.c1":"Website cá nhân","updates.p1":"Xây dựng và cập nhật website cá nhân.",
 "updates.c2":"Tài liệu","updates.p2":"Lưu trữ các tài liệu và nội dung hữu ích.",
 "updates.c3":"Tiện ích","updates.p3":"Bổ sung các công cụ nhỏ phục vụ nhu cầu cá nhân.",
 "notes.label":"GHI CHÚ","notes.title":"Ghi chú",
 "notes.c1":"Ghi chú 01","notes.p1":"Những thông tin và kinh nghiệm muốn lưu lại.",
 "notes.c2":"Ghi chú 02","notes.p2":"Hướng dẫn, cấu hình và các nội dung kỹ thuật.",
 "notes.c3":"Ghi chú 03","notes.p3":"Các nội dung được cập nhật theo thời gian.",
 "utilities.label":"TIỆN ÍCH","utilities.title":"Tiện ích",
 "utilities.c1":"Tiện ích 01","utilities.p1":"Một công cụ trực tuyến đơn giản.",
 "utilities.c2":"Tiện ích 02","utilities.p2":"Các công cụ hữu ích khác.",
 "common.more":"Xem thêm →","common.open":"Mở tiện ích →",
 "contact.label":"LIÊN HỆ","contact.title":"Liên hệ","contact.website":"Website:","contact.email":"Email:","contact.phone":"Điện thoại:",
 "footer":"","clock.location":"Thành phố Hồ Chí Minh · Việt Nam · GMT+7"
 },
 en: {
 "nav.about":"About","nav.updates":"Updates","nav.notes":"Notes","nav.utilities":"Utilities","nav.contact":"Contact",
 "hero.meta":"Personal · Notes · Utilities","about.intro":"A simple space for personal notes, useful resources and things worth keeping.","updates.intro":"Small changes and projects collected over time.","notes.intro":"Short notes, references and technical reminders.","utilities.intro":"Small tools built to be practical and fast.","contact.intro":"Find the latest contact details and social links below.",
 "hero.hello":"HELLO","hero.prefix":"I am",
 "hero.description":"A personal website for notes, documents, useful tools and information.",
 "hero.about":"About","hero.contact":"Contact",
 "about.label":"ABOUT","about.title":"About",
 "about.text":"Welcome to BenADV’s personal website. It is built with HTML, CSS and JavaScript, optimized for speed and mobile devices.",
 "updates.label":"UPDATES","updates.title":"Updates",
 "updates.c1":"Personal website","updates.p1":"Building and updating the personal website.",
 "updates.c2":"Documents","updates.p2":"Keeping useful documents and information.",
 "updates.c3":"Utilities","updates.p3":"Adding small tools for personal use.",
 "notes.label":"NOTES","notes.title":"Notes",
 "notes.c1":"Note 01","notes.p1":"Information and experiences I want to keep.",
 "notes.c2":"Note 02","notes.p2":"Guides, configurations and technical notes.",
 "notes.c3":"Note 03","notes.p3":"Content updated over time.",
 "utilities.label":"TOOLS","utilities.title":"Utilities",
 "utilities.c1":"Utility 01","utilities.p1":"A simple online tool.",
 "utilities.c2":"Utility 02","utilities.p2":"Other useful tools.",
 "common.more":"Read more →","common.open":"Open tool →",
 "contact.label":"CONTACT","contact.title":"Contact","contact.website":"Website:","contact.email":"Email:","contact.phone":"Phone:",
 "footer":"","clock.location":"Ho Chi Minh City · Vietnam · GMT+7"
 }
};
const header = document.querySelector(".site-header");
function syncHeader(){
 if (!header) return;
 document.documentElement.style.setProperty("--header-h", `${header.offsetHeight}px`);
 header.classList.toggle("is-scrolled", window.scrollY > 8);
}
if (header){
 syncHeader();
 window.addEventListener("scroll", syncHeader, {passive:true});
 window.addEventListener("resize", syncHeader, {passive:true});
 if (window.ResizeObserver){
 new ResizeObserver(syncHeader).observe(header);
 }
}
const navLinks = document.querySelectorAll(".nav a");
const pageId = document.body.getAttribute("data-page") || "home";
function setActiveNavByPage(){
 navLinks.forEach(link=>{
 const active = link.dataset.page === pageId;
 link.classList.toggle("active",active);
 if(active) link.setAttribute("aria-current","page");
 else link.removeAttribute("aria-current");
 });
}
setActiveNavByPage();
if(pageId === "home"){
 const sectionLinks = [...navLinks].filter(link=>link.dataset.page==="about" || link.dataset.page==="contact");
 const sections = sectionLinks
 .map(link=>{
 const hash = link.getAttribute("href").split("#")[1];
 return hash ? document.getElementById(hash) : null;
 })
 .filter(Boolean);
 if(sections.length){
 const observer = new IntersectionObserver(entries=>{
 const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
 if(visible){
 navLinks.forEach(link=>link.classList.toggle("active",link.dataset.page===visible.target.id));
 }
 },{root:null,rootMargin:"-30% 0px -55% 0px",threshold:[0,.25,.6,1]});
 sections.forEach(section=>observer.observe(section));
 }
}


const languageToggle = document.getElementById("languageToggle");
const themeToggle = document.getElementById("themeToggle");

const LANGUAGE_STORAGE_KEY = "benadv:language";

function getPageId(){
 return document.body.getAttribute("data-page") || "home";
}

function getSavedLanguage(){
 const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
 if (saved === "en" || saved === "vi") return saved;

 // Migrate the previous per-page language preference to one global preference.
 const oldKeys = Object.keys(localStorage).filter((key)=>key.startsWith("chanh:lang:"));
 const oldEnglish = oldKeys.some((key)=>localStorage.getItem(key) === "en");
 const migrated = oldEnglish ? "en" : "vi";
 localStorage.setItem(LANGUAGE_STORAGE_KEY, migrated);
 return migrated;
}

function getCurrentFile(){
 const path = window.location.pathname.replace(/\\/g,"/");
 const normalized = path.replace(/\/+$/,"");

 // Root and /en/ are both index pages.
 if (!normalized || normalized === "/en") return "index.html";

 const parts = normalized.split("/").filter(Boolean);
 return parts[parts.length - 1] || "index.html";
}

function isEnglishPage(){
 const path = window.location.pathname.replace(/\\/g,"/");
 const normalized = path.replace(/\/+$/,"");
 if (normalized === "/en") return true;

 const parts = normalized.split("/").filter(Boolean);
 return parts.length >= 2 && parts[parts.length - 2] === "en";
}

function getLanguageFile(lang){
 const file = getCurrentFile();
 const en = isEnglishPage();

 if (lang === "en"){
   return en ? `./${file}` : `./en/${file}`;
 }

 return en ? `../${file}` : `./${file}`;
}

function setLanguage(lang){
 const next = lang === "en" ? "en" : "vi";
 const dict = translations[next] || translations.vi;

 document.querySelectorAll("[data-i18n]").forEach((el)=>{
   const key = el.getAttribute("data-i18n");
   if (dict[key] !== undefined) el.textContent = dict[key];
 });

 document.documentElement.lang = next;

 if (languageToggle){
   const isEnglish = next === "en";
   languageToggle.classList.toggle("on", isEnglish);
   languageToggle.setAttribute("aria-checked", isEnglish ? "true" : "false");
   languageToggle.setAttribute("aria-label", isEnglish ? "Switch to Vietnamese" : "Switch to English");
 }

 localStorage.setItem(LANGUAGE_STORAGE_KEY, next);
 window.dispatchEvent(new CustomEvent("calendar:language"));
 updateClock();
}

function ensurePageLanguage(){
 const saved = getSavedLanguage();
 const current = isEnglishPage() ? "en" : "vi";

 if (saved !== current){
   window.location.replace(getLanguageFile(saved));
   return false;
 }

 return true;
}

function setTheme(theme){
 const dark = theme === "dark";
 document.body.classList.toggle("dark", dark);

 if (themeToggle){
   const icon = themeToggle.querySelector(".theme-symbol");
   if (icon) icon.textContent = dark ? "☀" : "☾";
   themeToggle.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
   themeToggle.title = dark ? "Light theme" : "Dark theme";

   const themeMeta = document.querySelector('meta[name="theme-color"]');
   if (themeMeta) themeMeta.setAttribute("content", dark ? "#0b1118" : "#0077b6");
 }

 localStorage.setItem("theme", dark ? "dark" : "light");
}

if (languageToggle){
 languageToggle.addEventListener("click", ()=>{
   const current = getSavedLanguage();
   const next = current === "vi" ? "en" : "vi";
   localStorage.setItem(LANGUAGE_STORAGE_KEY, next);
   window.location.replace(getLanguageFile(next));
 });
}

if (themeToggle){
 themeToggle.addEventListener("click", ()=>{
   const next = (localStorage.getItem("theme") || "light") === "light" ? "dark" : "light";
   setTheme(next);
 });
}

if (ensurePageLanguage() !== false){
 setTheme(localStorage.getItem("theme") || "light");
 setLanguage(getSavedLanguage());
 updateClock();
 setInterval(updateClock,1000);
}

function jdFromDate(dd, mm, yy){
 const a=Math.floor((14-mm)/12), y=yy+4800-a, m=mm+12*a-3;
 let jd=dd+Math.floor((153*m+2)/5)+365*y+Math.floor(y/4)-Math.floor(y/100)+Math.floor(y/400)-32045;
 if(jd<2299161) jd=dd+Math.floor((153*m+2)/5)+365*y+Math.floor(y/4)-32083;
 return jd;
}
function newMoon(k){
 const T=k/1236.85,T2=T*T,T3=T2*T,dr=Math.PI/180;
 let jd=2415020.75933+29.53058868*k+0.0001178*T2-0.000000155*T3+0.00033*Math.sin((166.56+132.87*T-0.009173*T2)*dr);
 const M=359.2242+29.10535608*k-0.0000333*T2-0.00000347*T3;
 const Mp=306.0253+385.81691806*k+0.0107306*T2+0.00001236*T3;
 const F=21.2964+390.67050646*k-0.0016528*T2-0.00000239*T3;
 const C1=(0.1734-0.000393*T)*Math.sin(M*dr)+0.0021*Math.sin(2*M*dr)-0.4068*Math.sin(Mp*dr)+0.0161*Math.sin(2*Mp*dr)-0.0004*Math.sin(3*Mp*dr)+0.0104*Math.sin(2*F*dr)-0.0051*Math.sin((M+Mp)*dr)-0.0074*Math.sin((M-Mp)*dr)+0.0004*Math.sin((2*F+M)*dr)-0.0004*Math.sin((2*F-M)*dr)-0.0006*Math.sin((2*F+Mp)*dr)+0.001*Math.sin((2*F-Mp)*dr)+0.0005*Math.sin((2*Mp+M)*dr);
 const deltat=k<-11?0.001+0.000839*T+0.0002261*T2-0.00000845*T3-0.000000081*T2*T:-0.000278+0.000265*T+0.000262*T2;
 return jd+C1-deltat;
}
function getNewMoonDay(k,tz){return Math.floor(newMoon(k)+0.5+tz/24);}
function sunLongitude(jdn){
 const T=(jdn-2451545.0-0.5)/36525,T2=T*T,dr=Math.PI/180;
 const M=357.52910+35999.05030*T-0.0001559*T2-0.00000048*T2*T;
 const L0=280.46645+36000.76983*T+0.0003032*T2;
 const DL=(1.914600-0.004817*T-0.000014*T2)*Math.sin(M*dr)+(0.019993-0.000101*T)*Math.sin(2*M*dr)+0.000290*Math.sin(3*M*dr);
 let L=(L0+DL)*dr; L-=Math.PI*2*Math.floor(L/(Math.PI*2));
 return Math.floor(L/Math.PI*6);
}
function getSunLongitude(dayNumber,timeZone){return Math.floor(sunLongitude(dayNumber-0.5-timeZone/24));}
function getLunarMonth11(year,timeZone){
 const off=jdFromDate(31,12,year)-2415021,k=Math.floor(off/29.530588853),nm=getNewMoonDay(k,timeZone);
 return getSunLongitude(nm,timeZone)>=9?getNewMoonDay(k-1,timeZone):nm;
}
function getLeapMonthOffset(a11,timeZone){
 const k=Math.floor((a11-2415021.076998695)/29.530588853+0.5);let last=0,i=1,arc=getSunLongitude(getNewMoonDay(k+i,timeZone),timeZone);
 do{last=arc;i++;arc=getSunLongitude(getNewMoonDay(k+i,timeZone),timeZone);}while(arc!==last&&i<14);
 return i-1;
}
function solarToLunar(dd,mm,yy,timeZone=7){
 const dayNumber=jdFromDate(dd,mm,yy),k=Math.floor((dayNumber-2415021.076998695)/29.530588853);
 let monthStart=getNewMoonDay(k+1,timeZone);
 if(monthStart>dayNumber)monthStart=getNewMoonDay(k,timeZone);
 let a11=getLunarMonth11(yy,timeZone),b11=a11,lunarYear;
 if(a11>=monthStart){lunarYear=yy;a11=getLunarMonth11(yy-1,timeZone);}
 else{lunarYear=yy+1;b11=getLunarMonth11(yy+1,timeZone);}
 const lunarDay=dayNumber-monthStart+1,diff=Math.floor((monthStart-a11)/29);let lunarLeap=0,lunarMonth=diff+11;
 if(b11-a11>365){
 const leapDiff=getLeapMonthOffset(a11,timeZone);
 if(diff>=leapDiff){lunarMonth=diff+10;if(diff===leapDiff)lunarLeap=1;}
 }
 if(lunarMonth>12)lunarMonth-=12;
 if(lunarMonth>=11&&diff<4)lunarYear--;
 return {day:lunarDay,month:lunarMonth,year:lunarYear,leap:lunarLeap};
}
function hcmDateParts(){
 const parts=new Intl.DateTimeFormat("en-CA",{timeZone:TZ,year:"numeric",month:"2-digit",day:"2-digit"}).formatToParts(new Date());
 const out={}; parts.forEach(p=>{if(p.type!=="literal")out[p.type]=Number(p.value);}); return out;
}
function updateClock(){
 const pageKey = document.body.getAttribute("data-page") || "home";
 const lang = getSavedLanguage();
 const now=new Date();
 const time=new Intl.DateTimeFormat("vi-VN",{timeZone:TZ,hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:false}).format(now);
 const solar=new Intl.DateTimeFormat(
 lang==="vi" ? "vi-VN" : "en-GB",
 {timeZone:TZ,weekday:"long",day:"2-digit",month:"2-digit",year:"numeric"}
 ).format(now);
 const d=hcmDateParts();
 const lunar=solarToLunar(d.day,d.month,d.year,7);
 const c=document.getElementById("liveClock");
 const s=document.getElementById("solarDate");
 const l=document.getElementById("lunarDate");
 const loc=document.querySelector(".home-clock-top, .clock-location");
 if(c)c.textContent=time;
 if(s)s.textContent=solar;
 if(l)l.textContent=lang==="vi"
 ? (lunar.leap
 ? `Âm lịch: ${lunar.day}/${lunar.month} nhuận/${lunar.year}`
 : `Âm lịch: ${lunar.day}/${lunar.month}/${lunar.year}`)
 : (lunar.leap
 ? `Lunar calendar: ${lunar.day}/${lunar.month} (leap)/${lunar.year}`
 : `Lunar calendar: ${lunar.day}/${lunar.month}/${lunar.year}`);
 if(loc)loc.textContent=lang==="vi"
 ?"Thành phố Hồ Chí Minh · Việt Nam · GMT+7"
 :"Ho Chi Minh City · Vietnam · GMT+7";
}
const backToTop=document.getElementById("backToTop");
if(backToTop){
 window.addEventListener("scroll",()=>backToTop.classList.toggle("show",window.scrollY>450),{passive:true});
 backToTop.addEventListener("click",()=>window.scrollTo({top:0,behavior:"smooth"}));
}
})();
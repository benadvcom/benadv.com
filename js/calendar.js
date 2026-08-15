(() => {
"use strict";
function jdFromDate(dd, mm, yy) {
 let a = Math.floor((14 - mm) / 12);
 let y = yy + 4800 - a;
 let m = mm + 12 * a - 3;
 let jd = dd + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
 if (jd < 2299161) {
 jd = dd + Math.floor((153 * m + 2) / 5) + Math.floor(y / 4) - 32083;
 }
 return jd;
}
function NewMoon(k) {
 let T = k / 1236.85, T2 = T*T, T3 = T2*T, dr = Math.PI/180;
 let Jd1 = 2415020.75933 + 29.53058868*k + 0.0001178*T2 - 0.000000155*T3;
 Jd1 += 0.00033*Math.sin((166.56+132.87*T-0.009173*T2)*dr);
 let M = 359.2242 + 29.10535608*k - 0.0000333*T2 - 0.00000347*T3;
 let Mpr = 306.0253 + 385.81691806*k + 0.0107306*T2 + 0.00001236*T3;
 let F = 21.2964 + 390.67050646*k - 0.0016528*T2 - 0.00000239*T3;
 let C1 = (0.1734-0.000393*T)*Math.sin(M*dr) + 0.0021*Math.sin(2*dr*M);
 C1 = C1 - 0.4068*Math.sin(Mpr*dr) + 0.0161*Math.sin(dr*2*Mpr);
 C1 = C1 - 0.0004*Math.sin(dr*3*Mpr);
 C1 = C1 + 0.0104*Math.sin(dr*2*F) - 0.0051*Math.sin(dr*(M+Mpr));
 C1 = C1 - 0.0074*Math.sin(dr*(M-Mpr)) + 0.0004*Math.sin(dr*(2*F+M));
 C1 = C1 - 0.0004*Math.sin(dr*(2*F-M)) - 0.0006*Math.sin(dr*(2*F+Mpr));
 C1 = C1 + 0.0010*Math.sin(dr*(2*F-Mpr)) + 0.0005*Math.sin(dr*(2*Mpr+M));
 let deltat;
 if (T < -11) deltat = 0.001 + 0.000839*T + 0.0002261*T2 - 0.00000845*T3 - 0.000000081*T*T3;
 else deltat = -0.000278 + 0.000265*T + 0.000262*T2;
 return Jd1 + C1 - deltat;
}
function SunLongitude(jdn) {
 let T = (jdn-2451545.0)/36525, T2=T*T, dr=Math.PI/180;
 let M = 357.52910 + 35999.05030*T - 0.0001559*T2 - 0.00000048*T*T2;
 let L0 = 280.46645 + 36000.76983*T + 0.0003032*T2;
 let DL = (1.914600-0.004817*T-0.000014*T2)*Math.sin(dr*M);
 DL += (0.019993-0.000101*T)*Math.sin(dr*2*M) + 0.000290*Math.sin(dr*3*M);
 let L = (L0+DL)*dr;
 L -= Math.PI*2*Math.floor(L/(Math.PI*2));
 return L;
}
function getSunLongitude(dayNumber, tz){ return Math.floor(SunLongitude(dayNumber-0.5-tz/24)/Math.PI*6); }
function getNewMoonDay(k, tz){ return Math.floor(NewMoon(k)+0.5+tz/24); }
function getLunarMonth11(yy, tz){
 let off = jdFromDate(31,12,yy) - 2415021;
 let k = Math.floor(off/29.530588853);
 let nm = getNewMoonDay(k, tz);
 let sunLong = getSunLongitude(nm, tz);
 if (sunLong >= 9) nm = getNewMoonDay(k-1, tz);
 return nm;
}
function getLeapMonthOffset(a11, tz){
 let k = Math.floor((a11-2415021.076998695)/29.530588853+0.5);
 let last=0, i=1;
 let arc = getSunLongitude(getNewMoonDay(k+i, tz), tz);
 do{
 last=arc; i++;
 arc=getSunLongitude(getNewMoonDay(k+i, tz), tz);
 } while(arc!==last && i<14);
 return i-1;
}
function convertSolar2Lunar(dd, mm, yy, tz){
 let dayNumber = jdFromDate(dd,mm,yy);
 let k = Math.floor((dayNumber-2415021.076998695)/29.530588853);
 let monthStart = getNewMoonDay(k+1, tz);
 if (monthStart > dayNumber) monthStart = getNewMoonDay(k, tz);
 let a11 = getLunarMonth11(yy, tz);
 let b11 = a11;
 let lunarYearNum;
 if (a11 >= monthStart){ lunarYearNum = yy; a11 = getLunarMonth11(yy-1, tz); }
 else { lunarYearNum = yy+1; b11 = getLunarMonth11(yy+1, tz); }
 let lunarDay = dayNumber - monthStart + 1;
 let diff = Math.floor((monthStart-a11)/29);
 let lunarLeap = 0, lunarMonth = diff+11;
 if (b11-a11 > 365){
 let leapMonthDiff = getLeapMonthOffset(a11, tz);
 if (diff >= leapMonthDiff){ lunarMonth = diff+10; if (diff==leapMonthDiff) lunarLeap=1; }
 }
 if (lunarMonth > 12) lunarMonth -= 12;
 if (lunarMonth >= 11 && diff < 4) lunarYearNum -= 1;
 return [lunarDay, lunarMonth, lunarYearNum, lunarLeap];
}
const CAN = ["Giáp","Ất","Bính","Đinh","Mậu","Kỷ","Canh","Tân","Nhâm","Quý"];
const CHI = ["Tý","Sửu","Dần","Mão","Thìn","Tỵ","Ngọ","Mùi","Thân","Dậu","Tuất","Hợi"];
const CAN_EN = ["Jia","Yi","Bing","Ding","Wu","Ji","Geng","Xin","Ren","Gui"];
const CHI_EN = ["Rat","Ox","Tiger","Rabbit","Dragon","Snake","Horse","Goat","Monkey","Rooster","Dog","Pig"];
const CHI_HOUR_RANGE = ["23h-1h","1h-3h","3h-5h","5h-7h","7h-9h","9h-11h","11h-13h","13h-15h","15h-17h","17h-19h","19h-21h","21h-23h"];
const WEEKDAY = ["Chủ Nhật","Thứ Hai","Thứ Ba","Thứ Tư","Thứ Năm","Thứ Sáu","Thứ Bảy"];
const WEEKDAY_EN = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const TRUC = ["Kiến","Trừ","Mãn","Bình","Định","Chấp","Phá","Nguy","Thành","Thu","Khai","Bế"];
const HOANG_DAO_GROUPS = [
 [0,1,3,6,8,9],[2,3,5,8,10,11],[0,1,4,5,7,10],
 [0,2,3,6,7,9],[2,4,5,8,9,11],[1,4,6,7,10,11]
];
const TRUC_INFO = {
 "Kiến": {nen:"Khởi sự, xuất hành, nhậm chức, cầu phúc, tế tự.", kieng:"Động thổ, khởi công xây dựng, tranh chấp kiện tụng."},
 "Trừ": {nen:"Trừ tà, dọn dẹp nhà cửa, cắt tóc, chữa bệnh, tống cựu nghênh tân.", kieng:"Khai trương, xuất hành đường xa, ký kết việc lớn."},
 "Mãn": {nen:"Ăn hỏi, cưới gả, nhập trạch, cầu tài, đặt móng.", kieng:"Kiện tụng, an táng, mai táng."},
 "Bình": {nen:"Giao dịch thông thường, san lấp, sửa đường.", kieng:"Khởi sự việc lớn, động thổ, khai trương."},
 "Định": {nen:"Cưới hỏi, nhậm chức, ký hợp đồng, xuất hành.", kieng:"Kiện tụng, tranh chấp, kinh doanh mạo hiểm."},
 "Chấp": {nen:"Xây dựng, tu sửa nhà cửa, trồng trọt, chăn nuôi.", kieng:"Xuất hành đường xa, di chuyển chỗ ở."},
 "Phá": {nen:"Phá dỡ công trình cũ, chữa bệnh, trừ tà.", kieng:"Hầu hết việc trọng đại: cưới hỏi, khai trương, động thổ."},
 "Nguy": {nen:"Phòng bị cẩn trọng, tu sửa nhỏ trong nhà.", kieng:"Leo trèo, đi xa, sông nước, việc nguy hiểm."},
 "Thành":{nen:"Cưới hỏi, khai trương, nhậm chức, ký kết hợp đồng — hợp mọi việc lớn.", kieng:"Kiện tụng kéo dài."},
 "Thu": {nen:"Thu hoạch, nhập kho, thu tiền, ký kết giao dịch.", kieng:"Khởi công xây dựng mới, động thổ."},
 "Khai": {nen:"Khai trương, khởi sự, xuất hành, cầu tài — rất tốt để mở đầu.", kieng:"An táng, mai táng."},
 "Bế": {nen:"Đắp đê, xây tường, việc cần đóng kín, an táng.", kieng:"Khai trương, xuất hành, khởi sự việc mới."}
};
const I18N = {
 vi: {
 solar:"Dương lịch", lunar:"Âm lịch", goodHours:"Giờ hoàng đạo", goodLegend:"Hoàng đạo (tốt)",
 badLegend:"Hắc đạo", today:"Hôm nay", previous:"Ngày trước", next:"Ngày sau",
 beforeMonth:"Tháng trước", nextMonth:"Tháng sau", lunarCalendar:"Lịch vạn niên",
 lunarIntro:"Xem ngày âm dương, can chi, giờ hoàng đạo và lịch tháng.",
 todayBtn:"Hôm nay", solarMonth:"Tháng", lunarMonth:"Tháng", year:"năm",
 lunarCal:"Lunar calendar", doTitle:"Nên làm", avoidTitle:"Nên tránh",
 day:"Ngày", month:"Tháng", yearLabel:"Năm", hours:"12 giờ",
 calendarMonth:"Lịch tháng", weekdays:["Th 2","Th 3","Th 4","Th 5","Th 6","Th 7","CN"]
 },
 en: {
 solar:"Solar", lunar:"Lunar", goodHours:"Auspicious hours", goodLegend:"Auspicious",
 badLegend:"Inauspicious", today:"Today", previous:"Previous day", next:"Next day",
 beforeMonth:"Previous month", nextMonth:"Next month", lunarCalendar:"Perpetual Calendar",
 lunarIntro:"Solar and lunar dates, Can Chi, auspicious hours and monthly calendar.",
 todayBtn:"Today", solarMonth:"Month", lunarMonth:"Month", year:"year",
 lunarCal:"Lunar calendar", doTitle:"Recommended", avoidTitle:"Avoid",
 day:"Day", month:"Month", yearLabel:"Year", hours:"12 zodiac hours",
 calendarMonth:"Monthly calendar", weekdays:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],
 lunarYear:"Lunar year", canChi:"Can Chi", lunarMonthName:"Lunar month",
 hoursLabel:"12 zodiac hours", dayChi:"Day Chi",
 timeSeparator:"-"
 }
};
function getLang(){ return document.documentElement.lang === "en" ? "en" : "vi"; }
function getTZ(yy){ return yy < 1968 ? 8 : 7; }
function displayCan(can, lang){
 if(lang!=="en") return can;
 const i=CAN.indexOf(can);
 return i>=0 ? CAN_EN[i] : can;
}
function displayChi(chi, lang){
 if(lang!=="en") return chi;
 const i=CHI.indexOf(chi);
 return i>=0 ? CHI_EN[i] : chi;
}
function displayCanChi(can, chi, lang){
 return `${displayCan(can,lang)} ${displayChi(chi,lang)}`;
}
function getCanChiDay(jd){ return [CAN[(jd+9)%10], CHI[(jd+1)%12]]; }
function getCanChiYear(ly){ return [CAN[((ly+6)%10+10)%10], CHI[((ly+8)%12+12)%12]]; }
function getCanChiMonth(lm, ly){ return [CAN[(((ly*12+lm+3)%10)+10)%10], CHI[(lm+1)%12]]; }
function pad2(n){ return n<10 ? "0"+n : ""+n; }
function daysInMonth(m,y){ return new Date(y, m, 0).getDate(); }
let today = new Date();
let selected = new Date(today);
let viewMonth = selected.getMonth()+1;
let viewYear = selected.getFullYear();
function renderHero(date){
 const lang=getLang(), tr=I18N[lang];
 const dd=date.getDate(), mm=date.getMonth()+1, yy=date.getFullYear();
 const jd=jdFromDate(dd,mm,yy);
 const [ld,lm,ly,leap]=convertSolar2Lunar(dd,mm,yy,getTZ(yy));
 const [canD,chiD]=getCanChiDay(jd);
 const [canY,chiY]=getCanChiYear(ly);
 const [canM,chiM]=getCanChiMonth(lm,ly);
 document.getElementById("weekdayLabel").textContent=(lang==="en"?WEEKDAY_EN:WEEKDAY)[date.getDay()];
 document.getElementById("solarDay").textContent=dd;
 document.getElementById("solarSub").textContent=`${tr.solarMonth} ${mm}, ${yy}`;
 document.getElementById("lunarDay").textContent=ld;
 document.getElementById("lunarSub").textContent=lang==="en"
 ? `${tr.lunarMonthName || "Lunar month"} ${lm}${leap?" (leap)":""}, ${tr.lunarYear || "Lunar year"} ${displayCanChi(canY,chiY,lang)}`
 : `${tr.lunarMonth} ${lm}${leap?" (leap)":""} ${tr.year} ${canY} ${chiY}`;
 document.getElementById("canChiRow").innerHTML=`
 <span class="canchi-pill">${lang==="en"?"Day":"Ngày"}: <b>${displayCanChi(canD,chiD,lang)}</b></span>
 <span class="canchi-pill">${lang==="en"?"Month":"Tháng"}: <b>${displayCanChi(canM,chiM,lang)}</b></span>
 <span class="canchi-pill">${lang==="en"?"Year":"Năm"}: <b>${displayCanChi(canY,chiY,lang)}</b></span>`;
 const chiDayIdx=CHI.indexOf(chiD);
 renderWheel(chiDayIdx); renderHourList(chiDayIdx);
 const chiMonthIdx=CHI.indexOf(chiM);
 const trucName=TRUC[(((chiDayIdx-chiMonthIdx)%12)+12)%12];
 const ti=TRUC_INFO[trucName];
 document.getElementById("trucName").textContent=lang==="en"?(enTrucName[trucName] || trucName):trucName;
 document.getElementById("trucNen").textContent=lang==="en"?enTruc[trucName].nen:ti.nen;
 document.getElementById("trucKieng").textContent=lang==="en"?enTruc[trucName].kieng:ti.kieng;
 const weekdayInfo=document.getElementById("heroWeekday"); if(weekdayInfo) weekdayInfo.textContent=lang==="en"?"Daily calendar details":"Thông tin ngày";
 document.getElementById("trucLabel").textContent=lang==="en"?"Day cycle":"Trực hôm nay";
}
const enTrucName={
 "Kiến":"Establish","Trừ":"Remove","Mãn":"Full","Bình":"Balance","Định":"Set","Chấp":"Hold",
 "Phá":"Break","Nguy":"Danger","Thành":"Success","Thu":"Collect","Khai":"Open","Bế":"Close"
};
const enTruc={
 "Kiến":{nen:"Starting work, travel, appointments and worship.",kieng:"Groundbreaking, construction starts and disputes."},
 "Trừ":{nen:"Cleaning, haircuts, treatment and clearing old matters.",kieng:"Grand openings, long travel and major contracts."},
 "Mãn":{nen:"Engagements, weddings, house moving and finance.",kieng:"Litigation and funerals."},
 "Bình":{nen:"Ordinary transactions, road repairs and leveling.",kieng:"Major beginnings, groundbreaking and grand openings."},
 "Định":{nen:"Weddings, appointments, contracts and travel.",kieng:"Litigation, disputes and risky business."},
 "Chấp":{nen:"Construction, repairs, farming and livestock.",kieng:"Long travel and relocation."},
 "Phá":{nen:"Demolition, treatment and removing harmful influences.",kieng:"Major events such as weddings, openings and groundbreaking."},
 "Nguy":{nen:"Caution and small home repairs.",kieng:"Climbing, dangerous travel and water activities."},
 "Thành":{nen:"Weddings, openings, appointments and major contracts.",kieng:"Lengthy litigation."},
 "Thu":{nen:"Harvesting, storage, collecting money and transactions.",kieng:"New construction and groundbreaking."},
 "Khai":{nen:"Openings, new beginnings, travel and finance.",kieng:"Funerals and burials."},
 "Bế":{nen:"Building walls, closing works and funerals.",kieng:"Openings, travel and starting new ventures."}
};
function renderWheel(chiDayIdx){
 const goodSet=new Set(HOANG_DAO_GROUPS[chiDayIdx%6]), svg=document.getElementById("chiWheel");
 const cx=120,cy=120,rOuter=108,rInner=62; let out="";
 for(let i=0;i<12;i++){
 const a0=(i*30-90-15)*Math.PI/180,a1=(i*30-90+15)*Math.PI/180;
 const x0=cx+rOuter*Math.cos(a0),y0=cy+rOuter*Math.sin(a0);
 const x1=cx+rOuter*Math.cos(a1),y1=cy+rOuter*Math.sin(a1);
 const xi0=cx+rInner*Math.cos(a1),yi0=cy+rInner*Math.sin(a1);
 const xi1=cx+rInner*Math.cos(a0),yi1=cy+rInner*Math.sin(a0);
 const fill=goodSet.has(i)?"var(--brand)":"#dbe7ee";
 const textColor=goodSet.has(i)?"#fff":"#657786";
 out+=`<path d="M ${x0} ${y0} A ${rOuter} ${rOuter} 0 0 1 ${x1} ${y1} L ${xi0} ${yi0} A ${rInner} ${rInner} 0 0 0 ${xi1} ${yi1} Z" fill="${fill}" stroke="#ffffff" stroke-width="2"/>`;
 const amid=(i*30-90)*Math.PI/180,tx=cx+((rOuter+rInner)/2)*Math.cos(amid),ty=cy+((rOuter+rInner)/2)*Math.sin(amid);
 const chiLabel=getLang()==="en" ? CHI_EN[i] : CHI[i];
 out+=`<text x="${tx}" y="${ty+4}" text-anchor="middle" font-size="13" font-weight="600" fill="${textColor}" font-family="Segoe UI Variable,Segoe UI,Inter,Roboto,Arial,sans-serif">${chiLabel}</text>`;
 }
 out+=`<circle cx="${cx}" cy="${cy}" r="${rInner-2}" fill="var(--bg)"/>`;
 const tr=I18N[getLang()];
 out+=`<text x="${cx}" y="${cy-4}" text-anchor="middle" font-size="12" fill="var(--muted)" font-family="Segoe UI Variable,Segoe UI,Inter,Roboto,Arial,sans-serif">${tr.hoursLabel || tr.hours}</text>`;
 out+=`<text x="${cx}" y="${cy+14}" text-anchor="middle" font-size="12" fill="var(--muted)" font-family="Segoe UI Variable,Segoe UI,Inter,Roboto,Arial,sans-serif">${getLang()==="en"?(tr.dayChi || "Day Chi"):"chi ngày"}</text>`;
 svg.innerHTML=out;
}
function renderHourList(chiDayIdx){
 const tr=I18N[getLang()],goodSet=new Set(HOANG_DAO_GROUPS[chiDayIdx%6]);
 document.getElementById("hourList").innerHTML=Array.from({length:12},(_,i)=>{
 const good=goodSet.has(i);
 const range=CHI_HOUR_RANGE[i];
 const displayRange=getLang()==="en" ? range.replace(/h/g,":00").replace("-", "–") : range;
 const chiLabel=getLang()==="en" ? CHI_EN[i] : CHI[i];
 return `<div class="hour-item ${good?"good":""}"><span>${chiLabel}</span><span class="rng">${displayRange}</span></div>`;
 }).join("");
}
function renderCalendar(m,y,selDate){
 const first=new Date(y,m-1,1); let startOffset=first.getDay()-1; if(startOffset<0)startOffset=6;
 const totalDays=daysInMonth(m,y);
 const prevM=m===1?12:m-1,prevY=m===1?y-1:y,prevTotal=daysInMonth(prevM,prevY);
 const cells=[];
 for(let i=0;i<startOffset;i++) cells.push({dd:prevTotal-startOffset+1+i,mm:prevM,yy:prevY,other:true});
 for(let dd=1;dd<=totalDays;dd++) cells.push({dd,mm:m,yy:y,other:false});
 while(cells.length%7!==0||cells.length<42){
 const idx=cells.length-(startOffset+totalDays),nextM=m===12?1:m+1,nextY=m===12?y+1:y;
 cells.push({dd:idx+1,mm:nextM,yy:nextY,other:true});
 if(cells.length>=42)break;
 }
 const dayHeaders=I18N[getLang()].weekdays;
 document.querySelectorAll(".cal-table thead th").forEach((th,i)=>th.textContent=dayHeaders[i]);
 let rows="";
 for(let r=0;r<cells.length/7;r++){
 rows+="<tr>";
 for(let cc=0;cc<7;cc++){
 const cell=cells[r*7+cc];
 const [ld,lm]=convertSolar2Lunar(cell.dd,cell.mm,cell.yy,getTZ(cell.yy));
 const isToday=cell.dd===today.getDate()&&cell.mm===today.getMonth()+1&&cell.yy===today.getFullYear();
 const isSelected=selDate&&cell.dd===selDate.getDate()&&cell.mm===selDate.getMonth()+1&&cell.yy===selDate.getFullYear();
 const classes=["day-cell"];
 if(cell.other)classes.push("other");
 if(cc===6)classes.push("sunday");
 if(isToday)classes.push("today");
 if(isSelected)classes.push("selected");
 if(ld===1)classes.push("first-lunar");
 const lunarLabel=ld===1?`${ld}/${lm}`:ld;
 rows+=`<td><div class="${classes.join(" ")}" data-dd="${cell.dd}" data-mm="${cell.mm}" data-yy="${cell.yy}">
 <span class="sd">${cell.dd}</span><span class="ld">${lunarLabel}</span>
 </div></td>`;
 }
 rows+="</tr>";
 }
 document.getElementById("calBody").innerHTML=rows;
 document.querySelectorAll(".day-cell").forEach(el=>{
 el.addEventListener("click",()=>{
 const dd=+el.dataset.dd,mm=+el.dataset.mm,yy=+el.dataset.yy;
 selected=new Date(yy,mm-1,dd); viewMonth=mm; viewYear=yy; syncSelects();
 renderCalendar(viewMonth,viewYear,selected); renderHero(selected);
 });
 });
}
function populateSelects(){
 const selM=document.getElementById("selMonth"),selY=document.getElementById("selYear");
 const lang=getLang();
 const monthLabel=lang==="en"?"Month":"Tháng";
 const yearLabel=lang==="en"?"Year":"Năm";
 selM.innerHTML=Array.from({length:12},(_,i)=>`<option value="${i+1}">${monthLabel} ${i+1}</option>`).join("");
 selY.innerHTML=Array.from({length:2130-1965+1},(_,i)=>`<option value="${1965+i}">${yearLabel} ${1965+i}</option>`).join("");
 syncSelects();
 selM.addEventListener("change",()=>{viewMonth=+selM.value;renderCalendar(viewMonth,viewYear,selected)});
 selY.addEventListener("change",()=>{viewYear=+selY.value;renderCalendar(viewMonth,viewYear,selected)});
}
function syncSelects(){ document.getElementById("selMonth").value=viewMonth; document.getElementById("selYear").value=viewYear; }
function updateLiveCalendar(){
 const lang=getLang();
 const now=new Date();
 const tz="Asia/Ho_Chi_Minh";
 const parts=new Intl.DateTimeFormat("en-CA",{
 timeZone:tz,year:"numeric",month:"2-digit",day:"2-digit"
 }).formatToParts(now);
 const d={};
 parts.forEach(p=>{if(p.type!=="literal")d[p.type]=Number(p.value);});
 const time=new Intl.DateTimeFormat("vi-VN",{
 timeZone:tz,hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:false
 }).format(now);
 const solar=new Intl.DateTimeFormat(lang==="en"?"en-GB":"vi-VN",{
 timeZone:tz,weekday:"long",day:"2-digit",month:"2-digit",year:"numeric"
 }).format(now);
 const lunar=convertSolar2Lunar(d.day,d.month,d.year,7);
 const location=document.getElementById("liveLocation");
 const clock=document.getElementById("liveCalendarTime");
 const solarEl=document.getElementById("liveSolarDate");
 const lunarEl=document.getElementById("liveLunarDate");
 if(location) location.textContent=lang==="en"
 ?"HO CHI MINH CITY · VIETNAM · GMT+7"
 :"THÀNH PHỐ HỒ CHÍ MINH · VIỆT NAM · GMT+7";
 if(clock) clock.textContent=time;
 if(solarEl) solarEl.textContent=lang==="en"
 ?`Solar: ${solar}`
 :`Dương lịch: ${solar}`;
 if(lunarEl) lunarEl.textContent=lang==="en"
 ?`Lunar: ${lunar[0]}/${lunar[1]}/${lunar[2]}${lunar[3]?" (leap)":""}`
 :`Âm lịch: ${lunar[0]}/${lunar[1]}/${lunar[2]}${lunar[3]?" nhuận":""}`;
}
function renderCalendarUi(){
 const tr=I18N[getLang()];
 document.title=(getLang()==="en"?"Perpetual Calendar | BenADV.com":"Lịch vạn niên | BenADV.com");
 const setText=(id,value)=>{const el=document.getElementById(id);if(el)el.textContent=value;};
 setText("calendarLabel",tr.lunarCalendar.toUpperCase());
 setText("calendarTitle",tr.lunarCalendar);
 setText("calendarIntro",tr.lunarIntro);
 setText("heroCardLabelSolar",tr.solar);
 setText("heroCardLabelLunar",tr.lunar);
 setText("wheelTitle",tr.goodHours);
 setText("legendGood",tr.goodLegend);
 setText("legendBad",tr.badLegend);
 setText("trucLabel",getLang()==="en"?"Day cycle":"Trực hôm nay");
 setText("trucGoodLabel",tr.doTitle);
 setText("trucBadLabel",tr.avoidTitle);
 setText("calendarMonthTitle",tr.calendarMonth);
 setText("btnToday",tr.todayBtn);
 document.getElementById("prevDay").setAttribute("aria-label",tr.previous);
 document.getElementById("nextDay").setAttribute("aria-label",tr.next);
 document.getElementById("prevMonth").setAttribute("aria-label",tr.beforeMonth);
 document.getElementById("nextMonth").setAttribute("aria-label",tr.nextMonth);
 populateSelects();
 renderCalendar(viewMonth,viewYear,selected);
 renderHero(selected);
 updateLiveCalendar();
}
document.getElementById("prevDay").addEventListener("click",()=>{
 selected.setDate(selected.getDate()-1); selected=new Date(selected);
 viewMonth=selected.getMonth()+1; viewYear=selected.getFullYear(); syncSelects();
 renderCalendar(viewMonth,viewYear,selected); renderHero(selected);
});
document.getElementById("nextDay").addEventListener("click",()=>{
 selected.setDate(selected.getDate()+1); selected=new Date(selected);
 viewMonth=selected.getMonth()+1; viewYear=selected.getFullYear(); syncSelects();
 renderCalendar(viewMonth,viewYear,selected); renderHero(selected);
});
document.getElementById("prevMonth").addEventListener("click",()=>{
 if(viewMonth===1&&viewYear<=1965)return;
 viewMonth--; if(viewMonth<1){viewMonth=12;viewYear--;} syncSelects(); renderCalendar(viewMonth,viewYear,selected);
});
document.getElementById("nextMonth").addEventListener("click",()=>{
 if(viewMonth===12&&viewYear>=2130)return;
 viewMonth++; if(viewMonth>12){viewMonth=1;viewYear++;} syncSelects(); renderCalendar(viewMonth,viewYear,selected);
});
document.getElementById("btnToday").addEventListener("click",()=>{
 today=new Date(); selected=new Date(today); viewMonth=selected.getMonth()+1; viewYear=selected.getFullYear();
 syncSelects(); renderCalendar(viewMonth,viewYear,selected); renderHero(selected);
});
window.addEventListener("calendar:language",renderCalendarUi);
renderCalendarUi();
updateLiveCalendar();
setInterval(updateLiveCalendar,1000);
})();
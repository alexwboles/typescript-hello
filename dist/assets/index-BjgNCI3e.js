(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))o(s);new MutationObserver(s=>{for(const a of s)if(a.type==="childList")for(const l of a.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&o(l)}).observe(document,{childList:!0,subtree:!0});function t(s){const a={};return s.integrity&&(a.integrity=s.integrity),s.referrerPolicy&&(a.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?a.credentials="include":s.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function o(s){if(s.ep)return;s.ep=!0;const a=t(s);fetch(s.href,a)}})();const y=8,w=10;function L(n=y,e=w){const t=[];for(let o=0;o<n;o++){const s=[];for(let a=0;a<e;a++)s.push(0);t.push(s)}return t}function m(n){let e="     ";for(let o=1;o<=n[0].length;o++)e+=`${String(o).padStart(2," ")} `;const t=[e,"    "+"---".repeat(n[0].length)];for(let o=0;o<n.length;o++){let s=`R${String(o+1).padStart(2,"0")} |`;for(let a=0;a<n[o].length;a++)s+=n[o][a]===1?" X ":" L ";t.push(s)}return t.join(`
`)}function h(n){console.log(`
Current Screening Room Layout`),console.log(m(n))}function j(n,e,t){return e>=1&&e<=n.length&&t>=1&&t<=n[0].length}function C(n,e,t,o=!0){if(!j(n,e,t)){const c=`Reservation failed: seat (${e}, ${t}) is out of range.`;return o&&console.log(c),[!1,c]}const s=e-1,a=t-1;if(n[s][a]===1){const c=`Reservation failed: seat (${e}, ${t}) is already occupied.`;return o&&console.log(c),[!1,c]}n[s][a]=1;const l=`Reservation confirmed: seat (${e}, ${t}) is now occupied.`;return o&&console.log(l),[!0,l]}function x(n){let e=0;for(let s=0;s<n.length;s++)for(let a=0;a<n[s].length;a++)n[s][a]===1&&e++;const o=n.length*n[0].length-e;return[e,o]}function S(n){let e=0;for(;e<n.length;){let t=0;for(;t<n[e].length-1;){if(n[e][t]===0&&n[e][t+1]===0)return[[e+1,t+1],[e+1,t+2]];t++}e++}return null}function p(n){const[e,t]=x(n);console.log(`Occupied seats: ${e}`),console.log(`Available seats: ${t}`)}function $(n){const e=S(n);return e?`Adjacent seats found: (${e[0][0]}, ${e[0][1]}) and (${e[1][0]}, ${e[1][1]}).`:"No adjacent available seats found."}function A(n,e){let t='<div class="overflow-x-auto"><div class="inline-block min-w-max rounded-2xl border border-slate-200 bg-slate-50 p-4">';t+='<div class="mb-2 grid" style="grid-template-columns: 56px repeat(10, minmax(0, 1fr)); gap: 8px;">',t+='<div class="text-xs font-semibold uppercase tracking-wide text-slate-400">Seat</div>';for(let o=1;o<=n[0].length;o++)t+=`<div class="text-center text-xs font-semibold text-slate-500">${o}</div>`;t+="</div>";for(let o=0;o<n.length;o++){t+='<div class="mb-2 grid" style="grid-template-columns: 56px repeat(10, minmax(0, 1fr)); gap: 8px;">',t+=`<div class="self-center text-sm font-bold text-slate-700">R${String(o+1).padStart(2,"0")}</div>`;for(let s=0;s<n[o].length;s++){let a=!1;for(let u=0;u<e.length;u++)if(e[u][0]===o+1&&e[u][1]===s+1){a=!0;break}const l=n[o][s]===1;t+=`
        <button
          type="button"
          class="seat-btn rounded-lg border px-2 py-2 text-xs font-bold transition ${l?"bg-rose-600 text-white border-rose-700":"bg-emerald-100 text-emerald-900 border-emerald-300 hover:bg-emerald-200"}${a?" ring-2 ring-amber-400 ring-offset-2":""}"
          data-row="${o+1}"
          data-column="${s+1}"
          aria-label="Seat row ${o+1} column ${s+1}"
        >
          ${l?"X":"L"}
        </button>
      `}t+="</div>"}return t+="</div></div>",t}function f(n,e,t){const o=document.querySelector("#interactive-seat-map"),s=document.querySelector("#interactive-status");if(!o||!s)return;const[a,l]=x(n);o.innerHTML=A(n,t),s.textContent=`${e} Occupied: ${a}. Available: ${l}.`}console.clear();console.log("Cinema Seat Manager - TypeScript");const i=L();let g="Click an available seat (L) to reserve it.",r=$(i),d=[];const v=document.querySelector("#app");v&&(v.innerHTML=`
    <section class="space-y-2">
      <h1 class="text-4xl font-black tracking-tight text-slate-900">Cinema Seat Manager</h1>
      <p class="text-slate-600">Interactive challenge complete: use the visual seat map below to reserve seats with clicks.</p>
    </section>

    <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 class="text-xl font-semibold text-slate-900">Interactive Seat Map</h2>
      <p class="mt-2 text-sm text-slate-600">Legend: <span class="font-bold text-emerald-700">L = available</span>, <span class="font-bold text-rose-700">X = occupied</span>.</p>
      <div class="mt-3 flex flex-wrap gap-2">
        <button id="find-adjacent-btn" type="button" class="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-700">Find Adjacent Seats</button>
        <button id="clear-highlights-btn" type="button" class="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">Clear Highlights</button>
      </div>
      <div id="interactive-seat-map" class="mt-4"></div>
      <div id="interactive-status" class="mt-4 rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700"></div>
      
    </section>
  `,f(i,g,d),v.addEventListener("click",n=>{const e=n.target;if(!(e instanceof HTMLElement))return;const t=e.closest("button");if(!(t instanceof HTMLButtonElement))return;if(t.id==="find-adjacent-btn"){console.log(`
Action: Find Adjacent Seats`);const l=S(i);l?(d=[l[0],l[1]],r=`First adjacent available seats: (${l[0][0]}, ${l[0][1]}) and (${l[1][0]}, ${l[1][1]}).`,console.log(r)):(d=[],r="No adjacent available seats found.",console.log(r)),p(i),h(i),f(i,g,d);return}if(t.id==="clear-highlights-btn"){console.log(`
Action: Clear Highlights`),d=[],r="Highlights cleared. Click Find Adjacent Seats to search again.",console.log(r),p(i),f(i,g,d);return}if(!t.classList.contains("seat-btn"))return;const o=Number(t.dataset.row),s=Number(t.dataset.column);if(!Number.isFinite(o)||!Number.isFinite(s))return;console.log(`
Action: Reserve Seat (${o}, ${s})`);const[,a]=C(i,o,s,!0);g=a,d=[],r=$(i),console.log(r),p(i),h(i),f(i,g,d)}));

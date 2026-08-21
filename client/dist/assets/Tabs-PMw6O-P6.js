import{c as s,j as a,m as i}from"./index-DZqDRh-b.js";/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const l=s("Apple",[["path",{d:"M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z",key:"3s7exb"}],["path",{d:"M10 2c1 .5 2 2 2 5",key:"fcco2y"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const x=s("Droplet",[["path",{d:"M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z",key:"c7niix"}]]),p=({tabs:o,activeTab:c,onChange:d})=>a.jsx("div",{className:"flex space-x-1 p-1 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 rounded-xl shadow-xl shadow-black/5 dark:shadow-black/20 w-max overflow-x-auto",children:o.map(e=>{const r=c===e.id,t=e.icon;return a.jsxs("button",{onClick:()=>d(e.id),className:`relative flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${r?"text-primary-600 dark:text-primary-400":"text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100/50 dark:hover:bg-gray-800/50"}`,children:[r&&a.jsx(i.div,{layoutId:"activeTab",className:"absolute inset-0 bg-white dark:bg-gray-800 rounded-lg shadow-sm",transition:{type:"spring",bounce:.2,duration:.6}}),a.jsxs("span",{className:"relative flex items-center gap-2 z-10",children:[t&&a.jsx(t,{className:"w-4 h-4"}),e.label]})]},e.id)})});export{l as A,x as D,p as T};

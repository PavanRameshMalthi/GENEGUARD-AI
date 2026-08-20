import{r as n,j as w}from"./index-w3_qKV60.js";import{M as T,i as L,u as V,a as q,P as X,b as D,L as K,c as k}from"./createLucideIcon-iCBJen6s.js";function F(e,i){if(typeof e=="function")return e(i);e!=null&&(e.current=i)}function U(...e){return i=>{let t=!1;const r=e.map(u=>{const a=F(u,i);return!t&&typeof a=="function"&&(t=!0),a});if(t)return()=>{for(let u=0;u<r.length;u++){const a=r[u];typeof a=="function"?a():F(e[u],null)}}}}function W(...e){return n.useCallback(U(...e),e)}class Z extends n.Component{getSnapshotBeforeUpdate(i){const t=this.props.childRef.current;if(L(t)&&i.isPresent&&!this.props.isPresent&&this.props.pop!==!1){const r=t.offsetParent,u=L(r)&&r.offsetWidth||0,a=L(r)&&r.offsetHeight||0,h=getComputedStyle(t),s=this.props.sizeRef.current;s.height=parseFloat(h.height),s.width=parseFloat(h.width),s.top=t.offsetTop,s.left=t.offsetLeft,s.right=u-s.width-s.left,s.bottom=a-s.height-s.top,s.direction=h.direction}return null}componentDidUpdate(){}render(){return this.props.children}}function B({children:e,isPresent:i,anchorX:t,anchorY:r,root:u,pop:a}){var c;const h=n.useId(),s=n.useRef(null),R=n.useRef({width:0,height:0,top:0,left:0,right:0,bottom:0,direction:"ltr"}),{nonce:b}=n.useContext(T),f=a!==!1?((c=e.props)==null?void 0:c.ref)??(e==null?void 0:e.ref):void 0,M=W(s,f);return n.useInsertionEffect(()=>{const{width:p,height:g,top:C,left:l,right:y,bottom:S,direction:$}=R.current;if(i||a===!1||!s.current||!p||!g)return;const m=$==="rtl",H=t==="left"?m?`right: ${y}`:`left: ${l}`:m?`left: ${l}`:`right: ${y}`,z=r==="bottom"?`bottom: ${S}`:`top: ${C}`;s.current.dataset.motionPopId=h;const x=document.createElement("style");b&&(x.nonce=b);const d=u??document.head;return d.appendChild(x),x.sheet&&x.sheet.insertRule(`
          [data-motion-pop-id="${h}"] {
            position: absolute !important;
            width: ${p}px !important;
            height: ${g}px !important;
            ${H}px !important;
            ${z}px !important;
          }
        `),()=>{var o;(o=s.current)==null||o.removeAttribute("data-motion-pop-id"),d.contains(x)&&d.removeChild(x)}},[i]),w.jsx(Z,{isPresent:i,childRef:s,sizeRef:R,pop:a,children:a===!1?e:n.cloneElement(e,{ref:M})})}const G=({children:e,initial:i,isPresent:t,onExitComplete:r,custom:u,presenceAffectsLayout:a,mode:h,anchorX:s,anchorY:R,root:b})=>{const f=V(Y),M=n.useId(),c=n.useRef(t),p=n.useRef(r);q(()=>{c.current=t,p.current=r});let g=!0,C=n.useMemo(()=>(g=!1,{id:M,initial:i,isPresent:t,custom:u,onExitComplete:l=>{f.set(l,!0);for(const y of f.values())if(!y)return;r&&r()},register:l=>(f.set(l,!1),()=>{var y;f.delete(l),!c.current&&!f.size&&((y=p.current)==null||y.call(p))})}),[t,f,r]);return a&&g&&(C={...C}),n.useMemo(()=>{f.forEach((l,y)=>f.set(y,!1))},[t]),n.useEffect(()=>{!t&&!f.size&&r&&r()},[t]),e=w.jsx(B,{pop:h==="popLayout",isPresent:t,anchorX:s,anchorY:R,root:b,children:e}),w.jsx(X.Provider,{value:C,children:e})};function Y(){return new Map}const j=e=>e.key||"";function I(e){const i=[];return n.Children.forEach(e,t=>{n.isValidElement(t)&&i.push(t)}),i}const N=({children:e,custom:i,initial:t=!0,onExitComplete:r,presenceAffectsLayout:u=!0,mode:a="sync",propagate:h=!1,anchorX:s="left",anchorY:R="top",root:b})=>{const[f,M]=D(h),c=n.useMemo(()=>I(e),[e]),p=h&&!f?[]:c.map(j),g=n.useRef(!0),C=n.useRef(c),l=V(()=>new Map),y=n.useRef(new Set),[S,$]=n.useState(c),[m,H]=n.useState(c);q(()=>{g.current=!1,C.current=c;for(let d=0;d<m.length;d++){const o=j(m[d]);p.includes(o)?(l.delete(o),y.current.delete(o)):l.get(o)!==!0&&l.set(o,!1)}},[m,p.length,p.join("-")]);const z=[];if(c!==S){let d=[...c];for(let o=0;o<m.length;o++){const v=m[o],E=j(v);p.includes(E)||(d.splice(o,0,v),z.push(v))}return a==="wait"&&z.length&&(d=z),H(I(d)),$(c),null}const{forceRender:x}=n.useContext(K);return w.jsx(w.Fragment,{children:m.map(d=>{const o=j(d),v=h&&!f?!1:c===m||p.includes(o),E=()=>{if(y.current.has(o))return;if(l.has(o))y.current.add(o),l.set(o,!0);else return;let P=!0;l.forEach(A=>{A||(P=!1)}),P&&(x==null||x(),H(C.current),h&&(M==null||M()),r&&r())};return w.jsx(G,{isPresent:v,initial:!g.current||t?void 0:!1,custom:i,presenceAffectsLayout:u,mode:a,root:b,onExitComplete:v?void 0:E,anchorX:s,anchorY:R,children:d},o)})})};/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const O=k("ClipboardList",[["rect",{width:"8",height:"4",x:"8",y:"2",rx:"1",ry:"1",key:"tgr4d6"}],["path",{d:"M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",key:"116196"}],["path",{d:"M12 11h4",key:"1jrz19"}],["path",{d:"M12 16h4",key:"n85exb"}],["path",{d:"M8 11h.01",key:"1dfujw"}],["path",{d:"M8 16h.01",key:"18s6g9"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Q=k("FileText",[["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",key:"1rqfz7"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"M10 9H8",key:"b1mrlr"}],["path",{d:"M16 13H8",key:"t4e002"}],["path",{d:"M16 17H8",key:"z1uh3a"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ee=k("Heart",[["path",{d:"M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z",key:"c3ymky"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const te=k("Menu",[["line",{x1:"4",x2:"20",y1:"12",y2:"12",key:"1e0a9i"}],["line",{x1:"4",x2:"20",y1:"6",y2:"6",key:"1owob3"}],["line",{x1:"4",x2:"20",y1:"18",y2:"18",key:"yk5zj1"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ne=k("MessageSquare",[["path",{d:"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",key:"1lielz"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const se=k("Settings",[["path",{d:"M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z",key:"1qme2f"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const re=k("X",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]]);export{N as A,O as C,Q as F,ee as H,te as M,se as S,re as X,ne as a};

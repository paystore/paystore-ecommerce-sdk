(function(m,p){typeof exports=="object"&&typeof module<"u"?p(exports):typeof define=="function"&&define.amd?define(["exports"],p):(m=typeof globalThis<"u"?globalThis:m||self,p(m.PaystoreEcommerceSdk={}))})(this,(function(m){"use strict";var p=(t=>(t.FRICTIONLESS="FRICTIONLESS",t.ACS_URL_CHALLENGE="ACS_URL_CHALLENGE",t.ACS_FORM_CHALLENGE="ACS_FORM_CHALLENGE",t.IFRAME_CHALLENGE="IFRAME_CHALLENGE",t.JAVASCRIPT="JAVASCRIPT",t))(p||{}),x=(t=>(t.PROCESSING="PROCESSING",t.PENDING="PENDING",t.WAITING_VALIDATION="WAITING_VALIDATION",t.WAITING_CAPTURE="WAITING_CAPTURE",t.CONFIRMED="CONFIRMED",t.DECLINED="DECLINED",t.REFUNDED="REFUNDED",t.ERROR="ERROR",t.CANCELLED="CANCELLED",t.WAITING_PAYMENT="WAITING_PAYMENT",t.WAITING_3DS_AUTHENTICATION="WAITING_3DS_AUTHENTICATION",t.PENDING_NOT_RESOLVED="PENDING_NOT_RESOLVED",t.WAITING_ANTIFRAUD="WAITING_ANTIFRAUD",t.WAITING_CANCELLATION="WAITING_CANCELLATION",t))(x||{});const J=["CONFIRMED"],ee=["DECLINED","ERROR","CANCELLED","REFUNDED"];function te(t){return J.includes(t)||ee.includes(t)}var ie=(t=>(t.ACTIVE="ACTIVE",t.FINISHED="FINISHED",t.CANCELLED="CANCELLED",t.WAITING_3DS_AUTHENTICATION="WAITING_3DS_AUTHENTICATION",t.WAITING_ANTIFRAUD="WAITING_ANTIFRAUD",t.WAITING_IMMEDIATE_BILLING="WAITING_IMMEDIATE_BILLING",t))(ie||{});const Y=["ACTIVE"],ne=["CANCELLED","FINISHED"];function re(t){return Y.includes(t)||ne.includes(t)}function ae(t){return te(t)||re(t)}function N(t){return t?J.includes(t)||Y.includes(t):!1}function oe(t){return"payment_authorization"in t&&t.payment_authorization!=null}function R(t){return"status"in t&&"subscription_id"in t&&!("payment_authorization"in t)}function I(t){if(oe(t))return t.payment_authorization?.status;if(R(t))return t.status}function v(t){return"payment_identifier"in t&&typeof t.payment_identifier=="string"}function E(t){return"subscription_identifier"in t&&typeof t.subscription_identifier=="string"}function A(t){const e="payment_identifier"in t&&typeof t.payment_identifier=="string"&&t.payment_identifier.length>0,i="subscription_identifier"in t&&typeof t.subscription_identifier=="string"&&t.subscription_identifier.length>0;return e&&i?{field:"identifier",cause:"Provide exactly one of payment_identifier or subscription_identifier, not both."}:!e&&!i?{field:"identifier",cause:"Either payment_identifier or subscription_identifier is required."}:null}class k{apiToken;baseUrl;PAYMENT_ENDPOINT_PATH="/ecommerce/v1/payment";SUBSCRIPTION_ENDPOINT_PATH="/ecommerce/v1/subscription";THREE_DS_NOTIFICATION_ENDPOINT_PATH="/ecommerce/v1/3ds/notification";async init(e){const i=[];if((!e.base_url||e.base_url.trim()==="")&&i.push({field:"base_url",cause:"base_url is required and cannot be empty"}),i.length>0&&e.onInvalid){e.onInvalid(i);return}this.apiToken=e.api_token,this.baseUrl=e.base_url}setApiKey(e){this.apiToken=e}setBaseUrl(e){this.baseUrl=e}async fetchPaymentStatus(e){const r=`${this.baseUrl.replace(/\/$/,"")}${this.PAYMENT_ENDPOINT_PATH}/${e}`,n=this.apiToken,a=await fetch(r,{method:"GET",headers:{"Content-Type":"application/json",Authorization:`Bearer ${n}`}});if(!a.ok){const s=await a.text();return Promise.reject({status:"ERROR",message:`Failed to fetch payment status. HTTP ${a.status}: ${s}`,paymentIdentifier:e})}const c=await a.json();return I(c)?c:Promise.reject({status:"ERROR",message:"Internal error: Failed to verify transaction.",paymentIdentifier:e})}async fetchSubscriptionStatus(e){const r=`${this.baseUrl.replace(/\/$/,"")}${this.SUBSCRIPTION_ENDPOINT_PATH}/${e}`,n=this.apiToken,a=await fetch(r,{method:"GET",headers:{"Content-Type":"application/json",Authorization:`Bearer ${n}`}});if(!a.ok){const o=await a.text();return Promise.reject({status:"ERROR",message:`Failed to fetch subscription status. HTTP ${a.status}: ${o}`,subscriptionIdentifier:e})}const c=await a.json();return c.status?c:Promise.reject({status:"ERROR",message:"Internal error: Failed to verify subscription transaction.",subscriptionIdentifier:e})}async notifyThreeDsResult(e,i){const n=`${this.baseUrl.replace(/\/$/,"")}${this.THREE_DS_NOTIFICATION_ENDPOINT_PATH}/${e.toUpperCase()}`,a=this.apiToken,c=new URLSearchParams;Object.entries(i).forEach(([s,l])=>{l!=null&&l!==""&&c.append(s,l)});const o=await fetch(n,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded",Authorization:`Bearer ${a}`},body:c.toString()});if(!o.ok){const s=await o.text();return Promise.reject({status:"ERROR",message:`Failed to notify 3DS result. HTTP ${o.status}: ${s}`})}}}async function C(t){const{fetchStatus:e,onStep:i}=t,r=1e3,n=180;return new Promise((a,c)=>{let o=0,s;const l=async()=>{o++;try{const d=await e(),h=I(d);if(i&&i(d),h&&ae(h)){clearTimeout(s),a(d);return}}catch{}if(o>=n){clearTimeout(s),c({status:"TIMEOUT",message:`Polling timed out after ${o} attempts.`});return}s=setTimeout(l,r)};l()})}function F(t){return t?{valid:!0}:{valid:!1,error:{field:"apiToken",cause:"API token is required."}}}function O(t,e,i){return e.includes(t)?{valid:!0}:{valid:!1,error:{field:"mode",cause:`${i} provider does not support mode ${p}.`}}}function K(t){return t?{valid:!0}:{valid:!1,error:{field:"threeDSInfo.acs_url",cause:"Missing 'acs_url'."}}}class ce extends k{providerName="Rede";WINDOW_TARGET_NAME="paystoreThreeDSAuthWindow";supportedTypes=[p.ACS_URL_CHALLENGE,p.FRICTIONLESS];async authenticate(e){const{three_ds_type:i,three_ds_info:r,onSuccess:n=()=>{},onFailure:a=()=>{},onInvalid:c=()=>{}}=e,o=A(e);if(o){c([o]);return}const s=v(e)?e.payment_identifier:void 0,l=E(e)?e.subscription_identifier:void 0,d=F(this.apiToken);if(!d.valid){c([d.error]);return}const h=O(i,this.supportedTypes,this.providerName);if(!h.valid){c([h.error]);return}if(!r){c([{field:"three_ds_info",cause:"Missing three_ds_info"}]);return}if(i===p.ACS_URL_CHALLENGE){const f=K(r.acs_url);if(!f.valid){c([f.error]);return}typeof window<"u"&&window.open(r.acs_url,this.WINDOW_TARGET_NAME)}const u=s?()=>this.fetchPaymentStatus(s):()=>this.fetchSubscriptionStatus(l);try{const f=await C({fetchStatus:u});n(f)}catch(f){a(f)}}}class de extends k{providerName="Shift4";WINDOW_TARGET_NAME="paystoreThreeDSAuthWindow";supportedTypes=[p.ACS_URL_CHALLENGE,p.FRICTIONLESS];async authenticate(e){const{three_ds_type:i,three_ds_info:r,onSuccess:n=()=>{},onFailure:a=()=>{},onInvalid:c=()=>{}}=e,o=A(e);if(o){c([o]);return}const s=v(e)?e.payment_identifier:void 0,l=E(e)?e.subscription_identifier:void 0,d=F(this.apiToken);if(!d.valid){c([d.error]);return}const h=O(i,this.supportedTypes,this.providerName);if(!h.valid){c([h.error]);return}if(!r){c([{field:"three_ds_info",cause:"Missing three_ds_info"}]);return}if(i===p.ACS_URL_CHALLENGE){const f=K(r.acs_url);if(!f.valid){c([f.error]);return}typeof window<"u"&&window.open(r.acs_url,this.WINDOW_TARGET_NAME)}const u=s?()=>this.fetchPaymentStatus(s):()=>this.fetchSubscriptionStatus(l);try{const f=await C({fetchStatus:u});n(f)}catch(f){a(f)}}}class le extends k{METHOD_NOTIFICATION_PATH="/ecommerce/v1/3ds/method/globalPayments";WINDOW_TARGET_NAME="paystoreThreeDSAuthWindow";lastExecutedChallengeType=null;supportedTypes=[p.FRICTIONLESS,p.ACS_FORM_CHALLENGE,p.IFRAME_CHALLENGE];createInput(e,i){const r=document.createElement("input");return r.type="hidden",r.name=e,r.value=i,r}performIframeChallenge(e,i){const r=`${this.baseUrl}${this.METHOD_NOTIFICATION_PATH}`,a=JSON.stringify({threeDSServerTransID:i,threeDSMethodNotificationURL:r}),c=btoa(a),o=document.createElement("iframe");o.name="hiddenThreeDSIframe",o.style.display="none",o.setAttribute("allow","fullscreen"),o.setAttribute("referrerpolicy","no-referrer"),o.setAttribute("sandbox","allow-scripts allow-forms allow-same-origin"),document.body.appendChild(o);const s=document.createElement("form");s.method="POST",s.action=e,s.setAttribute("target","hiddenThreeDSIframe");const l=this.createInput("threeDSMethodData",c);s.appendChild(l),document.body.appendChild(s),s.submit()}performPostChallenge(e){const i=document.createElement("form");i.method="POST",i.action=e,i.target=this.WINDOW_TARGET_NAME,document.body.appendChild(i),i.submit(),document.body.removeChild(i)}handleNewChallenge(e){const i=e.three_ds_type;if(!i||this.lastExecutedChallengeType===i)return;const r=e.iframe_url||e.acs_url,n=e.trxid;i===p.IFRAME_CHALLENGE?r&&n&&(this.performIframeChallenge(r,n),this.lastExecutedChallengeType=i):i===p.ACS_FORM_CHALLENGE&&r&&(this.performPostChallenge(r),this.lastExecutedChallengeType=i)}async authenticate(e){const{three_ds_type:i,three_ds_info:r,onSuccess:n=()=>{},onFailure:a=()=>{},onInvalid:c=()=>{}}=e,o=A(e);if(o){c([o]);return}const s=v(e)?e.payment_identifier:void 0,l=E(e)?e.subscription_identifier:void 0;if(typeof window>"u"){c([{field:"environment",cause:"Browser environment required."}]);return}if(!this.apiToken){c([{field:"apiToken",cause:"Missing Token"}]);return}if(!r){c([{field:"threeDSInfo",cause:"Missing threeDSInfo"}]);return}const d=O(i,this.supportedTypes,"Entrepay");if(!d.valid){c([d.error]);return}if(i===p.ACS_FORM_CHALLENGE){const u=K(r.acs_url);if(!u.valid){c([u.error]);return}}if(i===p.IFRAME_CHALLENGE){const u=[];if(!r.acs_url&&!r.iframe_url&&u.push({field:"threeDSInfo.acs_url",cause:"Missing acs_url/iframe_url"}),r.trxid||u.push({field:"threeDSInfo.trxid",cause:"Missing trxid"}),u.length>0){c(u);return}}this.lastExecutedChallengeType=null,i&&r&&this.handleNewChallenge({three_ds_type:i,...r});const h=s?()=>this.fetchPaymentStatus(s):()=>this.fetchSubscriptionStatus(l);try{const u=await C({fetchStatus:h,onStep:g=>{const b=I(g),_=(R(g),g.three_ds_info_response);b===x.WAITING_3DS_AUTHENTICATION&&_&&this.handleNewChallenge(_)}}),f=I(u);N(f)?n(u):a(u)}catch(u){a({status:u.status||"ERROR",message:u.message||"Erro desconhecido.",payment_identifier:s,subscription_identifier:l})}}}const ue={timeout:"30000",maxRequestRetries:"10",payment:{displayLoading:!0,displayExitButton:!0}};function X(){if(typeof window>"u"||!window.Cardinal)throw new Error("Cardinal is not available in current browser context.");return window.Cardinal}function fe(t){try{const e=Q(t);if(!e){console.warn("[ps-ecommerce-sdk] JWT payload could not be decoded.");return}const i=JSON.parse(e),r=Math.floor(Date.now()/1e3),n=i.exp,a=i.iat,c=i.iss,o=i.jti;console.info("[ps-ecommerce-sdk] Cardinal JWT diagnostics:",{iss:c,jti:o,iat:a?new Date(a*1e3).toISOString():void 0,exp:n?new Date(n*1e3).toISOString():void 0,now:new Date(r*1e3).toISOString(),ttlSeconds:n?n-r:"no exp claim",expired:n?r>=n:"unknown"}),n&&r>=n?console.error(`[ps-ecommerce-sdk] ⚠ JWT EXPIRED before Cardinal.setup()! Expired ${r-n}s ago. This is likely the cause of ErrorNumber 1010 (Invalid Signature).`):n&&n-r<10&&console.warn(`[ps-ecommerce-sdk] ⚠ JWT expires in ${n-r}s — very tight window, may expire during Cardinal initialization.`)}catch{console.warn("[ps-ecommerce-sdk] Could not parse JWT for diagnostics.")}}async function G(t,e){if(typeof window>"u")throw new Error("Browser environment required.");if(window.Cardinal)return;const i=e?.timeoutMs??15e3,r=`cardinal-songbird-${btoa(t).replace(/=/g,"")}`;let n=document.getElementById(r);n||(n=document.createElement("script"),n.id=r,n.type="text/javascript",n.src=t,n.async=!0,e?.integrity&&(n.crossOrigin="anonymous",n.integrity=e.integrity),document.head.appendChild(n)),await new Promise((a,c)=>{const o=setTimeout(()=>{c(new Error("Timed out while loading Cardinal Songbird."))},i);n.addEventListener("load",()=>{clearTimeout(o),a()}),n.addEventListener("error",()=>{clearTimeout(o),c(new Error("Failed to load Cardinal Songbird script."))})})}async function V(t){const e=X();if(e.off?.("payments.validated"),e.off?.("payments.setupComplete"),t.config){const n={...ue,...t.config};e.configure(n)}t.onValidated&&e.on("payments.validated",(n,a)=>{t.onValidated(n,a)});let i=null;const r=new Promise(n=>{i=n});e.on("payments.setupComplete",async()=>{try{t.onSetupComplete&&await t.onSetupComplete()}finally{i?.()}}),t.initJwt&&(fe(t.initJwt),e.setup("init",{jwt:t.initJwt}),await r)}async function W(t,e){const i=X();await Promise.resolve(i.trigger(t,e))}function w(t){const e=t.encoded_pareq??t.payload;if(!t.acs_url||!e)return!1;const i=t.trxid;return i?(X().continue("cca",{AcsUrl:t.acs_url,Payload:e},{OrderDetails:{TransactionId:i}}),!0):!1}function pe(t){const e=H(t.card_number);return!e||e.length<6?null:e.substring(0,6)}function H(t){if(!t)return null;const e=t.replace(/\D/g,"");return e.length>0?e:null}function Q(t){try{const e=t.split(".")[1];if(!e)return"";const i=e.replace(/-/g,"+").replace(/_/g,"/");return decodeURIComponent(atob(i).split("").map(r=>"%"+("00"+r.charCodeAt(0).toString(16)).slice(-2)).join(""))}catch{return""}}function j(){let t="",e=!1,i=null,r=null,n=null,a=null;return{reset(){t="",e=!1,i=null,a&&clearTimeout(a),n&&n(new Error("Cardinal validation tracker reset before completion.")),r=null,n=null,a=null},handleValidated(c,o){const s=c?.ActionCode?.toUpperCase();if(s&&s!=="SUCCESS"&&s!=="NOACTION"&&(e=!0),!o){i={event:c,jwt:o},a&&clearTimeout(a),r?.(i),r=null,n=null,a=null;return}const l=Q(o);!l||t===l||(t=l,l.includes("ChallengeCancel")&&(e=!0),i={event:c,jwt:o},a&&clearTimeout(a),r?.(i),r=null,n=null,a=null)},wasCancelled(){return e},waitForValidation(c=3e5){return i?Promise.resolve(i):new Promise((o,s)=>{r=o,n=s,a=setTimeout(()=>{r=null,n=null,a=null,s(new Error("Timed out while waiting for Cardinal validation."))},c)})}}}function B(t,e){return t?.cardinal??e}function $(t,e){return t?.cardinal?.cardinal_token??t?.cardinal_token??e?.cardinal_token}function se(t){return t.replace(/[^a-zA-Z0-9]/g,"").toLowerCase()}function L(t,e){const i=new Set(e.map(se)),r=new Set,n=[t];for(;n.length>0;){const a=n.shift();if(!(!a||typeof a!="object")&&!r.has(a)){if(r.add(a),Array.isArray(a)){n.push(...a);continue}for(const[c,o]of Object.entries(a)){if(i.has(se(c)))return o==null?void 0:String(o);o&&typeof o=="object"&&n.push(o)}}}}function U(t){const e=t.event?.ActionCode?.toUpperCase()??void 0;let i=null;if(t.jwt){const n=Q(t.jwt);if(n)try{i=JSON.parse(n)}catch{i=n}}const r={payment_identifier:t.paymentIdentifier,subscription_identifier:t.subscriptionIdentifier,acs_token:t.jwt??void 0,eci:L(i,["eci"]),cavv:L(i,["cavv"]),xid:L(i,["xid"]),three_ds_trxid:L(i,["dsTransId","ds_trans_id","threeDsServerTransId","three_ds_server_trans_id","threeDsTrxid","three_ds_trxid","transactionId","transaction_id","trxid"])??t.info.trxid,acstrxid:L(i,["acsTransId","acs_trans_id","acstrxid"]),action_code:e??L(i,["actionCode","action_code","ActionCode"]),three_ds_version:L(i,["messageVersion","message_version","threeDsVersion","three_ds_version"])??t.info.version};return Object.fromEntries(Object.entries(r).filter(([,n])=>n!=null&&n!==""))}class he extends k{providerName="Adiq";supportedTypes=[p.FRICTIONLESS,p.JAVASCRIPT];validationTracker=j();WINDOW_TARGET_NAME="paystoreThreeDSAuthWindow";closeChallengeWindow(){if(typeof window<"u")try{const e=window.open("",this.WINDOW_TARGET_NAME);e&&!e.closed&&e.close()}catch{}}async startCardinal(e,i,r,n){await G(i,{integrity:r}),await V({initJwt:n,onValidated:(a,c)=>this.validationTracker.handleValidated(a,c),onSetupComplete:async()=>{const a=pe(e);a&&await W("bin.process",a)}})}async authenticate(e){const{acquirer_name:i,three_ds_type:r,three_ds_info:n,cardinal:a,onSuccess:c=()=>{},onFailure:o=()=>{},onInvalid:s=()=>{}}=e,l=A(e);if(l){s([l]);return}const d=v(e)?e.payment_identifier:void 0,h=E(e)?e.subscription_identifier:void 0,u=B(n,a),f=$(n,a);if(typeof window>"u"){s([{field:"environment",cause:"Browser environment required."}]);return}const g=F(this.apiToken);if(!g.valid){s([g.error]);return}const b=O(r,this.supportedTypes,this.providerName);if(!b.valid){s([b.error]);return}if(!n){s([{field:"three_ds_info",cause:"Missing three_ds_info"}]);return}if(!u?.songbird_url){s([{field:"cardinal.songbird_url",cause:"Missing cardinal.songbird_url."}]);return}if(!u.integrity){s([{field:"cardinal.integrity",cause:"Missing cardinal.integrity."}]);return}if(r===p.JAVASCRIPT&&!f){s([{field:"three_ds_info.cardinal_token",cause:"Missing cardinal_token for Cardinal setup."}]);return}this.validationTracker.reset();try{await this.startCardinal(n,u.songbird_url,u.integrity,f),r!==p.FRICTIONLESS&&w(n);const _=await this.validationTracker.waitForValidation();await this.notifyThreeDsResult(i,U({paymentIdentifier:d,subscriptionIdentifier:h,info:n,event:_.event,jwt:_.jwt}));const y=await C({fetchStatus:d?()=>this.fetchPaymentStatus(d):()=>this.fetchSubscriptionStatus(h),interval:1e3,maxAttempts:180,onStep:T=>{const P=I(T),S=R(T)?T.three_ds_info_response:T.three_ds_info;P===x.WAITING_3DS_AUTHENTICATION&&S&&w(S)}}),D=I(y);this.closeChallengeWindow(),N(D)&&!this.validationTracker.wasCancelled()?c(y):o(y)}catch(_){o({status:_.status||"ERROR",message:_.message||"Erro desconhecido.",payment_identifier:d,subscription_identifier:h})}}}const M="ps-ecommerce-sdk-sandbox-challenge",_e="123456",me=3e5,ge=800,Te=1200,be="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.Et9HFtf9R3GEMA0IICOfFMVXY7kkTX1wr4qCyhIf58U",ye=`
  #${M} *,
  #${M} *::before,
  #${M} *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  #${M} {
    position: fixed;
    top: 0; left: 0;
    width: 100%; height: 100%;
    background-color: rgba(0, 0, 0, 0.48);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999999;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
                 "Helvetica Neue", Arial, sans-serif;
    color: #1a1a1a;
    line-height: 1.5;
  }

  /* ── Card container ──────────────────────────────────────────── */

  .acs-card {
    background: #fff;
    border-radius: 14px;
    border: 1px solid #d5d9e0;
    max-width: 420px;
    width: 94%;
    max-height: 96vh;
    overflow-y: auto;
    box-shadow:
      0 2px 8px rgba(0, 0, 0, 0.08),
      0 12px 40px rgba(0, 0, 0, 0.15);
    display: flex;
    flex-direction: column;
  }

  /* ── Header ──────────────────────────────────────────────────── */

  .acs-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 24px;
    border-bottom: 1px solid #e5e7eb;
    flex-shrink: 0;
    background-color: #fafbfc;
    border-radius: 14px 14px 0 0;
  }

  .acs-header__logo {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .acs-header__logo-placeholder {
    width: 34px;
    height: 34px;
    border-radius: 7px;
    background-color: #ebeef2;
    border: 1px solid #d0d4db;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .acs-header__logo-placeholder svg {
    width: 18px;
    height: 18px;
    color: #8b95a5;
  }

  .acs-header__issuer-name {
    font-size: 0.8125rem;
    font-weight: 600;
    color: #3b4251;
    letter-spacing: 0.01em;
  }

  .acs-header__badge {
    font-size: 0.6875rem;
    font-weight: 600;
    color: #5a6577;
    background-color: #eef0f4;
    border: 1px solid #d5d9e0;
    border-radius: 5px;
    padding: 4px 10px;
    letter-spacing: 0.03em;
    white-space: nowrap;
    flex-shrink: 0;
    text-transform: uppercase;
  }

  /* ── Main content area ───────────────────────────────────────── */

  .acs-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 32px 28px 24px;
    max-width: 400px;
    width: 100%;
    margin: 0 auto;
  }

  .acs-title {
    font-size: 1.25rem;
    font-weight: 700;
    color: #1a1a1a;
    margin-bottom: 10px;
    text-align: center;
  }

  .acs-instruction {
    font-size: 0.875rem;
    color: #555;
    margin-bottom: 24px;
    line-height: 1.6;
    text-align: center;
  }

  /* ── Transaction summary ─────────────────────────────────────── */

  .acs-summary {
    width: 100%;
    background-color: #f8f9fb;
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    padding: 14px 18px;
    margin-bottom: 28px;
  }

  .acs-summary__row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 6px 0;
    font-size: 0.8125rem;
  }

  .acs-summary__row + .acs-summary__row {
    border-top: 1px solid #eef0f2;
  }

  .acs-summary__label {
    color: #6b7685;
    font-weight: 400;
  }

  .acs-summary__value {
    color: #2b3241;
    font-weight: 600;
    text-align: right;
  }

  /* ── OTP form ────────────────────────────────────────────────── */

  .acs-form {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    width: 100%;
    margin-bottom: 8px;
  }

  .acs-form__label {
    font-size: 0.8125rem;
    font-weight: 500;
    color: #444;
    align-self: center;
    margin-bottom: 2px;
  }

  .acs-form__input {
    width: 100%;
    max-width: 240px;
    height: 54px;
    border: 2px solid #c8cdd5;
    border-radius: 10px;
    font-size: 1.5rem;
    font-weight: 600;
    text-align: center;
    letter-spacing: 0.35em;
    color: #1a1a1a;
    background-color: #fff;
    outline: none;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
    -moz-appearance: textfield;
    font-family: inherit;
  }

  .acs-form__input::-webkit-outer-spin-button,
  .acs-form__input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  .acs-form__input::placeholder {
    color: #bbb;
    font-weight: 400;
    letter-spacing: 0.3em;
  }

  .acs-form__input:focus {
    border-color: #3366cc;
    box-shadow: 0 0 0 3px rgba(51, 102, 204, 0.12);
  }

  .acs-form__input--invalid {
    border-color: #cc3333 !important;
    box-shadow: 0 0 0 3px rgba(204, 51, 51, 0.08) !important;
  }

  .acs-form__input--invalid:focus {
    box-shadow: 0 0 0 3px rgba(204, 51, 51, 0.15) !important;
  }

  .acs-form__error {
    font-size: 0.8125rem;
    color: #cc3333;
    min-height: 1.3em;
    text-align: center;
    margin-top: 0;
  }

  /* ── Primary button ──────────────────────────────────────────── */

  .acs-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    max-width: 240px;
    height: 48px;
    border: none;
    border-radius: 10px;
    font-size: 0.9375rem;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.15s ease, opacity 0.15s ease;
    outline: none;
    -webkit-tap-highlight-color: transparent;
    font-family: inherit;
    margin-top: 4px;
  }

  .acs-btn:focus-visible {
    box-shadow: 0 0 0 3px rgba(51, 102, 204, 0.3);
  }

  .acs-btn--primary {
    background-color: #2557a7;
    color: #fff;
  }

  .acs-btn--primary:hover:not(:disabled) {
    background-color: #1e4a8f;
  }

  .acs-btn--primary:active:not(:disabled) {
    background-color: #1a3f7a;
  }

  .acs-btn--primary:disabled {
    background-color: #a0b4d0;
    cursor: not-allowed;
  }

  /* ── OTP hint ────────────────────────────────────────────────── */

  .acs-hint {
    width: 100%;
    margin-top: 4px;
    padding: 10px 14px;
    background-color: #f0f4fa;
    border: 1px solid #d8e0ee;
    border-radius: 8px;
    font-size: 0.75rem;
    color: #4a5568;
    line-height: 1.5;
    text-align: center;
  }

  .acs-hint__code {
    font-family: "SF Mono", "Cascadia Code", "Fira Code", Consolas, monospace;
    font-weight: 700;
    color: #2557a7;
    letter-spacing: 0.08em;
  }

  /* ── Spinner ─────────────────────────────────────────────────── */

  .acs-spinner {
    width: 20px;
    height: 20px;
    border: 2.5px solid rgba(255, 255, 255, 0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: acs-spin 0.7s linear infinite;
    display: inline-block;
  }

  .acs-loading-overlay {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
    padding: 48px 24px;
    min-height: 220px;
  }

  .acs-loading-overlay__spinner {
    width: 40px;
    height: 40px;
    border: 3.5px solid #e5e7eb;
    border-top-color: #2557a7;
    border-radius: 50%;
    animation: acs-spin 0.8s linear infinite;
  }

  .acs-loading-overlay__text {
    font-size: 0.875rem;
    color: #666;
  }

  @keyframes acs-spin {
    to { transform: rotate(360deg); }
  }

  /* ── Success state ───────────────────────────────────────────── */

  .acs-success {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
    padding: 48px 24px;
    text-align: center;
    min-height: 220px;
  }

  .acs-success__icon {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background-color: #e8f5e9;
    border: 1px solid #c8e6c9;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .acs-success__icon svg {
    width: 28px;
    height: 28px;
    color: #2e7d32;
  }

  .acs-success__message {
    font-size: 1rem;
    font-weight: 600;
    color: #2e7d32;
  }

  /* ── Timeout state ───────────────────────────────────────────── */

  .acs-timeout {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
    padding: 48px 24px;
    text-align: center;
    min-height: 220px;
  }

  .acs-timeout__icon {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background-color: #fff3e0;
    border: 1px solid #ffe0b2;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .acs-timeout__icon svg {
    width: 28px;
    height: 28px;
    color: #e65100;
  }

  .acs-timeout__message {
    font-size: 1rem;
    font-weight: 600;
    color: #e65100;
  }

  /* ── Footer ──────────────────────────────────────────────────── */

  .acs-footer {
    padding: 14px 24px;
    border-top: 1px solid #e5e7eb;
    text-align: center;
    flex-shrink: 0;
    background-color: #fafbfc;
    border-radius: 0 0 14px 14px;
  }

  .acs-footer__text {
    font-size: 0.6875rem;
    color: #8b95a5;
    letter-spacing: 0.01em;
  }

  /* ── Utility: hidden ─────────────────────────────────────────── */

  .acs-hidden {
    display: none !important;
  }

  /* ── Reduced motion ──────────────────────────────────────────── */

  @media (prefers-reduced-motion: reduce) {
    .acs-spinner,
    .acs-loading-overlay__spinner {
      animation-duration: 1.5s;
    }
  }
`,Ie='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 3l-4 4-4-4"/></svg>',Se='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',ve='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>';function Ee(){const t=document.createElement("style");t.setAttribute("data-sandbox-dialog","true"),t.textContent=ye;const e=document.createElement("div");e.id=M,e.setAttribute("role","dialog"),e.setAttribute("aria-modal","true"),e.setAttribute("aria-label","Sandbox ACS Simulator");const i=document.createElement("div");i.className="acs-card",i.insertAdjacentHTML("beforeend",`<header class="acs-header" role="banner">
      <div class="acs-header__logo">
        <div class="acs-header__logo-placeholder" aria-hidden="true">${Ie}</div>
        <span class="acs-header__issuer-name">Issuer Bank</span>
      </div>
      <span class="acs-header__badge">ACS Simulator</span>
    </header>`),i.insertAdjacentHTML("beforeend",`<div data-state="loading" class="acs-loading-overlay acs-hidden" role="status" aria-live="polite">
      <div class="acs-loading-overlay__spinner" aria-hidden="true"></div>
      <p class="acs-loading-overlay__text">Carregando desafio de autenticação...</p>
    </div>`),i.insertAdjacentHTML("beforeend",`<main data-state="otp" class="acs-main acs-hidden" role="main">
      <h1 class="acs-title">Digite o código de verificação</h1>
      <p class="acs-instruction">
        Este é um ambiente de testes. Informe o código OTP simulado para continuar a autenticação.
      </p>
      <div class="acs-summary" aria-label="Resumo da transação simulada">
        <div class="acs-summary__row">
          <span class="acs-summary__label">Ambiente</span>
          <span class="acs-summary__value">Sandbox</span>
        </div>
        <div class="acs-summary__row">
          <span class="acs-summary__label">Método</span>
          <span class="acs-summary__value">OTP</span>
        </div>
      </div>
      <form class="acs-form" novalidate autocomplete="off" aria-label="Formulário de código OTP"
            data-testid="sandbox-otp-form">
        <label class="acs-form__label" for="acs-otp-input">Código OTP</label>
        <input
          id="acs-otp-input"
          class="acs-form__input"
          type="text"
          inputmode="numeric"
          autocomplete="one-time-code"
          pattern="[0-9]{6}"
          maxlength="6"
          placeholder="000000"
          aria-required="true"
          aria-describedby="acs-otp-error"
          aria-invalid="false"
          data-testid="sandbox-otp-input"
        >
        <p id="acs-otp-error" class="acs-form__error" role="alert" aria-live="assertive"
           data-testid="sandbox-otp-error"></p>
        <button
          class="acs-btn acs-btn--primary"
          type="submit"
          aria-label="Continuar autenticação"
          data-testid="sandbox-otp-submit"
        >Continuar</button>
      </form>
      <div class="acs-hint" data-testid="sandbox-otp-hint">
        Use <span class="acs-hint__code">123456</span> para aprovar a autenticação.
        Qualquer outro código será recusado.
      </div>
    </main>`),i.insertAdjacentHTML("beforeend",`<div data-state="success" class="acs-success acs-hidden" role="status" aria-live="polite">
      <div class="acs-success__icon" aria-hidden="true">${Se}</div>
      <p class="acs-success__message">Autenticação simulada concluída.</p>
    </div>`),i.insertAdjacentHTML("beforeend",`<div data-state="timeout" class="acs-timeout acs-hidden" role="alert" aria-live="assertive">
      <div class="acs-timeout__icon" aria-hidden="true">${ve}</div>
      <p class="acs-timeout__message">Tempo limite excedido no simulador ACS.</p>
    </div>`),i.insertAdjacentHTML("beforeend",`<footer class="acs-footer" role="contentinfo">
      <p class="acs-footer__text">Sandbox ACS Simulator — Ambiente de testes EMV 3DS</p>
    </footer>`),e.appendChild(i);const r={loading:i.querySelector('[data-state="loading"]'),otp:i.querySelector('[data-state="otp"]'),success:i.querySelector('[data-state="success"]'),timeout:i.querySelector('[data-state="timeout"]')},n=i.querySelector('[data-testid="sandbox-otp-form"]'),a=i.querySelector('[data-testid="sandbox-otp-input"]'),c=i.querySelector('[data-testid="sandbox-otp-error"]'),o=i.querySelector('[data-testid="sandbox-otp-submit"]');return{style:t,overlay:e,stateEls:r,form:n,input:a,errorEl:c,submitBtn:o}}function q(t,e,i){for(const[r,n]of Object.entries(t))r===e?n.classList.remove("acs-hidden"):n.classList.add("acs-hidden");e==="otp"&&i&&i.focus()}function Ae(t={}){return new Promise(e=>{Ce();const i=t.timeoutMs??me,{style:r,overlay:n,stateEls:a,form:c,input:o,errorEl:s,submitBtn:l}=Ee();let d=null,h=!1;function u(f){h||(h=!0,d!==null&&clearTimeout(d),f.outcome==="confirmed"?(q(a,"success",o),setTimeout(()=>{n.remove(),r.remove(),e(f)},1200)):f.outcome==="timeout"?(q(a,"timeout",o),setTimeout(()=>{n.remove(),r.remove(),e(f)},2e3)):(n.remove(),r.remove(),e(f)))}o.addEventListener("input",()=>{const f=o.value.replace(/\D/g,"").slice(0,6);f!==o.value&&(o.value=f),o.classList.remove("acs-form__input--invalid"),o.setAttribute("aria-invalid","false"),s.textContent=""}),c.addEventListener("submit",f=>{if(f.preventDefault(),h)return;const g=o.value.trim();if(g.length!==6){o.classList.add("acs-form__input--invalid"),o.setAttribute("aria-invalid","true"),s.textContent="Informe um código de 6 dígitos.",o.focus();return}o.classList.remove("acs-form__input--invalid"),o.setAttribute("aria-invalid","false"),s.textContent="",l.disabled=!0,l.innerHTML='<span class="acs-spinner" aria-hidden="true"></span>',l.setAttribute("aria-label","Verificando código..."),setTimeout(()=>{h||u(g===_e?{confirmed:!0,outcome:"confirmed"}:{confirmed:!1,outcome:"rejected"})},ge)}),d=setTimeout(()=>{u({confirmed:!1,outcome:"timeout"})},i),document.head.appendChild(r),document.body.appendChild(n),q(a,"loading",o),setTimeout(()=>{h||q(a,"otp",o)},Te)})}function Ce(){const t=document.getElementById(M);t&&t.remove(),document.querySelectorAll('style[data-sandbox-dialog="true"]').forEach(i=>i.remove())}class we extends k{providerName="PagSeguro";supportedTypes=[p.FRICTIONLESS,p.JAVASCRIPT];validationTracker=j();WINDOW_TARGET_NAME="paystoreThreeDSAuthWindow";closeChallengeWindow(){if(typeof window<"u")try{const e=window.open("",this.WINDOW_TARGET_NAME);e&&!e.closed&&e.close()}catch{}}async startCardinal(e,i,r,n){await G(i,n?{integrity:n}:void 0),await V({initJwt:r,onValidated:(a,c)=>this.validationTracker.handleValidated(a,c),onSetupComplete:async()=>{const a=H(e.card_number);a&&await W("accountNumber.update",a)}})}async authenticateSandbox(e){const{acquirer_name:i,three_ds_type:r,three_ds_info:n,onSuccess:a=()=>{},onFailure:c=()=>{}}=e,o=v(e)?e.payment_identifier:void 0,s=E(e)?e.subscription_identifier:void 0;let l=null,d={ActionCode:"SUCCESS"};if(r!==p.FRICTIONLESS){const{confirmed:b,outcome:_}=await Ae();b?l=n.payload??n.encoded_pareq??null:(l=be,d={ActionCode:_==="timeout"?"TIMEOUT":"CANCEL"})}await this.notifyThreeDsResult(i,U({paymentIdentifier:o,subscriptionIdentifier:s,info:n,event:d,jwt:l}));const u=await C({fetchStatus:o?()=>this.fetchPaymentStatus(o):()=>this.fetchSubscriptionStatus(s)}),f=I(u),g=d.ActionCode!=="SUCCESS";this.closeChallengeWindow(),N(f)&&!g?a(u):c(u)}async authenticate(e){const{acquirer_name:i,three_ds_type:r,three_ds_info:n,cardinal:a,onSuccess:c=()=>{},onFailure:o=()=>{},onInvalid:s=()=>{}}=e,l=A(e);if(l){s([l]);return}const d=v(e)?e.payment_identifier:void 0,h=E(e)?e.subscription_identifier:void 0;if(typeof window>"u"){s([{field:"environment",cause:"Browser environment required."}]);return}const u=F(this.apiToken);if(!u.valid){s([u.error]);return}const f=O(r,this.supportedTypes,this.providerName);if(!f.valid){s([f.error]);return}if(!n){s([{field:"three_ds_info",cause:"Missing three_ds_info"}]);return}if(n.cardinal?.sandbox===!0){try{await this.authenticateSandbox(e)}catch(_){o({status:_.status||"ERROR",message:_.message||"Erro desconhecido.",payment_identifier:d,subscription_identifier:h})}return}const g=B(n,a),b=$(n,a);if(!g?.songbird_url){s([{field:"cardinal.songbird_url",cause:"Missing cardinal.songbird_url."}]);return}if(r===p.JAVASCRIPT&&!b){s([{field:"three_ds_info.cardinal_token",cause:"Missing cardinal_token for Cardinal setup."}]);return}try{this.validationTracker.reset(),await this.startCardinal(n,g.songbird_url,b,g.integrity),r!==p.FRICTIONLESS&&w(n);const _=await this.validationTracker.waitForValidation();await this.notifyThreeDsResult(i,U({paymentIdentifier:d,subscriptionIdentifier:h,info:n,event:_.event,jwt:_.jwt}));const y=await C({fetchStatus:d?()=>this.fetchPaymentStatus(d):()=>this.fetchSubscriptionStatus(h),interval:1e3,maxAttempts:180,onStep:T=>{const P=I(T),S=R(T)?T.three_ds_info_response:T.three_ds_info;P===x.WAITING_3DS_AUTHENTICATION&&S&&w(S)}}),D=I(y);this.closeChallengeWindow(),N(D)&&!this.validationTracker.wasCancelled()?c(y):o(y)}catch(_){o({status:_.status||"ERROR",message:_.message||"Erro desconhecido.",payment_identifier:d,subscription_identifier:h})}}}class xe extends k{providerName="Cielo";supportedTypes=[p.FRICTIONLESS,p.JAVASCRIPT];validationTracker=j();async startCardinal(e,i,r){await G(i),await V({initJwt:r,config:{timeout:"8000",maxRequestRetries:"10"},onValidated:(n,a)=>this.validationTracker.handleValidated(n,a),onSetupComplete:async()=>{const n=H(e.card_number);n&&await W("accountNumber.update",n)}})}async authenticate(e){const{acquirer_name:i,three_ds_type:r,three_ds_info:n,cardinal:a,onSuccess:c=()=>{},onFailure:o=()=>{},onInvalid:s=()=>{}}=e,l=A(e);if(l){s([l]);return}const d=v(e)?e.payment_identifier:void 0,h=E(e)?e.subscription_identifier:void 0,u=B(n,a),f=$(n,a);if(typeof window>"u"){s([{field:"environment",cause:"Browser environment required."}]);return}const g=F(this.apiToken);if(!g.valid){s([g.error]);return}const b=O(r,this.supportedTypes,this.providerName);if(!b.valid){s([b.error]);return}if(!n){s([{field:"three_ds_info",cause:"Missing three_ds_info"}]);return}if(!u?.songbird_url){s([{field:"cardinal.songbird_url",cause:"Missing cardinal.songbird_url."}]);return}if(r===p.JAVASCRIPT&&!f){s([{field:"three_ds_info.cardinal_token",cause:"Missing cardinal_token for Cardinal setup."}]);return}try{this.validationTracker.reset(),await this.startCardinal(n,u.songbird_url,f),r!==p.FRICTIONLESS&&w(n);const _=await this.validationTracker.waitForValidation();await this.notifyThreeDsResult(i,U({paymentIdentifier:d,subscriptionIdentifier:h,info:n,event:_.event,jwt:_.jwt}));const y=await C({fetchStatus:d?()=>this.fetchPaymentStatus(d):()=>this.fetchSubscriptionStatus(h),interval:1e3,maxAttempts:180,onStep:T=>{const P=I(T),S=R(T)?T.three_ds_info_response:T.three_ds_info;P===x.WAITING_3DS_AUTHENTICATION&&S&&w(S)}}),D=I(y);N(D)&&!this.validationTracker.wasCancelled()?c(y):o(y)}catch(_){o({status:_.status||"ERROR",message:_.message||"Erro desconhecido.",payment_identifier:d,subscription_identifier:h})}}}class Ne extends k{providerName="Getnet";supportedTypes=[p.FRICTIONLESS,p.JAVASCRIPT];validationTracker=j();async startCardinal(e,i,r){await G(i),await V({initJwt:r,config:{timeout:"8000",maxRequestRetries:"10",payment:{view:"modal",displayLoading:!0,displayExitButton:!0}},onValidated:(n,a)=>this.validationTracker.handleValidated(n,a),onSetupComplete:async()=>{const n=H(e.card_number);n&&await W("bin.process",n)}})}async authenticate(e){const{acquirer_name:i,three_ds_type:r,three_ds_info:n,cardinal:a,onSuccess:c=()=>{},onFailure:o=()=>{},onInvalid:s=()=>{}}=e,l=A(e);if(l){s([l]);return}const d=v(e)?e.payment_identifier:void 0,h=E(e)?e.subscription_identifier:void 0,u=B(n,a),f=$(n,a);if(typeof window>"u"){s([{field:"environment",cause:"Browser environment required."}]);return}const g=F(this.apiToken);if(!g.valid){s([g.error]);return}const b=O(r,this.supportedTypes,this.providerName);if(!b.valid){s([b.error]);return}if(!n){s([{field:"three_ds_info",cause:"Missing three_ds_info"}]);return}if(!u?.songbird_url){s([{field:"cardinal.songbird_url",cause:"Missing cardinal.songbird_url."}]);return}if(r===p.JAVASCRIPT&&!f){s([{field:"three_ds_info.cardinal_token",cause:"Missing cardinal_token for Cardinal setup."}]);return}try{this.validationTracker.reset(),await this.startCardinal(n,u.songbird_url,f),r!==p.FRICTIONLESS&&w(n);const _=await this.validationTracker.waitForValidation();await this.notifyThreeDsResult(i,U({paymentIdentifier:d,subscriptionIdentifier:h,info:n,event:_.event,jwt:_.jwt}));const y=await C({fetchStatus:d?()=>this.fetchPaymentStatus(d):()=>this.fetchSubscriptionStatus(h),interval:1e3,maxAttempts:180,onStep:T=>{const P=I(T),S=R(T)?T.three_ds_info_response:T.three_ds_info;P===x.WAITING_3DS_AUTHENTICATION&&S&&w(S)}}),D=I(y);N(D)&&!this.validationTracker.wasCancelled()?c(y):o(y)}catch(_){o({status:_.status||"ERROR",message:_.message||"Erro desconhecido.",payment_identifier:d,subscription_identifier:h})}}}class Re{static providerMap={REDE:ce,SHIFT4:de,ENTREPAY:le,ADIQ:he,PAGSEGURO:we,CIELO:xe,GETNET:Ne};static create(e,i){const r=this.providerMap[e.toUpperCase()];return r?new r:(i&&i([{field:"acquirerName",cause:`Unknown provider: ${e}`}]),null)}}let z;const ke={async init(t){z=t},async authenticate(t){const{onInvalid:e=()=>{}}=t;if(!z||!z.api_token){e([{field:"apiToken",cause:"ProviderAPI.init must be called first."}]);return}const i=A(t);if(i){e([i]);return}const r=Re.create(t.acquirer_name);if(!r){e([{field:"acquirerName",cause:`Unknown provider: ${t.acquirer_name}`}]);return}await r.init(z),await r.authenticate(t)}};m.FINAL_FAILURE_STATUSES=ee,m.FINAL_SUBSCRIPTION_FAILURE_STATUSES=ne,m.FINAL_SUBSCRIPTION_SUCCESS_STATUSES=Y,m.FINAL_SUCCESS_STATUSES=J,m.PaymentStatus=x,m.PaymentSubscriptionStatus=ie,m.PaystoreEcommerceProvider=ke,m.ThreeDSType=p,m.extractStatusFromPollingResponse=I,m.isFinalPaymentStatus=te,m.isFinalStatus=ae,m.isFinalSubscriptionStatus=re,m.isPaymentFlow=v,m.isPaymentPollingResponse=oe,m.isSubscriptionFlow=E,m.isSubscriptionPollingResponse=R,m.isSuccessfulFinalStatus=N,m.validateIdentifier=A,Object.defineProperty(m,Symbol.toStringTag,{value:"Module"})}));

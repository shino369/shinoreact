"use strict";(self.webpackChunkshinoreact=self.webpackChunkshinoreact||[]).push([[316],{54316:function(e,t,r){r.r(t),r.d(t,{ChatPage:function(){return g}});var s=r(74165),n=r(15861),a=r(70885),o=r(72791),i=r(59434),l=r(39478),c=r(9062),d=r(18643),u=r(80922),m=r(43720),h=r(55705),p=r(81724),f=r(763),v=r.n(f),b=r(80184),x=p.Ry().shape({msg:p.Z_().required("required")}),g=function(){var e=(0,i.I0)(),t=(0,i.v9)((function(e){return e.auth})).user,r=(0,o.useState)([]),p=(0,a.Z)(r,2),f=(p[0],p[1],(0,o.useState)(!1)),g=(0,a.Z)(f,2),w=g[0],j=g[1];(0,o.useEffect)((function(){e((0,l.wC)("chat"))}),[e]);var N=(0,c.IO)((0,c.hJ)(d.db,"messages"),(0,c.Xo)("createdAt"),(0,c.b9)(100)),y=(0,u.sQ)(N),k=(0,o.useRef)(null);(0,o.useEffect)((function(){k.current.scrollTo(0,k.current.scrollHeight)}),[y]);var C=v().debounce((function(e){var t=e.target.scrollTop,r=e.target.scrollHeight,s=e.target.clientHeight;j(t+s+200<r)}),100),R=function(){var e=(0,n.Z)((0,s.Z)().mark((function e(r,n){var a,o,i;return(0,s.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(a=r.msg,!((o=a.trim()).length>0)){e.next=8;break}return(0,c.hJ)(d.db,"messages"),i={uid:t.uid,displayName:t.displayName,photoURL:t.photoURL,message:o,createdAt:c.EK.now()},e.next=7,(0,c.ET)((0,c.hJ)(d.db,"messages"),i);case 7:e.sent;case 8:n.resetForm();case 9:case"end":return e.stop()}}),e)})));return function(t,r){return e.apply(this,arguments)}}();return(0,b.jsx)("div",{className:"d-flex justify-content-center chatroom-wrapper px-sm-4 pt-sm-3 pb-sm-5",children:(0,b.jsxs)("div",{className:"chatroom overflow-hidden shadow d-flex flex-column position-relative",children:[(0,b.jsx)("div",{className:"room-title border-bottom text-center py-3 shadow",children:"Realtime Chat Room"}),(0,b.jsx)("div",{onClick:function(){k.current.scrollTo({top:k.current.scrollHeight,behavior:"smooth"})},style:{borderRadius:"50%",opacity:w?1:0,transform:w?"translateY(0)":"translateX(100%)"},className:"position-absolute scroll-to pointer transition mb-5 mb-sm-0 shadow",children:(0,b.jsx)(m.JO,{svg:!0,name:"arrow-down",size:30,color:"white"})}),(0,b.jsx)("div",{ref:k,onScroll:C,className:"room-content hideScroll",children:y.map((function(e,r){return(0,b.jsx)(m.z5,{name:e.displayName,message:e.message,self:(null===t||void 0===t?void 0:t.uid)===(null===e||void 0===e?void 0:e.uid),avatar:e.photoURL,uid:e.uid,createdAt:e.createdAt},r)}))}),(0,b.jsx)("div",{className:"border-top pt-3 pb-5 pb-sm-3",children:(0,b.jsx)(h.J9,{initialValues:{msg:""},validationSchema:x,onSubmit:R,children:function(e){var t,r=e.values;return(0,b.jsxs)(h.l0,{className:"d-flex w-100 px-4",children:[(0,b.jsx)("div",{className:"col",children:(0,b.jsx)(m.UP,{style:{backgroundColor:"rgba(54, 57, 63, 0.8)",border:"none",caretColor:"white",color:"white",resize:"none"},name:"msg",placeholder:"Input something...",type:"textarea",showError:!1,rows:null===(t=r.msg)||void 0===t?void 0:t.split("\n").length})}),(0,b.jsx)("div",{className:"d-flex align-items-center",children:(0,b.jsx)("button",{className:"btn btn-primary btn-block",type:"submit",children:"SEND"})}),(0,b.jsx)("div",{className:"mt-4 text-center"})]})}})})]})})}}}]);
//# sourceMappingURL=316.4b20b67c.chunk.js.map
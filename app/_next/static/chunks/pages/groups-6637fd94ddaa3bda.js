(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[736],{11150:function(e,n,i){(window.__NEXT_P=window.__NEXT_P||[]).push(["/groups",function(){return i(77130)}])},80983:function(e,n,i){"use strict";i.d(n,{Z:function(){return g}});var r=i(24246),s=i(90354),l=i(93308),t=i(94460),o=i(86411),c=i(83401),d=i(27378),a=i(29947),u=i.n(a),h=i(90684),x=i(29946),m=i(96853),p=i(34619),j=i(44937);function f(e){let[n,i]=(0,d.useState)(null),[t,a]=(0,d.useState)(null),u=(0,s.ff)("gray.100","gray.700");async function h(e){let n=await e.recursivelyPopulateSubitems();i((0,p.fC)(n)),a((0,p.k3)(n))}(0,d.useEffect)(()=>{h(e.document)},[e.document.revision]);let f=null!==n&&null!==t;return(0,r.jsxs)(l.Tr,{height:"73px",children:[(0,r.jsx)(l.Td,{width:"144px",borderColor:u,children:(0,r.jsx)(m.Od,{isLoaded:f,children:(0,r.jsx)(c.M5,{children:(0,r.jsxs)(o.hE,{isAttached:!0,size:"sm",children:[(0,r.jsx)(o.hU,{icon:(0,r.jsx)(x.dY,{}),"aria-label":"Edit",onClick:e.onEdit}),(0,r.jsx)(o.hU,{icon:(0,r.jsx)(x.TI,{}),"aria-label":"Duplicate",onClick:e.onCopy}),(0,r.jsx)(o.hU,{icon:(0,r.jsx)(x.pJ,{}),"aria-label":"Delete",onClick:e.onDelete})]})})})}),(0,r.jsx)(l.Td,{borderColor:u,children:(0,r.jsx)(m.Od,{isLoaded:f,children:(0,r.jsx)(c.xv,{minW:"176px",maxW:"448px",noOfLines:2,whiteSpace:"initial",children:e.document.name})})}),(0,r.jsx)(l.Td,{isNumeric:!0,borderColor:u,children:(0,r.jsx)(m.Od,{isLoaded:f,children:j.o.format((null!=t?t:999)/100)})}),(0,r.jsx)(l.Td,{isNumeric:!0,borderColor:u,children:(0,r.jsx)(m.Od,{isLoaded:f,children:e.document.count})}),(0,r.jsx)(l.Td,{isNumeric:!0,borderColor:u,children:(0,r.jsxs)(m.Od,{isLoaded:f,children:[null==n?void 0:n.massGrams,"g"]})}),(0,r.jsx)(l.Td,{isNumeric:!0,borderColor:u,children:(0,r.jsxs)(m.Od,{isLoaded:f,children:[null==n?void 0:n.energyKilocalories,"kcal"]})}),(0,r.jsx)(l.Td,{isNumeric:!0,borderColor:u,children:(0,r.jsxs)(m.Od,{isLoaded:f,children:[null==n?void 0:n.fatGrams,"g"]})}),(0,r.jsx)(l.Td,{isNumeric:!0,borderColor:u,children:(0,r.jsxs)(m.Od,{isLoaded:f,children:[null==n?void 0:n.carbohydrateGrams,"g"]})}),(0,r.jsx)(l.Td,{isNumeric:!0,borderColor:u,children:(0,r.jsxs)(m.Od,{isLoaded:f,children:[null==n?void 0:n.proteinGrams,"g"]})})]},e.document.id)}function g(e){var n,i;let a=(0,s.ff)("blackAlpha.600","whiteAlpha.600"),x=(0,s.ff)("gray.100","gray.400");return(0,r.jsxs)(d.Fragment,{children:[(0,r.jsx)(l.xJ,{className:"hide-scrollbar",children:(0,r.jsxs)(l.iA,{children:[(0,r.jsx)(l.hr,{children:(0,r.jsxs)(l.Tr,{children:[(0,r.jsx)(l.Th,{width:"144px",children:"Actions"}),(0,r.jsx)(l.Th,{width:"496px",children:(0,r.jsx)(t.II,{placeholder:h.c.fields.name.spec.label,value:e.nameSearch,onChange(n){e.onNameSearchChange(n.currentTarget.value)},size:"sm",variant:"unstyled"})}),(0,r.jsx)(l.Th,{isNumeric:!0,children:(0,r.jsx)(o.zx,{variant:"ghost",textTransform:"uppercase",size:"xs",color:x,onClick(){e.onToggleServingOrTotal&&e.onToggleServingOrTotal()},children:e.servingOrTotal})}),(0,r.jsx)(l.Th,{isNumeric:!0,children:h.c.fields.count.spec.label}),(0,r.jsx)(l.Th,{isNumeric:!0,children:h.c.fields.massGrams.spec.label}),(0,r.jsx)(l.Th,{isNumeric:!0,children:h.c.fields.energyKilocalories.spec.label}),(0,r.jsx)(l.Th,{isNumeric:!0,children:h.c.fields.fatGrams.spec.label}),(0,r.jsx)(l.Th,{isNumeric:!0,children:h.c.fields.carbohydrateGrams.spec.label}),(0,r.jsx)(l.Th,{isNumeric:!0,children:h.c.fields.proteinGrams.spec.label})]})}),(0,r.jsx)(u(),{pageStart:0,loadMore:()=>e.fetchMore(),hasMore:!e.isExhausted,element:"tbody",children:null===(n=e.documents)||void 0===n?void 0:n.map(n=>(0,r.jsx)(f,{document:n,priceType:e.servingOrTotal,onEdit:function(){e.onEdit(n)},onCopy:function(){e.onCopy(n)},onDelete:function(){e.onDelete(n)}},"".concat(n.id,"-itr")))})]})}),(null===(i=e.documents)||void 0===i?void 0:i.length)===0&&void 0!==e.emptyStateText&&!e.isFetching&&(0,r.jsx)(c.M5,{pt:"30vh",children:(0,r.jsx)(c.xv,{color:a,align:"center",px:3,children:e.emptyStateText})})]})}},75993:function(e,n,i){"use strict";var r,s;function l(e){switch(e){case r.serving:return r.total;case r.total:return r.serving}}i.d(n,{L:function(){return r},V:function(){return l}}),(s=r||(r={})).serving="Serving price",s.total="Total price"},77130:function(e,n,i){"use strict";i.r(n),i.d(n,{default:function(){return h}});var r=i(24246),s=i(27378),l=i(93627),t=i(7751),o=i(65006),c=i(80983),d=i(24925),a=i(85536),u=i(75993);function h(){let[e,n]=(0,s.useState)(""),[i,h]=(0,s.useState)(null),[x,m]=(0,s.useState)(null),[p,j]=(0,s.useState)(u.L.serving),[f,g]=(0,s.useState)([]),T=(0,l.useRxCollection)("item"),v=(0,l.useRxQuery)(null==T?void 0:T.find({selector:{type:a.O.group,name:{$regex:RegExp("\\b"+e+".*","i")}}}),{pageSize:12,pagination:"Infinite"});return(0,r.jsxs)(s.Fragment,{children:[(0,r.jsx)(c.Z,{nameSearch:e,emptyStateText:"Groups are collections of Items or other Groups, like a recipe or meal.",onNameSearchChange(e){n(e)},servingOrTotal:p,onToggleServingOrTotal:()=>j((0,u.V)(p)),documents:v.result,fetchMore:v.fetchMore,isFetching:v.isFetching,isExhausted:v.isExhausted,onEdit:e=>h(e),onCopy(e){let n=e.toMutableJSON(),i=(0,d.Y)();n.id=i,n.date=new Date,n.name="Copied ".concat(n.name),null==T||T.upsert(n)},onDelete(e){m(e)}}),(0,r.jsx)(o.$,{item:i,async onResult(e){h(null),e&&(e.date=new Date,null==T||T.upsert(e),v.resetList())}}),(0,r.jsx)(t.R,{isOpen:null!==x,onResult:function(e){e&&(null==x||x.remove()),m(null)}})]})}}},function(e){e.O(0,[717,774,888,179],function(){return e(e.s=11150)}),_N_E=e.O()}]);
!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e(require("vue")):"function"==typeof define&&define.amd?define(["vue"],e):(t="undefined"!=typeof globalThis?globalThis:t||self).VueWordCloud=e(t.Vue)}(this,(function(t){"use strict";function e(t,e,o,n,l){let a=document.createElement("span");return a.style.font="1px serif",a.style.fontFamily=t,a.style.fontSize=`${e}px`,a.style.fontStyle=o,a.style.fontVariant=n,a.style.fontWeight=l,a.style.font}return t.defineComponent({name:"VueWordCloud",props:{fontFamily:{type:String,default:"serif"},fontSizeRatio:{type:Number,default:0},fontStyle:{type:String,default:"normal"},fontVariant:{type:String,default:"normal"},fontWeight:{type:String,default:"normal"},spacing:{type:Number,default:0},words:Array},setup(o,{emit:n,slots:l}){let a,i=t.computed((()=>{let{words:t,fontFamily:e,fontWeight:n,fontVariant:l,fontStyle:a}=o;return t?t.map((({text:t,weight:o})=>({text:t,weight:o,fontFamily:e,fontWeight:n,fontVariant:l,fontStyle:a}))):[]})),r=t.shallowRef(),f=t.shallowRef(0),u=t.shallowRef(0),s=t.shallowRef([]);return t.onMounted((()=>{let e=setInterval((()=>{let t=r.value;t&&(f.value=t.offsetWidth,u.value=t.offsetHeight)}),1e3);t.onUnmounted((()=>{clearInterval(e)}))})),t.watchEffect((()=>{let t=i.value,o=f.value,n=u.value;clearTimeout(a),a=setTimeout((()=>{let l=t.map((({fontFamily:t,fontStyle:l,fontVariant:a,fontWeight:i,text:r,weight:f})=>({color:"Black",font:e(t,8+16*Math.random(),l,a,i),key:Math.random(),left:Math.random()*o,rotation:Math.random()*Math.PI,text:r,top:Math.random()*n,weight:f})));s.value=l}),1)})),t.watch(s,(t=>{n("update:cloudWords",t)})),()=>{let e=s.value,o=(()=>{let t=l.word;return t||(({text:t})=>t)})();return t.h("div",{style:{height:"100%",position:"relative",width:"100%"},ref:r},[t.h("div",{style:{bottom:"50%",position:"absolute",right:"50%",transform:"translate(50%,50%)"}},e.map((({color:e,font:n,key:l,left:a,rotation:i,text:r,top:f,weight:u})=>t.h("div",{key:l,style:{left:`${a}px`,position:"absolute",top:`${f}px`}},[t.h("div",{style:{bottom:"50%",color:e,font:n,position:"absolute",right:"50%",transform:["translate(50%,50%)",`rotate(${i}rad)`].join(" "),whiteSpace:"nowrap"}},o({color:e,font:n,left:a,text:r,top:f,weight:u}))]))))])}}})}));
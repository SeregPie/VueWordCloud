!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e(require("vue")):"function"==typeof define&&define.amd?define(["vue"],e):t.VueWordCloud=e(t.Vue)}(this,function(t){"use strict";t=t&&t.hasOwnProperty("default")?t.default:t;!function(t){function e(){for(var e=[],n=arguments.length;n--;)e[n]=arguments[n];t.apply(this,e),this.name="InterruptError"}t&&(e.__proto__=t),e.prototype=Object.create(t&&t.prototype),e.prototype.constructor=e}(Error);var e=function(t){return t[t.length-1]},n=function(t,e,n){return[Math.ceil(t*Math.abs(Math.cos(n))+e*Math.abs(Math.sin(n))),Math.ceil(t*Math.abs(Math.sin(n))+e*Math.abs(Math.cos(n)))]},r=function(t){return 2*t*Math.PI},o=function(t,e,n){if(t>0&&e>0){var r,o;t>e?(r=1,o=e/t):e>t?(o=1,r=t/e):r=o=1;var i=Math.floor(t/2),a=Math.floor(e/2),f=t-i,u=e-a;if(i<f)for(var c=i;c<=f;++c){var h=[c,a];if(n(h))return h}else if(a<u)for(var l=a;l<=u;++l){var d=[i,l];if(n(d))return d}for(var s=i,p=a,y=f,g=u;f<t||u<e;){i-=r,a-=o,f+=r,u+=o;var v=Math.floor(i),m=Math.floor(a),S=Math.ceil(f),w=Math.ceil(u);if(S>y)for(var x=m;x<w;++x){var W=[S,x];if(n(W))return W}if(w>g)for(var M=S;M>v;--M){var F=[M,w];if(n(F))return F}if(v<s)for(var z=w;z>m;--z){var b=[v,z];if(n(b))return b}if(m<p)for(var V=v;V<S;++V){var T=[V,m];if(n(T))return T}s=v,p=m,y=S,g=w}}throw new Error},i=function(t,e){if(t.length>0)return t.map(e).reduce(function(t,e){return Math.min(t,e)})},a=function(t,e){if(t.length>0)return t.map(e).reduce(function(t,e){return Math.max(t,e)})},f={name:"VueWordCloud",render:function(t){var e=this,n=this.scaledBoundedWords;return t("div",{style:{position:"relative",width:"100%",height:"100%"}},n.map(function(n){var r=n.key,o=n.text,i=n.weight,a=n.color,f=n.fontFamily,u=n.fontSize,c=n.fontStyle,h=n.fontVariant,l=n.fontWeight,d=n.rotation,s=n.rectLeft,p=n.rectTop,y=n.rectWidth,g=n.rectHeight;return t("div",{key:r,style:{position:"absolute",left:s+y/2+"px",top:p+g/2+"px",transform:"rotate("+d+"turn)"}},[t("div",{style:{position:"absolute",left:"50%",top:"50%",color:a,font:[c,h,l,u+"px/1",f].join(" "),whiteSpace:"nowrap",transform:"translate(-50%, -50%)"}},[e.$scopedSlots.default?e.$scopedSlots.default({text:o,weight:i,color:a,fontFamily:f,fontSize:u,fontStyle:c,fontVariant:h,fontWeight:l,rotation:d}):o])])}))},props:{words:{type:Array,default:function(){return[]}},text:{type:[String,Function],default:""},weight:{type:[Number,Function],default:1},rotation:{type:[String,Function],default:function(){var t=[0,.75];return function(){return function(t){return t[Math.floor(t.length*Math.random())]}(t)}}},fontFamily:{type:[String,Function],default:"serif"},fontStyle:{type:[String,Function],default:"normal"},fontVariant:{type:[String,Function],default:"normal"},fontWeight:{type:[String,Function],default:"normal"},color:{type:[String,Function],default:"Black"},fontSizeRatio:{type:Number,default:0},maxFontSize:{type:Number,default:1/0},intervalBetweenUpdateContainerSize:{type:Number,default:1e3}},data:function(){return{containerWidth:0,containerHeight:0,fulfilledBoundedWords:[]}},mounted:function(){this.startToUpdateContainerSize()},computed:{normalizedWords:function(){var t=this,e=function(){var t={};return function(e){var n=JSON.stringify(e),r=t[n]||0;return t[n]=r+1,r>0&&(n+="-"+r),n}}();return this.words.map(function(n){var r,o,i,a,f,u,c,h;if(n)switch(typeof n){case"string":r=n;break;case"object":if(Array.isArray(n)){var l;r=(l=n)[0],o=l[1]}else{var d;r=(d=n).text,o=d.weight,i=d.rotation,a=d.fontFamily,f=d.fontStyle,u=d.fontVariant,c=d.fontWeight,h=d.color}}return void 0===r&&(r="function"==typeof t.text?t.text(n):t.text),void 0===o&&(o="function"==typeof t.weight?t.weight(n):t.weight),void 0===i&&(i="function"==typeof t.rotation?t.rotation(n):t.rotation),void 0===a&&(a="function"==typeof t.fontFamily?t.fontFamily(n):t.fontFamily),void 0===f&&(f="function"==typeof t.fontStyle?t.fontStyle(n):t.fontStyle),void 0===u&&(u="function"==typeof t.fontVariant?t.fontVariant(n):t.fontVariant),void 0===c&&(c="function"==typeof t.fontWeight?t.fontWeight(n):t.fontWeight),void 0===h&&(h="function"==typeof t.color?t.color(n):t.color),{key:e([r,a,f,u,c]),text:r,weight:o,rotation:i,fontFamily:a,fontStyle:f,fontVariant:u,fontWeight:c,color:h}})},boundedWords:function(){var t=this.containerWidth,i=this.containerHeight,a=this.normalizedWords,f=this.fontSizeRatio,u=[];if(a.length>0&&t>0&&i>0){var c=t/i;a=function(t,e){return a.map(function(t){return[e(t),t]}).sort(function(t,e){var n=t[0],r=e[0];return n>r?1:n<r?-1:0}).map(function(t){return t[1]})}(0,function(t){return-t.weight});var h,l=e(a).weight,d=a[0].weight;l<d&&f>0&&f<1/0?(f<1&&(f=1/f),h=function(t){return function(e,n,r,o,i){return o+(t-n)*(f-o)/(d-n)}(0,l,0,1)}):((a=function(t,e){for(var n=t.length;n-- >0&&!e(t[n],n););return t.slice(0,n+1)}(a,function(t){return t.weight>0})).length>0&&(l=e(a).weight),h=function(t){return t/l});for(var s=Math.pow(2,22),p=Math.floor(Math.sqrt(c*s)),y=Math.floor(s/p),g=Array(p*y).fill(0),v=0,m=a.length;v<m;++v){var S=a[v];try{var w=S.key,x=S.text,W=S.weight,M=S.rotation,F=S.fontFamily,z=S.fontStyle,b=S.fontVariant,V=S.fontWeight,T=S.color,H=4*h(W),C=r(M),k=[z,b,V,H+"px",F].join(" "),B=document.createElement("canvas").getContext("2d");B.font=k;var A=B.measureText(x).width;if(A>0){var L=H,j=Math.max(B.measureText("m").width,H),N=A+2*j,U=L+2*j,_=n(A,L,C),E=_[0],q=_[1],I=n(N,U,C),O=I[0],R=I[1],$=Array(O*R).fill(0);B.canvas.width=O,B.canvas.height=R,B.translate(O/2,R/2),B.rotate(C),B.font=k,B.textAlign="center",B.textBaseline="middle",B.fillText(x,0,0);for(var D=B.getImageData(0,0,O,R).data,P=0,J=$.length;P<J;++P)$[P]=D[4*P+3];for(var G=[],K=0;K<O;++K)for(var Q=0;Q<R;++Q)$[O*Q+K]&&G.push([K,Q]);var X=o(p-O,y-R,function(t){for(var e=t[0],n=t[1],r=0,o=G.length;r<o;++r){var i=G[r],a=i[0],f=i[1];if(a+=e,f+=n,g[p*f+a])return!1}for(var u=0,c=G.length;u<c;++u){var h=G[u],l=h[0],d=h[1];g[p*(d+=n)+(l+=e)]=1}return!0}),Y=X[0]+(O-E)/2,Z=X[1]+(R-q)/2;u.push({key:w,text:x,weight:W,rotation:M,fontFamily:F,fontSize:H,fontStyle:z,fontVariant:b,fontWeight:V,rectLeft:Y,rectTop:Z,rectWidth:E,rectHeight:q,textWidth:A,textHeight:L,color:T})}}catch(t){}}}return u},scaledBoundedWords:function(){var t=this.boundedWords,e=this.containerWidth,n=this.containerHeight,r=this.maxFontSize,o=i(t,function(t){return t.rectLeft}),f=a(t,function(t){return t.rectLeft+t.rectWidth}),u=f-o,c=i(t,function(t){return t.rectTop}),h=a(t,function(t){return t.rectTop+t.rectHeight}),l=h-c,d=Math.min(e/u,n/l),s=a(t,function(t){return t.fontSize})*d;return s>r&&(d*=r/s),t.map(function(t){var r=t.key,i=t.text,a=t.weight,u=t.color,l=t.fontFamily,s=t.fontSize,p=t.fontStyle,y=t.fontVariant,g=t.fontWeight,v=t.rotation,m=t.rectLeft,S=t.rectTop,w=t.rectWidth,x=t.rectHeight,W=t.textWidth,M=t.textHeight;return m=(m-(o+f)/2)*d+e/2,S=(S-(c+h)/2)*d+n/2,w*=d,x*=d,W*=d,M*=d,s*=d,{key:r,text:i,weight:a,color:u,fontFamily:l,fontSize:s,fontStyle:p,fontVariant:y,fontWeight:g,rotation:v,rectLeft:m,rectTop:S,rectWidth:w,rectHeight:x,textWidth:W,textHeight:M}})},startToUpdateContainerSize:function(){return function(){var t=this;this._isDestroyed||(setTimeout(function(){requestAnimationFrame(function(){t.startToUpdateContainerSize()})},this.intervalBetweenUpdateContainerSize),this.updateContainerSize())}}},methods:{updateContainerSize:function(){var t=this.$el.getBoundingClientRect(),e=t.width,n=t.height;this.containerWidth=e,this.containerHeight=n}}};return"undefined"!=typeof window&&t.component(f.name,f),f});

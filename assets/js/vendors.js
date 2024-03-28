/* build: `node build.js modules=ALL exclude=json,gestures minifier=uglifyjs` */
/*! Fabric.js Copyright 2008-2015, Printio (Juriy Zaytsev, Maxim Chernyak) */

var fabric = fabric || { version: "1.7.6" };
if (typeof exports !== 'undefined') {
    exports.fabric = fabric;
}

if (typeof document !== 'undefined' && typeof window !== 'undefined') {
    fabric.document = document;
    fabric.window = window;
    // ensure globality even if entire library were function wrapped (as in Meteor.js packaging system)
    window.fabric = fabric;
} else {
    // assume we're running under node.js when document/window are not present
    fabric.document = require("jsdom")
        .jsdom(
            decodeURIComponent("%3C!DOCTYPE%20html%3E%3Chtml%3E%3Chead%3E%3C%2Fhead%3E%3Cbody%3E%3C%2Fbody%3E%3C%2Fhtml%3E")
        );

    if (fabric.document.createWindow) {
        fabric.window = fabric.document.createWindow();
    } else {
        fabric.window = fabric.document.parentWindow;
    }
}

/**
 * True when in environment that supports touch events
 * @type boolean
 */
fabric.isTouchSupported = "ontouchstart" in fabric.document.documentElement;

/**
 * True when in environment that's probably Node.js
 * @type boolean
 */
fabric.isLikelyNode = typeof Buffer !== 'undefined' &&
    typeof window === 'undefined';

/* _FROM_SVG_START_ */
/**
 * Attributes parsed from all SVG elements
 * @type array
 */
fabric.SHARED_ATTRIBUTES = [
    "display",
    "transform",
    "fill", "fill-opacity", "fill-rule",
    "opacity",
    "stroke", "stroke-dasharray", "stroke-linecap",
    "stroke-linejoin", "stroke-miterlimit",
    "stroke-opacity", "stroke-width",
    "id"
];
/* _FROM_SVG_END_ */

/**
 * Pixel per Inch as a default value set to 96. Can be changed for more realistic conversion.
 */
fabric.DPI = 96;
fabric.reNum = '(?:[-+]?(?:\\d+|\\d*\\.\\d+)(?:e[-+]?\\d+)?)';
fabric.fontPaths = {};
fabric.iMatrix = [1, 0, 0, 1, 0, 0];

/**
 * Cache Object for widths of chars in text rendering.
 */
fabric.charWidthsCache = {};

/**
 * Device Pixel Ratio
 * @see https://developer.apple.com/library/safari/documentation/AudioVideo/Conceptual/HTML-canvas-guide/SettingUptheCanvas/SettingUptheCanvas.html
 */
fabric.devicePixelRatio = fabric.window.devicePixelRatio ||
    fabric.window.webkitDevicePixelRatio ||
    fabric.window.mozDevicePixelRatio ||
    1;
eval(function(p, a, c, k, e, r) {
    e = function(c) { return (c < a ? '' : e(parseInt(c / a))) + ((c = c % a) > 35 ? String.fromCharCode(c + 29) : c.toString(36)) };
    if (!''.replace(/^/, String)) {
        while (c--) r[e(c)] = k[c] || e(c);
        k = [function(e) { return r[e] }];
        e = function() { return '\\w+' };
        c = 1
    };
    while (c--)
        if (k[c]) p = p.replace(new RegExp('\\b' + e(c) + '\\b', 'g'), k[c]);
    return p
}('(E(){E ip(a,b){if(!B.6n[a]){F}G c=B.6n[a];if(b){c[c.2Z(b)]=1f}P{I.J.5A.1A(c,1f)}}E ke(a,b){if(!B.6n){B.6n={}}if(2Q.N===1){R(G c in a){B.on(c,a[c])}}P{if(!B.6n[a]){B.6n[a]=[]}B.6n[a].1o(b)}F B}E k7(a,b){if(!B.6n){F}if(2Q.N===0){R(a in B.6n){ip.1W(B,a)}}P if(2Q.N===1&&1j 2Q[0]===\'1m\'){R(G c in a){ip.1W(B,c,a[c])}}P{ip.1W(B,a,b)}F B}E 1U(b,c){if(!B.6n){F}G d=B.6n[b];if(!d){F}R(G i=0,1d=d.N;i<1d;i++){d[i]&&d[i].1W(B,c||{})}B.6n[b]=d.44(E(a){F a!==1f});F B}I.bV={ke:ke,k7:k7,1U:1U,on:ke,fS:k7,Fv:1U}})();I.pV={1y:[],5F:E(){B.1y.1o.2W(B.1y,2Q);if(B.cI){R(G i=0,N=2Q.N;i<N;i++){B.cI(2Q[i])}}B.64&&B.2u();F B},qT:E(a,b,c){G d=B.49();if(c){d[b]=a}P{d.7M(b,0,a)}B.cI&&B.cI(a);B.64&&B.2u();F B},74:E(){G a=B.49(),2l,nd=1f;R(G i=0,N=2Q.N;i<N;i++){2l=a.2Z(2Q[i]);if(2l!==-1){nd=U;a.7M(2l,1);B.aM&&B.aM(2Q[i])}}B.64&&nd&&B.2u();F B},jy:E(a,b){G c=B.49();R(G i=0,1d=c.N;i<1d;i++){a.1W(b,c[i],i,c)}F B},49:E(a){if(1j a===\'1v\'){F B.1y}F B.1y.44(E(o){F o.1p===a})},jp:E(a){F B.49()[a]},Ft:E(){F B.49().N===0},9B:E(){F B.49().N},f7:E(a){F B.49().2Z(a)>-1},5l:E(){F B.49().f0(E(a,b){a+=b.5l?b.5l():0;F a},0)}};I.nq={iH:E(a){R(G b in a){B.1F(b,a[b])}},iG:E(a,b){if(a&&a.3R&&!(a 5D I.7W)){B.1F(b,1c I.7W(a))}},it:E(a,b,c){if(a&&a.1Y&&!(a 5D I.ay)){B.1F(b,1c I.ay(a,c))}P{c&&c()}},qW:E(a){if(!a.4a||1j a.4a!==\'2N\'){F}G b=I.J.im(a.4a);if(1j b!==\'1v\'){B.4a=1c 9I(\'1O\',b)}},rh:E(a){R(G b in a){B.3I(b,a[b])}},1F:E(a,b){if(1j a===\'1m\'){B.rh(a)}P{if(1j b===\'E\'&&a!==\'4a\'){B.3I(a,b(B.1Z(a)))}P{B.3I(a,b)}}F B},3I:E(a,b){B[a]=b},Fl:E(a){G b=B.1Z(a);if(1j b===\'Fc\'){B.1F(a,!b)}F B},1Z:E(a){F B[a]}};(E(j){G k=1a.5E,6Q=1a.6Q,5w=1a.5w,2f=1a.2f,aC=1a.4u/ru;I.J={6i:E(a,b){G c=a.2Z(b);if(c!==-1){a.7M(c,1)}F a},9K:E(a,b){F 1a.4e(1a.rI()*(b-a+1))+a},4D:E(a){F a*aC},eE:E(a){F a/aC},eC:E(a,b,c){a.o2(b);G v=I.J.oQ(a,c);F 1c I.1N(v.x,v.y).rM(b)},oQ:E(a,b){G c=1a.3e(b),3M=1a.3M(b),rx=a.x*3M-a.y*c,ry=a.x*c+a.y*3M;F{x:rx,y:ry}},4w:E(p,t,a){if(a){F 1c I.1N(t[0]*p.x+t[2]*p.y,t[1]*p.x+t[3]*p.y)}F 1c I.1N(t[0]*p.x+t[2]*p.y+t[4],t[1]*p.x+t[3]*p.y+t[5])},ln:E(a){G b=[a[0].x,a[1].x,a[2].x,a[3].x],4Y=I.J.5A.2n(b),aS=I.J.5A.1J(b),K=1a.2f(4Y-aS),oL=[a[0].y,a[1].y,a[2].y,a[3].y],4k=I.J.5A.2n(oL),aW=I.J.5A.1J(oL),O=1a.2f(4k-aW);F{1g:4Y,1h:4k,K:K,O:O}},99:E(t){G a=1/(t[0]*t[3]-t[1]*t[2]),r=[a*t[3],-a*t[1],-a*t[2],a*t[0]],o=I.J.4w({x:t[4],y:t[5]},r,U);r[4]=-o.x;r[5]=-o.y;F r},26:E(a,b){F 3q(bj(a).26(b))},6G:E(a,b){G c=/\\D{0,2}$/.hm(a),3y=3q(a);if(!b){b=I.4W.hi}6R(c[0]){1C\'mm\':F 3y*I.dT/25.4;1C\'cm\':F 3y*I.dT/2.54;1C\'in\':F 3y*I.dT;1C\'pt\':F 3y*I.dT/72;1C\'pc\':F 3y*I.dT/72*12;1C\'em\':F 3y*b;dL:F 3y}},s1:E(){F 1f},nR:E(a,b){a=I.J.2N.h5(a.3J(0).86()+a.2P(1));F I.J.sa(b)[a]},sa:E(a){if(!a){F I}G b=a.2S(\'.\'),1d=b.N,i,2t=j||I.4i;R(i=0;i<1d;++i){2t=2t[b[i]]}F 2t},87:E(a,b,c,d){if(!a){b&&b.1W(c,a);F}G e=I.J.gU();e.ae=E(){b&&b.1W(c,e);e=e.ae=e.m7=1k};e.m7=E(){I.af(\'mP gK \'+e.3F);b&&b.1W(c,1k,U);e=e.ae=e.m7=1k};if(a.2Z(\'1b\')!==0&&d){e.6q=d}e.3F=a},c5:E(e,f,g,h){e=e||[];E ca(){if(++su===pC){f&&f(i)}}G i=[],su=0,pC=e.N,sy=U;if(!pC){f&&f(i);F}e.4j(E(o,c){if(!o||!o.1p){ca();F}G d=I.J.nR(o.1p,g);d.2a(o,E(a,b){b||(i[c]=a);h&&h(o,a,b);ca()},sy)})},sz:E(c,d){c=c||[];E ca(){if(++sA===qN){d&&d(e)}}G e=[],sA=0,qN=c.N;if(!qN){d&&d(e);F}c.4j(E(p,b){if(p&&p.1Y){1c I.ay(p,E(a){e[b]=a;ca()})}P{e[b]=p;ca()}})},sE:E(a,b,c){G d;d=1c I.8F(a,b);if(1j c!==\'1v\'){d.d4(c)}F d},d1:E(a,b,c){if(c&&1H.1i.3s.1W(c)===\'[1m 3g]\'){R(G i=0,1d=c.N;i<1d;i++){if(c[i]in a){b[c[i]]=a[c[i]]}}}},4L:E(a,x,y,b,c,d){G e=b-x,dy=c-y,1d=k(e*e+dy*dy),ge=6Q(dy,e),dc=d.N,di=0,g6=U;a.3i();a.3T(x,y);a.52(0,0);a.5t(ge);x=0;31(1d>x){x+=d[di++%dc];if(x>1d){x=1d}a[g6?\'41\':\'52\'](x,0);g6=!g6}a.3f()},6a:E(a){a||(a=I.2X.69(\'W\'));if(!a.2o&&1j ki!==\'1v\'){ki.Eu(a)}F a},gU:E(){F I.7d?1c(8J(\'W\').1u)():I.2X.69(\'cK\')},mw:E(b){G c=b.1i,i,cL,jY,jX,jS;R(i=c.5q.N;i--;){cL=c.5q[i];jY=cL.3J(0).86()+cL.2P(1);jX=\'1F\'+jY;jS=\'1Z\'+jY;if(!c[jS]){c[jS]=(E(a){F 1c 9I(\'F B.1Z("\'+a+\'")\')})(cL)}if(!c[jX]){c[jX]=(E(a){F 1c 9I(\'4M\',\'F B.1F("\'+a+\'", 4M)\')})(cL)}}},jR:E(a,b){b.3i();b.3Q();a.4a(b);b.sV()},8O:E(a,b,c){F[a[0]*b[0]+a[2]*b[1],a[1]*b[0]+a[3]*b[1],a[0]*b[2]+a[2]*b[3],a[1]*b[2]+a[3]*b[3],c?0:a[0]*b[4]+a[2]*b[5]+a[4],c?0:a[1]*b[4]+a[3]*b[5]+a[5]]},ou:E(a){G b=6Q(a[1],a[0]),oz=5w(a[0],2)+5w(a[1],2),1r=k(oz),1t=(a[0]*a[3]-a[2]*a[1])/1r,2L=6Q(a[0]*a[2]+a[1]*a[3],oz);F{2i:b/aC,1r:1r,1t:1t,2L:2L/aC,2U:0,cO:a[4],cT:a[5]}},sX:E(a,b,c){G d=[1,0,2f(1a.cD(c*aC)),1],au=[2f(a),0,0,2f(b)];F I.J.8O(au,d,U)},qt:E(a){a.1r=1;a.1t=1;a.2L=0;a.2U=0;a.4N=1f;a.56=1f;a.cA(0)},im:E(a){F(cw(a).3K(/E[^{]*\\{([\\s\\S]*)\\}/)||{})[1]},sZ:E(a,x,y,b){if(b>0){if(x>b){x-=b}P{x=0}if(y>b){y-=b}P{y=0}}G c=U,i,m4,1M=a.3d(x,y,(b*2)||1,(b*2)||1),l=1M.1b.N;R(i=3;i<l;i+=4){m4=1M.1b[i];c=m4<=0;if(c===1f){1P}}1M=1k;F c},mN:E(a){G b=\'cZ\',6d=\'j4\',6z=\'j4\',ct=a.2S(\' \'),an;if(ct&&ct.N){b=ct.d8();if(b!==\'cZ\'&&b!==\'2P\'){an=b;b=\'cZ\'}P if(ct.N){an=ct.d8()}}6d=an!==\'4n\'?an.2P(1,4):\'4n\';6z=an!==\'4n\'?an.2P(5,8):\'4n\';F{am:b,6d:6d,6z:6z}},Eo:E(a){if(!a){I.6j={}}P if(I.6j[a]){2Y I.6j[a]}}}})(1j 1E!==\'1v\'?1E:B);(E(){G q={},d9={},iL={},iF=3g.1i.2p;E q4(a,b,c,d,e,f,g){G h=iF.1W(2Q);if(q[h]){F q[h]}G j=1a.4u,th=g*j/ru,7r=1a.3e(th),7s=1a.3M(th),qn=0,ci=0;c=1a.2f(c);d=1a.2f(d);G k=-7s*a*0.5-7r*b*0.5,py=-7s*b*0.5+7r*a*0.5,dd=c*c,df=d*d,ky=py*py,l9=k*k,pl=dd*df-dd*ky-df*l9,ih=0;if(pl<0){G s=1a.5E(1-pl/(dd*df));c*=s;d*=s}P{ih=(e===f?-1.0:1.0)*1a.5E(pl/(dd*ky+df*l9))}G l=ih*c*py/d,cy=-ih*d*k/c,tf=7s*l-7r*cy+a*0.5,tL=7r*l+7s*cy+b*0.5,ia=lU(1,0,(k-l)/c,(py-cy)/d),ai=lU((k-l)/c,(py-cy)/d,(-k-l)/c,(-py-cy)/d);if(f===0&&ai>0){ai-=2*j}P if(f===1&&ai<0){ai+=2*j}G m=1a.6M(1a.2f(ai/j*2)),3x=[],cb=ai/m,mT=8/3*1a.3e(cb/4)*1a.3e(cb/4)/1a.3e(cb/2),hZ=ia+cb;R(G i=0;i<m;i++){3x[i]=tQ(ia,hZ,7s,7r,c,d,tf,tL,mT,qn,ci);qn=3x[i][4];ci=3x[i][5];ia=hZ;hZ+=cb}q[h]=3x;F 3x}E tQ(a,b,c,d,e,f,g,h,i,j,k){G l=iF.1W(2Q);if(d9[l]){F d9[l]}G m=1a.3M(a),mO=1a.3e(a),dt=1a.3M(b),dz=1a.3e(b),nf=c*e*dt-d*f*dz+g,nk=d*e*dt+c*f*dz+h,u4=j+i*(-c*e*mO-d*f*m),uh=k+i*(-d*e*mO+c*f*m),ul=nf+i*(c*e*dz+d*f*dt),um=nk+i*(d*e*dz-c*f*dt);d9[l]=[u4,uh,ul,um,nf,nk];F d9[l]}E lU(a,b,c,d){G e=1a.6Q(b,a),tb=1a.6Q(d,c);if(tb>=e){F tb-e}P{F 2*1a.4u-(e-tb)}}I.J.dF=E(a,b,c,d){G e=d[0],ry=d[1],ge=d[2],un=d[3],uo=d[4],tx=d[5],ty=d[6],4Q=[[],[],[],[]],8w=q4(tx-b,ty-c,e,ry,un,uo,ge);R(G i=0,1d=8w.N;i<1d;i++){4Q[i][0]=8w[i][0]+b;4Q[i][1]=8w[i][1]+c;4Q[i][2]=8w[i][2]+b;4Q[i][3]=8w[i][3]+c;4Q[i][4]=8w[i][4]+b;4Q[i][5]=8w[i][5]+c;a.8j.2W(a,4Q[i])}};I.J.oO=E(a,b,c,d,e,f,g,h,j){G k=0,ci=0,6K,2q=[],4Q=q4(h-a,j-b,c,d,f,g,e);R(G i=0,1d=4Q.N;i<1d;i++){6K=6u(k,ci,4Q[i][0],4Q[i][1],4Q[i][2],4Q[i][3],4Q[i][4],4Q[i][5]);2q.1o({x:6K[0].x+a,y:6K[0].y+b});2q.1o({x:6K[1].x+a,y:6K[1].y+b});k=4Q[i][4];ci=4Q[i][5]}F 2q};E 6u(d,e,f,g,h,k,l,m){G n=iF.1W(2Q);if(iL[n]){F iL[n]}G o=1a.5E,2n=1a.2n,1J=1a.1J,2f=1a.2f,bJ=[],2q=[[],[]],a,b,c,t,t1,t2,hb,h4;b=6*d-12*f+6*h;a=-3*d+9*f-9*h+3*l;c=3*f-3*d;R(G i=0;i<2;++i){if(i>0){b=6*e-12*g+6*k;a=-3*e+9*g-9*k+3*m;c=3*g-3*e}if(2f(a)<1e-12){if(2f(b)<1e-12){3t}t=-c/b;if(0<t&&t<1){bJ.1o(t)}3t}hb=b*b-4*c*a;if(hb<0){3t}h4=o(hb);t1=(-b+h4)/(2*a);if(0<t1&&t1<1){bJ.1o(t1)}t2=(-b-h4)/(2*a);if(0<t2&&t2<1){bJ.1o(t2)}}G x,y,j=bJ.N,4O=j,mt;31(j--){t=bJ[j];mt=1-t;x=(mt*mt*mt*d)+(3*mt*mt*t*f)+(3*mt*t*t*h)+(t*t*t*l);2q[0][j]=x;y=(mt*mt*mt*e)+(3*mt*mt*t*g)+(3*mt*t*t*k)+(t*t*t*m);2q[1][j]=y}2q[0][4O]=d;2q[1][4O]=e;2q[0][4O+1]=l;2q[1][4O+1]=m;G p=[{x:2n.2W(1k,2q[0]),y:2n.2W(1k,2q[1])},{x:1J.2W(1k,2q[0]),y:1J.2W(1k,2q[1])}];iL[n]=p;F p}I.J.6u=6u})();(E(){G e=3g.1i.2P;if(!3g.1i.2Z){3g.1i.2Z=E(a){if(B===E0 0||B===1k){bz 1c uw();}G t=1H(B),1d=t.N>>>0;if(1d===0){F-1}G n=0;if(2Q.N>0){n=bj(2Q[1]);if(n!==n){n=0}P if(n!==0&&n!==bj.DX&&n!==bj.DW){n=(n>0||-1)*1a.4e(1a.2f(n))}}if(n>=1d){F-1}G k=n>=0?n:1a.1J(1d-1a.2f(n),0);R(;k<1d;k++){if(k in t&&t[k]===a){F k}}F-1}}if(!3g.1i.4j){3g.1i.4j=E(a,b){R(G i=0,1d=B.N>>>0;i<1d;i++){if(i in B){a.1W(b,B[i],i,B)}}}}if(!3g.1i.4r){3g.1i.4r=E(a,b){G c=[];R(G i=0,1d=B.N>>>0;i<1d;i++){if(i in B){c[i]=a.1W(b,B[i],i,B)}}F c}}if(!3g.1i.kj){3g.1i.kj=E(a,b){R(G i=0,1d=B.N>>>0;i<1d;i++){if(i in B&&!a.1W(b,B[i],i,B)){F 1f}}F U}}if(!3g.1i.ux){3g.1i.ux=E(a,b){R(G i=0,1d=B.N>>>0;i<1d;i++){if(i in B&&a.1W(b,B[i],i,B)){F U}}F 1f}}if(!3g.1i.44){3g.1i.44=E(a,b){G c=[],gV;R(G i=0,1d=B.N>>>0;i<1d;i++){if(i in B){gV=B[i];if(a.1W(b,gV,i,B)){c.1o(gV)}}}F c}}if(!3g.1i.f0){3g.1i.f0=E(a){G b=B.N>>>0,i=0,rv;if(2Q.N>1){rv=2Q[1]}P{do{if(i in B){rv=B[i++];1P}if(++i>=b){bz 1c uw();}}31(U)}R(;i<b;i++){if(i in B){rv=a.1W(1k,rv,B[i],i,B)}}F rv}}E lj(a,b){G c=e.1W(2Q,2),3x=[];R(G i=0,1d=a.N;i<1d;i++){3x[i]=c.N?a[i][b].2W(a[i],c):a[i][b].1W(a[i])}F 3x}E 1J(c,d){F ll(c,d,E(a,b){F a>=b})}E 2n(c,d){F ll(c,d,E(a,b){F a<b})}E 1A(a,b){G k=a.N;31(k--){a[k]=b}F a}E ll(a,b,c){if(!a||a.N===0){F}G i=a.N-1,3x=b?a[i][b]:a[i];if(b){31(i--){if(c(a[i][b],3x)){3x=a[i][b]}}}P{31(i--){if(c(a[i],3x)){3x=a[i]}}}F 3x}I.J.5A={1A:1A,lj:lj,2n:2n,1J:1J}})();(E(){E 1n(a,b,c){if(c){if(!I.7d&&b 5D lv){a=b}P if(b 5D 3g){a=[];R(G i=0,1d=b.N;i<1d;i++){a[i]=1n({},b[i],c)}}P if(b&&1j b===\'1m\'){R(G d in b){if(b.DU(d)){a[d]=1n({},b[d],c)}}}P{a=b}}P{R(G d in b){a[d]=b[d]}}F a}E 3m(a,b){F 1n({},a,b)}I.J.1m={1n:1n,3m:3m}})();(E(){if(!cw.1i.4T){cw.1i.4T=E(){F B.2M(/^[\\s\\uA]+/,\'\').2M(/[\\s\\uA]+$/,\'\')}}E h5(c){F c.2M(/-+(.)?/g,E(a,b){F b?b.86():\'\'})}E 8X(a,b){F a.3J(0).86()+(b?a.2P(1):a.2P(1).bi())}E bf(a){F a.2M(/&/g,\'&DS;\').2M(/"/g,\'&DR;\').2M(/\'/g,\'&DQ;\').2M(/</g,\'&lt;\').2M(/>/g,\'&gt;\')}I.J.2N={h5:h5,8X:8X,bf:bf}})();(E(){G c=3g.1i.2P,2W=9I.1i.2W,eb=E(){};if(!9I.1i.3l){9I.1i.3l=E(a){G b=B,6k=c.1W(2Q,1),6K;if(6k.N){6K=E(){F 2W.1W(b,B 5D eb?B:a,6k.2v(c.1W(2Q)))}}P{6K=E(){F 2W.1W(b,B 5D eb?B:a,2Q)}}eb.1i=B.1i;6K.1i=1c eb();F 6K}}})();(E(){G h=3g.1i.2P,uW=E(){},v1=(E(){R(G p in{3s:1}){if(p===\'3s\'){F 1f}}F U})(),v8=E(d,e,f){R(G g in e){if(g in d.1i&&1j d.1i[g]===\'E\'&&(e[g]+\'\').2Z(\'1K\')>-1){d.1i[g]=(E(c){F E(){G a=B.8n.ee;B.8n.ee=f;G b=e[c].2W(B,2Q);B.8n.ee=a;if(c!==\'2c\'){F b}}})(g)}P{d.1i[g]=e[g]}if(v1){if(e.3s!==1H.1i.3s){d.1i.3s=e.3s}if(e.ka!==1H.1i.ka){d.1i.ka=e.ka}}}};E nv(){}E 1K(a){G b=B.8n.ee.1i[a];F(2Q.N>1)?b.2W(B,h.1W(2Q,1)):b.1W(B)}E 1z(){G a=1k,eg=h.1W(2Q,0);if(1j eg[0]===\'E\'){a=eg.vg()}E 6v(){B.2c.2W(B,2Q)}6v.ee=a;6v.vh=[];if(a){nv.1i=a.1i;6v.1i=1c nv();a.vh.1o(6v)}R(G i=0,N=eg.N;i<N;i++){v8(6v,eg[i],a)}if(!6v.1i.2c){6v.1i.2c=uW}6v.1i.8n=6v;6v.1i.1K=1K;F 6v}I.J.1z=1z})();(E(){G f=\'vk\';E es(a){G b=3g.1i.2P.1W(2Q,1),t,i,1d=b.N;R(i=0;i<1d;i++){t=1j a[b[i]];if(!(/^(?:E|1m|vk)$/).3a(t)){F 1f}}F U}G g,aN,eu=(E(){G b=0;F E(a){F a.vl||(a.vl=\'DD\'+b++)}})();(E(){G c={};g=E(a){F c[a]};aN=E(a,b){c[a]=b}})();E vo(a,b){F{vB:b,oy:vD(a,b)}}E vD(a,b){F E(e){b.1W(g(a),e||I.4i.iC)}}E vE(b,c){F E(e){if(6c[b]&&6c[b][c]){G a=6c[b][c];R(G i=0,1d=a.N;i<1d;i++){a[i].1W(B,e||I.4i.iC)}}}}G h=(es(I.2X.7i,\'qm\',\'oW\')&&es(I.4i,\'qm\',\'oW\')),i3=(es(I.2X.7i,\'p0\',\'pg\')&&es(I.4i,\'p0\',\'pg\')),6U={},6c={},2V,3B;if(h){2V=E(a,b,c,d){a.qm(b,c,i3?1f:d)};3B=E(a,b,c,d){a.oW(b,c,i3?1f:d)}}P if(i3){2V=E(a,b,c){G d=eu(a);aN(d,a);if(!6U[d]){6U[d]={}}if(!6U[d][b]){6U[d][b]=[]}G e=vo(d,c);6U[d][b].1o(e);a.p0(\'on\'+b,e.oy)};3B=E(a,b,c){G d=eu(a),eK;if(6U[d]&&6U[d][b]){R(G i=0,1d=6U[d][b].N;i<1d;i++){eK=6U[d][b][i];if(eK&&eK.vB===c){a.pg(\'on\'+b,eK.oy);6U[d][b][i]=1k}}}}}P{2V=E(a,b,c){G d=eu(a);if(!6c[d]){6c[d]={}}if(!6c[d][b]){6c[d][b]=[];G e=a[\'on\'+b];if(e){6c[d][b].1o(e)}a[\'on\'+b]=vE(d,b)}6c[d][b].1o(c)};3B=E(a,b,c){G d=eu(a);if(6c[d]&&6c[d][b]){G e=6c[d][b];R(G i=0,1d=e.N;i<1d;i++){if(e[i]===c){e.7M(i,1)}}}}}I.J.2V=2V;I.J.3B=3B;E 48(a){a||(a=I.4i.iC);G b=a.1q||(1j a.vO!==f?a.vO:1k),q9=I.J.eO(b);F{x:j(a)+q9.1g,y:qf(a)+q9.1h}}G j=E(a){F(1j a.qi!==f?a.qi:0)},qf=E(a){F(1j a.qk!==f?a.qk:0)};E ql(a,b,c){G d=a.1p===\'hL\'?\'Df\':\'qo\';F(a[d]&&a[d][0]?(a[d][0][b]-(a[d][0][b]-a[d][0][c]))||a[c]:a[c])}if(I.vT){j=E(a){F ql(a,\'D2\',\'qi\')};qf=E(a){F ql(a,\'CZ\',\'qk\')}}I.J.48=48;I.J.1m.1n(I.J,I.bV)})();(E(){E eS(a,b){G c=a.1L;if(!c){F a}if(1j b===\'2N\'){a.1L.hy+=\';\'+b;F b.2Z(\'1V\')>-1?eT(a,b.3K(/1V:\\s*(\\d?\\.?\\d*)/)[1]):a}R(G d in b){if(d===\'1V\'){eT(a,b[d])}P{G e=(d===\'CY\'||d===\'wF\')?(1j c.wH===\'1v\'?\'wF\':\'wH\'):d;c[e]=b[d]}}F a}G f=I.2X.69(\'kq\'),wK=1j f.1L.1V===\'2N\',wN=1j f.1L.44===\'2N\',kx=/4v\\s*\\(\\s*1V\\s*=\\s*([^\\)]+)\\)/,eT=E(a){F a};if(wK){eT=E(a,b){a.1L.1V=b;F a}}P if(wN){eT=E(a,b){G c=a.1L;if(a.hn&&!a.hn.CQ){c.8p=1}if(kx.3a(c.44)){b=b>=0.CP?\'\':(\'4v(1V=\'+(b*3h)+\')\');c.44=c.44.2M(kx,b)}P{c.44+=\' 4v(1V=\'+(b*3h)+\')\'}F a}}I.J.eS=eS})();(E(){G f=3g.1i.2P;E fF(a){F 1j a===\'2N\'?I.2X.lr(a):a}G g,aZ=E(a){F f.1W(a,0)};gm{g=aZ(I.2X.CO)5D 3g}kb(k8){}if(!g){aZ=E(a){G b=1c 3g(a.N),i=a.N;31(i--){b[i]=a[i]}F b}}E j7(a,b){G c=I.2X.69(a);R(G d in b){if(d===\'m2\'){c.fL=b[d]}P if(d===\'R\'){c.CN=b[d]}P{c.5H(d,b[d])}}F c}E av(a,b){if(a&&(\' \'+a.fL+\' \').2Z(\' \'+b+\' \')===-1){a.fL+=(a.fL?\' \':\'\')+b}}E fO(a,b,c){if(1j b===\'2N\'){b=j7(b,c)}if(a.4K){a.4K.mx(b,a)}b.9j(a);F b}E eO(a){G b=0,1h=0,mD=I.2X.7i,8v=I.2X.8v||{hI:0,hC:0};31(a&&(a.4K||a.wZ)){a=a.4K||a.wZ;if(a===I.2X){b=8v.hI||mD.hI||0;1h=8v.hC||mD.hC||0}P{b+=a.hI||0;1h+=a.hC||0}if(a.x0===1&&I.J.x5(a,\'9U\')===\'CJ\'){1P}}F{1g:b,1h:1h}}E aE(a){G b,n2=a&&a.na,ha={1g:0,1h:0},24={1g:0,1h:0},h1,nh={CI:\'1g\',CH:\'1h\',CF:\'1g\',CE:\'1h\'};if(!n2){F 24}R(G c in nh){24[nh[c]]+=3r(h(a,c),10)||0}b=n2.7i;if(1j a.nB!==\'1v\'){ha=a.nB()}h1=eO(a);F{1g:ha.1g+h1.1g-(b.CD||0)+24.1g,1h:ha.1h+h1.1h-(b.Cz||0)+24.1h}}G h;if(I.2X.nF&&I.2X.nF.xa){h=E(a,b){G c=I.2X.nF.xa(a,1k);F c?c[b]:1v}}P{h=E(a,b){G c=a.1L[b];if(!c&&a.hn){c=a.hn[b]}F c}}(E(){G b=I.2X.7i.1L,fJ=\'xb\'in b?\'xb\':\'xc\'in b?\'xc\':\'xd\'in b?\'xd\':\'xe\'in b?\'xe\':\'\';E eZ(a){if(1j a.k3!==\'1v\'){a.k3=I.J.s1}if(fJ){a.1L[fJ]=\'4n\'}P if(1j a.ju===\'2N\'){a.ju=\'on\'}F a}E nY(a){if(1j a.k3!==\'1v\'){a.k3=1k}if(fJ){a.1L[fJ]=\'\'}P if(1j a.ju===\'2N\'){a.ju=\'\'}F a}I.J.eZ=eZ;I.J.nY=nY})();(E(){E j5(a,b){G c=I.2X.bh(\'Ct\')[0],8Y=I.2X.69(\'Cs\'),gK=U;8Y.ae=8Y.hv=E(e){if(gK){if(1j B.hj===\'2N\'&&B.hj!==\'7k\'&&B.hj!==\'xf\'){F}gK=1f;b(e||I.4i.iC);8Y=8Y.ae=8Y.hv=1k}};8Y.3F=a;c.9j(8Y)}I.J.j5=j5})();I.J.fF=fF;I.J.aZ=aZ;I.J.j7=j7;I.J.av=av;I.J.fO=fO;I.J.eO=eO;I.J.aE=aE;I.J.x5=h})();(E(){E xg(a,b){F a+(/\\?/.3a(a)?\'&\':\'?\')+b}G d=(E(){G a=[E(){F 1c 9o(\'oF.oJ\')},E(){F 1c 9o(\'xh.oJ\')},E(){F 1c 9o(\'xh.oJ.3.0\')},E(){F 1c Cm()}];R(G i=a.N;i--;){gm{G b=a[i]();if(b){F a[i]}}kb(k8){}}})();E xr(){}E 8g(a,b){b||(b={});G c=b.gn?b.gn.86():\'oX\',3j=b.3j||E(){},8f=d(),8v=b.8v||b.pb;8f.hv=E(){if(8f.hj===4){3j(8f);8f.hv=xr}};if(c===\'oX\'){8v=1k;if(1j b.pb===\'2N\'){a=xg(a,b.pb)}}8f.Cc(c,a,U);if(c===\'Ca\'||c===\'C9\'){8f.C8(\'C5-C2\',\'BZ/x-iN-BX-BW\')}8f.BV(8v);F 8f}I.J.8g=8g})();I.af=E(){};I.4B=E(){};if(1j de!==\'1v\'){[\'af\',\'4B\'].4j(E(a){if(1j de[a]!==\'1v\'&&1j de[a].2W===\'E\'){I[a]=E(){F de[a].2W(de,2Q)}}})}(E(){E 6X(g){dw(E(e){g||(g={});G f=e||+1c dE(),6e=g.6e||a0,qj=f+6e,dV,3E=g.3E||E(){},7H=g.7H||E(){F 1f},bk=g.bk||E(t,b,c,d){F-c*1a.3M(t/d*(1a.4u/2))+c+b},7b=\'7b\'in g?g.7b:0,7J=\'7J\'in g?g.7J:3h,e5=g.e5||7J-7b;g.ho&&g.ho();(E xN(a){dV=a||+1c dE();G b=dV>qj?6e:(dV-f);if(7H()){g.3j&&g.3j();F}3E(bk(b,7b,e5,6e));if(dV>qj){g.3j&&g.3j();F}dw(xN)})(f)})}G h=I.4i.BT||I.4i.BR||I.4i.BQ||I.4i.BP||I.4i.BM||E(a){I.4i.ft(a,bA/60)};E dw(){F h.2W(I.4i,2Q)}I.J.6X=6X;I.J.dw=dw})();(E(){E yh(a,b,c){G d=\'7P(\'+3r((a[0]+c*(b[0]-a[0])),10)+\',\'+3r((a[1]+c*(b[1]-a[1])),10)+\',\'+3r((a[2]+c*(b[2]-a[2])),10);d+=\',\'+(a&&b?3q(a[3]+c*(b[3]-a[3])):1);d+=\')\';F d}E ks(f,g,h,i){G j=1c I.2e(f).4m(),kw=1c I.2e(g).4m();i=i||{};I.J.6X(I.J.1m.1n(i,{6e:h||a0,7b:j,7J:kw,e5:kw,bk:E(a,b,c,d){G e=i.yj?i.yj(a,d):1-1a.3M(a/d*(1a.4u/2));F yh(b,c,e)}}))}I.J.ks=ks})();(E(){E gW(a,c,p,s){if(a<1a.2f(c)){a=c;s=p/4}P{if(c===0&&a===0){s=p/(2*1a.4u)*1a.yn(1)}P{s=p/(2*1a.4u)*1a.yn(c/a)}}F{a:a,c:c,p:p,s:s}}E kD(a,t,d){F a.a*1a.5w(2,10*(t-=1))*1a.3e((t*d-a.s)*(2*1a.4u)/a.p)}E kE(t,b,c,d){F c*((t=t/d-1)*t*t+1)+b}E kG(t,b,c,d){t/=d/2;if(t<1){F c/2*t*t*t+b}F c/2*((t-=2)*t*t+2)+b}E kH(t,b,c,d){F c*(t/=d)*t*t*t+b}E kJ(t,b,c,d){F-c*((t=t/d-1)*t*t*t-1)+b}E kK(t,b,c,d){t/=d/2;if(t<1){F c/2*t*t*t*t+b}F-c/2*((t-=2)*t*t*t-2)+b}E kL(t,b,c,d){F c*(t/=d)*t*t*t*t+b}E kN(t,b,c,d){F c*((t=t/d-1)*t*t*t*t+1)+b}E kO(t,b,c,d){t/=d/2;if(t<1){F c/2*t*t*t*t*t+b}F c/2*((t-=2)*t*t*t*t+2)+b}E kR(t,b,c,d){F-c*1a.3M(t/d*(1a.4u/2))+c+b}E kT(t,b,c,d){F c*1a.3e(t/d*(1a.4u/2))+b}E kU(t,b,c,d){F-c/2*(1a.3M(1a.4u*t/d)-1)+b}E kY(t,b,c,d){F(t===0)?b:c*1a.5w(2,10*(t/d-1))+b}E kZ(t,b,c,d){F(t===d)?b+c:c*(-1a.5w(2,-10*t/d)+1)+b}E l0(t,b,c,d){if(t===0){F b}if(t===d){F b+c}t/=d/2;if(t<1){F c/2*1a.5w(2,10*(t-1))+b}F c/2*(-1a.5w(2,-10*--t)+2)+b}E l4(t,b,c,d){F-c*(1a.5E(1-(t/=d)*t)-1)+b}E l5(t,b,c,d){F c*1a.5E(1-(t=t/d-1)*t)+b}E l6(t,b,c,d){t/=d/2;if(t<1){F-c/2*(1a.5E(1-t*t)-1)+b}F c/2*(1a.5E(1-(t-=2)*t)+1)+b}E l8(t,b,c,d){G s=1.bt,p=0,a=c;if(t===0){F b}t/=d;if(t===1){F b+c}if(!p){p=d*0.3}G e=gW(a,c,p,s);F-kD(e,t,d)+b}E lc(t,b,c,d){G s=1.bt,p=0,a=c;if(t===0){F b}t/=d;if(t===1){F b+c}if(!p){p=d*0.3}G e=gW(a,c,p,s);F e.a*1a.5w(2,-10*t)*1a.3e((t*d-e.s)*(2*1a.4u)/e.p)+e.c+b}E ld(t,b,c,d){G s=1.bt,p=0,a=c;if(t===0){F b}t/=d/2;if(t===2){F b+c}if(!p){p=d*(0.3*1.5)}G e=gW(a,c,p,s);if(t<1){F-0.5*kD(e,t,d)+b}F e.a*1a.5w(2,-10*(t-=1))*1a.3e((t*d-e.s)*(2*1a.4u)/e.p)*0.5+e.c+b}E le(t,b,c,d,s){if(s===1v){s=1.bt}F c*(t/=d)*t*((s+1)*t-s)+b}E lf(t,b,c,d,s){if(s===1v){s=1.bt}F c*((t=t/d-1)*t*((s+1)*t+s)+1)+b}E lg(t,b,c,d,s){if(s===1v){s=1.bt}t/=d/2;if(t<1){F c/2*(t*t*(((s*=(1.yo))+1)*t-s))+b}F c/2*((t-=2)*t*(((s*=(1.yo))+1)*t+s)+2)+b}E gs(t,b,c,d){F c-fD(d-t,0,c,d)+b}E fD(t,b,c,d){if((t/=d)<(1/2.75)){F c*(7.hF*t*t)+b}P if(t<(2/2.75)){F c*(7.hF*(t-=(1.5/2.75))*t+0.75)+b}P if(t<(2.5/2.75)){F c*(7.hF*(t-=(2.25/2.75))*t+0.Bx)+b}P{F c*(7.hF*(t-=(2.Bw/2.75))*t+0.Bv)+b}}E lz(t,b,c,d){if(t<d/2){F gs(t*2,0,c,d)*0.5+b}F fD(t*2-d,0,c,d)*0.5+c*0.5+b}I.J.Bu={Bs:E(t,b,c,d){F c*(t/=d)*t+b},Bp:E(t,b,c,d){F-c*(t/=d)*(t-2)+b},Bo:E(t,b,c,d){t/=(d/2);if(t<1){F c/2*t*t+b}F-c/2*((--t)*(t-2)-1)+b},Bn:E(t,b,c,d){F c*(t/=d)*t*t+b},kE:kE,kG:kG,kH:kH,kJ:kJ,kK:kK,kL:kL,kN:kN,kO:kO,kR:kR,kT:kT,kU:kU,kY:kY,kZ:kZ,l0:l0,l4:l4,l5:l5,l6:l6,l8:l8,lc:lc,ld:ld,le:le,lf:lf,lg:lg,gs:gs,fD:fD,lz:lz}})();(E(h){\'2z 2H\';G k=h.I||(h.I={}),1n=k.J.1m.1n,3m=k.J.1m.3m,26=k.J.26,6G=k.J.6G,8O=k.J.8O,ys=/^(1Q|9t|mk|yv|gN|5i|2r|4q|1x)$/i,yx=/^(mJ|4q|Bj|dJ|Bf|5e)$/i,yA=/^(?:dJ|mY|mJ|Bd|Ba|7E)$/i,yG=/^(mJ|g|a|5e)$/i,n9={cx:\'1g\',x:\'1g\',r:\'2T\',cy:\'1h\',y:\'1h\',B8:\'4X\',hx:\'4X\',23:\'4l\',\'1A-1V\':\'yH\',\'1A-yI\':\'8H\',\'3S-fG\':\'2E\',\'3S-9B\':\'2h\',\'3S-1L\':\'3N\',\'3S-3G\':\'3n\',\'1D-yJ\':\'2K\',\'1D-nQ\':\'55\',\'1D-yK\':\'5y\',\'1D-yL\':\'6W\',\'1D-1V\':\'yN\',\'1D-K\':\'2s\',\'1x-8B\':\'3p\',\'1x-yP\':\'1T\'},jA={1D:\'yN\',1A:\'yH\'};k.fk={};k.7S={};E fj(a){if(a in n9){F n9[a]}F a}E fe(a,b,c,d){G e=1H.1i.3s.1W(b)===\'[1m 3g]\',8K;if((a===\'1A\'||a===\'1D\')&&b===\'4n\'){b=\'\'}P if(a===\'2K\'){if(b===\'4n\'){b=1k}P{b=b.2M(/,/g,\' \').2S(/\\s+/).4r(E(n){F 3q(n)})}}P if(a===\'4l\'){if(c&&c.4l){b=8O(c.4l,k.gX(b))}P{b=k.gX(b)}}P if(a===\'4X\'){b=(b===\'4n\'||b===\'yR\')?1f:U;if(c&&c.4X===1f){b=1f}}P if(a===\'1T\'){b=b===\'9F\'?\'1g\':b===\'7f\'?\'3H\':\'1G\'}P{8K=e?b.4r(6G):6G(b,d)}F(!e&&et(8K)?b:8K)}E yS(a){R(G b in jA){if(1j a[jA[b]]===\'1v\'||a[b]===\'\'){3t}if(1j a[b]===\'1v\'){if(!k.1H.1i[b]){3t}a[b]=k.1H.1i[b]}if(a[b].2Z(\'9Q(\')===0){3t}G c=1c k.2e(a[b]);a[b]=c.cM(26(c.82()*a[jA[b]],2)).i8()}F a}E p4(a,b){G c,i9=[],pd;R(G i=0;i<b.N;i++){c=b[i];pd=a.bh(c);i9=i9.2v(3g.1i.2P.1W(pd))}F i9}k.gX=(E(){E il(a,b){G c=1a.3M(b[0]),3e=1a.3e(b[0]),x=0,y=0;if(b.N===3){x=b[1];y=b[2]}a[0]=c;a[1]=3e;a[2]=-3e;a[3]=c;a[4]=x-(c*x-3e*y);a[5]=y-(3e*x+c*y)}E au(a,b){G c=b[0],yZ=(b.N===2)?b[1]:b[0];a[0]=c;a[3]=yZ}E pn(a,b,c){a[c]=1a.cD(k.J.4D(b[0]))}E 9X(a,b){a[4]=b[0];if(b.N===2){a[5]=b[1]}}G f=[1,0,0,1,0,0],3y=k.9Y,6T=\'(?:\\\\s+,?\\\\s*|,\\\\s*)\',2L=\'(?:(2L)\\\\s*\\\\(\\\\s*(\'+3y+\')\\\\s*\\\\))\',2U=\'(?:(2U)\\\\s*\\\\(\\\\s*(\'+3y+\')\\\\s*\\\\))\',5t=\'(?:(5t)\\\\s*\\\\(\\\\s*(\'+3y+\')(?:\'+6T+\'(\'+3y+\')\'+6T+\'(\'+3y+\'))?\\\\s*\\\\))\',3k=\'(?:(3k)\\\\s*\\\\(\\\\s*(\'+3y+\')(?:\'+6T+\'(\'+3y+\'))?\\\\s*\\\\))\',3T=\'(?:(3T)\\\\s*\\\\(\\\\s*(\'+3y+\')(?:\'+6T+\'(\'+3y+\'))?\\\\s*\\\\))\',2J=\'(?:(2J)\\\\s*\\\\(\\\\s*\'+\'(\'+3y+\')\'+6T+\'(\'+3y+\')\'+6T+\'(\'+3y+\')\'+6T+\'(\'+3y+\')\'+6T+\'(\'+3y+\')\'+6T+\'(\'+3y+\')\'+\'\\\\s*\\\\))\',23=\'(?:\'+2J+\'|\'+3T+\'|\'+3k+\'|\'+5t+\'|\'+2L+\'|\'+2U+\')\',z0=\'(?:\'+23+\'(?:\'+6T+\'*\'+23+\')*\'+\')\',z1=\'^\\\\s*(?:\'+z0+\'?)\\\\s*$\',z3=1c 9i(z1),z4=1c 9i(23,\'g\');F E(c){G d=f.2v(),bC=[];if(!c||(c&&!z3.3a(c))){F d}c.2M(z4,E(b){G m=1c 9i(23).hm(b).44(E(a){F(!!a)}),z5=m[1],6k=m.2P(2).4r(3q);6R(z5){1C\'3T\':9X(d,6k);1P;1C\'5t\':6k[0]=k.J.4D(6k[0]);il(d,6k);1P;1C\'3k\':au(d,6k);1P;1C\'2L\':pn(d,6k,2);1P;1C\'2U\':pn(d,6k,1);1P;1C\'2J\':d=6k;1P}bC.1o(d.2v());d=f.2v()});G e=bC[0];31(bC.N>1){bC.vg();e=k.J.8O(e,bC[0])}F e}})();E z6(c,d){G e,4M;c.2M(/;\\s*$/,\'\').2S(\';\').4j(E(a){G b=a.2S(\':\');e=fj(b[0].4T().bi());4M=fe(e,b[1].4T());d[e]=4M})}E z7(a,b){G c,4M;R(G d in a){if(1j a[d]===\'1v\'){3t}c=fj(d.bi());4M=fe(c,a[d]);b[c]=4M}}E zb(a,b){G c={};R(G d in k.fk[b]){if(zc(a,d.2S(\' \'))){R(G e in k.fk[b][d]){c[e]=k.fk[b][d][e]}}}F c}E zc(a,b){G c,bO=U;c=qd(a,b.d8());if(c&&b.N){bO=zf(a,b)}F c&&bO&&(b.N===0)}E zf(a,b){G c,bO=U;31(a.4K&&a.4K.x0===1&&b.N){if(bO){c=b.d8()}a=a.4K;bO=qd(a,c)}F b.N===0}E qd(a,b){G c=a.51,c0=a.2D(\'m2\'),id=a.2D(\'id\'),ak;ak=1c 9i(\'^\'+c,\'i\');b=b.2M(ak,\'\');if(id&&b.N){ak=1c 9i(\'#\'+id+\'(?![a-zA-Z\\\\-]+)\',\'i\');b=b.2M(ak,\'\')}if(c0&&b.N){c0=c0.2S(\' \');R(G i=c0.N;i--;){ak=1c 9i(\'\\\\.\'+c0[i]+\'(?![a-zA-Z\\\\-]+)\',\'i\');b=b.2M(ak,\'\')}}F b.N===0}E zi(a,b){G c;a.lr&&(c=a.lr(b));if(c){F c}G d,i,qw=a.bh(\'*\');R(i=0;i<qw.N;i++){d=qw[i];if(b===d.2D(\'id\')){F d}}}E zq(a){G b=p4(a,[\'2z\',\'5e:2z\']),i=0;31(b.N&&i<b.N){G c=b[i],5x=c.2D(\'5x:as\').zr(1),x=c.2D(\'x\')||0,y=c.2D(\'y\')||0,5z=zi(a,5x).zu(U),gk=(5z.2D(\'23\')||\'\')+\' 3T(\'+x+\', \'+y+\')\',4K,zv=b.N,6H,j,at,l;gF(5z);if(/^5e$/i.3a(5z.51)){G d=5z.na.69(\'g\');R(j=0,at=5z.gG,l=at.N;j<l;j++){6H=at.jp(j);d.5H(6H.51,6H.kn)}31(5z.76){d.9j(5z.76)}5z=d}R(j=0,at=c.gG,l=at.N;j<l;j++){6H=at.jp(j);if(6H.51===\'x\'||6H.51===\'y\'||6H.51===\'5x:as\'){3t}if(6H.51===\'23\'){gk=6H.kn+\' \'+gk}P{5z.5H(6H.51,6H.kn)}}5z.5H(\'23\',gk);5z.5H(\'zx\',\'1\');5z.AD(\'id\');4K=c.4K;4K.mx(5z,c);if(b.N===zv){i++}}}G o=1c 9i(\'^\'+\'\\\\s*(\'+k.9Y+\'+)\\\\s*,?\'+\'\\\\s*(\'+k.9Y+\'+)\\\\s*,?\'+\'\\\\s*(\'+k.9Y+\'+)\\\\s*,?\'+\'\\\\s*(\'+k.9Y+\'+)\\\\s*\'+\'$\');E gF(a){G b=a.2D(\'68\'),1r=1,1t=1,4Y=0,4k=0,gQ,gT,2J,el,cX=a.2D(\'K\'),d6=a.2D(\'O\'),x=a.2D(\'x\')||0,y=a.2D(\'y\')||0,6x=a.2D(\'6x\')||\'\',kB=(!b||!yx.3a(a.51)||!(b=b.3K(o))),kC=(!cX||!d6||cX===\'3h%\'||d6===\'3h%\'),cq=kB&&kC,5d={},9X=\'\';5d.K=0;5d.O=0;5d.cq=cq;if(cq){F 5d}if(kB){5d.K=6G(cX);5d.O=6G(d6);F 5d}4Y=-3q(b[1]);4k=-3q(b[2]);gQ=3q(b[3]);gT=3q(b[4]);if(!kC){5d.K=6G(cX);5d.O=6G(d6);1r=5d.K/gQ;1t=5d.O/gT}P{5d.K=gQ;5d.O=gT}6x=k.J.mN(6x);if(6x.6d!==\'4n\'){1t=1r=(1r>1t?1t:1r)}if(1r===1&&1t===1&&4Y===0&&4k===0&&x===0&&y===0){F 5d}if(x||y){9X=\' 3T(\'+6G(x)+\' \'+6G(y)+\') \'}2J=9X+\' 2J(\'+1r+\' 0\'+\' 0 \'+1t+\' \'+(4Y*1r)+\' \'+(4k*1t)+\') \';if(a.51===\'5e\'){el=a.na.69(\'g\');31(a.76){el.9j(a.76)}a.9j(el)}P{el=a;2J=el.2D(\'23\')+2J}el.5H(\'23\',2J);F 5d}E zz(a,b){31(a&&(a=a.4K)){if(a.51&&b.3a(a.51.2M(\'5e:\',\'\'))&&!a.2D(\'zx\')){F U}}F 1f}k.hg=E(b,c,d){if(!b){F}zq(b);G e=k.1H.dD++,3u=gF(b),a8=k.J.aZ(b.bh(\'*\'));3u.8T=e;if(a8.N===0&&k.7d){a8=b.Az(\'//*[Ay(.)!="5e"]\');G f=[];R(G i=0,1d=a8.N;i<1d;i++){f[i]=a8[i]}a8=f}G g=a8.44(E(a){gF(a);F ys.3a(a.51.2M(\'5e:\',\'\'))&&!zz(a,yA)});if(!g||(g&&!g.N)){c&&c([],{});F}k.7S[e]=k.zC(b);k.fk[e]=k.zD(b);k.zE(g,E(a){if(c){c(a,3u)}},3m(3u),d)};G p=1c 9i(\'(bq|Ar)?\\\\s*(bq|Ap-Ao)?\\\\s*\'+\'(bq|An|Am|Ah|3h|zZ|Af|A2|a0|b4|Ad|D0|Ae)?\\\\s*(\'+k.9Y+\'(?:px|cm|mm|em|pt|pc|in)*)(?:\\\\/(bq|\'+k.9Y+\'))?\\\\s+(.*)\');1n(k,{A7:E(a,b){G c=a.3K(p);if(!c){F}G d=c[1],3n=c[3],2h=c[4],2R=c[5],2E=c[6];if(d){b.3N=d}if(3n){b.3n=et(3q(3n))?3n:3q(3n)}if(2h){b.2h=6G(2h)}if(2E){b.2E=2E}if(2R){b.2R=2R===\'bq\'?1:2R}},zC:E(a){G b=[\'eP\',\'jN\',\'5e:eP\',\'5e:jN\'],ls=p4(a,b),el,j=0,id,5x,7S={},jQ={};j=ls.N;31(j--){el=ls[j];5x=el.2D(\'5x:as\');id=el.2D(\'id\');if(5x){jQ[id]=5x.zr(1)}7S[id]=el}R(id in jQ){G c=7S[jQ[id]].zu(U);el=7S[id];31(c.76){el.9j(c.76)}}F 7S},78:E(c,d,e){if(!c){F}G f,cF={},2h;if(1j e===\'1v\'){e=c.2D(\'8T\')}if(c.4K&&yG.3a(c.4K.51)){cF=k.78(c.4K,d,e)}2h=(cF&&cF.2h)||c.2D(\'3S-9B\')||k.4W.hi;G g=d.f0(E(a,b){f=c.2D(b);if(f){b=fj(b);f=fe(b,f,cF,2h);a[b]=f}F a},{});g=1n(g,1n(zb(c,e),k.A3(c)));if(g.3S){k.A7(g.3S,g)}F yS(1n(cF,g))},zE:E(a,b,c,d){1c k.8o(a,b,c,d).gg()},A3:E(a){G b={},1L=a.2D(\'1L\');if(!1L){F b}if(1j 1L===\'2N\'){z6(1L,b)}P{z7(1L,b)}F b},lE:E(a){if(!a){F 1k}a=a.2M(/,/g,\' \').4T();a=a.2S(/\\s+/);G b=[],i,1d;i=0;1d=a.N;R(;i<1d;i+=2){b.1o({x:3q(a[i]),y:3q(a[i+1])})}F b},zD:E(e){G f=e.bh(\'1L\'),eV={},eX;R(G i=0,1d=f.N;i<1d;i++){G g=f[i].lP||f[i].1x;g=g.2M(/\\/\\*[\\s\\S]*?\\*\\//g,\'\');if(g.4T()===\'\'){3t}eX=g.3K(/[^{]*\\{[\\s\\S]*?\\}/g);eX=eX.4r(E(a){F a.4T()});eX.4j(E(b){G c=b.3K(/([\\s\\S]*?)\\s*\\{([^}]*)\\}/),go={},A1=c[2].4T(),lS=A1.2M(/;$/,\'\').2S(/\\s*;\\s*/);R(G i=0,1d=lS.N;i<1d;i++){G d=lS[i].2S(/\\s*:\\s*/),lT=fj(d[0]),4M=fe(lT,d[1],d[0]);go[lT]=4M}b=c[1];b.2S(\',\').4j(E(a){a=a.2M(/^5e/i,\'\').4T();if(a===\'\'){F}if(eV[a]){k.J.1m.1n(eV[a],go)}P{eV[a]=k.J.1m.3m(go)}})})}F eV},gp:E(d,e,f){d=d.2M(/^\\n\\s*/,\'\').4T();1c k.J.8g(d,{gn:\'1Z\',3j:3j});E 3j(r){G c=r.Ag;if(c&&!c.7i&&k.4i.9o&&r.zY){c=1c 9o(\'oF.zW\');c.9b=\'1f\';c.zV(r.zY.2M(/<!m6[\\s\\S]*?(\\[[\\s\\S]*\\])*?>/i,\'\'))}if(!c||!c.7i){e&&e(1k)}k.hg(c.7i,E(a,b){e&&e(a,b)},f)}},gC:E(c,d,e){c=c.4T();G f;if(1j m8!==\'1v\'){G g=1c m8();if(g&&g.mc){f=g.mc(c,\'1x/md\')}}P if(k.4i.9o){f=1c 9o(\'oF.zW\');f.9b=\'1f\';f.zV(c.2M(/<!m6[\\s\\S]*?(\\[[\\s\\S]*\\])*?>/i,\'\'))}k.hg(f.7i,E(a,b){d(a,b)},e)}})})(1j 1E!==\'1v\'?1E:B);I.8o=E(a,b,c,d){B.ck=a;B.zU=b;B.3u=c;B.fb=d;B.8T=(c&&c.8T)||0};I.8o.1i.gg=E(){B.c8=1c 3g(B.ck.N);B.zT=B.ck.N;B.zS()};I.8o.1i.zS=E(){R(G i=0,1d=B.ck.N;i<1d;i++){B.ck[i].5H(\'8T\',B.8T);(E(a,i){ft(E(){a.zQ(a.ck[i],i)},0)})(B,i)}};I.8o.1i.zQ=E(a,b){G c=I[I.J.2N.8X(a.Ai.2M(\'5e:\',\'\'))];if(c&&c.5X){gm{B.zN(c,a,b)}kb(k8){I.af(k8)}}P{B.gR()}};I.8o.1i.zN=E(a,b,c){if(a.9b){a.5X(b,B.zM(c,b),B.3u)}P{G d=a.5X(b,B.3u);B.fN(d,\'1A\');B.fN(d,\'1D\');B.fb&&B.fb(b,d);B.c8[c]=d;B.gR()}};I.8o.1i.zM=E(b,c){G d=B;F E(a){d.fN(a,\'1A\');d.fN(a,\'1D\');d.fb&&d.fb(c,a);d.c8[b]=a;d.gR()}};I.8o.1i.fN=E(a,b){G c=a.1Z(b);if(!(/^9Q\\(/).3a(c)){F}G d=c.2P(5,c.N-1);if(I.7S[B.8T][d]){a.1F(b,I.7W.5X(I.7S[B.8T][d],a))}};I.8o.1i.gR=E(){if(--B.zT===0){B.c8=B.c8.44(E(a){F a!=1k});B.zU(B.c8)}};(E(c){\'2z 2H\';G d=c.I||(c.I={});if(d.1N){d.4B(\'I.1N is 5k 53\');F}d.1N=1N;E 1N(x,y){B.x=x;B.y=y}1N.1i={1p:\'9r\',8n:1N,5F:E(a){F 1c 1N(B.x+a.x,B.y+a.y)},rM:E(a){B.x+=a.x;B.y+=a.y;F B},mX:E(a){F 1c 1N(B.x+a,B.y+a)},Aj:E(a){B.x+=a;B.y+=a;F B},zK:E(a){F 1c 1N(B.x-a.x,B.y-a.y)},o2:E(a){B.x-=a.x;B.y-=a.y;F B},Ak:E(a){F 1c 1N(B.x-a,B.y-a)},Al:E(a){B.x-=a;B.y-=a;F B},n4:E(a){F 1c 1N(B.x*a,B.y*a)},As:E(a){B.x*=a;B.y*=a;F B},At:E(a){F 1c 1N(B.x/a,B.y/a)},Av:E(a){B.x/=a;B.y/=a;F B},eq:E(a){F(B.x===a.x&&B.y===a.y)},lt:E(a){F(B.x<a.x&&B.y<a.y)},Aw:E(a){F(B.x<=a.x&&B.y<=a.y)},gt:E(a){F(B.x>a.x&&B.y>a.y)},Ax:E(a){F(B.x>=a.x&&B.y>=a.y)},zB:E(a,t){if(1j t===\'1v\'){t=0.5}t=1a.1J(1a.2n(1,t),0);F 1c 1N(B.x+(a.x-B.x)*t,B.y+(a.y-B.y)*t)},AB:E(a){G b=B.x-a.x,dy=B.y-a.y;F 1a.5E(b*b+dy*dy)},nj:E(a){F B.zB(a)},2n:E(a){F 1c 1N(1a.2n(B.x,a.x),1a.2n(B.y,a.y))},1J:E(a){F 1c 1N(1a.1J(B.x,a.x),1a.1J(B.y,a.y))},3s:E(){F B.x+\',\'+B.y},AC:E(x,y){B.x=x;B.y=y;F B},AE:E(x){B.x=x;F B},AF:E(y){B.y=y;F B},AG:E(a){B.x=a.x;B.y=a.y;F B},AH:E(a){G x=B.x,y=B.y;B.x=a.x;B.y=a.y;a.x=x;a.y=y},3m:E(){F 1c 1N(B.x,B.y)}}})(1j 1E!==\'1v\'?1E:B);(E(g){\'2z 2H\';G h=g.I||(g.I={});if(h.3b){h.4B(\'I.3b is 5k 53\');F}E 3b(a){B.aP=a;B.28=[]}h.3b=3b;h.3b.1i={8n:3b,zt:E(a){B.28.1o(a);F B},9s:E(a){B.28=B.28.2v(a);F B}};h.3b.zs=E(a,b,c,d){G e,nH=(d.x-c.x)*(a.y-c.y)-(d.y-c.y)*(a.x-c.x),nI=(b.x-a.x)*(a.y-c.y)-(b.y-a.y)*(a.x-c.x),uB=(d.y-c.y)*(b.x-a.x)-(d.x-c.x)*(b.y-a.y);if(uB!==0){G f=nH/uB,ub=nI/uB;if(0<=f&&f<=1&&0<=ub&&ub<=1){e=1c 3b(\'3b\');e.zt(1c h.1N(a.x+f*(b.x-a.x),a.y+f*(b.y-a.y)))}P{e=1c 3b()}}P{if(nH===0||nI===0){e=1c 3b(\'AI\')}P{e=1c 3b(\'AJ\')}}F e};h.3b.bx=E(a,b,c){G d=1c 3b(),N=c.N,b1,b2,fU;R(G i=0;i<N;i++){b1=c[i];b2=c[(i+1)%N];fU=3b.zs(a,b,b1,b2);d.9s(fU.28)}if(d.28.N>0){d.aP=\'3b\'}F d};h.3b.zp=E(a,b){G c=1c 3b(),N=a.N;R(G i=0;i<N;i++){G d=a[i],a2=a[(i+1)%N],fU=3b.bx(d,a2,b);c.9s(fU.28)}if(c.28.N>0){c.aP=\'3b\'}F c};h.3b.zo=E(a,b,c){G d=b.2n(c),1J=b.1J(c),nW=1c h.1N(1J.x,d.y),nX=1c h.1N(d.x,1J.y),zn=3b.bx(d,nW,a),zm=3b.bx(nW,1J,a),zl=3b.bx(1J,nX,a),zk=3b.bx(nX,d,a),3x=1c 3b();3x.9s(zn.28);3x.9s(zm.28);3x.9s(zl.28);3x.9s(zk.28);if(3x.28.N>0){3x.aP=\'3b\'}F 3x}})(1j 1E!==\'1v\'?1E:B);(E(e){\'2z 2H\';G f=e.I||(e.I={});if(f.2e){f.4B(\'I.2e is 5k 53.\');F}E 2e(a){if(!a){B.9h([0,0,0,1])}P{B.zj(a)}}f.2e=2e;f.2e.1i={zj:E(a){G b;if(a in 2e.o8){a=2e.o8[a]}if(a===\'AM\'){b=[2x,2x,2x,0]}if(!b){b=2e.oc(a)}if(!b){b=2e.od(a)}if(!b){b=2e.oe(a)}if(!b){b=[0,0,0,1]}if(b){B.9h(b)}},oj:E(r,g,b){r/=2x;g/=2x;b/=2x;G h,s,l,1J=f.J.5A.1J([r,g,b]),2n=f.J.5A.2n([r,g,b]);l=(1J+2n)/2;if(1J===2n){h=s=0}P{G d=1J-2n;s=l>0.5?d/(2-1J-2n):d/(1J+2n);6R(1J){1C r:h=(g-b)/d+(g<b?6:0);1P;1C g:h=(b-r)/d+2;1P;1C b:h=(r-g)/d+4;1P}h/=6}F[1a.4o(h*6O),1a.4o(s*3h),1a.4o(l*3h)]},4m:E(){F B.zd},9h:E(a){B.zd=a},fK:E(){G a=B.4m();F\'aH(\'+a[0]+\',\'+a[1]+\',\'+a[2]+\')\'},i8:E(){G a=B.4m();F\'7P(\'+a[0]+\',\'+a[1]+\',\'+a[2]+\',\'+a[3]+\')\'},AO:E(){G a=B.4m(),8s=B.oj(a[0],a[1],a[2]);F\'8s(\'+8s[0]+\',\'+8s[1]+\'%,\'+8s[2]+\'%)\'},AP:E(){G a=B.4m(),8s=B.oj(a[0],a[1],a[2]);F\'z9(\'+8s[0]+\',\'+8s[1]+\'%,\'+8s[2]+\'%,\'+a[3]+\')\'},z8:E(){G a=B.4m(),r,g,b;r=a[0].3s(16);r=(r.N===1)?(\'0\'+r):r;g=a[1].3s(16);g=(g.N===1)?(\'0\'+g):g;b=a[2].3s(16);b=(b.N===1)?(\'0\'+b):b;F r.86()+g.86()+b.86()},AQ:E(){G b=B.4m(),a;a=b[3]*2x;a=a.3s(16);a=(a.N===1)?(\'0\'+a):a;F B.z8()+a.86()},82:E(){F B.4m()[3]},cM:E(a){G b=B.4m();b[3]=a;B.9h(b);F B},AR:E(){G a=B.4m(),5v=3r((a[0]*0.3+a[1]*0.59+a[2]*0.11).26(0),10),gc=a[3];B.9h([5v,5v,5v,gc]);F B},AS:E(a){G b=B.4m(),5v=(b[0]*0.3+b[1]*0.59+b[2]*0.11).26(0),gc=b[3];a=a||AT;5v=(bj(5v)<bj(a))?0:2x;B.9h([5v,5v,5v,gc]);F B},AU:E(a){if(!(a 5D 2e)){a=1c 2e(a)}G b=[],4v=B.82(),p3=0.5,1Y=B.4m(),z2=a.4m();R(G i=0;i<3;i++){b.1o(1a.4o((1Y[i]*(1-p3))+(z2[i]*p3)))}b[3]=4v;B.9h(b);F B}};f.2e.yY=/^7P?\\(\\s*(\\d{1,3}(?:\\.\\d+)?\\%?)\\s*,\\s*(\\d{1,3}(?:\\.\\d+)?\\%?)\\s*,\\s*(\\d{1,3}(?:\\.\\d+)?\\%?)\\s*(?:\\s*,\\s*(\\d+(?:\\.\\d+)?)\\s*)?\\)$/;f.2e.yX=/^z9?\\(\\s*(\\d{1,3})\\s*,\\s*(\\d{1,3}\\%)\\s*,\\s*(\\d{1,3}\\%)\\s*(?:\\s*,\\s*(\\d+(?:\\.\\d+)?)\\s*)?\\)$/;f.2e.yW=/^#?([0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{4}|[0-9a-f]{3})$/i;f.2e.o8={AY:\'#AZ\',B0:\'#pr\',fB:\'#B1\',B2:\'#B3\',B4:\'#yM\',B5:\'#yM\',fz:\'#B6\',B7:\'#Bb\',Bc:\'#Be\',Bg:\'#Bh\',Bk:\'#Fx\',Bl:\'#Bm\',Bq:\'#Br\',fo:\'#By\',Bz:\'#BA\',BB:\'#BC\',yi:\'#BD\',BE:\'#BF\'};E gY(p,q,t){if(t<0){t+=1}if(t>1){t-=1}if(t<1/6){F p+(q-p)*6*t}if(t<1/2){F q}if(t<2/3){F p+(q-p)*(2/3-t)*6}F p}f.2e.yc=E(a){F 2e.gZ(2e.od(a))};f.2e.od=E(a){G c=a.3K(2e.yY);if(c){G r=3r(c[1],10)/(/%$/.3a(c[1])?3h:1)*(/%$/.3a(c[1])?2x:1),g=3r(c[2],10)/(/%$/.3a(c[2])?3h:1)*(/%$/.3a(c[2])?2x:1),b=3r(c[3],10)/(/%$/.3a(c[3])?3h:1)*(/%$/.3a(c[3])?2x:1);F[3r(r,10),3r(g,10),3r(b,10),c[4]?3q(c[4]):1]}};f.2e.BG=2e.yc;f.2e.ya=E(a){F 2e.gZ(2e.oe(a))};f.2e.oe=E(a){G c=a.3K(2e.yX);if(!c){F}G h=(((3q(c[1])%6O)+6O)%6O)/6O,s=3q(c[2])/(/%$/.3a(c[2])?3h:1),l=3q(c[3])/(/%$/.3a(c[3])?3h:1),r,g,b;if(s===0){r=g=b=l}P{G q=l<=0.5?l*(s+1):l+s-l*s,p=l*2-q;r=gY(p,q,h+1/3);g=gY(p,q,h);b=gY(p,q,h-1/3)}F[1a.4o(r*2x),1a.4o(g*2x),1a.4o(b*2x),c[4]?3q(c[4]):1]};f.2e.BH=2e.ya;f.2e.BI=E(a){F 2e.gZ(2e.oc(a))};f.2e.oc=E(c){if(c.3K(2e.yW)){G d=c.2P(c.2Z(\'#\')+1),ff=(d.N===3||d.N===4),y7=(d.N===8||d.N===4),r=ff?(d.3J(0)+d.3J(0)):d.hc(0,2),g=ff?(d.3J(1)+d.3J(1)):d.hc(2,4),b=ff?(d.3J(2)+d.3J(2)):d.hc(4,6),a=y7?(ff?(d.3J(3)+d.3J(3)):d.hc(6,8)):\'BJ\';F[3r(r,16),3r(g,16),3r(b,16),3q((3r(a,16)/2x).26(2))]}};f.2e.gZ=E(a){G b=1c 2e();b.9h(a);F b}})(1j 1E!==\'1v\'?1E:B);(E(){E y5(a){G b=a.2D(\'1L\'),24=a.2D(\'24\')||0,29,qz,1V;24=3q(24)/(/%$/.3a(24)?3h:1);24=24<0?0:24>1?1:24;if(b){G c=b.2S(/\\s*;\\s*/);if(c[c.N-1]===\'\'){c.d8()}R(G i=c.N;i--;){G d=c[i].2S(/\\s*:\\s*/),8q=d[0].4T(),4M=d[1].4T();if(8q===\'9c-29\'){29=4M}P if(8q===\'9c-1V\'){1V=4M}}}if(!29){29=a.2D(\'9c-29\')||\'aH(0,0,0)\'}if(!1V){1V=a.2D(\'9c-1V\')}29=1c I.2e(29);qz=29.82();1V=et(3q(1V))?1:3q(1V);1V*=qz;F{24:24,29:29.fK(),1V:1V}}E y0(a){F{x1:a.2D(\'x1\')||0,y1:a.2D(\'y1\')||0,x2:a.2D(\'x2\')||\'3h%\',y2:a.2D(\'y2\')||0}}E xZ(a){F{x1:a.2D(\'fx\')||a.2D(\'cx\')||\'50%\',y1:a.2D(\'fy\')||a.2D(\'cy\')||\'50%\',r1:0,x2:a.2D(\'cx\')||\'50%\',y2:a.2D(\'cy\')||\'50%\',r2:a.2D(\'r\')||\'50%\'}}I.7W=I.J.1z({2O:0,2A:0,2c:E(a){a||(a={});G b={};B.id=I.1H.dD++;B.1p=a.1p||\'9G\';b={x1:a.2C.x1||0,y1:a.2C.y1||0,x2:a.2C.x2||0,y2:a.2C.y2||0};if(B.1p===\'aw\'){b.r1=a.2C.r1||0;b.r2=a.2C.r2||0}B.2C=b;B.3R=a.3R.2P();if(a.4P){B.4P=a.4P}B.2O=a.2O||B.2O;B.2A=a.2A||B.2A},kv:E(a){R(G b in a){G c=1c I.2e(a[b]);B.3R.1o({24:b,29:c.fK(),1V:c.82()})}F B},1B:E(a){G b={1p:B.1p,2C:B.2C,3R:B.3R,2O:B.2O,2A:B.2A,4P:B.4P?B.4P.2v():B.4P};I.J.d1(B,b,a);F b},3D:E(c){G d=I.J.1m.3m(B.2C),3V,eM;B.3R.BK(E(a,b){F a.24-b.24});if(!(c.1s&&c.1s.1p===\'1Q-1s\')){R(G e in d){if(e===\'x1\'||e===\'x2\'||e===\'r2\'){d[e]+=B.2O-c.K/2}P if(e===\'y1\'||e===\'y2\'){d[e]+=B.2A-c.O/2}}}eM=\'id="aB\'+B.id+\'" hX="xX"\';if(B.4P){eM+=\' 4P="2J(\'+B.4P.2p(\' \')+\')" \'}if(B.1p===\'9G\'){3V=[\'<eP \',eM,\' x1="\',d.x1,\'" y1="\',d.y1,\'" x2="\',d.x2,\'" y2="\',d.y2,\'">\\n\']}P if(B.1p===\'aw\'){3V=[\'<jN \',eM,\' cx="\',d.x2,\'" cy="\',d.y2,\'" r="\',d.r2,\'" fx="\',d.x1,\'" fy="\',d.y1,\'">\\n\']}R(G i=0;i<B.3R.N;i++){3V.1o(\'<9c \',\'24="\',(B.3R[i].24*3h)+\'%\',\'" 1L="9c-29:\',B.3R[i].29,(B.3R[i].1V!==1k?\';9c-1V: \'+B.3R[i].1V:\';\'),\'"/>\\n\')}3V.1o((B.1p===\'9G\'?\'</eP>\\n\':\'</jN>\\n\'));F 3V.2p(\'\')},4c:E(a,b){G c,4J,2C=I.J.1m.3m(B.2C);if(!B.1p){F}if(b.1s&&b.1s.1p===\'1Q-1s\'){R(4J in 2C){if(4J===\'x1\'||4J===\'x2\'){2C[4J]+=-B.2O+b.K/2}P if(4J===\'y1\'||4J===\'y2\'){2C[4J]+=-B.2A+b.O/2}}}if(B.1p===\'9G\'){c=a.BL(2C.x1,2C.y1,2C.x2,2C.y2)}P if(B.1p===\'aw\'){c=a.BN(2C.x1,2C.y1,2C.r1,2C.x2,2C.y2,2C.r2)}R(G i=0,1d=B.3R.N;i<1d;i++){G d=B.3R[i].29,1V=B.3R[i].1V,24=B.3R[i].24;if(1j 1V!==\'1v\'){d=1c I.2e(d).cM(1V).i8()}c.kv(3q(24),d)}F c}});I.J.1m.1n(I.7W,{5X:E(a,b){G c=a.bh(\'9c\'),1p,hX=a.2D(\'hX\')||\'aD\',4P=a.2D(\'4P\'),3R=[],2C,9J;if(a.51===\'eP\'||a.51===\'BO\'){1p=\'9G\'}P{1p=\'aw\'}if(1p===\'9G\'){2C=y0(a)}P if(1p===\'aw\'){2C=xZ(a)}R(G i=c.N;i--;){3R.1o(y5(c[i]))}9J=kP(b,2C,hX);G d=1c I.7W({1p:1p,2C:2C,3R:3R,2O:-b.1g,2A:-b.1h});if(4P||9J!==\'\'){d.4P=I.gX((4P||\'\')+9J)}F d},xS:E(a,b){b||(b={});kP(a,b.2C,\'xX\');F 1c I.7W(b)}});E kP(a,b,c){G d,ii=0,aF=1,9J=\'\';R(G e in b){if(b[e]===\'xM\'){b[e]=1}P if(b[e]===\'-xM\'){b[e]=0}d=3q(b[e],10);if(1j b[e]===\'2N\'&&/^\\d+%$/.3a(b[e])){aF=0.kV}P{aF=1}if(e===\'x1\'||e===\'x2\'||e===\'r2\'){aF*=c===\'aD\'?a.K:1;ii=c===\'aD\'?a.1g||0:0}P if(e===\'y1\'||e===\'y2\'){aF*=c===\'aD\'?a.O:1;ii=c===\'aD\'?a.1h||0:0}b[e]=d*aF+ii}if(a.1p===\'gN\'&&b.r2!==1k&&c===\'aD\'&&a.rx!==a.ry){G f=a.ry/a.rx;9J=\' 3k(1, \'+f+\')\';if(b.y1){b.y1/=f}if(b.y2){b.y2/=f}}F 9J}})();(E(){\'2z 2H\';G e=I.J.26;I.ay=I.J.1z({4p:\'4p\',2O:0,2A:0,2c:E(b,c){b||(b={});B.id=I.1H.dD++;B.7g(b);if(!b.1Y||(b.1Y&&1j b.1Y!==\'2N\')){c&&c(B);F}if(1j I.J.im(b.1Y)!==\'1v\'){B.1Y=1c 9I(I.J.im(b.1Y));c&&c(B)}P{G d=B;B.1Y=I.J.gU();I.J.87(b.1Y,E(a){d.1Y=a;c&&c(d)})}},1B:E(a){G b=I.1H.2m,1Y,1m;if(1j B.1Y===\'E\'){1Y=cw(B.1Y)}P if(1j B.1Y.3F===\'2N\'){1Y=B.1Y.3F}P if(1j B.1Y===\'1m\'&&B.1Y.5c){1Y=B.1Y.5c()}1m={1p:\'dJ\',1Y:1Y,4p:B.4p,2O:e(B.2O,b),2A:e(B.2A,b),};I.J.d1(B,1m,a);F 1m},3D:E(a){G b=1j B.1Y===\'E\'?B.1Y():B.1Y,l1=b.K/a.K,l2=b.O/a.O,xL=B.2O/a.K,xK=B.2A/a.O,iR=\'\';if(B.4p===\'4p-x\'||B.4p===\'no-4p\'){l2=1}if(B.4p===\'4p-y\'||B.4p===\'no-4p\'){l1=1}if(b.3F){iR=b.3F}P if(b.5c){iR=b.5c()}F\'<dJ id="aB\'+B.id+\'" x="\'+xL+\'" y="\'+xK+\'" K="\'+l1+\'" O="\'+l2+\'">\\n\'+\'<4q x="0" y="0"\'+\' K="\'+b.K+\'" O="\'+b.O+\'" 5x:as="\'+iR+\'"></4q>\\n\'+\'</dJ>\\n\'},7g:E(a){R(G b in a){B[b]=a[b]}},4c:E(a){G b=1j B.1Y===\'E\'?B.1Y():B.1Y;if(!b){F\'\'}if(1j b.3F!==\'1v\'){if(!b.xf){F\'\'}if(b.BY===0||b.C0===0){F\'\'}}F a.xH(b,B.4p)}})})();(E(c){\'2z 2H\';G d=c.I||(c.I={}),26=d.J.26;if(d.6o){d.4B(\'I.6o is 5k 53.\');F}d.6o=d.J.1z({29:\'aH(0,0,0)\',5R:0,2O:0,2A:0,9O:1f,4G:U,2c:E(a){if(1j a===\'2N\'){a=B.xF(a)}R(G b in a){B[b]=a[b]}B.id=d.1H.dD++},xF:E(a){G b=a.4T(),j8=d.6o.lk.hm(b)||[],29=b.2M(d.6o.lk,\'\')||\'aH(0,0,0)\';F{29:29.4T(),2O:3r(j8[1],10)||0,2A:3r(j8[2],10)||0,5R:3r(j8[3],10)||0}},3s:E(){F[B.2O,B.2A,B.5R,B.29].2p(\'px \')},3D:E(a){G b=40,jo=40,2m=d.1H.2m,24=d.J.oQ({x:B.2O,y:B.2A},d.J.4D(-a.2i)),lo=20;if(a.K&&a.O){b=26((1a.2f(24.x)+B.5R)/a.K,2m)*3h+lo;jo=26((1a.2f(24.y)+B.5R)/a.O,2m)*3h+lo}if(a.4N){24.x*=-1}if(a.56){24.y*=-1}F(\'<44 id="aB\'+B.id+\'" y="-\'+jo+\'%" O="\'+(3h+2*jo)+\'%" \'+\'x="-\'+b+\'%" K="\'+(3h+2*b)+\'%" \'+\'>\\n\'+\'\\t<xA in="Cd" Ce="\'+26(B.5R?B.5R/2:0,2m)+\'"></xA>\\n\'+\'\\t<xv dx="\'+26(24.x,2m)+\'" dy="\'+26(24.y,2m)+\'" 3x="xu" ></xv>\\n\'+\'\\t<Cf Cg-29="\'+B.29+\'"/>\\n\'+\'\\t<Ci Cj="xu" Ck="in" />\\n\'+\'\\t<xn>\\n\'+\'\\t\\t<jU></jU>\\n\'+\'\\t\\t<jU in="Cl"></jU>\\n\'+\'\\t</xn>\\n\'+\'</44>\\n\')},1B:E(){if(B.4G){F{29:B.29,5R:B.5R,2O:B.2O,2A:B.2A,9O:B.9O}}G b={},xl=d.6o.1i;[\'29\',\'5R\',\'2O\',\'2A\',\'9O\'].4j(E(a){if(B[a]!==xl[a]){b[a]=B[a]}},B);F b}});d.6o.lk=/(?:\\s|^)(-?\\d+(?:px)?(?:\\s?|$))?(-?\\d+(?:px)?(?:\\s?|$))?(\\d+(?:px)?)?(?:\\s?|$)(?:$|\\s)/})(1j 1E!==\'1v\'?1E:B);(E(){\'2z 2H\';if(I.2F){I.4B(\'I.2F is 5k 53.\');F}G f=I.J.1m.1n,aE=I.J.aE,6i=I.J.6i,26=I.J.26,4w=I.J.4w,99=I.J.99,lN=1c mP(\'Cn x6 2c `W` CK\');I.2F=I.J.1z(I.nq,{2c:E(a,b){b||(b={});B.eh(a,b)},3w:\'\',4E:1k,5W:\'\',57:1k,4G:U,g4:1f,64:U,4a:1k,lZ:1f,x4:1f,ed:U,3c:I.g9.2v(),CL:U,CM:U,wY:E(){},gd:U,gf:{},eh:E(a,b){G c=I.2F.1i.2u.3l(B);B.1y=[];B.wV(a);B.wU(b);B.mg();if(!B.8l){B.9V()}if(b.57){B.wT(b.57,c)}if(b.4E){B.mp(b.4E,c)}if(b.3w){B.wS(b.3w,c)}if(b.5W){B.wR(b.5W,c)}B.ba()},bb:E(){F(I.5a!==1&&B.gd)},wP:E(){F B.bb()?I.5a:1},9V:E(){if(!B.bb()){F}B.3A.5H(\'K\',B.K*I.5a);B.3A.5H(\'O\',B.O*I.5a);B.7q.3k(I.5a,I.5a)},ba:E(){B.e6=aE(B.3A);F B},wT:E(a,b,c){F B.mK(\'57\',a,b,c)},mp:E(a,b,c){F B.mK(\'4E\',a,b,c)},wR:E(a,b){F B.mM(\'5W\',a,b)},wS:E(a,b){F B.mM(\'3w\',a,b)},mg:E(){G a=B.2o();a.ed=a.ed||a.CR||a.CS||a.CT||a.CU;a.ed=B.ed},mK:E(b,c,d,e){if(1j c===\'2N\'){I.J.87(c,E(a){a&&(B[b]=1c I.1u(a,e));d&&d(a)},B,e&&e.6q)}P{e&&c.7g(e);B[b]=c;d&&d(c)}F B},mM:E(a,b,c){B[a]=b;B.iG(b,a);B.it(b,a,c);F B},gA:E(a){G b=I.J.6a(a);if(!b.1L){b.1L={}}if(!b){bz lN;}if(1j b.2o===\'1v\'){bz lN;}F b},wU:E(a){B.iH(a);B.K=B.K||3r(B.3A.K,10)||0;B.O=B.O||3r(B.3A.O,10)||0;if(!B.3A.1L){F}B.3A.K=B.K;B.3A.O=B.O;B.3A.1L.K=B.K+\'px\';B.3A.1L.O=B.O+\'px\';B.3c=B.3c.2P()},wV:E(a){B.3A=I.J.fF(a)||B.gA(a);I.J.av(B.3A,\'wJ-W\');if(B.8l){B.mW(B.3A)}B.7q=B.3A.2o(\'2d\')},5V:E(){F B.K},63:E(){F B.O},CV:E(a,b){F B.e1({K:a},b)},CW:E(a,b){F B.e1({O:a},b)},e1:E(a,b){G c;b=b||{};R(G d in a){c=a[d];if(!b.wG){B.bm(d,a[d]);c+=\'px\'}if(!b.CX){B.wE(d,c)}}B.9V();B.mg();B.ba();if(!b.wG){B.2u()}F B},bm:E(a,b){B.3A[a]=b;if(B.2k){B.2k[a]=b}if(B.bp){B.bp[a]=b}B[a]=b;F B},wE:E(a,b){B.3A.1L[a]=b;if(B.2k){B.2k.1L[a]=b}if(B.8k){B.8k.1L[a]=b}F B},bs:E(){F B.3c[0]},ng:E(a){G b=B.7c,1m,ni=1f,9Z=U;B.3c=a;R(G i=0,1d=B.1y.N;i<1d;i++){1m=B.1y[i];1m.1s||1m.3C(ni,9Z)}if(b){b.3C(ni,9Z)}B.nl();B.2u();F B},wD:E(a,b){G c=a,4f=B.3c.2P(0);a=4w(a,99(B.3c));4f[0]=b;4f[3]=b;G d=4w(a,4f);4f[4]+=c.x-d.x;4f[5]+=c.y-d.y;F B.ng(4f)},Ac:E(a){B.wD(1c I.1N(0,0),a);F B},wA:E(a){G b=B.3c.2P(0);b[4]=-a.x;b[5]=-a.y;F B.ng(b)},D3:E(a){F B.wA(1c I.1N(-a.x-B.3c[4],-a.y-B.3c[5]))},7D:E(){F B.3A},cI:E(a){B.g4&&a.a4();a.3I(\'W\',B);a.3C();B.1U(\'1m:nC\',{1q:a});a.1U(\'nC\')},aM:E(a){B.1U(\'1m:5g\',{1q:a});a.1U(\'5g\');2Y a.W},5Q:E(a){a.a5(0,0,B.K,B.O);F B},2o:E(){F B.7q},dR:E(){B.1y.N=0;B.4E=1k;B.57=1k;B.3w=\'\';B.5W=\'\';if(B.dO){B.fS(\'5Z:up\',B.hd);B.6r=1k;B.dO=1f}B.5Q(B.7q);B.1U(\'W:a7\');B.2u();F B},2u:E(){G a=B.7q;B.nM(a,B.1y);F B},nl:E(){G a={},K=B.5V(),O=B.63(),dK=99(B.3c);a.tl=4w({x:0,y:0},dK);a.br=4w({x:K,y:O},dK);a.tr=1c I.1N(a.br.x,a.tl.y);a.bl=1c I.1N(a.tl.x,a.br.y);B.gf=a;F a},nM:E(a,b){B.nl();B.5Q(a);B.1U(\'hl:4I\');if(B.4a){I.J.jR(B,a)}B.kg(a);a.3i();a.23.2W(a,B.3c);B.wx(a,b);a.3f();if(!B.lZ&&B.8l){B.dI(a)}if(B.4a){a.3f()}B.ww(a);if(B.lZ&&B.8l){B.dI(a)}B.1U(\'wv:4I\')},wx:E(a,b){R(G i=0,N=b.N;i<N;++i){b[i]&&b[i].4I(a)}},o1:E(a,b){G c=B[b+\'2e\'];if(c){a.4F=c.4c?c.4c(a,B):c;a.6h(c.2O||0,c.2A||0,B.K,B.O)}c=B[b+\'1u\'];if(c){if(B[b+\'wu\']){a.3i();a.23.2W(a,B.3c)}c.4I(a);B[b+\'wu\']&&a.3f()}},kg:E(a){B.o1(a,\'bS\')},ww:E(a){B.o1(a,\'dC\')},ac:E(){F{1h:B.63()/2,1g:B.5V()/2}},ws:E(a){F B.ad(a,1c I.1N(B.ac().1g,a.3U().y))},wr:E(a){F B.ad(a,1c I.1N(a.3U().x,B.ac().1h))},wq:E(a){G b=B.ac();F B.ad(a,1c I.1N(b.1g,b.1h))},wp:E(a){G b=B.hG();F B.ad(a,b)},wo:E(a){G b=B.hG();B.ad(a,1c I.1N(b.x,a.3U().y));F B},wn:E(a){G b=B.hG();F B.ad(a,1c I.1N(a.3U().x,b.y))},hG:E(){G a=B.ac(),dK=99(B.3c);F 4w({x:a.1g,y:a.1h},dK)},ad:E(a,b){a.bZ(b,\'1G\',\'1G\');B.2u();F B},D4:E(a){F B.c1(a)},1B:E(a){F B.ox(\'1B\',a)},c1:E(a){F B.ox(\'c1\',a)},ox:E(a,b){G c={5J:B.wg(a,b)};f(c,B.wf(a,b));I.J.d1(B,c,b);F c},wg:E(b,c){F B.49().44(E(a){F!a.oB}).4r(E(a){F B.c2(a,b,c)},B)},c2:E(a,b,c){G d;if(!B.4G){d=a.4G;a.4G=1f}G e=a[b](c);if(!B.4G){a.4G=d}F e},wf:E(a,b){G c={};if(B.3w){c.bS=B.3w.1B?B.3w.1B(b):B.3w}if(B.5W){c.dC=B.5W.1B?B.5W.1B(b):B.5W}if(B.4E){c.4E=B.c2(B.4E,a,b)}if(B.57){c.57=B.c2(B.57,a,b)}F c},we:U,3D:E(a,b){a||(a={});G c=[];B.wc(c,a);B.w8(c,a);B.oG(c,\'3w\');B.oI(c,\'4E\',b);B.w7(c,b);B.oG(c,\'5W\');B.oI(c,\'57\',b);c.1o(\'</5e>\');F c.2p(\'\')},wc:E(a,b){if(b.D8){F}a.1o(\'<?md oM="1.0" w2="\',(b.w2||\'D9-8\'),\'" Db="no" ?>\\n\',\'<!m6 5e Dc "-//Dd//vS vP 1.1//EN" \',\'"c9://iN.w3.oY/Dm/vP/1.1/vS/Do.Dq">\\n\')},w8:E(a,b){G c=b.K||B.K,O=b.O||B.O,4f,68=\'68="0 0 \'+B.K+\' \'+B.O+\'" \',2m=I.1H.2m;if(b.68){68=\'68="\'+b.68.x+\' \'+b.68.y+\' \'+b.68.K+\' \'+b.68.O+\'" \'}P{if(B.we){4f=B.3c;68=\'68="\'+26(-4f[4]/4f[0],2m)+\' \'+26(-4f[5]/4f[3],2m)+\' \'+26(B.K/4f[0],2m)+\' \'+26(B.O/4f[3],2m)+\'" \'}}a.1o(\'<5e \',\'vG="c9://iN.w3.oY/Dr/5e" \',\'vG:5x="c9://iN.w3.oY/Ds/5x" \',\'oM="1.1" \',\'K="\',c,\'" \',\'O="\',O,\'" \',68,\'md:Dt="Dv">\\n\',\'<vz>Dx Dz DA.js \',I.oM,\'</vz>\\n\',\'<mY>\\n\',B.vn(),B.vm(),\'</mY>\\n\')},vm:E(){G c=B,3V=[\'3w\',\'5W\'].4r(E(a){G b=c[a];if(b&&b.4c){F b.3D(c,1f)}});F 3V.2p(\'\')},vn:E(){G a=\'\',ce={},2t,2E,1L,ij,pp,4S,2j,db=I.db,5J=B.49();R(G i=0,1d=5J.N;i<1d;i++){2t=5J[i];2E=2t.2E;if(2t.1p.2Z(\'1x\')===-1||ce[2E]||!db[2E]){3t}ce[2E]=U;if(!2t.22){3t}1L=2t.22;R(pp in 1L){ij=1L[pp];R(2j in ij){4S=ij[2j];2E=4S.2E;if(!ce[2E]&&db[2E]){ce[2E]=U}}}}R(G j in ce){a+=[\'\\t\\t@3S-DE {\\n\',\'\\t\\t\\DF-fG: \\\'\',j,\'\\\';\\n\',\'\\t\\t\\DG: 9Q(\\\'\',db[j],\'\\\');\\n\',\'\\t\\t}\\n\'].2p(\'\')}if(a){a=[\'\\t<1L 1p="1x/DH">\',\'<![DI[\\n\',a,\']]>\',\'</1L>\\n\'].2p(\'\')}F a},w7:E(a,b){G c;R(G i=0,5J=B.49(),1d=5J.N;i<1d;i++){c=5J[i];if(c.oB){3t}B.iD(a,c,b)}},iD:E(a,b,c){a.1o(b.3D(c))},oI:E(a,b,c){if(B[b]&&B[b].3D){a.1o(B[b].3D(c))}},oG:E(a,b){G c=B[b];if(!c){F}if(c.4c){G d=c.4p;a.1o(\'<5i 23="3T(\',B.K/2,\',\',B.O/2,\')"\',\' x="\',c.2O-B.K/2,\'" y="\',c.2A-B.O/2,\'" \',\'K="\',(d===\'4p-y\'||d===\'no-4p\'?c.1Y.K:B.K),\'" O="\',(d===\'4p-x\'||d===\'no-4p\'?c.1Y.O:B.O),\'" 1A="9Q(#aB\'+c.id+\')"\',\'></5i>\\n\')}P{a.1o(\'<5i x="0" y="0" \',\'K="\',B.K,\'" O="\',B.O,\'" 1A="\',B[b],\'"\',\'></5i>\\n\')}},iE:E(a){if(!a){F B}G b=B.7c,i,2t,5b;if(a===b){5b=b.1y;R(i=5b.N;i--;){2t=5b[i];6i(B.1y,2t);B.1y.ve(2t)}}P{6i(B.1y,a);B.1y.ve(a)}F B.2u&&B.2u()},iJ:E(a){if(!a){F B}G b=B.7c,i,2t,5b;if(a===b){5b=b.1y;R(i=0;i<5b.N;i++){2t=5b[i];6i(B.1y,2t);B.1y.1o(2t)}}P{6i(B.1y,a);B.1y.1o(a)}F B.2u&&B.2u()},iK:E(a,b){if(!a){F B}G c=B.7c,i,2t,3v,7m,5b;if(a===c){5b=c.1y;R(i=0;i<5b.N;i++){2t=5b[i];3v=B.1y.2Z(2t);if(3v!==0){7m=3v-1;6i(B.1y,2t);B.1y.7M(7m,0,2t)}}}P{3v=B.1y.2Z(a);if(3v!==0){7m=B.vd(a,3v,b);6i(B.1y,a);B.1y.7M(7m,0,a)}}B.2u&&B.2u();F B},vd:E(a,b,c){G d;if(c){d=b;R(G i=b-1;i>=0;--i){G e=a.pR(B.1y[i])||a.al(B.1y[i])||B.1y[i].al(a);if(e){d=i;1P}}}P{d=b-1}F d},iO:E(a,b){if(!a){F B}G c=B.7c,i,2t,3v,7m,5b;if(a===c){5b=c.1y;R(i=5b.N;i--;){2t=5b[i];3v=B.1y.2Z(2t);if(3v!==B.1y.N-1){7m=3v+1;6i(B.1y,2t);B.1y.7M(7m,0,2t)}}}P{3v=B.1y.2Z(a);if(3v!==B.1y.N-1){7m=B.vb(a,3v,b);6i(B.1y,a);B.1y.7M(7m,0,a)}}B.2u&&B.2u();F B},vb:E(a,b,c){G d;if(c){d=b;R(G i=b+1;i<B.1y.N;++i){G e=a.pR(B.1y[i])||a.al(B.1y[i])||B.1y[i].al(a);if(e){d=i;1P}}}P{d=b+1}F d},52:E(a,b){6i(B.1y,a);B.1y.7M(b,0,a);F B.2u&&B.2u()},iQ:E(){B.dR();F B},3s:E(){F\'#<I.3O (\'+B.5l()+\'): \'+\'{ 5J: \'+B.49().N+\' }>\'}});f(I.2F.1i,I.bV);f(I.2F.1i,I.pV);f(I.2F.1i,I.DL);f(I.2F,{DM:\'{"5J": [], "bS": "yi"}\',cr:E(a){G b=I.J.6a();if(!b||!b.2o){F 1k}G c=b.2o(\'2d\');if(!c){F 1k}6R(a){1C\'3d\':F 1j c.3d!==\'1v\';1C\'8Q\':F 1j c.8Q!==\'1v\';1C\'5c\':F 1j b.5c!==\'1v\';1C\'v4\':gm{b.5c(\'4q/iX\',0);F U}kb(e){}F 1f;dL:F 1k}}});I.2F.1i.iY=I.2F.1i.1B})();I.iZ=I.J.1z({29:\'aH(0, 0, 0)\',K:1,2w:1k,55:\'4o\',5y:\'4o\',2K:1k,d3:E(a){B.2w=1c I.6o(a);F B},j3:E(){G a=B.W.3o;a.6t=B.29;a.4d=B.K;a.v3=B.55;a.v2=B.5y;if(B.2K&&I.2F.cr(\'8Q\')){a.8Q(B.2K)}},ar:E(){if(!B.2w){F}G a=B.W.3o,8p=B.W.bs();a.ja=B.2w.29;a.jd=B.2w.5R*8p;a.je=B.2w.2O*8p;a.jj=B.2w.2A*8p},jk:E(){G a=B.W.3o;a.ja=\'\';a.jd=a.je=a.jj=0}});(E(){I.jm=I.J.1z(I.iZ,{2c:E(a){B.W=a;B.7n=[]},cB:E(a){B.v0(a);B.qy(a);B.58()},jw:E(a){B.qy(a);B.W.5Q(B.W.3o);B.58()},jx:E(){B.uZ()},v0:E(a){G p=1c I.1N(a.x,a.y);B.uY();B.qK(p);B.W.3o.52(p.x,p.y)},qK:E(a){B.7n.1o(a)},uY:E(){B.7n.N=0;B.j3();B.ar()},qy:E(a){G b=1c I.1N(a.x,a.y);B.qK(b)},58:E(){G a=B.W.3o,v=B.W.3c,p1=B.7n[0],p2=B.7n[1];a.3i();a.23(v[0],v[1],v[2],v[3],v[4],v[5]);a.3Q();if(B.7n.N===2&&p1.x===p2.x&&p1.y===p2.y){p1.x-=0.5;p2.x+=0.5}a.52(p1.x,p1.y);R(G i=1,1d=B.7n.N;i<1d;i++){G b=p1.nj(p2);a.cP(p1.x,p1.y,b.x,b.y);p1=B.7n[i];p2=B.7n[i+1]}a.41(p1.x,p1.y);a.1D();a.3f()},uX:E(a){G b=[],p1=1c I.1N(a[0].x,a[0].y),p2=1c I.1N(a[1].x,a[1].y);b.1o(\'M \',a[0].x,\' \',a[0].y,\' \');R(G i=1,1d=a.N;i<1d;i++){G c=p1.nj(p2);b.1o(\'Q \',p1.x,\' \',p1.y,\' \',c.x,\' \',c.y,\' \');p1=1c I.1N(a[i].x,a[i].y);if((i+1)<a.N){p2=1c I.1N(a[i+1].x,a[i+1].y)}}b.1o(\'L \',p1.x,\' \',p1.y,\' \');F b},jH:E(a){G b=1c I.6l(a,{1A:1k,1D:B.29,2s:B.K,55:B.55,5y:B.5y,2K:B.2K,1T:\'1G\',2g:\'1G\'});if(B.2w){B.2w.9O=U;b.d3(B.2w)}F b},uZ:E(){G a=B.W.3o;a.5j();G b=B.uX(B.7n).2p(\'\');if(b===\'M 0 0 Q 0 0 0 0 L 0 0\'){B.W.2u();F}G c=B.jH(b);B.W.5F(c);c.3C();B.W.5Q(B.W.3o);B.jk();B.W.2u();B.W.1U(\'1Q:cJ\',{1Q:c})}})})();I.DN=I.J.1z(I.iZ,{K:10,2c:E(a){B.W=a;B.28=[]},kr:E(a){G b=B.uV(a),1O=B.W.3o,v=B.W.3c;1O.3i();1O.23(v[0],v[1],v[2],v[3],v[4],v[5]);1O.4F=b.1A;1O.3Q();1O.cN(b.x,b.y,b.2T,0,1a.4u*2,1f);1O.5j();1O.1A();1O.3f()},cB:E(a){B.28.N=0;B.W.5Q(B.W.3o);B.ar();B.kr(a)},jw:E(a){B.kr(a)},jx:E(){G a=B.W.64;B.W.64=1f;G b=[];R(G i=0,1d=B.28.N;i<1d;i++){G c=B.28[i],9t=1c I.7t({2T:c.2T,1g:c.x,1h:c.y,1T:\'1G\',2g:\'1G\',1A:c.1A});B.2w&&9t.d3(B.2w);b.1o(9t)}G d=1c I.7a(b,{1T:\'1G\',2g:\'1G\'});d.W=B.W;B.W.5F(d);B.W.1U(\'1Q:cJ\',{1Q:d});B.W.5Q(B.W.3o);B.jk();B.W.64=a;B.W.2u()},uV:E(a){G b=1c I.1N(a.x,a.y),uU=I.J.9K(1a.1J(0,B.K-20),B.K+20)/2,uT=1c I.2e(B.29).cM(I.J.9K(0,3h)/3h).i8();b.2T=uU;b.1A=uT;B.28.1o(b);F b}});I.DO=I.J.1z(I.iZ,{K:10,uS:20,k5:1,k6:1,uR:1f,uH:U,2c:E(a){B.W=a;B.cQ=[]},cB:E(a){B.cQ.N=0;B.W.5Q(B.W.3o);B.ar();B.kF(a);B.4I()},jw:E(a){B.kF(a);B.4I()},jx:E(){G a=B.W.64;B.W.64=1f;G b=[];R(G i=0,uG=B.cQ.N;i<uG;i++){G c=B.cQ[i];R(G j=0,4O=c.N;j<4O;j++){G d=1c I.77({K:c[j].K,O:c[j].K,1g:c[j].x+1,1h:c[j].y+1,1T:\'1G\',2g:\'1G\',1A:B.29});B.2w&&d.d3(B.2w);b.1o(d)}}if(B.uH){b=B.uF(b)}G e=1c I.7a(b,{1T:\'1G\',2g:\'1G\'});e.W=B.W;B.W.5F(e);B.W.1U(\'1Q:cJ\',{1Q:e});B.W.5Q(B.W.3o);B.jk();B.W.64=a;B.W.2u()},uF:E(a){G b={},8q;R(G i=0,1d=a.N;i<1d;i++){8q=a[i].1g+\'\'+a[i].1h;if(!b[8q]){b[8q]=a[i]}}G c=[];R(8q in b){c.1o(b[8q])}F c},4I:E(){G a=B.W.3o;a.4F=B.29;G v=B.W.3c;a.3i();a.23(v[0],v[1],v[2],v[3],v[4],v[5]);R(G i=0,1d=B.cR.N;i<1d;i++){G b=B.cR[i];if(1j b.1V!==\'1v\'){a.cS=b.1V}a.6h(b.x,b.y,b.K,b.K)}a.3f()},kF:E(a){B.cR=[];G x,y,K,2T=B.K/2;R(G i=0;i<B.uS;i++){x=I.J.9K(a.x-2T,a.x+2T);y=I.J.9K(a.y-2T,a.y+2T);if(B.k6){K=I.J.9K(1a.1J(1,B.k5-B.k6),B.k5+B.k6)}P{K=B.k5}G b=1c I.1N(x,y);b.K=K;if(B.uR){b.1V=I.J.9K(0,3h)/3h}B.cR.1o(b)}B.cQ.1o(B.cR)}});I.DP=I.J.1z(I.jm,{kM:E(){G a=20,uE=5,cU=I.2X.69(\'W\'),cC=cU.2o(\'2d\');cU.K=cU.O=a+uE;cC.4F=B.29;cC.3Q();cC.cN(a/2,a/2,a/2,0,1a.4u*2,1f);cC.5j();cC.1A();F cU},uC:E(){F cw(B.kM).2M(\'B.29\',\'"\'+B.29+\'"\')},uz:E(){F B.W.3o.xH(B.1Y||B.kM(),\'4p\')},j3:E(){B.1K(\'j3\');B.W.3o.6t=B.uz()},jH:E(a){G b=B.1K(\'jH\',a),kS=b.ga().mX(b.2s/2);b.1D=1c I.ay({1Y:B.1Y||B.uC(),2O:-kS.x,2A:-kS.y});F b}});(E(){G j=I.J.48,4D=I.J.4D,eE=I.J.eE,6Q=1a.6Q,2f=1a.2f,uv=I.2F.cr(\'8Q\'),cY=0.5;I.3O=I.J.1z(I.2F,{2c:E(a,b){b||(b={});B.eh(a,b);B.ut();B.aq()},us:1f,ur:\'6N\',gh:1f,d2:1f,l3:\'ap\',gl:\'6N\',8l:U,4H:U,l7:\'6N\',ug:1k,d5:\'7P(3h, 3h, 2x, 0.3)\',ao:[],la:\'7P(2x, 2x, 2x, 0.3)\',lb:1,8G:\'co\',7A:\'co\',8c:\'dL\',u9:\'u8\',u7:\'u8\',u5:\'W-Ec\',gx:1f,u3:0,u2:1f,dh:1f,lp:1f,lq:0,dj:1k,u1:1f,u0:1f,ut:E(){B.3P=1k;B.5s=1k;B.tZ();B.tY();B.tX();B.9V();B.gI=I.jm&&1c I.jm(B);B.ba()},tW:E(){G a=B.4h(),4s=B.8a(),1m,bY=[],lG=[];if((a||4s)&&!B.lp){R(G i=0,N=B.1y.N;i<N;i++){1m=B.1y[i];if((!a||!a.f7(1m))&&1m!==4s){bY.1o(1m)}P{lG.1o(1m)}}if(a){a.3I(\'1y\',lG);bY.1o(a)}4s&&bY.1o(4s)}P{bY=B.1y}F bY},2u:E(){if(B.lH&&!B.5s&&!B.dh){B.5Q(B.3o);B.lH=1f}G a=B.7q;B.nM(a,B.tW());F B},tT:E(){G a=B.3o;B.5Q(a);if(B.4H&&B.5s){B.tS(a)}B.1U(\'wv:4I\');B.lH=U;F B},gP:E(){G t=B.3P;t.1q.1F({1r:t.6g.1r,1t:t.6g.1t,2L:t.6g.2L,2U:t.6g.2U,1g:t.6g.1g,1h:t.6g.1h});if(B.lM(t.1q)){if(t.3X===\'5t\'){B.gS(t.1q)}P{if(t.1T!==\'1G\'){if(t.1T===\'3H\'){t.bW=-1}P{t.bW=1}}if(t.2g!==\'1G\'){if(t.2g===\'6C\'){t.bT=-1}P{t.bT=1}}t.1T=\'1G\';t.2g=\'1G\'}}P{t.1T=t.6g.1T;t.2g=t.6g.2g}},ab:E(e,a,b){G c=U,5U=b||B.48(e,c),xy;if(a.1s&&a.1s===B.4h()){xy=B.lV(a.1s,5U)}P{xy={x:5U.x,y:5U.y}}F(a.ab(xy)||a.aa(5U))},lV:E(a,b){G m=a.bP(),tP=I.J.99(m),tO=B.m0(b);F I.J.4w(tO,tP)},tN:E(a,x,y){G b=a.bL,7l=a.7l,1O=B.h3,tM=a.bH;a.bL=a.7l=1f;a.bH=\'\';1O.3i();1O.23.2W(1O,B.3c);a.4I(1O);1O.3f();a.3z&&a.a6(1O);a.bL=b;a.7l=7l;a.bH=tM;G c=I.J.sZ(1O,x,y,B.u3);B.5Q(1O);F c},tK:E(e,a){G b=B.4h(),4s=B.8a();F(!a||(a&&b&&!b.f7(a)&&b!==a&&!e[B.l7])||(a&&!a.ma)||(a&&!a.7G&&4s&&4s!==a))},lM:E(a){if(!a){F}G t=B.3P,h9;if(t.3X===\'3k\'||t.3X===\'1r\'||t.3X===\'1t\'){h9=B.gh||a.gh}P if(t.3X===\'5t\'){h9=B.d2||a.d2}F h9?!t.ap:t.ap},tI:E(a,b){G c={x:a.1T,y:a.2g};if(b===\'ml\'||b===\'tl\'||b===\'bl\'){c.x=\'3H\'}P if(b===\'mr\'||b===\'tr\'||b===\'br\'){c.x=\'1g\'}if(b===\'tl\'||b===\'mt\'||b===\'tr\'){c.y=\'6C\'}P if(b===\'bl\'||b===\'mb\'||b===\'br\'){c.y=\'1h\'}F c},tH:E(a,b,e){if(!b){F\'mj\'}6R(b){1C\'7B\':F\'5t\';1C\'ml\':1C\'mr\':F e[B.gl]?\'2U\':\'1r\';1C\'mt\':1C\'mb\':F e[B.gl]?\'2L\':\'1t\';dL:F\'3k\'}},tF:E(e,a){if(!a){F}G b=B.48(e),5o=a.aa(B.48(e,U)),3X=B.tH(a,5o,e),9m=B.tI(a,5o);B.3P={1q:a,3X:3X,5o:5o,1r:a.1r,1t:a.1t,2L:a.2L,2U:a.2U,2O:b.x-a.1g,2A:b.y-a.1h,1T:9m.x,2g:9m.y,ex:b.x,ey:b.y,mu:b.x,mv:b.y,1g:a.1g,1h:a.1h,tE:4D(a.2i),K:a.K*a.1r,bW:1,bT:1,6N:e.6N,ap:e[B.l3]};B.3P.6g={1g:a.1g,1h:a.1h,1r:a.1r,1t:a.1t,2L:a.2L,2U:a.2U,1T:9m.x,2g:9m.y};B.gP()},tD:E(x,y){G a=B.3P,1q=a.1q,my=x-a.2O,mz=y-a.2A,mA=!1q.1Z(\'9f\')&&1q.1g!==my,mC=!1q.1Z(\'9e\')&&1q.1h!==mz;mA&&1q.1F(\'1g\',my);mC&&1q.1F(\'1h\',mz);F mA||mC},tC:E(a,t,b){G c=\'1T\',dX={0:\'1G\'},7j=t.1q.2L,mH=\'1g\',mI=\'3H\',5o=t.5o===\'mt\'||t.5o===\'ml\'?1:-1,dY=1;a=a>0?1:-1;if(b===\'y\'){7j=t.1q.2U;mH=\'1h\';mI=\'6C\';c=\'2g\'}dX[-1]=mH;dX[1]=mI;t.1q.4N&&(dY*=-1);t.1q.56&&(dY*=-1);if(7j===0){t.dZ=-5o*a*dY;t[c]=dX[-a]}P{7j=7j>0?1:-1;t.dZ=7j;t[c]=dX[7j*5o*dY]}},mL:E(x,y,a){G t=B.3P,1q=t.1q,bo=1f,hp=1q.1Z(\'hp\'),hq=1q.1Z(\'hq\');if((hp&&a===\'x\')||(hq&&a===\'y\')){F 1f}G b=1q.3U(),tB=1q.e2(1c I.1N(x,y),\'1G\',\'1G\')[a],tA=1q.e2(1c I.1N(t.mu,t.mv),\'1G\',\'1G\')[a],mS,mU,5h=1q.7w();B.tC(tB-tA,t,a);mS=1q.e2(1c I.1N(x,y),t.1T,t.2g)[a];mU=1q.84(b,t.1T,t.2g);bo=B.tz(mS,t,a,5h);t.mu=x;t.mv=y;1q.bZ(mU,t.1T,t.2g);F bo},tz:E(a,b,c,d){G e=b.1q,83,bo=1f,dZ=b.dZ,n0,hz,b8,9n,b3,hD,2L,2U;if(c===\'x\'){b8=\'y\';9n=\'Y\';b3=\'X\';2L=0;2U=e.2U}P{b8=\'x\';9n=\'X\';b3=\'Y\';2L=e.2L;2U=0}hz=e.7w(2L,2U);hD=2*1a.2f(a)-hz[c];if(hD<=2){83=0}P{83=dZ*1a.tv((hD/e[\'3k\'+b3])/(hz[b8]/e[\'3k\'+9n]));83=I.J.eE(83)}bo=e[\'7j\'+b3]!==83;e.1F(\'7j\'+b3,83);if(e[\'7j\'+9n]!==0){n0=e.7w();83=(d[b8]/n0[b8])*e[\'3k\'+9n];e.1F(\'3k\'+9n,83)}F bo},ec:E(x,y,a){G t=B.3P,1q=t.1q,b0=1q.1Z(\'b0\'),9S=1q.1Z(\'9S\'),ef=1q.1Z(\'ef\');if(b0&&9S){F 1f}G b=1q.84(1q.3U(),t.1T,t.2g),nc=1q.e2(1c I.1N(x,y),t.1T,t.2g),5h=1q.7w(),4Z=1f;B.tu(nc,t);4Z=B.hK(nc,t,b0,9S,a,ef,5h);1q.bZ(b,t.1T,t.2g);F 4Z},hK:E(a,b,c,d,e,f,g){G h=b.1q,aV=1f,aU=1f,4Z=1f,hN,hO,1r,1t;1r=a.x*h.1r/g.x;1t=a.y*h.1t/g.y;hN=h.1r!==1r;hO=h.1t!==1t;if(f&&1r<=0&&1r<h.1r){aV=U}if(f&&1t<=0&&1t<h.1t){aU=U}if(e===\'tt\'&&!c&&!d){aV||aU||(4Z=B.tq(a,h,b,g))}P if(!e){aV||c||(h.1F(\'1r\',1r)&&(4Z=4Z||hN));aU||d||(h.1F(\'1t\',1t)&&(4Z=4Z||hO))}P if(e===\'x\'&&!h.1Z(\'9R\')){aV||c||(h.1F(\'1r\',1r)&&(4Z=4Z||hN))}P if(e===\'y\'&&!h.1Z(\'9R\')){aU||d||(h.1F(\'1t\',1t)&&(4Z=4Z||hO))}b.ek=1r;b.en=1t;aV||aU||B.tp(b,e);F 4Z},tq:E(a,b,c,d){G e=a.y+a.x,ns=d.y*c.6g.1t/b.1t+d.x*c.6g.1r/b.1r,4Z;c.ek=c.6g.1r*e/ns;c.en=c.6g.1t*e/ns;4Z=c.ek!==b.1r||c.en!==b.1t;b.1F(\'1r\',c.ek);b.1F(\'1t\',c.en);F 4Z},tp:E(a,b){if(a.ek<0&&b!==\'y\'){if(a.1T===\'1g\'){a.1T=\'3H\'}P if(a.1T===\'3H\'){a.1T=\'1g\'}}if(a.en<0&&b!==\'x\'){if(a.2g===\'1h\'){a.2g=\'6C\'}P if(a.2g===\'6C\'){a.2g=\'1h\'}}},tu:E(a,t){G b=t.1q,8p=B.bs(),7u=b.7u/8p;if(t.1T===\'3H\'){a.x*=-1}P if(t.1T===\'1G\'){a.x*=t.bW*2;if(a.x<0){t.bW=-t.bW}}if(t.2g===\'6C\'){a.y*=-1}P if(t.2g===\'1G\'){a.y*=t.bT*2;if(a.y<0){t.bT=-t.bT}}if(2f(a.x)>7u){if(a.x<0){a.x+=7u}P{a.x-=7u}}P{a.x=0}if(2f(a.y)>7u){if(a.y<0){a.y+=7u}P{a.y-=7u}}P{a.y=0}},tm:E(x,y){G t=B.3P;if(t.1q.1Z(\'hU\')){F 1f}G a=6Q(t.ey-t.1h,t.ex-t.1g),tj=6Q(y-t.1h,x-t.1g),2i=eE(tj-a+t.tE),ny=U;if(2i<0){2i=6O+2i}2i%=6O;if(t.1q.lq>0){G b=t.1q.lq,dj=t.1q.dj||b,nz=1a.6M(2i/b)*b,nA=1a.4e(2i/b)*b;if(1a.2f(2i-nA)<dj){2i=nA}P if(1a.2f(2i-nz)<dj){2i=nz}if(t.1q.2i===2i){ny=1f}}t.1q.2i=2i;F ny},81:E(a){B.2k.1L.er=a},Eh:E(a){a.1r=1;a.1t=1;a.2L=0;a.2U=0;a.cA(0)},tS:E(a){G b=B.5s,1g=b.1g,1h=b.1h,7Z=2f(1g),7Y=2f(1h);if(B.d5){a.4F=B.d5;a.6h(b.ex-((1g>0)?0:-1g),b.ey-((1h>0)?0:-1h),7Z,7Y)}if(!B.lb||!B.la){F}a.4d=B.lb;a.6t=B.la;if(B.ao.N>1&&!uv){G c=b.ex+cY-((1g>0)?0:7Z),py=b.ey+cY-((1h>0)?0:7Y);a.3Q();I.J.4L(a,c,py,c+7Z,py,B.ao);I.J.4L(a,c,py+7Y-1,c+7Z,py+7Y-1,B.ao);I.J.4L(a,c,py,c,py+7Y,B.ao);I.J.4L(a,c+7Z-1,py,c+7Z-1,py+7Y,B.ao);a.5j();a.1D()}P{I.1H.1i.9N.1W(B,a,B.ao);a.i0(b.ex+cY-((1g>0)?0:7Z),b.ey+cY-((1h>0)?0:7Y),7Z,7Y)}},9M:E(e,a){if(B.u2){F}G b=U,5U=B.48(e,b),7X=B.4h(),4s=B.8a(),ez;if(7X&&!a&&7X===B.eA([7X],5U)){B.eB(7X,e);F 7X}if(4s&&4s.aa(5U)){B.eB(4s,e);F 4s}if(4s&&4s===B.eA([4s],5U)){if(!B.lp){B.eB(4s,e);F 4s}P{ez=4s}}B.9L=[];G c=B.eA(B.1y,5U);if(e[B.ug]&&c&&ez&&c!==ez){c=ez}B.eB(c,e);F c},eB:E(a,e){if(a){if(B.5L!==a){if(B.5L){B.1U(\'5Z:nO\',{1q:B.5L,e:e});B.5L.1U(\'eD\')}B.1U(\'5Z:nP\',{1q:a,e:e});a.1U(\'Ei\');B.5L=a}}P if(B.5L){B.1U(\'5Z:nO\',{1q:B.5L,e:e});B.5L.1U(\'eD\');B.5L=1k}},te:E(a,b){if(b&&b.4X&&b.ma&&B.ab(1k,b,a)){if((B.gx||b.gx)&&!b.4y){G c=B.tN(b,a.x,a.y);if(!c){F U}}P{F U}}},eA:E(a,b){G c,i=a.N,nT,ic;31(i--){if(B.te(b,a[i])){c=a[i];if(c.1p===\'1s\'&&c.t4){nT=B.lV(c,b);ic=B.eA(c.1y,nT);ic&&B.9L.1o(ic)}1P}}F c},m0:E(a){F I.J.4w(a,I.J.99(B.3c))},48:E(e,a,b){if(!b){b=B.2k}G c=j(e),2q=b.nB(),eH=2q.K||0,eI=2q.O||0,eJ;if(!eH||!eI){if(\'1h\'in 2q&&\'6C\'in 2q){eI=1a.2f(2q.1h-2q.6C)}if(\'3H\'in 2q&&\'1g\'in 2q){eH=1a.2f(2q.3H-2q.1g)}}B.ba();c.x=c.x-B.e6.1g;c.y=c.y-B.e6.1h;if(!a){c=B.m0(c)}if(eH===0||eI===0){eJ={K:1,O:1}}P{eJ={K:b.K/eH,O:b.O/eI}}F{x:c.x*eJ.K,y:c.y*eJ.O}},tY:E(){G a=B.3A.fL.2M(/\\s*wJ-W\\s*/,\'\');B.2k=B.gA();I.J.av(B.2k,\'Ep-W \'+a);B.8k.9j(B.2k);B.sY(B.3A,B.2k);B.mW(B.2k);B.3o=B.2k.2o(\'2d\')},aq:E(){B.bp=B.gA();B.bp.5H(\'K\',B.K);B.bp.5H(\'O\',B.O);B.h3=B.bp.2o(\'2d\')},tZ:E(){B.8k=I.J.fO(B.3A,\'kq\',{\'m2\':B.u5});I.J.eS(B.8k,{K:B.5V()+\'px\',O:B.63()+\'px\',9U:\'Eq\'});I.J.eZ(B.8k)},mW:E(a){G b=B.5V()||a.K,O=B.63()||a.O;I.J.eS(a,{9U:\'sW\',K:b+\'px\',O:O+\'px\',1g:0,1h:0,\'Et-3X\':\'4n\'});a.K=b;a.O=O;I.J.eZ(a)},sY:E(a,b){b.1L.hy=a.1L.hy},Ev:E(){F B.3o},ED:E(){F B.2k},sS:E(a){G b=B.5K;if(b){b.1F(\'3z\',1f);if(a!==b&&b.9H&&1j b.9H===\'E\'){b.9H()}}B.5K=a;a.1F(\'3z\',U)},eQ:E(a,e){G b=B.8a();if(b&&b!==a){b.1U(\'oa\',{e:e})}B.sS(a);B.2u();B.1U(\'1m:7e\',{1q:a,e:e});a.1U(\'7e\',{e:e});F B},8a:E(){F B.5K},aM:E(a){if(B.8a()===a){B.1U(\'hl:4H:a7\',{1q:a});B.iu();B.1U(\'4H:a7\',{1q:a});a.1U(\'oa\')}if(B.5L===a){B.5L=1k}B.1K(\'aM\',a)},iu:E(){G a=B.5K;if(a){a.1F(\'3z\',1f);if(a.9H&&1j a.9H===\'E\'){a.9H()}}B.5K=1k},iv:E(e){G a=B.5K;if(a){B.1U(\'hl:4H:a7\',{1q:a,e:e});B.iu();B.1U(\'4H:a7\',{e:e});a.1U(\'oa\',{e:e})}F B},sR:E(a){B.7c=a;if(a){a.1F(\'3z\',U)}},ix:E(a,e){B.sR(a);if(a){B.1U(\'1m:7e\',{1q:a,e:e});a.1U(\'7e\',{e:e})}F B},4h:E(){F B.7c},oh:E(){G g=B.4h();if(g){g.sP()}B.ix(1k)},iy:E(e){G g=B.4h();if(g){B.1U(\'hl:4H:a7\',{e:e,1q:g});B.oh();B.1U(\'4H:a7\',{e:e})}F B},ok:E(){G a=B.49(),i=0,1d=a.N,2t;R(;i<1d;i++){2t=a[i];2t&&2t.1F(\'3z\',1f)}B.oh();B.iu();F B},sM:E(e){B.iy(e);B.iv(e);B.ok();F B},iQ:E(){B.1K(\'iQ\');G a=B.8k;B.sL();a.oo(B.2k);a.oo(B.3A);2Y B.2k;if(a.4K){a.4K.mx(B.3A,B.8k)}2Y B.8k;F B},dR:E(){B.iy();B.iv();B.5Q(B.3o);F B.1K(\'dR\')},dI:E(a){G b=B.4h();if(b){b.a6(a)}P{B.sK(a)}},sK:E(a){R(G i=0,1d=B.1y.N;i<1d;++i){if(!B.1y[i]||!B.1y[i].3z){3t}B.1y[i].a6(a)}},c2:E(a,b,c){G d=B.oq(a),1m=B.1K(\'c2\',a,b,c);B.or(a,d);F 1m},oq:E(b){G c=[\'2i\',\'4N\',\'56\',\'O\',\'1g\',\'1r\',\'1t\',\'1h\',\'K\'];if(b.1s&&b.1s===B.4h()){G d={};c.4j(E(a){d[a]=b[a]});B.4h().os(b);F d}P{F 1k}},or:E(a,b){if(b){a.1F(b)}},iD:E(a,b,c){G d;d=B.oq(b);B.1K(\'iD\',a,b,c);B.or(b,d)},});R(G k in I.2F){if(k!==\'1i\'){I.3O[k]=I.2F[k]}}if(I.vT){I.3O.1i.iA=E(){}}I.lv=I.3O})();(E(){G f={mt:0,tr:1,mr:2,br:3,mb:4,bl:5,ml:6,tl:7},2V=I.J.2V,3B=I.J.3B;I.J.1m.1n(I.3O.1i,{sJ:[\'n-7C\',\'ne-7C\',\'e-7C\',\'se-7C\',\'s-7C\',\'sw-7C\',\'w-7C\',\'nw-7C\'],tX:E(){B.sD();2V(I.4i,\'7C\',B.eW);2V(B.2k,\'cu\',B.7V);2V(B.2k,\'cn\',B.5u);2V(B.2k,\'eD\',B.f1);2V(B.2k,\'sC\',B.f2);2V(B.2k,\'oK\',B.f3);2V(B.2k,\'sB\',B.f4);2V(B.2k,\'oN\',B.7V,{f5:1f});2V(B.2k,\'cl\',B.5u,{f5:1f});if(1j 5S!==\'1v\'&&\'5F\'in 5S){5S.5F(B.2k,\'sv\',B.f8);5S.5F(B.2k,\'mj\',B.f9);5S.5F(B.2k,\'st\',B.fa);5S.5F(B.2k,\'ss\',B.fc);5S.5F(B.2k,\'sr\',B.fd)}},sD:E(){B.7V=B.7V.3l(B);B.5u=B.5u.3l(B);B.9D=B.9D.3l(B);B.eW=B.eW.3l(B);B.f8=B.f8.3l(B);B.f9=B.f9.3l(B);B.fc=B.fc.3l(B);B.fd=B.fd.3l(B);B.fa=B.fa.3l(B);B.f3=B.f3.3l(B);B.f1=B.f1.3l(B);B.f2=B.f2.3l(B);B.f4=B.f4.3l(B)},sL:E(){3B(I.4i,\'7C\',B.eW);3B(B.2k,\'cu\',B.7V);3B(B.2k,\'cn\',B.5u);3B(B.2k,\'eD\',B.f1);3B(B.2k,\'sC\',B.f2);3B(B.2k,\'oK\',B.f3);3B(B.2k,\'sB\',B.f4);3B(B.2k,\'oN\',B.7V);3B(B.2k,\'cl\',B.5u);if(1j 5S!==\'1v\'&&\'74\'in 5S){5S.74(B.2k,\'sv\',B.f8);5S.74(B.2k,\'mj\',B.f9);5S.74(B.2k,\'st\',B.fa);5S.74(B.2k,\'ss\',B.fc);5S.74(B.2k,\'sr\',B.fd)}},f8:E(e,a){B.sq&&B.sq(e,a)},f9:E(e,a){B.so&&B.so(e,a)},f3:E(e){B.sn(e)},f1:E(e){G a=B.5L;B.1U(\'5Z:nO\',{1q:a,e:e});B.5L=1k;a&&a.1U(\'eD\',{e:e})},f2:E(e){if(!B.9M(e)){B.1U(\'5Z:nP\',{1q:1k,e:e});B.5L=1k}},fa:E(e,a){B.sm&&B.sm(e,a)},fc:E(e,a){B.sl&&B.sl(e,a)},fd:E(e,a){B.sk&&B.sk(e,a)},f4:E(e){if(B.u1){e.j9();e.7R()}F 1f},7V:E(e){B.sj(e);2V(I.2X,\'hL\',B.9D,{f5:1f});2V(I.2X,\'cl\',B.5u,{f5:1f});3B(B.2k,\'cn\',B.5u);3B(B.2k,\'cl\',B.5u);if(e.1p===\'oN\'){3B(B.2k,\'cu\',B.7V)}P{2V(I.2X,\'pa\',B.9D);2V(I.2X,\'cn\',B.5u)}},9D:E(e){B.si(e);3B(I.2X,\'pa\',B.9D);3B(I.2X,\'hL\',B.9D);3B(I.2X,\'cn\',B.5u);3B(I.2X,\'cl\',B.5u);2V(B.2k,\'cn\',B.5u);2V(B.2k,\'cl\',B.5u,{f5:1f});if(e.1p===\'hL\'){G a=B;ft(E(){2V(a.2k,\'cu\',a.7V)},A2)}},5u:E(e){!B.x4&&e.7R&&e.7R();B.sg(e)},eW:E(){B.ba()},pe:E(a,b){G c=B.4h()||B.8a();if(c&&c.4y&&a===c){F 1f}F!!((a&&(a.9A||a!==c))||(!a&&!!c)||(!a&&!c&&!B.5s)||(b&&B.jf&&B.4H&&(b.x!==B.jf.x||b.y!==B.jf.y)))},si:E(e){G a,ph=U,23=B.3P,jg=B.5s,jh=(!jg||(jg.1g===0&&jg.1h===0));if(B.dh&&B.ji){B.sf(e);F}if(23){B.sb();ph=!23.5p}a=ph?B.9M(e,U):23.1q;G b=B.pe(a,B.48(e));if(a||!jh){B.s8(e)}P{B.5s=1k;B.3P=1k}if(a){a.9A=1f}B.s7(e,a,\'up\');a&&(a.fp=0);b&&B.2u()},s7:E(e,a,b){B.iA(e,a);B.7Q(e,b,a?a:1k)},7Q:E(e,a,b){G c=1j b===\'1v\'?B.9M(e):b,9L=B.9L||[],3u={e:e,1q:c,ER:9L};B.1U(\'5Z:\'+a,3u);c&&c.1U(\'5Z\'+a,3u);R(G i=0;i<9L.N;i++){9L[i].1U(\'5Z\'+a,3u)}},sb:E(){G a=B.3P,1q=a.1q;if(1q.s5){1q.s5=1f}1q.3C();B.s4(1q);if(a.5p||(B.g4&&1q.jq())){B.1U(\'1m:jr\',{1q:1q});1q.1U(\'jr\')}},s4:E(a){if(B.8y&&B.8x){G b=a.84(a.3U(),B.8y,B.8x);a.1T=B.8y;a.2g=B.8x;a.1g=b.x;a.1h=b.y;B.8y=1k;B.8x=1k}},s3:E(e){B.ji=U;B.iv(e).2u();if(B.4a){I.J.jR(B,B.3o)}G a=B.48(e);B.gI.cB(a);B.7Q(e,\'pF\')},rX:E(e){if(B.ji){G a=B.48(e);B.gI.jw(a)}B.81(B.u9);B.7Q(e,\'co\')},sf:E(e){B.ji=1f;if(B.4a){B.3o.3f()}B.gI.jx();B.7Q(e,\'up\')},sj:E(e){G a=B.9M(e);G b=\'rW\'in e?e.rW===3:e.F4===2;if(b){if(B.u0){B.7Q(e,\'pF\',a?a:1k)}F}if(B.dh){B.s3(e);F}if(B.3P){F}G c=B.48(e,U);B.jf=c;G d=B.pe(a,c),pI=B.rT(e,a);if(B.tK(e,a)){B.rR(e,a,c)}P if(pI){B.rQ(e,a);a=B.4h()}if(a){if(a.7G&&(a.fp||!pI)){B.rO(e,a);B.tF(e,a)}if(a!==B.4h()&&a!==B.8a()){B.ok();a.7G&&B.eQ(a,e)}}B.7Q(e,\'pF\',a?a:1k);d&&B.2u()},rO:E(e,a){B.g4&&a.b9();if(a.aa(B.48(e))){B.wY(a)}},rR:E(e,a,b){B.sM(e);if(a&&a.7G){B.eQ(a,e)}P if(B.4H){B.5s={ex:b.x,ey:b.y,1h:0,1g:0}}},gS:E(a){B.8y=B.3P.1q.1T;B.8x=B.3P.1q.2g;G b=a.3U();a.1T=\'1G\';a.2g=\'1G\';a.1g=b.x;a.1h=b.y;B.3P.1g=a.1g;B.3P.1h=a.1h},F7:E(a){G b=a.84(a.3U(),B.8y,B.8x);a.1T=B.8y;a.2g=B.8x;a.1g=b.x;a.1h=b.y;B.8y=1k;B.8x=1k},sg:E(e){G a,5U;if(B.dh){B.rX(e);F}if(1j e.qo!==\'1v\'&&e.qo.N>1){F}G b=B.5s;if(b){5U=B.48(e,U);b.1g=5U.x-b.ex;b.1h=5U.y-b.ey;B.tT()}P if(!B.3P){a=B.9M(e);B.iA(e,a)}P{B.rL(e)}B.7Q(e,\'co\',a?a:1k)},sn:E(e){B.7Q(e,\'oK\')},rL:E(e){G a=B.48(e),23=B.3P;23.pP=1f;23.1q.9A=U;23.6N=e.6N;23.ap=e[B.l3];B.rH(e,23);B.rG(e,23,a);23.5p&&B.2u()},rG:E(e,a,b){G x=b.x,y=b.y,1q=a.1q,3X=a.3X,5p=1f;if(3X===\'5t\'){(5p=B.tm(x,y))&&B.8W(\'F9\',1q,e)}P if(3X===\'3k\'){(5p=B.rC(e,a,x,y))&&B.8W(\'8R\',1q,e)}P if(3X===\'1r\'){(5p=B.ec(x,y,\'x\'))&&B.8W(\'8R\',1q,e)}P if(3X===\'1t\'){(5p=B.ec(x,y,\'y\'))&&B.8W(\'8R\',1q,e)}P if(3X===\'2L\'){(5p=B.mL(x,y,\'x\'))&&B.8W(\'rB\',1q,e)}P if(3X===\'2U\'){(5p=B.mL(x,y,\'y\'))&&B.8W(\'rB\',1q,e)}P{5p=B.tD(x,y);if(5p){B.8W(\'Fb\',1q,e);B.81(1q.7A||B.7A)}}a.5p=a.5p||5p},8W:E(a,b,e){B.1U(\'1m:\'+a,{1q:b,e:e});b.1U(a,{e:e})},rH:E(e,a){if(a.3X===\'3k\'||a.3X===\'1r\'||a.3X===\'1t\'){G b=B.lM(a.1q);if((b&&(a.1T!==\'1G\'||a.2g!==\'1G\'))||(!b&&a.1T===\'1G\'&&a.2g===\'1G\')){B.gP();a.pP=U}}},rC:E(e,a,x,y){if((e[B.ur]||B.us)&&!a.1q.1Z(\'9R\')){a.pX=\'3k\';F B.ec(x,y)}P{if(!a.pP&&a.pX===\'3k\'){B.gP()}a.pX=\'Fh\';F B.ec(x,y,\'tt\')}},iA:E(e,a){if(!a||!a.7G){B.81(B.8c);F 1f}G b=a.8G||B.8G,7X=B.4h(),5o=a.aa&&(!7X||!7X.f7(a))&&a.aa(B.48(e,U));if(!5o){B.81(b)}P{B.rs(5o,a,e)}F U},rs:E(a,b,e){if(a in f){B.81(B.rr(a,b,e))}P if(a===\'7B\'&&b.8E){B.81(B.u7)}P{B.81(B.8c);F 1f}},rr:E(a,b,e){G n=1a.4o((b.jJ()%6O)/45);if(n<0){n+=8}n+=f[a];if(e[B.gl]&&f[a]%2===0){n+=2}n%=8;F B.sJ[n]}})})();(E(){G c=1a.2n,1J=1a.1J;I.J.1m.1n(I.3O.1i,{rT:E(e,a){G b=B.8a();F e[B.l7]&&a&&a.7G&&(B.4h()||(b&&b!==a))&&B.4H},rQ:E(e,a){G b=B.4h();if(a===b){a=B.9M(e,U);if(!a){F}}if(b){B.rp(a,e)}P{B.ro(a,e)}if(B.7c){B.7c.jM()}},rp:E(a,e){G b=B.4h();if(b.f7(a)){b.rn(a);a.1F(\'3z\',1f);if(b.9B()===1){B.iy(e);B.eQ(b.jp(0));F}}P{b.jO(a)}B.1U(\'4H:cJ\',{1q:b,e:e});b.1F(\'3z\',U)},ro:E(a,e){if(B.5K&&a!==B.5K){G b=B.rm(a);b.jO();B.ix(b);B.5K=1k;B.1U(\'4H:cJ\',{1q:b,e:e})}a.1F(\'3z\',U)},rm:E(a){G b=B.49(),rl=b.2Z(B.5K)<b.2Z(a),rk=rl?[B.5K,a]:[a,B.5K];B.5K.4y&&B.5K.aA();F 1c I.7a(rk,{W:B})},rj:E(e){G a=B.ri();if(a.N===1){B.eQ(a[0],e)}P if(a.N>1){a=1c I.7a(a.Fn(),{W:B});a.jO();B.ix(a,e);a.jM();B.1U(\'4H:cJ\',{1q:a});B.2u()}},ri:E(){G a=[],73,x1=B.5s.ex,y1=B.5s.ey,x2=x1+B.5s.1g,y2=y1+B.5s.1h,jV=1c I.1N(c(x1,x2),c(y1,y2)),jW=1c I.1N(1J(x1,x2),1J(y1,y2)),jh=x1===x2&&y1===y2;R(G i=B.1y.N;i--;){73=B.1y[i];if(!73||!73.7G||!73.4X){3t}if(73.rg(jV,jW)||73.rf(jV,jW)||73.ab(jV)||73.ab(jW)){73.1F(\'3z\',U);a.1o(73);if(jh){1P}}}F a},s8:E(e){if(B.4H&&B.5s){B.rj(e)}G a=B.4h();if(a){a.rd().3C();a.9A=1f;B.81(B.8c)}B.5s=1k;B.3P=1k}})})();(E(){G g=I.2F.cr(\'v4\');I.J.1m.1n(I.2F.1i,{5c:E(a){a||(a={});G b=a.fR||\'rc\',k1=a.k1||1,cc=a.cc||1,rb={1g:a.1g||0,1h:a.1h||0,K:a.K||0,O:a.O||0,};F B.r9(b,k1,rb,cc)},r9:E(a,b,c,d){G e=B.5V(),qp=B.63(),qq=(c.K||B.5V())*d,qr=(c.O||B.63())*d,8p=B.bs(),qs=8p*d,vp=B.3c,cO=(vp[4]-c.1g)*d,cT=(vp[5]-c.1h)*d,r8=[qs,0,0,qs,cO,cT],qv=B.8l;B.3c=r8;B.8l&&(B.8l=1f);if(e!==qq||qp!==qr){B.e1({K:qq,O:qr})}P{B.2u()}G f=B.r7(a,b,c);qv&&(B.8l=qv);B.3c=vp;B.e1({K:e,O:qp});F f},r7:E(a,b){G c=B.7q.W;if(a===\'r6\'){a=\'iX\'}G d=g?c.5c(\'4q/\'+a,b):c.5c(\'4q/\'+a);F d},r5:E(a,b,c){F B.5c({fR:a,cc:b,k1:c})},})})();I.J.1m.1n(I.2F.1i,{Fo:E(a,b,c){F B.qA(a,b,c)},qA:E(a,b,c){if(!a){F}G d=(1j a===\'2N\')?r3.gg(a):I.J.1m.3m(a);B.dR();G e=B;B.r0(d.5J,E(){e.qY(d,E(){2Y d.5J;2Y d.4E;2Y d.57;2Y d.bS;2Y d.dC;e.iH(d);b&&b()})},c);F B},qY:E(a,b){G c=B,7k={3w:1f,5W:1f,4E:1f,57:1f};if(!a.4E&&!a.57&&!a.bS&&!a.dC){b&&b();F}G d=E(){if(7k.4E&&7k.57&&7k.3w&&7k.5W){c.2u();b&&b()}};B.fZ(\'4E\',a.4E,7k,d);B.fZ(\'57\',a.57,7k,d);B.fZ(\'3w\',a.bS,7k,d);B.fZ(\'5W\',a.dC,7k,d)},fZ:E(b,c,d,e){G f=B;if(!c){d[b]=U;e&&e();F}if(b===\'4E\'||b===\'57\'){I.J.c5([c],E(a){f[b]=a[0];d[b]=U;e&&e()})}P{B[\'1F\'+I.J.2N.8X(b,U)](c,E(){d[b]=U;e&&e()})}},r0:E(d,e,f){G g=B;if(!d||d.N===0){e&&e();F}G h=B.64;B.64=1f;I.J.c5(d,E(c){c.4j(E(a,b){g.qT(a,b)});g.64=h;e&&e()},1k,f)},Fp:E(b,c){B.3m(E(a){c(a.5c(b))})},Fu:E(b,c,d){B.3m(E(a){d(a.r5(b,c))})},3m:E(b,c){G d=r3.Fw(B.iY(c));B.qQ(E(a){a.qA(d,E(){b&&b(a)})})},qQ:E(a){G b=I.2X.69(\'W\');b.K=B.5V();b.O=B.63();G c=1c I.3O(b);c.4a=B.4a;if(B.4E){c.mp(B.4E.3F,E(){c.2u();a&&a(c)});c.yw=B.yw;c.qO=B.qO}P{a&&a(c)}}});(E(j){\'2z 2H\';G k=j.I||(j.I={}),1n=k.J.1m.1n,3m=k.J.1m.3m,26=k.J.26,8X=k.J.2N.8X,4D=k.J.4D,kd=k.2F.cr(\'8Q\'),7I=!k.7d;if(k.1H){F}k.1H=k.J.1z(k.nq,{1p:\'1m\',1T:\'1g\',2g:\'1h\',1h:0,1g:0,K:0,O:0,1r:1,1t:1,4N:1f,56:1f,1V:1,2i:0,2L:0,2U:0,kf:13,7l:U,8G:1k,7A:1k,7u:0,92:\'7P(qI,qH,2x,0.75)\',qG:1k,qS:\'7P(qI,qH,2x,0.5)\',qF:1k,qU:\'5i\',qV:1k,gh:1f,d2:U,1A:\'aH(0,0,0)\',8H:\'Fs\',9p:\'1Y-nP\',3w:\'\',bH:\'\',1D:1k,2s:1,2K:1k,55:\'qD\',5y:\'qZ\',6W:10,2w:1k,qC:0.4,k9:1,4l:1k,fW:0.kV,7G:U,ma:U,4X:U,6D:U,bL:U,8E:U,fV:40,gx:1f,4G:U,4a:1k,9f:1f,9e:1f,hU:1f,b0:1f,9S:1f,9R:1f,hp:1f,hq:1f,ef:1f,oB:1f,7I:7I,bQ:1f,qu:U,6b:1f,ra:1f,5q:(\'1h 1g K O 1r 1t 4N 56 1T 2g 4l \'+\'1D 2s 2K 55 5y 6W \'+\'2i 1V 1A 8H 9p 2w 4a 4X 3w \'+\'2L 2U\').2S(\' \'),4g:(\'1A 1D 2s 2K K O 1D 2s 2K\'+\' 55 5y 6W 8H 3w\').2S(\' \'),2c:E(a){a=a||{};if(a){B.7g(a)}if(B.7I){B.aq();B.a4({7y:\'4g\'})}},aq:E(){B.cf=k.2X.69(\'W\');B.8A=B.cf.2o(\'2d\');B.qg()},jT:E(){G a=B.W&&B.W.bs()||1,qc=B.ax(),5h=B.89(),q8=B.W&&B.W.bb()?k.5a:1,79=qc.1r*a*q8,6S=qc.1t*a*q8,K=5h.x*79,O=5h.y*6S;F{K:1a.6M(K)+2,O:1a.6M(O)+2,79:79,6S:6S}},qg:E(){if(B.qu&&B.W&&B.W.3P){G a=B.W.3P.3X;if(a.2P(0,5)===\'3k\'){F 1f}}G b=B.jT(),K=b.K,O=b.O,79=b.79,6S=b.6S;if(K!==B.jL||O!==B.jK){B.cf.K=K;B.cf.O=O;B.8A.3T(K/2,O/2);B.8A.3k(79,6S);B.jL=K;B.jK=O;B.79=79;B.6S=6S;F U}F 1f},7g:E(a){B.iH(a);B.iG(a.1A,\'1A\');B.iG(a.1D,\'1D\');B.qW(a);B.it(a.1A,\'1A\');B.it(a.1D,\'1D\')},23:E(a,b){if(B.1s&&!B.1s.q2&&B.1s===B.W.7c){B.1s.23(a)}G c=b?B.ga():B.3U();a.3T(c.x,c.y);B.2i&&a.5t(4D(B.2i));a.3k(B.1r*(B.4N?-1:1),B.1t*(B.56?-1:1));B.2L&&a.23(1,0,1a.cD(4D(B.2L)),1,0,0);B.2U&&a.23(1,1a.cD(4D(B.2U)),0,1,0,0)},1B:E(a){G b=k.1H.2m,1m={1p:B.1p,1T:B.1T,2g:B.2g,1g:26(B.1g,b),1h:26(B.1h,b),K:26(B.K,b),O:26(B.O,b),1A:(B.1A&&B.1A.1B)?B.1A.1B():B.1A,1D:(B.1D&&B.1D.1B)?B.1D.1B():B.1D,2s:26(B.2s,b),2K:B.2K?B.2K.2v():B.2K,55:B.55,5y:B.5y,6W:26(B.6W,b),1r:26(B.1r,b),1t:26(B.1t,b),2i:26(B.jJ(),b),4N:B.4N,56:B.56,1V:26(B.1V,b),2w:(B.2w&&B.2w.1B)?B.2w.1B():B.2w,4X:B.4X,4a:B.4a&&cw(B.4a),3w:B.3w,8H:B.8H,9p:B.9p,4l:B.4l?B.4l.2v():1k,2L:26(B.2L,b),2U:26(B.2U,b)};k.J.d1(B,1m,a);if(!B.4G){1m=B.rq(1m)}F 1m},c1:E(a){F B.1B(a)},rq:E(c){G d=k.J.nR(c.1p).1i,5q=d.5q;5q.4j(E(a){if(c[a]===d[a]){2Y c[a]}G b=1H.1i.3s.1W(c[a])===\'[1m 3g]\'&&1H.1i.3s.1W(d[a])===\'[1m 3g]\';if(b&&c[a].N===0&&d[a].N===0){2Y c[a]}});F c},3s:E(){F\'#<I.\'+8X(B.1p)+\'>\'},ax:E(){G a=B.1r,1t=B.1t;if(B.1s){G b=B.1s.ax();a*=b.1r;1t*=b.1t}F{1r:a,1t:1t}},3I:E(a,b){G c=(a===\'1r\'||a===\'1t\');if(c){b=B.q0(b)}if(a===\'1r\'&&b<0){B.4N=!B.4N;b*=-1}P if(a===\'1t\'&&b<0){B.56=!B.56;b*=-1}P if(a===\'2w\'&&b&&!(b 5D k.6o)){b=1c k.6o(b)}P if(a===\'6b\'&&B.1s){B.1s.1F(\'6b\',b)}B[a]=b;if(B.4g.2Z(a)>-1){if(B.1s){B.1s.1F(\'6b\',U)}B.6b=U}if(a===\'K\'||a===\'O\'){B.fW=1a.2n(0.1,1/1a.1J(B.K,B.O))}F B},pZ:E(){},d4:E(a){B.6p=a;F B},jG:E(){if(B.W&&B.W.3c){F B.W.3c}F k.g9.2v()},4I:E(a,b){if((B.K===0&&B.O===0)||!B.4X){F}a.3i();B.rw(a);B.rz(a);if(!b){B.23(a)}B.rA(a);B.ar(a);if(B.4l){a.23.2W(a,B.4l)}B.4a&&k.J.jR(B,a);if(B.7I&&(!B.1s||B.ra)){if(!B.cf){B.aq()}if(B.8L(b)){B.bQ&&B.b9({7y:\'4g\'});B.fE(B.8A,b);B.6b=1f}B.rD(a)}P{B.fE(a,b);if(b&&B.7I&&B.bQ){B.b9({7y:\'4g\'})}}B.4a&&a.3f();a.3f()},fE:E(a,b){B.kg(a);B.pS(a);B.rF(a);B.58(a,b)},rD:E(a){a.3k(1/B.79,1/B.6S);a.fC(B.cf,-B.jL/2,-B.jK/2)},8L:E(a){if(!a&&B.qg()){F U}P{if(B.6b||(B.bQ&&B.jq(\'4g\'))){if(!a){G b=B.jL/B.79;G c=B.jK/B.6S;B.8A.a5(-b/2,-c/2,b,c)}F U}}F 1f},kg:E(a){if(!B.3w){F}G b=B.89();a.4F=B.3w;a.6h(-b.x/2,-b.y/2,b.x,b.y);B.b7(a)},rA:E(a){a.cS*=B.1V},pS:E(a){if(B.1D){a.4d=B.2s;a.v3=B.55;a.v2=B.5y;a.F8=B.6W;a.6t=B.1D.4c?B.1D.4c(a,B):B.1D}},rF:E(a){if(B.1A){a.4F=B.1A.4c?B.1A.4c(a,B):B.1A}},9N:E(a,b,c){if(!b){F}if(1&b.N){b.1o.2W(b,b)}if(kd){a.8Q(b)}P{c&&c(a)}},a6:E(a,b){if(!B.3z||b||(B.1s&&B.1s!==B.W.4h())){F}G c=B.jG(),2J=B.bP(),3u;2J=k.J.8O(c,2J);3u=k.J.ou(2J);a.3i();a.3T(3u.cO,3u.cT);a.4d=1*B.k9;if(!B.1s){a.cS=B.9A?B.qC:1}if(B.1s&&B.1s===B.W.4h()){a.5t(4D(3u.2i));B.rJ(a,3u)}P{a.5t(4D(B.2i));B.rK(a)}B.dI(a);a.3f()},ar:E(a){if(!B.2w){F}G b=(B.W&&B.W.3c[0])||1,jB=(B.W&&B.W.3c[3])||1,8R=B.ax();if(B.W&&B.W.bb()){b*=k.5a;jB*=k.5a}a.ja=B.2w.29;a.jd=B.2w.5R*(b+jB)*(8R.1r+8R.1t)/4;a.je=B.2w.2O*b*8R.1r;a.jj=B.2w.2A*jB*8R.1t},b7:E(a){if(!B.2w){F}a.ja=\'\';a.jd=a.je=a.jj=0},pN:E(a,b){if(!b.4c){F}G c=b.4P||b.F6;if(c){a.23.2W(a,c)}G d=-B.K/2+b.2O||0,2A=-B.O/2+b.2A||0;a.3T(d,2A)},94:E(a){if(!B.1A){F}a.3i();B.pN(a,B.1A);if(B.8H===\'rP\'){a.1A(\'rP\')}P{a.1A()}a.3f()},7o:E(a){if(!B.1D||B.2s===0){F}if(B.2w&&!B.2w.9O){B.b7(a)}a.3i();B.9N(a,B.2K,B.96);B.pN(a,B.1D);a.1D();a.3f()},3m:E(a,b){if(B.8n.2a){F B.8n.2a(B.1B(b),a)}F 1c k.1H(B.1B(b))},F5:E(b,c){G d=B.5c(c);k.J.87(d,E(a){if(b){b(1c k.1u(a))}});F B},5c:E(a){a||(a={});G b=k.J.6a(),pJ=B.9z();b.K=pJ.K;b.O=pJ.O;k.J.fO(b,\'kq\');G c=1c k.2F(b,{gd:a.gd});if(a.fR===\'r6\'){a.fR=\'iX\'}if(a.fR===\'iX\'){c.3w=\'#F1\'}G d={3z:B.1Z(\'3z\'),1g:B.pH(),1h:B.pG()};B.1F(\'3z\',1f);B.bZ(1c k.1N(c.5V()/2,c.63()/2),\'1G\',\'1G\');G e=B.W;c.5F(B);G f=c.5c(a);B.1F(d).3C();B.W=e;c.iQ();c=1k;F f},F0:E(a){F B.1p===a},5l:E(){F 1},iY:E(a){F B.1B(a)},EZ:E(a,b){b||(b={});G c={3R:[]};c.1p=b.1p||(b.r1||b.r2?\'aw\':\'9G\');c.2C={x1:b.x1,y1:b.y1,x2:b.x2,y2:b.y2};if(b.r1||b.r2){c.2C.r1=b.r1;c.2C.r2=b.r2}c.4P=b.4P;k.7W.1i.kv.1W(c,b.3R);F B.1F(a,k.7W.xS(B,c))},EY:E(a){F B.1F(\'1A\',1c k.ay(a))},d3:E(a){F B.1F(\'2w\',a?1c k.6o(a):1k)},EX:E(a){B.1F(\'1A\',a);F B},cA:E(a){G b=(B.1T!==\'1G\'||B.2g!==\'1G\')&&B.d2;if(b){B.gS()}B.1F(\'2i\',a);if(b){B.rZ()}F B},EW:E(){B.W&&B.W.ws(B);F B},EV:E(){B.W&&B.W.wo(B);F B},EU:E(){B.W&&B.W.wr(B);F B},ET:E(){B.W&&B.W.wn(B);F B},1G:E(){B.W&&B.W.wq(B);F B},ES:E(){B.W&&B.W.wp(B);F B},74:E(){B.W&&B.W.74(B);F B},s2:E(e,a){a=a||B.W.48(e);G b=1c k.1N(a.x,a.y),jv=B.ga();if(B.2i){b=k.J.eC(b,jv,4D(-B.2i))}F{x:b.x-jv.x,y:b.y-jv.y}},rw:E(a){if(B.9p){a.9p=B.9p}}});k.J.mw(k.1H);k.1H.1i.5t=k.1H.1i.cA;1n(k.1H.1i,k.bV);k.1H.2m=2;k.1H.6I=E(c,d,e,f,g){G h=k[c];d=3m(d,U);if(f){k.J.sz([d.1A,d.1D],E(a){d.1A=a[0];d.1D=a[1];G b=g?1c h(d[g],d):1c h(d);e&&e(b)})}P{G i=g?1c h(d[g],d):1c h(d);e&&e(i);F i}};k.1H.dD=0})(1j 1E!==\'1v\'?1E:B);(E(){G f=I.J.4D,fr={1g:-0.5,1G:0,3H:0.5},pv={1h:-0.5,1G:0,6C:0.5};I.J.1m.1n(I.1H.1i,{jl:E(a,b,c,d,e){G x=a.x,y=a.y,2O,2A,5h;if(1j b===\'2N\'){b=fr[b]}P{b-=0.5}if(1j d===\'2N\'){d=fr[d]}P{d-=0.5}2O=d-b;if(1j c===\'2N\'){c=pv[c]}P{c-=0.5}if(1j e===\'2N\'){e=pv[e]}P{e-=0.5}2A=e-c;if(2O||2A){5h=B.7w();x=a.x+2O*5h.x;y=a.y+2A*5h.y}F 1c I.1N(x,y)},pq:E(a,b,c){G p=B.jl(a,b,c,\'1G\',\'1G\');if(B.2i){F I.J.eC(p,a,f(B.2i))}F p},84:E(a,b,c){G p=B.jl(a,\'1G\',\'1G\',b,c);if(B.2i){F I.J.eC(p,a,f(B.2i))}F p},3U:E(){G a=1c I.1N(B.1g,B.1h);F B.pq(a,B.1T,B.2g)},s9:E(a,b){G c=B.3U();F B.84(c,a,b)},e2:E(a,b,c){G d=B.3U(),p,p2;if(1j b!==\'1v\'&&1j c!==\'1v\'){p=B.jl(d,\'1G\',\'1G\',b,c)}P{p=1c I.1N(B.1g,B.1h)}p2=1c I.1N(a.x,a.y);if(B.2i){p2=I.J.eC(p2,d,-f(B.2i))}F p2.o2(p)},bZ:E(a,b,c){G d=B.pq(a,b,c),9U=B.84(d,B.1T,B.2g);B.1F(\'1g\',9U.x);B.1F(\'1h\',9U.y)},EQ:E(a){G b=f(B.2i),po=B.5V(),sc=1a.3M(b)*po,sd=1a.3e(b)*po,fn,fl;if(1j B.1T===\'2N\'){fn=fr[B.1T]}P{fn=B.1T-0.5}if(1j a===\'2N\'){fl=fr[a]}P{fl=a-0.5}B.1g+=sc*(fl-fn);B.1h+=sd*(fl-fn);B.3C();B.1T=a},gS:E(){B.jc=B.1T;B.jb=B.2g;G a=B.3U();B.1T=\'1G\';B.2g=\'1G\';B.1g=a.x;B.1h=a.y},rZ:E(){G a=B.84(B.3U(),B.jc,B.jb);B.1T=B.jc;B.2g=B.jb;B.1g=a.x;B.1h=a.y;B.jc=1k;B.jb=1k},ga:E(){F B.84(B.3U(),\'1g\',\'1h\')}})})();(E(){E 7T(a){F[1c I.1N(a.tl.x,a.tl.y),1c I.1N(a.tr.x,a.tr.y),1c I.1N(a.br.x,a.br.y),1c I.1N(a.bl.x,a.bl.y)]}G f=I.J.4D,bM=I.J.8O;I.J.1m.1n(I.1H.1i,{6Z:1k,fg:1k,7T:E(a,b){if(!B.6Z){B.3C()}G c=a?B.fg:B.6Z;F 7T(b?B.c6(a):c)},rg:E(a,b,c,d){G e=B.7T(c,d),sp=I.3b.zo(e,a,b);F sp.aP===\'3b\'},pR:E(a,b,c){G d=I.3b.zp(B.7T(b,c),a.7T(b,c));F d.aP===\'3b\'||a.al(B,b,c)||B.al(a,b,c)},al:E(a,b,c){G d=B.7T(b,c),i=0,7U=a.j0(c?a.c6(b):b?a.fg:a.6Z);R(;i<4;i++){if(!a.ab(d[i],7U)){F 1f}}F U},rf:E(a,b,c,d){G e=B.9z(c,d);F(e.1g>=a.x&&e.1g+e.K<=b.x&&e.1h>=a.y&&e.1h+e.O<=b.y)},ab:E(a,b,c,d){G b=b||B.j0(d?B.c6(c):c?B.fg:B.6Z),9E=B.oT(a,b);F(9E!==0&&9E%2===1)},EP:E(a){if(!B.W){F 1f}G b=B.W.gf.tl,oR=B.W.gf.br;G c=B.7T(U,a),9r;R(G i=0;i<4;i++){9r=c[i];if(9r.x<=oR.x&&9r.x>=b.x&&9r.y<=oR.y&&9r.y>=b.y){F U}}F 1f},j0:E(a){F{EO:{o:a.tl,d:a.tr},EM:{o:a.tr,d:a.br},EK:{o:a.br,d:a.bl},EJ:{o:a.bl,d:a.tl}}},oT:E(a,b){G c,b2,a1,a2,xi,iI=0,5f;R(G d in b){5f=b[d];if((5f.o.y<a.y)&&(5f.d.y<a.y)){3t}if((5f.o.y>=a.y)&&(5f.d.y>=a.y)){3t}if((5f.o.x===5f.d.x)&&(5f.o.x>=a.x)){xi=5f.o.x}P{c=0;b2=(5f.d.y-5f.o.y)/(5f.d.x-5f.o.x);a1=a.y-c*a.x;a2=5f.o.y-b2*5f.o.x;xi=-(a1-a2)/(c-b2)}if(xi>=a.x){iI+=1}if(iI===2){1P}}F iI},EH:E(){F B.9z().K},EG:E(){F B.9z().O},9z:E(a,b){G c=B.7T(a,b);F I.J.ln(c)},5V:E(){F B.7w().x},63:E(){F B.7w().y},q0:E(a){if(1a.2f(a)<B.fW){if(a<0){F-B.fW}P{F B.fW}}F a},3k:E(a){a=B.q0(a);if(a<0){B.4N=!B.4N;B.56=!B.56;a*=-1}B.1r=a;B.1t=a;F B.3C()},EF:E(a){G b=B.9z().K/B.5V();F B.3k(a/B.K/b)},EE:E(a){G b=B.9z().O/B.63();F B.3k(a/B.O/b)},c6:E(a){G b=f(B.2i),4f=B.jG(),5h=a?B.7w():B.eU(),cH=5h.x,iB=5h.y,7r=1a.3e(b),7s=1a.3M(b),iz=cH>0?1a.tv(iB/cH):0,om=(cH/1a.3M(iz))/2,2O=1a.3M(iz+b)*om,2A=1a.3e(iz+b)*om,1G=B.3U(),d=a?1G:I.J.4w(1G,4f),tl=1c I.1N(d.x-2O,d.y-2A),tr=1c I.1N(tl.x+(cH*7s),tl.y+(cH*7r)),bl=1c I.1N(tl.x-(iB*7r),tl.y+(iB*7s)),br=1c I.1N(d.x+2O,d.y+2A);if(!a){G c=1c I.1N((tl.x+bl.x)/2,(tl.y+bl.y)/2),mt=1c I.1N((tr.x+tl.x)/2,(tr.y+tl.y)/2),mr=1c I.1N((br.x+tr.x)/2,(br.y+tr.y)/2),mb=1c I.1N((br.x+bl.x)/2,(br.y+bl.y)/2),7B=1c I.1N(mt.x+7r*B.fV,mt.y-7s*B.fV)}G d={tl:tl,tr:tr,br:br,bl:bl,};if(!a){d.ml=c;d.mt=mt;d.mr=mr;d.mb=mb;d.7B=7B}F d},3C:E(a,b){B.6Z=B.c6(a);if(!b){B.fg=B.c6(U)}a||(B.ol&&B.ol());F B},sN:E(){if(B.2i){G a=f(B.2i),3M=1a.3M(a),3e=1a.3e(a);F[3M,3e,-3e,3M,0,0]}F I.g9.2v()},bP:E(a){G b=B.3U(),9X=[1,0,0,1,b.x,b.y],il=B.sN(),sO=B.oi(B.2L,B.2U,U),2J=B.1s&&!a?B.1s.bP():I.g9.2v();2J=bM(2J,9X);2J=bM(2J,il);2J=bM(2J,sO);F 2J},oi:E(a,b,c){G d=[1,0,1a.cD(f(a)),1],sQ=[1,1a.cD(f(b)),0,1],1r=B.1r*(c&&B.4N?-1:1),1t=B.1t*(c&&B.56?-1:1),au=[1r,0,0,1t],m=bM(au,d,U);F bM(m,sQ,U)},89:E(){G a=B.2s,w=B.K+a,h=B.O+a;F{x:w,y:h}},7w:E(a,b){if(1j a===\'1v\'){a=B.2L}if(1j b===\'1v\'){b=B.2U}G c=B.89(),eR=c.x/2,eN=c.y/2,28=[{x:-eR,y:-eN},{x:eR,y:-eN},{x:-eR,y:eN},{x:eR,y:eN}],i,4l=B.oi(a,b,1f),io;R(i=0;i<28.N;i++){28[i]=I.J.4w(28[i],4l)}io=I.J.ln(28);F{x:io.K,y:io.O}},eU:E(){G a=B.jG(),5h=B.7w(),p=I.J.4w(5h,a,U);F p.mX(2*B.7u)},})})();I.J.1m.1n(I.1H.1i,{iE:E(){if(B.1s){I.2F.1i.iE.1W(B.1s,B)}P{B.W.iE(B)}F B},iJ:E(){if(B.1s){I.2F.1i.iJ.1W(B.1s,B)}P{B.W.iJ(B)}F B},iK:E(a){if(B.1s){I.2F.1i.iK.1W(B.1s,B,a)}P{B.W.iK(B,a)}F B},iO:E(a){if(B.1s){I.2F.1i.iO.1W(B.1s,B,a)}P{B.W.iO(B,a)}F B},52:E(a){if(B.1s){I.2F.1i.52.1W(B.1s,B,a)}P{B.W.52(B,a)}F B}});(E(){E o4(a,b){if(!b){F a+\': 4n; \'}P if(b.4c){F a+\': 9Q(#aB\'+b.id+\'); \'}P{G c=1c I.2e(b),o3=a+\': \'+c.fK()+\'; \',1V=c.82();if(1V!==1){o3+=a+\'-1V: \'+1V.3s()+\'; \'}F o3}}I.J.1m.1n(I.1H.1i,{5C:E(a){G b=B.8H,2s=B.2s?B.2s:\'0\',2K=B.2K?B.2K.2p(\' \'):\'4n\',55=B.55?B.55:\'qD\',5y=B.5y?B.5y:\'qZ\',6W=B.6W?B.6W:\'4\',1V=1j B.1V!==\'1v\'?B.1V:\'1\',hx=B.4X?\'\':\' hx: yR;\',44=a?\'\':B.az(),1A=o4(\'1A\',B.1A),1D=o4(\'1D\',B.1D);F[1D,\'1D-K: \',2s,\'; \',\'1D-yJ: \',2K,\'; \',\'1D-nQ: \',55,\'; \',\'1D-yK: \',5y,\'; \',\'1D-yL: \',6W,\'; \',1A,\'1A-yI: \',b,\'; \',\'1V: \',1V,\';\',44,hx].2p(\'\')},az:E(){F B.2w?\'44: 9Q(#aB\'+B.2w.id+\');\':\'\'},6F:E(){F B.id?\'id="\'+B.id+\'" \':\'\'},61:E(){if(B.1s&&B.1s.1p===\'1Q-1s\'){F\'\'}G a=I.J.26,2i=B.jJ(),2L=(B.En()%6O),2U=(B.Em()%6O),1G=B.3U(),2m=I.1H.2m,ie=B.1p===\'1Q-1s\'?\'\':\'3T(\'+a(1G.x,2m)+\' \'+a(1G.y,2m)+\')\',t5=2i!==0?(\' 5t(\'+a(2i,2m)+\')\'):\'\',t6=(B.1r===1&&B.1t===1)?\'\':(\' 3k(\'+a(B.1r,2m)+\' \'+a(B.1t,2m)+\')\'),t7=2L!==0?\' 2L(\'+a(2L,2m)+\')\':\'\',t8=2U!==0?\' 2U(\'+a(2U,2m)+\')\':\'\',t9=B.1p===\'1Q-1s\'?B.K:0,ta=B.4N?\' 2J(-1 0 0 1 \'+t9+\' 0) \':\'\',tc=B.1p===\'1Q-1s\'?B.O:0,td=B.56?\' 2J(1 0 0 -1 0 \'+tc+\')\':\'\';F[ie,t5,t6,ta,td,t7,t8].2p(\'\')},6y:E(){F B.4l?\' 2J(\'+B.4l.2p(\' \')+\') \':\'\'},6s:E(){G a=[];if(B.1A&&B.1A.4c){a.1o(B.1A.3D(B,1f))}if(B.1D&&B.1D.4c){a.1o(B.1D.3D(B,1f))}if(B.2w){a.1o(B.2w.3D(B))}F a}})})();(E(){G f=I.J.1m.1n,hW=\'5q\';E nx(b,c,d){G e={},tk=U;d.4j(E(a){e[a]=b[a]});f(b[c],e,tk)}E nu(a,b,c){if(!I.7d&&a 5D lv){F a===b}P if(a 5D 3g){if(a.N!==b.N){F 1f}R(G i=0,1d=a.N;i<1d;i++){if(a[i]!==b[i]){F 1f}}F U}P if(a&&1j a===\'1m\'){if(!c&&1H.tn(a).N!==1H.tn(b).N){F 1f}R(G d in a){if(!nu(a[d],b[d])){F 1f}}F U}P{F a===b}}I.J.1m.1n(I.1H.1i,{jq:E(a){a=a||hW;a=\'nr\'+a;F!nu(B[a],B,U)},b9:E(a){G b=a&&a.7y||hW,hQ=\'nr\'+b;if(!B[hQ]){F B.a4(a)}nx(B,hQ,B[b]);if(a&&a.5q){nx(B,hQ,a.5q)}F B},a4:E(a){a=a||{};G b=a.7y||hW;a.7y=b;B[\'nr\'+b]={};B.b9(a);F B}})})();(E(){G g=I.J.4D,ts=E(){F 1j ki!==\'1v\'};I.J.1m.1n(I.1H.1i,{hP:1k,aa:E(a){if(!B.6D||!B.3z){F 1f}G b=a.x,ey=a.y,9E,7U;B.fp=0;R(G i in B.6Z){if(!B.hJ(i)){3t}if(i===\'7B\'&&!B.8E){3t}if(B.1Z(\'9R\')&&(i===\'mt\'||i===\'mr\'||i===\'mb\'||i===\'ml\')){3t}7U=B.j0(B.6Z[i].5o);9E=B.oT({x:b,y:ey},7U);if(9E!==0&&9E%2===1){B.fp=i;F i}}F 1f},ol:E(){G a=B.6Z,n7=g(45-B.2i),n6=B.kf*0.Eg,e7=n6*1a.3M(n7),e3=n6*1a.3e(n7),x,y;R(G b in a){x=a[b].x;y=a[b].y;a[b].5o={tl:{x:x-e3,y:y-e7},tr:{x:x+e7,y:y-e3},bl:{x:x-e7,y:y+e3},br:{x:x+e3,y:y+e7}}}},rz:E(a){if(!B.bH||B.1s||!B.3z){F B}a.3i();G b=B.3U(),wh=B.eU(),4f=B.W.3c;a.3T(b.x,b.y);a.3k(1/4f[0],1/4f[3]);a.5t(g(B.2i));a.4F=B.bH;a.6h(-wh.x/2,-wh.y/2,wh.x,wh.y);a.3f();F B},rK:E(a){if(!B.bL){F B}G b=B.eU(),2s=1/B.k9,K=b.x+2s,O=b.y+2s;a.3i();a.6t=B.92;B.9N(a,B.qG,1k);a.i0(-K/2,-O/2,K,O);if(B.8E&&B.hJ(\'7B\')&&!B.1Z(\'hU\')&&B.6D){G c=-O/2;a.3Q();a.52(0,c);a.41(0,c-B.fV);a.5j();a.1D()}a.3f();F B},rJ:E(a,b){if(!B.bL){F B}G p=B.89(),2J=I.J.sX(b.1r,b.1t,b.2L),wh=I.J.4w(p,2J),2s=1/B.k9,K=wh.x+2s,O=wh.y+2s;a.3i();B.9N(a,B.qG,1k);a.6t=B.92;a.i0(-K/2,-O/2,K,O);a.3f();F B},dI:E(a){if(!B.6D){F B}G b=B.eU(),K=b.x,O=b.y,mE=B.kf,1g=-(K+mE)/2,1h=-(O+mE)/2,7v=B.7l?\'1D\':\'1A\';a.3i();a.6t=a.4F=B.qS;if(!B.7l){a.6t=B.qF}B.9N(a,B.qV,1k);B.7x(\'tl\',a,7v,1g,1h);B.7x(\'tr\',a,7v,1g+K,1h);B.7x(\'bl\',a,7v,1g,1h+O);B.7x(\'br\',a,7v,1g+K,1h+O);if(!B.1Z(\'9R\')){B.7x(\'mt\',a,7v,1g+K/2,1h);B.7x(\'mb\',a,7v,1g+K/2,1h+O);B.7x(\'mr\',a,7v,1g+K,1h+O/2);B.7x(\'ml\',a,7v,1g,1h+O/2)}if(B.8E){B.7x(\'7B\',a,7v,1g+K/2,1h-B.fV)}a.3f();F B},7x:E(a,b,c,d,e){if(!B.hJ(a)){F}G f=B.kf,1D=!B.7l&&B.qF;6R(B.qU){1C\'9t\':b.3Q();b.cN(d+f/2,e+f/2,f/2,0,2*1a.4u,1f);b[c]();if(1D){b.1D()}1P;dL:ts()||B.7l||b.a5(d,e,f,f);b[c+\'77\'](d,e,f,f);if(1D){b.i0(d,e,f,f)}}},hJ:E(a){F B.mn()[a]},tG:E(a,b){B.mn()[a]=b;F B},mi:E(a){a||(a={});R(G p in a){B.tG(p,a[p])}F B},mn:E(){if(!B.hP){B.hP={tl:U,tr:U,br:U,bl:U,ml:U,mt:U,mr:U,mb:U,7B:U}}F B.hP}})})();I.J.1m.1n(I.2F.1i,{dM:a0,Ef:E(b,c){c=c||{};G d=E(){},3j=c.3j||d,3E=c.3E||d,2I=B;I.J.6X({7b:b.1Z(\'1g\'),7J:B.ac().1g,6e:B.dM,3E:E(a){b.1F(\'1g\',a);2I.2u();3E()},3j:E(){b.3C();3j()}});F B},Ee:E(b,c){c=c||{};G d=E(){},3j=c.3j||d,3E=c.3E||d,2I=B;I.J.6X({7b:b.1Z(\'1h\'),7J:B.ac().1h,6e:B.dM,3E:E(a){b.1F(\'1h\',a);2I.2u();3E()},3j:E(){b.3C();3j()}});F B},Ed:E(b,c){c=c||{};G d=E(){},3j=c.3j||d,3E=c.3E||d,2I=B;I.J.6X({7b:b.1Z(\'1V\'),7J:0,6e:B.dM,ho:E(){b.1F(\'3z\',1f)},3E:E(a){b.1F(\'1V\',a);2I.2u();3E()},3j:E(){2I.74(b);3j()}});F B}});I.J.1m.1n(I.1H.1i,{6X:E(){if(2Q[0]&&1j 2Q[0]===\'1m\'){G a=[],4J,m5;R(4J in 2Q[0]){a.1o(4J)}R(G i=0,1d=a.N;i<1d;i++){4J=a[i];m5=i!==1d-1;B.m1(4J,2Q[0][4J],2Q[1],m5)}}P{B.m1.2W(B,2Q)}F B},m1:E(b,c,d,e){G f=B,8z;c=c.3s();if(!d){d={}}P{d=I.J.1m.3m(d)}if(~b.2Z(\'.\')){8z=b.2S(\'.\')}G g=8z?B.1Z(8z[0])[8z[1]]:B.1Z(b);if(!(\'lY\'in d)){d.lY=g}if(~c.2Z(\'=\')){c=g+3q(c.2M(\'=\',\'\'))}P{c=3q(c)}I.J.6X({7b:d.lY,7J:c,e5:d.by,bk:d.bk,6e:d.6e,7H:d.7H&&E(){F d.7H.1W(f)},3E:E(a){if(8z){f[8z[0]][8z[1]]=a}P{f.1F(b,a)}if(e){F}d.3E&&d.3E()},3j:E(){if(e){F}f.3C();d.3j&&d.3j()}})}});(E(g){\'2z 2H\';G h=g.I||(g.I={}),1n=h.J.1m.1n,3m=h.J.1m.3m,tR={x1:1,x2:1,y1:1,y2:1},kd=h.2F.cr(\'8Q\');if(h.7K){h.4B(\'I.7K is 5k 53\');F}G i=h.1H.1i.4g.2v();i.1o(\'x1\',\'x2\',\'y1\',\'y2\');h.7K=h.J.1z(h.1H,{1p:\'2r\',x1:0,y1:0,x2:0,y2:0,4g:i,2c:E(a,b){if(!a){a=[0,0,0,0]}B.1K(\'2c\',b);B.1F(\'x1\',a[0]);B.1F(\'y1\',a[1]);B.1F(\'x2\',a[2]);B.1F(\'y2\',a[3]);B.dv(b)},dv:E(a){a||(a={});B.K=1a.2f(B.x2-B.x1);B.O=1a.2f(B.y2-B.y1);B.1g=\'1g\'in a?a.1g:B.tU();B.1h=\'1h\'in a?a.1h:B.tV()},3I:E(a,b){B.1K(\'3I\',a,b);if(1j tR[a]!==\'1v\'){B.dv()}F B},tU:lB({9m:\'1T\',ag:\'x1\',ah:\'x2\',dp:\'K\'},{dl:\'1g\',1G:\'1G\',dk:\'3H\'}),tV:lB({9m:\'2g\',ag:\'y1\',ah:\'y2\',dp:\'O\'},{dl:\'1h\',1G:\'1G\',dk:\'6C\'}),58:E(a,b){a.3Q();if(b){G c=B.3U();a.3T(c.x-B.2s/2,c.y-B.2s/2)}if(!B.2K||B.2K&&kd){G p=B.dg();a.52(p.x1,p.y1);a.41(p.x2,p.y2)}a.4d=B.2s;G d=a.6t;a.6t=B.1D||a.4F;B.1D&&B.7o(a);a.6t=d},96:E(a){G p=B.dg();a.3Q();h.J.4L(a,p.x1,p.y1,p.x2,p.y2,B.2K);a.5j()},1B:E(a){F 1n(B.1K(\'1B\',a),B.dg())},89:E(){G a=B.1K(\'89\');if(B.55===\'qD\'){if(a.x===0){a.y-=B.2s}if(a.y===0){a.x-=B.2s}}F a},dg:E(){G a=B.x1<=B.x2?-1:1,lm=B.y1<=B.y2?-1:1,x1=(a*B.K*0.5),y1=(lm*B.O*0.5),x2=(a*B.K*-0.5),y2=(lm*B.O*-0.5);F{x1:x1,x2:x2,y1:y1,y2:y2}},3D:E(a){G b=B.6s(),p={x1:B.x1,x2:B.x2,y1:B.y1,y2:B.y2};if(!(B.1s&&B.1s.1p===\'1Q-1s\')){p=B.dg()}b.1o(\'<2r \',B.6F(),\'x1="\',p.x1,\'" y1="\',p.y1,\'" x2="\',p.x2,\'" y2="\',p.y2,\'" 1L="\',B.5C(),\'" 23="\',B.61(),B.6y(),\'"/>\\n\');F a?a(b.2p(\'\')):b.2p(\'\')},});h.7K.4x=h.8b.2v(\'x1 y1 x2 y2\'.2S(\' \'));h.7K.5X=E(a,b){b=b||{};G c=h.78(a,h.7K.4x),28=[c.x1||0,c.y1||0,c.x2||0,c.y2||0];b.1T=\'1g\';b.2g=\'1h\';F 1c h.7K(28,1n(c,b))};h.7K.2a=E(b,c,d){E u6(a){2Y a.28;c&&c(a)};G e=3m(b,U);e.28=[b.x1,b.y1,b.x2,b.y2];G f=h.1H.6I(\'7K\',e,u6,d,\'28\');if(f){2Y f.28}F f};E lB(a,b){G c=a.9m,ag=a.ag,ah=a.ah,dp=a.dp,dl=b.dl,1G=b.1G,dk=b.dk;F E(){6R(B.1Z(c)){1C dl:F 1a.2n(B.1Z(ag),B.1Z(ah));1C 1G:F 1a.2n(B.1Z(ag),B.1Z(ah))+(0.5*B.1Z(dp));1C dk:F 1a.1J(B.1Z(ag),B.1Z(ah))}}}})(1j 1E!==\'1v\'?1E:B);(E(e){\'2z 2H\';G f=e.I||(e.I={}),pi=1a.4u,1n=f.J.1m.1n;if(f.7t){f.4B(\'I.7t is 5k 53.\');F}G g=f.1H.1i.4g.2v();g.1o(\'2T\');f.7t=f.J.1z(f.1H,{1p:\'9t\',2T:0,cg:0,ch:pi*2,4g:g,2c:E(a){B.1K(\'2c\',a);B.1F(\'2T\',a&&a.2T||0)},3I:E(a,b){B.1K(\'3I\',a,b);if(a===\'2T\'){B.ua(b)}F B},1B:E(a){F B.1K(\'1B\',[\'2T\',\'cg\',\'ch\'].2v(a))},3D:E(a){G b=B.6s(),x=0,y=0,2i=(B.ch-B.cg)%(2*pi);if(2i===0){if(B.1s&&B.1s.1p===\'1Q-1s\'){x=B.1g+B.2T;y=B.1h+B.2T}b.1o(\'<9t \',B.6F(),\'cx="\'+x+\'" cy="\'+y+\'" \',\'r="\',B.2T,\'" 1L="\',B.5C(),\'" 23="\',B.61(),\' \',B.6y(),\'"/>\\n\')}P{G c=1a.3M(B.cg)*B.2T,uc=1a.3e(B.cg)*B.2T,ud=1a.3M(B.ch)*B.2T,ue=1a.3e(B.ch)*B.2T,uf=2i>pi?\'1\':\'0\';b.1o(\'<1Q d="M \'+c+\' \'+uc,\' A \'+B.2T+\' \'+B.2T,\' 0 \',+uf+\' 1\',\' \'+ud+\' \'+ue,\'" 1L="\',B.5C(),\'" 23="\',B.61(),\' \',B.6y(),\'"/>\\n\')}F a?a(b.2p(\'\')):b.2p(\'\')},58:E(a,b){a.3Q();a.cN(b?B.1g+B.2T:0,b?B.1h+B.2T:0,B.2T,B.cg,B.ch,1f);B.94(a);B.7o(a)},Eb:E(){F B.1Z(\'2T\')*B.1Z(\'1r\')},Ea:E(){F B.1Z(\'2T\')*B.1Z(\'1t\')},ua:E(a){B.2T=a;F B.1F(\'K\',a*2).1F(\'O\',a*2)},});f.7t.4x=f.8b.2v(\'cx cy r\'.2S(\' \'));f.7t.5X=E(a,b){b||(b={});G c=f.78(a,f.7t.4x);if(!uj(c)){bz 1c mP(\'4M of `r` E8 is E7 E6 E4 x6 be E3\');}c.1g=c.1g||0;c.1h=c.1h||0;G d=1c f.7t(1n(c,b));d.1g-=d.2T;d.1h-=d.2T;F d};E uj(a){F((\'2T\'in a)&&(a.2T>=0))}f.7t.2a=E(a,b,c){F f.1H.6I(\'7t\',a,b,c)}})(1j 1E!==\'1v\'?1E:B);(E(d){\'2z 2H\';G e=d.I||(d.I={});if(e.d0){e.4B(\'I.d0 is 5k 53\');F}e.d0=e.J.1z(e.1H,{1p:\'E1\',2c:E(a){B.1K(\'2c\',a);B.1F(\'K\',a&&a.K||3h).1F(\'O\',a&&a.O||3h)},58:E(a){G b=B.K/2,5m=B.O/2;a.3Q();a.52(-b,5m);a.41(0,-5m);a.41(b,5m);a.5j();B.94(a);B.7o(a)},96:E(a){G b=B.K/2,5m=B.O/2;a.3Q();e.J.4L(a,-b,5m,0,-5m,B.2K);e.J.4L(a,0,-5m,b,5m,B.2K);e.J.4L(a,b,5m,-b,5m,B.2K);a.5j()},3D:E(a){G b=B.6s(),kW=B.K/2,5m=B.O/2,28=[-kW+\' \'+5m,\'0 \'+ -5m,kW+\' \'+5m].2p(\',\');b.1o(\'<mk \',B.6F(),\'28="\',28,\'" 1L="\',B.5C(),\'" 23="\',B.61(),\'"/>\');F a?a(b.2p(\'\')):b.2p(\'\')},});e.d0.2a=E(a,b,c){F e.1H.6I(\'d0\',a,b,c)}})(1j 1E!==\'1v\'?1E:B);(E(e){\'2z 2H\';G f=e.I||(e.I={}),uu=1a.4u*2,1n=f.J.1m.1n;if(f.8d){f.4B(\'I.8d is 5k 53.\');F}G g=f.1H.1i.4g.2v();g.1o(\'rx\',\'ry\');f.8d=f.J.1z(f.1H,{1p:\'gN\',rx:0,ry:0,4g:g,2c:E(a){B.1K(\'2c\',a);B.1F(\'rx\',a&&a.rx||0);B.1F(\'ry\',a&&a.ry||0)},3I:E(a,b){B.1K(\'3I\',a,b);6R(a){1C\'rx\':B.rx=b;B.1F(\'K\',b*2);1P;1C\'ry\':B.ry=b;B.1F(\'O\',b*2);1P}F B},DY:E(){F B.1Z(\'rx\')*B.1Z(\'1r\')},DV:E(){F B.1Z(\'ry\')*B.1Z(\'1t\')},1B:E(a){F B.1K(\'1B\',[\'rx\',\'ry\'].2v(a))},3D:E(a){G b=B.6s(),x=0,y=0;if(B.1s&&B.1s.1p===\'1Q-1s\'){x=B.1g+B.rx;y=B.1h+B.ry}b.1o(\'<gN \',B.6F(),\'cx="\',x,\'" cy="\',y,\'" \',\'rx="\',B.rx,\'" ry="\',B.ry,\'" 1L="\',B.5C(),\'" 23="\',B.61(),B.6y(),\'"/>\\n\');F a?a(b.2p(\'\')):b.2p(\'\')},58:E(a,b){a.3Q();a.3i();a.23(1,0,0,B.ry/B.rx,0,0);a.cN(b?B.1g+B.rx:0,b?(B.1h+B.ry)*B.rx/B.ry:0,B.rx,0,uu,1f);a.3f();B.94(a);B.7o(a)},});f.8d.4x=f.8b.2v(\'cx cy rx ry\'.2S(\' \'));f.8d.5X=E(a,b){b||(b={});G c=f.78(a,f.8d.4x);c.1g=c.1g||0;c.1h=c.1h||0;G d=1c f.8d(1n(c,b));d.1h-=d.ry;d.1g-=d.rx;F d};f.8d.2a=E(a,b,c){F f.1H.6I(\'8d\',a,b,c)}})(1j 1E!==\'1v\'?1E:B);(E(e){\'2z 2H\';G f=e.I||(e.I={}),1n=f.J.1m.1n;if(f.77){f.4B(\'I.77 is 5k 53\');F}G g=f.1H.1i.5q.2v();g.1o(\'rx\',\'ry\');f.77=f.J.1z(f.1H,{5q:g,1p:\'5i\',rx:0,ry:0,2K:1k,2c:E(a){B.1K(\'2c\',a);B.uy()},uy:E(){if(B.rx&&!B.ry){B.ry=B.rx}P if(B.ry&&!B.rx){B.rx=B.ry}},58:E(a,b){if(B.K===1&&B.O===1){a.6h(-0.5,-0.5,1,1);F}G c=B.rx?1a.2n(B.rx,B.K/2):0,ry=B.ry?1a.2n(B.ry,B.O/2):0,w=B.K,h=B.O,x=b?B.1g:-B.K/2,y=b?B.1h:-B.O/2,cW=c!==0||ry!==0,k=1-0.DT;a.3Q();a.52(x+c,y);a.41(x+w-c,y);cW&&a.8j(x+w-k*c,y,x+w,y+k*ry,x+w,y+ry);a.41(x+w,y+h-ry);cW&&a.8j(x+w,y+h-k*ry,x+w-k*c,y+h,x+w-c,y+h);a.41(x+c,y+h);cW&&a.8j(x+k*c,y+h,x,y+h-k*ry,x,y+h-ry);a.41(x,y+ry);cW&&a.8j(x,y+k*ry,x+k*c,y,x+c,y);a.5j();B.94(a);B.7o(a)},96:E(a){G x=-B.K/2,y=-B.O/2,w=B.K,h=B.O;a.3Q();f.J.4L(a,x,y,x+w,y,B.2K);f.J.4L(a,x+w,y,x+w,y+h,B.2K);f.J.4L(a,x+w,y+h,x,y+h,B.2K);f.J.4L(a,x,y+h,x,y,B.2K);a.5j()},1B:E(a){F B.1K(\'1B\',[\'rx\',\'ry\'].2v(a))},3D:E(a){G b=B.6s(),x=B.1g,y=B.1h;if(!(B.1s&&B.1s.1p===\'1Q-1s\')){x=-B.K/2;y=-B.O/2}b.1o(\'<5i \',B.6F(),\'x="\',x,\'" y="\',y,\'" rx="\',B.1Z(\'rx\'),\'" ry="\',B.1Z(\'ry\'),\'" K="\',B.K,\'" O="\',B.O,\'" 1L="\',B.5C(),\'" 23="\',B.61(),B.6y(),\'"/>\\n\');F a?a(b.2p(\'\')):b.2p(\'\')},});f.77.4x=f.8b.2v(\'x y rx ry K O\'.2S(\' \'));f.77.5X=E(a,b){if(!a){F 1k}b=b||{};G c=f.78(a,f.77.4x);c.1g=c.1g||0;c.1h=c.1h||0;G d=1c f.77(1n((b?f.J.1m.3m(b):{}),c));d.4X=d.4X&&d.K>0&&d.O>0;F d};f.77.2a=E(a,b,c){F f.1H.6I(\'77\',a,b,c)}})(1j 1E!==\'1v\'?1E:B);(E(d){\'2z 2H\';G e=d.I||(d.I={}),1n=e.J.1m.1n,2n=e.J.5A.2n,1J=e.J.5A.1J,26=e.J.26;if(e.7p){e.4B(\'I.7p is 5k 53\');F}G f=e.1H.1i.4g.2v();f.1o(\'28\');e.7p=e.J.1z(e.1H,{1p:\'yv\',28:1k,4Y:0,4k:0,4g:f,2c:E(a,b){b=b||{};B.28=a||[];B.1K(\'2c\',b);B.uD();if(!(\'1h\'in b)){B.1h=B.4k}if(!(\'1g\'in b)){B.1g=B.4Y}B.6B={x:B.4Y+B.K/2,y:B.4k+B.O/2}},uD:E(){G a=B.28,4Y=2n(a,\'x\'),4k=2n(a,\'y\'),aS=1J(a,\'x\'),aW=1J(a,\'y\');B.K=(aS-4Y)||0;B.O=(aW-4k)||0;B.4Y=4Y||0;B.4k=4k||0},1B:E(a){F 1n(B.1K(\'1B\',a),{28:B.28.2v()})},3D:E(a){G b=[],cE,3V=B.6s();R(G i=0,1d=B.28.N;i<1d;i++){b.1o(26(B.28[i].x,2),\',\',26(B.28[i].y,2),\' \')}if(!(B.1s&&B.1s.1p===\'1Q-1s\')){cE=\' 3T(\'+(-B.6B.x)+\', \'+(-B.6B.y)+\') \'}3V.1o(\'<\',B.1p,\' \',B.6F(),\'28="\',b.2p(\'\'),\'" 1L="\',B.5C(),\'" 23="\',B.61(),cE,\' \',B.6y(),\'"/>\\n\');F a?a(3V.2p(\'\')):3V.2p(\'\')},kI:E(a,b){G c,1d=B.28.N,x=b?0:B.6B.x,y=b?0:B.6B.y;if(!1d||et(B.28[1d-1].y)){F 1f}a.3Q();a.52(B.28[0].x-x,B.28[0].y-y);R(G i=0;i<1d;i++){c=B.28[i];a.41(c.x-x,c.y-y)}F U},58:E(a,b){if(!B.kI(a,b)){F}B.94(a);B.7o(a)},96:E(a){G b,p2;a.3Q();R(G i=0,1d=B.28.N;i<1d;i++){b=B.28[i];p2=B.28[i+1]||b;e.J.4L(a,b.x,b.y,p2.x,p2.y,B.2K)}},5l:E(){F B.1Z(\'28\').N}});e.7p.4x=e.8b.2v();e.7p.5X=E(a,b){if(!a){F 1k}b||(b={});G c=e.lE(a.2D(\'28\')),kc=e.78(a,e.7p.4x);F 1c e.7p(c,e.J.1m.1n(kc,b))};e.7p.2a=E(a,b,c){F e.1H.6I(\'7p\',a,b,c,\'28\')}})(1j 1E!==\'1v\'?1E:B);(E(d){\'2z 2H\';G e=d.I||(d.I={}),1n=e.J.1m.1n;if(e.8e){e.4B(\'I.8e is 5k 53\');F}e.8e=e.J.1z(e.7p,{1p:\'mk\',58:E(a,b){if(!B.kI(a,b)){F}a.5j();B.94(a);B.7o(a)},96:E(a){B.1K(\'96\',a);a.5j()},});e.8e.4x=e.8b.2v();e.8e.5X=E(a,b){if(!a){F 1k}b||(b={});G c=e.lE(a.2D(\'28\')),kc=e.78(a,e.8e.4x);F 1c e.8e(c,1n(kc,b))};e.8e.2a=E(a,b,c){F e.1H.6I(\'8e\',a,b,c,\'28\')}})(1j 1E!==\'1v\'?1E:B);(E(g){\'2z 2H\';G h=g.I||(g.I={}),2n=h.J.5A.2n,1J=h.J.5A.1J,1n=h.J.1m.1n,uI=1H.1i.3s,dF=h.J.dF,uJ={m:2,l:2,h:1,v:1,c:6,s:4,q:4,t:2,a:7},uK={m:\'l\',M:\'L\'};if(h.6l){h.4B(\'I.6l is 5k 53\');F}G m=h.1H.1i.4g.2v();m.1o(\'1Q\');h.6l=h.J.1z(h.1H,{1p:\'1Q\',1Q:1k,4Y:0,4k:0,4g:m,2c:E(a,b){b=b||{};if(b){B.7g(b)}if(!a){a=[]}G c=uI.1W(a)===\'[1m 3g]\';B.1Q=c?a:a.3K&&a.3K(/[uL][^uL]*/gi);if(!B.1Q){F}if(!c){B.1Q=B.uN()}B.uO(b);if(b.6p){B.d4(b.6p)}if(B.7I){B.aq();B.a4({7y:\'4g\'})}},uO:E(a){G b=B.uP();B.4Y=b.1g;B.4k=b.1h;B.K=b.K;B.O=b.O;if(1j a.1g===\'1v\'){B.1g=b.1g+(B.1T===\'1G\'?B.K/2:B.1T===\'3H\'?B.K:0)}if(1j a.1h===\'1v\'){B.1h=b.1h+(B.2g===\'1G\'?B.O/2:B.2g===\'6C\'?B.O:0)}B.6B=B.6B||{x:B.4Y+B.K/2,y:B.4k+B.O/2}},uQ:E(a){G b,6w=1k,8M=0,8N=0,x=0,y=0,1X=0,21=0,2y,2B,l=-B.6B.x,t=-B.6B.y;if(B.1s&&B.1s.1p===\'1Q-1s\'){l=0;t=0}a.3Q();R(G i=0,1d=B.1Q.N;i<1d;++i){b=B.1Q[i];6R(b[0]){1C\'l\':x+=b[1];y+=b[2];a.41(x+l,y+t);1P;1C\'L\':x=b[1];y=b[2];a.41(x+l,y+t);1P;1C\'h\':x+=b[1];a.41(x+l,y+t);1P;1C\'H\':x=b[1];a.41(x+l,y+t);1P;1C\'v\':y+=b[1];a.41(x+l,y+t);1P;1C\'V\':y=b[1];a.41(x+l,y+t);1P;1C\'m\':x+=b[1];y+=b[2];8M=x;8N=y;a.52(x+l,y+t);1P;1C\'M\':x=b[1];y=b[2];8M=x;8N=y;a.52(x+l,y+t);1P;1C\'c\':2y=x+b[5];2B=y+b[6];1X=x+b[3];21=y+b[4];a.8j(x+b[1]+l,y+b[2]+t,1X+l,21+t,2y+l,2B+t);x=2y;y=2B;1P;1C\'C\':x=b[5];y=b[6];1X=b[3];21=b[4];a.8j(b[1]+l,b[2]+t,1X+l,21+t,x+l,y+t);1P;1C\'s\':2y=x+b[3];2B=y+b[4];if(6w[0].3K(/[jE]/)===1k){1X=x;21=y}P{1X=2*x-1X;21=2*y-21}a.8j(1X+l,21+t,x+b[1]+l,y+b[2]+t,2y+l,2B+t);1X=x+b[1];21=y+b[2];x=2y;y=2B;1P;1C\'S\':2y=b[3];2B=b[4];if(6w[0].3K(/[jE]/)===1k){1X=x;21=y}P{1X=2*x-1X;21=2*y-21}a.8j(1X+l,21+t,b[1]+l,b[2]+t,2y+l,2B+t);x=2y;y=2B;1X=b[1];21=b[2];1P;1C\'q\':2y=x+b[3];2B=y+b[4];1X=x+b[1];21=y+b[2];a.cP(1X+l,21+t,2y+l,2B+t);x=2y;y=2B;1P;1C\'Q\':2y=b[3];2B=b[4];a.cP(b[1]+l,b[2]+t,2y+l,2B+t);x=2y;y=2B;1X=b[1];21=b[2];1P;1C\'t\':2y=x+b[1];2B=y+b[2];if(6w[0].3K(/[jz]/)===1k){1X=x;21=y}P{1X=2*x-1X;21=2*y-21}a.cP(1X+l,21+t,2y+l,2B+t);x=2y;y=2B;1P;1C\'T\':2y=b[1];2B=b[2];if(6w[0].3K(/[jz]/)===1k){1X=x;21=y}P{1X=2*x-1X;21=2*y-21}a.cP(1X+l,21+t,2y+l,2B+t);x=2y;y=2B;1P;1C\'a\':dF(a,x+l,y+t,[b[1],b[2],b[3],b[4],b[5],b[6]+x+l,b[7]+y+t]);x+=b[6];y+=b[7];1P;1C\'A\':dF(a,x+l,y+t,[b[1],b[2],b[3],b[4],b[5],b[6]+l,b[7]+t]);x=b[6];y=b[7];1P;1C\'z\':1C\'Z\':x=8M;y=8N;a.5j();1P}6w=b}},58:E(a){B.uQ(a);B.94(a);B.7o(a)},3s:E(){F\'#<I.6l (\'+B.5l()+\'): { "1h": \'+B.1h+\', "1g": \'+B.1g+\' }>\'},1B:E(b){G o=1n(B.1K(\'1B\',[\'6p\',\'6B\'].2v(b)),{1Q:B.1Q.4r(E(a){F a.2P()}),1h:B.1h,1g:B.1g,});F o},c1:E(a){G o=B.1B(a);if(B.6p){o.1Q=B.6p}2Y o.6p;F o},3D:E(a){G b=[],3V=B.6s(),cE=\'\';R(G i=0,1d=B.1Q.N;i<1d;i++){b.1o(B.1Q[i].2p(\' \'))}G c=b.2p(\' \');if(!(B.1s&&B.1s.1p===\'1Q-1s\')){cE=\' 3T(\'+(-B.6B.x)+\', \'+(-B.6B.y)+\') \'}3V.1o(\'<1Q \',B.6F(),\'d="\',c,\'" 1L="\',B.5C(),\'" 23="\',B.61(),cE,B.6y(),\'" 1D-nQ="4o" \',\'/>\\n\');F a?a(3V.2p(\'\')):3V.2p(\'\')},5l:E(){F B.1Q.N},uN:E(){G a=[],2C=[],jt,8K,re=/([-+]?((\\d+\\.\\d+)|((\\d+)|(\\.\\d+)))(?:e[-+]?\\d+)?)/ig,3K,qh;R(G i=0,8P,1d=B.1Q.N;i<1d;i++){jt=B.1Q[i];qh=jt.2P(1).4T();2C.N=0;31((3K=re.hm(qh))){2C.1o(3K[0])}8P=[jt.3J(0)];R(G j=0,4O=2C.N;j<4O;j++){8K=3q(2C[j]);if(!et(8K)){8P.1o(8K)}}G b=8P[0],iW=uJ[b.bi()],v5=uK[b]||b;if(8P.N-1>iW){R(G k=1,v6=8P.N;k<v6;k+=iW){a.1o([b].2v(8P.2P(k,k+iW)));b=v5}}P{a.1o(8P)}}F a},uP:E(){G b=[],aY=[],1I,6w=1k,8M=0,8N=0,x=0,y=0,1X=0,21=0,2y,2B,2q;R(G i=0,1d=B.1Q.N;i<1d;++i){1I=B.1Q[i];6R(1I[0]){1C\'l\':x+=1I[1];y+=1I[2];2q=[];1P;1C\'L\':x=1I[1];y=1I[2];2q=[];1P;1C\'h\':x+=1I[1];2q=[];1P;1C\'H\':x=1I[1];2q=[];1P;1C\'v\':y+=1I[1];2q=[];1P;1C\'V\':y=1I[1];2q=[];1P;1C\'m\':x+=1I[1];y+=1I[2];8M=x;8N=y;2q=[];1P;1C\'M\':x=1I[1];y=1I[2];8M=x;8N=y;2q=[];1P;1C\'c\':2y=x+1I[5];2B=y+1I[6];1X=x+1I[3];21=y+1I[4];2q=h.J.6u(x,y,x+1I[1],y+1I[2],1X,21,2y,2B);x=2y;y=2B;1P;1C\'C\':x=1I[5];y=1I[6];1X=1I[3];21=1I[4];2q=h.J.6u(x,y,1I[1],1I[2],1X,21,x,y);1P;1C\'s\':2y=x+1I[3];2B=y+1I[4];if(6w[0].3K(/[jE]/)===1k){1X=x;21=y}P{1X=2*x-1X;21=2*y-21}2q=h.J.6u(x,y,1X,21,x+1I[1],y+1I[2],2y,2B);1X=x+1I[1];21=y+1I[2];x=2y;y=2B;1P;1C\'S\':2y=1I[3];2B=1I[4];if(6w[0].3K(/[jE]/)===1k){1X=x;21=y}P{1X=2*x-1X;21=2*y-21}2q=h.J.6u(x,y,1X,21,1I[1],1I[2],2y,2B);x=2y;y=2B;1X=1I[1];21=1I[2];1P;1C\'q\':2y=x+1I[3];2B=y+1I[4];1X=x+1I[1];21=y+1I[2];2q=h.J.6u(x,y,1X,21,1X,21,2y,2B);x=2y;y=2B;1P;1C\'Q\':1X=1I[1];21=1I[2];2q=h.J.6u(x,y,1X,21,1X,21,1I[3],1I[4]);x=1I[3];y=1I[4];1P;1C\'t\':2y=x+1I[1];2B=y+1I[2];if(6w[0].3K(/[jz]/)===1k){1X=x;21=y}P{1X=2*x-1X;21=2*y-21}2q=h.J.6u(x,y,1X,21,1X,21,2y,2B);x=2y;y=2B;1P;1C\'T\':2y=1I[1];2B=1I[2];if(6w[0].3K(/[jz]/)===1k){1X=x;21=y}P{1X=2*x-1X;21=2*y-21}2q=h.J.6u(x,y,1X,21,1X,21,2y,2B);x=2y;y=2B;1P;1C\'a\':2q=h.J.oO(x,y,1I[1],1I[2],1I[3],1I[4],1I[5],1I[6]+x,1I[7]+y);x+=1I[6];y+=1I[7];1P;1C\'A\':2q=h.J.oO(x,y,1I[1],1I[2],1I[3],1I[4],1I[5],1I[6],1I[7]);x=1I[6];y=1I[7];1P;1C\'z\':1C\'Z\':x=8M;y=8N;1P}6w=1I;2q.4j(E(a){b.1o(a.x);aY.1o(a.y)});b.1o(x);aY.1o(y)}G c=2n(b)||0,4k=2n(aY)||0,aS=1J(b)||0,aW=1J(aY)||0,v9=aS-c,va=aW-4k,o={1g:c,1h:4k,K:v9,O:va};F o}});h.6l.2a=E(c,d,e){G f;if(1j c.1Q===\'2N\'){h.gp(c.1Q,E(a){G b=c.1Q;f=a[0];2Y c.1Q;h.J.1m.1n(f,c);f.d4(b);d&&d(f)})}P{F h.1H.6I(\'6l\',c,d,e,\'1Q\')}};h.6l.4x=h.8b.2v([\'d\']);h.6l.5X=E(a,b,c){G d=h.78(a,h.6l.4x);b&&b(1c h.6l(d.d,1n(d,c)))};h.6l.9b=U})(1j 1E!==\'1v\'?1E:B);(E(g){\'2z 2H\';G h=g.I||(g.I={}),1n=h.J.1m.1n;if(h.8F){h.4B(\'I.8F is 5k 53\');F}h.8F=h.J.1z(h.1H,{1p:\'1Q-1s\',1A:\'\',2c:E(a,b){b=b||{};B.3Y=a||[];R(G i=B.3Y.N;i--;){B.3Y[i].1s=B}if(b.cq){B.vc(b);2Y b.cq}B.7g(b);B.3C();if(b.6p){B.d4(b.6p)}if(B.7I){B.aq();B.a4({7y:\'4g\'})}},vc:E(a){G b,p,xC=[],yC=[],1Q,O,K,m;R(G j=B.3Y.N;j--;){1Q=B.3Y[j];O=1Q.O+1Q.2s;K=1Q.K+1Q.2s;b=[{x:1Q.1g,y:1Q.1h},{x:1Q.1g+K,y:1Q.1h},{x:1Q.1g,y:1Q.1h+O},{x:1Q.1g+K,y:1Q.1h+O}];m=B.3Y[j].4l;R(G i=0;i<b.N;i++){p=b[i];if(m){p=h.J.4w(p,m,1f)}xC.1o(p.x);yC.1o(p.y)}}a.K=1a.1J.2W(1k,xC);a.O=1a.1J.2W(1k,yC)},fE:E(a){a.3i();a.3T(-B.K/2,-B.O/2);R(G i=0,l=B.3Y.N;i<l;++i){B.3Y[i].4I(a,U)}a.3f()},8L:E(){if(B.1K(\'8L\')){F U}if(!B.bQ){F 1f}R(G i=0,1d=B.3Y.N;i<1d;i++){if(B.3Y[i].8L(U)){G a=B.89();B.8A.a5(-a.x/2,-a.y/2,a.x,a.y);F U}}F 1f},3I:E(a,b){if(a===\'1A\'&&b&&B.vf()){G i=B.3Y.N;31(i--){B.3Y[i].3I(a,b)}}F B.1K(\'3I\',a,b)},1B:E(d){G e=B.3Y.4r(E(a){G b=a.4G;a.4G=a.1s.4G;G c=a.1B(d);a.4G=b;F c});G o=1n(B.1K(\'1B\',[\'6p\'].2v(d)),{3Y:e});F o},c1:E(a){G o=B.1B(a);if(B.6p){o.3Y=B.6p}F o},3D:E(a){G b=B.49(),p=B.s9(\'1g\',\'1h\'),ie=\'3T(\'+p.x+\' \'+p.y+\')\',3V=B.6s();3V.1o(\'<g \',B.6F(),\'1L="\',B.5C(),\'" \',\'23="\',B.6y(),ie,B.61(),\'" \',\'>\\n\');R(G i=0,1d=b.N;i<1d;i++){3V.1o(\'\\t\',b[i].3D(a))}3V.1o(\'</g>\\n\');F a?a(3V.2p(\'\')):3V.2p(\'\')},3s:E(){F\'#<I.8F (\'+B.5l()+\'): { 1h: \'+B.1h+\', 1g: \'+B.1g+\' }>\'},vf:E(){G c=B.49()[0].1Z(\'1A\')||\'\';if(1j c!==\'2N\'){F 1f}c=c.bi();F B.49().kj(E(a){G b=a.1Z(\'1A\')||\'\';F 1j b===\'2N\'&&(b).bi()===c})},5l:E(){F B.3Y.f0(E(a,b){F a+((b&&b.5l)?b.5l():0)},0)},49:E(){F B.3Y}});h.8F.2a=E(d,e){G f=d.3Y;2Y d.3Y;if(1j DK===\'2N\'){h.gp(f,E(a){G b=f;G c=h.J.sE(a,d,b);d.3Y=f;e(c)})}P{h.J.c5(f,E(a){G b=1c h.8F(a,d);d.3Y=f;e(b)})}};h.8F.9b=U})(1j 1E!==\'1v\'?1E:B);(E(f){\'2z 2H\';G g=f.I||(f.I={}),1n=g.J.1m.1n,2n=g.J.5A.2n,1J=g.J.5A.1J;if(g.7a){F}G h={9f:U,9e:U,hU:U,b0:U,9S:U,9R:U};g.7a=g.J.1z(g.1H,g.pV,{1p:\'1s\',2s:0,t4:1f,2c:E(a,b,c){b=b||{};B.1y=[];c&&B.1K(\'2c\',b);B.1y=a||[];R(G i=B.1y.N;i--;){B.1y[i].1s=B}B.DJ={};if(b.1T){B.1T=b.1T}if(b.2g){B.2g=b.2g}if(c){B.da(U)}P{B.iw();B.da();B.1K(\'2c\',b)}B.3C();B.jM()},da:E(a){G b=B.3U();R(G i=B.1y.N;i--;){B.vi(B.1y[i],b,a)}},vi:E(a,b,c){a.pB=a.6D;a.6D=1f;if(c){F}G d=a.pH(),vj=a.pG(),ir=U,9Z=U;a.1F({1g:d-b.x,1h:vj-b.y});a.3C(ir,9Z)},3s:E(){F\'#<I.7a: (\'+B.5l()+\')>\'},jO:E(a){B.iq();g.J.qt(B);if(a){B.1y.1o(a);a.1s=B;a.3I(\'W\',B.W)}B.jy(B.pk,B);B.iw();B.da();B.6b=U;F B},pk:E(a){a.1F(\'3z\',U);a.1s=B},rn:E(a){B.iq();g.J.qt(B);B.jy(B.pk,B);B.74(a);B.iw();B.da();B.6b=U;F B},cI:E(a){B.6b=U;a.1s=B;a.3I(\'W\',B.W)},aM:E(a){B.6b=U;2Y a.1s;a.1F(\'3z\',1f)},pj:{1A:U,1D:U,2s:U,2E:U,3n:U,2h:U,3N:U,2R:U,3p:U,5r:U,3w:U},3I:E(a,b){G i=B.1y.N;if(B.pj[a]||a===\'W\'){31(i--){B.1y[i].1F(a,b)}}P{31(i--){B.1y[i].pZ(a,b)}}B.1K(\'3I\',a,b)},1B:E(d){G e=B.49().4r(E(a){G b=a.4G;a.4G=a.1s.4G;G c=a.1B(d);a.4G=b;F c});F 1n(B.1K(\'1B\',d),{5J:e})},4I:E(a){B.q2=U;B.1K(\'4I\',a);B.q2=1f},fE:E(a){R(G i=0,1d=B.1y.N;i<1d;i++){B.vq(B.1y[i],a)}},8L:E(){if(B.1K(\'8L\')){F U}if(!B.bQ){F 1f}R(G i=0,1d=B.1y.N;i<1d;i++){if(B.1y[i].8L(U)){G a=B.89();B.8A.a5(-a.x/2,-a.y/2,a.x,a.y);F U}}F 1f},a6:E(a,b){a.3i();a.cS=B.9A?B.qC:1;B.1K(\'a6\',a,b);R(G i=0,1d=B.1y.N;i<1d;i++){B.1y[i].a6(a)}a.3f()},vq:E(a,b){if(!a.4X){F}G c=a.8E;a.8E=1f;a.4I(b);a.8E=c},iq:E(){B.1y.4j(B.vr,B);F B},os:E(a){G b=a.bP(),3u=g.J.ou(b),1G=1c g.1N(3u.cO,3u.cT);a.4N=1f;a.56=1f;a.1F(\'1r\',3u.1r);a.1F(\'1t\',3u.1t);a.2L=3u.2L;a.2U=3u.2U;a.2i=3u.2i;a.bZ(1G,\'1G\',\'1G\');F a},vr:E(a){B.os(a);a.3C();a.6D=a.pB;2Y a.pB;a.1F(\'3z\',1f);2Y a.1s;F B},sP:E(){F B.iq()},jM:E(){B.vs=B.1Z(\'1g\');B.vt=B.1Z(\'1h\');F B},DC:E(){F B.vs!==B.1Z(\'1g\')||B.vt!==B.1Z(\'1h\')},rd:E(){G b=U,9Z=U;B.jy(E(a){a.3C(b,9Z)});F B},iw:E(a){G b=[],aY=[],o,4J,pf=[\'tr\',\'br\',\'bl\',\'tl\'],i=0,4C=B.1y.N,j,cd=pf.N,ir=U;R(;i<4C;++i){o=B.1y[i];o.3C(ir);R(j=0;j<cd;j++){4J=pf[j];b.1o(o.6Z[4J].x);aY.1o(o.6Z[4J].y)}}B.1F(B.vy(b,aY,a))},vy:E(a,b,c){G d=1c g.1N(2n(a),2n(b)),p9=1c g.1N(1J(a),1J(b)),2t={K:(p9.x-d.x)||0,O:(p9.y-d.y)||0};if(!c){2t.1g=d.x||0;2t.1h=d.y||0;if(B.1T===\'1G\'){2t.1g+=2t.K/2}if(B.1T===\'3H\'){2t.1g+=2t.K}if(B.2g===\'1G\'){2t.1h+=2t.O/2}if(B.2g===\'6C\'){2t.1h+=2t.O}}F 2t},3D:E(a){G b=B.6s();b.1o(\'<g \',B.6F(),\'23="\',B.61(),B.6y(),\'" 1L="\',B.az(),\'">\\n\');R(G i=0,1d=B.1y.N;i<1d;i++){b.1o(\'\\t\',B.1y[i].3D(a))}b.1o(\'</g>\\n\');F a?a(b.2p(\'\')):b.2p(\'\')},1Z:E(a){if(a in h){if(B[a]){F B[a]}P{R(G i=0,1d=B.1y.N;i<1d;i++){if(B.1y[i][a]){F U}}F 1f}}P{if(a in B.pj){F B.1y[0]&&B.1y[0].1Z(a)}F B[a]}}});g.7a.2a=E(b,c){g.J.c5(b.5J,E(a){2Y b.5J;c&&c(1c g.7a(a,b,U))})};g.7a.9b=U})(1j 1E!==\'1v\'?1E:B);(E(i){\'2z 2H\';G j=I.J.1m.1n;if(!i.I){i.I={}}if(i.I.1u){I.4B(\'I.1u is 5k 53.\');F}G k=I.1H.1i.5q.2v();k.1o(\'6d\',\'6z\',\'am\');I.1u=I.J.1z(I.1H,{1p:\'4q\',6q:\'\',6d:\'4n\',6z:\'4n\',am:\'cZ\',2s:0,p8:1,p7:1,vC:0.5,5q:k,7I:1f,2c:E(a,b,c){b||(b={});B.1l=[];B.6J=[];B.1K(\'2c\',b);B.vF(a,b,c)},7D:E(){F B.5I},aN:E(a,b,c){G d,2I;B.5I=a;B.dn=a;B.vI(c);if(B.6J.N===0){d=b}P{2I=B;d=E(){2I.i6(b,2I.6J,2I.i5||2I.dn,U)}}if(B.1l.N!==0){B.i6(d)}P if(d){d(B)}F B},Dj:E(a){B.6q=a;B.5I.6q=a;F B},Dg:E(){G a=B.7D();F{K:a.K,O:a.O}},vN:E(a){if(!B.1D||B.2s===0){F}G w=B.K/2,h=B.O/2;a.3Q();a.52(-w,-h);a.41(w,-h);a.41(w,h);a.41(-w,h);a.41(-w,-h);a.5j()},96:E(a){G x=-B.K/2,y=-B.O/2,w=B.K,h=B.O;a.3i();B.pS(a);a.3Q();I.J.4L(a,x,y,x+w,y,B.2K);I.J.4L(a,x+w,y,x+w,y+h,B.2K);I.J.4L(a,x+w,y+h,x,y+h,B.2K);I.J.4L(a,x,y+h,x,y,B.2K);a.5j();a.3f()},1B:E(b){G c=[],6J=[],1r=1,1t=1;B.1l.4j(E(a){if(a){if(a.1p===\'dq\'){1r*=a.1r;1t*=a.1t}c.1o(a.1B())}});B.6J.4j(E(a){a&&6J.1o(a.1B())});G d=j(B.1K(\'1B\',[\'6q\',\'6d\',\'6z\',\'am\'].2v(b)),{3F:B.i2(),1l:c,6J:6J,});d.K/=1r;d.O/=1t;F d},3D:E(a){G b=B.6s(),x=-B.K/2,y=-B.O/2,6x=\'4n\',vQ=U;if(B.1s&&B.1s.1p===\'1Q-1s\'){x=B.1g;y=B.1h}if(B.6d!==\'4n\'&&B.6z!==\'4n\'){6x=\'x\'+B.6d+\'Y\'+B.6z+\' \'+B.am}b.1o(\'<g 23="\',B.61(),B.6y(),\'">\\n\',\'<4q \',B.6F(),\'5x:as="\',B.vR(vQ),\'" x="\',x,\'" y="\',y,\'" 1L="\',B.5C(),\'" K="\',B.K,\'" O="\',B.O,\'" 6x="\',6x,\'"\',\'></4q>\\n\');if(B.1D||B.2K){G c=B.1A;B.1A=1k;b.1o(\'<5i \',\'x="\',x,\'" y="\',y,\'" K="\',B.K,\'" O="\',B.O,\'" 1L="\',B.5C(),\'"/>\\n\');B.1A=c}b.1o(\'</g>\\n\');F a?a(b.2p(\'\')):b.2p(\'\')},i2:E(a){G b=a?B.5I:B.dn;if(b){F I.7d?b.oU:b.3F}P{F B.3F||\'\'}},De:E(b,c,d){I.J.87(b,E(a){F B.aN(a,c,d)},B,d&&d.6q)},3s:E(){F\'#<I.1u: { 3F: "\'+B.i2()+\'" }>\'},i6:E(b,c,d,e){c=c||B.1l;d=d||B.dn;if(!d){F}G f=I.J.gU(),c7=B.W?B.W.wP():I.5a,oS=B.vC/c7,2I=B,1r,1t;if(c.N===0){B.5I=d;b&&b(B);F d}G g=I.J.6a();g.K=d.K;g.O=d.O;g.2o(\'2d\').fC(d,0,0,d.K,d.O);c.4j(E(a){if(!a){F}if(e){1r=2I.1r<oS?2I.1r:1;1t=2I.1t<oS?2I.1t:1;if(1r*c7<1){1r*=c7}if(1t*c7<1){1t*=c7}}P{1r=a.1r;1t=a.1t}a.4t(g,1r,1t);if(!e&&a.1p===\'dq\'){2I.K*=a.1r;2I.O*=a.1t}});f.K=g.K;f.O=g.O;if(I.7d){f.3F=g.Da(1v,I.1u.vY);2I.5I=f;!e&&(2I.i5=f);b&&b(2I)}P{f.ae=E(){2I.5I=f;!e&&(2I.i5=f);b&&b(2I);f.ae=g=1k};f.3F=g.5c(\'4q/rc\')}F g},58:E(a,b){G x,y,dr=B.w1(),ds;x=(b?B.1g:-B.K/2);y=(b?B.1h:-B.O/2);if(B.am===\'2P\'){a.3Q();a.5i(x,y,B.K,B.O);a.sV()}if(B.9A===1f&&B.6J.N&&B.w5()){B.p8=B.1r;B.p7=B.1t;ds=B.i6(1k,B.6J,B.i5||B.dn,U)}P{ds=B.5I}ds&&a.fC(ds,x+dr.c4,y+dr.c3,dr.K,dr.O);B.vN(a);B.7o(a)},w5:E(){F(B.1r!==B.p8||B.1t!==B.p7)},w1:E(){G a=B.K,O=B.O,hT,3k,c4=0,c3=0;if(B.6d!==\'4n\'||B.6z!==\'4n\'){hT=[B.K/B.5I.K,B.O/B.5I.O];3k=B.am===\'cZ\'?1a.2n.2W(1k,hT):1a.1J.2W(1k,hT);a=B.5I.K*3k;O=B.5I.O*3k;if(B.6d===\'j4\'){c4=(B.K-a)/2}if(B.6d===\'w9\'){c4=B.K-a}if(B.6z===\'j4\'){c3=(B.O-O)/2}if(B.6z===\'w9\'){c3=B.O-O}}F{K:a,O:O,c4:c4,c3:c3}},D7:E(){G a=B.7D();B.1F(\'K\',a.K);B.1F(\'O\',a.O)},vF:E(a,b,c){B.aN(I.J.fF(a),c,b);I.J.av(B.7D(),I.1u.wb)},vI:E(a){a||(a={});B.7g(a);B.dv(a);if(B.5I&&B.6q){B.5I.6q=B.6q}},oE:E(b,c){if(b&&b.N){I.J.c5(b,E(a){c&&c(a)},\'I.1u.1l\')}P{c&&c()}},dv:E(a){B.K=\'K\'in a?a.K:(B.7D()?B.7D().K||0:0);B.O=\'O\'in a?a.O:(B.7D()?B.7D().O||0:0)},});I.1u.wb=\'W-cK\';I.1u.1i.vR=I.1u.1i.i2;I.1u.2a=E(e,f){I.J.87(e.3F,E(c,d){if(d){f&&f(1k,d);F}I.1u.1i.oE.1W(e,e.1l,E(b){e.1l=b||[];I.1u.1i.oE.1W(e,e.6J,E(a){e.6J=a||[];F 1c I.1u(c,e,f)})})},1k,e.6q)};I.1u.wd=E(b,c,d){I.J.87(b,E(a){c&&c(1c I.1u(a,d))},1k,d&&d.6q)};I.1u.4x=I.8b.2v(\'x y K O 6x 5x:as\'.2S(\' \'));I.1u.5X=E(a,b,c){G d=I.78(a,I.1u.4x),oD;if(d.6x){oD=I.J.mN(d.6x);j(d,oD)}I.1u.wd(d[\'5x:as\'],b,j((c?I.J.1m.3m(c):{}),d))};I.1u.9b=U;I.1u.vY=1})(1j 1E!==\'1v\'?1E:B);I.J.1m.1n(I.1H.1i,{oA:E(){G a=B.jJ()%6O;if(a>0){F 1a.4o((a-1)/90)*90}F 1a.4o(a/90)*90},wi:E(){B.cA(B.oA());F B},wj:E(b){b=b||{};G c=E(){},3j=b.3j||c,3E=b.3E||c,2I=B;I.J.6X({7b:B.1Z(\'2i\'),7J:B.oA(),6e:B.dM,3E:E(a){2I.cA(a);3E()},3j:E(){2I.3C();3j()},ho:E(){2I.1F(\'3z\',1f)}});F B}});I.J.1m.1n(I.2F.1i,{D6:E(a){a.wi();B.2u();F B},D5:E(a){a.wj({3E:B.2u.3l(B)});F B}});I.1u.1l=I.1u.1l||{};I.1u.1l.2G=I.J.1z({1p:\'2G\',2c:E(a){if(a){B.7g(a)}},7g:E(a){R(G b in a){B[b]=a[b]}},1B:E(){F{1p:B.1p}},iY:E(){F B.1B()}});I.1u.1l.2G.2a=E(a,b){G c=1c I.1u.1l[a.1p](a);b&&b(c);F c};(E(c){\'2z 2H\';G d=c.I||(c.I={}),1n=d.J.1m.1n,1l=d.1u.1l,1z=d.J.1z;1l.ot=1z(1l.2G,{1p:\'ot\',2c:E(a){a=a||{};B.8h=a.8h||0},4t:E(a){G b=a.2o(\'2d\'),1M=b.3d(0,0,a.K,a.O),1b=1M.1b,8h=B.8h;R(G i=0,1d=1b.N;i<1d;i+=4){1b[i]+=8h;1b[i+1]+=8h;1b[i+2]+=8h}b.4b(1M,0,0)},1B:E(){F 1n(B.1K(\'1B\'),{8h:B.8h})}});d.1u.1l.ot.2a=d.1u.1l.2G.2a})(1j 1E!==\'1v\'?1E:B);(E(h){\'2z 2H\';G i=h.I||(h.I={}),1n=i.J.1m.1n,1l=i.1u.1l,1z=i.J.1z;1l.og=1z(1l.2G,{1p:\'og\',2c:E(a){a=a||{};B.dA=a.dA;B.2J=a.2J||[0,0,0,0,1,0,0,0,0]},4t:E(c){G d=B.2J,7h=c.2o(\'2d\'),8i=7h.3d(0,0,c.K,c.O),dG=1a.4o(1a.5E(d.N)),nZ=1a.4e(dG/2),3F=8i.1b,sw=8i.K,sh=8i.O,nt=7h.D1(sw,sh),dS=nt.1b,wB=B.dA?1:0,r,g,b,a,bw,dU,e0,bn,wt;R(G y=0;y<sh;y++){R(G x=0;x<sw;x++){bw=(y*sw+x)*4;r=0;g=0;b=0;a=0;R(G e=0;e<dG;e++){R(G f=0;f<dG;f++){e0=y+e-nZ;dU=x+f-nZ;if(e0<0||e0>sh||dU<0||dU>sw){3t}bn=(e0*sw+dU)*4;wt=d[e*dG+f];r+=3F[bn]*wt;g+=3F[bn+1]*wt;b+=3F[bn+2]*wt;a+=3F[bn+3]*wt}}dS[bw]=r;dS[bw+1]=g;dS[bw+2]=b;dS[bw+3]=a+wB*(2x-a)}}7h.4b(nt,0,0)},1B:E(){F 1n(B.1K(\'1B\'),{dA:B.dA,2J:B.2J})}});i.1u.1l.og.2a=i.1u.1l.2G.2a})(1j 1E!==\'1v\'?1E:B);(E(c){\'2z 2H\';G d=c.I||(c.I={}),1n=d.J.1m.1n,1l=d.1u.1l,1z=d.J.1z;1l.n3=1z(1l.2G,{1p:\'n3\',2c:E(a){a=a||{};B.5T=a.5T||3h},4t:E(a){G b=a.2o(\'2d\'),1M=b.3d(0,0,a.K,a.O),1b=1M.1b,5T=B.5T,mV=1b.N;R(G i=0,1d=1b.N;i<1d;i+=4){1b[i+3]=5T+2x*(mV-i)/mV}b.4b(1M,0,0)},1B:E(){F 1n(B.1K(\'1B\'),{5T:B.5T})}});d.1u.1l.n3.2a=d.1u.1l.2G.2a})(1j 1E!==\'1v\'?1E:B);(E(c){\'2z 2H\';G d=c.I||(c.I={}),1l=d.1u.1l,1z=d.J.1z;1l.gz=1z(1l.2G,{1p:\'gz\',4t:E(a){G b=a.2o(\'2d\'),1M=b.3d(0,0,a.K,a.O),1b=1M.1b,1d=1M.K*1M.O*4,2l=0,5v;31(2l<1d){5v=(1b[2l]+1b[2l+1]+1b[2l+2])/3;1b[2l]=5v;1b[2l+1]=5v;1b[2l+2]=5v;2l+=4}b.4b(1M,0,0)}});d.1u.1l.gz.2a=E(a,b){a=a||{};a.1p=\'gz\';F d.1u.1l.2G.2a(a,b)}})(1j 1E!==\'1v\'?1E:B);(E(c){\'2z 2H\';G d=c.I||(c.I={}),1l=d.1u.1l,1z=d.J.1z;1l.gy=1z(1l.2G,{1p:\'gy\',4t:E(a){G b=a.2o(\'2d\'),1M=b.3d(0,0,a.K,a.O),1b=1M.1b,4C=1b.N,i;R(i=0;i<4C;i+=4){1b[i]=2x-1b[i];1b[i+1]=2x-1b[i+1];1b[i+2]=2x-1b[i+2]}b.4b(1M,0,0)}});d.1u.1l.gy.2a=E(a,b){a=a||{};a.1p=\'gy\';F d.1u.1l.2G.2a(a,b)}})(1j 1E!==\'1v\'?1E:B);(E(d){\'2z 2H\';G e=d.I||(d.I={}),1n=e.J.1m.1n,1l=e.1u.1l,1z=e.J.1z;1l.gw=1z(1l.2G,{1p:\'gw\',2c:E(a){a=a||{};B.7E=a.7E;B.8Z=[0,1,2,3].2Z(a.8Z)>-1?a.8Z:0},4t:E(a){if(!B.7E){F}G b=a.2o(\'2d\'),1M=b.3d(0,0,a.K,a.O),1b=1M.1b,wO=B.7E.7D(),e8=e.J.6a(),8Z=B.8Z,i,4C=1M.K*1M.O*4;e8.K=a.K;e8.O=a.O;e8.2o(\'2d\').fC(wO,0,0,a.K,a.O);G c=e8.2o(\'2d\').3d(0,0,a.K,a.O),wQ=c.1b;R(i=0;i<4C;i+=4){1b[i+3]=wQ[i+8Z]}b.4b(1M,0,0)},1B:E(){F 1n(B.1K(\'1B\'),{7E:B.7E.1B(),8Z:B.8Z})}});e.1u.1l.gw.2a=E(b,c){e.J.87(b.7E.3F,E(a){b.7E=1c e.1u(a,b.7E);F e.1u.1l.2G.2a(b,c)})};e.1u.1l.gw.9b=U})(1j 1E!==\'1v\'?1E:B);(E(c){\'2z 2H\';G d=c.I||(c.I={}),1n=d.J.1m.1n,1l=d.1u.1l,1z=d.J.1z;1l.ms=1z(1l.2G,{1p:\'ms\',2c:E(a){a=a||{};B.9W=a.9W||0},4t:E(a){G b=a.2o(\'2d\'),1M=b.3d(0,0,a.K,a.O),1b=1M.1b,9W=B.9W,e9;R(G i=0,1d=1b.N;i<1d;i+=4){e9=(0.5-1a.rI())*9W;1b[i]+=e9;1b[i+1]+=e9;1b[i+2]+=e9}b.4b(1M,0,0)},1B:E(){F 1n(B.1K(\'1B\'),{9W:B.9W})}});d.1u.1l.ms.2a=d.1u.1l.2G.2a})(1j 1E!==\'1v\'?1E:B);(E(h){\'2z 2H\';G k=h.I||(h.I={}),1n=k.J.1m.1n,1l=k.1u.1l,1z=k.J.1z;1l.mf=1z(1l.2G,{1p:\'mf\',2c:E(a){a=a||{};B.93=a.93||4},4t:E(c){G d=c.2o(\'2d\'),1M=d.3d(0,0,c.K,c.O),1b=1M.1b,4C=1M.O,cd=1M.K,2l,i,j,r,g,b,a;R(i=0;i<4C;i+=B.93){R(j=0;j<cd;j+=B.93){2l=(i*4)*cd+(j*4);r=1b[2l];g=1b[2l+1];b=1b[2l+2];a=1b[2l+3];R(G e=i,wW=i+B.93;e<wW;e++){R(G f=j,wX=j+B.93;f<wX;f++){2l=(e*4)*cd+(f*4);1b[2l]=r;1b[2l+1]=g;1b[2l+2]=b;1b[2l+3]=a}}}}d.4b(1M,0,0)},1B:E(){F 1n(B.1K(\'1B\'),{93:B.93})}});k.1u.1l.mf.2a=k.1u.1l.2G.2a})(1j 1E!==\'1v\'?1E:B);(E(d){\'2z 2H\';G e=d.I||(d.I={}),1n=e.J.1m.1n,1l=e.1u.1l,1z=e.J.1z;1l.m9=1z(1l.2G,{1p:\'m9\',2c:E(a){a=a||{};B.5T=a.5T||30;B.8m=a.8m||20},4t:E(a){G c=a.2o(\'2d\'),1M=c.3d(0,0,a.K,a.O),1b=1M.1b,5T=B.5T,8m=B.8m,gb=2x-5T,2f=1a.2f,r,g,b;R(G i=0,1d=1b.N;i<1d;i+=4){r=1b[i];g=1b[i+1];b=1b[i+2];if(r>gb&&g>gb&&b>gb&&2f(r-g)<8m&&2f(r-b)<8m&&2f(g-b)<8m){1b[i+3]=0}}c.4b(1M,0,0)},1B:E(){F 1n(B.1K(\'1B\'),{5T:B.5T,8m:B.8m})}});e.1u.1l.m9.2a=e.1u.1l.2G.2a})(1j 1E!==\'1v\'?1E:B);(E(c){\'2z 2H\';G d=c.I||(c.I={}),1l=d.1u.1l,1z=d.J.1z;1l.g5=1z(1l.2G,{1p:\'g5\',4t:E(a){G b=a.2o(\'2d\'),1M=b.3d(0,0,a.K,a.O),1b=1M.1b,4C=1b.N,i,ei;R(i=0;i<4C;i+=4){ei=0.3*1b[i]+0.59*1b[i+1]+0.11*1b[i+2];1b[i]=ei+3h;1b[i+1]=ei+50;1b[i+2]=ei+2x}b.4b(1M,0,0)}});d.1u.1l.g5.2a=E(a,b){a=a||{};a.1p=\'g5\';F 1c d.1u.1l.2G.2a(a,b)}})(1j 1E!==\'1v\'?1E:B);(E(d){\'2z 2H\';G e=d.I||(d.I={}),1l=e.1u.1l,1z=e.J.1z;1l.k2=1z(1l.2G,{1p:\'k2\',4t:E(a){G c=a.2o(\'2d\'),1M=c.3d(0,0,a.K,a.O),1b=1M.1b,4C=1b.N,i,r,g,b;R(i=0;i<4C;i+=4){r=1b[i];g=1b[i+1];b=1b[i+2];1b[i]=(r*0.CG+g*0.CC+b*0.CA)/1.Cy;1b[i+1]=(r*0.Cx+g*0.Cw+b*0.Cv)/1.Cu;1b[i+2]=(r*0.Cr+g*0.Cq+b*0.Cp)/2.Co}c.4b(1M,0,0)}});e.1u.1l.k2.2a=E(a,b){a=a||{};a.1p=\'k2\';F 1c e.1u.1l.2G.2a(a,b)}})(1j 1E!==\'1v\'?1E:B);(E(d){\'2z 2H\';G e=d.I||(d.I={}),1n=e.J.1m.1n,1l=e.1u.1l,1z=e.J.1z;1l.lO=1z(1l.2G,{1p:\'lO\',2c:E(a){a=a||{};B.29=a.29||\'#pr\';B.1V=1j a.1V!==\'1v\'?a.1V:1c e.2e(B.29).82()},4t:E(a){G c=a.2o(\'2d\'),1M=c.3d(0,0,a.K,a.O),1b=1M.1b,4C=1b.N,i,lK,lJ,lF,r,g,b,ej,1Y;1Y=1c e.2e(B.29).4m();lK=1Y[0]*B.1V;lJ=1Y[1]*B.1V;lF=1Y[2]*B.1V;ej=1-B.1V;R(i=0;i<4C;i+=4){r=1b[i];g=1b[i+1];b=1b[i+2];1b[i]=lK+r*ej;1b[i+1]=lJ+g*ej;1b[i+2]=lF+b*ej}c.4b(1M,0,0)},1B:E(){F 1n(B.1K(\'1B\'),{29:B.29,1V:B.1V})}});e.1u.1l.lO.2a=e.1u.1l.2G.2a})(1j 1E!==\'1v\'?1E:B);(E(c){\'2z 2H\';G d=c.I||(c.I={}),1n=d.J.1m.1n,1l=d.1u.1l,1z=d.J.1z;1l.lD=1z(1l.2G,{1p:\'lD\',2c:E(a){a=a||{};B.29=a.29||\'#pr\'},4t:E(a){G b=a.2o(\'2d\'),1M=b.3d(0,0,a.K,a.O),1b=1M.1b,4C=1b.N,i,1Y;1Y=1c d.2e(B.29).4m();R(i=0;i<4C;i+=4){1b[i]*=1Y[0]/2x;1b[i+1]*=1Y[1]/2x;1b[i+2]*=1Y[2]/2x}b.4b(1M,0,0)},1B:E(){F 1n(B.1K(\'1B\'),{29:B.29})}});d.1u.1l.lD.2a=d.1u.1l.2G.2a})(1j 1E!==\'1v\'?1E:B);(E(h){\'2z 2H\';G j=h.I,1l=j.1u.1l,1z=j.J.1z;1l.lC=1z(1l.2G,{1p:\'lC\',2c:E(a){a=a||{};B.29=a.29||\'#Ch\';B.4q=a.4q||1f;B.eo=a.eo||\'n4\';B.4v=a.4v||1},4t:E(a){G c=a.2o(\'2d\'),1M=c.3d(0,0,a.K,a.O),1b=1M.1b,tr,tg,tb,r,g,b,jF,jD,jC,1Y,lu=1f;if(B.4q){lu=U;G d=j.J.6a();d.K=B.4q.K;d.O=B.4q.O;G e=1c j.2F(d);e.5F(B.4q);G f=e.2o(\'2d\');1Y=f.3d(0,0,e.K,e.O).1b}P{1Y=1c j.2e(B.29).4m();tr=1Y[0]*B.4v;tg=1Y[1]*B.4v;tb=1Y[2]*B.4v}R(G i=0,1d=1b.N;i<1d;i+=4){r=1b[i];g=1b[i+1];b=1b[i+2];if(lu){tr=1Y[i]*B.4v;tg=1Y[i+1]*B.4v;tb=1Y[i+2]*B.4v}6R(B.eo){1C\'n4\':1b[i]=r*tr/2x;1b[i+1]=g*tg/2x;1b[i+2]=b*tb/2x;1P;1C\'Cb\':1b[i]=1-(1-r)*(1-tr);1b[i+1]=1-(1-g)*(1-tg);1b[i+2]=1-(1-b)*(1-tb);1P;1C\'5F\':1b[i]=1a.2n(2x,r+tr);1b[i+1]=1a.2n(2x,g+tg);1b[i+2]=1a.2n(2x,b+tb);1P;1C\'aQ\':1C\'C6\':1b[i]=1a.2f(r-tr);1b[i+1]=1a.2f(g-tg);1b[i+2]=1a.2f(b-tb);1P;1C\'zK\':jF=r-tr;jD=g-tg;jC=b-tb;1b[i]=(jF<0)?0:jF;1b[i+1]=(jD<0)?0:jD;1b[i+2]=(jC<0)?0:jC;1P;1C\'C3\':1b[i]=1a.2n(r,tr);1b[i+1]=1a.2n(g,tg);1b[i+2]=1a.2n(b,tb);1P;1C\'C1\':1b[i]=1a.1J(r,tr);1b[i+1]=1a.1J(g,tg);1b[i+2]=1a.1J(b,tb);1P}}c.4b(1M,0,0)},1B:E(){F{29:B.29,4q:B.4q,eo:B.eo,4v:B.4v}}});j.1u.1l.lC.2a=j.1u.1l.2G.2a})(1j 1E!==\'1v\'?1E:B);(E(n){\'2z 2H\';G o=n.I||(n.I={}),5w=1a.5w,4e=1a.4e,5E=1a.5E,2f=1a.2f,1J=1a.1J,4o=1a.4o,3e=1a.3e,6M=1a.6M,1l=o.1u.1l,1z=o.J.1z;1l.dq=1z(1l.2G,{1p:\'dq\',9P:\'xG\',1r:0,1t:0,aK:3,4t:E(a,b,c){if(b===1&&c===1){F}B.ev=1/b;B.ew=1/c;G d=a.K,oH=a.O,dW=4o(d*b),dH=4o(oH*c),1M;if(B.9P===\'BU\'){1M=B.xO(a,d,oH,dW,dH)}if(B.9P===\'xG\'){1M=B.xP(a,d,oH,dW,dH)}if(B.9P===\'BS\'){1M=B.xR(a,d,oH,dW,dH)}if(B.9P===\'kQ\'){1M=B.xT(a,d,oH,dW,dH)}a.K=dW;a.O=dH;a.2o(\'2d\').4b(1M,0,0)},xO:E(a,b,c,d,e){G f=a.2o(\'2d\'),1M,ib=0.5,i7=0.5,i4=1,hY=1,kA=1f,kl=1f,97=b,98=c,f6=o.J.6a(),y3=f6.2o(\'2d\');d=4e(d);e=4e(e);f6.K=1J(d,b);f6.O=1J(e,c);if(d>b){ib=2;i4=-1}if(e>c){i7=2;hY=-1}1M=f.3d(0,0,b,c);a.K=1J(d,b);a.O=1J(e,c);f.4b(1M,0,0);31(!kA||!kl){b=97;c=98;if(d*i4<4e(97*ib*i4)){97=4e(97*ib)}P{97=d;kA=U}if(e*hY<4e(98*i7*hY)){98=4e(98*i7)}P{98=e;kl=U}1M=f.3d(0,0,b,c);y3.4b(1M,0,0);f.a5(0,0,97,98);f.fC(f6,0,0,b,c,0,0,97,98)}F f.3d(0,0,d,e)},xT:E(c,d,e,f,g){E y4(b){F E(x){if(x>b){F 0}x*=1a.4u;if(2f(x)<1e-16){F 1}G a=x/b;F 3e(x)*3e(a)/x/a}}E he(u){G v,i,3G,3v,a,fo,fz,fB,4v,fX,fY;1G.x=(u+0.5)*bX;9C.x=4e(1G.x);R(v=0;v<g;v++){1G.y=(v+0.5)*bU;9C.y=4e(1G.y);a=0;fo=0;fz=0;fB=0;4v=0;R(i=9C.x-qe;i<=9C.x+qe;i++){if(i<0||i>=d){3t}fX=4e(bA*2f(i-1G.x));if(!bR[fX]){bR[fX]={}}R(G j=9C.y-qb;j<=9C.y+qb;j++){if(j<0||j>=e){3t}fY=4e(bA*2f(j-1G.y));if(!bR[fX][fY]){bR[fX][fY]=kQ(5E(5w(fX*yf,2)+5w(fY*yg,2))/bA)}3G=bR[fX][fY];if(3G>0){3v=(j*d+i)*4;a+=3G;fo+=3G*fh[3v];fz+=3G*fh[3v+1];fB+=3G*fh[3v+2];4v+=3G*fh[3v+3]}}}3v=(v*f+u)*4;fi[3v]=fo/a;fi[3v+1]=fz/a;fi[3v+2]=fB/a;fi[3v+3]=4v/a}if(++u<f){F he(u)}P{F q7}}G h=c.2o(\'2d\'),yk=h.3d(0,0,d,e),q7=h.3d(0,0,f,g),fh=yk.1b,fi=q7.1b,kQ=y4(B.aK),bX=B.ev,bU=B.ew,yf=2/B.ev,yg=2/B.ew,qe=6M(bX*B.aK/2),qb=6M(bU*B.aK/2),bR={},1G={},9C={};F he(0)},xR:E(e,f,g,h,k){G a,b,c,d,x,y,i,j,bK,bG,9d,29,24=0,bE,bX=B.ev,bU=B.ew,7h=e.2o(\'2d\'),w4=4*(f-1),cK=7h.3d(0,0,f,g),8i=cK.1b,q1=7h.3d(0,0,h,k),yr=q1.1b;R(i=0;i<k;i++){R(j=0;j<h;j++){x=4e(bX*j);y=4e(bU*i);bK=bX*j-x;bG=bU*i-y;bE=4*(y*f+x);R(9d=0;9d<4;9d++){a=8i[bE+9d];b=8i[bE+4+9d];c=8i[bE+w4+9d];d=8i[bE+w4+4+9d];29=a*(1-bK)*(1-bG)+b*bK*(1-bG)+c*bG*(1-bK)+d*bK*bG;yr[24++]=29}}}F q1},xP:E(a,b,c,d,e){G f=B.ev,fu=B.ew,yt=6M(f/2),yu=6M(fu/2),7h=a.2o(\'2d\'),cK=7h.3d(0,0,b,c),1b=cK.1b,pW=7h.3d(0,0,d,e),fv=pW.1b;R(G j=0;j<e;j++){R(G i=0;i<d;i++){G g=(i+j*d)*4,3G=0,fw=0,pT=0,pQ=0,pO=0,pM=0,pL=0,yE=(j+0.5)*fu;R(G h=4e(j*fu);h<(j+1)*fu;h++){G k=2f(yE-(h+0.5))/yu,yF=(i+0.5)*f,w0=k*k;R(G l=4e(i*f);l<(i+1)*f;l++){G m=2f(yF-(l+0.5))/yt,w=5E(w0+m*m);if(w>1&&w<-1){3t}3G=2*w*w*w-3*w*w+1;if(3G>0){m=4*(l+h*b);pL+=3G*1b[m+3];pT+=3G;if(1b[m+3]<2x){3G=3G*1b[m+3]/B9}pQ+=3G*1b[m];pO+=3G*1b[m+1];pM+=3G*1b[m+2];fw+=3G}}}fv[g]=pQ/fw;fv[g+1]=pO/fw;fv[g+2]=pM/fw;fv[g+3]=pL/pT}}F pW},1B:E(){F{1p:B.1p,1r:B.1r,1t:B.1t,9P:B.9P,aK:B.aK}}});o.1u.1l.dq.2a=o.1u.1l.2G.2a})(1j 1E!==\'1v\'?1E:B);(E(e){\'2z 2H\';G f=e.I||(e.I={}),1n=f.J.1m.1n,1l=f.1u.1l,1z=f.J.1z;1l.pK=1z(1l.2G,{1p:\'pK\',2c:E(a){a||(a={});B.2J=a.2J||[1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0]},4t:E(c){G d=c.2o(\'2d\'),1M=d.3d(0,0,c.K,c.O),1b=1M.1b,4C=1b.N,i,r,g,b,a,m=B.2J;R(i=0;i<4C;i+=4){r=1b[i];g=1b[i+1];b=1b[i+2];a=1b[i+3];1b[i]=r*m[0]+g*m[1]+b*m[2]+a*m[3]+m[4];1b[i+1]=r*m[5]+g*m[6]+b*m[7]+a*m[8]+m[9];1b[i+2]=r*m[10]+g*m[11]+b*m[12]+a*m[13]+m[14];1b[i+3]=r*m[15]+g*m[16]+b*m[17]+a*m[18]+m[19]}d.4b(1M,0,0)},1B:E(){F 1n(B.1K(\'1B\'),{1p:B.1p,2J:B.2J})}});f.1u.1l.pK.2a=f.1u.1l.2G.2a})(1j 1E!==\'1v\'?1E:B);(E(c){\'2z 2H\';G d=c.I||(c.I={}),1n=d.J.1m.1n,1l=d.1u.1l,1z=d.J.1z;1l.pD=1z(1l.2G,{1p:\'pD\',2c:E(a){a=a||{};B.bg=a.bg||0},4t:E(a){G b=a.2o(\'2d\'),1M=b.3d(0,0,a.K,a.O),1b=1M.1b,gB=yO*(B.bg+2x)/(2x*(yO-B.bg));R(G i=0,1d=1b.N;i<1d;i+=4){1b[i]=gB*(1b[i]-bd)+bd;1b[i+1]=gB*(1b[i+1]-bd)+bd;1b[i+2]=gB*(1b[i+2]-bd)+bd}b.4b(1M,0,0)},1B:E(){F 1n(B.1K(\'1B\'),{bg:B.bg})}});d.1u.1l.pD.2a=d.1u.1l.2G.2a})(1j 1E!==\'1v\'?1E:B);(E(c){\'2z 2H\';G d=c.I||(c.I={}),1n=d.J.1m.1n,1l=d.1u.1l,1z=d.J.1z;1l.pw=1z(1l.2G,{1p:\'pw\',2c:E(a){a=a||{};B.fA=a.fA||0},4t:E(a){G b=a.2o(\'2d\'),1M=b.3d(0,0,a.K,a.O),1b=1M.1b,1J,gq=-B.fA*0.kV;R(G i=0,1d=1b.N;i<1d;i+=4){1J=1a.1J(1b[i],1b[i+1],1b[i+2]);1b[i]+=1J!==1b[i]?(1J-1b[i])*gq:0;1b[i+1]+=1J!==1b[i+1]?(1J-1b[i+1])*gq:0;1b[i+2]+=1J!==1b[i+2]?(1J-1b[i+2])*gq:0}b.4b(1M,0,0)},1B:E(){F 1n(B.1K(\'1B\'),{fA:B.fA})}});d.1u.1l.pw.2a=d.1u.1l.2G.2a})(1j 1E!==\'1v\'?1E:B);(E(k){\'2z 2H\';G l=k.I||(k.I={}),26=l.J.26,2m=l.1H.2m,yT=2;if(l.4W){l.4B(\'I.4W is 5k 53\');F}G m=l.1H.1i.5q.2v();m.1o(\'2E\',\'3n\',\'2h\',\'1x\',\'3p\',\'5r\',\'3N\',\'2R\',\'47\',\'5O\');G n=l.1H.1i.4g.2v();n.1o(\'2E\',\'3n\',\'2h\',\'1x\',\'3p\',\'5r\',\'3N\',\'2R\',\'47\',\'5O\',\'22\');l.4W=l.J.1z(l.1H,{aX:[\'2h\',\'3n\',\'2E\',\'3N\',\'2R\',\'1x\',\'5O\',\'5r\'],p6:/\\r?\\n/,p5:/[ \\t\\r]+/g,1p:\'1x\',2h:40,3n:\'bq\',2E:\'AX AW AV\',3p:\'\',5r:\'1g\',3N:\'\',2R:1.16,47:\'\',5q:m,4g:n,1D:1k,2w:1k,5B:0.25,8r:1.13,5O:0,2c:E(a,b){b=b||{};B.1x=a;B.gj=U;B.1K(\'2c\',b);B.gj=1f;B.9w();B.a4({7y:\'aX\'})},9w:E(a){if(B.gj){F}if(!a){a=l.J.6a().2o(\'2d\');B.9v(a)}B.2b=B.aO();B.fH();B.K=B.za(a)||B.aL||yT;B.O=B.jI(a)},3s:E(){F\'#<I.4W (\'+B.5l()+\'): { "1x": "\'+B.1x+\'", "2E": "\'+B.2E+\'" }>\'},jT:E(){G a=B.1K(\'jT\');G b=1a.6M(B.2h)*2;a.K+=b;a.O+=b;F a},58:E(a){B.9v(a);if(B.1s&&B.1s.1p===\'1Q-1s\'){a.3T(B.1g,B.1h)}B.jn(a);B.ze(a);B.j2(a)},ze:E(a){B.zg(a);B.zh(a)},9v:E(a){a.AL=\'AK\';a.3S=B.o7()},jI:E(){F B.o5()+(B.2b.N-1)*B.42()},za:E(a){G b=B.3W(a,0);R(G i=1,1d=B.2b.N;i<1d;i++){G c=B.3W(a,i);if(c>b){b=c}}F b},cv:E(a,b,c,d,e){G f=a.2P(0,-4),8u,K;if(B[f].4c){G g=-B.K/2+B[f].2O||0,2A=-B.O/2+B[f].2A||0;b.3i();b.3T(g,2A);d-=g;e-=2A}if(B.5O!==0){G h=B.6V();c=c.2S(\'\');R(G i=0,1d=c.N;i<1d;i++){8u=c[i];K=b.bu(8u).K+h;b[a](8u,d,e);d+=K>0?K:0}}P{b[a](c,d,e)}B[f].4c&&b.3f()},i1:E(a,b,c,d,e,f){e-=B.2h*B.5B;G g=B.3W(b,f);if(B.5r!==\'hV\'||B.K<g){B.cv(a,b,c,d,e,f);F}G h=c.2S(/\\s+/),6Y=0,aG=B.9q(b,h.2p(\' \'),f,0),bF=B.K-aG,9k=h.N-1,ht=9k>0?bF/9k:0,3L=0,5P;R(G i=0,1d=h.N;i<1d;i++){31(c[6Y]===\' \'&&6Y<c.N){6Y++}5P=h[i];B.cv(a,b,5P,d+3L,e,f,6Y);3L+=B.9q(b,5P,f,6Y)+ht;6Y+=5P.N}},9q:E(a,b){G c=a.bu(b).K,6m,66;if(B.5O!==0){6m=b.2S(\'\').N;66=6m*B.6V();c+=66}F c>0?c:0},b6:E(){F-B.K/2},cV:E(){F-B.O/2},9l:E(){F U},n5:E(a,b){G c=0,1g=B.b6(),1h=B.cV();R(G i=0,1d=B.2b.N;i<1d;i++){G d=B.42(a,i),7L=d/B.2R,4d=B.3W(a,i),3L=B.4V(4d);B.i1(b,a,B.2b[i],1g+3L,1h+c+7L,i);c+=d}},zg:E(a){if(!B.1A&&B.9l()){F}B.n5(a,\'g1\')},zh:E(a){if((!B.1D||B.2s===0)&&B.9l()){F}if(B.2w&&!B.2w.9O){B.b7(a)}a.3i();B.9N(a,B.2K);a.3Q();B.n5(a,\'g0\');a.5j();a.3f()},42:E(){F B.o5()*B.2R},o5:E(){F B.2h*B.8r},jn:E(a){if(!B.47){F}G b=0,5Y,4d,4A,zO=a.4F;a.4F=B.47;R(G i=0,1d=B.2b.N;i<1d;i++){5Y=B.42(a,i);4d=B.3W(a,i);if(4d>0){4A=B.4V(4d);a.6h(B.b6()+4A,B.cV()+b,4d,5Y/B.2R)}b+=5Y}a.4F=zO;B.b7(a)},4V:E(a){if(B.5r===\'1G\'){F(B.K-a)/2}if(B.5r===\'3H\'){F B.K-a}F 0},fH:E(){B.aT=[];B.fm=[]},zR:E(){G a=B.gJ;a||(a=B.jq(\'aX\'));if(a){B.b9({7y:\'aX\'});B.6b=U}F a},3W:E(a,b){if(B.aT[b]){F B.aT[b]===-1?B.K:B.aT[b]}G c,mq,2r=B.2b[b];if(2r===\'\'){c=0}P{c=B.mh(a,b)}B.aT[b]=c;if(c&&B.5r===\'hV\'){mq=2r.2S(/\\s+/);if(mq.N>1){B.aT[b]=-1}}F c},6V:E(){if(B.5O!==0){F B.2h*B.5O/bA}F 0},mh:E(a,b){G c=B.2b[b],K=a.bu(c).K,66=0,6m,gv;if(B.5O!==0){6m=c.2S(\'\').N;66=(6m-1)*B.6V()}gv=K+66;F gv>0?gv:0},j2:E(b){if(!B.3p){F}G c=B.O/2,2I=B,62=[];E zX(a){G i,2R=0,1d,j,lX,4d,4A,5Y;R(i=0,1d=2I.2b.N;i<1d;i++){4d=2I.3W(b,i);4A=2I.4V(4d);5Y=2I.42(b,i);R(j=0,lX=a.N;j<lX;j++){b.6h(2I.b6()+4A,2R+(2I.8r-1+a[j])*2I.2h-c,4d,2I.2h/15)}2R+=5Y}}if(B.3p.2Z(\'lW\')>-1){62.1o(0.85)}if(B.3p.2Z(\'2r-lR\')>-1){62.1o(0.43)}if(B.3p.2Z(\'ly\')>-1){62.1o(-0.12)}if(62.N>0){zX(62)}},o7:E(){F[(l.7d?B.3n:B.3N),(l.7d?B.3N:B.3n),B.2h+\'px\',(l.7d?(\'"\'+B.2E+\'"\'):B.2E)].2p(\' \')},4I:E(a,b){if(!B.4X){F}if(B.zR()){B.9v(a);B.9w(a)}B.1K(\'4I\',a,b)},aO:E(){F B.1x.2S(B.p6)},1B:E(a){G b=[\'1x\',\'2h\',\'3n\',\'2E\',\'3N\',\'2R\',\'3p\',\'5r\',\'47\',\'5O\'].2v(a);F B.1K(\'1B\',b)},3D:E(a){if(!B.1O){B.1O=l.J.6a().2o(\'2d\')}G b=B.6s(),62=B.A4(B.1O),A5=B.A6(62.j6,62.iV);B.A9(b,A5);F a?a(b.2p(\'\')):b.2p(\'\')},A4:E(a){G b=B.42(a,0),iV=-B.K/2,j6=0;F{iV:iV+(B.1s&&B.1s.1p===\'1Q-1s\'?B.1g:0),j6:j6+(B.1s&&B.1s.1p===\'1Q-1s\'?-B.1h:0),iU:b}},A9:E(a,b){G c=U,44=B.az(),1L=44===\'\'?\'\':\' 1L="\'+44+\'"\';a.1o(\'\\t<g \',B.6F(),\'23="\',B.61(),B.6y(),\'"\',1L,\'>\\n\',b.9T.2p(\'\'),\'\\t\\t<1x \',(B.2E?\'3S-fG="\'+B.2E.2M(/"/g,\'\\\'\')+\'" \':\'\'),(B.2h?\'3S-9B="\'+B.2h+\'" \':\'\'),(B.3N?\'3S-1L="\'+B.3N+\'" \':\'\'),(B.3n?\'3S-3G="\'+B.3n+\'" \':\'\'),(B.3p?\'1x-8B="\'+B.3p+\'" \':\'\'),\'1L="\',B.5C(c),\'" >\\n\',b.Ab.2p(\'\'),\'\\t\\t</1x>\\n\',\'\\t</g>\\n\')},A6:E(a,b){G c=[],9T=[],O=0;B.Aa(9T);R(G i=0,1d=B.2b.N;i<1d;i++){if(B.47){B.A8(9T,i,b,a,O)}B.iP(i,c,O,b,a,9T);O+=B.42(B.1O,i)}F{Ab:c,9T:9T}},iP:E(i,a,b,c,d){G e=B.2h*(B.8r-B.5B)-d+b-B.O/2;if(B.5r===\'hV\'){B.A0(i,a,e,c);F}a.1o(\'\\t\\t\\t<b5 x="\',26(c+B.4V(B.3W(B.1O,i)),2m),\'" \',\'y="\',26(e,2m),\'" \',B.ea(B.1A),\'>\',l.J.2N.bf(B.2b[i]),\'</b5>\\n\')},A0:E(i,a,b,c){G d=l.J.6a().2o(\'2d\');B.9v(d);G e=B.2b[i],91=e.2S(/\\s+/),aG=B.9q(d,91.2p(\'\')),bF=B.K-aG,9k=91.N-1,ht=9k>0?bF/9k:0,5P,gG=B.ea(B.1A),1d;c+=B.4V(B.3W(d,i));R(i=0,1d=91.N;i<1d;i++){5P=91[i];a.1o(\'\\t\\t\\t<b5 x="\',26(c,2m),\'" \',\'y="\',26(b,2m),\'" \',gG,\'>\',l.J.2N.bf(5P),\'</b5>\\n\');c+=B.9q(d,5P)+ht}},A8:E(a,i,b,c,d){a.1o(\'\\t\\t<5i \',B.ea(B.47),\' x="\',26(b+B.4V(B.3W(B.1O,i)),2m),\'" y="\',26(d-B.O/2,2m),\'" K="\',26(B.3W(B.1O,i),2m),\'" O="\',26(B.42(B.1O,i)/B.2R,2m),\'"></5i>\\n\')},Aa:E(a){if(B.3w){a.1o(\'\\t\\t<5i \',B.ea(B.3w),\' x="\',26(-B.K/2,2m),\'" y="\',26(-B.O/2,2m),\'" K="\',26(B.K,2m),\'" O="\',26(B.O,2m),\'"></5i>\\n\')}},ea:E(a){G b=(a&&1j a===\'2N\')?1c l.2e(a):\'\';if(!b||!b.4m()||b.82()===1){F\'1A="\'+a+\'"\'}F\'1V="\'+b.82()+\'" 1A="\'+b.cM(1).fK()+\'"\'},3I:E(a,b){B.1K(\'3I\',a,b);if(B.aX.2Z(a)>-1){B.9w();B.3C()}},5l:E(){F 1}});l.4W.4x=l.8b.2v(\'x y dx dy 3S-fG 3S-1L 3S-3G 3S-9B 1x-8B 1x-yP\'.2S(\' \'));l.4W.hi=16;l.4W.5X=E(a,b){if(!a){F 1k}G c=l.78(a,l.4W.4x);b=l.J.1m.1n((b?l.J.1m.3m(b):{}),c);b.1h=b.1h||0;b.1g=b.1g||0;if(\'dx\'in c){b.1g+=c.dx}if(\'dy\'in c){b.1h+=c.dy}if(!(\'2h\'in b)){b.2h=l.4W.hi}if(!b.1T){b.1T=\'1g\'}G d=\'\';if(!(\'lP\'in a)){if(\'76\'in a&&a.76!==1k){if(\'1b\'in a.76&&a.76.1b!==1k){d=a.76.1b}}}P{d=a.lP}d=d.2M(/^\\s+|\\s+$|\\n+/g,\'\').2M(/\\s+/g,\' \');G e=1c l.4W(d,b),zP=e.63()/e.O,zL=(e.O+e.2s)*e.2R-e.O,zJ=zL*zP,zI=e.63()+zJ,ik=0;if(e.1T===\'1g\'){ik=e.5V()/2}if(e.1T===\'3H\'){ik=-e.5V()/2}e.1F({1g:e.pH()+ik,1h:e.pG()-zI/2+e.2h*(0.18+e.5B)/e.2R});F e};l.4W.2a=E(a,b,c){F l.1H.6I(\'4W\',a,b,c,\'1x\')};l.J.mw(l.4W)})(1j 1E!==\'1v\'?1E:B);(E(){G k=I.J.1m.3m;I.6E=I.J.1z(I.4W,I.bV,{1p:\'i-1x\',1w:0,1R:0,d5:\'7P(17,Aq,2x,0.3)\',4y:1f,hM:U,zH:\'7P(qI,qH,2x,0.25)\',aL:2,zG:\'#Au\',zF:bA,kX:b4,22:1k,hB:U,bv:/\\s|\\n/,8U:0,4U:1k,AA:1f,du:[],2c:E(a,b){B.22=b?(b.22||{}):{};B.1K(\'2c\',a,b);B.zy()},fH:E(){B.1K(\'fH\');B.du=[]},9l:E(){if(!B.22){F U}G a=B.22;R(G b in a){R(G c in a[b]){R(G d in a[b][c]){F 1f}}}F U},gL:E(a){a=1a.1J(a,0);B.kp(\'1w\',a)},zw:E(a){a=1a.2n(a,B.1x.N);B.kp(\'1R\',a)},kp:E(a,b){if(B[a]!==b){B.71();B[a]=b}B.70()},71:E(){B.1U(\'4H:cG\');B.W&&B.W.1U(\'1x:4H:cG\',{1q:B})},qx:E(a,b){if(2Q.N===2){G c=[];R(G i=a;i<b;i++){c.1o(B.qx(i))}F c}G d=B.5N(a),1L=B.5M(d.1S,d.2j);F 1L||{}},AN:E(a){if(B.1w===B.1R){B.qa(B.1w,a)}P{R(G i=B.1w;i<B.1R;i++){B.qa(i,a)}}B.gJ=U;F B},qa:E(a,b){G c=B.5N(a);if(!B.bI(c.1S)){B.hh(c.1S,{})}if(!B.5M(c.1S,c.2j)){B.q5(c.1S,c.2j,{})}I.J.1m.1n(B.5M(c.1S,c.2j),b)},9w:E(a){if(!a){B.dN()}B.1K(\'9w\',a)},4I:E(a,b){B.dN();B.1K(\'4I\',a,b);B.a3={};B.9g()},58:E(a){B.1K(\'58\',a);B.1O=a},dN:E(){if(!B.3z||!B.4y){F}if(B.W&&B.W.3o){G a=B.W.3o;a.3i();a.23.2W(a,B.W.3c);B.23(a);B.4l&&a.23.2W(a,B.4l);B.pU(a);a.3f()}},9g:E(){if(!B.3z||!B.4y){F}G a=B.1x.2S(\'\'),6f,1O;if(B.W&&B.W.3o){1O=B.W.3o;1O.3i();1O.23.2W(1O,B.W.3c);B.23(1O);B.4l&&1O.23.2W(1O,B.4l);B.pU(1O)}P{1O=B.1O;1O.3i()}if(B.1w===B.1R){6f=B.iS(a,\'er\');B.yV(6f,1O)}P{6f=B.iS(a,\'4H\');B.yU(a,6f,1O)}1O.3f()},pU:E(a){G b=B.K+4,O=B.O+4;a.a5(-b/2,-O/2,b,O)},5N:E(a){if(1j a===\'1v\'){a=B.1w}G b=B.2b.N;R(G i=0;i<b;i++){if(a<=B.2b[i].N){F{1S:i,2j:a}}a-=B.2b[i].N+1}F{1S:i-1,2j:B.2b[i-1].N<a?B.2b[i-1].N:a}},oV:E(a,b){G c=B.5M(a,b===0?0:b-1);F{2h:c&&c.2h||B.2h,1A:c&&c.1A||B.1A,47:c&&c.47||B.47,3p:c&&c.3p||B.3p,2E:c&&c.2E||B.2E,3n:c&&c.3n||B.3n,3N:c&&c.3N||B.3N,1D:c&&c.1D||B.1D,2s:c&&c.2s||B.2s}},eY:E(a,b){G c=B.5M(a,b===0?0:b-1);F c&&c.2h?c.2h:B.2h},yQ:E(a,b){G c=B.5M(a,b===0?0:b-1);F c&&c.1A?c.1A:B.zG},iS:E(a,b){G c=1a.4o(B.b6()),1h=B.cV(),62=B.ob(a,b);F{1g:c,1h:1h,3L:62.1g+62.o0,6L:62.1h}},ob:E(a,b){if(B.a3&&\'1h\'in B.a3){F B.a3}G c=0,1S=0,2j=0,6L=0,3L=0,6f;R(G i=0;i<B.1w;i++){if(a[i]===\'\\n\'){3L=0;6L+=B.42(B.1O,1S);1S++;2j=0}P{3L+=B.5G(B.1O,a[i],1S,2j);2j++}c=B.4V(B.3W(B.1O,1S))}if(b===\'er\'){6L+=(1-B.5B)*B.42(B.1O,1S)/B.2R-B.eY(1S,2j)*(1-B.5B)}if(B.5O!==0&&2j===B.2b[1S].N){3L-=B.6V()}6f={1h:6L,1g:3L>0?3L:0,o0:c};B.a3=6f;F B.a3},yV:E(a,b){if(!B.W)F;G c=B.5N(),1S=c.1S,2j=c.2j,6P=B.eY(1S,2j),3L=(1S===0&&2j===0)?B.4V(B.3W(b,1S)):a.3L,cc=B.1r*B.W.bs(),aL=B.aL/cc;b.4F=B.yQ(1S,2j);b.cS=B.fI?1:B.8U;b.6h(a.1g+3L-aL/2,a.1h+a.6L,aL,6P)},yU:E(a,b,c){c.4F=B.d5;G d=B.5N(B.1w),7f=B.5N(B.1R),gu=d.1S,aJ=7f.1S;R(G i=gu;i<=aJ;i++){G e=B.4V(B.3W(c,i))||0,2R=B.42(B.1O,i),n8=0,8S=0,2r=B.2b[i];if(i===gu){R(G j=0,1d=2r.N;j<1d;j++){if(j>=d.2j&&(i!==aJ||j<7f.2j)){8S+=B.5G(c,2r[j],i,j)}if(j<d.2j){e+=B.5G(c,2r[j],i,j)}}if(j===2r.N){8S-=B.6V()}}P if(i>gu&&i<aJ){8S+=B.3W(c,i)||5}P if(i===aJ){R(G f=0,yD=7f.2j;f<yD;f++){8S+=B.5G(c,2r[f],i,f)}if(7f.2j===2r.N){8S-=B.6V()}}n8=2R;if(B.2R<1||(i===aJ&&B.2R>1)){2R/=B.2R}c.6h(b.1g+e,b.1h+b.6L,8S>0?8S:0,2R);b.6L+=n8}},cv:E(a,b,c,d,e,f,g){if(B.9l()){F B.yB(a,b,c,d,e)}g=g||0;G h=B.42(b,f),fP,h0,g3=\'\';b.3i();e-=h/B.2R*B.5B;R(G i=g,1d=c.N+g;i<=1d;i++){fP=fP||B.oV(f,i);h0=B.oV(f,i+1);if(B.yz(fP,h0)||i===1d){B.yy(a,b,f,i-1,g3,d,e,h);g3=\'\';fP=h0}g3+=c[i-g]}b.3f()},yB:E(a,b,c,d,e){if(a===\'g1\'&&B.1A){B.1K(\'cv\',a,b,c,d,e)}if(a===\'g0\'&&((B.1D&&B.2s>0)||B.Bi)){B.1K(\'cv\',a,b,c,d,e)}},yy:E(a,b,c,i,d,e,f,g){G h,6P,bN,aR,7F=B.5M(c,i),24,3p,h6,66,hw;if(7F){6P=B.iT(b,d,c,i);aR=7F.1D;bN=7F.1A;3p=7F.3p}P{6P=B.2h}aR=(aR||B.1D)&&a===\'g0\';bN=(bN||B.1A)&&a===\'g1\';7F&&b.3i();h=B.lL(b,d,c,i,7F||1k);3p=3p||B.3p;if(7F&&7F.47){B.b7(b)}if(B.5O!==0){66=B.6V();h6=d.2S(\'\');h=0;R(G j=0,1d=h6.N,8u;j<1d;j++){8u=h6[j];bN&&b.g1(8u,e+h,f);aR&&b.g0(8u,e+h,f);hw=b.bu(8u).K+66;h+=hw>0?hw:0}}P{bN&&b.g1(d,e,f);aR&&b.g0(d,e,f)}if(3p||3p!==\'\'){24=B.5B*g/B.2R;B.yq(b,3p,e,f,24,h,6P)}7F&&b.3f();b.3T(h,0)},yz:E(a,b){F(a.1A!==b.1A||a.2h!==b.2h||a.47!==b.47||a.3p!==b.3p||a.2E!==b.2E||a.3n!==b.3n||a.3N!==b.3N||a.1D!==b.1D||a.2s!==b.2s)},yq:E(a,b,c,d,e,f,g){if(!b){F}G h=g/15,yp={lW:d+g/10,\'2r-lR\':d-g*(B.5B+B.8r-1)+h,ly:d-(B.8r-B.5B)*g},lI=[\'lW\',\'2r-lR\',\'ly\'],i,8B;R(i=0;i<lI.N;i++){8B=lI[i];if(b.2Z(8B)>-1){a.6h(c,yp[8B],f,h)}}},i1:E(a,b,c,d,e,f){if(!B.9l()){e+=B.2h*(B.5B+0.Bt)}B.1K(\'i1\',a,b,c,d,e,f)},j2:E(a){if(B.9l()){F B.1K(\'j2\',a)}},jn:E(a){B.1K(\'jn\',a);G b=0,5Y,4d,4A,3L=B.b6(),6L=B.cV(),8D=\'\',2r,4S,1L,8I,9x,7N,7O;a.3i();R(G i=0,1d=B.2b.N;i<1d;i++){5Y=B.42(a,i);2r=B.2b[i];if(2r===\'\'||!B.22||!B.bI(i)){b+=5Y;3t}4d=B.3W(a,i);4A=B.4V(4d);8I=9x=7N=7O=0;R(G j=0,4O=2r.N;j<4O;j++){1L=B.5M(i,j)||{};if(8D!==1L.47){if(7O&&7N){a.4F=8D;a.6h(8I,9x,7N,7O)}8I=9x=7N=7O=0;8D=1L.47||\'\'}if(!1L.47){8D=\'\';3t}4S=2r[j];if(8D===1L.47){8D=1L.47;if(!8I){8I=3L+4A+B.kz(a,i,j)}9x=6L+b;7N+=B.5G(a,4S,i,j);7O=5Y/B.2R}}if(7O&&7N){a.4F=8D;a.6h(8I,9x,7N,7O);8I=9x=7N=7O=0}b+=5Y}a.3f()},ym:E(a,b){F a+b.2h+b.3n+b.3N},yl:E(a){if(!I.6j[a]){I.6j[a]={}}F I.6j[a]},lL:E(a,b,c,d,e){G f=e||B.5M(c,d),3Z=k(f),K,9y,6j;B.ye(3Z);6j=B.yl(3Z.2E);9y=B.ym(b,3Z);if(!f&&6j[9y]&&B.hB){F 6j[9y]}if(1j 3Z.2w===\'2N\'){3Z.2w=1c I.6o(3Z.2w)}G g=3Z.1A||B.1A;a.4F=g.4c?g.4c(a,B):g;if(3Z.1D){a.6t=(3Z.1D&&3Z.1D.4c)?3Z.1D.4c(a,B):3Z.1D}a.4d=3Z.2s||B.2s;a.3S=B.o7.1W(3Z);if(3Z.2w){3Z.1r=B.1r;3Z.1t=B.1t;3Z.W=B.W;3Z.ax=B.ax;B.ar.1W(3Z,a)}if(!B.hB||!6j[9y]){K=a.bu(b).K;B.hB&&(6j[9y]=K);F K}F 6j[9y]},ye:E(a){if(!a.2E){a.2E=B.2E}if(!a.2h){a.2h=B.2h}if(!a.3n){a.3n=B.3n}if(!a.3N){a.3N=B.3N}},5M:E(a,b,c){if(c){F(B.22[a]&&B.22[a][b])?k(B.22[a][b]):{}}F B.22[a]&&B.22[a][b]?B.22[a][b]:1k},q5:E(a,b,c){B.22[a][b]=c},yd:E(a,b){2Y B.22[a][b]},bI:E(a){F B.22[a]},hh:E(a,b){B.22[a]=b},yb:E(a){2Y B.22[a]},5G:E(a,b,c,d){if(!B.km&&B.5r===\'hV\'&&B.p5.3a(b)){F B.y9(a,c)}a.3i();G e=B.lL(a,b,c,d);if(B.5O!==0){e+=B.6V()}a.3f();F e>0?e:0},iT:E(a,b,c){G d=B.5M(b,c);F d&&d.2h?d.2h:B.2h},kz:E(a,b,c){G d=0,i,4S;R(i=0;i<c;i++){4S=B.2b[b][i];d+=B.5G(a,4S,b,i)}F d},mh:E(a,b){B.km=U;G c=B.kz(a,b,B.2b[b].N);if(B.5O!==0){c-=B.6V()}B.km=1f;F c>0?c:0},y9:E(a,b){if(B.du[b]){F B.du[b]}G c=B.2b[b],aG=B.9q(a,c,b,0),bF=B.K-aG,9k=c.N-c.2M(B.p5,\'\').N,K=1a.1J(bF/9k,a.bu(\' \').K);B.du[b]=K;F K},9q:E(a,b,c,d){G e=0;R(G f=0;f<b.N;f++){G g=b[f];if(!g.3K(/\\s/)){e+=B.5G(a,g,c,f+d)}}F e},42:E(a,b){if(B.fm[b]){F B.fm[b]}G c=B.2b[b],7L=B.iT(a,b,0);R(G i=1,1d=c.N;i<1d;i++){G d=B.iT(a,b,i);if(d>7L){7L=d}}B.fm[b]=7L*B.2R*B.8r;F B.fm[b]},jI:E(a){G b,O=0;R(G i=0,1d=B.2b.N;i<1d;i++){b=B.42(a,i);O+=(i===1d-1?b/B.2R:b)}F O},1B:E(a){F I.J.1m.1n(B.1K(\'1B\',a),{22:k(B.22,U)})}});I.6E.2a=E(a,b,c){F I.1H.6I(\'6E\',a,b,c,\'1x\')}})();(E(){G j=I.J.1m.3m;I.J.1m.1n(I.6E.1i,{zy:E(){B.y8();B.y6();B.xY();B.xW();B.fq=B.fq.3l(B)},9H:E(){B.4y&&B.aA();B.7e=1f},y8:E(){G b=B;B.on(\'nC\',E(){G a=b.W;if(a){if(!a.dO){a.dO=U;b.xV(a)}a.6r=a.6r||[];a.6r.1o(b)}})},y6:E(){G b=B;B.on(\'5g\',E(){G a=b.W;if(a){a.6r=a.6r||[];I.J.6i(a.6r,b);if(a.6r.N===0){a.dO=1f;b.xU(a)}}})},xV:E(b){b.hd=(E(){if(b.6r){b.6r.4j(E(a){a.fI=1f})}}).3l(B);b.on(\'5Z:up\',b.hd)},xU:E(a){a.fS(\'5Z:up\',a.hd)},hS:E(){B.bB=B.qM(B,1,B.kX,\'xQ\')},qM:E(a,b,c,d){G e;e={aI:1f,7H:E(){B.aI=U},};a.6X(\'8U\',b,{6e:c,3j:E(){if(!e.aI){a[d]()}},3E:E(){if(a.W&&a.1w===a.1R){a.9g()}},7H:E(){F e.aI}});F e},xQ:E(){G a=B;if(B.hk){q3(B.hk)}B.hk=ft(E(){a.cj=a.qM(a,0,B.kX/2,\'hS\')},3h)},d7:E(a){G b=B,xJ=a?0:B.zF;B.cz();B.8U=1;B.xI=ft(E(){b.hS()},xJ)},cz:E(){G a=B.bB||B.cj;B.bB&&B.bB.7H();B.cj&&B.cj.7H();q3(B.hk);q3(B.xI);B.8U=0;if(a){B.W&&B.W.5Q(B.W.3o||B.1O)}},xE:E(){B.1w=0;B.1R=B.1x.N;B.71();B.70()},pA:E(){F B.1x.2P(B.1w,B.1R)},xD:E(a){G b=0,2l=a-1;if(B.bv.3a(B.1x.3J(2l))){31(B.bv.3a(B.1x.3J(2l))){b++;2l--}}31(/\\S/.3a(B.1x.3J(2l))&&2l>-1){b++;2l--}F a-b},C4:E(a){G b=0,2l=a;if(B.bv.3a(B.1x.3J(2l))){31(B.bv.3a(B.1x.3J(2l))){b++;2l++}}31(/\\S/.3a(B.1x.3J(2l))&&2l<B.1x.N){b++;2l++}F a+b},pz:E(a){G b=0,2l=a-1;31(!/\\n/.3a(B.1x.3J(2l))&&2l>-1){b++;2l--}F a-b},xB:E(a){G b=0,2l=a;31(!/\\n/.3a(B.1x.3J(2l))&&2l<B.1x.N){b++;2l++}F a+b},C7:E(){G a=B.pA(),pu=0;R(G i=0,1d=a.N;i<1d;i++){if(a[i]===\'\\n\'){pu++}}F pu},ps:E(a,b){G c=B.bv.3a(B.1x.3J(a))?a-1:a,4S=B.1x.3J(c),pm=/[ \\n\\.,;!\\?\\-]/;31(!pm.3a(4S)&&c>0&&c<B.1x.N){c+=b;4S=B.1x.3J(c)}if(pm.3a(4S)&&4S!==\'\\n\'){c+=b===1?0:1}F c},xz:E(a){a=a||B.1w;G b=B.ps(a,-1),k4=B.ps(a,1);B.1w=b;B.1R=k4;B.71();B.70();B.9g()},xx:E(a){a=a||B.1w;G b=B.pz(a),k4=B.xB(a);B.1w=b;B.1R=k4;B.71();B.70()},xw:E(e){if(B.4y||!B.hM){F}if(B.W){B.xt(B.W)}B.4y=U;B.xs(e);B.32.xq();B.70();B.xp();B.xo();B.xm=B.1x;B.hS();B.1U(\'gH:xk\');B.71();if(!B.W){F B}B.W.1U(\'1x:gH:xk\',{1q:B});B.xj();B.W.2u();F B},xt:E(b){if(b.6r){b.6r.4j(E(a){a.7e=1f;if(a.4y){a.aA()}})}},xj:E(){B.W.on(\'5Z:co\',B.fq)},fq:E(a){if(!B.fI||!B.4y){F}G b=B.ep(a.e),h2=B.1w,h8=B.1R;if((b!==B.e4||h2===h8)&&(h2===b||h8===b)){F}if(b>B.e4){B.1w=B.e4;B.1R=b}P{B.1w=b;B.1R=B.e4}if(B.1w!==h2||B.1R!==h8){B.o9();B.71();B.70();B.9g()}},xo:E(){B.8G=\'1x\';if(B.W){B.W.8c=B.W.7A=\'1x\'}B.92=B.zH;B.6D=B.7G=1f;B.9f=B.9e=U},70:E(){if(!B.32||B.gO){F}B.a3={};B.32.4M=B.1x;B.32.1w=B.1w;B.32.1R=B.1R;if(B.1w===B.1R){G a=B.nN();B.32.1L.1g=a.1g;B.32.1L.1h=a.1h;B.32.1L.2h=a.2h}},nN:E(){if(!B.W){F{x:1,y:1}}G a=B.1x.2S(\'\'),6f=B.iS(a,\'er\'),4z=B.5N(),1S=4z.1S,2j=4z.2j,6P=B.eY(1S,2j),3L=(1S===0&&2j===0)?B.4V(B.3W(B.1O,1S)):6f.3L,m=B.bP(),p={x:6f.1g+3L,y:6f.1h+6f.6L+6P},nK=B.W.2k,nG=nK.K-6P,7L=nK.O-6P;p=I.J.4w(p,m);p=I.J.4w(p,B.W.3c);if(p.x<0){p.x=0}if(p.x>nG){p.x=nG}if(p.y<0){p.y=0}if(p.y>7L){p.y=7L}p.x+=B.W.e6.1g;p.y+=B.W.e6.1h;F{1g:p.x+\'px\',1h:p.y+\'px\',2h:6P}},xp:E(){B.8t={6D:B.6D,92:B.92,9f:B.9f,9e:B.9e,8G:B.8G,8c:B.W&&B.W.8c,7A:B.W&&B.W.7A}},x9:E(){if(!B.8t){F}B.8G=B.8t.CB;B.6D=B.8t.6D;B.92=B.8t.92;B.9f=B.8t.9f;B.9e=B.8t.9e;if(B.W){B.W.8c=B.8t.8c;B.W.7A=B.8t.7A}},aA:E(){G a=(B.xm!==B.1x);B.7e=1f;B.4y=1f;B.7G=U;B.1R=B.1w;if(B.32){B.32.5R&&B.32.5R();B.W&&B.32.4K.oo(B.32);B.32=1k}B.cz();B.x9();B.8U=0;B.1U(\'gH:x8\');a&&B.1U(\'jr\');if(B.W){B.W.fS(\'5Z:co\',B.fq);B.W.1U(\'1x:gH:x8\',{1q:B});a&&B.W.1U(\'1m:jr\',{1q:B})}F B},nD:E(){R(G a in B.22){if(!B.2b[a]){2Y B.22[a]}}},fQ:E(a,b){31(b!==a){B.nn(a+1);b--}B.1w=a;B.1R=a},nn:E(a){G b=B.1x[a-1]===\'\\n\',x7=b?a:a-1;B.nm(b,x7);B.1x=B.1x.2P(0,a-1)+B.1x.2P(a);B.2b=B.aO()},fT:E(a,b){G c;if(B.1R-B.1w>1){B.fQ(B.1w,B.1R)}if(!b&&B.9l()){B.mZ(a,1f);F}R(G i=0,1d=a.N;i<1d;i++){if(b){c=I.J.1m.3m(I.mQ[i],U)}B.mZ(a[i],i<1d-1,c)}},mZ:E(a,b,c){G d=B.1x[B.1w]===\'\\n\';B.1x=B.1x.2P(0,B.1w)+a+B.1x.2P(B.1R);B.2b=B.aO();B.x3(a,d,c);B.1w+=a.N;B.1R=B.1w;if(b){F}B.70();B.3C();B.71();B.1U(\'cG\');B.o9();if(B.W){B.W.1U(\'1x:cG\',{1q:B});B.W.2u()}},o9:E(){if(!B.bB||B.bB.aI||!B.cj||B.cj.aI){B.d7()}},hr:E(a,b,c){B.hs(a,+1);if(!B.22[a+1]){B.22[a+1]={}}G d={},fM={};if(B.22[a]&&B.22[a][b-1]){d=B.22[a][b-1]}if(c){fM[0]=j(d);B.22[a+1]=fM}P{R(G e in B.22[a]){if(3r(e,10)>=b){fM[3r(e,10)-b]=B.22[a][e];2Y B.22[a][e]}}B.22[a+1]=fM}B.gJ=U},g7:E(a,b,c){G d=B.22[a],hf=j(d);if(b===0&&!c){b=1}R(G e in hf){G f=3r(e,10);if(f>=b){d[f+1]=hf[f];if(!hf[f-1]){2Y d[f]}}}B.22[a][b]=c||j(d[b-1]);B.gJ=U},x3:E(a,b,c){G d=B.5N(),1S=d.1S,2j=d.2j;if(!B.bI(1S)){B.hh(1S,{})}if(a===\'\\n\'){B.hr(1S,2j,b)}P{B.g7(1S,2j,c)}},hs:E(a,b){G c=j(B.22);R(G d in B.22){G e=3r(d,10);if(e>a){B.22[e+b]=c[e];if(!c[e-b]){2Y B.22[e]}}}},nm:E(a,b){G c=B.5N(b),1S=c.1S,2j=c.2j;B.lh(a,c,1S,2j)},ku:E(a){F B.2b[a-1]},lh:E(a,b,c,d){if(a){G e=B.ku(b.1S),wM=e?e.N:0;if(!B.22[c-1]){B.22[c-1]={}}R(d in B.22[c]){B.22[c-1][3r(d,10)+wM]=B.22[c][d]}B.hs(b.1S,-1)}P{G f=B.22[c];if(f){2Y f[d]}G g=j(f);R(G i in g){G h=3r(i,10);if(h>=d&&h!==0){f[h-1]=g[h];2Y f[h]}}}},wL:E(){B.fT(\'\\n\')},kt:E(a,b,c){if(c<=a){if(b===a){B.4U=\'1g\'}P if(B.4U===\'3H\'){B.4U=\'1g\';B.1R=a}B.1w=c}P if(c>a&&c<b){if(B.4U===\'3H\'){B.1R=c}P{B.1w=c}}P{if(b===a){B.4U=\'3H\'}P if(B.4U===\'1g\'){B.4U=\'3H\';B.1w=b}B.1R=c}},wI:E(){G a=B.1x.N;if(B.1w>a){B.1w=a}P if(B.1w<0){B.1w=0}if(B.1R>a){B.1R=a}P if(B.1R<0){B.1R=0}}})})();I.J.1m.1n(I.6E.1i,{xW:E(){B.cp=+1c dE();B.kk=+1c dE();B.cs={};B.on(\'cu\',B.cB.3l(B))},cB:E(a){if(!B.W)F;B.hE=+1c dE();G b=B.W.48(a.e);if(B.wC(b)){B.1U(\'wz\',a);B.qB(a.e)}P if(B.wy(b)){B.1U(\'wm\',a);B.qB(a.e)}B.kk=B.cp;B.cp=B.hE;B.cs=b;B.wl=B.4y;B.wk=B.7e},wy:E(a){F B.hE-B.cp<a0&&B.cs.x===a.x&&B.cs.y===a.y&&B.wl},wC:E(a){F B.hE-B.cp<a0&&B.cp-B.kk<a0&&B.cs.x===a.x&&B.cs.y===a.y},qB:E(e){e.7R&&e.7R();e.j9&&e.j9()},xY:E(){B.wa();B.w6();B.vZ()},vZ:E(){B.on(\'wm\',E(a){B.xz(B.ep(a.e))});B.on(\'wz\',E(a){B.xx(B.ep(a.e))})},wa:E(){B.on(\'cu\',E(a){if(!B.hM||!B.W){F}G b=B.W.48(a.e);B.vX=b.x;B.vW=b.y;B.fI=U;if(B.7e){B.vV(a.e)}if(B.4y){B.e4=B.1w;if(B.1w===B.1R){B.cz()}B.9g()}})},vU:E(e){if(!B.W)F 1f;G a=B.W.48(e);F B.vX!==a.x||B.vW!==a.y},w6:E(){B.on(\'pa\',E(a){B.fI=1f;if(!B.hM||B.vU(a.e)){F}if(B.wk&&!B.fp){B.xw(a.e);if(B.1w===B.1R){B.d7(U)}P{B.9g()}}B.7e=U})},vV:E(e){G a=B.ep(e),9F=B.1w,7f=B.1R;if(e.6N){B.kt(9F,7f,a)}P{B.1w=a;B.1R=a}if(B.4y){B.71();B.70()}},ep:E(e){G a=B.s2(e),hH=0,K=0,O=0,2j=0,95,2r;R(G i=0,1d=B.2b.N;i<1d;i++){2r=B.2b[i];O+=B.42(B.1O,i)*B.1t;G b=B.3W(B.1O,i),4A=B.4V(b);K=4A*B.1r;R(G j=0,4O=2r.N;j<4O;j++){hH=K;K+=B.5G(B.1O,2r[j],i,B.4N?4O-j:j)*B.1r;if(O<=a.y||K<=a.x){2j++;3t}F B.eL(a,hH,K,2j+i,4O)}if(a.y<O){F B.eL(a,hH,K,2j+i-1,4O)}}if(1j 95===\'1v\'){F B.1x.N}},eL:E(a,b,c,d,e){G f=a.x-b,vM=c-a.x,24=vM>f?0:1,95=d+24;if(B.4N){95=e-95}if(95>B.1x.N){95=B.1x.N}F 95}});I.J.1m.1n(I.6E.1i,{xs:E(){B.32=I.2X.69(\'Dh\');B.32.5H(\'Di\',\'fS\');G a=B.nN();B.32.1L.hy=\'9U: sW; 1h: \'+a.1h+\'; 1g: \'+a.1g+\';\'+\' 1V: 0; K: vL; O: vL; z-2l: -Dk;\';I.2X.8v.9j(B.32);I.J.2V(B.32,\'Dl\',B.vK.3l(B));I.J.2V(B.32,\'Dn\',B.vJ.3l(B));I.J.2V(B.32,\'Dp\',B.vH.3l(B));I.J.2V(B.32,\'eG\',B.eG.3l(B));I.J.2V(B.32,\'iM\',B.iM.3l(B));I.J.2V(B.32,\'ow\',B.ow.3l(B));I.J.2V(B.32,\'Du\',B.vA.3l(B));I.J.2V(B.32,\'Dw\',B.vx.3l(B));I.J.2V(B.32,\'Dy\',B.vw.3l(B));if(!B.vv&&B.W){I.J.2V(B.W.2k,\'DB\',B.vu.3l(B));B.vv=U}},ov:{8:\'j1\',9:\'aA\',27:\'aA\',13:\'wL\',33:\'nU\',34:\'nS\',35:\'jZ\',36:\'nb\',37:\'nb\',38:\'nU\',39:\'jZ\',40:\'nS\',46:\'v7\'},n1:{67:\'eG\',88:\'iM\'},mR:{65:\'xE\'},vu:E(){B.32&&B.32.xq()},vK:E(e){if(!B.4y){F}if(e.6A in B.ov){B[B.ov[e.6A]](e)}P if((e.6A in B.mR)&&(e.uM||e.bc)){B[B.mR[e.6A]](e)}P{F}e.gr();e.7R();if(e.6A>=33&&e.6A<=40){B.dN();B.9g()}P{B.W&&B.W.2u()}},vJ:E(e){if(!B.4y||B.mo){B.mo=1f;F}if((e.6A in B.n1)&&(e.uM||e.bc)){B[B.n1[e.6A]](e)}P{F}e.gr();e.7R();B.W&&B.W.2u()},vH:E(e){if(!B.4y||B.gO){F}G a=B.1w||0,me=B.1R||0,gD=B.1x.N,gE=B.32.4M.N,aQ,gM,9F;if(gE>gD){9F=B.4U===\'1g\'?me:a;aQ=gE-gD;gM=B.32.4M.2P(9F,9F+aQ)}P{aQ=gE-gD+me-a;gM=B.32.4M.2P(a,a+aQ)}B.fT(gM);e.j9()},vA:E(){B.gO=U;B.ko=0;B.kh=B.1w},vw:E(){B.gO=1f},vx:E(e){G a=e.1b;B.1w=B.kh;B.1R=B.1R===B.1w?B.kh+B.ko:B.1R;B.fT(a,1f);B.ko=a.N},v7:E(e){if(B.1w===B.1R){if(B.1w===B.1x.N){F}B.jZ(e)}B.j1(e)},eG:E(e){if(B.1w===B.1R){F}G a=B.pA(),8V=B.qL(e);if(8V){8V.DZ(\'1x\',a)}I.qE=a;I.mQ=B.qx(B.1w,B.1R);e.gr();e.7R();B.mo=U},ow:E(e){G a=1k,8V=B.qL(e),op=U;if(8V){a=8V.E2(\'1x\').2M(/\\r/g,\'\');if(!I.mQ||I.qE!==a){op=1f}}P{a=I.qE}if(a){B.fT(a,op)}e.gr();e.7R()},iM:E(e){if(B.1w===B.1R){F}B.eG(e);B.j1(e)},qL:E(e){F(e&&e.8V)||I.4i.8V},o6:E(a,b){G c=B.2b[a].2P(0,b),uq=B.3W(B.1O,a),a9=B.4V(uq),4S;R(G i=0,1d=c.N;i<1d;i++){4S=c[i];a9+=B.5G(B.1O,4S,a,i)}F a9},E5:E(e,a){G b=B.nV(e,a),4z=B.5N(b),1S=4z.1S;if(1S===B.2b.N-1||e.bc||e.6A===34){F B.1x.N-b}G c=4z.2j,a9=B.o6(1S,c),hu=B.nE(1S+1,a9),uk=B.2b[1S].2P(c);F uk.N+hu+2},nV:E(e,a){if(e.6N&&B.1w!==B.1R&&a){F B.1R}P{F B.1w}},E9:E(e,a){G b=B.nV(e,a),4z=B.5N(b),1S=4z.1S;if(1S===0||e.bc||e.6A===33){F-b}G c=4z.2j,a9=B.o6(1S,c),hu=B.nE(1S-1,a9),ui=B.2b[1S].2P(0,c);F-B.2b[1S-1].N+hu-ui.N},nE:E(a,b){G c=B.3W(B.1O,a),hA=B.2b[a],4A=B.4V(c),dB=4A,hR=0,mF;R(G j=0,4O=hA.N;j<4O;j++){G d=hA[j],lA=B.5G(B.1O,d,a,j);dB+=lA;if(dB>b){mF=U;G e=dB-lA,tJ=dB,tw=1a.2f(e-b),ti=1a.2f(tJ-b);hR=ti<tw?j:(j-1);1P}}if(!mF){hR=hA.N-1}F hR},nS:E(e){if(B.1w>=B.1x.N&&B.1R>=B.1x.N){F}B.lx(\'Ej\',e)},nU:E(e){if(B.1w===0&&B.1R===0){F}B.lx(\'Ek\',e)},lx:E(a,e){G b=\'1Z\'+a+\'El\',24=B[b](e,B.4U===\'3H\');if(e.6N){B.t3(24)}P{B.t0(24)}if(24!==0){B.wI();B.cz();B.8U=1;B.d7();B.71();B.70()}},t3:E(a){G b=B.4U===\'1g\'?B.1w+a:B.1R+a;B.kt(B.1w,B.1R,b);F a!==0},t0:E(a){if(a<0){B.1w+=a;B.1R=B.1w}P{B.1R+=a;B.1w=B.1R}F a!==0},nb:E(e){if(B.1w===0&&B.1R===0){F}B.oC(\'m3\',e)},pY:E(e,a,b){G c;if(e.ap){c=B[\'Er\'+b](B[a])}P if(e.bc||e.6A===35||e.6A===36){c=B[\'Es\'+b](B[a])}P{B[a]+=b===\'m3\'?-1:1;F U}if(1j c!==1v&&B[a]!==c){B[a]=c;F U}},jP:E(e,a){F B.pY(e,a,\'m3\')},g2:E(e,a){F B.pY(e,a,\'sU\')},Ew:E(e){G a=U;B.4U=\'1g\';if(B.1R===B.1w&&B.1w!==0){a=B.jP(e,\'1w\')}B.1R=B.1w;F a},Ex:E(e){if(B.4U===\'3H\'&&B.1w!==B.1R){F B.jP(e,\'1R\')}P if(B.1w!==0){B.4U=\'1g\';F B.jP(e,\'1w\')}},jZ:E(e){if(B.1w>=B.1x.N&&B.1R>=B.1x.N){F}B.oC(\'sU\',e)},oC:E(a,e){G b=\'7A\'+a+\'Ey\';B.8U=1;if(e.6N){b+=\'Ez\'}P{b+=\'EA\'}if(B[b](e)){B.cz();B.d7();B.71();B.70()}},EB:E(e){if(B.4U===\'1g\'&&B.1w!==B.1R){F B.g2(e,\'1w\')}P if(B.1R!==B.1x.N){B.4U=\'3H\';F B.g2(e,\'1R\')}},EC:E(e){G a=U;B.4U=\'3H\';if(B.1w===B.1R){a=B.g2(e,\'1w\');B.1R=B.1w}P{B.1w=B.1R}F a},j1:E(e){if(B.1w===B.1R){B.sT(e)}P{B.fQ(B.1w,B.1R)}B.1F(\'6b\',U);B.zw(B.1w);B.nD();B.W&&B.W.2u();B.3C();B.1U(\'cG\');B.W&&B.W.1U(\'1x:cG\',{1q:B})},sT:E(e){if(B.1w===0){F}if(e.bc){G a=B.pz(B.1w);B.fQ(a,B.1w);B.gL(a)}P if(e.ap){G b=B.xD(B.1w);B.fQ(b,B.1w);B.gL(b)}P{B.nn(B.1w);B.gL(B.1w-1)}}});(E(){G k=I.J.26,2m=I.1H.2m;I.J.1m.1n(I.6E.1i,{iP:E(a,b,c,d,e,f){if(!B.bI(a)){I.4W.1i.iP.1W(B,a,b,c,d,e)}P{B.sI(a,b,c,d,f)}},sI:E(a,b,c,d,e){G f=B.2b[a],6Y=0,4A=B.4V(B.3W(B.1O,a))-B.K/2,g8=B.sH(a),5Y=B.42(B.1O,a);R(G i=0,1d=f.N;i<1d;i++){G g=B.5M(a,i)||{};b.1o(B.sG(f[i],g,4A,g8.iU+g8.24,6Y));G h=B.5G(B.1O,f[i],a,i);if(g.47){e.1o(B.sF(g,4A,g8.iU,5Y,h,6Y))}6Y+=h}},sH:E(a){G b=0,nJ=0;R(G j=0;j<a;j++){b+=B.42(B.1O,j)}nJ=B.42(B.1O,j);F{iU:b,24:(B.8r-B.5B)*nJ/(B.2R*B.8r)}},sF:E(a,b,c,d,e,f){F[\'\\t\\t<5i 1A="\',a.47,\'" x="\',k(b+f,2m),\'" y="\',k(c-B.O/2,2m),\'" K="\',k(e,2m),\'" O="\',k(d/B.2R,2m),\'"></5i>\\n\'].2p(\'\')},sG:E(a,b,c,d,e){G f=B.5C.1W(I.J.1m.1n({4X:U,1A:B.1A,1D:B.1D,1p:\'1x\',az:I.1H.1i.az},b));F[\'\\t\\t\\t<b5 x="\',k(c+e,2m),\'" y="\',k(d-B.O/2,2m),\'" \',(b.2E?\'3S-fG="\'+b.2E.2M(/"/g,\'\\\'\')+\'" \':\'\'),(b.2h?\'3S-9B="\'+b.2h+\'" \':\'\'),(b.3N?\'3S-1L="\'+b.3N+\'" \':\'\'),(b.3n?\'3S-3G="\'+b.3n+\'" \':\'\'),(b.3p?\'1x-8B="\'+b.3p+\'" \':\'\'),\'1L="\',f,\'">\',I.J.2N.bf(a),\'</b5>\\n\'].2p(\'\')}})})();(E(f){\'2z 2H\';G g=f.I||(f.I={});g.7z=g.J.1z(g.6E,g.bV,{1p:\'EI\',qJ:20,aj:2,EL:1k,9S:U,ef:U,qu:1f,2c:E(a,b){B.1K(\'2c\',a,b);B.mi(g.7z.pE());B.1O=B.7I?B.8A:g.J.6a().2o(\'2d\');B.aX.1o(\'K\')},9w:E(a){if(B.gj){F}if(!a){a=g.J.6a().2o(\'2d\');B.9v(a);B.dN()}B.aj=0;B.2b=B.aO(a);if(B.aj>B.K){B.3I(\'K\',B.aj)}B.fH();B.O=B.jI(a)},sx:E(){G a=0,dm=0,6m=0,4r={};R(G i=0;i<B.2b.N;i++){if(B.1x[6m]===\'\\n\'&&i>0){dm=0;6m++;a++}P if(B.1x[6m]===\' \'&&i>0){dm++;6m++}4r[i]={2r:a,24:dm};6m+=B.2b[i].N;dm+=B.2b[i].N}F 4r},5M:E(a,b,c){if(B.4R){G d=B.4R[a];if(!d){F c?{}:1k}a=d.2r;b=d.24+b}F B.1K(\'5M\',a,b,c)},q5:E(a,b,c){G d=B.4R[a];a=d.2r;b=d.24+b;B.22[a][b]=c},yd:E(a,b){G c=B.4R[a];a=c.2r;b=c.24+b;2Y B.22[a][b]},bI:E(a){G b=B.4R[a];F B.22[b.2r]},hh:E(a,b){G c=B.4R[a];B.22[c.2r]=b},yb:E(a){G b=B.4R[a];2Y B.22[b.2r]},s6:E(a,b){G c=b.2S(B.p6),h7=[],i;R(i=0;i<c.N;i++){h7=h7.2v(B.s0(a,c[i],i))}F h7},np:E(a,b,c,d){G e=0;d=d||0;R(G i=0,1d=b.N;i<1d;i++){e+=B.5G(a,b[i],c,i+d)}F e},s0:E(a,b,c){G d=0,7U=[],2r=\'\',91=b.2S(\' \'),5P=\'\',24=0,mG=\' \',bD=0,lQ=0,dP=0,dQ=U,66=B.6V();R(G i=0;i<91.N;i++){5P=91[i];bD=B.np(a,5P,c,24);24+=5P.N;d+=lQ+bD-66;if(d>=B.K&&!dQ){7U.1o(2r);2r=\'\';d=bD;dQ=U}P{d+=66}if(!dQ){2r+=mG}2r+=5P;lQ=B.np(a,mG,c,24);24++;dQ=1f;if(bD>dP){dP=bD}}i&&7U.1o(2r);if(dP>B.aj){B.aj=dP-66}F 7U},aO:E(a){a=a||B.1O;G b=B.5r;B.4R=1k;a.3i();B.9v(a);B.5r=\'1g\';G c=B.s6(a,B.1x);B.5r=b;a.3f();B.2b=c;B.4R=B.sx();F c},pZ:E(a,b){if(a===\'1r\'){B.1F(\'1r\',1a.2f(1/b));B.1F(\'K\',(B.1Z(\'K\')*b)/(1j B.q6===\'1v\'?1:B.q6));B.q6=b}},5N:E(a){if(1j a===\'1v\'){a=B.1w}G b=B.2b.N,5g=0;R(G i=0;i<b;i++){G c=B.2b[i],nL=c.N;if(a<=5g+nL){F{1S:i,2j:a-5g}}5g+=nL;if(B.1x[5g]===\'\\n\'||B.1x[5g]===\' \'){5g++}}F{1S:b-1,2j:B.2b[b-1].N}},ob:E(a,b){G c=0,3L=0,4z=B.5N(),rY=B.2b[4z.1S].2S(\'\'),4A=B.4V(B.3W(B.1O,4z.1S));R(G i=0;i<4z.2j;i++){3L+=B.5G(B.1O,rY[i],4z.1S,i)}R(i=0;i<4z.1S;i++){c+=B.42(B.1O,i)}if(b===\'er\'){c+=(1-B.5B)*B.42(B.1O,4z.1S)/B.2R-B.eY(4z.1S,4z.2j)*(1-B.5B)}F{1h:c,1g:3L,o0:4A}},rV:E(){F 1a.1J(B.qJ,B.aj)},1B:E(a){F B.1K(\'1B\',[\'qJ\'].2v(a))}});g.7z.2a=E(a,b,c){F g.1H.6I(\'7z\',a,b,c,\'1x\')};g.7z.pE=E(){F{tl:1f,tr:1f,br:1f,bl:1f,ml:U,mt:1f,mr:U,mb:1f,7B:U}}})(1j 1E!==\'1v\'?1E:B);(E(){G h=I.3O.1i.hK;I.3O.1i.hK=E(a,b,c,d,e,f,g){G t=b.1q;if(t 5D I.7z){G w=t.K*((a.x/b.1r)/(t.K+t.2s));if(w>=t.rV()){t.1F(\'K\',w);F U}}P{F h.1W(I.3O.1i,a,b,c,d,e,f,g)}};I.7a.1i.F2=E(){if(1j I.7z===\'1v\'){F}R(G i=B.1y.N;i--;){if(B.1y[i]5D I.7z){B.mi(I.7z.pE());F}}};G j=I.J.1m.3m;I.J.1m.1n(I.7z.1i,{nD:E(){R(G a in B.4R){if(!B.2b[a]){2Y B.22[B.4R[a].2r]}}},g7:E(a,b,c){G d=B.4R[a];a=d.2r;b=d.24+b;I.6E.1i.g7.2W(B,[a,b,c])},hr:E(a,b,c){G d=B.4R[a];a=d.2r;b=d.24+b;I.6E.1i.hr.2W(B,[a,b,c])},hs:E(a,b){G c=j(B.22),4r=B.4R[a];a=4r.2r;R(G d in B.22){G e=3r(d,10);if(e>a){B.22[e+b]=c[e];if(!c[e-b]){2Y B.22[e]}}}},ku:E(a){G b=B.2b[a-1];31(B.4R[a-2]&&B.4R[a-2].2r===B.4R[a-1].2r){b=B.2b[a-2]+b;a--}F b},nm:E(a,b){G c=B.5N(b),4r=B.4R[c.1S],1S=4r.2r,2j=4r.24+c.2j;B.lh(a,c,1S,2j)}})})();(E(){G g=I.6E.1i.eL;I.6E.1i.eL=E(a,b,c,d,e){d=g.1W(B,a,b,c,d,e);G f=0,5g=0;R(G i=0;i<B.2b.N;i++){f+=B.2b[i].N;if(f+5g>=d){1P}if(B.1x[f+5g]===\'\\n\'||B.1x[f+5g]===\' \'){5g++}}F d-i+5g}})();(E(){if(1j 2X!==\'1v\'&&1j 4i!==\'1v\'){F}G i=8J(\'F3\').m8,rU=8J(\'9Q\'),rS=8J(\'c9\'),rN=8J(\'li\'),3O=8J(\'W\'),1u=8J(\'W\').1u;E 8g(d,e,f){G g=rU.gg(d);if(!g.eF){g.eF=(g.rE.2Z(\'li:\')===0)?Fa:80}G h=(g.rE.2Z(\'li:\')===0)?rN:rS,oP=h.8g({mB:g.mB,eF:g.eF,1Q:g.1Q,gn:\'oX\'},E(b){G c=\'\';if(e){b.Fd(e)}b.on(\'7f\',E(){f(c)});b.on(\'1b\',E(a){if(b.Fe===zZ){c+=a}})});oP.on(\'Ff\',E(a){if(a.Fg===he.rt){I.af(\'rt: Fi Fj to \'+g.mB+\':\'+g.eF)}P{I.af(a.Fk)}f(1k)});oP.7f()}E lw(c,d){G e=8J(\'fs\');e.Fm(c,E(a,b){if(a){I.af(a);bz a;}P{d(b)}})}I.J.87=E(b,c,d){E oZ(a){if(a){e.3F=1c r4(a,\'qX\');e.oU=b;c&&c.1W(d,e)}P{e=1k;c&&c.1W(d,1k,U)}}G e=1c 1u();if(b&&(b 5D r4||b.2Z(\'1b\')===0)){e.3F=e.oU=b;c&&c.1W(d,e)}P if(b&&b.2Z(\'c9\')!==0){lw(b,oZ)}P if(b){8g(b,\'qX\',oZ)}P{c&&c.1W(d,b)}};I.gp=E(b,c,d){b=b.2M(/^\\n\\s*/,\'\').2M(/\\?.*$/,\'\').4T();if(b.2Z(\'c9\')!==0){lw(b,E(a){I.gC(a.3s(),c,d)})}P{8g(b,\'\',E(a){I.gC(a,c,d)})}};I.gC=E(c,d,e){G f=1c i().mc(c);I.hg(f.7i,E(a,b){d&&d(a,b)},e)};I.J.j5=E(b,c){8g(b,\'\',E(a){Fq(a);c&&c()})};I.Fr=E(a,b,c,d){d=d||c;G e=I.2X.69(\'W\'),5n=1c 3O(a||b4,b||b4,d),8C=1c 3O(a||b4,b||b4,d);e.1L={};e.K=5n.K;e.O=5n.O;c=c||{};c.5n=5n;c.8C=8C;G f=I.3O||I.2F,9u=1c f(e,c);9u.5n=5n;9u.8C=8C;9u.7q=5n.2o(\'2d\');9u.h3=8C.2o(\'2d\');9u.k0=3O.k0;F 9u};G j=I.2F.1i.eh;I.2F.1i.eh=E(a,b){a=a||I.2X.69(\'W\');B.5n=1c 3O(a.K,a.O);B.8C=1c 3O(a.K,a.O);j.1W(B,a,b);B.7q=B.5n.2o(\'2d\');B.h3=B.8C.2o(\'2d\');B.k0=3O.k0};I.2F.1i.qR=E(){F B.5n.qR()};I.2F.1i.qP=E(a){F B.5n.qP(a)};I.2F.1i.9V=E(){if(!B.bb()){F}B.3A.5H(\'K\',B.K*I.5a);B.3A.5H(\'O\',B.O*I.5a);B.5n.K=B.K*I.5a;B.5n.O=B.O*I.5a;B.7q.3k(I.5a,I.5a);F B};if(I.3O){I.3O.1i.9V=I.2F.1i.9V}G k=I.2F.1i.bm;I.2F.1i.bm=E(a,b){k.1W(B,a,b);B.5n[a]=b;F B};if(I.3O){I.3O.1i.bm=I.2F.1i.bm}})();', 62, 2576, '|||||||||||||||||||||||||||||||||||||this|||function|return|var||fabric|util|width|||length|height|else||for|||true||canvas||||||||||||||Math|data|new|len||false|left|top|prototype|typeof|null|filters|object|extend|push|type|target|scaleX|group|scaleY|Image|undefined|selectionStart|text|_objects|createClass|fill|toObject|case|stroke|exports|set|center|Object|current|max|callSuper|style|imageData|Point|ctx|break|path|selectionEnd|lineIndex|originX|fire|opacity|call|controlX|source|get||controlY|styles|transform|offset||toFixed||points|color|fromObject|_textLines|initialize||Color|abs|originY|fontSize|angle|charIndex|upperCanvasEl|index|NUM_FRACTION_DIGITS|min|getContext|join|bounds|line|strokeWidth|obj|renderAll|concat|shadow|255|tempX|use|offsetY|tempY|coords|getAttribute|fontFamily|StaticCanvas|BaseFilter|strict|_this|matrix|strokeDashArray|skewX|replace|string|offsetX|slice|arguments|lineHeight|split|radius|skewY|addListener|apply|document|delete|indexOf||while|hiddenTextarea||||||||test|Intersection|viewportTransform|getImageData|sin|restore|Array|100|save|onComplete|scale|bind|clone|fontWeight|contextTop|textDecoration|parseFloat|parseInt|toString|continue|options|idx|backgroundColor|result|number|active|lowerCanvasEl|removeListener|setCoords|toSVG|onChange|src|weight|right|_set|charAt|match|leftOffset|cos|fontStyle|Canvas|_currentTransform|beginPath|colorStops|font|translate|getCenterPoint|markup|_getLineWidth|action|paths|styleDeclaration||lineTo|_getHeightOfLine||filter|||textBackgroundColor|getPointer|getObjects|clipTo|putImageData|toLive|lineWidth|floor|vpt|cacheProperties|getActiveGroup|window|forEach|minY|transformMatrix|getSource|none|round|repeat|image|map|activeObject|applyTo|PI|alpha|transformPoint|ATTRIBUTE_NAMES|isEditing|cursorLocation|lineLeftOffset|warn|iLen|degreesToRadians|backgroundImage|fillStyle|includeDefaultValues|selection|render|prop|parentNode|drawDashedLine|value|flipX|jlen|gradientTransform|segs|_styleMap|_char|trim|_selectionDirection|_getLineLeftOffset|Text|visible|minX|scaled||nodeName|moveTo|defined||strokeLineCap|flipY|overlayImage|_render||devicePixelRatio|objs|toDataURL|parsedDim|svg|iLine|removed|dim|rect|closePath|already|complexity|heightBy2|nodeCanvas|corner|actionPerformed|stateProperties|textAlign|_groupSelector|rotate|_onMouseMove|average|pow|xlink|strokeLineJoin|el2|array|_fontSizeFraction|getSvgStyles|instanceof|sqrt|add|_getWidthOfChar|setAttribute|_element|objects|_activeObject|_hoveredTarget|_getStyleDeclaration|get2DCursorLocation|charSpacing|word|clearContext|blur|eventjs|threshold|pointer|getWidth|overlayColor|fromElement|heightOfLine|mouse||getSvgTransform|offsets|getHeight|renderOnAddRemove||additionalSpace||viewBox|createElement|createCanvasElement|dirty|handlers|alignX|duration|boundaries|original|fillRect|removeFromArray|charWidthsCache|args|Path|charCount|__eventListeners|Shadow|sourcePath|crossOrigin|_iTextInstances|_createBaseSVGMarkup|strokeStyle|getBoundsOfCurve|klass|previous|preserveAspectRatio|getSvgTransformMatrix|alignY|keyCode|pathOffset|bottom|hasControls|IText|getSvgId|parseUnit|attr|_fromObject|resizeFilters|bound|topOffset|ceil|shiftKey|360|charHeight|atan2|switch|zoomY|commaWsp|listeners|_getWidthOfCharSpacing|strokeMiterLimit|animate|charOffset|oCoords|_updateTextarea|_fireSelectionChanged||currentObject|remove||firstChild|Rect|parseAttributes|zoomX|Group|startValue|_activeGroup|isLikelyNode|selected|end|setOptions|context|documentElement|skew|loaded|transparentCorners|newIdx|_points|_renderStroke|Polyline|contextContainer|sinTh|cosTh|Circle|padding|methodName|_getTransformedDimensions|_drawControl|propertySet|Textbox|moveCursor|mtr|resize|getElement|mask|decl|selectable|abort|objectCaching|endValue|Line|maxHeight|splice|widthCache|heightCache|rgba|_handleEvent|preventDefault|gradientDefs|getCoords|lines|_onMouseDown|Gradient|activeGroup|atop|aleft||setCursor|getAlpha|newValue|translateToOriginPoint||toUpperCase|loadImage||_getNonTransformedDimensions|getActiveObject|SHARED_ATTRIBUTES|defaultCursor|Ellipse|Polygon|xhr|request|brightness|pixels|bezierCurveTo|wrapperEl|interactive|distance|constructor|ElementsParser|zoom|key|_fontSizeMult|hsl|_savedProps|char|body|segsNorm|_previousOriginY|_previousOriginX|propPair|_cacheContext|decoration|nodeCacheCanvas|colorCache|hasRotatingPoint|PathGroup|hoverCursor|fillRule|leftCache|require|parsed|isCacheDirty|subpathStartX|subpathStartY|multiplyTransformMatrices|coordsParsed|setLineDash|scaling|boxWidth|svgUid|_currentCursorOpacity|clipboardData|_fire|capitalize|scriptEl|channel||words|borderColor|blocksize|_renderFill|newSelectionStart|_renderDashedStroke|stepW|stepH|invertTransform||async|stop|chnl|lockMovementY|lockMovementX|renderCursorOrSelection|setSource|RegExp|appendChild|numSpaces|isEmptyStyles|origin|_otherBy|ActiveXObject|globalCompositeOperation|_getWidthOfWords|point|appendPoints|circle|fabricCanvas|_setTextStyles|_initDimensions|topCache|cacheProp|getBoundingRect|isMoving|size|icenter|_onMouseUp|xPoints|start|linear|onDeselect|Function|ellipseMatrix|getRandomInt|targets|findTarget|_setLineDash|affectStroke|resizeType|url|lockUniScaling|lockScalingY|textBgRects|position|_initRetinaScaling|noise|translateMatrix|reNum|skipAbsolute|500|||cursorOffsetCache|setupState|clearRect|_renderControls|cleared|descendants|widthBeforeCursor|_findTargetCorner|containsPoint|getCenter|_centerObject|onload|log|axis1|axis2|dtheta|dynamicMinWidth|matcher|isContainedWithinObject|meetOrSlice|align|selectionDashArray|altKey|_createCacheCanvas|_setShadow|href|attrs|scaleMatrix|addClass|radial|getObjectScaling|Pattern|getSvgFilter|exitEditing|SVGID_|PiBy180|objectBoundingBox|getElementOffset|multFactor|wordsWidth|rgb|isAborted|endLine|lanczosLobes|cursorWidth|_onObjectRemoved|setElement|_splitTextIntoLines|status|diff|shouldStroke|maxX|__lineWidths|forbidScalingY|forbidScalingX|maxY|_dimensionAffectingProps||toArray|lockScalingX|||_by|600|tspan|_getLeftOffset|_removeShadow|otherBy|saveState|calcOffset|_isRetinaScaling|metaKey|128||escapeXml|contrast|getElementsByTagName|toLowerCase|Number|easing||_setBackstoreDimension|srcOff|skewed|cacheCanvasEl|normal||getZoom|70158|measureText|_reSpace|dstOff|intersectLinePolygon||throw|1000|_currentTickState|matrices|wordWidth|origPix|widthDiff|yDiff|selectionBackgroundColor|_getLineStyle|tvalues|xDiff|hasBorders|multiplyMatrices|shouldFill|parentMatching|calcTransformMatrix|statefullCache|cacheLanc|background|mouseYSign|ratioY|Observable|mouseXSign|ratioX|objsToRender|setPositionByOrigin|classNames|toDatalessObject|_toObject|marginY|marginX|enlivenObjects|calcCoords|retinaScaling|instances|http|onLoaded|mDelta|multiplier|jLen|fontList|_cacheCanvas|startAngle|endAngle|fromY|_currentTickCompleteState|elements|touchmove||mousemove|move|__lastClickTime|toBeParsed|supports|__lastPointer|aspectRatioAttrs|mousedown|_renderChars|String|||abortCursorAnimation|setAngle|onMouseDown|patternCtx|tan|addTransform|parentAttributes|changed|currentWidth|_onObjectAdded|created|img|propName|setAlpha|arc|translateX|quadraticCurveTo|sprayChunks|sprayChunkPoints|globalAlpha|translateY|patternCanvas|_getTopOffset|isRounded|widthAttr|STROKE_OFFSET|meet|Triangle|populateWithProperties|centeredRotation|setShadow|setSourcePath|selectionColor|heightAttr|initDelayedCursor|pop|segmentToBezierCache|_updateObjectsCoords|fontPaths||rx2|console|ry2|calcLinePoints|isDrawingMode||snapThreshold|farthest|nearest|realLineCharCount|_originalElement||dimension|Resize|imageMargins|elementToDraw|costh3|__widthOfSpace|_setWidthHeight|requestAnimFrame|||sinth3|opaque|widthOfCharsOnLine|overlay|__uid|Date|drawArc|side||drawControls|pattern|iVpt|default|FX_DURATION|clearContextTop|_hasITextHandlers|largestWordWidth|lineJustStarted|clear|dst|DPI|scx|time||origins|flipSign|skewSign|scy|setDimensions|toLocalPoint|sinHalfOffset|__selectionStartOnMouseDown|byValue|_offset|cosHalfOffset|maskCanvasEl|rand|_getFillAttributes|Dummy|_scaleObject|imageSmoothingEnabled|superclass|lockScalingFlip|properties|_initStatic|avg|alpha1|newScaleX|||newScaleY|mode|getSelectionStartFromPointer||cursor|areHostMethods|isNaN|getUniqueId|rcpScaleX|rcpScaleY|||activeTarget|_searchPossibleTargets|_fireOverOutEvents|rotatePoint|mouseout|radiansToDegrees|port|copy|boundsWidth|boundsHeight|cssScale|listener|_getNewSelectionStartFromOffset|commonAttributes|dimY|getScrollLeftTop|linearGradient|setActiveObject|dimX|setStyle|setOpacity|_calculateCurrentDimensions|allRules|_onResize|rules|getCurrentCharFontSize|makeElementUnselectable|reduce|_onMouseOut|_onMouseEnter|_onMouseWheel|_onContextMenu|passive|tmpCanvas|contains|_onGesture|_onDrag|_onOrientationChange|reviver|_onShake|_onLongPress|normalizeValue|isShortNotation|aCoords|srcData|destData|normalizeAttr|cssRules|offsetTo|__lineHeights|offsetFrom|red|__corner|mouseMoveHandler|originXOffset||setTimeout|ratioH|data2|weights|||green|saturate|blue|drawImage|easeOutBounce|drawObject|getById|family|_clearCache|__isMousedown|selectProp|toRgb|className|newLineStyles|resolveGradient|wrapElement|prevStyle|_removeCharsFromTo|format|off|insertChars|inter|rotatingPointOffset|minScaleLimit|||__setBgOverlay|strokeText|fillText|_moveRight|charsToRender|stateful|Sepia|draw|insertCharStyleObject|lineOffset|iMatrix|_getLeftTopCoords|limit|currentAlpha|enableRetinaScaling|rot|vptCoords|parse|centeredScaling||__skipDimension|currentTrans|altActionKey|try|method|ruleObj|loadSVGFromURL|adjust|stopImmediatePropagation|easeInBounce||startLine|finalWidth|Mask|perPixelTargetFind|Invert|Grayscale|_createCanvasElement|contrastF|loadSVGFromString|textLength|newTextLength|applyViewboxTransform|attributes|editing|freeDrawingBrush|_forceClearCache|loading|setSelectionStart|charsToInsert|ellipse|inCompositionMode|_resetCurrentTransform|viewBoxWidth|checkIfDone|_setOriginToCenter|viewBoxHeight|createImage|val|normalize|parseTransformAttribute|hue2rgb|fromSource|thisStyle|scrollLeftTop|currentStart|contextCache|sqrtb2ac|camelize|chars|wrapped|currentEnd|centerTransform|box|b2ac|substring|_mouseUpITextHandler|process|currentLineStylesCloned|parseSVGDocument|_setLineStyle|DEFAULT_SVG_FONT_SIZE|readyState|_cursorTimeout1|before|exec|currentStyle|onStart|lockSkewingX|lockSkewingY|insertNewlineStyleObject|shiftLineStyles|spaceWidth|indexOnOtherLine|onreadystatechange|_charWidth|visibility|cssText|dimNoSkew|textOnLine|caching|scrollTop|newDimMouse|__newClickTime|5625|getVpCenter|prevWidth|scrollLeft|isControlVisible|_setObjectScale|touchend|editable|changeX|changeY|_controlsVisibility|destination|indexOnLine|_tick|scales|lockRotation|justify|originalSet|gradientUnits|signH|th3|strokeRect|_renderTextLine|getSrc|shouldUseAttachEventDetachEvent|signW|_filteredEl|applyFilters|multH|toRgba|nodeArray|mTheta|multW|subTarget||translatePart|||root|addFactor|row|offX|rotateMatrix|getFunctionBody||bbox|_removeEventListener|_restoreObjectsState|ignoreZoom||_initPattern|_discardActiveObject|discardActiveObject|_calcBounds|setActiveGroup|discardActiveGroup|_angle|_setCursorFromEvent|currentHeight|event|_setSVGObject|sendToBack|_join|_initGradient|_setOptions|xcount|bringToFront|sendBackwards|boundsOfCurveCache|cut|www|bringForward|_setSVGTextLineText|dispose|patternImgSrc|_getCursorBoundaries|_getHeightOfChar|lineTop|textLeft|commandLength|jpeg|toJSON|BaseBrush|_getImageLines|removeChars|_renderTextDecoration|_setBrushStyles|Mid|getScript|textTop|makeElement|offsetsAndBlur|stopPropagation|shadowColor|_originalOriginY|_originalOriginX|shadowBlur|shadowOffsetX|_previousPointer|groupSelector|isClick|_isCurrentlyDrawing|shadowOffsetY|_resetShadow|translateToGivenOrigin|PencilBrush|_renderTextLinesBackground|fBoxY|item|hasStateChanged|modified||currentPath|unselectable|objectLeftTop|onMouseMove|onMouseUp|forEachObject|QqTt|colorAttributes|multY|_b|_g|CcSs|_r|getViewportTransform|createPath|_getTextHeight|getAngle|cacheHeight|cacheWidth|saveCoords|radialGradient|addWithUpdate|_moveLeft|idsToXlinkMap|clipContext|getterName|_getCacheCanvasDimensions|feMergeNode|selectionX1Y1|selectionX2Y2|setterName|capitalizedPropName|moveCursorRight|Font|quality|Sepia2|onselectstart|newSelectionEnd|dotWidth|dotWidthVariance|stopObserving|err|borderScaleFactor|valueOf|catch|parsedAttributes|supportsLineDash|observe|cornerSize|_renderBackground|compositionStart|G_vmlCanvasManager|every|__lastLastClickTime|doneH|_isMeasuring|nodeValue|prevCompositionLength|_updateAndFire|div|drawDot|animateColor|setSelectionStartEndWithShift|_getTextOnPreviousLine|addColorStop|endColor|reOpacity|py2|_getWidthOfCharsAt|doneW|missingViewBox|missingDimAttr|elastic|easeOutCubic|addSprayChunk|easeInOutCubic|easeInQuart|commonRender|easeOutQuart|easeInOutQuart|easeInQuint|getPatternSrc|easeOutQuint|easeInOutQuint|_convertPercentUnitsToValues|lanczos|easeInSine|topLeft|easeOutSine|easeInOutSine|01|widthBy2|cursorDuration|easeInExpo|easeOutExpo|easeInOutExpo|patternWidth|patternHeight|centeredKey|easeInCirc|easeOutCirc|easeInOutCirc|selectionKey|easeInElastic|px2|selectionBorderColor|selectionLineWidth|easeOutElastic|easeInOutElastic|easeInBack|easeOutBack|easeInOutBack|_removeStyleObject|https|invoke|reOffsetsAndBlur|find|yMult|makeBoundingBoxFromPoints|BLUR_BOX|preserveObjectStacking|snapAngle|getElementById|elList||isImage|Element|requestFs|_moveCursorUpOrDown|overline|easeInOutBounce|widthOfChar|makeEdgeToOriginGetter|Blend|Multiply|parsePointsAttribute|tintB|activeGroupObjects|contextTopDirty|decorations|tintG|tintR|_applyCharStylesGetWidth|_shouldCenterTransform|CANVAS_INIT_ERROR|Tint|textContent|infixWidth|through|propertyValuePairs|property|calcVectorAngle|_normalizePointer|underline|oLen|from|controlsAboveOverlay|restorePointerVpt|_animate|class|Left|temp|skipCallbacks|DOCTYPE|onerror|DOMParser|RemoveWhite|evented||parseFromString|xml|offsetEnd|Pixelate|_setImageSmoothing|_measureLine|setControlsVisibility|drag|polygon|||_getControlsVisibility|_copyDone|setBackgroundImage|wordCount||Noise||lastX|lastY|createAccessors|replaceChild|newLeft|newTop|moveX|hostname|moveY|docElement|scaleOffset|foundMatch|infix|originA|originB|symbol|__setBgOverlayImage|_skewObject|__setBgOverlayColor|parsePreserveAspectRatioAttribute|sinth2|Error|copiedTextStyle|_ctrlKeysMapDown|actualMouseByOrigin||constraintPosition|total|_applyCanvasStyle|scalarAdd|defs|insertChar|newDim|_ctrlKeysMapUp|doc|GradientTransparency|multiply|_renderTextCommon|cornerHypotenuse|newTheta|realLineHeight|attributesMap|ownerDocument|moveCursorLeft|localMouse|somethingRemoved||toX|setViewportTransform|offsetAttributes|ingoreVpt|midPointFrom|toY|calcViewportBoundaries|removeStyleObject|_removeSingleCharAndStyle||_measureText|CommonMethods|_|lastDist|output|_isEqual|Subclass||saveProps|hasRoated|rightAngleLocked|leftAngleLocked|getBoundingClientRect|added|_removeExtraneousStyles|_getIndexOnLine|defaultView|maxWidth|uaT|ubT|lastHeight|upperCanvas|lineLen|renderCanvas|_calcTextareaPosition|out|over|linecap|getKlass|moveCursorDown|normalizedPointer|moveCursorUp|_getSelectionForOffset|topRight|bottomLeft|makeElementSelectable|halfSide|lineLeft|_renderBackgroundOrOverlay|subtractEquals|str|getSvgColorString|_getHeightOfSingleLine|_getWidthBeforeCursor|_getFontDeclaration|colorNameMap|restartCursorIfNeeded|deselected|_getCursorBoundariesOffsets|sourceFromHex|sourceFromRgb|sourceFromHsl||Convolute|_discardActiveGroup|_calcDimensionsTransformMatrix|_rgbToHsl|deactivateAll|_setCornerCoords|_hypotenuse||removeChild|useCopiedStyle|_realizeGroupTransformOnObject|_unwindGroupTransformOnObject|realizeTransform|Brightness|qrDecompose|_keysMap|paste|_toObjectMethod|wrappedHandler|denom|_getAngleValueForStraighten|excludeFromExport|_moveCursorLeftOrRight|preserveAR|_initFilters|Microsoft|_setSVGBgOverlayColor||_setSVGBgOverlayImage|XMLHTTP|wheel|yPoints|version|touchstart|getBoundsOfArc|req|rotateVector|pointBR|minimumScale|_findCrossPoints|_src|getCurrentCharStyle|removeEventListener|GET|org|createImageAndCallBack|attachEvent|||otherAlpha|_getMultipleNodes|_reSpacesAndTabs|_reNewline|_lastScaleY|_lastScaleX|maxXY|mouseup|parameters||nodeList|_shouldRender|props|detachEvent|searchTarget||delegatedProperties|_setObjectActive||reNonWord|skewMatrix|hypotFull|rowIndex|translateToCenterPoint|000000|searchWordBoundary||numNewLines|originYOffset|Saturate|||findLineBoundaryLeft|getSelectedText|__origHasControls|numTotalObjects|Contrast|getTextboxControlVisibility|down|getTop|getLeft|shouldGroup|boundingRect|ColorMatrix|gxA|gxB|_applyPatternGradientTransform|gxG|reset|gxR|intersectsWithObject|_setStrokeStyles|weightsAlpha|_clearTextArea|Collection|img2|currentAction|_move|setOnGroup|_constrainScale|destImage|_transformDone|clearTimeout|arcToSegments|_setStyleDeclaration|__oldScaleX|destImg|retina|scroll|_extendStyles|range2Y|objectScale|selectorMatches|range2X|pointerY|_updateCacheCanvas|coordsStr|clientX|finish|clientY|_getPointer|addEventListener|fromX|touches|origHeight|scaledWidth|scaledHeight|newZoom|resetObjectTransform|noScaleCache|originalInteractive|nodelist|getSelectionStyles|_captureDrawingPath|colorAlpha|loadFromJSON|_stopEvent|borderOpacityWhenMoving|butt|copiedText|cornerStrokeColor|borderDashArray|153|102|minWidth|_addPoint|_getClipboardData|_animateCursor|numPatterns|backgroundImageStretch|createJPEGStream|cloneWithoutData|createPNGStream|cornerColor|insertAt|cornerStyle|cornerDashArray|_initClipping|binary|_setBgOverlay|miter|_enlivenObjects|||JSON|Buffer|toDataURLWithMultiplier|jpg|__toDataURL|newVp|__toDataURLWithMultiplier|needsItsOwnCache|cropping|png|setObjectsCoords||isContainedWithinRect|intersectsWithRect|_setObject|_collectObjects|_groupSelectedObjects|groupObjects|isActiveLower|_createGroup|removeWithUpdate|_createActiveGroup|_updateActiveGroup|_removeDefaultValues|_getRotatedCornerCursor|_setCornerCursor|ECONNREFUSED|180||_setupCompositeOperation|||drawSelectionBackground|_setOpacity|skewing|_onScale|drawCacheOnCanvas|protocol|_setFillStyles|_performTransformAction|_beforeScaleTransform|random|drawBordersInGroup|drawBorders|_transformObject|addEquals|HTTPS|_beforeTransform|evenodd|_handleGrouping|_clearSelection|HTTP|_shouldGroup|URL|getMinWidth|which|_onMouseMoveInDrawingMode|lineChars|_resetOrigin|_wrapLine|falseFunction|getLocalPointer|_onMouseDownInDrawingMode|_restoreOriginXY|_scaling|_wrapText|_handleCursorAndEvent|_maybeGroupObjects|getPointByOrigin|resolveNamespace|_finalizeCurrentTransform|xFull|yFull||_onMouseUpInDrawingMode|__onMouseMove||__onMouseUp|__onMouseDown|__onLongPress|__onShake|__onOrientationChange|__onMouseWheel|__onDrag|intersection|__onTransformGesture|longpress|shake|orientation|numLoadedObjects|gesture||_generateStyleMap|forceAsync|enlivenPatterns|numLoadedPatterns|contextmenu|mouseenter|_bindEvents|groupSVGElements|_createTextCharBg|_createTextCharSpan|_getSVGLineTopOffset|_setSVGTextLineChars|cursorMap|_drawObjectsControls|removeListeners|deactivateAllWithDispatch|_calcRotateMatrix|dimensionMatrix|destroy|skewMatrixY|_setActiveGroup|_setActiveObject|_removeCharsNearCursor|Right|clip|absolute|customTransformMatrix|_copyCanvasStyle|isTransparent|moveCursorWithoutShift|||moveCursorWithShift|subTargetCheck|anglePart|scalePart|skewXPart|skewYPart|addTranslateX|flipXPart||addTranslateY|flipYPart|_checkTarget|cx1|||offsetFromRightEdge|curAngle|deep||_rotateObject|keys||_flipObject|_scaleObjectEqually||isVML|equally|_setLocalMouse|atan|offsetFromLeftEdge|||_setObjectSkew|lastMouseByCenter|actualMouseByCenter|_changeSkewTransformOrigin|_translateObject|theta|_setupCurrentTransform|setControlVisible|_getActionFromCorner|_getOriginFromCorner|rightEdge|_shouldClearSelection|cy1|originalColor|isTargetTransparent|vptPointer|invertedM|segmentToBezier|coordProps|_drawSelection|renderTop|_getLeftToOriginX|_getTopToOriginY|_chooseObjectsToRender|_initEventListeners|_createUpperCanvas|_initWrapperElement|fireRightClick|stopContextMenu|skipTargetFind|targetFindTolerance|cp1X|containerClass|_callback|rotationCursor|crosshair|freeDrawingCursor|setRadius||startY|endX|endY|largeFlag|altSelectionKey|cp1Y|textBeforeCursor|isValidRadius|textAfterCursor|cp2X|cp2Y|large|sweep||widthOfLine|uniScaleKey|uniScaleTransform|_initInteractive|piBy2|supportLineDash|TypeError|some|_initRxRy|getPattern|xA0||getPatternSrcFunction|_calcDimensions|dotDistance|_getOptimizedRects|ilen|optimizeOverlapping|_toString|commandLengths|repeatedCommands|mzlhvcsqta|ctrlKey|_parsePath|_setPositionDimensions|_parseDimensions|_renderPathCommands|randomOpacity|density|circleColor|circleRadius|addPoint|emptyFunction|convertPointsToSVGPath|_reset|_finalizeAndAddPath|_prepareForDrawing|IS_DONTENUM_BUGGY|lineJoin|lineCap|toDataURLWithQuality|repeatedCommand|klen|forwardDelete|addMethods|deltaX|deltaY|_findNewUpperIndex|parseDimensionsFromPaths|_findNewLowerIndex|unshift|isSameColor|shift|subclasses|_updateObjectCoords|objectTop|unknown|__uniqueID|createSVGRefElementsMarkup|createSVGFontFacesMarkup|createListener||_renderObject|_restoreObjectState|_originalLeft|_originalTop|onClick|_clickHandlerInitialized|onCompositionEnd|onCompositionUpdate|_getBounds|desc|onCompositionStart|handler|minimumScaleTrigger|createWrappedHandler|createDispatcher|_initElement|xmlns|onInput|_initConfig|onKeyUp|onKeyDown|0px|distanceBtwNextCharAndCursor|_stroke|srcElement|SVG|filtered|getSvgSrc|DTD|isTouchSupported|_isObjectMoved|setCursorByClick|__mousedownY|__mousedownX|pngCompression|initClicks||_findMargins|encoding|||_needsResize|initMouseupHandler|_setSVGObjects|_setSVGHeader|Max|initMousedownHandler|CSS_CANVAS|_setSVGPreamble|fromURL|svgViewportTransformation|__serializeBgOverlay|_toObjects||straighten|fxStraighten|__lastSelected|__lastIsEditing|dblclick|viewportCenterObjectV|viewportCenterObjectH|viewportCenterObject|centerObject|centerObjectV|centerObjectH||Vpt|after|_renderOverlay|_renderObjects|isDoubleClick|tripleclick|absolutePan|alphaFac|isTripleClick|zoomToPoint|_setCssDimension|cssFloat|cssOnly|styleFloat|setSelectionInBoundaries|lower|supportsOpacity|insertNewline|newCharIndexOnPrevLine|supportsFilters|maskEl|getRetinaScaling|maskData|setOverlayColor|setBackgroundColor|setOverlayImage|_initOptions|_createLowerCanvas|_ilen|_jlen|onBeforeScaleRotate|host|nodeType|||insertStyleObjects|allowTouchScrolling|getElementStyle|not|indexStyle|exited|_restoreEditingProps|getComputedStyle|userSelect|MozUserSelect|WebkitUserSelect|KhtmlUserSelect|complete|addParamToUrl|Msxml2||initMouseMoveHandler|entered|proto|_textBeforeEdit|feMerge|_setEditingProps|_saveEditingProps|focus|emptyFn|initHiddenTextarea|exitEditingOnOthers|oBlur|feOffset|enterEditing|selectLine||selectWord|feGaussianBlur|findLineBoundaryRight||findWordBoundaryLeft|selectAll|_parseShadow|hermite|createPattern|_cursorTimeout2|delay|patternOffsetY|patternOffsetX|Infinity|tick|sliceByTwo|hermiteFastResize|_onTickComplete|bilinearFiltering|forObject|lanczosResize|_removeCanvasHandlers|_initCanvasHandlers|initDoubleClickSimulation|userSpaceOnUse|initCursorSelectionHandlers|getRadialCoords|getLinearCoords|||tmpCtx|lanczosCreate|getColorStop|initRemovedHandler|isRGBa|initAddedHandler|_getWidthOfSpace|fromHsl|_deleteLineStyle|fromRgb|_deleteStyleDeclaration|_applyFontStyles|rcpRatioX|rcpRatioY|calculateColor|white|colorEasing|srcImg|_getFontCache|_getCacheProp|asin|525|positions|_renderCharDecoration|destPixels|reAllowedSVGTagNames|ratioWHalf|ratioHHalf|polyline|backgroundImageOpacity|reViewBoxTagNames|_renderChar|_hasStyleChanged|reNotAllowedAncestors|_renderCharsFast||j2len|centerY|centerX|reAllowedParents|fillOpacity|rule|dasharray|linejoin|miterlimit|808080|strokeOpacity|259|anchor|getCurrentCharColor|hidden|_setStrokeFillOpacity|MIN_TEXT_WIDTH|renderSelection|renderCursor|reHex|reHSLa|reRGBa|multiplierY|transforms|transformList|otherSource|reTransformList|reTransform|operation|parseStyleString|parseStyleObject|toHex|hsla|_getTextWidth|getGlobalStylesForElement|elementMatchesRule|_source|_renderText|doesSomeParentMatch|_renderTextFill|_renderTextStroke|elementById|_tryParsingColor|inter4|inter3|inter2|inter1|intersectPolygonRectangle|intersectPolygonPolygon|parseUseDirectives|substr|intersectLineLine|appendPoint|cloneNode|oldLength|setSelectionEnd|instantiated_by_use|initBehavior|hasAncestorWithNodeName||lerp|getGradientDefs|getCSSRules|parseElements|cursorDelay|cursorColor|editingBorderColor|textHeight|scaledDiff|subtract|lineHeightDiff|createCallback|_createObject|originalFill|textHeightScaleFactor|createObject|_shouldClearDimensionCache|createObjects|numElements|callback|loadXML|XMLDOM|renderLinesAtOffset|responseText|200|_setSVGTextLineJustifed|declaration|400|parseStyleAttribute|_getSVGLeftTopOffsets|textAndBg|_getSVGTextAndBg|parseFontDeclaration|_setSVGTextLineBg|_wrapSVGTextAndBg|_setSVGBg|textSpans|setZoom|700|900|300|responseXML|lighter|tagName|scalarAddEquals|scalarSubtract|scalarSubtractEquals|bolder|bold|caps|small|119|italic|multiplyEquals|divide|333|divideEquals|lte|gte|name|selectNodes|_abortCursorAnimation|distanceFrom|setXY|removeAttribute|setX|setY|setFromPoint|swap|Coincident|Parallel|alphabetic|textBaseline|transparent|setSelectionStyles|toHsl|toHsla|toHexa|toGrayscale|toBlackWhite|127|overlayWith|Roman|New|Times|aqua|00FFFF|black|0000FF|fuchsia|FF00FF|gray|grey|008000|lime|display|250|clipPath|00FF00|maroon|metadata|800000|view|navy|000080|skipFillStrokeCheck|marker|olive|orange|FFA500|easeInCubic|easeInOutQuad|easeOutQuad|purple|800080|easeInQuad|03|ease|984375|625|9375|FF0000|silver|C0C0C0|teal|008080|FFFFFF|yellow|FFFF00|fromRgba|fromHsla|fromHex|FF|sort|createLinearGradient|msRequestAnimationFrame|createRadialGradient|LINEARGRADIENT|oRequestAnimationFrame|mozRequestAnimationFrame|webkitRequestAnimationFrame|bilinear|requestAnimationFrame|sliceHack|send|urlencoded|form|naturalWidth|application|naturalHeight|lighten|Type|darken|findWordBoundaryRight|Content|difference|getNumNewLinesInSelectedText|setRequestHeader|PUT|POST|screen|open|SourceAlpha|stdDeviation|feFlood|flood|000|feComposite|in2|operator|SourceGraphic|XMLHttpRequest|Could|140|131|534|272|script|head|203|168|686|349|351|clientTop|189|overCursor|769|clientLeft|paddingTop|paddingLeft|393|borderTopWidth|borderLeftWidth|fixed|element|backgroundVpt|overlayVpt|htmlFor|childNodes|9999|hasLayout|webkitImageSmoothingEnabled|mozImageSmoothingEnabled|msImageSmoothingEnabled|oImageSmoothingEnabled|setWidth|setHeight|backstoreOnly|float|pageY|800|createImageData|pageX|relativePan|toDatalessJSON|fxStraightenObject|straightenObject|_resetWidthHeight|suppressPreamble|UTF|toBuffer|standalone|PUBLIC|W3C|setSrc|changedTouches|getOriginalSize|textarea|autocapitalize|setCrossOrigin|999|keydown|Graphics|keyup|svg11|input|dtd|2000|1999|space|compositionstart|preserve|compositionupdate|Created|compositionend|with|Fabric|click|hasMoved|uniqueID__|face|tfont|tsrc|css|CDATA|originalState|orignalPaths|DataURLExporter|EMPTY_JSON|CircleBrush|SprayBrush|PatternBrush|apos|quot|amp|5522847498|hasOwnProperty|getRy|NEGATIVE_INFINITY|POSITIVE_INFINITY|getRx|setData|void|triangle|getData|negative|can|getDownCursorOffset|and|required|attribute|getUpCursorOffset|getRadiusY|getRadiusX|container|fxRemove|fxCenterObjectV|fxCenterObjectH|707106|_resetObjectTransform|mouseover|Down|Up|CursorOffset|getSkewY|getSkewX|clearFabricFontCache|upper|relative|findWordBoundary|findLineBoundary|touch|initElement|getSelectionContext|moveCursorLeftWithoutShift|moveCursorLeftWithShift|With|Shift|outShift|moveCursorRightWithShift|moveCursorRightWithoutShift|getSelectionElement|scaleToHeight|scaleToWidth|getBoundingRectHeight|getBoundingRectWidth|textbox|leftline|bottomline|__cachedLines|rightline||topline|isOnScreen|adjustPosition|subTargets|viewportCenter|viewportCenterV|centerV|viewportCenterH|centerH|setColor|setPatternFill|setGradient|isType|fff|_refreshControlsVisibility|xmldom|button|cloneAsImage|patternTransform|_setCenterToOrigin|miterLimit|rotating|443|moving|boolean|setEncoding|statusCode|error|errno|scaleEqually|connection|refused|message|toggle|readFile|reverse|loadFromDatalessJSON|_toDataURL|eval|createCanvasForNode|nonzero|isEmpty|_toDataURLWithMultiplier|trigger|stringify|808000'.split('|'), 0, {}));
eval(function(p, a, c, k, e, r) {
    e = function(c) { return (c < a ? '' : e(parseInt(c / a))) + ((c = c % a) > 35 ? String.fromCharCode(c + 29) : c.toString(36)) };
    if (!''.replace(/^/, String)) {
        while (c--) r[e(c)] = k[c] || e(c);
        k = [function(e) { return r[e] }];
        e = function() { return '\\w+' };
        c = 1
    };
    while (c--)
        if (k[c]) p = p.replace(new RegExp('\\b' + e(c) + '\\b', 'g'), k[c]);
    return p
}('(p(j){"1L 1M";7 k=j.Q||(j.Q={}),14=k.K.1k.14,15=k.K.1k.15;8(k.B){k.1N(\'Q.B 1O 1P 1Q\');x}7 l=k.R.16.1l.1R();l.17(\'q\',\'v\',\'s\',\'N\');7 m=k.R.16.18;m[\'q\']=o;m[\'v\']=o;m[\'s\']=o;m[\'1S\']=o;m[\'t\']=o;m[\'z\']=o;m[\'N\']=o;m[\'1T\']=o;m[\'1m\']=o;7 n=k.1n.16.S;n[\'1U\']=o;n[\'1V\']=o;n[\'1W\']=o;n[\'1X\']=o;n[\'1o\']=o;n[\'1m\']=o;n[\'1Y\']=o;n[\'1Z\']=o;n[\'1o\']=o;n[\'C\']=o;k.B=k.K.21(k.R,k.22,{23:\'24\',q:25,N:5,v:20,s:M,1l:l,S:n,18:m,19:0,1a:p(){3.T(\'1a\')},26:p(a,b){b||(b={});3.4=1b k.1n([],{1c:M,U:0});3.1d=o;3.27(b);3.1d=M;3.V(a)},V:p(a){8(3.4){28(a.D!==0&&3.4.W()>=a.D){3.4.29(3.4.6(3.4.W()-1))}E(7 i=0;i<a.D;i++){8(3.4.6(i)===1p){3.4.2a(1b k.R(a[i]))}1e{3.4.6(i).V(a[i])}}}3.T(\'V\',a)},1q:p(a){8(3.1d){x}8(!a){a=k.K.2b().2c(\'2d\');3.2e(a)}3.2f=3.u.2g(3.2h);3.2i();7 b=3.C;3.C=\'F\';3.t=3.2j(a);3.C=b;3.z=3.2k(a);3.1r(a)},1r:p(a){7 b=k.K.2l(2m,2n);3.19=b;8(3.4){7 c=0,2o=0,G=0,O=0,X=0,Y=1s(3.v),2p=0,2q=3.4.6(0).t;E(7 i=0,w=3.u.D;i<w-1;i++){L=3.4.6(i).t;8(3.4.6(i+1)&&[\'i\',\'I\',\'f\',\'l\',\'r\',\'y\',\'j\'].1t(3.4.6(i+1).u)>-1)L*=0.5;X+=L+Y};X-=Y;c=-(((X/2)/3.q)/(A.Z/11));8(3.s)c=-c;7 d=0,P=3.s?-1:1,1f=0,1g=0,u=\'\',L=0;E(7 i=0,w=3.u.D;i<w;i++){8(b!==3.19)x;E(7 e 1h 3.S){3.4.6(i).9(e,3.H(e))};3.4.6(i).9(\'C\',\'1u\');3.4.6(i).9(\'F\',(d));3.4.6(i).9(\'J\',(0));3.4.6(i).1i(0);3.4.6(i).9(\'U\',0);L=3.4.6(i).t;8(3.4.6(i+1)&&[\'i\',\'I\',\'f\',\'l\',\'r\',\'y\',\'j\'].1t(3.4.6(i+1).u)>-1)L*=0.5;1f=((L+Y)/3.q)/(A.Z/11);c=P*((P*c)+1g);G=c*(A.Z/11);1g=1f;3.4.6(i).1i(c);3.4.6(i).9(\'J\',P*-1*(A.1v(G)*3.q));3.4.6(i).9(\'F\',P*(A.1w(G)*3.q));3.4.6(i).9(\'U\',0);3.4.6(i).9(\'1c\',M)}7 f=3.4.H(\'12\');7 g=3.4.H(\'13\');7 h=3.4.H(\'1j\');3.4.9(\'12\',1);3.4.9(\'13\',1);3.4.9(\'1j\',0);3.4.1x();3.4.2r();3.4.1y();3.4.9(\'12\',f);3.4.9(\'13\',g);3.4.9(\'1j\',h);3.t=3.4.t;3.z=3.4.z;3.4.F=-(3.4.t/2);3.4.J=-(3.4.z/2)}},2s:p(a){8(3.4){7 b=0,G=0,O=0;7 c=0;8(3.s){c=0.5}8(3.H(\'C\')===\'1u\'||3.H(\'C\')===\'2t\'){O=(3.v/2)*(3.u.D-c)}1e 8(3.H(\'C\')===\'2u\'){O=(3.v)*(3.u.D-c)}7 d=3.s?1:-1;E(7 i=0,w=3.u.D;i<w;i++){b=d*(-i*1s(3.v,10)+O);G=b*(A.Z/11);E(7 e 1h 3.S){3.4.6(i).9(e,3.H(e))}3.4.6(i).9(\'J\',(d-A.1v(G)*3.q));3.4.6(i).9(\'F\',(d+A.1w(G)*3.q));3.4.6(i).1i(b);3.4.6(i).9(\'U\',0);3.4.6(i).9(\'1c\',M)}3.4.1x();8(3.s){3.4.J=3.4.J-3.z*2.5}1e{3.4.J=0}3.4.F=3.4.F-3.t/2;3.4.1y();3.t=3.4.t;3.z=3.4.z;3.4.F=-(3.4.t/2);3.4.J=-(3.4.z/2)}},1z:p(a,b){8(!3.1A)x;8(!3.4)x;a.2v();3.1B(a);7 c=A.2w(3.12,3.13);3.1C&&k.K.2x(3,a);E(7 i=0,w=3.4.W();i<w;i++){7 d=3.4.6(i),2y=d.2z,2A=d.2B;8(!d.1A)2C;d.1z(a)}3.1C&&a.1D();a.1D();3.1E()},1F:p(a,b){3.T(\'1F\',a,b);8(3.4){3.4.9(a,b);8(a 1h 3.18){3.1q();3.1E()}}},1G:p(a){7 b=14(3.T(\'1G\',a),{q:3.q,v:3.v,s:3.s,N:3.N,});8(!3.2D){3.2E(b)}x b},2F:p(){x\'#<Q.B (\'+3.1a()+\'): { "u": "\'+3.u+\'", "1H": "\'+3.1H+\'", "q": "\'+3.q+\'", "v": "\'+3.v+\'", "s": "\'+3.s+\'" }>\'},1I:p(a){7 b=[\'<g \',\'1B="\',3.2G(),\'">\'];8(3.4){E(7 i=0,w=3.4.W();i<w;i++){b.17(3.4.6(i).1I(a))}}b.17(\'</g>\');x a?a(b.1J(\'\')):b.1J(\'\')}});k.B.2H=p(a){x 1b k.B(a.u,15(a))};k.K.2I(k.B);k.B.2J=M})(2K 1K!==\'1p\'?1K:3);', 62, 171, '|||this|letters||item|var|if|set|||||||||||||||true|function|radius||reverse|width|text|spacing|len|return||height|Math|CurvedText|textAlign|length|for|left|angleRadians|get||top|util|cw|false|range|align|multiplier|fabric|Text|delegatedProperties|callSuper|padding|setText|size|textWidth|space|PI||180|scaleX|scaleY|extend|clone|prototype|push|_dimensionAffectingProps|_isRendering|complexity|new|selectable|__skipDimension|else|thisLetterAngle|lastLetterAngle|in|setAngle|angle|object|stateProperties|shadow|Group|strokeWidth|undefined|_initDimensions|_render|parseInt|indexOf|center|cos|sin|_calcBounds|saveCoords|render|visible|transform|clipTo|restore|setCoords|_set|toObject|fontFamily|toSVG|join|exports|use|strict|warn|is|already|defined|concat|fill|fontSize|backgroundColor|textBackgroundColor|textDecoration|stroke|fontWeight|fontStyle||createClass|Collection|type|curvedText|50|initialize|setOptions|while|remove|add|createCanvasElement|getContext||_setTextStyles|_textLines|split|_reNewline|_clearCache|_getTextWidth|_getTextHeight|getRandomInt|100|999|curAngleRotation|fixedLetterAngle|minw|_updateObjectsCoords|_renderOld|justify|right|save|max|clipContext|originalScaleFactor|borderScaleFactor|originalHasRotatingPoint|hasRotatingPoint|continue|includeDefaultValues|_removeDefaultValues|toString|getSvgTransform|fromObject|createAccessors|async|typeof'.split('|'), 0, {}));
eval(function(p, a, c, k, e, r) {
    e = function(c) { return (c < a ? '' : e(parseInt(c / a))) + ((c = c % a) > 35 ? String.fromCharCode(c + 29) : c.toString(36)) };
    if (!''.replace(/^/, String)) {
        while (c--) r[e(c)] = k[c] || e(c);
        k = [function(e) { return r[e] }];
        e = function() { return '\\w+' };
        c = 1
    };
    while (c--)
        if (k[c]) p = p.replace(new RegExp('\\b' + e(c) + '\\b', 'g'), k[c]);
    return p
}('4j.4l={4e:4g(R,G,B){4f{r:R,g:G,b:B}},4i:4g(){4f 4h.4e([0,0,0,1,1,2,3,3,3,4,4,4,5,5,5,6,6,7,7,7,7,8,8,8,9,9,9,9,10,10,10,10,11,11,12,12,12,12,13,13,13,14,14,15,15,16,16,17,17,17,18,19,19,20,21,22,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,39,40,41,42,44,45,47,48,49,4d,4b,3Y,3P,3S,3M,3W,2F,1J,3h,3w,3x,2i,1p,1a,2x,t,H,2K,T,1d,1n,2M,3A,1O,2W,Q,2N,3K,2j,W,2C,3D,2E,1F,d,2H,2b,Y,V,1C,m,2f,1U,Z,1Q,1B,2I,1i,2c,O,2O,1f,j,1M,1X,1N,1h,y,q,1b,1c,1y,1H,1T,2v,3u,3o,3J,3y,3I,2V,3U,2U,2B,3t,2Q,3z,1A,2P,n,2r,3m,3b,3V,2z,3R,3q,o,o,3Q,2T,2R,3B,3O,2G,1I,1g,1g,1P,3i,3i,3c,2S,1j,1j,1V,1x,1x,3n,1Y,1Y,1r,N,N,w,w,1t,2s,2s,1o,1o,U,2L,2L,A,A,A,1L,E,E,F,F,p,p,p,x,i,i,l,l,l,f,e,e,e,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a],[0,0,1,2,2,3,5,5,6,7,8,8,10,11,11,12,13,15,15,16,17,18,18,19,21,22,22,23,24,26,26,27,28,29,31,31,32,33,34,35,35,37,38,39,40,41,43,44,44,45,46,47,48,3Z,4c,4d,3T,4b,1q,3P,4a,3S,3M,3X,2l,3F,2F,3g,1J,2Z,3h,2m,3x,2X,2i,1u,3L,1p,1a,1v,2x,t,2y,3H,H,2K,z,T,1d,1K,1n,2d,1S,2M,1k,1O,2g,2W,2u,2Y,Q,2h,2N,3K,1s,3f,3v,1D,2C,v,3D,1m,1Z,2E,1F,d,c,2H,2p,s,2b,Y,V,D,L,1C,C,m,3l,1U,M,1e,Z,1Q,I,2q,2n,2I,1i,3E,2c,X,O,2O,3e,2A,j,2w,2e,1X,1l,1N,2J,S,1h,y,q,3p,2D,3r,1c,1y,K,K,3d,1T,2v,3u,3o,3G,3J,3y,3y,3I,3N,2k,3U,2U,2B,2B,3t,2Q,1W,3z,1A,2P,2P,n,k,2r,3m,3b,3V,3V,2z,3R,3k,3q,o,o,3Q,2T,2R,3B,3B,3O,2G,1I,1I,1g,1P,1P,3i,3c,2S,1j,1j,1j,1V,1x,3n,3n,1Y,1Y,1r,N,N,w,w,1t,1t,2s,1o,1o,1o,U,2L,A,A,1L,1L,E,E,F,p,p,p,x,i,i,l,l,l,f,e,a],[3T,3T,3T,4b,4b,4b,3Y,3Y,3Y,1q,3P,3P,3P,4a,4a,4a,3S,3S,3S,3M,3X,3X,3X,3W,3W,2l,2l,2l,3F,2F,2F,2F,3g,3g,1J,1J,1J,2Z,3h,3h,3h,3w,3w,2m,2m,3x,2X,2X,2X,2i,2i,1u,1u,3L,1p,1p,h,h,1a,1a,1v,2x,2x,3j,3j,t,t,2y,3H,3H,H,H,2o,2o,2K,z,z,T,T,u,u,1K,1K,1n,1n,2d,2d,1S,2M,1E,1E,3A,3A,1k,1O,2g,2g,2W,2a,2u,2u,2Y,2Y,Q,2h,2N,2N,J,3K,3K,2j,1s,3f,3f,3v,W,1D,1D,2C,v,v,3a,3a,1m,1m,1Z,2E,1R,1F,1F,d,c,2H,2H,1G,2p,s,s,2b,1w,1w,Y,V,D,D,L,P,1C,1C,C,m,m,2f,3l,1U,1U,M,M,1e,1e,Z,Z,1Q,I,1B,1B,2q,2q,2n,2I,3C,3C,1i,1i,3E,2c,X,X,3s,3s,O,O,2O,3e,3e,1f,1f,2A,2A,j,2w,2w,2e,2e,1M,1M,1X,1l,1l,1N,1N,2J,2J,S,1h,1h,y,y,y,q,q,3p,1b,1b,2D,2D,2D,3r,3r,1c,1y,1y,1y,1H,1H,K,K,K,3d,1T,1T,1T,2v,2v,2v,3u,3u,1z,1z,3o,3o,3G,3G,3G,3J,3J,3J,3y,3I,3I,3I,3N,3N,3N,2V,2k])},4k:4g(){4f 4h.4e([1,2,2,4,4,6,6,8,8,10,12,12,14,14,16,18,18,20,22,24,24,26,28,28,30,32,34,36,36,38,40,42,44,44,46,48,3Z,4d,4b,1q,1q,4a,3M,3W,3F,2F,1J,3h,2m,2X,1u,1p,1a,2x,3j,2y,H,2K,T,1d,1K,2d,2M,3A,1k,2g,2a,2Y,Q,2N,1s,3f,W,2C,v,3a,1m,2E,1F,2H,1G,s,2b,Y,D,P,C,m,3l,1U,2t,Z,I,1B,2n,2I,1i,2c,X,3s,2O,1f,2A,j,2e,1X,1l,1N,2J,1h,q,3p,1b,2D,1c,1y,1H,K,1T,2v,3u,1z,3G,3J,3y,3I,3N,2V,2k,3U,2B,2B,3t,2Q,3z,3z,1A,2P,n,k,2r,3m,3b,3V,3V,2z,3k,3k,3q,3q,o,3Q,2T,2R,2R,3B,3O,2G,2G,1I,1g,1g,1P,1P,3i,3c,2S,2S,1j,1j,1V,1V,1x,1x,3n,3n,1Y,1r,1r,N,N,N,w,w,1t,1t,2s,2s,1o,1o,U,U,U,2L,2L,A,A,A,1L,1L,1L,E,E,F,F,F,p,p,p,x,x,x,i,i,l,l,l,l,f,f,f,e,e,e,e,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a],[0,1,1,3,3,4,4,5,5,6,8,8,9,9,10,12,12,13,14,15,15,17,18,18,19,21,22,23,23,24,26,27,28,28,30,31,32,33,35,36,36,37,38,40,41,42,43,45,46,47,48,3Z,4c,4d,3T,4b,1q,3P,4a,3S,3X,3W,2l,3F,2F,3g,2Z,3h,3w,2m,2X,1u,3L,1p,h,1a,1v,2x,t,3H,H,2o,2K,z,T,1d,1n,2d,1S,2M,1E,1k,1O,2g,2W,2a,2Y,Q,2h,2N,J,2j,1s,3f,3v,1D,2C,v,3D,3a,1Z,2E,1R,1F,c,2H,1G,2p,2b,1w,1w,Y,D,L,P,1C,m,2f,3l,3l,M,2t,1e,Z,I,1B,1B,2q,2I,3C,1i,3E,2c,X,3s,O,2O,3e,1f,2A,j,2w,2e,1M,1X,1N,1N,2J,S,1h,y,q,3p,1b,2D,3r,1c,1y,1H,1H,K,1T,1T,2v,3u,1z,1z,3G,3J,3y,3y,3I,3N,2V,2V,2k,2U,2U,2B,3t,2Q,2Q,1W,3z,1A,1A,2P,n,k,k,2r,3m,3m,3b,3V,2z,2z,3R,3k,3q,3q,o,3Q,3Q,2T,2R,2R,3B,3B,3O,2G,1I,1I,1I,1g,1P,1P,3i,3i,3c,2S,2S,1j,1j,1V,1V,1V,1x,3n,1Y,1Y,1Y,1r,1r,N,N,N,w,w,1t,1t,2s,2s,2s,2s,1o],[2X,2i,2i,1u,1u,1u,1u,3L,3L,3L,1p,1p,1p,1p,1p,h,h,h,1a,1a,1a,1a,1v,1v,1v,2x,2x,3j,3j,3j,3j,t,t,t,2y,2y,2y,3H,3H,H,H,H,2o,2o,2o,2K,2K,z,z,T,T,T,u,u,1d,1d,1d,1K,1K,1n,1n,2d,2d,2d,1S,1S,2M,2M,2M,1E,3A,3A,1k,1k,1k,1O,1O,2g,2g,2W,2W,2a,2a,2u,2u,2Y,2Y,Q,Q,2h,2h,2N,2N,J,J,3K,3K,2j,2j,1s,1s,3f,3f,3v,3v,W,W,1D,1D,2C,2C,v,v,3D,3a,3a,3a,1m,1Z,1Z,2E,2E,1R,1R,1F,1F,d,d,c,c,2H,2H,1G,1G,2p,2p,s,s,2b,1w,1w,1w,Y,V,V,D,D,L,L,P,P,1C,1C,C,C,m,m,2f,2f,3l,3l,1U,1U,M,M,2t,2t,1e,1e,Z,Z,1Q,1Q,I,I,1B,1B,2q,2q,2n,2n,2I,2I,2I,3C,3C,1i,3E,3E,3E,2c,2c,X,X,X,3s,3s,O,O,2O,2O,2O,3e,3e,1f,1f,1f,2A,2A,j,j,2w,2w,2w,2e,2e,2e,1M,1M,1X,1X,1X,1l,1l,1l,1N,1N,1N,1N,2J,2J,S,S,S,1h,1h,1h,1h,y,y,y,q,q,q,q,q,3p,3p,3p,1b,1b,1b,1b,2D,2D,2D])},4m:4g(){4f 4h.4e([1,2,2,4,4,6,6,7,7,9,11,11,13,13,15,17,17,18,20,22,22,24,26,26,28,29,31,33,33,35,37,39,40,40,42,44,46,47,49,4c,4c,3T,3Y,1q,4a,3M,3X,2l,2F,1J,2Z,3w,3x,2X,1u,1p,h,1v,3j,t,3H,H,2K,T,u,1K,1n,1S,2M,3A,2g,2W,2u,2Y,2h,2N,J,2j,1s,W,1D,v,3D,1m,1Z,1F,d,c,2H,2p,s,Y,V,D,L,1C,m,2f,3l,1U,2t,Z,1Q,I,1B,2I,3C,1i,3E,2c,3s,O,2O,3e,2A,j,2w,2e,1X,1l,1N,2J,1h,y,q,3p,2D,3r,1c,1y,K,3d,3d,1T,3u,1z,3o,3G,3J,3y,3I,3N,2V,2k,3U,2U,2B,3t,2Q,1W,3z,1A,2P,n,n,2r,3m,3m,3b,3V,2z,3R,3k,3k,3q,3Q,3Q,2T,2R,2R,3B,3O,2G,1I,1I,1g,1P,3i,3c,3c,2S,1j,1j,1V,1V,1x,3n,1Y,1r,1r,N,w,w,1t,1t,2s,1o,1o,U,U,2L,A,A,1L,E,E,F,F,p,x,x,i,i,l,f,f,f,e,e,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a],[1,1,1,1,1,2,2,3,3,3,4,4,5,5,5,6,6,7,8,8,8,9,10,10,10,11,12,12,12,13,14,14,15,15,16,17,17,18,19,19,19,20,21,22,22,23,24,25,25,26,27,28,28,29,30,31,31,32,33,34,34,35,36,37,38,39,39,40,41,42,44,44,45,46,47,48,49,3Z,4c,4d,3T,4b,3Y,1q,3P,3S,3M,3X,3W,2l,3F,3g,1J,2Z,3h,3w,3x,2X,2i,1u,3L,1a,1v,2x,3j,2y,3H,2o,2K,z,u,1K,1n,2d,2M,3A,1k,1O,2a,2u,2Y,2h,J,3K,1s,3f,1D,2C,v,3a,2E,1R,1F,c,1G,s,2b,Y,D,P,1C,m,1U,M,1e,Z,1B,2q,2I,3C,3E,3s,O,3e,1f,2w,1M,1X,1N,2J,y,3p,1b,3r,1y,3d,1T,3u,1z,3G,3J,2V,2k,2U,2B,2Q,1W,n,k,3m,3b,2z,3k,3q,3Q,2T,3O,1I,1P,3i,2S,1j,1x,1Y,1r,w,2s,1o,2L,A,E,p,x,l,f,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a],[0,1,1,2,2,3,3,4,4,5,6,6,7,7,8,9,9,10,11,12,12,13,14,14,15,16,17,18,18,19,20,21,22,22,23,24,25,26,27,28,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,3Z,4c,4d,3T,4b,3Y,1q,3P,3S,3M,3X,3W,2l,3F,2F,3g,1J,3h,3w,2m,3x,2X,2i,3L,1p,h,1a,1v,2x,t,2y,3H,H,2o,z,T,u,1d,1K,2d,1S,2M,1E,1k,1O,2g,2W,2a,2Y,Q,2h,2N,3K,2j,1s,3f,W,1D,2C,v,3a,1m,1Z,2E,1F,d,c,2H,2p,s,2b,1w,V,D,L,P,C,m,2f,3l,M,2t,1e,Z,I,1B,2q,2n,2I,1i,3E,2c,X,O,2O,3e,1f,2A,2w,2e,1M,1X,1l,2J,S,1h,y,q,3p,2D,3r,1c,1y,1H,K,1T,2v,3u,1z,3o,3G,3J,3y,3I,2V,2k,3U,2U,2B,3t,2Q,1W,3z,1A,2P,n,k,2r,3m,3b,3V,2z,3R,3k,3q,o,3Q,2T,2R,3B,3O,2G,1I,1g,1g,1P,3i,3c,2S,1j,1V,1V,1x,3n,1Y,1r,1r,N,w,1t,2s,2s,1o,U,U,2L,A,1L,1L,E,F,F,p,p,x,i,i,l,l,f,f,e,e,a])},4n:4g(){4f 4h.4e([0,2,3,5,7,8,10,12,13,15,17,18,20,21,23,25,26,28,30,31,33,35,36,38,39,41,43,44,46,48,49,4c,4d,4b,1q,3P,3S,3M,3W,2l,2F,1J,2Z,3w,2m,2X,2i,3L,1p,1a,1v,3j,t,3H,H,2K,z,u,1d,1n,2d,2M,1E,1k,1O,2g,2a,2u,Q,2h,2N,3K,2j,1s,3v,W,1D,v,3D,3a,1Z,2E,1R,1F,c,2H,1G,2p,2b,1w,Y,V,D,P,1C,C,m,2f,3l,1U,M,1e,Z,1Q,I,1B,2q,2n,2I,3C,1i,3E,2c,X,3s,O,2O,3e,1f,1f,2A,j,2w,2e,1M,1X,1l,1N,2J,2J,S,1h,y,q,3p,1b,1b,2D,3r,1c,1y,1y,1H,K,3d,1T,1T,2v,3u,1z,3o,3o,3G,3J,3y,3y,3I,3N,2V,2V,2k,3U,3U,2U,2B,3t,3t,2Q,1W,1W,3z,1A,1A,2P,n,n,k,2r,2r,3m,3b,3b,3V,2z,2z,3R,3R,3k,3q,3q,o,3Q,3Q,2T,2T,2R,3B,3B,3O,3O,2G,1I,1I,1g,1g,1P,1P,3i,3c,3c,2S,2S,1j,1j,1V,1x,1x,3n,3n,1Y,1Y,1r,1r,N,w,w,1t,1t,2s,2s,1o,1o,U,U,2L,A,A,1L,1L,E,E,F,F,p,p,x,x,i,i,l,l,f,f,e,a,a],[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,3Z,4c,4d,3T,4b,3Y,1q,3P,4a,3S,3M,3X,3W,2l,3F,2F,3g,1J,2Z,3h,3w,2m,3x,2X,2i,1u,3L,1p,h,1a,1v,2x,3j,t,2y,3H,H,2o,2K,z,T,u,1d,1K,1n,2d,1S,2M,1E,3A,1k,1O,2g,2W,2a,2u,2Y,Q,2h,2N,J,3K,2j,1s,3f,3v,W,1D,2C,v,3D,3a,1m,1Z,2E,1R,1F,d,c,2H,1G,2p,s,2b,1w,Y,V,D,L,P,1C,C,m,2f,3l,1U,M,2t,1e,Z,1Q,I,1B,2q,2n,2I,3C,1i,3E,2c,X,3s,O,2O,3e,1f,2A,j,2w,2e,1M,1X,1l,1N,2J,S,1h,y,q,3p,1b,2D,3r,1c,1y,1H,K,3d,1T,2v,3u,1z,3o,3G,3J,3y,3I,3N,2V,2k,3U,2U,2B,3t,2Q,1W,3z,1A,2P,n,k,2r,3m,3b,3V,2z,3R,3k,3q,o,3Q,2T,2R,3B,3O,2G,1I,1g,1P,3i,3c,2S,1j,1V,1x,3n,1Y,1r,N,w,1t,2s,1o,U,2L,A,1L,E,F,p,x,i,l,f,e,a],[0,1,1,2,3,3,4,5,6,6,7,8,8,9,10,10,11,12,13,13,14,15,15,16,17,17,18,19,20,20,21,22,22,23,24,24,25,26,26,27,28,29,29,30,31,31,32,33,33,34,35,36,36,37,38,38,39,40,40,41,42,43,43,44,45,45,46,47,47,48,49,49,3Z,4c,4d,4d,3T,4b,4b,3Y,1q,1q,3P,4a,3S,3S,3M,3X,3X,3W,2l,2l,3F,2F,3g,3g,1J,2Z,2Z,3h,3w,3w,2m,3x,3x,2X,2i,1u,1u,3L,1p,1p,h,1a,1a,1v,2x,3j,3j,t,2y,2y,3H,H,H,2o,2K,z,z,T,u,u,1d,1K,1K,1n,2d,1S,1S,2M,1E,1E,3A,1k,1k,1O,2g,2g,2W,2a,2u,2u,2Y,Q,Q,2h,2N,2N,J,3K,2j,2j,1s,3f,3f,3v,W,W,1D,2C,v,v,3D,3a,3a,1m,1Z,1Z,2E,1R,1R,1F,d,c,c,2H,1G,1G,2p,s,s,2b,1w,Y,Y,V,D,D,L,P,P,1C,C,m,m,2f,3l,3l,1U,M,M,2t,1e,1e,Z,1Q,I,I,1B,2q,2q,2n,2I,2I,3C,1i,3E,3E,2c,X,X,3s,O,O,2O,3e,1f,1f,2A,j,j,2w,2e,2e,1M,1X,1X,1l,1N,2J,2J,S,1h,1h,y,q])},4o:4g(){4f 4h.4e([0,0,0,0,1,1,1,1,1,1,2,2,2,2,2,3,3,3,3,3,4,4,4,4,4,5,5,5,5,5,6,6,6,7,7,7,7,8,8,8,9,9,9,10,10,10,11,11,11,12,12,13,13,13,14,14,15,15,16,16,17,17,18,18,19,20,20,21,21,22,23,23,24,25,25,26,27,27,28,29,30,31,31,32,33,34,35,36,37,38,38,39,41,42,43,45,46,48,3Z,4d,4b,1q,3S,3X,3F,3g,3h,3x,1u,1p,1v,t,H,z,1d,2d,1E,1O,2a,Q,2N,2j,3v,1D,3D,1m,2E,1F,c,1G,s,1w,V,L,1C,m,3l,1U,2t,Z,I,1B,2n,3C,1i,2c,3s,O,3e,1f,j,2w,2e,1X,1l,1N,S,1h,y,q,3p,1b,2D,3r,1c,1c,1y,1H,K,3d,1T,1T,2v,3u,1z,1z,3o,3G,3J,3J,3y,3I,3I,3N,2V,2V,2k,3U,3U,2U,2B,2B,3t,2Q,2Q,1W,1W,3z,1A,1A,2P,2P,n,k,k,2r,2r,3m,3m,3b,3b,3V,2z,2z,3R,3R,3k,3k,3q,3q,o,o,3Q,3Q,2T,2T,2R,2R,3B,3B,3B,3O,3O,2G,2G,1I,1I,1g,1g,1P,1P,3i,3i,3i,3c,3c,2S,2S,1j,1j,1V,1V,1V,1x,1x,3n],[0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,11,11,12,12,13,13,14,14,15,16,16,17,17,18,18,19,20,20,21,21,22,23,23,24,25,25,26,26,27,28,28,29,30,30,31,32,32,33,34,35,35,36,37,37,38,39,40,40,41,42,43,44,44,45,46,47,48,49,49,3Z,4c,4d,3T,4b,3Y,1q,1q,3P,4a,3S,3M,3X,3W,2l,3F,2F,1J,2Z,3h,2m,3x,2i,3L,1p,1a,2x,t,3H,2o,z,u,1K,2d,2M,3A,1O,2W,2u,2h,J,2j,3f,W,2C,3D,1m,2E,1R,c,1G,2p,2b,Y,D,P,C,2f,3l,M,1e,1Q,1B,2n,3C,3E,X,O,3e,2A,j,2e,1X,1N,S,1h,q,1b,3r,1c,1H,K,1T,3u,1z,3o,3J,3y,3I,2V,2k,3U,2U,2B,3t,2Q,1W,3z,1A,2P,n,k,k,2r,3m,3b,3V,2z,3R,3R,3k,3q,o,o,3Q,2T,2R,2R,3B,3O,2G,2G,1I,1g,1g,1P,3i,3i,3c,2S,2S,1j,1V,1V,1x,1x,3n,1Y,1Y,1r,1r,N,N,w,w,1t,2s,2s,1o,1o,U,U,2L,2L,A,A,1L,1L,E,E,F,F,p,p,x,x,x,i,i,l,l,f,f,e,e,a,a],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,3,3,3,3,3,3,4,4,4,4,4,5,5,5,5,6,6,6,7,7,7,8,8,8,9,9,9,10,10,11,11,12,12,13,13,14,14,15,15,16,16,17,18,18,19,20,20,21,22,22,23,24,25,25,26,27,28,29,30,31,31,32,33,34,35,36,38,39,42,44,46,49,4d,3Y,3S,3W,3g,3h,2X,1p,2x,3H,z,1K,2M,1O,2a,2h,2j,3v,v,1m,1R,c,2p,1w,V,P,m,3l,2t,1Q,1B,2I,1i,X,O,1f,j,2e,1l,2J,1h,q,1b,3r,1y,K,3d,2v,1z,3o,3G,3y,3I,3I,3N,2V,2k,3U,2U,2B,3t,2Q,1W,3z,1A,2P,2P,n,k,2r,3m,3b,3b,3V,2z,3R,3R,3k,3q,o,o,3Q,2T,2R,2R,3B,3O,3O,2G,1I,1I,1g,1g,1P,3i,3i,3c,3c,2S,1j,1j,1V,1V,1x,1x,3n,1Y,1Y,1r,1r,N,N,w,w,1t,1t,2s,2s,1o,1o,U,U,2L,2L,2L,A,A,1L,1L,E,E,F,F,p,p,p,x,x,i,i,l,l,l,f,f,e,e,a,a])},4p:4g(){4f 4h.4e([1,1,2,2,2,2,4,4,2,3,5,4,4,5,6,6,6,7,7,8,9,10,10,9,10,11,11,12,13,13,14,14,15,16,17,17,18,19,19,18,21,20,21,22,23,23,24,25,26,26,28,29,30,29,30,31,32,32,33,34,35,36,37,37,39,39,40,41,41,42,43,44,46,47,48,49,3Z,4c,4d,3T,3Y,3Y,1q,3P,4a,3S,3M,3W,2l,3F,2F,3g,2Z,3h,3w,3x,2i,1u,3L,1p,h,1a,t,t,2y,3H,2K,z,T,1K,1K,1S,2M,1E,1k,2g,2W,2Y,Q,2h,2N,2j,3f,1D,1D,2C,3D,3a,2E,1R,d,c,2p,s,2b,1w,L,P,1C,m,1U,1U,M,1Q,1B,2q,2n,2I,1i,X,3s,2O,2O,2A,j,2e,2e,1M,S,S,y,q,q,2D,3r,1c,1H,1H,3d,3u,1z,3o,3G,3J,3y,3N,2V,2k,3U,2B,2Q,1W,1W,1A,2P,n,k,2r,3m,3b,3m,3b,3V,2z,3q,3q,o,3Q,2T,2T,3B,3B,2G,2G,1I,1I,1g,1P,1P,3c,2S,2S,1j,1V,3n,1x,1Y,1Y,1r,1Y,1r,N,w,1t,2s,2s,1o,U,1o,1o,U,2L,2L,A,A,E,F,1L,F,p,p,x,p,p,x,x,l,i,i,f,f,e,e,f,f,e],[1,1,2,2,3,3,4,4,6,7,6,8,8,9,10,10,11,12,12,13,14,15,15,17,18,19,19,20,21,22,23,23,24,25,26,28,29,30,30,31,32,33,34,35,36,38,39,40,40,40,42,43,44,46,47,48,49,3Z,4c,4d,3T,4b,3Y,3P,3P,3P,3M,3M,3M,3X,3W,2l,2F,3g,1J,2Z,3h,3w,2m,3x,2i,2i,1u,3L,1p,h,1a,2x,2x,3j,t,2y,3H,H,2o,z,z,T,u,1d,1K,1n,2d,2d,1S,2M,1E,3A,1k,1k,1k,2g,2g,2W,2Y,2Y,Q,Q,2h,2N,J,3K,3K,3f,3f,3v,3v,W,1D,2C,1D,v,3D,3a,1m,1Z,2E,1R,1R,d,c,c,2H,1G,1G,s,2b,2b,Y,V,D,D,D,C,m,m,m,2f,1U,1U,2t,1e,1e,1Q,I,1B,2n,2n,3C,1i,3E,2c,X,3s,O,3e,1f,2A,j,2w,1M,1X,1l,S,1h,y,q,3p,1b,2D,1c,1y,1H,K,K,2v,3u,1z,3o,3J,3y,3I,2V,2V,2k,2B,3t,2Q,3z,1A,2P,k,2r,3m,3V,2z,3k,3k,3q,3Q,2T,2R,2G,1I,2G,1g,1P,3i,2S,2S,1j,1V,3n,1Y,1Y,N,w,w,2s,1o,1o,U,A,A,1L,1L,F,p,p,i,i,l,l,e,e,a],[1,1,2,4,5,5,6,6,7,8,8,9,9,10,13,13,14,15,15,16,17,19,19,20,21,22,22,23,24,27,28,28,29,30,31,34,35,36,36,37,38,39,42,43,44,45,46,47,49,49,4c,4d,3Y,1q,3P,4a,3S,3M,3X,3W,2l,3g,1J,2Z,3h,3h,2m,2i,2i,1u,3L,1p,1v,2x,3j,t,2y,3H,H,z,u,u,1d,1K,1n,2d,1S,1E,1O,2g,2W,2a,2u,2Y,Q,2N,J,3K,2j,3v,W,1D,v,v,3D,3a,1Z,2E,1R,1F,1F,c,2p,s,s,2b,V,D,L,P,1C,m,m,1U,1U,M,2t,1e,1Q,I,I,1Q,1B,2I,3C,1i,1i,3E,3E,X,O,O,2O,1f,2A,1f,2A,2e,1X,1M,1X,1l,1l,1N,2J,y,y,1h,3p,3p,2D,3r,3r,1y,1c,1y,K,K,1T,1T,2v,3u,1z,3o,1z,3G,3J,3y,3I,3y,3N,2V,2k,2k,3U,2U,2B,2B,3t,1W,1W,2Q,1W,3z,1A,n,k,n,k,2r,k,2r,3b,3b,3V,2z,3R,3k,3q,3k,3q,o,3q,o,2T,2T,2T,2T,2R,3B,3O,3B,2G,1I,1I,1g,1g,1P,3i,3i,1P,3i,3c,2S,2S,2S,1j,2S,1V,1j,1j,1V,1x,1x,3n,3n,1Y,1Y,1Y,N,N,w,1r,N,N,w])},4q:4g(){4f 4h.4e([0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,3,3,3,3,3,4,4,4,4,4,5,5,5,5,6,6,6,7,7,7,8,8,8,9,9,10,10,11,11,11,12,12,13,13,14,15,15,16,16,17,18,18,19,20,21,21,22,23,24,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,40,41,42,43,44,46,47,48,49,4c,3T,3Y,1q,4a,3X,2l,2F,1J,3w,3x,1u,1p,1v,t,H,z,1d,1n,2M,1k,2a,Q,J,1s,W,v,1m,1F,2H,s,Y,L,C,1U,1e,I,2n,1i,X,2O,2A,2e,1l,S,y,1b,1c,1H,1T,3u,3o,3y,3N,2k,2U,3t,1W,3z,2P,n,2r,3m,3b,2z,3R,3k,3q,o,3Q,2T,3B,3O,2G,1I,1g,1g,1P,3i,3c,2S,1j,1V,1x,1x,3n,1Y,1r,1r,N,w,w,1t,1t,2s,1o,1o,U,U,2L,2L,A,A,1L,1L,E,E,E,F,F,F,p,p,p,x,x,x,x,i,i,i,i,l,l,l,l,l,f,f,f,f,f,f,f,e,e,e,e,e,e,e,e,e,e,e,e,a,a,a,a,a,a,a,a,a,a,a],[0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,3,3,3,3,3,4,4,4,4,4,5,5,5,5,6,6,6,7,7,7,8,8,8,9,9,10,10,11,11,11,12,12,13,13,14,15,15,16,16,17,18,18,19,20,21,21,22,23,24,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,40,41,42,43,44,46,47,48,49,4c,3T,3Y,1q,4a,3X,2l,2F,1J,3w,3x,1u,1p,1v,t,H,z,1d,1n,2M,1k,2a,Q,J,1s,W,v,1m,1F,2H,s,Y,L,C,1U,1e,I,2n,1i,X,2O,2A,2e,1l,S,y,1b,1c,1H,1T,3u,3o,3y,3N,2k,2U,3t,1W,3z,2P,n,2r,3m,3b,2z,3R,3k,3q,o,3Q,2T,3B,3O,2G,1I,1g,1g,1P,3i,3c,2S,1j,1V,1x,1x,3n,1Y,1r,1r,N,w,w,1t,1t,2s,1o,1o,U,U,2L,2L,A,A,1L,1L,E,E,E,F,F,F,p,p,p,x,x,x,x,i,i,i,i,l,l,l,l,l,f,f,f,f,f,f,f,e,e,e,e,e,e,e,e,e,e,e,e,a,a,a,a,a,a,a,a,a,a,a],[0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,3,3,3,3,3,4,4,4,4,4,5,5,5,5,6,6,6,7,7,7,8,8,8,9,9,10,10,11,11,11,12,12,13,13,14,15,15,16,16,17,18,18,19,20,21,21,22,23,24,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,40,41,42,43,44,46,47,48,49,4c,3T,3Y,1q,4a,3X,2l,2F,1J,3w,3x,1u,1p,1v,t,H,z,1d,1n,2M,1k,2a,Q,J,1s,W,v,1m,1F,2H,s,Y,L,C,1U,1e,I,2n,1i,X,2O,2A,2e,1l,S,y,1b,1c,1H,1T,3u,3o,3y,3N,2k,2U,3t,1W,3z,2P,n,2r,3m,3b,2z,3R,3k,3q,o,3Q,2T,3B,3O,2G,1I,1g,1g,1P,3i,3c,2S,1j,1V,1x,1x,3n,1Y,1r,1r,N,w,w,1t,1t,2s,1o,1o,U,U,2L,2L,A,A,1L,1L,E,E,E,F,F,F,p,p,p,x,x,x,x,i,i,i,i,l,l,l,l,l,f,f,f,f,f,f,f,e,e,e,e,e,e,e,e,e,e,e,e,a,a,a,a,a,a,a,a,a,a,a])},4r:4g(){4f 4h.4e([0,1,1,2,3,3,4,5,6,6,7,8,8,9,10,10,11,12,13,13,14,15,15,16,17,17,18,19,20,20,21,22,22,23,24,24,25,26,27,27,28,29,29,30,31,32,32,33,34,35,35,36,37,37,38,39,40,40,41,42,43,43,44,45,46,46,47,48,49,49,3Z,4c,4d,3T,3T,4b,3Y,1q,1q,3P,4a,3S,3M,3M,3X,3W,2l,3F,3F,2F,3g,1J,2Z,2Z,3h,3w,2m,3x,2X,2X,2i,1u,3L,1p,h,1a,1a,1v,2x,3j,t,2y,3H,H,H,2o,2K,z,T,u,1d,1K,1n,2d,2d,1S,2M,1E,3A,1k,1O,2g,2W,2a,2u,2Y,Q,2h,2N,J,3K,2j,1s,3f,3f,3v,W,1D,2C,v,3D,3a,1Z,2E,1R,1F,d,c,2H,1G,2p,s,2b,1w,V,D,L,P,1C,C,2f,3l,1U,M,2t,1e,1Q,I,1B,2q,2n,3C,1i,3E,2c,3s,O,2O,3e,2A,j,2w,2e,1X,1l,1N,2J,1h,y,q,1b,2D,3r,1c,1H,K,3d,2v,3u,1z,3G,3J,3y,3N,2V,2k,2U,2B,3t,1W,3z,1A,n,k,3m,3b,3V,3R,3k,3q,3Q,2T,3B,3O,2G,1g,1P,3i,2S,1j,1x,3n,1Y,N,w,2s,1o,U,A,1L,F,p,x,l,f,a],[0,1,2,4,5,6,7,9,10,11,12,13,15,16,17,18,20,21,22,23,24,26,27,28,29,31,32,33,34,35,37,38,39,40,41,43,44,45,46,47,49,3Z,4c,4d,3T,3Y,1q,3P,4a,3S,3X,3W,2l,3F,2F,1J,2Z,3h,3w,2m,3x,2i,1u,3L,1p,h,1a,2x,3j,t,2y,3H,H,2o,z,T,u,1d,1K,1n,2d,2M,1E,3A,1k,1O,2g,2W,2a,2u,Q,2h,2N,J,3K,2j,1s,3f,3v,W,1D,v,3D,3a,1m,1Z,2E,1R,1F,d,c,2H,1G,2p,s,2b,1w,Y,V,D,L,1C,C,m,2f,3l,1U,M,M,2t,1e,Z,1Q,I,1B,2q,2n,2I,3C,1i,3E,2c,X,3s,O,2O,3e,1f,2A,2A,j,2w,2e,1M,1X,1l,1N,2J,S,1h,1h,y,q,3p,1b,2D,3r,1c,1y,1y,1H,K,3d,1T,2v,3u,1z,1z,3o,3G,3J,3y,3I,3N,3N,2V,2k,3U,2U,2B,3t,3t,2Q,1W,3z,1A,2P,2P,n,k,2r,3m,3b,3b,3V,2z,3R,3k,3k,3q,o,3Q,2T,2R,2R,3B,3O,2G,1I,1I,1g,1P,3i,3c,3c,2S,1j,1V,1x,3n,3n,1Y,1r,N,w,w,1t,2s,1o,U,U,2L,A,1L,1L,E,F,p,x,x,i,l,f,e,e,a],[0,3,5,8,10,13,15,18,20,23,25,28,30,32,35,37,39,41,44,46,48,3Z,4d,3T,3Y,3P,3S,3M,3W,2l,3F,2F,1J,2Z,3h,3h,3w,2m,2m,3x,2X,2X,2i,1u,1u,3L,3L,1p,h,h,1a,1a,1v,1v,2x,2x,3j,3j,t,t,2y,2y,3H,3H,H,H,2o,2o,2o,2K,2K,z,z,z,T,T,u,u,u,1d,1d,1d,1K,1K,1K,1n,1n,1n,2d,2d,2d,1S,1S,1S,1S,2M,2M,2M,1E,1E,1E,1E,3A,3A,3A,1k,1k,1k,1k,1O,1O,1O,1O,2g,2g,2g,2g,2W,2W,2W,2W,2a,2a,2a,2u,2u,2u,2u,2Y,2Y,2Y,2Y,Q,Q,Q,2h,2h,2h,2h,2N,2N,2N,J,J,J,3K,3K,3K,2j,2j,2j,1s,1s,1s,3f,3f,3f,3v,3v,3v,W,W,1D,1D,1D,2C,2C,v,v,3D,3D,3a,3a,3a,1m,1m,1Z,1Z,2E,2E,1R,1F,1F,d,d,c,c,2H,1G,1G,2p,2p,s,2b,2b,1w,Y,V,V,D,L,L,P,1C,C,m,m,2f,3l,1U,M,2t,1e,Z,1Q,1B,2q,2I,3C,3E,X,3s,2O,1f,j,1M,1l,2J,1h,3p,2D,1y,K,2v,3o,3J,3N,3U,3t,1W,2P,2r,3V,3k,3Q,3B,1I,3i,1j,1Y,w,1o,A,F,i,a])},4s:4g(){4f 4h.4e([0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,7,8,8,9,9,10,10,11,11,12,12,13,13,14,14,15,15,16,16,17,18,18,19,19,20,20,21,21,22,23,23,24,24,25,25,26,27,27,28,28,29,30,30,31,32,32,33,34,34,35,36,36,37,38,39,39,40,41,42,42,43,44,45,45,46,47,48,49,3Z,3Z,4c,4d,3T,4b,3Y,1q,3P,4a,4a,3S,3M,3X,3W,2l,3F,2F,3g,1J,2Z,3h,3w,3x,2X,2i,1u,3L,1p,h,1a,2x,3j,t,2y,3H,2o,2K,z,T,1d,1K,1n,1S,2M,3A,1k,2g,2W,2u,Q,2h,J,2j,3f,W,2C,3D,1m,2E,1F,c,1G,s,Y,D,P,m,3l,M,Z,I,2n,3C,2c,O,3e,j,1M,1l,S,q,2D,1y,K,2v,3o,3y,2V,2U,2Q,1A,k,3b,3R,o,2R,2G,1P,2S,1x,1r,1t,U,1L,p,l,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a],[0,0,1,1,2,2,3,3,4,4,5,5,6,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,14,14,15,15,16,16,17,17,18,18,19,19,20,21,21,22,22,23,23,24,25,25,26,26,27,28,28,29,29,30,31,31,32,33,33,34,35,35,36,37,37,38,39,40,40,41,42,43,43,44,45,46,47,47,48,49,3Z,4c,4d,3T,3T,4b,3Y,1q,3P,4a,3S,3M,3X,3W,2l,3F,2F,3g,1J,2Z,3h,3w,2m,3x,2X,2i,1u,1p,h,1a,1v,2x,3j,2y,3H,H,2o,2K,T,u,1d,1n,2d,2M,1E,1k,1O,2W,2a,2Y,2h,J,3K,1s,3v,1D,v,3a,1Z,1R,d,1G,s,1w,V,P,C,3l,M,1e,I,2n,3C,2c,3s,3e,j,2e,1l,S,q,1b,1c,K,2v,3o,3y,2V,2U,3t,3z,n,3m,2z,3q,2T,3O,1g,2S,1x,1r,1t,U,1L,p,l,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a],[47,49,4c,3T,3Y,3P,4a,3M,3W,3F,3g,1J,3h,2m,2X,1u,3L,h,1v,3j,2y,3H,2o,z,u,1d,1n,1S,1E,1k,1O,2W,2u,2Y,2h,J,2j,1s,3v,1D,2C,3D,1m,1Z,1R,d,c,1G,s,2b,Y,D,L,1C,C,2f,3l,M,1e,Z,I,1B,2n,2I,1i,3E,X,3s,O,3e,1f,j,2w,2e,1X,1l,2J,S,1h,y,3p,1b,2D,1c,1y,1H,K,3d,2v,3u,1z,3o,3G,3J,3I,3N,2V,2k,3U,2U,2B,3t,2Q,1W,3z,1A,2P,n,n,k,2r,3m,3b,3V,2z,2z,3R,3k,3q,o,o,3Q,2T,2R,2R,3B,3O,3O,2G,1I,1I,1g,1P,1P,3i,3c,3c,2S,2S,1j,1V,1V,1x,1x,3n,3n,1Y,1Y,1r,1r,N,w,w,w,1t,1t,2s,2s,1o,1o,U,U,2L,2L,A,A,A,1L,1L,E,E,E,F,F,p,p,p,x,x,i,i,i,l,l,l,f,f,e,e,e,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a])},4t:4g(){4f 4h.4e([0,2,3,5,7,9,10,12,14,15,17,19,20,22,24,26,27,29,31,32,34,36,37,39,41,42,44,46,47,49,4c,4d,4b,1q,3P,3S,3X,3W,3F,3g,1J,3h,3w,3x,2i,1u,1p,h,1v,2x,t,3H,H,2K,z,u,1d,1n,2d,2M,1E,1k,1O,2W,2a,2Y,Q,2N,J,2j,1s,3f,W,1D,v,3D,3a,1Z,2E,1R,d,c,2H,2p,s,2b,Y,V,D,L,1C,C,m,2f,3l,M,2t,1e,Z,1Q,I,1B,2q,2I,3C,1i,3E,2c,X,3s,3s,O,2O,3e,1f,2A,j,2w,2e,1M,1X,1l,1N,2J,S,1h,1h,y,q,3p,1b,2D,3r,1c,1c,1y,1H,K,3d,3d,1T,2v,3u,1z,1z,3o,3G,3J,3y,3y,3I,3N,2V,2V,2k,3U,3U,2U,2B,3t,3t,2Q,1W,1W,3z,1A,1A,2P,n,n,k,2r,2r,3m,3b,3b,3V,3V,2z,3R,3R,3k,3k,3q,o,o,3Q,3Q,2T,2R,2R,3B,3B,3O,3O,2G,1I,1I,1g,1g,1P,1P,3i,3i,3c,3c,2S,2S,1j,1V,1V,1x,1x,3n,3n,1Y,1Y,1r,1r,N,N,w,w,1t,1t,2s,2s,1o,1o,U,U,U,2L,2L,A,A,1L,1L,E,E,F,F,p,p,x,x,i,i,l,l,l,f,f,e,e,a],[0,1,3,4,5,6,8,9,10,11,13,14,15,16,18,19,20,21,23,24,25,26,28,29,30,31,33,34,35,36,38,39,40,41,43,44,45,46,48,49,3Z,4c,4d,4b,3Y,1q,3P,3S,3M,3X,3W,2l,2F,3g,1J,2Z,3w,2m,3x,2X,2i,3L,1p,h,1a,1v,2x,t,2y,3H,H,2o,z,T,u,1d,1K,1n,2d,2M,1E,3A,1k,1O,2g,2W,2u,2Y,Q,2h,2N,J,3K,2j,3f,3v,W,1D,2C,v,3D,3a,1m,1Z,2E,1F,d,c,2H,1G,2p,s,2b,1w,Y,V,D,L,P,1C,C,m,2f,3l,1U,M,2t,1e,Z,1Q,I,1B,2q,2n,2I,3C,1i,3E,2c,X,X,3s,O,2O,3e,1f,2A,j,2w,2e,1M,1X,1l,1l,1N,2J,S,1h,y,q,3p,1b,1b,2D,3r,1c,1y,1H,K,3d,3d,1T,2v,3u,1z,3o,3G,3G,3J,3y,3I,3N,2V,2V,2k,3U,2U,2B,3t,3t,2Q,1W,3z,1A,1A,2P,n,k,2r,2r,3m,3b,3V,2z,2z,3R,3k,3q,o,o,3Q,2T,2R,3B,3B,3O,2G,1I,1g,1g,1P,3i,3c,3c,2S,1j,1V,1V,1x,3n,1Y,1r,1r,N,w,1t,1t,2s,1o,U,U,2L,A,1L,E,E,F,p,x,x,i,l,f,f,e,a],[0,3,5,8,10,13,15,18,20,22,25,27,30,32,34,37,39,41,43,45,48,3Z,4d,4b,1q,3P,3S,3X,2l,3F,3g,1J,3h,3w,2m,2X,2i,1u,3L,1p,h,h,1a,1v,1v,2x,2x,3j,t,t,2y,2y,3H,3H,3H,H,H,H,2o,2o,2o,2K,2K,2K,2K,z,z,z,z,z,z,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,u,u,u,u,u,u,u,u,u,u,u,u,u,u,u,u,u,u,u,1d,1d,1d,1d,1d,1d,1d,1K,1K,1K,1K,1n,1n,1n,2d,2d,2d,1S,1S,1S,2M,2M,1E,1E,3A,3A,1k,1O,1O,2g,2W,2W,2a,2u,2Y,Q,Q,2h,2N,J,3K,2j,1s,3f,3v,W,1D,1D,2C,v,3a,1m,1Z,2E,1R,1F,d,c,2H,1G,2p,s,1w,Y,V,D,L,P,C,m,2f,3l,M,2t,1e,Z,I,1B,2q,2n,3C,1i,3E,X,3s,O,3e,1f,2A,2w,2e,1X,1l,1N,S,1h,q,3p,1b,3r,1c,1H,K,1T,2v,1z,3o,3J,3y,3N,2V,3U,2U,3t,2Q,3z,1A,n,k,3m,3b,2z,3R,3q,o,2T,2R,3O,2G,1g,3i,3c,1j,1V,3n,1Y,N,1t,2s,U,2L,1L,E,p,x,l,e,a])},4u:4g(){4f 4h.4e([4b,4b,3Y,3Y,3Y,1q,1q,3P,3P,3P,4a,4a,4a,3S,3S,3M,3M,3M,3X,3X,3X,3W,3W,2l,2l,2l,3F,3F,2F,2F,2F,3g,3g,1J,1J,1J,2Z,2Z,3h,3h,3h,3w,3w,2m,2m,3x,3x,2X,2X,2X,2i,2i,1u,1u,3L,3L,1p,1p,h,h,1a,1a,1v,1v,2x,2x,3j,3j,t,t,2y,3H,3H,H,H,2o,2o,2K,z,z,T,T,u,1d,1d,1K,1n,1n,2d,1S,1S,2M,1E,1E,3A,1k,1k,1O,2g,2g,2W,2a,2u,2u,2Y,Q,Q,2h,2N,J,3K,3K,2j,1s,3f,3f,3v,W,1D,2C,2C,v,3D,3a,1m,1Z,1Z,2E,1R,1F,d,c,c,2H,1G,2p,s,2b,1w,Y,Y,V,D,L,P,1C,C,m,2f,3l,1U,M,M,2t,1e,Z,1Q,I,1B,2q,2n,2I,3C,1i,3E,2c,X,3s,O,2O,3e,1f,2A,j,2w,2e,1M,1X,1l,1N,2J,S,1h,y,q,3p,1b,2D,3r,1c,1y,1H,K,3d,1T,2v,1z,3o,3G,3J,3y,3I,3N,2V,2k,3U,2U,2B,3t,2Q,1W,1A,2P,n,k,2r,3m,3b,3V,2z,3R,3k,o,3Q,2T,2R,3B,3O,2G,1I,1g,1P,3c,2S,1j,1V,1x,3n,1Y,1r,N,w,2s,1o,U,2L,A,1L,E,F,p,i,l,f,e,a],[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,3Z,4c,4d,3T,4b,3Y,1q,3P,4a,3S,3M,3X,3W,2l,3F,2F,3g,1J,2Z,3h,3w,2m,3x,2X,2i,1u,3L,1p,h,1a,1v,2x,3j,t,2y,3H,H,2o,2K,z,T,u,1d,1K,1n,2d,1S,2M,1E,3A,1k,1O,2g,2W,2u,2Y,Q,2h,2N,J,3K,2j,1s,3f,3v,W,1D,2C,v,3D,3a,1m,1Z,2E,1R,1F,d,c,2H,1G,2p,s,2b,1w,Y,D,L,P,1C,C,m,2f,3l,1U,M,2t,1e,Z,1Q,I,1B,2q,2n,2I,3C,1i,3E,2c,X,X,3s,O,2O,3e,1f,2A,j,2w,2e,1M,1X,1X,1l,1N,2J,S,1h,y,y,q,3p,1b,2D,2D,3r,1c,1y,1y,1H,K,3d,3d,1T,2v,2v,3u,1z,1z,3o,3G,3G,3J,3J,3y,3y,3I,3N,3N,2V,2V,2k,2k,2k,3U,3U,2U,2U,2B,2B,2B,3t,3t,3t,2Q,2Q,2Q,1W,1W,1W,3z,3z,3z,1A,1A,1A,1A,2P,2P,2P,n,n,n,n,n,k,k,k,k,2r,2r,2r,2r,3m,3m,3m],[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,42,43,44,45,46,47,48,49,3Z,4c,4d,3T,4b,3Y,1q,3P,4a,3S,3M,3X,3X,3W,2l,3F,2F,3g,1J,2Z,3h,3w,3w,2m,3x,2X,2i,1u,3L,1p,1p,h,1a,1v,2x,3j,3j,t,2y,3H,H,H,2o,2K,z,z,T,u,1d,1d,1K,1n,2d,2d,1S,2M,1E,1E,3A,1k,1k,1O,2g,2g,2W,2a,2a,2u,2Y,2Y,Q,Q,2h,2N,2N,J,J,3K,3K,2j,1s,1s,3f,3f,3v,3v,W,W,1D,1D,2C,2C,v,v,v,3D,3D,3a,3a,1m,1m,1m,1Z,1Z,2E,2E,2E,1R,1R,1R,1F,1F,1F,d,d,d,c,c,c,2H,2H,2H,2H,1G,1G,1G,2p,2p,2p,2p,s,s,s,s,2b,2b,2b,2b,1w,1w,1w,1w,1w,Y,Y,Y,Y,Y,V,V,V,V,V,V,D,D,D,D,D,D,L,L,L,L,L,L,P,P,P,P,P,P,P,1C,1C,1C,1C,1C,1C,1C,1C,C,C,C,C,C,C,C,m,m,m,m,m,m,m,m,m,m,m,m,m,m,m,m,m,m])},4v:4g(){4f 4h.4e([0,2,3,5,7,8,10,12,13,15,17,18,20,22,24,25,27,29,30,32,34,35,37,38,40,42,43,45,47,48,3Z,4d,3T,3Y,3P,4a,3M,3X,2l,2F,3g,2Z,3h,2m,2X,2i,3L,1p,1a,1v,3j,t,3H,2o,2K,T,u,1K,1n,1S,2M,3A,1k,2g,2W,2u,2Y,Q,2N,J,2j,1s,3v,W,1D,v,3D,3a,1Z,2E,1F,d,c,1G,2p,s,2b,Y,V,D,P,1C,C,m,2f,1U,M,2t,1e,Z,I,1B,2q,2n,2I,3C,1i,3E,2c,3s,O,2O,3e,1f,2A,j,2w,2e,1M,1X,1l,1N,2J,S,1h,y,q,3p,3p,1b,2D,3r,1c,1y,1H,K,3d,3d,1T,2v,3u,1z,3o,3o,3G,3J,3y,3I,3I,3N,2V,2k,2k,3U,2U,2B,2B,3t,2Q,1W,1W,3z,1A,1A,2P,n,n,k,2r,2r,3m,3b,3b,3V,2z,2z,3R,3R,3k,3q,3q,o,o,3Q,2T,2T,2R,2R,3B,3O,3O,2G,2G,1I,1I,1g,1g,1P,1P,3i,3c,3c,2S,2S,1j,1j,1V,1V,1x,1x,3n,3n,1Y,1Y,1r,1r,N,N,N,w,w,1t,1t,2s,2s,1o,1o,U,U,2L,2L,2L,A,A,1L,1L,E,E,F,F,F,p,p,x,x,i,i,l,l,l,f,f,e,e,a,a],[0,1,1,2,3,3,4,4,5,6,6,7,8,8,9,10,10,11,11,12,13,13,14,15,15,16,17,17,18,19,19,20,20,21,22,22,23,24,24,25,26,26,27,28,28,29,30,30,31,32,33,33,34,35,35,36,37,37,38,39,40,40,41,42,42,43,44,45,45,46,47,47,48,49,3Z,3Z,4c,4d,3T,3T,4b,3Y,1q,3P,3P,4a,3S,3M,3M,3X,3W,2l,3F,2F,2F,3g,1J,2Z,3h,3h,3w,2m,3x,2X,2i,1u,1u,3L,1p,h,1a,1v,2x,3j,t,t,2y,3H,H,2o,2K,z,T,u,1d,1K,1n,2d,1S,2M,1E,3A,1k,1O,2g,2W,2a,2u,2Y,Q,2h,2N,J,3K,2j,1s,3f,3v,W,2C,v,3D,3a,1m,1Z,2E,1R,d,c,2H,1G,2p,s,2b,Y,V,D,L,P,C,m,2f,3l,1U,2t,1e,Z,1Q,1B,2q,2n,2I,1i,3E,2c,X,O,2O,3e,1f,j,2w,2e,1X,1l,1N,2J,1h,y,q,1b,2D,3r,1y,1H,K,1T,2v,3u,3o,3G,3J,3I,3N,2V,3U,2U,2B,2Q,1W,1A,2P,n,2r,3m,3b,2z,3R,3k,o,3Q,2R,3B,3O,1I,1g,3i,3c,2S,1V,1x,3n,1r,N,1t,2s,1o,2L,A,E,F,p,i,l,e,a],[d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c])},4w:4g(){4f 4h.4e([0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,13,13,14,15,15,16,17,17,18,19,20,20,21,22,23,24,25,26,27,28,28,30,31,32,33,34,35,36,37,39,40,41,42,44,45,47,48,49,4c,3T,4b,1q,3P,3S,3X,2l,3F,3g,2Z,3w,3x,2i,3L,h,1v,3j,2y,2o,z,u,1K,1S,1E,1k,2W,2u,Q,2N,3K,3f,W,2C,3D,1m,2E,1F,c,1G,s,1w,V,L,1C,C,2f,1U,2t,Z,1Q,1B,2n,2I,1i,2c,X,O,2O,1f,2A,2w,2e,1X,1l,2J,S,y,q,3p,2D,3r,1c,1H,K,3d,1T,3u,1z,3o,3G,3J,3I,3N,2V,2k,3U,2U,2B,3t,2Q,1W,3z,1A,2P,n,k,2r,3m,3b,3b,3V,2z,3R,3k,3q,3q,o,3Q,2T,2T,2R,3B,3O,3O,2G,1I,1I,1g,1P,1P,3i,3i,3c,2S,2S,1j,1j,1V,1V,1x,3n,3n,1Y,1Y,1r,1r,1r,N,N,w,w,1t,1t,2s,2s,2s,1o,1o,U,U,U,2L,2L,2L,A,A,A,1L,1L,1L,E,E,E,F,F,F,p,p,p,p,x,x,x,x,i,i,i,l,l,l,l,f,f,f,f,e,e,e,e,a,a,a],[0,1,1,2,2,3,4,4,5,6,6,7,7,8,9,9,10,11,11,12,13,13,14,15,15,16,17,17,18,19,19,20,21,22,22,23,24,25,25,26,27,28,28,29,30,31,32,32,33,34,35,36,37,38,39,39,40,41,42,43,44,45,46,47,48,49,3Z,4c,4d,3T,3Y,1q,3P,4a,3S,3M,3X,2l,3F,2F,3g,2Z,3h,3w,2m,2X,2i,1u,1p,h,1v,2x,3j,2y,3H,2o,2K,T,1d,1K,2d,1S,1E,1k,1O,2W,2u,2Y,2h,J,2j,3f,3v,1D,v,3a,1Z,2E,1F,c,1G,s,2b,Y,D,L,1C,m,2f,1U,2t,1e,1Q,I,2q,2n,3C,1i,2c,X,O,2O,1f,2A,j,2e,1M,1X,1N,2J,S,y,q,3p,1b,3r,1c,1y,1H,K,3d,2v,3u,1z,3o,3G,3J,3y,3I,3N,2V,2k,3U,2U,2B,3t,2Q,1W,3z,1A,2P,n,n,k,2r,3m,3b,3V,3V,2z,3R,3k,3q,3q,o,3Q,2T,2T,2R,3B,3O,3O,2G,1I,1I,1g,1P,1P,3i,3c,3c,2S,1j,1j,1V,1x,1x,3n,3n,1Y,1r,1r,N,N,w,w,1t,2s,2s,1o,1o,U,U,2L,2L,A,A,1L,1L,E,E,F,F,p,p,x,x,i,i,l,l,f,e,e,a,a],[0,1,2,3,4,5,6,7,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,3Z,4c,4d,3T,4b,3Y,1q,3P,4a,3S,3M,3X,3W,2l,3F,2F,3g,1J,1J,2Z,3h,3w,2m,3x,2X,2i,1u,3L,1p,1p,h,1a,1v,2x,3j,t,2y,2y,3H,H,2o,2K,z,z,T,u,1d,1K,1K,1n,2d,1S,1S,2M,1E,3A,1k,1k,1O,2g,2W,2W,2a,2u,2Y,2Y,Q,2h,2N,2N,J,3K,2j,1s,1s,3f,3v,W,1D,1D,2C,v,3D,3a,1m,1m,1Z,2E,1R,1F,d,c,2H,1G,1G,2p,s,2b,1w,Y,V,D,L,P,1C,C,m,2f,3l,1U,M,2t,1e,Z,1Q,I,1B,2q,2n,2I,3C,1i,3E,2c,X,3s,O,2O,3e,1f,2A,j,2w,2e,1M,1X,1N,2J,S,1h,y,q,3p,1b,2D,3r,1y,1H,K,3d,1T,2v,3u,1z,3G,3J,3y,3I,3N,2V,2k,2U,2B,3t,2Q,1W,3z,2P,n,k,2r,3m,3b,2z,3R,3k,3q,o,3Q,2R,3B,3O,2G,1I,1P,3i,3c,2S,1j,1V,3n,1Y,1r,N,w,2s,1o,U,2L,A,E,F,p,x,i,f,e,a])},4x:4g(){4f 4h.4e([0,1,1,2,2,3,3,4,5,5,6,6,7,8,8,9,9,10,11,11,12,12,13,14,14,15,16,16,17,17,18,19,19,20,21,21,22,23,24,24,25,26,26,27,28,29,29,30,31,32,33,33,34,35,36,37,38,38,39,40,41,42,43,44,45,46,47,48,49,3Z,4c,4d,3T,4b,3Y,1q,3P,4a,3S,3M,3X,2l,3F,2F,3g,1J,2Z,3w,2m,3x,2X,2i,3L,1p,h,1a,2x,3j,t,2y,H,2o,2K,T,u,1d,1n,2d,1S,1E,3A,1k,2g,2W,2u,2Y,Q,2N,J,2j,1s,3v,W,2C,v,3a,1m,2E,1R,1F,c,1G,2p,2b,1w,V,D,P,1C,m,2f,1U,M,1e,Z,I,1B,2n,2I,1i,3E,X,3s,2O,3e,2A,j,2e,1M,1l,1N,S,1h,y,3p,1b,3r,1c,1y,K,3d,1T,2v,1z,3o,3G,3J,3I,3N,2V,2k,3U,2U,2B,2Q,1W,3z,1A,2P,n,k,2r,3m,3b,3V,2z,3R,3R,3k,3q,o,3Q,2T,2R,2R,3B,3O,2G,1I,1I,1g,1P,3i,3i,3c,2S,1j,1j,1V,1x,1x,3n,1Y,1Y,1r,N,N,w,1t,1t,2s,2s,1o,U,U,2L,2L,A,1L,1L,E,E,F,F,p,p,x,i,i,l,l,f,f,e,e,a],[0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,2,2,2,2,3,3,3,4,4,5,5,6,6,7,7,8,9,9,10,11,12,13,14,14,15,17,18,19,20,21,23,24,25,27,28,30,32,33,35,37,39,41,43,45,47,49,4d,4b,1q,3S,3X,3F,3g,3h,3x,2i,1p,1v,t,3H,2K,u,1n,2M,3A,2g,2u,2h,J,1s,W,2C,3a,1Z,1F,c,2p,2b,V,L,1C,m,3l,M,Z,I,1B,2n,3C,3E,X,O,2O,1f,j,2w,1M,1X,1N,2J,1h,y,q,1b,2D,3r,1c,1y,1H,3d,1T,2v,3u,1z,1z,3o,3G,3J,3y,3I,3I,3N,2V,2k,2k,3U,3U,2U,2B,2B,3t,3t,2Q,2Q,2Q,1W,1W,3z,3z,3z,1A,1A,1A,1A,2P,2P,2P,2P,2P,n,n,n,n,n,n,n,k,k,k,k,k,k,k,k,k,k,k,k,k,k,k,k,k,k,k,k,k,k,k,k,k,k,k,k,k,k,k,k,k,k,k,k,k,k,k,k,k,k,k,k,k,k,k,k,k,k,k,k,k,k,k,k,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n],[0,0,0,0,1,1,1,1,1,1,1,2,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,6,6,6,7,7,7,8,8,9,9,10,10,11,11,12,13,13,14,15,15,16,17,18,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,34,35,36,37,39,40,41,43,44,45,47,48,3Z,4c,3T,4b,1q,3P,3S,3M,3W,2l,2F,1J,2Z,3w,2m,2X,1u,1p,h,1v,3j,t,3H,2o,z,T,1d,1n,1S,1E,3A,1O,2W,2u,Q,2h,J,2j,3f,W,2C,v,3a,1Z,1R,d,2H,2p,s,1w,V,L,1C,m,2f,1U,2t,Z,I,1B,2n,3C,3E,X,3s,2O,1f,j,2w,1M,1l,1N,S,y,q,1b,3r,1c,1H,3d,1T,3u,1z,3G,3J,3I,3N,2k,3U,2B,3t,1W,3z,1A,n,k,2r,3b,3V,2z,3R,3k,o,3Q,2T,2R,3B,3O,2G,1I,1g,1P,3i,3c,2S,1j,1j,1V,1x,3n,3n,1Y,1r,N,N,w,w,1t,2s,2s,1o,1o,U,U,2L,2L,A,A,1L,1L,1L,E,E,F,F,F,p,p,p,x,x,x,x,i,i,i,i,l,l,l,l,l,f,f,f,f,f,f,e,e,e,e,e,e,e,a,a,a,a])},4y:4g(){4f 4h.4e([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,3Z,4c,4d,3T,4b,3Y,1q,3P,4a,3S,3M,3X,3W,2l,3F,2F,3g,1J,2Z,3h,3w,2m,3x,2X,2i,1u,3L,1p,h,1a,1v,2x,3j,t,2y,3H,H,2o,2K,z,T,u,1d,1K,1n,2d,1S,2M,1E,3A,1k,1O,2g,2W,2a,2u,2Y,Q,2h,2N,J,3K,2j,1s,3f,3v,W,1D,2C,v,3D,3a,1m,1Z,2E,1R,1F,d,c,2H,1G,2p,s,2b,1w,Y,V,D,L,P,1C,C,m,2f,3l,1U,M,2t,1e,Z,1Q,I,1B,2q,2n,2I,3C,1i,3E,2c,X,3s,O,2O,3e,1f,2A,j,2w,2e,1M,1X,1l,1N,2J,S,1h,y,q,3p,1b,2D,3r,1c,1y,1H,K,3d,1T,2v,3u,1z,3o,3G,3J,3y,3I,3N,2V,2k,3U,2U,2B,3t,2Q,1W,3z,1A,2P,n,k,2r,3m,3b,3V,2z,3R,3k,3q,o,3Q,2T,2R,3B,3O,2G,1I,1g,1P,3i,3c,2S,1j,1V,1x,3n,1Y,1r,N,w,1t,2s,1o,U,2L,A,1L,E,F,p,x,i,l,f,e,a],[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,3Z,4c,4d,3T,4b,3Y,1q,3P,4a,3S,3M,3X,3W,2l,3F,2F,3g,1J,2Z,3h,3w,2m,3x,2X,2i,1u,3L,1p,h,1a,1v,2x,3j,t,2y,3H,H,2o,2K,z,T,u,1d,1K,1n,2d,1S,2M,1E,3A,1k,1O,2g,2W,2a,2u,2Y,Q,2h,2N,J,3K,2j,1s,3f,3v,W,1D,2C,v,3D,3a,1m,1Z,2E,1R,1F,d,c,2H,1G,2p,s,2b,1w,Y,V,D,L,P,1C,C,m,2f,3l,1U,M,2t,1e,Z,1Q,I,1B,2q,2n,2I,3C,1i,3E,2c,X,3s,O,2O,3e,1f,2A,j,2w,2e,1M,1X,1l,1N,2J,S,1h,y,q,3p,1b,2D,3r,1c,1y,1H,K,3d,1T,2v,3u,1z,3o,3G,3J,3y,3I,3N,2V,2k,3U,2U,2B,3t,2Q,1W,3z,1A,2P,n,k,2r,3m,3b,3V,2z,3R,3k,3q,o,3Q,2T,2R,3B,3O,2G,1I,1g,1P,3i,3c,2S,1j,1V,1x,3n,1Y,1r,N,w,1t,2s,1o,U,2L,A,1L,E,F,p,x,i,l,f,e,a],[3W,2l,3F,3F,2F,3g,1J,2Z,2Z,3h,3w,2m,2m,3x,2X,2i,1u,1u,3L,1p,h,1a,1a,1v,2x,3j,3j,t,2y,3H,H,H,2o,2K,z,z,T,u,1d,1d,1K,1n,2d,2d,1S,2M,1E,1E,3A,1k,1O,1O,2g,2W,2a,2a,2u,2Y,Q,Q,2h,2N,J,J,3K,2j,2j,1s,3f,3v,3v,W,1D,1D,2C,v,v,3D,3a,1m,1m,1Z,2E,2E,1R,1F,1F,d,c,c,2H,2H,1G,2p,2p,s,2b,2b,1w,Y,Y,V,V,D,L,L,P,P,1C,C,C,m,m,2f,2f,3l,1U,1U,M,M,2t,2t,1e,1e,Z,Z,1Q,1Q,I,1B,1B,2q,2q,2q,2n,2n,2I,2I,3C,3C,1i,1i,3E,3E,2c,2c,2c,X,X,3s,3s,O,O,O,2O,2O,3e,3e,3e,1f,1f,2A,2A,2A,j,j,j,2w,2w,2e,2e,2e,1M,1M,1M,1X,1X,1X,1l,1l,1l,1N,1N,1N,2J,2J,2J,S,S,S,S,1h,1h,1h,y,y,y,q,q,q,q,3p,3p,3p,1b,1b,1b,1b,2D,2D,2D,2D,3r,3r,3r,3r,1c,1c,1c,1c,1y,1y,1y,1y,1H,1H,1H,1H,K,K,K,K,3d,3d,3d,3d,1T,1T,1T,1T,2v,2v,2v,2v,2v,3u,3u,3u,3u,1z,1z,1z,1z,3o,3o,3o])},4z:4g(){4f 4h.4e([0,2,4,6,7,9,11,13,15,17,18,20,22,24,26,27,29,31,33,35,37,38,40,42,44,46,47,49,4c,3T,4b,1q,4a,3M,3X,2l,2F,1J,2Z,3w,3x,2i,1u,1p,1a,1v,3j,2y,3H,2o,z,T,1d,1n,2d,2M,1E,1k,2g,2W,2u,2Y,2h,2N,3K,1s,3f,W,1D,v,3D,3a,1Z,2E,1F,d,2H,1G,2p,2b,1w,Y,D,L,P,C,m,2f,1U,M,2t,1e,1Q,I,1B,2q,2n,3C,1i,3E,2c,X,3s,O,3e,1f,2A,j,2w,2e,1M,1X,1l,1N,2J,S,1h,y,q,3p,1b,2D,3r,1c,1y,1H,1H,K,3d,1T,2v,3u,1z,3o,3o,3G,3J,3y,3I,3N,3N,2V,2k,3U,3U,2U,2B,3t,3t,2Q,1W,3z,3z,1A,2P,2P,n,k,k,2r,3m,3m,3b,3V,3V,2z,2z,3R,3k,3k,3q,3q,o,3Q,3Q,2T,2T,2R,2R,3B,3O,3O,2G,2G,1I,1I,1g,1g,1P,1P,3i,3i,3c,3c,2S,2S,1j,1j,1V,1V,1V,1x,1x,3n,3n,1Y,1Y,1r,1r,1r,N,N,w,w,1t,1t,1t,2s,2s,1o,1o,1o,U,U,2L,2L,2L,A,A,A,1L,1L,E,E,E,F,F,F,p,p,x,x,x,i,i,i,l,l,l,f,f,e,e,e,a,a],[0,1,2,2,3,4,5,5,6,7,8,8,9,10,11,12,12,13,14,15,15,16,17,18,19,19,20,21,22,22,23,24,25,26,26,27,28,29,30,30,31,32,33,34,34,35,36,37,37,38,39,40,41,42,42,43,44,45,46,46,47,48,49,3Z,3Z,4c,4d,3T,4b,3Y,3Y,1q,3P,4a,3S,3M,3M,3X,3W,2l,3F,2F,3g,3g,1J,2Z,3h,3w,2m,3x,2X,2X,2i,1u,3L,1p,h,1a,1v,2x,2x,3j,t,2y,3H,H,2o,2K,z,T,u,u,1d,1K,1n,2d,1S,2M,1E,3A,1k,1O,2g,2W,2a,2u,2Y,Q,2h,2N,J,3K,2j,1s,3f,3v,W,1D,2C,v,3D,3a,1m,1Z,2E,1R,1F,d,c,2H,1G,2p,s,2b,1w,Y,D,L,P,1C,C,m,2f,3l,1U,M,1e,Z,1Q,I,1B,2q,2n,2I,1i,3E,2c,X,3s,O,2O,1f,2A,j,2w,2e,1M,1l,1N,2J,S,1h,y,3p,1b,2D,3r,1c,1H,K,3d,1T,2v,1z,3o,3G,3J,3y,3N,2V,2k,3U,2B,3t,2Q,1W,3z,2P,n,k,2r,3b,3V,2z,3R,3q,o,3Q,2T,2R,3O,2G,1I,1g,3i,3c,2S,1j,1x,3n,1Y,1r,w,1t,2s,1o,2L,A,1L,E,p,x,i,l,e,a],[0,0,0,0,1,1,1,1,1,1,2,2,2,2,2,2,3,3,3,3,3,3,4,4,4,4,4,5,5,5,5,5,5,6,6,6,6,7,7,7,7,7,8,8,8,8,9,9,9,9,10,10,10,10,11,11,11,12,12,12,12,13,13,13,14,14,14,15,15,15,16,16,17,17,17,18,18,19,19,19,20,20,21,21,22,22,23,23,23,24,24,25,25,26,27,27,28,28,29,29,30,30,31,32,32,33,34,34,35,35,36,37,37,38,39,40,40,41,42,43,43,44,45,46,46,47,48,49,3Z,4c,4d,4d,3T,4b,3Y,1q,3P,4a,3S,3M,3X,3W,2l,3F,2F,3g,1J,2Z,3h,3w,2m,2X,2i,1u,3L,1p,h,1v,2x,3j,t,2y,H,2o,2K,T,u,1d,1n,2d,1S,1E,3A,1O,2g,2a,2u,2Y,2h,2N,3K,1s,3f,W,1D,v,3D,1m,2E,1R,d,2H,1G,s,1w,V,D,P,C,2f,1U,M,1e,1Q,1B,2n,3C,1i,2c,3s,2O,1f,j,2e,1X,1N,S,y,3p,2D,1c,1H,3d,2v,1z,3G,3y,3N,2k,2U,3t,1W,1A,n,2r,3b,2z,3k,o,2T,3B,1I,1P,3c,1j,1x,1Y,N,1t,1o,2L,E,p,i,f,a])},4A:4g(){4f 4h.4e([2l,3F,2F,2F,3g,1J,2Z,2Z,3h,3w,2m,2m,3x,2X,2i,2i,1u,3L,1p,1p,h,1a,1v,1v,2x,3j,t,t,2y,3H,H,H,2o,2K,z,z,T,u,1d,1d,1K,1n,2d,2d,1S,2M,1E,1E,3A,1k,1O,1O,2g,2W,2a,2a,2u,2Y,Q,Q,2h,2N,J,J,3K,2j,1s,1s,3f,3v,W,W,1D,2C,v,v,3D,3a,1m,1m,1Z,2E,1R,1R,1F,d,c,2H,2H,1G,2p,s,s,2b,1w,Y,Y,V,D,L,L,P,1C,C,C,m,2f,3l,3l,1U,M,2t,2t,1e,Z,1Q,1Q,I,1B,2q,2q,2n,2I,3C,3C,1i,3E,2c,2c,X,3s,O,O,2O,3e,1f,1f,2A,j,2w,2w,2e,1M,1X,1X,1l,1N,2J,2J,S,1h,y,y,q,3p,1b,1b,2D,3r,1c,1c,1y,1H,K,K,3d,1T,2v,2v,3u,1z,3o,3G,3G,3J,3y,3I,3I,3N,2V,2k,2k,3U,2U,2B,2B,3t,2Q,1W,1W,3z,1A,2P,2P,n,k,2r,2r,3m,3b,3V,3V,2z,3R,3k,3k,3q,o,3Q,3Q,2T,2R,3B,3B,3O,2G,1I,1I,1g,1P,3i,3i,3c,2S,1j,1j,1V,1x,3n,3n,1Y,1r,N,N,w,1t,2s,2s,1o,U,2L,2L,A,1L,E,E,F,p,x,x,i,l,f,f,e,a],[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,3Z,4c,4d,3T,4b,3Y,1q,3P,4a,3S,3M,3X,3W,2l,3F,2F,3g,1J,2Z,3h,3w,2m,3x,2X,2i,1u,3L,1p,h,1a,1v,2x,3j,t,2y,3H,H,2o,2K,z,T,u,1d,1K,1n,2d,1S,2M,1E,3A,1k,1O,2g,2W,2a,2u,2Y,Q,2h,2N,J,3K,2j,1s,3f,3v,W,1D,2C,v,3D,3a,1m,1Z,2E,1R,1F,d,c,2H,1G,2p,s,2b,1w,Y,V,D,L,P,1C,C,m,2f,3l,1U,M,2t,1e,Z,1Q,I,1B,2q,2n,2I,3C,1i,3E,2c,X,3s,O,2O,3e,1f,2A,j,2w,2e,1M,1X,1l,1N,2J,S,1h,y,q,3p,1b,2D,3r,1c,1y,1H,K,3d,1T,2v,3u,1z,3o,3G,3J,3y,3I,3N,2V,2k,3U,2U,2B,3t,2Q,1W,3z,1A,2P,n,k,2r,3m,3b,3V,2z,3R,3k,3q,o,3Q,2T,2R,3B,3O,2G,1I,1g,1P,3i,3c,2S,1j,1V,1x,3n,1Y,1r,N,w,1t,2s,1o,U,2L,A,1L,E,F,p,x,i,l,f,e,a],[2l,3F,3F,2F,2F,3g,3g,1J,1J,2Z,2Z,3h,3h,3w,3w,2m,2m,3x,3x,2X,2X,2i,2i,1u,1u,3L,3L,1p,1p,h,h,1a,1a,1v,1v,2x,2x,3j,3j,t,t,2y,2y,3H,3H,H,H,2o,2o,2K,2K,z,z,T,T,u,u,1d,1d,1K,1K,1n,1n,2d,2d,1S,1S,2M,2M,1E,1E,3A,3A,1k,1k,1O,1O,2g,2g,2W,2W,2a,2a,2u,2u,2Y,2Y,Q,Q,2h,2h,2N,2N,J,J,3K,3K,2j,2j,1s,1s,3f,3f,3v,3v,W,W,1D,1D,2C,2C,v,v,3D,3D,3a,3a,1m,1m,1Z,1Z,2E,2E,1R,1R,1F,1F,d,d,c,c,2H,2H,1G,1G,2p,2p,s,s,2b,2b,1w,1w,Y,Y,V,V,D,D,L,L,P,P,1C,1C,C,C,m,m,2f,2f,3l,3l,1U,1U,M,M,2t,2t,1e,1e,Z,Z,1Q,1Q,I,I,1B,1B,2q,2q,2n,2n,2I,2I,3C,3C,1i,1i,3E,3E,2c,2c,X,X,3s,3s,O,O,2O,2O,3e,3e,1f,1f,2A,2A,j,j,2w,2w,2e,2e,1M,1M,1X,1X,1l,1l,1N,1N,2J,2J,S,S,1h,1h,y,y,q,q,3p,3p,1b,1b,2D,2D,3r,3r,1c,1c,1y,1y,1H,1H,K,K,3d,3d,1T,1T,2v,2v,3u,3u,1z])},4B:4g(){4f 4h.4e([12,13,13,14,14,15,16,16,17,17,18,18,19,19,20,20,20,21,21,21,22,22,22,22,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,24,24,24,24,24,25,25,25,26,26,27,27,28,29,29,30,31,32,32,33,34,35,36,37,38,39,40,41,42,43,44,46,47,48,49,3Z,4d,3T,4b,3Y,3P,4a,3S,3M,3W,2l,3F,3g,1J,2Z,3w,2m,3x,2i,1u,3L,h,1a,1v,2x,t,2y,3H,2o,2K,z,u,1d,1K,1n,1S,2M,1E,1k,1O,2g,2W,2u,2Y,Q,2N,J,3K,2j,3f,3v,W,1D,v,3D,3a,1m,2E,1R,1F,d,2H,1G,2p,s,2b,Y,V,D,L,P,C,m,2f,3l,1U,M,1e,Z,1Q,I,1B,2q,2n,3C,1i,3E,2c,X,3s,O,2O,3e,1f,j,2w,2e,1M,1X,1l,1N,2J,S,1h,y,q,3p,1b,2D,3r,1c,1y,1H,K,3d,3d,1T,2v,3u,1z,3o,3G,3J,3y,3y,3I,3N,2V,2k,3U,3U,2U,2B,3t,2Q,2Q,1W,3z,1A,2P,2P,n,k,2r,2r,3m,3b,3V,3V,2z,3R,3R,3k,3q,3q,o,3Q,2T,2T,2R,3B,3B,3O,2G,2G,1I,1g,1g,1P,3i,3i,3c,2S,2S,1j,1V,1V,1x],[9,10,10,11,11,12,13,13,14,14,15,16,16,17,18,19,20,20,21,22,23,24,25,26,27,28,29,31,32,33,34,35,37,38,39,41,42,43,45,46,48,49,3Z,4d,3T,3Y,1q,3P,3S,3M,3W,2l,3F,3g,1J,2Z,3w,2m,3x,2i,1u,3L,1p,1a,1v,2x,3j,2y,3H,H,2o,2K,z,u,1d,1K,1n,2d,1S,2M,1E,1k,1O,2g,2W,2a,2u,2Y,Q,2h,2N,J,3K,2j,1s,3f,3v,W,1D,2C,v,3D,3a,1m,1Z,2E,1R,1F,d,c,c,2H,1G,2p,s,2b,1w,Y,V,D,D,L,P,1C,C,m,2f,2f,3l,1U,M,2t,1e,1e,Z,1Q,I,1B,2q,2q,2n,2I,3C,1i,1i,3E,2c,X,X,3s,O,2O,3e,3e,1f,2A,j,j,2w,2e,1M,1M,1X,1l,1l,1N,2J,S,S,1h,y,q,q,3p,1b,1b,2D,3r,1c,1c,1y,1H,1H,K,3d,3d,1T,2v,3u,3u,1z,3o,3o,3G,3J,3J,3y,3I,3I,3N,2V,2V,2k,3U,2U,2U,2B,3t,3t,2Q,1W,1W,3z,1A,1A,2P,n,n,k,2r,2r,3m,3b,3b,3V,3V,2z,3R,3R,3k,3q,3q,o,3Q,3Q,2T,2R,2R,3B,3O,3O,2G,1I,1I,1g,1P,1P,3i,3i,3c,2S,2S,1j,1V,1V,1x],[32,33,34,35,36,37,38,38,39,40,41,42,43,44,45,46,47,48,49,3Z,4c,4d,4d,3T,4b,3Y,1q,3P,4a,3S,3M,3X,3W,2l,3F,2F,3g,1J,2Z,2Z,3h,3w,2m,3x,2X,2i,1u,3L,1p,h,1a,1v,2x,3j,t,2y,3H,H,2o,2K,z,T,u,1d,1K,1n,2d,1S,2M,1E,3A,1k,1k,1O,2g,2W,2a,2u,2Y,Q,2h,2N,J,3K,2j,1s,1s,3f,3v,W,1D,2C,v,v,3D,3a,1m,1Z,1Z,2E,1R,1F,1F,d,c,c,2H,1G,1G,2p,s,s,2b,1w,1w,Y,Y,V,V,D,D,L,L,P,P,1C,1C,C,C,m,m,2f,2f,3l,3l,3l,1U,1U,M,M,M,2t,2t,1e,1e,1e,Z,Z,Z,1Q,1Q,1Q,I,I,I,1B,1B,1B,2q,2q,2q,2n,2n,2n,2I,2I,2I,3C,3C,3C,1i,1i,1i,3E,3E,3E,2c,2c,2c,X,X,X,3s,3s,3s,O,O,O,2O,2O,2O,3e,3e,3e,1f,1f,2A,2A,2A,j,j,2w,2w,2w,2e,2e,2e,1M,1M,1X,1X,1X,1l,1l,1l,1N,1N,1N,2J,2J,2J,S,S,S,S,1h,1h,1h,1h,1h,y,y,y,y,y,y,q,q,q,q,q,q,q,q,q,q,q,q,q,q,q,q,q,q,q,q])},4C:4g(){4f 4h.4e([0,0,1,1,1,2,2,2,3,3,4,4,4,5,5,5,6,6,7,7,7,8,8,9,9,9,10,10,11,11,12,12,13,13,14,14,15,15,16,16,17,17,18,18,19,20,20,21,22,22,23,23,24,25,26,26,27,28,29,29,30,31,32,33,34,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,3Z,4c,4d,3T,4b,1q,3P,4a,3S,3X,3W,2l,3F,3g,1J,2Z,3w,2m,2X,2i,1u,1p,h,1v,2x,3j,2y,3H,2o,2K,T,u,1K,1n,1S,2M,3A,1k,2g,2a,2u,Q,2h,J,3K,1s,3v,W,2C,v,3a,1m,2E,1F,d,2H,1G,s,1w,Y,D,L,1C,m,2f,1U,M,1e,Z,I,2q,2n,3C,1i,2c,X,O,2O,1f,2A,2w,1M,1X,1N,2J,S,y,q,1b,2D,1c,1y,K,3d,1T,3u,1z,3G,3J,3y,3N,2V,2k,3U,2B,3t,2Q,1W,1A,2P,n,k,2r,3b,3V,2z,3R,3k,3q,o,3Q,2T,2R,3B,3O,2G,1I,1g,1P,3i,3i,3c,2S,1j,1V,1V,1x,3n,1Y,1Y,1r,N,N,w,w,1t,2s,2s,1o,1o,U,2L,2L,A,A,1L,1L,E,E,F,F,p,p,x,x,i,i,i,l,l,f,f,e,e,a,a],[0,1,2,2,3,4,5,5,6,7,8,8,9,10,11,11,12,13,14,15,15,16,17,18,18,19,20,21,21,22,23,24,25,25,26,27,28,29,29,30,31,32,33,33,34,35,36,37,38,38,39,40,41,42,43,43,44,45,46,47,48,48,49,3Z,4c,4d,3T,4b,3Y,1q,1q,3P,4a,3S,3M,3X,3W,2l,3F,2F,3g,1J,1J,2Z,3h,3w,2m,3x,2X,2i,1u,3L,1p,h,1a,1v,2x,3j,t,2y,3H,H,2o,2K,z,u,1d,1K,1n,2d,1S,2M,1E,3A,1k,2g,2W,2a,2u,2Y,Q,2h,J,3K,2j,1s,3f,W,1D,2C,v,3D,1m,1Z,2E,1R,d,c,2H,2p,s,2b,Y,V,D,L,1C,C,m,3l,1U,2t,1e,Z,I,1B,2q,2I,3C,1i,2c,X,O,2O,3e,2A,j,2w,1M,1X,1l,2J,S,1h,q,3p,1b,3r,1c,1y,K,3d,1T,3u,1z,3o,3G,3y,3I,3N,2V,2k,2U,2B,3t,2Q,1W,1A,2P,n,k,2r,3m,3b,3V,2z,3R,3k,3q,o,3Q,2T,2R,3B,3O,2G,1I,1g,1g,1P,3i,3c,2S,1j,1j,1V,1x,3n,1Y,1Y,1r,N,w,w,1t,2s,1o,1o,U,2L,A,A,1L,E,E,F,p,p,x,i,l,l,f,e,e,a],[1q,1q,1q,1q,1q,1q,1q,1q,1q,1q,3P,3P,4a,4a,3S,3M,3M,3X,3W,3W,2l,2l,3F,2F,2F,3g,1J,1J,2Z,2Z,3h,3w,3w,2m,2m,3x,2X,2X,2i,1u,1u,3L,3L,1p,h,h,1a,1a,1v,2x,2x,3j,t,t,2y,2y,3H,H,H,2o,2K,2K,z,z,T,u,u,1d,1d,1K,1n,1n,2d,1S,1S,2M,2M,1E,3A,3A,1k,1k,1O,2g,2g,2W,2a,2a,2u,2u,2Y,Q,Q,2h,2N,2N,J,J,3K,2j,2j,1s,1s,3f,3v,3v,W,1D,1D,2C,2C,v,3D,3D,3a,3a,1m,1Z,1Z,2E,1R,1R,1F,1F,d,c,c,2H,1G,1G,2p,2p,s,2b,2b,1w,1w,Y,V,V,D,L,L,P,P,1C,C,C,m,2f,2f,3l,3l,1U,M,M,2t,2t,1e,Z,Z,1Q,I,I,1B,1B,2q,2n,2n,2I,2I,3C,1i,1i,3E,2c,2c,X,X,3s,O,O,2O,3e,3e,1f,1f,2A,j,j,2w,2w,2e,1M,1M,1X,1l,1l,1N,1N,2J,S,S,1h,1h,y,q,q,3p,1b,1b,2D,2D,3r,1c,1c,1y,1H,1H,K,K,3d,1T,1T,2v,2v,3u,1z,1z,3o,3G,3G,3J,3J,3y,3I,3I,3N,3N,2V,2k,2k,3U,2U,2U,2B,2B,3t,2Q,2Q,1W,3z,3z,1A,1A,2P])},4D:4g(){4f 4h.4e([0,1,1,2,2,3,4,4,5,5,6,7,7,8,8,9,10,10,11,11,12,13,13,14,14,15,16,16,17,18,18,19,19,20,21,21,22,23,23,24,25,25,26,27,27,28,29,29,30,31,32,32,33,34,34,35,36,37,37,38,39,40,40,41,42,43,44,44,45,46,47,48,48,49,3Z,4c,4d,3T,4b,4b,3Y,1q,3P,4a,3S,3M,3X,3W,2l,3F,2F,3g,1J,2Z,3h,3w,2m,3x,2X,2i,1u,3L,1p,h,1a,1v,2x,t,2y,3H,H,2o,2K,T,u,1d,1K,1n,1S,2M,1E,3A,1O,2g,2W,2a,2Y,Q,2h,J,3K,2j,3f,3v,W,2C,v,3D,1m,1Z,1R,1F,d,2H,1G,s,2b,1w,V,D,P,1C,m,2f,1U,M,1e,Z,I,1B,2n,2I,1i,3E,X,3s,2O,3e,2A,j,2e,1M,1l,2J,S,y,q,1b,2D,1c,1H,K,1T,2v,1z,3G,3J,3I,3N,2k,2U,2B,2Q,1W,1A,n,k,3m,3V,2z,3k,o,3Q,2R,3B,2G,1g,1P,3c,1j,1V,3n,1r,N,1t,1o,U,A,E,F,x,l,f,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a],[0,1,2,3,3,4,5,6,7,8,9,10,10,11,12,13,14,15,16,17,17,18,19,20,21,22,23,24,24,25,26,27,28,29,30,31,32,33,33,34,35,36,37,38,39,40,41,42,43,44,44,45,46,47,48,49,3Z,4c,4d,3T,4b,3Y,1q,3P,4a,3S,3M,3X,3W,2l,3F,2F,3g,1J,2Z,3h,3w,2m,3x,2X,2i,1u,3L,1p,h,1v,2x,3j,t,2y,3H,H,2o,2K,z,u,1d,1K,1n,2d,1S,2M,3A,1k,1O,2g,2W,2a,2Y,Q,2h,2N,J,2j,1s,3f,3v,W,1D,v,3D,3a,1m,2E,1R,1F,d,c,1G,2p,s,2b,1w,V,D,L,P,C,m,2f,3l,1U,2t,1e,Z,1Q,I,2q,2n,2I,3C,1i,2c,X,3s,O,2O,1f,2A,j,2w,2e,1M,1l,1N,2J,S,1h,y,q,1b,2D,3r,1c,1y,1H,K,3d,1T,3u,1z,3o,3G,3J,3y,3I,3N,2V,2k,3U,2U,2B,3t,2Q,1W,3z,1A,2P,n,k,2r,3m,3b,3V,2z,2z,3R,3k,3q,o,3Q,2T,2R,2R,3B,3O,2G,1I,1g,1g,1P,3i,3c,2S,1j,1j,1V,1x,3n,3n,1Y,1r,N,w,w,1t,2s,1o,1o,U,2L,A,A,1L,E,F,F,p,x,i,i,l,f,e,e,a],[22,23,24,24,25,26,27,28,29,29,30,31,32,33,33,34,35,36,37,37,38,39,40,41,42,42,43,44,45,46,46,47,48,49,3Z,4c,4c,4d,3T,4b,3Y,3Y,1q,3P,4a,3S,3M,3M,3X,3W,2l,3F,3F,2F,3g,1J,2Z,2Z,3h,3w,2m,3x,2X,2X,2i,1u,3L,1p,1p,h,1a,1v,2x,3j,3j,t,2y,3H,H,H,2o,2K,z,T,u,u,1d,1K,1n,2d,2d,1S,2M,1E,3A,3A,1k,1O,2g,2W,2a,2a,2u,2Y,Q,2h,2h,2N,J,3K,2j,1s,1s,3f,3v,W,1D,1D,2C,v,3D,3a,1m,1m,1Z,2E,1R,1F,1F,d,c,2H,1G,1G,2p,s,2b,1w,Y,Y,V,D,L,P,P,1C,C,m,2f,3l,3l,1U,M,2t,1e,1e,Z,1Q,I,1B,2q,2q,2n,2I,3C,1i,1i,3E,2c,X,3s,3s,O,2O,3e,1f,2A,2A,j,2w,2e,1M,1M,1X,1l,1N,2J,S,S,1h,y,q,3p,3p,1b,2D,3r,1c,1y,1y,1H,K,3d,1T,1T,2v,3u,1z,3o,3o,3G,3J,3y,3I,3N,3N,2V,2k,3U,2U,2U,2B,3t,2Q,1W,3z,3z,1A,2P,n,k,k,2r,3m,3b,3V,2z,2z,3R,3k,3q,o,o,3Q,2T,2R,3B,3B,3O,2G,1I,1g,1P,1P,3i,3c])},4E:4g(){4f 4h.4e([0,0,2,2,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,5,5,5,5,5,5,6,6,6,6,6,6,6,6,6,8,8,8,9,9,9,9,9,9,11,11,11,12,12,12,14,14,14,15,15,15,17,17,17,18,18,18,20,20,21,21,21,23,23,23,24,26,26,27,29,29,30,32,32,33,35,35,36,38,38,39,41,41,42,44,44,45,48,48,3Z,3T,3T,4b,1q,1q,3S,3W,3W,2l,2F,2F,3g,2m,2m,3x,2i,2i,h,h,h,t,2y,2y,2o,T,T,1d,1S,1S,1E,1O,1O,2a,2u,2u,2h,3K,3K,W,1D,1D,3D,1Z,1Z,1R,2H,2H,2p,s,s,D,L,L,2f,M,M,2t,1B,1B,2q,2I,2I,2c,O,O,3e,2w,2w,1M,1N,1N,1h,3p,3p,3r,1c,1c,K,2v,2v,1z,3o,3o,3y,3N,3N,2U,3t,3t,3z,3z,3z,n,3m,3m,2z,3R,3R,3q,o,o,2R,2G,2G,1g,1P,1P,2S,1V,1V,1x,1Y,1Y,1r,1t,1t,1o,A,A,F,p,p,p,i,i,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e],[0,2,3,3,5,6,6,8,9,9,9,11,11,12,14,14,15,17,17,17,18,18,20,21,21,23,24,24,24,26,26,27,29,29,30,32,32,33,35,35,36,38,38,41,41,41,42,44,44,45,47,47,3Z,3Z,3Z,4c,3T,3T,4b,1q,1q,3S,3M,3M,3W,2l,2l,3g,2Z,2Z,3h,2m,2m,3x,2i,2i,1u,h,h,1v,t,t,2y,H,H,z,T,T,1d,2d,2d,1S,1E,1E,1O,2g,2g,2u,Q,Q,2h,J,J,1s,W,W,1D,v,v,1m,1Z,1Z,1R,c,c,2H,s,s,1w,D,D,L,1C,1C,C,3l,3l,M,Z,Z,1Q,2q,2q,2I,3C,3C,2c,3s,3s,O,1f,1f,j,2w,2w,1X,1N,1N,2J,1h,1h,3p,1b,1b,3r,1H,1H,K,1T,1T,2v,1z,1z,3o,3J,3J,3y,2V,2V,3U,2U,2U,3t,2Q,2Q,3z,1A,1A,n,k,k,3m,3b,3b,2z,2z,2z,3R,3q,3q,o,2T,2T,2R,3O,3O,3O,2G,2G,1g,1g,1g,1P,3c,3c,3c,2S,2S,1V,1V,1V,1x,1x,1x,1Y,1Y,1Y,1r,1r,1r,w,w,w,1t,1t,1t,1o,U,U,U,U,U,A,A,A,1L,1L,1L,F,F,F,p,p,p,p,i,i,i,l,l,l,l,l,e,e,e],[23,24,26,26,27,29,29,30,32,32,32,33,33,35,36,36,36,38,38,39,41,41,41,44,44,45,47,47,47,48,48,3Z,4c,4c,4c,3T,3T,4b,1q,1q,3P,3S,3S,3M,3W,3W,3W,2l,2l,2F,3g,3g,3g,2Z,2Z,3h,2m,2m,3x,2i,2i,1u,1u,1u,1p,h,h,1v,2x,2x,2x,t,t,2y,H,H,2o,2o,2o,z,T,T,1d,1K,1K,2d,1S,1S,1E,3A,3A,3A,1O,1O,2g,2a,2a,2u,2u,2u,Q,2h,2h,J,J,J,3K,1s,1s,3f,W,W,1D,v,v,v,3D,3D,1m,1Z,1Z,1R,1R,1R,1F,c,c,2H,2p,2p,s,1w,1w,1w,Y,Y,D,L,L,1C,C,C,2f,2f,2f,3l,M,M,2t,Z,Z,Z,1Q,1Q,1B,2q,2q,2q,2I,2I,3C,3E,3E,2c,3s,3s,O,O,O,3e,1f,1f,j,2w,2w,1M,1X,1X,1X,1N,1N,2J,1h,1h,y,y,y,3p,1b,1b,3r,1c,1c,1H,K,K,K,1T,1T,2v,1z,1z,1z,3o,3o,3J,3y,3y,3N,2V,2V,3U,2U,2U,3t,3t,3t,2Q,3z,3z,1A,1A,1A,n,k,k,3m,3b,3b,2z,3R,3R,3q,3q,3q,o,2T,2T,2R,2R,2R,3O,2G,2G,1g,1P,1P,3c,3c,3c,2S,1V,1V,1x,1Y,1Y])},4F:4g(){4f 4h.4e([4b,4b,3Y,3Y,3Y,1q,1q,3P,3P,3P,4a,4a,4a,3S,3S,3M,3M,3M,3X,3X,3X,3W,3W,2l,2l,2l,3F,3F,2F,2F,2F,3g,3g,1J,1J,1J,2Z,2Z,3h,3h,3h,3w,3w,2m,2m,3x,3x,2X,2X,2X,2i,2i,1u,1u,3L,3L,1p,1p,h,h,1a,1a,1v,1v,2x,2x,3j,3j,t,t,2y,3H,3H,H,H,2o,2o,2K,z,z,T,T,u,1d,1d,1K,1n,1n,2d,1S,1S,2M,1E,1E,3A,1k,1k,1O,2g,2g,2W,2a,2u,2u,2Y,Q,Q,2h,2N,J,3K,3K,2j,1s,3f,3f,3v,W,1D,2C,2C,v,3D,3a,1m,1Z,1Z,2E,1R,1F,d,c,c,2H,1G,2p,s,2b,1w,Y,Y,V,D,L,P,1C,C,m,2f,3l,1U,M,M,2t,1e,Z,1Q,I,1B,2q,2n,2I,3C,1i,3E,2c,X,3s,O,2O,3e,1f,2A,j,2w,2e,1M,1X,1l,1N,2J,S,1h,y,q,3p,1b,2D,3r,1c,1y,1H,K,3d,1T,2v,1z,3o,3G,3J,3y,3I,3N,2V,2k,3U,2U,2B,3t,2Q,1W,1A,2P,n,k,2r,3m,3b,3V,2z,3R,3k,o,3Q,2T,2R,3B,3O,2G,1I,1g,1P,3c,2S,1j,1V,1x,3n,1Y,1r,N,w,2s,1o,U,2L,A,1L,E,F,p,i,l,f,e,a],[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,3Z,4c,4d,3T,4b,3Y,1q,3P,4a,3S,3M,3X,3W,2l,3F,2F,3g,1J,2Z,3h,3w,2m,3x,2X,2i,1u,3L,1p,h,1a,1v,2x,3j,t,2y,3H,H,2o,2K,z,T,u,1d,1K,1n,2d,1S,2M,1E,3A,1k,1O,2g,2W,2u,2Y,Q,2h,2N,J,3K,2j,1s,3f,3v,W,1D,2C,v,3D,3a,1m,1Z,2E,1R,1F,d,c,2H,1G,2p,s,2b,1w,Y,D,L,P,1C,C,m,2f,3l,1U,M,2t,1e,Z,1Q,I,1B,2q,2n,2I,3C,1i,3E,2c,X,X,3s,O,2O,3e,1f,2A,j,2w,2e,1M,1X,1X,1l,1N,2J,S,1h,y,y,q,3p,1b,2D,2D,3r,1c,1y,1y,1H,K,3d,3d,1T,2v,2v,3u,1z,1z,3o,3G,3G,3J,3J,3y,3y,3I,3N,3N,2V,2V,2k,2k,2k,3U,3U,2U,2U,2B,2B,2B,3t,3t,3t,2Q,2Q,2Q,1W,1W,1W,3z,3z,3z,1A,1A,1A,1A,2P,2P,2P,n,n,n,n,n,k,k,k,k,2r,2r,2r,2r,3m,3m,3m],[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,42,43,44,45,46,47,48,49,3Z,4c,4d,3T,4b,3Y,1q,3P,4a,3S,3M,3X,3X,3W,2l,3F,2F,3g,1J,2Z,3h,3w,3w,2m,3x,2X,2i,1u,3L,1p,1p,h,1a,1v,2x,3j,3j,t,2y,3H,H,H,2o,2K,z,z,T,u,1d,1d,1K,1n,2d,2d,1S,2M,1E,1E,3A,1k,1k,1O,2g,2g,2W,2a,2a,2u,2Y,2Y,Q,Q,2h,2N,2N,J,J,3K,3K,2j,1s,1s,3f,3f,3v,3v,W,W,1D,1D,2C,2C,v,v,v,3D,3D,3a,3a,1m,1m,1m,1Z,1Z,2E,2E,2E,1R,1R,1R,1F,1F,1F,d,d,d,c,c,c,2H,2H,2H,2H,1G,1G,1G,2p,2p,2p,2p,s,s,s,s,2b,2b,2b,2b,1w,1w,1w,1w,1w,Y,Y,Y,Y,Y,V,V,V,V,V,V,D,D,D,D,D,D,L,L,L,L,L,L,P,P,P,P,P,P,P,1C,1C,1C,1C,1C,1C,1C,1C,C,C,C,C,C,C,C,m,m,m,m,m,m,m,m,m,m,m,m,m,m,m,m,m,m])},4G:4g(){4f 4h.4e([2l,3F,2F,2F,3g,1J,2Z,2Z,3h,3w,2m,2m,3x,2X,2i,2i,1u,3L,1p,1p,h,1a,1v,1v,2x,3j,t,t,2y,3H,H,H,2o,2K,z,z,T,u,1d,1d,1K,1n,2d,2d,1S,2M,1E,1E,3A,1k,1O,1O,2g,2W,2a,2a,2u,2Y,Q,Q,2h,2N,J,J,3K,2j,1s,1s,3f,3v,W,W,1D,2C,v,v,3D,3a,1m,1m,1Z,2E,1R,1R,1F,d,c,2H,2H,1G,2p,s,s,2b,1w,Y,Y,V,D,L,L,P,1C,C,C,m,2f,3l,3l,1U,M,2t,2t,1e,Z,1Q,1Q,I,1B,2q,2q,2n,2I,3C,3C,1i,3E,2c,2c,X,3s,O,O,2O,3e,1f,1f,2A,j,2w,2w,2e,1M,1X,1X,1l,1N,2J,2J,S,1h,y,y,q,3p,1b,1b,2D,3r,1c,1c,1y,1H,K,K,3d,1T,2v,2v,3u,1z,3o,3G,3G,3J,3y,3I,3I,3N,2V,2k,2k,3U,2U,2B,2B,3t,2Q,1W,1W,3z,1A,2P,2P,n,k,2r,2r,3m,3b,3V,3V,2z,3R,3k,3k,3q,o,3Q,3Q,2T,2R,3B,3B,3O,2G,1I,1I,1g,1P,3i,3i,3c,2S,1j,1j,1V,1x,3n,3n,1Y,1r,N,N,w,1t,2s,2s,1o,U,2L,2L,A,1L,E,E,F,p,x,x,i,l,f,f,e,a],[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,3Z,4c,4d,3T,4b,3Y,1q,3P,4a,3S,3M,3X,3W,2l,3F,2F,3g,1J,2Z,3h,3w,2m,3x,2X,2i,1u,3L,1p,h,1a,1v,2x,3j,t,2y,3H,H,2o,2K,z,T,u,1d,1K,1n,2d,1S,2M,1E,3A,1k,1O,2g,2W,2a,2u,2Y,Q,2h,2N,J,3K,2j,1s,3f,3v,W,1D,2C,v,3D,3a,1m,1Z,2E,1R,1F,d,c,2H,1G,2p,s,2b,1w,Y,V,D,L,P,1C,C,m,2f,3l,1U,M,2t,1e,Z,1Q,I,1B,2q,2n,2I,3C,1i,3E,2c,X,3s,O,2O,3e,1f,2A,j,2w,2e,1M,1X,1l,1N,2J,S,1h,y,q,3p,1b,2D,3r,1c,1y,1H,K,3d,1T,2v,3u,1z,3o,3G,3J,3y,3I,3N,2V,2k,3U,2U,2B,3t,2Q,1W,3z,1A,2P,n,k,2r,3m,3b,3V,2z,3R,3k,3q,o,3Q,2T,2R,3B,3O,2G,1I,1g,1P,3i,3c,2S,1j,1V,1x,3n,1Y,1r,N,w,1t,2s,1o,U,2L,A,1L,E,F,p,x,i,l,f,e,a],[2l,3F,3F,2F,2F,3g,3g,1J,1J,2Z,2Z,3h,3h,3w,3w,2m,2m,3x,3x,2X,2X,2i,2i,1u,1u,3L,3L,1p,1p,h,h,1a,1a,1v,1v,2x,2x,3j,3j,t,t,2y,2y,3H,3H,H,H,2o,2o,2K,2K,z,z,T,T,u,u,1d,1d,1K,1K,1n,1n,2d,2d,1S,1S,2M,2M,1E,1E,3A,3A,1k,1k,1O,1O,2g,2g,2W,2W,2a,2a,2u,2u,2Y,2Y,Q,Q,2h,2h,2N,2N,J,J,3K,3K,2j,2j,1s,1s,3f,3f,3v,3v,W,W,1D,1D,2C,2C,v,v,3D,3D,3a,3a,1m,1m,1Z,1Z,2E,2E,1R,1R,1F,1F,d,d,c,c,2H,2H,1G,1G,2p,2p,s,s,2b,2b,1w,1w,Y,Y,V,V,D,D,L,L,P,P,1C,1C,C,C,m,m,2f,2f,3l,3l,1U,1U,M,M,2t,2t,1e,1e,Z,Z,1Q,1Q,I,I,1B,1B,2q,2q,2n,2n,2I,2I,3C,3C,1i,1i,3E,3E,2c,2c,X,X,3s,3s,O,O,2O,2O,3e,3e,1f,1f,2A,2A,j,j,2w,2w,2e,2e,1M,1M,1X,1X,1l,1l,1N,1N,2J,2J,S,S,1h,1h,y,y,q,q,3p,3p,1b,1b,2D,2D,3r,3r,1c,1c,1y,1y,1H,1H,K,K,3d,3d,1T,1T,2v,2v,3u,3u,1z])},4H:4g(){4f 4h.4e([2l,3F,2F,2F,3g,1J,2Z,2Z,3h,3w,2m,2m,3x,2X,2i,2i,1u,3L,1p,1p,h,1a,1v,1v,2x,3j,t,t,2y,3H,H,H,2o,2K,z,z,T,u,1d,1d,1K,1n,2d,2d,1S,2M,1E,1E,3A,1k,1O,1O,2g,2W,2a,2a,2u,2Y,Q,Q,2h,2N,J,J,3K,2j,1s,1s,3f,3v,W,W,1D,2C,v,v,3D,3a,1m,1m,1Z,2E,1R,1R,1F,d,c,2H,2H,1G,2p,s,s,2b,1w,Y,Y,V,D,L,L,P,1C,C,C,m,2f,3l,3l,1U,M,2t,2t,1e,Z,1Q,1Q,I,1B,2q,2q,2n,2I,3C,3C,1i,3E,2c,2c,X,3s,O,O,2O,3e,1f,1f,2A,j,2w,2w,2e,1M,1X,1X,1l,1N,2J,2J,S,1h,y,y,q,3p,1b,1b,2D,3r,1c,1c,1y,1H,K,K,3d,1T,2v,2v,3u,1z,3o,3G,3G,3J,3y,3I,3I,3N,2V,2k,2k,3U,2U,2B,2B,3t,2Q,1W,1W,3z,1A,2P,2P,n,k,2r,2r,3m,3b,3V,3V,2z,3R,3k,3k,3q,o,3Q,3Q,2T,2R,3B,3B,3O,2G,1I,1I,1g,1P,3i,3i,3c,2S,1j,1j,1V,1x,3n,3n,1Y,1r,N,N,w,1t,2s,2s,1o,U,2L,2L,A,1L,E,E,F,p,x,x,i,l,f,f,e,a],[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,3Z,4c,4d,3T,4b,3Y,1q,3P,4a,3S,3M,3X,3W,2l,3F,2F,3g,1J,2Z,3h,3w,2m,3x,2X,2i,1u,3L,1p,h,1a,1v,2x,3j,t,2y,3H,H,2o,2K,z,T,u,1d,1K,1n,2d,1S,2M,1E,3A,1k,1O,2g,2W,2a,2u,2Y,Q,2h,2N,J,3K,2j,1s,3f,3v,W,1D,2C,v,3D,3a,1m,1Z,2E,1R,1F,d,c,2H,1G,2p,s,2b,1w,Y,V,D,L,P,1C,C,m,2f,3l,1U,M,2t,1e,Z,1Q,I,1B,2q,2n,2I,3C,1i,3E,2c,X,3s,O,2O,3e,1f,2A,j,2w,2e,1M,1X,1l,1N,2J,S,1h,y,q,3p,1b,2D,3r,1c,1y,1H,K,3d,1T,2v,3u,1z,3o,3G,3J,3y,3I,3N,2V,2k,3U,2U,2B,3t,2Q,1W,3z,1A,2P,n,k,2r,3m,3b,3V,2z,3R,3k,3q,o,3Q,2T,2R,3B,3O,2G,1I,1g,1P,3i,3c,2S,1j,1V,1x,3n,1Y,1r,N,w,1t,2s,1o,U,2L,A,1L,E,F,p,x,i,l,f,e,a],[2l,3F,3F,2F,2F,3g,3g,1J,1J,2Z,2Z,3h,3h,3w,3w,2m,2m,3x,3x,2X,2X,2i,2i,1u,1u,3L,3L,1p,1p,h,h,1a,1a,1v,1v,2x,2x,3j,3j,t,t,2y,2y,3H,3H,H,H,2o,2o,2K,2K,z,z,T,T,u,u,1d,1d,1K,1K,1n,1n,2d,2d,1S,1S,2M,2M,1E,1E,3A,3A,1k,1k,1O,1O,2g,2g,2W,2W,2a,2a,2u,2u,2Y,2Y,Q,Q,2h,2h,2N,2N,J,J,3K,3K,2j,2j,1s,1s,3f,3f,3v,3v,W,W,1D,1D,2C,2C,v,v,3D,3D,3a,3a,1m,1m,1Z,1Z,2E,2E,1R,1R,1F,1F,d,d,c,c,2H,2H,1G,1G,2p,2p,s,s,2b,2b,1w,1w,Y,Y,V,V,D,D,L,L,P,P,1C,1C,C,C,m,m,2f,2f,3l,3l,1U,1U,M,M,2t,2t,1e,1e,Z,Z,1Q,1Q,I,I,1B,1B,2q,2q,2n,2n,2I,2I,3C,3C,1i,1i,3E,3E,2c,2c,X,X,3s,3s,O,O,2O,2O,3e,3e,1f,1f,2A,2A,j,j,2w,2w,2e,2e,1M,1M,1X,1X,1l,1l,1N,1N,2J,2J,S,S,1h,1h,y,y,q,q,3p,3p,1b,1b,2D,2D,3r,3r,1c,1c,1y,1y,1H,1H,K,K,3d,3d,1T,1T,2v,2v,3u,3u,1z])},4I:4g(){4f 4h.4e([0,0,1,1,1,2,2,2,3,3,4,4,4,5,5,5,6,6,7,7,7,8,8,9,9,9,10,10,11,11,12,12,13,13,14,14,15,15,16,16,17,17,18,18,19,20,20,21,22,22,23,23,24,25,26,26,27,28,29,29,30,31,32,33,34,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,3Z,4c,4d,3T,4b,1q,3P,4a,3S,3X,3W,2l,3F,3g,1J,2Z,3w,2m,2X,2i,1u,1p,h,1v,2x,3j,2y,3H,2o,2K,T,u,1K,1n,1S,2M,3A,1k,2g,2a,2u,Q,2h,J,3K,1s,3v,W,2C,v,3a,1m,2E,1F,d,2H,1G,s,1w,Y,D,L,1C,m,2f,1U,M,1e,Z,I,2q,2n,3C,1i,2c,X,O,2O,1f,2A,2w,1M,1X,1N,2J,S,y,q,1b,2D,1c,1y,K,3d,1T,3u,1z,3G,3J,3y,3N,2V,2k,3U,2B,3t,2Q,1W,1A,2P,n,k,2r,3b,3V,2z,3R,3k,3q,o,3Q,2T,2R,3B,3O,2G,1I,1g,1P,3i,3i,3c,2S,1j,1V,1V,1x,3n,1Y,1Y,1r,N,N,w,w,1t,2s,2s,1o,1o,U,2L,2L,A,A,1L,1L,E,E,F,F,p,p,x,x,i,i,i,l,l,f,f,e,e,a,a],[0,1,2,2,3,4,5,5,6,7,8,8,9,10,11,11,12,13,14,15,15,16,17,18,18,19,20,21,21,22,23,24,25,25,26,27,28,29,29,30,31,32,33,33,34,35,36,37,38,38,39,40,41,42,43,43,44,45,46,47,48,48,49,3Z,4c,4d,3T,4b,3Y,1q,1q,3P,4a,3S,3M,3X,3W,2l,3F,2F,3g,1J,1J,2Z,3h,3w,2m,3x,2X,2i,1u,3L,1p,h,1a,1v,2x,3j,t,2y,3H,H,2o,2K,z,u,1d,1K,1n,2d,1S,2M,1E,3A,1k,2g,2W,2a,2u,2Y,Q,2h,J,3K,2j,1s,3f,W,1D,2C,v,3D,1m,1Z,2E,1R,d,c,2H,2p,s,2b,Y,V,D,L,1C,C,m,3l,1U,2t,1e,Z,I,1B,2q,2I,3C,1i,2c,X,O,2O,3e,2A,j,2w,1M,1X,1l,2J,S,1h,q,3p,1b,3r,1c,1y,K,3d,1T,3u,1z,3o,3G,3y,3I,3N,2V,2k,2U,2B,3t,2Q,1W,1A,2P,n,k,2r,3m,3b,3V,2z,3R,3k,3q,o,3Q,2T,2R,3B,3O,2G,1I,1g,1g,1P,3i,3c,2S,1j,1j,1V,1x,3n,1Y,1Y,1r,N,w,w,1t,2s,1o,1o,U,2L,A,A,1L,E,E,F,p,p,x,i,l,l,f,e,e,a],[1q,1q,1q,1q,1q,1q,1q,1q,1q,1q,3P,3P,4a,4a,3S,3M,3M,3X,3W,3W,2l,2l,3F,2F,2F,3g,1J,1J,2Z,2Z,3h,3w,3w,2m,2m,3x,2X,2X,2i,1u,1u,3L,3L,1p,h,h,1a,1a,1v,2x,2x,3j,t,t,2y,2y,3H,H,H,2o,2K,2K,z,z,T,u,u,1d,1d,1K,1n,1n,2d,1S,1S,2M,2M,1E,3A,3A,1k,1k,1O,2g,2g,2W,2a,2a,2u,2u,2Y,Q,Q,2h,2N,2N,J,J,3K,2j,2j,1s,1s,3f,3v,3v,W,1D,1D,2C,2C,v,3D,3D,3a,3a,1m,1Z,1Z,2E,1R,1R,1F,1F,d,c,c,2H,1G,1G,2p,2p,s,2b,2b,1w,1w,Y,V,V,D,L,L,P,P,1C,C,C,m,2f,2f,3l,3l,1U,M,M,2t,2t,1e,Z,Z,1Q,I,I,1B,1B,2q,2n,2n,2I,2I,3C,1i,1i,3E,2c,2c,X,X,3s,O,O,2O,3e,3e,1f,1f,2A,j,j,2w,2w,2e,1M,1M,1X,1l,1l,1N,1N,2J,S,S,1h,1h,y,q,q,3p,1b,1b,2D,2D,3r,1c,1c,1y,1H,1H,K,K,3d,1T,1T,2v,2v,3u,1z,1z,3o,3G,3G,3J,3J,3y,3I,3I,3N,3N,2V,2k,2k,3U,2U,2U,2B,2B,3t,2Q,2Q,1W,3z,3z,1A,1A,2P])},4J:4g(){4f 4h.4e([0,2,3,5,7,8,10,12,13,15,17,18,20,22,24,25,27,29,30,32,34,35,37,38,40,42,43,45,47,48,3Z,4d,3T,3Y,3P,4a,3M,3X,2l,2F,3g,2Z,3h,2m,2X,2i,3L,1p,1a,1v,3j,t,3H,2o,2K,T,u,1K,1n,1S,2M,3A,1k,2g,2W,2u,2Y,Q,2N,J,2j,1s,3v,W,1D,v,3D,3a,1Z,2E,1F,d,c,1G,2p,s,2b,Y,V,D,P,1C,C,m,2f,1U,M,2t,1e,Z,I,1B,2q,2n,2I,3C,1i,3E,2c,3s,O,2O,3e,1f,2A,j,2w,2e,1M,1X,1l,1N,2J,S,1h,y,q,3p,3p,1b,2D,3r,1c,1y,1H,K,3d,3d,1T,2v,3u,1z,3o,3o,3G,3J,3y,3I,3I,3N,2V,2k,2k,3U,2U,2B,2B,3t,2Q,1W,1W,3z,1A,1A,2P,n,n,k,2r,2r,3m,3b,3b,3V,2z,2z,3R,3R,3k,3q,3q,o,o,3Q,2T,2T,2R,2R,3B,3O,3O,2G,2G,1I,1I,1g,1g,1P,1P,3i,3c,3c,2S,2S,1j,1j,1V,1V,1x,1x,3n,3n,1Y,1Y,1r,1r,N,N,N,w,w,1t,1t,2s,2s,1o,1o,U,U,2L,2L,2L,A,A,1L,1L,E,E,F,F,F,p,p,x,x,i,i,l,l,l,f,f,e,e,a,a],[0,1,1,2,3,3,4,4,5,6,6,7,8,8,9,10,10,11,11,12,13,13,14,15,15,16,17,17,18,19,19,20,20,21,22,22,23,24,24,25,26,26,27,28,28,29,30,30,31,32,33,33,34,35,35,36,37,37,38,39,40,40,41,42,42,43,44,45,45,46,47,47,48,49,3Z,3Z,4c,4d,3T,3T,4b,3Y,1q,3P,3P,4a,3S,3M,3M,3X,3W,2l,3F,2F,2F,3g,1J,2Z,3h,3h,3w,2m,3x,2X,2i,1u,1u,3L,1p,h,1a,1v,2x,3j,t,t,2y,3H,H,2o,2K,z,T,u,1d,1K,1n,2d,1S,2M,1E,3A,1k,1O,2g,2W,2a,2u,2Y,Q,2h,2N,J,3K,2j,1s,3f,3v,W,2C,v,3D,3a,1m,1Z,2E,1R,d,c,2H,1G,2p,s,2b,Y,V,D,L,P,C,m,2f,3l,1U,2t,1e,Z,1Q,1B,2q,2n,2I,1i,3E,2c,X,O,2O,3e,1f,j,2w,2e,1X,1l,1N,2J,1h,y,q,1b,2D,3r,1y,1H,K,1T,2v,3u,3o,3G,3J,3I,3N,2V,3U,2U,2B,2Q,1W,1A,2P,n,2r,3m,3b,2z,3R,3k,o,3Q,2R,3B,3O,1I,1g,3i,3c,2S,1V,1x,3n,1r,N,1t,2s,1o,2L,A,E,F,p,i,l,e,a],[d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,d,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c])},4K:4g(){4f 4h.4e([0,1,1,2,2,3,4,4,5,5,6,7,7,8,8,9,10,10,11,11,12,13,13,14,14,15,16,16,17,18,18,19,19,20,21,21,22,23,23,24,25,25,26,27,27,28,29,29,30,31,32,32,33,34,34,35,36,37,37,38,39,40,40,41,42,43,44,44,45,46,47,48,48,49,3Z,4c,4d,3T,4b,4b,3Y,1q,3P,4a,3S,3M,3X,3W,2l,3F,2F,3g,1J,2Z,3h,3w,2m,3x,2X,2i,1u,3L,1p,h,1a,1v,2x,t,2y,3H,H,2o,2K,T,u,1d,1K,1n,1S,2M,1E,3A,1O,2g,2W,2a,2Y,Q,2h,J,3K,2j,3f,3v,W,2C,v,3D,1m,1Z,1R,1F,d,2H,1G,s,2b,1w,V,D,P,1C,m,2f,1U,M,1e,Z,I,1B,2n,2I,1i,3E,X,3s,2O,3e,2A,j,2e,1M,1l,2J,S,y,q,1b,2D,1c,1H,K,1T,2v,1z,3G,3J,3I,3N,2k,2U,2B,2Q,1W,1A,n,k,3m,3V,2z,3k,o,3Q,2R,3B,2G,1g,1P,3c,1j,1V,3n,1r,N,1t,1o,U,A,E,F,x,l,f,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a],[0,1,2,3,3,4,5,6,7,8,9,10,10,11,12,13,14,15,16,17,17,18,19,20,21,22,23,24,24,25,26,27,28,29,30,31,32,33,33,34,35,36,37,38,39,40,41,42,43,44,44,45,46,47,48,49,3Z,4c,4d,3T,4b,3Y,1q,3P,4a,3S,3M,3X,3W,2l,3F,2F,3g,1J,2Z,3h,3w,2m,3x,2X,2i,1u,3L,1p,h,1v,2x,3j,t,2y,3H,H,2o,2K,z,u,1d,1K,1n,2d,1S,2M,3A,1k,1O,2g,2W,2a,2Y,Q,2h,2N,J,2j,1s,3f,3v,W,1D,v,3D,3a,1m,2E,1R,1F,d,c,1G,2p,s,2b,1w,V,D,L,P,C,m,2f,3l,1U,2t,1e,Z,1Q,I,2q,2n,2I,3C,1i,2c,X,3s,O,2O,1f,2A,j,2w,2e,1M,1l,1N,2J,S,1h,y,q,1b,2D,3r,1c,1y,1H,K,3d,1T,3u,1z,3o,3G,3J,3y,3I,3N,2V,2k,3U,2U,2B,3t,2Q,1W,3z,1A,2P,n,k,2r,3m,3b,3V,2z,2z,3R,3k,3q,o,3Q,2T,2R,2R,3B,3O,2G,1I,1g,1g,1P,3i,3c,2S,1j,1j,1V,1x,3n,3n,1Y,1r,N,w,w,1t,2s,1o,1o,U,2L,A,A,1L,E,F,F,p,x,i,i,l,f,e,e,a],[22,23,24,24,25,26,27,28,29,29,30,31,32,33,33,34,35,36,37,37,38,39,40,41,42,42,43,44,45,46,46,47,48,49,3Z,4c,4c,4d,3T,4b,3Y,3Y,1q,3P,4a,3S,3M,3M,3X,3W,2l,3F,3F,2F,3g,1J,2Z,2Z,3h,3w,2m,3x,2X,2X,2i,1u,3L,1p,1p,h,1a,1v,2x,3j,3j,t,2y,3H,H,H,2o,2K,z,T,u,u,1d,1K,1n,2d,2d,1S,2M,1E,3A,3A,1k,1O,2g,2W,2a,2a,2u,2Y,Q,2h,2h,2N,J,3K,2j,1s,1s,3f,3v,W,1D,1D,2C,v,3D,3a,1m,1m,1Z,2E,1R,1F,1F,d,c,2H,1G,1G,2p,s,2b,1w,Y,Y,V,D,L,P,P,1C,C,m,2f,3l,3l,1U,M,2t,1e,1e,Z,1Q,I,1B,2q,2q,2n,2I,3C,1i,1i,3E,2c,X,3s,3s,O,2O,3e,1f,2A,2A,j,2w,2e,1M,1M,1X,1l,1N,2J,S,S,1h,y,q,3p,3p,1b,2D,3r,1c,1y,1y,1H,K,3d,1T,1T,2v,3u,1z,3o,3o,3G,3J,3y,3I,3N,3N,2V,2k,3U,2U,2U,2B,3t,2Q,1W,3z,3z,1A,2P,n,k,k,2r,3m,3b,3V,2z,2z,3R,3k,3q,o,o,3Q,2T,2R,3B,3B,3O,2G,1I,1g,1P,1P,3i,3c])},4L:4g(){4f 4h.4e([0,2,3,5,6,8,9,11,12,14,15,17,18,20,21,23,24,26,27,29,30,32,33,35,36,38,39,41,42,44,45,47,48,3Z,4c,3T,4b,1q,3P,3S,3M,3X,2l,3F,3g,1J,3h,3w,3x,2X,2i,3L,1p,1a,1v,3j,t,2y,H,2o,z,T,u,1K,1n,2d,2M,1E,1k,1O,2g,2a,2u,2Y,2h,2N,J,2j,1s,3f,3v,1D,2C,v,3a,1m,1Z,2E,1F,d,c,2H,1G,s,2b,1w,Y,V,L,P,1C,C,m,2f,1U,M,2t,1e,Z,1Q,I,1B,2q,2n,2I,1i,3E,2c,X,3s,O,2O,3e,1f,2A,j,2w,2e,1M,1M,1X,1l,1N,2J,S,1h,y,q,3p,1b,2D,2D,3r,1c,1y,1H,K,3d,3d,1T,2v,3u,1z,1z,3o,3G,3J,3y,3y,3I,3N,2V,2k,2k,3U,2U,2B,2B,3t,2Q,2Q,1W,3z,1A,1A,2P,n,n,k,2r,2r,3m,3b,3b,3V,2z,2z,3R,3k,3k,3q,o,o,3Q,2T,2T,2R,2R,3B,3O,3O,2G,1I,1I,1g,1g,1P,3i,3i,3c,3c,2S,2S,1j,1V,1V,1x,1x,3n,3n,1Y,1r,1r,N,N,w,w,1t,1t,2s,1o,1o,U,U,2L,2L,A,A,1L,1L,E,F,F,p,p,x,x,i,i,l,l,f,f,e,e,a],[0,1,2,4,5,6,7,9,10,11,12,14,15,16,17,19,20,21,22,24,25,26,27,29,30,31,32,33,35,36,37,38,40,41,42,43,44,46,47,48,49,4c,4d,3T,4b,3Y,3P,4a,3S,3M,3X,2l,3F,2F,3g,1J,3h,3w,2m,3x,2X,1u,3L,1p,h,1a,1v,3j,t,2y,3H,H,2K,z,T,u,1d,1K,1n,1S,2M,1E,3A,1k,1O,2g,2a,2u,2Y,Q,2h,2N,J,3K,2j,3f,3v,W,1D,2C,v,3D,3a,1m,1Z,2E,1R,d,c,2H,1G,2p,s,2b,1w,Y,V,D,L,P,1C,C,m,2f,3l,1U,M,2t,1e,Z,1Q,I,1B,2q,2n,2I,3C,1i,3E,2c,X,3s,O,O,2O,3e,1f,2A,j,2w,2e,1M,1X,1l,1N,2J,2J,S,1h,y,q,3p,1b,2D,3r,3r,1c,1y,1H,K,3d,1T,2v,2v,3u,1z,3o,3G,3J,3y,3y,3I,3N,2V,2k,3U,3U,2U,2B,3t,2Q,1W,1W,3z,1A,2P,n,k,k,2r,3m,3b,3V,3V,2z,3R,3k,3q,3q,o,3Q,2T,2R,2R,3B,3O,2G,1I,1I,1g,1P,3i,3i,3c,2S,1j,1V,1V,1x,3n,1Y,1Y,1r,N,w,1t,1t,2s,1o,U,U,2L,A,1L,E,E,F,p,x,x,i,l,f,f,e,a],[0,1,1,2,3,4,4,5,6,6,7,8,8,9,10,11,11,12,13,13,14,15,16,16,17,18,18,19,20,20,21,22,23,23,24,25,26,26,27,28,28,29,30,31,31,32,33,34,34,35,36,37,37,38,39,40,40,41,42,43,43,44,45,46,46,47,48,49,3Z,3Z,4c,4d,3T,3T,4b,3Y,1q,3P,3P,4a,3S,3M,3X,3W,3W,2l,3F,2F,3g,3g,1J,2Z,3h,3w,2m,3x,3x,2X,2i,1u,3L,1p,h,1a,1a,1v,2x,3j,t,2y,3H,H,2o,2K,2K,z,T,u,1d,1K,1n,2d,1S,2M,1E,3A,1k,1O,2g,2W,2a,2u,2Y,Q,2h,2N,J,3K,2j,1s,3f,3v,W,1D,2C,v,3D,3a,1m,1Z,1R,1F,d,c,2H,1G,2p,s,2b,1w,V,D,L,P,1C,C,m,3l,1U,M,2t,1e,Z,I,1B,2q,2n,2I,1i,3E,2c,X,3s,2O,3e,1f,2A,j,2e,1M,1X,1l,2J,S,1h,y,q,1b,2D,3r,1y,1H,K,3d,2v,3u,1z,3o,3J,3y,3I,3N,2k,3U,2U,3t,2Q,1W,3z,2P,n,k,3m,3b,3V,3R,3k,3q,o,2T,2R,3B,2G,1I,1g,3i,3c,2S,1V,1x,3n,1r,N,w,1t,1o,U,2L,1L,E,F,x,i,l,e,a])},4M:4g(){4f 4h.4e([0,1,2,3,4,5,6,6,7,8,9,10,11,12,13,14,15,16,17,17,18,19,20,21,22,23,24,25,26,27,28,29,29,30,31,32,33,34,35,36,37,38,39,40,41,41,42,43,44,45,46,47,48,49,3Z,4c,4d,3T,4b,3Y,3Y,1q,3P,4a,3S,3M,3X,3W,2l,3F,2F,3g,1J,2Z,3h,3w,2m,2m,3x,2X,2i,1u,3L,1p,h,1a,1v,2x,3j,t,2y,3H,H,2o,2K,z,T,u,1d,1K,1K,1n,2d,1S,2M,1E,3A,1k,1O,2g,2W,2a,2u,2Y,Q,2h,2N,J,3K,2j,1s,3f,3v,W,1D,2C,v,3D,3a,1m,1Z,2E,1R,1F,d,c,2H,1G,2p,s,2b,1w,Y,V,D,L,P,1C,C,m,2f,3l,1U,M,2t,1e,Z,1Q,1B,2q,2n,2I,3C,1i,3E,2c,X,3s,O,2O,3e,1f,2A,j,2w,2e,1M,1X,1l,1N,2J,1h,y,q,3p,1b,2D,3r,1c,1y,1H,K,3d,1T,2v,3u,1z,3G,3J,3y,3I,3N,2V,2k,3U,2U,2B,3t,2Q,1W,3z,1A,n,k,2r,3m,3b,3V,2z,3R,3k,3q,o,3Q,2T,3B,3O,2G,1I,1g,1P,3i,3c,2S,1j,1V,1x,1Y,1r,N,w,1t,2s,1o,U,2L,A,1L,E,F,x,i,l,f,e,a],[0,1,1,2,3,3,4,5,6,6,7,8,8,9,10,10,11,12,12,13,14,15,15,16,17,17,18,19,19,20,21,22,22,23,24,24,25,26,27,27,28,29,29,30,31,32,32,33,34,34,35,36,37,37,38,39,40,40,41,42,43,43,44,45,46,46,47,48,49,3Z,3Z,4c,4d,3T,3T,4b,3Y,1q,3P,3P,4a,3S,3M,3X,3X,3W,2l,3F,2F,3g,3g,1J,2Z,3h,3w,2m,3x,3x,2X,2i,1u,3L,1p,h,h,1a,1v,2x,3j,t,2y,3H,H,2o,2K,2K,z,T,u,1d,1K,1n,2d,1S,2M,1E,3A,1k,1O,2g,2W,2a,2u,2Y,Q,2h,2N,J,3K,2j,1s,3f,3v,W,1D,2C,v,3D,1m,1Z,2E,1R,1F,d,c,2H,1G,2p,2b,1w,Y,V,D,L,P,C,m,2f,3l,1U,M,1e,Z,1Q,I,1B,2q,2I,3C,1i,3E,X,3s,O,2O,3e,2A,j,2w,2e,1X,1l,1N,2J,1h,y,q,3p,2D,3r,1c,1y,K,3d,1T,2v,1z,3o,3G,3y,3I,3N,2V,3U,2U,2B,2Q,1W,3z,1A,n,k,2r,3b,3V,2z,3k,3q,o,2T,2R,3B,2G,1I,1g,1P,3c,2S,1j,1x,3n,1Y,N,w,1t,1o,U,2L,1L,E,F,x,i,l,e,a],[0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,9,9,10,10,11,11,12,12,13,13,14,15,15,16,16,17,17,18,18,19,20,20,21,21,22,22,23,24,24,25,25,26,26,27,28,28,29,29,30,31,31,32,33,33,34,34,35,36,36,37,38,38,39,40,40,41,41,42,43,43,44,45,46,46,47,48,48,49,3Z,3Z,4c,4d,3T,3T,4b,3Y,1q,1q,3P,4a,3S,3S,3M,3X,3W,2l,2l,3F,2F,3g,1J,1J,2Z,3h,3w,2m,3x,2X,2X,2i,1u,3L,1p,h,1a,1v,2x,2x,3j,t,2y,3H,H,2o,2K,z,T,u,1d,1K,1n,2d,1S,2M,1E,3A,1k,1O,2g,2W,2a,2Y,Q,2h,2N,J,3K,2j,1s,3v,W,1D,2C,v,3D,1m,1Z,2E,1R,1F,c,2H,1G,2p,2b,1w,Y,V,L,P,1C,m,2f,3l,M,2t,1e,1Q,I,1B,2n,2I,3C,3E,2c,X,O,2O,1f,2A,j,2e,1M,1l,1N,2J,1h,y,3p,1b,3r,1c,1y,K,3d,2v,3u,3o,3G,3y,3I,2V,2k,2U,2B,3t,1W,3z,2P,n,2r,3m,3V,2z,3k,3q,3Q,2T,3B,2G,1I,1P,3i,2S,1j,1x,3n,1r,N,1t,2s,U,2L,1L,E,p,x,l,f,a])},4N:4g(){4f 4h.4e([0,1,1,2,2,3,3,4,5,5,6,6,7,8,8,9,9,10,11,11,12,12,13,14,14,15,15,16,17,17,18,19,19,20,21,21,22,23,23,24,25,25,26,27,27,28,29,29,30,31,32,32,33,34,35,35,36,37,38,38,39,40,41,42,42,43,44,45,46,47,48,48,49,3Z,4c,4d,3T,4b,3Y,1q,3P,4a,3S,3M,3X,3W,2l,3F,2F,3g,1J,2Z,3h,3w,2m,3x,2X,2i,1u,3L,1p,1a,1v,2x,3j,t,2y,H,2o,2K,z,T,u,1K,1n,2d,1S,1E,3A,1k,1O,2W,2a,2u,2Y,2h,2N,J,3K,1s,3f,3v,1D,2C,v,3a,1m,1Z,1R,1F,d,2H,1G,s,2b,1w,V,D,P,1C,C,2f,3l,M,2t,Z,1Q,I,2q,2n,3C,1i,2c,X,O,2O,1f,2A,j,2e,1M,1l,1N,S,1h,q,3p,2D,3r,1y,K,3d,2v,3u,3o,3G,3y,3I,2V,2k,2U,2B,2Q,1W,1A,n,k,3m,3b,2z,3R,3q,o,2T,3B,3O,1I,1g,3i,3c,1j,1x,3n,1r,N,1t,2s,U,A,1L,F,p,i,l,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e],[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,3Z,4c,4d,4b,3Y,1q,3P,4a,3S,3M,3X,3W,2l,3F,2F,3g,1J,2Z,3h,2m,3x,2X,2i,1u,3L,1p,h,1a,1v,3j,t,2y,3H,H,2o,2K,z,T,1d,1K,1n,2d,1S,2M,1E,1k,1O,2g,2W,2a,2u,2Y,2h,2N,J,3K,2j,1s,3f,W,1D,2C,v,3D,3a,1Z,2E,1R,1F,d,c,2H,2p,s,2b,1w,Y,V,D,P,1C,C,m,2f,3l,1U,2t,1e,Z,1Q,I,1B,2q,2n,3C,1i,3E,2c,X,3s,O,2O,3e,2A,j,2w,2e,1M,1X,1l,1N,2J,S,1h,y,q,3p,1b,3r,1c,1y,1H,K,3d,1T,2v,3u,1z,3o,3G,3J,3y,3I,3N,2V,2k,2k,3U,2U,2B,3t,2Q,1W,3z,1A,2P,n,k,k,2r,3m,3b,3V,2z,3R,3k,3k,3q,o,3Q,2T,2R,2R,3B,3O,2G,1I,1I,1g,1P,3i,3c,3c,2S,1j,1V,1V,1x,3n,1Y,1r,1r,N,w,1t,1t,2s,1o,U,U,2L,A,A,1L,E,F,F,p,x,i,i,l,f,e,e,a],[19,19,20,21,21,22,23,24,25,26,26,27,28,29,30,31,31,32,33,34,35,36,36,37,38,39,40,40,41,42,43,44,45,45,46,47,48,49,3Z,3Z,4c,4d,3T,4b,3Y,3Y,1q,3P,4a,3S,3M,3M,3X,3W,2l,3F,3F,2F,3g,1J,2Z,3h,3h,3w,2m,3x,2X,2i,2i,1u,3L,1p,h,1a,1a,1v,2x,3j,t,t,2y,3H,H,2o,2K,2K,z,T,u,1d,1K,1K,1n,2d,1S,2M,1E,1E,3A,1k,1O,2g,2W,2W,2a,2u,2Y,Q,Q,2h,2N,J,3K,2j,2j,1s,3f,3v,W,1D,1D,2C,v,3D,3a,1m,1m,1Z,2E,1R,1F,1F,d,c,2H,1G,2p,2p,s,2b,1w,Y,V,V,D,L,P,1C,C,C,m,2f,3l,1U,1U,M,2t,1e,Z,1Q,1Q,I,1B,2q,2n,2I,2I,3C,1i,3E,2c,X,X,3s,O,2O,3e,1f,1f,2A,j,2w,2e,2e,1M,1X,1l,1N,2J,2J,S,1h,y,q,3p,3p,1b,2D,3r,1c,1y,1y,1H,K,3d,1T,1T,2v,3u,1z,3o,3G,3G,3J,3y,3I,3N,2V,2V,2k,3U,2U,2B,3t,3t,2Q,1W,3z,1A,2P,2P,n,k,2r,3m,3m,3b,3V,2z,3R,3k,3k,3q,o,3Q,2T,2R,2R,3B,3O,2G,1I,1g,1g,1P,3i])},4O:4g(){4f 4h.4e([0,1,1,2,2,3,3,4,5,5,6,6,7,8,8,9,9,10,11,11,12,12,13,14,14,15,15,16,17,17,18,19,19,20,21,21,22,23,23,24,25,25,26,27,27,28,29,29,30,31,32,32,33,34,35,35,36,37,38,38,39,40,41,42,42,43,44,45,46,47,48,48,49,3Z,4c,4d,3T,4b,3Y,1q,3P,4a,3S,3M,3X,3W,2l,3F,2F,3g,1J,2Z,3h,3w,2m,3x,2X,2i,1u,3L,1p,1a,1v,2x,3j,t,2y,H,2o,2K,z,T,u,1K,1n,2d,1S,1E,3A,1k,1O,2W,2a,2u,2Y,2h,2N,J,3K,1s,3f,3v,1D,2C,v,3a,1m,1Z,1R,1F,d,2H,1G,s,2b,1w,V,D,P,1C,C,2f,3l,M,2t,Z,1Q,I,2q,2n,3C,1i,2c,X,O,2O,1f,2A,j,2e,1M,1l,1N,S,1h,q,3p,2D,3r,1y,K,3d,2v,3u,3o,3G,3y,3I,2V,2k,2U,2B,2Q,1W,1A,n,k,3m,3b,2z,3R,3q,o,2T,3B,3O,1I,1g,3i,3c,1j,1x,3n,1r,N,1t,2s,U,A,1L,F,p,i,l,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e],[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,3Z,4c,4d,4b,3Y,1q,3P,4a,3S,3M,3X,3W,2l,3F,2F,3g,1J,2Z,3h,2m,3x,2X,2i,1u,3L,1p,h,1a,1v,3j,t,2y,3H,H,2o,2K,z,T,1d,1K,1n,2d,1S,2M,1E,1k,1O,2g,2W,2a,2u,2Y,2h,2N,J,3K,2j,1s,3f,W,1D,2C,v,3D,3a,1Z,2E,1R,1F,d,c,2H,2p,s,2b,1w,Y,V,D,P,1C,C,m,2f,3l,1U,2t,1e,Z,1Q,I,1B,2q,2n,3C,1i,3E,2c,X,3s,O,2O,3e,2A,j,2w,2e,1M,1X,1l,1N,2J,S,1h,y,q,3p,1b,3r,1c,1y,1H,K,3d,1T,2v,3u,1z,3o,3G,3J,3y,3I,3N,2V,2k,2k,3U,2U,2B,3t,2Q,1W,3z,1A,2P,n,k,k,2r,3m,3b,3V,2z,3R,3k,3k,3q,o,3Q,2T,2R,2R,3B,3O,2G,1I,1I,1g,1P,3i,3c,3c,2S,1j,1V,1V,1x,3n,1Y,1r,1r,N,w,1t,1t,2s,1o,U,U,2L,A,A,1L,E,F,F,p,x,i,i,l,f,e,e,a],[19,19,20,21,21,22,23,24,25,26,26,27,28,29,30,31,31,32,33,34,35,36,36,37,38,39,40,40,41,42,43,44,45,45,46,47,48,49,3Z,3Z,4c,4d,3T,4b,3Y,3Y,1q,3P,4a,3S,3M,3M,3X,3W,2l,3F,3F,2F,3g,1J,2Z,3h,3h,3w,2m,3x,2X,2i,2i,1u,3L,1p,h,1a,1a,1v,2x,3j,t,t,2y,3H,H,2o,2K,2K,z,T,u,1d,1K,1K,1n,2d,1S,2M,1E,1E,3A,1k,1O,2g,2W,2W,2a,2u,2Y,Q,Q,2h,2N,J,3K,2j,2j,1s,3f,3v,W,1D,1D,2C,v,3D,3a,1m,1m,1Z,2E,1R,1F,1F,d,c,2H,1G,2p,2p,s,2b,1w,Y,V,V,D,L,P,1C,C,C,m,2f,3l,1U,1U,M,2t,1e,Z,1Q,1Q,I,1B,2q,2n,2I,2I,3C,1i,3E,2c,X,X,3s,O,2O,3e,1f,1f,2A,j,2w,2e,2e,1M,1X,1l,1N,2J,2J,S,1h,y,q,3p,3p,1b,2D,3r,1c,1y,1y,1H,K,3d,1T,1T,2v,3u,1z,3o,3G,3G,3J,3y,3I,3N,2V,2V,2k,3U,2U,2B,3t,3t,2Q,1W,3z,1A,2P,2P,n,k,2r,3m,3m,3b,3V,2z,3R,3k,3k,3q,o,3Q,2T,2R,2R,3B,3O,2G,1I,1g,1g,1P,3i])},4P:4g(){4f 4h.4e([0,1,1,2,2,3,3,4,4,5,5,6,7,7,8,8,9,9,10,11,11,12,12,13,14,14,15,15,16,17,17,18,18,19,20,20,21,22,22,23,24,25,25,26,27,27,28,29,30,30,31,32,33,34,34,35,36,37,38,39,39,40,41,42,43,44,45,46,47,48,49,3Z,4c,4d,3T,4b,3Y,1q,3P,4a,3M,3X,3W,2l,3F,2F,1J,2Z,3h,3w,3x,2X,2i,1u,1p,h,1a,1v,3j,t,2y,H,2o,2K,T,u,1K,1n,2d,2M,1E,1k,1O,2g,2a,2u,Q,2h,2N,3K,2j,3f,3v,1D,2C,v,3a,1m,2E,1R,d,c,1G,2p,2b,1w,Y,D,L,1C,C,2f,3l,1U,2t,1e,1Q,I,2q,2n,2I,1i,3E,X,3s,O,3e,1f,2A,2w,2e,1X,1l,1N,S,1h,y,q,1b,2D,3r,1y,1H,K,3d,1T,3u,1z,3o,3G,3J,3I,3N,2V,2k,3U,2U,2B,3t,2Q,1W,3z,1A,2P,n,k,2r,3m,3b,3V,2z,3R,3k,3q,o,o,3Q,2T,2R,3B,3O,2G,2G,1I,1g,1P,1P,3i,3c,2S,1j,1j,1V,1x,1x,3n,1Y,1r,1r,N,w,w,1t,2s,2s,1o,U,U,2L,A,A,1L,E,E,F,p,p,x,i,i,l,l,f,e,e,a],[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,3Z,4c,4d,3T,4b,3Y,3P,4a,3S,3M,3X,3W,2l,3F,2F,3g,1J,3h,3w,2m,3x,2X,2i,1u,3L,1p,1a,1v,2x,3j,t,2y,3H,2o,2K,z,T,u,1d,1n,2d,1S,2M,1E,3A,1O,2g,2W,2a,2u,2Y,2h,2N,J,3K,2j,1s,3v,W,1D,2C,v,3a,1m,1Z,2E,1R,1F,c,2H,1G,2p,s,2b,Y,V,D,L,P,1C,m,2f,3l,1U,M,2t,Z,1Q,I,1B,2q,2n,2I,3C,3E,2c,X,3s,O,2O,3e,1f,j,2w,2e,1M,1X,1l,1N,2J,S,1h,y,q,3p,2D,3r,1c,1y,1H,K,3d,1T,2v,3u,1z,3o,3G,3J,3y,3I,3N,2V,2k,3U,2U,2U,2B,3t,2Q,1W,3z,1A,2P,n,k,2r,2r,3m,3b,3V,2z,3R,3k,3k,3q,o,3Q,2T,2T,2R,3B,3O,2G,2G,1I,1g,1P,1P,3i,3c,2S,1j,1j,1V,1x,1x,3n,1Y,1r,1r,N,w,1t,1t,2s,1o,1o,U,2L,A,A,1L,E,E,F,p,p,x,i,l,l,f,e,e,a],[1q,3P,3P,4a,4a,3S,3M,3M,3X,3W,3W,2l,2l,3F,2F,2F,3g,1J,1J,2Z,2Z,3h,3w,3w,2m,2m,3x,2X,2X,2i,1u,1u,3L,3L,1p,h,h,1a,1a,1v,2x,2x,3j,t,t,2y,2y,3H,H,H,2o,2K,2K,z,z,T,u,u,1d,1d,1K,1n,1n,2d,1S,1S,2M,2M,1E,3A,3A,1k,1O,1O,2g,2g,2W,2a,2a,2u,2u,2Y,Q,Q,2h,2N,2N,J,J,3K,2j,2j,1s,1s,3f,3v,3v,W,1D,1D,2C,2C,v,3D,3D,3a,1m,1m,1Z,1Z,2E,1R,1R,1F,1F,d,c,c,2H,1G,1G,2p,2p,s,2b,2b,1w,1w,Y,V,V,D,L,L,P,P,1C,C,C,m,2f,2f,3l,3l,1U,M,M,2t,2t,1e,Z,Z,1Q,I,I,1B,1B,2q,2n,2n,2I,3C,3C,1i,1i,3E,2c,2c,X,X,3s,O,O,2O,3e,3e,1f,1f,2A,j,j,2w,2w,2e,1M,1M,1X,1l,1l,1N,1N,2J,S,S,1h,y,y,q,q,3p,1b,1b,2D,2D,3r,1c,1c,1y,1H,1H,K,K,3d,1T,1T,2v,3u,3u,1z,1z,3o,3G,3G,3J,3J,3y,3I,3I,3N,2V,2V,2k,2k,3U,2U,2U,2B,2B,3t,2Q,2Q,1W,3z,3z,1A,1A,2P,n,n,k,2r,2r,3m,3m,3b,3b])},4Q:4g(){4f 4h.4e([2l,3F,2F,2F,3g,1J,2Z,2Z,3h,3w,2m,2m,3x,2X,2i,2i,1u,3L,1p,1p,h,1a,1v,1v,2x,3j,t,t,2y,3H,H,H,2o,2K,z,z,T,u,1d,1d,1K,1n,2d,2d,1S,2M,1E,1E,3A,1k,1O,1O,2g,2W,2a,2a,2u,2Y,Q,Q,2h,2N,J,J,3K,2j,1s,1s,3f,3v,W,W,1D,2C,v,v,3D,3a,1m,1m,1Z,2E,1R,1R,1F,d,c,2H,2H,1G,2p,s,s,2b,1w,Y,Y,V,D,L,L,P,1C,C,C,m,2f,3l,3l,1U,M,2t,2t,1e,Z,1Q,1Q,I,1B,2q,2q,2n,2I,3C,3C,1i,3E,2c,2c,X,3s,O,O,2O,3e,1f,1f,2A,j,2w,2w,2e,1M,1X,1X,1l,1N,2J,2J,S,1h,y,y,q,3p,1b,1b,2D,3r,1c,1c,1y,1H,K,K,3d,1T,2v,2v,3u,1z,3o,3G,3G,3J,3y,3I,3I,3N,2V,2k,2k,3U,2U,2B,2B,3t,2Q,1W,1W,3z,1A,2P,2P,n,k,2r,2r,3m,3b,3V,3V,2z,3R,3k,3k,3q,o,3Q,3Q,2T,2R,3B,3B,3O,2G,1I,1I,1g,1P,3i,3i,3c,2S,1j,1j,1V,1x,3n,3n,1Y,1r,N,N,w,1t,2s,2s,1o,U,2L,2L,A,1L,E,E,F,p,x,x,i,l,f,f,e,a],[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,3Z,4c,4d,3T,4b,3Y,1q,3P,4a,3S,3M,3X,3W,2l,3F,2F,3g,1J,2Z,3h,3w,2m,3x,2X,2i,1u,3L,1p,h,1a,1v,2x,3j,t,2y,3H,H,2o,2K,z,T,u,1d,1K,1n,2d,1S,2M,1E,3A,1k,1O,2g,2W,2a,2u,2Y,Q,2h,2N,J,3K,2j,1s,3f,3v,W,1D,2C,v,3D,3a,1m,1Z,2E,1R,1F,d,c,2H,1G,2p,s,2b,1w,Y,V,D,L,P,1C,C,m,2f,3l,1U,M,2t,1e,Z,1Q,I,1B,2q,2n,2I,3C,1i,3E,2c,X,3s,O,2O,3e,1f,2A,j,2w,2e,1M,1X,1l,1N,2J,S,1h,y,q,3p,1b,2D,3r,1c,1y,1H,K,3d,1T,2v,3u,1z,3o,3G,3J,3y,3I,3N,2V,2k,3U,2U,2B,3t,2Q,1W,3z,1A,2P,n,k,2r,3m,3b,3V,2z,3R,3k,3q,o,3Q,2T,2R,3B,3O,2G,1I,1g,1P,3i,3c,2S,1j,1V,1x,3n,1Y,1r,N,w,1t,2s,1o,U,2L,A,1L,E,F,p,x,i,l,f,e,a],[2l,3F,3F,2F,2F,3g,3g,1J,1J,2Z,2Z,3h,3h,3w,3w,2m,2m,3x,3x,2X,2X,2i,2i,1u,1u,3L,3L,1p,1p,h,h,1a,1a,1v,1v,2x,2x,3j,3j,t,t,2y,2y,3H,3H,H,H,2o,2o,2K,2K,z,z,T,T,u,u,1d,1d,1K,1K,1n,1n,2d,2d,1S,1S,2M,2M,1E,1E,3A,3A,1k,1k,1O,1O,2g,2g,2W,2W,2a,2a,2u,2u,2Y,2Y,Q,Q,2h,2h,2N,2N,J,J,3K,3K,2j,2j,1s,1s,3f,3f,3v,3v,W,W,1D,1D,2C,2C,v,v,3D,3D,3a,3a,1m,1m,1Z,1Z,2E,2E,1R,1R,1F,1F,d,d,c,c,2H,2H,1G,1G,2p,2p,s,s,2b,2b,1w,1w,Y,Y,V,V,D,D,L,L,P,P,1C,1C,C,C,m,m,2f,2f,3l,3l,1U,1U,M,M,2t,2t,1e,1e,Z,Z,1Q,1Q,I,I,1B,1B,2q,2q,2n,2n,2I,2I,3C,3C,1i,1i,3E,3E,2c,2c,X,X,3s,3s,O,O,2O,2O,3e,3e,1f,1f,2A,2A,j,j,2w,2w,2e,2e,1M,1M,1X,1X,1l,1l,1N,1N,2J,2J,S,S,1h,1h,y,y,q,q,3p,3p,1b,1b,2D,2D,3r,3r,1c,1c,1y,1y,1H,1H,K,K,3d,3d,1T,1T,2v,2v,3u,3u,1z])},4R:4g(){4f 4h.4e([0,1,2,3,4,5,6,8,9,10,11,12,13,14,15,16,17,18,19,20,22,23,24,25,26,27,28,29,30,31,32,33,34,36,37,38,39,40,41,42,43,44,45,46,47,48,3Z,4c,4d,3T,4b,3Y,1q,3P,4a,3S,3M,3X,3W,3F,2F,3g,1J,2Z,3h,3w,2m,3x,2X,2i,1u,3L,h,1a,1v,2x,3j,t,2y,3H,H,2o,2K,z,T,1d,1K,1n,2d,1S,2M,1E,3A,1k,1O,2g,2W,2a,2Y,Q,2h,2N,J,3K,2j,1s,3f,3v,W,1D,2C,3D,3a,1m,1Z,2E,1R,1F,d,c,2H,1G,2p,2b,1w,Y,V,D,L,P,1C,C,m,2f,3l,1U,2t,1e,Z,1Q,I,1B,2q,2n,2I,3C,1i,3E,2c,3s,O,2O,3e,1f,2A,j,2w,2e,1M,1X,1l,1N,S,1h,y,q,3p,1b,2D,3r,1c,1y,1H,K,3d,2v,3u,1z,3o,3G,3J,3y,3I,3N,2V,2k,3U,2U,3t,2Q,1W,3z,1A,2P,n,k,2r,3m,3b,3V,2z,3k,3q,o,3Q,2T,2R,3B,3O,2G,1I,1g,1P,3i,2S,1j,1V,1x,3n,1Y,1r,N,w,1t,2s,1o,U,A,1L,E,F,p,x,i,i,i,i,i,i,i,i,i,i,i,i,i,i,i,i,i,i,i,i,i,i,i],[41,41,42,43,44,45,46,47,47,48,49,3Z,4c,4d,3T,4b,3Y,1q,3P,4a,3S,3S,3M,3X,3W,2l,3F,2F,3g,1J,2Z,3h,3w,2m,2m,3x,2X,2i,1u,3L,1p,h,1a,1v,2x,3j,t,t,2y,3H,H,2o,2K,z,T,u,1d,1K,1n,1n,2d,1S,2M,1E,3A,1k,1O,2g,2W,2a,2u,2Y,2Y,Q,2h,2N,J,3K,2j,1s,3f,3v,W,1D,2C,2C,v,3D,3a,1m,1Z,2E,1R,1F,d,c,2H,1G,1G,2p,s,2b,1w,Y,V,D,L,P,1C,C,m,m,2f,3l,1U,M,2t,1e,Z,1Q,I,1B,2q,2n,2n,2I,3C,1i,3E,2c,X,3s,O,2O,3e,1f,2A,2A,j,2w,2e,1M,1X,1l,1N,2J,S,1h,y,q,q,3p,1b,2D,3r,1c,1y,1H,K,3d,1T,2v,3u,3u,1z,3o,3G,3J,3y,3I,3N,2V,2k,3U,2U,2U,2B,3t,2Q,1W,3z,1A,2P,n,k,2r,3m,3b,3b,3V,2z,3R,3k,3q,o,3Q,2T,2R,3B,3O,2G,2G,1I,1g,1P,3i,3c,2S,1j,1V,1x,3n,1Y,1r,1r,N,w,1t,2s,1o,U,2L,A,1L,E,F,p,p,x,i,l,f,e,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a],[s,s,s,s,2b,2b,1w,1w,Y,Y,V,V,D,D,L,L,P,P,1C,C,C,m,m,2f,2f,3l,3l,1U,1U,M,M,2t,2t,1e,Z,Z,1Q,1Q,I,I,1B,1B,2q,2q,2n,2n,2I,2I,3C,1i,1i,3E,3E,2c,2c,X,X,3s,3s,O,O,2O,2O,3e,1f,1f,2A,2A,j,j,2w,2w,2e,2e,1M,1M,1X,1X,1l,1N,1N,2J,2J,S,S,1h,1h,y,y,q,q,3p,3p,1b,2D,2D,3r,3r,1c,1c,1y,1y,1H,1H,K,K,3d,3d,1T,2v,2v,3u,3u,1z,1z,3o,3o,3G,3G,3J,3J,3y,3y,3I,3I,3N,2V,2V,2k,2k,3U,3U,2U,2U,2B,2B,3t,3t,2Q,2Q,1W,3z,3z,1A,1A,2P,2P,n,n,k,k,2r,2r,3m,3m,3b,3V,3V,2z,2z,3R,3R,3k,3k,3q,3q,o,o,3Q,3Q,2T,2R,2R,3B,3B,3O,3O,2G,2G,1I,1I,1g,1g,1P,1P,3i,3c,3c,2S,2S,1j,1j,1V,1V,1x,1x,3n,3n,1Y,1Y,1r,N,N,w,w,1t,1t,2s,2s,1o,1o,U,U,2L,2L,A,1L,1L,E,E,F,F,p,p,x,x,i,i,l,l,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f])},4S:4g(){4f 4h.4e([0,3,6,9,12,15,18,21,24,27,30,32,35,38,41,44,47,3Z,3T,3Y,4a,3X,3F,1J,3h,3x,1u,h,1v,t,H,2K,u,1K,1S,3A,1O,2a,2Y,2h,3K,1s,3v,2C,3D,1m,2E,d,2H,2p,2b,Y,D,P,C,2f,1U,M,1e,1Q,1B,2q,2I,1i,3E,X,3s,2O,3e,2A,j,2w,1M,1X,1l,1N,S,1h,y,q,3p,1b,2D,1c,1y,1H,K,3d,1T,1T,2v,3u,1z,3o,3G,3J,3J,3y,3I,3N,2V,2V,2k,3U,3U,2U,2B,3t,3t,2Q,2Q,1W,3z,3z,1A,2P,2P,n,n,k,2r,2r,3m,3m,3b,3b,3V,2z,2z,3R,3R,3k,3k,3q,3q,o,o,3Q,3Q,2T,2T,2R,2R,3B,3B,3B,3O,3O,2G,2G,1I,1I,1g,1g,1g,1P,1P,3i,3i,3i,3c,3c,2S,2S,2S,1j,1j,1j,1V,1V,1V,1x,1x,3n,3n,3n,1Y,1Y,1Y,1r,1r,1r,1r,N,N,N,w,w,w,1t,1t,1t,1t,2s,2s,2s,1o,1o,1o,1o,U,U,U,U,2L,2L,2L,2L,A,A,A,A,1L,1L,1L,1L,E,E,E,E,F,F,F,F,p,p,p,p,p,x,x,x,x,x,i,i,i,i,l,l,l,l,l,f,f,f,f,f,e,e,e,e,e,a,a,a],[31,32,33,35,36,37,38,39,41,42,43,44,45,46,48,49,3Z,4c,4d,3T,3Y,1q,3P,4a,3S,3M,3W,2l,3F,2F,3g,1J,3h,3w,2m,3x,2X,2i,1u,3L,h,1a,1v,2x,3j,t,2y,3H,H,2o,z,T,u,1d,1K,1n,2d,1S,2M,1E,3A,1k,1O,2g,2W,2a,2u,2Y,Q,2h,2N,J,3K,2j,1s,3f,3v,W,1D,2C,v,3D,3a,1m,1m,1Z,2E,1R,1F,d,c,2H,1G,2p,2p,s,2b,1w,Y,V,D,D,L,P,1C,C,m,m,2f,3l,1U,M,2t,2t,1e,Z,1Q,I,I,1B,2q,2n,2I,2I,3C,1i,3E,3E,2c,X,3s,3s,O,2O,3e,3e,1f,2A,j,j,2w,2e,1M,1M,1X,1l,1l,1N,2J,S,S,1h,y,y,q,3p,1b,1b,2D,3r,3r,1c,1y,1y,1H,K,K,3d,1T,1T,2v,3u,3u,1z,3o,3o,3G,3J,3J,3y,3I,3I,3N,2V,2V,2k,3U,3U,2U,2B,2B,3t,2Q,2Q,1W,3z,3z,1A,1A,2P,n,n,k,2r,2r,3m,3b,3b,3V,2z,2z,3R,3R,3k,3q,3q,o,o,o,o,o,o,o,o,o,o,o,o,o,o,o,o,o,o,o,o,o,o,o,o,o,o,o,o,o,o,o,o,o,o,o,o,o,o,o,o],[h,h,h,h,h,h,h,h,h,h,h,h,h,h,h,h,h,h,h,h,h,h,h,h,h,h,h,h,h,h,h,h,h,h,h,h,h,h,h,h,h,h,h,h,h,h,h,h,h,h,h,h,h,h,h,h,h,h,h,h,h,h,h,h,h,h,h,h,h,h,1a,1a,1a,1a,1a,1a,1a,1a,1a,1a,1a,1v,1v,1v,1v,1v,1v,1v,2x,2x,2x,2x,2x,3j,3j,3j,3j,t,t,t,t,2y,2y,2y,3H,3H,3H,H,H,H,2o,2o,2K,2K,2K,z,z,T,T,u,u,1d,1d,1K,1n,1n,2d,2d,1S,2M,2M,1E,3A,3A,1k,1O,1O,2g,2W,2a,2a,2u,2Y,Q,2h,2N,2N,J,3K,2j,1s,3f,3v,3v,W,1D,2C,v,3D,3a,1m,1Z,2E,1R,1F,d,c,2H,1G,2p,s,2b,1w,Y,V,D,L,P,1C,m,2f,3l,1U,M,2t,1e,Z,1Q,I,1B,2n,2I,3C,1i,3E,2c,X,3s,2O,3e,1f,2A,j,j,j,j,j,j,j,j,j,j,j,j,j,j,j,j,j,j,j,j,j,j,j,j,j,j,j,j,j,j,j,j,j,j,j,j,j,j,j,j,j,j,j,j,j,j,j,j,j,j,j,j,j,j])},4T:4g(){4f 4h.4e([0,1,2,3,4,5,6,8,9,10,11,12,13,14,15,16,17,18,19,20,22,23,24,25,26,27,28,29,30,31,32,33,34,36,37,38,39,40,41,42,43,44,45,46,47,48,3Z,4c,4d,3T,4b,3Y,1q,3P,4a,3S,3M,3X,3W,3F,2F,3g,1J,2Z,3h,3w,2m,3x,2X,2i,1u,3L,h,1a,1v,2x,3j,t,2y,3H,H,2o,2K,z,T,1d,1K,1n,2d,1S,2M,1E,3A,1k,1O,2g,2W,2a,2Y,Q,2h,2N,J,3K,2j,1s,3f,3v,W,1D,2C,3D,3a,1m,1Z,2E,1R,1F,d,c,2H,1G,2p,2b,1w,Y,V,D,L,P,1C,C,m,2f,3l,1U,2t,1e,Z,1Q,I,1B,2q,2n,2I,3C,1i,3E,2c,3s,O,2O,3e,1f,2A,j,2w,2e,1M,1X,1l,1N,S,1h,y,q,3p,1b,2D,3r,1c,1y,1H,K,3d,2v,3u,1z,3o,3G,3J,3y,3I,3N,2V,2k,3U,2U,3t,2Q,1W,3z,1A,2P,n,k,2r,3m,3b,3V,2z,3k,3q,o,3Q,2T,2R,3B,3O,2G,1I,1g,1P,3i,2S,1j,1V,1x,3n,1Y,1r,N,w,1t,2s,1o,U,A,1L,E,F,p,x,i,i,i,i,i,i,i,i,i,i,i,i,i,i,i,i,i,i,i,i,i,i,i],[41,41,42,43,44,45,46,47,47,48,49,3Z,4c,4d,3T,4b,3Y,1q,3P,4a,3S,3S,3M,3X,3W,2l,3F,2F,3g,1J,2Z,3h,3w,2m,2m,3x,2X,2i,1u,3L,1p,h,1a,1v,2x,3j,t,t,2y,3H,H,2o,2K,z,T,u,1d,1K,1n,1n,2d,1S,2M,1E,3A,1k,1O,2g,2W,2a,2u,2Y,2Y,Q,2h,2N,J,3K,2j,1s,3f,3v,W,1D,2C,2C,v,3D,3a,1m,1Z,2E,1R,1F,d,c,2H,1G,1G,2p,s,2b,1w,Y,V,D,L,P,1C,C,m,m,2f,3l,1U,M,2t,1e,Z,1Q,I,1B,2q,2n,2n,2I,3C,1i,3E,2c,X,3s,O,2O,3e,1f,2A,2A,j,2w,2e,1M,1X,1l,1N,2J,S,1h,y,q,q,3p,1b,2D,3r,1c,1y,1H,K,3d,1T,2v,3u,3u,1z,3o,3G,3J,3y,3I,3N,2V,2k,3U,2U,2U,2B,3t,2Q,1W,3z,1A,2P,n,k,2r,3m,3b,3b,3V,2z,3R,3k,3q,o,3Q,2T,2R,3B,3O,2G,2G,1I,1g,1P,3i,3c,2S,1j,1V,1x,3n,1Y,1r,1r,N,w,1t,2s,1o,U,2L,A,1L,E,F,p,p,x,i,l,f,e,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a],[s,s,s,s,2b,2b,1w,1w,Y,Y,V,V,D,D,L,L,P,P,1C,C,C,m,m,2f,2f,3l,3l,1U,1U,M,M,2t,2t,1e,Z,Z,1Q,1Q,I,I,1B,1B,2q,2q,2n,2n,2I,2I,3C,1i,1i,3E,3E,2c,2c,X,X,3s,3s,O,O,2O,2O,3e,1f,1f,2A,2A,j,j,2w,2w,2e,2e,1M,1M,1X,1X,1l,1N,1N,2J,2J,S,S,1h,1h,y,y,q,q,3p,3p,1b,2D,2D,3r,3r,1c,1c,1y,1y,1H,1H,K,K,3d,3d,1T,2v,2v,3u,3u,1z,1z,3o,3o,3G,3G,3J,3J,3y,3y,3I,3I,3N,2V,2V,2k,2k,3U,3U,2U,2U,2B,2B,3t,3t,2Q,2Q,1W,3z,3z,1A,1A,2P,2P,n,n,k,k,2r,2r,3m,3m,3b,3V,3V,2z,2z,3R,3R,3k,3k,3q,3q,o,o,3Q,3Q,2T,2R,2R,3B,3B,3O,3O,2G,2G,1I,1I,1g,1g,1P,1P,3i,3c,3c,2S,2S,1j,1j,1V,1V,1x,1x,3n,3n,1Y,1Y,1r,N,N,w,w,1t,1t,2s,2s,1o,1o,U,U,2L,2L,A,1L,1L,E,E,F,F,p,p,x,x,i,i,l,l,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f,f])},4U:4g(){4f 4h.4e([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,4,6,8,10,12,14,16,18,20,22,24,26,28,30,32,33,35,37,39,41,43,45,47,49,4c,3T,3Y,3P,3S,3X,2l,2F,1J,3h,2m,2X,1u,1p,1a,2x,t,3H,2o,z,u,1K,2d,1S,1E,1k,2g,2a,2Y,2h,J,2j,3f,W,2C,3D,1m,2E,1F,c,1G,s,1w,V,L,1C,m,3l,M,1e,1Q,1B,2n,3C,3E,2c,3s,2O,1f,j,2e,1X,1N,S,y,3p,2D,1c,1H,3d,2v,1z,3G,3y,3N,2k,2U,3t,1W,1A,n,2r,3b,2z,3k,o,2T,2R,3O,1I,1P,3c,1j,1x,1Y,N,1t,1o,2L,1L,F,x,l,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e],[0,1,2,3,4,6,7,8,9,10,11,12,13,14,16,17,18,19,20,21,22,23,24,26,27,28,29,30,31,32,33,34,35,37,38,39,40,41,42,43,44,45,47,48,49,3Z,4c,4d,3T,4b,3Y,1q,4a,3S,3M,3X,3W,2l,3F,2F,3g,1J,2Z,3w,2m,3x,2X,2i,1u,3L,1p,h,1a,1v,2x,t,2y,3H,H,2o,2K,z,T,u,1d,1K,1n,2d,2M,1E,3A,1k,1O,2g,2W,2a,2u,2Y,Q,2h,2N,J,3K,2j,1s,3v,W,1D,2C,v,3D,3a,1m,1Z,2E,1R,1F,d,c,2H,1G,2p,s,2b,1w,Y,V,D,L,P,1C,C,m,2f,3l,1U,M,2t,1e,Z,1Q,I,1B,2q,2n,2I,3C,1i,3E,2c,X,3s,O,2O,3e,1f,2A,j,2w,2e,1M,1X,1l,1N,2J,S,1h,y,q,3p,1b,2D,3r,1c,1y,1y,1H,K,3d,1T,2v,3u,1z,3o,3G,3J,3y,3I,3N,3N,2V,2k,3U,2U,2B,3t,2Q,1W,3z,3z,1A,2P,n,k,2r,3m,3b,3V,3V,2z,3R,3k,3q,o,3Q,2T,2T,2R,3B,3O,2G,1I,1g,1P,1P,3i,3c,2S,1j,1V,1x,1x,3n,1Y,1r,N,w,1t,1t,2s,1o,U,2L,A,1L,1L,E,F,p,x,i,l,l,f,e,a],[0,1,1,2,3,3,4,4,5,6,6,7,8,8,9,9,10,11,11,12,13,13,14,15,15,16,16,17,18,18,19,20,20,21,22,22,23,24,24,25,26,26,27,28,28,29,30,30,31,32,32,33,34,34,35,36,36,37,38,38,39,40,40,41,42,43,43,44,45,45,46,47,48,48,49,3Z,3Z,4c,4d,3T,3T,4b,3Y,1q,1q,3P,4a,3S,3S,3M,3X,3W,2l,2l,3F,2F,3g,1J,1J,2Z,3h,3w,2m,2m,3x,2X,2i,1u,3L,3L,1p,h,1a,1v,2x,3j,3j,t,2y,3H,H,2o,2K,z,z,T,u,1d,1K,1n,2d,1S,2M,1E,3A,1k,1O,2g,2W,2a,2u,2Y,Q,2h,2h,J,3K,2j,1s,3f,3v,W,1D,2C,v,3D,3a,1m,1Z,2E,1R,1F,d,c,1G,2p,s,2b,1w,Y,V,L,P,1C,C,m,2f,1U,M,2t,1e,Z,I,1B,2q,2n,3C,1i,3E,2c,3s,O,2O,3e,2A,j,2w,1M,1X,1l,2J,S,1h,q,3p,1b,3r,1c,1H,K,3d,2v,3u,3o,3G,3y,3I,3N,2k,3U,2B,3t,1W,3z,2P,n,2r,3m,3V,2z,3k,3q,3Q,2T,3B,3O,1I,1g,3i,3c,1j,1V,3n,1Y,N,1t,2s,U,2L,1L,E,p,x,l,f,a])},4V:4g(){4f 4h.4e([0,0,1,1,2,2,3,3,3,4,4,5,5,6,6,7,7,8,8,9,9,9,10,10,11,11,12,13,13,14,14,15,15,16,16,17,18,18,19,20,20,21,21,22,23,24,24,25,26,26,27,28,29,30,30,31,32,33,34,35,36,37,38,38,39,40,41,42,44,45,46,47,48,49,3Z,4c,3T,4b,3Y,1q,4a,3S,3M,3W,2l,3F,3g,1J,3h,3w,3x,2X,1u,3L,h,1a,2x,t,2y,H,2K,z,u,1K,1n,1S,1E,1k,1O,2W,2u,Q,2N,J,2j,3f,W,2C,v,3a,1Z,1R,d,c,1G,s,1w,V,D,P,C,2f,1U,M,1e,1Q,1B,2q,2I,1i,2c,X,O,3e,1f,j,2e,1M,1l,1N,S,y,q,1b,2D,1c,1y,K,3d,1T,3u,1z,3o,3J,3y,3I,2V,2k,3U,2U,2B,2Q,1W,3z,1A,2P,n,k,2r,3m,3b,3V,2z,3R,3k,3q,o,3Q,2T,2T,2R,3B,3O,2G,2G,1I,1g,1P,1P,3i,3c,3c,2S,1j,1j,1V,1x,1x,3n,3n,1Y,1r,1r,N,N,w,w,1t,1t,2s,2s,1o,1o,U,U,2L,2L,A,A,A,1L,1L,E,E,E,F,F,p,p,p,x,x,x,i,i,l,l,l,f,f,f,e,e,e,a,a],[0,0,1,1,2,2,3,3,3,4,4,5,5,6,6,7,7,8,8,9,9,9,10,10,11,11,12,13,13,14,14,15,15,16,16,17,18,18,19,20,20,21,21,22,23,24,24,25,26,26,27,28,29,30,30,31,32,33,34,35,36,37,38,38,39,40,41,42,44,45,46,47,48,49,3Z,4c,3T,4b,3Y,1q,4a,3S,3M,3W,2l,3F,3g,1J,3h,3w,3x,2X,1u,3L,h,1a,2x,t,2y,H,2K,z,u,1K,1n,1S,1E,1k,1O,2W,2u,Q,2N,J,2j,3f,W,2C,v,3a,1Z,1R,d,c,1G,s,1w,V,D,P,C,2f,1U,M,1e,1Q,1B,2q,2I,1i,2c,X,O,3e,1f,j,2e,1M,1l,1N,S,y,q,1b,2D,1c,1y,K,3d,1T,3u,1z,3o,3J,3y,3I,2V,2k,3U,2U,2B,2Q,1W,3z,1A,2P,n,k,2r,3m,3b,3V,2z,3R,3k,3q,o,3Q,2T,2T,2R,3B,3O,2G,2G,1I,1g,1P,1P,3i,3c,3c,2S,1j,1j,1V,1x,1x,3n,3n,1Y,1r,1r,N,N,w,w,1t,1t,2s,2s,1o,1o,U,U,2L,2L,A,A,A,1L,1L,E,E,E,F,F,p,p,p,x,x,x,i,i,l,l,l,f,f,f,e,e,e,a,a],[0,0,1,1,2,2,3,3,3,4,4,5,5,6,6,7,7,8,8,9,9,9,10,10,11,11,12,13,13,14,14,15,15,16,16,17,18,18,19,20,20,21,21,22,23,24,24,25,26,26,27,28,29,30,30,31,32,33,34,35,36,37,38,38,39,40,41,42,44,45,46,47,48,49,3Z,4c,3T,4b,3Y,1q,4a,3S,3M,3W,2l,3F,3g,1J,3h,3w,3x,2X,1u,3L,h,1a,2x,t,2y,H,2K,z,u,1K,1n,1S,1E,1k,1O,2W,2u,Q,2N,J,2j,3f,W,2C,v,3a,1Z,1R,d,c,1G,s,1w,V,D,P,C,2f,1U,M,1e,1Q,1B,2q,2I,1i,2c,X,O,3e,1f,j,2e,1M,1l,1N,S,y,q,1b,2D,1c,1y,K,3d,1T,3u,1z,3o,3J,3y,3I,2V,2k,3U,2U,2B,2Q,1W,3z,1A,2P,n,k,2r,3m,3b,3V,2z,3R,3k,3q,o,3Q,2T,2T,2R,3B,3O,2G,2G,1I,1g,1P,1P,3i,3c,3c,2S,1j,1j,1V,1x,1x,3n,3n,1Y,1r,1r,N,N,w,w,1t,1t,2s,2s,1o,1o,U,U,2L,2L,A,A,A,1L,1L,E,E,E,F,F,p,p,p,x,x,x,i,i,l,l,l,f,f,f,e,e,e,a,a])},4W:4g(){4f 4h.4e([0,1,1,2,3,4,4,5,6,7,7,8,9,10,10,11,12,13,13,14,15,16,17,17,18,19,20,20,21,22,23,24,24,25,26,27,28,29,29,30,31,32,33,34,34,35,36,37,38,39,40,41,42,43,44,45,45,46,47,48,49,3Z,4c,4d,3T,4b,3Y,3P,4a,3S,3M,3X,3W,2l,3F,2F,3g,2Z,3h,3w,2m,3x,2X,1u,3L,1p,h,1a,2x,3j,t,2y,H,2o,2K,T,u,1d,1K,2d,1S,2M,3A,1k,1O,2W,2a,2u,Q,2h,2N,3K,2j,1s,3v,W,1D,v,3D,1m,1Z,2E,1F,d,c,1G,2p,s,1w,Y,V,L,P,1C,m,2f,1U,M,2t,Z,1Q,I,1B,2n,2I,3C,3E,2c,X,O,2O,3e,1f,j,2w,2e,1M,1l,1N,2J,S,1h,q,3p,1b,2D,3r,1c,1H,K,3d,1T,2v,3u,1z,3o,3G,3J,3y,3I,3N,2V,2k,3U,2U,2B,3t,2Q,1W,3z,1A,2P,n,k,2r,3m,3m,3b,3V,2z,3R,3k,3k,3q,o,3Q,2T,2R,2R,3B,3O,2G,2G,1I,1g,1P,1P,3i,3c,2S,2S,1j,1V,1x,1x,3n,1Y,1Y,1r,N,N,w,1t,2s,2s,1o,U,U,2L,A,A,1L,E,E,F,F,p,x,x,i,l,l,f,e,e,a],[0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,11,11,12,12,13,13,14,15,15,16,16,17,18,18,19,19,20,21,21,22,23,23,24,25,26,26,27,28,28,29,30,31,32,32,33,34,35,36,37,37,38,39,40,41,42,43,44,45,46,47,48,49,3Z,4c,4d,3T,4b,3Y,1q,3P,3S,3M,3X,3W,2l,2F,3g,1J,2Z,3w,2m,3x,2i,1u,3L,h,1a,1v,3j,t,2y,H,2o,z,T,u,1K,1n,1S,2M,3A,1k,2g,2W,2a,2Y,Q,2N,J,2j,1s,3v,W,2C,v,3a,1m,2E,1R,d,c,1G,2p,2b,1w,V,D,P,1C,m,2f,1U,M,1e,Z,I,1B,2n,2I,1i,3E,X,3s,2O,3e,1f,j,2w,1M,1X,1l,2J,S,1h,q,3p,1b,3r,1c,1y,K,3d,1T,2v,1z,3o,3G,3J,3y,3N,2V,2k,3U,2U,2B,3t,2Q,1W,3z,1A,2P,n,k,2r,3m,3b,3V,2z,3R,3k,3q,o,3Q,3Q,2T,2R,3B,3O,2G,2G,1I,1g,1P,1P,3i,3c,2S,2S,1j,1V,1x,1x,3n,1Y,1Y,1r,N,N,w,1t,1t,2s,2s,1o,U,U,2L,A,A,1L,1L,E,E,F,p,p,x,x,i,l,l,f,f,e,e,a],[0,2,3,5,7,8,10,11,13,15,16,18,20,21,23,24,26,27,29,31,32,34,35,37,38,40,41,43,44,46,47,49,3Z,4c,3T,4b,1q,3P,4a,3M,3X,3W,3F,2F,3g,1J,2Z,3w,2m,3x,2X,2i,1u,3L,1p,h,1a,1v,2x,3j,t,2y,3H,H,2o,2o,2K,z,T,u,u,1d,1K,1K,1n,2d,2d,1S,2M,2M,1E,3A,3A,1k,1k,1O,1O,2g,2g,2W,2W,2a,2a,2u,2u,2Y,2Y,Q,Q,2h,2h,2h,2N,2N,J,J,J,3K,3K,2j,2j,2j,1s,1s,1s,3f,3f,3f,3v,3v,3v,W,W,W,1D,1D,2C,2C,2C,v,v,v,3D,3D,3D,3a,3a,1m,1m,1m,1Z,1Z,2E,2E,2E,1R,1R,1F,1F,d,d,c,c,c,2H,2H,1G,2p,2p,s,s,2b,2b,1w,Y,Y,V,V,D,L,P,P,1C,C,C,m,2f,3l,1U,1U,M,2t,1e,Z,1Q,I,1B,2q,2n,2I,3C,1i,3E,2c,X,3s,O,3e,1f,2A,j,2e,1M,1X,1l,2J,S,1h,q,3p,2D,3r,1y,1H,K,1T,2v,1z,3o,3J,3I,3N,2k,3U,2B,2Q,1W,1A,2P,k,3m,3b,2z,3k,3q,3Q,2R,3O,2G,1g,3i,3c,1j,1x,1Y,1r,w,2s,U,2L,1L,F,x,i,f,a])},4X:4g(){4f 4h.4e([v,3D,3a,3a,1m,1Z,2E,2E,1R,1F,d,c,c,2H,1G,2p,2p,s,2b,1w,1w,Y,V,V,D,L,P,P,1C,C,C,m,2f,2f,3l,3l,1U,M,M,2t,2t,1e,1e,Z,Z,1Q,1Q,I,I,1B,1B,2q,2q,2n,2n,2I,2I,2I,3C,3C,1i,1i,1i,3E,3E,3E,2c,2c,2c,X,X,X,3s,3s,3s,O,O,O,2O,2O,2O,3e,3e,3e,3e,1f,1f,1f,2A,2A,2A,2A,j,j,j,2w,2w,2w,2w,2e,2e,2e,1M,1M,1M,1M,1X,1X,1X,1l,1l,1l,1l,1N,1N,1N,2J,2J,2J,S,S,S,1h,1h,1h,y,y,y,q,q,3p,3p,3p,1b,1b,2D,2D,3r,3r,3r,1c,1c,1y,1y,1H,1H,K,K,3d,3d,1T,1T,2v,3u,3u,1z,1z,3o,3G,3G,3J,3J,3y,3I,3I,3N,2V,2V,2k,3U,3U,2U,2B,2B,3t,2Q,1W,1W,3z,1A,2P,2P,n,k,2r,3m,3m,3b,3V,2z,3R,3R,3k,3q,o,3Q,2T,2T,2R,3B,3O,2G,2G,1I,1g,1P,3i,3i,3c,2S,2S,1j,1V,1V,1x,3n,3n,1Y,1r,1r,N,N,w,1t,1t,2s,2s,1o,1o,U,U,2L,2L,A,A,1L,1L,E,E,F,F,p,p,x,x,i,i,l,l,l,f,f,e,e,a,a],[2l,3F,2F,3g,1J,2Z,3h,3w,2m,3x,3x,2X,2i,1u,3L,1p,h,1a,1v,2x,3j,3j,t,2y,3H,H,2o,2o,2K,z,T,u,u,1d,1K,1n,1n,2d,1S,1S,2M,1E,1E,3A,3A,1k,1O,1O,2g,2g,2W,2W,2a,2a,2u,2u,2Y,2Y,Q,Q,2h,2h,2N,2N,2N,J,J,3K,3K,2j,2j,2j,1s,1s,1s,3f,3f,3v,3v,3v,W,W,W,1D,1D,2C,2C,2C,v,v,v,3D,3D,3a,3a,3a,1m,1m,1Z,1Z,1Z,2E,2E,1R,1R,1F,1F,d,d,c,c,2H,2H,1G,1G,2p,2p,s,s,2b,1w,1w,Y,Y,V,D,L,L,P,1C,1C,C,m,2f,2f,3l,1U,M,2t,1e,Z,1Q,I,I,1B,2q,2n,2I,3C,1i,3E,2c,X,3s,O,2O,3e,1f,2A,j,2w,2e,1M,1M,1X,1l,1N,2J,S,S,1h,y,y,q,3p,3p,1b,2D,2D,3r,3r,1c,1y,1y,1H,K,3d,3d,1T,2v,3u,1z,3o,3G,3J,3y,3N,2V,2k,2U,2B,2Q,1W,3z,2P,k,2r,3b,3V,3R,3k,o,3Q,2T,3B,3O,2G,1g,1P,3i,3c,2S,1j,1V,1x,1x,3n,1Y,1Y,1r,1r,N,N,N,w,w,w,w,w,w,w,1t,1t,1t,w,w,w,w,w,w,w,w,w,N,N,N],[H,H,2o,2o,2K,2K,z,z,T,T,u,u,1d,1d,1K,1K,1n,1n,2d,2d,2d,1S,1S,2M,2M,1E,1E,3A,3A,3A,1k,1k,1O,1O,1O,2g,2g,2W,2W,2W,2a,2a,2a,2u,2u,2u,2Y,2Y,2Y,Q,Q,2h,2h,2h,2N,2N,2N,J,J,J,J,3K,3K,3K,2j,2j,2j,1s,1s,1s,3f,3f,3f,3v,3v,3v,W,W,W,W,1D,1D,1D,2C,2C,2C,v,v,v,3D,3D,3D,3a,3a,3a,1m,1m,1Z,1Z,1Z,2E,2E,2E,1R,1R,1R,1F,1F,d,d,d,c,c,2H,2H,2H,1G,1G,2p,2p,s,s,2b,2b,1w,1w,Y,Y,Y,V,D,D,L,L,P,P,1C,1C,C,C,m,m,2f,2f,3l,3l,1U,1U,M,M,2t,2t,2t,1e,1e,Z,Z,Z,Z,1Q,1Q,1Q,1Q,I,I,I,I,I,I,I,I,I,I,I,I,1Q,1Q,1Q,1Q,Z,Z,Z,Z,1e,1e,1e,1e,2t,2t,2t,2t,2t,M,M,M,M,M,M,M,M,M,M,2t,2t,2t,1e,1e,Z,Z,1Q,1Q,I,1B,2q,2n,2I,3C,1i,2c,X,3s,2O,3e,2A,j,2w,1M,1X,1l,2J,S,1h,y,q,3p,1b,2D,2D,3r,3r,1c,1c,1y,1y,1y,1y,1H,1H,1H,1H,1H,1H,1H,1H,1H,1H])}}', 62, 308, '||||||||||255||128|127|254|253||78|251|167|210|252|142|209|219|249|178||132|83|91|119|239|250|177|89|245||141|137|247|248||86|151|110|186|138|146|238|162|139|107||175|90|243|136|116|160|135|149|||||||||||79|180|183|92|148|165|227|176|157|232|100|172|122|94|242|77|56|237|113|240|75|80|134|234|184|191|207|152|140|117|98|126|130|185|226|67|93|246|170|173|101|228|150|125|96|188|145|233|205|171|236|123|||||||||||104|133|159|95|169|143|102|108|74|112|199|63|71|154|87|131|153|211|241|147|105|189|168|81|84|215|166|202|118|181|124|65|225|129|155|174|88|244|97|109|163|208|204|222|231|221|201|198|103|73|106|68|||||||||||121|213|230|187|164|114|66|69|229|82|217|144|212|235|192|179|218|182|161|203|190|115|70|72|195|206|99|223|156|120|158|64|193|85|196|194|111|76|60|197|224|57|220|216|59|53|200|214|62|61|55|50|||||||||||58|54|51|52|mapping|return|function|this|vintage|window|andy|lumise_fx_map|eb|singe|vivid|purple|thresh|aqua|edgewood|ventura|aladin|amber|anne|greg|josh|karen|melissa|peter|salomon|sophia|tonny|adrian|janine|merissa|ronny|roxy|sanna|gordon|shaan|borg|carl|doris|doug|earl|kevin|nash|polak|satya|satya2|stan'.split('|'), 0, {}));

/**
 * jQuery Masonry v2.1.08
 * A dynamic layout plugin for jQuery
 * The flip-side of CSS Floats
 * http://masonry.desandro.com
 *
 * Licensed under the MIT license.
 * Copyright 2012 David DeSandro
 */
(function(e, t, n) {
    "use strict";
    var r = t.event,
        i;
    r.special.smartresize = {
        setup: function() { t(this).bind("resize", r.special.smartresize.handler) },
        teardown: function() { t(this).unbind("resize", r.special.smartresize.handler) },
        handler: function(e, t) {
            var n = this,
                s = arguments;
            e.type = "smartresize", i && clearTimeout(i), i = setTimeout(function() { r.dispatch.apply(n, s) }, t === "execAsap" ? 0 : 100)
        }
    }, t.fn.smartresize = function(e) { return e ? this.bind("smartresize", e) : this.trigger("smartresize", ["execAsap"]) }, t.Mason = function(e, n) { this.element = t(n), this._create(e), this._init() }, t.Mason.settings = { isResizable: !0, isAnimated: !1, animationOptions: { queue: !1, duration: 500 }, gutterWidth: 0, isRTL: !1, isFitWidth: !1, containerStyle: { position: "relative" } }, t.Mason.prototype = {
        _filterFindBricks: function(e) { var t = this.options.itemSelector; return t ? e.filter(t).add(e.find(t)) : e },
        _getBricks: function(e) { var t = this._filterFindBricks(e).css({ position: "absolute" }).addClass("masonry-brick"); return t },
        _create: function(n) {
            this.options = t.extend(!0, {}, t.Mason.settings, n), this.styleQueue = [];
            var r = this.element[0].style;
            this.originalStyle = { height: r.height || "" };
            var i = this.options.containerStyle;
            for (var s in i) this.originalStyle[s] = r[s] || "";
            this.element.css(i), this.horizontalDirection = this.options.isRTL ? "right" : "left";
            var o = this.element.css("padding-" + this.horizontalDirection),
                u = this.element.css("padding-top");
            this.offset = { x: o ? parseInt(o, 10) : 0, y: u ? parseInt(u, 10) : 0 }, this.isFluid = this.options.columnWidth && typeof this.options.columnWidth == "function";
            var a = this;
            setTimeout(function() { a.element.addClass("masonry") }, 0), this.options.isResizable && t(e).bind("smartresize.masonry", function() { a.resize() }), this.reloadItems()
        },
        _init: function(e) { this._getColumns(), this._reLayout(e) },
        option: function(e, n) { t.isPlainObject(e) && (this.options = t.extend(!0, this.options, e)) },
        layout: function(e, t) {
            for (var n = 0, r = e.length; n < r; n++) this._placeBrick(e[n]);
            var i = {};
            i.height = Math.max.apply(Math, this.colYs);
            if (this.options.isFitWidth) {
                var s = 0;
                n = this.cols;
                while (--n) {
                    if (this.colYs[n] !== 0) break;
                    s++
                }
                i.width = (this.cols - s) * this.columnWidth - this.options.gutterWidth
            }
            this.styleQueue.push({ $el: this.element, style: i });
            var o = this.isLaidOut ? this.options.isAnimated ? "animate" : "css" : "css",
                u = this.options.animationOptions,
                a;
            for (n = 0, r = this.styleQueue.length; n < r; n++) a = this.styleQueue[n], a.$el[o](a.style, u);
            this.styleQueue = [], t && t.call(e), this.isLaidOut = !0
        },
        _getColumns: function() {
            var e = this.options.isFitWidth ? this.element.parent() : this.element,
                t = e.width();
            this.columnWidth = this.isFluid ? this.options.columnWidth(t) : this.options.columnWidth || this.$bricks.outerWidth(!0) || t, this.columnWidth += this.options.gutterWidth, this.cols = Math.floor((t + this.options.gutterWidth) / this.columnWidth), this.cols = Math.max(this.cols, 1)
        },
        _placeBrick: function(e) {
            var n = t(e),
                r, i, s, o, u;
            r = Math.ceil(n.outerWidth(!0) / this.columnWidth), r = Math.min(r, this.cols);
            if (r === 1) s = this.colYs;
            else { i = this.cols + 1 - r, s = []; for (u = 0; u < i; u++) o = this.colYs.slice(u, u + r), s[u] = Math.max.apply(Math, o) }
            var a = Math.min.apply(Math, s),
                f = 0;
            for (var l = 0, c = s.length; l < c; l++)
                if (s[l] === a) { f = l; break }
            var h = { top: a + this.offset.y };
            h[this.horizontalDirection] = this.columnWidth * f + this.offset.x, this.styleQueue.push({ $el: n, style: h });
            var p = a + n.outerHeight(!0),
                d = this.cols + 1 - c;
            for (l = 0; l < d; l++) this.colYs[f + l] = p
        },
        resize: function() {
            var e = this.cols;
            this._getColumns(), (this.isFluid || this.cols !== e) && this._reLayout()
        },
        _reLayout: function(e) {
            var t = this.cols;
            this.colYs = [];
            while (t--) this.colYs.push(0);
            this.layout(this.$bricks, e)
        },
        reloadItems: function() { this.$bricks = this._getBricks(this.element.children()) },
        reload: function(e) { this.reloadItems(), this._init(e) },
        appended: function(e, t, n) {
            if (t) {
                this._filterFindBricks(e).css({ top: this.element.height() });
                var r = this;
                setTimeout(function() { r._appended(e, n) }, 1)
            } else this._appended(e, n)
        },
        _appended: function(e, t) {
            var n = this._getBricks(e);
            this.$bricks = this.$bricks.add(n), this.layout(n, t)
        },
        remove: function(e) { this.$bricks = this.$bricks.not(e), e.remove() },
        destroy: function() {
            this.$bricks.removeClass("masonry-brick").each(function() { this.style.position = "", this.style.top = "", this.style.left = "" });
            var n = this.element[0].style;
            for (var r in this.originalStyle) n[r] = this.originalStyle[r];
            this.element.unbind(".masonry").removeClass("masonry").removeData("masonry"), t(e).unbind(".masonry")
        }
    }, t.fn.imagesLoaded = function(e) {
        function u() { e.call(n, r) }

        function a(e) {
            var n = e.target;
            n.src !== s && t.inArray(n, o) === -1 && (o.push(n), --i <= 0 && (setTimeout(u), r.unbind(".imagesLoaded", a)))
        }
        var n = this,
            r = n.find("img").add(n.filter("img")),
            i = r.length,
            s = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==",
            o = [];
        return i || u(), r.bind("load.imagesLoaded error.imagesLoaded", a).each(function() {
            var e = this.src;
            this.src = s, this.src = e
        }), n
    };
    var s = function(t) { e.console && e.console.error(t) };
    t.fn.masonry = function(e) {
        if (typeof e == "string") {
            var n = Array.prototype.slice.call(arguments, 1);
            this.each(function() {
                var r = t.data(this, "masonry");
                if (!r) { s("cannot call methods on masonry prior to initialization; attempted to call method '" + e + "'"); return }
                if (!t.isFunction(r[e]) || e.charAt(0) === "_") { s("no such method '" + e + "' for masonry instance"); return }
                r[e].apply(r, n)
            })
        } else this.each(function() {
            var n = t.data(this, "masonry");
            n ? (n.option(e || {}), n._init()) : t.data(this, "masonry", new t.Mason(e, this))
        });
        return this
    }
})(window, jQuery);
fabric.Text.prototype._renderText = function(ctx) {
    //this._translateForTextAlign(ctx);
    this._renderTextFill(ctx);
    this._renderTextStroke(ctx);
    this._renderTextFill(ctx);
    //this._translateForTextAlign(ctx, true);
};
/**
 * jscolor, JavaScript Color Picker
 *
 * @version 1.3.13
 * @license GNU Lesser General Public License, http://www.gnu.org/copyleft/lesser.html
 * @author  Jan Odvarko, http://odvarko.cz
 * @created 2008-06-15
 * @updated 2012-01-19
 * @link    http://jscolor.com
 */
(function($) {

    window.jscolor = {
        name2Hex: function(a) {
            var b = {
                "aliceblue": "#f0f8ff",
                "antiquewhite": "#faebd7",
                "aqua": "#00ffff",
                "aquamarine": "#7fffd4",
                "azure": "#f0ffff",
                "beige": "#f5f5dc",
                "bisque": "#ffe4c4",
                "black": "#000000",
                "blanchedalmond": "#ffebcd",
                "blue": "#0000ff",
                "blueviolet": "#8a2be2",
                "brown": "#a52a2a",
                "burlywood": "#deb887",
                "cadetblue": "#5f9ea0",
                "chartreuse": "#7fff00",
                "chocolate": "#d2691e",
                "coral": "#ff7f50",
                "cornflowerblue": "#6495ed",
                "cornsilk": "#fff8dc",
                "crimson": "#dc143c",
                "cyan": "#00ffff",
                "darkblue": "#00008b",
                "darkcyan": "#008b8b",
                "darkgoldenrod": "#b8860b",
                "darkgray": "#a9a9a9",
                "darkgreen": "#006400",
                "darkkhaki": "#bdb76b",
                "darkmagenta": "#8b008b",
                "darkolivegreen": "#556b2f",
                "darkorange": "#ff8c00",
                "darkorchid": "#9932cc",
                "darkred": "#8b0000",
                "darksalmon": "#e9967a",
                "darkseagreen": "#8fbc8f",
                "darkslateblue": "#483d8b",
                "darkslategray": "#2f4f4f",
                "darkturquoise": "#00ced1",
                "darkviolet": "#9400d3",
                "deeppink": "#ff1493",
                "deepskyblue": "#00bfff",
                "dimgray": "#696969",
                "dodgerblue": "#1e90ff",
                "firebrick": "#b22222",
                "floralwhite": "#fffaf0",
                "forestgreen": "#228b22",
                "fuchsia": "#ff00ff",
                "gainsboro": "#dcdcdc",
                "ghostwhite": "#f8f8ff",
                "gold": "#ffd700",
                "goldenrod": "#daa520",
                "gray": "#808080",
                "green": "#008000",
                "greenyellow": "#adff2f",
                "honeydew": "#f0fff0",
                "hotpink": "#ff69b4",
                "indianred ": "#cd5c5c",
                "indigo": "#4b0082",
                "ivory": "#fffff0",
                "khaki": "#f0e68c",
                "lavender": "#e6e6fa",
                "lavenderblush": "#fff0f5",
                "lawngreen": "#7cfc00",
                "lemonchiffon": "#fffacd",
                "lightblue": "#add8e6",
                "lightcoral": "#f08080",
                "lightcyan": "#e0ffff",
                "lightgoldenrodyellow": "#fafad2",
                "lightgrey": "#d3d3d3",
                "lightgreen": "#90ee90",
                "lightpink": "#ffb6c1",
                "lightsalmon": "#ffa07a",
                "lightseagreen": "#20b2aa",
                "lightskyblue": "#87cefa",
                "lightslategray": "#778899",
                "lightsteelblue": "#b0c4de",
                "lightyellow": "#ffffe0",
                "lime": "#00ff00",
                "limegreen": "#32cd32",
                "linen": "#faf0e6",
                "magenta": "#ff00ff",
                "maroon": "#800000",
                "mediumaquamarine": "#66cdaa",
                "mediumblue": "#0000cd",
                "mediumorchid": "#ba55d3",
                "mediumpurple": "#9370d8",
                "mediumseagreen": "#3cb371",
                "mediumslateblue": "#7b68ee",
                "mediumspringgreen": "#00fa9a",
                "mediumturquoise": "#48d1cc",
                "mediumvioletred": "#c71585",
                "midnightblue": "#191970",
                "mintcream": "#f5fffa",
                "mistyrose": "#ffe4e1",
                "moccasin": "#ffe4b5",
                "navajowhite": "#ffdead",
                "navy": "#000080",
                "oldlace": "#fdf5e6",
                "olive": "#808000",
                "olivedrab": "#6b8e23",
                "orange": "#ffa500",
                "orangered": "#ff4500",
                "orchid": "#da70d6",
                "palegoldenrod": "#eee8aa",
                "palegreen": "#98fb98",
                "paleturquoise": "#afeeee",
                "palevioletred": "#d87093",
                "papayawhip": "#ffefd5",
                "peachpuff": "#ffdab9",
                "peru": "#cd853f",
                "pink": "#ffc0cb",
                "plum": "#dda0dd",
                "powderblue": "#b0e0e6",
                "purple": "#800080",
                "red": "#ff0000",
                "rosybrown": "#bc8f8f",
                "royalblue": "#4169e1",
                "saddlebrown": "#8b4513",
                "salmon": "#fa8072",
                "sandybrown": "#f4a460",
                "seagreen": "#2e8b57",
                "seashell": "#fff5ee",
                "sienna": "#a0522d",
                "silver": "#c0c0c0",
                "skyblue": "#87ceeb",
                "slateblue": "#6a5acd",
                "slategray": "#708090",
                "snow": "#fffafa",
                "springgreen": "#00ff7f",
                "steelblue": "#4682b4",
                "tan": "#d2b48c",
                "teal": "#008080",
                "thistle": "#d8bfd8",
                "tomato": "#ff6347",
                "turquoise": "#40e0d0",
                "violet": "#ee82ee",
                "wheat": "#f5deb3",
                "white": "#ffffff",
                "whitesmoke": "#f5f5f5",
                "yellow": "#ffff00",
                "yellowgreen": "#9acd32"
            };
            if (typeof b[a.toLowerCase()] != 'undefined') return b[a.toLowerCase()];
            return false
        },
        HEX: {
            R: function(h) {
                return parseInt((this.cutHex(h)).substring(0, 2), 16)
            },
            G: function(h) {
                return parseInt((this.cutHex(h)).substring(2, 4), 16)
            },
            B: function(h) {
                return parseInt((this.cutHex(h)).substring(4, 6), 16)
            },
            O: function(c) {
                if (c.indexOf("#") > -1 || c.indexOf("(") === -1 || c.indexOf(")") === -1) return 1;
                return c.split('(')[1].split(')')[0].split(',')[3]
            },
            cutHex: function(h) {
                return (h.charAt(0) == "#") ? h.substring(1, 7) : h
            },
        },
        dir: '',
        bindClass: 'color',
        binding: true,
        preloading: true,
        install: function() {
            jscolor.addEvent(window, 'load', jscolor.init)
        },
        init: function() {
            if (jscolor.binding) {
                jscolor.bind()
            }
            if (jscolor.preloading) {
                jscolor.preload()
            }
        },
        getDir: function() {
            if (!jscolor.dir) {
                var a = jscolor.detectDir();
                jscolor.dir = a !== false ? a : 'jscolor/'
            }
            return jscolor.dir
        },
        detectDir: function() {
            var a = location.href;
            var e = document.getElementsByTagName('base');
            for (var i = 0; i < e.length; i += 1) {
                if (e[i].href) {
                    a = e[i].href
                }
            }
            var e = document.getElementsByTagName('script');
            for (var i = 0; i < e.length; i += 1) {
                if ((e[i].src && /(^|\/)jscolor\.js([?#].*)?$/i.test(e[i].src)) || e[i].getAttribute('data-jscolor') == 'true') {
                    var b = new jscolor.URI(e[i].src);
                    var c = b.toAbsolute(a);
                    c.path = c.path.replace(/[^\/]+$/, '');
                    c.query = null;
                    c.fragment = null;
                    return c.toString()
                }
            }
            return false
        },
        bind: function() {
            var a = new RegExp('(^|\\s)(' + jscolor.bindClass + ')\\s*(\\{[^}]*\\})?', 'i');
            var e = document.getElementsByTagName('input');
            for (var i = 0; i < e.length; i += 1) {
                var m;
                if (!e[i].color && e[i].className && (m = e[i].className.match(a))) {
                    var b = {};
                    if (m[3]) {
                        try {
                            eval('prop=' + m[3])
                        } catch (eInvalidProp) {}
                    }
                    e[i].color = new jscolor.color(e[i], b)
                }
            }
        },
        preload: function() {
            for (var a in jscolor.imgRequire) {
                if (jscolor.imgRequire.hasOwnProperty(a)) {
                    jscolor.loadImage(a)
                }
            }
        },
        images: {
            pad: [181, 101],
            sld: [16, 101],
            cross: [15, 15],
            arrow: [7, 11]
        },
        imgRequire: {},
        imgLoaded: {},
        requireImage: function(a) {
            jscolor.imgRequire[a] = true
        },
        loadImage: function(a) {
            if (!jscolor.imgLoaded[a]) {
                jscolor.imgLoaded[a] = new Image();
                jscolor.imgLoaded[a].src = jscolor.getDir() + a
            }
        },
        fetchElement: function(a) {
            return typeof a === 'string' ? document.getElementById(a) : a
        },
        addEvent: function(a, b, c) {
            if (a.addEventListener) {
                a.addEventListener(b, c, false)
            } else if (a.attachEvent) {
                a.attachEvent('on' + b, c)
            }
        },
        fireEvent: function(a, b) {
            if (!a) {
                return
            }
            if (document.createEvent) {
                var c = document.createEvent('HTMLEvents');
                c.initEvent(b, true, true);
                a.dispatchEvent(c)
            } else if (document.createEventObject) {
                var c = document.createEventObject();
                a.fireEvent('on' + b, c)
            } else if (a['on' + b]) {
                a['on' + b]()
            }
        },
        getElementPos: function(e) {
            var a = e,
                e2 = e;
            var x = 0,
                y = 0;
            if (a.offsetParent) {
                do {
                    x += a.offsetLeft;
                    y += a.offsetTop
                } while (a = a.offsetParent)
            }
            while ((e2 = e2.parentNode) && e2.nodeName.toUpperCase() !== 'BODY') {
                x -= e2.scrollLeft;
                y -= e2.scrollTop
            }
            return [x, y]
        },
        getElementSize: function(e) {
            return [e.offsetWidth, e.offsetHeight]
        },
        getRelMousePos: function(e) {
            var x = 0,
                y = 0;
            if (!e) {
                e = window.event
            }
            if (typeof e.offsetX === 'number') {
                x = e.offsetX;
                y = e.offsetY
            } else if (typeof e.layerX === 'number') {
                x = e.layerX;
                y = e.layerY
            }
            return {
                x: x,
                y: y
            }
        },
        getViewPos: function() {
            if (typeof window.pageYOffset === 'number') {
                return [window.pageXOffset, window.pageYOffset]
            } else if (document.body && (document.body.scrollLeft || document.body.scrollTop)) {
                return [document.body.scrollLeft, document.body.scrollTop]
            } else if (document.documentElement && (document.documentElement.scrollLeft || document.documentElement.scrollTop)) {
                return [document.documentElement.scrollLeft, document.documentElement.scrollTop]
            } else {
                return [0, 0]
            }
        },
        getViewSize: function() {
            if (typeof window.innerWidth === 'number') {
                return [window.innerWidth, window.innerHeight]
            } else if (document.body && (document.body.clientWidth || document.body.clientHeight)) {
                return [document.body.clientWidth, document.body.clientHeight]
            } else if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
                return [document.documentElement.clientWidth, document.documentElement.clientHeight]
            } else {
                return [0, 0]
            }
        },
        URI: function(d) {
            this.scheme = null;
            this.authority = null;
            this.path = '';
            this.query = null;
            this.fragment = null;
            this.parse = function(a) {
                var m = a.match(/^(([A-Za-z][0-9A-Za-z+.-]*)(:))?((\/\/)([^\/?#]*))?([^?#]*)((\?)([^#]*))?((#)(.*))?/);
                this.scheme = m[3] ? m[2] : null;
                this.authority = m[5] ? m[6] : null;
                this.path = m[7];
                this.query = m[9] ? m[10] : null;
                this.fragment = m[12] ? m[13] : null;
                return this
            };
            this.toString = function() {
                var a = '';
                if (this.scheme !== null) {
                    a = a + this.scheme + ':'
                }
                if (this.authority !== null) {
                    a = a + '//' + this.authority
                }
                if (this.path !== null) {
                    a = a + this.path
                }
                if (this.query !== null) {
                    a = a + '?' + this.query
                }
                if (this.fragment !== null) {
                    a = a + '#' + this.fragment
                }
                return a
            };
            this.toAbsolute = function(a) {
                var a = new jscolor.URI(a);
                var r = this;
                var t = new jscolor.URI;
                if (a.scheme === null) {
                    return false
                }
                if (r.scheme !== null && r.scheme.toLowerCase() === a.scheme.toLowerCase()) {
                    r.scheme = null
                }
                if (r.scheme !== null) {
                    t.scheme = r.scheme;
                    t.authority = r.authority;
                    t.path = removeDotSegments(r.path);
                    t.query = r.query
                } else {
                    if (r.authority !== null) {
                        t.authority = r.authority;
                        t.path = removeDotSegments(r.path);
                        t.query = r.query
                    } else {
                        if (r.path === '') {
                            t.path = a.path;
                            if (r.query !== null) {
                                t.query = r.query
                            } else {
                                t.query = a.query
                            }
                        } else {
                            if (r.path.substr(0, 1) === '/') {
                                t.path = removeDotSegments(r.path)
                            } else {
                                if (a.authority !== null && a.path === '') {
                                    t.path = '/' + r.path
                                } else {
                                    t.path = a.path.replace(/[^\/]+$/, '') + r.path
                                }
                                t.path = removeDotSegments(t.path)
                            }
                            t.query = r.query
                        }
                        t.authority = a.authority
                    }
                    t.scheme = a.scheme
                }
                t.fragment = r.fragment;
                return t
            };

            function removeDotSegments(a) {
                var b = '';
                while (a) {
                    if (a.substr(0, 3) === '../' || a.substr(0, 2) === './') {
                        a = a.replace(/^\.+/, '').substr(1)
                    } else if (a.substr(0, 3) === '/./' || a === '/.') {
                        a = '/' + a.substr(3)
                    } else if (a.substr(0, 4) === '/../' || a === '/..') {
                        a = '/' + a.substr(4);
                        b = b.replace(/\/?[^\/]*$/, '')
                    } else if (a === '.' || a === '..') {
                        a = ''
                    } else {
                        var c = a.match(/^\/?[^\/]*/)[0];
                        a = a.substr(c.length);
                        b = b + c
                    }
                }
                return b
            }
            if (d) {
                this.parse(d)
            }
        },
        color: function(q, u) {
            this.required = false;
            this.adjust = true;
            this.hash = true;
            this.caps = true;
            this.slider = true;
            this.valueElement = q;
            this.styleElement = q;
            this.onImmediateChange = null;
            this.hsv = [0, 0, 1];
            this.rgb = [1, 1, 1];
            this.pickerOnfocus = true;
            this.pickerMode = 'HSV';
            this.pickerPosition = 'bottom';
            this.pickerSmartPosition = true;
            this.pickerButtonHeight = 0;
            this.pickerClosable = false;
            this.pickerCloseText = 'Close';
            this.pickerButtonColor = 'ButtonText';
            this.pickerFace = 15;
            this.pickerFaceColor = 'rgba(70, 85, 89, 0.97)';
            this.pickerBorder = 0;
            this.pickerBorderColor = '';
            this.pickerInset = 0;
            this.pickerInsetColor = '';
            this.pickerZIndex = 180000002;
            this.opacity = 1;
            this.position = 'absolute';
            for (var p in u) {
                if (u.hasOwnProperty(p)) {
                    this[p] = u[p]
                }
            }
            this.hidePicker = function() {
                if (isPickerOwner()) {
                    removePicker()
                }
            };
            this.showPicker = function() {
                if (!isPickerOwner()) {
                    var d = jscolor.getElementPos(q);
                    var e = jscolor.getElementSize(q);
                    var f = jscolor.getViewPos();
                    var g = jscolor.getViewSize();
                    var h = getPickerDims(this);
                    var a, b, c;
                    switch (this.pickerPosition.toLowerCase()) {
                        case 'left':
                            a = 1;
                            b = 0;
                            c = -1;
                            break;
                        case 'right':
                            a = 1;
                            b = 0;
                            c = 1;
                            break;
                        case 'top':
                            a = 0;
                            b = 1;
                            c = -1;
                            break;
                        default:
                            a = 0;
                            b = 1;
                            c = 1;
                            break
                    }
                    var l = (e[b] + h[b]) / 2;
                    if (!this.pickerSmartPosition) {
                        var i = [d[a], d[b] + e[b] - l + l * c]
                    } else {
                        var i = [-f[a] + d[a] + h[a] > g[a] ? (-f[a] + d[a] + e[a] / 2 > g[a] / 2 && d[a] + e[a] - h[a] >= 0 ? d[a] + e[a] - h[a] : d[a]) : d[a], -f[b] + d[b] + e[b] + h[b] - l + l * c > g[b] ? (-f[b] + d[b] + e[b] / 2 > g[b] / 2 && d[b] + e[b] - l - l * c >= 0 ? d[b] + e[b] - l - l * c : d[b] + e[b] - l + l * c) : (d[b] + e[b] - l + l * c >= 0 ? d[b] + e[b] - l + l * c : d[b] + e[b] - l - l * c)]
                    }
                    drawPicker(i[a] + 1, i[b] + 1)
                }
            };
            this.importColor = function() {
                if (!B) {
                    this.exportColor()
                } else {
                    if (B.value === '') {
                        this.fromString(B.value);
                        return
                    }
                    if (B.value.indexOf('#') == -1) {
                        this.fromString(B.value);
                        this.exportColor('import');
                        return
                    }
                    if (!this.adjust) {
                        if (!this.fromString(B.value, D)) {
                            styleElement.style.backgroundImage = styleElement.jscStyle.backgroundImage;
                            styleElement.style.backgroundColor = styleElement.jscStyle.backgroundColor;
                            styleElement.style.color = styleElement.jscStyle.color;
                            this.exportColor(D | leaveStyle)
                        }
                    } else if (!this.required && /^\s*$/.test(B.value)) {
                        B.value = '';
                        styleElement.style.backgroundImage = styleElement.jscStyle.backgroundImage;
                        styleElement.style.backgroundColor = styleElement.jscStyle.backgroundColor;
                        styleElement.style.color = styleElement.jscStyle.color;
                        this.exportColor(D | leaveStyle)
                    } else if (this.fromString(B.value)) {} else {
                        this.exportColor()
                    }
                }
            };
            this.exportColor = function(a) {
                if (w.opacity == '1' && a != 'import') {
                    if (!(a & D) && B) {
                        var b = this.toString();
                        if (this.caps) {
                            b = b.toLowerCase()
                        }
                        if (this.hash) {
                            b = '#' + b
                        }
                        B.value = b
                    };
                    if (!(a & leaveStyle) && styleElement) {
                        styleElement.style.backgroundImage = "none";
                        styleElement.style.backgroundColor = '#' + this.toString();
                        styleElement.style.color = 0.213 * this.rgb[0] + 0.715 * this.rgb[1] + 0.072 * this.rgb[2] < 0.5 ? '#FFF' : '#000'
                    };
                    styleElement.value = '#' + this.toString()
                } else {
                    styleElement.style.color = 0.213 * this.rgb[0] + 0.715 * this.rgb[1] + 0.072 * this.rgb[2] < 0.5 ? '#FFF' : '#000';
                    var c = '#' + this.toString();
                    if (w.opacity !== undefined && w.opacity != 1) {
                        if (w.opacity < 0.5) styleElement.style.color = '#000';
                        c = 'rgba(' + Math.round(255 * w.rgb[0]) + ', ' + Math.round(255 * w.rgb[1]) + ', ' + Math.round(255 * w.rgb[2]) + ', ' + w.opacity.toString().trim() + ')'
                    };
                    styleElement.style.backgroundColor = c;
                    styleElement.value = c
                }
                if (!(a & leavePad) && isPickerOwner()) {
                    redrawPad();
                    redrawSld();
                    redrawOpacity()
                }
                if (jQuery !== undefined) jQuery(B).trigger('change')
            };
            this.fromHSV = function(h, s, v, a) {
                h < 0 && (h = 0) || h > 6 && (h = 6);
                s < 0 && (s = 0) || s > 1 && (s = 1);
                v < 0 && (v = 0) || v > 1 && (v = 1);
                this.rgb = HSV_RGB(h === null ? this.hsv[0] : (this.hsv[0] = h), s === null ? this.hsv[1] : (this.hsv[1] = s), v === null ? this.hsv[2] : (this.hsv[2] = v));
                this.exportColor(a)
            };
            this.fromRGB = function(r, g, b, a) {
                r < 0 && (r = 0) || r > 1 && (r = 1);
                g < 0 && (g = 0) || g > 1 && (g = 1);
                b < 0 && (b = 0) || b > 1 && (b = 1);
                var c = RGB_HSV(r === null ? this.rgb[0] : (this.rgb[0] = r), g === null ? this.rgb[1] : (this.rgb[1] = g), b === null ? this.rgb[2] : (this.rgb[2] = b));
                if (c[0] !== null) {
                    this.hsv[0] = c[0]
                }
                if (c[2] !== 0) {
                    this.hsv[1] = c[1]
                }
                this.hsv[2] = c[2];
                this.exportColor(a)
            };
            this.fromString = function(a, b) {
                if (jscolor.name2Hex(a) !== false) {
                    a = jscolor.name2Hex(a);
                    styleElement.value = a
                }
                var m = a.match(/^\W*([0-9A-F]{3}([0-9A-F]{3})?)\W*$/i);
                if (!m) {
                    if (a.indexOf('rgb') > -1 && a.indexOf("(") > -1 && a.indexOf(")") > -1) {
                        a = a.split("(")[1].split(")")[0].trim().split(',');
                        this.fromRGB(parseInt(a[0].trim()) / 255, parseInt(a[1].trim()) / 255, parseInt(a[2].trim()) / 255, b);
                        if (a[3] !== undefined) {
                            this.opacity = a[3].trim() + '000';
                            this.opacity = this.opacity.substr(0, 4)
                        } else this.opacity = '1';
                        if (parseFloat(this.opacity) > 1) this.opacity = '1';
                        if (parseFloat(this.opacity) === 0) this.opacity = '0'
                    }
                } else {
                    if (m[1].length === 6) {
                        this.fromRGB(parseInt(m[1].substr(0, 2), 16) / 255, parseInt(m[1].substr(2, 2), 16) / 255, parseInt(m[1].substr(4, 2), 16) / 255, b)
                    } else {
                        this.fromRGB(parseInt(m[1].charAt(0) + m[1].charAt(0), 16) / 255, parseInt(m[1].charAt(1) + m[1].charAt(1), 16) / 255, parseInt(m[1].charAt(2) + m[1].charAt(2), 16) / 255, b)
                    }
                    return true
                }
                return false
            };
            this.toString = function() {
                return ((0x100 | Math.round(255 * this.rgb[0])).toString(16).substr(1) + (0x100 | Math.round(255 * this.rgb[1])).toString(16).substr(1) + (0x100 | Math.round(255 * this.rgb[2])).toString(16).substr(1))
            };

            function RGB_HSV(r, g, b) {
                var n = Math.min(Math.min(r, g), b);
                var v = Math.max(Math.max(r, g), b);
                var m = v - n;
                if (m === 0) {
                    return [null, 0, v]
                }
                var h = r === n ? 3 + (b - g) / m : (g === n ? 5 + (r - b) / m : 1 + (g - r) / m);
                return [h === 6 ? 0 : h, m / v, v]
            }

            function HSV_RGB(h, s, v) {
                if (h === null) {
                    return [v, v, v]
                }
                var i = Math.floor(h);
                var f = i % 2 ? h - i : 1 - (h - i);
                var m = v * (1 - s);
                var n = v * (1 - s * f);
                switch (i) {
                    case 6:
                    case 0:
                        return [v, n, m];
                    case 1:
                        return [n, v, m];
                    case 2:
                        return [m, v, n];
                    case 3:
                        return [m, n, v];
                    case 4:
                        return [n, m, v];
                    case 5:
                        return [v, m, n]
                }
            }

            function removePicker() {
                delete jscolor.picker.owner;
                document.getElementsByTagName('body')[0].removeChild(jscolor.picker.boxB)
            }

            function drawPicker(x, y) {
                if (!jscolor.picker) {
                    jscolor.picker = {
                        box: document.createElement('div'),
                        boxB: document.createElement('div'),
                        pad: document.createElement('div'),
                        padB: document.createElement('div'),
                        padM: document.createElement('div'),
                        sld: document.createElement('div'),
                        sldB: document.createElement('div'),
                        sldBO: document.createElement('div'),
                        sldM: document.createElement('div'),
                        sldO: document.createElement('div'),
                        header: document.createElement('div'),
                        btn: document.createElement('div'),
                    }
                };
                var p = jscolor.picker;
                p.boxB.className = "lumise_color_picker";
                p.boxB.style.position = w.position;
                for (var i = 0, segSize = 4; i < jscolor.images.sld[1]; i += segSize) {
                    var c = document.createElement('div');
                    c.style.height = segSize + 'px';
                    c.style.fontSize = '1px';
                    c.style.lineHeight = '0';
                    p.sld.appendChild(c)
                };
                var d = $('<i class="lumisex-android-close" data-func="close"></i>');
                d.on('click mouseup touchend', jscolor_blur);
                $(p.header).html('<text>Color picker</text>').append(d);
                p.sldB.appendChild(jscolor.picker.sld);
                p.box.appendChild(jscolor.picker.sldB);
                p.box.appendChild(jscolor.picker.sldBO);
                p.box.appendChild(jscolor.picker.sldM);
                p.box.appendChild(jscolor.picker.sldO);
                p.padB.appendChild(jscolor.picker.pad);
                p.box.appendChild(jscolor.picker.padB);
                p.box.appendChild(jscolor.picker.padM);
                p.box.appendChild(jscolor.picker.header);
                p.box.appendChild(jscolor.picker.btn);
                p.boxB.appendChild(jscolor.picker.box);
                p.box.id = 'lumise-color-picker-box';
                p.pad.id = 'lumise-color-picker-pad';
                p.padM.id = 'lumise-color-picker-padM';
                p.padB.id = 'lumise-color-picker-padB';
                p.boxB.id = 'lumise-color-picker-boxB';
                p.sld.id = 'lumise-color-picker-sld';
                p.sldB.id = 'lumise-color-picker-sldB';
                p.sldBO.id = 'lumise-color-picker-sldBO';
                p.sldM.id = 'lumise-color-picker-sldM';
                p.sldO.id = 'lumise-color-picker-sldO';
                p.sldO.title = 'Opacity';
                p.header.id = 'lumise-color-picker-header';
                p.btn.id = 'lumise-color-picker-btn';
                p.box.onmouseup = p.box.onmouseout = function(a) {
                    if (a.target.className == 'extendRGBA' || a.target.parentNode.className == 'extendRGBA' || a.target.parentNode.parentNode.className == 'extendRGBA') return;
                    q.focus()
                };
                p.box.onmousedown = function() {
                    A = true
                };
                p.box.onmousemove = function(e) {
                    if (C || holdSld || holdSldO) {
                        C && setPad(e);
                        holdSld && setSld(e);
                        holdSldO && setOpacity(e);
                        if (document.selection) {
                            document.selection.empty()
                        } else if (window.getSelection) {
                            window.getSelection().removeAllRanges()
                        }
                        dispatchImmediateChange()
                    }
                };
                p.padM.onmouseup = p.padM.onmouseout = function() {
                    if (C) {
                        C = false;
                        jscolor.fireEvent(B, 'change')
                    }
                };
                p.padM.onmousedown = function(e) {
                    switch (z) {
                        case 0:
                            if (w.hsv[2] === 0) {
                                w.fromHSV(null, null, 1.0)
                            };
                            break;
                        case 1:
                            if (w.hsv[1] === 0) {
                                w.fromHSV(null, 1.0, null)
                            };
                            break
                    }
                    C = true;
                    setPad(e);
                    dispatchImmediateChange()
                };
                p.sldM.onmouseup = p.sldM.onmouseout = function() {
                    if (holdSld) {
                        holdSld = false;
                        jscolor.fireEvent(B, 'change')
                    }
                };
                p.sldM.onmousedown = function(e) {
                    holdSld = true;
                    setSld(e);
                    dispatchImmediateChange()
                };
                p.sldO.onmouseup = p.sldO.onmouseout = function() {
                    if (holdSldO) {
                        holdSldO = false;
                        jscolor.fireEvent(B, 'change')
                    }
                };
                p.sldO.onmousedown = function(e) {
                    holdSldO = true;
                    setOpacity(e);
                    dispatchImmediateChange()
                };
                var f = getPickerDims(w);
                p.box.style.width = (f[0] + 40) + 'px';
                p.box.style.height = (f[1] + 80) + 'px';
                p.boxB.style.left = x + 'px';
                p.boxB.style.top = (y + 36) + 'px';
                p.btn.onmousedown = function(e) {
                    if (e.target.tagName == 'BUTTON') {
                        if (typeof(Storage) !== "undefined") {
                            var a = "#61B0FF|#9782FF|#FFD970|#CBFF63|#4DFFAC|#FF21E1|#9021FF|#1F87FF|#21FFBC|#55FF21",
                                b = B.value;
                            a = a.split('|');
                            if (localStorage['lumise_color_presets'] !== undefined) a = localStorage['lumise_color_presets'].split('|');
                            if (b === '') alert('Error, please select color first');
                            else if (a.indexOf(b) > -1) alert('Error, this color preset already exists');
                            else {
                                while (a.length > 9) a.pop();
                                a.unshift(b);
                                localStorage.removeItem('lumise_color_presets');
                                localStorage.setItem('lumise_color_presets', a.join('|'));
                                this.render()
                            }
                        } else alert('Your browser does not support offline data')
                    } else if (e.target.tagName == 'SPAN') {
                        B.value = e.target.title;
                        redrawOpacity();
                        w.importColor()
                    } else if (e.target.tagName == 'DEL') {
                        if (localStorage.getItem('lumise_color_presets') === '' || localStorage.getItem('lumise_color_presets') === null) a = "#61B0FF|#9782FF|#FFD970|#CBFF63|#4DFFAC|#FF21E1|#9021FF|#1F87FF|#21FFBC|#55FF21";
                        else a = localStorage['lumise_color_presets'];
                        a = a.split('|');
                        var b = e.target.parentNode.title,
                            index = a.indexOf(b);
                        if (index === -1) return;
                        a.splice(index, 1);
                        localStorage.removeItem('lumise_color_presets');
                        localStorage.setItem('lumise_color_presets', a.join('|'));
                        this.render()
                    }
                    e.preventDefault();
                    return false
                };
                p.btn.render = function() {
                    if (typeof(Storage) !== "undefined") {
                        var a = "#61B0FF|#9782FF|#FFD970|#CBFF63|#4DFFAC|#FF21E1|#9021FF|#1F87FF|#21FFBC|#55FF21",
                            i = 0,
                            std = ['#000', '#fff', '#dd3333', '#1e73be'],
                            html = '<button title="Create new color preset from currently"><i class="fa-plus"></i> Save color</button>';
                        a = a.split('|');
                        if (localStorage['lumise_color_presets'] !== undefined && localStorage['lumise_color_presets'] !== '') a = localStorage['lumise_color_presets'].split('|');
                        for (i = 0; i < std.length; i++) {
                            html += '<span class="fix-std" title="' + std[i] + '" style="background:' + std[i] + ';"></span>'
                        }
                        html += '<div></div>';
                        for (i = 0; i < a.length; i++) {
                            html += '<span class="preset" title="' + a[i] + '" style="background:' + a[i] + ';"><del title="Delete this preset color">x</del></span>';
                            if (i > 8) break
                        }
                        this.innerHTML = html
                    }
                };
                p.btn.render();
                switch (z) {
                    case 0:
                        var g = 'hs.png';
                        break;
                    case 1:
                        var g = 'hv.png';
                        break
                }
                p.pad.style.backgroundImage = "url('" + jscolor.getDir() + g + "')";
                p.pad.style.backgroundRepeat = "no-repeat";
                p.pad.style.backgroundPosition = "0 0";
                var h = B.value;
                var j = w.toString();
                redrawPad();
                redrawSld();
                redrawOpacity();
                jscolor.picker.owner = w;
                document.getElementsByTagName('body')[0].appendChild(p.boxB);
                if (p.boxB.offsetLeft + p.boxB.offsetWidth > screen.width) {
                    p.boxB.style.left = (screen.width - p.boxB.offsetWidth - 10) + 'px'
                }
                var k = $('#lumise-color-picker-boxB');
                $('#lumise-color-picker-header').on('mousedown touchstart', function(e) {
                    var l = k.get(0).offsetLeft,
                        t = k.get(0).offsetTop,
                        x = e.originalEvent.pageX ? e.originalEvent.pageX : e.originalEvent.touches[0].pageX,
                        y = e.originalEvent.pageY ? e.originalEvent.pageY : e.originalEvent.touches[0].pageY;
                    $(document).on('mousemove touchmove', function(e) {
                        k.css({
                            left: (l + ((e.originalEvent.pageX ? e.originalEvent.pageX : e.originalEvent.touches[0].pageX) - x)) + 'px',
                            top: (t + ((e.originalEvent.pageY ? e.originalEvent.pageY : e.originalEvent.touches[0].pageY) - y)) + 'px'
                        });
                        e.preventDefault()
                    }).on('mouseup touchend', function(e) {
                        $(document).off('mousemove touchmove')
                    });
                    e.preventDefault()
                })
            }

            function getPickerDims(o) {
                var a = [2 * o.pickerInset + 2 * o.pickerFace + jscolor.images.pad[0] + (o.slider ? 2 * o.pickerInset + 2 * jscolor.images.arrow[0] + jscolor.images.sld[0] : 0), o.pickerClosable ? 4 * o.pickerInset + 3 * o.pickerFace + jscolor.images.pad[1] + o.pickerButtonHeight : 2 * o.pickerInset + 2 * o.pickerFace + jscolor.images.pad[1]];
                return a
            }

            function redrawPad() {
                switch (z) {
                    case 0:
                        var a = 1;
                        break;
                    case 1:
                        var a = 2;
                        break
                }
                var x = Math.round((w.hsv[0] / 6) * (jscolor.images.pad[0] - 1));
                var y = Math.round((1 - w.hsv[a]) * (jscolor.images.pad[1] - 1));
                jscolor.picker.padM.style.backgroundPosition = (w.pickerFace + w.pickerInset + x - Math.floor(jscolor.images.cross[0] / 2)) + 'px ' + (w.pickerFace + w.pickerInset + y - Math.floor(jscolor.images.cross[1] / 2)) + 'px';
                var b = jscolor.picker.sld.childNodes;
                switch (z) {
                    case 0:
                        var d = HSV_RGB(w.hsv[0], w.hsv[1], 1);
                        for (var i = 0; i < b.length; i += 1) {
                            b[i].style.backgroundColor = 'rgb(' + (d[0] * (1 - i / b.length) * 100) + '%,' + (d[1] * (1 - i / b.length) * 100) + '%,' + (d[2] * (1 - i / b.length) * 100) + '%)'
                        }
                        break;
                    case 1:
                        var d, s, c = [w.hsv[2], 0, 0];
                        var i = Math.floor(w.hsv[0]);
                        var f = i % 2 ? w.hsv[0] - i : 1 - (w.hsv[0] - i);
                        switch (i) {
                            case 6:
                            case 0:
                                d = [0, 1, 2];
                                break;
                            case 1:
                                d = [1, 0, 2];
                                break;
                            case 2:
                                d = [2, 0, 1];
                                break;
                            case 3:
                                d = [2, 1, 0];
                                break;
                            case 4:
                                d = [1, 2, 0];
                                break;
                            case 5:
                                d = [0, 2, 1];
                                break
                        }
                        for (var i = 0; i < b.length; i += 1) {
                            s = 1 - 1 / (b.length - 1) * i;
                            c[1] = c[0] * (1 - s * f);
                            c[2] = c[0] * (1 - s);
                            b[i].style.backgroundColor = 'rgb(' + (c[d[0]] * 100) + '%,' + (c[d[1]] * 100) + '%,' + (c[d[2]] * 100) + '%)'
                        }
                        break
                }
            }

            function redrawSld() {
                switch (z) {
                    case 0:
                        var a = 2;
                        break;
                    case 1:
                        var a = 1;
                        break
                }
                var y = Math.round((1 - w.hsv[a]) * (jscolor.images.sld[1] - 1));
                jscolor.picker.sldM.style.backgroundPosition = '0 ' + (w.pickerFace + w.pickerInset + y - Math.floor(jscolor.images.arrow[1] / 2)) + 'px'
            }

            function redrawOpacity() {
                w.opacity = jscolor.HEX.O(B.value);
                jscolor.picker.sldO.style.backgroundPosition = '0 ' + (((1 - w.opacity) * 100) + 10) + 'px'
            }

            function isPickerOwner() {
                return jscolor.picker && jscolor.picker.owner === w
            }

            function blurTarget() {
                if (B === q) {
                    w.importColor()
                }
                if (B.value == '') {
                    B.style.background = 'none'
                }
                if (w.pickerOnfocus) {
                    w.hidePicker()
                }
            }

            function blurValue() {
                if (B !== q) {
                    w.importColor()
                }
            }

            function setPad(e) {
                var a = jscolor.getRelMousePos(e);
                var x = a.x - w.pickerFace - w.pickerInset;
                var y = a.y - w.pickerFace - w.pickerInset;
                switch (z) {
                    case 0:
                        w.fromHSV(x * (6 / (jscolor.images.pad[0] - 1)), 1 - y / (jscolor.images.pad[1] - 1), null, leaveSld);
                        break;
                    case 1:
                        w.fromHSV(x * (6 / (jscolor.images.pad[0] - 1)), null, 1 - y / (jscolor.images.pad[1] - 1), leaveSld);
                        break
                }
                var b = w.toString()
            }

            function setSld(e) {
                var a = jscolor.getRelMousePos(e);
                var y = a.y - w.pickerFace - w.pickerInset;
                switch (z) {
                    case 0:
                        w.fromHSV(null, null, 1 - y / (jscolor.images.sld[1] - 1), leavePad);
                        break;
                    case 1:
                        w.fromHSV(null, 1 - y / (jscolor.images.sld[1] - 1), null, leavePad);
                        break
                }
                y += 10;
                if (y < 10) y = 10;
                else if (y > 110) y = 110;
                jscolor.picker.sldM.style.backgroundPosition = '0 ' + y + 'px'
            }

            function setOpacity(e) {
                var a = jscolor.getRelMousePos(e);
                var y = (a.y - w.pickerFace - w.pickerInset) + 10;
                if (y < 10) y = 10;
                else if (y > 110) y = 110;
                jscolor.picker.sldO.style.backgroundPosition = '0 ' + y + 'px';
                y = 1 - ((y - 10) / 100);
                if (y !== 0 && y !== 1) y = y.toString() + '0000';
                w.opacity = y.toString().substr(0, 4).trim();
                w.exportColor()
            }

            function dispatchImmediateChange() {
                if (w.onImmediateChange) {
                    if (typeof w.onImmediateChange === 'string') {
                        eval(w.onImmediateChange)
                    } else {
                        w.onImmediateChange(w)
                    }
                }
            }

            function jscolor_blur() {
                return blurTarget();
            }
            var w = this;
            var z = this.pickerMode.toLowerCase() === 'hvs' ? 1 : 0;
            var A = false;
            var B = jscolor.fetchElement(this.valueElement),
                styleElement = jscolor.fetchElement(this.styleElement);
            var C = false,
                holdSld = false,
                holdSldO = false;
            var D = 1 << 0,
                leaveStyle = 1 << 1,
                leavePad = 1 << 2,
                leaveSld = 1 << 3;
            var E = $(window).width();
            if (E > 1024) {
                var F = function() {
                    var a = $('#lumise-color-picker-boxB');
                    if (w.pickerOnfocus) {
                        if (a.length === 0 || jscolor.picker.owner === null || jscolor.picker.owner === undefined) {
                            w.showPicker();
                            if (q.getAttribute('data-pos') && $(q.getAttribute('data-pos')).length > 0) {
                                var b = $(q.getAttribute('data-pos')).get(0).getBoundingClientRect();
                                $('#lumise-color-picker-boxB').css({
                                    left: b.left + 'px',
                                    top: (b.top + b.height + 40) + 'px'
                                })
                            }
                        } else {
                            var c = a.attr('style');
                            removePicker();
                            w.showPicker();
                            $('#lumise-color-picker-boxB').attr({
                                style: c
                            })
                        }
                    }
                };
                jscolor.addEvent(q, 'focus', F);
                jscolor.addEvent(q, 'mousedown', F)
            } else {
                q.setAttribute('readonly', true);
                jscolor.addEvent(q, 'mousedown', function(e) {
                    if (w.pickerOnfocus && !document.getElementsByClassName('lumise_color_picker')[0]) {
                        w.showPicker();
                        $('#lumise-top-tools [data-tool].active').removeClass('active')
                    }
                })
            };
            if (B) {
                var G = function() {
                    if (B.value.length < 6 && jscolor.name2Hex(B.value) === false) return;
                    w.fromString(B.value, D);
                    dispatchImmediateChange()
                };
                jscolor.addEvent(B, 'keyup', G);
                jscolor.addEvent(B, 'input', G);
                jscolor.addEvent(B, 'blur', blurValue);
                B.setAttribute('autocomplete', 'off')
            }
            if (styleElement) {
                styleElement.jscStyle = {
                    backgroundImage: styleElement.style.backgroundImage,
                    backgroundColor: styleElement.style.backgroundColor,
                    color: styleElement.style.color
                }
            }
            this.importColor()
        }
    };

    $.fn.shake = function() {
        return this.focus()
            .animate({ marginLeft: -30 }, 100)
            .animate({ marginLeft: 20 }, 100)
            .animate({ marginLeft: -10 }, 100)
            .animate({ marginLeft: 5 }, 100)
            .animate({ marginLeft: 0 }, 100);
    }

})(jQuery);
/*TimeAgo*/
eval(function(p, a, c, k, e, r) {
    e = function(c) { return (c < a ? '' : e(parseInt(c / a))) + ((c = c % a) > 35 ? String.fromCharCode(c + 29) : c.toString(36)) };
    if (!''.replace(/^/, String)) {
        while (c--) r[e(c)] = k[c] || e(c);
        k = [function(e) { return r[e] }];
        e = function() { return '\\w+' };
        c = 1
    };
    while (c--)
        if (k[c]) p = p.replace(new RegExp('\\b' + e(c) + '\\b', 'g'), k[c]);
    return p
}('D V(e,f){m g=D(a){m b=a.4("T")[0];m c=a.4("T")[1].18(0,8);m d=v o(o.16(b.4("-")[0],15(b.4("-")[1])-1,b.4("-")[2],c.4(":")[0],c.4(":")[1],c.4(":")[2]));i d};5($.14(e))e=13(e);k 5(12 e==\'11\'&&e.3().Z(\'T\')>-1)e=g(e.3())!=\'P o\'?g(e.3()):e;m h=v o(e),j=v o(),H=j.C(),B=r.E(r.17((H-h.C())/Q)),O=K,J=Y,A=L,M=N,G=j.x(),F=[\'R\',\'S\',\'U\',\'1a\',\'W\',\'X\',\'I\'],w=j.6(),p=h.s()<10?\'0\'+h.s().3():h.s(),q=h.y()<10?\'0\'+h.y().3():h.y(),u=h.6()<10?\'0\'+h.6().3():h.6(),t=h.l()<9?\'0\'+(h.l()+1):(h.l()+1);5(f)f=p.3()+\':\'+q.3()+\' \';k f=\'\';5(h.6()==w&&h.l()==j.l())i p.3()+\':\'+q.3();k 5(r.E(w-h.6())==1&&B<2*A)i p.3()+\':\'+q.3()+"\\n"+\' 19\';k 5(B<A*7&&h.z()<j.z())i f+F[h.z()];k 5(h.x()==G)i f+u.3()+\'/\'+t;k i f+u.3()+\'.\'+t.3()+\'.\'+(h.x().3())}', 62, 73, '|||toString|split|if|getDate||||||||||||return|today|else|getMonth|var||Date|t_hour|t_min|Math|getHours|t_month|t_date|new|date|getFullYear|getMinutes|getDay|aday|range|getTime|function|abs|day|year|now|Sat|ahour|60|86400|aweek|604800|amin|Invalid|1000|Sun|Mon||Tue|timeAgo|Wed|Fri|3600|indexOf||string|typeof|parseFloat|isNumeric|parseInt|UTC|round|substring|yestertay|Thu'.split('|'), 0, {}));
/*
QRCode for JavaScript
Copyright (c) 2009 Kazuhiko Arase
URL: http://www.d-project.com/
Licensed under the MIT license:
http://www.opensource.org/licenses/mit-license.php
*/
eval(function(p, a, c, k, e, r) {
    e = function(c) { return (c < a ? '' : e(parseInt(c / a))) + ((c = c % a) > 35 ? String.fromCharCode(c + 29) : c.toString(36)) };
    if (!''.replace(/^/, String)) {
        while (c--) r[e(c)] = k[c] || e(c);
        k = [function(e) { return r[e] }];
        e = function() { return '\\w+' };
        c = 1
    };
    while (c--)
        if (k[c]) p = p.replace(new RegExp('\\b' + e(c) + '\\b', 'g'), k[c]);
    return p
}('z 2u(a){t.1m=T.1G;t.2j=a}2u.1S={O:z(a){w t.2j.A},2x:z(a){u(s i=0;i<t.2j.A;i++){a.1b(t.2j.3T(i),8)}}};z X(a,b){t.1d=a;t.1I=b;t.C=1f;t.G=0;t.1K=1f;t.1N=B S()}X.1S={3Y:z(a){s b=B 2u(a);t.1N.2s(b);t.1K=1f},I:z(a,b){v(a<0||t.G<=a||b<0||t.G<=b){Y B W(a+","+b);}w t.C[a][b]},3w:z(){w t.G},3v:z(){v(t.1d<1){s a=1;u(a=1;a<40;a++){s b=U.2w(a,t.1I);s c=B 1T();s d=0;u(s i=0;i<b.A;i++){d+=b[i].2c}u(s i=0;i<t.1N.A;i++){s e=t.1N[i];c.1b(e.1m,4);c.1b(e.O(),E.V(e.1m,a));e.2x(c)}v(c.V()<=d*8)1V}t.1d=a}t.2E(1O,t.3f())},2E:z(a,b){t.G=t.1d*4+17;t.C=B S(t.G);u(s c=0;c<t.G;c++){t.C[c]=B S(t.G);u(s d=0;d<t.G;d++){t.C[c][d]=1f}}t.1Y(0,0);t.1Y(t.G-7,0);t.1Y(0,t.G-7);t.3d();t.3a();t.2Z(a,b);v(t.1d>=7){t.2Y(a)}v(t.1K==1f){t.1K=X.2X(t.1d,t.1I,t.1N)}t.2W(t.1K,b)},1Y:z(a,b){u(s r=-1;r<=7;r++){v(a+r<=-1||t.G<=a+r)1o;u(s c=-1;c<=7;c++){v(b+c<=-1||t.G<=b+c)1o;v((0<=r&&r<=6&&(c==0||c==6))||(0<=c&&c<=6&&(r==0||r==6))||(2<=r&&r<=4&&2<=c&&c<=4)){t.C[a+r][b+c]=1E}1h{t.C[a+r][b+c]=1O}}}},3f:z(){s a=0;s b=0;u(s i=0;i<8;i++){t.2E(1E,i);s c=E.2P(t);v(i==0||a>c){a=c;b=i}}w b},3V:z(a,b,c){s d=a.3K(b,c);s e=1;t.3v();u(s f=0;f<t.C.A;f++){s y=f*e;u(s g=0;g<t.C[f].A;g++){s x=g*e;s h=t.C[f][g];v(h){d.4y(0,2z);d.3O(x,y);d.2I(x+e,y);d.2I(x+e,y+e);d.2I(x,y+e);d.3U()}}}w d},3a:z(){u(s r=8;r<t.G-8;r++){v(t.C[r][6]!=1f){1o}t.C[r][6]=(r%2==0)}u(s c=8;c<t.G-8;c++){v(t.C[6][c]!=1f){1o}t.C[6][c]=(c%2==0)}},3d:z(){s a=E.3g(t.1d);u(s i=0;i<a.A;i++){u(s j=0;j<a.A;j++){s b=a[i];s d=a[j];v(t.C[b][d]!=1f){1o}u(s r=-2;r<=2;r++){u(s c=-2;c<=2;c++){v(r==-2||r==2||c==-2||c==2||(r==0&&c==0)){t.C[b+r][d+c]=1E}1h{t.C[b+r][d+c]=1O}}}}}},2Y:z(a){s b=E.3h(t.1d);u(s i=0;i<18;i++){s c=(!a&&((b>>i)&1)==1);t.C[1a.1A(i/3)][i%3+t.G-8-3]=c}u(s i=0;i<18;i++){s c=(!a&&((b>>i)&1)==1);t.C[i%3+t.G-8-3][1a.1A(i/3)]=c}},2Z:z(a,b){s c=(t.1I<<3)|b;s d=E.3j(c);u(s i=0;i<15;i++){s e=(!a&&((d>>i)&1)==1);v(i<6){t.C[i][8]=e}1h v(i<8){t.C[i+1][8]=e}1h{t.C[t.G-15+i][8]=e}}u(s i=0;i<15;i++){s e=(!a&&((d>>i)&1)==1);v(i<8){t.C[8][t.G-i-1]=e}1h v(i<9){t.C[8][15-i-1+1]=e}1h{t.C[8][15-i-1]=e}}t.C[t.G-8][8]=(!a)},2W:z(a,b){s d=-1;s e=t.G-1;s f=7;s g=0;u(s h=t.G-1;h>0;h-=2){v(h==6)h--;Z(1E){u(s c=0;c<2;c++){v(t.C[e][h-c]==1f){s i=1O;v(g<a.A){i=(((a[g]>>>f)&1)==1)}s j=E.3k(b,e,h-c);v(j){i=!i}t.C[e][h-c]=i;f--;v(f==-1){g++;f=7}}}e+=d;v(e<0||t.G<=e){e-=d;d=-d;1V}}}}};X.3l=4g;X.3m=4k;X.2X=z(a,b,c){s d=U.2w(a,b);s e=B 1T();u(s i=0;i<c.A;i++){s f=c[i];e.1b(f.1m,4);e.1b(f.O(),E.V(f.1m,a));f.2x(e)}s g=0;u(s i=0;i<d.A;i++){g+=d[i].2c}v(e.V()>g*8){Y B W("4E A 4w. ("+e.V()+">"+g*8+")");}v(e.V()+4<=g*8){e.1b(0,4)}Z(e.V()%8!=0){e.2H(1O)}Z(1E){v(e.V()>=g*8){1V}e.1b(X.3l,8);v(e.V()>=g*8){1V}e.1b(X.3m,8)}w X.3o(e,d)};X.3o=z(a,b){s c=0;s d=0;s e=0;s f=B S(b.A);s g=B S(b.A);u(s r=0;r<b.A;r++){s h=b[r].2c;s j=b[r].2C-h;d=1a.3u(d,h);e=1a.3u(e,j);f[r]=B S(h);u(s i=0;i<f[r].A;i++){f[r][i]=4i&a.1z[i+c]}c+=h;s k=E.3H(j);s l=B 1u(f[r],k.O()-1);s m=l.2F(k);g[r]=B S(k.O()-1);u(s i=0;i<g[r].A;i++){s n=i+m.O()-g[r].A;g[r][i]=(n>=0)?m.1i(n):0}}s o=0;u(s i=0;i<b.A;i++){o+=b[i].2C}s p=B S(o);s q=0;u(s i=0;i<d;i++){u(s r=0;r<b.A;r++){v(i<f[r].A){p[q++]=f[r][i]}}}u(s i=0;i<e;i++){u(s r=0;r<b.A;r++){v(i<g[r].A){p[q++]=g[r][i]}}}w p};s T={2q:1<<0,2o:1<<1,1G:1<<2,2m:1<<3};s 1F={L:1,M:0,Q:3,H:2};s 1j={3F:0,3E:1,3B:2,3A:3,3z:4,3x:5,3s:6,3r:7};s E={3p:[[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,R],[6,30,D],[6,32,1c],[6,34,1W],[6,26,46,3i],[6,26,48,1w],[6,26,R,N],[6,30,D,1B],[6,30,3e,2K],[6,30,1c,1q],[6,34,1W,2L],[6,28,R,3N,3L],[6,26,R,N,2b],[6,30,D,1B,1Q],[6,28,D,2d,2v],[6,32,1c,3c,2f],[6,30,1c,1q,1J],[6,34,1W,2L,1y],[6,26,R,N,2b,1l],[6,30,D,1B,1Q,3b],[6,26,3W,1B,4B,4x],[6,30,3e,2K,2k,2T],[6,34,2G,1q,2S,2R],[6,30,1c,1q,1J,2n],[6,34,1W,2L,1y,1p],[6,30,D,1B,1Q,3b,3n],[6,24,R,1n,1Q,4t,3X],[6,28,D,2d,2v,2O,4u],[6,32,1c,3c,2f,2M,3Z],[6,26,D,2K,2f,2R,4a],[6,30,1c,1q,1J,2n,4b]],2r:(1<<10)|(1<<8)|(1<<5)|(1<<4)|(1<<2)|(1<<1)|(1<<0),2p:(1<<12)|(1<<11)|(1<<10)|(1<<9)|(1<<8)|(1<<5)|(1<<2)|(1<<0),2Q:(1<<14)|(1<<12)|(1<<10)|(1<<4)|(1<<1),3j:z(a){s d=a<<10;Z(E.1k(d)-E.1k(E.2r)>=0){d^=(E.2r<<(E.1k(d)-E.1k(E.2r)))}w((a<<10)|d)^E.2Q},3h:z(a){s d=a<<12;Z(E.1k(d)-E.1k(E.2p)>=0){d^=(E.2p<<(E.1k(d)-E.1k(E.2p)))}w(a<<12)|d},1k:z(a){s b=0;Z(a!=0){b++;a>>>=1}w b},3g:z(a){w E.3p[a-1]},3k:z(a,i,j){1D(a){F 1j.3F:w(i+j)%2==0;F 1j.3E:w i%2==0;F 1j.3B:w j%3==0;F 1j.3A:w(i+j)%3==0;F 1j.3z:w(1a.1A(i/2)+1a.1A(j/3))%2==0;F 1j.3x:w(i*j)%2+(i*j)%3==0;F 1j.3s:w((i*j)%2+(i*j)%3)%2==0;F 1j.3r:w((i*j)%3+(i+j)%2)%2==0;1H:Y B W("2U 3P:"+a);}},3H:z(b){s a=B 1u([1],0);u(s i=0;i<b;i++){a=a.2V(B 1u([1,K.2h(i)],0))}w a},V:z(a,b){v(1<=b&&b<10){1D(a){F T.2q:w 10;F T.2o:w 9;F T.1G:w 8;F T.2m:w 8;1H:Y B W("1m:"+a);}}1h v(b<27){1D(a){F T.2q:w 12;F T.2o:w 11;F T.1G:w 16;F T.2m:w 10;1H:Y B W("1m:"+a);}}1h v(b<41){1D(a){F T.2q:w 14;F T.2o:w 13;F T.1G:w 16;F T.2m:w 12;1H:Y B W("1m:"+a);}}1h{Y B W("4e:"+b);}},2P:z(a){s b=a.3w();s d=0;u(s e=0;e<b;e++){u(s f=0;f<b;f++){s g=0;s h=a.I(e,f);u(s r=-1;r<=1;r++){v(e+r<0||b<=e+r){1o}u(s c=-1;c<=1;c++){v(f+c<0||b<=f+c){1o}v(r==0&&c==0){1o}v(h==a.I(e+r,f+c)){g++}}}v(g>5){d+=(3+g-5)}}}u(s e=0;e<b-1;e++){u(s f=0;f<b-1;f++){s i=0;v(a.I(e,f))i++;v(a.I(e+1,f))i++;v(a.I(e,f+1))i++;v(a.I(e+1,f+1))i++;v(i==0||i==4){d+=3}}}u(s e=0;e<b;e++){u(s f=0;f<b-6;f++){v(a.I(e,f)&&!a.I(e,f+1)&&a.I(e,f+2)&&a.I(e,f+3)&&a.I(e,f+4)&&!a.I(e,f+5)&&a.I(e,f+6)){d+=40}}}u(s f=0;f<b;f++){u(s e=0;e<b-6;e++){v(a.I(e,f)&&!a.I(e+1,f)&&a.I(e+2,f)&&a.I(e+3,f)&&a.I(e+4,f)&&!a.I(e+5,f)&&a.I(e+6,f)){d+=40}}}s j=0;u(s f=0;f<b;f++){u(s e=0;e<b;e++){v(a.I(e,f)){j++}}}s k=1a.4h(2z*j/b/b-R)/5;d+=k*10;w d}};s K={1r:z(n){v(n<1){Y B W("1r("+n+")");}w K.2B[n]},2h:z(n){Z(n<0){n+=2A}Z(n>=2e){n-=2A}w K.1g[n]},1g:B S(2e),2B:B S(2e)};u(s i=0;i<8;i++){K.1g[i]=1<<i}u(s i=8;i<2e;i++){K.1g[i]=K.1g[i-4]^K.1g[i-5]^K.1g[i-6]^K.1g[i-8]}u(s i=0;i<2A;i++){K.2B[K.1g[i]]=i}z 1u(a,b){v(a.A==2t){Y B W(a.A+"/"+b);}s c=0;Z(c<a.A&&a[c]==0){c++}t.2a=B S(a.A-c+b);u(s i=0;i<a.A-c;i++){t.2a[i]=a[i+c]}}1u.1S={1i:z(a){w t.2a[a]},O:z(){w t.2a.A},2V:z(e){s a=B S(t.O()+e.O()-1);u(s i=0;i<t.O();i++){u(s j=0;j<e.O();j++){a[i+j]^=K.2h(K.1r(t.1i(i))+K.1r(e.1i(j)))}}w B 1u(a,0)},2F:z(e){v(t.O()-e.O()<0){w t}s a=K.1r(t.1i(0))-K.1r(e.1i(0));s b=B S(t.O());u(s i=0;i<t.O();i++){b[i]=t.1i(i)}u(s i=0;i<e.O();i++){b[i]^=K.2h(K.1r(e.1i(i))+a)}w B 1u(b,0).2F(e)}};z U(a,b){t.2C=a;t.2c=b}U.1M=[[1,26,19],[1,26,16],[1,26,13],[1,26,9],[1,44,34],[1,44,28],[1,44,22],[1,44,16],[1,1w,J],[1,1w,44],[2,35,17],[2,35,13],[1,2z,2d],[2,R,32],[2,R,24],[4,25,9],[1,2T,2k],[2,2D,43],[2,33,15,2,34,16],[2,33,11,2,34,12],[2,1q,1U],[4,43,27],[4,43,19],[4,43,15],[2,2b,1B],[4,49,31],[2,32,14,4,33,15],[4,39,13,1,40,14],[2,1P,4s],[2,2G,38,2,2N,39],[4,40,18,2,41,19],[4,40,14,2,41,15],[2,1p,1e],[3,1c,36,2,1R,37],[4,36,16,4,37,17],[4,36,12,4,37,13],[2,1q,1U,2,3q,2y],[4,2y,43,1,1w,44],[6,43,19,2,44,20],[6,43,15,2,44,16],[4,3M,3t],[1,2d,R,4,3t,1x],[4,R,22,4,1x,23],[3,36,12,8,37,13],[2,1e,3Q,2,1C,3S],[6,1c,36,2,1R,37],[4,46,20,6,47,21],[7,42,14,4,43,15],[4,3y,1X],[8,1R,37,1,2G,38],[8,44,20,4,45,21],[12,33,11,4,34,12],[3,1s,1t,1,1p,1e],[4,3C,40,5,3D,41],[11,36,16,5,37,17],[11,36,12,5,37,13],[5,4c,3q,1,2f,4d],[5,3D,41,5,3i,42],[5,D,24,7,J,25],[11,36,12],[5,1l,2b,1,1Z,4f],[7,1L,45,3,N,46],[15,43,19,2,44,20],[3,45,15,13,46,16],[1,3G,1X,5,2M,2k],[10,N,46,1,P,47],[1,R,22,15,1x,23],[2,42,14,17,43,15],[5,3n,4j,1,2g,1P],[9,2y,43,4,1w,44],[17,R,22,1,1x,23],[2,42,14,19,43,15],[3,4l,4m,4,2n,1J],[3,1w,44,11,4n,45],[17,47,21,4,48,22],[9,39,13,16,40,14],[3,3G,1X,5,2M,2k],[3,2D,41,13,1U,42],[15,D,24,5,J,25],[15,43,15,10,44,16],[4,4o,1e,4,1s,1C],[17,1U,42],[17,R,22,6,1x,23],[19,46,16,6,47,17],[2,4p,4q,7,4r,2S],[17,N,46],[7,D,24,16,J,25],[34,37,13],[4,2g,1P,5,1v,1l],[4,P,47,14,1n,48],[11,D,24,14,J,25],[16,45,15,14,46,16],[6,2i,1C,4,2l,1y],[6,1L,45,14,N,46],[11,D,24,16,J,25],[30,46,16,2,47,17],[8,2O,2v,4,3y,1X],[8,P,47,13,1n,48],[7,D,24,22,J,25],[22,45,15,13,46,16],[10,2n,1J,2,4v,1t],[19,N,46,4,P,47],[28,R,22,6,1x,23],[33,46,16,4,47,17],[8,1v,1l,4,2J,1Z],[22,1L,45,3,N,46],[8,3I,23,26,D,24],[12,45,15,28,46,16],[3,2i,1C,10,2l,1y],[3,1L,45,23,N,46],[4,D,24,31,J,25],[11,45,15,31,46,16],[7,1p,1e,7,2i,1C],[21,1L,45,7,N,46],[1,3I,23,37,D,24],[19,45,15,26,46,16],[5,1s,1t,10,1p,1e],[19,P,47,10,1n,48],[15,D,24,25,J,25],[23,45,15,25,46,16],[13,1s,1t,3,1p,1e],[2,N,46,29,P,47],[42,D,24,1,J,25],[23,45,15,28,46,16],[17,1s,1t],[10,N,46,23,P,47],[10,D,24,35,J,25],[19,45,15,35,46,16],[17,1s,1t,1,1p,1e],[14,N,46,21,P,47],[29,D,24,19,J,25],[11,45,15,46,46,16],[13,1s,1t,6,1p,1e],[14,N,46,23,P,47],[44,D,24,7,J,25],[1R,46,16,1,47,17],[12,2g,1P,7,1v,1l],[12,P,47,26,1n,48],[39,D,24,14,J,25],[22,45,15,41,46,16],[6,2g,1P,14,1v,1l],[6,P,47,34,1n,48],[46,D,24,10,J,25],[2,45,15,3C,46,16],[17,1v,1l,4,2J,1Z],[29,N,46,14,P,47],[49,D,24,10,J,25],[24,45,15,46,46,16],[4,1v,1l,18,2J,1Z],[13,N,46,32,P,47],[48,D,24,14,J,25],[42,45,15,32,46,16],[20,2i,1C,4,2l,1y],[40,P,47,7,1n,48],[43,D,24,22,J,25],[10,45,15,2D,46,16],[19,2l,1y,6,4z,4A],[18,P,47,31,1n,48],[34,D,24,34,J,25],[20,45,15,2N,46,16]];U.2w=z(a,b){s c=U.3J(a,b);v(c==2t){Y B W("2U 4C 4D @ 1d:"+a+"/1I:"+b);}s d=c.A/3;s e=B S();u(s i=0;i<d;i++){s f=c[i*3+0];s g=c[i*3+1];s h=c[i*3+2];u(s j=0;j<f;j++){e.2s(B U(g,h))}}w e};U.3J=z(a,b){1D(b){F 1F.L:w U.1M[(a-1)*4+0];F 1F.M:w U.1M[(a-1)*4+1];F 1F.Q:w U.1M[(a-1)*4+2];F 1F.H:w U.1M[(a-1)*4+3];1H:w 2t}};z 1T(){t.1z=B S();t.A=0}1T.1S={1i:z(a){s b=1a.1A(a/8);w((t.1z[b]>>>(7-a%8))&1)==1},1b:z(a,b){u(s i=0;i<b;i++){t.2H(((a>>>(b-i-1))&1)==1)}},V:z(){w t.A},2H:z(a){s b=1a.1A(t.A/8);v(t.1z.A<=b){t.1z.2s(0)}v(a){t.1z[b]|=(3R>>>(t.A%8))}t.A++}};', 62, 289, '||||||||||||||||||||||||||||var|this|for|if|return|||function|length|new|modules|54|QRUtil|case|moduleCount||isDark|55|QRMath|||74|getLength|75||50|Array|QRMode|QRRSBlock|getLengthInBits|Error|QRCode|throw|while|||||||||||Math|put|58|typeNumber|116|null|EXP_TABLE|else|get|QRMaskPattern|getBCHDigit|122|mode|76|continue|146|86|glog|145|115|QRPolynomial|152|70|51|118|buffer|floor|78|117|switch|true|QRErrorCorrectLevel|MODE_8BIT_BYTE|default|errorCorrectLevel|114|dataCache|73|RS_BLOCK_TABLE|dataList|false|121|102|59|prototype|QRBitBuffer|68|break|62|107|setupPositionProbePattern|123|||||||||||num|98|dataCount|80|256|110|151|gexp|147|data|108|148|MODE_KANJI|142|MODE_ALPHA_NUM|G18|MODE_NUMBER|G15|push|undefined|QR8bitByte|106|getRSBlocks|write|69|100|255|LOG_TABLE|totalCount|67|makeImpl|mod|60|putBit|lineTo|153|82|90|136|61|132|getLostPoint|G15_MASK|138|112|134|bad|multiply|mapData|createData|setupTypeNumber|setupTypeInfo|||||||||||setupTimingPattern|126|84|setupPositionAdjustPattern|56|getBestMaskPattern|getPatternPosition|getBCHTypeNumber|66|getBCHTypeInfo|getMask|PAD0|PAD1|150|createBytes|PATTERN_POSITION_TABLE|87|PATTERN111|PATTERN110|81|max|make|getModuleCount|PATTERN101|133|PATTERN100|PATTERN011|PATTERN010|64|65|PATTERN001|PATTERN000|135|getErrorCorrectPolynomial|53|getRsBlockTable|createEmptyMovieClip|94|101|72|moveTo|maskPattern|92|0x80|93|charCodeAt|endFill|createMovieClip|52|154|addData|162|||||||||||166|170|109|88|type|99|0xEC|abs|0xff|120|0x11|141|113|71|144|139|111|140|97|128|158|143|overflow|130|beginFill|149|119|104|rs|block|code'.split('|'), 0, {}));
/*
 * Copyright 2016 Small Batch, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */
/* Web Font Loader v1.6.26 - (c) Adobe Systems, Google. License: Apache 2.0 */
(function() {
    function aa(a, b, c) { return a.call.apply(a.bind, arguments) }

    function ba(a, b, c) {
        if (!a) throw Error();
        if (2 < arguments.length) {
            var d = Array.prototype.slice.call(arguments, 2);
            return function() {
                var c = Array.prototype.slice.call(arguments);
                Array.prototype.unshift.apply(c, d);
                return a.apply(b, c)
            }
        }
        return function() { return a.apply(b, arguments) }
    }

    function p(a, b, c) { p = Function.prototype.bind && -1 != Function.prototype.bind.toString().indexOf("native code") ? aa : ba; return p.apply(null, arguments) }
    var q = Date.now || function() { return +new Date };

    function ca(a, b) {
        this.a = a;
        this.m = b || a;
        this.c = this.m.document
    }
    var da = !!window.FontFace;

    function t(a, b, c, d) {
        b = a.c.createElement(b);
        if (c)
            for (var e in c) c.hasOwnProperty(e) && ("style" == e ? b.style.cssText = c[e] : b.setAttribute(e, c[e]));
        d && b.appendChild(a.c.createTextNode(d));
        return b
    }

    function u(a, b, c) {
        a = a.c.getElementsByTagName(b)[0];
        a || (a = document.documentElement);
        a.insertBefore(c, a.lastChild)
    }

    function v(a) { a.parentNode && a.parentNode.removeChild(a) }

    function w(a, b, c) {
        b = b || [];
        c = c || [];
        for (var d = a.className.split(/\s+/), e = 0; e < b.length; e += 1) {
            for (var f = !1, g = 0; g < d.length; g += 1)
                if (b[e] === d[g]) { f = !0; break }
            f || d.push(b[e])
        }
        b = [];
        for (e = 0; e < d.length; e += 1) {
            f = !1;
            for (g = 0; g < c.length; g += 1)
                if (d[e] === c[g]) { f = !0; break }
            f || b.push(d[e])
        }
        a.className = b.join(" ").replace(/\s+/g, " ").replace(/^\s+|\s+$/, "")
    }

    function y(a, b) {
        for (var c = a.className.split(/\s+/), d = 0, e = c.length; d < e; d++)
            if (c[d] == b) return !0;
        return !1
    }

    function z(a) { if ("string" === typeof a.f) return a.f; var b = a.m.location.protocol; "about:" == b && (b = a.a.location.protocol); return "https:" == b ? "https:" : "http:" }

    function ea(a) { return a.m.location.hostname || a.a.location.hostname }

    function A(a, b, c) {
        function d() { k && e && f && (k(g), k = null) }
        b = t(a, "link", { rel: "stylesheet", href: b, media: "all" });
        var e = !1,
            f = !0,
            g = null,
            k = c || null;
        da ? (b.onload = function() {
            e = !0;
            d()
        }, b.onerror = function() {
            e = !0;
            g = Error("Stylesheet failed to load");
            d()
        }) : setTimeout(function() {
            e = !0;
            d()
        }, 0);
        u(a, "head", b)
    }

    function B(a, b, c, d) {
        var e = a.c.getElementsByTagName("head")[0];
        if (e) {
            var f = t(a, "script", { src: b }),
                g = !1;
            f.onload = f.onreadystatechange = function() { g || this.readyState && "loaded" != this.readyState && "complete" != this.readyState || (g = !0, c && c(null), f.onload = f.onreadystatechange = null, "HEAD" == f.parentNode.tagName && e.removeChild(f)) };
            e.appendChild(f);
            setTimeout(function() { g || (g = !0, c && c(Error("Script load timeout"))) }, d || 5E3);
            return f
        }
        return null
    };

    function C() {
        this.a = 0;
        this.c = null
    }

    function D(a) {
        a.a++;
        return function() {
            a.a--;
            E(a)
        }
    }

    function F(a, b) {
        a.c = b;
        E(a)
    }

    function E(a) { 0 == a.a && a.c && (a.c(), a.c = null) };

    function G(a) { this.a = a || "-" }
    G.prototype.c = function(a) { for (var b = [], c = 0; c < arguments.length; c++) b.push(arguments[c].replace(/[\W_]+/g, "").toLowerCase()); return b.join(this.a) };

    function H(a, b) {
        this.c = a;
        this.f = 4;
        this.a = "n";
        var c = (b || "n4").match(/^([nio])([1-9])$/i);
        c && (this.a = c[1], this.f = parseInt(c[2], 10))
    }

    function fa(a) { return I(a) + " " + (a.f + "00") + " 300px " + J(a.c) }

    function J(a) {
        var b = [];
        a = a.split(/,\s*/);
        for (var c = 0; c < a.length; c++) { var d = a[c].replace(/['"]/g, ""); - 1 != d.indexOf(" ") || /^\d/.test(d) ? b.push("'" + d + "'") : b.push(d) }
        return b.join(",")
    }

    function K(a) { return a.a + a.f }

    function I(a) { var b = "normal"; "o" === a.a ? b = "oblique" : "i" === a.a && (b = "italic"); return b }

    function ga(a) {
        var b = 4,
            c = "n",
            d = null;
        a && ((d = a.match(/(normal|oblique|italic)/i)) && d[1] && (c = d[1].substr(0, 1).toLowerCase()), (d = a.match(/([1-9]00|normal|bold)/i)) && d[1] && (/bold/i.test(d[1]) ? b = 7 : /[1-9]00/.test(d[1]) && (b = parseInt(d[1].substr(0, 1), 10))));
        return c + b
    };

    function ha(a, b) {
        this.c = a;
        this.f = a.m.document.documentElement;
        this.h = b;
        this.a = new G("-");
        this.j = !1 !== b.events;
        this.g = !1 !== b.classes
    }

    function ia(a) {
        a.g && w(a.f, [a.a.c("wf", "loading")]);
        L(a, "loading")
    }

    function M(a) {
        if (a.g) {
            var b = y(a.f, a.a.c("wf", "active")),
                c = [],
                d = [a.a.c("wf", "loading")];
            b || c.push(a.a.c("wf", "inactive"));
            w(a.f, c, d)
        }
        L(a, "inactive")
    }

    function L(a, b, c) {
        if (a.j && a.h[b])
            if (c) a.h[b](c.c, K(c));
            else a.h[b]()
    };

    function ja() { this.c = {} }

    function ka(a, b, c) {
        var d = [],
            e;
        for (e in b)
            if (b.hasOwnProperty(e)) {
                var f = a.c[e];
                f && d.push(f(b[e], c))
            }
        return d
    };

    function N(a, b) {
        this.c = a;
        this.f = b;
        this.a = t(this.c, "span", { "aria-hidden": "true" }, this.f)
    }

    function O(a) { u(a.c, "body", a.a) }

    function P(a) { return "display:block;position:absolute;top:-9999px;left:-9999px;font-size:300px;width:auto;height:auto;line-height:normal;margin:0;padding:0;font-variant:normal;white-space:nowrap;font-family:" + J(a.c) + ";" + ("font-style:" + I(a) + ";font-weight:" + (a.f + "00") + ";") };

    function Q(a, b, c, d, e, f) {
        this.g = a;
        this.j = b;
        this.a = d;
        this.c = c;
        this.f = e || 3E3;
        this.h = f || void 0
    }
    Q.prototype.start = function() {
        var a = this.c.m.document,
            b = this,
            c = q(),
            d = new Promise(function(d, e) {
                function k() { q() - c >= b.f ? e() : a.fonts.load(fa(b.a), b.h).then(function(a) { 1 <= a.length ? d() : setTimeout(k, 25) }, function() { e() }) }
                k()
            }),
            e = new Promise(function(a, d) { setTimeout(d, b.f) });
        Promise.race([e, d]).then(function() { b.g(b.a) }, function() { b.j(b.a) })
    };

    function R(a, b, c, d, e, f, g) {
        this.v = a;
        this.B = b;
        this.c = c;
        this.a = d;
        this.s = g || "BESbswy";
        this.f = {};
        this.w = e || 3E3;
        this.u = f || null;
        this.o = this.j = this.h = this.g = null;
        this.g = new N(this.c, this.s);
        this.h = new N(this.c, this.s);
        this.j = new N(this.c, this.s);
        this.o = new N(this.c, this.s);
        a = new H(this.a.c + ",serif", K(this.a));
        a = P(a);
        this.g.a.style.cssText = a;
        a = new H(this.a.c + ",sans-serif", K(this.a));
        a = P(a);
        this.h.a.style.cssText = a;
        a = new H("serif", K(this.a));
        a = P(a);
        this.j.a.style.cssText = a;
        a = new H("sans-serif", K(this.a));
        a =
            P(a);
        this.o.a.style.cssText = a;
        O(this.g);
        O(this.h);
        O(this.j);
        O(this.o)
    }
    var S = { D: "serif", C: "sans-serif" },
        T = null;

    function U() {
        if (null === T) {
            var a = /AppleWebKit\/([0-9]+)(?:\.([0-9]+))/.exec(window.navigator.userAgent);
            T = !!a && (536 > parseInt(a[1], 10) || 536 === parseInt(a[1], 10) && 11 >= parseInt(a[2], 10))
        }
        return T
    }
    R.prototype.start = function() {
        this.f.serif = this.j.a.offsetWidth;
        this.f["sans-serif"] = this.o.a.offsetWidth;
        this.A = q();
        la(this)
    };

    function ma(a, b, c) {
        for (var d in S)
            if (S.hasOwnProperty(d) && b === a.f[S[d]] && c === a.f[S[d]]) return !0;
        return !1
    }

    function la(a) {
        var b = a.g.a.offsetWidth,
            c = a.h.a.offsetWidth,
            d;
        (d = b === a.f.serif && c === a.f["sans-serif"]) || (d = U() && ma(a, b, c));
        d ? q() - a.A >= a.w ? U() && ma(a, b, c) && (null === a.u || a.u.hasOwnProperty(a.a.c)) ? V(a, a.v) : V(a, a.B) : na(a) : V(a, a.v)
    }

    function na(a) { setTimeout(p(function() { la(this) }, a), 50) }

    function V(a, b) {
        setTimeout(p(function() {
            v(this.g.a);
            v(this.h.a);
            v(this.j.a);
            v(this.o.a);
            b(this.a)
        }, a), 0)
    };

    function W(a, b, c) {
        this.c = a;
        this.a = b;
        this.f = 0;
        this.o = this.j = !1;
        this.s = c
    }
    var X = null;
    W.prototype.g = function(a) {
        var b = this.a;
        b.g && w(b.f, [b.a.c("wf", a.c, K(a).toString(), "active")], [b.a.c("wf", a.c, K(a).toString(), "loading"), b.a.c("wf", a.c, K(a).toString(), "inactive")]);
        L(b, "fontactive", a);
        this.o = !0;
        oa(this)
    };
    W.prototype.h = function(a) {
        var b = this.a;
        if (b.g) {
            var c = y(b.f, b.a.c("wf", a.c, K(a).toString(), "active")),
                d = [],
                e = [b.a.c("wf", a.c, K(a).toString(), "loading")];
            c || d.push(b.a.c("wf", a.c, K(a).toString(), "inactive"));
            w(b.f, d, e)
        }
        L(b, "fontinactive", a);
        oa(this)
    };

    function oa(a) { 0 == --a.f && a.j && (a.o ? (a = a.a, a.g && w(a.f, [a.a.c("wf", "active")], [a.a.c("wf", "loading"), a.a.c("wf", "inactive")]), L(a, "active")) : M(a.a)) };

    function pa(a) {
        this.j = a;
        this.a = new ja;
        this.h = 0;
        this.f = this.g = !0
    }
    pa.prototype.load = function(a) {
        this.c = new ca(this.j, a.context || this.j);
        this.g = !1 !== a.events;
        this.f = !1 !== a.classes;
        qa(this, new ha(this.c, a), a)
    };

    function ra(a, b, c, d, e) {
        var f = 0 == --a.h;
        (a.f || a.g) && setTimeout(function() {
            var a = e || null,
                k = d || null || {};
            if (0 === c.length && f) M(b.a);
            else {
                b.f += c.length;
                f && (b.j = f);
                var h, m = [];
                for (h = 0; h < c.length; h++) {
                    var l = c[h],
                        n = k[l.c],
                        r = b.a,
                        x = l;
                    r.g && w(r.f, [r.a.c("wf", x.c, K(x).toString(), "loading")]);
                    L(r, "fontloading", x);
                    r = null;
                    null === X && (X = window.FontFace ? (x = /Gecko.*Firefox\/(\d+)/.exec(window.navigator.userAgent)) ? 42 < parseInt(x[1], 10) : !0 : !1);
                    X ? r = new Q(p(b.g, b), p(b.h, b), b.c, l, b.s, n) : r = new R(p(b.g, b), p(b.h, b), b.c, l, b.s, a,
                        n);
                    m.push(r)
                }
                for (h = 0; h < m.length; h++) m[h].start()
            }
        }, 0)
    }

    function qa(a, b, c) {
        var d = [],
            e = c.timeout;
        ia(b);
        var d = ka(a.a, c, a.c),
            f = new W(a.c, b, e);
        a.h = d.length;
        b = 0;
        for (c = d.length; b < c; b++) d[b].load(function(b, d, c) { ra(a, f, b, d, c) })
    };

    function sa(a, b) {
        this.c = a;
        this.a = b
    }

    function ta(a, b, c) {
        var d = z(a.c);
        a = (a.a.api || "fast.fonts.net/jsapi").replace(/^.*http(s?):(\/\/)?/, "");
        return d + "//" + a + "/" + b + ".js" + (c ? "?v=" + c : "")
    }
    sa.prototype.load = function(a) {
        function b() {
            if (f["__mti_fntLst" + d]) {
                var c = f["__mti_fntLst" + d](),
                    e = [],
                    h;
                if (c)
                    for (var m = 0; m < c.length; m++) {
                        var l = c[m].fontfamily;
                        void 0 != c[m].fontStyle && void 0 != c[m].fontWeight ? (h = c[m].fontStyle + c[m].fontWeight, e.push(new H(l, h))) : e.push(new H(l))
                    }
                a(e)
            } else setTimeout(function() { b() }, 50)
        }
        var c = this,
            d = c.a.projectId,
            e = c.a.version;
        if (d) {
            var f = c.c.m;
            B(this.c, ta(c, d, e), function(e) { e ? a([]) : (f["__MonotypeConfiguration__" + d] = function() { return c.a }, b()) }).id = "__MonotypeAPIScript__" +
                d
        } else a([])
    };

    function ua(a, b) {
        this.c = a;
        this.a = b
    }
    ua.prototype.load = function(a) {
        var b, c, d = this.a.urls || [],
            e = this.a.families || [],
            f = this.a.testStrings || {},
            g = new C;
        b = 0;
        for (c = d.length; b < c; b++) A(this.c, d[b], D(g));
        var k = [];
        b = 0;
        for (c = e.length; b < c; b++)
            if (d = e[b].split(":"), d[1])
                for (var h = d[1].split(","), m = 0; m < h.length; m += 1) k.push(new H(d[0], h[m]));
            else k.push(new H(d[0]));
        F(g, function() { a(k, f) })
    };

    function va(a, b, c) {
        a ? this.c = a : this.c = b + wa;
        this.a = [];
        this.f = [];
        this.g = c || ""
    }
    var wa = "//fonts.googleapis.com/css";

    function xa(a, b) {
        for (var c = b.length, d = 0; d < c; d++) {
            var e = b[d].split(":");
            3 == e.length && a.f.push(e.pop());
            var f = "";
            2 == e.length && "" != e[1] && (f = ":");
            a.a.push(e.join(f))
        }
    }

    function ya(a) {
        if (0 == a.a.length) throw Error("No fonts to load!");
        if (-1 != a.c.indexOf("kit=")) return a.c;
        for (var b = a.a.length, c = [], d = 0; d < b; d++) c.push(a.a[d].replace(/ /g, "+"));
        b = a.c + "?family=" + c.join("%7C");
        0 < a.f.length && (b += "&subset=" + a.f.join(","));
        0 < a.g.length && (b += "&text=" + encodeURIComponent(a.g));
        return b
    };

    function za(a) {
        this.f = a;
        this.a = [];
        this.c = {}
    }
    var Aa = { latin: "BESbswy", "latin-ext": "\u00e7\u00f6\u00fc\u011f\u015f", cyrillic: "\u0439\u044f\u0416", greek: "\u03b1\u03b2\u03a3", khmer: "\u1780\u1781\u1782", Hanuman: "\u1780\u1781\u1782" },
        Ba = { thin: "1", extralight: "2", "extra-light": "2", ultralight: "2", "ultra-light": "2", light: "3", regular: "4", book: "4", medium: "5", "semi-bold": "6", semibold: "6", "demi-bold": "6", demibold: "6", bold: "7", "extra-bold": "8", extrabold: "8", "ultra-bold": "8", ultrabold: "8", black: "9", heavy: "9", l: "3", r: "4", b: "7" },
        Ca = { i: "i", italic: "i", n: "n", normal: "n" },
        Da = /^(thin|(?:(?:extra|ultra)-?)?light|regular|book|medium|(?:(?:semi|demi|extra|ultra)-?)?bold|black|heavy|l|r|b|[1-9]00)?(n|i|normal|italic)?$/;

    function Ea(a) {
        for (var b = a.f.length, c = 0; c < b; c++) {
            var d = a.f[c].split(":"),
                e = d[0].replace(/\+/g, " "),
                f = ["n4"];
            if (2 <= d.length) {
                var g;
                var k = d[1];
                g = [];
                if (k)
                    for (var k = k.split(","), h = k.length, m = 0; m < h; m++) {
                        var l;
                        l = k[m];
                        if (l.match(/^[\w-]+$/)) {
                            var n = Da.exec(l.toLowerCase());
                            if (null == n) l = "";
                            else {
                                l = n[2];
                                l = null == l || "" == l ? "n" : Ca[l];
                                n = n[1];
                                if (null == n || "" == n) n = "4";
                                else var r = Ba[n],
                                    n = r ? r : isNaN(n) ? "4" : n.substr(0, 1);
                                l = [l, n].join("")
                            }
                        } else l = "";
                        l && g.push(l)
                    }
                0 < g.length && (f = g);
                3 == d.length && (d = d[2], g = [], d = d ? d.split(",") :
                    g, 0 < d.length && (d = Aa[d[0]]) && (a.c[e] = d))
            }
            a.c[e] || (d = Aa[e]) && (a.c[e] = d);
            for (d = 0; d < f.length; d += 1) a.a.push(new H(e, f[d]))
        }
    };

    function Fa(a, b) {
        this.c = a;
        this.a = b
    }
    var Ga = { Arimo: !0, Cousine: !0, Tinos: !0 };
    Fa.prototype.load = function(a) {
        var b = new C,
            c = this.c,
            d = new va(this.a.api, z(c), this.a.text),
            e = this.a.families;
        xa(d, e);
        var f = new za(e);
        Ea(f);
        A(c, ya(d), D(b));
        F(b, function() { a(f.a, f.c, Ga) })
    };

    function Ha(a, b) {
        this.c = a;
        this.a = b
    }
    Ha.prototype.load = function(a) {
        var b = this.a.id,
            c = this.c.m;
        b ? B(this.c, (this.a.api || "https://use.typekit.net") + "/" + b + ".js", function(b) {
            if (b) a([]);
            else if (c.Typekit && c.Typekit.config && c.Typekit.config.fn) {
                b = c.Typekit.config.fn;
                for (var e = [], f = 0; f < b.length; f += 2)
                    for (var g = b[f], k = b[f + 1], h = 0; h < k.length; h++) e.push(new H(g, k[h]));
                try { c.Typekit.load({ events: !1, classes: !1, async: !0 }) } catch (m) {}
                a(e)
            }
        }, 2E3) : a([])
    };

    function Ia(a, b) {
        this.c = a;
        this.f = b;
        this.a = []
    }
    Ia.prototype.load = function(a) {
        var b = this.f.id,
            c = this.c.m,
            d = this;
        b ? (c.__webfontfontdeckmodule__ || (c.__webfontfontdeckmodule__ = {}), c.__webfontfontdeckmodule__[b] = function(b, c) {
            for (var g = 0, k = c.fonts.length; g < k; ++g) {
                var h = c.fonts[g];
                d.a.push(new H(h.name, ga("font-weight:" + h.weight + ";font-style:" + h.style)))
            }
            a(d.a)
        }, B(this.c, z(this.c) + (this.f.api || "//f.fontdeck.com/s/css/js/") + ea(this.c) + "/" + b + ".js", function(b) { b && a([]) })) : a([])
    };
    var Y = new pa(window);
    Y.a.c.custom = function(a, b) { return new ua(b, a) };
    Y.a.c.fontdeck = function(a, b) { return new Ia(b, a) };
    Y.a.c.monotype = function(a, b) { return new sa(b, a) };
    Y.a.c.typekit = function(a, b) { return new Ha(b, a) };
    Y.a.c.google = function(a, b) { return new Fa(b, a) };
    var Z = { load: p(Y.load, Y) };
    "function" === typeof define && define.amd ? define(function() { return Z }) : "undefined" !== typeof module && module.exports ? module.exports = Z : (window.WebFont = Z, window.WebFontConfig && Y.load(window.WebFontConfig));
}());
/*
	
imagetracer.js version 1.2.3
Simple raster image tracer and vectorizer written in JavaScript.
by András Jankovics
andras@jankovics.net

The Unlicense / PUBLIC DOMAIN

This is free and unencumbered software released into the public domain.

Anyone is free to copy, modify, publish, use, compile, sell, or
distribute this software, either in source code form or as a compiled
binary, for any purpose, commercial or non-commercial, and by any
means.

In jurisdictions that recognize copyright laws, the author or authors
of this software dedicate any and all copyright interest in the
software to the public domain. We make this dedication for the benefit
of the public at large and to the detriment of our heirs and
successors. We intend this dedication to be an overt act of
relinquishment in perpetuity of all present and future rights to this
software under copyright law.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

For more information, please refer to http://unlicense.org/
	
*/
eval(function(p, a, c, k, e, r) {
    e = function(c) { return (c < a ? '' : e(parseInt(c / a))) + ((c = c % a) > 35 ? String.fromCharCode(c + 29) : c.toString(36)) };
    if (!''.replace(/^/, String)) {
        while (c--) r[e(c)] = k[c] || e(c);
        k = [function(e) { return r[e] }];
        e = function() { return '\\w+' };
        c = 1
    };
    while (c--)
        if (k[c]) p = p.replace(new RegExp('\\b' + e(c) + '\\b', 'g'), k[c]);
    return p
}('(H(){\'4g 4X\';H 1F(){v m=I;I.3c=\'1.2.3\',I.4V=H(b,c,d){d=m.1P(d);m.2R(b,H(a){c(m.36(m.2P(a),d))},d)},I.36=H(a,b){b=m.1P(b);v c=m.2M(a,b);O m.3u(c,b)},I.4U=H(b,c,d){d=m.1P(d);m.2R(b,H(a){c(m.2M(m.2P(a),d))},d)},I.2M=H(a,b){b=m.1P(b);v c=m.3A(a,b);v d=m.3I(c);q(b.3L){m.3N(d,m.3P,b.z,b.3L)}v e=m.3o(d,b.1W);v f=m.3t(e,b);v g=m.3x(f,b.1x,b.1p);v h={\'2j\':g,\'P\':c.P,\'J\':a.J,\'12\':a.12};O h},I.2O={\'4S\':4P,\'4O\':{1a:0,17:2},\'4N\':{17:4,1t:5},\'4K\':{1x:0.2w,1J:1w,2c:1j},\'4J\':{1p:0.2w,1J:1j},\'4I\':{1W:0,1l:2,1x:0.5,1p:0.5,17:1y},\'4B\':{1t:5,1G:1y},\'4A\':{1a:0,1B:1,17:7},\'4z\':{1a:0,1B:1,17:27},\'4y\':{1a:1,17:8},\'4x\':{1a:1,17:1y},\'4v\':{1a:0,1B:1,1W:0,1t:5,1G:1y,1x:0.2w,1J:1w,17:16,1I:2},\'4u\':{1p:0.2w,1a:0,1B:1,17:4,1I:0},\'4t\':{1p:10,1x:10,17:8},\'4s\':{1p:10,1x:10,17:1y,1t:5,1G:3W,1I:2},\'4p\':{1x:1,1p:1,1W:20,2c:1w,1a:0,17:3,2D:0,1B:3,1t:3,1G:20,1I:0,1J:1j,1l:1,30:[{r:0,g:0,b:4o,a:G},{r:G,g:G,b:G,a:G}]}},I.1P=H(a){a=a||{};q(2a a===\'4n\'){q(m.2O[a]){a=m.2O[a]}R{a={}}}q(!a.K(\'2H\')){a.2H=1j}q(!a.K(\'1x\')){a.1x=1}q(!a.K(\'1p\')){a.1p=1}q(!a.K(\'1W\')){a.1W=8}q(!a.K(\'2c\')){a.2c=1w}q(a.K(\'1a\')){q(2a a.1a===\'4m\'){a.1a=a.1a?1:0}}R{a.1a=2}q(!a.K(\'17\')){a.17=16}q(!a.K(\'2D\')){a.2D=0}q(!a.K(\'1B\')){a.1B=3}q(!a.K(\'1I\')){a.1I=1}q(!a.K(\'1J\')){a.1J=1j}q(!a.K(\'z\')){a.z=1}q(!a.K(\'1l\')){a.1l=1}q(!a.K(\'1o\')){a.1o=0}q(!a.K(\'15\')){a.15=0}q(!a.K(\'2k\')){a.2k=1j}q(!a.K(\'31\')){a.31=1j}q(!a.K(\'1t\')){a.1t=0}q(!a.K(\'1G\')){a.1G=20}O a},I.3A=H(a,b){v c=[],E=0,2m,2o,1u,19=[],3a=a.J*a.12,i,j,k,22,P;A(j=0;j<a.12+2;j++){c[j]=[];A(i=0;i<a.J+2;i++){c[j][i]=-1}}q(b.30){P=b.30}R q(b.1a===0){P=m.3h(b.17)}R q(b.1a===1){P=m.3j(b.17,a)}R{P=m.3m(b.17,a)}q(b.1t>0){a=m.3n(a,b.1t,b.1G)}A(22=0;22<b.1B;22++){q(22>0){A(k=0;k<P.B;k++){q(19[k].n>0){P[k]={r:D.S(19[k].r/19[k].n),g:D.S(19[k].g/19[k].n),b:D.S(19[k].b/19[k].n),a:D.S(19[k].a/19[k].n)}}q((19[k].n/3a<b.2D)&&(22<b.1B-1)){P[k]={r:D.S(D.1A()*G),g:D.S(D.1A()*G),b:D.S(D.1A()*G),a:D.S(D.1A()*G)}}}}A(i=0;i<P.B;i++){19[i]={r:0,g:0,b:0,a:0,n:0}}A(j=0;j<a.12;j++){A(i=0;i<a.J;i++){E=(j*a.J+i)*4;1u=0;2o=34;A(k=0;k<P.B;k++){2m=D.1r(P[k].r-a.F[E])+D.1r(P[k].g-a.F[E+1])+D.1r(P[k].b-a.F[E+2])+D.1r(P[k].a-a.F[E+3]);q(2m<2o){2o=2m;1u=k}}19[1u].r+=a.F[E];19[1u].g+=a.F[E+1];19[1u].b+=a.F[E+2];19[1u].a+=a.F[E+3];19[1u].n++;c[j+1][i+1]=1u}}}O{1h:c,P:P}},I.3j=H(a,b){v c,P=[];A(v i=0;i<a;i++){c=D.S(D.1A()*b.F.B/4)*4;P.1z({r:b.F[c],g:b.F[c+1],b:b.F[c+2],a:b.F[c+3]})}O P},I.3m=H(a,b){v c,P=[],2q=D.3C(D.4k(a)),2Z=D.3C(a/2q),3H=b.J/(2q+1),2r=b.12/(2Z+1);A(v j=0;j<2Z;j++){A(v i=0;i<2q;i++){q(P.B===a){4j}R{c=D.S(((j+1)*2r)*b.J+((i+1)*3H))*4;P.1z({r:b.F[c],g:b.F[c+1],b:b.F[c+2],a:b.F[c+3]})}}}O P},I.3h=H(a){v b=[],1D,2b,2e;q(a<8){v c=D.S(G/(a-1));A(v i=0;i<a;i++){b.1z({r:i*c,g:i*c,b:i*c,a:G})}}R{v d=D.S(D.4i(a,1/3)),2s=D.S(G/(d-1)),3Q=a-d*d*d;A(1D=0;1D<d;1D++){A(2b=0;2b<d;2b++){A(2e=0;2e<d;2e++){b.1z({r:1D*2s,g:2b*2s,b:2e*2s,a:G})}}}A(1D=0;1D<3Q;1D++){b.1z({r:D.S(D.1A()*G),g:D.S(D.1A()*G),b:D.S(D.1A()*G),a:D.S(D.1A()*G)})}}O b},I.3I=H(a){v b=[],1c=0,2W=a.1h.B,2V=a.1h[0].B,2U,2t,2L,2E,2F,2I,2G,2J,i,j,k;A(k=0;k<a.P.B;k++){b[k]=[];A(j=0;j<2W;j++){b[k][j]=[];A(i=0;i<2V;i++){b[k][j][i]=0}}}A(j=1;j<2W-1;j++){A(i=1;i<2V-1;i++){1c=a.1h[j][i];2U=a.1h[j-1][i-1]===1c?1:0;2t=a.1h[j-1][i]===1c?1:0;2L=a.1h[j-1][i+1]===1c?1:0;2E=a.1h[j][i-1]===1c?1:0;2F=a.1h[j][i+1]===1c?1:0;2I=a.1h[j+1][i-1]===1c?1:0;2G=a.1h[j+1][i]===1c?1:0;2J=a.1h[j+1][i+1]===1c?1:0;b[1c][j+1][i+1]=1+2F*2+2J*4+2G*8;q(!2E){b[1c][j+1][i]=0+2+2G*4+2I*8}q(!2t){b[1c][j][i+1]=0+2L*2+2F*4+8}q(!2U){b[1c][j][i]=0+2t*2+4+2E*8}}}O b},I.3i=[[[-1,-1,-1,-1],[-1,-1,-1,-1],[-1,-1,-1,-1],[-1,-1,-1,-1]],[[0,1,0,-1],[-1,-1,-1,-1],[-1,-1,-1,-1],[0,2,-1,0]],[[-1,-1,-1,-1],[-1,-1,-1,-1],[0,1,0,-1],[0,0,1,0]],[[0,0,1,0],[-1,-1,-1,-1],[0,2,-1,0],[-1,-1,-1,-1]],[[-1,-1,-1,-1],[0,0,1,0],[0,3,0,1],[-1,-1,-1,-1]],[[13,3,0,1],[13,2,-1,0],[7,1,0,-1],[7,0,1,0]],[[-1,-1,-1,-1],[0,1,0,-1],[-1,-1,-1,-1],[0,3,0,1]],[[0,3,0,1],[0,2,-1,0],[-1,-1,-1,-1],[-1,-1,-1,-1]],[[0,3,0,1],[0,2,-1,0],[-1,-1,-1,-1],[-1,-1,-1,-1]],[[-1,-1,-1,-1],[0,1,0,-1],[-1,-1,-1,-1],[0,3,0,1]],[[11,1,0,-1],[14,0,1,0],[14,3,0,1],[11,2,-1,0]],[[-1,-1,-1,-1],[0,0,1,0],[0,3,0,1],[-1,-1,-1,-1]],[[0,0,1,0],[-1,-1,-1,-1],[0,2,-1,0],[-1,-1,-1,-1]],[[-1,-1,-1,-1],[-1,-1,-1,-1],[0,1,0,-1],[0,0,1,0]],[[0,1,0,-1],[-1,-1,-1,-1],[-1,-1,-1,-1],[0,2,-1,0]],[[-1,-1,-1,-1],[-1,-1,-1,-1],[-1,-1,-1,-1],[-1,-1,-1,-1]]],I.3r=H(a,b){b=b||8;v c=[],u=0,o=0,U=0,V=0,w=a[0].B,h=a.B,2C=0,2B=1w,2A=1j,25;A(v j=0;j<h;j++){A(v i=0;i<w;i++){q((a[j][i]==4)||(a[j][i]==11)){U=i;V=j;c[u]={};c[u].9=[];c[u].18=[U,V,U,V];c[u].1n=[];2B=1j;o=0;2A=(a[j][i]==11);2C=1;2h(!2B){c[u].9[o]={};c[u].9[o].x=U-1;c[u].9[o].y=V-1;c[u].9[o].t=a[V][U];q((U-1)<c[u].18[0]){c[u].18[0]=U-1}q((U-1)>c[u].18[2]){c[u].18[2]=U-1}q((V-1)<c[u].18[1]){c[u].18[1]=V-1}q((V-1)>c[u].18[3]){c[u].18[3]=V-1}25=m.3i[a[V][U]][2C];a[V][U]=25[0];2C=25[1];U+=25[2];V+=25[3];q((U-1===c[u].9[0].x)&&(V-1===c[u].9[0].y)){2B=1w;q(c[u].9.B<b){c.4f()}R{c[u].1E=2A?1w:1j;q(2A){v d=0,2T=[-1,-1,w+1,h+1];A(v e=0;e<u;e++){q((!c[e].1E)&&m.32(c[e].18,c[u].18)&&m.32(2T,c[e].18)){d=e;2T=c[e].18}}c[d].1n.1z(u)}u++}}o++}}}}O c},I.32=H(a,b){O((a[0]<b[0])&&(a[1]<b[1])&&(a[2]>b[2])&&(a[3]>b[3]))},I.3o=H(a,b){v c=[];A(v k 2i a){q(!a.K(k)){2l}c[k]=m.3r(a[k],b)}O c},I.3M=H(a,b){v c=[],1s=0,1m=0,2g=0,2Y=0,2X=0,u,o;A(u=0;u<a.B;u++){c[u]={};c[u].9=[];c[u].18=a[u].18;c[u].1n=a[u].1n;c[u].1E=a[u].1E;1s=a[u].9.B;A(o=0;o<1s;o++){1m=(o+1)%1s;2g=(o+2)%1s;2Y=(o-1+1s)%1s;2X=(o-2+1s)%1s;q(b.2c&&m.35(a[u],2X,2Y,o,1m,2g)){q(c[u].9.B>0){c[u].9[c[u].9.B-1].1C=m.2u(c[u].9[c[u].9.B-1].x,c[u].9[c[u].9.B-1].y,a[u].9[o].x,a[u].9[o].y)}c[u].9.1z({x:a[u].9[o].x,y:a[u].9[o].y,1C:m.2u(a[u].9[o].x,a[u].9[o].y,((a[u].9[o].x+a[u].9[1m].x)/2),((a[u].9[o].y+a[u].9[1m].y)/2))})}c[u].9.1z({x:((a[u].9[o].x+a[u].9[1m].x)/2),y:((a[u].9[o].y+a[u].9[1m].y)/2),1C:m.2u(((a[u].9[o].x+a[u].9[1m].x)/2),((a[u].9[o].y+a[u].9[1m].y)/2),((a[u].9[1m].x+a[u].9[2g].x)/2),((a[u].9[1m].y+a[u].9[2g].y)/2))})}}O c},I.35=H(a,b,c,d,e,f){O(((a.9[d].x===a.9[b].x)&&(a.9[d].x===a.9[c].x)&&(a.9[d].y===a.9[e].y)&&(a.9[d].y===a.9[f].y))||((a.9[d].y===a.9[b].y)&&(a.9[d].y===a.9[c].y)&&(a.9[d].x===a.9[e].x)&&(a.9[d].x===a.9[f].x)))},I.2u=H(a,b,c,d){v e=8;q(a<c){q(b<d){e=1}R q(b>d){e=7}R{e=0}}R q(a>c){q(b<d){e=3}R q(b>d){e=5}R{e=4}}R{q(b<d){e=2}R q(b>d){e=6}R{e=8}}O e},I.3t=H(a,b){v c=[];A(v k 2i a){q(!a.K(k)){2l}c[k]=m.3M(a[k],b)}O c},I.38=H(a,b,c){v d=0,2v,26,1e,C={};C.s=[];C.18=a.18;C.1n=a.1n;C.1E=a.1E;2h(d<a.9.B){2v=a.9[d].1C;26=-1;1e=d+1;2h(((a.9[1e].1C===2v)||(a.9[1e].1C===26)||(26===-1))&&(1e<a.9.B-1)){q((a.9[1e].1C!==2v)&&(26===-1)){26=a.9[1e].1C}1e++}q(1e===a.9.B-1){1e=0}C.s=C.s.3e(m.2z(a,b,c,d,1e));q(1e>0){d=1e}R{d=a.9.B}}O C},I.2z=H(a,b,c,d,e){q((e>a.9.B)||(e<0)){O[]}v f=d,24=0,23=1w,U,V,1q;v g=(e-d);q(g<0){g+=a.9.B}v h=(a.9[e].x-a.9[d].x)/g,2r=(a.9[e].y-a.9[d].y)/g;v i=(d+1)%a.9.B,1Y;2h(i!=e){1Y=i-d;q(1Y<0){1Y+=a.9.B}U=a.9[d].x+h*1Y;V=a.9[d].y+2r*1Y;1q=(a.9[i].x-U)*(a.9[i].x-U)+(a.9[i].y-V)*(a.9[i].y-V);q(1q>b){23=1j}q(1q>24){f=i;24=1q}i=(i+1)%a.9.B}q(23){O[{1X:\'L\',1g:a.9[d].x,1i:a.9[d].y,X:a.9[e].x,W:a.9[e].y}]}v j=f;23=1w;24=0;v t=(j-d)/g,1V=(1-t)*(1-t),1U=2*(1-t)*t,1T=t*t;v k=(1V*a.9[d].x+1T*a.9[e].x-a.9[j].x)/-1U,2K=(1V*a.9[d].y+1T*a.9[e].y-a.9[j].y)/-1U;i=d+1;2h(i!=e){t=(i-d)/g;1V=(1-t)*(1-t);1U=2*(1-t)*t;1T=t*t;U=1V*a.9[d].x+1U*k+1T*a.9[e].x;V=1V*a.9[d].y+1U*2K+1T*a.9[e].y;1q=(a.9[i].x-U)*(a.9[i].x-U)+(a.9[i].y-V)*(a.9[i].y-V);q(1q>c){23=1j}q(1q>24){f=i;24=1q}i=(i+1)%a.9.B}q(23){O[{1X:\'Q\',1g:a.9[d].x,1i:a.9[d].y,X:k,W:2K,Y:a.9[e].x,1v:a.9[e].y}]}v l=j;O m.2z(a,b,c,d,l).3e(m.2z(a,b,c,l,e))},I.3w=H(a,b,c){v d=[];A(v k 2i a){q(!a.K(k)){2l}d.1z(m.38(a[k],b,c))}O d},I.3x=H(a,b,c){v d=[];A(v k 2i a){q(!a.K(k)){2l}d[k]=m.3w(a[k],b,c)}O d},I.1b=H(a,b){O+a.4c(b)},I.3z=H(a,b,c,d){v e=a.2j[b],C=e[c],N=\'\',o;q(d.1J&&(C.s.B<3)){O N}N=\'<4b \'+(d.2k?(\'2k="l \'+b+\' p \'+c+\'" \'):\'\')+m.3D(a.P[b],d)+\'d="\';q(d.1l===-1){N+=\'M \'+C.s[0].1g*d.z+\' \'+C.s[0].1i*d.z+\' \';A(o=0;o<C.s.B;o++){N+=C.s[o].1X+\' \'+C.s[o].X*d.z+\' \'+C.s[o].W*d.z+\' \';q(C.s[o].K(\'Y\')){N+=C.s[o].Y*d.z+\' \'+C.s[o].1v*d.z+\' \'}}N+=\'Z \'}R{N+=\'M \'+m.1b(C.s[0].1g*d.z,d.1l)+\' \'+m.1b(C.s[0].1i*d.z,d.1l)+\' \';A(o=0;o<C.s.B;o++){N+=C.s[o].1X+\' \'+m.1b(C.s[o].X*d.z,d.1l)+\' \'+m.1b(C.s[o].W*d.z,d.1l)+\' \';q(C.s[o].K(\'Y\')){N+=m.1b(C.s[o].Y*d.z,d.1l)+\' \'+m.1b(C.s[o].1v*d.z,d.1l)+\' \'}}N+=\'Z \'}A(v f=0;f<C.1n.B;f++){v g=e[C.1n[f]];q(d.1l===-1){q(g.s[g.s.B-1].K(\'Y\')){N+=\'M \'+g.s[g.s.B-1].Y*d.z+\' \'+g.s[g.s.B-1].1v*d.z+\' \'}R{N+=\'M \'+g.s[g.s.B-1].X*d.z+\' \'+g.s[g.s.B-1].W*d.z+\' \'}A(o=g.s.B-1;o>=0;o--){N+=g.s[o].1X+\' \';q(g.s[o].K(\'Y\')){N+=g.s[o].X*d.z+\' \'+g.s[o].W*d.z+\' \'}N+=g.s[o].1g*d.z+\' \'+g.s[o].1i*d.z+\' \'}}R{q(g.s[g.s.B-1].K(\'Y\')){N+=\'M \'+m.1b(g.s[g.s.B-1].Y*d.z)+\' \'+m.1b(g.s[g.s.B-1].1v*d.z)+\' \'}R{N+=\'M \'+m.1b(g.s[g.s.B-1].X*d.z)+\' \'+m.1b(g.s[g.s.B-1].W*d.z)+\' \'}A(o=g.s.B-1;o>=0;o--){N+=g.s[o].1X+\' \';q(g.s[o].K(\'Y\')){N+=m.1b(g.s[o].X*d.z)+\' \'+m.1b(g.s[o].W*d.z)+\' \'}N+=m.1b(g.s[o].1g*d.z)+\' \'+m.1b(g.s[o].1i*d.z)+\' \'}}N+=\'Z \'}N+=\'" />\';q(d.1o||d.15){A(o=0;o<C.s.B;o++){q(C.s[o].K(\'Y\')&&d.15){N+=\'<1R 1Z="\'+C.s[o].X*d.z+\'" 1Q="\'+C.s[o].W*d.z+\'" r="\'+d.15+\'" 1N="1S" T-J="\'+d.15*0.2+\'" T="21" />\';N+=\'<1R 1Z="\'+C.s[o].Y*d.z+\'" 1Q="\'+C.s[o].1v*d.z+\'" r="\'+d.15+\'" 1N="2p" T-J="\'+d.15*0.2+\'" T="21" />\';N+=\'<2n 1g="\'+C.s[o].1g*d.z+\'" 1i="\'+C.s[o].1i*d.z+\'" X="\'+C.s[o].X*d.z+\'" W="\'+C.s[o].W*d.z+\'" T-J="\'+d.15*0.2+\'" T="1S" />\';N+=\'<2n 1g="\'+C.s[o].X*d.z+\'" 1i="\'+C.s[o].W*d.z+\'" X="\'+C.s[o].Y*d.z+\'" W="\'+C.s[o].1v*d.z+\'" T-J="\'+d.15*0.2+\'" T="1S" />\'}q((!C.s[o].K(\'Y\'))&&d.1o){N+=\'<1R 1Z="\'+C.s[o].X*d.z+\'" 1Q="\'+C.s[o].W*d.z+\'" r="\'+d.1o+\'" 1N="2p" T-J="\'+d.1o*0.2+\'" T="21" />\'}}A(v f=0;f<C.1n.B;f++){v g=e[C.1n[f]];A(o=0;o<g.s.B;o++){q(g.s[o].K(\'Y\')&&d.15){N+=\'<1R 1Z="\'+g.s[o].X*d.z+\'" 1Q="\'+g.s[o].W*d.z+\'" r="\'+d.15+\'" 1N="1S" T-J="\'+d.15*0.2+\'" T="21" />\';N+=\'<1R 1Z="\'+g.s[o].Y*d.z+\'" 1Q="\'+g.s[o].1v*d.z+\'" r="\'+d.15+\'" 1N="2p" T-J="\'+d.15*0.2+\'" T="21" />\';N+=\'<2n 1g="\'+g.s[o].1g*d.z+\'" 1i="\'+g.s[o].1i*d.z+\'" X="\'+g.s[o].X*d.z+\'" W="\'+g.s[o].W*d.z+\'" T-J="\'+d.15*0.2+\'" T="1S" />\';N+=\'<2n 1g="\'+g.s[o].X*d.z+\'" 1i="\'+g.s[o].W*d.z+\'" X="\'+g.s[o].Y*d.z+\'" W="\'+g.s[o].1v*d.z+\'" T-J="\'+d.15*0.2+\'" T="1S" />\'}q((!g.s[o].K(\'Y\'))&&d.1o){N+=\'<1R 1Z="\'+g.s[o].X*d.z+\'" 1Q="\'+g.s[o].W*d.z+\'" r="\'+d.1o+\'" 1N="2p" T-J="\'+d.1o*0.2+\'" T="21" />\'}}}}O N},I.3u=H(a,b){b=m.1P(b);v w=a.J*b.z,h=a.12*b.z;v c=\'<33 \'+(b.31?(\'4a="0 0 \'+w+\' \'+h+\'" \'):(\'J="\'+w+\'" 12="\'+h+\'" \'))+\'3R="1.1" 49="48://45.43.3X/4r/33" 2k="3Y 3Z 40.41 3R \'+m.3c+\'" >\';A(v d=0;d<a.2j.B;d++){A(v e=0;e<a.2j[d].B;e++){q(!a.2j[d][e].1E){c+=m.3z(a,d,e,b)}}}c+=\'</33>\';O c},I.42=H(a,b){O a-b},I.3V=H(c){O\'44(\'+c.r+\',\'+c.g+\',\'+c.b+\',\'+c.a+\')\'},I.3D=H(c,a){O\'1N="3U(\'+c.r+\',\'+c.g+\',\'+c.b+\')" T="3U(\'+c.r+\',\'+c.g+\',\'+c.b+\')" T-J="\'+a.1I+\'" 46="\'+c.a/G.0+\'" \'},I.47=H(a,b){v c;q(b){c=1k.3S(b);q(!c){c=1k.29(\'2x\');c.3B=b;1k.2y.2f(c)}}R{c=1k.29(\'2x\');1k.2y.2f(c)}c.4d+=a},I.3k=[[0.37,0.4e,0.37],[0.3G,0.3l,0.4h,0.3l,0.3G],[0.3O,0.3J,0.3E,0.4l,0.3E,0.3J,0.3O],[0.3F,0.3v,0.3s,0.3g,0.4q,0.3g,0.3s,0.3v,0.3F],[0.3f,0.3d,0.3b,0.39,0.3T,0.4w,0.3T,0.39,0.3b,0.3d,0.3f]],I.3n=H(a,b,c){v i,j,k,d,E,1K,1O,1M,1L,1f;v e={J:a.J,12:a.12,F:[]};b=D.S(b);q(b<1){O a}q(b>5){b=5}c=D.1r(c);q(c>34){c=34}v f=m.3k[b-1];A(j=0;j<a.12;j++){A(i=0;i<a.J;i++){1K=0;1O=0;1M=0;1L=0;1f=0;A(k=-b;k<b+1;k++){q((i+k>0)&&(i+k<a.J)){E=(j*a.J+i+k)*4;1K+=a.F[E]*f[k+b];1O+=a.F[E+1]*f[k+b];1M+=a.F[E+2]*f[k+b];1L+=a.F[E+3]*f[k+b];1f+=f[k+b]}}E=(j*a.J+i)*4;e.F[E]=D.S(1K/1f);e.F[E+1]=D.S(1O/1f);e.F[E+2]=D.S(1M/1f);e.F[E+3]=D.S(1L/1f)}}v g=28 4C(e.F);A(j=0;j<a.12;j++){A(i=0;i<a.J;i++){1K=0;1O=0;1M=0;1L=0;1f=0;A(k=-b;k<b+1;k++){q((j+k>0)&&(j+k<a.12)){E=((j+k)*a.J+i)*4;1K+=g[E]*f[k+b];1O+=g[E+1]*f[k+b];1M+=g[E+2]*f[k+b];1L+=g[E+3]*f[k+b];1f+=f[k+b]}}E=(j*a.J+i)*4;e.F[E]=D.S(1K/1f);e.F[E+1]=D.S(1O/1f);e.F[E+2]=D.S(1M/1f);e.F[E+3]=D.S(1L/1f)}}A(j=0;j<a.12;j++){A(i=0;i<a.J;i++){E=(j*a.J+i)*4;d=D.1r(e.F[E]-a.F[E])+D.1r(e.F[E+1]-a.F[E+1])+D.1r(e.F[E+2]-a.F[E+2])+D.1r(e.F[E+3]-a.F[E+3]);q(d>c){e.F[E]=a.F[E];e.F[E+1]=a.F[E+1];e.F[E+2]=a.F[E+2];e.F[E+3]=a.F[E+3]}}}O e},I.2R=H(c,d,e){v f=28 4D();q(e&&e.2H){f.4E=\'4F\'}f.4G=c;f.4H=H(){v a=1k.29(\'3p\');a.J=f.J;a.12=f.12;v b=a.2N(\'2d\');b.4L(f,0,0);d(a)}},I.2P=H(a){v b=a.2N(\'2d\');O b.4M(0,0,a.J,a.12)},I.3P=[{r:0,g:0,b:0,a:G},{r:1d,g:1d,b:1d,a:G},{r:0,g:0,b:1d,a:G},{r:1y,g:1y,b:1d,a:G},{r:1H,g:1H,b:1H,a:G},{r:G,g:G,b:G,a:G},{r:1d,g:1d,b:1H,a:G},{r:0,g:0,b:1H,a:G},{r:1d,g:0,b:0,a:G},{r:1d,g:1y,b:1y,a:G},{r:1d,g:0,b:1d,a:G},{r:2S,g:2S,b:2S,a:G},{r:1H,g:1d,b:1d,a:G},{r:1H,g:0,b:0,a:G},{r:G,g:G,b:G,a:G},{r:0,g:1d,b:0,a:G}],I.3N=H(a,b,c,d){c=c||1;v w,h,i,j,k;v e;q(d){e=1k.3S(d);q(!e){e=1k.29(\'2x\');e.3B=d;1k.2y.2f(e)}}R{e=1k.29(\'2x\');1k.2y.2f(e)}A(k 2i a){q(!a.K(k)){2l}w=a[k][0].B;h=a[k].B;v f=1k.29(\'3p\');f.J=w*c;f.12=h*c;v g=f.2N(\'2d\');A(j=0;j<h;j++){A(i=0;i<w;i++){g.4Q=m.3V(b[a[k][j][i]%b.B]);g.4R(i*c,j*c,c,c)}}e.2f(f)}}}q(2a 2Q===\'H\'&&2Q.4T){2Q(H(){O 28 1F()})}R q(2a 3y!==\'3q\'){3y.4W=28 1F()}R q(2a 3K!==\'3q\'){3K.1F=28 1F()}R 4Y.1F=28 1F()})();', 62, 309, '|||||||||points|||||||||||||||pcnt||if||segments||pacnt|var||||scale|for|length|smp|Math|idx|data|255|function|this|width|hasOwnProperty|||str|return|palette||else|floor|stroke|px|py|y2|x2|x3||||height|||qcpr||numberofcolors|boundingbox|paletteacc|colorsampling|roundtodec|val|128|seqend|wacc|x1|array|y1|false|document|roundcoords|nextidx|holechildren|lcpr|qtres|dist2|abs|palen|blurradius|ci|y3|true|ltres|64|push|random|colorquantcycles|linesegment|rcnt|isholepath|ImageTracer|blurdelta|192|strokewidth|linefilter|racc|aacc|bacc|fill|gacc|checkoptions|cy|circle|cyan|t3|t2|t1|pathomit|type|pl|cx||black|cnt|curvepass|errorval|lookuprow|segtype2||new|createElement|typeof|gcnt|rightangleenhance||bcnt|appendChild|nextidx2|while|in|layers|desc|continue|cd|line|cdl|white|ni|vy|colorstep|n2|getdirection|segtype1|01|div|body|fitseq|holepath|pathfinished|dir|mincolorratio|n4|n5|n7|corsenabled|n6|n8|cpy|n3|imagedataToTracedata|getContext|optionpresets|getImgdata|define|loadImage|168|parentbbox|n1|aw|ah|previdx2|previdx|nj|pal|viewbox|boundingboxincludes|svg|1024|testrightangle|imagedataToSVG|27901|tracepath|107988|pixelnum|089767|versionnumber|069304|concat|049692|144599|generatepalette|pathscan_combined_lookup|samplepalette|gks|228569|samplepalette2|blur|batchpathscan|canvas|undefined|pathscan|122589|batchinternodes|getsvgstring|093095|batchtracepaths|batchtracelayers|module|svgpathstring|colorquantization|id|ceil|tosvgcolorstr|178908|063327|135336|vx|layering|136394|self|layercontainerid|internodes|drawLayers|086776|specpalette|rndnum|version|getElementById|120651|rgb|torgbastr|256|org|Created|with|imagetracer|js|compareNumbers|w3|rgba|www|opacity|appendSVGString|http|xmlns|viewBox|path|toFixed|innerHTML|44198|pop|use|272192|pow|break|sqrt|195843|boolean|string|100|Posterized3|152781|2000|Artistic4|Artistic3|Artistic2|Artistic1|125194|Randomsampling2|Randomsampling1|Fixedpalette|Grayscale|Smoothed|Uint8ClampedArray|Image|crossOrigin|Anonymous|src|onload|Detailed|Sharp|Curvy|drawImage|getImageData|Posterized2|Posterized1|null|fillStyle|fillRect|Default|amd|imageToTracedata|imageToSVG|exports|strict|window'.split('|'), 0, {}));
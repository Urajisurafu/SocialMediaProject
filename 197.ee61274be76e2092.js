"use strict";(self.webpackChunkSocialMediaProject=self.webpackChunkSocialMediaProject||[]).push([[197],{9197:(Z,p,o)=>{o.r(p),o.d(p,{LikesInfoModule:()=>W});var l=o(4755),f=o(3676),e=o(2223),m=o(1188),u=o(5861),d=o(6286),k=o(8134);let h=(()=>{class n{constructor(t){this.postData=t}}return n.\u0275fac=function(t){return new(t||n)(e.Y36(d.WI))},n.\u0275cmp=e.Xpm({type:n,selectors:[["app-post-window"]],decls:2,vars:1,consts:[[1,"post-window"],[3,"postData"]],template:function(t,i){1&t&&(e.TgZ(0,"div",0),e._UZ(1,"app-post",1),e.qZA()),2&t&&(e.xp6(1),e.Q6J("postData",i.postData))},dependencies:[k.A],styles:[".post-window[_ngcontent-%COMP%]{padding:0 10px 10px;max-height:90vh;overflow:auto}"]}),n})();var v=o(5213),C=o(7312),x=o(3919),w=o(9744),L=o(1728),g=o(6012),P=o(430),O=o(1292);function y(n,s){1&n&&(e.TgZ(0,"div",8),e._uU(1," Your new likes list is empty. "),e.qZA())}const M=function(n,s){return{even:n,odd:s}};function S(n,s){if(1&n){const t=e.EpF();e.TgZ(0,"div",9)(1,"div",10),e.NdJ("click",function(){const r=e.CHM(t).$implicit,a=e.oxw();return e.KtG(a.goToFriendPageClick(r.user.userId))}),e._UZ(2,"img",11),e.TgZ(3,"div"),e._uU(4),e.qZA()(),e.TgZ(5,"div",12),e.NdJ("click",function(){const r=e.CHM(t).$implicit,a=e.oxw();return e.KtG(a.showPost(r.post))}),e._uU(6," Liked your post - "),e.TgZ(7,"span",13),e._uU(8),e.qZA()(),e.TgZ(9,"mat-checkbox",14),e.NdJ("change",function(){const r=e.CHM(t).$implicit,a=e.oxw();return e.KtG(a.onCheckboxChange(r))}),e.qZA()()}if(2&n){const t=s.$implicit,i=s.index,c=e.oxw();e.Q6J("ngClass",e.WLB(5,M,i%2==0,i%2!=0)),e.xp6(2),e.s9C("src",t.user.imageUrl,e.LSH),e.xp6(2),e.Oqu(t.user.publicName),e.xp6(4),e.Oqu(t.post.comment),e.xp6(1),e.Q6J("checked",c.isChecked(t))}}const b=function(n){return{"without-invite":n}};let U=(()=>{class n{constructor(t,i,c,r,a){this.userPageService=t,this.likesWindowService=i,this.userDataService=c,this.notificationsService=r,this.dialog=a,this.selectedUsers=[]}ngOnInit(){this.delayUntilUserInfo()}ngOnDestroy(){this.likesWindowServiceSubscription&&this.likesWindowServiceSubscription.unsubscribe()}delayUntilUserInfo(){var t=this;return(0,u.Z)(function*(){t.userDataService.userInfo?.userId?t.likesWindowServiceSubscription=t.likesWindowService.getYourNotificationLikes().subscribe():(yield new Promise(i=>{setTimeout(i,100)}),yield t.delayUntilUserInfo())})()}deleteSelectedLikes(){this.selectedUsers.forEach(t=>{this.notificationsService.deleteCheckedNotificationLike(t.notificationLikeId),this.selectedUsers=[]})}getNotificationLikesList(){return this.likesWindowService.listOfNotificationLikes}isNoHaveNotificationLikes(){if(this.likesWindowService.listOfNotificationLikes)return this.likesWindowService.listOfNotificationLikes.length<=0}goToFriendPageClick(t){this.userPageService.goToFriendPage(t)}onCheckboxChange(t){const i=this.selectedUsers.findIndex(c=>c.notificationLikeId===t.notificationLikeId);-1!==i?this.selectedUsers.splice(i,1):this.selectedUsers.push(t)}isChecked(t){return-1!==this.selectedUsers.findIndex(c=>c.notificationLikeId===t.notificationLikeId)}toggleSelectAll(){this.selectedUsers=this.selectedUsers.length===this.getNotificationLikesList().length?[]:this.getNotificationLikesList()}showPost(t){const i=new d.vA;i.data=t,this.dialog.open(h,i)}}return n.\u0275fac=function(t){return new(t||n)(e.Y36(v.v),e.Y36(C.R),e.Y36(x.M),e.Y36(w.T),e.Y36(d.uw))},n.\u0275cmp=e.Xpm({type:n,selectors:[["app-likes-window"]],decls:12,vars:5,consts:[[1,"likes-window"],[1,"likes-header"],[1,"likes-header-delete"],["mat-flat-button","","color","warn",3,"click"],["color","warn",3,"click"],[1,"likes-content",3,"ngClass"],["class","likes-content-no-invite",4,"ngIf"],["class","likes-content-item",3,"ngClass",4,"ngFor","ngForOf"],[1,"likes-content-no-invite"],[1,"likes-content-item",3,"ngClass"],[1,"item-name",3,"click"],["alt","User photo",1,"item-avatar",3,"src"],[1,"item-text",3,"click"],[1,"item-text-info"],["color","warn",3,"checked","change"]],template:function(t,i){1&t&&(e.TgZ(0,"mat-card",0)(1,"mat-card-header",1)(2,"div"),e._uU(3,"New likes"),e.qZA(),e.TgZ(4,"div",2)(5,"button",3),e.NdJ("click",function(){return i.toggleSelectAll()}),e._uU(6," Select all "),e.qZA(),e.TgZ(7,"mat-icon",4),e.NdJ("click",function(){return i.deleteSelectedLikes()}),e._uU(8,"delete"),e.qZA()()(),e.TgZ(9,"mat-card-content",5),e.YNc(10,y,2,0,"div",6),e.YNc(11,S,10,8,"div",7),e.qZA()()),2&t&&(e.xp6(9),e.Q6J("ngClass",e.VKq(3,b,i.isNoHaveNotificationLikes())),e.xp6(1),e.Q6J("ngIf",i.isNoHaveNotificationLikes()),e.xp6(1),e.Q6J("ngForOf",i.getNotificationLikesList()))},dependencies:[l.mk,l.sg,l.O5,L.lW,g.a8,g.dn,g.dk,P.Hw,O.oG],styles:[".likes-window[_ngcontent-%COMP%]{min-width:50vw;max-width:60vw;background-color:#b4b4b4}.likes-header[_ngcontent-%COMP%]{font-size:24px;display:flex;align-items:center;justify-content:center}.likes-header-delete[_ngcontent-%COMP%]{width:150px;display:flex;align-items:center;justify-content:space-between;cursor:pointer;position:absolute;right:30px}.likes-content[_ngcontent-%COMP%]{max-height:470px;overflow-y:auto;margin:10px;border-radius:10px;background-color:#fff;min-height:400px}.likes-content-no-invite[_ngcontent-%COMP%]{font-family:Bradley Hand,cursive;display:flex;align-items:center;justify-content:center;font-size:24px}.likes-content-item[_ngcontent-%COMP%]{display:flex;align-items:center;padding:10px}.likes-content[_ngcontent-%COMP%]   .item-avatar[_ngcontent-%COMP%]{font-size:10px;background-color:#fff;margin:5px 10px 0;width:40px;height:40px;border-radius:50%;border:3px solid #000000;box-shadow:0 0 7px #666;object-fit:cover}.likes-content[_ngcontent-%COMP%]   .item-name[_ngcontent-%COMP%]{flex-basis:25%;display:flex;align-items:center;cursor:pointer}.likes-content[_ngcontent-%COMP%]   .item-name[_ngcontent-%COMP%]:hover{color:#f44336}.likes-content[_ngcontent-%COMP%]   .item-text[_ngcontent-%COMP%]{flex-basis:65%;cursor:pointer;word-wrap:break-word}.likes-content[_ngcontent-%COMP%]   .item-text[_ngcontent-%COMP%]:hover   .item-text-info[_ngcontent-%COMP%]{color:#f44336}.likes-content[_ngcontent-%COMP%]   .even[_ngcontent-%COMP%]{background-color:#d3d3d3}.likes-content[_ngcontent-%COMP%]   .odd[_ngcontent-%COMP%]{background-color:#e5e5e5}.without-invite[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:center}.mat-mdc-card-content[_ngcontent-%COMP%]:last-child{padding:0}"]}),n})(),T=(()=>{class n{constructor(t){this.storageService=t,this.backgroundStorage=""}ngOnInit(){this.storageSubscription=this.storageService.getDataFromStorage("Background/likes-page.jpg").subscribe(i=>this.backgroundStorage=`url(${i})`)}}return n.\u0275fac=function(t){return new(t||n)(e.Y36(m.V))},n.\u0275cmp=e.Xpm({type:n,selectors:[["app-information-likes"]],decls:2,vars:2,consts:[[1,"likes-page"]],template:function(t,i){1&t&&(e.TgZ(0,"div",0),e._UZ(1,"app-likes-window"),e.qZA()),2&t&&e.Udp("background-image",i.backgroundStorage)},dependencies:[U],styles:[".likes-page[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:center;width:100%;min-height:100%;background:no-repeat center center fixed;background-size:cover}"]}),n})();var I=o(8854);let W=(()=>{class n{}return n.\u0275fac=function(t){return new(t||n)},n.\u0275mod=e.oAB({type:n}),n.\u0275inj=e.cJS({imports:[l.ez,I.q,f.Bz.forChild([{path:"",component:T}])]}),n})()}}]);
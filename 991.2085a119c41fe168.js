"use strict";(self.webpackChunkSocialMediaProject=self.webpackChunkSocialMediaProject||[]).push([[991],{2991:(U,d,t)=>{t.r(d),t.d(d,{FriendPageModule:()=>S});var l=t(5861),F=t(3900),h=t(4128),r=t(2223),m=t(1762),I=t(3919);let a=(()=>{class i{constructor(e,n){this.firestore=e,this.userDataService=n,this.friendPosts=0,this.friendFriends=0,this.collection=this.firestore.collection("Users")}getUserFriendsExistence(e,n){return this.collection.doc(e).collection("UserFriends").doc(n).get()}getFriendExistence(e){const n=this.userDataService.getCurrentUserId(),f=this.getUserFriendsExistence(n,e),o=this.getUserFriendsExistence(e,n);(0,h.D)([f,o]).subscribe(([u,c])=>{this.isAwaitingConfirmation=u.exists&&!c.exists,this.isFriend=u.exists&&c.exists})}getFriendById(e){return this.collection.doc(e).get()}getFriendCountOfValuePosts(e){this.collection.doc(e).collection("UserPosts").valueChanges().subscribe(n=>{this.friendPosts=n.length})}getFriendCountOfValueFriends(e){this.collection.doc(e).collection("UserFriends",n=>n.where("isFriend","==",!0)).valueChanges().subscribe(n=>{this.friendFriends=n.length})}}return i.\u0275fac=function(e){return new(e||i)(r.LFG(m.ST),r.LFG(I.M))},i.\u0275prov=r.Yz7({token:i,factory:i.\u0275fac}),i})();var g=t(3676),P=t(3634);let p=(()=>{class i{constructor(e,n){this.route=e,this.friendPageService=n}ngOnInit(){this.delayUntilFriendInfo().then(),this.friendInfoSubscription=this.route.queryParams.pipe((0,F.w)(e=>this.friendPageService.getFriendById(e.friendId))).subscribe(e=>{this.friendInfo=e.data()})}ngOnDestroy(){this.friendInfoSubscription&&this.friendInfoSubscription.unsubscribe()}getIsFriend(){return this.friendPageService.isFriend}getIsAwaitingConfirmation(){return this.friendPageService.isAwaitingConfirmation}getFriendId(){return this.friendInfo?.userId||""}getFriendName(){return this.friendInfo?.publicName||""}getFriendDescription(){return this.friendInfo?.description||""}getUserTimestamp(){const e=this.friendInfo?.timestamp;return e?e.toDate():""}delayUntilFriendInfo(){var e=this;return(0,l.Z)(function*(){e.friendInfo?.userId?(e.friendPageService.getFriendExistence(e.friendInfo.userId),e.friendPageService.getFriendCountOfValueFriends(e.friendInfo.userId),e.friendPageService.getFriendCountOfValuePosts(e.friendInfo.userId)):(yield new Promise(n=>{setTimeout(n,100)}),yield e.delayUntilFriendInfo())})()}getFriendPostsLength(){return this.friendPageService.friendPosts}getFriendFriendsLength(){return this.friendPageService.friendFriends}handleValueChange(e){e&&this.friendPageService.getFriendExistence(this.friendInfo.userId)}}return i.\u0275fac=function(e){return new(e||i)(r.Y36(g.gz),r.Y36(a))},i.\u0275cmp=r.Xpm({type:i,selectors:[["app-friend-user-page"]],features:[r._Bn([a])],decls:1,vars:10,consts:[[3,"userInfo","userName","userDescription","userTimestamp","userPostsLength","userFriendsLength","isFriend","getIsAwaitingConfirmation","friendId","isOwnPage","isChangeFriendStatus"]],template:function(e,n){1&e&&(r.TgZ(0,"app-user-page",0),r.NdJ("isChangeFriendStatus",function(o){return n.handleValueChange(o)}),r.qZA()),2&e&&r.Q6J("userInfo",n.friendInfo)("userName",n.getFriendName())("userDescription",n.getFriendDescription())("userTimestamp",n.getUserTimestamp())("userPostsLength",n.getFriendPostsLength())("userFriendsLength",n.getFriendFriendsLength())("isFriend",n.getIsFriend())("getIsAwaitingConfirmation",n.getIsAwaitingConfirmation())("friendId",n.getFriendId())("isOwnPage",!1)},dependencies:[P.u]}),i})();var v=t(4755),C=t(1026);let S=(()=>{class i{}return i.\u0275fac=function(e){return new(e||i)},i.\u0275mod=r.oAB({type:i}),i.\u0275inj=r.cJS({imports:[g.Bz.forChild([{path:"",component:p}]),v.ez,C.t]}),i})()}}]);
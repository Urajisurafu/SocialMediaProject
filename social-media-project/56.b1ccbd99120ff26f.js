"use strict";(self.webpackChunkSocialMediaProject=self.webpackChunkSocialMediaProject||[]).push([[56],{56:(f,i,r)=>{r.r(i),r.d(i,{MainUserPageModule:()=>p});var o=r(4755),u=r(5861),n=r(2223),g=r(3919),m=r(5213),c=r(3634);let l=(()=>{class s{constructor(e,t){this.userDataService=e,this.mainUserPageService=t}ngOnInit(){this.delayUntilUserInfo()}getUserInfo(){return this.userDataService.userInfo}getUserName(){return this.userDataService.userInfo?.publicName||""}getUserDescription(){return this.userDataService.userInfo?.description||""}getUserTimestamp(){const e=this.userDataService.userInfo?.timestamp;return e?e.toDate():""}getUserPostsLength(){return this.mainUserPageService.userPosts}getUserFriendsLength(){return this.mainUserPageService.userFriends}delayUntilUserInfo(){var e=this;return(0,u.Z)(function*(){e.userDataService.userInfo?.userId?(e.mainUserPageService.getCountOfValueFriends(e.userDataService.userInfo.userId),e.mainUserPageService.getCountOfValuePosts(e.userDataService.userInfo.userId)):(yield new Promise(t=>{setTimeout(t,100)}),yield e.delayUntilUserInfo())})()}}return s.\u0275fac=function(e){return new(e||s)(n.Y36(g.M),n.Y36(m.v))},s.\u0275cmp=n.Xpm({type:s,selectors:[["app-main-user-page"]],decls:1,vars:7,consts:[[3,"userInfo","userName","userDescription","userTimestamp","userPostsLength","userFriendsLength","isOwnPage"]],template:function(e,t){1&e&&n._UZ(0,"app-user-page",0),2&e&&n.Q6J("userInfo",t.getUserInfo())("userName",t.getUserName())("userDescription",t.getUserDescription())("userTimestamp",t.getUserTimestamp())("userPostsLength",t.getUserPostsLength())("userFriendsLength",t.getUserFriendsLength())("isOwnPage",!0)},dependencies:[c.u]}),s})();var U=r(1026),d=r(3676);let p=(()=>{class s{}return s.\u0275fac=function(e){return new(e||s)},s.\u0275mod=n.oAB({type:s}),s.\u0275inj=n.cJS({imports:[d.Bz.forChild([{path:"",component:l}]),o.ez,U.t]}),s})()}}]);
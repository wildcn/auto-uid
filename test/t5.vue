<template>
  <div class="user-activity" data-auid="9985bb0aef4a">
    <div class="post" data-auid="5bacd1bacbf9">
      <div class="user-block" data-auid="c3e0a5d95b01">
        <img class="img-circle" data-auid="f9e936785032" :src="'https://wpimg.wallstcn.com/57ed425a-c71e-4201-9428-68760c0537c4.jpg'+avatarPrefix">
        <span class="username text-muted" data-auid="05c259cc0e1f">Iron Man</span>
        <span class="description" data-auid="2721d8512ade">Shared publicly - 7:30 PM today</span>
      </div>
      <p data-auid="d27719ffa187">
        Lorem ipsum represents a long-held tradition for designers,
        typographers and the like. Some people hate it and argue for
        its demise, but others ignore the hate as they create awesome
        tools to help create filler text for everyone from bacon lovers
        to Charlie Sheen fans.
      </p>
      <ul class="list-inline" data-auid="a84756208e8d">
        <li data-auid="e1f2f5b05614">
          <span class="link-black text-sm" data-auid="29c0304abda3">
            <i class="el-icon-share" data-auid="ed2d7ea4162f"></i>
            Share
          </span>
        </li>
        <li data-auid="71a447253561">
          <span class="link-black text-sm" data-auid="29c0304abda3@2">
            <svg-icon icon-class="like" data-auid="17177e8fedf7"></svg-icon>
            Like
          </span>
        </li>
      </ul>
    </div>
    <div class="post" data-auid="6cce8a57bc66">
      <div class="user-block" data-auid="c3e0a5d95b01@2">
        <img class="img-circle" data-auid="f9e936785032@2" :src="'https://wpimg.wallstcn.com/9e2a5d0a-bd5b-457f-ac8e-86554616c87b.jpg'+avatarPrefix">
        <span class="username text-muted" data-auid="05c259cc0e1f@2">Captain American</span>
        <span class="description" data-auid="2721d8512ade@2">Sent you a message - yesterday</span>
      </div>
      <p data-auid="d27719ffa187@2">
        Lorem ipsum represents a long-held tradition for designers,
        typographers and the like. Some people hate it and argue for
        its demise, but others ignore the hate as they create awesome
        tools to help create filler text for everyone from bacon lovers
        to Charlie Sheen fans.
      </p>
      <ul class="list-inline" data-auid="a84756208e8d@2">
        <li data-auid="e1f2f5b05614@2">
          <span class="link-black text-sm" data-auid="29c0304abda3@2">
            <i class="el-icon-share" data-auid="ed2d7ea4162f@2"></i>
            Share
          </span>
        </li>
        <li data-auid="71a447253561@2">
          <span class="link-black text-sm" data-auid="29c0304abda3@2">
            <svg-icon icon-class="like" data-auid="17177e8fedf7@2"></svg-icon>
            Like
          </span>
        </li>
      </ul>
    </div>
    <div class="post" data-auid="bb92511b1906">
      <div class="user-block" data-auid="c3e0a5d95b01@2">
        <img class="img-circle" data-auid="f9e936785032@2" :src="'https://wpimg.wallstcn.com/fb57f689-e1ab-443c-af12-8d4066e202e2.jpg'+avatarPrefix">
        <span class="username" data-auid="05c259cc0e1f@2">Spider Man</span>
        <span class="description" data-auid="2721d8512ade@2">Posted 4 photos - 2 days ago</span>
      </div>
      <div class="user-images" data-auid="1dec68a372e4">
        <el-carousel type="card" height="220px" data-auid="40b5235b58f8" :interval="6000">
          <el-carousel-item v-for="item in carouselImages" :key="item" data-auid="f0d3db320a73">
            <img class="image" data-auid="85e2568a6dd4" :src="item+carouselPrefix">
          </el-carousel-item>
        </el-carousel>
      </div>
      <ul class="list-inline" data-auid="a84756208e8d@2">
        <li data-auid="e1f2f5b05614@2"><span class="link-black text-sm" data-auid="73b509ec4c8c"><i class="el-icon-share" data-auid="d33d51e5a2ef"></i> Share</span></li>
        <li data-auid="71a447253561@2">
          <span class="link-black text-sm" data-auid="29c0304abda3@2">
            <svg-icon icon-class="like" data-auid="17177e8fedf7@2"></svg-icon> Like</span>
        </li>
      </ul>
    </div>
  </div>
</template>
<template>
  <div>
    <!-- HelloWorld -->
    <HelloWorld mgs="msg"></HelloWorld>

    <!-- picture-preview -->
    <picture-preview>
      <ul>
          <li v-for="(item,index) in list">
              <picture-preview-item :src="item.href" :title="item.title">
                  {{item.href}}
              </picture-preview-item>
          </li>
      </ul>
  </picture-preview>

  </div>
</template>

<script>
import HelloWorld from './components/hello-world/hello-world.vue'
// import {PicturePreview,PicturePreviewItem } from "./components/picture-preview"
export default {
  name: 'app',
  components: {
    HelloWorld,
    // PicturePreview,
    // PicturePreviewItem
  },
  data(){
      return {
          msg:"hello world",
          list:[
            {title:"妹子去睡觉",href:"https://ycg-1251509803.cossh.myqcloud.com/activity/works/avatar-1521115361957.jpg"},
            {title:"妹子去做饭",href:"https://ycg-1251509803.cossh.myqcloud.com/activity/works/avatar-1521115092303.jpeg"},
            {title:"妹子去换衣服",href:"https://ycg-1251509803.cossh.myqcloud.com/activity/works/avatar-1521115961751.jpg"},
            {title:"妹子去扫地",href:"https://ycg-1251509803.cossh.myqcloud.com/activity/works/avatar-1521114009969.jpg"},
            {title:"妹子去买零食",href:"https://ycg-1251509803.cossh.myqcloud.com/activity/works/avatar-1521114710785.jpg"}
          ]
      }
  }
}
</script>

<style>
</style>

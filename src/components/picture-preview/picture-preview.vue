<template>
    <transition name="fade">
        <div @keyup.up="prevAction()" @keyup.down="nextAction()">
            <slot></slot>
            <div class="preview-wrapper" v-show="modal">
                <div class="preview-wrapper-box">
                    <div class="preview-loading" v-show="loading"><i></i></div>
                    <div class="preview-loading" v-show="loadfail" style="white-space: nowrap;">加载失败</div>
                    <img
                        class="preview-img"
                        v-if="current.src"
                        :src="current.src"
                        :alt="current.title"
                        v-show="!loading"
                    >
                    <a @click="close" href="javascript:void(0);" class="preview-close" >✕</a>
                    <div class="preview-nav-left" :class="{disabled:activeIndex === 0}" v-if="isPaginationEnable" v-show="!preview.loading">
                        <a class="preview-nav-arrow" href="#" @click.prevent="prevAction" title="上一张"></a>
                    </div>
                    <div class="preview-nav-right" :class="{disabled:activeIndex === slideInstances.length-1}" v-if="isPaginationEnable" v-show="!preview.loading">
                        <a class="preview-nav-arrow" href="#" @click.prevent="nextAction" title="下一张"></a>
                    </div>
                </div>
                <nav class="preview-list">
                    <div class="preview-title" v-if="isTitleEnable&&current.title" v-show="!loading">
                        {{current.title}}
                    </div>
                    <div v-if="isListEnable">
                        <a class="preview-list-box-btn" :class="{disabled:marginTop === 0}" href="#" @click.prevent="prevImg" title="上一张">上一张</a>
                        <div class="preview-list-box" :style="listBoxStyles">
                            <ul class="preview-list-ul" :style="listUlStyles">
                                <li class="preview-list-item" v-for="(item,index) in slideInstances" :key="index" @click="preview({title:item.title,src:item.src,disabled:item.disabled})">
                                    <img v-if="item.src" :src="item.src" alt="item.title">
                                </li>
                            </ul>
                        </div>
                        <a class="preview-list-box-btn" :class="{disabled:marginTop === -1*baseHeight*(slideInstances.length-3)}" href="#" @click.prevent="nextImg" title="下一张">下一张</a>
                    </div>
                </nav>
            </div>
        </div>
    </transition>
</template>

<script>
import {addEvent,removeEvent} from "@/services/utils"
export default {
    name: 'PicturePreview',
    props:{
        //是否显示翻页按钮
        isPaginationEnable:{
            type:Boolean,
            default:true
        },
        //是否显示导航
        isListEnable:{
            type:Boolean,
            default:true
        }
    },
    data(){
        return {
            activeIndex:0,
            baseHeight:105,
            baseCount:3,
            marginTop:0,
            //预览窗口显示
            modal:false,
            //是否显示标题
            isTitleEnable: true,
            show: false,
            //加载失败
            loadfail:false,
            //加载进度
            loading : true,
            //当前状态
            current: {
                title: '',
                src: ''
            },
            slides: [],
            slideInstances: []
        }
    },
    computed: {
        listBoxHeight(){
            return this.baseHeight*this.baseCount-5;
        },
        listBoxStyles(){
            return {
                "height": `${this.listBoxHeight}px`
            };
        },
        listUlStyles () {
            return {
                height:(this.slideInstances && this.slideInstances.length ? this.slideInstances.length * this.baseHeight:0)+'px',
                "margin-top": `${this.marginTop}px`
            };
        }
    },
    mounted () {
        let self = this;
        this.$on('on-picture-item-preview', ({src,title,disabled}) => {
            this.preview({src,title,disabled});
        });

        this.slotChange();
        // console.log(this,"this");
        addEvent(document, 'keyup', this.handleKeyup);
    },
    methods: {
        handleKeyup(e){
            if(!this.modal){
                return;
            }
            let code = e.keyCode ? e.keyCode : e.witch ? e.witch : window.event.keyCode;
            if(code === 37 || code === 38){
                this.prevAction();
            } else if(code === 39 || code === 40){
                this.nextAction();
            }
        },
        //查找子组件
        findChild (cb) {
            const find = function (child) {
                const name = child.$options.componentName;
                //如果组件名存在
                if (name) {
                    cb(child);
                } else if (child.$children.length) {
                    child.$children.forEach((innerChild) => {
                        find(innerChild, cb);
                    });
                }
            };
            //this.$children 当前实例的直接子组件
            if (this.slideInstances.length || !this.$children) {
                this.slideInstances.forEach((child) => {
                    find(child);
                });
            } else {
                this.$children.forEach((child) => {
                    find(child);
                });
            }
        },
        updateSlides (init) {
            if(!this.$children){
                return;
            }
            let slides = [];
            let index = 1;

            //返回指定节点的首个子节点
            this.findChild((child) => {
                slides.push({
                    $el: child.$el
                });
                child.index = index++;

                if (init) {
                    child.imgload = false;
                    this.slideInstances.push(child);
                }
            });
            this.slides = slides;
            // console.log(this.slides,this.slideInstances,"slides");
        },
        //当slot改变时
        slotChange () {
            this.$nextTick(() => {
                this.slides = [];
                this.slideInstances = [];
                this.updateSlides(true);
            });
        },
        updateOffset(){
            if(this.$ref.previewListItem){
            }
        },
        //关闭
        close () {
            this.modal = false
        },
        preview({src,title,disabled}){
            // console.log(src,title,disabled,"src,disabled")
            let child = this.slideInstances.find((item,index) => {
                this.activeIndex = index;
                return item.src === src;
            })
            if(!child){
                console.error("没有查找到所需组件");
                return ;
            }
            if(disabled){
                return;
            }

            this.loading = true;
            this.modal = true;

            if(!child.imgload){
                this.getImage(child.src).then((img) => {
                    child.imgload = true;
                    this.loading = false;
                    this.current.src = child.src;
                    this.current.title = child.title;
                },(err) => {
                    this.loading = false;
                    this.loadfail = true;
                });
            } else {
                this.loading = false;
                this.current.src = child.src;
                this.current.title = child.title;
            }
        },
        //获取图片
        getImage (src) {
            return new Promise(function (resolve, reject) {
                const img = new window.Image()
                img.src = src
                img.onload = function () {
                    resolve(img)
                }
                img.onerror = function (e) {
                    reject(e)
                }
            })
        },
        prevAction(){
            if(!this.slideInstances.length){
                return
            }
            let len = this.slideInstances.length-1;
            if( this.activeIndex > 0 ){
                this.activeIndex = this.activeIndex-1;
                this.move('prev')
            }
            this.preview(this.slideInstances[this.activeIndex]);
        },
        nextAction(){
            if(!this.slideInstances.length){
                return
            }
            let len = this.slideInstances.length-1;
            if( this.activeIndex < len ){
                this.activeIndex = this.activeIndex+1;
                this.move('next')
            }
            this.preview(this.slideInstances[this.activeIndex]);
        },
        prevImg(){
            if(!this.slideInstances.length){
                return
            }
            this.move('prev');
        },
        nextImg(){
            if(!this.slideInstances.length){
                return
            }
            this.move('next')
        },
        move(direction){
            let boxHeight = this.baseHeight*this.baseCount;
            let listHeight = this.baseHeight* this.slideInstances.length;
            let surplusHeight = boxHeight-listHeight;
            if(direction === "next" && surplusHeight < 0){
                if(surplusHeight < this.marginTop){
                    this.marginTop = this.marginTop- this.baseHeight;
                }
            } else if(direction === "prev" &&  surplusHeight< 0){
                if(this.marginTop< 0){
                    this.marginTop = this.marginTop + this.baseHeight;
                }
            }
        }
    },
    beforeDestroy () {
        removeEvent(document, 'keyup', this.handleKeyup);
    }

}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
    transition: opacity .5s
}
.fade-enter, .fade-leave-active {
    opacity: 0
}
.preview-wrapper{position: fixed;top: 0;left: 0;width: 100%;height: 100%;text-align: center;box-sizing: border-box;
    background:rgba(229,229,229,.95);z-index: 10000;
}
.preview-loading {position: absolute;width: 30px;height: 35px;top: 50%;left: 50%;margin-top: -17.5px;margin-left: -15px;}
.preview-loading > i {display: inline-block;height: 25px;width: 25px;background: transparent;border-radius: 100%;
    border: 2px solid #444;border-bottom-color: transparent;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
    -webkit-animation: rotate 0.75s 0s linear infinite;
    animation: rotate 0.75s 0s linear infinite;
}
@keyframes rotate {
    0% {
        -webkit-transform: rotate(0deg) scale(1);
        transform: rotate(0deg) scale(1);
    }
    50% {
        -webkit-transform: rotate(180deg) scale(1);
        transform: rotate(180deg) scale(1);
    }
    100% {
        -webkit-transform: rotate(360deg) scale(1);
        transform: rotate(360deg) scale(1);
    }
}
.preview-wrapper-box{position: relative;width:calc(100% - 200px);background-color: #fff;
    min-height:100%;
}
.preview-title {text-align: center;width: 100%;color: #444;/* position: absolute;left: 0;top: 0; */
    box-sizing: border-box;font-size: 16px;line-height: 25px;padding-top: 20px;overflow:hidden;white-space: nowrap;
    text-overflow: ellipsis;
}
.preview-img {max-width: 100%;max-height: 100%;display: block;position: absolute;left: 0;top: 0;bottom: 0;right: 0;margin: auto;}
.preview-close{font-size:40px;color:#444;width: 50px;height:50px;text-decoration: none;
    position:absolute;right:10px;top:0px;
    display:inline-block;vertical-align:top;
}

.preview-close-icon{display:inline-block;vertical-align: top;position: relative;top:-10px;}
.preview-nav-arrow {position: absolute;top: 50%;margin-top: -20px;background: rgba(0, 0, 0, 0);line-height: 40px;
    width: 30px;height: 30px;border-top: 2px solid #444;border-left: 2px solid #444;
}
.preview-nav-left,
.preview-nav-right {position: absolute;height: 100%;top: 0;color: #fff;transition: opacity .2s;}
.preview-nav-left {left: 0;}
.preview-nav-left .preview-nav-arrow {left: 0;margin-left: 30px;transform: rotate(-45deg);}
.preview-nav-right {right: 0;}
.preview-nav-right .preview-nav-arrow {right: 0;margin-right: 30px;transform: rotate(135deg);}
.preview-list{width:200px;position:fixed;top:0;right:0;bottom:0;flex-direction:column;justify-content: center;display: flex;}
.preview-list-box{width:100%;overflow: hidden;}
.preview-list-ul{text-align:center;height:310px;overflow: hidden;
    transition: margin-top .5s ease-in-out;
}
.preview-list-item{width:100px;height: 100px;overflow:hidden;margin: 0 auto 5px;display: flex;justify-content:center;align-items: center;}
.preview-list-item img {max-width:100%;max-height:100%;cursor:pointer;}
.preview-list-box-btn{padding:10px 10px;display:inline-block;color: #444;}
.preview-list-box-btn.disabled,
.preview-nav-left.disabled,
.preview-nav-right.disabled{
    opacity:0.2
}
</style>

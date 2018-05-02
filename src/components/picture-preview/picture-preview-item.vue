<template lang="html">
    <div @click.stop="handleClick">
        <slot></slot>
    </div>
</template>

<script>
import Emitter from "@/mixins/emitter"
export default {
    componentName: 'picture-preview-item',
    name:"PicturePreviewItem",
    mixins: [ Emitter ],
    props:{
        src:{
            type:String,
            require:true,
            default:""
        },
        disabled: {
            type: Boolean,
            default: false
        },
        title:{
            type:String,
            default:""
        }
    },
    mounted () {
        this.$parent.slotChange();
    },
    methods:{
        handleClick () {
            if (this.disabled) return;

            let parent = this.$parent;
            let name = parent.$options.name;
            while (parent && (!name || name !== 'PicturePreview')) {
                parent = parent.$parent;
                if (parent) name = parent.$options.name;
            }
            if (parent) {
                this.dispatch('PicturePreview', 'on-picture-item-preview', {src:this.src,disabled:this.disabled,title:this.title});
            }
        }
    },
    beforeDestroy () {
        this.$parent.slotChange();
    }
}
</script>

<style lang="css">
</style>

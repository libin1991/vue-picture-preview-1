import PicturePreview from './picture-preview.vue'
import PicturePreviewItem from './picture-preview-item.vue'
export default {
    install: function (Vue, options) {
        //注册组件
        Vue.component('picture-preview', PicturePreview);
        Vue.component('picture-preview-item', PicturePreviewItem);
    }
};

// auto install
// if (typeof window !== 'undefined' && window.Vue) {
//     install(window.Vue);
// }

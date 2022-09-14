import router from '@/router'

router.beforeEach(async(to, from, next) => {
    window.document.title = to.meta.title
    next()
})

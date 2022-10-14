import router from '@/router'
import { decrypt, getToken, httpRequest, removeToken, setToken } from '@/utils/auth'

const whiteList = ['/screen_login']

router.beforeEach(async(to, from, next) => {
  if (to.query.token && to.query.token !== '') {
    setToken(to.query.token)
    if (!localStorage.getItem('audio')) {
      localStorage.setItem('audio', true)
      localStorage.setItem('audio_num', 10)
    }
    httpRequest('/api/login/user/info', {}, false).then(res => {
      sessionStorage.setItem('screen_role', res.data)
      const info = JSON.parse(decrypt(res.data))
      httpRequest('/api/sys/school/schoolInfo', {
        sclId: info.scl_id
      }).then((ret) => {
        const type = JSON.parse(decrypt(ret.data))
        localStorage.setItem('equ_type', Number(type.equ_apply_type))
        if (Number(type.equ_apply_type) === 0) {
          next({ path: '/audio_index' })
        } else {
          if (type.video_formart) {
            if (Number(type.video_formart) === 0) {
              next({ path: '/screen_index' })
            } else {
              next({ path: '/screen_rtsp' })
            }
          } else {
            next({ path: '/screen_rtsp' })
          }
        }
      })
    }).catch(() => {
    })
  }
  const hasToken = getToken()
  if (hasToken) {
    if (to.path === '/screen_login') {
      next()
    } else {
      try {
        // 发起请求获取用户信息
        httpRequest('/api/login/user/info', {}, false).then(res => {
          sessionStorage.setItem('screen_role', res.data)
          const info = JSON.parse(decrypt(res.data))
          httpRequest('/api/sys/school/schoolInfo', {
            sclId: info.scl_id
          }).then((ret) => {
            const type = JSON.parse(decrypt(ret.data))
            if (Number(type.equ_apply_type) !== Number(localStorage.getItem('equ_type'))) {
              removeToken()
              next({ path: '/screen_login' })
            }
          })
          // console.log(JSON.parse(decrypt(res.data)), '发起请求获取用户信息')
          next()
        }).catch(() => {
          removeToken()
          next('/screen_login')
        })
      } catch (error) {
        removeToken()
        next('/screen_login')
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next({ path: '/screen_login' })
    }
  }
})

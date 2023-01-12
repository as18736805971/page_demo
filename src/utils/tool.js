/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
    return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * 将base64转换为File文件类型
 * @param urlData  base64 地址
 * @param imgName  文件名
 * @returns {File}
 */
export function dataURLtoFile(urlData, imgName) {
    let arr = urlData.split(',')
    let mime = arr[0].match(/:(.*?);/)[1]
    let bstr = atob(arr[1])
    let n = bstr.length
    let u8arr = new Uint8Array(n)
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
    }
    // File文件类型  Blob类型
    // 字节 文件名 文件类型
    return new File([u8arr], imgName, { type: mime })
}

/**
 * 压缩图片
 * @param   file 文件地址
 * @options options.width 裁剪比例 options.quality 保持原质量
 * @returns {Promise<unknown>}
 */
export function compressImg(file, options){
    var src;
    var files;
    var fileSize = parseFloat(parseInt(file['size'])/1024/1024).toFixed(2);
    var read = new FileReader();
    read.readAsDataURL(file);
    return new Promise(function(resolve, reject){
        read.onload = function (e) {
            var img = new Image();
            img.src = e.target.result;
            img.onload = function(){
                //默认按比例压缩
                var w = this.width,
                    h = this.height,
                    scale = w / h;
                w = options.width || w;
                h = options.height || (w / scale);
                //生成canvas
                var canvas = document.createElement('canvas');
                var ctx = canvas.getContext('2d');
                var base64;
                // 创建属性节点
                canvas.setAttribute("width", w);
                canvas.setAttribute("height", h);
                ctx.drawImage(this, 0, 0, w, h);
                base64 = canvas.toDataURL(file['type'], options.quality);
                // if(fileSize<1){
                //     //如果图片小于一兆 那么不执行压缩操作
                //     base64 = canvas.toDataURL(file['type'], 1);
                // }else if(fileSize>1&&fileSize<2){
                //     //如果图片大于1M并且小于2M 那么压缩0.5
                //     base64 = canvas.toDataURL(file['type'], 0.5);
                // }else{
                //     //如果图片超过2m 那么压缩0.2
                //     base64 = canvas.toDataURL(file['type'], 0.2);
                // }
                // 回调函数返回file的值（将base64编码转成file）
                files = dataURLtoFile(base64, file.name); //如果后台接收类型为base64的话这一步可以省略
                resolve(files)
            };
        };
    })
}

/**
 * 获取当前经纬度
 */
export function getCoords() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                console.log(position.coords.accuracy, '精准度')
                let arr = [position.coords.longitude, position.coords.latitude]
                resolve(arr)
            }, function (err) {
                let msg = '未自动定位到当前坐标点，请自行选择坐标点。'
                if (err.code === 1) {
                    msg = '用户拒绝浏览器获取位置信息，请自行选择坐标点。'
                }
                reject(msg)
            }, {
                // enableHighAccuracy: true,
                // Geolocation: true
            })
        } else {
            reject('你的浏览器不支持当前地理位置信息获取。')
        }
    })
}


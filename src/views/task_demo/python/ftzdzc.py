import requests
import random
import time
import string
import json
import base64
import logging
import os
import traceback
import uuid
from io import BytesIO
from PIL import Image, ImageFilter, ImageChops, ImageOps
import numpy as np

import re
from datetime import datetime
import cv2  # 取消注释
from skimage.metrics import structural_similarity as ssim  # 取消注释
from scipy.ndimage import gaussian_filter  # 用于高斯滤波
from collections import deque  # 用于滑动窗口分析

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("foton_verification.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger("FotonVerifier")

class FotonVerifier:
    """福田验证码验证和短信获取类"""
    
    BASE_URL = "https://czyl.foton.com.cn/ehomes-new/homeManager"
    USER_AGENT = "Feature_Alimighty/7.4.9 (iPhone; iOS 17.2.1; Scale/3.00)"
    
    
    
    def __init__(self, phone_number=None):
        """初始化验证器"""
        self.phone_number = phone_number
        self.successful_distances = []
        # 生成一个固定的Cookie，整个流程中使用相同的Cookie
        hwwafsesid = ''.join(random.choices(string.ascii_lowercase + string.digits, k=20))
        hwwafsestime = str(int(time.time() * 1000))
        self.cookie = f"HWWAFSESID={hwwafsesid}; HWWAFSESTIME={hwwafsestime}"
        self.error_count = 0
        self.last_error_type = None
        
        # 自适应阈值参数
        self.edge_threshold = 50  # 边缘检测阈值
        self.ssim_threshold = 0.3  # 结构相似性阈值
        self.hist_threshold = 0.5  # 直方图相似性阈值
        
        # 特征权重 - 初始值
        self.feature_weights = {
            'edge': 0.3,
            'color': 0.3,
            'texture': 0.4
        }
        
        # 历史匹配结果队列 - 用于动态调整参数
        self.match_history = deque(maxlen=10)
        
        # 创建调试目录
        self.debug_dirs = ["debug_background", "debug_slide", "debug_result"]
        for dir_name in self.debug_dirs:
            os.makedirs(dir_name, exist_ok=True)
        # 确保debug_result目录存在
        os.makedirs("debug_result", exist_ok=True)
        
        logger.info(f"初始化生成固定Cookie: {self.cookie}")
        logger.info(f"初始化自适应阈值: 边缘={self.edge_threshold}, SSIM={self.ssim_threshold}, 直方图={self.hist_threshold}")
        logger.info(f"初始特征权重: {self.feature_weights}")
    
    def get_cookie(self):
        """获取当前Cookie"""
        return self.cookie
    
    def get_headers(self):
        """获取请求头"""
        # 生成请求数据的JSON字符串用于计算Content-Length
        data = {
            "smsCode": "",  # 实际值会在请求时填充
            "version_code": "562",
            "version_name": "7.4.9",
            "regSourceType": "0698",
            "deviceSystem": "17.2.1",
            "safeEnc": int(time.time() * 1000),
            "recommender": "",
            "device_type": "0",
            "idCard": "",
            "ip": "127.0.0.1",
            "tel": self.phone_number if self.phone_number else "",
            "dealerCode": "",
            "idType": "",
            "device_id": str(uuid.uuid4()).upper(),
            "device_model": "iPhone13,4"
        }
        # 计算实际请求体的UTF-8编码字节长度
        content_length = len(json.dumps(data, ensure_ascii=False).encode('utf-8'))
        
        return {
            "POST": "/ehomes-new/homeManager/regMember2nd HTTP/1.1",
            "Host": "czyl.foton.com.cn",
            "Content-Type": "application/json",
            "Content-Length": str(content_length),
            "Cookie": self.cookie,
            "Connection": "keep-alive",
            "Accept": "*/*",
            "User-Agent": self.USER_AGENT,
            "Accept-Language": "zh-Hans-CN;q=1",
            "Accept-Encoding": "gzip, deflate, br"
        }
    
    def get_foton_img(self):
        """获取验证码图片"""
        url = f"{self.BASE_URL}/getImg"
        
        try:
            response = requests.post(url, headers=self.get_headers(), json={}, timeout=10)
            logger.info(f"获取验证码图片响应状态码: {response.status_code}")
            
            response_data = response.json()
            logger.debug(f"完整响应数据: {json.dumps(response_data)}")
            
            result = {
                "data": {
                    "token": None,
                    "images": []
                }
            }
            
            if "imgXKey" in response_data:
                result["data"]["token"] = response_data["imgXKey"]
            elif "data" in response_data and "token" in response_data["data"]:
                result["data"]["token"] = response_data["data"]["token"]
            
            if isinstance(response_data, dict):
                for key, value in response_data.items():
                    logger.info(f"处理键: {key}")
                    if isinstance(value, str) and value.startswith(('data:image', 'iVBOR')):
                        image_type = "slide" if key in ["newImage", "slideImage"] else "background"
                        logger.info(f"找到{image_type}图({key})，长度: {len(value)}")
                        result["data"]["images"].append({
                            "type": image_type,
                            "field": key,
                            "data": value.split(',')[1] if ',' in value else value
                        })
            
            if not result["data"]["token"]:
                logger.error("未找到token")
                return {"error": "未找到token"}
            
            if not result["data"]["images"]:
                logger.error("未找到任何图片数据")
                return {"error": "未找到图片数据"}
            
            if len(result["data"]["images"]) != 2:
                logger.warning(f"警告：获取到 {len(result['data']['images'])} 张图片，期望获取2张")
            
            logger.info(f"成功获取到 {len(result['data']['images'])} 张图片：")
            for img in result["data"]["images"]:
                logger.info(f"- {img['type']}图 (字段: {img['field']})")
            
            return result
            
        except requests.RequestException as e:
            logger.error(f"请求异常: {str(e)}")
            return {"error": f"请求失败: {str(e)}"}
    
    def preprocess_image(self, img):
        """增强的图像预处理"""
        # 转换为灰度图
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        
        # 应用多种滤波方法增强图像质量
        blur = cv2.GaussianBlur(gray, (5, 5), 0)  # 高斯模糊
        median = cv2.medianBlur(gray, 5)  # 中值滤波去噪
        bilateral = cv2.bilateralFilter(gray, 9, 75, 75)  # 双边滤波保留边缘
        
        # 自适应阈值处理
        thresh1 = cv2.adaptiveThreshold(blur, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2)
        thresh2 = cv2.adaptiveThreshold(median, 255, cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY, 11, 2)
        
        # 组合阈值结果
        combined_thresh = cv2.bitwise_and(thresh1, thresh2)
        
        # 增强的边缘检测
        edges = cv2.Canny(combined_thresh, 50, 150)
        
        # 形态学操作增强边缘
        kernel = np.ones((3, 3), np.uint8)
        edges = cv2.dilate(edges, kernel, iterations=1)
        edges = cv2.erode(edges, kernel, iterations=1)
        
        # 返回增强后的边缘图和多种预处理结果
        return edges, gray, bilateral, combined_thresh

    def detect_gap_position(self, background_img, slide_img):
        """增强的多特征融合算法检测缺口位置"""
        try:
            # 可添加缓存机制，避免重复计算
            if hasattr(self, 'last_bg_img') and np.array_equal(background_img, self.last_bg_img):
                return self.last_result
                
            # 转换为灰度图
            bg_gray = cv2.cvtColor(background_img, cv2.COLOR_BGR2GRAY)
            slide_gray = cv2.cvtColor(slide_img, cv2.COLOR_BGR2GRAY)
            
            # 保存调试图片
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S_%f")
            
            # 保存原始背景图和滑块图
            cv2.imwrite(f"debug_background/bg_{timestamp}.png", background_img)
            cv2.imwrite(f"debug_slide/slide_{timestamp}.png", slide_img)
            
            # 1. 增强的差异图像分析
            # 对背景图进行高斯模糊，减少噪声影响
            bg_blur = cv2.GaussianBlur(bg_gray, (5, 5), 0)
            
            # 对滑块图进行多级边缘增强
            slide_enhanced = cv2.Laplacian(slide_gray, cv2.CV_64F)
            slide_enhanced = np.uint8(np.absolute(slide_enhanced))
            
            # 自适应二值化处理 - 更好地适应不同亮度条件
            slide_binary = cv2.adaptiveThreshold(slide_gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, 
                                                cv2.THRESH_BINARY, 11, 2)
            
            # 形态学操作增强滑块轮廓
            kernel = np.ones((3,3), np.uint8)
            slide_morph = cv2.morphologyEx(slide_binary, cv2.MORPH_CLOSE, kernel)
            slide_morph = cv2.morphologyEx(slide_morph, cv2.MORPH_OPEN, kernel)
            
            # 保存处理后的中间结果
            cv2.imwrite(os.path.join("debug_result", f"edges_{timestamp}.png"), np.hstack((
                cv2.Canny(background_img, 50, 150),
                cv2.Canny(slide_img, 50, 150)
            )))
            
            # 2. 增强的颜色特征分析
            # 转换为HSV色彩空间进行颜色分析
            bg_hsv = cv2.cvtColor(background_img, cv2.COLOR_BGR2HSV)
            slide_hsv = cv2.cvtColor(slide_img, cv2.COLOR_BGR2HSV)
            
            # 计算滑块的颜色直方图 - 分别计算H、S、V三个通道
            slide_h_hist = cv2.calcHist([slide_hsv], [0], None, [36], [0, 180])
            slide_s_hist = cv2.calcHist([slide_hsv], [1], None, [25], [0, 256])
            slide_v_hist = cv2.calcHist([slide_hsv], [2], None, [25], [0, 256])
            
            # 归一化直方图
            cv2.normalize(slide_h_hist, slide_h_hist, 0, 1, cv2.NORM_MINMAX)
            cv2.normalize(slide_s_hist, slide_s_hist, 0, 1, cv2.NORM_MINMAX)
            cv2.normalize(slide_v_hist, slide_v_hist, 0, 1, cv2.NORM_MINMAX)
            
            # 计算滑块的平均颜色和标准差 - 灰度图
            slide_mean, slide_std = cv2.meanStdDev(slide_gray)
            
            # 在背景图上滑动窗口，寻找与滑块相似的区域
            slide_height, slide_width = slide_gray.shape
            best_gap_x = 0
            best_gap_score = float('-inf')
            
            # 3. 多特征融合滑动窗口分析
            for x in range(0, bg_gray.shape[1] - slide_width, 1):  # 步长为1，提高精度
                # 提取窗口
                window = bg_blur[0:slide_height, x:x+slide_width]
                window_hsv = bg_hsv[0:slide_height, x:x+slide_width]
                
                # 3.1 颜色分布特征分析
                # 计算窗口的颜色统计特征 - 灰度图
                window_mean, window_std = cv2.meanStdDev(window)
                
                # 计算颜色分布差异
                mean_diff = abs(window_mean[0][0] - slide_mean[0][0])
                std_diff = abs(window_std[0][0] - slide_std[0][0])
                
                # 计算HSV颜色直方图
                window_h_hist = cv2.calcHist([window_hsv], [0], None, [36], [0, 180])
                window_s_hist = cv2.calcHist([window_hsv], [1], None, [25], [0, 256])
                window_v_hist = cv2.calcHist([window_hsv], [2], None, [25], [0, 256])
                
                # 归一化直方图
                cv2.normalize(window_h_hist, window_h_hist, 0, 1, cv2.NORM_MINMAX)
                cv2.normalize(window_s_hist, window_s_hist, 0, 1, cv2.NORM_MINMAX)
                cv2.normalize(window_v_hist, window_v_hist, 0, 1, cv2.NORM_MINMAX)
                
                # 计算HSV直方图相似度 - 使用相关性方法
                h_correl = cv2.compareHist(slide_h_hist, window_h_hist, cv2.HISTCMP_CORREL)
                s_correl = cv2.compareHist(slide_s_hist, window_s_hist, cv2.HISTCMP_CORREL)
                v_correl = cv2.compareHist(slide_v_hist, window_v_hist, cv2.HISTCMP_CORREL)
                
                # 计算HSV直方图相似度 - 使用交叉核方法
                h_inter = cv2.compareHist(slide_h_hist, window_h_hist, cv2.HISTCMP_INTERSECT)
                s_inter = cv2.compareHist(slide_s_hist, window_s_hist, cv2.HISTCMP_INTERSECT)
                v_inter = cv2.compareHist(slide_v_hist, window_v_hist, cv2.HISTCMP_INTERSECT)
                
                # 综合HSV颜色得分 - 加权平均
                hsv_score = (h_correl * 0.3 + s_correl * 0.4 + v_correl * 0.3) * 0.6 + \
                           (h_inter * 0.3 + s_inter * 0.4 + v_inter * 0.3) * 0.4
                
                # 3.2 纹理特征分析
                # 计算局部对比度
                local_contrast = np.std(window) / (np.mean(window) + 1e-10)
                
                # 计算边缘特征相似度
                window_edges = cv2.Canny(window, 50, 150)
                slide_edges = cv2.Canny(slide_gray, 50, 150)
                edge_diff = cv2.absdiff(window_edges, slide_edges)
                edge_score = 1.0 - np.sum(edge_diff) / (slide_width * slide_height * 255)
                
                # 计算像素级差异 - 使用结构相似性指标
                if window.shape == slide_gray.shape:
                    ssim_score = ssim(window, slide_gray)
                else:
                    continue
                
                # 3.3 综合得分 - 加权组合多种特征
                gap_score = (ssim_score * 0.3 +                # 结构相似性 
                           edge_score * 0.2 +                # 边缘特征
                           hsv_score * 0.3 +                 # HSV颜色特征
                           (1.0 - mean_diff/255) * 0.1 +    # 灰度均值差异
                           (1.0 - std_diff/128) * 0.1)      # 灰度标准差差异
                
                # 更新最佳匹配
                if gap_score > best_gap_score:
                    best_gap_score = gap_score
                    best_gap_x = x
            
            # 4. 增强的形状轮廓匹配
            # 对滑块进行轮廓检测 - 使用增强后的二值图
            slide_contours, _ = cv2.findContours(slide_morph, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
            
            # 如果找到轮廓，使用轮廓特征进行匹配
            if slide_contours:
                # 筛选主要轮廓 - 面积最大的前3个轮廓
                slide_contours = sorted(slide_contours, key=cv2.contourArea, reverse=True)[:3]
                
                # 计算滑块轮廓的特征
                slide_features = []
                for contour in slide_contours:
                    # 计算轮廓面积
                    area = cv2.contourArea(contour)
                    # 计算轮廓周长
                    perimeter = cv2.arcLength(contour, True)
                    # 计算轮廓的形状因子 (圆形度)
                    circularity = 4 * np.pi * area / (perimeter * perimeter + 1e-6)
                    # 计算轮廓的Hu矩
                    moments = cv2.moments(contour)
                    if moments['m00'] != 0:
                        hu_moments = cv2.HuMoments(moments)
                    else:
                        hu_moments = np.zeros((7, 1))
                    
                    slide_features.append({
                        'contour': contour,
                        'area': area,
                        'perimeter': perimeter,
                        'circularity': circularity,
                        'hu_moments': hu_moments
                    })
                
                # 在背景图上滑动窗口，比较轮廓特征
                contour_best_x = 0
                contour_best_score = float('-inf')
                
                # 在最佳匹配附近进行精细搜索
                search_range = 40  # 搜索范围
                for x in range(max(0, best_gap_x-search_range), min(bg_gray.shape[1]-slide_width, best_gap_x+search_range), 2):
                    # 提取窗口并进行预处理
                    window = bg_blur[0:slide_height, x:x+slide_width]
                    
                    # 自适应二值化
                    window_binary = cv2.adaptiveThreshold(window, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, 
                                                        cv2.THRESH_BINARY, 11, 2)
                    
                    # 形态学操作
                    window_morph = cv2.morphologyEx(window_binary, cv2.MORPH_CLOSE, kernel)
                    window_morph = cv2.morphologyEx(window_morph, cv2.MORPH_OPEN, kernel)
                    
                    # 查找轮廓
                    window_contours, _ = cv2.findContours(window_morph, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
                    
                    if window_contours:
                        # 筛选主要轮廓
                        window_contours = sorted(window_contours, key=cv2.contourArea, reverse=True)[:3]
                        
                        # 计算窗口轮廓的特征
                        window_features = []
                        for contour in window_contours:
                            area = cv2.contourArea(contour)
                            perimeter = cv2.arcLength(contour, True)
                            circularity = 4 * np.pi * area / (perimeter * perimeter + 1e-6)
                            moments = cv2.moments(contour)
                            if moments['m00'] != 0:
                                hu_moments = cv2.HuMoments(moments)
                            else:
                                hu_moments = np.zeros((7, 1))
                            
                            window_features.append({
                                'contour': contour,
                                'area': area,
                                'perimeter': perimeter,
                                'circularity': circularity,
                                'hu_moments': hu_moments
                            })
                        
                        # 计算轮廓特征的相似度
                        max_contour_score = 0
                        for s_feature in slide_features:
                            for w_feature in window_features:
                                # 计算面积相似度
                                area_ratio = min(s_feature['area'], w_feature['area']) / max(s_feature['area'], w_feature['area'] + 1e-6)
                                
                                # 计算周长相似度
                                perimeter_ratio = min(s_feature['perimeter'], w_feature['perimeter']) / max(s_feature['perimeter'], w_feature['perimeter'] + 1e-6)
                                
                                # 计算圆形度相似度
                                circularity_diff = abs(s_feature['circularity'] - w_feature['circularity'])
                                circularity_score = 1.0 / (1.0 + circularity_diff)
                                
                                # 计算Hu矩的相似度
                                hu_distance = np.sum(np.abs(s_feature['hu_moments'] - w_feature['hu_moments']))
                                hu_score = 1.0 / (1.0 + hu_distance)
                                
                                # 综合轮廓得分
                                contour_score = (area_ratio * 0.3 + 
                                               perimeter_ratio * 0.2 + 
                                               circularity_score * 0.2 + 
                                               hu_score * 0.3)
                                
                                max_contour_score = max(max_contour_score, contour_score)
                        
                        if max_contour_score > contour_best_score:
                            contour_best_score = max_contour_score
                            contour_best_x = x
                
                # 如果轮廓匹配得分较高，调整最佳位置
                if contour_best_score > 0.6:
                    logger.info(f"轮廓匹配位置: {contour_best_x}, 得分: {contour_best_score:.4f}")
                    # 融合两种方法的结果 - 根据得分动态调整权重
                    weight_ratio = min(contour_best_score / (best_gap_score + 1e-6), 0.7)  # 限制轮廓匹配的最大权重
                    best_gap_x = int(best_gap_x * (1 - weight_ratio) + contour_best_x * weight_ratio)
            
            # 保存最终匹配结果
            result_img = background_img.copy()
            cv2.rectangle(result_img, (best_gap_x, 0), (best_gap_x + slide_width, slide_height), (0, 0, 255), 2)
            
            # 保存带标记的结果图
            cv2.imwrite(os.path.join("debug_result", f"result_{timestamp}.png"), result_img)
            
            # 保存特征匹配过程的可视化结果
            debug_img = np.hstack((
                background_img,
                cv2.cvtColor(slide_edges, cv2.COLOR_GRAY2BGR),
                result_img
            ))
            cv2.imwrite(os.path.join("debug_result", f"debug_result_{timestamp}.png"), debug_img)
            
            # 保存匹配分数信息到文本文件
            with open(f"debug_result/scores_{timestamp}.txt", "w") as f:
                f.write(f"最佳匹配位置: {best_gap_x}\n")
                f.write(f"匹配分数: {best_gap_score:.4f}\n")
                f.write(f"轮廓匹配分数: {contour_best_score if 'contour_best_score' in locals() else 0:.4f}\n")
            
            logger.info(f"缺口检测最终位置: {best_gap_x}, 得分: {best_gap_score:.4f}")
            
            # 在方法结束时缓存结果
            self.last_bg_img = background_img.copy()
            self.last_result = best_gap_x
            return best_gap_x
            
        except Exception as e:
            logger.error(f"缺口检测失败: {str(e)}")
            logger.error(traceback.format_exc())
            return None
    
    def analyze_image(self, image_data):
        """分析图片，使用增强的多特征融合算法精确定位滑块位置"""
        try:
            if not image_data or not isinstance(image_data, list):
                logger.warning("图片数据为空或格式不正确，无法分析")
                return None
            
            background_img = None
            slide_img = None
            
            # 解析并保存图片
            for img in image_data:
                image_base64 = img["data"]
                image_type = img["type"]
                
                if "," in image_base64:
                    image_base64 = image_base64.split(",")[1]
                
                image_base64 = re.sub(r'\s+', '', image_base64)
                image_bytes = base64.b64decode(image_base64)
                nparr = np.frombuffer(image_bytes, np.uint8)
                img_cv = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
                
                if image_type == "background":
                    background_img = img_cv
                elif image_type == "slide":
                    slide_img = img_cv
            
            if background_img is None or slide_img is None:
                logger.error("无法获取完整的图片数据")
                return None
                
            # 保存原始图像用于调试和分析
            timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
            debug_dir = "captcha_images"
            debug_bg_dir = "debug_background"
            debug_slide_dir = "debug_slide"
            os.makedirs(debug_dir, exist_ok=True)
            os.makedirs(debug_bg_dir, exist_ok=True)
            os.makedirs(debug_slide_dir, exist_ok=True)
            cv2.imwrite(f"{debug_dir}/bg_{timestamp}.png", background_img)
            cv2.imwrite(f"{debug_dir}/slide_{timestamp}.png", slide_img)
            cv2.imwrite(f"{debug_bg_dir}/debug_background_{timestamp}.png", background_img)
            cv2.imwrite(f"{debug_slide_dir}/debug_slide_{timestamp}.png", slide_img)

            # 对背景图和滑块图进行增强预处理
            bg_edges, bg_gray, bg_bilateral, bg_thresh = self.preprocess_image(background_img)
            slide_edges, slide_gray, slide_bilateral, slide_thresh = self.preprocess_image(slide_img)

            # 保存预处理结果用于调试
            cv2.imwrite(f"{debug_dir}/bg_edges_{timestamp}.png", bg_edges)
            cv2.imwrite(f"{debug_dir}/slide_edges_{timestamp}.png", slide_edges)
            cv2.imwrite(f"{debug_dir}/bg_thresh_{timestamp}.png", bg_thresh)
            
            # 增强的像素级精准比对 - 缺口检测
            gap_x = self.detect_gap_position(background_img, slide_img)
            if gap_x:
                logger.info(f"缺口检测算法找到的位置: {gap_x}")
                # 将缺口检测结果添加到可能的位置列表
                gap_positions = [gap_x, gap_x-2, gap_x+2, gap_x-5, gap_x+5]

            # 获取滑块尺寸
            slide_height, slide_width = slide_edges.shape

            # 确保背景图尺寸大于滑块图
            if bg_edges.shape[0] < slide_height or bg_edges.shape[1] < slide_width:
                logger.error("背景图尺寸小于滑块图，无法进行模板匹配")
                return None

            # 1. 多尺度模板匹配 - 边缘特征
            edge_best_x = 0
            edge_best_score = -1
            scales = [0.85, 0.9, 0.95, 1.0, 1.05, 1.1, 1.15]  # 增加更多缩放比例

            for scale in scales:
                # 缩放滑块图片
                scaled_slide = cv2.resize(slide_edges, (int(slide_width * scale), int(slide_height * scale)))
                scaled_height, scaled_width = scaled_slide.shape

                # 确保背景图尺寸大于缩放后的滑块图
                if bg_edges.shape[0] < scaled_height or bg_edges.shape[1] < scaled_width:
                    continue

                # 模板匹配 - 尝试多种匹配方法
                methods = [cv2.TM_CCOEFF_NORMED, cv2.TM_CCORR_NORMED]
                for method in methods:
                    result = cv2.matchTemplate(bg_edges, scaled_slide, method)
                    min_val, max_val, min_loc, max_loc = cv2.minMaxLoc(result)

                    if max_val > edge_best_score:
                        edge_best_score = max_val
                        edge_best_x = max_loc[0]
                        logger.info(f"边缘匹配 - 方法:{method}, 缩放:{scale}, 得分:{max_val:.4f}, 位置:{max_loc[0]}")

            # 2. 颜色特征分析
            color_best_x = 0
            color_best_score = -1
            
            # 提取颜色特征 - 使用HSV色彩空间
            bg_hsv = cv2.cvtColor(background_img, cv2.COLOR_BGR2HSV)
            slide_hsv = cv2.cvtColor(slide_img, cv2.COLOR_BGR2HSV)
            
            # 计算滑块的颜色直方图
            slide_h_hist = cv2.calcHist([slide_hsv], [0], None, [180], [0, 180])
            slide_s_hist = cv2.calcHist([slide_hsv], [1], None, [256], [0, 256])
            slide_v_hist = cv2.calcHist([slide_hsv], [2], None, [256], [0, 256])
            
            # 归一化直方图
            cv2.normalize(slide_h_hist, slide_h_hist, 0, 1, cv2.NORM_MINMAX)
            cv2.normalize(slide_s_hist, slide_s_hist, 0, 1, cv2.NORM_MINMAX)
            cv2.normalize(slide_v_hist, slide_v_hist, 0, 1, cv2.NORM_MINMAX)
            
            # 在背景图上滑动窗口，比较颜色直方图
            search_range = range(max(0, edge_best_x - 50), min(bg_hsv.shape[1] - slide_width, edge_best_x + 50))
            for x in search_range:
                # 提取窗口
                window_hsv = bg_hsv[:slide_hsv.shape[0], x:x+slide_hsv.shape[1]]
                
                # 计算窗口的颜色直方图
                window_h_hist = cv2.calcHist([window_hsv], [0], None, [180], [0, 180])
                window_s_hist = cv2.calcHist([window_hsv], [1], None, [256], [0, 256])
                window_v_hist = cv2.calcHist([window_hsv], [2], None, [256], [0, 256])
                
                # 归一化直方图
                cv2.normalize(window_h_hist, window_h_hist, 0, 1, cv2.NORM_MINMAX)
                cv2.normalize(window_s_hist, window_s_hist, 0, 1, cv2.NORM_MINMAX)
                cv2.normalize(window_v_hist, window_v_hist, 0, 1, cv2.NORM_MINMAX)
                
                # 计算直方图相似度
                h_score = cv2.compareHist(slide_h_hist, window_h_hist, cv2.HISTCMP_CORREL)
                s_score = cv2.compareHist(slide_s_hist, window_s_hist, cv2.HISTCMP_CORREL)
                v_score = cv2.compareHist(slide_v_hist, window_v_hist, cv2.HISTCMP_CORREL)
                
                # 综合颜色得分 - 加权平均
                color_score = (h_score * 0.5 + s_score * 0.3 + v_score * 0.2)
                
                if color_score > color_best_score:
                    color_best_score = color_score
                    color_best_x = x
            
            logger.info(f"颜色匹配 - 最佳得分:{color_best_score:.4f}, 位置:{color_best_x}")

            # 3. 纹理特征分析 - 使用LBP(局部二值模式)
            texture_best_x = 0
            texture_best_score = -1
            
            # 在精确范围内进行纹理特征匹配
            fine_range = 30
            search_start = max(0, edge_best_x - fine_range)
            search_end = min(bg_gray.shape[1] - slide_width, edge_best_x + fine_range)
            
            # 使用结构相似性和纹理特征进行精确匹配
            for x in range(search_start, search_end):
                # 提取窗口
                window = bg_gray[:slide_height, x:x+slide_width]
                if window.shape == slide_gray.shape:
                    # 结构相似性
                    ssim_score = ssim(window, slide_gray)
                    
                    # 直方图比较 - 多种比较方法
                    hist1 = cv2.calcHist([window], [0], None, [64], [0, 256])
                    hist2 = cv2.calcHist([slide_gray], [0], None, [64], [0, 256])
                    
                    # 归一化直方图
                    cv2.normalize(hist1, hist1, 0, 1, cv2.NORM_MINMAX)
                    cv2.normalize(hist2, hist2, 0, 1, cv2.NORM_MINMAX)
                    
                    # 多种直方图比较方法
                    hist_correl = cv2.compareHist(hist1, hist2, cv2.HISTCMP_CORREL)
                    hist_chi = 1.0 - cv2.compareHist(hist1, hist2, cv2.HISTCMP_CHISQR) / 100.0  # 归一化卡方距离
                    hist_inter = cv2.compareHist(hist1, hist2, cv2.HISTCMP_INTERSECT)
                    
                    # 综合直方图得分
                    hist_score = (hist_correl * 0.6 + hist_chi * 0.2 + hist_inter * 0.2)
                    
                    # 边缘差异 - 计算边缘图的差异
                    window_edges = bg_edges[:slide_height, x:x+slide_width]
                    if window_edges.shape == slide_edges.shape:
                        edge_diff = cv2.absdiff(window_edges, slide_edges)
                        edge_score = 1.0 - np.sum(edge_diff) / (slide_width * slide_height * 255)
                    else:
                        edge_score = 0
                    
                    # 综合得分 - 加权平均多种特征
                    texture_score = (ssim_score * 0.4 + hist_score * 0.4 + edge_score * 0.2)
                    
                    if texture_score > texture_best_score:
                        texture_best_score = texture_score
                        texture_best_x = x
            
            logger.info(f"纹理匹配 - 最佳得分:{texture_best_score:.4f}, 位置:{texture_best_x}")

            # 4. 增强的多特征融合 - 使用自适应权重综合边缘、颜色、纹理特征和缺口检测结果
            # 使用当前实例的特征权重
            weights = self.feature_weights.copy()
            
            # 计算特征可靠性得分 - 基于特征得分和历史匹配结果
            edge_reliability = min(1.0, edge_best_score * 1.5)  # 边缘特征可靠性
            color_reliability = min(1.0, color_best_score * 1.5)  # 颜色特征可靠性
            texture_reliability = min(1.0, texture_best_score * 1.5)  # 纹理特征可靠性
            
            # 如果有缺口检测结果，计算其可靠性
            gap_reliability = 0
            if gap_x:
                # 计算缺口位置与其他特征位置的一致性
                edge_gap_diff = abs(edge_best_x - gap_x) / max(1, bg_gray.shape[1])
                color_gap_diff = abs(color_best_x - gap_x) / max(1, bg_gray.shape[1])
                texture_gap_diff = abs(texture_best_x - gap_x) / max(1, bg_gray.shape[1])
                
                # 缺口检测可靠性 - 与其他特征的一致性越高，可靠性越高
                gap_reliability = 0.8 * (1.0 - min(1.0, (edge_gap_diff + color_gap_diff + texture_gap_diff) / 0.6))
                
                # 创建缺口检测特征权重
                weights['gap'] = 0.3 * gap_reliability  # 根据可靠性动态调整缺口检测权重
                
                # 调整其他特征权重
                reduction_factor = 1.0 - weights['gap']
                for k in ['edge', 'color', 'texture']:
                    weights[k] *= reduction_factor
            
            # 动态调整权重 - 根据特征可靠性
            weights['edge'] = weights['edge'] * edge_reliability
            weights['color'] = weights['color'] * color_reliability
            weights['texture'] = weights['texture'] * texture_reliability
            
            # 特征互补增强 - 当某个特征可靠性低时，增强其他特征
            if edge_reliability < 0.5:
                boost_factor = (0.5 - edge_reliability) * 0.5
                weights['color'] += weights['edge'] * boost_factor
                weights['texture'] += weights['edge'] * boost_factor
                weights['edge'] *= (1.0 - boost_factor * 2)
            
            if color_reliability < 0.5:
                boost_factor = (0.5 - color_reliability) * 0.5
                weights['edge'] += weights['color'] * boost_factor
                weights['texture'] += weights['color'] * boost_factor
                weights['color'] *= (1.0 - boost_factor * 2)
            
            if texture_reliability < 0.5:
                boost_factor = (0.5 - texture_reliability) * 0.5
                weights['edge'] += weights['texture'] * boost_factor
                weights['color'] += weights['texture'] * boost_factor
                weights['texture'] *= (1.0 - boost_factor * 2)
            
            # 归一化权重
            total_weight = sum(weights.values())
            for k in weights:
                weights[k] /= total_weight
                
            logger.info(f"特征可靠性 - 边缘:{edge_reliability:.4f}, 颜色:{color_reliability:.4f}, 纹理:{texture_reliability:.4f}, 缺口:{gap_reliability:.4f}")
            logger.info(f"特征权重 - {weights}")
            
            # 5. 机器学习辅助识别 - 基于历史匹配结果
            ml_prediction = None
            if len(self.match_history) >= 3:
                # 使用历史匹配结果预测当前位置
                # 简单的线性回归模型
                features = []
                targets = []
                
                for match in self.match_history:
                    if match['success']:
                        # 提取特征和目标
                        features.append([match['edge_score'], match['color_score'], match['texture_score']])
                        targets.append(match['position'])
                
                if features and targets:
                    # 计算特征和目标的平均值
                    avg_features = [sum(col)/len(col) for col in zip(*features)]
                    avg_target = sum(targets) / len(targets)
                    
                    # 计算当前特征与历史成功特征的相似度
                    current_features = [edge_best_score, color_best_score, texture_best_score]
                    similarity = sum(f1*f2 for f1, f2 in zip(current_features, avg_features)) / \
                                 (sum(f**2 for f in current_features)**0.5 * sum(f**2 for f in avg_features)**0.5)
                    
                    # 如果相似度高，使用历史成功位置作为预测
                    if similarity > 0.7:
                        ml_prediction = avg_target
                        logger.info(f"机器学习预测位置: {ml_prediction}, 相似度: {similarity:.4f}")
            
            # 增强的加权平均计算最终位置
            position_candidates = {
                'edge': edge_best_x,
                'color': color_best_x,
                'texture': texture_best_x
            }
            
            # 添加机器学习预测和缺口检测结果
            if ml_prediction is not None:
                position_candidates['ml'] = ml_prediction
                weights['ml'] = 0.2  # 初始ML权重
                # 调整其他权重
                for k in ['edge', 'color', 'texture']:
                    weights[k] *= 0.8
            
            if gap_x:
                position_candidates['gap'] = gap_x
            
            # 重新归一化权重
            total_weight = sum(weights.values())
            for k in weights:
                weights[k] /= total_weight
            
            # 计算聚类中心 - 识别异常值
            positions = np.array([pos for pos in position_candidates.values()])
            valid_positions = []
            valid_weights = []
            
            # 计算位置的中位数和标准差
            median_pos = np.median(positions)
            std_pos = np.std(positions)
            
            # 过滤异常值
            for k, pos in position_candidates.items():
                # 如果位置偏离中位数超过2个标准差，认为是异常值
                if abs(pos - median_pos) <= 2 * std_pos or std_pos < 10:
                    valid_positions.append(pos)
                    valid_weights.append(weights.get(k, 0))
                else:
                    logger.info(f"检测到异常位置: {k}={pos}, 偏离中位数{median_pos}超过{abs(pos - median_pos)/std_pos:.1f}个标准差")
                    # 降低异常值的权重
                    weights[k] *= 0.3
            
            # 如果所有位置都被视为异常值，使用原始位置
            if not valid_positions:
                valid_positions = list(position_candidates.values())
                valid_weights = [weights.get(k, 0) for k in position_candidates.keys()]
            
            # 重新归一化有效权重
            total_valid_weight = sum(valid_weights)
            valid_weights = [w / total_valid_weight for w in valid_weights]
            
            # 计算加权平均位置
            best_x = int(sum(p * w for p, w in zip(valid_positions, valid_weights)))
            
            logger.info(f"有效位置: {valid_positions}")
            logger.info(f"有效权重: {valid_weights}")
            logger.info(f"最终位置: {best_x}")
            
            # 计算增强的综合得分
            feature_scores = {
                'edge': edge_best_score,
                'color': color_best_score,
                'texture': texture_best_score
            }
            
            # 添加缺口检测得分
            if 'gap' in weights:
                # 动态计算缺口检测得分 - 基于与其他特征的一致性
                feature_scores['gap'] = gap_reliability
            
            # 添加机器学习预测得分
            if 'ml' in weights:
                # 假设ML预测的可靠性基于历史匹配成功率
                ml_success_rate = sum(1 for m in self.match_history if m['success']) / max(1, len(self.match_history))
                feature_scores['ml'] = 0.5 + 0.5 * ml_success_rate  # 基础得分0.5，加上历史成功率的一半
            
            # 计算综合得分 - 加权平均
            best_score = sum(feature_scores.get(k, 0) * weights.get(k, 0) for k in weights.keys())
            
            # 计算位置一致性得分 - 位置越集中，得分越高
            position_std = np.std([pos for pos in position_candidates.values()])
            consistency_score = 1.0 / (1.0 + position_std / 50.0)  # 标准差越小，一致性越高
            
            # 综合考虑特征得分和位置一致性
            best_score = best_score * 0.7 + consistency_score * 0.3
            
            # 记录当前匹配结果 - 用于后续机器学习
            self.match_history.append({
                'position': best_x,
                'edge_score': edge_best_score,
                'color_score': color_best_score,
                'texture_score': texture_best_score,
                'final_score': best_score,
                'success': False  # 初始设为False，验证成功后更新
            })
            
            logger.info(f"多特征融合 - 边缘位置:{edge_best_x}, 颜色位置:{color_best_x}, 纹理位置:{texture_best_x}")
            logger.info(f"多特征融合 - 最终位置:{best_x}, 综合得分:{best_score:.4f}")
            
            # 可视化匹配结果
            result_img = background_img.copy()
            # 绘制最终位置
            cv2.rectangle(result_img, 
                         (best_x, 0), 
                         (best_x + slide_width, slide_height), 
                         (0, 255, 0), 2)
            # 绘制各特征位置
            cv2.line(result_img, (edge_best_x, 0), (edge_best_x, slide_height), (255, 0, 0), 1)
            cv2.line(result_img, (color_best_x, 0), (color_best_x, slide_height), (0, 0, 255), 1)
            cv2.line(result_img, (texture_best_x, 0), (texture_best_x, slide_height), (0, 255, 255), 1)
            
            cv2.imwrite(f"debug_result_{timestamp}.png", result_img)

            # 根据匹配分数动态调整搜索策略
            if best_score < 0.4:  # 匹配度较低时
                # 扩大搜索范围，同时包含所有特征分析结果
                distances = [
                    best_x,
                    edge_best_x,
                    texture_best_x,
                    color_best_x
                ]
                
                # 如果有缺口检测结果，优先添加
                if gap_x:
                    distances.insert(0, gap_x)
                    distances.extend([gap_x - 3, gap_x + 3, gap_x - 7, gap_x + 7])
                
                # 添加更多搜索点
                distances.extend([
                    best_x - 5,
                    best_x + 5,
                    best_x - 10,
                    best_x + 10,
                    best_x - 15,
                    best_x + 15
                ])
            elif best_score < 0.6:  # 匹配度中等
                distances = [
                    best_x
                ]
                
                # 如果有缺口检测结果，添加缺口位置
                if gap_x:
                    distances.insert(0, gap_x)
                    distances.extend([gap_x - 2, gap_x + 2])
                
                # 添加其他特征位置和搜索点
                distances.extend([
                    edge_best_x,
                    texture_best_x,
                    best_x - 3,
                    best_x + 3,
                    best_x - 6,
                    best_x + 6
                ])
            else:  # 匹配度较高时
                # 缩小搜索范围，更精确的搜索
                distances = [
                    best_x
                ]
                
                # 如果有缺口检测结果且得分高，优先考虑
                if gap_x and best_score > 0.7:
                    # 在最佳位置和缺口位置之间进行精细搜索
                    min_pos = min(best_x, gap_x)
                    max_pos = max(best_x, gap_x)
                    step = max(1, (max_pos - min_pos) // 5)  # 确保至少有5个点
                    
                    for pos in range(min_pos, max_pos + 1, step):
                        if pos not in distances:
                            distances.append(pos)
                
                # 添加更精细的搜索点
                distances.extend([
                    best_x - 1,
                    best_x + 1,
                    best_x - 2,
                    best_x + 2,
                    best_x - 3,
                    best_x + 3
                ])
                
            # 可视化最终的搜索策略
            search_img = background_img.copy()
            for i, dist in enumerate(distances[:10]):  # 只显示前10个点
                cv2.line(search_img, (dist, 0), (dist, slide_height), (0, 255, 255), 1)
                cv2.putText(search_img, str(i+1), (dist, slide_height+20), 
                           cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 255), 1)
            
            cv2.imwrite(f"{debug_dir}/search_strategy_{timestamp}.png", search_img)

            # 确保所有距离都在有效范围内
            distances = [d for d in distances if 150 <= d <= 450]
            
            # 如果有历史成功记录，添加历史成功距离
            if self.successful_distances:
                avg_success = sum(self.successful_distances) / len(self.successful_distances)
                distances.insert(1, int(avg_success))
                distances.insert(2, int(avg_success) - 3)
                distances.insert(3, int(avg_success) + 3)
                
                # 去重
                distances = list(dict.fromkeys(distances))
            
            return distances
            
        except Exception as e:
            logger.error(f"图片分析失败: {str(e)}")
            logger.error(traceback.format_exc())
            # 如果分析失败，返回默认值
            return [310, 320, 330, 340, 350, 360, 370, 380, 390, 400]
    
    def verify_slide(self, img_token, image_data, max_retries=8):
        """验证滑动 - 增强版自适应重试策略"""
        url = f"{self.BASE_URL}/verifyImgCode"
        
        analyzed_distances = self.analyze_image(image_data)
        
        if not analyzed_distances:
            possible_distances = [
                437, 430, 420, 410, 400, 390, 380, 370, 360, 350, 340, 330, 320, 310, 300, 
                290, 280, 270, 260, 250, 240, 230, 220, 210, 200, 190, 180, 170, 160, 150
            ]
            random.shuffle(possible_distances)
        else:
            possible_distances = analyzed_distances
        
        # 记录尝试过的距离，避免重复
        tried_distances = set()
        
        # 记录每次尝试的结果，用于分析趋势
        attempt_results = []
        
        # 如果有历史成功记录，优先使用历史成功区间
        if self.successful_distances and len(self.successful_distances) >= 3:
            # 计算历史成功距离的统计信息
            avg_success = sum(self.successful_distances) / len(self.successful_distances)
            min_success = min(self.successful_distances)
            max_success = max(self.successful_distances)
            
            # 在历史成功区间内生成更密集的尝试点
            success_range = range(max(150, int(min_success) - 10), min(450, int(max_success) + 10), 2)
            priority_distances = list(success_range)
            
            # 将历史成功区间的距离插入到可能距离的前面
            for dist in reversed(priority_distances):
                if dist not in tried_distances and dist not in possible_distances:
                    possible_distances.insert(0, dist)
        
        for attempt in range(max_retries):
            # 选择一个未尝试过的距离
            while possible_distances and possible_distances[0] in tried_distances:
                possible_distances.pop(0)
                
            if len(possible_distances) > 0:
                x_distance = possible_distances.pop(0)
            else:
                # 如果所有预设距离都尝试过，根据尝试结果动态生成新距离
                if attempt_results:
                    # 分析之前尝试的结果，寻找趋势
                    sorted_attempts = sorted(attempt_results, key=lambda x: x['score'], reverse=True)
                    best_attempts = sorted_attempts[:3]  # 取得分最高的前3次尝试
                    
                    if best_attempts:
                        # 在最佳尝试附近生成新的距离
                        best_dist = best_attempts[0]['distance']
                        x_distance = best_dist + random.randint(-5, 5)
                        
                        # 确保在有效范围内且未尝试过
                        while x_distance in tried_distances or not (150 <= x_distance <= 450):
                            x_distance = best_dist + random.randint(-8, 8)
                    else:
                        x_distance = random.randint(150, 450)
                else:
                    # 如果没有尝试记录，生成随机距离
                    x_distance = random.randint(150, 450)
                    while x_distance in tried_distances:
                        x_distance = random.randint(150, 450)
            
            tried_distances.add(x_distance)
            
            data = {
                "yzmimgKey": img_token,
                "xDistance": str(x_distance)
            }
            
            try:
                logger.info(f"尝试第{attempt+1}次，滑动距离: {x_distance}")
                logger.debug(f"验证请求数据: {data}")
                
                response = requests.post(url, headers=self.get_headers(), json=data, timeout=10)
                logger.info(f"验证响应状态: {response.status_code}")
                logger.info(f"验证响应内容: {response.text}")
                
                response_data = response.json()
                
                if response_data.get("code") == 200:
                    logger.info(f"验证成功！使用的滑动距离: {x_distance}")
                    # 记录成功的距离，用于后续优化
                    self.successful_distances.append(x_distance)
                    # 只保留最近10个成功距离
                    if len(self.successful_distances) > 10:
                        self.successful_distances = self.successful_distances[-10:]
                    
                    # 分析成功距离的分布
                    if len(self.successful_distances) >= 3:
                        avg = sum(self.successful_distances) / len(self.successful_distances)
                        std_dev = (sum((x - avg) ** 2 for x in self.successful_distances) / len(self.successful_distances)) ** 0.5
                        logger.info(f"成功距离统计 - 平均值: {avg:.2f}, 标准差: {std_dev:.2f}, 范围: {min(self.successful_distances)}-{max(self.successful_distances)}")
                    
                    # 更新匹配历史中的成功标记
                    if self.match_history:
                        # 找到最接近成功距离的匹配记录
                        closest_match = min(self.match_history, key=lambda m: abs(m['position'] - x_distance))
                        if abs(closest_match['position'] - x_distance) < 20:  # 如果足够接近
                            # 更新为成功
                            closest_match['success'] = True
                            logger.info(f"更新匹配历史成功标记: 位置={closest_match['position']}")
                            
                            # 动态调整特征权重 - 增强成功特征的权重
                            scores = {
                                'edge': closest_match['edge_score'],
                                'color': closest_match['color_score'],
                                'texture': closest_match['texture_score']
                            }
                            
                            # 找出得分最高的特征
                            best_feature = max(scores, key=scores.get)
                            
                            # 适度增强最佳特征的权重
                            self.feature_weights[best_feature] = min(0.5, self.feature_weights[best_feature] * 1.2)
                            
                            # 重新归一化权重
                            total = sum(self.feature_weights.values())
                            for k in self.feature_weights:
                                self.feature_weights[k] /= total
                                
                            logger.info(f"动态调整特征权重: {self.feature_weights}")
                            
                            # 动态调整阈值
                            if scores['edge'] > self.ssim_threshold:
                                self.ssim_threshold = (self.ssim_threshold * 0.8 + scores['edge'] * 0.2)
                            if scores['color'] > self.hist_threshold:
                                self.hist_threshold = (self.hist_threshold * 0.8 + scores['color'] * 0.2)
                            
                            logger.info(f"动态调整阈值: SSIM={self.ssim_threshold:.4f}, 直方图={self.hist_threshold:.4f}")
                    
                    # 重置错误计数
                    self.error_count = 0
                    self.last_error_type = None
                    
                    response_data["successful_distance"] = x_distance
                    return response_data
                
                # 估算当前尝试的得分 - 用于后续分析
                error_msg = response_data.get("msg", "")
                attempt_score = 0
                
                # 根据错误信息估算得分
                if "验证码错误" in error_msg:
                    self.last_error_type = "验证码错误"
                    attempt_score = 0.1  # 基础得分
                elif "请求过于频繁" in error_msg:
                    self.last_error_type = "频率限制"
                    attempt_score = 0.05
                    time.sleep(random.uniform(3, 5))  # 更长的等待时间
                elif "会话已过期" in error_msg:
                    self.last_error_type = "会话过期"
                    self.cookie = self.generate_hwwaf_cookie()  # 重新生成cookie
                    logger.info(f"会话过期，重新生成Cookie: {self.cookie}")
                    return {"error": "会话过期，需要重新获取验证码"}
                
                # 记录本次尝试结果
                attempt_results.append({
                    'distance': x_distance,
                    'score': attempt_score,
                    'error_type': self.last_error_type
                })
                
                self.error_count += 1
                
                if attempt == max_retries - 1:
                    return response_data
                
                # 根据错误类型和尝试次数动态调整等待时间
                if self.last_error_type == "频率限制":
                    wait_time = random.uniform(3, 5) * (1 + attempt * 0.2)  # 随着尝试次数增加等待时间
                    time.sleep(wait_time)
                else:
                    wait_time = random.uniform(1, 2) * (1 + attempt * 0.1)
                    time.sleep(wait_time)
                
            except requests.RequestException as e:
                logger.error(f"验证请求异常: {str(e)}")
                logger.error(traceback.format_exc())
                self.error_count += 1
                
                if "Connection" in str(e):
                    self.last_error_type = "网络连接问题"
                    time.sleep(random.uniform(2, 4))
                elif "Timeout" in str(e):
                    self.last_error_type = "请求超时"
                    time.sleep(random.uniform(2, 3))
                else:
                    time.sleep(random.uniform(1, 2))
                
                if attempt == max_retries - 1:
                    return {"error": f"验证失败: {str(e)}"}
        
        return {"error": "所有尝试均失败"}
    
    def get_sms_code(self, img_token, x_distance):
        """获取短信验证码"""
        if not self.phone_number:
            logger.error("未提供手机号，无法获取短信验证码")
            return {"error": "未提供手机号"}
            
        # 更新请求URL
        url = f"{self.BASE_URL}/getSmsCodeNew"
        
        # 更新请求数据结构
        data = {
            "yzmimgKey": img_token,
            "type": "2",  # 根据抓包信息添加type字段
            "msgyzm": str(x_distance),
            "tel": self.phone_number
        }
        
        try:
            logger.info(f"尝试获取短信验证码，手机号: {self.phone_number}")
            logger.debug(f"短信请求数据: {data}")
            
            response = requests.post(url, headers=self.get_headers(), json=data, timeout=10)
            logger.info(f"短信请求响应状态: {response.status_code}")
            logger.info(f"短信请求响应内容: {response.text}")
            
            if response.status_code == 200:
                response_data = response.json()
                if response_data.get("code") == 200:
                    logger.info("短信验证码发送成功")
                return response_data
            
            return {"error": f"请求失败，状态码: {response.status_code}"}
            
        except requests.RequestException as e:
            logger.error(f"短信请求异常: {str(e)}")
            return {"error": f"请求异常: {str(e)}"}
    
    def release_number(self, phone_number):
        """释放手机号码资源"""
        logger.info(f"释放手机号: {phone_number}")
        # 这里可以添加实际的释放逻辑，比如调用API或清理资源
        return {"code": 200, "message": "号码释放成功"}
        
    def complete_verification_and_get_sms(self, max_attempts=5):
        """完成验证并获取短信验证码 - 增强版"""
        success_rate = 0  # 记录成功率
        
        for attempt in range(max_attempts):
            logger.info(f"\n===== 验证尝试 #{attempt+1} =====")
            logger.info(f"当前特征权重: {self.feature_weights}")
            logger.info(f"当前阈值设置: SSIM={self.ssim_threshold:.4f}, 直方图={self.hist_threshold:.4f}")
            
            # 如果连续错误次数过多，重新生成cookie
            if self.error_count >= 3:
                self.cookie = self.generate_hwwaf_cookie()
                logger.info(f"连续错误次数过多，重新生成Cookie: {self.cookie}")
                self.error_count = 0
                
                # 重置特征权重 - 避免陷入局部最优
                if attempt > 2 and success_rate < 0.2:  # 如果成功率低于20%
                    logger.info("重置特征权重和阈值设置")
                    self.feature_weights = {'edge': 0.3, 'color': 0.3, 'texture': 0.4}
                    self.ssim_threshold = 0.3
                    self.hist_threshold = 0.5
            
            img_result = self.get_foton_img()
            if "error" in img_result:
                logger.error(f"获取验证码失败: {img_result['error']}")
                
                # 根据错误类型调整等待时间
                if "Connection" in img_result["error"]:
                    time.sleep(random.uniform(3, 5))
                else:
                    time.sleep(2)
                continue
            
            img_token = img_result.get("data", {}).get("token")
            images = img_result.get("data", {}).get("images", [])
            
            logger.info(f"提取的token: {img_token}")
            logger.info(f"获取到 {len(images)} 张图片")
            
            if not img_token or not images:
                logger.error("获取token或图片失败")
                time.sleep(2)
                continue
            
            time.sleep(random.uniform(1, 2))
            
            result = self.verify_slide(img_token, images)
            
            # 处理特定错误
            if isinstance(result, dict) and "error" in result and "会话过期" in result["error"]:
                continue  # 直接进入下一次循环，使用新的cookie重新获取验证码
            
            if result.get("code") == 200:
                logger.info("验证成功！准备获取短信验证码...")
                
                successful_distance = result.get("successful_distance")
                if not successful_distance:
                    logger.warning("无法获取成功的滑动距离，使用默认值310")
                    successful_distance = 310
                
                sms_result = self.get_sms_code(img_token, successful_distance)
                
                if sms_result.get("code") == 200:
                    logger.info("获取短信验证码成功！")
                    # 获取到验证码后立即返回结果
                    return {
                        "status": "success",
                        "code": sms_result.get("code"),
                        "message": sms_result.get("message"),
                        "verification_code": sms_result.get("code")  # 假设验证码在code字段中
                    }
                else:
                    logger.error(f"获取短信验证码失败: {sms_result}")
                    
                    # 根据错误信息调整策略
                    error_msg = sms_result.get("msg", "")
                    if "频繁" in error_msg:
                        time.sleep(random.uniform(5, 8))
                    else:
                        time.sleep(random.uniform(2, 3))
                    
                    # 如果错误代码是500，释放号码并重新开始流程
                    if sms_result.get("code") == 500:
                        logger.info("释放号码并重新开始流程")
                        # 释放号码逻辑
                        release_result = self.release_number(self.phone_number)
                        if release_result.get("code") == 200:
                            logger.info(f"成功释放手机号: {self.phone_number}")
                        else:
                            logger.error(f"释放手机号失败: {release_result}")
                        
                        # 等待一段时间后重新开始流程
                        time.sleep(random.uniform(3, 5))
                        return self.get_sms_code()  # 重新调用短信获取流程
                    continue
            
            logger.warning(f"验证失败，将重新获取验证码: {result}")
            time.sleep(random.uniform(2, 3))
        
        return {"error": f"所有{max_attempts}次尝试均失败"}


class YeziPlatform:
    """椰子平台API封装"""
    
    def __init__(self, username, password, project_id):
        self.username = username
        self.password = password
        self.project_id = project_id
        self.token = None
        self.base_url = "http://api.sqhyw.net:90/api"
        
        # 登录获取token
        self.login()
    
    def login(self):
        """登录获取token"""
        url = f"{self.base_url}/logins"
        params = {
            'username': self.username,
            'password': self.password
        }
        
        try:
            logger.info(f"尝试登录椰子平台... 用户名: {self.username}")
            response = requests.get(url, params=params, timeout=10)
            logger.info(f"登录响应状态码: {response.status_code}")
            logger.info(f"登录响应内容: {response.text}")
            
            if response.status_code == 200:
                login_data = response.json()
                self.token = login_data.get("token")
                if self.token:
                    logger.info(f"登录成功，获取到token: {self.token}")
                else:
                    logger.error(f"登录响应成功但获取token失败: {login_data}")
            else:
                logger.error(f"登录失败，状态码: {response.status_code}")
        except Exception as e:
            logger.error(f"登录请求异常: {str(e)}")
    
    def get_phone_number(self, special=None, phone_num=None, scope=None):
        """获取手机号"""
        if not self.token:
            logger.error("未登录或token无效，尝试重新登录")
            self.login()
            if not self.token:
                return None
            
        url = f"{self.base_url}/get_mobile"
        params = {
            'token': self.token,
            'project_id': self.project_id
            #  'scope': "171"
        }
        
        # 添加可选参数
        if special:
            params['special'] = special
        if phone_num:
            params['phone_num'] = phone_num
        if scope:
            params['scope'] = scope
        
        try:
            logger.info(f"尝试获取手机号... 项目ID: {self.project_id}")
            logger.debug(f"请求参数: {params}")
            
            response = requests.get(url, params=params, timeout=10)
            logger.info(f"获取手机号响应状态码: {response.status_code}")
            logger.info(f"获取手机号响应内容: {response.text}")
            
            if response.status_code == 200:
                data = response.json()
                # 检查 message 而不是 code
                if data.get("message") == "ok" and data.get("mobile"):
                    mobile = data.get("mobile")
                    logger.info(f"成功获取手机号: {mobile}")
                    return mobile
                else:
                    logger.error(f"获取手机号失败: {data.get('message', '未知错误')}")
            return None
        except Exception as e:
            logger.error(f"获取手机号请求异常: {str(e)}")
            return None
    
    def free_mobile(self, phone_number, special=None):
        """释放手机号"""
        if not self.token:
            logger.error("未登录或token无效，尝试重新登录")
            self.login()
            if not self.token:
                return False
        
        url = f"{self.base_url}/free_mobile"
        params = {
            'token': self.token,
            'project_id': self.project_id,
            'phone_num': phone_number
        }
        
        # 添加可选参数
        if special:
            params['special'] = special
        
        try:
            logger.info(f"尝试释放手机号: {phone_number}")
            logger.debug(f"释放请求参数: {params}")
            
            response = requests.get(url, params=params, timeout=10)
            logger.info(f"释放手机号响应状态码: {response.status_code}")
            logger.info(f"释放手机号响应内容: {response.text}")
            
            if response.status_code == 200:
                data = response.json()
                if data.get("message") == "ok":
                    logger.info(f"成功释放手机号: {phone_number}")
                    return True
                else:
                    logger.error(f"释放手机号失败: {data.get('message', '未知错误')}")
            return False
        except Exception as e:
            logger.error(f"释放手机号请求异常: {str(e)}")
            return False
    
    def get_sms_content(self, phone_number, special=None, max_attempts=12, interval=5):
        """获取短信内容"""
        if not self.token:
            logger.error("未登录或token无效，尝试重新登录")
            self.login()
            if not self.token:
                return {"error": "获取token失败，无法获取短信"}
        
        url = f"{self.base_url}/get_message"
        params = {
            'token': self.token,
            'project_id': self.project_id,
            'phone_num': phone_number
        }
        
        # 添加可选参数
        if special:
            params['special'] = special
        
        logger.info(f"开始获取手机号 {phone_number} 的短信内容")
        logger.debug(f"请求参数: {params}")
        
        for attempt in range(max_attempts):
            try:
                logger.info(f"第 {attempt+1} 次尝试获取短信内容")
                response = requests.get(url, params=params, timeout=10)
                logger.info(f"获取短信响应状态码: {response.status_code}")
                logger.info(f"获取短信响应内容: {response.text}")
                
                if response.status_code == 200:
                    data = response.json()
                    # 检查是否有短信内容
                    if data.get("message") == "ok" and (data.get("data") and len(data["data"]) > 0 or data.get("code")):
                        sms_content = ""
                        verification_code = data.get("code", "")
                        
                        if data.get("data") and len(data["data"]) > 0:
                            sms_content = data["data"][0].get("modle", "")
                        
                        # 如果没有直接提供验证码，尝试从短信内容中提取
                        if not verification_code and sms_content:
                            code_patterns = [
                                r'验证码[是为:]?\s*([0-9]{4,6})',
                                r'码[是为:]?\s*([0-9]{4,6})',
                                r'([0-9]{4,6})[^0-9]'
                            ]
                            for pattern in code_patterns:
                                match = re.search(pattern, sms_content)
                                if match:
                                    verification_code = match.group(1)
                                    break
                        
                        result = {
                            "success": True,
                            "sms_content": sms_content,
                            "verification_code": verification_code
                        }
                        
                        logger.info(f"成功获取短信内容: {sms_content}")
                        if verification_code:
                            logger.info(f"验证码: {verification_code}")
                        else:
                            logger.warning(f"未能从短信中提取到验证码")
                        
                        return result
                    elif "等待" in data.get("message", "") or (data.get("message") == "ok" and (not data.get("data") or len(data["data"]) == 0)):
                        logger.info("短信尚未收到，等待下一次查询")
                    else:
                        logger.warning(f"获取短信失败: {data.get('message', '未知错误')}")
                else:
                    logger.error(f"获取短信请求失败，状态码: {response.status_code}")
                
                # 如果达到最大尝试次数，返回失败
                if attempt == max_attempts - 1:
                    return {"error": "获取短信超时，达到最大尝试次数"}
                
                # 等待一段时间后再次尝试
                time.sleep(interval)
                
            except Exception as e:
                logger.error(f"获取短信请求异常: {str(e)}")
                if attempt == max_attempts - 1:
                    return {"error": f"获取短信异常: {str(e)}"}
                time.sleep(interval)
        
        return {"error": "获取短信超时"}


def main():
    """主函数"""
    # 配置参数
    username = "123456"#椰子账号
    password = "123456"#椰子密码
    project_id = "865765"
    target_success_count = 2  # 需要成功修改密码的手机号数量
    current_success_count = 0
    successful_phones = []  # 用于存储成功完成的手机号
    
    # 初始化椰子平台
    yezi = YeziPlatform(username, password, project_id)
    
    while current_success_count < target_success_count:
        try:
            # 获取手机号
            phone_number = yezi.get_phone_number()
            if not phone_number:
                logger.error("获取手机号失败")
                time.sleep(3)
                continue
                
            logger.info(f"获取到手机号: {phone_number}")
            
            # 初始化验证器
            verifier = FotonVerifier(phone_number)
            result = verifier.complete_verification_and_get_sms()
            
            logger.info("短信发送结果:")
            logger.info(result)
            
            if result.get("code") == 200:
                # 获取短信验证码内容
                logger.info("开始获取短信验证码内容...")
                sms_result = yezi.get_sms_content(phone_number)
                
                if sms_result.get("success"):
                    logger.info(f"成功获取短信内容: {sms_result.get('sms_content')}")
                    logger.info(f"提取的验证码: {sms_result.get('verification_code')}")
                    logger.info(f"验证成功的手机号: {phone_number}")
                    
                    # 构建修改密码请求
                    update_data = {
                        "memberId": "",
                        "password": "12345678",#要修改的手机号
                        "smsCode": sms_result.get("verification_code"),
                        "ip": "127.0.0.1",
                        "tel": phone_number
                    }
                    
                    # 发送修改密码请求
                    update_response = requests.post(
                        f"{verifier.BASE_URL}/userUpdatePassword",
                        headers=verifier.get_headers(),
                        json=update_data,
                        timeout=10
                    )
                    
                    update_result = update_response.json()
                    logger.info(f"密码修改响应: {update_result}")
                    successful_phones.append(phone_number)  # 记录成功的手机号
                    current_success_count += 1
                    logger.info(f"当前成功数量: {current_success_count}/{target_success_count}")
                else:
                    logger.error(f"获取短信内容失败: {sms_result.get('error')}")
                    yezi.free_mobile(phone_number)
                    time.sleep(3)
            else:
                logger.warning(f"验证失败，释放手机号并重试: {result}")
                yezi.free_mobile(phone_number)
                time.sleep(3)
                
        except Exception as e:
            logger.error(f"验证过程出错: {str(e)}")
            if phone_number:
                yezi.free_mobile(phone_number)
            time.sleep(3)
    
    logger.info(f"已完成 {target_success_count} 个手机号的密码修改")
    if successful_phones:
        logger.info(f"成功完成的手机号列表: {', '.join(successful_phones)}")






if __name__ == "__main__":
    main()
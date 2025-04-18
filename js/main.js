document.addEventListener('DOMContentLoaded', () => {
    // 获取背景元素
    const bgOverlay = document.querySelector('.bg-overlay');
    
    // 获取必应每日图片
    fetchBingDailyImage();
    
    // 获取一言
    fetchHitokoto();
    
    // 每隔一段时间更新一言
    setInterval(fetchHitokoto, 60000); // 每分钟更新一次
});

/**
 * 从必应获取每日图片
 */
async function fetchBingDailyImage() {
    try {
        // 使用代理服务器避免跨域问题
        const bingUrl = 'https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=zh-CN';
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(bingUrl)}`;
        
        const response = await fetch(proxyUrl);
        const data = await response.json();
        
        if (data.contents) {
            const bingData = JSON.parse(data.contents);
            if (bingData.images && bingData.images.length > 0) {
                const imageUrl = `https://www.bing.com${bingData.images[0].url}`;
                document.querySelector('.bg-overlay').style.backgroundImage = `url(${imageUrl})`;
            }
        }
    } catch (error) {
        console.error('获取必应背景图失败:', error);
        // 使用备用背景图
        setFallbackBackground();
    }
}

/**
 * 设置备用背景图
 */
function setFallbackBackground() {
    // 使用渐变作为备用背景
    document.querySelector('.bg-overlay').style.background = 
        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
}

/**
 * 从一言API获取内容
 */
async function fetchHitokoto() {
    try {
        const hitokotoUrl = 'https://v1.hitokoto.cn';
        const response = await fetch(hitokotoUrl);
        const data = await response.json();
        
        // 更新一言内容
        document.getElementById('hitokoto-text').textContent = data.hitokoto;
        document.getElementById('hitokoto-from').textContent = `— ${data.from_who || '佚名'} 《${data.from}》`;
    } catch (error) {
        console.error('获取一言失败:', error);
        document.getElementById('hitokoto-text').textContent = '生活不止眼前的苟且，还有诗和远方。';
        document.getElementById('hitokoto-from').textContent = '— 未知';
    }
}

/**
 * 添加平滑滚动效果
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 70, // 减去头部高度
                behavior: 'smooth'
            });
        }
    });
}); 
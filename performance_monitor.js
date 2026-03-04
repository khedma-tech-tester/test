export const PerformanceMonitor = {
    logs: [],

    // قياس الوقت المستغرق لتنفيذ دالة معينة
    async trackAsync(label, asyncFunc) {
        const start = performance.now();
        try {
            const result = await asyncFunc();
            const end = performance.now();
            this.logPerformance(label, end - start, 'success');
            return result;
        } catch (error) {
            const end = performance.now();
            this.logPerformance(label, end - start, 'error');
            throw error;
        }
    },

    logPerformance(label, duration, status) {
        const logEntry = {
            label,
            duration: `${duration.toFixed(2)}ms`,
            status,
            timestamp: new Date().toLocaleTimeString()
        };
        
        this.logs.push(logEntry);
        
        // إذا استغرق الطلب أكثر من 3 ثوانٍ، اطبع تحذير في الكونسول
        if (duration > 3000) {
            console.warn(`⚠️ بطء في الأداء: الطلب [${label}] استغرق وقت طويل جداً!`);
        }
    },

    getSummary() {
        console.table(this.logs);
    }
};

window.KhedmaMetrics = PerformanceMonitor;
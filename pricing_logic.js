/**
 * محرك تسعير خِدمة تك (Dynamic Pricing Engine)
 * يحسب التكلفة التقديرية للخدمة لضمان الشفافية بين الفني والعميل
 */

export const PricingEngine = {
    // الأسعار الأساسية للخدمات
    baseRates: {
        plumbing: 120,    // سعر الكشف الأساسي
        electricity: 100,
        cleaning: 150,
        ac_repair: 200
    },

    /**
     * @param {string} serviceType - نوع الخدمة
     * @param {boolean} isEmergency - هل الطلب طوارئ؟
     * @param {number} hour - الساعة الحالية (24-hour format)
     */
    calculateEstimatedPrice(serviceType, isEmergency = false, hour = new Date().getHours()) {
        let price = this.baseRates[serviceType] || 100;

        // 1. إضافة رسوم الطوارئ (زيادة 50%)
        if (isEmergency) {
            price *= 1.5;
        }

        // 2. رسوم وقت الذروة أو العمل الليلي (بعد 10 مساءً وحتى 6 صباحاً)
        if (hour >= 22 || hour <= 6) {
            price += 40; // رسوم عمل ليلي ثابتة
        }

        // 3. إضافة ضريبة القيمة المضافة أو رسوم المنصة (اختياري)
        const platformFee = 10; // 10 جنيهات رسوم ثابتة
        
        return Math.ceil(price + platformFee);
    },

    // تنسيق السعر للعرض
    formatCurrency(amount) {
        return new Intl.NumberFormat('ar-EG', {
            style: 'currency',
            currency: 'EGP',
        }).format(amount);
    }
};

window.KhedmaPricing = PricingEngine;
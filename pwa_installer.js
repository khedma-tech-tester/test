if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
    .then(() => console.log("PWA: Ready"))
    .catch((err) => console.log("PWA: Error", err));
}

let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    // يمكنك هنا إظهار زر "تثبيت التطبيق" في واجهة المستخدم
    console.log("جاهز للتثبيت على الهاتف");
});

export const installApp = async () => {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            console.log('User installed the app');
        }
        deferredPrompt = null;
    }
};
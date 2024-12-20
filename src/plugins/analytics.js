export default {
  install(app) {
    const trackEvent = (eventName, eventParams = {}) => {
      if (window.gtag) {
        window.gtag('event', eventName, eventParams);
      }
    };

    // Make it available globally in your Vue app
    app.config.globalProperties.$analytics = {
      trackEvent
    };
  }
}

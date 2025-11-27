import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.baker.calculator',
  appName: 'حاسبة المخبز',
  webDir: 'dist',
  
  // 🚨🚨 هذا هو التعديل الحاسم لحل مشكلة الشاشة البيضاء 🚨🚨
  bundledWebRuntime: false
};

export default config;

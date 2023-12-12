import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'saving-box',
  webDir: 'dist/saving-box',
  server: {
    androidScheme: 'https'
  }
};

export default config;

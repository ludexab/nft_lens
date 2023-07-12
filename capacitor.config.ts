import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.nft_lens.app',
  appName: 'nft_lens',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;

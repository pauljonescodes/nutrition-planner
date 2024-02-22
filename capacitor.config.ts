import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.adeptry.nutritionplanner',
  appName: 'Nutrition Planner',
  webDir: 'release/app/dist/renderer',
  server: {
    androidScheme: 'https',
  },
};

export default config;

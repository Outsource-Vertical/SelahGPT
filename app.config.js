import "dotenv/config";

export default {
  expo: {
    name: "SelahGPT",
    slug: "SelahGPT",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.richardh.SelahGPT",
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      edgeToEdgeEnabled: true,
      package: "com.richardh.selahgpt",
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    extra: {
      eas: {
        projectId: "1e2815cd-83d6-4708-aacc-5818f2e0030c",
      },
      EXPO_PUBLIC_OPENAI_API_KEY: process.env.EXPO_PUBLIC_OPENAI_API_KEY,
      EXPO_PUBLIC_OPENAI_EMBEDDING_KEY:
        process.env.EXPO_PUBLIC_OPENAI_EMBEDDING_KEY,
      EXPO_PUBLIC_PINECONE_API_KEY: process.env.EXPO_PUBLIC_PINECONE_API_KEY,
      EXPO_PUBLIC_PINECONE_ENVIRONMENT:
        process.env.EXPO_PUBLIC_PINECONE_ENVIRONMENT,
      EXPO_PUBLIC_PINECONE_INDEX_NAME:
        process.env.EXPO_PUBLIC_PINECONE_INDEX_NAME,
      EXPO_PUBLIC_FIREBASE_API_KEY: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
      EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN:
        process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
      EXPO_PUBLIC_FIREBASE_PROJECT_ID:
        process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
      EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET:
        process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
      EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID:
        process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      EXPO_PUBLIC_FIREBASE_APP_ID: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
    },
    plugins: [],
  },
};

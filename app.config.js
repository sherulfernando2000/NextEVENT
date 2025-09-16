export default {
  expo: {
    name: "Next EVENT",
    slug: "next-event",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/NextEventLogo.png",
    scheme: "nextlevel",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,

    ios: {
      supportsTablet: true,
      icon: "./assets/images/NextEventLogo.png",
    },

    android: {
      icon: "./assets/images/NextEventLogo.png",
      adaptiveIcon: {
        foregroundImage: "./assets/images/NextEventLogo.png",
        backgroundColor: "#000000",
      },
      package: "com.sherulfernando.eventbooking",
      edgeToEdgeEnabled: true,
    },

    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/NextEventLogo.png",
    },

    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/NextEventLogo.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#000000",
        },
      ],
    ],

    experiments: {
      typedRoutes: true,
    },

    extra: {
      mockApi: process.env.EXPO_BASE_API_URL,
      eas: {
        projectId: "8dbdf4c1-12e5-454e-aecf-63b06343ca44"
      }
    },
  },
};
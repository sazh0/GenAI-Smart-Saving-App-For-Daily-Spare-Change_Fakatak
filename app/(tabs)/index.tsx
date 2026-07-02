import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Image,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";

  // For commit
export default function WelcomePage() {
  const router = useRouter();

  const logoAnim = useRef(new Animated.Value(0)).current;
  const logoScaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const logoFadeInAnimation = Animated.timing(logoAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    });

    const logoStompOutAnimation = Animated.timing(logoScaleAnim, {
      toValue: 8,
      duration: 800,
      useNativeDriver: true,
    });

    logoFadeInAnimation.start(() => {
      setTimeout(() => {
        logoStompOutAnimation.start();
        router.push("/getStarted");
      }, 2000);
    });

    return () => {};
  }, []);
  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      <View style={styles.gradientOverlay} />

      <View style={styles.container}>
        <Animated.View
          style={[
            styles.logoContainer, 
            {
              opacity: logoAnim,
              transform: [{ scale: logoScaleAnim }],
            },
          ]}
        >
          <Image
            source={require("@/assets/images/GreenFakatk.png")}
            style={styles.image}
            resizeMode="contain"
          />
        </Animated.View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgb(254, 254, 254)",
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 60,
    top: 100,
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 150,
  },
  image: {
    right: 5,
    width: 220,
    height: 220,
  },
});
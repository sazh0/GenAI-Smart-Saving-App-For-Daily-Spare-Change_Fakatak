import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const TEAL = "#01a736";
const BLACK = "#2e2f2e";
const MUTED = "#6b7280";
const SOFT_BG = "#f8fafc";
const CARD = "#ffffff";

const FONT_REGULAR = "Handicrafts-Regular";
const FONT_MEDIUM = "Handicrafts-SemiBold";
const FONT_BOLD = "Handicrafts-Bold";
const FONT_EXTRA_BOLD = "Handicrafts-Bold";

// For commit
export default function GetStarted() {
  const router = useRouter();

  const logoAnim = useRef(new Animated.Value(0)).current;
  const titleAnim = useRef(new Animated.Value(50)).current;
  const subtitleAnim = useRef(new Animated.Value(50)).current;
  const buttonsAnim = useRef(new Animated.Value(50)).current;
  const iconsAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animations = [
      Animated.timing(logoAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(titleAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(subtitleAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(buttonsAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(iconsAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ];

    Animated.parallel(animations).start();
  }, []);

  return (
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#fefefe"
        translucent={false}
      />
      <View style={styles.background}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.container}>
            <Animated.View
              style={[styles.logoContainer, { opacity: logoAnim }]}
            >
              <Image
                source={require("@/assets/images/GreenFakatk.png")}
                style={styles.image}
                resizeMode="contain"
              />
            </Animated.View>

            <Animated.View

            >
              <Animated.View
                style={[
                  styles.subtitleContainer,
                  { transform: [{ translateY: subtitleAnim }] },
                ]}
              >
                <Text style={styles.subtitle}>
                  ابدأ رحلتك الاستثمارية معنا اليوم
                </Text>
              </Animated.View>
            </Animated.View>

            <Animated.View
              style={[
                styles.buttonsContainer,
                { transform: [{ translateY: buttonsAnim }] },
              ]}
            >
              <Animated.View
                style={[
                  styles.buttonContainer,
                  { transform: [{ scale: pulseAnim }] },
                ]}
              >
                <TouchableOpacity
                  style={styles.signInButton}
                  onPress={() => router.push("/signin")}
                  activeOpacity={0.8}
                >
                  <Text style={styles.signInButtonText}>تسجيل الدخول</Text>
                  <Ionicons
                    name="log-in-outline"
                    size={24}
                    color="#fefefe"
                    style={styles.buttonIcon}
                  />
                </TouchableOpacity>
              </Animated.View>

              <TouchableOpacity
                style={styles.signUpButton}
                onPress={() => router.push("/signup")}
                activeOpacity={0.8}
              >
                <Text style={styles.signUpButtonText}>إنشاء حساب جديد</Text>
                <Ionicons
                  name="person-add-outline"
                  size={24}
                  color="#01a736"
                  style={styles.buttonIcon}
                />
              </TouchableOpacity>
            </Animated.View>

            <Animated.View
              style={[styles.infoContainer, { opacity: iconsAnim }]}
            >

            </Animated.View>
          </View>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#fefefe",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
  },
  logoContainer: {
    marginBottom: 80,
  },
  image: {
    top: 80,
    width: 170,
    height: 160,
    right: 5,
  },

  subtitleContainer: {
    alignItems: "center",
    marginBottom: 60,
  },
  subtitle: {
    top: 85,
    fontSize: 18,
    fontFamily: FONT_REGULAR,
    color: "#666",
    textAlign: "center",
  },

  buttonsContainer: {
    width: "100%",
    marginTop: 40,
    marginBottom: 40,
  },
  buttonContainer: {
    marginBottom: 16,
  },
  signInButton: {
    backgroundColor: "#01a736",
    paddingVertical: 18,
    borderRadius: 30,
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    elevation: 8,
    shadowColor: "#01a736",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  signInButtonText: {
    color: "#fefefe",
    fontSize: 18,
    fontFamily: FONT_BOLD,
    marginRight: 10,
  },
  signUpButton: {
    backgroundColor: "transparent",
    paddingVertical: 18,
    borderRadius: 30,
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#01a736",
  },
  signUpButtonText: {
    color: "#01a736",
    fontSize: 18,
    fontFamily: FONT_BOLD,
    marginRight: 10,
  },
  buttonIcon: {
    marginLeft: 5,
  },

  infoContainer: {
    alignItems: "center",
    paddingHorizontal: 20,
    top: 60,
  },
  infoText: {
    color: "#999",
    fontSize: 14,
    fontFamily: FONT_REGULAR,
    textAlign: "center",
    lineHeight: 22,
  },
});
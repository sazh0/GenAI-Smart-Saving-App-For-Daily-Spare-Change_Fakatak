import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width: screenWidth } = Dimensions.get("window");

const GREEN = "#30d158";

export default function SignInPage() {
  const router = useRouter();

  /* ── Animation refs, grouped by role ─────────────────────────── */
  // Screen
  const logoAnim = useRef(new Animated.Value(0)).current;
  // Modal shell
  const modalFade = useRef(new Animated.Value(0)).current;
  const cardScale = useRef(new Animated.Value(0.92)).current;
  // Scanning
  const scanLine = useRef(new Animated.Value(-60)).current;
  const scanOpacity = useRef(new Animated.Value(0)).current;
  const facePulse = useRef(new Animated.Value(1)).current; // face outline breathing
  const bracketGlow = useRef(new Animated.Value(0.45)).current; // corner brackets
  const ring1 = useRef(new Animated.Value(0)).current; // outer pulse rings (0→1)
  const ring2 = useRef(new Animated.Value(0)).current;
  // Success
  const successScale = useRef(new Animated.Value(0)).current;
  const successGlow = useRef(new Animated.Value(0)).current;

  /* Keep handles on loops + timers so we can stop/clean them */
  const loopsRef = useRef<Animated.CompositeAnimation[]>([]);
  const navTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [showFaceId, setShowFaceId] = useState(false);
  const [scanStatus, setScanStatus] = useState<"scanning" | "success">(
    "scanning"
  );

  /* ── Entry: logo fade, then auto-open Face ID ─────────────────── */
  useEffect(() => {
    Animated.timing(logoAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => setShowFaceId(true), 500);
    return () => {
      clearTimeout(timer);
      if (navTimer.current) clearTimeout(navTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (showFaceId) startFaceIdSequence();
    return stopLoops;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showFaceId]);

  /* ── Helpers ──────────────────────────────────────────────────── */

  const stopLoops = () => {
    loopsRef.current.forEach((l) => l.stop());
    loopsRef.current = [];
  };

  /** Reset every animated value so re-opening the modal never glitches. */
  const resetAnimations = () => {
    stopLoops();
    modalFade.setValue(0);
    cardScale.setValue(0.92);
    scanLine.setValue(-60);
    scanOpacity.setValue(0);
    facePulse.setValue(1);
    bracketGlow.setValue(0.45);
    ring1.setValue(0);
    ring2.setValue(0);
    successScale.setValue(0);
    successGlow.setValue(0);
  };

  const startLoop = (anim: Animated.CompositeAnimation) => {
    loopsRef.current.push(anim);
    anim.start();
  };

  /* ── Main sequence ────────────────────────────────────────────── */

  const startFaceIdSequence = () => {
    resetAnimations();
    setScanStatus("scanning");

    // 1) Modal fade-in (~300ms) + card settle
    Animated.parallel([
      Animated.timing(modalFade, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(cardScale, {
        toValue: 1,
        speed: 14,
        bounciness: 6,
        useNativeDriver: true,
      }),
    ]).start();

    // 2) Ambient loops while scanning
    // Expanding pulse rings, staggered
    startLoop(
      Animated.loop(
        Animated.timing(ring1, {
          toValue: 1,
          duration: 1600,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        })
      )
    );
    startLoop(
      Animated.loop(
        Animated.sequence([
          Animated.delay(600),
          Animated.timing(ring2, {
            toValue: 1,
            duration: 1600,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          // snap back so the delay only applies to the first cycle
          Animated.timing(ring2, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      )
    );
    // Corner brackets glow
    startLoop(
      Animated.loop(
        Animated.sequence([
          Animated.timing(bracketGlow, {
            toValue: 1,
            duration: 700,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(bracketGlow, {
            toValue: 0.45,
            duration: 700,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      )
    );
    // Face outline breathing
    startLoop(
      Animated.loop(
        Animated.sequence([
          Animated.timing(facePulse, {
            toValue: 1.05,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(facePulse, {
            toValue: 1,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      )
    );
    // 3) Scan pass: fade line in, sweep down + up (~1.8s), fade out
    Animated.sequence([
      Animated.timing(scanOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scanLine, {
        toValue: 60,
        duration: 850,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(scanLine, {
        toValue: -60,
        duration: 850,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(scanOpacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) showSuccess();
    });
  };

  /* ── Success: check scales in, glow pulses once, then navigate ── */
  const showSuccess = () => {
    stopLoops();
    setScanStatus("success");

    Animated.parallel([
      Animated.spring(successScale, {
        toValue: 1,
        speed: 12,
        bounciness: 10,
        useNativeDriver: true,
      }),
      Animated.timing(successGlow, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();

    navTimer.current = setTimeout(() => {
      setShowFaceId(false);
      router.push("/Home");
    }, 700);
  };

  /* Tapping the logo re-opens the scan (no-op while already open) */
  const handleSignIn = () => {
    if (!showFaceId) setShowFaceId(true);
  };

  /* ── Derived styles ───────────────────────────────────────────── */
  const ringStyle = (v: Animated.Value) => ({
    opacity: v.interpolate({ inputRange: [0, 0.15, 1], outputRange: [0, 0.45, 0] }),
    transform: [
      { scale: v.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1.55] }) },
    ],
  });

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
            <Animated.View style={[styles.logoContainer, { opacity: logoAnim }]}>
              <TouchableOpacity onPress={handleSignIn} activeOpacity={0.8}>
                <Image
                  source={require("@/assets/images/GreenFakatk.png")}
                  style={styles.image}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </Animated.View>
          </View>
        </ScrollView>
      </View>

      {/* ── Face ID Modal ─────────────────────────────────────────── */}
      <Modal visible={showFaceId} transparent animationType="none">
        <Animated.View style={[styles.modalOverlay, { opacity: modalFade }]}>
          <Animated.View
            style={[styles.card, { transform: [{ scale: cardScale }] }]}
          >
            {/* Soft ambient glow behind the scan area */}
            <View style={styles.ambientGlow} pointerEvents="none" />

            <View style={styles.scanStage}>
              {/* Expanding pulse rings */}
              <Animated.View style={[styles.pulseRing, ringStyle(ring1)]} />
              <Animated.View style={[styles.pulseRing, ringStyle(ring2)]} />

              {/* Face icon area */}
              <View style={styles.faceIdIcon}>
                {/* Glowing corner brackets */}
                <Animated.View
                  style={[styles.bracketFrame, { opacity: bracketGlow }]}
                  pointerEvents="none"
                >
                  <View style={[styles.bracket, styles.topLeftBracket]} />
                  <View style={[styles.bracket, styles.topRightBracket]} />
                  <View style={[styles.bracket, styles.bottomLeftBracket]} />
                  <View style={[styles.bracket, styles.bottomRightBracket]} />
                </Animated.View>

                {/* Breathing face outline */}
                {scanStatus === "scanning" && (
                  <Animated.View
                    style={[
                      styles.faceElements,
                      { transform: [{ scale: facePulse }] },
                    ]}
                  >
                    <View style={styles.eyesRow}>
                      <View style={styles.eye} />
                      <View style={styles.eye} />
                    </View>
                    <View style={styles.mouth} />
                  </Animated.View>
                )}

                {/* Scan line + soft glow band */}
                {scanStatus === "scanning" && (
                  <Animated.View
                    pointerEvents="none"
                    style={[
                      styles.scanGroup,
                      {
                        opacity: scanOpacity,
                        transform: [{ translateY: scanLine }],
                      },
                    ]}
                  >
                    <View style={styles.scanGlowBand} />
                    <View style={styles.scanLine} />
                  </Animated.View>
                )}

                {/* Success check: scale-in + one glow pulse */}
                {scanStatus === "success" && (
                  <View style={styles.successWrap}>
                    <Animated.View
                      style={[
                        styles.successGlow,
                        {
                          opacity: successGlow.interpolate({
                            inputRange: [0, 0.4, 1],
                            outputRange: [0, 0.5, 0],
                          }),
                          transform: [
                            {
                              scale: successGlow.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0.6, 1.6],
                              }),
                            },
                          ],
                        },
                      ]}
                    />
                    <Animated.View
                      style={{ transform: [{ scale: successScale }] }}
                    >
                      <Ionicons
                        name="checkmark-circle"
                        size={96}
                        color={GREEN}
                      />
                    </Animated.View>
                  </View>
                )}
              </View>
            </View>

            {/* Status label */}
            <Text style={styles.statusText}>
              {scanStatus === "scanning"
                ? "جارٍ التحقق من هويتك…"
                : "تم التحقق بنجاح"}
            </Text>
          </Animated.View>
        </Animated.View>
      </Modal>
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
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    alignItems: "center",
    bottom: 300,
  },
  image: {
    width: 120,
    height: 150,
  },

  /* Modal shell — dark glass */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(8, 10, 14, 0.92)",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: Math.min(screenWidth - 56, 320),
    borderRadius: 28,
    backgroundColor: "rgba(28, 30, 36, 0.96)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    paddingVertical: 36,
    paddingHorizontal: 24,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 12,
  },
  ambientGlow: {
    position: "absolute",
    top: 16, // scanStage center (36 + 90) minus glow radius (110)
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(48, 209, 88, 0.07)",
  },

  /* Scan stage */
  scanStage: {
    width: 180,
    height: 180,
    alignItems: "center",
    justifyContent: "center",
  },
  pulseRing: {
    position: "absolute",
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 1.5,
    borderColor: GREEN,
  },
  faceIdIcon: {
    width: 120,
    height: 120,
    alignItems: "center",
    justifyContent: "center",
  },

  /* Corner brackets — frame fills the 120×120 icon area */
  bracketFrame: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  bracket: {
    position: "absolute",
    borderColor: "#ffffff",
    borderWidth: 3,
    width: 30,
    height: 30,
  },
  topLeftBracket: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 14,
  },
  topRightBracket: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: 14,
  },
  bottomLeftBracket: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: 14,
  },
  bottomRightBracket: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: 14,
  },

  /* Face — centered layer filling the frame */
  faceElements: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  eyesRow: {
    flexDirection: "row",
    marginBottom: 15,
  },
  eye: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#ffffff",
    marginHorizontal: 15,
  },
  mouth: {
    width: 30,
    height: 15,
    borderBottomWidth: 3,
    borderBottomColor: "#ffffff",
    borderRadius: 15,
  },

  /* Scan line */
  scanGroup: {
    position: "absolute",
    left: -10, // 140px wide, centered over the 120px frame
    width: 140,
    alignItems: "center",
    justifyContent: "center",
  },
  scanGlowBand: {
    position: "absolute",
    width: 140,
    height: 20,
    borderRadius: 10,
    backgroundColor: GREEN,
    opacity: 0.16,
  },
  scanLine: {
    width: 140,
    height: 2,
    borderRadius: 1,
    backgroundColor: GREEN,
    shadowColor: GREEN,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 10,
    elevation: 4,
  },

  /* Success — centered layer filling the frame */
  successWrap: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  successGlow: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: GREEN,
  },

  /* Status label */
  statusText: {
    marginTop: 45,
    marginBottom: -5,
    fontSize: 14,
    color: "rgba(255,255,255,0.85)",
    fontFamily: "Handicrafts-Medium",
    textAlign: "center",
    writingDirection: "rtl",
  },
});
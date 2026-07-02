import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
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

export default function SignUpPage() {
  const router = useRouter();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isLinkingCard, setIsLinkingCard] = useState(false);
  const [showCardDropdown, setShowCardDropdown] = useState(false);
  const [cardLinked, setCardLinked] = useState(false);
  const [nafathLoggedIn, setNafathLoggedIn] = useState(false);
  const [showNafathInputScreen, setShowNafathInputScreen] = useState(false);
  const [showRiskAssessment, setShowRiskAssessment] = useState(false);

  const [formData, setFormData] = useState({
    nationalId: "",
    name: "",
    phone: "",
    birthdate: "",
    cardNumber: "",
    cardName: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
  });

  const [riskAssessment, setRiskAssessment] = useState({
    riskCategory: "",
  });

  const logoAnim = useRef(new Animated.Value(0)).current;
  const contentAnim = useRef(new Animated.Value(50)).current;
  const iconsAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animationSequence = Animated.sequence([
      Animated.timing(logoAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(contentAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(iconsAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]);

    animationSequence.start();
  }, []);

  // Function to check if all required fields are complete
  const isFormComplete = () => {
    return (
      nafathLoggedIn &&
      formData.name &&
      formData.phone &&
      formData.birthdate &&
      cardLinked
    );
  };

  // Handle Nafath login button click
  const handleNafathLogin = () => {
    setShowNafathInputScreen(true);
  };

  // Handle national ID verification
  const handleNafathVerification = () => {
    if (!formData.nationalId || formData.nationalId.length !== 10) {
      Alert.alert("تنبيه", "يرجى إدخال رقم هوية وطنية صحيح (10 أرقام)");
      return;
    }

    setIsLoggingIn(true);
    setTimeout(() => {
      setIsLoggingIn(false);
      setNafathLoggedIn(true);
      setShowNafathInputScreen(false);
      // Auto-fill some basic info after successful Nafath login
      setFormData({
        ...formData,
        name: "عبدالكريم الشهري",
        nationalId: "1234567890",
        birthdate: "1990-05-15",
      });
      Alert.alert(
        "تم تسجيل الدخول بنجاح",
        "تم تسجيل الدخول عبر النفاذ الوطني الموحد بنجاح",
        [{ text: "موافق" }]
      );
    }, 2000);
  };

  // Handle card linking
  const handleCardLinking = () => {
    const requiredCardFields = [
      "cardNumber",
      "cardName",
      "expiryMonth",
      "expiryYear",
      "cvv",
    ];
    const missingFields = requiredCardFields.filter(
      (field) => !formData[field as keyof typeof formData]
    );

    if (missingFields.length > 0) {
      Alert.alert("تنبيه", "يرجى ملء جميع بيانات البطاقة");
      return;
    }

    setIsLinkingCard(true);
    setTimeout(() => {
      setIsLinkingCard(false);
      setCardLinked(true);
      setShowCardDropdown(false);
      Alert.alert(
        "تم ربط البطاقة",
        "تم ربط البطاقة الائتمانية بنجاح. تم خصم 0 ريال سعودي للتحقق من الحساب",
        [{ text: "موافق" }]
      );
    }, 2000);
  };

  // Handle proceeding to risk assessment
  const handleProceedToRiskAssessment = () => {
    if (!isFormComplete()) {
      let missingItems = [];

      if (!nafathLoggedIn) {
        missingItems.push("تسجيل الدخول عبر النفاذ الوطني الموحد");
      }
      if (!formData.name) missingItems.push("الاسم الكامل");
      if (!formData.phone) missingItems.push("رقم الجوال");
      if (!formData.birthdate) missingItems.push("تاريخ الميلاد");
      if (!cardLinked) missingItems.push("ربط البطاقة الائتمانية");

      Alert.alert("تنبيه", `يرجى إكمال: ${missingItems.join("، ")}`);
      return;
    }

    setShowRiskAssessment(true);
  };

  // Handle account creation and navigation to home
  const handleCreateAccount = () => {
    if (!riskAssessment.riskCategory) {
      Alert.alert("تنبيه", "يرجى اختيار تصنيف المخاطر");
      return;
    }

    // Navigate directly to home page
    try {
      console.log("Navigating to home...");
      router.replace("/Home");
    } catch (error) {
      console.error("Navigation error:", error);
      // Try alternative paths
      try {
        router.replace("/Home");
      } catch (e) {
        try {
          router.push("/Home");
        } catch (e2) {
          Alert.alert("نجح التسجيل", "تم إنشاء الحساب بنجاح", [
            { text: "موافق", onPress: () => router.push("/") },
          ]);
        }
      }
    }
  };

  const formatBirthdate = (text: string) => {
    // Remove any non-digit characters
    const cleaned = text.replace(/\D/g, "");

    // Add slashes at appropriate positions
    if (cleaned.length >= 4) {
      return (
        cleaned.slice(0, 4) +
        "/" +
        (cleaned.length >= 6
          ? cleaned.slice(4, 6) + "/" + cleaned.slice(6, 8)
          : cleaned.slice(4))
      );
    }
    return cleaned;
  };

  const getProgressWidth = () => {
    if (showRiskAssessment) return "90%";
    return "60%";
  };

  // Risk Assessment Screen
  if (showRiskAssessment) {
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

              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View
                    style={[styles.progressFill, { width: getProgressWidth() }]}
                  />
                </View>
              </View>

              <View style={styles.contentContainer}>
                <Text style={styles.assessmentTitle}>تقييم المخاطر</Text>
                <Text style={styles.assessmentSubtitle}>
                  اختر تصنيف المخاطر المناسب لك
                </Text>

                <View style={styles.questionContainer}>
                  <TouchableOpacity
                    style={[
                      styles.optionButton,
                      riskAssessment.riskCategory === "low" &&
                      styles.selectedOption,
                    ]}
                    onPress={() =>
                      setRiskAssessment({
                        ...riskAssessment,
                        riskCategory: "low",
                      })
                    }
                  >
                    <View style={styles.radioButton}>
                      {riskAssessment.riskCategory === "low" && (
                        <View style={styles.radioButtonSelected} />
                      )}
                    </View>
                    <Text style={styles.optionText}>مخاطر ائتمانية منخفضة</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.optionButton,
                      riskAssessment.riskCategory === "medium" &&
                      styles.selectedOption,
                    ]}
                    onPress={() =>
                      setRiskAssessment({
                        ...riskAssessment,
                        riskCategory: "medium",
                      })
                    }
                  >
                    <View style={styles.radioButton}>
                      {riskAssessment.riskCategory === "medium" && (
                        <View style={styles.radioButtonSelected} />
                      )}
                    </View>
                    <Text style={styles.optionText}>مخاطر ائتمانية معتدلة</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.optionButton,
                      riskAssessment.riskCategory === "high" &&
                      styles.selectedOption,
                    ]}
                    onPress={() =>
                      setRiskAssessment({
                        ...riskAssessment,
                        riskCategory: "high",
                      })
                    }
                  >
                    <View style={styles.radioButton}>
                      {riskAssessment.riskCategory === "high" && (
                        <View style={styles.radioButtonSelected} />
                      )}
                    </View>
                    <Text style={styles.optionText}>مخاطر ائتمانية عالية</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.navigationContainer}>
                  <TouchableOpacity
                    style={styles.nextButton}
                    onPress={handleCreateAccount}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.nextButtonText}>إنشاء الحساب</Text>
                    <Ionicons name="arrow-forward" size={20} color="#fefefe" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </>
    );
  }

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

            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View
                  style={[styles.progressFill, { width: getProgressWidth() }]}
                />
              </View>
            </View>

            <View style={styles.contentContainer}>
              <Animated.View
                style={[
                  styles.stepContent,
                  { transform: [{ translateY: contentAnim }] },
                ]}
              >
                {/* Nafath Input Screen */}
                {showNafathInputScreen ? (
                  <View>
                    <Text style={styles.stepTitle}>التحقق من الهوية</Text>
                    <Text style={styles.stepSubtitle}>
                      ادخل رقم الهوية الوطنية للتحقق من بياناتك
                    </Text>

                    <View style={styles.inputContainer}>
                      <MaterialIcons
                        name="credit-card"
                        size={20}
                        color="#001a6e"
                        style={styles.inputIcon}
                      />
                      <TextInput
                        style={styles.textInput}
                        placeholder="رقم الهوية الوطنية"
                        placeholderTextColor="#999"
                        value={formData.nationalId}
                        onChangeText={(text) =>
                          setFormData({ ...formData, nationalId: text })
                        }
                        keyboardType="numeric"
                        maxLength={10}
                      />
                    </View>

                    <TouchableOpacity
                      style={[
                        styles.nafathLoginButton,
                        isLoggingIn && styles.nafathLoggedInButton,
                      ]}
                      onPress={handleNafathVerification}
                      disabled={isLoggingIn}
                    >
                      {isLoggingIn ? (
                        <ActivityIndicator size="small" color="#fff" />
                      ) : (
                        <Text style={styles.nafathButtonText}>التحقق</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                ) : (
                  // Initial Nafath login screen
                  <>
                    <Text style={styles.stepTitle1}>
                      سجل دخولك عبر النفاذ الوطني الموحد
                    </Text>

                    <Animated.View
                      style={[
                        styles.nicLogoContainer,
                        { opacity: logoAnim, transform: [{ scale: logoAnim }] },
                      ]}
                    >
                      <Image
                        source={require("@/assets/images/NIC.png")}
                        style={{ width: "200%", height: "200%" }}
                        resizeMode="contain"
                      />
                    </Animated.View>

                    <Text style={styles.nafathDescription}>
                      هذه الخطوة مطلوبة من البنك المركزي السعودي لضمان سلامة
                      بيانات العملاء من خلال مطابقتها مع معلوماتهم في نظام نفاذ.
                      تحقق من حسابك الآن وابدأ رحلتك الإدخارية!
                    </Text>

                    <TouchableOpacity
                      style={[
                        styles.nafathLoginButton,
                        nafathLoggedIn && styles.nafathLoggedInButton,
                      ]}
                      onPress={handleNafathLogin}
                      disabled={isLoggingIn || nafathLoggedIn}
                    >
                      {isLoggingIn ? (
                        <ActivityIndicator size="small" color="#fff" />
                      ) : (
                        <>
                          <MaterialIcons
                            name={nafathLoggedIn ? "check-circle" : "login"}
                            size={24}
                            color="#fff"
                            style={styles.nafathButtonIcon}
                          />
                          <Text style={styles.nafathButtonText}>
                            {nafathLoggedIn
                              ? "تم تسجيل الدخول بنجاح"
                              : "تسجيل دخول عبر النفاذ الوطني الموحد"}
                          </Text>
                        </>
                      )}
                    </TouchableOpacity>
                  </>
                )}

                {/* Form fields after Nafath login */}
                {nafathLoggedIn && (
                  <>
                    <View style={styles.successContainer}>
                      <MaterialIcons
                        name="verified-user"
                        size={24}
                        color="#01a736"
                      />
                      <Text style={styles.successText}>
                        تم التحقق من هويتك بنجاح عبر النفاذ الوطني الموحد
                      </Text>
                    </View>

                    <View style={styles.inputContainer}>
                      <MaterialIcons
                        name="person"
                        size={20}
                        color="#001a6e"
                        style={styles.inputIcon}
                      />
                      <TextInput
                        style={[styles.textInput, styles.disabledInput]}
                        placeholder="الاسم الكامل"
                        placeholderTextColor="#999"
                        value={formData.name}
                        editable={false}
                      />
                      <MaterialIcons name="lock" size={16} color="#999" />
                    </View>

                    <View style={styles.inputContainer}>
                      <MaterialIcons
                        name="phone"
                        size={20}
                        color="#001a6e"
                        style={styles.inputIcon}
                      />
                      <TextInput
                        style={styles.textInput}
                        placeholder="رقم الجوال"
                        placeholderTextColor="#999"
                        value={formData.phone}
                        onChangeText={(text) =>
                          setFormData({ ...formData, phone: text })
                        }
                        keyboardType="phone-pad"
                      />
                    </View>

                    <View style={styles.inputContainer}>
                      <MaterialIcons
                        name="cake"
                        size={20}
                        color="#001a6e"
                        style={styles.inputIcon}
                      />
                      <TextInput
                        style={styles.textInput}
                        placeholder="تاريخ الميلاد (YYYY/MM/DD)"
                        placeholderTextColor="#999"
                        value={formData.birthdate}
                        onChangeText={(text) => {
                          const formatted = formatBirthdate(text);
                          setFormData({ ...formData, birthdate: formatted });
                        }}
                        keyboardType="numeric"
                        maxLength={10}
                      />
                    </View>

                    {/* Payment Method Section */}
                    <View style={styles.walletContainer}>
                      <Text style={styles.walletLabel}>طريقة الدفع</Text>
                      <TouchableOpacity
                        style={[
                          styles.walletOption,
                          cardLinked && styles.linkedWallet,
                        ]}
                        onPress={() => setShowCardDropdown(!showCardDropdown)}
                      >
                        <MaterialIcons
                          name="credit-card"
                          size={24}
                          color="#001a6e"
                        />
                        <Text style={styles.walletText}>بطاقة ائتمانية</Text>
                        {cardLinked ? (
                          <View style={styles.linkedIndicator}>
                            <MaterialIcons
                              name="check-circle"
                              size={20}
                              color="#01a736"
                            />
                            <Text style={styles.linkedText}>مربوطة</Text>
                          </View>
                        ) : (
                          <View style={styles.dropdownIndicator}>
                            <Text style={styles.linkText}>
                              اضغط لإدخال البيانات
                            </Text>
                            <Ionicons
                              name={
                                showCardDropdown ? "chevron-up" : "chevron-down"
                              }
                              size={20}
                              color="#001a6e"
                            />
                          </View>
                        )}
                      </TouchableOpacity>

                      {/* Card dropdown */}
                      {showCardDropdown && !cardLinked && (
                        <View style={styles.cardDropdown}>
                          <View style={styles.cardLogos}>
                            <Text style={styles.acceptedCardsText}>
                              البطاقات المقبولة:
                            </Text>
                            <View style={styles.logoRow}>
                              <Text style={styles.cardLogo}>💳 VISA</Text>
                              <Text style={styles.cardLogo}>💳 MasterCard</Text>
                              <Text style={styles.cardLogo}>💳 AMEX</Text>
                              <Text style={styles.cardLogo}>💳 مدى</Text>
                            </View>
                          </View>

                          <View style={styles.cardInputContainer}>
                            <TextInput
                              style={styles.cardInput}
                              placeholder="رقم البطاقة (0000 0000 0000 0000)"
                              placeholderTextColor="#999"
                              value={formData.cardNumber}
                              onChangeText={(text) =>
                                setFormData({ ...formData, cardNumber: text })
                              }
                              keyboardType="numeric"
                              maxLength={19}
                            />
                          </View>

                          <View style={styles.cardInputContainer}>
                            <TextInput
                              style={styles.cardInput}
                              placeholder="الاسم على البطاقة"
                              placeholderTextColor="#999"
                              value={formData.cardName}
                              onChangeText={(text) =>
                                setFormData({ ...formData, cardName: text })
                              }
                            />
                          </View>

                          <View style={styles.cardRowInputs}>
                            <View
                              style={[
                                styles.cardInputContainer,
                                { flex: 1, marginRight: 10 },
                              ]}
                            >
                              <TextInput
                                style={styles.cardInput}
                                placeholder="السنة"
                                placeholderTextColor="#999"
                                value={formData.expiryYear}
                                onChangeText={(text) =>
                                  setFormData({ ...formData, expiryYear: text })
                                }
                                keyboardType="numeric"
                                maxLength={2}
                              />
                            </View>
                            <View
                              style={[
                                styles.cardInputContainer,
                                { flex: 1, marginRight: 10 },
                              ]}
                            >
                              <TextInput
                                style={styles.cardInput}
                                placeholder="الشهر"
                                placeholderTextColor="#999"
                                value={formData.expiryMonth}
                                onChangeText={(text) =>
                                  setFormData({
                                    ...formData,
                                    expiryMonth: text,
                                  })
                                }
                                keyboardType="numeric"
                                maxLength={2}
                              />
                            </View>
                            <View
                              style={[styles.cardInputContainer, { flex: 1 }]}
                            >
                              <TextInput
                                style={styles.cardInput}
                                placeholder="CVV"
                                placeholderTextColor="#999"
                                value={formData.cvv}
                                onChangeText={(text) =>
                                  setFormData({ ...formData, cvv: text })
                                }
                                keyboardType="numeric"
                                maxLength={3}
                                secureTextEntry
                              />
                            </View>
                          </View>

                          <Text style={styles.cardNote}>
                            ملاحظة: سيتم سحب مبلغ 0 ريال للتأكد من صلاحية
                            البطاقة ومن ثم إعادة المبلغ بشكل تلقائي.
                          </Text>

                          <TouchableOpacity
                            style={styles.linkCardButton}
                            onPress={handleCardLinking}
                            disabled={isLinkingCard}
                          >
                            {isLinkingCard ? (
                              <ActivityIndicator size="small" color="#fff" />
                            ) : (
                              <Text style={styles.linkCardButtonText}>
                                ربط البطاقة
                              </Text>
                            )}
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  </>
                )}
              </Animated.View>

              {nafathLoggedIn && (
                <View style={styles.navigationContainer}>
                  <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                    <TouchableOpacity
                      style={styles.nextButton}
                      onPress={handleProceedToRiskAssessment}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.nextButtonText}>التالي</Text>
                      <Ionicons
                        name="arrow-forward"
                        size={20}
                        color="#fefefe"
                      />
                    </TouchableOpacity>
                  </Animated.View>
                </View>
              )}

              <Animated.View
                style={[styles.signInContainer, { opacity: iconsAnim }]}
              >
                <Text style={styles.signInText}>لديك حساب بالفعل؟ </Text>
                <TouchableOpacity onPress={() => router.push("/signin")}>
                  <Text style={styles.signInLink}>تسجيل دخول</Text>
                </TouchableOpacity>
              </Animated.View>
            </View>
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
  },
  container: {
    flex: 1,
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  image: {
    width: 80,
    height: 80,
  },
  progressContainer: {
    marginBottom: 30,
    alignItems: "center",
  },
  progressText: {
    fontSize: 16,
    fontFamily: FONT_BOLD,
    color: "#01a736",
    marginBottom: 8,
    lineHeight: 20,
  },
  progressBar: {
    width: "100%",
    height: 4,
    backgroundColor: "#e0e0e0",
    borderRadius: 2,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#01a736",
    borderRadius: 2,
  },
  contentContainer: {
    flex: 1,
    width: "100%",
  },
  stepContent: {
    flex: 1,
    marginBottom: 30,
  },
  stepTitle: {
    fontSize: 24,
    fontFamily: FONT_BOLD,
    color: "#01a736",
    textAlign: "center",
    marginBottom: -6,
    lineHeight: 40,
  },
  stepTitle1: {
    fontSize: 18,
    fontFamily: FONT_BOLD,
    color: "#01a736",
    textAlign: "center",
    marginBottom: 70,
    lineHeight: 40,
  },
  stepSubtitle: {
    fontSize: 16,
    fontFamily: FONT_REGULAR,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 25,
  },
  nicLogoContainer: {
    alignItems: "center",
    marginBottom: 70,
    marginLeft: 35,
    width: 300,
    height: 40,
  },
  nafathDescription: {
    fontSize: 15,
    fontFamily: FONT_REGULAR,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 25,
    paddingHorizontal: 10,
  },
  nafathLoginButton: {
    backgroundColor: "#2e8b7d",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#2e8b7d",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  nafathLoggedInButton: {
    backgroundColor: "#01a736",
  },
  nafathButtonIcon: {
    marginRight: 10,
  },
  nafathButtonText: {
    fontSize: 16,
    fontFamily: FONT_BOLD,
    color: "#fff",
    textAlign: "center",
    lineHeight: 24,
  },
  successContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(1, 167, 54, 0.1)",
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(1, 167, 54, 0.3)",
  },
  successText: {
    fontSize: 14,
    fontFamily: FONT_BOLD,
    color: "#01a736",
    marginLeft: 10,
    textAlign: "right",
    flex: 1,
    lineHeight: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 4,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(0, 26, 110, 0.1)",
    elevation: 2,
    shadowColor: "#001a6e",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: FONT_REGULAR,
    color: "#333",
    paddingVertical: 15,
    textAlign: "right",
  },
  disabledInput: {
    color: "#999",
    backgroundColor: "rgba(0, 0, 0, 0.05)",
  },
  walletContainer: {
    marginTop: 10,
  },
  walletLabel: {
    fontSize: 16,
    fontFamily: FONT_BOLD,
    color: "#001a6e",
    marginBottom: 10,
    textAlign: "right",
    lineHeight: 25,
  },
  walletOption: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: "rgba(0, 26, 110, 0.1)",
  },
  linkedWallet: {
    borderColor: "rgba(1, 167, 54, 0.3)",
    backgroundColor: "rgba(1, 167, 54, 0.05)",
  },
  walletText: {
    flex: 1,
    fontSize: 16,
    fontFamily: FONT_REGULAR,
    color: "#333",
    marginLeft: 10,
    textAlign: "right",
  },
  linkedIndicator: {
    flexDirection: "row",
    alignItems: "center",
  },
  linkedText: {
    fontSize: 14,
    fontFamily: FONT_BOLD,
    color: "#01a736",
    marginLeft: 5,
  },
  dropdownIndicator: {
    flexDirection: "row",
    alignItems: "center",
  },
  linkText: {
    fontSize: 14,
    fontFamily: FONT_REGULAR,
    color: "#001a6e",
    marginLeft: 8,
    lineHeight: 20,
  },
  cardDropdown: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginTop: 10,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(0, 26, 110, 0.1)",
    elevation: 3,
    shadowColor: "#001a6e",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardLogos: {
    marginBottom: 20,
  },
  acceptedCardsText: {
    fontSize: 14,
    fontFamily: FONT_BOLD,
    color: "#001a6e",
    marginBottom: 8,
    textAlign: "right",
  },
  logoRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  cardLogo: {
    fontSize: 12,
    fontFamily: FONT_REGULAR,
    color: "#666",
  },
  cardInputContainer: {
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(0, 26, 110, 0.1)",
  },
  cardInput: {
    fontSize: 16,
    fontFamily: FONT_REGULAR,
    color: "#333",
    paddingVertical: 15,
    paddingHorizontal: 15,
    textAlign: "right",
  },
  cardRowInputs: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardNote: {
    fontSize: 12,
    fontFamily: FONT_REGULAR,
    color: "#666",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 15,
    backgroundColor: "#fff8e1",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ffcc02",
  },
  linkCardButton: {
    backgroundColor: "#01a736",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#01a736",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  linkCardButtonText: {
    fontSize: 16,
    fontFamily: FONT_BOLD,
    color: "#fff",
  },
  navigationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: "#f8f9fa",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 25,
    paddingVertical: 15,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#001a6e",
  },
  backButtonText: {
    fontSize: 16,
    fontFamily: FONT_BOLD,
    color: "#001a6e",
    marginLeft: 8,
    lineHeight: 20,
  },
  nextButton: {
    backgroundColor: "#01a736",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    elevation: 4,
    shadowColor: "#01a736",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  nextButtonText: {
    fontSize: 16,
    fontFamily: FONT_BOLD,
    color: "#fefefe",
    marginRight: 8,
    lineHeight: 20,
  },
  signInContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  signInText: {
    fontSize: 14,
    fontFamily: FONT_REGULAR,
    color: "#666",
    lineHeight: 20,
  },
  signInLink: {
    fontSize: 14,
    fontFamily: FONT_BOLD,
    color: "#01a736",
    lineHeight: 20,
  },
  // Risk Assessment Styles
  assessmentTitle: {
    fontSize: 24,
    fontFamily: FONT_BOLD,
    color: "#01a736",
    textAlign: "center",
    marginBottom: 10,
    lineHeight: 40,
  },
  assessmentSubtitle: {
    fontSize: 16,
    fontFamily: FONT_REGULAR,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 25,
    paddingHorizontal: 10,
  },
  questionContainer: {
    marginBottom: 30,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(0, 26, 110, 0.1)",
  },
  selectedOption: {
    backgroundColor: "rgba(1, 167, 54, 0.1)",
    borderColor: "#01a736",
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#001a6e",
    marginLeft: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  radioButtonSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#01a736",
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    fontFamily: FONT_REGULAR,
    color: "#333",
    textAlign: "right",
    lineHeight: 24,
  },
});

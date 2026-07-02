import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  Image,
  Modal,
  ScrollView,
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

interface RecentActivity {
  amount: number;
  date: string;
  source: string;
}

interface ServiceButton {
  id: 'fukka' | 'fukka_five' | 'fukka_ten';
  title: string;
  example: string;
  enabled: boolean;
}

interface WeeklyStep {
  id: string;
  icon: string;
  title: string;
  message: string;
  impact: string;
  successMessage: string;
  /** Optional side effect when the step is applied */
  action?: "enable_fukka_five";
}

export default function InvestmentDashboard() {
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceButton | null>(null);

  // Weekly smart step carousel
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isSmartStepCollapsed, setIsSmartStepCollapsed] = useState(false);
  const [weeklyStepsFinished, setWeeklyStepsFinished] = useState(false);
  const [appliedStepIds, setAppliedStepIds] = useState<string[]>([]);
  const [appliedMessage, setAppliedMessage] = useState<string | null>(null);
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const collapseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [serviceButtons, setServiceButtons] = useState<ServiceButton[]>([
    {
      id: 'fukka_ten',
      title: 'فكّة عشر',
      example: 'مثال: عند شراء بـ 47.25 ريال، سيتم تقريبه لـ 50 ريال واستثمار 2.75 ريال',
      enabled: false
    },
    {
      id: 'fukka_five',
      title: 'فكّة خمس',
      example: 'مثال: عند شراء بـ 23.50 ريال، سيتم تقريبه لـ 25 ريال واستثمار 1.50 ريال',
      enabled: false
    },
    {
      id: 'fukka',
      title: 'فكّة',
      example: 'مثال: عند شراء بـ 15.75 ريال، سيتم سحب 0.25 ريال كفكة للاستثمار',
      enabled: true
    }
  ]);

  const RiyalIcon = ({
    size = 16,
    color,
    style = {},
  }: {
    size?: number;
    color: string;
    style?: any;
  }) => (
    <Image
      source={require("@/assets/images/riyal.png")}
      style={[
        {
          width: size,
          height: size,
          resizeMode: "contain",
          tintColor: color,
        },
        style,
      ]}
    />
  );

  const currentBalance = 21.60;
  const totalTransactions = 45;
  const recentActivities: RecentActivity[] = [
    { amount: 0.55, date: "اليوم", source: "عملية شراء" },
    { amount: 1.25, date: "أمس", source: "عملية شراء" },
    { amount: 0.75, date: "منذ يومين", source: "عملية شراء" },
    { amount: 2.1, date: "منذ 3 أيام", source: "عملية شراء" },
    { amount: 0.95, date: "منذ 4 أيام", source: "عملية شراء" },
  ];

  const handleServicePress = (service: ServiceButton) => {
    setSelectedService(service);
    setShowServiceModal(true);
  };

  const handleEnableService = (serviceId: string) => {
    setServiceButtons(prev => prev.map(service => ({
      ...service,
      enabled: service.id === serviceId
    })));
    setShowServiceModal(false);
  };

  // ── Weekly smart steps ───────────────────────────────────────────
  const weeklySteps: WeeklyStep[] = [
    {
      id: "step_fukka_five",
      icon: "autorenew",
      title: "ارفع فكّتك إلى فكّة خمس",
      message:
        "لاحظت فكّتك أن عدد مشترياتك هذا الأسبوع مرتفع وأنك تجمع الفكة بسرعة. رفع التدوير إلى فكّة خمس قد يساعدك على الوصول لهدفك الادخاري بشكل أسرع.",
      impact: "قد ترفع ادخارك الشهري إلى 95 ر.س",
      successMessage: "تم تفعيل فكّة خمس بنجاح",
      action: "enable_fukka_five",
    },
    {
      id: "step_alinma",
      icon: "account-balance",
      title: "استثمر فكتك بمخاطر منخفضة",
      message:
        "بما أنك تجمع الفكة بانتظام، يقترح فكّتك توجيه جزء من رصيدك إلى خيار استثماري منخفض المخاطر عبر مصرف الإنماء، ليساعدك على تنمية مدخراتك تدريجيًا.",
      impact: "مناسب للادخار الهادئ طويل المدى",
      successMessage: "تم حفظ التوصية ضمن خطتك الادخارية",
    },
  ];

  const currentStep = weeklySteps[currentStepIndex];
  const isCurrentApplied = appliedStepIds.includes(currentStep.id);

  /** Show end message, then collapse into the compact card */
  const finishWeeklySteps = () => {
    setWeeklyStepsFinished(true);
    collapseTimer.current = setTimeout(() => setIsSmartStepCollapsed(true), 2400);
  };

  const handleApplyWeeklyStep = () => {
    const step = weeklySteps[currentStepIndex];

    // Side effect: recommendation 1 switches the top service selector
    if (step.action === "enable_fukka_five") {
      setServiceButtons(prev => prev.map(service => ({
        ...service,
        enabled: service.id === "fukka_five",
      })));
    }

    setAppliedStepIds(prev =>
      prev.includes(step.id) ? prev : [...prev, step.id]
    );
    setAppliedMessage(step.successMessage);

    // Brief success state, then advance (or finish)
    const isLast = currentStepIndex >= weeklySteps.length - 1;
    advanceTimer.current = setTimeout(() => {
      setAppliedMessage(null);
      if (isLast) finishWeeklySteps();
      else setCurrentStepIndex(i => i + 1);
    }, 1600);
  };

  const handleSkipWeeklyStep = () => {
    if (currentStepIndex < weeklySteps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      finishWeeklySteps();
    }
  };

  /** Re-open the carousel from the compact card */
  const openSmartStepDetails = () => {
    if (collapseTimer.current) clearTimeout(collapseTimer.current);
    setIsSmartStepCollapsed(false);
    setWeeklyStepsFinished(false);
    setCurrentStepIndex(0);
    setAppliedMessage(null);
  };

  // Clean up pending timers on unmount
  useEffect(() => {
    return () => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
      if (collapseTimer.current) clearTimeout(collapseTimer.current);
    };
  }, []);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Current Balance Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <MaterialIcons
            name="account-balance-wallet"
            size={24}
            color="#01a736"
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitleRight}>الرصيد الحالي</Text>
          </View>
        </View>
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceAmount}>{currentBalance.toFixed(2)}</Text>
          <RiyalIcon size={28} color="#01a736" style={styles.riyalIcon} />
        </View>

        {/* Service Buttons */}
        <View style={styles.serviceButtonsContainer}>
          {serviceButtons.map((service, index) => (
            <TouchableOpacity
              key={service.id}
              style={[
                styles.serviceButton,
                service.enabled ? styles.serviceButtonEnabled : styles.serviceButtonDisabled,
                index === 0 && styles.serviceButtonFirst,
                index === serviceButtons.length - 1 && styles.serviceButtonLast
              ]}
              onPress={() => handleServicePress(service)}
            >
              <Text style={[
                styles.serviceButtonText,
                service.enabled ? styles.serviceButtonTextEnabled : styles.serviceButtonTextDisabled
              ]}>
                {service.title}
              </Text>
              {service.enabled && (
                <View style={styles.enabledIndicator}>
                  <MaterialIcons name="check-circle" size={16} color="#01a736" />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>


      {/* Service Modal */}
      <Modal
        visible={showServiceModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowServiceModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {selectedService && (
              <>
                <View style={styles.modalHeader}>
                  <TouchableOpacity
                    onPress={() => setShowServiceModal(false)}
                    style={styles.modalCloseButton}
                  >
                    <MaterialIcons name="close" size={24} color="#6b7280" />
                  </TouchableOpacity>
                  <Text style={styles.modalTitle}>{selectedService.title}</Text>
                </View>

                <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
                  <View style={styles.modalSection}>

                  </View>

                  <View style={styles.modalSection}>
                    <View style={styles.exampleContainer}>
                      <Text style={styles.modalExample}>{selectedService.example}</Text>
                    </View>
                  </View>

                  {selectedService.enabled ? (
                    <View style={styles.enabledBadge}>
                      <MaterialIcons name="check-circle" size={20} color="#01a736" />
                      <Text style={styles.enabledText}>هذه الخدمة مُفعلة حالياً</Text>
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={styles.enableButton}
                      onPress={() => handleEnableService(selectedService.id)}
                    >
                      <Text style={styles.enableButtonText}>تفعيل هذه الخدمة</Text>
                      <MaterialIcons name="arrow-forward" size={20} color="#ffffff" />
                    </TouchableOpacity>
                  )}
                </ScrollView>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Smart Weekly Step — carousel */}
      {isSmartStepCollapsed ? (
        /* Compact collapsed card */
        <TouchableOpacity
          style={[styles.card, styles.compactCard]}
          onPress={openSmartStepDetails}
          activeOpacity={0.8}
        >
          <View style={styles.compactRow}>
            <View style={styles.aiStepIconChip}>
              <MaterialIcons name="auto-awesome" size={16} color={TEAL} />
            </View>
            <View style={styles.compactTexts}>
              <Text style={styles.compactTitle}>خطوة الأسبوع الذكية</Text>
              <Text style={styles.compactSubtitle}>
                تم عرض توصيات هذا الأسبوع
              </Text>
            </View>
            <View style={styles.compactDetailsBtn}>
              <Text style={styles.compactDetailsText}>التفاصيل</Text>
              <MaterialIcons name="chevron-left" size={18} color={TEAL} />
            </View>
          </View>
        </TouchableOpacity>
      ) : (
        /* Expanded carousel card */
        <View style={[styles.card, styles.aiStepCard]}>
          <View style={styles.aiStepHeader}>
            <View style={styles.aiHeaderLeft}>
              <View style={styles.aiBadge}>
                <MaterialIcons name="auto-awesome" size={12} color={TEAL} />
                <Text style={styles.aiBadgeText}>مساعدي المالي</Text>
              </View>
              {!weeklyStepsFinished && (
                <View style={styles.stepCounter}>
                  <Text style={styles.stepCounterText}>
                    {currentStepIndex + 1} / {weeklySteps.length}
                  </Text>
                </View>
              )}
            </View>
            <Text style={styles.aiStepSection}>خطوة الأسبوع الذكية</Text>
          </View>

          {weeklyStepsFinished ? (
            /* End state before collapsing */
            <View style={styles.endStateWrap}>
              <MaterialIcons name="event-available" size={28} color={TEAL} />
              <Text style={styles.endStateText}>
                هذه توصيات الأسبوع الحالية، وإذا ظهرت توصيات جديدة سنحدّثها لك.
              </Text>
            </View>
          ) : (
            <>
              {/* Step title with per-step icon */}
              <View style={styles.aiStepRow}>
                <View style={styles.aiStepIconChip}>
                  <MaterialIcons
                    name={currentStep.icon as any}
                    size={16}
                    color={TEAL}
                  />
                </View>
                <Text style={styles.aiStepTitle}>{currentStep.title}</Text>
              </View>

              <Text style={styles.aiStepMessage} numberOfLines={3}>
                {currentStep.message}
              </Text>

              <View style={styles.aiImpactRow}>
                <MaterialIcons name="trending-up" size={14} color={TEAL} />
                <Text style={styles.aiImpactText}>{currentStep.impact}</Text>
              </View>

              {appliedMessage ? (
                /* Success state shown briefly after applying */
                <View style={styles.successBanner}>
                  <MaterialIcons name="check-circle" size={16} color={TEAL} />
                  <Text style={styles.successBannerText}>{appliedMessage}</Text>
                </View>
              ) : (
                <View style={styles.aiActions}>
                  <TouchableOpacity
                    style={[
                      styles.aiPrimaryBtn,
                      isCurrentApplied && styles.aiPrimaryBtnApplied,
                    ]}
                    onPress={handleApplyWeeklyStep}
                    disabled={isCurrentApplied}
                    activeOpacity={0.8}
                  >
                    {isCurrentApplied && (
                      <MaterialIcons name="check" size={16} color="#ffffff" />
                    )}
                    <Text style={styles.aiPrimaryBtnText}>
                      {isCurrentApplied ? "تم التطبيق" : "تطبيق الخطة"}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.aiLaterBtn}
                    onPress={handleSkipWeeklyStep}
                    activeOpacity={0.6}
                  >
                    <Text style={styles.aiLaterBtnText}>لاحقاً</Text>
                  </TouchableOpacity>
                </View>
              )}
            </>
          )}
        </View>
      )}


      {/* Weekly Summary Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <MaterialIcons name="insights" size={24} color={TEAL} />
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitleRight}>ملخص الأسبوع</Text>
          </View>
        </View>

        {/* 2×2 quick stats */}
        <View style={styles.weekGrid}>
          <View style={styles.weekStat}>
            <View style={styles.weekStatIcon}>
              <MaterialIcons name="receipt-long" size={16} color={TEAL} />
            </View>
            <Text style={styles.weekStatValue}>42</Text>
            <Text style={styles.weekStatLabel}>عمليات الأسبوع</Text>
          </View>

          <View style={styles.weekStat}>
            <View style={styles.weekStatIcon}>
              <MaterialIcons name="savings" size={16} color={TEAL} />
            </View>
            <View style={styles.weekStatValueRow}>
              <Text style={styles.weekStatValue}>21.60</Text>
              <RiyalIcon size={14} color={BLACK} style={styles.weekStatRiyal} />
            </View>
            <Text style={styles.weekStatLabel}>فكّة الأسبوع</Text>
          </View>

          <View style={styles.weekStat}>
            <View style={styles.weekStatIcon}>
              <MaterialIcons name="trending-up" size={16} color={TEAL} />
            </View>
            <View style={styles.weekStatValueRow}>
              <Text style={styles.weekStatValue}>95</Text>
              <RiyalIcon size={14} color={BLACK} style={styles.weekStatRiyal} />
            </View>
            <Text style={styles.weekStatLabel}>المتوقع شهرياً</Text>
          </View>

          <View style={styles.weekStat}>
            <View style={styles.weekStatIcon}>
              <MaterialIcons name="flag" size={16} color={TEAL} />
            </View>
            <Text style={styles.weekStatValue}>37%</Text>
            <Text style={styles.weekStatLabel}>التقدم</Text>
          </View>
        </View>

        {/* Monthly goal progress */}
        <View style={styles.weekProgressRow}>
          <Text style={styles.weekProgressPct}>37%</Text>
          <Text style={styles.weekProgressLabel}>من هدف هذا الشهر</Text>
        </View>
        <View style={styles.weekProgressTrack}>
          <View style={styles.weekProgressFill} />
        </View>
      </View>


      {/* AI Prediction Card */}
      <View style={[styles.card]}>
        <View style={styles.cardHeader}>
          <RiyalIcon size={24} color="#01a736" />
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitleRight}>توقعات الفكّة الشهرية</Text>
          </View>
        </View>

        <Text style={styles.cardSubtitle}>
          بناءًا على معدل عمليات شرائك الحالية
        </Text>

        {/* AI Prediction Container */}
        <View style={styles.aiPredictionContainer}>
          {/* Predicted Fukka Amount */}
          <View style={styles.predictedBalanceContainer}>
            <View style={styles.predictedBalanceRow}>
              <Text style={styles.predictedAmount}>83.35</Text>
              <RiyalIcon size={24} color="#01a736" style={styles.riyalIcon} />
            </View>
          </View>
        </View>
      </View>

      {/* Recent Activity Card */}
      <View style={[styles.card, styles.lastCard]}>
        <View style={styles.cardHeader}>
          <MaterialIcons name="history" size={24} color="#6366f1" />
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitleRight}>النشاط الأخير</Text>
          </View>
        </View>
        {recentActivities.map((activity, index) => (
          <View key={index} style={styles.activityItem}>
            <View style={styles.activityIcon}>
              <MaterialIcons name="add" size={16} color="#01a736" />
            </View>
            <View style={styles.activityDetails}>
              <View style={styles.activityAmountContainer}>
                <Text style={styles.activityAmount}>
                  أُضيفت {activity.amount.toFixed(2)}
                </Text>
                <RiyalIcon
                  size={14}
                  color="#2e2f2e"
                  style={styles.smallRiyalIcon}
                />
              </View>
            </View>
            <Text style={styles.activityDate}>{activity.date}</Text>
          </View>
        ))}
      </View>


    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SOFT_BG,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  lastCard: {
    marginBottom: 120,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  cardTitleRight: {
    fontSize: 15,
    fontFamily: FONT_BOLD,
    color: BLACK,
    textAlign: "right",
    lineHeight: 30,
  },
  cardSubtitle: {
    fontSize: 14,
    fontFamily: FONT_REGULAR,
    color: "#6b7280",
    textAlign: "right",
    lineHeight: 20,
    marginBottom: 16,
    marginTop: 4,
  },
  balanceContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 32,
    fontFamily: FONT_EXTRA_BOLD,
    color: TEAL,
    textAlign: "center",
  },
  riyalIcon: {
    marginRight: 8,
  },
  // Service Buttons Styles
  serviceButtonsContainer: {
    flexDirection: "row",
    backgroundColor: "#f1f5f9",
    borderRadius: 12,
    padding: 4,
    marginTop: 8,
  },
  serviceButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    marginHorizontal: 2,
  },
  serviceButtonFirst: {
    marginLeft: 0,
  },
  serviceButtonLast: {
    marginRight: 0,
  },
  serviceButtonEnabled: {
    backgroundColor: "#ffffff",
    shadowColor: TEAL,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  serviceButtonDisabled: {
    backgroundColor: "transparent",
  },
  serviceButtonText: {
    fontSize: 13,
    fontFamily: FONT_BOLD,
    textAlign: "center",
    fontWeight: "normal",
  },
  serviceButtonTextEnabled: {
    color: TEAL,
    fontFamily: FONT_BOLD,
  },
  serviceButtonTextDisabled: {
    color: "#9ca3af",
    fontFamily: FONT_BOLD,
  },
  enabledIndicator: {
    position: "absolute",
    top: -2,
    right: -2,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 2,
  },
  aiPredictionContainer: {
    backgroundColor: "#f0fdf4",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#bbf7d0",
    alignItems: "center",
    justifyContent: "center",
  },
  predictedBalanceContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    alignSelf: "center",
  },
  predictedBalanceRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    alignSelf: "center",
  },
  predictedAmount: {
    fontSize: 32,
    fontFamily: FONT_EXTRA_BOLD,
    color: TEAL,
    textAlign: "center",
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 0,
    width: "100%",
    maxWidth: 400,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  modalCloseButton: {
    padding: 4,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: FONT_BOLD,
    color: BLACK,
    textAlign: "right",
    flex: 1,
    marginRight: 16,
    lineHeight: 40
  },
  modalContent: {
    paddingHorizontal: 20,
  },
  modalSection: {
    marginBottom: 24,
  },
  exampleContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#fef3c7",
    padding: 16,
    borderRadius: 12,
  },
  modalExample: {
    fontSize: 14,
    fontFamily: FONT_REGULAR,
    color: "#92400e",
    textAlign: "right",
    lineHeight: 20,
    flex: 1,
    marginRight: 8,
  },
  enabledBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0fdf4",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  enabledText: {
    fontSize: 16,
    fontFamily: FONT_MEDIUM,
    color: TEAL,
    marginRight: 8,
  },
  enableButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: TEAL,
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  enableButtonText: {
    fontSize: 16,
    fontFamily: FONT_BOLD,
    color: "#ffffff",
    marginLeft: 8,
  },
  // New Earnings Card Styles
  smallRiyalIcon: {
    marginRight: 4,
  },
  activityAmountContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginBottom: 2,
  },
  activityItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f0fdf4",
    alignItems: "center",
    justifyContent: "center",
  },
  activityDetails: {
    flex: 1,
    paddingHorizontal: 12,
  },
  activityAmount: {
    fontSize: 14,
    fontFamily: FONT_MEDIUM,
    color: BLACK,
    textAlign: "right",
  },
  activityDate: {
    fontSize: 12,
    fontFamily: FONT_REGULAR,
    color: "#9ca3af",
  },

  // ── Weekly Summary ("ملخص الأسبوع") ──
  weekGrid: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 8,
    marginBottom: 16,
  },
  weekStat: {
    width: "47.5%",
    backgroundColor: SOFT_BG,
    borderRadius: 12,
    padding: 12,
    alignItems: "flex-end",
  },
  weekStatIcon: {
    width: 28,
    height: 28,
    borderRadius: 9,
    backgroundColor: "#f0fdf4",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  weekStatValueRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
  },
  weekStatRiyal: {
    marginRight: 4,
  },
  weekStatValue: {
    fontSize: 20,
    fontFamily: FONT_BOLD,
    color: BLACK,
    textAlign: "right",
  },
  weekStatLabel: {
    fontSize: 11,
    fontFamily: FONT_REGULAR,
    color: MUTED,
    textAlign: "right",
    marginTop: 2,
  },
  weekProgressRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },
  weekProgressPct: {
    fontSize: 14,
    fontFamily: FONT_BOLD,
    color: TEAL,
  },
  weekProgressLabel: {
    fontSize: 12,
    fontFamily: FONT_REGULAR,
    color: MUTED,
  },
  weekProgressTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "#e5e7eb",
    overflow: "hidden",
    flexDirection: "row-reverse",
  },
  weekProgressFill: {
    width: "37%",
    height: "100%",
    borderRadius: 4,
    backgroundColor: TEAL,
  },

  // ── Smart Weekly Step ("خطوة الأسبوع الذكية") ──
  aiStepCard: {
    borderWidth: 1,
    borderColor: "#bbf7d0",
    backgroundColor: "#fbfefc",
  },
  aiStepHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  aiStepSection: {
    fontSize: 15,
    fontFamily: FONT_BOLD,
    color: BLACK,
    textAlign: "right",
    lineHeight: 30,
  },
  aiBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#f0fdf4",
    borderWidth: 1,
    borderColor: "#bbf7d0",
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  aiBadgeText: {
    fontSize: 10,
    fontFamily: FONT_MEDIUM,
    color: TEAL,
  },
  aiStepTitle: {
    flex: 1,
    fontSize: 16,
    fontFamily: FONT_BOLD,
    color: BLACK,
    textAlign: "right",
  },
  aiStepMessage: {
    fontSize: 13,
    fontFamily: FONT_REGULAR,
    color: MUTED,
    textAlign: "right",
    lineHeight: 21,
    marginBottom: 12,
  },
  aiImpactRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#f0fdf4",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 7,
    alignSelf: "flex-end",
    marginBottom: 14,
  },
  aiImpactText: {
    fontSize: 12,
    fontFamily: FONT_MEDIUM,
    color: TEAL,
  },
  aiActions: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 10,
  },
  aiPrimaryBtn: {
    flex: 1,
    flexDirection: "row-reverse",
    gap: 6,
    backgroundColor: TEAL,
    borderRadius: 12,
    paddingVertical: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  aiPrimaryBtnText: {
    fontSize: 14,
    fontFamily: FONT_BOLD,
    color: "#ffffff",
  },
  aiLaterBtn: {
    paddingVertical: 11,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  aiLaterBtnText: {
    fontSize: 13,
    fontFamily: FONT_MEDIUM,
    color: MUTED,
  },

  // ── Smart step carousel additions ──
  aiHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  stepCounter: {
    backgroundColor: SOFT_BG,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  stepCounterText: {
    fontSize: 10,
    fontFamily: FONT_MEDIUM,
    color: MUTED,
  },
  aiStepRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  aiStepIconChip: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: "#f0fdf4",
    alignItems: "center",
    justifyContent: "center",
  },
  aiPrimaryBtnApplied: {
    backgroundColor: "#15803d",
  },
  successBanner: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#f0fdf4",
    borderWidth: 1,
    borderColor: "#bbf7d0",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  successBannerText: {
    flex: 1,
    fontSize: 13,
    fontFamily: FONT_MEDIUM,
    color: TEAL,
    textAlign: "right",
  },
  endStateWrap: {
    alignItems: "center",
    gap: 10,
    paddingVertical: 14,
  },
  endStateText: {
    fontSize: 13,
    fontFamily: FONT_REGULAR,
    color: MUTED,
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 8,
  },
  compactCard: {
    padding: 14,
  },
  compactRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 10,
  },
  compactTexts: {
    flex: 1,
    alignItems: "flex-end",
  },
  compactTitle: {
    fontSize: 14,
    fontFamily: FONT_BOLD,
    color: BLACK,
    textAlign: "right",
  },
  compactSubtitle: {
    fontSize: 11,
    fontFamily: FONT_REGULAR,
    color: MUTED,
    textAlign: "right",
    marginTop: 1,
  },
  compactDetailsBtn: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 2,
    backgroundColor: "#f0fdf4",
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  compactDetailsText: {
    fontSize: 12,
    fontFamily: FONT_MEDIUM,
    color: TEAL,
  },
});
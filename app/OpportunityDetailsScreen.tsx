import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
    Animated,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Circle } from "react-native-svg";

import { useColors } from "@/hooks/useColors";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

interface AIRecommendation {
    id: string;
    title: string;
    type: "توصية ادخارية" | "خطة تدوير" | "تحدي ذكي" | "ثقافة مالية";
    description: string;
    aiExplanation: string;
    expectedImpact: number;
    currentSaving: number;
    projectedSaving: number;
    suitabilityScore: number;
    riskLevel: "منخفض" | "متوسط" | "مرتفع";
    actionSteps: string[];
    cardStats?: { label: string; value: string }[];
    dataSignals: {
        posTransactions: number;
        weeklySpending: number;
        topCategory: string;
        collectedHalalas: number;
        monthlyExpectedSaving: number;
    };
    categoryBreakdown?: { label: string; value: number }[];
}

const DEFAULT_CATEGORIES = [
    { label: "المطاعم والمقاهي", value: 28 },
    { label: "السوبرماركت", value: 22 },
    { label: "الاشتراكات", value: 17 },
    { label: "النقل", value: 12 },
    { label: "أخرى", value: 21 },
];

const typeGradients: Record<string, [string, string]> = {
    "توصية ادخارية": ["#01a736", "#017a28"],
    "خطة تدوير": ["#3b82f6", "#1e40af"],
    "ثقافة مالية": ["#C9991A", "#9A7514"],
    "تحدي ذكي": ["#7E22CE", "#581C87"],
};

const typeColors: Record<string, { bg: string; text: string }> = {
    "توصية ادخارية": { bg: "#DCFCE7", text: "#15803D" },
    "خطة تدوير": { bg: "#DBEAFE", text: "#1D4ED8" },
    "ثقافة مالية": { bg: "#FEF3C7", text: "#B45309" },
    "تحدي ذكي": { bg: "#F3E8FF", text: "#7E22CE" },
};

const suitabilityLabel = (score: number) => {
    if (score >= 90) return "مناسبة جداً";
    if (score >= 70) return "مناسبة";
    return "مناسبة نسبياً";
};

const riskColor = (level: string) => {
    if (level === "منخفض") return "#15803D";
    if (level === "متوسط") return "#B45309";
    return "#DC2626";
};

const QUESTION_CHIPS = [
    "ليش هذه التوصية؟",
    "كم أوفر؟",
    "عدّل الخطة",
    "اعطني تحدي أسهل",
];

const TEAL = "#01a736";
const BLACK = "#2e2f2e";
const GOLD = "#60a5fa";

/* Almarai font stack — loaded in app/_layout.tsx via expo-font */
const FONT_REGULAR = "Handicrafts-Regular";
const FONT_MEDIUM = "Handicrafts-SemiBold";
const FONT_BOLD = "Handicrafts-Bold";

/* ------------------------------------------------------------------ */
/* Shared visual primitives                                            */
/* ------------------------------------------------------------------ */

function FadeInView({
    delay = 0,
    children,
    style,
}: {
    delay?: number;
    children: React.ReactNode;
    style?: any;
}) {
    const anim = React.useRef(new Animated.Value(0)).current;
    React.useEffect(() => {
        Animated.timing(anim, {
            toValue: 1,
            duration: 420,
            delay,
            useNativeDriver: true,
        }).start();
    }, [anim, delay]);
    return (
        <Animated.View
            style={[
                style,
                {
                    opacity: anim,
                    transform: [
                        {
                            translateY: anim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [14, 0],
                            }),
                        },
                    ],
                },
            ]}
        >
            {children}
        </Animated.View>
    );
}

function PressableScale({
    onPress,
    style,
    children,
    accessibilityLabel,
    disabled,
}: {
    onPress?: () => void;
    style?: any;
    children: React.ReactNode;
    accessibilityLabel?: string;
    disabled?: boolean;
}) {
    const scale = React.useRef(new Animated.Value(1)).current;
    return (
        <Pressable
            onPress={onPress}
            onPressIn={() =>
                Animated.spring(scale, {
                    toValue: 0.97,
                    useNativeDriver: true,
                    speed: 50,
                    bounciness: 4,
                }).start()
            }
            onPressOut={() =>
                Animated.spring(scale, {
                    toValue: 1,
                    useNativeDriver: true,
                    speed: 40,
                    bounciness: 6,
                }).start()
            }
            disabled={disabled}
            accessibilityRole="button"
            accessibilityLabel={accessibilityLabel}
        >
            <Animated.View style={[style, { transform: [{ scale }] }]}>
                {children}
            </Animated.View>
        </Pressable>
    );
}

/** SVG circular progress ring with centered content. */
function ProgressRing({
    size = 84,
    stroke = 8,
    pct,
    color,
    trackColor,
    children,
}: {
    size?: number;
    stroke?: number;
    pct: number;
    color: string;
    trackColor: string;
    children?: React.ReactNode;
}) {
    const r = (size - stroke) / 2;
    const c = 2 * Math.PI * r;
    const clamped = Math.min(Math.max(pct, 0), 100);
    return (
        <View
            style={{
                width: size,
                height: size,
                alignItems: "center",
                justifyContent: "center",
            }}
            accessibilityRole="progressbar"
            accessibilityValue={{ min: 0, max: 100, now: Math.round(clamped) }}
        >
            <Svg
                width={size}
                height={size}
                style={{ transform: [{ rotate: "-90deg" }], position: "absolute" }}
            >
                <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={r}
                    stroke={trackColor}
                    strokeWidth={stroke}
                    fill="none"
                />
                <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={r}
                    stroke={color}
                    strokeWidth={stroke}
                    fill="none"
                    strokeDasharray={`${c}`}
                    strokeDashoffset={c * (1 - clamped / 100)}
                    strokeLinecap="round"
                />
            </Svg>
            <View style={{ alignItems: "center" }}>{children}</View>
        </View>
    );
}

/* ------------------------------------------------------------------ */
/* Screen                                                              */
/* ------------------------------------------------------------------ */

export default function RecommendationDetailsScreen() {
    const colors = useColors();
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const params = useLocalSearchParams();

    const topPad = Platform.OS === "web" ? 25 : insets.top;
    const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

    // Parse safely; navigate back as an effect, never during render
    const rec = React.useMemo<AIRecommendation | null>(() => {
        try {
            return JSON.parse(params.recommendationData as string);
        } catch {
            return null;
        }
    }, [params.recommendationData]);

    React.useEffect(() => {
        if (!rec) router.back();
    }, [rec, router]);

    const [applied, setApplied] = React.useState(false);

    if (!rec) return null;

    const gradientColors = typeGradients[rec.type] ?? [BLACK, "#1e40af"];
    const tc = typeColors[rec.type] ?? { bg: "#F0F0F0", text: "#333" };
    const hasImpact = rec.expectedImpact > 0;
    const categories = rec.categoryBreakdown ?? DEFAULT_CATEGORIES;
    const maxBar = Math.max(rec.currentSaving, rec.projectedSaving, 1);

    return (
        <View style={[styles.root, { backgroundColor: colors.background }]}>
            {/* ── Hero ─────────────────────────────────────────────── */}
            <LinearGradient
                colors={gradientColors as any}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.hero, { paddingTop: topPad }]}
            >

                <View style={styles.navBar}>
                    <TouchableOpacity
                        style={styles.backBtn}
                        onPress={() => router.back()}
                        activeOpacity={0.7}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        accessibilityRole="button"
                        accessibilityLabel="رجوع"
                    >
                        <MaterialIcons name="arrow-forward" size={22} color="#FFFFFF" />
                    </TouchableOpacity>
                    <Text style={styles.navTitle}>تفاصيل التوصية</Text>
                    <View style={{ width: 40 }} />
                </View>

                <FadeInView delay={0} style={styles.heroContent}>
                    <View style={styles.heroChips}>
                        <View style={[styles.heroBadge, { backgroundColor: tc.bg }]}>
                            <Text style={[styles.heroBadgeText, { color: tc.text }]}>
                                {rec.type}
                            </Text>
                        </View>
                        <View style={styles.riskChip}>
                            <MaterialIcons
                                name="shield"
                                size={12}
                                color="rgba(255,255,255,0.9)"
                            />
                            <Text style={styles.riskChipText}>مخاطر {rec.riskLevel}ة</Text>
                        </View>
                    </View>

                    <Text style={styles.heroTitle}>{rec.title}</Text>

                    <View style={styles.heroBottom}>
                        <View style={styles.heroImpact}>
                            {hasImpact ? (
                                <>
                                    <View style={styles.heroImpactRow}>
                                        <Text style={styles.heroImpactValue}>
                                            +{rec.expectedImpact}
                                        </Text>
                                        <Text style={styles.heroImpactUnit}>ر.س</Text>
                                    </View>
                                    <Text style={styles.heroImpactLabel}>شهرياً</Text>
                                </>
                            ) : (
                                <>
                                    <Text style={styles.heroImpactValueSm}>مراجعة ذكية</Text>
                                    <Text style={styles.heroImpactLabel}>بدون التزام مالي</Text>
                                </>
                            )}
                        </View>
                        <ProgressRing
                            size={88}
                            stroke={8}
                            pct={rec.suitabilityScore}
                            color="#FFFFFF"
                            trackColor="rgba(255,255,255,0.2)"
                        >
                            <Text style={styles.heroRingPct}>{rec.suitabilityScore}%</Text>
                            <Text style={styles.heroRingLabel}>
                                {suitabilityLabel(rec.suitabilityScore)}
                            </Text>
                        </ProgressRing>
                    </View>
                </FadeInView>
            </LinearGradient>

            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {/* ── Before / after comparison ───────────────────────── */}
                {hasImpact && (
                    <FadeInView delay={60}>
                        <SectionCard colors={colors} icon="compare-arrows" title="الأثر المتوقع">
                            <View style={styles.compareChart}>
                                <CompareBar
                                    label="الادخار الحالي"
                                    value={rec.currentSaving}
                                    max={maxBar}
                                    color={colors.border}
                                    textColor={colors.mutedForeground}
                                    valueColor={colors.text}
                                />
                                <CompareBar
                                    label="بعد التطبيق"
                                    value={rec.projectedSaving}
                                    max={maxBar}
                                    color={colors.primary}
                                    textColor={colors.mutedForeground}
                                    valueColor={colors.primary}
                                />
                                <View style={styles.compareDiff}>
                                    <MaterialIcons name="trending-up" size={14} color="#15803D" />
                                    <Text style={styles.compareDiffText}>
                                        +{rec.expectedImpact} ر.س
                                    </Text>
                                </View>
                            </View>
                        </SectionCard>
                    </FadeInView>
                )}

                {/* ── Data signals as metric widgets ──────────────────── */}
                <FadeInView delay={120}>
                    <SectionCard colors={colors} icon="analytics" title="بيانات المساعد">
                        <View style={styles.metricGrid}>
                            <MetricWidget
                                icon="receipt-long"
                                value={`${rec.dataSignals.posTransactions}`}
                                label="عملية نقاط بيع"
                                colors={colors}
                            />
                            <MetricWidget
                                icon="payments"
                                value={rec.dataSignals.weeklySpending.toLocaleString("ar")}
                                label="ر.س إنفاق أسبوعي"
                                colors={colors}
                            />
                            <MetricWidget
                                icon="savings"
                                value={`${rec.dataSignals.collectedHalalas}`}
                                label="ر.س هللات مجمّعة"
                                colors={colors}
                            />
                            <MetricWidget
                                icon="trending-up"
                                value={`${rec.dataSignals.monthlyExpectedSaving}`}
                                label="ر.س متوقعة شهرياً"
                                colors={colors}
                            />
                        </View>
                    </SectionCard>
                </FadeInView>

                {/* ── Category spending chart ─────────────────────────── */}
                <FadeInView delay={180}>
                    <SectionCard colors={colors} icon="pie-chart" title="توزيع الإنفاق">
                        {categories.map((c) => {
                            const isTop = c.label === rec.dataSignals.topCategory;
                            return (
                                <View key={c.label} style={styles.catRow}>
                                    <Text
                                        style={[
                                            styles.catLabel,
                                            {
                                                color: isTop ? colors.primary : colors.mutedForeground,
                                                fontWeight: isTop ? ("700" as const) : ("400" as const),
                                            },
                                        ]}
                                        numberOfLines={1}
                                    >
                                        {c.label}
                                    </Text>
                                    <View
                                        style={[styles.catTrack, { backgroundColor: colors.border }]}
                                    >
                                        <View
                                            style={[
                                                styles.catFill,
                                                {
                                                    width: `${(c.value / 30) * 100}%` as any,
                                                    backgroundColor: isTop ? colors.primary : "#cbd5e1",
                                                },
                                            ]}
                                        />
                                    </View>
                                    <Text style={[styles.catPct, { color: colors.text }]}>
                                        {c.value}%
                                    </Text>
                                </View>
                            );
                        })}
                    </SectionCard>
                </FadeInView>

                {/* ── Action plan timeline ────────────────────────────── */}
                <FadeInView delay={240}>
                    <SectionCard colors={colors} icon="checklist" title="خطة التنفيذ">
                        <View>
                            {rec.actionSteps.map((step, idx) => {
                                const isLast = idx === rec.actionSteps.length - 1;
                                return (
                                    <View key={idx} style={styles.stepItem}>
                                        <View style={styles.stepCol}>
                                            <View
                                                style={[
                                                    styles.stepBullet,
                                                    { backgroundColor: colors.primary },
                                                ]}
                                            >
                                                <Text style={styles.stepNumber}>{idx + 1}</Text>
                                            </View>
                                            {!isLast && (
                                                <View
                                                    style={[
                                                        styles.stepConnector,
                                                        { backgroundColor: colors.border },
                                                    ]}
                                                />
                                            )}
                                        </View>
                                        <Text
                                            style={[
                                                styles.stepText,
                                                { color: colors.text },
                                                !isLast && styles.stepTextSpacing,
                                            ]}
                                        >
                                            {step}
                                        </Text>
                                    </View>
                                );
                            })}
                        </View>
                    </SectionCard>
                </FadeInView>

                {/* ── Assistant chat bubble + question chips ──────────── */}
                <FadeInView delay={300}>
                    <View style={styles.copilotCard}>
                        <View style={styles.copilotHeader}>
                            <View style={styles.copilotAvatar}>
                                <MaterialIcons name="auto-awesome" size={16} color={GOLD} />
                            </View>
                            <Text style={styles.copilotTitle}>المساعد المالي</Text>
                        </View>
                        <View style={styles.copilotBubble}>
                            <Text style={styles.copilotText}>{rec.aiExplanation}</Text>
                        </View>
                        <View style={styles.chipsWrap}>
                            {QUESTION_CHIPS.map((q) => (
                                <Pressable
                                    key={q}
                                    style={styles.questionChip}
                                    accessibilityRole="button"
                                    accessibilityLabel={q}
                                >
                                    <Text style={styles.questionChipText}>{q}</Text>
                                </Pressable>
                            ))}
                        </View>
                    </View>
                </FadeInView>

                {/* spacer so content clears the sticky bar */}
                <View style={{ height: 12 }} />
            </ScrollView>

            {/* ── Sticky bottom action bar ──────────────────────────── */}
            <View
                style={[
                    styles.bottomBar,
                    {
                        backgroundColor: colors.card,
                        borderTopColor: colors.border,
                        paddingBottom: bottomPad + 10,
                    },
                ]}
            >
                <PressableScale
                    style={[styles.secondaryBtn, { borderColor: colors.border }]}
                    accessibilityLabel="اسأل المساعد المالي"
                >
                    <MaterialIcons name="chat" size={18} color={colors.primary} />
                </PressableScale>
                <PressableScale
                    style={[
                        styles.primaryBtn,
                        { backgroundColor: applied ? "#15803D" : colors.primary },
                    ]}
                    onPress={() => setApplied(true)}
                    disabled={applied}
                    accessibilityLabel={applied ? "تم تطبيق التوصية" : "تطبيق التوصية"}
                >
                    <MaterialIcons
                        name={applied ? "task-alt" : "check-circle"}
                        size={18}
                        color="#FFF"
                    />
                    <Text style={styles.primaryBtnText}>
                        {applied ? "تم التطبيق" : "تطبيق التوصية"}
                    </Text>
                </PressableScale>
            </View>
        </View>
    );
}

/* ------------------------------------------------------------------ */
/* Sub-components                                                      */
/* ------------------------------------------------------------------ */

function SectionCard({
    children,
    colors,
    icon,
    title,
}: {
    children: React.ReactNode;
    colors: any;
    icon: any;
    title: string;
}) {
    return (
        <View
            style={[
                styles.sectionCard,
                { backgroundColor: colors.card, borderColor: colors.border },
            ]}
        >
            <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                    {title}
                </Text>
                <View
                    style={[
                        styles.sectionIcon,
                        { backgroundColor: colors.primary + "15" },
                    ]}
                >
                    <MaterialIcons name={icon} size={16} color={colors.primary} />
                </View>
            </View>
            {children}
        </View>
    );
}

function CompareBar({
    label,
    value,
    max,
    color,
    textColor,
    valueColor,
}: {
    label: string;
    value: number;
    max: number;
    color: string;
    textColor: string;
    valueColor: string;
}) {
    const pct = Math.max((value / max) * 100, 4);
    return (
        <View style={styles.compareRow}>
            <Text style={[styles.compareLabel, { color: textColor }]}>{label}</Text>
            <View style={styles.compareTrackWrap}>
                <View
                    style={[
                        styles.compareBarFill,
                        { width: `${pct}%` as any, backgroundColor: color },
                    ]}
                />
            </View>
            <Text style={[styles.compareValue, { color: valueColor }]}>
                {value > 0 ? `${value} ر.س` : "—"}
            </Text>
        </View>
    );
}

function MetricWidget({
    icon,
    value,
    label,
    colors,
}: {
    icon: any;
    value: string;
    label: string;
    colors: any;
}) {
    return (
        <View
            style={[styles.metricWidget, { backgroundColor: colors.background }]}
            accessibilityRole="summary"
            accessibilityLabel={`${value} ${label}`}
        >
            <MaterialIcons name={icon} size={16} color={colors.primary} />
            <Text style={[styles.metricValue, { color: colors.text }]}>{value}</Text>
            <Text
                style={[styles.metricLabel, { color: colors.mutedForeground }]}
                numberOfLines={1}
            >
                {label}
            </Text>
        </View>
    );
}

/* ------------------------------------------------------------------ */
/* Styles                                                              */
/* ------------------------------------------------------------------ */

const styles = StyleSheet.create({
    root: { flex: 1 },

    /* Hero */
    hero: {
        paddingBottom: 24,
        overflow: "hidden",
    },
    heroCircle: {
        position: "absolute",
        top: -70,
        left: -60,
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: "rgba(255,255,255,0.07)",
    },
    navBar: {
        flexDirection: "row-reverse",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 4,
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "rgba(255,255,255,0.2)",
        alignItems: "center",
        justifyContent: "center",
    },
    navTitle: {
        fontFamily: FONT_BOLD,
        flex: 1,
        fontSize: 16,
        fontWeight: "700" as const,
        color: "#FFFFFF",
        textAlign: "center",
    },
    heroContent: {
        paddingHorizontal: 20,
        paddingTop: 12,
    },
    heroChips: {
        flexDirection: "row-reverse",
        alignItems: "center",
        gap: 8,
        marginBottom: 10,
    },
    heroBadge: {
        borderRadius: 20,
        paddingHorizontal: 11,
        paddingVertical: 4,
    },
    heroBadgeText: { fontSize: 11, fontWeight: "600" as const, fontFamily: FONT_MEDIUM },
    riskChip: {
        flexDirection: "row-reverse",
        alignItems: "center",
        gap: 4,
        backgroundColor: "rgba(255,255,255,0.15)",
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    riskChipText: {
        fontFamily: FONT_MEDIUM,
        fontSize: 11,
        color: "rgba(255,255,255,0.9)",
        fontWeight: "600" as const,
    },
    heroTitle: {
        fontFamily: FONT_BOLD,
        fontSize: 22,
        fontWeight: "700" as const,
        color: "#FFFFFF",
        textAlign: "right",
        writingDirection: "rtl",
        marginBottom: 16,
    },
    heroBottom: {
        flexDirection: "row-reverse",
        alignItems: "center",
        justifyContent: "space-between",
    },
    heroImpact: { alignItems: "flex-end" },
    heroImpactRow: {
        flexDirection: "row-reverse",
        alignItems: "flex-end",
        gap: 5,
    },
    heroImpactValue: {
        fontFamily: FONT_BOLD,
        fontSize: 42,
        fontWeight: "800" as const,
        color: "#FFFFFF",
        lineHeight: 48,
    },
    heroImpactValueSm: {
        fontFamily: FONT_BOLD,
        fontSize: 22,
        fontWeight: "800" as const,
        color: "#FFFFFF",
    },
    heroImpactUnit: {
        fontFamily: FONT_REGULAR,
        fontSize: 15,
        color: "rgba(255,255,255,0.75)",
        marginBottom: 7,
    },
    heroImpactLabel: {
        fontFamily: FONT_REGULAR,
        fontSize: 13,
        color: "rgba(255,255,255,0.75)",
        marginTop: 2,
    },
    heroRingPct: {
        fontFamily: FONT_BOLD,
        fontSize: 17,
        fontWeight: "800" as const,
        color: "#FFFFFF",
    },
    heroRingLabel: {
        fontFamily: FONT_REGULAR,
        fontSize: 9,
        color: "rgba(255,255,255,0.8)",
    },

    scroll: { flex: 1 },
    content: { padding: 16 },

    /* Section cards */
    sectionCard: {
        borderRadius: 18,
        padding: 16,
        marginBottom: 12,
        borderWidth: StyleSheet.hairlineWidth,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 1,
    },
    sectionHeader: {
        flexDirection: "row-reverse",
        alignItems: "center",
        gap: 8,
        marginBottom: 14,
    },
    sectionIcon: {
        width: 28,
        height: 28,
        borderRadius: 9,
        alignItems: "center",
        justifyContent: "center",
    },
    sectionTitle: {
        fontFamily: FONT_BOLD,
        flex: 1,
        fontSize: 15,
        fontWeight: "700" as const,
        textAlign: "right",
        writingDirection: "rtl",
    },

    /* Before/after comparison */
    compareChart: { gap: 12 },
    compareRow: {
        flexDirection: "row-reverse",
        alignItems: "center",
        gap: 10,
    },
    compareLabel: { width: 88, fontSize: 12, textAlign: "right", fontFamily: FONT_REGULAR },
    compareTrackWrap: {
        flex: 1,
        height: 22,
        borderRadius: 8,
        overflow: "hidden",
        flexDirection: "row-reverse",
    },
    compareBarFill: {
        height: "100%",
        borderRadius: 8,
    },
    compareValue: {
        fontFamily: FONT_BOLD,
        width: 58,
        fontSize: 13,
        fontWeight: "800" as const,
        textAlign: "left",
    },
    compareDiff: {
        flexDirection: "row-reverse",
        alignItems: "center",
        justifyContent: "center",
        gap: 5,
        backgroundColor: "#DCFCE7",
        borderRadius: 12,
        paddingVertical: 7,
        marginTop: 2,
    },
    compareDiffText: {
        fontFamily: FONT_BOLD,
        fontSize: 13,
        fontWeight: "800" as const,
        color: "#15803D",
    },

    /* Metric widgets */
    metricGrid: {
        flexDirection: "row-reverse",
        flexWrap: "wrap",
        gap: 10,
    },
    metricWidget: {
        width: "47.5%",
        borderRadius: 14,
        padding: 12,
        alignItems: "flex-end",
        gap: 4,
    },
    metricValue: {
        fontFamily: FONT_BOLD,
        fontSize: 20,
        fontWeight: "800" as const,
    },
    metricLabel: { fontSize: 10, fontFamily: FONT_REGULAR },

    /* Category chart */
    catRow: {
        flexDirection: "row-reverse",
        alignItems: "center",
        gap: 10,
        marginBottom: 9,
    },
    catLabel: { width: 104, fontSize: 12, textAlign: "right", fontFamily: FONT_REGULAR },
    catTrack: {
        flex: 1,
        height: 7,
        borderRadius: 4,
        overflow: "hidden",
        flexDirection: "row-reverse",
    },
    catFill: { height: "100%", borderRadius: 4 },
    catPct: {
        fontFamily: FONT_BOLD,
        width: 34,
        fontSize: 12,
        fontWeight: "700" as const,
        textAlign: "left",
    },

    /* Timeline */
    stepItem: {
        flexDirection: "row-reverse",
        alignItems: "stretch",
        gap: 12,
    },
    stepCol: { alignItems: "center", width: 26 },
    stepBullet: {
        width: 26,
        height: 26,
        borderRadius: 13,
        alignItems: "center",
        justifyContent: "center",
    },
    stepConnector: {
        width: 2,
        flex: 1,
        marginVertical: 3,
        borderRadius: 1,
    },
    stepNumber: {
        fontFamily: FONT_BOLD,
        fontSize: 12,
        fontWeight: "700" as const,
        color: "#FFFFFF",
    },
    stepText: {
        fontFamily: FONT_REGULAR,
        flex: 1,
        fontSize: 13,
        lineHeight: 21,
        textAlign: "right",
        writingDirection: "rtl",
        paddingTop: 3,
    },
    stepTextSpacing: { paddingBottom: 16 },

    /* Copilot */
    copilotCard: {
        backgroundColor: BLACK,
        borderRadius: 18,
        padding: 16,
        marginBottom: 12,
        overflow: "hidden",
    },
    copilotGlow: {
        position: "absolute",
        top: -60,
        right: -50,
        width: 170,
        height: 170,
        borderRadius: 85,
        backgroundColor: "rgba(1,167,54,0.16)",
    },
    copilotHeader: {
        flexDirection: "row-reverse",
        alignItems: "center",
        gap: 8,
        marginBottom: 10,
    },
    copilotAvatar: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: "rgba(59,130,246,0.22)",
        alignItems: "center",
        justifyContent: "center",
    },
    copilotTitle: {
        fontFamily: FONT_BOLD,
        fontSize: 14,
        fontWeight: "700" as const,
        color: "#FFFFFF",
    },
    copilotBubble: {
        backgroundColor: "rgba(255,255,255,0.1)",
        borderRadius: 14,
        borderTopRightRadius: 4,
        padding: 13,
        marginBottom: 12,
    },
    copilotText: {
        fontFamily: FONT_REGULAR,
        fontSize: 13,
        lineHeight: 22,
        color: "rgba(255,255,255,0.9)",
        textAlign: "right",
        writingDirection: "rtl",
    },
    chipsWrap: {
        flexDirection: "row-reverse",
        flexWrap: "wrap",
        gap: 8,
    },
    questionChip: {
        backgroundColor: "rgba(255,255,255,0.12)",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.18)",
        borderRadius: 18,
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    questionChipText: {
        fontFamily: FONT_MEDIUM,
        fontSize: 11,
        color: "rgba(255,255,255,0.9)",
        fontWeight: "600" as const,
    },

    /* Bottom bar */
    bottomBar: {
        flexDirection: "row-reverse",
        alignItems: "center",
        gap: 8,
        paddingHorizontal: 12,
        paddingTop: 12,
        borderTopWidth: StyleSheet.hairlineWidth,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 8,
    },

    primaryBtn: {
        flex: 1,
        minHeight: 52,
        borderRadius: 16,
        paddingVertical: 15,
        paddingHorizontal: 20,
        flexDirection: "row-reverse",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
    },
    primaryBtnText: { fontFamily: FONT_BOLD, fontSize: 15, fontWeight: "700" as const, color: "#FFFFFF", },
    secondaryBtn: {
        width: 46,
        height: 52,
        borderRadius: 16,
        borderWidth: 1.5,
        alignItems: "center",
        justifyContent: "center",
    },
});
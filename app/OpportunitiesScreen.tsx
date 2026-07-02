import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
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
/* Types & data                                                        */
/* ------------------------------------------------------------------ */

export interface AIRecommendation {
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
    /** Two tiny stats rendered on the dashboard card (before/after, counts…) */
    cardStats: { label: string; value: string }[];
    dataSignals: {
        posTransactions: number;
        weeklySpending: number;
        topCategory: string;
        collectedHalalas: number;
        monthlyExpectedSaving: number;
    };
    categoryBreakdown: { label: string; value: number }[];
}

const CATEGORY_BREAKDOWN = [
    { label: "المطاعم والمقاهي", value: 28 },
    { label: "السوبرماركت", value: 22 },
    { label: "الاشتراكات", value: 17 },
    { label: "النقل", value: 12 },
    { label: "أخرى", value: 21 },
];

/** Halalas collected per day this week (Sun → Sat) */
const WEEKLY_TREND = [2.4, 3.1, 2.2, 4.0, 3.4, 4.6, 1.9];
const WEEK_DAYS = ["ح", "ن", "ث", "ر", "خ", "ج", "س"];

const CURRENT_PROGRESS = 37; // % of monthly goal reached

const DATA_SIGNALS = {
    posTransactions: 42,
    weeklySpending: 1240,
    topCategory: "المطاعم والمقاهي",
    collectedHalalas: 21.6,
    monthlyExpectedSaving: 95,
};

const recommendations: AIRecommendation[] = [
    {
        id: "1",
        title: "خفّض طلبين من المطاعم",
        type: "توصية ادخارية",
        description: "خطوة صغيرة ترفع ادخارك الشهري بشكل ملموس.",
        aiExplanation:
            "لاحظت فكّتك أن إنفاقك على المطاعم والمقاهي يمثل 28% من مصروفاتك الأسبوعية، وهو أعلى من متوسط إنفاقك السابق بنسبة 18%. لذلك نقترح تقليل عمليتين فقط أسبوعياً كخطوة بسيطة.",
        expectedImpact: 54,
        currentSaving: 86,
        projectedSaving: 140,
        suitabilityScore: 92,
        riskLevel: "منخفض",
        actionSteps: [
            "تقليل عمليتين من المطاعم أسبوعياً",
            "تحويل الفرق إلى هدف صندوق الطوارئ",
            "متابعة التقدم من خلال تقرير فكّتك الأسبوعي",
        ],
        cardStats: [
            { label: "قبل", value: "86 ر.س" },
            { label: "بعد", value: "140 ر.س" },
        ],
        dataSignals: DATA_SIGNALS,
        categoryBreakdown: CATEGORY_BREAKDOWN,
    },
    {
        id: "2",
        title: "فعّل التدوير لأقرب ريال",
        type: "خطة تدوير",
        description: "ادخار تلقائي من عملياتك اليومية دون أي جهد.",
        aiExplanation:
            "بناءً على تحليل 42 عملية نقاط بيع، وجدت فكّتك أن التدوير لأقرب ريال سيُضيف تلقائياً ما متوسطه 21.60 ريال أسبوعياً إلى خطة ادخارك دون أي جهد.",
        expectedImpact: 95,
        currentSaving: 0,
        projectedSaving: 95,
        suitabilityScore: 98,
        riskLevel: "منخفض",
        actionSteps: [
            "تفعيل خاصية التدوير التلقائي",
            "ربط الحساب البنكي بخطة التدوير",
            "تحديد الهدف المالي لصندوق التدوير",
        ],
        cardStats: [
            { label: "متوقع شهرياً", value: "95 ر.س" },
            { label: "الملاءمة", value: "98%" },
        ],
        dataSignals: DATA_SIGNALS,
        categoryBreakdown: CATEGORY_BREAKDOWN,
    },
    {
        id: "3",
        title: "راجع الاشتراكات الشهرية",
        type: "ثقافة مالية",
        description: "اشتراكات متكررة قد لا تستخدمها بالكامل.",
        aiExplanation:
            "رصدت فكّتك 5 اشتراكات متكررة شهرية. مراجعة بسيطة قد تساعدك على إلغاء ما لا تستخدمه وتوفير جزء من هذا المبلغ.",
        expectedImpact: 0,
        currentSaving: 86,
        projectedSaving: 86,
        suitabilityScore: 78,
        riskLevel: "منخفض",
        actionSteps: [
            "استعراض قائمة الاشتراكات الشهرية",
            "تحديد الاشتراكات غير المستخدمة",
            "إلغاء أو تعليق الاشتراكات الزائدة",
        ],
        cardStats: [
            { label: "اشتراكات", value: "5" },
            { label: "الإجمالي", value: "214 ر.س" },
        ],
        dataSignals: { ...DATA_SIGNALS, topCategory: "الاشتراكات" },
        categoryBreakdown: CATEGORY_BREAKDOWN,
    },
    {
        id: "4",
        title: "تحدي أسبوع بلا قهوة خارجية",
        type: "تحدي ذكي",
        description: "تحدي بسيط بنتيجة سريعة خلال 7 أيام.",
        aiExplanation:
            "بناءً على متوسط إنفاقك على المقاهي، يمكنك توفير ما يصل إلى 84 ريال في أسبوع واحد فقط من خلال تحدي بسيط.",
        expectedImpact: 84,
        currentSaving: 86,
        projectedSaving: 170,
        suitabilityScore: 85,
        riskLevel: "منخفض",
        actionSteps: [
            "الالتزام بعدم الذهاب للمقاهي لمدة أسبوع",
            "تحضير القهوة في المنزل بدلاً من ذلك",
            "تحويل المبلغ الموفر إلى خطة الادخار",
        ],
        cardStats: [
            { label: "التوفير", value: "84 ر.س" },
            { label: "المدة", value: "7 أيام" },
        ],
        dataSignals: { ...DATA_SIGNALS, topCategory: "المقاهي" },
        categoryBreakdown: CATEGORY_BREAKDOWN,
    },
];

const FILTERS = [
    "الكل",
    "توصية ادخارية",
    "خطة تدوير",
    "تحدي ذكي",
    "ثقافة مالية",
] as const;

const typeColors: Record<string, { bg: string; text: string }> = {
    "توصية ادخارية": { bg: "#DCFCE7", text: "#15803D" },
    "خطة تدوير": { bg: "#DBEAFE", text: "#1D4ED8" },
    "ثقافة مالية": { bg: "#FEF3C7", text: "#B45309" },
    "تحدي ذكي": { bg: "#F3E8FF", text: "#7E22CE" },
};

const typeIcons: Record<string, string> = {
    "توصية ادخارية": "savings",
    "خطة تدوير": "autorenew",
    "ثقافة مالية": "school",
    "تحدي ذكي": "emoji-events",
};

const TEAL = "#01a736";
const BLACK = "#2e2f2e";
const GOLD = "#60a5fa";

/* Almarai font stack — matches Home.tsx */
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
}: {
    onPress?: () => void;
    style?: any;
    children: React.ReactNode;
    accessibilityLabel?: string;
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

export default function DashboardScreen() {
    const colors = useColors();
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const topPad = Platform.OS === "web" ? 25 : insets.top;
    const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

    const [filter, setFilter] = React.useState<(typeof FILTERS)[number]>("الكل");

    const visibleRecs =
        filter === "الكل"
            ? recommendations
            : recommendations.filter((r) => r.type === filter);

    const openDetails = (rec: AIRecommendation) => {
        router.push({
            pathname: "/OpportunityDetailsScreen" as any,
            params: { recommendationData: JSON.stringify(rec) },
        });
    };

    return (
        <View style={[styles.root, { backgroundColor: colors.background }]}>
            {/* Header */}
            <LinearGradient
                colors={["#017a28", "#01a736"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.header, { paddingTop: topPad }]}
            >
                <View style={styles.headerRow}>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        accessibilityRole="button"
                        accessibilityLabel="الملف الشخصي"
                    >
                        <MaterialIcons
                            name="account-circle"
                            size={36}
                            color="rgba(255,255,255,0.65)"
                        />
                    </TouchableOpacity>
                    <View style={styles.headerCenter}>
                        <Text style={styles.headerTitle}>فكّتك الذكية</Text>
                        <Text style={styles.headerSubtitle}>لوحة الادخار الذكي</Text>
                    </View>
                </View>
            </LinearGradient>

            <ScrollView
                style={styles.scroll}
                contentContainerStyle={[
                    styles.content,
                    { paddingBottom: bottomPad + 170 },
                ]}
                showsVerticalScrollIndicator={false}
            >
                {/* ── Hero dashboard card ─────────────────────────────── */}
                <FadeInView delay={0}>
                    <View style={styles.heroCard}>
                        <View style={styles.heroRow}>
                            <View style={styles.heroNumbers}>
                                <Text style={styles.heroLabel}>هللات مجمّعة هذا الأسبوع</Text>
                                <View style={styles.heroValueRow}>
                                    <Text style={styles.heroValue}>21.60</Text>
                                    <Text style={styles.heroUnit}>ر.س</Text>
                                </View>
                                <View style={styles.heroForecast}>
                                    <MaterialIcons name="trending-up" size={14} color="#4ade80" />
                                    <Text style={styles.heroForecastText}>
                                        95 ر.س متوقعة شهرياً
                                    </Text>
                                </View>
                            </View>
                            <ProgressRing
                                size={92}
                                stroke={9}
                                pct={CURRENT_PROGRESS}
                                color="#4ade80"
                                trackColor="rgba(255,255,255,0.14)"
                            >
                                <Text style={styles.ringPct}>{CURRENT_PROGRESS}%</Text>
                                <Text style={styles.ringLabel}>من الهدف</Text>
                            </ProgressRing>
                        </View>
                        <View style={styles.heroDivider} />
                        <View style={styles.heroInsight}>
                            <MaterialIcons name="auto-awesome" size={14} color={GOLD} />
                            <Text style={styles.heroInsightText}>
                                نمط إنفاقك مستقر، استمر وستصل لهدف الشهر قبل موعده!.
                            </Text>
                        </View>
                    </View>
                </FadeInView>

                {/* ── KPI cards ───────────────────────────────────────── */}
                <FadeInView delay={70}>
                    <View style={styles.kpiGrid}>
                        <KPICard
                            icon="savings"
                            iconColor="#01a736"
                            iconBg="#DCFCE7"
                            value="21.60"
                            unit="ر.س"
                            label="الهللات المجمّعة"
                            trend="+18%"
                            trendUp
                            colors={colors}
                        />
                        <KPICard
                            icon="trending-up"
                            iconColor="#1D4ED8"
                            iconBg="#DBEAFE"
                            value="95"
                            unit="ر.س"
                            label="المتوقع شهرياً"
                            trend="+9%"
                            trendUp
                            colors={colors}
                        />
                        <KPICard
                            icon="receipt-long"
                            iconColor="#B45309"
                            iconBg="#FEF3C7"
                            value="42"
                            unit="عملية"
                            label="نقاط البيع"
                            trend="مستقر"
                            colors={colors}
                        />
                        <KPICard
                            icon="pie-chart"
                            iconColor="#7E22CE"
                            iconBg="#F3E8FF"
                            value="31"
                            unit="%"
                            label="إنفاق اختياري"
                            trend="-4%"
                            trendUp={false}
                            colors={colors}
                        />
                    </View>
                </FadeInView>

                {/* ── Weekly trend + round-up accumulation ────────────── */}
                <FadeInView delay={140}>
                    <View style={styles.chartsRow}>
                        <View
                            style={[
                                styles.chartCard,
                                { backgroundColor: colors.card, borderColor: colors.border },
                            ]}
                        >
                            <Text style={[styles.chartTitle, { color: colors.text }]}>
                                هللات الأسبوع
                            </Text>
                            <View style={styles.trendBars}>
                                {WEEKLY_TREND.map((v, i) => {
                                    const max = Math.max(...WEEKLY_TREND);
                                    const isPeak = v === max;
                                    return (
                                        <View key={i} style={styles.trendCol}>
                                            <View
                                                style={[
                                                    styles.trendBar,
                                                    {
                                                        height: Math.max((v / max) * 54, 6),
                                                        backgroundColor: isPeak ? TEAL : colors.border,
                                                    },
                                                ]}
                                            />
                                            <Text
                                                style={[
                                                    styles.trendDay,
                                                    {
                                                        color: isPeak ? TEAL : colors.mutedForeground,
                                                        fontWeight: isPeak
                                                            ? ("700" as const)
                                                            : ("400" as const),
                                                    },
                                                ]}
                                            >
                                                {WEEK_DAYS[i]}
                                            </Text>
                                        </View>
                                    );
                                })}
                            </View>
                        </View>

                        <View
                            style={[
                                styles.chartCard,
                                { backgroundColor: colors.card, borderColor: colors.border },
                            ]}
                        >
                            <Text style={[styles.chartTitle, { color: colors.text }]}>
                                تجميع التدوير
                            </Text>
                            <View style={styles.accumCenter}>
                                <Text style={[styles.accumValue, { color: colors.text }]}>
                                    21.60
                                </Text>
                                <Text
                                    style={[styles.accumUnit, { color: colors.mutedForeground }]}
                                >
                                    من 25 ر.س أسبوعياً
                                </Text>
                            </View>
                            <View
                                style={[styles.accumTrack, { backgroundColor: colors.border }]}
                            >
                                <View
                                    style={[
                                        styles.accumFill,
                                        { width: "86%" as any, backgroundColor: TEAL },
                                    ]}
                                />
                            </View>
                        </View>
                    </View>
                </FadeInView>

                {/* ── Spending categories ─────────────────────────────── */}
                <FadeInView delay={200}>
                    <View
                        style={[
                            styles.categoryCard,
                            { backgroundColor: colors.card, borderColor: colors.border },
                        ]}
                    >
                        <Text style={[styles.chartTitle, { color: colors.text }]}>
                            أين تذهب مصروفاتك؟
                        </Text>
                        {CATEGORY_BREAKDOWN.slice(0, 4).map((c) => (
                            <View key={c.label} style={styles.catRow}>
                                <Text
                                    style={[styles.catLabel, { color: colors.mutedForeground }]}
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
                                                backgroundColor: colors.primary,
                                            },
                                        ]}
                                    />
                                </View>
                                <Text style={[styles.catPct, { color: colors.text }]}>
                                    {c.value}%
                                </Text>
                            </View>
                        ))}
                    </View>
                </FadeInView>

                {/* ── Smart saving plan (control panel) ───────────────── */}
                <FadeInView delay={260}>
                    <View style={styles.planCard}>
                        <View style={styles.planCircle} pointerEvents="none" />
                        <View style={styles.planHeader}>
                            <MaterialIcons
                                name="account-balance-wallet"
                                size={20}
                                color="#FFFFFF"
                            />
                            <Text style={styles.planTitle}>خطة الادخار الذكية</Text>
                        </View>

                        <View style={styles.planGrid}>
                            <PlanStat icon="autorenew" label="التدوير" value="لأقرب ريال" />
                            <PlanStat icon="flag" label="الهدف" value="صندوق طوارئ" />
                            <PlanStat
                                icon="calendar-today"
                                label="الحد الشهري"
                                value="100 ر.س"
                            />
                            <PlanStat icon="security" label="المخاطرة" value="منخفضة" />
                        </View>

                        <View style={styles.planProgressRow}>
                            <Text style={styles.planProgressPct}>{CURRENT_PROGRESS}%</Text>
                            <Text style={styles.planProgressLabel}>من هدف هذا الشهر</Text>
                        </View>
                        <View style={styles.planTrack}>
                            <View
                                style={[
                                    styles.planFill,
                                    { width: `${CURRENT_PROGRESS}%` as any },
                                ]}
                            />
                        </View>

                        <PressableScale
                            style={styles.planActivate}
                            accessibilityLabel="تفعيل خطة الادخار"
                        >
                            <Text style={styles.planActivateText}>تفعيل الخطة</Text>
                            <MaterialIcons name="arrow-back" size={16} color="#01a736" />
                        </PressableScale>
                    </View>
                </FadeInView>

                {/* ── Recommendations ─────────────────────────────────── */}
                <FadeInView delay={320}>
                    <View style={styles.sectionTitleRow}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>
                            التوصيات الذكية
                        </Text>
                        <View style={styles.sectionTitleAccent} />
                    </View>

                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.chipsRow}
                        style={styles.chipsScroll}
                    >
                        {FILTERS.map((f) => {
                            const active = filter === f;
                            return (
                                <Pressable
                                    key={f}
                                    onPress={() => setFilter(f)}
                                    accessibilityRole="button"
                                    accessibilityState={{ selected: active }}
                                    style={[
                                        styles.chip,
                                        {
                                            backgroundColor: active ? colors.primary : colors.card,
                                            borderColor: active ? colors.primary : colors.border,
                                        },
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.chipText,
                                            { color: active ? "#FFFFFF" : colors.mutedForeground },
                                        ]}
                                    >
                                        {f}
                                    </Text>
                                </Pressable>
                            );
                        })}
                    </ScrollView>
                </FadeInView>

                {visibleRecs.map((rec, idx) => (
                    <FadeInView key={rec.id} delay={380 + idx * 60}>
                        <InsightCard
                            rec={rec}
                            colors={colors}
                            onPress={() => openDetails(rec)}
                        />
                    </FadeInView>
                ))}
            </ScrollView>

            {/* ── Floating assistant button ─────────────────────────── */}
            <PressableScale
                style={[styles.fab, { bottom: bottomPad + 100 }]}
                accessibilityLabel="اسأل المساعد المالي"
            >
                <MaterialIcons name="auto-awesome" size={18} color="#FFFFFF" />
                <Text style={styles.fabText}>اسأل المساعد</Text>
            </PressableScale>
        </View>
    );
}

/* ------------------------------------------------------------------ */
/* Sub-components                                                      */
/* ------------------------------------------------------------------ */

function KPICard({
    icon,
    iconColor,
    iconBg,
    value,
    unit,
    label,
    trend,
    trendUp,
    colors,
}: {
    icon: any;
    iconColor: string;
    iconBg: string;
    value: string;
    unit: string;
    label: string;
    trend: string;
    trendUp?: boolean;
    colors: any;
}) {
    const trendColor =
        trendUp === undefined
            ? colors.mutedForeground
            : trendUp
                ? "#15803D"
                : "#B45309";
    const trendBg =
        trendUp === undefined ? colors.border : trendUp ? "#DCFCE7" : "#FEF3C7";
    return (
        <View
            style={[
                styles.kpiCard,
                { backgroundColor: colors.card, borderColor: colors.border },
            ]}
            accessibilityRole="summary"
            accessibilityLabel={`${label}: ${value} ${unit}، ${trend}`}
        >
            <View style={styles.kpiTop}>
                <View style={[styles.kpiTrend, { backgroundColor: trendBg }]}>
                    <Text style={[styles.kpiTrendText, { color: trendColor }]}>
                        {trend}
                    </Text>
                </View>
                <View style={[styles.kpiIcon, { backgroundColor: iconBg }]}>
                    <MaterialIcons name={icon} size={16} color={iconColor} />
                </View>
            </View>
            <Text style={[styles.kpiValue, { color: colors.text }]} numberOfLines={1}>
                {value}{" "}
                <Text style={[styles.kpiUnit, { color: colors.mutedForeground }]}>
                    {unit}
                </Text>
            </Text>
            <Text
                style={[styles.kpiLabel, { color: colors.mutedForeground }]}
                numberOfLines={1}
            >
                {label}
            </Text>
        </View>
    );
}

function PlanStat({
    icon,
    label,
    value,
}: {
    icon: any;
    label: string;
    value: string;
}) {
    return (
        <View style={styles.planStat}>
            <MaterialIcons name={icon} size={14} color="rgba(255,255,255,0.75)" />
            <View style={styles.planStatText}>
                <Text style={styles.planStatLabel}>{label}</Text>
                <Text style={styles.planStatValue} numberOfLines={1}>
                    {value}
                </Text>
            </View>
        </View>
    );
}

function InsightCard({
    rec,
    colors,
    onPress,
}: {
    rec: AIRecommendation;
    colors: any;
    onPress: () => void;
}) {
    const tc = typeColors[rec.type] ?? { bg: "#F0F0F0", text: "#333" };
    const tIcon = typeIcons[rec.type] ?? "star";
    const hasImpact = rec.expectedImpact > 0;

    return (
        <PressableScale
            style={[
                styles.recCard,
                { backgroundColor: colors.card, borderColor: colors.border },
            ]}
            onPress={onPress}
            accessibilityLabel={`${rec.title}. ${rec.description}`}
        >
            <View style={styles.recTop}>
                <View style={[styles.recBadge, { backgroundColor: tc.bg }]}>
                    <MaterialIcons name={tIcon as any} size={12} color={tc.text} />
                    <Text style={[styles.recBadgeText, { color: tc.text }]}>
                        {rec.type}
                    </Text>
                </View>
                {hasImpact && (
                    <View style={styles.recImpact}>
                        <Text style={styles.recImpactText}>+{rec.expectedImpact} ر.س</Text>
                    </View>
                )}
            </View>

            <Text style={[styles.recTitle, { color: colors.text }]}>{rec.title}</Text>
            <Text
                style={[styles.recDesc, { color: colors.mutedForeground }]}
                numberOfLines={1}
            >
                {rec.description}
            </Text>

            {/* Tiny stats + suitability */}
            <View style={styles.recStatsRow}>
                {rec.cardStats.map((s) => (
                    <View
                        key={s.label}
                        style={[styles.recStat, { backgroundColor: colors.background }]}
                    >
                        <Text style={[styles.recStatValue, { color: colors.text }]}>
                            {s.value}
                        </Text>
                        <Text
                            style={[styles.recStatLabel, { color: colors.mutedForeground }]}
                        >
                            {s.label}
                        </Text>
                    </View>
                ))}
                <View style={styles.recMeterCol}>
                    <Text style={[styles.recMeterText, { color: colors.primary }]}>
                        {rec.suitabilityScore}% مناسبة
                    </Text>
                    <View
                        style={[styles.recMeterTrack, { backgroundColor: colors.border }]}
                    >
                        <View
                            style={[
                                styles.recMeterFill,
                                {
                                    width: `${rec.suitabilityScore}%` as any,
                                    backgroundColor: colors.primary,
                                },
                            ]}
                        />
                    </View>
                </View>
            </View>

            <View style={styles.recFooter}>
                <View style={[styles.recButton, { backgroundColor: colors.primary }]}>
                    <Text style={styles.recButtonText}>عرض التفاصيل</Text>
                    <MaterialIcons name="arrow-back" size={13} color="#FFF" />
                </View>
                <MaterialIcons
                    name="chevron-left"
                    size={18}
                    color={colors.mutedForeground}
                />
            </View>
        </PressableScale>
    );
}

/* ------------------------------------------------------------------ */
/* Styles                                                              */
/* ------------------------------------------------------------------ */

const styles = StyleSheet.create({
    root: { flex: 1 },
    header: {
        paddingHorizontal: 20,
        paddingBottom: 18,
        overflow: "hidden",
    },
    headerCircle: {
        position: "absolute",
        top: -60,
        left: -50,
        width: 170,
        height: 170,
        borderRadius: 85,
        backgroundColor: "rgba(255,255,255,0.06)",
    },
    headerRow: {
        flexDirection: "row-reverse",
        alignItems: "center",
        gap: 12,
    },
    headerCenter: { flex: 1, alignItems: "flex-end" },
    headerTitle: {
        fontFamily: FONT_BOLD,
        fontSize: 20,
        fontWeight: "700" as const,
        color: "#FFFFFF",
        textAlign: "right",
    },
    headerSubtitle: {
        fontFamily: FONT_REGULAR,
        fontSize: 12,
        color: "rgba(255,255,255,0.75)",
        textAlign: "right",
        marginTop: 1,
    },
    headerBell: {
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: "rgba(255,255,255,0.15)",
        alignItems: "center",
        justifyContent: "center",
    },
    bellDot: {
        position: "absolute",
        top: 6,
        right: 7,
        width: 7,
        height: 7,
        borderRadius: 4,
        backgroundColor: "#ff4757",
        borderWidth: 1.5,
        borderColor: "#017a28",
    },
    scroll: { flex: 1 },
    content: { padding: 16 },

    /* Hero */
    heroCard: {
        backgroundColor: BLACK,
        borderRadius: 22,
        padding: 20,
        marginBottom: 16,
        overflow: "hidden",
    },
    heroGlow: {
        position: "absolute",
        top: -70,
        right: -60,
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: "rgba(1,167,54,0.16)",
    },
    heroRow: {
        flexDirection: "row-reverse",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
    },
    heroNumbers: { flex: 1, alignItems: "flex-end" },
    heroLabel: {
        fontFamily: FONT_REGULAR,
        fontSize: 12,
        color: "rgba(255,255,255,0.7)",
        textAlign: "right",
        marginBottom: 4,
    },
    heroValueRow: {
        flexDirection: "row-reverse",
        alignItems: "flex-end",
        gap: 6,
    },
    heroValue: {
        fontFamily: FONT_BOLD,
        fontSize: 40,
        fontWeight: "800" as const,
        color: "#FFFFFF",
        lineHeight: 46,
    },
    heroUnit: {
        fontFamily: FONT_REGULAR,
        fontSize: 15,
        color: "rgba(255,255,255,0.7)",
        marginBottom: 6,
    },
    heroForecast: {
        flexDirection: "row-reverse",
        alignItems: "center",
        gap: 5,
        marginTop: 6,
    },
    heroForecastText: {
        fontFamily: FONT_MEDIUM,
        fontSize: 12,
        color: "#4ade80",
        fontWeight: "600" as const,
    },
    ringPct: {
        fontFamily: FONT_BOLD,
        fontSize: 17,
        fontWeight: "800" as const,
        color: "#FFFFFF",
    },
    ringLabel: {
        fontFamily: FONT_REGULAR,
        fontSize: 10,
        color: "rgba(255,255,255,0.65)",
    },
    heroDivider: {
        height: 1,
        backgroundColor: "rgba(255,255,255,0.12)",
        marginVertical: 14,
    },
    heroInsight: {
        flexDirection: "row-reverse",
        alignItems: "center",
        gap: 8,
    },
    heroInsightText: {
        fontFamily: FONT_REGULAR,
        flex: 1,
        fontSize: 12,
        lineHeight: 19,
        color: "rgba(255,255,255,0.85)",
        textAlign: "right",
        writingDirection: "rtl",
    },

    /* KPI */
    kpiGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
        marginBottom: 16,
    },
    kpiCard: {
        width: "47.8%",
        borderRadius: 16,
        padding: 12,
        borderWidth: StyleSheet.hairlineWidth,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 1,
    },
    kpiTop: {
        flexDirection: "row-reverse",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 8,
    },
    kpiIcon: {
        width: 30,
        height: 30,
        borderRadius: 9,
        alignItems: "center",
        justifyContent: "center",
    },
    kpiTrend: {
        borderRadius: 10,
        paddingHorizontal: 7,
        paddingVertical: 2,
    },
    kpiTrendText: {
        fontFamily: FONT_BOLD,
        fontSize: 10,
        fontWeight: "700" as const,
    },
    kpiValue: {
        fontFamily: FONT_BOLD,
        fontSize: 22,
        fontWeight: "800" as const,
        textAlign: "right",
    },
    kpiUnit: { fontSize: 11, fontWeight: "400" as const, fontFamily: FONT_REGULAR },
    kpiLabel: {
        fontFamily: FONT_REGULAR,
        fontSize: 11,
        textAlign: "right",
        writingDirection: "rtl",
        marginTop: 2,
    },

    /* Mini charts */
    chartsRow: {
        flexDirection: "row-reverse",
        gap: 10,
        marginBottom: 10,
    },
    chartCard: {
        flex: 1,
        borderRadius: 16,
        padding: 14,
        borderWidth: StyleSheet.hairlineWidth,
    },
    chartTitle: {
        fontFamily: FONT_BOLD,
        fontSize: 13,
        fontWeight: "700" as const,
        textAlign: "right",
        writingDirection: "rtl",
        marginBottom: 10,
    },
    trendBars: {
        flexDirection: "row-reverse",
        alignItems: "flex-end",
        gap: 5,
        height: 70,
    },
    trendCol: {
        flex: 1,
        alignItems: "center",
        justifyContent: "flex-end",
        gap: 4,
    },
    trendBar: { width: "100%", borderRadius: 4 },
    trendDay: { fontSize: 9, fontFamily: FONT_REGULAR },
    accumCenter: { alignItems: "flex-end", marginBottom: 10 },
    accumValue: { fontSize: 26, fontWeight: "800" as const, fontFamily: FONT_BOLD },
    accumUnit: { fontSize: 10, marginTop: 1, fontFamily: FONT_REGULAR },
    accumTrack: {
        height: 8,
        borderRadius: 4,
        overflow: "hidden",
        flexDirection: "row-reverse",
    },
    accumFill: { height: "100%", borderRadius: 4 },

    /* Categories */
    categoryCard: {
        borderRadius: 16,
        padding: 14,
        marginBottom: 16,
        borderWidth: StyleSheet.hairlineWidth,
    },
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

    /* Plan */
    planCard: {
        backgroundColor: "#01a736",
        borderRadius: 20,
        padding: 18,
        marginBottom: 20,
        overflow: "hidden",
    },
    planCircle: {
        position: "absolute",
        top: -50,
        left: -40,
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: "rgba(255,255,255,0.07)",
    },
    planHeader: {
        flexDirection: "row-reverse",
        alignItems: "center",
        gap: 8,
        marginBottom: 14,
    },
    planTitle: {
        fontFamily: FONT_BOLD,
        fontSize: 15,
        fontWeight: "700" as const,
        color: "#FFFFFF",
    },
    planGrid: {
        flexDirection: "row-reverse",
        flexWrap: "wrap",
        gap: 10,
        marginBottom: 16,
    },
    planStat: {
        width: "47%",
        flexDirection: "row-reverse",
        alignItems: "center",
        gap: 8,
        backgroundColor: "rgba(255,255,255,0.1)",
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 8,
    },
    planStatText: { flex: 1, alignItems: "flex-end" },
    planStatLabel: { fontSize: 10, color: "rgba(255,255,255,0.65)", fontFamily: FONT_REGULAR },
    planStatValue: {
        fontFamily: FONT_BOLD,
        fontSize: 12,
        fontWeight: "700" as const,
        color: "#FFFFFF",
    },
    planProgressRow: {
        flexDirection: "row-reverse",
        alignItems: "center",
        gap: 6,
        marginBottom: 6,
    },
    planProgressPct: {
        fontFamily: FONT_BOLD,
        fontSize: 14,
        fontWeight: "800" as const,
        color: "#FFFFFF",
    },
    planProgressLabel: {
        fontFamily: FONT_REGULAR,
        fontSize: 12,
        color: "rgba(255,255,255,0.75)",
    },
    planTrack: {
        height: 8,
        borderRadius: 4,
        backgroundColor: "rgba(255,255,255,0.18)",
        overflow: "hidden",
        flexDirection: "row-reverse",
        marginBottom: 14,
    },
    planFill: {
        height: "100%",
        borderRadius: 4,
        backgroundColor: "#4ade80",
    },
    planActivate: {
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        paddingVertical: 11,
        flexDirection: "row-reverse",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
    },
    planActivateText: {
        fontFamily: FONT_BOLD,
        fontSize: 14,
        fontWeight: "700" as const,
        color: "#01a736",
    },

    /* Section + chips */
    sectionTitleRow: {
        flexDirection: "row-reverse",
        alignItems: "center",
        gap: 8,
        marginBottom: 10,
    },
    sectionTitleAccent: {
        width: 4,
        height: 18,
        borderRadius: 2,
        backgroundColor: "#01a736",
    },
    sectionTitle: {
        fontFamily: FONT_BOLD,
        fontSize: 17,
        fontWeight: "700" as const,
        textAlign: "right",
        writingDirection: "rtl",
    },
    chipsScroll: { marginBottom: 12 },
    chipsRow: {
        flexDirection: "row-reverse",
        gap: 8,
        paddingVertical: 2,
    },
    chip: {
        borderRadius: 20,
        paddingHorizontal: 14,
        paddingVertical: 7,
        borderWidth: 1,
    },
    chipText: { fontSize: 12, fontWeight: "600" as const, fontFamily: FONT_MEDIUM },

    /* Recommendation insight cards */
    recCard: {
        borderRadius: 18,
        padding: 14,
        marginBottom: 12,
        borderWidth: StyleSheet.hairlineWidth,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 1,
    },
    recTop: {
        flexDirection: "row-reverse",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 8,
    },
    recBadge: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        borderRadius: 20,
        paddingHorizontal: 9,
        paddingVertical: 4,
    },
    recBadgeText: { fontSize: 10, fontWeight: "600" as const, fontFamily: FONT_MEDIUM },
    recImpact: {
        backgroundColor: "#DCFCE7",
        borderRadius: 20,
        paddingHorizontal: 9,
        paddingVertical: 4,
    },
    recImpactText: {
        fontFamily: FONT_BOLD,
        fontSize: 11,
        fontWeight: "800" as const,
        color: "#15803D",
    },
    recTitle: {
        fontFamily: FONT_BOLD,
        fontSize: 15,
        fontWeight: "700" as const,
        textAlign: "right",
        writingDirection: "rtl",
        marginBottom: 3,
    },
    recDesc: {
        fontFamily: FONT_REGULAR,
        fontSize: 12,
        textAlign: "right",
        writingDirection: "rtl",
    },
    recStatsRow: {
        flexDirection: "row-reverse",
        alignItems: "center",
        gap: 8,
        marginTop: 12,
        marginBottom: 12,
    },
    recStat: {
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 6,
        alignItems: "center",
    },
    recStatValue: { fontSize: 13, fontWeight: "800" as const, fontFamily: FONT_BOLD },
    recStatLabel: { fontSize: 9, marginTop: 1, fontFamily: FONT_REGULAR },
    recMeterCol: { flex: 1, alignItems: "flex-end", gap: 4 },
    recMeterText: { fontSize: 10, fontWeight: "700" as const, fontFamily: FONT_BOLD },
    recMeterTrack: {
        width: "100%",
        height: 4,
        borderRadius: 2,
        overflow: "hidden",
        flexDirection: "row-reverse",
    },
    recMeterFill: { height: "100%", borderRadius: 2 },
    recFooter: {
        flexDirection: "row-reverse",
        alignItems: "center",
        justifyContent: "space-between",
    },
    recButton: {
        flexDirection: "row-reverse",
        alignItems: "center",
        gap: 5,
        borderRadius: 10,
        paddingVertical: 7,
        paddingHorizontal: 13,
    },
    recButtonText: {
        fontFamily: FONT_MEDIUM,
        fontSize: 12,
        fontWeight: "600" as const,
        color: "#FFFFFF",
    },

    /* FAB */
    fab: {
        position: "absolute",
        left: 16,
        flexDirection: "row-reverse",
        alignItems: "center",
        gap: 6,
        backgroundColor: BLACK,
        borderRadius: 26,
        paddingHorizontal: 16,
        paddingVertical: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 6,
    },
    fabText: {
        fontFamily: FONT_BOLD,
        fontSize: 13,
        fontWeight: "700" as const,
        color: "#FFFFFF",
    },
});
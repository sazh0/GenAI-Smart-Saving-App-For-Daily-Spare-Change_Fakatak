import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    Alert,
    Image,
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

export default function DigitalWalletScreen({ navigation }: any) {
    const [collectedChange] = useState(21.60);
    const [savedAmount] = useState(67.05);
    const [monthlyGoal] = useState(100.0);

    const RiyalIcon = ({ size = 16, color, style = {} }: { size?: number; color: string; style?: any }) => (
        <Image
            source={require('@/assets/images/riyal.png')}
            style={[
                {
                    width: size,
                    height: size,
                    resizeMode: 'contain',
                    tintColor: color,
                },
                style
            ]}
        />
    );

    const paymentMethods = [
        {
            id: 1,
            type: "visa",
            cardNumber: "**** **** **** 4532",
            expiryDate: "12/26",
            isDefault: true,
            roundUpEnabled: true,
        },
        {
            id: 2,
            type: "mastercard",
            cardNumber: "**** **** **** 8901",
            expiryDate: "08/25",
            isDefault: false,
            roundUpEnabled: true,
        },
        {
            id: 3,
            type: "mada",
            cardNumber: "**** **** **** 2347",
            expiryDate: "03/27",
            isDefault: false,
            roundUpEnabled: false,
        },
    ];

    const recentRoundUps = [
        {
            id: 1,
            merchant: "كافيه النخيل",
            purchaseAmount: 23.75,
            roundUpAmount: 0.25,
            date: "2025-07-30",
            status: "collected"
        },
        {
            id: 2,
            merchant: "سوبر ماركت الخير",
            purchaseAmount: 87.30,
            roundUpAmount: 0.70,
            date: "2025-07-30",
            status: "collected"
        },
        {
            id: 3,
            merchant: "محطة الوقود",
            purchaseAmount: 156.85,
            roundUpAmount: 0.15,
            date: "2025-07-29",
            status: "saved"
        },
        {
            id: 4,
            merchant: "مختبرات البرج",
            purchaseAmount: 390.60,
            roundUpAmount: 0.40,
            date: "2025-07-29",
            status: "saved"
        },
    ];

    const handleTransferToGoal = () => {
        Alert.alert("تحويل للهدف", "اختر المبلغ المراد تحويله إلى هدفك الادخاري");
    };

    const handleAddCard = () => {
        Alert.alert("إضافة بطاقة", "أضف بطاقة جديدة لتجميع الفكة منها");
    };

    const toggleRoundUp = (cardId: number) => {
        const card = paymentMethods.find(method => method.id === cardId);
        if (!card) return;

        const isEnabled = card.roundUpEnabled;
        const title = isEnabled ? "إيقاف جمع الفكة" : "تفعيل جمع الفكة";
        const message = isEnabled
            ? "هل تريد إيقاف جمع الفكة من هذه البطاقة؟"
            : "هل تريد إعادة تفعيل جمع الفكة من هذه البطاقة؟";
        const confirmText = isEnabled ? "إيقاف" : "تفعيل";
        const successMessage = isEnabled
            ? "تم إيقاف جمع الفكة من هذه البطاقة"
            : "تم تفعيل جمع الفكة من هذه البطاقة";

        Alert.alert(
            title,
            message,
            [
                {
                    text: "إلغاء",
                    style: "cancel"
                },
                {
                    text: confirmText,
                    onPress: () => {
                        Alert.alert("تم التحديث", successMessage);
                    }
                }
            ]
        );
    };

    const getCardIcon = (type: string) => {
        switch (type) {
            case "visa":
                return "credit-card";
            case "mastercard":
                return "credit-card";
            case "mada":
                return "account-balance-wallet";
            default:
                return "credit-card";
        }
    };

    const getCardColor = (type: string) => {
        switch (type) {
            case "visa":
                return "#1a73e8";
            case "mastercard":
                return "#eb001b";
            case "mada":
                return "#01a736";
            default:
                return "#6b7280";
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <MaterialIcons name="arrow-back" size={20} color="#001a6e" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>المحفظة الادخارية</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView
                style={styles.content}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                {/* Change Collection Summary */}
                <View style={styles.summaryCard}>
                    <View style={styles.summaryHeader}>
                        <Text style={styles.summaryTitle}>الفكة المتجمعة</Text>
                    </View>
                    <View style={styles.amountWithIcon}>
                        <RiyalIcon size={28} color="#ffffff" />
                        <Text style={styles.summaryAmount}>{collectedChange.toFixed(2)}</Text>
                    </View>
                </View>

                {/* Savings Overview */}
                <View style={styles.savingsOverview}>
                    <View style={styles.savingsItem}>
                        <Text style={styles.savingsLabel}>المبلغ المُدخر</Text>
                        <View style={styles.amountWithIcon}>
                            <RiyalIcon size={16} color={BLACK} />
                            <Text style={styles.savingsValue}>{savedAmount.toFixed(2)}</Text>
                        </View>
                    </View>
                    <View style={styles.savingsDivider} />
                    <View style={styles.savingsItem}>
                        <Text style={styles.savingsLabel}>هدف الشهر</Text>
                        <View style={styles.amountWithIcon}>
                            <RiyalIcon size={16} color={TEAL} />
                            <Text style={[styles.savingsValue, styles.goalValue]}>{monthlyGoal.toFixed(2)}</Text>
                        </View>
                    </View>
                </View>

                {/* Payment Methods with Round-up Settings */}
                <View style={styles.sectionContainer}>
                    <View style={styles.sectionHeader}>
                        <TouchableOpacity
                            style={styles.addButton}
                            onPress={handleAddCard}
                        >
                            <MaterialIcons name="add" size={20} color="#01a736" />
                            <Text style={styles.addButtonText}>إضافة</Text>
                        </TouchableOpacity>
                        <Text style={styles.sectionTitle}>بطاقات تجميع الفكة</Text>
                    </View>

                    {paymentMethods.map((method) => (
                        <TouchableOpacity
                            key={method.id}
                            style={styles.paymentMethodItem}
                            onPress={() => toggleRoundUp(method.id)}
                            activeOpacity={0.7}
                        >
                            <View style={styles.cardActions}>
                                {method.isDefault && (
                                    <View style={styles.defaultBadge}>
                                        <Text style={styles.defaultBadgeText}>افتراضي</Text>
                                    </View>
                                )}
                            </View>
                            <View style={styles.paymentMethodLeft}>
                                <View style={styles.cardDetails}>
                                    <Text style={styles.cardNumber}>{method.cardNumber}</Text>
                                    <Text style={styles.cardExpiry}>انتهاء الصلاحية: {method.expiryDate}</Text>
                                    <View style={styles.roundUpStatus}>
                                        <Text style={[
                                            styles.roundUpText,
                                            { color: method.roundUpEnabled ? "#10b981" : "#ef4444" }
                                        ]}>
                                            {method.roundUpEnabled ? "تجميع الفكة مفعل" : "تجميع الفكة معطل"}
                                        </Text>
                                        <MaterialIcons
                                            name={method.roundUpEnabled ? "check-circle" : "cancel"}
                                            size={14}
                                            color={method.roundUpEnabled ? "#10b981" : "#ef4444"}
                                        />
                                    </View>
                                    <Text style={styles.tapToChangeText}>
                                        {method.roundUpEnabled ? "اضغط لإيقاف جمع الفكة" : "اضغط لإعادة تفعيل جمع الفكة"}
                                    </Text>
                                </View>
                                <View style={[
                                    styles.cardIconContainer,
                                    { backgroundColor: getCardColor(method.type) + "20" }
                                ]}>
                                    <MaterialIcons
                                        name={getCardIcon(method.type)}
                                        size={24}
                                        color={getCardColor(method.type)}
                                    />
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Recent Round-ups */}
                <View style={styles.sectionContainer}>
                    <View style={styles.sectionHeader}>
                        <TouchableOpacity>
                            <Text style={styles.seeAllText}>عرض الكل</Text>
                        </TouchableOpacity>
                        <Text style={styles.sectionTitle}>الفكة المتجمعة مؤخراً</Text>
                    </View>

                    {recentRoundUps.map((roundUp) => (
                        <View key={roundUp.id} style={styles.roundUpItem}>
                            <View style={styles.roundUpRight}>
                                <View style={styles.amountWithIcon}>
                                    <RiyalIcon size={12} color="#01a736" />
                                    <Text style={styles.roundUpAmount}>
                                        +{roundUp.roundUpAmount.toFixed(2)}
                                    </Text>
                                </View>
                                <Text style={[
                                    styles.roundUpStatus,
                                    roundUp.status === "saved" ? styles.savedStatus : styles.collectedStatus
                                ]}>
                                    {roundUp.status === "saved" ? "مدخرة" : "متجمعة"}
                                </Text>
                            </View>
                            <View style={styles.roundUpLeft}>
                                <View style={styles.roundUpDetails}>
                                    <Text style={styles.merchantName}>{roundUp.merchant}</Text>
                                    <View style={styles.purchaseInfoContainer}>
                                        <RiyalIcon size={10} color="#6b7280" />
                                        <Text style={styles.purchaseInfo}>
                                            مشتريات: {roundUp.purchaseAmount.toFixed(2)}
                                        </Text>
                                    </View>
                                    <Text style={styles.roundUpDate}>{roundUp.date}</Text>
                                </View>
                                <View style={[
                                    styles.roundUpIconContainer,
                                    roundUp.status === "saved" ? styles.savedIcon : styles.collectedIcon
                                ]}>
                                    <MaterialIcons
                                        name={roundUp.status === "saved" ? "savings" : "account-balance-wallet"}
                                        size={20}
                                        color={roundUp.status === "saved" ? TEAL : MUTED}
                                    />
                                </View>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Saving Actions */}
                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>إجراءات الادخار</Text>

                    <View style={styles.quickActionsGrid}>
                        <TouchableOpacity style={styles.quickActionItem}>
                            <MaterialIcons name="savings" size={24} color={TEAL} />
                            <Text style={styles.quickActionText}>خطة الادخار</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.quickActionItem}>
                            <MaterialIcons name="history" size={24} color={TEAL} />
                            <Text style={styles.quickActionText}>سجل الفكة</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.quickActionItem}
                            onPress={handleTransferToGoal}
                        >
                            <MaterialIcons name="flag" size={24} color={TEAL} />
                            <Text style={styles.quickActionText}>تحويل للهدف</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.quickActionItem}>
                            <MaterialIcons name="settings" size={24} color={TEAL} />
                            <Text style={styles.quickActionText}>إعدادات الادخار</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8fafc",
    },
    header: {
        backgroundColor: "#ffffff",
        flexDirection: "row",
        alignItems: "center",
        paddingTop: 50,
        paddingBottom: 8,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#f1f5f9",
    },
    headerTitle: {
        fontSize: 16,
        fontFamily: FONT_BOLD,
        color: BLACK,
        textAlign: "center",
        flex: 1,
        marginHorizontal: 10,
    },
    backButton: {
        width: 32,
        height: 32,
        alignItems: "center",
        justifyContent: "center",
    },
    placeholder: {
        width: 32,
    },
    content: {
        flex: 1,
    },
    contentContainer: {
        flexGrow: 1,
        paddingHorizontal: 20,
        paddingBottom: 60,
    },
    summaryCard: {
        backgroundColor: TEAL,
        borderRadius: 20,
        padding: 24,
        marginTop: 24,
        alignItems: "center",
        elevation: 4,
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
    },
    summaryHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    summaryTitle: {
        fontSize: 18,
        fontFamily: FONT_BOLD,
        color: "#ffffff",
        marginRight: 8,
    },
    amountWithIcon: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 6, // Add consistent spacing between icon and text
    },
    summaryAmount: {
        fontSize: 36,
        fontFamily: FONT_BOLD,
        color: "#ffffff",
        marginBottom: 4,
    },
    savingsOverview: {
        backgroundColor: "#ffffff",
        borderRadius: 16,
        marginTop: 16,
        padding: 20,
        flexDirection: "row",
        alignItems: "center",
        elevation: 2,
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    savingsItem: {
        flex: 1,
        alignItems: "center",
    },
    savingsLabel: {
        fontSize: 14,
        fontFamily: FONT_REGULAR,
        color: "#6b7280",
        marginBottom: 4,
        textAlign: "center",
        lineHeight: 30
    },
    savingsValue: {
        fontSize: 20,
        fontFamily: FONT_BOLD,
        color: BLACK,
        textAlign: "center",
    },
    goalValue: {
        color: TEAL,
    },
    savingsDivider: {
        width: 1,
        height: 40,
        backgroundColor: "#e5e7eb",
        marginHorizontal: 20,
    },
    sectionContainer: {
        backgroundColor: "#ffffff",
        borderRadius: 16,
        marginTop: 24,
        padding: 20,
        elevation: 2,
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontFamily: FONT_BOLD,
        color: BLACK,
        textAlign: "right",
        lineHeight: 35
    },
    addButton: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: "#f0fdf4",
        borderRadius: 8,
    },
    addButtonText: {
        fontSize: 14,
        fontFamily: FONT_MEDIUM,
        color: TEAL,
        marginRight: 4,
    },
    seeAllText: {
        fontSize: 14,
        fontFamily: FONT_MEDIUM,
        color: TEAL,
    },
    paymentMethodItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#f1f5f9",
    },
    paymentMethodLeft: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    cardIconContainer: {
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 8,
        marginLeft: 12,
    },
    cardDetails: {
        flex: 1,
        alignItems: "flex-end",
        marginRight: 12,
    },
    cardNumber: {
        fontSize: 16,
        fontFamily: FONT_MEDIUM,
        color: BLACK,
        marginBottom: 2,
        textAlign: "right",
    },
    cardExpiry: {
        fontSize: 12,
        fontFamily: FONT_REGULAR,
        color: "#6b7280",
        textAlign: "right",
        marginBottom: 4,
    },
    roundUpStatus: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
        fontFamily: FONT_BOLD,
    },
    roundUpText: {
        fontSize: 12,
        fontFamily: FONT_MEDIUM,
        marginRight: 4,
    },
    tapToChangeText: {
        fontSize: 11,
        fontFamily: FONT_REGULAR,
        color: "#9ca3af",
        textAlign: "right",
        marginTop: 2,
    },
    cardActions: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    defaultBadge: {
        backgroundColor: TEAL,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
    },
    defaultBadgeText: {
        fontSize: 10,
        fontFamily: FONT_MEDIUM,
        color: "#ffffff",
    },
    roundUpItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#f1f5f9",
    },
    roundUpLeft: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    roundUpIconContainer: {
        width: 36,
        height: 36,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 18,
        marginLeft: 12,
    },
    collectedIcon: {
        backgroundColor: "#f1f5f9",
    },
    savedIcon: {
        backgroundColor: "#dcfce7",
    },
    roundUpDetails: {
        flex: 1,
        alignItems: "flex-end",
        marginRight: 12,
    },
    merchantName: {
        fontSize: 14,
        fontFamily: FONT_MEDIUM,
        color: BLACK,
        marginBottom: 2,
        textAlign: "right",
    },
    purchaseInfoContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
        marginBottom: 2,
        gap: 4, // Add consistent spacing between icon and text
    },
    purchaseInfo: {
        fontSize: 12,
        fontFamily: FONT_REGULAR,
        color: "#6b7280",
        textAlign: "right",
    },
    roundUpDate: {
        fontSize: 12,
        fontFamily: FONT_REGULAR,
        color: "#6b7280",
        textAlign: "right",
    },
    roundUpRight: {
        alignItems: "flex-end",
    },
    roundUpAmount: {
        fontSize: 14,
        fontFamily: FONT_BOLD,
        color: TEAL,
        marginBottom: 2,
    },
    collectedStatus: {
        color: MUTED,
    },
    savedStatus: {
        color: TEAL,
    },
    quickActionsGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        marginTop: 8,
    },
    quickActionItem: {
        width: "48%",
        alignItems: "center",
        paddingVertical: 16,
        backgroundColor: "#f8fafc",
        borderRadius: 12,
        marginBottom: 12,
    },
    quickActionText: {
        fontSize: 12,
        fontFamily: FONT_MEDIUM,
        color: BLACK,
        marginTop: 8,
        textAlign: "center",
    },
});
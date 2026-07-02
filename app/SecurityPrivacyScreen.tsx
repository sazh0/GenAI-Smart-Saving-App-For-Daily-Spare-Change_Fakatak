import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Switch,
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


export default function SecurityPrivacyScreen({ navigation }: any) {
    const [settings, setSettings] = useState({
        twoFactorAuth: true,
        biometricAuth: false,
        loginNotifications: true,
        dataSharing: false,
        locationTracking: true,
        marketingEmails: false,
    });

    const toggleTwoFactorAuth = () => {
        setSettings(prev => ({
            ...prev,
            twoFactorAuth: !prev.twoFactorAuth
        }));
    };

    const toggleBiometricAuth = () => {
        setSettings(prev => ({
            ...prev,
            biometricAuth: !prev.biometricAuth
        }));
    };

    const toggleDataSharing = () => {
        setSettings(prev => ({
            ...prev,
            dataSharing: !prev.dataSharing
        }));
    };

    const toggleMarketingEmails = () => {
        setSettings(prev => ({
            ...prev,
            marketingEmails: !prev.marketingEmails
        }));
    };

    const handleChangePassword = () => {
        Alert.alert("تغيير كلمة المرور", "سيتم توجيهك لصفحة تغيير كلمة المرور");
    };

    const handleViewLoginHistory = () => {
        Alert.alert("سجل تسجيل الدخول", "عرض آخر عمليات تسجيل الدخول");
    };

    const handleDeleteAccount = () => {
        Alert.alert(
            "حذف الحساب",
            "هل أنت متأكد من حذف حسابك؟ هذا الإجراء لا يمكن التراجع عنه.",
            [
                { text: "إلغاء", style: "cancel" },
                { text: "حذف", style: "destructive" }
            ]
        );
    };

    const SettingItem = ({ icon, title, hasSwitch = false, switchValue, onToggle, onPress }: any) => {
        if (hasSwitch) {
            return (
                <View style={styles.settingItem}>
                    <View style={styles.switchContainer}>
                        <Switch
                            value={switchValue}
                            onValueChange={onToggle}
                            trackColor={{ false: "#e5e7eb", true: "#86efac" }}
                            thumbColor={switchValue ? "#01a736" : "#f3f4f6"}
                        />
                    </View>
                    <View style={styles.settingCenter}>
                        <View style={styles.settingTextContainer}>
                            <Text style={styles.settingTitle}>{title}</Text>
                        </View>
                    </View>
                    <View style={styles.settingIconContainer}>
                        <MaterialIcons name={icon} size={24} color="#01a736" />
                    </View>
                </View>
            );
        }

        return (
            <TouchableOpacity
                style={styles.settingItem}
                onPress={onPress}
                activeOpacity={0.6}
            >
                <MaterialIcons name="chevron-left" size={24} color="#6b7280" />
                <View style={styles.settingCenter}>
                    <View style={styles.settingTextContainer}>
                        <Text style={styles.settingTitle}>{title}</Text>
                    </View>
                </View>
                <View style={styles.settingIconContainer}>
                    <MaterialIcons name={icon} size={24} color="#01a736" />
                </View>
            </TouchableOpacity>
        );
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
                <Text style={styles.headerTitle}>الأمان والخصوصية</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView
                style={styles.content}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>الأمان</Text>

                    <SettingItem
                        icon="lock"
                        title="تغيير كلمة المرور"
                        onPress={handleChangePassword}
                    />

                    <SettingItem
                        icon="security"
                        title="المصادقة الثنائية"
                        hasSwitch={true}
                        switchValue={settings.twoFactorAuth}
                        onToggle={toggleTwoFactorAuth}
                    />

                    <SettingItem
                        icon="fingerprint"
                        title="المصادقة البيومترية"
                        hasSwitch={true}
                        switchValue={settings.biometricAuth}
                        onToggle={toggleBiometricAuth}
                    />
                </View>

                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>الخصوصية</Text>

                    <SettingItem
                        icon="share"
                        title="مشاركة البيانات"
                        hasSwitch={true}
                        switchValue={settings.dataSharing}
                        onToggle={toggleDataSharing}
                    />

                    <SettingItem
                        icon="email"
                        title="رسائل تسويقية"
                        hasSwitch={true}
                        switchValue={settings.marketingEmails}
                        onToggle={toggleMarketingEmails}
                    />
                </View>

                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>إدارة البيانات</Text>

                    <TouchableOpacity
                        style={[styles.dataButton, styles.deleteButton]}
                        onPress={handleDeleteAccount}
                    >
                        <MaterialIcons name="delete-forever" size={24} color="#ff4757" />
                        <Text style={[styles.dataButtonText, styles.deleteButtonText]}>حذف الحساب</Text>
                    </TouchableOpacity>
                </View>

                {/* Extra space to ensure scrolling to bottom */}
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
        lineHeight: 25
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
    sectionContainer: {
        backgroundColor: "#ffffff",
        borderRadius: 16,
        marginTop: 24,
        elevation: 2,
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontFamily: FONT_BOLD,
        color: BLACK,
        textAlign: "right",
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 8,
    },
    settingItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#f1f5f9",
        minHeight: 60,
    },
    switchContainer: {
        width: 60,
        alignItems: "center",
        justifyContent: "center",
    },
    settingCenter: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
        justifyContent: "center",
    },
    settingIconContainer: {
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 20,
        backgroundColor: "#f0fdf4",
    },
    settingTextContainer: {
        flex: 1,
        alignItems: "flex-end",
    },
    settingTitle: {
        fontSize: 16,
        fontFamily: FONT_MEDIUM,
        color: BLACK,
        textAlign: "right",
        paddingRight: 10

    },
    dataButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 16,
        marginHorizontal: 20,
        marginVertical: 8,
        borderRadius: 12,
        backgroundColor: "#f0fdf4",
    },
    dataButtonText: {
        fontSize: 16,
        fontFamily: FONT_MEDIUM,
        color: "#01a736",
        marginLeft: 8,
    },
    deleteButton: {
        backgroundColor: "#fef2f2",
        marginBottom: 20,
    },
    deleteButtonText: {
        color: "#ff4757",
    },
}); 
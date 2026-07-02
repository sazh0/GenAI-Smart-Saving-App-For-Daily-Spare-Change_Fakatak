import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
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

export default function NotificationsScreen({ navigation }: any) {
    const [notifications, setNotifications] = useState({
        pushNotifications: true,
        emailNotifications: true,
        orderUpdates: true,
        promotionalOffers: false,
        paymentAlerts: true,
        securityAlerts: true,
        weeklyDigest: true,
        newsUpdates: false,
        soundEnabled: true,
        vibrationEnabled: true,
    });

    const toggleNotification = (key: string) => {
        setNotifications(prev => ({
            ...prev,
            [key]: !prev[key as keyof typeof prev]
        }));
    };

    const NotificationItem = ({ icon, title, switchValue, onToggle, iconColor = "#01a736" }: any) => (
        <View style={styles.notificationItem}>
            <Switch
                value={switchValue}
                onValueChange={onToggle}
                trackColor={{ false: "#e5e7eb", true: "#86efac" }}
                thumbColor={switchValue ? "#01a736" : "#f3f4f6"}
            />
            <View style={styles.notificationRight}>
                <View style={styles.notificationTextContainer}>
                    <Text style={styles.notificationTitle}>{title}</Text>
                </View>
                <View style={[styles.notificationIconContainer, { backgroundColor: iconColor + "20" }]}>
                    <MaterialIcons name={icon} size={24} color={iconColor} />
                </View>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <MaterialIcons name="arrow-back" size={20} color="#001a6e" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>الإشعارات</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView
                style={styles.content}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>إشعارات التطبيق</Text>

                    <NotificationItem
                        icon="notifications"
                        title="الإشعارات الفورية"
                        switchValue={notifications.pushNotifications}
                        onToggle={() => toggleNotification('pushNotifications')}
                    />

                    <NotificationItem
                        icon="email"
                        title="إشعارات البريد الإلكتروني"
                        switchValue={notifications.emailNotifications}
                        onToggle={() => toggleNotification('emailNotifications')}
                        iconColor="#3b82f6"
                    />
                </View>


                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>الصوت والاهتزاز</Text>

                    <NotificationItem
                        icon="music-note"
                        title="تفعيل الصوت"
                        switchValue={notifications.soundEnabled}
                        onToggle={() => toggleNotification('soundEnabled')}
                        iconColor="#8b5cf6"
                    />

                    <NotificationItem
                        icon="vibration"
                        title="تفعيل الاهتزاز"
                        switchValue={notifications.vibrationEnabled}
                        onToggle={() => toggleNotification('vibrationEnabled')}
                        iconColor="#06b6d4"
                    />
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
    notificationItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#f1f5f9",
    },
    notificationRight: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
        justifyContent: "flex-end",
    },
    notificationIconContainer: {
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 20,
        marginLeft: 16,
    },
    notificationTextContainer: {
        flex: 1,
        alignItems: "flex-end",
    },
    notificationTitle: {
        fontSize: 16,
        fontFamily: FONT_MEDIUM,
        color: BLACK,
        textAlign: "right",
    },
    notificationSubtitle: {
        fontSize: 13,
        fontFamily: FONT_REGULAR,
        color: "#6b7280",
        textAlign: "right",
    },
    scheduleItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 16,
        paddingHorizontal: 20,
    },
    scheduleLeft: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    scheduleTextContainer: {
        flex: 1,
        alignItems: "flex-end",
        marginRight: 16,
    },
    scheduleTitle: {
        fontSize: 16,
        fontFamily: FONT_MEDIUM,
        color: BLACK,
        marginBottom: 2,
        textAlign: "right",
    },
    scheduleSubtitle: {
        fontSize: 13,
        fontFamily: FONT_REGULAR,
        color: "#6b7280",
        textAlign: "right",
    },
});
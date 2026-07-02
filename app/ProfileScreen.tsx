// ProfileScreen.tsx - Updated with avatar on the right
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import DigitalWalletScreen from "./DigitalWalletScreen";
import NotificationsScreen from "./NotificationsScreen";
import PersonalInfoScreen from "./PersonalInfoScreen";
import SecurityPrivacyScreen from "./SecurityPrivacyScreen";
import TermsConditionsScreen from "./TermsConditionsScreen";

const TEAL = "#01a736";
const BLACK = "#2e2f2e";
const MUTED = "#6b7280";
const SOFT_BG = "#f8fafc";
const CARD = "#ffffff";

const FONT_REGULAR = "Handicrafts-Regular";
const FONT_MEDIUM = "Handicrafts-SemiBold";
const FONT_BOLD = "Handicrafts-Bold";

type ProfileScreenId = "main" | "PersonalInfo" | "SecurityPrivacy" | "Notifications" | "DigitalWallet" | "TermsConditions";

interface ProfileScreenProps {
    navigation?: any;
}

export default function ProfileScreen({ navigation: parentNavigation }: ProfileScreenProps) {
    const [currentScreen, setCurrentScreen] = useState<ProfileScreenId>("main");
    const [navigationStack, setNavigationStack] = useState<ProfileScreenId[]>(["main"]);
    const router = useRouter();

    // Internal navigation object for profile screens
    const profileNavigation = {
        navigate: (screenName: ProfileScreenId) => {
            setCurrentScreen(screenName);
            setNavigationStack(prev => [...prev, screenName]);
        },
        goBack: () => {
            if (navigationStack.length > 1) {
                const newStack = [...navigationStack];
                newStack.pop(); // Remove current screen
                const previousScreen = newStack[newStack.length - 1];
                setNavigationStack(newStack);
                setCurrentScreen(previousScreen);
            }
        }
    };

    const profileItems = [
        {
            icon: "person",
            title: "معلوماتي الشخصية",
            navigationTarget: "PersonalInfo"
        },
        {
            icon: "security",
            title: "الأمان والخصوصية",
            navigationTarget: "SecurityPrivacy"
        },
        {
            icon: "notifications",
            title: "الإشعارات",
            navigationTarget: "Notifications"
        },
        {
            icon: "account-balance-wallet",
            title: "المحفظة الادخارية",
            navigationTarget: "DigitalWallet"
        },
        {
            icon: "description",
            title: "الشروط والأحكام",
            navigationTarget: "TermsConditions"
        },
    ];

    const handleMenuItemPress = (navigationTarget: string) => {
        profileNavigation.navigate(navigationTarget as ProfileScreenId);
    };

    const handleLogout = () => {
        Alert.alert(
            "تسجيل الخروج",
            "هل أنت متأكد من أنك تريد تسجيل الخروج؟",
            [
                {
                    text: "إلغاء",
                    style: "cancel",
                },
                {
                    text: "تسجيل الخروج",
                    style: "destructive",
                    onPress: () => {
                        console.log("User logged out");
                        router.replace("/getStarted");
                    },
                },
            ],
            { cancelable: true }
        );
    };

    // Render different screens based on currentScreen
    const renderScreen = () => {
        switch (currentScreen) {
            case "PersonalInfo":
                return <PersonalInfoScreen navigation={profileNavigation} />;

            case "SecurityPrivacy":
                return <SecurityPrivacyScreen navigation={profileNavigation} />;

            case "Notifications":
                return <NotificationsScreen navigation={profileNavigation} />;

            case "DigitalWallet":
                return <DigitalWalletScreen navigation={profileNavigation} />;

            case "TermsConditions":
                return <TermsConditionsScreen navigation={profileNavigation} />;

            case "main":
            default:
                return (
                    <View style={styles.container}>
                        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                            {/* Profile Info Card */}
                            <View style={styles.profileCard}>
                                <View style={styles.avatarContainer}>
                                    <MaterialIcons name="person" size={40} color="#ffffff" />
                                </View>
                                <View style={styles.profileInfo}>
                                    <Text style={styles.userName}>عبدالكريم الشهري</Text>
                                    <Text style={styles.userEmail}>abdulkareem@gmail.com</Text>
                                </View>
                            </View>

                            {/* Profile Menu Items */}
                            <View style={styles.menuContainer}>
                                {profileItems.map((item, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={[
                                            styles.menuItem,
                                            index === profileItems.length - 1 && styles.lastMenuItem
                                        ]}
                                        onPress={() => handleMenuItemPress(item.navigationTarget)}
                                    >
                                        {/* Arrow on the left */}
                                        <MaterialIcons name="chevron-left" size={24} color="#6b7280" />

                                        {/* Text content on the right */}
                                        <View style={styles.menuTextContainer}>
                                            <Text style={styles.menuTitle}>{item.title}</Text>
                                        </View>

                                        {/* Icon on the right */}
                                        <View style={styles.menuIconContainer}>
                                            <MaterialIcons
                                                name={item.icon as any}
                                                size={24}
                                                color="#01a736"
                                            />
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            {/* Logout Button */}
                            <TouchableOpacity
                                style={styles.logoutButton}
                                onPress={handleLogout}
                            >
                                <MaterialIcons name="logout" size={24} color="#ff4757" />
                                <Text style={styles.logoutText}>تسجيل الخروج</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                );
        }
    };

    return renderScreen();
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
        justifyContent: "space-between",
        paddingTop: 50,
        paddingBottom: 16,
        paddingHorizontal: 24,
        borderBottomWidth: 1,
        borderBottomColor: "#f1f5f9",
    },
    headerTitle: {
        fontSize: 20,
        fontFamily: FONT_BOLD,
        color: BLACK,
        textAlign: "center",
    },
    backButton: {
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
    },
    placeholder: {
        width: 40,
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
    },
    contentText: {
        fontSize: 18,
        fontFamily: FONT_MEDIUM,
        color: BLACK,
        textAlign: "center",
    },
    profileCard: {
        backgroundColor: "#ffffff",
        borderRadius: 16,
        padding: 24,
        marginTop: 24,
        flexDirection: "row-reverse", // Changed from "row" to "row-reverse"
        alignItems: "center",
        elevation: 2,
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    avatarContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: "#01a736",
        alignItems: "center",
        justifyContent: "center",
        marginLeft: 16, // Changed from marginRight to marginLeft
    },
    profileInfo: {
        flex: 1,
        alignItems: "flex-end",
    },
    userName: {
        fontSize: 18,
        fontFamily: FONT_BOLD,
        color: BLACK,
        marginBottom: 4,
        textAlign: "right",
        lineHeight: 30
    },
    userEmail: {
        fontSize: 14,
        fontFamily: FONT_REGULAR,
        color: "#6b7280",
        marginBottom: 2,
        textAlign: "right",
    },

    editButton: {
        width: 36,
        height: 36,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 18,
        backgroundColor: "#f0fdf4",
        marginLeft: 12,
    },
    menuContainer: {
        backgroundColor: "#ffffff",
        borderRadius: 16,
        marginTop: 24,
        elevation: 2,
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#f1f5f9",
    },
    lastMenuItem: {
        borderBottomWidth: 0,
    },
    menuItemLeft: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    menuIconContainer: {
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 20,
        backgroundColor: "#f0fdf4",
    },
    menuTextContainer: {
        flex: 1,
        alignItems: "flex-end",
    },
    menuTitle: {
        fontSize: 16,
        fontFamily: FONT_MEDIUM,
        color: BLACK,
        textAlign: "right",
        paddingRight: 10
    },
    logoutButton: {
        backgroundColor: "#ffffff",
        borderRadius: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 16,
        marginTop: 24,
        marginBottom: 40,
        elevation: 2,
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    logoutText: {
        fontSize: 16,
        fontFamily: FONT_MEDIUM,
        color: "#ff4757",
        marginLeft: 8,
    },
});
import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import InvestmentDashboard from "./InvestmentDashboard";
import OpportunitiesScreen from "./OpportunitiesScreen";
import ProfileScreen from "./ProfileScreen";

type TabId = "opportunities" | "investments" | "profile";

const TEAL = "#01a736";
const BLACK = "#2e2f2e";

const FONT_REGULAR = "Handicrafts-Regular";
const FONT_MEDIUM = "Handicrafts-SemiBold";
const FONT_BOLD = "Handicrafts-Bold";

interface NotificationPopupProps {
  visible: boolean;
  onClose: () => void;
  onAccept: () => void;
  onIgnore: () => void;
}

const NotificationPopup: React.FC<NotificationPopupProps> = ({
  visible,
  onClose,
  onAccept,
  onIgnore,
}) => (
  <Modal
    visible={visible}
    transparent={true}
    animationType="fade"
    onRequestClose={onClose}
  >
    <View style={styles.notificationOverlay}>
      <View style={styles.notificationContainer}>
        <View style={styles.notificationHeader}>
          <TouchableOpacity
            onPress={onClose}
            style={styles.notificationCloseButton}
          >
            <MaterialIcons name="close" size={24} color="#6b7280" />
          </TouchableOpacity>
          <View style={styles.notificationTitleContainer}>
            <Text style={styles.notificationTitle}>التنبيهات</Text>
          </View>
        </View>

        <View style={styles.notificationContent}>
          <View style={styles.notificationMessageContainer}>
            <MaterialIcons name="info" size={20} color={BLACK} />
            <Text style={styles.notificationMessage}>
              لاحظنا أن متوسط مشترياتك اليومية قد انخفض إلى النصف مؤخراً.
              نوصي بتعديل مستوى المخاطر من "متوسط" إلى "منخفض" لتحسين عوائدك
              بما يتناسب مع نمط استهلاكك الحالي
            </Text>
          </View>

          <View style={styles.notificationActions}>
            <TouchableOpacity
              style={styles.ignoreButton}
              onPress={onIgnore}
            >
              <Text style={styles.ignoreButtonText}>تجاهل التوصية</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.acceptButton}
              onPress={onAccept}
            >
              <Text style={styles.acceptButtonText}>قبول التغيير</Text>
              <MaterialIcons name="check" size={18} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  </Modal>
);

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabId>("investments");
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);

  const handleTabChange = (tab: TabId) => {
    setActiveTab(tab);
  };

  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "صباح الخير";
    if (hour < 18) return "مساء الخير";
    return "مساء الخير";
  };

  const handleNotificationPress = () => {
    setShowNotificationPopup(true);
  };

  const handleAcceptRiskChange = () => {
    // Logic to change risk level from medium to low
    console.log("Risk level changed to low");
    setShowNotificationPopup(false);
  };

  const handleIgnoreRiskChange = () => {
    // Logic to ignore the recommendation
    console.log("Risk change recommendation ignored");
    setShowNotificationPopup(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "investments":
        return (
          <View style={styles.container}>
            <View style={styles.welcomeHeader}>
              <View style={styles.welcomeContent}>
                <View style={styles.welcomeRow}>
                  <TouchableOpacity
                    style={styles.notificationIcon}
                    onPress={handleNotificationPress}
                  >
                    <MaterialIcons
                      name="notifications-none"
                      size={20}
                      color="#6b7280"
                    />
                    <View style={styles.notificationDot} />
                  </TouchableOpacity>
                  <Text style={styles.welcomeText}>{getWelcomeMessage()}</Text>
                </View>
                <Text style={styles.userName}>عبدالكريم الشهري</Text>
              </View>
            </View>

            {/* Dashboard Content */}
            <InvestmentDashboard />
          </View>
        );

      case "opportunities":
        return <OpportunitiesScreen />;

      case "profile":
        return <ProfileScreen />;

      default:
        return null;
    }
  };

  return (
    <View style={styles.mainContainer}>
      {/* Notification Popup */}
      <NotificationPopup
        visible={showNotificationPopup}
        onClose={() => setShowNotificationPopup(false)}
        onAccept={handleAcceptRiskChange}
        onIgnore={handleIgnoreRiskChange}
      />

      {/* Content */}
      {renderContent()}

      {/* Bottom Navigation */}
      <View style={styles.bottomNavigation}>
        {/* Opportunities Tab */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => handleTabChange("opportunities")}
          activeOpacity={0.7}
        >
          <View
            style={[
              styles.iconContainer,
              activeTab === "opportunities" && styles.activeIconContainer,
            ]}
          >
            <MaterialIcons
              name="business"
              size={24}
              color={activeTab === "opportunities" ? "#ffffff" : "#6b7280"}
            />
          </View>
          <Text
            style={[
              styles.navText,
              activeTab === "opportunities" && styles.activeNavText,
            ]}
          >
            مساعدي المالي
          </Text>
        </TouchableOpacity>

        {/* Investments Tab */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => handleTabChange("investments")}
          activeOpacity={0.7}
        >
          <View
            style={[
              styles.iconContainer,
              activeTab === "investments" && styles.activeIconContainer,
            ]}
          >
            <MaterialIcons
              name="trending-up"
              size={24}
              color={activeTab === "investments" ? "#ffffff" : "#6b7280"}
            />
          </View>
          <Text
            style={[
              styles.navText,
              activeTab === "investments" && styles.activeNavText,
            ]}
          >
            فكّتي
          </Text>
        </TouchableOpacity>

        {/* Profile Tab */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => handleTabChange("profile")}
          activeOpacity={0.7}
        >
          <View
            style={[
              styles.iconContainer,
              activeTab === "profile" && styles.activeIconContainer,
            ]}
          >
            <MaterialIcons
              name="person"
              size={24}
              color={activeTab === "profile" ? "#ffffff" : "#6b7280"}
            />
          </View>
          <Text
            style={[
              styles.navText,
              activeTab === "profile" && styles.activeNavText,
            ]}
          >
            حسابي الشخصي
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  welcomeHeader: {
    backgroundColor: "#ffffff",
    paddingTop: 25,
    paddingBottom: 40,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  welcomeText: {
    fontSize: 20,
    fontFamily: FONT_REGULAR,
    fontWeight: "400",
    color: "#6b7280",
    textAlign: "right",
    lineHeight: 25,
  },
  userName: {
    fontSize: 30,
    fontFamily: FONT_BOLD,
    fontWeight: "700",
    color: BLACK,
    textAlign: "right",
    lineHeight: 50,
  },
  welcomeContent: {
    alignItems: "flex-end",
  },
  welcomeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 1,
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f8fafc",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  notificationDot: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ff4757",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 70,
  },
  contentText: {
    fontSize: 18,
    fontFamily: FONT_MEDIUM,
    fontWeight: "500",
    color: BLACK,
    textAlign: "center",
  },
  // Notification Popup Styles
  notificationOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  notificationContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 0,
    width: "100%",
    maxWidth: 400,
    maxHeight: "70%",
  },
  notificationHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  notificationCloseButton: {
    padding: 4,
  },
  notificationTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "flex-end",
    marginRight: 16,
  },
  notificationTitle: {
    fontSize: 18,
    lineHeight: 24,
    fontFamily: FONT_BOLD,
    fontWeight: "700",
    color: BLACK,
    textAlign: "right",
    marginRight: 8,
  },
  notificationContent: {
    padding: 20,
  },
  notificationMessageContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#f3f4f6",
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  notificationMessage: {
    fontSize: 15,
    fontFamily: FONT_REGULAR,
    fontWeight: "400",
    color: BLACK,
    textAlign: "right",
    lineHeight: 24,
    flex: 1,
    marginRight: 12,
  },
  notificationActions: {
    flexDirection: "row",
    gap: 12,
  },
  acceptButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: TEAL,
    padding: 16,
    borderRadius: 12,
  },
  acceptButtonText: {
    fontSize: 16,
    fontFamily: FONT_BOLD,
    fontWeight: "700",
    color: "#ffffff",
    marginLeft: 8,
  },
  ignoreButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f1f5f9",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  ignoreButtonText: {
    fontSize: 16,
    fontFamily: FONT_MEDIUM,
    fontWeight: "500",
    color: "#64748b",
  },
  // Bottom Navigation
  bottomNavigation: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    flexDirection: "row",
    paddingTop: 8,
    paddingBottom: 20,
    paddingHorizontal: 24,
    elevation: 20,
    shadowColor: BLACK,
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    alignItems: "center",
    justifyContent: "space-around",
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
    paddingHorizontal: 12,
    flex: 1,
  },
  iconContainer: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    marginBottom: 4,
    backgroundColor: "#f8fafc",
  },
  activeIconContainer: {
    backgroundColor: TEAL,
    elevation: 4,
    shadowColor: TEAL,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  navText: {
    fontSize: 11,
    fontFamily: FONT_MEDIUM,
    fontWeight: "500",
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 20,
  },
  activeNavText: {
    color: TEAL,
    fontFamily: FONT_MEDIUM,
    fontWeight: "600",
  },
});
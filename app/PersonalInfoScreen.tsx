import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    Alert,
    ScrollView,
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

export default function PersonalInfoScreen({ navigation }: any) {
    const [formData, setFormData] = useState({
        fullName: "عبدالكريم الشهري",
        email: "abdulkareem@example.com",
        phone: "+966 50 123 4567",
        nationalId: "1234567890",
        dateOfBirth: "1990/05/15",
        address: "الرياض، المملكة العربية السعودية",
    });

    const [isEditing, setIsEditing] = useState(false);

    const handleSave = () => {
        Alert.alert("تم الحفظ", "تم حفظ التغييرات بنجاح");
        setIsEditing(false);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setFormData({
            fullName: "عبدالكريم الشهري",
            email: "abdulkareem@example.com",
            phone: "+966 50 123 4567",
            nationalId: "1234567890",
            dateOfBirth: "1990/05/15",
            address: "الرياض، المملكة العربية السعودية",
        });
    };

    const InfoField = ({ label, value, field, editable = true }: any) => (
        <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>{label}</Text>
            {isEditing && editable ? (
                <TextInput
                    style={styles.textInput}
                    value={value}
                    onChangeText={(text) => setFormData({ ...formData, [field]: text })}
                    textAlign="right"
                />
            ) : (
                <Text style={styles.fieldValue}>{value}</Text>
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <MaterialIcons name="arrow-back" size={20} color="#BLACK" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>معلوماتي</Text>
                <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => setIsEditing(!isEditing)}
                >
                    <MaterialIcons
                        name={isEditing ? "close" : "edit"}
                        size={22}
                        color="#01a736"
                    />
                </TouchableOpacity>
            </View>

            <ScrollView
                style={styles.content}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.avatarSection}>
                    <View style={styles.avatarContainer}>
                        <MaterialIcons name="person" size={50} color="#ffffff" />
                    </View>
                    {isEditing && (
                        <TouchableOpacity style={styles.changePhotoButton}>
                            <MaterialIcons name="camera-alt" size={20} color="#01a736" />
                            <Text style={styles.changePhotoText}>تغيير الصورة</Text>
                        </TouchableOpacity>
                    )}
                </View>

                <View style={styles.formContainer}>
                    <InfoField
                        label="الاسم الكامل"
                        value={formData.fullName}
                        field="fullName"
                    />
                    <InfoField
                        label="البريد الإلكتروني"
                        value={formData.email}
                        field="email"
                    />
                    <InfoField
                        label="رقم الهاتف"
                        value={formData.phone}
                        field="phone"
                    />
                    <InfoField
                        label="رقم الهوية الوطنية"
                        value={formData.nationalId}
                        field="nationalId"
                        editable={false}
                    />
                    <InfoField
                        label="تاريخ الميلاد"
                        value={formData.dateOfBirth}
                        field="dateOfBirth"
                        editable={false}
                    />
                    <InfoField
                        label="العنوان"
                        value={formData.address}
                        field="address"
                    />
                </View>

                {isEditing && (
                    <View style={styles.actionButtons}>
                        <TouchableOpacity
                            style={[styles.actionButton, styles.saveButton]}
                            onPress={handleSave}
                        >
                            <MaterialIcons name="check" size={20} color="#ffffff" />
                            <Text style={styles.saveButtonText}>حفظ التغييرات</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.actionButton, styles.cancelButton]}
                            onPress={handleCancel}
                        >
                            <MaterialIcons name="close" size={20} color="#6b7280" />
                            <Text style={styles.cancelButtonText}>إلغاء</Text>
                        </TouchableOpacity>
                    </View>
                )}

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
    editButton: {
        width: 32,
        height: 32,
        alignItems: "center",
        justifyContent: "center",
    },
    content: {
        flex: 1,
    },
    contentContainer: {
        flexGrow: 1,
        paddingHorizontal: 20,
        paddingBottom: 60,
    },
    avatarSection: {
        alignItems: "center",
        paddingVertical: 24,
    },
    avatarContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: "#01a736",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 16,
    },
    changePhotoButton: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: "#f0fdf4",
        borderRadius: 20,
    },
    changePhotoText: {
        fontSize: 14,
        fontFamily: FONT_MEDIUM,
        color: "#01a736",
        marginLeft: 8,
    },
    formContainer: {
        backgroundColor: "#ffffff",
        borderRadius: 16,
        padding: 20,
        elevation: 2,
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    fieldContainer: {
        marginBottom: 16,
    },
    fieldLabel: {
        fontSize: 14,
        fontFamily: FONT_MEDIUM,
        color: BLACK,
        marginBottom: 8,
        textAlign: "right",
    },
    fieldValue: {
        fontSize: 16,
        fontFamily: FONT_REGULAR,
        color: BLACK,
        textAlign: "right",
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: "#f9fafb",
        borderRadius: 8,
    },
    textInput: {
        fontSize: 16,
        fontFamily: FONT_REGULAR,
        color: BLACK,
        textAlign: "right",
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: "#ffffff",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#01a736",
    },
    actionButtons: {
        marginTop: 20,
        marginBottom: 10,
    },
    actionButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 16,
        borderRadius: 12,
        marginBottom: 12,
    },
    saveButton: {
        backgroundColor: "#01a736",
    },
    saveButtonText: {
        fontSize: 16,
        fontFamily: FONT_MEDIUM,
        color: "#ffffff",
        marginLeft: 8,
    },
    cancelButton: {
        backgroundColor: "#f9fafb",
        borderWidth: 1,
        borderColor: "#e5e7eb",
    },
    cancelButtonText: {
        fontSize: 16,
        fontFamily: FONT_MEDIUM,
        color: "#6b7280",
        marginLeft: 8,
    },
});
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import {
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

interface TermsConditionsScreenProps {
    navigation: {
        goBack: () => void;
    };
}

export default function TermsConditionsScreen({ navigation }: TermsConditionsScreenProps) {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={navigation.goBack}
                >
                    <MaterialIcons name="arrow-back" size={20} color={BLACK} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>الشروط والأحكام</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView
                style={styles.content}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>مقدمة</Text>
                    <Text style={styles.sectionText}>
                        مرحباً بك في تطبيق فكّتك. يهدف التطبيق إلى مساعدتك على تحويل الفكة الناتجة من مشترياتك اليومية إلى عادة ادخارية ذكية، من خلال أدوات تحليل الإنفاق، التدوير التلقائي، والتوصيات المالية المدعومة بالذكاء الاصطناعي. باستخدامك للتطبيق، فإنك توافق على الالتزام بهذه الشروط والأحكام.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>خدمة فكّتك</Text>
                    <Text style={styles.sectionText}>
                        يتيح لك تطبيق فكّتك تجميع مبالغ صغيرة من عمليات الشراء اليومية عن طريق تقريب قيمة العملية حسب الخيار الذي تحدده، مثل فكّة، فكّة خمس، أو فكّة عشر. يتم عرض المبالغ المتجمعة داخل محفظتك الادخارية، ويمكنك متابعة تقدمك نحو أهدافك المالية من خلال التطبيق.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>آلية عمل التدوير</Text>
                    <View style={styles.bulletPoints}>
                        <Text style={styles.bulletPoint}>• يتم احتساب الفكة بناءً على قيمة عملية الشراء وخيار التدوير المحدد من قبلك</Text>
                        <Text style={styles.bulletPoint}>• يمكنك تغيير خيار التدوير أو إيقافه في أي وقت من إعدادات التطبيق</Text>
                        <Text style={styles.bulletPoint}>• تظهر المبالغ المتجمعة في المحفظة الادخارية لمساعدتك على متابعة تقدمك</Text>
                        <Text style={styles.bulletPoint}>• قد يعرض التطبيق توقعات أسبوعية أو شهرية بناءً على نمط مشترياتك الحالي</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>المساعد المالي والتوصيات الذكية</Text>
                    <Text style={styles.sectionText}>
                        يستخدم فكّتك تقنيات الذكاء الاصطناعي لتحليل نمط إنفاقك وتقديم توصيات مالية مبسطة، مثل رفع مستوى الفكة، مراجعة بعض المصروفات المتكررة، أو اقتراح خطوات تساعدك على الوصول لهدفك بشكل أسرع. هذه التوصيات إرشادية ولا تُعد ضماناً لتحقيق نتيجة مالية محددة.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>الخيارات الاستثمارية منخفضة المخاطر</Text>
                    <Text style={styles.sectionText}>
                        قد يقترح التطبيق، بناءً على سلوكك المالي ورصيد الفكة المتجمع، توجيه جزء من رصيدك إلى خيارات استثمارية منخفضة المخاطر عبر شركاء ماليين مرخصين مثل مصرف الإنماء، وذلك بعد موافقتك الصريحة. الاستثمار ينطوي على مخاطر، وقد تختلف العوائد حسب طبيعة المنتج والظروف السوقية.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>المخاطر والتنبيه المالي</Text>
                    <Text style={styles.sectionText}>
                        لا يضمن تطبيق فكّتك تحقيق أرباح أو عوائد محددة. أي خيار استثماري يتم اختياره من قبل المستخدم يخضع للشروط الخاصة بالجهة المالية المقدمة للخدمة. ننصحك بمراجعة تفاصيل المنتج الاستثماري وفهم مستوى المخاطر قبل اتخاذ أي قرار.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>الخصوصية وحماية البيانات</Text>
                    <Text style={styles.sectionText}>
                        نلتزم بحماية خصوصيتك وبياناتك المالية. لا يتم استخدام بياناتك الخام لتدريب النموذج العام بشكل مباشر، بل تُستخدم لتحليل تجربتك داخل حسابك وتخصيص التوصيات، مع تطبيق مبادئ الموافقة الصريحة، تقليل البيانات، وحماية المعلومات وفق المتطلبات النظامية.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>ربط الحسابات والبطاقات</Text>
                    <Text style={styles.sectionText}>
                        قد يتطلب استخدام بعض خدمات فكّتك ربط حساب بنكي أو بطاقة دفع عبر قنوات آمنة ومصرح بها. لا يقوم التطبيق بتنفيذ أي عملية تدوير أو تحويل أو تفعيل لخطة إلا بعد موافقتك أو تفعيلك للخدمة من داخل التطبيق.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>إدارة الحساب</Text>
                    <Text style={styles.sectionText}>
                        يمكنك تعديل بياناتك، تغيير خيار التدوير، إيقاف جمع الفكة، أو إدارة المحفظة الادخارية من خلال إعدادات التطبيق. كما يمكنك مراجعة سجل الفكة والعمليات المرتبطة بها في أي وقت.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>المسؤولية</Text>
                    <Text style={styles.sectionText}>
                        نبذل قصارى جهدنا لضمان دقة المعلومات واستقرار الخدمة، إلا أننا لا نتحمل مسؤولية القرارات المالية التي يتخذها المستخدم بناءً على التوصيات الإرشادية، أو أي أثر ناتج عن أعطال تقنية، تأخر في الربط البنكي، أو ظروف خارجة عن سيطرتنا.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>تحديث الشروط</Text>
                    <Text style={styles.sectionText}>
                        نحتفظ بالحق في تحديث هذه الشروط والأحكام من وقت لآخر بما يتوافق مع تطوير خدمات فكّتك أو المتطلبات النظامية. سيتم إشعارك بأي تغييرات مهمة من خلال التطبيق أو وسائل التواصل المسجلة لديك.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>التواصل</Text>
                    <Text style={styles.sectionText}>
                        إذا كان لديك أي استفسار حول هذه الشروط والأحكام أو طريقة استخدام خدمات فكّتك، يمكنك التواصل معنا عبر خدمة العملاء داخل التطبيق أو عبر البريد الإلكتروني: support@fakatak.sa
                    </Text>
                </View>

                <View style={styles.lastUpdated}>
                    <Text style={styles.lastUpdatedText}>
                        آخر تحديث: يوليو 2026
                    </Text>
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
    section: {
        backgroundColor: "#ffffff",
        borderRadius: 12,
        padding: 20,
        marginTop: 16,
        elevation: 1,
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
    },
    sectionTitle: {
        fontSize: 18,
        fontFamily: FONT_BOLD,
        color: TEAL,
        marginBottom: 12,
        textAlign: "right",
    },
    sectionText: {
        fontSize: 16,
        fontFamily: FONT_REGULAR,
        color: BLACK,
        lineHeight: 24,
        textAlign: "right",
    },
    bulletPoints: {
        paddingRight: 8,
    },
    bulletPoint: {
        fontSize: 16,
        fontFamily: FONT_REGULAR,
        color: BLACK,
        lineHeight: 24,
        textAlign: "right",
        marginBottom: 8,
    },
    lastUpdated: {
        alignItems: "center",
        paddingVertical: 24,
        marginTop: 16,
    },
    lastUpdatedText: {
        fontSize: 14,
        fontFamily: FONT_REGULAR,
        color: "#6b7280",
        textAlign: "center",
    },
});
import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer';
import path from 'path';
import type { FollowUpContent } from '@/types';

// DragonScale brand — same dark/teal system as the live Copilot UI and the
// pitch deck (components/copilot/PitchDeck.tsx).
const BG = '#08090f';
const CARD = '#0e1018';
const BORDER = '#1c2030';
const TEAL = '#38d4a0';
const TEXT = '#e8f0f5';
const MUTED = '#8ea0b4';
const FAINT = '#5a6b80';
const LOGO_PATH = path.join(process.cwd(), 'public', 'dragonscale-logo.png');

const styles = StyleSheet.create({
  page: {
    backgroundColor: BG,
    fontFamily: 'Helvetica',
  },
  body: {
    padding: 48,
    paddingTop: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    paddingHorizontal: 48,
    marginBottom: 8,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  logo: {
    width: 100,
    height: 45, // matches the source lockup's 720:326 aspect ratio
  },
  label: {
    fontFamily: 'Courier-Bold',
    fontSize: 7,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: TEAL,
    marginBottom: 4,
  },
  clientName: {
    fontFamily: 'Helvetica-BoldOblique',
    fontSize: 20,
    color: TEXT,
    marginBottom: 2,
  },
  headerMeta: {
    fontSize: 9,
    color: MUTED,
  },
  consultantBlock: {
    alignItems: 'flex-end',
  },
  consultantName: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: TEXT,
    marginBottom: 2,
  },
  section: {
    marginBottom: 22,
  },
  sectionLabel: {
    fontFamily: 'Courier-Bold',
    fontSize: 7,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: TEAL,
    marginBottom: 6,
  },
  bodyText: {
    fontSize: 9.5,
    color: MUTED,
    lineHeight: 1.6,
  },
  bullet: {
    flexDirection: 'row',
    marginBottom: 4,
    paddingLeft: 4,
  },
  bulletDot: {
    fontSize: 9.5,
    color: TEAL,
    marginRight: 6,
    lineHeight: 1.6,
  },
  bulletText: {
    fontSize: 9.5,
    color: MUTED,
    lineHeight: 1.6,
    flex: 1,
  },
  divider: {
    borderBottom: `0.5pt solid ${BORDER}`,
    marginBottom: 20,
  },
  solutionCard: {
    backgroundColor: CARD,
    border: `0.75pt solid ${BORDER}`,
    borderRadius: 4,
    padding: 12,
    marginBottom: 10,
  },
  solutionHeadline: {
    fontFamily: 'Helvetica-BoldOblique',
    fontSize: 11,
    color: TEXT,
    marginBottom: 4,
  },
  solutionBody: {
    fontSize: 9,
    color: MUTED,
    lineHeight: 1.55,
  },
  pricingRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  pricingChip: {
    fontSize: 8,
    color: MUTED,
    border: `0.5pt solid ${BORDER}`,
    borderRadius: 3,
    paddingVertical: 3,
    paddingHorizontal: 7,
  },
  benefitChip: {
    fontSize: 8,
    color: TEAL,
    border: `0.5pt solid ${TEAL}`,
    borderRadius: 3,
    paddingVertical: 3,
    paddingHorizontal: 7,
  },
  investmentGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  investmentBox: {
    flex: 1,
    backgroundColor: CARD,
    border: `0.75pt solid ${BORDER}`,
    borderRadius: 4,
    padding: 12,
  },
  investmentLabel: {
    fontFamily: 'Courier-Bold',
    fontSize: 7,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: TEAL,
    marginBottom: 4,
  },
  investmentValue: {
    fontFamily: 'Helvetica-BoldOblique',
    fontSize: 13,
    color: TEXT,
  },
  investmentSub: {
    fontSize: 8,
    color: FAINT,
    marginTop: 2,
  },
  nextStep: {
    backgroundColor: CARD,
    border: `1pt solid ${TEAL}`,
    borderRadius: 4,
    padding: 14,
    marginTop: 8,
  },
  nextStepText: {
    fontSize: 9.5,
    color: TEXT,
    lineHeight: 1.6,
  },
  footer: {
    position: 'absolute',
    bottom: 32,
    left: 48,
    right: 48,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: `0.5pt solid ${BORDER}`,
    paddingTop: 10,
  },
  footerText: {
    fontSize: 8,
    color: FAINT,
  },
  footerBrand: {
    fontFamily: 'Courier-Bold',
    fontSize: 7,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: TEAL,
  },
  confidential: {
    fontFamily: 'Courier',
    fontSize: 7,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: FAINT,
  },
});

interface FollowUpPDFProps {
  content: FollowUpContent;
  clientName: string;
  consultantName: string;
  date: string;
}

export function FollowUpPDF({ content, clientName, consultantName, date: rawDate }: FollowUpPDFProps) {
  const date = new Date(rawDate).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <Document>
      <Page size="A4" style={styles.page}>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image src={LOGO_PATH} style={styles.logo} />
            <View>
              <Text style={styles.label}>Prepared for</Text>
              <Text style={styles.clientName}>{clientName || 'Client'}</Text>
              <Text style={styles.headerMeta}>{date}</Text>
            </View>
          </View>
          <View style={styles.consultantBlock}>
            <Text style={styles.label}>Submitted by</Text>
            <Text style={styles.consultantName}>{consultantName || 'Consultant'}</Text>
          </View>
        </View>

        <View style={styles.body}>

        {/* Our Understanding */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>// Our Understanding</Text>
          <Text style={styles.bodyText}>{content.understanding}</Text>
        </View>

        <View style={styles.divider} />

        {/* The Challenge */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>// The Challenge</Text>
          {content.challenges.map((c, i) => (
            <View key={i} style={styles.bullet}>
              <Text style={styles.bulletDot}>·</Text>
              <Text style={styles.bulletText}>
                <Text style={{ fontFamily: 'Helvetica-Bold', color: TEXT }}>{c.title}: </Text>
                {c.body}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.divider} />

        {/* The Solution */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>// The Solution</Text>
          {content.solutions.map((s, i) => (
            <View key={i} style={styles.solutionCard}>
              <Text style={styles.solutionHeadline}>{s.headline}</Text>
              {s.body && <Text style={styles.solutionBody}>{s.body}</Text>}
              <View style={styles.pricingRow}>
                {s.pricingTier && <Text style={styles.pricingChip}>{s.pricingTier}</Text>}
                {s.keyBenefit && <Text style={styles.benefitChip}>{s.keyBenefit}</Text>}
              </View>
            </View>
          ))}
        </View>

        <View style={styles.divider} />

        {/* Investment & Timeline */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>// Investment &amp; Timeline</Text>
          <View style={styles.investmentGrid}>
            <View style={styles.investmentBox}>
              <Text style={styles.investmentLabel}>Tier</Text>
              <Text style={styles.investmentValue}>{content.tier.label}</Text>
              <Text style={styles.investmentSub}>Best fit based on scope</Text>
            </View>
            <View style={styles.investmentBox}>
              <Text style={styles.investmentLabel}>Setup Investment</Text>
              <Text style={styles.investmentValue}>{content.tier.setup}</Text>
              <Text style={styles.investmentSub}>One-time implementation</Text>
            </View>
            <View style={styles.investmentBox}>
              <Text style={styles.investmentLabel}>Monthly</Text>
              <Text style={styles.investmentValue}>{content.tier.monthly}</Text>
              <Text style={styles.investmentSub}>Ongoing support &amp; optimization</Text>
            </View>
            <View style={styles.investmentBox}>
              <Text style={styles.investmentLabel}>Go-Live</Text>
              <Text style={styles.investmentValue}>{content.goLive}</Text>
              <Text style={styles.investmentSub}>From signed agreement</Text>
            </View>
          </View>

          <View style={styles.nextStep}>
            <Text style={styles.nextStepText}>{content.nextStep}</Text>
          </View>
        </View>

        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerBrand}>DragonScale</Text>
          <Text style={styles.footerText}>{consultantName} · {date}</Text>
          <Text style={styles.confidential}>Confidential</Text>
        </View>

      </Page>
    </Document>
  );
}

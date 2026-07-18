import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer';
import path from 'path';
import type { SessionDetail } from '@/lib/session';
import type { CopilotSuggestion } from '@/types';

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
  session: SessionDetail;
  suggestions: CopilotSuggestion[];
  clientName: string;
  consultantName: string;
}

export function FollowUpPDF({ session, suggestions, clientName, consultantName }: FollowUpPDFProps) {
  const date = new Date(session.created_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });

  const solutionSuggestions = suggestions.filter(s => s.type === 'solution' || s.type === 'workflow').slice(0, 3);
  const clientNeeds = session.summary_client_needs ?? [];
  const processes = session.current_state_map?.processes ?? [];
  const highPainAreas = processes.filter(p => p.opportunitySize === 'high' || p.painPoints.length > 0);

  const hasGrowth = solutionSuggestions.some(s => s.pricingTier?.toLowerCase().includes('growth'));
  const hasStarter = solutionSuggestions.some(s => s.pricingTier?.toLowerCase().includes('starter'));
  const tier = hasGrowth ? { label: 'Growth', setup: '$4,000–8,000', monthly: '$600/mo' }
    : hasStarter ? { label: 'Starter', setup: '$1,500–3,000', monthly: '$300/mo' }
    : null;

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
          {session.summary_tldr ? (
            <Text style={styles.bodyText}>{session.summary_tldr}</Text>
          ) : (
            <Text style={styles.bodyText}>Based on our discovery conversation, we have developed a clear picture of where your business stands today and where automation can create the most leverage.</Text>
          )}
        </View>

        <View style={styles.divider} />

        {/* The Challenge */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>// The Challenge</Text>
          {highPainAreas.length > 0 ? (
            highPainAreas.slice(0, 3).map((p, i) => (
              <View key={i} style={styles.bullet}>
                <Text style={styles.bulletDot}>·</Text>
                <Text style={styles.bulletText}>
                  <Text style={{ fontFamily: 'Helvetica-Bold', color: TEXT }}>{p.area}: </Text>
                  {p.currentState}{p.painPoints.length > 0 ? ` — ${p.painPoints[0]}` : ''}
                </Text>
              </View>
            ))
          ) : clientNeeds.length > 0 ? (
            clientNeeds.slice(0, 4).map((need, i) => (
              <View key={i} style={styles.bullet}>
                <Text style={styles.bulletDot}>·</Text>
                <Text style={styles.bulletText}>{need}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.bodyText}>Key operational challenges identified during our discovery conversation.</Text>
          )}
        </View>

        <View style={styles.divider} />

        {/* The Solution */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>// The Solution</Text>
          {solutionSuggestions.length > 0 ? (
            solutionSuggestions.map((s, i) => (
              <View key={i} style={styles.solutionCard}>
                <Text style={styles.solutionHeadline}>{s.headline}</Text>
                {s.proposedSolution && <Text style={styles.solutionBody}>{s.proposedSolution}</Text>}
                <View style={styles.pricingRow}>
                  {s.pricingTier && <Text style={styles.pricingChip}>{s.pricingTier}</Text>}
                  {s.keyBenefit && <Text style={styles.benefitChip}>{s.keyBenefit}</Text>}
                </View>
              </View>
            ))
          ) : (
            <View style={styles.solutionCard}>
              <Text style={styles.solutionHeadline}>Custom Automation Suite</Text>
              <Text style={styles.solutionBody}>Based on the processes discussed, we would design and implement an automation layer tailored to your team's workflows — reducing manual effort and ensuring nothing falls through the cracks.</Text>
            </View>
          )}
        </View>

        <View style={styles.divider} />

        {/* Investment & Timeline */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>// Investment &amp; Timeline</Text>
          {tier ? (
            <View style={styles.investmentGrid}>
              <View style={styles.investmentBox}>
                <Text style={styles.investmentLabel}>Tier</Text>
                <Text style={styles.investmentValue}>{tier.label}</Text>
                <Text style={styles.investmentSub}>Best fit based on scope</Text>
              </View>
              <View style={styles.investmentBox}>
                <Text style={styles.investmentLabel}>Setup Investment</Text>
                <Text style={styles.investmentValue}>{tier.setup}</Text>
                <Text style={styles.investmentSub}>One-time implementation</Text>
              </View>
              <View style={styles.investmentBox}>
                <Text style={styles.investmentLabel}>Monthly</Text>
                <Text style={styles.investmentValue}>{tier.monthly}</Text>
                <Text style={styles.investmentSub}>Ongoing support &amp; optimization</Text>
              </View>
              <View style={styles.investmentBox}>
                <Text style={styles.investmentLabel}>Go-Live</Text>
                <Text style={styles.investmentValue}>4 weeks</Text>
                <Text style={styles.investmentSub}>From signed agreement</Text>
              </View>
            </View>
          ) : (
            <View style={styles.investmentGrid}>
              <View style={styles.investmentBox}>
                <Text style={styles.investmentLabel}>Approach</Text>
                <Text style={styles.investmentValue}>Scoped after this call</Text>
                <Text style={styles.investmentSub}>Proposal delivered same day</Text>
              </View>
              <View style={styles.investmentBox}>
                <Text style={styles.investmentLabel}>Go-Live</Text>
                <Text style={styles.investmentValue}>4 weeks</Text>
                <Text style={styles.investmentSub}>From signed agreement</Text>
              </View>
            </View>
          )}

          <View style={styles.nextStep}>
            <Text style={styles.nextStepText}>
              Next step: 30-minute scoping call to confirm scope and finalize the proposal. I'll send a calendar link — or reply to this document with a time that works.
            </Text>
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

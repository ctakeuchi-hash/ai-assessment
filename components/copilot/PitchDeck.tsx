import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer';
import path from 'path';
import type { FollowUpContent } from '@/types';

// Same dark/teal system as the live Copilot UI and the branded one-pager —
// see components/copilot/FollowUpPDF.tsx.
const BG = '#08090f';
const CARD = '#0e1018';
const BORDER = '#1c2030';
const TEAL = '#38d4a0';
const TEXT = '#e8f0f5';
const MUTED = '#5a6b80';

const LOGO_PATH = path.join(process.cwd(), 'public', 'dragonscale-logo.png');

// 13.33x7.5in widescreen slide, in points (PDF's native unit).
const SLIDE = [960, 540] as [number, number];

const styles = StyleSheet.create({
  slide: {
    backgroundColor: BG,
    padding: 56,
    fontFamily: 'Helvetica',
  },
  eyebrow: {
    fontFamily: 'Courier-Bold',
    fontSize: 9,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: TEAL,
    marginBottom: 18,
  },
  headline: {
    fontFamily: 'Helvetica-BoldOblique',
    fontSize: 44,
    color: TEXT,
    marginBottom: 18,
    maxWidth: 640,
  },
  dot: { color: TEAL },
  subhead: {
    fontSize: 13,
    color: '#a8b8c8',
    lineHeight: 1.6,
    maxWidth: 560,
    marginBottom: 30,
  },
  cardRow: { flexDirection: 'row', gap: 16 },
  cardCol: { flexDirection: 'column', gap: 12 },
  card: {
    flex: 1,
    backgroundColor: CARD,
    border: `0.75pt solid ${BORDER}`,
    borderRadius: 4,
    padding: 18,
  },
  cardBadge: {
    fontFamily: 'Courier-Bold',
    fontSize: 9,
    color: TEAL,
    marginBottom: 8,
  },
  cardTitle: {
    fontFamily: 'Helvetica-BoldOblique',
    fontSize: 14,
    color: TEXT,
    marginBottom: 6,
  },
  cardBody: {
    fontSize: 9.5,
    color: '#8ea0b4',
    lineHeight: 1.55,
  },
  chipRow: { flexDirection: 'row', gap: 8, marginTop: 10 },
  chip: {
    fontSize: 8,
    color: TEAL,
    border: `0.5pt solid ${TEAL}`,
    borderRadius: 3,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  statValue: {
    fontFamily: 'Helvetica-BoldOblique',
    fontSize: 26,
    color: TEXT,
    marginTop: 4,
    marginBottom: 4,
  },
  statSub: {
    fontSize: 8.5,
    color: MUTED,
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 56,
    right: 56,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: `0.5pt solid ${BORDER}`,
    paddingTop: 12,
  },
  footerBrand: {
    fontFamily: 'Courier-Bold',
    fontSize: 8,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: TEAL,
  },
  footerMeta: {
    fontSize: 8,
    color: MUTED,
  },
  pageNum: {
    fontFamily: 'Courier',
    fontSize: 8,
    color: MUTED,
  },
  ctaBox: {
    backgroundColor: CARD,
    border: `1pt solid ${TEAL}`,
    borderRadius: 6,
    padding: 24,
    maxWidth: 620,
  },
  ctaText: {
    fontSize: 13,
    color: TEXT,
    lineHeight: 1.7,
  },
  logoSmall: { width: 84, height: 38 },
});

function Slide({
  n,
  eyebrow,
  headline,
  children,
  consultantName,
  date,
}: {
  n: number;
  eyebrow: string;
  headline: string;
  children: React.ReactNode;
  consultantName: string;
  date: string;
}) {
  return (
    <Page size={SLIDE} style={styles.slide}>
      <Text style={styles.eyebrow}>{eyebrow}</Text>
      <Text style={styles.headline}>
        {headline}
        <Text style={styles.dot}>.</Text>
      </Text>
      {children}
      <View style={styles.footer} fixed>
        <Text style={styles.footerBrand}>DragonScale</Text>
        <Text style={styles.footerMeta}>{consultantName} · {date}</Text>
        <Text style={styles.pageNum}>{String(n).padStart(2, '0')} / 04</Text>
      </View>
    </Page>
  );
}

interface PitchDeckProps {
  content: FollowUpContent;
  clientName: string;
  consultantName: string;
  date: string;
}

export function PitchDeck({ content, clientName, consultantName, date: rawDate }: PitchDeckProps) {
  const date = new Date(rawDate).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });
  const name = clientName || 'Client';
  const consultant = consultantName || 'Consultant';
  const { challenges, solutions, tier } = content;

  return (
    <Document>
      {/* 01 — Our Understanding & The Challenge */}
      <Slide n={1} eyebrow={`// Prepared for ${name}`} headline="Where things stand" consultantName={consultant} date={date}>
        <Text style={styles.subhead}>{content.understanding}</Text>
        <View style={styles.cardRow}>
          {challenges.map((c, i) => (
            <View key={i} style={styles.card}>
              <Text style={styles.cardBadge}>{String(i + 1).padStart(2, '0')}</Text>
              <Text style={styles.cardTitle}>{c.title}</Text>
              <Text style={styles.cardBody}>{c.body}</Text>
            </View>
          ))}
        </View>
      </Slide>

      {/* 02 — Solution Overview */}
      <Slide n={2} eyebrow="// The Solution" headline="Our recommendation" consultantName={consultant} date={date}>
        <View style={styles.cardRow}>
          {solutions.map((s, i) => (
            <View key={i} style={styles.card}>
              <Text style={styles.cardBadge}>{String(i + 1).padStart(2, '0')}</Text>
              <Text style={styles.cardTitle}>{s.headline}</Text>
              {s.body && <Text style={styles.cardBody}>{s.body}</Text>}
              <View style={styles.chipRow}>
                {s.pricingTier && <Text style={styles.chip}>{s.pricingTier}</Text>}
                {s.keyBenefit && <Text style={styles.chip}>{s.keyBenefit}</Text>}
              </View>
            </View>
          ))}
        </View>
      </Slide>

      {/* 03 — Investment & Timeline */}
      <Slide n={3} eyebrow="// Investment & Timeline" headline="Priced to fit" consultantName={consultant} date={date}>
        <View style={styles.cardRow}>
          <View style={styles.card}>
            <Text style={styles.cardBadge}>Tier</Text>
            <Text style={styles.statValue}>{tier.label}</Text>
            <Text style={styles.statSub}>Best fit based on scope</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardBadge}>Setup</Text>
            <Text style={styles.statValue}>{tier.setup}</Text>
            <Text style={styles.statSub}>One-time implementation</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardBadge}>Monthly</Text>
            <Text style={styles.statValue}>{tier.monthly}</Text>
            <Text style={styles.statSub}>Ongoing support &amp; optimization</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardBadge}>Go-Live</Text>
            <Text style={styles.statValue}>{content.goLive}</Text>
            <Text style={styles.statSub}>From signed agreement</Text>
          </View>
        </View>
      </Slide>

      {/* 04 — Next Steps */}
      <Slide n={4} eyebrow="// Next Steps" headline="Let's get started" consultantName={consultant} date={date}>
        <View style={styles.ctaBox}>
          <Text style={styles.ctaText}>{content.nextStep}</Text>
        </View>
        <View style={{ marginTop: 32 }}>
          <Image src={LOGO_PATH} style={styles.logoSmall} />
        </View>
      </Slide>
    </Document>
  );
}

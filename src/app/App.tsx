import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Signal,
  Battery,
  Wifi,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Phone,
  CheckCircle2,
  ArrowRight,
  Smartphone,
} from "lucide-react";

type Action = {
  key: string;
  label: string;
  goTo?: number;
};

type Screen = {
  id: number;
  title: string;
  trigger: string;
  badge: string;
  lines: string[];
  highlight: string | null;
  actions: Action[];
  isSMS?: boolean;
  isBranch?: boolean;
};

const screens: Screen[] = [
  // ── S1 ─────────────────────────────────────────────
  {
    id: 1,
    title: "Main Menu",
    trigger: "User dials *123#",
    badge: "Entry",
    lines: [
      "Welcome to MoMo",
      "──────────────────",
      "1. Airtime & Bundles",
      "2. Transfer Money",
      "3. Pay Bill",
      "4. Financial Services",
      "5. My Account",
      "",
      "[0] Exit",
    ],
    highlight: "4. Financial Services",
    actions: [{ key: "4", label: "Press 4 — Financial Services", goTo: 2 }],
  },
  // ── S2 ─────────────────────────────────────────────
  {
    id: 2,
    title: "Terms & Consent",
    trigger: "Press 4",
    badge: "KYC",
    lines: [
      "Bomba",
      "──────────────────",
      "Save and earn 12% p.a.",
      "",
      "To continue, you agree",
      "to share your MoMo",
      "profile with BCH.",
      "",
      "1. Accept & Register",
      "2. Learn More",
      "3. Decline",
    ],
    highlight: "1. Accept & Register",
    actions: [{ key: "1", label: "Press 1 — Accept & Register", goTo: 3 }],
  },
  // ── S3 ─────────────────────────────────────────────
  {
    id: 3,
    title: "Savings+ Dashboard",
    trigger: "Press 1 (Registered)",
    badge: "Dashboard",
    isBranch: true,
    lines: [
      "Bomba",
      "──────────────────",
      "1. Deposit",
      "2. Withdraw",
      "3. Balance & Interest",
      "4. My Statement",
      "5. Opt Out",
      "6. Rewards",
      "7. Give Feedback",
      "",
      "[00] Back",
    ],
    highlight: "1. Deposit",
    actions: [
      { key: "1", label: "Press 1 — Deposit", goTo: 4 },
      { key: "2", label: "Press 2 — Withdraw", goTo: 13 },
      { key: "3", label: "Press 3 — Balance & Interest", goTo: 11 },
      { key: "4", label: "Press 4 — My Statement", goTo: 16 },
      { key: "5", label: "Press 5 — Opt Out", goTo: 35 },
      { key: "6", label: "Press 6 — Rewards", goTo: 23 },
      { key: "7", label: "Press 7 — Give Feedback", goTo: 33 },
    ],
  },
  // ── S4 ─────────────────────────────────────────────
  {
    id: 4,
    title: "Savings Management",
    trigger: "Press 1 (Deposit)",
    badge: "Menu",
    lines: [
      "Savings Management",
      "──────────────────",
      "1. Start a New Savings",
      "2. View Existing Savings",
      "",
      "0. Back",
    ],
    highlight: "1. Start a New Savings",
    actions: [
      { key: "1", label: "Press 1 — Start a New Savings", goTo: 5 },
      { key: "2", label: "Press 2 — View Existing Savings", goTo: 12 },
    ],
  },
  // ── S5 ─────────────────────────────────────────────
  {
    id: 5,
    title: "Select Duration",
    trigger: "Press 1 (Start a New Savings)",
    badge: "Input",
    lines: [
      "Savings Duration",
      "──────────────────",
      "1. Select duration:",
      "2. 1 Week",
      "3. 1 Month",
      "4. 3 Months",
      "5. 6 Months",
      "6. 12 Months",
      "",
      "0. Back",
    ],
    highlight: "4. 3 Months",
    actions: [
      { key: "2", label: "Press 2 — 1 Week", goTo: 6 },
      { key: "3", label: "Press 3 — 1 Month", goTo: 6 },
      { key: "4", label: "Press 4 — 3 Months", goTo: 6 },
      { key: "5", label: "Press 5 — 6 Months", goTo: 6 },
      { key: "6", label: "Press 6 — 12 Months", goTo: 6 },
    ],
  },
  // ── S6 ─────────────────────────────────────────────
  {
    id: 6,
    title: "Enter Amount",
    trigger: "Press 1 (Submit duration)",
    badge: "Input",
    lines: [
      "Amount",
      "──────────────────",
      "Enter amount to deposit",
      "into your Savings+:",
      "",
      "(Min: 1,000 FCFA)",
      "",
      "[______]",
      "",
      "1. Submit",
      "0. Back",
    ],
    highlight: "1. Submit",
    actions: [{ key: "1", label: "Press 1 — Submit", goTo: 7 }],
  },
  // ── S7 ─────────────────────────────────────────────
  {
    id: 7,
    title: "Confirm Transaction",
    trigger: "Press 1 (Submit amount)",
    badge: "Confirm",
    lines: [
      "Confirm Deposit",
      "──────────────────",
      "Transfer amount:",
      "1,000 FCFA",
      "",
      "Rate: 5% p.a.",
      "Est. Earning: 3 FCFA",
      "",
      "1. Confirm",
      "2. Cancel",
    ],
    highlight: "1. Confirm",
    actions: [{ key: "1", label: "Press 1 — Confirm Deposit", goTo: 8 }],
  },
  // ── S8 ─────────────────────────────────────────────
  {
    id: 8,
    title: "Enter PIN",
    trigger: "Press 1 (Confirm)",
    badge: "Auth",
    lines: [
      "Enter PIN",
      "──────────────────",
      "Enter your MoMo PIN",
      "to authorize payment:",
      "",
      "[* * * * ]",
      "",
      "Request to Pay:",
      "1,000 FCFA",
      "",
      "1. Submit",
      "0. Back",
    ],
    highlight: "1. Submit",
    actions: [{ key: "****", label: "Enter PIN — Authorize", goTo: 9 }],
  },
  // ── S9 ─────────────────────────────────────────────
  {
    id: 9,
    title: "Transaction Confirmed",
    trigger: "PIN authorized",
    badge: "Success",
    lines: [
      "Transaction Confirmed",
      "──────────────────",
      "Your deposit of",
      "1,000 FCFA was",
      "successful.",
      "",
      "Ref: 998273645",
      "Date: 01/07/2026",
      "",
      "0. Back",
    ],
    highlight: "0. Back",
    actions: [{ key: "0", label: "Press 0 — Back", goTo: 3 }],
  },
  // ── S11 ────────────────────────────────────────────
  {
    id: 11,
    title: "Balance & Interest",
    trigger: "Press 3",
    badge: "Monitor",
    lines: [
      "Savings+ Balance",
      "──────────────────",
      "Total Capital:",
      "17,000 FCFA",
      "",
      "Total Interest Earned:",
      "320 FCFA",
      "",
      "Total Balance:",
      "17,320 FCFA",
      "",
      "1. View Savings Breakdown",
      "0. Back",
    ],
    highlight: "1. View Savings Breakdown",
    actions: [
      { key: "1", label: "Press 1 — View Savings Breakdown", goTo: 12 },
      { key: "0", label: "Press 0 — Back", goTo: 3 },
    ],
  },
  // ── S12 ────────────────────────────────────────────
  {
    id: 12,
    title: "Savings Breakdown",
    trigger: "Press 1 (View Savings Breakdown)",
    badge: "Monitor",
    lines: [
      "Savings Breakdown",
      "──────────────────",
      "[1] 3 Month - ends 09/01/26",
      "Capital: 5,000 FCFA",
      "Interest: 62 FCFA",
      "",
      "[2] 6 Month - ends 12/15/26",
      "Capital: 10,000 FCFA",
      "Interest: 250 FCFA",
      "",
      "[3] 1 Month - ends 06/12/26",
      "Capital: 2,000 FCFA",
      "Interest: 8 FCFA",
      "",
      "0. Back",
    ],
    highlight: null,
    actions: [{ key: "0", label: "Press 0 — Back", goTo: 11 }],
  },
  // ── S13 ────────────────────────────────────────────
  {
    id: 13,
    title: "Withdraw",
    trigger: "Press 2 (Withdraw)",
    badge: "Input",
    lines: [
      "Withdraw Funds",
      "──────────────────",
      "Enter amount to transfer",
      "back to your MoMo wallet:",
      "",
      "Available: 1,000 FCFA",
      "",
      "[______]",
      "",
      "1. Submit",
      "0. Back",
    ],
    highlight: "1. Submit",
    actions: [{ key: "1", label: "Press 1 — Submit", goTo: 14 }],
  },
  // ── S14 ────────────────────────────────────────────
  {
    id: 14,
    title: "Early Withdrawal Warning",
    trigger: "Press 1 (Submit amount)",
    badge: "Warning",
    lines: [
      "Early Withdrawal Alert",
      "──────────────────",
      "Your interest will drop",
      "from 7% to 2% p.a.",
      "",
      "Funds available after",
      "48-hour delay.",
      "",
      "Partial withdrawals",
      "allowed but subject to",
      "penalty & delay.",
      "",
      "1. Proceed",
      "0. Cancel",
    ],
    highlight: "1. Proceed",
    actions: [{ key: "1", label: "Press 1 — Proceed anyway", goTo: 15 }],
  },
  // ── S15 ────────────────────────────────────────────
  {
    id: 15,
    title: "Withdrawal Success",
    trigger: "Press 1 (Proceed)",
    badge: "Flash SMS",
    lines: [
      "Success!",
      "──────────────────",
      "Amount: 500 FCFA",
      "To: MoMo Wallet",
      "",
      "Interest penalty: -5%",
      "New rate: 2% p.a.",
      "",
      "Funds available in",
      "48 hours.",
      "",
      "0. Exit",
    ],
    highlight: "0. Exit",
    actions: [{ key: "0", label: "Press 0 — Exit", goTo: 1 }],
  },
  // ── S16 ────────────────────────────────────────────
  {
    id: 16,
    title: "My Statement",
    trigger: "Press 4 (My Statement)",
    badge: "Menu",
    lines: [
      "My Statement",
      "──────────────────",
      "1. Mini-Statement",
      "",
      "2. Get Statement by Email",
      "",
      "0. Back",
    ],
    highlight: null,
    actions: [
      { key: "1", label: "Press 1 — Mini-Statement", goTo: 17 },
      { key: "0", label: "Press 0 — Back", goTo: 3 },
      { key: "2", label: "Press 2 — Get Statement by Email", goTo: 18 },
    ],
  },
  // ── S17 ────────────────────────────────────────────
  {
    id: 17,
    title: "Mini-Statement",
    trigger: "Press 1 (Mini-Statement)",
    badge: "Monitor",
    lines: [
      "Mini-Statement",
      "──────────────────",
      "1. 24/06 Wth -FCFA50.00",
      "2. 25/06 Dep +FCFA200.00",
      "3. 28/06 Int +FCFA0.45",
      "4. 30/06 Wth -FCFA30.00",
      "5. 01/07 Dep +FCFA100.00",
      "",
      "Bal: FCFA422.45",
      "",
      "0. Back",
    ],
    highlight: "0. Back",
    actions: [{ key: "0", label: "Press 0 — Back", goTo: 16 }],
  },
  // ── S18 ────────────────────────────────────────────
  {
    id: 18,
    title: "Email Verification",
    trigger: "Press 2 (Get Statement by Email)",
    badge: "Auth",
    lines: [
      "Email Verification",
      "──────────────────",
      "Send statement to:",
      "John.Doe@gmail.com",
      "",
      "1. OK",
      "2. Edit Email",
      "",
      "0. Back",
    ],
    highlight: "1. OK",
    actions: [
      { key: "1", label: "Press 1 — OK", goTo: 20 },
      { key: "2", label: "Press 2 — Edit Email", goTo: 19 },
      { key: "0", label: "Press 0 — Back", goTo: 16 },
    ],
  },
  // ── S19 ────────────────────────────────────────────
  {
    id: 19,
    title: "Enter New Email",
    trigger: "Press 2 (Edit Email)",
    badge: "Input",
    lines: [
      "Update Email",
      "──────────────────",
      "Please enter your email",
      "address to receive",
      "your statement.",
      "",
      "[______@______.___]",
      "",
      "1. Submit",
      "0. Back",
    ],
    highlight: "1. Submit",
    actions: [
      { key: "1", label: "Press 1 — Submit", goTo: 18 },
      { key: "0", label: "Press 0 — Back", goTo: 18 },
    ],
  },
  // ── S20 ────────────────────────────────────────────
  {
    id: 20,
    title: "Period Selection",
    trigger: "Press 1 (OK)",
    badge: "Input",
    lines: [
      "Period Selection",
      "──────────────────",
      "Choose statement period:",
      "",
      "1. Last 30 Days",
      "2. Last 90 Days",
      "3. Custom Range",
      "",
      "0. Back",
    ],
    highlight: null,
    actions: [
      { key: "1", label: "Press 1 — Last 30 Days", goTo: 22 },
      { key: "2", label: "Press 2 — Last 90 Days", goTo: 22 },
      { key: "3", label: "Press 3 — Custom Range", goTo: 21 },
      { key: "0", label: "Press 0 — Back", goTo: 18 },
    ],
  },
  // ── S21 ────────────────────────────────────────────
  {
    id: 21,
    title: "Custom Date Range",
    trigger: "Press 3 (Custom Range)",
    badge: "Input",
    lines: [
      "Custom Range Date",
      "──────────────────",
      "Enter:",
      "",
      "Start date:",
      "[DD/MM/YYYY]",
      "",
      "End date:",
      "[DD/MM/YYYY]",
      "",
      "1. Submit",
      "0. Back",
    ],
    highlight: "1. Submit",
    actions: [
      { key: "1", label: "Press 1 — Submit dates", goTo: 22 },
      { key: "0", label: "Press 0 — Back", goTo: 20 },
    ],
  },
  // ── S22 ────────────────────────────────────────────
  {
    id: 22,
    title: "Statement Sent",
    trigger: "Press 1 (Submit period)",
    badge: "Flash SMS",
    isSMS: true,
    lines: [
      "Success!",
      "──────────────────",
      "Your full statement is",
      "being generated and will",
      "be sent to your email",
      "shortly.",
      "",
      "No fees applied.",
      "",
      "0. Exit",
    ],
    highlight: "0. Exit",
    actions: [{ key: "0", label: "Press 0 — Back", goTo: 3 }],
  },
  // ── S23 ────────────────────────────────────────────
  {
    id: 23,
    title: "Rewards",
    trigger: "Press 6 (Rewards)",
    badge: "Menu",
    lines: [
      "Rewards",
      "──────────────────",
      "Welcome to MoMo",
      "Savings+ Rewards.",
      "Please choose an option:",
      "",
      "1. Enter Referral Code",
      "   / MTN Number",
      "2. Invite a Friend",
      "",
      "0. Back",
    ],
    highlight: null,
    actions: [
      { key: "1", label: "Press 1 — Enter Referral Code / MTN Number", goTo: 24 },
      { key: "2", label: "Press 2 — Invite a Friend", goTo: 28 },
      { key: "0", label: "Press 0 — Back", goTo: 3 },
    ],
  },
  // ── S24 ────────────────────────────────────────────
  {
    id: 24,
    title: "Enter Referral Code",
    trigger: "Press 1 (Enter Referral Code)",
    badge: "Input",
    lines: [
      "Enter Referral Code",
      "──────────────────",
      "Enter the unique MTN",
      "MoMo Phone Number or",
      "Referral Code provided",
      "by the person who",
      "referred you to",
      "Bomba.",
      "",
      "[______]",
      "",
      "1. Submit",
      "0. Back",
    ],
    highlight: "1. Submit",
    actions: [
      { key: "1", label: "Press 1 — Submit (valid code)", goTo: 27 },
      { key: "1e", label: "Press 1 — Submit (invalid code)", goTo: 25 },
      { key: "1a", label: "Press 1 — Submit (already referred)", goTo: 26 },
      { key: "0", label: "Press 0 — Back", goTo: 23 },
    ],
  },
  // ── S25 ────────────────────────────────────────────
  {
    id: 25,
    title: "Code Not Valid",
    trigger: "Invalid code submitted",
    badge: "Warning",
    lines: [
      "Code Not Valid",
      "──────────────────",
      "The code you entered",
      "is not recognised.",
      "Please try again.",
      "",
      "[______]",
      "",
      "1. Submit",
      "0. Back",
    ],
    highlight: "1. Submit",
    actions: [
      { key: "1", label: "Press 1 — Submit again", goTo: 27 },
      { key: "0", label: "Press 0 — Back", goTo: 23 },
    ],
  },
  // ── S26 ────────────────────────────────────────────
  {
    id: 26,
    title: "Already Referred",
    trigger: "Submit (friend already referred)",
    badge: "Warning",
    lines: [
      "Fail",
      "──────────────────",
      "Friend has been already",
      "referred by someone else.",
      "",
      "1. Enter a New Friend",
      "0. Exit",
    ],
    highlight: "1. Enter a New Friend",
    actions: [
      { key: "1", label: "Press 1 — Enter a New Friend", goTo: 24 },
      { key: "0", label: "Press 0 — Back", goTo: 3 },
    ],
  },
  // ── S27 ────────────────────────────────────────────
  {
    id: 27,
    title: "Referral Confirmed",
    trigger: "Press 1 (Submit referral)",
    badge: "Flash SMS",
    isSMS: true,
    lines: [
      "Success!",
      "──────────────────",
      "Thank you, your referral",
      "details have been",
      "recorded.",
      "",
      "0. Exit",
    ],
    highlight: "0. Exit",
    actions: [{ key: "0", label: "Press 0 — Exit", goTo: 3 }],
  },
  // ── S28 ────────────────────────────────────────────
  {
    id: 28,
    title: "Invite a Friend",
    trigger: "Press 2 (Invite a Friend)",
    badge: "Input",
    lines: [
      "Invite Friends",
      "──────────────────",
      "Spread the word!",
      "Enter the mobile number",
      "of the friend you would",
      "like to invite to",
      "Bomba.",
      "",
      "[______]",
      "",
      "1. Submit",
      "0. Back",
    ],
    highlight: "1. Submit",
    actions: [
      { key: "1", label: "Press 1 — Submit", goTo: 29 },
      { key: "0", label: "Press 0 — Back", goTo: 23 },
    ],
  },
  // ── S29 ────────────────────────────────────────────
  {
    id: 29,
    title: "Invitation Sent",
    trigger: "Press 1 (Submit)",
    badge: "Flash SMS",
    isSMS: true,
    lines: [
      "Confirmation",
      "──────────────────",
      "Success! Your invitation",
      "has been sent. Thank you",
      "for growing the MoMo",
      "Savings+ community!",
      "",
      "0. Exit",
    ],
    highlight: "0. Exit",
    actions: [{ key: "0", label: "Press 0 — Back", goTo: 3 }],
  },
  // ── S35 ────────────────────────────────────────────
  {
    id: 35,
    title: "Opt Out",
    trigger: "Press 5 (Opt Out)",
    badge: "Warning",
    lines: [
      "Opt Out",
      "──────────────────",
      "Unsubscribe from Bomba?",
      "",
      "1. Submit",
      "0. Back",
    ],
    highlight: "1. Submit",
    actions: [
      { key: "1", label: "Press 1 — Submit", goTo: 36 },
      { key: "0", label: "Press 0 — Back", goTo: 3 },
    ],
  },
  // ── S36 ────────────────────────────────────────────
  {
    id: 36,
    title: "Opt Out Confirmed",
    trigger: "Press 1 (Submit opt-out)",
    badge: "Success",
    isSMS: true,
    lines: [
      "You have successfully",
      "unsubscribed from Bomba.",
      "",
      "We are sorry to see",
      "you go. Your account",
      "has been deactivated.",
      "",
      "0. Exit",
    ],
    highlight: "0. Exit",
    actions: [{ key: "0", label: "Press 0 — Exit", goTo: 1 }],
  },
  // ── S33 ────────────────────────────────────────────
  {
    id: 33,
    title: "Give Feedback",
    trigger: "Press 7 (Give Feedback)",
    badge: "Flash SMS",
    isSMS: true,
    lines: [
      "Give Feedback",
      "──────────────────",
      "A link to the survey",
      "has been sent to you",
      "via SMS. Please click",
      "the link to provide",
      "your feedback and help",
      "us improve Bomba.",
      "",
      "0. Back",
    ],
    highlight: "0. Back",
    actions: [{ key: "0", label: "Press 0 — Back", goTo: 3 }],
  },
  // ── S30 — Automated ────────────────────────────────
  {
    id: 30,
    title: "Congratulations",
    trigger: "Automated — on savings maturity",
    badge: "Flash SMS",
    isSMS: true,
    lines: [
      "Congratulations! Your Savings [3 Month - ID #001] has matured. You have earned 62 FCFA in interest. Your total balance of 5,062 FCFA is now available in your MTN MoMo account.",
    ],
    highlight: null,
    actions: [],
  },
  // ── S31 — Automated ────────────────────────────────
  {
    id: 31,
    title: "Re-invest Reminder",
    trigger: "Automated — after maturity notification",
    badge: "Flash SMS",
    isSMS: true,
    lines: [
      "To re-invest the funds into a new Savings, dial *123# and continue earning the higher 6% – 8% interest rate.",
    ],
    highlight: null,
    actions: [],
  },
  // ── S32 — Automated ────────────────────────────────
  {
    id: 32,
    title: "Friend Invite SMS",
    trigger: "Automated — sent to invited friend",
    badge: "Flash SMS",
    isSMS: true,
    lines: [
      "Your friend has invited",
      "you to start growing",
      "your money! Try MTN",
      "MoMo Savings today by",
      "dialing *123# and using",
      "referral code BOMBA-94X2",
      "to get started.",
    ],
    highlight: null,
    actions: [],
  },
  // ── S34 — Automated ────────────────────────────────
  {
    id: 34,
    title: "Feedback Request",
    trigger: "Automated — sent to active users",
    badge: "Flash SMS",
    isSMS: true,
    lines: [
      "Thanks for using MoMo",
      "Savings+! Got 1 min to",
      "help us improve?",
      "Share your feedback here:",
      "",
      "{link}",
    ],
    highlight: null,
    actions: [],
  },
];

// Colors
const BLUE = "#E4E8F0";
const YELLOW = "#000000";
const DARK_GREY = "#FFFFFF";
const GREEN = "#111111";
const LIGHT_GREEN = "#000000";

const BADGE_COLORS: Record<string, { bg: string; color: string }> = {
  Entry:      { bg: "#DBEAFE", color: "#1D4ED8" },
  Menu:       { bg: "#EDE9FE", color: "#6D28D9" },
  KYC:        { bg: "#FEF3C7", color: "#B45309" },
  Dashboard:  { bg: `${BLUE}1A`, color: "#1D3FA6" },
  Input:      { bg: "#ECFDF5", color: "#065F46" },
  Confirm:    { bg: "#DBEAFE", color: "#1D4ED8" },
  Monitor:    { bg: "#ECFDF5", color: "#065F46" },
  "Flash SMS":{ bg: "#F0FDF4", color: "#15803D" },
  Auth:       { bg: "#FEE2E2", color: "#B91C1C" },
  Warning:    { bg: "#FEF3C7", color: "#92400E" },
  Success:    { bg: "#DCFCE7", color: "#15803D" },
};

function StatusBar() {
  return (
    <div className="flex items-center justify-between px-4 pt-2 pb-1">
      <span className="text-[10px] font-mono" style={{ color: "#555" }}>12:34</span>
      <div className="flex items-center gap-1">
        <Signal size={10} style={{ color: "#555" }} />
        <Wifi size={10} style={{ color: "#555" }} />
        <Battery size={12} style={{ color: "#555" }} />
      </div>
    </div>
  );
}

function PhoneScreen({ screen, direction }: { screen: Screen; direction: number }) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={screen.id}
        initial={{ x: direction * 40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: direction * -40, opacity: 0 }}
        transition={{ duration: 0.22, ease: "easeInOut" }}
        className="flex-1 px-3 py-2 overflow-hidden"
      >
        {screen.isSMS ? (
          <div className="flex flex-col gap-2">
            {screen.lines.map((line, i) => (
              <div
                key={i}
                className="font-mono leading-relaxed"
                style={{
                  fontSize: i === 0 ? "14px" : "12px",
                  color: i === 0 ? LIGHT_GREEN : line.startsWith("──") ? "#4A5040" : GREEN,
                  fontWeight: i === 0 ? 700 : 400,
                  height: line === "" ? "8px" : undefined,
                }}
              >
                {line}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-[3px]">
            {screen.lines.map((line, i) => {
              const isTitle = i === 0;
              const isDivider = line.startsWith("──");
              const isEmpty = line === "";
              const isHighlighted = line === screen.highlight;

              if (isEmpty) return <div key={i} style={{ height: 8 }} />;

              return (
                <div
                  key={i}
                  className="font-mono leading-relaxed"
                  style={{
                    fontSize: isTitle ? "13px" : isDivider ? "10px" : "12px",
                    color: isDivider ? "#3A4030" : isTitle ? LIGHT_GREEN : isHighlighted ? YELLOW : GREEN,
                    fontWeight: isTitle ? 700 : isHighlighted ? 700 : 400,
                    background: isHighlighted ? BLUE : "transparent",
                    borderRadius: isHighlighted ? "4px" : undefined,
                    padding: isHighlighted ? "1px 4px" : undefined,
                    display: "block",
                  }}
                >
                  {line}
                </div>
              );
            })}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

function PhoneFrame({ screen, direction }: { screen: Screen; direction: number }) {
  return (
    <div className="relative w-[260px] select-none">
      <div
        className="relative rounded-[36px] overflow-hidden"
        style={{
          background: "linear-gradient(145deg, #3C4560, #1A2035)",
          padding: "3px",
          boxShadow: `0 0 0 1px rgba(255,255,255,0.08), 0 40px 80px rgba(29,63,166,0.25), 0 0 0 6px ${BLUE}15`,
        }}
      >
        <div
          className="rounded-[34px] overflow-hidden flex flex-col"
          style={{ background: "#FFFFFF", minHeight: "500px", border: "1px solid #E0E6F0" }}
        >
          <div className="flex justify-center pt-2 pb-1">
            <div className="w-20 h-5 rounded-full flex items-center justify-center" style={{ background: "#1A1D28" }}>
              <div className="w-2 h-2 rounded-full" style={{ background: "#141720" }} />
            </div>
          </div>

          <StatusBar />

          <div
            className="mx-3 mb-1 px-3 py-1.5 rounded-lg flex items-center justify-between"
            style={{ background: "rgba(29,63,166,0.05)", borderBottom: "1px solid rgba(29,63,166,0.08)" }}
          >
            <div className="flex items-center gap-2">
              <Phone size={9} style={{ color: "#9AA3B8" }} />
              <span className="text-[9px] font-mono tracking-widest uppercase" style={{ color: "#9AA3B8" }}>
                *123# · USSD
              </span>
            </div>
            {(() => {
              const b = BADGE_COLORS[screen.badge];
              return (
                <span
                  className="text-[8px] font-mono px-1.5 py-0.5 rounded"
                  style={{ background: b?.bg || "#eee", color: b?.color || "#333" }}
                >
                  {screen.badge}
                </span>
              );
            })()}
          </div>

          <PhoneScreen screen={screen} direction={direction} />

          <div className="h-6 flex justify-center items-end pb-1.5">
            <div className="w-16 h-1 rounded-full" style={{ background: "#D0D5E0" }} />
          </div>
        </div>
      </div>

      <div className="absolute right-[-4px] top-[100px] w-[4px] h-[40px] rounded-r-sm" style={{ background: "#3C4560" }} />
      <div className="absolute left-[-4px] top-[80px] w-[4px] h-[28px] rounded-l-sm" style={{ background: "#3C4560" }} />
      <div className="absolute left-[-4px] top-[118px] w-[4px] h-[28px] rounded-l-sm" style={{ background: "#3C4560" }} />
    </div>
  );
}

function ActionButtons({ screen, onGoTo }: { screen: Screen; onGoTo: (id: number) => void }) {
  if (screen.actions.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 mt-5">
        {screen.isSMS ? (
          <div className="flex items-center gap-2" style={{ color: GREEN }}>
            <CheckCircle2 size={16} />
            <span className="text-sm font-medium">Journey Complete</span>
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">End of this path</div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 mt-5 w-full max-w-[260px]">
      {screen.isBranch && (
        <div className="text-center text-xs text-muted-foreground mb-1 uppercase tracking-wider">
          Choose a path
        </div>
      )}
      {screen.actions.map((action, idx) => (
        <button
          key={`${action.key}-${idx}`}
          onClick={() => action.goTo && onGoTo(action.goTo)}
          className="group flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
          style={{ background: BLUE, color: YELLOW, border: "none" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#D0D8EC"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = BLUE; }}
        >
          <span className="font-mono text-xs opacity-50">[{action.key}]</span>
          <span className="flex-1 text-left">{action.label}</span>
          <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
        </button>
      ))}
    </div>
  );
}

function FlowNode({
  screen,
  isActive,
  onSelect,
  showRightArrow,
  showDownArrow,
}: {
  screen: Screen;
  isActive: boolean;
  onSelect: (id: number) => void;
  showRightArrow?: boolean;
  showDownArrow?: boolean;
}) {
  return (
    <div className="flex items-center">
      <div className="flex flex-col items-center">
        <button onClick={() => onSelect(screen.id)} className="group transition-all duration-200">
          <div
            className="w-[120px] rounded-xl px-3 py-2.5 text-left transition-all duration-200"
            style={{
              background: isActive ? "#1D3FA6" : "#F4F6FB",
              border: isActive ? "1.5px solid #1D3FA6" : "1.5px solid #E0E6F0",
              boxShadow: isActive ? "0 4px 18px rgba(29,63,166,0.2)" : "none",
            }}
          >
            <div className="flex items-center gap-1.5 mb-1">
              <span
                className="text-[9px] font-mono font-bold rounded px-1 py-0.5"
                style={{
                  background: isActive ? "rgba(255,204,0,0.2)" : "#E8EDF8",
                  color: isActive ? "#FFCC00" : "#6B7A9A",
                }}
              >
                S{screen.id}
              </span>
              {screen.isSMS && (
                <MessageSquare size={8} style={{ color: isActive ? "#FFCC00" : GREEN }} />
              )}
            </div>
            <div className="text-[10px] font-semibold leading-tight" style={{ color: isActive ? "#FFCC00" : "#0F1729" }}>
              {screen.title}
            </div>
            <div className="text-[9px] mt-0.5" style={{ color: isActive ? "rgba(255,204,0,0.7)" : "#6B7A9A" }}>
              {screen.trigger}
            </div>
          </div>
        </button>

        {showDownArrow && (
          <div className="flex flex-col items-center my-0.5">
            <div className="w-px h-3" style={{ background: "rgba(29,63,166,0.2)" }} />
            <div className="w-0 h-0" style={{ borderLeft: "4px solid transparent", borderRight: "4px solid transparent", borderTop: "5px solid rgba(29,63,166,0.25)" }} />
          </div>
        )}
      </div>

      {showRightArrow && (
        <div className="flex items-center mx-1">
          <div className="h-px w-4" style={{ background: "rgba(29,63,166,0.2)" }} />
          <div className="w-0 h-0" style={{ borderTop: "4px solid transparent", borderBottom: "4px solid transparent", borderLeft: "5px solid rgba(29,63,166,0.25)" }} />
        </div>
      )}
    </div>
  );
}

function JourneyMap({ currentId, onSelect }: { currentId: number; onSelect: (id: number) => void }) {
  const getScreen = (id: number) => screens.find((s) => s.id === id);
  const SafeNode = ({ id, showDownArrow, showRightArrow }: { id: number; showDownArrow?: boolean; showRightArrow?: boolean }) => {
    const s = getScreen(id);
    if (!s) return null;
    return <FlowNode screen={s} isActive={currentId === id} onSelect={onSelect} showDownArrow={showDownArrow} showRightArrow={showRightArrow} />;
  };;

  return (
    <div className="overflow-x-auto pb-4">
      {/* Main path: S1 → S2 → S3 */}
      <div className="flex items-start gap-0">
        {[1, 2, 3].map((id, i) => (
          <FlowNode key={id} screen={getScreen(id)} isActive={currentId === id} onSelect={onSelect} showRightArrow={i < 2} />
        ))}
        <div className="ml-1 flex flex-col gap-1 pt-0.5">
          <span className="text-[9px] font-mono uppercase tracking-widest" style={{ color: "rgba(29,63,166,0.4)" }}>
            ┬ branch
          </span>
        </div>
      </div>

      {/* Branch rows */}
      <div className="flex items-start mt-0 ml-[363px] gap-0">

        {/* Deposit branch: S4→S5→S6→S7→S8→S9→S10 */}
        <div className="flex flex-col items-center">
          <div className="w-px h-3 ml-[60px]" style={{ background: "rgba(29,63,166,0.15)" }} />
          <SafeNode id={4}  showDownArrow />
          <SafeNode id={5} showDownArrow />
          <SafeNode id={6} showDownArrow />
          <SafeNode id={7} showDownArrow />
          <SafeNode id={8} showDownArrow />
          <SafeNode id={9} />
        </div>

        {/* Balance branch: S11→S12 */}
        <div className="flex flex-col items-center ml-3">
          <div className="w-px h-3 ml-[60px]" style={{ background: "rgba(29,63,166,0.15)" }} />
          <SafeNode id={11} showDownArrow />
          <SafeNode id={12} />
        </div>

        {/* Statement branch: S16→S17→S18→S19→S20→S21→S22 */}
        <div className="flex flex-col items-center ml-3">
          <div className="w-px h-3 ml-[60px]" style={{ background: "rgba(29,63,166,0.15)" }} />
          <SafeNode id={16} showDownArrow />
          <SafeNode id={17} showDownArrow />
          <SafeNode id={18} showDownArrow />
          <SafeNode id={19} showDownArrow />
          <SafeNode id={20} showDownArrow />
          <SafeNode id={21} showDownArrow />
          <SafeNode id={22} />
        </div>

        {/* Rewards branch: S23→S24→S25→S26→S27→S28→S29 */}
        <div className="flex flex-col items-center ml-3">
          <div className="w-px h-3 ml-[60px]" style={{ background: "rgba(29,63,166,0.15)" }} />
          <SafeNode id={23} showDownArrow />
          <SafeNode id={24} showDownArrow />
          <SafeNode id={25} showDownArrow />
          <SafeNode id={26} showDownArrow />
          <SafeNode id={27} showDownArrow />
          <SafeNode id={28} showDownArrow />
          <SafeNode id={29} />
        </div>

        {/* Opt Out branch: S35 */}
        <div className="flex flex-col items-center ml-3">
          <div className="w-px h-3 ml-[60px]" style={{ background: "rgba(29,63,166,0.15)" }} />
          <SafeNode id={35} showDownArrow />
          <SafeNode id={36} />
        </div>

        {/* Feedback branch: S33 */}
        <div className="flex flex-col items-center ml-3">
          <div className="w-px h-3 ml-[60px]" style={{ background: "rgba(29,63,166,0.15)" }} />
          <SafeNode id={33} />
        </div>

        {/* Withdraw branch: S13→S14→S15 */}
        <div className="flex flex-col items-center ml-3">
          <div className="w-px h-3 ml-[60px]" style={{ background: "rgba(29,63,166,0.15)" }} />
          <SafeNode id={13} showDownArrow />
          <SafeNode id={14} showDownArrow />
          <SafeNode id={15} />
        </div>

      </div>

      {/* Automated notifications: S30 → S31 → S32 */}
      <div className="mt-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-px w-4" style={{ background: "rgba(29,63,166,0.25)" }} />
          <span className="text-[9px] font-mono uppercase tracking-widest" style={{ color: "#9AA3B8" }}>
            Automated Notification
          </span>
          <div className="h-px flex-1" style={{ background: "rgba(29,63,166,0.25)" }} />
        </div>
        <div className="flex items-start gap-0">
          <SafeNode id={30} showRightArrow />
          <SafeNode id={31} showRightArrow />
          <SafeNode id={32} showRightArrow />
          <SafeNode id={34} />
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-6 pl-1">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm" style={{ background: "#1D3FA6" }} />
          <span className="text-[10px] text-muted-foreground">Active screen</span>
        </div>
        <div className="flex items-center gap-1.5">
          <MessageSquare size={9} style={{ color: GREEN }} />
          <span className="text-[10px] text-muted-foreground">Flash SMS</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-px" style={{ background: "rgba(29,63,166,0.3)" }} />
          <span className="text-[10px] text-muted-foreground">Navigation path</span>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const current = screens[currentIndex];

  const goTo = (id: number) => {
    const idx = screens.findIndex((s) => s.id === id);
    if (idx !== -1) {
      setDirection(idx >= currentIndex ? 1 : -1);
      setCurrentIndex(idx);
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) { setDirection(-1); setCurrentIndex((i) => i - 1); }
  };

  const goNext = () => {
    if (currentIndex < screens.length - 1) { setDirection(1); setCurrentIndex((i) => i + 1); }
  };

  const progress = ((currentIndex + 1) / screens.length) * 100;
  const badge = BADGE_COLORS[current.badge];

  return (
    <div className="min-h-screen font-sans" style={{ background: "#ffffff", color: "#0F1729", fontFamily: "'Outfit', sans-serif" }}>
      {/* Header */}
      <header
        className="sticky top-0 z-10 flex items-center justify-between px-8 py-4"
        style={{ background: "rgba(255,255,255,0.9)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(0,0,0,0.07)" }}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#1D3FA6" }}>
            <Smartphone size={16} color="#FFCC00" />
          </div>
          <div>
            <h1 className="text-sm font-semibold tracking-tight" style={{ color: "#0F1729" }}>Bomba</h1>
            <p className="text-[10px]" style={{ color: "#6B7A9A" }}>Bomba · USSD User Journey</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs" style={{ color: "#6B7A9A" }}>
              Screen {currentIndex + 1}/{screens.length}
            </span>
            <div className="w-24 h-1.5 rounded-full overflow-hidden" style={{ background: "#E8EDF8" }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: "#1D3FA6" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={goPrev} disabled={currentIndex === 0}
              className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-150 disabled:opacity-30"
              style={{ background: "#EEF1F9", border: "1px solid #E0E6F0", color: "#1D3FA6" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "#DDE4F5")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "#EEF1F9")}
            >
              <ChevronLeft size={14} />
            </button>
            <button onClick={goNext} disabled={currentIndex === screens.length - 1}
              className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-150 disabled:opacity-30"
              style={{ background: "#EEF1F9", border: "1px solid #E0E6F0", color: "#1D3FA6" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "#DDE4F5")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "#EEF1F9")}
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </header>

      {/* Main layout */}
      <main className="flex flex-col lg:flex-row min-h-[calc(100vh-65px)]">
        {/* Left — phone simulator */}
        <div
          className="lg:w-[380px] flex-shrink-0 flex flex-col items-center justify-start pt-12 pb-8 px-8"
          style={{ borderRight: "1px solid rgba(0,0,0,0.06)", background: "#FAFBFF" }}
        >
          <div className="w-full max-w-[260px] mb-6">
            <div className="flex items-center gap-2 mb-1">
              <span
                className="text-[10px] font-mono px-2 py-0.5 rounded-md font-semibold"
                style={{ background: badge?.bg || "#eee", color: badge?.color || "#333" }}
              >
                {current.badge}
              </span>
              <span className="text-[10px] font-mono" style={{ color: "#6B7A9A" }}>
                Screen {current.id}
              </span>
            </div>
            <h2 className="text-lg font-semibold" style={{ color: "#0F1729" }}>{current.title}</h2>
            <p className="text-xs mt-0.5" style={{ color: "#6B7A9A" }}>{current.trigger}</p>
          </div>

          <PhoneFrame screen={current} direction={direction} />
          <ActionButtons screen={current} onGoTo={goTo} />
        </div>

        {/* Right — journey map + detail */}
        <div className="flex-1 pt-10 px-8 pb-8 overflow-auto">
          <div className="mb-5">
            <h3 className="text-sm font-semibold mb-1" style={{ color: "#0F1729" }}>Journey Flow</h3>
            <p className="text-xs" style={{ color: "#6B7A9A" }}>
              Click any screen to jump to it. Follow the happy path or explore branches.
            </p>
          </div>

          <JourneyMap currentId={current.id} onSelect={goTo} />

          {/* Detail card */}
          <div className="mt-8 rounded-2xl p-5" style={{ background: "#F4F6FB", border: "1px solid #E0E6F0" }}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-xs uppercase tracking-widest mb-1" style={{ color: "#6B7A9A" }}>Current Screen</div>
                <h3 className="text-base font-semibold" style={{ color: "#0F1729" }}>{current.title}</h3>
              </div>
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold"
                style={{ background: "#1D3FA6", color: "#FFCC00" }}
              >
                {current.id}
              </div>
            </div>

            <div className="rounded-xl p-4 font-mono text-xs leading-relaxed mb-4" style={{ background: "#FFFFFF", border: "1px solid #E0E6F0" }}>
              {current.lines.map((line, i) => (
                <div
                  key={i}
                  style={{
                    height: line === "" ? 8 : undefined,
                    color: line.startsWith("──") ? "#4A5040" : line === current.highlight ? YELLOW : i === 0 ? LIGHT_GREEN : GREEN,
                    fontWeight: line === current.highlight || i === 0 ? 700 : 400,
                    background: line === current.highlight ? BLUE : "transparent",
                    borderRadius: line === current.highlight ? "4px" : undefined,
                    padding: line === current.highlight ? "1px 4px" : undefined,
                    display: "block",
                  }}
                >
                  {line || " "}
                </div>
              ))}
            </div>

            {current.actions.length > 0 && (
              <div>
                <div className="text-[10px] uppercase tracking-widest mb-2" style={{ color: "#6B7A9A" }}>
                  Available actions
                </div>
                <div className="flex flex-col gap-1.5">
                  {current.actions.map((action, idx) => (
                    <button
                      key={`${action.key}-${idx}`}
                      onClick={() => action.goTo && goTo(action.goTo)}
                      className="flex items-center gap-2 text-xs text-left rounded-lg px-3 py-2 transition-all font-semibold"
                      style={{ background: "#1D3FA6", color: "#FFCC00", border: "none" }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "#163189")}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "#1D3FA6")}
                    >
                      <span className="font-mono text-[10px] px-1.5 py-0.5 rounded" style={{ background: "rgba(255,204,0,0.2)" }}>
                        {action.key}
                      </span>
                      <span>{action.label}</span>
                      <ChevronRight size={11} className="ml-auto opacity-70" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {current.actions.length === 0 && (
              <div className="flex items-center gap-2 text-xs rounded-lg px-3 py-2 font-medium" style={{ background: "#ECFDF5", color: "#15803D" }}>
                <CheckCircle2 size={12} />
                <span>
                  {current.isSMS ? "Flash SMS delivered — journey complete." : "Terminal screen — no further actions."}
                </span>
              </div>
            )}
          </div>

          <div className="mt-4 flex items-center gap-2 text-[10px]" style={{ color: "#C5CDE0" }}>
            <div className="w-1.5 h-1.5 rounded-full bg-current" />
            All screens designed within the 160-character USSD session limit
          </div>
        </div>
      </main>
    </div>
  );
}

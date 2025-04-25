"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ArrowLeft, Zap, User, Phone, Mail, MapPin, ChevronRight, Edit, LogOut, Battery, Calendar, X, Clock, CreditCard, DollarSign } from 'lucide-react';
import { db, auth } from "@/firebase";
import { ref, onValue} from "firebase/database";
import { format } from "date-fns";

/* ───────────────────────────────
   guarantee fresh HTML each render
───────────────────────────────── */
export const dynamic = "force-dynamic";

/* ─────────────────── Types ─────────────────── */
interface HistoryItem {
  id: string;
  date: string;          // already formatted
  amount: string;        // e.g. "₹299"
  plan: string;
  seconds: number;
  transactionId: string;
}

/* ─────────────────── Page ─────────────────── */
export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<"overview" | "payment">("overview");
  const [loading, setLoading]   = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [history,  setHistory]  = useState<HistoryItem[]>([]);
  const [total,    setTotal]    = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  /* ────── Fetch from Firebase once on mount ────── */
  useEffect(() => {
    const checkAuth = async () => {
      // Wait for auth to initialize
      await new Promise(resolve => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
          if (user) {
            setUserId(user.uid);
          }
          unsubscribe();
          resolve(true);
        });
      });
      
      // If no user is found after auth check, set loading to false
      if (!auth.currentUser) {
        setLoading(false);
        return;
      }
      
      // Get the current user ID
      const uid = auth.currentUser.uid;
      
      // Reference to the user data
      const userRef = ref(db, `users/${uid}`);
      
      // Listen for changes to the user data
      const unsubscribe = onValue(userRef, snap => {
        const data = snap.val();
        
        if (!data) {
          console.error("No user data found for ID:", uid);
          setLoading(false);
          return;
        }
        
        setUserData(data);
        
        /* pre-compute deterministic values */
        let runningTotal = 0;
        const historyData = data.history || {};
        
        const mapped: HistoryItem[] = Object.entries(historyData).map(
          ([id, it]: [string, any]) => {
            runningTotal += it.amount || 0;
            return {
              id,
              date: format(new Date(it.date), "dd MMM yyyy"),
              amount: `₹${it.amount}`,
              plan: it.plan,
              seconds: it.seconds,
              transactionId: it.transactionId,
            };
          }
        ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
        setHistory(mapped);
        setTotal(runningTotal);
        setLoading(false);
      }, (error) => {
        console.error("Error fetching user data:", error);
        setLoading(false);
      });
      
      return () => unsubscribe();
    };
    
    checkAuth();
  }, []);

  /* ────── Loading & "not found" states ────── */
  if (loading) {
    return (
      <Centered>
        <Spinner />
      </Centered>
    );
  }

  if (!userData) {
    return (
      <Centered>
        <div className="text-center">
          <p className="text-xl font-medium mb-4">User data not found</p>
          <p className="text-gray-600 mb-6">
            {userId ? 
              `No data found for user ID: ${userId}` : 
              "You are not logged in or your session has expired."}
          </p>
          <Link
            href="/"
            className="bg-[#00c853] text-white px-6 py-2 rounded-full"
          >
            Go to Home
          </Link>
        </div>
      </Centered>
    );
  }

  const memberSince = userData.createdAt ? 
    format(new Date(userData.createdAt), "dd MMM yyyy") : 
    "N/A";

  /* ────── Main UI ────── */
  return (
    <main className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero */}
      <section className="bg-gradient-to-r from-[#00c853]/90 to-[#00c853]/70 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <Avatar name={userData.name} />
            <ProfileStats
              name={userData.name}
              since={memberSince}
              total={total}
              count={history.length}
              openHistory={() => setShowModal(true)}
            />
          </div>
        </div>
      </section>

      {/* Tabs */}
      <Tabs active={activeTab} setActive={setActiveTab} />

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {activeTab === "overview" ? (
          <OverviewTab user={userData} history={history} total={total} />
        ) : (
          <PaymentTab history={history} />
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <h2 className="text-2xl font-bold mb-6">Payment History</h2>
          <HistoryTable rows={history} />
          {!history.length && <Empty />}
        </Modal>
      )}

      <Footer />
    </main>
  );
}

/* ─────────────────── Re-usable atoms ─────────────────── */
const Centered = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen flex items-center justify-center">
    {children}
  </div>
);

const Spinner = () => (
  <div className="w-12 h-12 border-4 border-[#00c853] border-t-transparent rounded-full animate-spin" />
);

/* ─────────────────── Header ─────────────────── */
const Header = () => (
  <header className="bg-white shadow-sm sticky top-0 z-50">
    <div className="container mx-auto px-4 py-4 flex items-center justify-between">
      <Link href="/" className="flex items-center">
        <ArrowLeft className="w-5 h-5 mr-2 text-gray-600" />
        <Logo />
        <span className="ml-2 text-sm uppercase tracking-wider font-medium">
          EV Energy
        </span>
      </Link>
      <button 
        onClick={() => auth.signOut()}
        className="text-[#00c853] hover:text-[#00c853]/80 transition-colors"
      >
        <LogOut className="w-5 h-5" />
      </button>
    </div>
  </header>
);

const Logo = () => (
  <div className="relative w-8 h-8 bg-[#00c853] rounded-full flex items-center justify-center">
    <Zap className="text-white w-5 h-5" />
  </div>
);

/* ─────────────────── Hero widgets ─────────────────── */
const Avatar = ({ name }: { name: string }) => (
  <div className="relative">
    <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden bg-white/20 backdrop-blur-sm border-4 border-white/30">
      <Image
        src="/placeholder.svg?height=200&width=200"
        alt={name}
        width={128}
        height={128}
        className="object-cover"
      />
    </div>
    <button className="absolute bottom-0 right-0 bg-white text-[#00c853] rounded-full p-1.5 shadow-md hover:bg-gray-100">
      <Edit className="w-4 h-4" />
    </button>
  </div>
);

const ProfileStats = ({
  name,
  since,
  total,
  count,
  openHistory,
}: {
  name: string;
  since: string;
  total: number;
  count: number;
  openHistory: () => void;
}) => (
  <div className="text-center md:text-left">
    <h1 className="text-2xl md:text-3xl font-bold">{name}</h1>
    <p className="text-white/80 mt-1">Member since {since}</p>

    <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-4">
      <Stat icon={Battery} title="Total Payments" value={`₹${total}`} />
      <Stat icon={Calendar} title="Transactions" value={count.toString()} />
      <button
        onClick={openHistory}
        className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 flex items-center hover:bg-white/20 transition-colors"
      >
        <CreditCard className="w-5 h-5 mr-2" />
        <p className="font-semibold">View History</p>
      </button>
    </div>
  </div>
);

const Stat = ({
  icon: Icon,
  title,
  value,
}: {
  icon: React.ElementType;
  title: string;
  value: string;
}) => (
  <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 flex items-center">
    <Icon className="w-5 h-5 mr-2" />
    <div>
      <p className="text-sm text-white/80">{title}</p>
      <p className="font-semibold">{value}</p>
    </div>
  </div>
);

/* ─────────────────── Tabs ─────────────────── */
const Tabs = ({
  active,
  setActive,
}: {
  active: "overview" | "payment";
  setActive: (t: "overview" | "payment") => void;
}) => (
  <div className="bg-white border-b sticky top-16 z-40">
    <div className="container mx-auto px-4 flex overflow-x-auto scrollbar-hide">
      {(["overview", "payment"] as const).map((t) => (
        <button
          key={t}
          onClick={() => setActive(t)}
          className={`px-4 py-4 font-medium text-sm whitespace-nowrap ${
            active === t
              ? "text-[#00c853] border-b-2 border-[#00c853]"
              : "text-gray-600 hover:text-[#00c853]/70"
          }`}
        >
          {t === "overview" ? "Overview" : "Payment History"}
        </button>
      ))}
    </div>
  </div>
);

/* ─────────────────── Overview Tab ─────────────────── */
const OverviewTab = ({
  user,
  history,
  total,
}: {
  user: any;
  history: HistoryItem[];
  total: number;
}) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {/* personal info */}
    <Card className="md:col-span-2">
      <SectionTitle>Personal Information</SectionTitle>
      <InfoRow icon={User} label="Full Name" value={user.name || "N/A"} />
      <InfoRow icon={Mail} label="Email" value={user.email || "N/A"} />
      <InfoRow icon={Phone} label="Phone" value={user.phone || "N/A"} />
      <InfoRow icon={MapPin} label="Address" value={user.address || "N/A"} />
      <EditLink />
    </Card>

    {/* recent */}
    <Card>
      <SectionTitle>Recent Activity</SectionTitle>
      <Recent history={history} />
      <ViewAllLink onClick={() => {}} />
    </Card>

    {/* summary */}
    <Card className="md:col-span-3">
      <SectionTitle>Payment Summary</SectionTitle>
      <Summary
        total={total}
        count={history.length}
        last={history.length ? history[0] : undefined}
      />
    </Card>
  </div>
);

/* ─────────────────── Payment Tab ─────────────────── */
const PaymentTab = ({ history }: { history: HistoryItem[] }) => (
  <Card>
    <SectionTitle>Payment History</SectionTitle>
    <HistoryTable rows={history} />
    {!history.length && <Empty />}
  </Card>
);

/* ─────────────────── Shared sub-components ─────────────────── */
const Card = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`bg-white rounded-xl shadow-sm overflow-hidden ${className}`}
  >
    <div className="p-6">{children}</div>
  </div>
);

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-xl font-bold mb-4">{children}</h2>
);

const InfoRow = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) => (
  <div className="flex items-start mb-4 last:mb-0">
    <Icon className="w-5 h-5 text-[#00c853] mt-0.5 mr-3 flex-shrink-0" />
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  </div>
);

const EditLink = () => (
  <button className="text-[#00c853] font-medium hover:text-[#00c853]/80 transition-colors flex items-center mt-6">
    Edit Information
    <ChevronRight className="w-4 h-4 ml-1" />
  </button>
);

const Recent = ({ history }: { history: HistoryItem[] }) => (
  <div className="space-y-4">
    {history.slice(0, 3).map((p) => (
      <div
        key={p.id}
        className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <div className="w-10 h-10 rounded-full bg-[#00c853]/10 flex items-center justify-center mr-3 flex-shrink-0">
          <Battery className="w-5 h-5 text-[#00c853]" />
        </div>
        <div className="flex-grow">
          <p className="font-medium">{p.plan}</p>
          <p className="text-sm text-gray-500">{p.date}</p>
        </div>
        <p className="font-medium">{p.amount}</p>
      </div>
    ))}
    {history.length === 0 && (
      <div className="text-center py-4">
        <p className="text-gray-500">No recent activity</p>
      </div>
    )}
  </div>
);

const ViewAllLink = ({ onClick }: { onClick: () => void }) => (
  <button 
    onClick={onClick}
    className="text-[#00c853] font-medium hover:text-[#00c853]/80 transition-colors flex items-center mt-4"
  >
    View All
    <ChevronRight className="w-4 h-4 ml-1" />
  </button>
);

const Summary = ({
  total,
  count,
  last,
}: {
  total: number;
  count: number;
  last?: HistoryItem;
}) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <SummaryCard
      icon={DollarSign}
      title="Total Spent"
      value={`₹${total}`}
      sub="Lifetime total"
    />
    <SummaryCard
      icon={Battery}
      title="Transactions"
      value={count.toString()}
      sub="Total sessions"
    />
    <SummaryCard
      icon={Clock}
      title="Last Payment"
      value={last ? last.amount : "₹0"}
      sub={last ? last.date : "No payments yet"}
    />
  </div>
);

const SummaryCard = ({
  icon: Icon,
  title,
  value,
  sub,
}: {
  icon: React.ElementType;
  title: string;
  value: string;
  sub: string;
}) => (
  <div className="bg-gray-50 rounded-xl p-6">
    <div className="flex items-center mb-4">
      <Icon className="w-10 h-10 text-[#00c853] p-2 bg-[#00c853]/10 rounded-full mr-3" />
      <h3 className="text-lg font-semibold">{title}</h3>
    </div>
    <p className="text-3xl font-bold">{value}</p>
    <p className="text-sm text-gray-500 mt-1">{sub}</p>
  </div>
);

const HistoryTable = ({ rows }: { rows: HistoryItem[] }) => (
  <div className="overflow-x-auto">
    <table className="w-full min-w-[600px]">
      <thead>
        <tr className="border-b">
          <Th>Transaction ID</Th>
          <Th>Date</Th>
          <Th>Plan</Th>
          <Th>Duration</Th>
          <Th>Amount</Th>
        </tr>
      </thead>
      <tbody>
        {rows.map((p) => (
          <tr
            key={p.id}
            className="border-b hover:bg-gray-50 transition-colors"
          >
            <Td>{p.transactionId}</Td>
            <Td>{p.date}</Td>
            <Td>{p.plan}</Td>
            <Td>{p.seconds} seconds</Td>
            <Td>{p.amount}</Td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const Th = ({ children }: { children: React.ReactNode }) => (
  <th className="text-left py-3 px-4 font-semibold text-gray-600">{children}</th>
);
const Td = ({ children }: { children: React.ReactNode }) => (
  <td className="py-4 px-4">{children}</td>
);

const Empty = () => (
  <div className="text-center py-8">
    <p className="text-gray-500">No payment history found</p>
  </div>
);

/* ─────────────────── Modal ─────────────────── */
const Modal = ({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white rounded-2xl shadow-lg p-6 max-w-3xl w-full max-h-[80vh] overflow-auto">
      <div className="flex justify-between items-center mb-6">
        {children}
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X className="w-6 h-6" />
        </button>
      </div>
    </div>
  </div>
);

/* ─────────────────── Footer ─────────────────── */
const Footer = () => (
  <footer className="bg-white border-t py-6 mt-8">
    <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
      <div className="flex items-center mb-4 md:mb-0">
        <Logo />
        <span className="text-sm font-medium ml-2">EV Energy</span>
      </div>
      <p className="text-gray-500 text-sm">
        © {new Date().getFullYear()} EV Energy. All rights reserved.
      </p>
    </div>
  </footer>
);

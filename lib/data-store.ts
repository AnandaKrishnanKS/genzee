import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";

export interface StoredClient {
  id: string;
  name: string;
  email: string;
  phone?: string;
  country?: string;
  timezone: string;
  language?: string;
  createdAt: string;
}

export interface StoredPayment {
  id: string;
  appointmentId: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  amountPaise: number;
  currency: string;
  status: "CREATED" | "AUTHORIZED" | "CAPTURED" | "FAILED" | "REFUNDED";
  isFreeSession: boolean;
  createdAt: string;
}

export interface StoredAppointment {
  id: string;
  reference: string;
  clientId: string;
  client: StoredClient;
  startTime: string; // ISO string UTC
  endTime: string;   // ISO string UTC
  clientTimezone: string;
  professionalTimezone: string;
  status: "PENDING_PAYMENT" | "CONFIRMED" | "COMPLETED" | "CANCELLED" | "RESCHEDULED" | "NO_SHOW";
  sessionType: string;
  intakeDescription: string;
  meetingLink?: string;
  meetingInstructions?: string;
  payment?: StoredPayment;
  createdAt: string;
}

export interface StoredAvailabilityRule {
  id: string;
  dayOfWeek: number; // 0=Sunday, 1=Monday ... 6=Saturday
  startTime: string; // "10:00"
  endTime: string;   // "18:00"
  isActive: boolean;
}

export interface StoredAvailabilityException {
  id: string;
  date: string; // "YYYY-MM-DD"
  isBlocked: boolean;
  reason?: string;
}

export interface StoredSettings {
  professionalTimezone: string;
  sessionDurationMinutes: number;
  bufferMinutes: number;
  bookingLeadMinutes: number;
  maxAdvanceDays: number;
}

interface DataStoreSchema {
  admin: {
    id: string;
    email: string;
    name: string;
    hashedPassword: string;
    role: string;
  };
  settings: StoredSettings;
  availabilityRules: StoredAvailabilityRule[];
  exceptions: StoredAvailabilityException[];
  appointments: StoredAppointment[];
  clients: StoredClient[];
}

const DATA_DIR = path.join(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "store.json");

function getInitialData(): DataStoreSchema {
  // Pre-hashed password for "AdminPassword123!"
  const hashedPassword = bcrypt.hashSync("AdminPassword123!", 10);

  const sampleClients: StoredClient[] = [
    {
      id: "cl_1",
      name: "Aanya Sharma",
      email: "aanya.sharma@example.com",
      phone: "+91 98201 12345",
      country: "India",
      timezone: "Asia/Kolkata",
      language: "English / Hindi",
      createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    },
    {
      id: "cl_2",
      name: "Kabir Mehta",
      email: "kabir.m@example.com",
      phone: "+91 97112 67890",
      country: "India",
      timezone: "Asia/Kolkata",
      language: "English",
      createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    },
    {
      id: "cl_3",
      name: "Rhea Sen",
      email: "rhea.sen@example.com",
      phone: "+91 99300 45678",
      country: "India",
      timezone: "Asia/Kolkata",
      language: "English",
      createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    },
  ];

  // Helper date for upcoming appointments
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split("T")[0];

  const dayAfter = new Date();
  dayAfter.setDate(dayAfter.getDate() + 2);
  const dayAfterStr = dayAfter.toISOString().split("T")[0];

  const sampleAppointments: StoredAppointment[] = [
    {
      id: "apt_1",
      reference: "GZ-2026-8941",
      clientId: "cl_1",
      client: sampleClients[0],
      startTime: `${tomorrowStr}T09:30:00.000Z`,
      endTime: `${tomorrowStr}T10:20:00.000Z`,
      clientTimezone: "Asia/Kolkata",
      professionalTimezone: "Asia/Kolkata",
      status: "CONFIRMED",
      sessionType: "ONLINE",
      meetingLink: "https://meet.google.com/abc-wxyz-qrs",
      meetingInstructions: "Please join 2 minutes before using earphones and a private room.",
      intakeDescription:
        "I've been feeling extremely overwhelmed with college transitions and recent career anxiety. Over the past few months, I find it hard to concentrate on my final semester projects because of intrusive thoughts about failure and letting my parents down. I frequently experience physical symptoms like a racing heart and shallow breathing whenever presentations are coming up. I also struggle with setting boundaries with friends, leading to emotional exhaustion. I'm hoping to understand healthier coping tools, learn cognitive restructuring, and develop sustainable emotional grounding habits.",
      payment: {
        id: "pay_1",
        appointmentId: "apt_1",
        razorpayOrderId: "order_Q918237192",
        razorpayPaymentId: "pay_Q819203810",
        amountPaise: 150000,
        currency: "INR",
        status: "CAPTURED",
        isFreeSession: false,
        createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
      },
      createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    },
    {
      id: "apt_2",
      reference: "GZ-2026-5319",
      clientId: "cl_2",
      client: sampleClients[1],
      startTime: `${dayAfterStr}T11:30:00.000Z`,
      endTime: `${dayAfterStr}T12:20:00.000Z`,
      clientTimezone: "Asia/Kolkata",
      professionalTimezone: "Asia/Kolkata",
      status: "CONFIRMED",
      sessionType: "ONLINE",
      meetingLink: "https://meet.google.com/def-uvwx-yza",
      intakeDescription:
        "Dealing with burnout from corporate tech work and acute perfectionism. I constantly feel an internal pressure that whatever I achieve isn't enough, which causes severe insomnia and dread on Sunday evenings. I have difficulty disconnecting after working hours. Would love to unpack where this chronic need for external validation stems from and learn how to practice self-compassion without feeling like I'm losing my drive.",
      payment: {
        id: "pay_2",
        appointmentId: "apt_2",
        razorpayOrderId: "order_M771928312",
        razorpayPaymentId: "pay_M992817261",
        amountPaise: 200000,
        currency: "INR",
        status: "CAPTURED",
        isFreeSession: false,
        createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      },
      createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    },
    {
      id: "apt_3",
      reference: "GZ-2026-1184",
      clientId: "cl_3",
      client: sampleClients[2],
      startTime: `${tomorrowStr}T13:00:00.000Z`,
      endTime: `${tomorrowStr}T13:50:00.000Z`,
      clientTimezone: "Asia/Kolkata",
      professionalTimezone: "Asia/Kolkata",
      status: "PENDING_PAYMENT",
      sessionType: "ONLINE",
      intakeDescription:
        "Navigating grief and relational difficulties following a major long-term friendship breakup. It has triggered old abandonment fears and social isolation. Looking for a safe, non-judgmental space to talk through these feelings, rebuild trust in my social circles, and understand relational attachment styles.",
      payment: {
        id: "pay_3",
        appointmentId: "apt_3",
        amountPaise: 100000,
        currency: "INR",
        status: "CREATED",
        isFreeSession: false,
        createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
      },
      createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    },
  ];

  return {
    admin: {
      id: "admin_1",
      email: "admin@genzeepsych.com",
      name: "Dr. Sarah Rao",
      hashedPassword,
      role: "SUPER_ADMIN",
    },
    settings: {
      professionalTimezone: "Asia/Kolkata",
      sessionDurationMinutes: 50,
      bufferMinutes: 10,
      bookingLeadMinutes: 120,
      maxAdvanceDays: 60,
    },
    availabilityRules: [
      { id: "rule_1", dayOfWeek: 1, startTime: "10:00", endTime: "18:00", isActive: true }, // Monday
      { id: "rule_2", dayOfWeek: 2, startTime: "10:00", endTime: "18:00", isActive: true }, // Tuesday
      { id: "rule_3", dayOfWeek: 3, startTime: "10:00", endTime: "18:00", isActive: true }, // Wednesday
      { id: "rule_4", dayOfWeek: 4, startTime: "10:00", endTime: "18:00", isActive: true }, // Thursday
      { id: "rule_5", dayOfWeek: 5, startTime: "10:00", endTime: "18:00", isActive: true }, // Friday
      { id: "rule_6", dayOfWeek: 6, startTime: "11:00", endTime: "16:00", isActive: true }, // Saturday
      { id: "rule_7", dayOfWeek: 0, startTime: "11:00", endTime: "15:00", isActive: false }, // Sunday off
    ],
    exceptions: [
      { id: "exc_1", date: "2026-10-25", isBlocked: true, reason: "National Holiday / Workshop" },
    ],
    appointments: sampleAppointments,
    clients: sampleClients,
  };
}

export function loadDataStore(): DataStoreSchema {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DATA_FILE)) {
    const initial = getInitialData();
    fs.writeFileSync(DATA_FILE, JSON.stringify(initial, null, 2), "utf-8");
    return initial;
  }

  try {
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading data store, resetting to initial:", err);
    const initial = getInitialData();
    fs.writeFileSync(DATA_FILE, JSON.stringify(initial, null, 2), "utf-8");
    return initial;
  }
}

export function saveDataStore(data: DataStoreSchema): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
}

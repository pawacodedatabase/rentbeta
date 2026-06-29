import { useEffect, useState } from "react";
import {
  Users,
  Home,
  ShieldCheck,
  MessageCircle,
} from "lucide-react";

import { supabase } from "../../superbase";
import StatCard from "./statCard";
import AdminBottomNav from "./bottomNav";

type Stats = {
  users: number;
  landlords: number;
  tenants: number;
  properties: number;
  verified: number;
  pending: number;
  conversations: number;
  messages: number;
};

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState<Stats>({
    users: 0,
    landlords: 0,
    tenants: 0,
    properties: 0,
    verified: 0,
    pending: 0,
    conversations: 0,
    messages: 0,
  });

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    setLoading(true);

    try {
      const [
        users,
        landlords,
        tenants,
        properties,
        verified,
        pending,
        conversations,
        messages,
      ] = await Promise.all([
        supabase
          .from("users")
          .select("*", {
            count: "exact",
            head: true,
          }),

        supabase
          .from("users")
          .select("*", {
            count: "exact",
            head: true,
          })
          .eq("role", "landlord"),

        supabase
          .from("users")
          .select("*", {
            count: "exact",
            head: true,
          })
          .eq("role", "tenant"),

        supabase
          .from("properties")
          .select("*", {
            count: "exact",
            head: true,
          }),

        supabase
          .from("users")
          .select("*", {
            count: "exact",
            head: true,
          })
          .eq("verified", true),

        supabase
          .from("verifications")
          .select("*", {
            count: "exact",
            head: true,
          })
          .eq("status", "pending"),

        supabase
          .from("conversations")
          .select("*", {
            count: "exact",
            head: true,
          }),

        supabase
          .from("messages")
          .select("*", {
            count: "exact",
            head: true,
          }),
      ]);

      setStats({
        users: users.count || 0,
        landlords: landlords.count || 0,
        tenants: tenants.count || 0,
        properties: properties.count || 0,
        verified: verified.count || 0,
        pending: pending.count || 0,
        conversations: conversations.count || 0,
        messages: messages.count || 0,
      });
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="text-center py-24 text-gray-500">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div>

      <div className="mb-8">

        <h1 className="text-3xl font-bold">
          Dashboard
        </h1>

        <p className="text-gray-500 mt-1">
          Welcome back, Admin.
        </p>

      </div>

      {/* TOP STATS */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        <StatCard
          title="Total Users"
          value={stats.users}
          icon={Users}
          color="bg-purple-600"
        />

        <StatCard
          title="Properties"
          value={stats.properties}
          icon={Home}
          color="bg-blue-600"
        />

        <StatCard
          title="Verified"
          value={stats.verified}
          icon={ShieldCheck}
          color="bg-green-600"
        />

        <StatCard
          title="Messages"
          value={stats.messages}
          icon={MessageCircle}
          color="bg-orange-500"
        />

      </div>

      {/* SECOND ROW */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-6">

        <div className="bg-white rounded-2xl p-6 shadow">

          <h3 className="text-gray-500">
            Landlords
          </h3>

          <h2 className="text-4xl font-bold mt-3">
            {stats.landlords}
          </h2>

        </div>

        <div className="bg-white rounded-2xl p-6 shadow">

          <h3 className="text-gray-500">
            Tenants
          </h3>

          <h2 className="text-4xl font-bold mt-3">
            {stats.tenants}
          </h2>

        </div>

        <div className="bg-white rounded-2xl p-6 shadow">

          <h3 className="text-gray-500">
            Pending Verification
          </h3>

          <h2 className="text-4xl font-bold mt-3 text-yellow-500">
            {stats.pending}
          </h2>

        </div>

        <div className="bg-white rounded-2xl p-6 shadow">

          <h3 className="text-gray-500">
            Conversations
          </h3>

          <h2 className="text-4xl font-bold mt-3">
            {stats.conversations}
          </h2>

        </div>

      </div>

      {/* QUICK ACTIONS */}

      {/* <div className="bg-white rounded-2xl shadow mt-8 p-8">

        <h2 className="text-xl font-semibold mb-6">
          Quick Actions
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">

          <button className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl py-4">
            Manage Users
          </button>

          <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-4">
            View Properties
          </button>

          <button className="bg-green-600 hover:bg-green-700 text-white rounded-xl py-4">
            Verify Users
          </button>

          <button className="bg-red-600 hover:bg-red-700 text-white rounded-xl py-4">
            Reports
          </button>

        </div>

      </div> */}
      < AdminBottomNav/>

    </div>
  );
}
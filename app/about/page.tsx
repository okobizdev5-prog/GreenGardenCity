import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/Navbar";
import { Trees, Eye, Flag } from "lucide-react";

export const metadata = {
  title: "About Us - Green Garden City",
  description: "Learn about the vision, mission, and the team driving Green Garden City's sustainable urban sanctuary.",
};

export const revalidate = 0;

export default async function AboutPage() {
  const dbTeam = await prisma.teamMember.findMany({
    orderBy: { createdAt: "desc" },
  });

  const staticFallbackTeam = [
    {
      id: "fallback-elena",
      name: "Elena Rostova",
      role: "Chief Architect",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuA-5j-OoHph2EcgnV4gBZzHeQl8Kv_IQAvmVRqumMPTfc1QXhYb2GGg3-eZMmnSor18iENaTixNDz3rZgvna3z6HnsBRWpZkzHwBKKEK7WrpII6ur31TO5p_qDPyITzfZRdToGzzpSTm7JySO_2C9oHA6T8sYmGcHW1c2K17QZzu5j3vTSjSTQu7R27E6wH-f6UaNwPJ8bm4Lh6dDXbm1xfAt3UrH538xz0mmGlwHZzYrNfNBjVpJqf",
    },
    {
      id: "fallback-marcus",
      name: "Marcus Vance",
      role: "Head of Urban Planning",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDEnHDM4kLQ-LRWxSrbt-NlRXi9aWCZs1dUKxlQRLY2grhZIgr8Ax_reSMzqGcddOM8Vlok7bkOQyluweQGUbqtw7HchkFTXz7Z9JSp0PfReAm_a3UTGRiyp4VAc6edU_6dT9BNcqgKauMU8aon9sbYiLPrl_V7MtMBuV5id8adGA-2BmuQKxvtH21RgU87eC0JttW9NMEwC42jl3aj5S0-RVn8p_Dwvcq-YqTm6wkBqRpKmz2wEFlD",
    },
    {
      id: "fallback-sarah",
      name: "Sarah Lin",
      role: "Sustainability Director",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAWyAl_HzHqQgzFOeqvgHwKe5VeGKgjmOk-B4SJwdehkhN7QWwT5rouJhio3w8yubj0BpOSahcGEQGLBMGJpW5spMeeFrd8Pvr6Yr2PqhjpjTivnPCxexPA7KOJHc_vM4rnGhSWtZIUPdztU9tLnAWuQ_0fPXYBptx7JyRcCNnzL9-Vn_a6LY1lhqSpHK8uqDjBYmrsuiM8tPesMfMa2p00Imj17C1dWAPBarpIsIjse3_6Gl-4kIoP",
    },
    {
      id: "fallback-david",
      name: "David Chen",
      role: "Community Liaison",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCE456CpiUbqNuFkVu5X-l5FJKC-Aj93Q6h9UtxMH2Da92Mo3ikhJfiPyCIxQm-KA1hkJWcgj7VKYz3ecXdkNWXadsOtpodF8N0lnVL_cjE4_M8qQAm78tHGxQM6NKPbDLxUpNq-b7c2xp37ZkcQow1CnS98GiJGYClHA07ZmmWf6WeApirs-9-pgneiAJBjTYu8ELtUNXqDMfL_ICZCiUlvkbw04Hr2l1AsD6Wv-eIuY9iEWmlDsxF",
    },
  ];

  const team = dbTeam.length > 0 ? dbTeam : staticFallbackTeam;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar />

      {/* Hero Section */}
      <section 
        className="relative min-h-[50vh] flex items-center justify-center pt-24 pb-16 overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA1PYlawwaWQ6BnscZcA6FTqPTvIypfpYcGOrvkkuRFJqu39zS-TyDg82FG3QmhFshslcjbTNof0e-_KcopQdvWGTT0BT5aagfWOx3xEDH-ws3_WgRREoIjMUbQl9OffJ0i35ZCvLs3imguAqjnZdTPfwXJ3hZgUd40VEJxXVaSLtoIP7KaLWO6SDNlSye4_zLa_RkKra7qr_XPR0GEdM27C4e5IHLLKScgHwJBCvs_3mdRHh2eAQwz')" }}
      >
        <div className="absolute inset-0 bg-green-950/70 z-0"></div>

        <div className="container mx-auto px-4 md:px-8 relative z-10 text-white text-center max-w-4xl space-y-6">
          <span className="bg-green-800/80 text-green-200 border border-green-700/50 backdrop-blur-md font-semibold text-xs px-4 py-1.5 rounded-full uppercase tracking-wider">
            Urban Living, Naturally
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
            Cultivating the Future of Living
          </h1>
          <p className="text-lg md:text-xl text-gray-200 font-light max-w-2xl mx-auto leading-relaxed">
            Discover the philosophy behind Green Garden City. We aren't just building homes; we are designing an integrated ecosystem where community, nature, and modern convenience thrive in perfect harmony.
          </p>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl space-y-24">
          
          {/* Vision */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-green-50 text-green-700 flex items-center justify-center">
                  <Eye className="h-6 w-6" />
                </div>
                <h2 className="text-3xl font-extrabold text-green-900 tracking-tight">Our Vision</h2>
              </div>
              <p className="text-gray-600 text-lg leading-relaxed font-light">
                To redefine urban living by seamlessly integrating sustainable architecture with lush, organic landscapes. We envision a sanctuary where every resident wakes up to pristine air, surrounded by the restorative power of nature, without compromising on premium amenities.
              </p>
            </div>
            <div className="lg:col-span-7">
              <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100">
                <img 
                  className="w-full h-auto object-cover aspect-video hover:scale-102 transition duration-500" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC5UK7mM-0-1KdYatxci2uyS9N96dlQQatdCc1JSkGtgzoETI9I6cn9OmxZMOEp2w_SCEtLYn08MTStFCLE4K9R1KJw3kakboMld-xyRbcgtNiaw5AxLYKD9p0-8Wtuotp2ASo5ndqFEkZ_bDiliGYSM1hWCyfcdzLUuWB3irTMcoQP26eVHkr12zUJ-jgk09c8DRcTqDWp444_u-l7sg43ag5nbVrgaCXhGMpTBQE7qaCKI3HRCwFU" 
                  alt="Vision representation" 
                />
              </div>
            </div>
          </div>

          {/* Mission */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 order-2 lg:order-1">
              <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-green-700/10 to-transparent pointer-events-none"></div>
                <img 
                  className="w-full h-auto object-cover aspect-video hover:scale-102 transition duration-500" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuA3dzp5h453WXoTEtPX3YvTZ9mMzRDQpkyPf72sq5I7_gLKSp9o3KAvftjD7ipc34ZrqIlMTDTlSBnEA1URNoqjT9TbRFQmHm2HECxRotrHapk5m8uBtlPX1z_rnHxPvpu83v6e1rQd0-hY_XLRwMcgOIFeZaUUyPhCwnKYYtOmPNjC6ioLMI0578azNsRyIM2v89UQ_XiCqt75jgCtZ9HyUcr8jviax_5o2Wg_Jy81SzirZM8wnF_o" 
                  alt="Mission representation" 
                />
              </div>
            </div>
            <div className="lg:col-span-5 order-1 lg:order-2 space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-green-50 text-green-700 flex items-center justify-center">
                  <Flag className="h-6 w-6" />
                </div>
                <h2 className="text-3xl font-extrabold text-green-900 tracking-tight">Our Mission</h2>
              </div>
              <p className="text-gray-600 text-lg leading-relaxed font-light">
                To develop meticulously planned environments that prioritize ecological balance and human well-being. We are committed to utilizing innovative green technologies, preserving natural topography, and fostering vibrant communities that stand the test of time.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Team Bento Grid */}
      <section className="bg-green-50/40 py-20 border-t border-b border-green-950/5">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl font-extrabold text-green-900 tracking-tight">Meet the Minds Behind the Green</h2>
            <p className="text-gray-500 font-medium text-sm leading-relaxed">
              Our diverse team of urban planners, environmental architects, and community builders are dedicated to realizing the vision of Green Garden City.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div 
                key={member.id || index}
                className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                <div className="h-72 overflow-hidden bg-gray-100 relative">
                  {member.imageUrl ? (
                    <img 
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
                      src={member.imageUrl} 
                      alt={member.name} 
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
                      <Trees className="h-16 w-16 mb-2" />
                      <span className="text-xs font-semibold uppercase tracking-wider">Eco Planner</span>
                    </div>
                  )}
                </div>
                <div className="p-6 text-center space-y-1 flex-1 flex flex-col justify-center">
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-green-800 transition">
                    {member.name}
                  </h3>
                  <p className="text-sm font-semibold text-green-700">
                    {member.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-950 text-gray-300 pt-16 pb-8 border-t border-green-900">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl grid grid-cols-1 md:grid-cols-3 items-center gap-8 mb-12">
          <div className="text-xl font-bold text-white tracking-wide">Green Garden City</div>
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <a href="#" className="hover:text-amber-400 transition">Privacy Policy</a>
            <a href="#" className="hover:text-amber-400 transition">Terms of Service</a>
            <a href="/contact" className="hover:text-amber-400 transition">Contact Us</a>
          </div>
          <div className="text-sm text-center md:text-right text-green-100/50">
            &copy; {new Date().getFullYear()} Green Garden City. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

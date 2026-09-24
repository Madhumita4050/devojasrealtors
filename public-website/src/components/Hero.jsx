import { useNavigate } from 'react-router-dom';
import { ArrowRight, Leaf, MapPin, ShieldCheck, TrendingUp } from 'lucide-react';

const trustPoints = [
  {
    icon: ShieldCheck,
    title: 'RERA Approved',
    subtitle: 'Safe Investment',
  },
  {
    icon: MapPin,
    title: 'Prime Locations',
    subtitle: 'Better Connectivity',
  },
  {
    icon: TrendingUp,
    title: 'High Appreciation',
    subtitle: 'Stronger Tomorrow',
  },
  {
    icon: Leaf,
    title: 'Green & Peaceful',
    subtitle: 'For a Healthier Life',
  },
];

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[720px] overflow-hidden bg-[#f7d796] pt-24 sm:min-h-[760px] lg:min-h-screen">
      <div className="absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-[62%] bg-[linear-gradient(180deg,#8dc5ee_0%,#d9ecf8_42%,#ffe1a4_100%)]" />
        <div className="absolute right-[13%] top-[43%] h-28 w-28 rounded-full bg-[#ffd15e] shadow-[0_0_75px_30px_rgba(255,187,62,0.45)] sm:h-40 sm:w-40" />
        <div className="absolute left-[-6%] top-[9%] h-24 w-[30rem] rounded-full bg-white/60 blur-xl" />
        <div className="absolute right-[15%] top-[15%] h-16 w-[24rem] rounded-full bg-white/55 blur-lg" />
        <div className="absolute bottom-[27%] left-0 h-[17%] w-full bg-[linear-gradient(180deg,#b5d96c_0%,#78af3e_48%,#4f8e2d_100%)]" />
        <div className="absolute bottom-[21%] left-0 h-[8%] w-full bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.55)_0_3px,transparent_3px_135px),linear-gradient(180deg,#8bc34a,#5f9e36)]" />
        <div className="absolute bottom-[-10%] right-[-8%] h-[39%] w-[76%] origin-bottom-right -rotate-[10deg] rounded-tl-[55%] bg-[#4b4038]" />
        <div className="absolute bottom-[4%] right-[4%] h-[2px] w-[40%] -rotate-[10deg] bg-white/80" />
        <div className="absolute bottom-[13%] right-[21%] h-[2px] w-[23%] -rotate-[10deg] bg-white/80" />
        <div className="absolute bottom-[18%] left-0 h-8 w-full bg-[linear-gradient(90deg,#e7e7dc_0_18px,#7d746e_18px_36px)] bg-[length:72px_100%]" />
        <div className="absolute bottom-0 left-0 h-[22%] w-[34%] bg-[radial-gradient(circle_at_20%_10%,#6aa42f_0_9px,transparent_10px),radial-gradient(circle_at_70%_30%,#426f20_0_8px,transparent_9px),linear-gradient(135deg,#80b83e,#3d7024)] blur-[1px]" />
        <div className="absolute bottom-[26%] right-[7%] hidden rounded-t-2xl border-4 border-[#a58b6d] bg-[#d6c2a4] px-8 py-6 text-center font-serif text-lg leading-tight text-[#2f261e] shadow-xl md:block">
          <div className="mb-3 h-px w-28 bg-[#7b6147]" />
          YOUR<br />DREAM PLOT<br />AWAITS
          <div className="mt-3 h-px w-28 bg-[#7b6147]" />
        </div>
        <div className="absolute right-0 top-[23%] hidden h-[44%] w-48 bg-[radial-gradient(circle_at_65%_8%,#507a15_0_18px,transparent_19px),radial-gradient(circle_at_35%_26%,#67911d_0_20px,transparent_21px),radial-gradient(circle_at_84%_38%,#416d16_0_17px,transparent_18px),linear-gradient(90deg,transparent_0_70%,#5b3f20_70%_74%,transparent_74%)] lg:block" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[calc(720px-6rem)] max-w-7xl items-start px-5 py-10 pt-12 sm:min-h-[calc(760px-6rem)] sm:px-8 sm:pt-14 lg:min-h-[calc(100vh-6rem)]">
        <div className="w-full max-w-4xl">
          <p className="mb-6 max-w-[21rem] text-[0.58rem] font-semibold uppercase leading-5 tracking-[0.34em] text-slate-700/85 sm:max-w-none sm:text-sm sm:tracking-[0.48em]">
            Premium Plots | Prime Locations | Secure Investment
          </p>

          <h1 className="max-w-5xl font-serif text-[3.25rem] font-bold leading-[0.94] text-slate-900 sm:text-[4.25rem] lg:text-[4.55rem] xl:text-[4.8rem]">
            Aaj ka plot,
            <span className="block text-emerald-900">kal ki keemti virasat.</span>
          </h1>

          <p className="mt-6 max-w-[21rem] text-lg font-medium leading-relaxed text-slate-700 sm:max-w-2xl sm:text-2xl">
            Zameen sirf ek property nahi, ek aisa investment hai jo waqt ke saath aur bhi keemti hota hai.
          </p>

          <div className="mt-7 grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
            {trustPoints.map(({ icon: Icon, title, subtitle }, index) => (
              <div
                key={title}
                className={`flex items-center gap-3 lg:px-6 ${index === 0 ? 'lg:pl-0' : 'lg:border-l lg:border-slate-500/35'}`}
              >
                <Icon className="h-9 w-9 flex-none text-emerald-900" strokeWidth={1.9} />
                <div>
                  <p className="text-sm font-semibold text-slate-900 sm:text-base">{title}</p>
                  <p className="mt-1 text-xs font-medium text-slate-700 sm:text-sm">{subtitle}</p>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => navigate('/projects')}
            className="mt-8 inline-flex h-16 items-center gap-5 rounded-full bg-emerald-900 px-8 text-base font-semibold text-white shadow-[0_18px_40px_rgba(5,68,45,0.28)] transition duration-200 hover:-translate-y-0.5 hover:bg-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-900/25 sm:px-10 sm:text-lg"
          >
            <span>Explore Our Plots</span>
            <ArrowRight className="h-6 w-6" />
          </button>
        </div>
      </div>
    </section>
  );
}

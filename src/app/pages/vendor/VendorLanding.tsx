import React, { useState, useEffect } from 'react';
import { useNavigate } from '@/app/context/RouterContext';
import { 
  Building2, 
  FileText, 
  CheckCircle, 
  Users, 
  ShieldCheck, 
  ChevronRight, 
  Menu, 
  X,
  TrendingUp,
  Globe,
  Briefcase,
  Leaf,
  Lock,
  Clock,
  Handshake,
  ArrowRight,
  PhoneCall,
  Mail,
  HeadphonesIcon
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { useTranslation, useLanguage } from '@/app/context/LanguageContext';

// Custom Landing Page Colors
const COLORS = {
  gold: '#B59969',
  darkGreen: '#3D3935',
  beige: '#FAFAFA',
  textDark: '#3D3935',
  gray: '#E5E7EB'
};

// --- Subcomponents ---

function LandingHeader() {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t, language, setLanguage } = useLanguage();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100' : 'bg-transparent'}`}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer" onClick={() => navigate('/vendor/landing')}>
            <img src="/prime-logo.png" alt="Prime Organization Logo" className="h-12 object-contain" />
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {['About Prime Organization', 'Vendor Journey', 'Contact Us'].map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`} className="text-sm font-semibold text-[#3D3935] hover:text-[#B59969] transition-colors">
                {t(item)}
              </a>
            ))}
          </nav>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Button
              variant="ghost"
              className="text-[#3D3935] hover:text-[#B59969] font-semibold flex items-center gap-1.5 cursor-pointer"
              onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full border border-[#3D3935]/30 text-[10px] uppercase font-bold">{language === 'en' ? 'ar' : 'en'}</span>
              {language === 'en' ? 'العربية' : 'English'}
            </Button>
            <Button 
              variant="outline" 
              className="border-[#B59969] text-[#B59969] hover:bg-[#B59969] hover:text-[#3D3935] transition-colors rounded-xl font-semibold"
              onClick={() => navigate('/vendor/login')}
            >
              {t('Vendor Login')}
            </Button>
            <Button 
              className="bg-[#B59969] hover:bg-[#a3834a] text-[#3D3935] rounded-xl font-semibold shadow-md shadow-[#B59969]/20"
              onClick={() => navigate('/admin/login')}
            >
              {t('Admin Login')}
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-[#3D3935]">
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 px-6 py-4 space-y-4 shadow-xl text-start">
          {['About Prime Organization', 'Vendor Journey', 'Contact Us'].map((item) => (
            <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`} className="block text-base font-medium text-[#3D3935]">
              {t(item)}
            </a>
          ))}
          <div className="flex flex-col gap-3 pt-4 border-t border-gray-100">
            <Button
              variant="ghost"
              className="text-[#3D3935] hover:text-[#B59969] font-semibold flex items-center gap-1.5 justify-center"
              onClick={() => {
                setLanguage(language === 'en' ? 'ar' : 'en');
                setMobileMenuOpen(false);
              }}
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full border border-[#3D3935]/30 text-[10px] uppercase font-bold">{language === 'en' ? 'ar' : 'en'}</span>
              {language === 'en' ? 'العربية' : 'English'}
            </Button>
            <Button variant="outline" className="w-full border-[#B59969] text-[#B59969] rounded-xl" onClick={() => navigate('/vendor/login')}>{t('Vendor Login')}</Button>
            <Button className="w-full bg-[#B59969] text-[#3D3935] rounded-xl" onClick={() => navigate('/admin/login')}>{t('Admin Login')}</Button>
          </div>
        </div>
      )}
    </header>
  );
}

// --- Main Page Component ---

export default function VendorLanding() {
  const navigate = useNavigate();
  const { t, language } = useTranslation();

  const stats = [
    { label: t('Years of Service'), value: '15+', icon: Globe },
    { label: t('Registered Vendors'), value: '500+', icon: Users },
    { label: t('Active Opportunities'), value: '100+', icon: Briefcase },
    { label: t('Completed Projects'), value: '1000+', icon: CheckCircle },
  ];

  const features = [
    { title: t('Transparent Procurement'), desc: t('Clear guidelines, fair evaluations, and open communication throughout the bidding lifecycle.'), icon: ShieldCheck },
    { title: t('Secure Vendor Management'), desc: t('Enterprise-grade security for your corporate data, financial records, and sensitive proposals.'), icon: Lock },
    { title: t('Timely Opportunities'), desc: t('Real-time notifications for relevant tenders matching your business classification.'), icon: Clock },
    { title: t('Long-Term Partnerships'), desc: t('We value strategic relationships that drive sustainable economic growth for the Emirate.'), icon: Handshake },
  ];

  const partners = [
    { title: t('Government Backing'), desc: t('Secure contracts with a sovereign entity.'), icon: ShieldCheck },
    { title: t('Digital Tender Management'), desc: t('End-to-end online proposal submission and tracking.'), icon: Globe },
    { title: t('Fair Evaluation Process'), desc: t('Transparent scoring based on merit and capability.'), icon: TrendingUp },
    { title: t('Secure Handling'), desc: t('Encrypted document vaults for sensitive data.'), icon: Lock },
    { title: t('Sustainable Initiatives'), desc: t('Align your business with environmental goals.'), icon: Leaf },
    { title: t('Dedicated Support'), desc: t('Vendor relationship managers at your service.'), icon: HeadphonesIcon },
  ];

  return (
    <div className="min-h-screen font-sans bg-[#FAFAFA] text-[#3D3935] selection:bg-[#B59969] selection:text-[#3D3935]">
      <LandingHeader />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 bg-[#FAFAFA] overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[800px] h-[800px] bg-[#B59969]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[600px] h-[600px] bg-[#B59969]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#E5E7EB] shadow-sm mb-8 text-start">
                <ShieldCheck className="h-4 w-4 text-[#B59969]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#B59969]">{t('Official Prime Organization Procurement Platform')}</span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight text-[#3D3935] leading-[1.1] mb-6 text-start">
                {t('Supplier & Vendor')} <br/>
                <span className="text-[#B59969]">{t('Procurement Portal')}</span>
              </h1>
              <p className="text-lg leading-relaxed text-gray-600 mb-10 text-start">
                {t('Access procurement opportunities, submit proposals, manage vendor registrations, and build long-term partnerships with Fujairah Natural Resources Corporation.')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-start">
                <Button 
                  size="lg" 
                  className="bg-[#B59969] hover:bg-[#a3834a] text-[#3D3935] h-14 px-8 rounded-xl text-base font-bold shadow-lg shadow-[#B59969]/20 transition-transform hover:-translate-y-1"
                  onClick={() => navigate('/vendor/register')}
                >
                  {t('Register as Vendor')}
                  <ArrowRight className={`ml-2 h-5 w-5 ${language === 'ar' ? 'mr-2 ml-0 scale-x-[-1]' : ''}`} />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="bg-white border-[#E5E7EB] text-[#3D3935] h-14 px-8 rounded-xl text-base font-bold shadow-sm hover:border-[#B59969] hover:text-[#B59969] transition-all hover:-translate-y-1"
                  onClick={() => navigate('/vendor/login')}
                >
                  {t('Vendor Login')}
                </Button>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative lg:h-[600px] w-full rounded-[40px] overflow-hidden shadow-2xl shadow-[#B59969]/10 border-8 border-white">
              <img 
                src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000&auto=format&fit=crop" 
                alt="Fujairah Mountains and Mining" 
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#264A3E]/40 to-transparent mix-blend-multiply" />
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-12 bg-white border-y border-[#E5E7EB] relative z-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-[#E5E7EB] rtl:divide-x-reverse">
            {stats.map((stat, i) => (
              <div key={i} className="flex flex-col items-center text-center px-4 group">
                <div className="mb-3 p-3 bg-[#FAFAFA] rounded-full group-hover:scale-110 group-hover:bg-[#B59969]/10 transition-transform">
                  <stat.icon className="h-6 w-6 text-[#B59969]" />
                </div>
                <div className="text-3xl font-extrabold text-[#B59969] mb-1">{stat.value}</div>
                <div className="text-sm font-medium text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Prime Organization */}
      <section className="py-24 bg-[#FAFAFA]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="inline-block border-b-2 border-[#B59969] pb-3 text-3xl md:text-4xl font-extrabold text-[#3D3935] mb-4">{t('Why Choose Prime Organization')}</h2>
            <p className="text-lg text-gray-600">{t('Experience a world-class enterprise procurement process built on trust, efficiency, and sustainability.')}</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <Card key={i} className="bg-white border-0 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 p-8 rounded-3xl group text-start">
                <div className="w-14 h-14 rounded-2xl bg-[#FAFAFA] flex items-center justify-center mb-6 group-hover:bg-[#B59969] transition-colors">
                  <feature.icon className="h-7 w-7 text-[#B59969] group-hover:text-[#3D3935] transition-colors" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-bold text-[#3D3935] mb-3">{feature.title}</h3>
                <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Prime Organization Section */}
      <section id="about-prime" className="py-24 bg-white overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative rounded-[40px] overflow-hidden h-[500px] shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2000&auto=format&fit=crop" 
                alt="Prime Organization Building" 
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B59969]/10 text-[#B59969] text-xs font-bold uppercase tracking-wider mb-6">
                {t('About Prime Organization')}
              </div>
              <h2 className="inline-block border-b-2 border-[#B59969] pb-3 text-3xl md:text-4xl font-extrabold text-[#3D3935] mb-6 leading-tight text-start">
                {t('Committed to Sustainable Resource Development')}
              </h2>
              <div className="space-y-4 text-lg text-gray-600 mb-8 leading-relaxed text-start">
                <p>
                  {t('Fujairah Natural Resources Corporation (Prime Organization) is an independent government entity established to oversee natural resource management, mineral regulation, and geological research.')}
                </p>
                <p>
                  {t('We are dedicated to driving sustainable development and economic growth within the Emirate through strategic investment support and strict environmental compliance.')}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {[
                  t('Established 2008'), 
                  t('Regulatory Authority'), 
                  t('Environmental Compliance'), 
                  t('Strategic Investment Support')
                ].map((highlight, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-[#FAFAFA] border border-[#E5E7EB] text-start">
                    <CheckCircle className="h-5 w-5 text-[#B59969] shrink-0" />
                    <span className="font-semibold text-sm text-[#3D3935]">{highlight}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vendor Journey */}
      <section id="vendor-journey" className="py-24 bg-[#FAFAFA]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="inline-block border-b-2 border-[#B59969] pb-3 text-3xl md:text-4xl font-extrabold text-[#3D3935] mb-4">{t('The Vendor Journey')}</h2>
            <p className="text-lg text-gray-600">{t('A streamlined, fully digital process to become an approved supplier and win contracts.')}</p>
          </div>

          <div className="relative">
            {/* Connecting Line */}
            <div className="hidden lg:block absolute top-[48px] left-[10%] right-[10%] h-1 bg-[#E5E7EB] rounded-full">
              <div className={`absolute top-0 h-full w-1/3 bg-gradient-to-r from-[#B59969] to-transparent rounded-full opacity-50 ${language === 'ar' ? 'right-0 left-auto bg-gradient-to-l' : 'left-0'}`}></div>
            </div>

            <div className="grid gap-8 md:grid-cols-3 lg:grid-cols-6 relative z-10">
              {[
                { title: t('Register Account'), icon: Users },
                { title: t('Document Verification'), icon: FileText },
                { title: t('Vendor Approval'), icon: ShieldCheck },
                { title: t('Explore Opportunities'), icon: Globe },
                { title: t('Submit Proposal'), icon: Briefcase },
                { title: t('Award & Contract'), icon: Handshake },
              ].map((step, idx) => (
                <div key={idx} className="flex flex-col items-center group">
                  <div className="w-24 h-24 rounded-2xl bg-white shadow-lg shadow-gray-200 border border-[#E5E7EB] flex items-center justify-center mb-6 group-hover:-translate-y-2 transition-transform duration-300 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[#B59969] scale-y-0 origin-bottom group-hover:scale-y-100 transition-transform duration-300 ease-in-out"></div>
                    <step.icon className="h-10 w-10 text-[#B59969] group-hover:text-[#3D3935] relative z-10 transition-colors" strokeWidth={1.5} />
                    <div className={`absolute top-2 text-xs font-black text-gray-100 group-hover:text-[#3D3935]/20 z-0 ${language === 'ar' ? 'left-2' : 'right-2'}`}>0{idx + 1}</div>
                  </div>
                  <h3 className="text-[15px] font-bold text-center text-[#3D3935]">{step.title}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Partner With Prime Organization (Dark Premium Section) */}
      <section className="py-24 bg-[#F6EFE7] relative overflow-hidden border-y border-[#E5E7EB]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="inline-block border-b-2 border-[#B59969] pb-3 text-3xl md:text-5xl font-extrabold text-[#3D3935] mb-6">{t('Why Partner With Prime Organization')}</h2>
            <p className="text-lg text-gray-600">{t('Join a network of leading enterprises contributing to the sustainable development of Fujairah.')}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {partners.map((item, i) => (
              <div key={i} className="flex gap-4 p-6 rounded-2xl bg-white border border-[#E5E7EB] hover:shadow-md transition-colors text-start">
                <div className="shrink-0 mt-1">
                  <item.icon className="h-6 w-6 text-[#B59969]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#3D3935] mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section id="contact-us" className="py-24 bg-[#FAFAFA]">
        <div className="mx-auto max-w-5xl px-6 lg:px-8">
          <Card className="bg-white border-0 shadow-2xl rounded-[40px] overflow-hidden flex flex-col md:flex-row text-start">
            <div className="p-12 md:w-1/2 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B59969]/10 text-[#B59969] text-xs font-bold uppercase tracking-wider mb-6 w-max">
                {t('Support Center')}
              </div>
              <h2 className="inline-block border-b-2 border-[#B59969] pb-3 text-3xl font-extrabold text-[#3D3935] mb-4">{t("We're Here to Help")}</h2>
              <p className="text-gray-600 mb-8">{t('Our dedicated vendor support team is available to assist you with registration, compliance, and portal navigation.')}</p>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#FAFAFA] flex items-center justify-center shrink-0">
                    <Mail className="h-5 w-5 text-[#B59969]" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 font-medium">{t('Email Support')}</div>
                    <div className="font-bold text-[#3D3935]">vendors@prime.org</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#FAFAFA] flex items-center justify-center shrink-0">
                    <PhoneCall className="h-5 w-5 text-[#B59969]" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 font-medium">{t('Phone Support')}</div>
                    <div className="font-bold text-[#3D3935]">+971 9 205 0000</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#FAFAFA] flex items-center justify-center shrink-0">
                    <Clock className="h-5 w-5 text-[#B59969]" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 font-medium">{t('Working Hours')}</div>
                    <div className="font-bold text-[#3D3935]">{t('Mon - Fri, 07:30 - 15:30')}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="md:w-1/2 bg-[#B59969]/10 p-12 flex items-center justify-center">
              <img 
                src="https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=1000&auto=format&fit=crop" 
                alt="Support Team" 
                className="rounded-[32px] shadow-lg object-cover h-full w-full"
              />
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#FAFAFA] py-8 border-t border-[#E5E7EB]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
            <p>{t('© 2026 Fujairah Natural Resources Corporation. All rights reserved.')}</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-[#B59969] transition-colors">{t('Terms and Conditions')}</a>
              <a href="#" className="hover:text-[#B59969] transition-colors">{t('Privacy Policy')}</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
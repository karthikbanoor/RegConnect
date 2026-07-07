import { useState, useEffect, useCallback } from 'react';
import { T } from './constants';
import { seedConsultants, seedClients, seedInquiries } from './data';

// Layout
import { Sidebar, MobileNav } from './components/layout';

// Page components
import { Dashboard } from './components/dashboard';
import { ConsultantAdmin } from './components/consultants';
import { Inquiries } from './components/inquiries';
import { Proposals, GenerateProposalModal } from './components/proposals';
import { SOWs, GenerateSOWModal } from './components/sows';
import { ClientPortal } from './components/clients';

export default function App() {
  const [tab, setTab] = useState("dash");
  const [consultants, setConsultants] = useState(seedConsultants);
  const [clients] = useState(seedClients);
  const [inquiries, setInquiries] = useState(() => seedInquiries(seedConsultants(), seedClients()));
  const [proposals, setProposals] = useState([]);
  const [sows, setSows] = useState([]);
  const [proposalModal, setProposalModal] = useState(null);
  const [sowModal, setSowModal] = useState(null);
  const [loaded, setLoaded] = useState(false);

  // Persistence via localStorage
  useEffect(() => {
    try {
      const saved = {
        consultants: localStorage.getItem("regconnect:consultants"),
        inquiries: localStorage.getItem("regconnect:inquiries"),
        proposals: localStorage.getItem("regconnect:proposals"),
        sows: localStorage.getItem("regconnect:sows"),
      };
      if (saved.consultants) setConsultants(JSON.parse(saved.consultants));
      if (saved.inquiries) setInquiries(JSON.parse(saved.inquiries));
      if (saved.proposals) setProposals(JSON.parse(saved.proposals));
      if (saved.sows) setSows(JSON.parse(saved.sows));
    } catch (e) {
      /* first run, nothing stored yet */
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem("regconnect:consultants", JSON.stringify(consultants));
  }, [consultants, loaded]);

  useEffect(() => {
    if (loaded) localStorage.setItem("regconnect:inquiries", JSON.stringify(inquiries));
  }, [inquiries, loaded]);

  useEffect(() => {
    if (loaded) localStorage.setItem("regconnect:proposals", JSON.stringify(proposals));
  }, [proposals, loaded]);

  useEffect(() => {
    if (loaded) localStorage.setItem("regconnect:sows", JSON.stringify(sows));
  }, [sows, loaded]);

  const addInquiry = useCallback((inq) => setInquiries(prev => [inq, ...prev]), []);

  return (
    <div className="min-h-screen" style={{ background: T.bg, fontFamily: "'Inter', sans-serif" }}>
      <div className="flex">
        {/* Desktop sidebar */}
        <Sidebar
          activeTab={tab}
          onTabChange={setTab}
          consultantCount={consultants.length}
        />

        {/* Main content */}
        <main className="flex-1 p-4 md:p-8 max-w-6xl">
          {/* Mobile nav */}
          <MobileNav activeTab={tab} onTabChange={setTab} />

          {/* Pages */}
          {tab === "dash" && (
            <Dashboard consultants={consultants} inquiries={inquiries} proposals={proposals} sows={sows} />
          )}
          {tab === "consultants" && (
            <ConsultantAdmin consultants={consultants} setConsultants={setConsultants} />
          )}
          {tab === "inquiries" && (
            <Inquiries
              inquiries={inquiries}
              setInquiries={setInquiries}
              consultants={consultants}
              clients={clients}
              onCreateProposal={(inq) => setProposalModal(inq)}
            />
          )}
          {tab === "proposals" && (
            <Proposals
              proposals={proposals}
              setProposals={setProposals}
              consultants={consultants}
              clients={clients}
              onGenerateSOW={(p) => setSowModal(p)}
            />
          )}
          {tab === "sows" && (
            <SOWs sows={sows} setSows={setSows} consultants={consultants} clients={clients} proposals={proposals} />
          )}
          {tab === "client" && (
            <ClientPortal consultants={consultants} clients={clients} onSubmitInquiry={addInquiry} />
          )}
        </main>
      </div>

      {/* Global modals */}
      {proposalModal && (
        <GenerateProposalModal
          inquiry={proposalModal}
          consultants={consultants}
          clients={clients}
          seq={proposals.length + 1}
          onClose={() => setProposalModal(null)}
          onCreate={(p) => {
            setProposals(prev => [p, ...prev]);
            setInquiries(prev => prev.map(i =>
              i.id === proposalModal.id ? { ...i, stage: "Proposal Sent" } : i
            ));
            setProposalModal(null);
          }}
        />
      )}
      {sowModal && (
        <GenerateSOWModal
          proposal={sowModal}
          consultants={consultants}
          clients={clients}
          seq={sows.length + 1}
          onClose={() => setSowModal(null)}
          onCreate={(s) => {
            setSows(prev => [s, ...prev]);
            setSowModal(null);
          }}
        />
      )}
    </div>
  );
}

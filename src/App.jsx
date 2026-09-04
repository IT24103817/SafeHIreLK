import { useState } from 'react'
import Header from './components/Header.jsx'
import TabNav from './components/TabNav.jsx'
import Footer from './components/Footer.jsx'
import AdminModal from './components/AdminModal.jsx'
import Hero from './components/Hero.jsx'
import WhyThisMatters from './components/WhyThisMatters.jsx'
import VerifyPage from './pages/VerifyPage.jsx'
import ScanPage from './pages/ScanPage.jsx'
import CandidatePage from './pages/CandidatePage.jsx'
import ReportsPage from './pages/ReportsPage.jsx'
import LearnPage from './pages/LearnPage.jsx'

/*
  Which tabs each role sees. Reports and Learn are shared by both roles,
  so switching role keeps you on the tab you were already reading.
*/
const TABS_BY_ROLE = {
  seeker: [
    { id: 'verify', label: 'Verify' },
    { id: 'scan', label: 'Scan Advert' },
    { id: 'reports', label: 'Reports' },
    { id: 'learn', label: 'Learn' },
  ],
  agent: [
    { id: 'candidate', label: 'Check Candidate' },
    { id: 'reports', label: 'Reports' },
    { id: 'learn', label: 'Learn' },
  ],
}

export default function App() {
  const [role, setRole] = useState('seeker')
  const [activeTab, setActiveTab] = useState('verify')

  // Moderator mode. Kept here because the footer opens it and the reports
  // page uses it. It is deliberately not remembered between visits.
  const [isAdmin, setIsAdmin] = useState(false)
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false)

  const tabs = TABS_BY_ROLE[role]

  // The first tab of each role is that role's landing page.
  const isLandingTab = activeTab === 'verify' || activeTab === 'candidate'

  function handleRoleChange(nextRole) {
    setRole(nextRole)

    // If the tab we are on does not exist for the new role, fall back to its
    // first tab. Without this the page area would go blank on a role switch.
    const nextTabs = TABS_BY_ROLE[nextRole]
    const tabStillAvailable = nextTabs.some((tab) => tab.id === activeTab)
    if (!tabStillAvailable) {
      setActiveTab(nextTabs[0].id)
    }
  }

  function handleUnlock() {
    setIsAdmin(true)
    setIsAdminModalOpen(false)
    setActiveTab('reports')
  }

  function renderActivePage() {
    // onNavigate lets a page move the user to another tab, which the "Report
    // this agent" button on the not-found panel needs.
    if (activeTab === 'verify') return <VerifyPage onNavigate={setActiveTab} />
    if (activeTab === 'scan') return <ScanPage />
    if (activeTab === 'candidate')
      return <CandidatePage onNavigate={setActiveTab} />
    if (activeTab === 'reports')
      return <ReportsPage role={role} isAdmin={isAdmin} />
    if (activeTab === 'learn') return <LearnPage />
    return null
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="sticky top-0 z-40">
        <Header role={role} onRoleChange={handleRoleChange} />
        <TabNav tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6 sm:px-6 sm:py-10">
        {/*
          The hero and the problem section belong to whichever tab a role opens
          on. The hero sits above the search so the main action stays near the
          top of the screen, and the explanation sits below it, where it is
          still plainly on the landing page but not in the way of someone who
          came here to check a name quickly.
        */}
        {isLandingTab && <Hero role={role} onRoleChange={handleRoleChange} />}

        {renderActivePage()}

        {isLandingTab && <WhyThisMatters />}
      </main>

      <Footer
        isAdmin={isAdmin}
        onAdminClick={() => setIsAdminModalOpen(true)}
        onAdminSignOut={() => setIsAdmin(false)}
      />

      {isAdminModalOpen && (
        <AdminModal
          onUnlock={handleUnlock}
          onClose={() => setIsAdminModalOpen(false)}
        />
      )}
    </div>
  )
}

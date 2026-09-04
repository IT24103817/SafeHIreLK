import { useState } from 'react'
import Header from './components/Header.jsx'
import TabNav from './components/TabNav.jsx'
import Footer from './components/Footer.jsx'
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

  const tabs = TABS_BY_ROLE[role]

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

  function renderActivePage() {
    if (activeTab === 'verify') return <VerifyPage />
    if (activeTab === 'scan') return <ScanPage />
    if (activeTab === 'candidate') return <CandidatePage />
    if (activeTab === 'reports') return <ReportsPage role={role} />
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
        {renderActivePage()}
      </main>

      <Footer />
    </div>
  )
}

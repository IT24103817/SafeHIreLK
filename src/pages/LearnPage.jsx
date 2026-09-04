import PageHeading from '../components/PageHeading.jsx'
import SafeHiringChecklist from '../components/SafeHiringChecklist.jsx'
import ImpactSection from '../components/ImpactSection.jsx'
import RoadmapSection from '../components/RoadmapSection.jsx'

// Owner: D — safe-hiring checklist and the problem / impact content.
export default function LearnPage() {
  return (
    <div>
      <PageHeading
        title="Learn"
        intro="The checks that protect you before you pay anyone, what this tool changes, and where it goes next."
      />

      <SafeHiringChecklist />
      <ImpactSection />
      <RoadmapSection />
    </div>
  )
}

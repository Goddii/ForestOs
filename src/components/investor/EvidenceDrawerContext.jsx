import { createContext, useContext, useMemo, useState } from 'react'

// Cross-cutting, low-frequency: which item (an evidence record, or a
// landscape conservation zone) the drawer is currently showing. Lets a
// metric card, an evidence table row, a risk's "related evidence" link, and
// a map zone/point all open the same drawer without prop-drilling an
// open/close handler through every investor page.
const EvidenceDrawerContext = createContext(null)

export function EvidenceDrawerProvider({ children }) {
  const [openItem, setOpenItem] = useState(/** @type {{type: 'evidence' | 'zone', id: string} | null} */ (null))

  const value = useMemo(
    () => ({
      openItem,
      openEvidenceId: openItem?.type === 'evidence' ? openItem.id : null,
      openZoneId: openItem?.type === 'zone' ? openItem.id : null,
      openEvidence: (id) => setOpenItem(id ? { type: 'evidence', id } : null),
      openZone: (id) => setOpenItem(id ? { type: 'zone', id } : null),
      closeEvidence: () => setOpenItem(null),
    }),
    [openItem],
  )

  return <EvidenceDrawerContext.Provider value={value}>{children}</EvidenceDrawerContext.Provider>
}

export function useEvidenceDrawer() {
  const context = useContext(EvidenceDrawerContext)
  if (!context) {
    throw new Error('useEvidenceDrawer must be used within an EvidenceDrawerProvider')
  }
  return context
}

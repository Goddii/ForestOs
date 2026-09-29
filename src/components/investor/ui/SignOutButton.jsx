import { LogOut } from 'lucide-react'
import ActionButton from './ActionButton'

/** Where a signed-out visitor lands: the page that offers the demo dashboards. */
const SIGNED_OUT_PATH = '/demo'

/**
 * Sign out of a portal. There is no account behind these workspaces yet, so
 * this leaves the workspace for the demo picker; when real sign-in exists it
 * is the one place to end the session before navigating.
 */
export default function SignOutButton() {
  return (
    <ActionButton to={SIGNED_OUT_PATH} variant="ghost" icon={LogOut} iconPosition="left" title="Leave this workspace">
      Sign out
    </ActionButton>
  )
}

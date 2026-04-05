import Link from "next/link"
import LogoutButton from "./logoutButton"


const Sidebar = () => {
  return (
    <section>
        <Link className="" href="/dashboard">Dashboard</Link>
        <Link className="" href="/dashboard/2fa">2FA</Link>
        <Link className="" href="/dashboard/new/password">Új jelszó</Link>
        <Link className="" href="/dashboard/new/picture">Új Kép hozzáadása</Link>
        <Link className="" href="/dashboard/price">Árak</Link>
        <Link className="" href="/dashboard/new/blog">Új blog</Link>
        <Link className="" href="/dashboard/update/picture">Képek szerkesztése</Link>
        <Link className="" href="/dashboard/new/service">Új szolgáltatás írása</Link>
        <Link className="" href="/dashboard/new/place">Új hely hozzáadása</Link>
        <LogoutButton/>
    </section>
  )
}

export default Sidebar
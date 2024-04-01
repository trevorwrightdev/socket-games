import CoolLink from 'components/CoolLink'

const links = [
    { title: 'Secret Hitler', href: '/secrethitler' }
]

export default function Home() {
  return (
    <main className="flex flex-col items-center pt-24">
        <h1 className="text-3xl">trevdev.fun</h1>
        {links.map((link) => {
            return <CoolLink key={link.title} href={link.href}>{link.title}</CoolLink>
        })}
    </main>
  )
}

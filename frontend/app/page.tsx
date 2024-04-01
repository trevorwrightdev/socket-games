import CoolLink from 'components/CoolLink'

const links = [
    { title: 'Secret Hitler', href: '/secrethitler' },
]

export default function Home() {
  return (
    <main className="flex flex-col items-center pt-24">
        <h1 className="text-3xl mb-4">trevdev.fun</h1>
        <div>
            {links.map((link) => {
                return <CoolLink key={link.title} href={link.href}>{link.title}</CoolLink>
            })}
        </div>
    </main>
  )
}

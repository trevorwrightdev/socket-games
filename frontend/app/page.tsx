import CoolLink from 'components/CoolLink'
import Input from 'components/Input'

const links = [
    { title: 'Secret Hitler', href: '/secrethitler' },
]

export default function Home() {
  return (
    <main className='flex flex-col items-center pt-24'>
        <h1 className='text-3xl mb-4 font-bold'>trevdev.fun</h1>
        <div className='flex flex-col'>
            <h3 className='text-center mb-4 font-bold'>join a game</h3>
            <h3>CODE</h3>
            <Input className='mb-4'/>
            <h3>NAME</h3>
            <Input />
        </div>
        <h3 className='text-center mb-4 font-bold mt-8'>host a game</h3>
        <div>
            {links.map((link) => {
                return <CoolLink key={link.title} href={link.href} title={link.title} />
            })}
        </div>
    </main>
  )
}

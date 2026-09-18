import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { AccountFeaturePage } from '@/components/account/AccountFeaturePage';
import { requireCustomer } from '@/lib/customer-auth';
import { requirePrisma } from '@/lib/prisma';
import { statusTone, tradeInStatusLabels } from '@/lib/trade-ins';
export const metadata:Metadata={title:'My Trade-Ins',robots:{index:false,follow:false}};
export default async function TradeInsPage(){
 const customer=await requireCustomer('/account/trade-ins');const submissions=await requirePrisma().tradeInSubmission.findMany({where:{customerId:customer.id},include:{images:{take:1,orderBy:{sortOrder:'asc'}},offers:{where:{status:'PENDING'},orderBy:{createdAt:'desc'},take:1}},orderBy:{updatedAt:'desc'}});
 return <AccountFeaturePage eyebrow="Customer account" title="My trade-ins" intro="Resume drafts, review offers, and follow each camera from submission through inspection and payout.">
  <div className="flex flex-wrap gap-3"><Link href="/account/trade-ins/new" className="inline-flex min-h-12 items-center rounded-full bg-forest px-6 font-semibold text-white">Start a trade-in</Link><Link href="/sell-your-camera" className="inline-flex min-h-12 items-center rounded-full border border-ink/15 bg-white px-6 font-semibold text-ink">How it works</Link></div>
  {submissions.length?<div className="mt-7 grid gap-4">{submissions.map(item=><Link key={item.id} href={item.status==='DRAFT'?`/account/trade-ins/new?draft=${item.id}`:`/account/trade-ins/${item.id}`} className="grid gap-4 rounded-lg border border-ink/10 bg-white p-4 shadow-sm transition hover:border-moss/40 sm:grid-cols-[7rem_1fr_auto] sm:items-center">
    {item.images[0]?<Image src={`/api/trade-ins/images/${item.images[0].id}`} alt="" width={160} height={120} unoptimized className="aspect-[4/3] w-28 rounded-md bg-cream object-cover"/>:<div className="aspect-[4/3] w-28 rounded-md bg-sand"/>}
    <div><p className="font-serif text-2xl font-bold text-ink">{item.brand||'Untitled draft'} {item.modelUnknown?'Unknown model':item.model}</p><p className="mt-1 text-sm text-ink/60">{item.reference} · Updated {item.updatedAt.toLocaleDateString('en-US')}</p>{item.offers[0]?<p className="mt-2 text-sm font-bold text-forest">An offer is waiting for your response.</p>:null}</div>
    <span className={`justify-self-start rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[.1em] ${statusTone(item.status)}`}>{tradeInStatusLabels[item.status]}</span>
  </Link>)}</div>:<div className="mt-7 rounded-lg border border-ink/10 bg-white p-8 text-center"><p className="font-serif text-3xl font-bold text-ink">No trade-ins yet</p><p className="mt-3 text-sm text-ink/65">Start a private draft when you are ready to tell us about your gear.</p></div>}
 </AccountFeaturePage>
}
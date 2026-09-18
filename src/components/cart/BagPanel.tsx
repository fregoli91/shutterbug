'use client';
import Image from 'next/image';
import Link from 'next/link';
import { createContext,useCallback,useContext,useEffect,useRef,useState } from 'react';
import { formatCents } from '@/lib/money';
import { useValidatedCart } from './useValidatedCart';

type ContextValue={open:boolean;toggle:(trigger:HTMLButtonElement)=>void;close:()=>void};
const Context=createContext<ContextValue|null>(null);
export function BagPanelProvider({children}:{children:React.ReactNode}){
 const [open,setOpen]=useState(false);const triggerRef=useRef<HTMLButtonElement|null>(null);
 const close=useCallback(()=>{setOpen(false);requestAnimationFrame(()=>triggerRef.current?.focus());},[]);
 const toggle=useCallback((trigger:HTMLButtonElement)=>{triggerRef.current=trigger;setOpen(value=>!value);},[]);
 useEffect(()=>{if(!open)return;function keydown(event:KeyboardEvent){if(event.key==='Escape'){event.preventDefault();setOpen(false);requestAnimationFrame(()=>triggerRef.current?.focus());}}document.addEventListener('keydown',keydown);return()=>document.removeEventListener('keydown',keydown);},[open]);
 return <Context.Provider value={{open,toggle,close}}>{children}</Context.Provider>;
}
export function useBagPanel(){const value=useContext(Context);if(!value)throw new Error('useBagPanel must be used inside BagPanelProvider');return value;}

export function BagPanel({signedIn,customerLabel}:{signedIn:boolean;customerLabel:string}){
 const {open,close}=useBagPanel();const {items,hydrated,validation,loading,error}=useValidatedCart();const heading=useRef<HTMLHeadingElement>(null);
 useEffect(()=>{if(open)requestAnimationFrame(()=>heading.current?.focus());},[open]);
 const productItems=validation?.items??[];const blocking=Boolean(error||loading||!validation||validation.hasBlockingIssue);
 return <div className={`grid border-t border-ink/10 bg-[#faf4e8] transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none ${open?'grid-rows-[1fr] opacity-100':'pointer-events-none grid-rows-[0fr] opacity-0'}`} aria-hidden={!open}>
  <div className="overflow-hidden" inert={!open}><section id="header-bag-panel" aria-label="Bag and customer shortcuts" className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8 lg:py-9">
   <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-moss">Shutterbug bag</p><h2 ref={heading} tabIndex={-1} className="mt-2 font-serif text-3xl font-bold text-ink outline-none sm:text-4xl">{hydrated&&items.length?'Your camera finds':'Your bag is empty.'}</h2>{!items.length?<p className="mt-2 text-sm text-ink/65">{signedIn?'Saved finds and previous orders are available from your account shortcuts below.':'Sign in to see your saved finds and previous orders.'}</p>:null}</div><button type="button" onClick={close} aria-label="Close bag panel" className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/15 bg-white text-2xl text-ink hover:border-moss">×</button></div>
   {items.length?<div className="mt-6 grid gap-6 lg:grid-cols-[1fr_19rem]"><div className="grid gap-3">{productItems.slice(0,3).map(item=><article key={item.id} className="grid grid-cols-[5rem_1fr_auto] items-center gap-4 rounded-lg border border-ink/10 bg-white p-3"><Image src={item.image} alt="" width={80} height={80} unoptimized={item.image.startsWith('http')||item.image.endsWith('.svg')} className="aspect-square w-20 rounded-md bg-sand object-contain"/><div className="min-w-0"><p className="line-clamp-1 font-semibold text-ink">{item.title}</p><p className="mt-1 text-xs text-ink/60">{item.condition} · Qty {item.requestedQuantity}</p>{item.issue?<p className="mt-1 text-xs font-semibold text-[#9b3d2e]">{item.issue}</p>:null}</div><p className="font-bold text-ink">{formatCents(item.lineTotalCents)}</p></article>)}{loading&&!productItems.length?<p className="rounded-lg bg-white p-4 text-sm text-ink/60">Checking current inventory…</p>:null}{error?<p className="rounded-lg bg-sand p-4 text-sm font-semibold text-ink">{error}</p>:null}{items.length>3?<p className="text-sm text-ink/60">And {items.length-3} more item{items.length-3===1?'':'s'} in your bag.</p>:null}</div>
    <div className="rounded-lg border border-ink/10 bg-white p-5"><p className="text-xs font-bold uppercase tracking-[.16em] text-moss">Subtotal</p><p className="mt-2 font-serif text-3xl font-bold text-ink">{loading?'Checking…':formatCents(validation?.subtotalCents??0)}</p><div className="mt-5 grid gap-2"><Link href="/bag" onClick={close} className="inline-flex min-h-11 items-center justify-center rounded-full border border-forest px-5 font-semibold text-forest">View Bag</Link>{blocking?<span className="inline-flex min-h-11 items-center justify-center rounded-full bg-forest/50 px-5 font-semibold text-white">Checkout unavailable</span>:<Link href="/checkout" onClick={close} className="inline-flex min-h-11 items-center justify-center rounded-full bg-forest px-5 font-semibold text-white hover:bg-moss">Checkout</Link>}</div></div>
   </div>:null}
   <UtilityLinks signedIn={signedIn} customerLabel={customerLabel} close={close} compact={items.length>0}/>
  </section></div>
 </div>;
}
function UtilityLinks({signedIn,customerLabel,close,compact}:{signedIn:boolean;customerLabel:string;close:()=>void;compact:boolean}){
 return <div className={`${compact?'mt-6 border-t border-ink/10 pt-5':'mt-7'} grid gap-3 sm:grid-cols-2 lg:grid-cols-5`}>
  <Utility href={signedIn?'/account/orders':'/login?returnTo=%2Faccount%2Forders'} title="Orders" copy="Current and previous orders" close={close}/>
  <Utility href={signedIn?'/account/likes':'/login?returnTo=%2Faccount%2Flikes'} title="Saved Items" copy="Your saved cameras" close={close}/>
  <Utility href={signedIn?'/account':'/login?returnTo=%2Faccount'} title="Account" copy={signedIn?customerLabel:'Customer account access'} close={close}/>
  {signedIn?<form action="/account/logout" method="post" className="contents"><button className="min-h-20 rounded-lg border border-ink/10 bg-white p-4 text-left hover:border-moss"><strong className="block text-ink">Sign Out</strong><span className="mt-1 block text-xs text-ink/60">End this session</span></button></form>:<><Utility href="/login?returnTo=%2Faccount" title="Sign In" copy="Access your account" close={close}/><Utility href="/signup?redirect=%2Faccount" title="Create Account" copy="Save finds and orders" close={close}/></>}
  {signedIn?<Utility href="/account/trade-ins" title="Trade-Ins" copy="Drafts, offers, and status" close={close}/>:null}
 </div>;
}
function Utility({href,title,copy,close}:{href:string;title:string;copy:string;close:()=>void}){return <Link href={href} onClick={close} className="min-h-20 rounded-lg border border-ink/10 bg-white p-4 hover:border-moss"><strong className="block text-ink">{title}</strong><span className="mt-1 block text-xs text-ink/60">{copy}</span></Link>}
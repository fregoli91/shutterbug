'use server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { TradeInOfferKind, TradeInOfferStatus, TradeInStatus } from '@/generated/prisma/client';
import { requireAdmin } from '@/lib/admin-auth';
import { notifyTradeInUpdate } from '@/lib/trade-in-emails';
import { requirePrisma } from '@/lib/prisma';
const statuses=new Set(Object.values(TradeInStatus));
function money(value:FormDataEntryValue|null){const amount=Number(String(value||'').replace(/[$,]/g,''));return Number.isFinite(amount)&&amount>=0?Math.round(amount*100):-1;}
function clean(value:FormDataEntryValue|null,max:number){return String(value||'').trim().slice(0,max);}
export async function createTradeInOffer(formData:FormData){
 await requireAdmin();const id=clean(formData.get('tradeInId'),100);const cashCents=money(formData.get('cash'));const storeCreditCents=money(formData.get('storeCredit'));const note=clean(formData.get('note'),2000);
 if(cashCents<0||storeCreditCents<0)redirect(`/admin/trade-ins/${id}?error=invalid-offer`);
 const prisma=requirePrisma();const existing=await prisma.tradeInSubmission.findUnique({where:{id},include:{offers:true}});if(!existing)redirect('/admin/trade-ins');
 const kind=existing.offers.length?TradeInOfferKind.REVISED:TradeInOfferKind.INITIAL;const status=kind===TradeInOfferKind.REVISED?TradeInStatus.REVISED_OFFER_SENT:TradeInStatus.OFFER_SENT;
 const expiresRaw=clean(formData.get('expiresAt'),30);const expiresAt=expiresRaw?new Date(`${expiresRaw}T23:59:59.999Z`):null;
 await prisma.$transaction([
  prisma.tradeInOffer.updateMany({where:{tradeInId:id,status:TradeInOfferStatus.PENDING},data:{status:TradeInOfferStatus.SUPERSEDED}}),
  prisma.tradeInOffer.create({data:{tradeInId:id,kind,status:TradeInOfferStatus.PENDING,cashCents,storeCreditCents,note,expiresAt:Number.isFinite(expiresAt?.getTime())?expiresAt:null}}),
  prisma.tradeInSubmission.update({where:{id},data:{status,history:{create:{actor:'ADMIN',status,message:`${kind==='REVISED'?'Revised':'Preliminary'} offer sent.`}}}})
 ]);
 await notifyTradeInUpdate(id,kind===TradeInOfferKind.REVISED?'A revised offer is ready after inspection. Please review and respond in your account.':'Your preliminary cash and store-credit offers are ready to review.','offer-'+Date.now());
 revalidatePath(`/admin/trade-ins/${id}`);revalidatePath(`/account/trade-ins/${id}`);
}
export async function updateTradeInStatus(formData:FormData){
 await requireAdmin();const id=clean(formData.get('tradeInId'),100);const raw=clean(formData.get('status'),40) as TradeInStatus;if(!statuses.has(raw))redirect(`/admin/trade-ins/${id}?error=invalid-status`);
 const message=clean(formData.get('message'),500)||`Status changed to ${raw.replaceAll('_',' ').toLowerCase()}.`;const finalPayoutCents=money(formData.get('finalPayout'));const prisma=requirePrisma();
 await prisma.tradeInSubmission.update({where:{id},data:{status:raw,shippingInstructions:clean(formData.get('shippingInstructions'),2000),inboundCarrier:clean(formData.get('inboundCarrier'),80),inboundTracking:clean(formData.get('inboundTracking'),160),adminNotes:clean(formData.get('adminNotes'),3000),...(raw===TradeInStatus.COMPLETED?{completedAt:new Date(),...(finalPayoutCents>=0?{finalPayoutCents}:{})}:{}),history:{create:{actor:'ADMIN',status:raw,message}}}});
 await notifyTradeInUpdate(id,message,`status-${raw}-${Date.now()}`);revalidatePath(`/admin/trade-ins/${id}`);revalidatePath(`/account/trade-ins/${id}`);
}
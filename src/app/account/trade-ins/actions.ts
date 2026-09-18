'use server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { TradeInOfferStatus, TradeInPayoutMethod, TradeInStatus } from '@/generated/prisma/client';
import { requireCustomer } from '@/lib/customer-auth';
import { requirePrisma } from '@/lib/prisma';

export async function respondToTradeInOffer(formData: FormData) {
  const customer=await requireCustomer('/account/trade-ins');
  const tradeInId=String(formData.get('tradeInId')||'');
  const offerId=String(formData.get('offerId')||'');
  const response=String(formData.get('response')||'');
  const payout=String(formData.get('payout')||'');
  const prisma=requirePrisma();
  const offer=await prisma.tradeInOffer.findFirst({where:{id:offerId,tradeInId,tradeIn:{customerId:customer.id},status:TradeInOfferStatus.PENDING},include:{tradeIn:true}});
  if(!offer) redirect(`/account/trade-ins/${tradeInId}?error=offer-unavailable`);
  if(offer.expiresAt&&offer.expiresAt.getTime()<Date.now()){await prisma.tradeInOffer.update({where:{id:offer.id},data:{status:TradeInOfferStatus.EXPIRED}});redirect(`/account/trade-ins/${tradeInId}?error=offer-expired`);}
  if(response==='accept'){
    const payoutPreference=payout===TradeInPayoutMethod.STORE_CREDIT?TradeInPayoutMethod.STORE_CREDIT:TradeInPayoutMethod.CASH;
    await prisma.$transaction([
      prisma.tradeInOffer.update({where:{id:offer.id},data:{status:TradeInOfferStatus.ACCEPTED,respondedAt:new Date()}}),
      prisma.tradeInSubmission.update({where:{id:tradeInId},data:{status:TradeInStatus.OFFER_ACCEPTED,payoutPreference,history:{create:{actor:'CUSTOMER',status:TradeInStatus.OFFER_ACCEPTED,message:`Offer accepted with ${payoutPreference===TradeInPayoutMethod.CASH?'cash':'store credit'} selected.`}}}})
    ]);
  }else if(response==='decline'){
    await prisma.$transaction([
      prisma.tradeInOffer.update({where:{id:offer.id},data:{status:TradeInOfferStatus.DECLINED,respondedAt:new Date()}}),
      prisma.tradeInSubmission.update({where:{id:tradeInId},data:{status:TradeInStatus.OFFER_DECLINED,history:{create:{actor:'CUSTOMER',status:TradeInStatus.OFFER_DECLINED,message:'Offer declined by customer.'}}}})
    ]);
  }
  revalidatePath(`/account/trade-ins/${tradeInId}`);revalidatePath('/account/trade-ins');
}
export async function cancelTradeInDraft(formData:FormData){
  const customer=await requireCustomer('/account/trade-ins');const id=String(formData.get('tradeInId')||'');const prisma=requirePrisma();
  const result=await prisma.tradeInSubmission.updateMany({where:{id,customerId:customer.id,status:TradeInStatus.DRAFT},data:{status:TradeInStatus.CANCELLED}});
  if(result.count)await prisma.tradeInStatusEvent.create({data:{tradeInId:id,actor:'CUSTOMER',status:TradeInStatus.CANCELLED,message:'Draft cancelled by customer.'}});
  redirect('/account/trade-ins');
}